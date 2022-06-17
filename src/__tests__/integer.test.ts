import * as Int from '../integer'

const { _ } = Int

describe('Int', () => {
  describe('EuclidianRing laws', () => {
    const rand = Int.randInt(-1_000_000, 1_000_000)
    it('abides additive unitor', () => {
      const test = rand()
      expect(_(test, '+', Int.zero)).toBe(test)
      expect(_(Int.zero, '+', test)).toBe(test)
    })
    it('abides multiplicative unitor', () => {
      const test = rand()
      expect(_(test, '*', Int.one)).toBe(test)
      expect(_(Int.one, '*', test)).toBe(test)
    })
    it('associates with addition', () => {
      const a = rand()
      const b = rand()
      const c = rand()
      expect(_(a, '+', _(b, '+', c))).toBe(_(_(a, '+', b), '+', c))
    })
    /** This appears to fail with large numbers */
    it('associates with multiplication', () => {
      const a = rand()
      const b = rand()
      const c = rand()
      expect(_(a, '*', _(b, '*', c))).toBe(_(_(a, '*', b), '*', c))
    })
    it('commutes with addition', () => {
      const a = rand()
      const b = rand()
      expect(_(a, '+', b)).toBe(_(b, '+', a))
    })
    it('commutes with multiplication', () => {
      const a = rand()
      const b = rand()
      expect(_(a, '*', b)).toBe(_(b, '*', a))
    })
    it('distributes multiplication over addition', () => {
      const a = rand()
      const b = rand()
      const c = rand()
      expect(_(a, '*', _(b, '+', c))).toBe(_(_(a, '*', b), '+', _(a, '*', c)))
      expect(_(_(a, '+', b), '*', c)).toBe(_(_(a, '*', c), '+', _(b, '*', c)))
    })
    it('has an additive inverse', () => {
      const a = rand()
      expect(_(a, '-', a)).toBe(Int.zero)
    })
    it('has a multiplicative inverse', () => {
      const a = rand()
      expect(_(a, '/', a)).toBe(Int.one)
    })
  })
})
