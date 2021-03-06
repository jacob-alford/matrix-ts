/**
 * A quaternion is a 4-component analog to complex numbers. Useful in a handful of cases
 * like the effecient and safe rotation of a 3-dimensional vector
 *
 * @since 1.0.0
 */
import * as Eq_ from 'fp-ts/Eq'
import * as IO from 'fp-ts/IO'
import * as Mg from 'fp-ts/Magma'
import * as Mn from 'fp-ts/Monoid'
import * as Sg from 'fp-ts/Semigroup'
import * as Sh from 'fp-ts/Show'
import * as N from 'fp-ts/number'
import { pipe } from 'fp-ts/function'

import * as Auto from './Automorphism'
import * as Iso from './Iso'
import * as TC from './typeclasses'
import * as V from './Vector'
import * as Inf from './infix'

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export interface Quaternion {
  a: number
  b: number
  c: number
  d: number
}

// ####################
// ### Constructors ###
// ####################

/**
 * @since 1.0.0
 * @category Constructors
 */
export const zero: Quaternion = { a: 0, b: 0, c: 0, d: 0 }

/**
 * @since 1.0.0
 * @category Constructors
 */
export const one: Quaternion = { a: 1, b: 0, c: 0, d: 0 }

/**
 * @since 1.0.0
 * @category Constructors
 */
export const scalar: (a: number) => Quaternion = a => ({ a, b: 0, c: 0, d: 0 })

/**
 * @since 1.0.0
 * @category Constructors
 */
export const i: Quaternion = { a: 0, b: 1, c: 0, d: 0 }

/**
 * @since 1.0.0
 * @category Constructors
 */
export const j: Quaternion = { a: 0, b: 0, c: 1, d: 0 }

/**
 * @since 1.0.0
 * @category Constructors
 */
export const k: Quaternion = { a: 0, b: 0, c: 0, d: 1 }

/**
 * @since 1.0.0
 * @category Constructors
 */
export const of: (a: number, b: number, c: number, d: number) => Quaternion = (
  a,
  b,
  c,
  d
) => ({ a, b, c, d })

/**
 * @since 1.0.0
 * @category Constructors
 */
export const fromVector4: (v: V.Vec<4, number>) => Quaternion = a =>
  pipe(V.toTuple(a), ([a, b, c, d]) => ({ a, b, c, d }))

/**
 * @since 1.0.0
 * @category Constructors
 */
export const fromVector3: (v: V.Vec<3, number>) => Quaternion = a =>
  pipe(V.toTuple(a), ([b, c, d]) => ({ a: 0, b, c, d }))

/**
 * @since 1.0.0
 * @category Constructors
 */
export const randQuaternion: (min: number, max: number) => IO.IO<Quaternion> =
  (low, high) => () =>
    of(
      (high - low + 1) * Math.random() + low,
      (high - low + 1) * Math.random() + low,
      (high - low + 1) * Math.random() + low,
      (high - low + 1) * Math.random() + low
    )

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const Eq: Eq_.Eq<Quaternion> = Eq_.struct({
  a: N.Eq,
  b: N.Eq,
  c: N.Eq,
  d: N.Eq,
})

/**
 * @since 1.0.0
 * @category Instances
 */
