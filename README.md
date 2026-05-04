# b-portfolio

Mobile portfolio-style app built with [Expo](https://expo.dev/) (SDK 54) and React Native. Uses **DummyJSON** as a demo auth and posts backend.

## Features

- Sign in / sign up (DummyJSON), persisted session (Redux + redux-persist)
- PIN setup and **Unlock** flow with optional Face ID / biometrics
- **Offline-first** posts: TanStack Query list + detail/comments cache persisted to AsyncStorage
- Home (preview posts), Search, post detail, portfolio placeholder tab
- Settings: profile, language (**English** / **Arabic** with RTL reload when switching layout direction)
- i18n via **i18next** (`i18n/locales`)

## Requirements

- Node.js **≥ 20** (recommended for this Expo / RN toolchain)
- npm or Yarn
- For native builds: Xcode (iOS), Android Studio / SDK (Android)

## Setup

```bash
npm install
```

Start the Metro dev server:

```bash
npm start
```

Then press `i` / `a` for simulator or scan the QR code in Expo Go (when compatible).

### Native projects (dev client / run:*)

```bash
npm run ios
# or
npm run android
```

After adding native modules, on iOS run CocoaPods install (e.g. `npx pod-install` from the repo root).

## Scripts

| Script          | Description                          |
|-----------------|--------------------------------------|
| `npm start`     | `expo start`                         |
| `npm run start:clean` | `expo start -c` (clear cache) |
| `npm run ios`   | `expo run:ios`                       |
| `npm run android` | `expo run:android`                 |
| `npm run web`   | `expo start --web`                 |

## Typecheck

```bash
npx tsc --noEmit
```

## Project layout

| Path            | Role                                      |
|-----------------|-------------------------------------------|
| `App.tsx`       | Providers, session lock (AppState), shell |
| `screens/`      | Screen components                         |
| `navigation/`   | React Navigation stacks / tabs            |
| `store/`        | Redux slices + persistence              |
| `query/`        | TanStack Query client + persister         |
| `api/`          | Axios clients (DummyJSON base URL)        |
| `i18n/`         | i18next bootstrap + locale JSON           |
| `theme/`        | Colors, radius                            |

## API

Auth and posts use **`https://dummyjson.com`** (see `api/authClient.ts`, `api/postsApi.ts`). Replace base URLs there if you point to another backend.

## RTL / language switch

Switching between English and Arabic may call `DevSettings.reload()` so **native RTL layout** applies (`utils/rtl.ts`). In development, reload expects a reachable Metro bundler.

## License

Private project (`private: true` in `package.json`).
