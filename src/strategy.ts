import OAuth2Strategy from 'passport-oauth2'

import { KakaoProfile, KakaoStrategyOptions } from './types'

const KAUTH_HOST = 'https://kauth.kakao.com'
const KAPI_USER_PROFILE_URL = 'https://kapi.kakao.com/v2/user/me'
const DEFAULT_CLIENT_SECRET = 'kakao'
const DEFAULT_USER_AGENT = 'passport-kakao-login'

export function buildStrategyOptions(
  options: KakaoStrategyOptions
): OAuth2Strategy.StrategyOptions {
  const customHeaders = { ...options.customHeaders }
  if (!customHeaders['User-Agent']) {
    customHeaders['User-Agent'] = options.userAgent ?? DEFAULT_USER_AGENT
  }

  return {
    ...options,
    authorizationURL: `${KAUTH_HOST}/oauth/authorize`,
    tokenURL: `${KAUTH_HOST}/oauth/token`,
    clientSecret: options.clientSecret ?? DEFAULT_CLIENT_SECRET,
    scopeSeparator: options.scopeSeparator ?? ',',
    customHeaders,
  }
}

export class KakaoStrategy extends OAuth2Strategy {
  constructor(
    options: KakaoStrategyOptions,
    verify: OAuth2Strategy.VerifyFunction<KakaoProfile>
  ) {
    super(buildStrategyOptions(options), verify)
    this.name = 'kakao'
  }

  override userProfile(
    accessToken: string,
    done: (err?: unknown, profile?: KakaoProfile) => void
  ): void {
    this._oauth2.get(KAPI_USER_PROFILE_URL, accessToken, (err, body) => {
      if (err) {
        return done(err)
      }

      try {
        const json = JSON.parse(body as string) as KakaoProfile['_json']
        const nickname =
          json.kakao_account?.profile?.nickname ?? json.properties?.nickname ?? '미연동 계정'

        const profile: KakaoProfile = {
          provider: 'kakao',
          id: json.id,
          username: nickname,
          displayName: nickname,
          _raw: body as string,
          _json: json,
        }

        return done(undefined, profile)
      } catch (parseError) {
        return done(parseError)
      }
    })
  }
}
