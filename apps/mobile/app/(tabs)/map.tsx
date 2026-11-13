// The map: one informative tab, everything we researched, filtered by category.
// v1 lists places by category and region; the drawn map (as on the website) comes next.
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { MAPCATS, PLACES, REGIONS } from '@dna/data';
import { Card, Head, Screen } from '../../src/ui';
import { colors, radius, type } from '../../src/theme';

type Place = { id: string; name: string; kind: string; region: string; alt?: number };
type Region = { id: string; name: string; towns: string };
export default function MapTab() {
  const places = PLACES as Place[]; const regions = REGIONS as Region[];
  const [region, setRegion] = useState<string | null>(null);
  const list = useMemo(() => places.filter(p => !region || p.region === region), [places, region]);
  return (<Screen>
    <Head eyebrow="The map" title="3,519 places we researched" sub="The research behind every trail. Filter by region to get ideas for a visit." />
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {[{ id: '', name: 'All regions' } as Region, ...regions].map(r => (<Pressable key={r.id} onPress={() => setRegion(r.id || null)}
        style={{ paddingVertical: 8, paddingHorizontal: 12, borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.green, backgroundColor: (region ?? '') === r.id ? colors.green : 'transparent' }}>
        <Text style={{ fontWeight: '700', color: (region ?? '') === r.id ? colors.white : colors.green }}>{r.name}</Text></Pressable>))}
    </View>
    {list.map(p => (<Card key={p.id}><Text style={type.h3}>{p.name}</Text><Text style={type.small}>{p.kind}{p.alt ? ` · ${p.alt} m` : ''} · {regions.find(r => r.id === p.region)?.name}</Text></Card>))}
    <Text style={type.small}>Categories on the full map: {Object.values(MAPCATS).map(c => c[0]).join(', ')}.</Text>
    <Text style={type.small}>Map data © OpenStreetMap contributors.</Text>
  </Screen>);
}
