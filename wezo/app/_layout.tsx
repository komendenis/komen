import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { StoreProvider, useStore } from '../src/state/store';
import { colors } from '../src/theme';

function RootStack() {
  const { ready } = useStore();
  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }
  return (
    <Stack screenOptions={{ headerTintColor: colors.primary }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="countries" options={{ presentation: 'modal', title: 'Choose country' }} />
      <Stack.Screen name="call" options={{ presentation: 'fullScreenModal', headerShown: false, gestureEnabled: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <StoreProvider>
      <StatusBar style="dark" />
      <RootStack />
    </StoreProvider>
  );
}
