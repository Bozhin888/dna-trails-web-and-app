import { Tabs } from 'expo-router';
import { Text, type ColorValue } from 'react-native';
import { colors } from '../../src/theme';

const icon = (glyph: string) => ({ color }: { color: ColorValue }) => <Text style={{ color, fontSize: 18 }}>{glyph}</Text>;
export default function TabsLayout() {
  return (<Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.green, tabBarInactiveTintColor: '#7D8A80', tabBarStyle: { backgroundColor: colors.white, borderTopColor: '#E3E8E4' }, tabBarLabelStyle: { fontWeight: '700' } }}>
    <Tabs.Screen name="trails" options={{ title: 'Trails', tabBarIcon: icon('⟿') }} />
    <Tabs.Screen name="map" options={{ title: 'Map', tabBarIcon: icon('◉') }} />
    <Tabs.Screen name="mytrail" options={{ title: 'My trail', tabBarIcon: icon('▤') }} />
    <Tabs.Screen name="passport" options={{ title: 'Passport', tabBarIcon: icon('✪') }} />
    <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: icon('☺') }} />
  </Tabs>);
}
