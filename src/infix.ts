/**
 * A module for making uniform APIs for similar operations across different typeclass
 * instances. For example, `_(a, "+", b)` could be applied to a rational Field instance,
 * or a matrix AbelianGroup instance for adding together two fractions or matricies respectively.
 *
 * @since 1.0.0
 */
import * as Eq from 'fp-ts/Eq'
import * as Fld from 'fp-ts/Field'
import * as Mn from 'fp-ts/Monoid'
import * as Rng from 'fp-ts/Ring'
import * as Ord from 'fp-ts/Ord'
import { flow } from 'fp-ts/function'

import * as TC from './typeclasses'

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type MonoidSymbol = '<>'

/**
 * @since 1.0.0
 * @category Model
 */
export type AbelianGroupSymbol = '+' | '-'

/**
 * @since 1.0.0
 * @category Model
 */
export type LeftModuleSymbol = '.*'

/**
 * @since 1.0.0
 * @category Model
 */
export type RightModuleSymbol = '*.'

/**
 * @since 1.0.0
 * @category Model
 */
export type RingSymbol = AbelianGroupSymbol | '*'

/**
 * @since 1.0.0
 * @category Model
 */
export type DivisionRingSymbol = RingSymbol | '/.' | './'

/**
 * @since 1.0.0
 * @category Model
 */
export type EuclideanRingSymbol = RingSymbol | '/'

/**
 * @since 1.0.0
 * @category Model
 */
export type FieldSymbol = EuclideanRingSymbol | '%'

/**
 * @since 1.0.0
 * @category Model
 */
export type EqSymbol = '==' | '!='

/**
 * @since 1.0.0
 * @category Model
 */
export type OrdSymbol = EqSymbol | '<' | '<=' | '>' | '>='

// ####################
// ### Constructors ###
// ####################

/**
 * Infix operators can sometimes be more convenient than using the full typeclass instance
 *
 * @since 1.0.0
 * @example
 *   import { makePolishInfix } from '@jacob-alford/matrix-ts/infix'
 *   import * as H from '@jacob-alford/matrix-ts/quaternion'
 *
 *   type QuatSymbol = '+' | '-' | '*' | '/'
 *
 *   const _ = makePolishInfix<QuatSymbol, H.Quaternion, H.Quaternion, H.Quaternion>({
 *     '+': H.DivisionRing.add,
 *     '-': H.DivisionRing.sub,
 *     '*': H.DivisionRing.mul,
 *     '/': (x, y) => H.DivisionRing.mul(x, H.DivisionRing.recip(y)),
 *   })
 *
 *   _('+', H.zero, H.zero)
 */
export const makePolishInfix: <S extends string, A, B, C>(
  fns: Readonly<Record<S, (x: A, y: B) => C>>
) => (s: S, x: A, y: B) => C = fns => (s, x, y) => {
  for (const symbol in fns) {
    if (s === symbol) {
      return fns[symbol](x, y)
    }
  }
  // this should never be reached
  throw new Error(`Unrecognized symbol ${s} supplied to polish infix`)
}

/**
 * Infix operators can sometimes be more convenient than using the full typeclass instance
 *
 * @since 1.0.0
 * @example
 *   import { makeReversePolishInfix } from '@jacob-alford/matrix-ts/infix'
 *   import * as H from '@jacob-alford/matrix-ts/quaternion'
 *
 *   type QuatSymbol = '+' | '-' | '*' | '/'
 *
 *   const _ = makeReversePolishInfix<
 *     QuatSymbol,
 *     H.Quaternion,
 *     H.Quaternion,
 *     H.Quaternion
 *   >({
 *     '+': H.DivisionRing.add,
 *     '-': H.DivisionRing.sub,
 *     '*': H.DivisionRing.mul,
 *     '/': (x, y) => H.DivisionRing.mul(x, H.DivisionRing.recip(y)),
 *   })
 *
 *   _(H.zero, H.zero, '+')
 */
export const makeReversePolishInfix: <S extends string, A, B, C>(
  fns: Readonly<Record<S, (x: A, y: B) => C>>
) => (x: A, y: B, s: S) => C = fns => (x, y, s) => {
  for (const symbol in fns) {
    if (s === symbol) {
      return fns[symbol](x, y)
    }
  }
  // this should never be reached
  throw new Error(`Unrecognized symbol ${s} supplied to polish infix`)
}

