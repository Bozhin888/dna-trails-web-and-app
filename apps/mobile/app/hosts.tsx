// Hosts: the people on the call list. A first name, a face, a phone that gets answered.
import { Text } from 'react-native';
import { HOSTS } from '../src/trails';
import { Card, Head, Screen } from '../src/ui';
import { type } from '../src/theme';
export default function Hosts() {
  return (<Screen>
    <Head eyebrow="Hosts" title="The people expecting you" sub="Sample hosts written for the design. Real ones join after a team member has driven each trail." />
    {Object.entries(HOSTS).map(([id, h]) => (<Card key={id}><Text style={type.h3}>{h.name} · {h.role}</Text><Text style={type.small}>{h.where} · {String(h.since ?? '')}</Text><Text style={type.body}>{h.line}</Text></Card>))}
  </Screen>);
}
