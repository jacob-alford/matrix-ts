import * as C from '../complex'

const { _ } = C

describe('Complex', () => {
  describe('Field laws', () => {
    const rand = C.randComplex(-5_000, 5_000)
    it('abides additive unitor', () => {
      const test = rand()
      expect(_(test, '+', C.zero)).toStrictEqual(test)
      expect(_(C.zero, '+', test)).toStrictEqual(test)
    })
    it('abides multiplicative unitor', () => {
      const test = rand()
      expect(_(test, '*', C.one)).toStrictEqual(test)
      expect(_(C.one, '*', test)).toStrictEqual(test)
    })
    /** This appears to fail with large numbers */
    it('associates with addition', () => {
      const a = rand()
      const b = rand()
      const c = rand()
      const { Re: Re1, Im: Im1 } = _(a, '+', _(b, '+', c))
      const { Re: Re2, Im: Im2 } = _(_(a, '+', b), '+', c)
      expect(Re1).toBeCloseTo(Re2)
      expect(Im1).toBeCloseTo(Im2)
    })
    /** This appears to fail with large numbers */
    it('associates with multiplication', () => {
      const a = rand()
      const b = rand()
      const c = rand()
      const { Re: Re1, Im: Im1 } = _(_(a, '*', b), '*', c)
      const { Re: Re2, Im: Im2 } = _(a, '*', _(b, '*', c))
      expect(Re1).toBeCloseTo(Re2)
      expect(Im1).toBeCloseTo(Im2)
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
    it('distributes multiplication over addition', () => {
      const a = rand()
      const b = rand()
      const c = rand()
      const { Re: Re1l, Im: Im1l } = _(a, '*', _(b, '+', c))
      const { Re: Re2l, Im: Im2l } = _(_(a, '*', b), '+', _(a, '*', c))
      const { Re: Re1r, Im: Im1r } = _(_(a, '+', b), '*', c)
      const { Re: Re2r, Im: Im2r } = _(_(a, '*', c), '+', _(b, '*', c))

      expect(Re1l).toBeCloseTo(Re2l)
      expect(Im1l).toBeCloseTo(Im2l)
      expect(Re1r).toBeCloseTo(Re2r)
      expect(Im1r).toBeCloseTo(Im2r)
    })
    it('has an additive inverse', () => {
      const a = rand()
      expect(_(a, '-', a)).toStrictEqual(C.zero)
    })
    it('has a multiplicative inverse', () => {
      const a = rand()
      expect(_(a, '/', a)).toStrictEqual(C.one)
    })
  })
})
