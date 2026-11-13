// Passport: one stamp per host, one strand per trail. Lives in the profile.
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { useSession } from '../../src/session';
import { HOSTS, dStamp, stopsOf, trailById } from '../../src/trails';
import { Button, Card, Head, Screen, Stamp } from '../../src/ui';
import { slogans, type } from '../../src/theme';

export default function Passport() {
  const { user, passes } = useSession();
  const strands = passes.map(p => { const t = trailById(p.trail); if (!t) return null; const got = stopsOf(t).filter(s => p.got.includes(`${t.id}/${s.id}`)); return { p, t, got }; }).filter(Boolean) as { p: (typeof passes)[0]; t: NonNullable<ReturnType<typeof trailById>>; got: ReturnType<typeof stopsOf> }[];
  const n = strands.reduce((a, s) => a + s.got.filter(x => x.host).length, 0);
  return (<Screen>
    <Head eyebrow={slogans.passport} title="Passport" sub={user ? `${n} ${n === 1 ? 'stamp' : 'stamps'} collected. One per host you sat with.` : 'Sign in to collect stamps.'} />
    {!user ? <Button title="Create my profile" onPress={() => router.push('/signup')} /> : null}
    {user && !n ? <Text style={type.body}>No stamps yet. Your first one is waiting at the first host of your first trail.</Text> : null}
    {strands.filter(s => s.got.length).map(({ p, t, got }) => (<Card key={p.code}>
      <Text style={type.eyebrow}>{t.title}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
        {got.map(s => s.host ? <Stamp key={s.id} tone="green" top={s.where.split(',')[0]} mid={HOSTS[s.host].name} bottom={dStamp(p.date)} size={96} rot={(s.id.length % 13) - 6} />
          : <Stamp key={s.id} tone="ink" top="Visited" mid={s.where.split(',')[0]} size={72} rot={(s.id.length % 7) - 3} />)}
      </View>
    </Card>))}
    <Text style={type.small}>A paper passport is coming too: every host keeps a rubber stamp.</Text>
  </Screen>);
}
