// Create a profile or sign in: name, email or mobile, then a six-digit code. No password.
import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';
import { api, useSession } from '../src/session';
import { Button, Field, Head, Screen } from '../src/ui';
import { type } from '../src/theme';

export default function SignUp() {
  const { then } = useLocalSearchParams<{ then?: string }>();
  const { signedIn } = useSession();
  const [step, setStep] = useState<'who' | 'code'>('who');
  const [name, setName] = useState(''); const [contact, setContact] = useState(''); const [code, setCode] = useState('');
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false); const [hint, setHint] = useState('');
  const send = async () => {
    if (!name.trim()) return setErr('Tell us what to call you. Hosts like a first name.');
    if (!(/^\S+@\S+\.\S+$/.test(contact.trim()) || contact.replace(/\D/g, '').length >= 8)) return setErr('We need an email or a mobile number, to send your code and your pass.');
    setErr(''); setBusy(true);
    try { const d = await api.startSignIn(name.trim(), contact.trim()); setHint(d.devCode ? `Demo: your code is ${d.devCode}` : ''); setStep('code'); }
    catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  };
  const verify = async () => {
    if (code.replace(/\D/g, '').length !== 6) return setErr('Six digits, please.');
    setErr(''); setBusy(true);
    try {
      const d = await api.verify(contact.trim(), code, name.trim()); await signedIn(d.token, d.user, d.passes);
      if (router.canGoBack()) router.back();
      if (then?.startsWith('checkout:')) router.replace(`/checkout/${then.slice(9)}`);
      else router.replace(then === 'code' ? '/(tabs)/profile' : '/(tabs)/trails');
    } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  };
  return (<Screen>
    {step === 'who' ? <>
      <Head eyebrow="Your profile" title="Two steps, no password." sub="New here or coming back, it is the same two steps. Your profile keeps your passes, stamps and receipts." />
      <Field label="Your name" placeholder="As a host should greet you" value={name} onChangeText={setName} autoComplete="name" />
      <Field label="Email or mobile number" placeholder="you@example.com or +389 7X XXX XXX" value={contact} onChangeText={setContact} autoCapitalize="none" keyboardType="email-address" error={err} />
      <Button big title="Send me a code" onPress={send} busy={busy} />
    </> : <>
      <Head eyebrow="Check your messages" title="Enter the code" sub={`We sent a six-digit code to ${contact}.`} />
      <Field label="Code" placeholder="······" value={code} onChangeText={setCode} keyboardType="number-pad" maxLength={6} error={err} autoFocus />
      {hint ? <Text style={type.small}>{hint}</Text> : null}
      <Button big title="Confirm" onPress={verify} busy={busy} />
      <Button kind="outline" title="Use a different address" onPress={() => { setStep('who'); setCode(''); setErr(''); }} />
    </>}
  </Screen>);
}
