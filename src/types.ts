export interface KakaoStrategyOptions {
  clientID: string
  clientSecret?: string
  callbackURL: string
  scope?: string | string[]
  scopeSeparator?: string
  customHeaders?: Record<string, string>
  userAgent?: string
}

export interface KakaoAccount {
  profile_needs_agreement?: boolean
  profile?: {
    nickname?: string
    thumbnail_image_url?: string
    profile_image_url?: string
    is_default_image?: boolean
  }
  name_needs_agreement?: boolean
  name?: string
  email_needs_agreement?: boolean
  has_email?: boolean
  is_email_valid?: boolean
  is_email_verified?: boolean
  email?: string
  age_range_needs_agreement?: boolean
  has_age_range?: boolean
  age_range?: string
  birthday_needs_agreement?: boolean
  has_birthday?: boolean
  birthday?: string
  birthyear_needs_agreement?: boolean
  has_birthyear?: boolean
  birthyear?: string
  gender_needs_agreement?: boolean
  has_gender?: boolean
  gender?: 'male' | 'female'
}

export interface KakaoRawProfile {
  id: number
  connected_at?: string
  properties?: {
    nickname?: string
    profile_image?: string
    thumbnail_image?: string
  }
  kakao_account?: KakaoAccount
}

export interface KakaoProfile {
  provider: 'kakao'
  id: number
  username?: string
  displayName?: string
  _raw: string
  _json: KakaoRawProfile
}
