# DNA Trails: website and mobile app

Dated, verified, self-guided rural trails in Macedonia. *Go where you're expected.*

One repository, three parts:

| Folder | What it is | Where it runs |
|---|---|---|
| `apps/web` | The website (approved Prototype 2 UI) plus the backend API: sign-in codes, profile, passes, checkout, road progress | Vercel |
| `apps/mobile` | The mobile app (Expo / React Native), 5 tabs: Trails, Map, My trail, Passport, Profile | Expo Go now; App Store and Google Play later |
| `packages/data` | Trails, hosts, places, prices (shared by web backend and app) | |
| `packages/brand` | Colours, fonts, slogans | |
| `packages/api-client` | Typed client for the API, used by the app | |

## Run it locally

```bash
pnpm install
pnpm dev            # website + API on http://localhost:3000
pnpm mobile         # Expo; scan the QR code with Expo Go
```

For the app to reach your local API from a phone, start it with your computer's address:
`EXPO_PUBLIC_API_URL=http://192.168.x.x:3000 pnpm mobile`.

Without any settings the API runs in demo mode: data lives in memory, sign-in codes are shown on screen, and payments are simulated.

## Host the website on Vercel

1. Vercel, **Add New Project**, import `Bozhin888/dna-trails-web-and-app`.
2. **Root Directory: `apps/web`**. Vercel detects Next.js and pnpm; leave the build settings as they are.
3. Environment variables (see `apps/web/.env.example`):
   - `SESSION_SECRET`: a long random string (required).
   - `DEMO_MODE=1` while it is an investor/partner prototype.
   - Later: `DATABASE_URL` (Vercel Postgres / Neon), `RESEND_API_KEY` for emailed codes, and the payment provider.
4. Deploy. Then put the production URL in `apps/mobile/app.json` under `extra.apiUrl`.

Only the website is hosted on Vercel. The app is built with Expo (EAS) and published to the stores; it talks to the Vercel API.

## API

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/auth/start` | Send a six-digit code to an email or mobile number |
| POST | `/api/auth/verify` | Check the code, create the profile if new, start a session |
| POST | `/api/auth/signout` | End the session |
| GET/PATCH/DELETE | `/api/me` | The one profile: read, edit, delete |
| GET | `/api/passes` | Your passes |
| PATCH | `/api/passes/:code` | Road progress and stamps |
| POST | `/api/passes/redeem` | Open a pass from a desk, hotel or friend code |
| GET | `/api/trails`, `/api/trails/:id/availability?date=` | Trails and cars left on a date |
| POST | `/api/checkout` | Buy a pass (once per car) |
| POST | `/api/payments/webhook` | Payment provider confirmation |

The website uses an httpOnly cookie; the app uses the same token as a Bearer header.

## Still open (decided by the team)

- **Payment provider.** Payments sit behind one interface (`apps/web/lib/payments.ts`) with a hosted card form, so card numbers never reach DNA Trails. Only the simulated `mock` provider exists today.
- **Code delivery by SMS/Viber** for mobile numbers (email via Resend is ready).
- **Real hosts, call notes and road notes.** All host content is sample content written for the design.
- **Prototype clock.** The website UI still runs on the prototype's fixed date (14 May 2027) for the demo.
- App: push notifications for the evening-before answers, offline storage of the route, drawn map, buying a composed trail.

`pnpm data` regenerates `packages/data/src/dna.json` from the website's trail files.
