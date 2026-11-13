// On the road: dark, big buttons, no tab bar. Built for a dashboard mount and no signal.
import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Linking, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api, useSession } from '../../src/session';
import { HOSTS, stopsOf, trailById } from '../../src/trails';
import { Button } from '../../src/ui';
import { colors, type } from '../../src/theme';

export default function Road() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const { passes, upsertPass, user } = useSession();
  const p = passes.find(x => x.code === code); const t = p && trailById(p.trail);
  const [busy, setBusy] = useState(false);
  if (!p || !t) return <SafeAreaView style={{ flex: 1, backgroundColor: colors.deep, padding: 24 }}><Text style={{ color: colors.white }}>Pass not found.</Text></SafeAreaView>;
  const stops = stopsOf(t); const at = Math.min(p.at, stops.length - 1); const s = stops[at]; const nextStop = stops[at + 1];
  const car = p.car || user?.car || 'regular'; const road = (s.road as Record<string, string> | undefined)?.[car];
  const save = async (patch: Partial<typeof p>) => { const local = { ...p, ...patch }; upsertPass(local); try { upsertPass((await api.updatePass(p.code, patch)).pass); } catch { /* offline: synced next time */ } };
  const arrived = async () => {
    setBusy(true);
    const got = [...new Set([...p.got, `${t.id}/${s.id}`])]; const last = at >= stops.length - 1;
    await save({ got, at: last ? at : at + 1, stage: last ? 'done' : 'road' });
    setBusy(false);
    if (s.host) router.push({ pathname: '/stamp', params: { host: s.host, where: s.where } });
    else if (last) router.back();
  };
  const directions = () => { const q = `${s.lat},${s.lon}`; Linking.openURL(Platform.OS === 'ios' ? `maps://?daddr=${q}` : `geo:${q}?q=${q}`); };
  const D = { color: colors.mint };
  return (<SafeAreaView style={{ flex: 1, backgroundColor: colors.deep, padding: 20, gap: 16 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={[type.eyebrow, { color: colors.gold }]}>Stop {at + 1} of {stops.length} · {t.title}</Text>
      <Text onPress={() => router.back()} style={{ color: colors.mint, fontWeight: '800' }}>Close</Text>
    </View>
    <Text style={{ color: colors.white, fontSize: 34, fontWeight: '900' }}>{String(s.name ?? s.where)}</Text>
    <Text style={[type.body, D]}>{s.where}{s.host ? ` · ${HOSTS[s.host].name} is expecting you` : ' · no host, always open'}</Text>
    {road ? <Text style={[type.body, D]}>Road: {road}</Text> : null}
    {s.cash ? <Text style={[type.body, D]}>Cash: {String(s.cash)}</Text> : null}
    {s.signal ? <Text style={[type.body, D]}>Signal: {String(s.signal)}</Text> : null}
    {(s.story as { t?: string } | undefined)?.t ? <Text style={[type.body, { color: colors.gold }]}>Story: {(s.story as { t: string }).t}</Text> : null}
    <View style={{ flex: 1 }} />
    {nextStop ? <Text style={[type.small, D]}>Then: {String(nextStop.name ?? nextStop.where)}</Text> : null}
    <Button big kind="gold" title={s.host ? `I'm at ${HOSTS[s.host].name}'s` : "I'm here"} onPress={arrived} busy={busy} />
    <Button kind="ghostDark" title="Directions" onPress={directions} />
    {s.host ? <Button kind="ghostDark" title="This stop is closed" onPress={() => router.push({ pathname: '/refund', params: { code: p.code, host: s.host } })} /> : null}
  </SafeAreaView>);
}
