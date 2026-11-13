import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SessionProvider } from '../src/session';
import { colors } from '../src/theme';

export default function Root() {
  return (<SafeAreaProvider><SessionProvider>
    <StatusBar style="dark" />
    <Stack screenOptions={{ headerTintColor: colors.green, headerTitleStyle: { fontWeight: '800', color: colors.deep }, headerBackTitle: 'Back', contentStyle: { backgroundColor: colors.offwhite } }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ title: 'Your profile', presentation: 'modal' }} />
      <Stack.Screen name="checkout/[id]" options={{ title: 'Date and payment', presentation: 'modal' }} />
      <Stack.Screen name="road/[code]" options={{ headerShown: false }} />
      <Stack.Screen name="stamp" options={{ headerShown: false, presentation: 'transparentModal' }} />
      <Stack.Screen name="refund" options={{ title: 'Works or it’s free', presentation: 'modal' }} />
      <Stack.Screen name="trail/[id]" options={{ title: '' }} />
      <Stack.Screen name="hosts" options={{ title: 'Hosts' }} />
      <Stack.Screen name="how" options={{ title: 'How it works' }} />
      <Stack.Screen name="roots" options={{ title: 'Roots Trail' }} />
      <Stack.Screen name="compose" options={{ title: 'Trip-it-Yourself' }} />
    </Stack>
  </SessionProvider></SafeAreaProvider>);
}
