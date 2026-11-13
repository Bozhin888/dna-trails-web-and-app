// The shelf: six driven trails.
import { router } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';
import { img } from '../../src/images';
import { TRAILS, priceOf, typeLabel, hostIds } from '../../src/trails';
import { Card, Head, Pill, Screen } from '../../src/ui';
import { colors, type } from '../../src/theme';

export default function Trails() {
  return (<Screen>
    <Head eyebrow="The trail shelf" title="Six driven trails" sub="Every kilometre driven by us first. Every host called the evening before you go." />
    {TRAILS.map(t => (<Pressable key={t.id} onPress={() => router.push(`/trail/${t.id}`)}>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <Image source={img(t.img)} style={{ width: '100%', height: 170 }} />
        <View style={{ padding: 16, gap: 6 }}>
          <Text style={type.eyebrow}>{typeLabel(t)}</Text>
          <Text style={type.h2}>{t.title}</Text>
          <Text style={type.small}>{t.sub}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
            <Pill text={`${hostIds(t).length} hosts called · ${t.km} km`} />
            <Text style={{ fontSize: 18, fontWeight: '900', color: colors.green }}>EUR {priceOf(t)}<Text style={type.small}> / car</Text></Text>
          </View>
        </View>
      </Card>
    </Pressable>))}
    <Pressable onPress={() => router.push('/compose')}><Card><Text style={type.h3}>Trip-it-Yourself</Text><Text style={type.small}>Three questions. It can only pick stops we have driven. EUR 29.</Text></Card></Pressable>
    <Pressable onPress={() => router.push('/roots')}><Card><Text style={type.h3}>Roots Trail</Text><Text style={type.small}>For people living abroad, coming back to roots and family.</Text></Card></Pressable>
  </Screen>);
}
