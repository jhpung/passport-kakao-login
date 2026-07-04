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

## License

MIT
