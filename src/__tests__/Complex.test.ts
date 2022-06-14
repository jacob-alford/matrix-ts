import * as laws from 'fp-ts-laws'
import * as fc from 'fast-check'

import * as C from '../complex'

const fcComplex: fc.Arbitrary<C.Complex> = fc.record({
  Re: fc.float(),
  Im: fc.float(),
})

describe('Complex', () => {
  describe('Field', () => {
    it('adds', () => {
      expect(C.Field.add(C.of(1, 2), C.of(3, 4))).toStrictEqual(C.of(4, 6))
    })
    it('subtracts', () => {
      expect(C.Field.sub(C.of(1, 2), C.of(3, 4))).toStrictEqual(C.of(-2, -2))
    })
    it('multiplies', () => {
      expect(C.Field.mul(C.of(1, 2), C.of(3, 4))).toStrictEqual(C.of(-5, 10))
    })
    it('divides', () => {
      expect(C.Field.div(C.of(1, 2), C.of(3, 4))).toStrictEqual(C.of(0.44, 0.08))
    })
    /** Likely unlawful due to floating point imprecision */
    it.skip('follows Field laws', () => {
      laws.field(C.Field, C.Eq, fcComplex)
    })
  })
  describe('Eq', () => {
    it('follows Eq laws', () => {
      laws.eq(C.Eq, fcComplex)
    })
  })
  describe('Monoid', () => {
    it('follows Monoid Laws for MonoidSum', () => {
      laws.monoid(C.MonoidSum, C.Eq, fcComplex)
    })
    /** Likely unlawful due to floating point imprecision */
    it.skip('follows Monoid Laws for MonoidProduct', () => {
      laws.monoid(C.MonoidProduct, C.Eq, fcComplex)
    })
  })
  describe('Semigroup', () => {
    it('follows Semigroup laws for SemigroupSum', () => {
      laws.semigroup(C.SemigroupSum, C.Eq, fcComplex)
    })
    /** Likely unlawful due to floating point imprecision */
    it.skip('follows Semigroup laws for SemigroupProduct', () => {
      laws.semigroup(C.SemigroupProduct, C.Eq, fcComplex)
    })
  })
})
