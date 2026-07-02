# passport-kakao-login

[Passport](https://www.passportjs.org/) strategy for authenticating with [Kakao](https://developers.kakao.com/) using the OAuth 2.0 API.

기존 [passport-kakao](https://github.com/rotoshine/passport-kakao) 패키지의 유지보수가 중단되어 새로 작성한 대체 패키지입니다. CommonJS/ESM 듀얼 모듈을 지원합니다.

## Install

```sh
npm install passport-kakao-login passport
```

## Usage

```ts
import passport from 'passport'
import { Strategy as KakaoStrategy } from 'passport-kakao-login'

passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_CLIENT_ID!,
      callbackURL: 'https://your-app.com/auth/kakao/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // find or create the user from `profile`, then:
      done(null, user)
    }
  )
)
```

Kakao's OAuth2 authorize endpoint doesn't require a `client_secret`; when omitted a placeholder value (`'kakao'`) is sent automatically to satisfy `passport-oauth2`.

### Profile

The `profile` argument passed to the verify callback has the shape:

```ts
{
  provider: 'kakao',
  id: number,
  username: string,   // kakao_account.profile.nickname (falls back to properties.nickname)
  displayName: string,
  _raw: string,        // raw JSON response body
  _json: object,       // parsed JSON response body
}
```

## Development

```sh
npm install
npm run build      # rollup -> dist/index.cjs, dist/index.mjs, dist/index.d.ts
npm test           # vitest
npm run typecheck  # tsc --noEmit
```

## License

MIT
