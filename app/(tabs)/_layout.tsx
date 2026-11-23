import { Tabs, Redirect } from 'expo-router';
import React from 'react';
import { HapticTab } from '@/components/haptic-tab';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/AuthContext';
import { useUnseenCountQuery } from '@/src/data/shares';
import { useTheme } from '@/src/theme/ThemeProvider';

export default function TabLayout() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const unseenCount = useUnseenCountQuery({ enabled: !!user });
  const sharedBadge = (unseenCount.data ?? 0) > 0 ? unseenCount.data : undefined;

  if (!user) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textTertiary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen
        name="links"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => <MaterialIcons size={24} name="bookmarks" color={color} />,
        }}
      />
      <Tabs.Screen
        name="shared"
        options={{
          title: 'Shared',
          tabBarBadge: sharedBadge,
          tabBarIcon: ({ color }) => <MaterialIcons size={24} name="inbox" color={color} />,
        }}
      />
      <Tabs.Screen
        name="managed"
        options={{
          title: 'Managed',
          tabBarIcon: ({ color }) => <MaterialIcons size={24} name="folder-shared" color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <MaterialIcons size={24} name="search" color={color} />,
        }}
      />
      <Tabs.Screen
        name="add-link"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <MaterialIcons size={24} name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}
