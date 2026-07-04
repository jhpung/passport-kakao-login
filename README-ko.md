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

[Kakao Developers](https://developers.kakao.com/) 콘솔에서 앱을 만들고 다음을 확인합니다.

- **REST API 키** → `clientID`
- **카카오 로그인 > Redirect URI** → `callbackURL`과 정확히 일치해야 합니다
- **보안 > Client Secret** 코드 → `clientSecret`. 기본적으로 활성화되어 있으며 활성화된 경우 토큰 발급 요청에 반드시 포함해야 합니다

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

콘솔에서 Client Secret 기능을 끈 경우에 한해 `clientSecret`을 생략할 수 있습니다. 이 경우 `passport-oauth2` 요구사항을 맞추기 위한 임의 값(`'kakao'`)이 자동으로 채워집니다.

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

verify 콜백에 전달되는 `profile`은 다음 구조를 가집니다.

```ts
{
  provider: 'kakao',
  id: number,
  username: string,       // kakao_account.profile.nickname, 없으면 properties.nickname으로 대체
  displayName: string,
  _raw: string,           // 원본 JSON 응답 문자열
  _json: KakaoRawProfile, // 파싱된 JSON 응답
}
```

`_json`은 카카오 `/v2/user/me` 응답을 그대로 반영하며, `KakaoRawProfile` 타입으로 export됩니다.

```ts
interface KakaoRawProfile {
  id: number // 카카오 회원번호
  has_signed_up?: boolean // 수동 연결 API 호출 완료 여부
  connected_at?: string // 서비스 연결 완료 시각(UTC)
  synched_at?: string // 카카오싱크 간편가입 로그인 시각(UTC)
  properties?: {
    nickname?: string
    profile_image?: string
    thumbnail_image?: string
  }
  kakao_account?: {
    profile_needs_agreement?: boolean // 프로필(닉네임/사진) 제공 동의 여부
    profile_nickname_needs_agreement?: boolean // 닉네임 제공 동의 여부
    profile_image_needs_agreement?: boolean // 프로필 사진 제공 동의 여부
    profile?: {
      nickname?: string
      thumbnail_image_url?: string
      profile_image_url?: string
      is_default_image?: boolean
      is_default_nickname?: boolean // 기본 닉네임 여부
    }
    name_needs_agreement?: boolean
    name?: string
    email_needs_agreement?: boolean
    has_email?: boolean // @deprecated — 제공 가능 여부 확인 용도로 사용 불가, email_needs_agreement 사용
    is_email_valid?: boolean
    is_email_verified?: boolean
    email?: string
    age_range_needs_agreement?: boolean
    has_age_range?: boolean // @deprecated — 제공 가능 여부 확인 용도로 사용 불가, age_range_needs_agreement 사용
    age_range?: string // 예: "20~29"
    birthday_needs_agreement?: boolean
    has_birthday?: boolean // @deprecated — 제공 가능 여부 확인 용도로 사용 불가, birthday_needs_agreement 사용
    birthday?: string // MMDD 형식
    birthday_type?: 'SOLAR' | 'LUNAR'
    is_leap_month?: boolean
    birthyear_needs_agreement?: boolean
    has_birthyear?: boolean // @deprecated — 제공 가능 여부 확인 용도로 사용 불가, birthyear_needs_agreement 사용
    birthyear?: string // YYYY 형식
    gender_needs_agreement?: boolean
    has_gender?: boolean // @deprecated — 제공 가능 여부 확인 용도로 사용 불가, gender_needs_agreement 사용
    gender?: 'male' | 'female'
    phone_number_needs_agreement?: boolean
    phone_number?: string
    ci_needs_agreement?: boolean
    ci?: string // 연계정보(CI)
    ci_authenticated_at?: string
  }
  for_partner?: {
    // 파트너 연계 추가 정보
    uuid?: string
  }
}
```

`@deprecated` 표기는 카카오 공식 문서 기준입니다 — `has_*` 형태의 boolean 필드는 제공 가능 여부 확인 용도로 사용할 수 없으며, 대응하는 `*_needs_agreement` 필드를 사용해야 합니다.

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
- [카카오 REST API 레퍼런스](https://developers.kakao.com/docs/ko/rest-api/reference)

## License

MIT
