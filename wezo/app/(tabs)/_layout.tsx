import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { ComponentProps } from 'react';
import { colors } from '../../src/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

const icon = (name: IconName) =>
  function TabIcon({ color, size }: { color: string; size: number }) {
    return <Ionicons name={name} color={color} size={size} />;
  };

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Keypad', headerShown: false, tabBarIcon: icon('keypad') }} />
      <Tabs.Screen name="contacts" options={{ title: 'Contacts', tabBarIcon: icon('people') }} />
      <Tabs.Screen name="messages" options={{ title: 'Messages', tabBarIcon: icon('chatbubbles') }} />
      <Tabs.Screen name="recents" options={{ title: 'Recents', tabBarIcon: icon('time') }} />
      <Tabs.Screen name="account" options={{ title: 'Account', tabBarIcon: icon('wallet') }} />
    </Tabs>
  );
}
