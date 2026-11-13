// Welcome: first launch. One promise, two ways in.
import { Redirect, router } from 'expo-router';
import { ImageBackground, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSession } from '../src/session';
import { img } from '../src/images';
import { Button } from '../src/ui';
import { colors, slogans, type } from '../src/theme';

const PROMISE = ['We phone every host the evening before you go.', 'A confirmed stop that is closed means your trail is free.', 'Route, notes and stories work with no signal.'];

export default function Welcome() {
  const { ready, user } = useSession();
  if (ready && user) return <Redirect href="/(tabs)/trails" />;
  return (<ImageBackground source={img('hero-1')} style={{ flex: 1 }} resizeMode="cover">
    <View style={{ flex: 1, backgroundColor: 'rgba(19,43,24,.78)' }}>
      <SafeAreaView style={{ flex: 1, padding: 24, justifyContent: 'space-between' }}>
        <Text style={{ color: colors.white, fontSize: 30, fontWeight: '900', letterSpacing: 1 }}>DNA <Text style={{ color: colors.gold }}>TRAILS</Text></Text>
        <View style={{ gap: 14 }}>
          <Text style={[type.eyebrow, { color: colors.gold }]}>Self-guided rural trails in Macedonia</Text>
          <Text style={{ color: colors.white, fontSize: 36, fontWeight: '900', lineHeight: 40 }}>{slogans.main}</Text>
          {PROMISE.map(p => <Text key={p} style={{ color: colors.mint, fontSize: 16, lineHeight: 22 }}>•  {p}</Text>)}
        </View>
        <View style={{ gap: 12 }}>
          <Button big kind="gold" title="Create my profile" onPress={() => router.push('/signup')} />
          <Button kind="ghostDark" title="I have a code" onPress={() => router.push({ pathname: '/signup', params: { then: 'code' } })} />
          <Button kind="ghostDark" title="Look around first" onPress={() => router.replace('/(tabs)/trails')} />
        </View>
      </SafeAreaView>
    </View>
  </ImageBackground>);
}
