import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Category } from '../constants/categories';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

interface Props {
  category: Category | null;
  confidence?: string;
  visible: boolean;
}

export default function AutoCatHint({ category, confidence, visible }: Props) {
  if (!visible || !category) return null;

  return (
    <View style={styles.container}>
      <View style={[styles.dot, { backgroundColor: category.color }]} />
      <Text style={styles.text}>
        {category.emoji} {category.name}
        {confidence === 'learned' ? ' (gelernt)' : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: COLORS.accentGlow,
    borderRadius: RADIUS.pill,
    alignSelf: 'flex-start',
    marginTop: 6,
    marginLeft: SPACING.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  text: {
    fontSize: 13,
    color: COLORS.accent,
    fontWeight: '500',
  },
});
