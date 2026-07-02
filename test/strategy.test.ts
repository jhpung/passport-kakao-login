import { describe, expect, it } from 'vitest'

import { buildStrategyOptions, KakaoStrategy } from '../src/strategy'
import type { KakaoProfile } from '../src/types'

const baseOptions = {
  clientID: 'client-id',
  callbackURL: 'https://example.com/callback',
}

const noopVerify = (
  _accessToken: string,
  _refreshToken: string,
  profile: KakaoProfile,
  done: (err: unknown, profile?: KakaoProfile) => void
) => done(null, profile)

type OAuth2GetError = { statusCode: number; data?: unknown }
type UserProfileCallback = (err: OAuth2GetError | null, body?: string) => void

function stubOAuth2Get(
  strategy: KakaoStrategy,
  respond: (callback: UserProfileCallback) => void
) {
  const oauth2 = strategy['_oauth2'] as { get: unknown }
  oauth2.get = (
    _url: string,
    _accessToken: string,
    callback: UserProfileCallback
  ) => respond(callback)
}

function stubUserProfileResponse(strategy: KakaoStrategy, json: unknown) {
  stubOAuth2Get(strategy, callback => callback(null, JSON.stringify(json)))
}

function stubUserProfileRawBody(strategy: KakaoStrategy, rawBody: string) {
  stubOAuth2Get(strategy, callback => callback(null, rawBody))
}

function stubUserProfileError(strategy: KakaoStrategy, err: OAuth2GetError) {
  stubOAuth2Get(strategy, callback => callback(err))
}

describe('buildStrategyOptions', () => {
  it('clientSecret 미지정 시 kakao 기본값을 채운다', () => {
    const options = buildStrategyOptions(baseOptions)

    expect(options.clientSecret).toBe('kakao')
  })

  it('scopeSeparator 미지정 시 콤마를 기본값으로 채운다', () => {
    const options = buildStrategyOptions(baseOptions)

    expect(options.scopeSeparator).toBe(',')
  })

  it('User-Agent 미지정 시 패키지명을 기본값으로 채운다', () => {
    const options = buildStrategyOptions(baseOptions)

    expect(options.customHeaders?.['User-Agent']).toBe('passport-kakao-login')
  })

  it('User-Agent 지정 시 해당 값을 그대로 유지한다', () => {
    const options = buildStrategyOptions({
      ...baseOptions,
      customHeaders: { 'User-Agent': 'HELLO ROTO' },
    })

    expect(options.customHeaders?.['User-Agent']).toBe('HELLO ROTO')
  })
})

describe('KakaoStrategy', () => {
  it('strategy 이름은 kakao로 고정된다', () => {
    const strategy = new KakaoStrategy(baseOptions, noopVerify)

    expect(strategy.name).toBe('kakao')
  })

  it('kapi 요청 시 access_token을 쿼리 파라미터가 아닌 Authorization 헤더로 보낸다', () => {
    const strategy = new KakaoStrategy(baseOptions, noopVerify)
    const oauth2 = strategy['_oauth2'] as unknown as {
      _useAuthorizationHeaderForGET: boolean
    }

    expect(oauth2._useAuthorizationHeaderForGET).toBe(true)
  })

  it('kakao_account.profile.nickname으로 사용자 프로필을 파싱한다', async () => {
    const strategy = new KakaoStrategy(baseOptions, noopVerify)
    stubUserProfileResponse(strategy, {
      id: 123,
      kakao_account: { profile: { nickname: 'roto' } },
    })

    const profile = await new Promise<KakaoProfile | undefined>(
      (resolve, reject) => {
        strategy.userProfile('token', (err, profile) =>
          err ? reject(err) : resolve(profile)
        )
      }
    )

    expect(profile?.id).toBe(123)
    expect(profile?.username).toBe('roto')
  })

  it('kakao_account가 없는 미연동 계정은 properties.nickname으로 대체 파싱한다', async () => {
    const strategy = new KakaoStrategy(baseOptions, noopVerify)
    stubUserProfileResponse(strategy, {
      id: 456,
      properties: { nickname: 'legacy-roto' },
    })

    const profile = await new Promise<KakaoProfile | undefined>(
      (resolve, reject) => {
        strategy.userProfile('token', (err, profile) =>
          err ? reject(err) : resolve(profile)
        )
      }
    )

    expect(profile?.username).toBe('legacy-roto')
  })

  it('nickname 정보가 전혀 없으면 미연동 계정으로 표기한다', async () => {
    const strategy = new KakaoStrategy(baseOptions, noopVerify)
    stubUserProfileResponse(strategy, { id: 789 })

    const profile = await new Promise<KakaoProfile | undefined>(
      (resolve, reject) => {
        strategy.userProfile('token', (err, profile) =>
          err ? reject(err) : resolve(profile)
        )
      }
    )

    expect(profile?.username).toBe('미연동 계정')
  })

  it('OAuth2 요청이 실패하면 done에 에러를 그대로 전달한다', async () => {
    const strategy = new KakaoStrategy(baseOptions, noopVerify)
    const oauthError = { statusCode: 401, data: 'invalid_token' }
    stubUserProfileError(strategy, oauthError)

    const err = await new Promise<unknown>(resolve => {
      strategy.userProfile('token', err => resolve(err))
    })

    expect(err).toBe(oauthError)
  })

  it('응답 body가 유효한 JSON이 아니면 done에 파싱 에러를 전달한다', async () => {
    const strategy = new KakaoStrategy(baseOptions, noopVerify)
    stubUserProfileRawBody(strategy, 'not-json')

    const err = await new Promise<unknown>(resolve => {
      strategy.userProfile('token', err => resolve(err))
    })

    expect(err).toBeInstanceOf(SyntaxError)
  })
})
