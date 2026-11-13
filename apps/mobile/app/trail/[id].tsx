// One trail: the route, the hosts, and one button.
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { img } from '../../src/images';
import { useSession } from '../../src/session';
import { HOSTS, priceOf, trailById, typeLabel, hostIds } from '../../src/trails';
import { Button, Card, Head, Hero, Pill, Screen } from '../../src/ui';
import { colors, type } from '../../src/theme';

export default function TrailPage() {
  const { id } = useLocalSearchParams<{ id: string }>(); const t = trailById(id);
  const { user } = useSession();
  if (!t) return <Screen><Head title="Trail not found" /></Screen>;
  const buy = () => router.push(user ? `/checkout/${t.id}` : { pathname: '/signup', params: { then: `checkout:${t.id}` } });
  return (<Screen>
    <Stack.Screen options={{ title: t.title }} />
    <Hero src={img(t.img)} h={220} />
    <Head eyebrow={typeLabel(t)} title={t.title} sub={String(t.pitch ?? t.sub)} />
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      <Pill text={`${t.km} km`} /><Pill text={`Starts ${String(t.start)}`} /><Pill tone="gold" text={`Driven ${String(t.driven)}`} />
    </View>
    <Card style={{ backgroundColor: '#FBF8EC' }}>
      <Text style={{ fontSize: 26, fontWeight: '900', color: colors.deep }}>EUR {priceOf(t)} <Text style={type.small}>once, for the whole car</Text></Text>
      <Text style={type.small}>Up to {t.cap} cars a day. Works or it's free. Change your date free until 18:00 the evening before.</Text>
      <Button big title="Get this pass" onPress={buy} />
    </Card>
    <Text style={type.h2}>The people expecting you</Text>
    {hostIds(t).map(h => (<Card key={h}><Text style={type.h3}>{HOSTS[h].name} · {HOSTS[h].role}</Text><Text style={type.small}>{HOSTS[h].where}</Text><Text style={type.body}>{HOSTS[h].line}</Text></Card>))}
    <Text style={type.h2}>The route</Text>
    {t.days.map((d, di) => (<View key={di} style={{ gap: 8 }}>
      <Text style={type.eyebrow}>Day {di + 1} · {d.t}</Text>
      {d.stops.map(s => (<Card key={s.id}>
        <Text style={type.h3}>{String(s.time ?? '')}  {String(s.name ?? s.where)}</Text>
        <Text style={type.small}>{s.where}{s.host ? ` · ${HOSTS[s.host].name}, called the evening before` : ' · no host, always open'}</Text>
        {s.what ? <Text style={type.body}>{String(s.what)}</Text> : null}
      </Card>))}
      {d.sleep ? <Text style={type.small}>Sleep: {d.sleep}</Text> : null}
    </View>))}
  </Screen>);
}
