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
  it('fills in the kakao default when clientSecret is not provided', () => {
    const options = buildStrategyOptions(baseOptions)

    expect(options.clientSecret).toBe('kakao')
  })

  it('fills in a comma as the default scopeSeparator', () => {
    const options = buildStrategyOptions(baseOptions)

    expect(options.scopeSeparator).toBe(',')
  })

  it('fills in the package name as the default User-Agent', () => {
    const options = buildStrategyOptions(baseOptions)

    expect(options.customHeaders?.['User-Agent']).toBe('passport-kakao-login')
  })

  it('keeps a custom User-Agent as-is when provided', () => {
    const options = buildStrategyOptions({
      ...baseOptions,
      customHeaders: { 'User-Agent': 'HELLO ROTO' },
    })

    expect(options.customHeaders?.['User-Agent']).toBe('HELLO ROTO')
  })
})

describe('KakaoStrategy', () => {
  it('is named "kakao"', () => {
    const strategy = new KakaoStrategy(baseOptions, noopVerify)

    expect(strategy.name).toBe('kakao')
  })

  it('sends access_token as an Authorization header, not a query parameter, when calling kapi', () => {
    const strategy = new KakaoStrategy(baseOptions, noopVerify)
    const oauth2 = strategy['_oauth2'] as unknown as {
      _useAuthorizationHeaderForGET: boolean
    }

    expect(oauth2._useAuthorizationHeaderForGET).toBe(true)
  })

  it('parses the user profile from kakao_account.profile.nickname', async () => {
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

  it('exposes kakao_account on the top-level profile as well', async () => {
    const strategy = new KakaoStrategy(baseOptions, noopVerify)
    const kakaoAccount = {
      profile: { nickname: 'roto' },
      email: 'roto@example.com',
    }
    stubUserProfileResponse(strategy, { id: 123, kakao_account: kakaoAccount })

    const profile = await new Promise<KakaoProfile | undefined>(
      (resolve, reject) => {
        strategy.userProfile('token', (err, profile) =>
          err ? reject(err) : resolve(profile)
        )
      }
    )

    expect(profile?.kakao_account).toEqual(kakaoAccount)
  })

  it('falls back to properties.nickname when kakao_account is absent', async () => {
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

  it('labels the profile as unlinked when no nickname is available at all', async () => {
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

  it('passes the error through to done when the OAuth2 request fails', async () => {
    const strategy = new KakaoStrategy(baseOptions, noopVerify)
    const oauthError = { statusCode: 401, data: 'invalid_token' }
    stubUserProfileError(strategy, oauthError)

    const err = await new Promise<unknown>(resolve => {
      strategy.userProfile('token', err => resolve(err))
    })

    expect(err).toBe(oauthError)
  })

  it('passes a parse error through to done when the response body is not valid JSON', async () => {
    const strategy = new KakaoStrategy(baseOptions, noopVerify)
    stubUserProfileRawBody(strategy, 'not-json')

    const err = await new Promise<unknown>(resolve => {
      strategy.userProfile('token', err => resolve(err))
    })

    expect(err).toBeInstanceOf(SyntaxError)
  })
})
