import { describe, expect, it } from 'vitest'

import * as entrypoint from '../src/index'
import { KakaoStrategy } from '../src/strategy'

describe('index', () => {
  it('exports Strategy and default as KakaoStrategy', () => {
    expect(entrypoint.Strategy).toBe(KakaoStrategy)
    expect(entrypoint.default).toBe(KakaoStrategy)
  })

  it('re-exports buildStrategyOptions', () => {
    expect(entrypoint.buildStrategyOptions).toBeTypeOf('function')
  })
})
