import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
  TextInput, Modal, Switch,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../constants/theme';
import { DEFAULT_CATEGORIES, CAT_EMOJIS, CAT_COLORS, Category } from '../constants/categories';
import { loadState, saveState, AppState } from '../utils/storage';

export default function ProfileScreen() {
  const [state, setState] = useState<AppState | null>(null);
  const [catModalVisible, setCatModalVisible] = useState(false);
  const [editingCats, setEditingCats] = useState<Record<string, Category>>({});
  const [emojiPickerFor, setEmojiPickerFor] = useState<string | null>(null);
  const [colorPickerFor, setColorPickerFor] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadState().then(s => setState(s));
    }, [])
  );

  const save = async (newState: AppState) => {
    setState(newState);
    await saveState(newState);
  };

  const categories = state?.customCategories && Object.keys(state.customCategories).length > 0
    ? state.customCategories
    : DEFAULT_CATEGORIES;

  const openCatManager = () => {
    const cats: Record<string, Category> = {};
    Object.entries(categories).forEach(([key, cat]) => {
      cats[key] = { ...cat, name: cat.name || cat.label.replace(/^[^\s]+\s/, '') };
    });
    setEditingCats(cats);
    setCatModalVisible(true);
    setEmojiPickerFor(null);
    setColorPickerFor(null);
  };

  const addCategory = () => {
    const id = 'cat_' + Date.now();
    setEditingCats({
      ...editingCats,
      [id]: {
        label: '📌 Neu',
        emoji: '📌',
        color: CAT_COLORS[Object.keys(editingCats).length % CAT_COLORS.length],
        name: 'Neu',
      },
    });
  };

  const deleteCategory = (key: string) => {
    if (Object.keys(editingCats).length <= 1) return;
    const updated = { ...editingCats };
    delete updated[key];
    setEditingCats(updated);
  };

  const saveCats = async () => {
    if (!state) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const finalCats: Record<string, Category> = {};
    Object.entries(editingCats).forEach(([key, cat]) => {
      const name = (cat.name || 'Neu').trim();
      finalCats[key] = {
        label: `${cat.emoji} ${name}`,
        emoji: cat.emoji,
        color: cat.color,
        name,
      };
    });
    await save({ ...state, customCategories: finalCats });
    setCatModalVisible(false);
  };

  const clearLearnedKeywords = () => {
    if (!state) return;
    Alert.alert('Gelerntes vergessen?', 'Alle gelernten Kategorie-Zuordnungen löschen?', [
      { text: 'Abbrechen', style: 'cancel' },
      {
        text: 'Löschen',
        style: 'destructive',
        onPress: async () => { await save({ ...state, learnedKeywords: {} }); },
      },
    ]);
  };

  const exportData = () => {
    if (!state) return;
    Alert.alert('Export', `Deine Daten:\n${state.tasks.length} Aufgaben\n${state.shopping.length} Einkaufsartikel\n${Object.keys(state.learnedKeywords || {}).length} gelernte Wörter\n\n(Export-Funktion kommt bald!)`, [{ text: 'OK' }]);
  };

  if (!state) return <View style={styles.screen}><Text style={styles.loading}>Laden...</Text></View>;

  const learnedCount = Object.keys(state.learnedKeywords || {}).length;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>🧘 Ich</Text>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>L</Text>
        </View>
        <Text style={styles.profileName}>Luisa</Text>
        <Text style={styles.profileSub}>
          {state.tasks.filter(t => t.done).length} Aufgaben geschafft
        </Text>
      </View>

      {/* Category Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kategorien</Text>
        <View style={styles.catList}>
          {Object.entries(categories).map(([key, cat]) => (
            <View key={key} style={styles.catRow}>
              <View style={[styles.catDot, { backgroundColor: cat.color }]} />
              <Text style={styles.catName}>{cat.emoji} {cat.name}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.btn} onPress={openCatManager}>
          <Text style={styles.btnText}>⚙️ Kategorien verwalten</Text>
        </TouchableOpacity>
      </View>

      {/* Smart Learning */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Intelligenz</Text>
        <Text style={styles.infoText}>
          Die App hat {learnedCount} Wörter von dir gelernt.
        </Text>
        {learnedCount > 0 && (
          <View style={styles.learnedWords}>
            {Object.entries(state.learnedKeywords || {}).slice(0, 10).map(([word, cat]) => (
              <View key={word} style={styles.learnedChip}>
                <Text style={styles.learnedText}>
                  {categories[cat]?.emoji || '📌'} {word}
                </Text>
              </View>
            ))}
            {learnedCount > 10 && (
              <Text style={styles.moreText}>+{learnedCount - 10} weitere</Text>
            )}
          </View>
        )}
        {learnedCount > 0 && (
          <TouchableOpacity style={styles.dangerBtn} onPress={clearLearnedKeywords}>
            <Text style={styles.dangerBtnText}>Gelerntes vergessen</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Data */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daten</Text>
        <TouchableOpacity style={styles.btn} onPress={exportData}>
          <Text style={styles.btnText}>📤 Daten exportieren</Text>
        </TouchableOpacity>
      </View>

      {/* Category Manager Modal */}
      <Modal visible={catModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Kategorien verwalten</Text>
              <TouchableOpacity onPress={() => setCatModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.catEditorList}>
              {Object.entries(editingCats).map(([key, cat]) => (
                <View key={key}>
                  <View style={styles.catEditRow}>
                    <TouchableOpacity
                      style={styles.emojiBtn}
                      onPress={() => setEmojiPickerFor(emojiPickerFor === key ? null : key)}
                    >
                      <Text style={styles.emojiBtnText}>{cat.emoji}</Text>
                    </TouchableOpacity>
                    <TextInput
                      style={styles.catInput}
                      value={cat.name}
                      onChangeText={(text) => {
                        setEditingCats({ ...editingCats, [key]: { ...cat, name: text } });
                      }}
                      placeholder="Name"
                      placeholderTextColor={COLORS.textDim}
                    />
                    <TouchableOpacity
                      style={[styles.colorBtn, { backgroundColor: cat.color }]}
                      onPress={() => setColorPickerFor(colorPickerFor === key ? null : key)}
                    />
                    {Object.keys(editingCats).length > 1 && (
                      <TouchableOpacity style={styles.delBtn} onPress={() => deleteCategory(key)}>
                        <Text style={styles.delBtnText}>✕</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Emoji Picker */}
                  {emojiPickerFor === key && (
                    <View style={styles.pickerGrid}>
                      {CAT_EMOJIS.map(e => (
                        <TouchableOpacity
                          key={e}
                          style={styles.pickerItem}
                          onPress={() => {
                            setEditingCats({ ...editingCats, [key]: { ...cat, emoji: e } });
                            setEmojiPickerFor(null);
                          }}
                        >
                          <Text style={styles.pickerEmoji}>{e}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {/* Color Picker */}
                  {colorPickerFor === key && (
                    <View style={styles.colorGrid}>
                      {CAT_COLORS.map(c => (
                        <TouchableOpacity
                          key={c}
                          style={[
                            styles.colorSwatch,
                            { backgroundColor: c },
                            cat.color === c && styles.colorSwatchSelected,
                          ]}
                          onPress={() => {
                            setEditingCats({ ...editingCats, [key]: { ...cat, color: c } });
                            setColorPickerFor(null);
                          }}
                        />
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.addCatBtn} onPress={addCategory}>
              <Text style={styles.addCatText}>+ Neue Kategorie</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={saveCats}>
              <Text style={styles.saveBtnText}>✓ Speichern</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  loading: { color: COLORS.textMuted, textAlign: 'center', marginTop: 100 },
  content: { paddingTop: 60, paddingBottom: 100 },
  title: {
    fontSize: 28, fontWeight: '700', color: COLORS.accent,
    paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    marginHorizontal: SPACING.md,
    padding: SPACING.xl,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.accent,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: { fontSize: 36, fontWeight: '700', color: COLORS.bg },
  profileName: { fontSize: 24, fontWeight: '700', color: COLORS.text },
  profileSub: { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },
  section: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.sm },
  catList: { marginBottom: SPACING.sm },
  catRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 6,
  },
  catDot: { width: 12, height: 12, borderRadius: 6 },
  catName: { fontSize: 15, color: COLORS.text },
  btn: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    alignItems: 'center',
  },
  btnText: { fontSize: 14, color: COLORS.textMuted },
  dangerBtn: {
    backgroundColor: COLORS.danger + '15',
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  dangerBtnText: { fontSize: 14, color: COLORS.danger },
  infoText: { fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.sm },
  learnedWords: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: SPACING.sm,
  },
  learnedChip: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.bgInput,
  },
  learnedText: { fontSize: 12, color: COLORS.text },
  moreText: { fontSize: 12, color: COLORS.textDim, alignSelf: 'center' },
  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.bgCard,
    borderTopLeftRadius: RADIUS.lg, borderTopRightRadius: RADIUS.lg,
    padding: SPACING.lg,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: { fontSize: 22, fontWeight: '700', color: COLORS.accent },
  modalClose: { fontSize: 22, color: COLORS.textDim, padding: 8 },
  catEditorList: { maxHeight: 400 },
  catEditRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginBottom: 8,
  },
  emojiBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: COLORS.bgCard,
    borderWidth: 2, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  emojiBtnText: { fontSize: 20 },
  catInput: {
    flex: 1, fontSize: 16, color: COLORS.text,
    paddingVertical: 6,
  },
  colorBtn: {
    width: 30, height: 30, borderRadius: 15,
    borderWidth: 2, borderColor: COLORS.border,
  },
  delBtn: { padding: 6 },
  delBtnText: { fontSize: 16, color: COLORS.textDim },
  pickerGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 4,
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.sm,
    padding: 8, marginBottom: 8,
  },
  pickerItem: {
    width: 38, height: 38,
    alignItems: 'center', justifyContent: 'center',
    borderRadius: 6,
  },
  pickerEmoji: { fontSize: 22 },
  colorGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 6,
    padding: 8, marginBottom: 8,
  },
  colorSwatch: {
    width: 34, height: 34, borderRadius: 17,
    borderWidth: 3, borderColor: 'transparent',
  },
  colorSwatchSelected: { borderColor: COLORS.text },
  addCatBtn: {
    borderWidth: 2, borderColor: COLORS.border, borderStyle: 'dashed',
    borderRadius: RADIUS.sm, padding: SPACING.sm,
    alignItems: 'center', marginBottom: SPACING.sm,
  },
  addCatText: { fontSize: 14, color: COLORS.textDim },
  saveBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveBtnText: { color: COLORS.bg, fontSize: 17, fontWeight: '700' },
});
