import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, Modal, ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../constants/theme';
import { DEFAULT_CATEGORIES, Category } from '../constants/categories';
import { Task, loadState, saveState, genId, AppState } from '../utils/storage';
import { autoDetectCategory, DetectionResult, learnCategoryCorrection } from '../utils/categoryDetect';
import CategoryPills from '../components/CategoryPills';
import TaskItem from '../components/TaskItem';
import AutoCatHint from '../components/AutoCatHint';

export default function TasksScreen() {
  const [state, setState] = useState<AppState | null>(null);
  const [quickText, setQuickText] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterPrio, setFilterPrio] = useState('');
  const [showDone, setShowDone] = useState(false);
  const [autoHint, setAutoHint] = useState<DetectionResult | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCat, setFormCat] = useState('rossbacher');
  const [formPrio, setFormPrio] = useState<'high' | 'medium' | 'low'>('medium');
  const [formDue, setFormDue] = useState('');
  const inputRef = useRef<TextInput>(null);

  const categories = state?.customCategories && Object.keys(state.customCategories).length > 0
    ? state.customCategories
    : DEFAULT_CATEGORIES;

  useFocusEffect(
    useCallback(() => {
      loadState().then(s => setState(s));
    }, [])
  );

  const save = async (newState: AppState) => {
    setState(newState);
    await saveState(newState);
  };

  // Auto-detect category while typing
  const onQuickTextChange = (text: string) => {
    setQuickText(text);
    if (text.length < 3) {
      setAutoHint(null);
      return;
    }
    const result = autoDetectCategory(text, categories, state?.learnedKeywords || {});
    setAutoHint(result);
  };

  const quickAdd = async () => {
    if (!quickText.trim() || !state) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const cat = autoHint?.cat || Object.keys(categories)[0] || 'rossbacher';
    const task: Task = {
      id: genId(),
      title: quickText.trim(),
      desc: '',
      cat,
      prio: 'medium',
      due: '',
      done: false,
      doneDate: null,
      quickTask: false,
      subtasks: [],
      createdAt: Date.now(),
    };

    const newState = { ...state, tasks: [task, ...state.tasks] };
    await save(newState);
    setQuickText('');
    setAutoHint(null);
  };

  const toggleDone = async (id: string) => {
    if (!state) return;
    const tasks = state.tasks.map(t => {
      if (t.id === id) {
        const done = !t.done;
        return { ...t, done, doneDate: done ? new Date().toISOString() : null };
      }
      return t;
    });

    // Update streak & completion log
    const today = new Date().toISOString().split('T')[0];
    const completionLog = { ...state.completionLog };
    const task = tasks.find(t => t.id === id);
    if (task?.done) {
      completionLog[today] = (completionLog[today] || 0) + 1;
    }

    await save({ ...state, tasks, completionLog });
  };

  const deleteTask = (id: string) => {
    if (!state) return;
    Alert.alert('Löschen?', 'Diese Aufgabe wirklich löschen?', [
      { text: 'Abbrechen', style: 'cancel' },
      {
        text: 'Löschen', style: 'destructive',
        onPress: async () => {
          await save({ ...state, tasks: state.tasks.filter(t => t.id !== id) });
        },
      },
    ]);
  };

  const openForm = (taskId?: string) => {
    if (taskId && state) {
      const t = state.tasks.find(t => t.id === taskId);
      if (t) {
        setEditingTask(t);
        setFormTitle(t.title);
        setFormDesc(t.desc);
        setFormCat(t.cat);
        setFormPrio(t.prio);
        setFormDue(t.due);
      }
    } else {
      setEditingTask(null);
      setFormTitle('');
      setFormDesc('');
      setFormCat(autoHint?.cat || Object.keys(categories)[0] || 'rossbacher');
      setFormPrio('medium');
      setFormDue('');
    }
    setModalVisible(true);
  };

  const saveForm = async () => {
    if (!formTitle.trim() || !state) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    let newState: AppState;
    if (editingTask) {
      const oldCat = editingTask.cat;
      const tasks = state.tasks.map(t => {
        if (t.id === editingTask.id) {
          return { ...t, title: formTitle, desc: formDesc, cat: formCat, prio: formPrio, due: formDue };
        }
        return t;
      });
      // Learn from correction
      const learnedKeywords = learnCategoryCorrection(
        formTitle, formCat, oldCat, state.learnedKeywords
      );
      newState = { ...state, tasks, learnedKeywords };
    } else {
      const task: Task = {
        id: genId(),
        title: formTitle.trim(),
        desc: formDesc,
        cat: formCat,
        prio: formPrio,
        due: formDue,
        done: false,
        doneDate: null,
        quickTask: false,
        subtasks: [],
        createdAt: Date.now(),
      };
      newState = { ...state, tasks: [task, ...state.tasks] };
    }

    await save(newState);
    setModalVisible(false);
  };

  // Auto-detect in form title
  const onFormTitleChange = (text: string) => {
    setFormTitle(text);
    if (!editingTask && text.length >= 3) {
      const result = autoDetectCategory(text, categories, state?.learnedKeywords || {});
      if (result) setFormCat(result.cat);
    }
  };

  if (!state) return <View style={styles.screen}><Text style={styles.loading}>Laden...</Text></View>;

  const tasks = state.tasks.filter(t => {
    if (!showDone && t.done) return false;
    if (filterCat && t.cat !== filterCat) return false;
    if (filterPrio && t.prio !== filterPrio) return false;
    return true;
  });

  const openCount = state.tasks.filter(t => !t.done).length;
  const todayDone = state.tasks.filter(t => {
    if (!t.done || !t.doneDate) return false;
    return t.doneDate.startsWith(new Date().toISOString().split('T')[0]);
  }).length;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hallo Luisa ✨</Text>
          <Text style={styles.subtitle}>
            {openCount} offen · {todayDone} heute erledigt
          </Text>
        </View>
      </View>

      {/* Quick Add */}
      <View style={styles.quickAdd}>
        <TextInput
          ref={inputRef}
          style={styles.quickInput}
          placeholder="Neue Aufgabe eingeben..."
          placeholderTextColor={COLORS.textDim}
          value={quickText}
          onChangeText={onQuickTextChange}
          onSubmitEditing={quickAdd}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addBtn} onPress={quickAdd}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreBtn} onPress={() => openForm()}>
          <Text style={styles.moreBtnText}>⋯</Text>
        </TouchableOpacity>
      </View>

      <AutoCatHint
        category={autoHint ? categories[autoHint.cat] : null}
        confidence={autoHint?.confidence}
        visible={!!autoHint}
      />

      {/* Filter Pills */}
      <CategoryPills
        categories={categories}
        selected={filterCat}
        onSelect={setFilterCat}
        showAll
      />

      {/* Priority Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.prioFilter}>
        {[
          { key: '', label: 'Alle' },
          { key: 'high', label: '🔴 Hoch' },
          { key: 'medium', label: '🟡 Mittel' },
          { key: 'low', label: '🟢 Niedrig' },
        ].map(p => (
          <TouchableOpacity
            key={p.key}
            style={[styles.prioBtn, filterPrio === p.key && styles.prioBtnActive]}
            onPress={() => setFilterPrio(p.key)}
          >
            <Text style={[styles.prioBtnText, filterPrio === p.key && styles.prioBtnTextActive]}>
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.prioBtn, showDone && styles.prioBtnActive]}
          onPress={() => setShowDone(!showDone)}
        >
          <Text style={[styles.prioBtnText, showDone && styles.prioBtnTextActive]}>
            ✓ Erledigt
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Task List */}
      <FlatList
        data={tasks}
        keyExtractor={t => t.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            category={categories[item.cat]}
            onToggleDone={toggleDone}
            onEdit={openForm}
            onDelete={deleteTask}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🎉</Text>
            <Text style={styles.emptyText}>Alles erledigt!</Text>
            <Text style={styles.emptySubtext}>Oder füge eine neue Aufgabe hinzu</Text>
          </View>
        }
      />

      {/* Task Form Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingTask ? 'Bearbeiten' : 'Neue Aufgabe'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Titel</Text>
            <TextInput
              style={styles.input}
              value={formTitle}
              onChangeText={onFormTitleChange}
              placeholder="Was steht an?"
              placeholderTextColor={COLORS.textDim}
              autoFocus
            />

            <Text style={styles.label}>Beschreibung</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formDesc}
              onChangeText={setFormDesc}
              placeholder="Details..."
              placeholderTextColor={COLORS.textDim}
              multiline
            />

            <Text style={styles.label}>Kategorie</Text>
            <CategoryPills
              categories={categories}
              selected={formCat}
              onSelect={setFormCat}
            />

            <Text style={styles.label}>Priorität</Text>
            <View style={styles.prioRow}>
              {(['high', 'medium', 'low'] as const).map(p => (
                <TouchableOpacity
                  key={p}
                  style={[styles.prioOption, formPrio === p && styles.prioOptionActive]}
                  onPress={() => setFormPrio(p)}
                >
                  <Text style={styles.prioOptionText}>
                    {p === 'high' ? '🔴 Hoch' : p === 'medium' ? '🟡 Mittel' : '🟢 Niedrig'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={saveForm}>
              <Text style={styles.saveBtnText}>
                {editingTask ? '✓ Speichern' : '+ Hinzufügen'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  loading: {
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
    paddingBottom: SPACING.md,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.accent,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  quickAdd: {
    flexDirection: 'row',
    marginHorizontal: SPACING.md,
    gap: 8,
  },
  quickInput: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    color: COLORS.text,
    fontSize: 16,
  },
  addBtn: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: COLORS.bg,
    fontSize: 24,
    fontWeight: '700',
  },
  moreBtn: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.bgInput,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreBtnText: {
    color: COLORS.textMuted,
    fontSize: 20,
    fontWeight: '700',
  },
  prioFilter: {
    paddingHorizontal: SPACING.md,
    maxHeight: 44,
    marginBottom: SPACING.xs,
  },
  prioBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.bgInput,
    marginRight: 6,
  },
  prioBtnActive: {
    backgroundColor: COLORS.accentGlow,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  prioBtnText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  prioBtnTextActive: {
    color: COLORS.accent,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: SPACING.md,
    paddingBottom: 100,
  },
  empty: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textDim,
    marginTop: 4,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.bgCard,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    padding: SPACING.lg,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.accent,
  },
  modalClose: {
    fontSize: 22,
    color: COLORS.textDim,
    padding: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginTop: SPACING.md,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    color: COLORS.text,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  prioRow: {
    flexDirection: 'row',
    gap: 8,
  },
  prioOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.bgInput,
    alignItems: 'center',
  },
  prioOptionActive: {
    backgroundColor: COLORS.accentGlow,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  prioOptionText: {
    fontSize: 13,
    color: COLORS.text,
  },
  saveBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  saveBtnText: {
    color: COLORS.bg,
    fontSize: 17,
    fontWeight: '700',
  },
});
