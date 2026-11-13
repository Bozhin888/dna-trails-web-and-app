import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type ViewStyle, type TextInputProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, type } from './theme';

export function Screen({ children, dark, scroll = true, style }: { children: React.ReactNode; dark?: boolean; scroll?: boolean; style?: ViewStyle }) {
  const bg = { backgroundColor: dark ? colors.deep : colors.offwhite };
  return (<SafeAreaView style={[{ flex: 1 }, bg]} edges={['top']}>
    {scroll ? <ScrollView contentContainerStyle={[{ padding: 18, paddingBottom: 48, gap: 16 }, style]}>{children}</ScrollView>
      : <View style={[{ flex: 1, padding: 18, gap: 16 }, style]}>{children}</View>}
  </SafeAreaView>);
}
export function Head({ eyebrow, title, sub, dark }: { eyebrow?: string; title: string; sub?: string; dark?: boolean }) {
  return (<View style={{ gap: 6 }}>
    {eyebrow ? <Text style={[type.eyebrow, dark && { color: colors.gold }]}>{eyebrow}</Text> : null}
    <Text style={[type.h1, dark && { color: colors.white }]}>{title}</Text>
    {sub ? <Text style={[type.body, dark && { color: colors.mint }]}>{sub}</Text> : null}
  </View>);
}
type BtnKind = 'green' | 'gold' | 'outline' | 'ghostDark' | 'rust';
export function Button({ title, onPress, kind = 'green', busy, disabled, big }: { title: string; onPress?: () => void; kind?: BtnKind; busy?: boolean; disabled?: boolean; big?: boolean }) {
  const k = btn[kind];
  return (<Pressable accessibilityRole="button" onPress={onPress} disabled={disabled || busy}
    style={({ pressed }) => [s.btn, big && { paddingVertical: 18 }, k.box, (pressed || disabled) && { opacity: 0.7 }]}>
    {busy ? <ActivityIndicator color={k.text.color} /> : <Text style={[s.btnText, k.text, big && { fontSize: 18 }]}>{title}</Text>}
  </Pressable>);
}
const btn: Record<BtnKind, { box: ViewStyle; text: { color: string } }> = {
  green: { box: { backgroundColor: colors.green }, text: { color: colors.white } },
  gold: { box: { backgroundColor: colors.gold }, text: { color: colors.deep } },
  rust: { box: { backgroundColor: colors.rust }, text: { color: colors.white } },
  outline: { box: { borderWidth: 2, borderColor: colors.green, backgroundColor: 'transparent' }, text: { color: colors.green } },
  ghostDark: { box: { borderWidth: 2, borderColor: colors.mint, backgroundColor: 'transparent' }, text: { color: colors.mint } },
};
export function Field({ label, error, ...p }: TextInputProps & { label: string; error?: string }) {
  return (<View style={{ gap: 6 }}>
    <Text style={[type.small, { fontWeight: '700', color: colors.deep }]}>{label}</Text>
    <TextInput placeholderTextColor="#98A39B" style={s.input} {...p} />
    {error ? <Text style={[type.small, { color: colors.rust }]}>{error}</Text> : null}
  </View>);
}
export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[s.card, style]}>{children}</View>;
}
export function Row({ label, sub, onPress, right }: { label: string; sub?: string; onPress?: () => void; right?: string }) {
  return (<Pressable onPress={onPress} style={s.row}>
    <View style={{ flex: 1 }}><Text style={type.h3}>{label}</Text>{sub ? <Text style={type.small}>{sub}</Text> : null}</View>
    <Text style={{ color: colors.green, fontSize: 20 }}>{right ?? '›'}</Text>
  </Pressable>);
}
/** The rubber stamp: gold = confirmed, green = collected, ink = visited. */
export function Stamp({ top, mid, bottom, tone = 'gold', size = 96, rot = -6 }: { top: string; mid: string; bottom?: string; tone?: 'gold' | 'green' | 'ink'; size?: number; rot?: number }) {
  const c = tone === 'gold' ? '#9C8A3E' : tone === 'green' ? colors.green : colors.charcoal;
  return (<View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 3, borderColor: c, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: `${rot}deg` }], padding: 6 }}>
    <View style={{ position: 'absolute', inset: 5, borderRadius: size, borderWidth: 1, borderColor: c, opacity: 0.7 }} />
    <Text numberOfLines={1} style={{ color: c, fontSize: size * 0.1, fontWeight: '900', letterSpacing: 1 }}>{top.toUpperCase()}</Text>
    <Text numberOfLines={1} style={{ color: c, fontSize: size * 0.17, fontWeight: '900' }}>{mid}</Text>
    {bottom ? <Text numberOfLines={1} style={{ color: c, fontSize: size * 0.1, fontWeight: '700' }}>{bottom}</Text> : null}
  </View>);
}
export const Hero = ({ src, h = 200 }: { src: number; h?: number }) => <Image source={src} style={{ width: '100%', height: h, borderRadius: radius.lg }} resizeMode="cover" />;
export const Pill = ({ text, tone = 'mint' }: { text: string; tone?: 'mint' | 'gold' | 'rust' }) => (
  <View style={{ alignSelf: 'flex-start', backgroundColor: tone === 'mint' ? colors.mint : tone === 'gold' ? '#EFE7C4' : '#F3DCCD', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
    <Text style={{ fontSize: 12, fontWeight: '800', color: tone === 'rust' ? colors.rust : colors.deep }}>{text}</Text></View>);

const s = StyleSheet.create({
  btn: { borderRadius: radius.md, paddingVertical: 14, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 16, fontWeight: '800' },
  input: { borderWidth: 1.5, borderColor: '#C9D3CC', borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, backgroundColor: colors.white, color: colors.charcoal },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 16, gap: 10, borderWidth: 1, borderColor: '#E3E8E4' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#E3E8E4', gap: 10 },
});
