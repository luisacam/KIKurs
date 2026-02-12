import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { Category } from '../constants/categories';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

interface Props {
  categories: Record<string, Category>;
  selected: string;
  onSelect: (catId: string) => void;
  showAll?: boolean;
  onManage?: () => void;
}

export default function CategoryPills({ categories, selected, onSelect, showAll, onManage }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {showAll && (
        <TouchableOpacity
          style={[styles.pill, !selected && styles.pillSelected]}
          onPress={() => onSelect('')}
          activeOpacity={0.7}
        >
          <Text style={[styles.pillText, !selected && styles.pillTextSelected]}>Alle</Text>
        </TouchableOpacity>
      )}
      {Object.entries(categories).map(([key, cat]) => (
        <TouchableOpacity
          key={key}
          style={[styles.pill, selected === key && styles.pillSelected]}
          onPress={() => onSelect(key)}
          activeOpacity={0.7}
        >
          <View style={[styles.dot, { backgroundColor: cat.color }]} />
          <Text style={[styles.pillText, selected === key && styles.pillTextSelected]}>
            {cat.emoji} {cat.name}
          </Text>
        </TouchableOpacity>
      ))}
      {onManage && (
        <TouchableOpacity style={styles.addPill} onPress={onManage} activeOpacity={0.7}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.xs,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: RADIUS.pill,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bgInput,
  },
  pillSelected: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accentGlow,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  pillText: {
    fontSize: 14,
    color: COLORS.text,
  },
  pillTextSelected: {
    color: COLORS.accent,
    fontWeight: '600',
  },
  addPill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.pill,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  addText: {
    fontSize: 16,
    color: COLORS.textDim,
  },
});
