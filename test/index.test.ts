import { describe, expect, it } from 'vitest'

import * as entrypoint from '../src/index'
import { KakaoStrategy } from '../src/strategy'

describe('index', () => {
  it('Strategy와 default export가 KakaoStrategy를 가리킨다', () => {
    expect(entrypoint.Strategy).toBe(KakaoStrategy)
    expect(entrypoint.default).toBe(KakaoStrategy)
  })

  it('buildStrategyOptions를 재수출한다', () => {
    expect(entrypoint.buildStrategyOptions).toBeTypeOf('function')
  })
})
