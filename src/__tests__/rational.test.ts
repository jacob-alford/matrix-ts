import * as Q from '../rational'

const { _ } = Q

describe('Rational', () => {
  describe('Field laws', () => {
    const rand = Q.randRational(-5_000, 5_000)
    it('abides additive unitor', () => {
      const test = rand()
      expect(_(test, '+', Q.zero)).toStrictEqual(test)
      expect(_(Q.zero, '+', test)).toStrictEqual(test)
    })
    it('abides multiplicative unitor', () => {
      const test = rand()
      expect(_(test, '*', Q.one)).toStrictEqual(test)
      expect(_(Q.one, '*', test)).toStrictEqual(test)
    })
    it('associates with addition', () => {
      const a = rand()
      const b = rand()
      const c = rand()
      expect(_(a, '+', _(b, '+', c))).toStrictEqual(_(_(a, '+', b), '+', c))
    })
    /** This appears to fail with large numbers */
    it('associates with multiplication', () => {
      const a = rand()
      const b = rand()
      const c = rand()
      expect(_(a, '*', _(b, '*', c))).toStrictEqual(_(_(a, '*', b), '*', c))
    })
    it('commutes with addition', () => {
      const a = rand()
      const b = rand()
      expect(_(a, '+', b)).toStrictEqual(_(b, '+', a))
    })
    it('commutes with multiplication', () => {
      const a = rand()
      const b = rand()
      expect(_(a, '*', b)).toStrictEqual(_(b, '*', a))
    })
    /** This appears to fail with large numbers */
    it('distributes multiplication over addition', () => {
      const a = rand()
      const b = rand()
      const c = rand()
      expect(_(a, '*', _(b, '+', c))).toStrictEqual(_(_(a, '*', b), '+', _(a, '*', c)))
      expect(_(_(a, '+', b), '*', c)).toStrictEqual(_(_(a, '*', c), '+', _(b, '*', c)))
    })
    it('has an additive inverse', () => {
      const a = rand()
      expect(_(a, '-', a)).toStrictEqual(Q.zero)
    })
    it('has a multiplicative inverse', () => {
      const a = rand()
      expect(_(a, '/', a)).toStrictEqual(Q.one)
    })
  })
})
