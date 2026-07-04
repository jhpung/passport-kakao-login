# passport-kakao-login

[한국어](./README-ko.md)

[Passport](https://www.passportjs.org/) strategy for authenticating with [Kakao](https://developers.kakao.com/) using the OAuth 2.0 API.

A maintained replacement for [passport-kakao](https://github.com/rotoshine/passport-kakao), whose maintenance has stopped. Ships dual CommonJS/ESM modules.

## Install

```sh
npm install passport-kakao-login passport
```

## Usage

### 1. Configure your Kakao Developers app

In the [Kakao Developers](https://developers.kakao.com/) console, create an app and note:

- **REST API key** → `clientID`
- **Kakao Login > Redirect URI** → must exactly match `callbackURL`
- **Security > Client Secret** code → `clientSecret`. Enabled by default; if enabled, it must be included in the token request

### 2. Register the strategy

```ts
import passport from 'passport'
import { Strategy as KakaoStrategy } from 'passport-kakao-login'

passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: 'https://your-app.com/auth/kakao/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // look up or create the user from `profile`, then:
      done(null, user)
    }
  )
)

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) => {
  // look up the user by id, then done(null, user)
})
```

`clientSecret` can be omitted only if the Client Secret feature is disabled in the console. In that case a placeholder value (`'kakao'`) is filled in automatically to satisfy `passport-oauth2`.

### 3. Express routes

```ts
import express from 'express'
import passport from 'passport'

const app = express()

app.get('/auth/kakao', passport.authenticate('kakao'))

app.get(
  '/auth/kakao/callback',
  passport.authenticate('kakao', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
)
```

### Profile

The `profile` argument passed to the verify callback has the shape:

```ts
{
  provider: 'kakao',
  id: number,
  username: string,       // kakao_account.profile.nickname, falls back to properties.nickname
  displayName: string,
  _raw: string,           // raw JSON response body
  _json: KakaoRawProfile, // parsed JSON response
}
```

`_json` mirrors Kakao's raw `/v2/user/me` response and is exported as `KakaoRawProfile`:

```ts
interface KakaoRawProfile {
  id: number // Kakao member id
  has_signed_up?: boolean // whether the manual-connect API call has completed
  connected_at?: string // UTC timestamp when the app connected to the account
  synched_at?: string // UTC timestamp of the Kakao Sync simple-signup login
  properties?: {
    nickname?: string
    profile_image?: string
    thumbnail_image?: string
  }
  kakao_account?: {
    profile_needs_agreement?: boolean // profile (nickname/photo) consent
    profile_nickname_needs_agreement?: boolean // nickname consent
    profile_image_needs_agreement?: boolean // profile photo consent
    profile?: {
      nickname?: string
      thumbnail_image_url?: string
      profile_image_url?: string
      is_default_image?: boolean
      is_default_nickname?: boolean // whether the nickname is Kakao's placeholder
    }
    name_needs_agreement?: boolean
    name?: string
    email_needs_agreement?: boolean
    has_email?: boolean // @deprecated — cannot check availability, use email_needs_agreement
    is_email_valid?: boolean
    is_email_verified?: boolean
    email?: string
    age_range_needs_agreement?: boolean
    has_age_range?: boolean // @deprecated — cannot check availability, use age_range_needs_agreement
    age_range?: string // e.g. "20~29"
    birthday_needs_agreement?: boolean
    has_birthday?: boolean // @deprecated — cannot check availability, use birthday_needs_agreement
    birthday?: string // MMDD format
    birthday_type?: 'SOLAR' | 'LUNAR'
    is_leap_month?: boolean
    birthyear_needs_agreement?: boolean
    has_birthyear?: boolean // @deprecated — cannot check availability, use birthyear_needs_agreement
    birthyear?: string // YYYY format
    gender_needs_agreement?: boolean
    has_gender?: boolean // @deprecated — cannot check availability, use gender_needs_agreement
    gender?: 'male' | 'female'
    phone_number_needs_agreement?: boolean
    phone_number?: string
    ci_needs_agreement?: boolean
    ci?: string // Connecting Information
    ci_authenticated_at?: string
  }
  for_partner?: {
    // additional partner-linkage info
    uuid?: string
  }
}
```

Fields marked `@deprecated` follow Kakao's own docs — the `has_*` boolean pattern cannot be used to check field availability; use the matching `*_needs_agreement` flag instead.

## Development

```sh
npm install
npm run build          # rollup -> dist/index.cjs, dist/index.mjs, dist/index.d.ts
npm test                # vitest
npm run test:coverage   # vitest --coverage (90% threshold)
npm run typecheck       # tsc --noEmit
npm run lint             # eslint
npm run format:check     # prettier --check
```

## References

- [Kakao Login REST API](https://developers.kakao.com/docs/ko/kakaologin/rest-api#kakaologin)
- [Kakao REST API Reference](https://developers.kakao.com/docs/ko/rest-api/reference)

## License

MIT
