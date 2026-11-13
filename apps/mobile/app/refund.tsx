// The guarantee: if a confirmed stop is closed, one tap, one call from us, money back.
import { router, useLocalSearchParams } from 'expo-router';
import { Linking, Text } from 'react-native';
import { HOSTS } from '../src/trails';
import { Button, Card, Head, Screen } from '../src/ui';
import { type } from '../src/theme';

export default function Refund() {
  const { code, host } = useLocalSearchParams<{ code: string; host: string }>(); const h = HOSTS[host];
  return (<Screen>
    <Head eyebrow="Works or it's free" title={`${h?.name ?? 'Your host'} isn't there?`} sub="A confirmed stop that is closed means your trail is free. You don't have to argue for it." />
    <Card><Text style={type.body}>Tap below and a DNA Trails person calls you within 15 minutes. If the stop really is closed, we refund pass {code} in full, and help you find the next stop.</Text></Card>
    <Button big kind="rust" title="Call me back" onPress={() => Linking.openURL(`mailto:hello@dnatrails.mk?subject=Closed stop on ${code}&body=${encodeURIComponent(`${h?.name ?? ''}'s stop was closed.`)}`)} />
    <Button kind="outline" title="Back to the road" onPress={() => router.back()} />
    <Text style={type.small}>The call-back line is staffed from launch. In this build the button opens an email.</Text>
  </Screen>);
}
