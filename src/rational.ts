import * as Eq_ from 'fp-ts/Eq'
import * as IO from 'fp-ts/IO'
import * as Fld from 'fp-ts/Field'
import * as Mg from 'fp-ts/Magma'
import * as Mn from 'fp-ts/Monoid'
import * as Sg from 'fp-ts/Semigroup'
import * as N from 'fp-ts/number'
import * as Ord_ from 'fp-ts/Ord'
import * as O from 'fp-ts/Option'
import * as Sh from 'fp-ts/Show'
import { identity, pipe, unsafeCoerce } from 'fp-ts/function'

import * as Inf from './infix'
import * as Int from './integer'
import * as TC from './typeclasses'

const RationalSymbol = Symbol('Rational')
type RationalSymbol = typeof RationalSymbol

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export interface Rational {
  readonly _URI: RationalSymbol
  readonly top: Int.Int
  readonly bottom: Int.Int
}

// ####################
// ### Constructors ###
// ####################

/**
 * @since 1.0.0
 * @category Constructors
 */
const wrap: (top: Int.Int, bottom: Int.Int) => Rational = (top, bottom) =>
  unsafeCoerce({ top, bottom })

/**
 * @since 1.0.0
 * @category Constructors
 */
export const of: (top: Int.Int, bottom: Int.Int) => O.Option<Rational> = (top, bottom) =>
  bottom === 0 ? O.none : O.some(reduce(top, bottom))

/**
 * @since 1.0.0
 * @category Constructors
 */
export const zero: Rational = wrap(Int.zero, Int.one)

/**
 * @since 1.0.0
 * @category Constructors
 */
export const one: Rational = wrap(Int.one, Int.one)

/**
 * @since 1.0.0
 * @category Constructors
 */
export const randRational: (low: number, high: number) => IO.IO<Rational> =
  (low, high) => () =>
    reduce(
      Math.floor((high - low + 1) * Math.random() + low),
      Math.floor((high - low + 1) * Math.random() + low)
    )

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const Eq: Eq_.Eq<Rational> = Eq_.struct({
  top: N.Eq,
  bottom: N.Eq,
})

/**
 * @since 1.0.0
 * @category Instances
 */
export const Ord: Ord_.Ord<Rational> = pipe(
  N.Ord,
  Ord_.contramap(({ top, bottom }) => top / bottom)
)

/**
 * @since 1.0.0
 * @category Instances
 */
export const MagmaSub: Mg.Magma<Rational> = {
  concat: ({ top: a, bottom: b }, { top: c, bottom: d }) => reduce(a * d - b * c, b * d),
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const SemigroupSum: Sg.Semigroup<Rational> = {
  concat: ({ top: a, bottom: b }, { top: c, bottom: d }) => reduce(a * d + b * c, b * d),
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const SemigroupProduct: Sg.Semigroup<Rational> = {
  concat: ({ top: a, bottom: b }, { top: c, bottom: d }) => reduce(a * c, b * d),
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const MonoidSum: Mn.Monoid<Rational> = {
  ...SemigroupSum,
  empty: zero,
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const MonoidProduct: Mn.Monoid<Rational> = {
  ...SemigroupProduct,
  empty: one,
}

/**
 * Adapted from Purescript:
 * https://github.com/purescript/purescript-prelude/blob/v6.0.0/src/Data/EuclideanRing.js
 *
 * @since 1.0.0
 * @category Instances
 */
export const Field: Fld.Field<Rational> = {
  add: MonoidSum.concat,
  zero,
  sub: MagmaSub.concat,
  mul: MonoidProduct.concat,
  one,
  div: ({ top: a, bottom: b }, { top: c, bottom: d }) => reduce(a * d, b * c),
  mod: () => zero,
  degree: () => 0,
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const Show: Sh.Show<Rational> = {
  show: ({ top, bottom }) => `${top}/${bottom}`,
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const Conjugate: TC.Conjugate<Rational> = {
  conj: identity,
}

// #############
// ### Infix ###
// #############

/**
 * @since 1.0.0
 * @category Infix
 */
export const _ = Inf.getFieldInfix(Field)

/**
 * @since 1.0.0
 * @category Infix
 */
export const __ = Inf.getFieldPolishInfix(Field)

/**
 * @since 1.0.0
 * @category Infix
 */
export const _ord = Inf.getOrdInfix(Ord)

/**
 * @since 1.0.0
 * @category Infix
 */
export const __ord = Inf.getOrdPolishInfix(Ord)

// ################
// ### Internal ###
// ################

/**
 * @since 1.0.0
 * @category Internal
 */
const reduce: (n: number, d: number) => Rational = (n, d) => {
  const g = Fld.gcd(N.Eq, N.Field)(n, d)
  const dp = d / g
  return wrap(Int.fromNumber((n / g) * Math.sign(dp)), Int.fromNumber(Math.abs(dp)))
}
