// Roots Trail: for people living abroad, coming back to roots and family.
import { Linking, Text } from 'react-native';
import { Button, Card, Head, Screen } from '../src/ui';
import { type } from '../src/theme';
export default function Roots() {
  return (<Screen>
    <Head eyebrow="Roots Trail" title="Back to a family village" sub="For people living abroad, coming back to roots and family. Tell us the village and the family name; we find the people who remember." />
    <Card><Text style={type.body}>We visit the village first, find relatives, neighbours or the priest who keeps the records, and build a one- to three-day trail around the house, the church and the table. From EUR 190 to 390.</Text></Card>
    <Button big title="Start a request" onPress={() => Linking.openURL('mailto:hello@dnatrails.mk?subject=Roots Trail request')} />
    <Text style={type.small}>We reply within three days.</Text>
  </Screen>);
}