export const MagmaSub: Mg.Magma<Quaternion> = {
  concat: (x, y) => ({ a: x.a - y.a, b: x.b - y.b, c: x.c - y.c, d: x.d - y.d }),
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const SemigroupSum: Sg.Semigroup<Quaternion> = {
  concat: (x, y) => ({ a: x.a + y.a, b: x.b + y.b, c: x.c + y.c, d: x.d + y.d }),
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const SemigroupProduct: Sg.Semigroup<Quaternion> = {
  concat: ({ a: a1, b: b1, c: c1, d: d1 }, { a: a2, b: b2, c: c2, d: d2 }) => ({
    a: a1 * a2 - b1 * b2 - c1 * c2 - d1 * d2,
    b: a1 * b2 + b1 * a2 + c1 * d2 - d1 * c2,
    c: a1 * c2 - b1 * d2 + c1 * a2 + d1 * b2,
    d: a1 * d2 + b1 * c2 - c1 * b2 + d1 * a2,
  }),
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const MonoidSum: Mn.Monoid<Quaternion> = {
  ...SemigroupSum,
  empty: zero,
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const MonoidProduct: Mn.Monoid<Quaternion> = {
  ...SemigroupProduct,
  empty: one,
}

/**
 * @since 1.0.0
 * @category Instance Operations
 */
export const recip: (q: Quaternion) => Quaternion = ({ a, b, c, d }) =>
  Bimodule.leftScalarMul(1 / (a ** 2 + b ** 2 + c ** 2 + d ** 2), conj({ a, b, c, d }))

/**
 * @since 1.0.0
 * @category Instances
 */
export const DivisionRing: TC.DivisionRing<Quaternion> = {
  add: MonoidSum.concat,
  zero: MonoidSum.empty,
  mul: MonoidProduct.concat,
  one: MonoidProduct.empty,
  sub: MagmaSub.concat,
  recip,
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const Show: Sh.Show<Quaternion> = {
  show: ({ a, b, c, d }) => `${a}+${b}i+${c}j+${d}k`,
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const AdditiveAbelianGroup: TC.AbelianGroup<Quaternion> = {
  ...MonoidSum,
  inverse: a => DivisionRing.sub(MonoidSum.empty, a),
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule: TC.Bimodule<Quaternion, number> = {
  ...AdditiveAbelianGroup,
  leftScalarMul: (r, x) => ({ a: r * x.a, b: r * x.b, c: r * x.c, d: r * x.d }),
  rightScalarMul: (x, r) => ({ a: r * x.a, b: r * x.b, c: r * x.c, d: r * x.d }),
}

/**
 * @since 1.0.0
 * @category Instance Operations
 */
export const rotateVector: (
  axis: V.Vec<3, number>,
  theta: number
) => (v: V.Vec<3, number>) => V.Vec<3, number> = (axis, theta) => {
  const q = getRotationQuaternion(axis)(theta)
  const qi = recip(q)
  return p => pipe(DivisionRing.mul(q, DivisionRing.mul(fromVector3(p), qi)), toVector3)
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const getRotationAutomorphism: (
  axis: V.Vec<3, number>,
  theta: number
) => Auto.Automorphism<V.Vec<3, number>> = (axis, theta) => {
  const q = getRotationQuaternion(axis)(theta)
  const qi = recip(q)
  return {
    get: p => pipe(mul(q, mul(fromVector3(p), qi)), toVector3),
    reverseGet: p => pipe(mul(qi, mul(fromVector3(p), q)), toVector3),
  }
}

// #############
// ### Infix ###
// #############

/**
 * @since 1.0.0
 * @category Infix
 */
export const _ = Inf.getDivisionRingInfix(DivisionRing)

/**
 * @since 1.0.0
 * @category Infix
 */
export const $_ = Inf.getDivisionRingPolishInfix(DivisionRing)

/**
 * @since 1.0.0
 * @category Infix
 */
export const _$ = Inf.getDivisionRingReversePolishInfix(DivisionRing)

// ###################
// ### Destructors ###
// ###################

/**
 * @since 1.0.0
 * @category Destructors
 */
export const toVector4: (q: Quaternion) => V.Vec<4, number> = ({ a, b, c, d }) =>
  V.fromTuple([a, b, c, d])

/**
 * **Note:** Disregards the real part of a quaternion
 *
 * @since 1.0.0
 * @category Destructors
 */
export const toVector3: (q: Quaternion) => V.Vec<3, number> = ({ b, c, d }) =>
  V.fromTuple([b, c, d])

/**
 * @since 1.0.0
 * @category Destructors
 */
export const norm: (q: Quaternion) => number = q =>
  Math.sqrt(q.a ** 2 + q.b ** 2 + q.c ** 2 + q.d ** 2)

// ####################
// ### Isomorphisms ###
// ####################

/**
 * @since 1.0.0
 * @category Destructors
 */
export const IsoVector4: Iso.Iso<Quaternion, V.Vec<4, number>> = {
  get: toVector4,
  reverseGet: fromVector4,
}

// ######################
// ### Quaternion Ops ###
// ######################

/**
 * @since 1.0.0
 * @category Quaternion Ops
 */
export const asUnit: (q: Quaternion) => Quaternion = q =>
  Bimodule.leftScalarMul(1 / norm(q), q)

/**
 * @since 1.0.0
 * @category Quaternion Ops
 */
export const getRotationQuaternion: (
  axis: V.Vec<3, number>
) => (theta: number) => Quaternion = axis => theta =>
  DivisionRing.add(
    scalar(Math.cos(theta / 2)),
    Bimodule.leftScalarMul(Math.sin(theta / 2), asUnit(fromVector3(axis)))
  )

/**
 * @since 1.0.0
 * @category Quaternion Ops
 */
export const conj: (q: Quaternion) => Quaternion = ({ a, b, c, d }) => of(a, -b, -c, -d)

// ###############
// ### Aliases ###
// ###############

/**
 * @since 1.0.0
 * @category Aliases
 */
export const add = DivisionRing.add

/**
 * @since 1.0.0
 * @category Aliases
 */
export const sub = DivisionRing.sub

/**
 * @since 1.0.0
 * @category Aliases
 */
export const mul = DivisionRing.mul

/**
 * @since 1.0.0
 * @category Aliases
 */
export const div: (x: Quaternion, y: Quaternion) => Quaternion = (x, y) =>
  DivisionRing.mul(x, DivisionRing.recip(y))
