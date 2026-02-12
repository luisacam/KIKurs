import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../constants/theme';
import { DEFAULT_CATEGORIES } from '../constants/categories';
import { loadState, AppState } from '../utils/storage';

export default function StatsScreen() {
  const [state, setState] = useState<AppState | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadState().then(s => setState(s));
    }, [])
  );

  if (!state) return <View style={styles.screen}><Text style={styles.loading}>Laden...</Text></View>;

  const categories = state.customCategories && Object.keys(state.customCategories).length > 0
    ? state.customCategories
    : DEFAULT_CATEGORIES;

  const totalTasks = state.tasks.length;
  const doneTasks = state.tasks.filter(t => t.done).length;
  const openTasks = totalTasks - doneTasks;
  const today = new Date().toISOString().split('T')[0];
  const todayDone = state.tasks.filter(t => t.done && t.doneDate?.startsWith(today)).length;
  const streak = state.streak?.current || 0;

  // Category breakdown
  const catCounts: Record<string, { open: number; done: number }> = {};
  Object.keys(categories).forEach(c => { catCounts[c] = { open: 0, done: 0 }; });
  state.tasks.forEach(t => {
    if (!catCounts[t.cat]) catCounts[t.cat] = { open: 0, done: 0 };
    if (t.done) catCounts[t.cat].done++;
    else catCounts[t.cat].open++;
  });

  // Priority breakdown
  const prioCounts = { high: 0, medium: 0, low: 0 };
  state.tasks.filter(t => !t.done).forEach(t => {
    prioCounts[t.prio]++;
  });

  // Week chart
  const days = ['Mo','Di','Mi','Do','Fr','Sa','So'];
  const now = new Date();
  const dayOfWeek = (now.getDay() + 6) % 7;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - dayOfWeek);
  const weekCounts: number[] = [];
  let maxDay = 1;
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    const ds = d.toISOString().split('T')[0];
    const c = state.completionLog[ds] || 0;
    weekCounts.push(c);
    if (c > maxDay) maxDay = c;
  }

  const maxCatCount = Math.max(1, ...Object.values(catCounts).map(c => c.open + c.done));

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>📊 Statistik</Text>

      {/* Overview Cards */}
      <View style={styles.cardsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{todayDone}</Text>
          <Text style={styles.statLabel}>Heute</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{openTasks}</Text>
          <Text style={styles.statLabel}>Offen</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{doneTasks}</Text>
          <Text style={styles.statLabel}>Erledigt</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{streak}</Text>
          <Text style={styles.statLabel}>🔥 Streak</Text>
        </View>
      </View>

      {/* Category Chart */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nach Kategorie</Text>
        {Object.entries(categories).map(([key, cat]) => {
          const counts = catCounts[key] || { open: 0, done: 0 };
          const total = counts.open + counts.done;
          const width = Math.round((total / maxCatCount) * 100);
          return (
            <View key={key} style={styles.barRow}>
              <Text style={styles.barLabel}>{cat.emoji}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${width}%`, backgroundColor: cat.color }]} />
              </View>
              <Text style={styles.barValue}>{counts.open} offen</Text>
            </View>
          );
        })}
      </View>

      {/* Week Chart */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Diese Woche</Text>
        <View style={styles.weekChart}>
          {weekCounts.map((count, i) => {
            const h = Math.max(4, Math.round((count / maxDay) * 100));
            return (
              <View key={i} style={styles.weekCol}>
                <Text style={styles.weekValue}>{count}</Text>
                <View style={[styles.weekBar, { height: h, backgroundColor: COLORS.accent }]} />
                <Text style={styles.weekDay}>{days[i]}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Priority Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Offene nach Priorität</Text>
        <View style={styles.prioRow}>
          <View style={[styles.prioCard, { borderLeftColor: COLORS.prioHigh }]}>
            <Text style={styles.prioNumber}>{prioCounts.high}</Text>
            <Text style={styles.prioLabel}>🔴 Hoch</Text>
          </View>
          <View style={[styles.prioCard, { borderLeftColor: COLORS.prioMedium }]}>
            <Text style={styles.prioNumber}>{prioCounts.medium}</Text>
            <Text style={styles.prioLabel}>🟡 Mittel</Text>
          </View>
          <View style={[styles.prioCard, { borderLeftColor: COLORS.prioLow }]}>
            <Text style={styles.prioNumber}>{prioCounts.low}</Text>
            <Text style={styles.prioLabel}>🟢 Niedrig</Text>
          </View>
        </View>
      </View>

      {/* Motivational insight */}
      {doneTasks > 0 && (
        <View style={styles.insightCard}>
          <Text style={styles.insightText}>
            Du hast schon {doneTasks} Aufgaben geschafft! 💪{'\n'}
            {doneTasks > 10 ? 'Absolute Maschine!' : 'Weiter so!'}
          </Text>
        </View>
      )}
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
  cardsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    gap: 8,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  statNumber: { fontSize: 28, fontWeight: '700', color: COLORS.text },
  statLabel: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  section: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  sectionTitle: {
    fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.md,
  },
  barRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8,
  },
  barLabel: { fontSize: 18, width: 30, textAlign: 'center' },
  barTrack: {
    flex: 1, height: 18, backgroundColor: COLORS.bgInput, borderRadius: 9, overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 9 },
  barValue: { fontSize: 12, color: COLORS.textMuted, width: 55, textAlign: 'right' },
  weekChart: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end',
    height: 140, paddingTop: 20,
  },
  weekCol: { alignItems: 'center', flex: 1 },
  weekValue: { fontSize: 12, color: COLORS.textMuted, marginBottom: 4 },
  weekBar: { width: 22, borderRadius: 6, minHeight: 4 },
  weekDay: { fontSize: 12, color: COLORS.textDim, marginTop: 4 },
  prioRow: { flexDirection: 'row', gap: 8 },
  prioCard: {
    flex: 1,
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.sm,
    borderLeftWidth: 3,
    padding: SPACING.sm,
    alignItems: 'center',
  },
  prioNumber: { fontSize: 24, fontWeight: '700', color: COLORS.text },
  prioLabel: { fontSize: 11, color: COLORS.textMuted },
  insightCard: {
    backgroundColor: COLORS.accentGlow,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.accent + '40',
  },
  insightText: { fontSize: 15, color: COLORS.accent, textAlign: 'center', lineHeight: 22 },
});
