import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, SectionList,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../constants/theme';
import { SHOP_CATEGORIES } from '../constants/categories';
import { ShopItem, loadState, saveState, genId, AppState } from '../utils/storage';
import { detectShopCategory } from '../utils/categoryDetect';

const STAMM_ARTICLES = ['Milch','Brot','Butter','Eier','Bananen','Äpfel','Nudeln','Reis','Joghurt','Käse','Tomaten','Gurke','Kartoffeln','Zwiebeln','Haferflocken','Olivenöl'];

export default function ShoppingScreen() {
  const [state, setState] = useState<AppState | null>(null);
  const [input, setInput] = useState('');
  const [showStamm, setShowStamm] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadState().then(s => setState(s));
    }, [])
  );

  const save = async (newState: AppState) => {
    setState(newState);
    await saveState(newState);
  };

  const addItem = async (name: string) => {
    if (!name.trim() || !state) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Parse quantity (e.g., "Milch 2x" or "3 Äpfel")
    let itemName = name.trim();
    let qty = '';
    const qtyMatch = itemName.match(/^(\d+[x]?\s+)/i) || itemName.match(/(\s+\d+[x]?)$/i);
    if (qtyMatch) {
      qty = qtyMatch[1].trim();
      itemName = itemName.replace(qtyMatch[0], '').trim();
    }

    const cat = detectShopCategory(itemName, SHOP_CATEGORIES);
    const item: ShopItem = {
      id: genId(),
      name: itemName,
      qty,
      cat,
      checked: false,
    };

    await save({ ...state, shopping: [...state.shopping, item] });
    setInput('');
  };

  const toggleItem = async (id: string) => {
    if (!state) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const shopping = state.shopping.map(s =>
      s.id === id ? { ...s, checked: !s.checked } : s
    );
    await save({ ...state, shopping });
  };

  const deleteItem = async (id: string) => {
    if (!state) return;
    await save({ ...state, shopping: state.shopping.filter(s => s.id !== id) });
  };

  const clearChecked = () => {
    if (!state) return;
    const checked = state.shopping.filter(s => s.checked);
    if (checked.length === 0) return;
    Alert.alert(`${checked.length} erledigte löschen?`, '', [
      { text: 'Abbrechen', style: 'cancel' },
      {
        text: 'Löschen', style: 'destructive',
        onPress: async () => {
          await save({ ...state, shopping: state.shopping.filter(s => !s.checked) });
        },
      },
    ]);
  };

  if (!state) return <View style={styles.screen}><Text style={styles.loading}>Laden...</Text></View>;

  // Group by category
  const unchecked = state.shopping.filter(s => !s.checked);
  const checked = state.shopping.filter(s => s.checked);
  const grouped: Record<string, ShopItem[]> = {};
  unchecked.forEach(s => {
    if (!grouped[s.cat]) grouped[s.cat] = [];
    grouped[s.cat].push(s);
  });

  const sections = Object.entries(grouped).map(([cat, items]) => ({
    title: SHOP_CATEGORIES[cat]?.label || '📦 Sonstiges',
    data: items,
  }));
  if (checked.length > 0) {
    sections.push({ title: `✓ Erledigt (${checked.length})`, data: checked });
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.title}>🛒 Einkaufsliste</Text>
        <Text style={styles.subtitle}>
          {unchecked.length} Artikel
        </Text>
      </View>

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Artikel hinzufügen..."
          placeholderTextColor={COLORS.textDim}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => addItem(input)}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addBtn} onPress={() => addItem(input)}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Quick actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => setShowStamm(!showStamm)}>
          <Text style={styles.actionText}>⭐ Stammware</Text>
        </TouchableOpacity>
        {checked.length > 0 && (
          <TouchableOpacity style={styles.actionBtn} onPress={clearChecked}>
            <Text style={[styles.actionText, { color: COLORS.danger }]}>🗑️ Erledigte löschen</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Stammware Grid */}
      {showStamm && (
        <View style={styles.stammGrid}>
          {STAMM_ARTICLES.map(name => {
            const alreadyInList = state.shopping.some(s => s.name.toLowerCase() === name.toLowerCase() && !s.checked);
            return (
              <TouchableOpacity
                key={name}
                style={[styles.stammItem, alreadyInList && styles.stammItemDisabled]}
                onPress={() => !alreadyInList && addItem(name)}
                disabled={alreadyInList}
              >
                <Text style={[styles.stammText, alreadyInList && styles.stammTextDisabled]}>
                  {name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Shopping List */}
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <View style={[styles.shopItem, item.checked && styles.shopItemChecked]}>
            <TouchableOpacity style={styles.checkWrap} onPress={() => toggleItem(item.id)}>
              <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
                {item.checked && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>
            <Text style={[styles.shopName, item.checked && styles.shopNameChecked]} numberOfLines={1}>
              {item.name}
            </Text>
            {item.qty ? <Text style={styles.shopQty}>{item.qty}</Text> : null}
            <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.deleteBtn}>
              <Text style={styles.deleteText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyText}>Einkaufsliste ist leer</Text>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  loading: { color: COLORS.textMuted, textAlign: 'center', marginTop: 100 },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
    paddingBottom: SPACING.sm,
  },
  title: { fontSize: 28, fontWeight: '700', color: COLORS.accent },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: 2 },
  inputRow: {
    flexDirection: 'row',
    marginHorizontal: SPACING.md,
    gap: 8,
    marginBottom: SPACING.sm,
  },
  input: {
    flex: 1, height: 50,
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    color: COLORS.text, fontSize: 16,
  },
  addBtn: {
    width: 50, height: 50,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  addBtnText: { color: COLORS.bg, fontSize: 24, fontWeight: '700' },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    gap: 8,
    marginBottom: SPACING.sm,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.bgInput,
  },
  actionText: { fontSize: 13, color: COLORS.textMuted },
  stammGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.md,
    gap: 6,
    marginBottom: SPACING.md,
  },
  stammItem: {
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.bgInput,
  },
  stammItemDisabled: { opacity: 0.3 },
  stammText: { fontSize: 13, color: COLORS.text },
  stammTextDisabled: { textDecorationLine: 'line-through' },
  sectionHeader: {
    fontSize: 13, fontWeight: '600',
    color: COLORS.textMuted,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
  },
  shopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginHorizontal: SPACING.md,
    marginBottom: 4,
    ...SHADOWS.card,
  },
  shopItemChecked: { opacity: 0.4 },
  checkWrap: { minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center' },
  checkbox: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  checkmark: { color: COLORS.bg, fontSize: 13, fontWeight: '700' },
  shopName: { flex: 1, fontSize: 15, color: COLORS.text },
  shopNameChecked: { textDecorationLine: 'line-through', color: COLORS.textDim },
  shopQty: { fontSize: 13, color: COLORS.textMuted, marginRight: 8 },
  deleteBtn: { padding: 8 },
  deleteText: { fontSize: 14, color: COLORS.textDim },
  list: { paddingBottom: 100 },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: '600', color: COLORS.text },
});
