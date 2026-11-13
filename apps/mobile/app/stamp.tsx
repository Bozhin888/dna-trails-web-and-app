// Stamped: arriving at a host. The stamp is the reward, and the proof for the guarantee.
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { HOSTS, dStamp, today } from '../src/trails';
import { Stamp, Textured } from '../src/ui';
import { colors } from '../src/theme';

export default function Stamped() {
  const { host, where } = useLocalSearchParams<{ host: string; where: string }>(); const h = HOSTS[host];
  return (<Textured kind="deep" style={{ flex: 1 }}><Pressable onPress={() => router.back()} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 22 }}>
    <View style={{ backgroundColor: '#F4EDD6', padding: 30, borderRadius: 18 }}>
      <Stamp tone="green" top={String(where).split(',')[0]} mid={h?.name ?? ''} bottom={dStamp(today())} size={190} rot={-8} />
    </View>
    <Text style={{ color: colors.white, fontSize: 24, fontWeight: '900' }}>Stamped. {h?.name} says welcome.</Text>
    <Text style={{ color: colors.mint }}>Tap anywhere to go on</Text>
  </Pressable></Textured>);
}
