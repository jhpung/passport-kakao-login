# passport-kakao-login

[English](./README.md)

[Passport](https://www.passportjs.org/) 용 카카오 OAuth 2.0 로그인 strategy.

유지보수가 중단된 [passport-kakao](https://github.com/rotoshine/passport-kakao)의 대체 패키지입니다. CommonJS/ESM 듀얼 모듈을 지원합니다.

## Install

```sh
npm install passport-kakao-login passport
```

## Usage

### 1. Kakao Developers 앱 설정

[Kakao Developers](https://developers.kakao.com/) 콘솔에서 앱을 만들고 다음을 확인한다.

- **REST API 키** → `clientID`
- **카카오 로그인 > Redirect URI** → `callbackURL`과 정확히 일치해야 한다
- **보안 > Client Secret** 코드 → `clientSecret`. 기본적으로 활성화되어 있으며 활성화된 경우 토큰 발급 요청에 반드시 포함해야 한다

### 2. Strategy 등록

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
      // profile로 사용자를 조회하거나 새로 만든 뒤:
      done(null, user)
    }
  )
)

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) => {
  // id로 사용자를 조회해 done(null, user)
})
```

콘솔에서 Client Secret 기능을 끈 경우에 한해 `clientSecret`을 생략할 수 있다. 이 경우 `passport-oauth2` 요구사항을 맞추기 위한 임의 값(`'kakao'`)이 자동으로 채워진다.

### 3. Express 라우트

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

verify 콜백에 전달되는 `profile`은 다음 구조를 가진다.

```ts
{
  provider: 'kakao',
  id: number,
  username: string,            // kakao_account.profile.nickname, 없으면 properties.nickname으로 대체
  displayName: string,
  kakao_account: KakaoAccount, // _json.kakao_account와 동일한 객체, 편의를 위해 최상위로 노출
  _raw: string,                // 원본 JSON 응답 문자열
  _json: object,               // 파싱된 JSON 응답
}
```

`KakaoAccount` 타입은 패키지에서 export되므로, email·gender·birthday 같은 동의항목 필드를 `_json`을 거치지 않고 바로 타입 지정할 수 있다.

```ts
import type { KakaoAccount } from 'passport-kakao-login'

function getEmail(kakaoAccount?: KakaoAccount): string | undefined {
  return kakaoAccount?.email
}
```

`KakaoAccount` 타입을 패키지에서 export하므로, `profile._json.kakao_account`의 email·gender·birthday 같은 동의항목 필드를 타입 지정할 수 있다.

```ts
import type { KakaoAccount } from 'passport-kakao-login'

function getEmail(kakaoAccount?: KakaoAccount): string | undefined {
  return kakaoAccount?.email
}
```

## Development

```sh
npm install
npm run build          # rollup -> dist/index.cjs, dist/index.mjs, dist/index.d.ts
npm test                # vitest
npm run test:coverage   # vitest --coverage (임계값 90%)
npm run typecheck       # tsc --noEmit
npm run lint             # eslint
npm run format:check     # prettier --check
```

## References

- [카카오 로그인 REST API](https://developers.kakao.com/docs/ko/kakaologin/rest-api#kakaologin)

## License

MIT
