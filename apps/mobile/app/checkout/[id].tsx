// Date and payment: a sheet over the trail. The profile already holds the rest.
// The card form itself belongs to the payment provider (not chosen yet); card numbers never reach DNA Trails.
import { useEffect, useMemo, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { api, useSession } from '../../src/session';
import { CARS, addDays, dShort, priceOf, today, trailById, parse, type Trail } from '../../src/trails';
import { Button, Card, Head, Screen } from '../../src/ui';
import { colors, radius, type } from '../../src/theme';
import type { CarClass } from '@dna/api-client';

const nextDates = (t: Trail) => { const out: string[] = []; let d = addDays(today(), 2); while (out.length < 14) { const wd = parse(d).getDay(); if (t.days.length === 1 || wd === 5 || wd === 6) out.push(d); d = addDays(d, 1); } return out; };
const Chip = ({ on, label, sub, onPress }: { on: boolean; label: string; sub?: string; onPress: () => void }) => (
  <Pressable onPress={onPress} style={{ borderWidth: 2, borderColor: on ? colors.green : '#D5DDD7', backgroundColor: on ? colors.mint : colors.white, borderRadius: radius.md, paddingVertical: 10, paddingHorizontal: 12, minWidth: 92 }}>
    <Text style={{ fontWeight: '800', color: colors.deep }}>{label}</Text>{sub ? <Text style={type.small}>{sub}</Text> : null}</Pressable>);

export default function Checkout() {
  const { id } = useLocalSearchParams<{ id: string }>(); const t = trailById(id)!;
  const { user, upsertPass, setUser } = useSession();
  const dates = useMemo(() => nextDates(t), [t]);
  const [date, setDate] = useState(dates[0]); const [car, setCar] = useState<CarClass>(user?.car || 'regular'); const [people, setPeople] = useState(user?.people || 2);
  const [method, setMethod] = useState(user?.card ? 'saved' : 'card'); const [left, setLeft] = useState<number | null>(null);
  const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  useEffect(() => { setLeft(null); api.availability(t.id, date).then(d => setLeft(d.left)).catch(() => setLeft(null)); }, [t.id, date]);
  if (!user) return <Screen><Head title="Sign in first" /><Button title="Create my profile" onPress={() => router.replace('/signup')} /></Screen>;
  const pay = async () => {
    setBusy(true); setErr('');
    try {
      const d = await api.checkout({ trail: t.id, date, car, people, method, keepCard: method === 'card' });
      if (d.redirect) { await Linking.openURL(d.redirect); return; }
      upsertPass(d.pass); if (d.user) setUser(d.user);
      router.dismissAll(); router.replace('/(tabs)/mytrail');
    } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  };
  return (<Screen>
    <Head eyebrow="Almost yours" title={t.title} />
    <Text style={type.h3}>Date</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
      {dates.map(d => <Chip key={d} on={d === date} label={dShort(d)} onPress={() => setDate(d)} />)}
    </ScrollView>
    <Text style={[type.small, left === 0 && { color: colors.rust }]}>{left == null ? 'Checking cars left…' : left === 0 ? 'Full that day. Pick another date.' : `${left} of ${t.cap} cars left that day.`}</Text>
    <Text style={type.h3}>Car</Text>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{(Object.keys(CARS) as CarClass[]).map(k => <Chip key={k} on={k === car} label={CARS[k].label} sub={CARS[k].hint} onPress={() => setCar(k)} />)}</View>
    <Text style={type.h3}>People aboard</Text>
    <View style={{ flexDirection: 'row', gap: 8 }}>{[1, 2, 3, 4, 5].map(n => <Chip key={n} on={n === people} label={String(n)} onPress={() => setPeople(n)} />)}</View>
    <Text style={type.h3}>Pay with</Text>
    <View style={{ gap: 8 }}>
      {user.card ? <Chip on={method === 'saved'} label="Saved card" sub="Held by the payment provider" onPress={() => setMethod('saved')} /> : null}
      <Chip on={method === 'card'} label={user.card ? 'Another card' : 'Card'} sub="Visa, Mastercard or Maestro" onPress={() => setMethod('card')} />
      <Chip on={method === 'wallet'} label="Apple Pay or Google Pay" sub="One tap" onPress={() => setMethod('wallet')} />
    </View>
    <Card style={{ backgroundColor: '#FBF8EC' }}>
      <Text style={type.body}>We call your hosts {dShort(addDays(date, -1))}, from 18:00. The pass goes to {user.name}, {user.contact}.</Text>
      <Text style={{ fontSize: 22, fontWeight: '900', color: colors.deep }}>EUR {priceOf(t)} <Text style={type.small}>once, for the whole car</Text></Text>
      {err ? <Text style={[type.small, { color: colors.rust }]}>{err}</Text> : null}
      <Button big title={`Pay EUR ${priceOf(t)} and get my pass`} onPress={pay} busy={busy} disabled={left === 0} />
      <Text style={type.small}>Works or it's free. Change your date free until 18:00 the evening before.</Text>
    </Card>
  </Screen>);
}
