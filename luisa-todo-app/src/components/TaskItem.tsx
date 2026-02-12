import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '../utils/storage';
import { Category } from '../constants/categories';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../constants/theme';
import * as Haptics from 'expo-haptics';

interface Props {
  task: Task;
  category: Category | undefined;
  onToggleDone: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const day = d.getDate();
  const months = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
  return `${day}. ${months[d.getMonth()]}`;
}

export default function TaskItem({ task, category, onToggleDone, onEdit, onDelete }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const isOverdue = task.due && task.due < today && !task.done;
  const subtasksDone = task.subtasks?.filter(s => s.done).length || 0;
  const subtasksTotal = task.subtasks?.length || 0;

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onToggleDone(task.id);
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { borderLeftColor: category?.color || COLORS.textDim },
        task.done && styles.done,
      ]}
      onPress={() => onEdit(task.id)}
      onLongPress={() => onDelete(task.id)}
      activeOpacity={0.7}
    >
      <TouchableOpacity style={styles.checkboxWrap} onPress={handleToggle}>
        <View style={[styles.checkbox, task.done && styles.checkboxChecked]}>
          {task.done && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={[styles.title, task.done && styles.titleDone]} numberOfLines={2}>
          {task.title}
        </Text>

        <View style={styles.badges}>
          {category && (
            <View style={[styles.badge, { backgroundColor: category.color + '20' }]}>
              <Text style={[styles.badgeText, { color: category.color }]}>
                {category.emoji} {category.name}
              </Text>
            </View>
          )}

          <View style={[styles.badge, styles[`prio_${task.prio}` as keyof typeof styles] as any]}>
            <Text style={styles.badgeText}>
              {task.prio === 'high' ? '🔴' : task.prio === 'medium' ? '🟡' : '🟢'}
            </Text>
          </View>

          {task.due && (
            <View style={[styles.badge, isOverdue && styles.overdueBadge]}>
              <Text style={[styles.badgeText, isOverdue && styles.overdueText]}>
                {isOverdue ? '⚠️ ' : '📅 '}{formatDate(task.due)}
              </Text>
            </View>
          )}

          {subtasksTotal > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{subtasksDone}/{subtasksTotal} ✓</Text>
            </View>
          )}

          {task.quickTask && (
            <View style={[styles.badge, { backgroundColor: COLORS.accent + '20' }]}>
              <Text style={styles.badgeText}>⚡ 2min</Text>
            </View>
          )}
        </View>

        {task.desc ? (
          <Text style={styles.desc} numberOfLines={1}>{task.desc}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderLeftWidth: 4,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.card,
  },
  done: {
    opacity: 0.5,
  },
  checkboxWrap: {
    justifyContent: 'flex-start',
    paddingTop: 2,
    paddingRight: SPACING.sm,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  checkmark: {
    color: COLORS.bg,
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 6,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: COLORS.textDim,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: COLORS.bgInput,
  },
  badgeText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  overdueBadge: {
    backgroundColor: COLORS.danger + '20',
  },
  overdueText: {
    color: COLORS.danger,
  },
  desc: {
    fontSize: 13,
    color: COLORS.textDim,
    marginTop: 4,
  },
  prio_high: {},
  prio_medium: {},
  prio_low: {},
});
