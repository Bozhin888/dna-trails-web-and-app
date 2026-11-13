// How it works: the method and the guarantee on one scroll.
import { Text } from 'react-native';
import { FAQS } from '@dna/data';
import { Card, Head, Screen } from '../src/ui';
import { slogans, type } from '../src/theme';
const STEPS = [
  ['Pick a trail and a date', 'One price per car, paid once. Up to four cars a day, so nobody waits for a table.'],
  ['We call ahead', 'The evening before, we phone or Viber every host on your route, in Macedonian. Each answer becomes a gold stamp in your pass.'],
  ['Drive it your way', 'Route, road notes per car, cash and fuel tips, and audio stories all work with no signal.'],
  ['Works or it’s free', 'If a confirmed stop is closed when you arrive, you get your money back.'],
];
export default function How() {
  const faqs = (FAQS as [string, [string, string][]][] | undefined)?.[0]?.[1] ?? [];
  return (<Screen>
    <Head eyebrow="How it works" title={slogans.main} sub={slogans.layers} />
    {STEPS.map(([h, b], i) => <Card key={h}><Text style={type.eyebrow}>Step {i + 1}</Text><Text style={type.h3}>{h}</Text><Text style={type.body}>{b}</Text></Card>)}
    {faqs.slice(0, 6).map(([q, a]) => <Card key={q}><Text style={type.h3}>{q}</Text><Text style={type.body}>{a}</Text></Card>)}
  </Screen>);
}
