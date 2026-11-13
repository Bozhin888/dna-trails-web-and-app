// Trip-it-Yourself: three questions. It can only pick stops we have driven.
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { TRAILS, HOSTS, stopsOf } from '../src/trails';
import { Button, Card, Head, Screen } from '../src/ui';
import { colors, radius, type } from '../src/theme';
const LIKES: [string, string][] = [['food', 'Village tables'], ['wine', 'Wine and rakija'], ['stones', 'Old stones'], ['water', 'Water and gorges'], ['heights', 'High places'], ['hands', 'Hands-on']];
export default function Compose() {
  const [likes, setLikes] = useState<string[]>(['food']); const [days, setDays] = useState(2);
  const pool = TRAILS.flatMap(t => stopsOf(t)).filter(s => (s.tags as string[] | undefined)?.some(x => likes.includes(x)));
  const pick = pool.slice(0, days * 4);
  return (<Screen>
    <Head eyebrow="Trip-it-Yourself" title="Composed for your dates" sub="It only uses stops we have driven and hosts we call. EUR 29 per car." />
    <Text style={type.h3}>What do you like?</Text>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{LIKES.map(([k, l]) => { const on = likes.includes(k); return (
      <Pressable key={k} onPress={() => setLikes(on ? likes.filter(x => x !== k) : [...likes, k])} style={{ paddingVertical: 8, paddingHorizontal: 12, borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.green, backgroundColor: on ? colors.green : 'transparent' }}>
        <Text style={{ fontWeight: '700', color: on ? colors.white : colors.green }}>{l}</Text></Pressable>); })}</View>
    <Text style={type.h3}>How many days?</Text>
    <View style={{ flexDirection: 'row', gap: 8 }}>{[1, 2, 3].map(n => <Button key={n} kind={n === days ? 'green' : 'outline'} title={`${n}`} onPress={() => setDays(n)} />)}</View>
    <Text style={type.h3}>Your draft: {pick.length} stops</Text>
    {pick.map(s => <Card key={`${s.trail}-${s.id}`}><Text style={type.h3}>{String(s.name ?? s.where)}</Text><Text style={type.small}>{s.where}{s.host ? ` · ${HOSTS[s.host].name}` : ''}</Text></Card>)}
    <Button big title="Ask us to finish it" onPress={() => router.push('/how')} />
    <Text style={type.small}>Buying a composed trail in the app comes in the next build; on the website it works today.</Text>
  </Screen>);
}