/**
 * Infix operators can sometimes be more convenient than using the full typeclass instance
 *
 * @since 1.0.0
 * @example
 *   import { makeInfix } from '@jacob-alford/matrix-ts/infix'
 *   import * as H from '@jacob-alford/matrix-ts/quaternion'
 *
 *   type QuatSymbol = '+' | '-' | '*' | '/'
 *
 *   const _ = makeInfix<QuatSymbol, H.Quaternion, H.Quaternion, H.Quaternion>({
 *     '+': H.DivisionRing.add,
 *     '-': H.DivisionRing.sub,
 *     '*': H.DivisionRing.mul,
 *     '/': (x, y) => H.DivisionRing.mul(x, H.DivisionRing.recip(y)),
 *   })
 *
 *   _(H.zero, '+', H.zero)
 */
export const makeInfix: <S extends string, A, B, C>(
  fns: Readonly<Record<S, (x: A, y: B) => C>>
) => (x: A, s: S, y: B) => C = fns => (x, s, y) => {
  for (const symbol in fns) {
    if (s === symbol) {
      return fns[symbol](x, y)
    }
  }
  // this should never be reached
  throw new Error(`Unrecognized symbol ${s} supplied to polish infix`)
}

// ################
// ### Internal ###
// ################

/**
 * @since 1.0.0
 * @category Internal
 */
const infixFromPolish: <S extends string, A, B, C>(
  f: (s: S, a: A, b: B) => C
) => (a: A, s: S, b: B) => C = f => (a, s, b) => f(s, a, b)

/**
 * @since 1.0.0
 * @category Internal
 */
const reverseFromPolish: <S extends string, A, B, C>(
  f: (s: S, a: A, b: B) => C
) => (a: A, b: B, s: S) => C = f => (a, b, s) => f(s, a, b)

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const getAbGrpPolishInfix: <A>(
  M: TC.AbelianGroup<A>
) => (s: AbelianGroupSymbol, x: A, y: A) => A = G =>
  makePolishInfix({
    '+': G.concat,
    '-': (x, y) => G.concat(x, G.inverse(y)),
  })

/**
 * @since 1.0.0
 * @category Instances
 */
export const getAbGrpReversePolishInfix = flow(getAbGrpPolishInfix, reverseFromPolish)

/**
 * @since 1.0.0
 * @category Instances
 */
export const getAbGrpInfix = flow(getAbGrpPolishInfix, infixFromPolish)

/**
 * @since 1.0.0
 * @category Instances
 */
export const getMonoidPolishInfix: <A>(
  M: Mn.Monoid<A>
) => (s: MonoidSymbol, x: A, y: A) => A = M =>
  makePolishInfix({
    '<>': M.concat,
  })

/**
 * @since 1.0.0
 * @category Instances
 */
export const getMonoidReversePolishInfix = flow(getMonoidPolishInfix, reverseFromPolish)

/**
 * @since 1.0.0
 * @category Instances
 */
export const getMonoidInfix = flow(getMonoidPolishInfix, infixFromPolish)

/**
 * @since 1.0.0
 * @category Instances
 */
export const getRingPolishInfix: <A>(
  F: Rng.Ring<A>
) => (s: RingSymbol, x: A, y: A) => A = F =>
  makePolishInfix({
    '+': F.add,
    '-': F.sub,
    '*': F.mul,
  })

/**
 * @since 1.0.0
 * @category Instances
 */
export const getRingReversePolishInfix = flow(getRingPolishInfix, reverseFromPolish)

/**
 * @since 1.0.0
 * @category Instances
 */
export const getRingInfix = flow(getRingPolishInfix, infixFromPolish)

/**
 * @since 1.0.0
 * @category Instances
 */
export const getEuclideanRingPolishInfix: <A>(
  F: TC.EuclidianRing<A>
) => (s: EuclideanRingSymbol, x: A, y: A) => A = F =>
  makePolishInfix({
    '+': F.add,
    '-': F.sub,
    '*': F.mul,
    '/': F.div,
  })

/**
 * @since 1.0.0
 * @category Instances
 */
export const getEuclideanRingReversePolishInfix = flow(
  getEuclideanRingPolishInfix,
  reverseFromPolish
)

/**
 * @since 1.0.0
 * @category Instances
 */
