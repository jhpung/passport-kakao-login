export interface KakaoStrategyOptions {
  clientID: string
  clientSecret?: string
  callbackURL: string
  scope?: string | string[]
  scopeSeparator?: string
  customHeaders?: Record<string, string>
  userAgent?: string
}

export interface KakaoRawProfile {
  id: number
  connected_at?: string
  properties?: {
    nickname?: string
    profile_image?: string
    thumbnail_image?: string
  }
  kakao_account?: {
    profile?: {
      nickname?: string
      thumbnail_image_url?: string
      profile_image_url?: string
      is_default_image?: boolean
    }
    email?: string
    has_email?: boolean
    email_needs_agreement?: boolean
    is_email_valid?: boolean
    is_email_verified?: boolean
  }
}

export interface KakaoProfile {
  provider: 'kakao'
  id: number
  username?: string
  displayName?: string
  _raw: string
  _json: KakaoRawProfile
}
