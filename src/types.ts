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
  /** Kakao member id. */
  id: number
  /** Whether the manual-connect API call has completed. */
  has_signed_up?: boolean
  /** UTC timestamp when the app connected to the account. */
  connected_at?: string
  /** UTC timestamp of the Kakao Sync simple-signup login. */
  synched_at?: string
  properties?: {
    nickname?: string
    profile_image?: string
    thumbnail_image?: string
  }
  kakao_account?: {
    /** Whether profile info (nickname/photo) provision is agreed. */
    profile_needs_agreement?: boolean
    /** Whether nickname provision is agreed. */
    profile_nickname_needs_agreement?: boolean
    /** Whether profile photo provision is agreed. */
    profile_image_needs_agreement?: boolean
    profile?: {
      nickname?: string
      thumbnail_image_url?: string
      profile_image_url?: string
      is_default_image?: boolean
      /** Whether the nickname is Kakao's default placeholder. */
      is_default_nickname?: boolean
    }
    /** Whether name provision is agreed. */
    name_needs_agreement?: boolean
    /** Kakao account name. */
    name?: string
    /** Whether email provision is agreed. */
    email_needs_agreement?: boolean
    /** @deprecated Cannot be used to check field availability; use `email_needs_agreement` instead. */
    has_email?: boolean
    /** Whether the email is a valid, undeleted Kakao account email. */
    is_email_valid?: boolean
    /** Whether the email has been verified. */
    is_email_verified?: boolean
    /** Primary Kakao account email. */
    email?: string
    /** Whether age range provision is agreed. */
    age_range_needs_agreement?: boolean
    /** @deprecated Cannot be used to check field availability; use `age_range_needs_agreement` instead. */
    has_age_range?: boolean
    /** Age range, e.g. "20~29". */
    age_range?: string
    /** Whether birthday provision is agreed. */
    birthday_needs_agreement?: boolean
    /** @deprecated Cannot be used to check field availability; use `birthday_needs_agreement` instead. */
    has_birthday?: boolean
    /** Birthday in MMDD format. */
    birthday?: string
    /** Birthday calendar type. */
    birthday_type?: 'SOLAR' | 'LUNAR'
    /** Whether the lunar birthday falls in a leap month. */
    is_leap_month?: boolean
    /** Whether birth year provision is agreed. */
    birthyear_needs_agreement?: boolean
    /** @deprecated Cannot be used to check field availability; use `birthyear_needs_agreement` instead. */
    has_birthyear?: boolean
    /** Birth year in YYYY format. */
    birthyear?: string
    /** Whether gender provision is agreed. */
    gender_needs_agreement?: boolean
    /** @deprecated Cannot be used to check field availability; use `gender_needs_agreement` instead. */
    has_gender?: boolean
    gender?: 'male' | 'female'
    /** Whether phone number provision is agreed. */
    phone_number_needs_agreement?: boolean
    /** Kakao account phone number. */
    phone_number?: string
    /** Whether CI (connecting information) provision is agreed. */
    ci_needs_agreement?: boolean
    /** Connecting information (CI). */
    ci?: string
    /** UTC timestamp when the CI was issued. */
    ci_authenticated_at?: string
  }
  /** Additional partner-linkage info. */
  for_partner?: {
    uuid?: string
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
