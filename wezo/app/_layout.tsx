import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { WelcomeScreen } from '../src/screens/WelcomeScreen';
import { StoreProvider, useStore } from '../src/state/store';
import { colors } from '../src/theme';

function RootStack() {
  const { ready, signedIn } = useStore();
  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }
  if (!signedIn) return <WelcomeScreen />;
  return (
    <Stack screenOptions={{ headerTintColor: colors.primary }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="chat" options={{ title: '', headerBackTitle: 'Back' }} />
      <Stack.Screen name="rates" options={{ title: 'Calling rates' }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
      <Stack.Screen name="topup" options={{ title: 'Top up' }} />
      <Stack.Screen name="invite" options={{ title: 'Invite friends' }} />
      <Stack.Screen name="recaps" options={{ title: 'Monthly recaps' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      <Stack.Screen name="help" options={{ title: 'Help' }} />
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
