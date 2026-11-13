// Profile: the one account page. Everything else is one tap from here.
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { router } from 'expo-router';
import { api, useSession } from '../../src/session';
import { CARS, dShort, priceOf, trailById } from '../../src/trails';
import { Button, Card, Field, Head, Row, Screen } from '../../src/ui';
import { colors, type } from '../../src/theme';

export default function Profile() {
  const { user, passes, signOut, setUser } = useSession();
  const [edit, setEdit] = useState(false); const [name, setName] = useState(user?.name ?? ''); const [contact, setContact] = useState(user?.contact ?? ''); const [err, setErr] = useState('');
  const [code, setCode] = useState(''); const [codeErr, setCodeErr] = useState('');
  const { upsertPass } = useSession();
  if (!user) return (<Screen>
    <Head eyebrow="Your profile" title="One place for your trails, stamps and receipts." sub="Sign in with a code. There is no password to forget." />
    <Button big title="Sign in or create a profile" onPress={() => router.push('/signup')} />
    <Links />
  </Screen>);
  const save = async () => { try { setUser((await api.updateMe({ name, contact })).user); setEdit(false); setErr(''); } catch (e) { setErr((e as Error).message); } };
  const redeem = async () => { try { const d = await api.redeem(code); upsertPass(d.pass); setCode(''); setCodeErr(''); router.push('/(tabs)/mytrail'); } catch (e) { setCodeErr((e as Error).message); } };
  const done = passes.filter(p => p.stage === 'done').length; const stamps = passes.reduce((a, p) => a + p.got.length, 0);
  return (<Screen>
    <Head eyebrow="Your profile" title={user.name} sub={`${user.contact} · on the trail since ${user.since.slice(0, 7)}`} />
    <View style={{ flexDirection: 'row', gap: 10 }}>
      {[[passes.length - done, 'coming up'], [done, 'finished'], [stamps, 'stamps']].map(([n, l]) => (
        <Card key={String(l)} style={{ flex: 1, alignItems: 'center', padding: 12 }}><Text style={{ fontSize: 26, fontWeight: '900', color: colors.green }}>{n}</Text><Text style={type.small}>{l}</Text></Card>))}
    </View>
    <Card>
      <Text style={type.h3}>Your details</Text>
      {edit ? <>
        <Field label="Name" value={name} onChangeText={setName} />
        <Field label="Email or mobile number" value={contact} onChangeText={setContact} autoCapitalize="none" error={err} />
        <View style={{ flexDirection: 'row', gap: 10 }}><View style={{ flex: 1 }}><Button title="Save" onPress={save} /></View><View style={{ flex: 1 }}><Button kind="outline" title="Cancel" onPress={() => setEdit(false)} /></View></View>
      </> : <>
        <Text style={type.body}>{user.name}{'\n'}{user.contact}{'\n'}Usual car: {CARS[user.car].label}</Text>
        <Button kind="outline" title="Edit details" onPress={() => setEdit(true)} />
      </>}
    </Card>
    <Card>
      <Text style={type.h3}>Payments and receipts</Text>
      {passes.length ? passes.map(p => { const t = trailById(p.trail); return (<View key={p.code} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={[type.small, { flex: 1 }]}>{dShort(p.bought)} · {t?.title ?? 'Trip-it-Yourself'} · {p.code}</Text>
        <Text style={type.h3}>{p.refunded ? 'Refunded' : `EUR ${p.paid?.eur ?? (t ? priceOf(t) : '')}`}</Text></View>); })
        : <Text style={type.small}>Nothing paid yet. A pass is bought once, per trip. There is no subscription to manage.</Text>}
      <Text style={type.small}>{user.card ? 'A card is saved with the payment provider, not with us.' : 'No card saved. You choose how to pay each time.'}</Text>
    </Card>
    <Card>
      <Text style={type.h3}>Have a code?</Text>
      <Field label="From a rental desk, a hotel card or a friend" placeholder="DNA-7K2M" value={code} onChangeText={setCode} autoCapitalize="characters" error={codeErr} />
      <Button kind="outline" title="Open the trail" onPress={redeem} />
    </Card>
    <Links />
    <Button kind="outline" title="Sign out" onPress={signOut} />
    <Text style={[type.small, { color: colors.rust, textAlign: 'center' }]} onPress={() => Alert.alert('Delete my profile?', 'This removes your passes, stamps and receipts.', [{ text: 'Cancel' }, { text: 'Delete', style: 'destructive', onPress: async () => { await api.deleteMe().catch(() => {}); await signOut(); } }])}>Delete my profile</Text>
  </Screen>);
}
function Links() {
  return (<Card>
    <Row label="How it works" sub="The evening-before call and the guarantee" onPress={() => router.push('/how')} />
    <Row label="Hosts" sub="The people expecting you" onPress={() => router.push('/hosts')} />
    <Row label="Roots Trail" sub="Back to a family village" onPress={() => router.push('/roots')} />
    <Row label="Trip-it-Yourself" sub="Composed for your dates" onPress={() => router.push('/compose')} />
  </Card>);
}
