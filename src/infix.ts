import * as Eq from 'fp-ts/Eq'
import * as Fld from 'fp-ts/Field'
import * as Mn from 'fp-ts/Monoid'
import * as Ord from 'fp-ts/Ord'

import * as TC from './typeclasses'

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type MonoidInfix = '<>'

/**
 * @since 1.0.0
 * @category Model
 */
export type DivisionRingInfix = '+' | '-' | '*' | '/.' | './'

/**
 * @since 1.0.0
 * @category Model
 */
export type EuclideanRingInfix = '+' | '-' | '*' | '/'

/**
 * @since 1.0.0
 * @category Model
 */
export type FieldInfix = EuclideanRingInfix | '%'

/**
 * @since 1.0.0
 * @category Model
 */
export type EqInfix = '==' | '!='

/**
 * @since 1.0.0
 * @category Model
 */
export type OrdInfix = EqInfix | '<' | '<=' | '>' | '>='

// ####################
// ### Constructors ###
// ####################

/**
 * Infix operators can sometimes be more convenient than using the full typeclass instance
 *
 * @since 1.0.0
 * @example
 *   import { makePolishBinaryInfix } from 'matrix-ts/infix'
 *   import * as H from 'matrix-ts/quaternion'
 *
 *   const _ = makePolishBinaryInfix({
 *     '+': H.DivisionRing.add,
 *     '-': H.DivisionRing.sub,
 *     '*': H.DivisionRing.mul,
 *     '/': H.DivisionRing.div,
 *   })
 *
 *   const zero = _('+')(H.zero)(H.zero)
 */
export const makePolishBinaryInfix: <S extends string, A, B>(
  fns: Readonly<Record<S, (x: A, y: A) => B>>
) => (s: S) => (x: A, y: A) => B = fns => s => (x, y) => {
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
 *   import { makeBinaryInfix } from 'matrix-ts/infix'
 *   import * as H from 'matrix-ts/quaternion'
 *
 *   const _ = makeBinaryInfix({
 *     '+': H.DivisionRing.add,
 *     '-': H.DivisionRing.sub,
 *     '*': H.DivisionRing.mul,
 *     '/': H.DivisionRing.div,
 *   })
 *
 *   const one = _(H.zero, '+', H.one)
 */
export const makeBinaryInfix: <S extends string, A, B>(
  fns: Readonly<Record<S, (x: A, y: A) => B>>
) => (x: A, s: S, y: A) => B = fns => (x, s, y) => {
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
 *   import { makeUnaryInfix } from 'matrix-ts/infix'
 *   import * as H from 'matrix-ts/quaternion'
 *
 *   type BooleanInfix = '!'
 *
 *   const _ = makeUnaryInfix<BooleanInfix, boolean, boolean>({
 *   '!': b => !b
 *   })
 *
 *   const false = _('!', true)
 */
export const makeUnaryInfix: <S extends string, A, B>(
  fns: Readonly<Record<S, (x: A) => B>>
) => (s: S) => (x: A) => B = fns => s => x => {
  for (const symbol in fns) {
    if (s === symbol) {
      return fns[symbol](x)
    }
  }
  // this should never be reached
  throw new Error(`Unrecognized symbol ${s} supplied to polish infix`)
}

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const getMonoidPolishInfix: <A>(
  M: Mn.Monoid<A>
) => (s: MonoidInfix) => (x: A, y: A) => A = M =>
  makePolishBinaryInfix({
    '<>': M.concat,
  })

/**
 * @since 1.0.0
 * @category Instances
 */
export const getMonoidInfix: <A>(
  M: Mn.Monoid<A>
) => (x: A, s: MonoidInfix, y: A) => A = M =>
  makeBinaryInfix({
    '<>': M.concat,
  })

/**
 * @since 1.0.0
 * @category Instances
 */
export const getEuclideanRingPolishInfix: <A>(
  F: TC.EuclidianRing<A>
) => (s: EuclideanRingInfix) => (x: A, y: A) => A = F =>
  makePolishBinaryInfix({
    '+': F.add,
    '-': F.sub,
    '*': F.mul,
    '/': F.div,
  })

/**
 * @since 1.0.0
 * @category Instances
 */
export const getEuclideanRingInfix: <A>(
  F: TC.EuclidianRing<A>
) => (x: A, s: EuclideanRingInfix, y: A) => A = F =>
  makeBinaryInfix({
    '+': F.add,
    '-': F.sub,
    '*': F.mul,
    '/': F.div,
  })

/**
 * @since 1.0.0
 * @category Instances
 */
export const getDivisionRingPolishInfix: <A>(
  F: TC.DivisionRing<A>
) => (s: DivisionRingInfix) => (x: A, y: A) => A = F =>
  makePolishBinaryInfix({
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
export const getDivisionRingInfix: <A>(
  F: TC.DivisionRing<A>
) => (x: A, s: DivisionRingInfix, y: A) => A = F =>
  makeBinaryInfix({
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
export const getFieldPolishInfix: <A>(
  F: Fld.Field<A>
) => (s: FieldInfix) => (x: A, y: A) => A = F =>
  makePolishBinaryInfix({
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
export const getFieldInfix: <A>(
  F: Fld.Field<A>
) => (x: A, s: FieldInfix, y: A) => A = F =>
  makeBinaryInfix({
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
export const getEqPolishInfix: <A>(
  E: Eq.Eq<A>
) => (s: EqInfix) => (x: A, y: A) => boolean = E =>
  makePolishBinaryInfix({
    '==': E.equals,
    '!=': (x, y) => !E.equals(x, y),
  })

/**
 * @since 1.0.0
 * @category Instances
 */
export const getEqInfix: <A>(E: Eq.Eq<A>) => (x: A, s: EqInfix, y: A) => boolean = E =>
  makeBinaryInfix({
    '==': E.equals,
    '!=': (x, y) => !E.equals(x, y),
  })

/**
 * @since 1.0.0
 * @category Instances
 */
export const getOrdPolishInfix: <A>(
  O: Ord.Ord<A>
) => (s: OrdInfix) => (x: A, y: A) => boolean = O =>
  makePolishBinaryInfix({
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
export const getOrdInfix: <A>(
  O: Ord.Ord<A>
) => (x: A, s: OrdInfix, y: A) => boolean = O =>
  makeBinaryInfix({
    '==': O.equals,
    '!=': (x, y) => !O.equals(x, y),
    '<': Ord.lt(O),
    '<=': Ord.leq(O),
    '>': Ord.gt(O),
    '>=': Ord.geq(O),
  })
