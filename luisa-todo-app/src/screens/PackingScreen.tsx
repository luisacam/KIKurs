import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../constants/theme';

interface PackItem {
  text: string;
  checked: boolean;
}

interface PackTemplate {
  id: string;
  icon: string;
  name: string;
  sections: Record<string, string[]>;
}

const PACK_TEMPLATES: PackTemplate[] = [
  {
    id: 'urlaub', icon: '🧳', name: 'Urlaub',
    sections: {
      'Kleidung': ['T-Shirts','Hosen','Unterwäsche','Socken','Pyjama','Jacke','Badekleidung','Schuhe'],
      'Hygiene': ['Zahnbürste','Zahnpasta','Shampoo','Deo','Sonnencreme','Medikamente'],
      'Dokumente': ['Reisepass/Ausweis','Versicherungskarte','Buchungsbestätigungen'],
      'Technik': ['Ladekabel','Powerbank','Kopfhörer'],
      'Für Letizia': ['Kuscheltier','Malbuch','Snacks','Wechselkleidung'],
    },
  },
  {
    id: 'ausflug', icon: '🏔️', name: 'Tagesausflug',
    sections: {
      'Essentials': ['Rucksack','Wasserflasche','Snacks','Sonnencreme','Sonnenbrille','Erste-Hilfe-Set','Taschentücher','Handy + Ladekabel'],
      'Je nach Wetter': ['Regenjacke','Mütze','Handschuhe','Sonnenhut'],
      'Für Letizia': ['Wechselkleidung','Snacks','Trinkflasche','Spielzeug'],
    },
  },
  {
    id: 'kindergarten', icon: '🎒', name: 'Kindergarten Letizia',
    sections: {
      'Jeden Tag': ['Rucksack','Jause/Brotdose','Trinkflasche','Wechselkleidung','Hausschuhe'],
      'Bei Bedarf': ['Regenkleidung','Sonnenhut','Gummistiefel','Kuscheltier'],
    },
  },
];

export default function PackingScreen() {
  const [selectedTemplate, setSelectedTemplate] = useState<PackTemplate | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCheckedItems({ ...checkedItems, [key]: !checkedItems[key] });
  };

  const resetAll = () => {
    setCheckedItems({});
  };

  const totalItems = selectedTemplate
    ? Object.values(selectedTemplate.sections).flat().length
    : 0;
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  if (!selectedTemplate) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.title}>🧳 Packlisten</Text>
        <Text style={styles.subtitle}>Wähle eine Vorlage</Text>

        {PACK_TEMPLATES.map(t => (
          <TouchableOpacity
            key={t.id}
            style={styles.templateCard}
            onPress={() => { setSelectedTemplate(t); setCheckedItems({}); }}
            activeOpacity={0.7}
          >
            <Text style={styles.templateIcon}>{t.icon}</Text>
            <View>
              <Text style={styles.templateName}>{t.name}</Text>
              <Text style={styles.templateInfo}>
                {Object.values(t.sections).flat().length} Artikel
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSelectedTemplate(null)}>
          <Text style={styles.backBtn}>← Zurück</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{selectedTemplate.icon} {selectedTemplate.name}</Text>
        <Text style={styles.progress}>{checkedCount}/{totalItems} eingepackt</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(checkedCount/totalItems)*100}%` }]} />
      </View>

      {checkedCount === totalItems && totalItems > 0 && (
        <View style={styles.doneCard}>
          <Text style={styles.doneText}>Alles eingepackt! 🎉</Text>
        </View>
      )}

      {Object.entries(selectedTemplate.sections).map(([section, items]) => (
        <View key={section} style={styles.section}>
          <Text style={styles.sectionTitle}>{section}</Text>
          {items.map((item, i) => {
            const key = `${section}-${item}`;
            const isChecked = checkedItems[key] || false;
            return (
              <TouchableOpacity
                key={i}
                style={[styles.packItem, isChecked && styles.packItemChecked]}
                onPress={() => toggleItem(key)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                  {isChecked && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={[styles.packText, isChecked && styles.packTextChecked]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      <TouchableOpacity style={styles.resetBtn} onPress={resetAll}>
        <Text style={styles.resetText}>↺ Alles zurücksetzen</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  content: { paddingTop: 60, paddingBottom: 100 },
  title: {
    fontSize: 28, fontWeight: '700', color: COLORS.accent,
    paddingHorizontal: SPACING.lg,
  },
  subtitle: {
    fontSize: 14, color: COLORS.textMuted,
    paddingHorizontal: SPACING.lg, marginTop: 4, marginBottom: SPACING.lg,
  },
  header: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
  backBtn: { fontSize: 16, color: COLORS.accent, marginBottom: 8 },
  progress: { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },
  progressBar: {
    height: 6, backgroundColor: COLORS.bgInput,
    borderRadius: 3, marginHorizontal: SPACING.lg, marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%', backgroundColor: COLORS.accent, borderRadius: 3,
  },
  doneCard: {
    backgroundColor: COLORS.accentGlow,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  doneText: { fontSize: 18, fontWeight: '600', color: COLORS.accent },
  templateCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.card,
  },
  templateIcon: { fontSize: 40 },
  templateName: { fontSize: 18, fontWeight: '600', color: COLORS.text },
  templateInfo: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  section: {
    marginHorizontal: SPACING.md, marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 14, fontWeight: '600', color: COLORS.textMuted,
    marginBottom: 6,
  },
  packItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginBottom: 4,
    minHeight: 48,
  },
  packItemChecked: { opacity: 0.5 },
  checkbox: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  checkmark: { color: COLORS.bg, fontSize: 13, fontWeight: '700' },
  packText: { fontSize: 15, color: COLORS.text },
  packTextChecked: { textDecorationLine: 'line-through', color: COLORS.textDim },
  resetBtn: {
    marginHorizontal: SPACING.md, marginTop: SPACING.md,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.bgInput,
    alignItems: 'center',
  },
  resetText: { fontSize: 14, color: COLORS.textMuted },
});
