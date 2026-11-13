// My trail: your dated pass and the confirmation stamps from the evening before.
import { router } from 'expo-router';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useSession } from '../../src/session';
import { HOSTS, CARS, dShort, dStamp, stageLabel, stopsOf, trailById, typeLabel } from '../../src/trails';
import { Button, Card, Head, Pill, Stamp } from '../../src/ui';
import { colors, type } from '../../src/theme';

export default function MyTrail() {
  const { user, passes, refresh } = useSession(); const [pull, setPull] = useState(false);
  const live = passes.filter(p => p.stage !== 'done').sort((a, b) => (a.date < b.date ? -1 : 1));
  const next = live[0];
  const onPull = async () => { setPull(true); await refresh(); setPull(false); };
  return (<SafeAreaView style={{ flex: 1, backgroundColor: colors.offwhite }} edges={['top']}>
    <ScrollView contentContainerStyle={{ padding: 18, gap: 16, paddingBottom: 48 }} refreshControl={<RefreshControl refreshing={pull} onRefresh={onPull} />}>
      <Head eyebrow="My trail" title={next ? trailById(next.trail)?.title ?? 'Your trail' : 'Nothing coming up'} />
      {!user ? <><Text style={type.body}>Sign in to see your passes on this phone.</Text><Button title="Create my profile" onPress={() => router.push('/signup')} /></>
        : !next ? <><Text style={type.body}>The shelf has six trails, and most Saturdays still have a car or two left.</Text><Button title="Find a trail" onPress={() => router.push('/(tabs)/trails')} /></>
        : (() => { const t = trailById(next.trail)!; const hosted = stopsOf(t).filter(s => s.host); const confirmed = next.stage !== 'booked';
          return (<>
            <Card style={{ backgroundColor: '#F4EDD6', borderColor: '#E4D9B5' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={type.eyebrow}>Trail pass</Text><Text style={[type.small, type.mono]}>{next.code}</Text></View>
              <Text style={type.h2}>{t.title}</Text>
              <Text style={type.small}>{typeLabel(t)} · {dShort(next.date)} · {CARS[next.car].label}, {next.people} aboard</Text>
              <Pill tone={confirmed ? 'gold' : 'rust'} text={stageLabel(next.stage, next.date)} />
            </Card>
            <Text style={type.h3}>{confirmed ? 'Every host said yes' : 'We call these hosts the evening before'}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
              {hosted.map(s => confirmed
                ? <Stamp key={s.id} tone="gold" top="Confirmed" mid={HOSTS[s.host!].name} bottom={dStamp(next.date)} size={96} rot={(s.id.length % 9) - 4} />
                : <Card key={s.id} style={{ width: '47%' }}><Text style={type.h3}>{HOSTS[s.host!].name}</Text><Text style={type.small}>{s.where}</Text></Card>)}
            </View>
            {confirmed ? <Button big kind="gold" title={next.stage === 'road' ? 'Back to the road' : 'Start the trail'} onPress={() => router.push(`/road/${next.code}`)} />
              : <Text style={type.small}>Hosts answer on your lock screen the evening before. If one cannot make it, we tell you and offer another date or your money back.</Text>}
            {live.slice(1).map(p => <Card key={p.code}><Text style={type.h3}>{trailById(p.trail)?.title}</Text><Text style={type.small}>{dShort(p.date)} · {stageLabel(p.stage, p.date)}</Text></Card>)}
          </>); })()}
    </ScrollView>
  </SafeAreaView>);
}