export const getEuclideanRingInfix = flow(getEuclideanRingPolishInfix, infixFromPolish)

/**
 * @since 1.0.0
 * @category Instances
 */
export const getDivisionRingPolishInfix: <A>(
  F: TC.DivisionRing<A>
) => (s: DivisionRingSymbol, x: A, y: A) => A = F =>
  makePolishInfix({
    '+': F.add,
    '-': F.sub,
    '*': F.mul,
    '/.': (a, b) => F.mul(a, F.recip(b)),
    './': (a, b) => F.mul(F.recip(a), b),
  })

/**
 * @since 1.0.0
 * @category Instances
 */
export const getDivisionRingReversePolishInfix = flow(
  getDivisionRingPolishInfix,
  reverseFromPolish
)

/**
 * @since 1.0.0
 * @category Instances
 */
export const getDivisionRingInfix = flow(getDivisionRingPolishInfix, infixFromPolish)

/**
 * @since 1.0.0
 * @category Instances
 */
export const getFieldPolishInfix: <A>(
  F: Fld.Field<A>
) => (s: FieldSymbol, x: A, y: A) => A = F =>
  makePolishInfix({
    '+': F.add,
    '-': F.sub,
    '*': F.mul,
    '/': F.div,
    '%': F.mod,
  })

/**
 * @since 1.0.0
 * @category Instances
 */
export const getFieldReversePolishInfix = flow(getFieldPolishInfix, reverseFromPolish)

/**
 * @since 1.0.0
 * @category Instances
 */
export const getFieldInfix = flow(getFieldPolishInfix, infixFromPolish)

/**
 * @since 1.0.0
 * @category Instances
 */
export const getEqPolishInfix: <A>(
  E: Eq.Eq<A>
) => (s: EqSymbol, x: A, y: A) => boolean = E =>
  makePolishInfix({
    '==': E.equals,
    '!=': (x, y) => !E.equals(x, y),
  })

/**
 * @since 1.0.0
 * @category Instances
 */
export const getEqReversePolishInfix = flow(getEqPolishInfix, reverseFromPolish)

/**
 * @since 1.0.0
 * @category Instances
 */
export const getEqInfix = flow(getEqPolishInfix, infixFromPolish)

/**
 * @since 1.0.0
 * @category Instances
 */
export const getOrdPolishInfix: <A>(
  O: Ord.Ord<A>
) => (s: OrdSymbol, x: A, y: A) => boolean = O =>
  makePolishInfix({
    '==': O.equals,
    '!=': (x, y) => !O.equals(x, y),
    '<': Ord.lt(O),
    '<=': Ord.leq(O),
    '>': Ord.gt(O),
    '>=': Ord.geq(O),
  })

/**
 * @since 1.0.0
 * @category Instances
 */
export const getOrdReverseInfix = flow(getOrdPolishInfix, reverseFromPolish)

/**
 * @since 1.0.0
 * @category Instances
 */
export const getOrdInfix = flow(getOrdPolishInfix, infixFromPolish)

/**
 * @since 1.0.0
 * @category Instances
 */
export const getLeftModulePolishInfix: <L, A>(
  L: TC.LeftModule<A, L>
) => (s: LeftModuleSymbol, l: L, a: A) => A = L =>
  makePolishInfix({
    '.*': L.leftScalarMul,
  })

/**
 * @since 1.0.0
 * @category Instances
 */
export const getLeftModuleReversePolishInfix = flow(
  getLeftModulePolishInfix,
  reverseFromPolish
)

/**
 * @since 1.0.0
 * @category Instances
 */
export const getLeftModuleInfix = flow(getLeftModulePolishInfix, infixFromPolish)

/**
 * @since 1.0.0
 * @category Instances
 */
export const getRightModulePolishInfix: <R, A>(
  L: TC.RightModule<A, R>
) => (s: RightModuleSymbol, a: A, r: R) => A = R =>
  makePolishInfix({
    '*.': R.rightScalarMul,
  })

/**
 * @since 1.0.0
 * @category Instances
 */
export const getRightModuleReversePolishInfix = flow(
  getRightModulePolishInfix,
  reverseFromPolish
)

/**
 * @since 1.0.0
 * @category Instances
 */
export const getRightModuleInfix = flow(getLeftModulePolishInfix, infixFromPolish)
