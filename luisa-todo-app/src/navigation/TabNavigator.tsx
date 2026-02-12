import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

import TasksScreen from '../screens/TasksScreen';
import ShoppingScreen from '../screens/ShoppingScreen';
import PackingScreen from '../screens/PackingScreen';
import StatsScreen from '../screens/StatsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

type TabIconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<string, { active: TabIconName; inactive: TabIconName }> = {
  Aufgaben: { active: 'checkbox', inactive: 'checkbox-outline' },
  Einkaufen: { active: 'cart', inactive: 'cart-outline' },
  Packen: { active: 'briefcase', inactive: 'briefcase-outline' },
  Statistik: { active: 'bar-chart', inactive: 'bar-chart-outline' },
  Ich: { active: 'person', inactive: 'person-outline' },
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.bgCard,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 88,
          paddingBottom: 30,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textDim,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name] || TAB_ICONS.Aufgaben;
          const iconName = focused ? icons.active : icons.inactive;
          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Aufgaben" component={TasksScreen} />
      <Tab.Screen name="Einkaufen" component={ShoppingScreen} />
      <Tab.Screen name="Packen" component={PackingScreen} />
      <Tab.Screen name="Statistik" component={StatsScreen} />
      <Tab.Screen name="Ich" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
