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

function stubUserProfileResponse(strategy: KakaoStrategy, json: unknown) {
  const oauth2 = strategy['_oauth2'] as { get: unknown }
  oauth2.get = (
    _url: string,
    _accessToken: string,
    callback: (err: { statusCode: number; data?: unknown } | null, body?: string) => void
  ) => callback(null, JSON.stringify(json))
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

  it('kakao_account.profile.nickname으로 사용자 프로필을 파싱한다', async () => {
    const strategy = new KakaoStrategy(baseOptions, noopVerify)
    stubUserProfileResponse(strategy, { id: 123, kakao_account: { profile: { nickname: 'roto' } } })

    const profile = await new Promise<KakaoProfile | undefined>((resolve, reject) => {
      strategy.userProfile('token', (err, profile) => (err ? reject(err) : resolve(profile)))
    })

    expect(profile?.id).toBe(123)
    expect(profile?.username).toBe('roto')
  })

  it('kakao_account가 없는 미연동 계정은 properties.nickname으로 대체 파싱한다', async () => {
    const strategy = new KakaoStrategy(baseOptions, noopVerify)
    stubUserProfileResponse(strategy, { id: 456, properties: { nickname: 'legacy-roto' } })

    const profile = await new Promise<KakaoProfile | undefined>((resolve, reject) => {
      strategy.userProfile('token', (err, profile) => (err ? reject(err) : resolve(profile)))
    })

    expect(profile?.username).toBe('legacy-roto')
  })
})
