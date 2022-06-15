import * as Eq_ from 'fp-ts/Eq'
import * as Mg from 'fp-ts/Magma'
import * as Mn from 'fp-ts/Monoid'
import * as Sg from 'fp-ts/Semigroup'
import * as Fld from 'fp-ts/Field'
import * as Sh from 'fp-ts/Show'
import * as N from 'fp-ts/number'
import { pipe } from 'fp-ts/function'

import * as C from './complex'
import * as Iso from './Iso'
import * as LM from './LinearMap'
import * as M from './MatrixC'
import * as TC from './typeclasses'
import * as V from './VectorC'

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
export const fromVector4: (v: V.VecC<4, number>) => Quaternion = a =>
  pipe(V.toTuple(a), ([a, b, c, d]) => ({ a, b, c, d }))

/**
 * @since 1.0.0
 * @category Constructors
 */
export const fromVector3: (v: V.VecC<3, number>) => Quaternion = a =>
  pipe(V.toTuple(a), ([b, c, d]) => ({ a: 0, b, c, d }))

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
export const inverse: (q: Quaternion) => Quaternion = ({ a, b, c, d }) =>
  Bimodule.leftScalarMul(
    1 / (a ** 2 + b ** 2 + c ** 2 + d ** 2),
    Conjugate.conj({ a, b, c, d })
  )

/**
 * @since 1.0.0
 * @category Instances
 */
export const Field: Fld.Field<Quaternion> = {
  add: MonoidSum.concat,
  zero: MonoidSum.empty,
  mul: MonoidProduct.concat,
  one: MonoidProduct.empty,
  sub: MagmaSub.concat,
  div: (a, b) => MonoidProduct.concat(a, inverse(b)),
  mod: () => MonoidSum.empty,
  degree: () => 1,
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
  inverse: a => Field.sub(MonoidSum.empty, a),
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule: TC.Bimodule<number, Quaternion> = {
  ...AdditiveAbelianGroup,
  leftScalarMul: (r, x) => ({ a: r * x.a, b: r * x.b, c: r * x.c, d: r * x.d }),
  rightScalarMul: (x, r) => ({ a: r * x.a, b: r * x.b, c: r * x.c, d: r * x.d }),
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const VectorSpace: TC.VectorSpace<number, Quaternion> = {
  ...Bimodule,
  _F: N.Field,
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const Conjugate: TC.Conjugate<Quaternion> = {
  conj: ({ a, b, c, d }) => of(a, -b, -c, -d),
}

/**
 * @since 1.0.0
 * @category Instance Operations
 */
export const rotateVector: (
  axis: V.VecC<3, number>,
  theta: number
) => (v: V.VecC<3, number>) => V.VecC<3, number> = (axis, theta) => {
  const q = getRotationQuaternion(axis)(theta)
  const qi = inverse(q)
  return p => pipe(Field.mul(q, Field.mul(fromVector3(p), qi)), toVector3)
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const getRotationLinearMap: (
  axis: V.VecC<3, number>,
  theta: number
) => LM.LinearMap2<V.URI, 3, number, number> = (axis, theta) => ({
  isoV: Iso.getId(),
  mapL: rotateVector(axis, theta),
})

// ###################
// ### Destructors ###
// ###################

/**
 * @since 1.0.0
 * @category Destructors
 */
export const toVector4: (q: Quaternion) => V.VecC<4, number> = ({ a, b, c, d }) =>
  V.fromTuple([a, b, c, d])

/**
 * **Note:** Disregards the real part of a quaternion
 *
 * @since 1.0.0
 * @category Destructors
 */
export const toVector3: (q: Quaternion) => V.VecC<3, number> = ({ b, c, d }) =>
  V.fromTuple([b, c, d])

/**
 * @since 1.0.0
 * @category Destructors
 */
export const toComplexMatrix: (q: Quaternion) => M.MatC<2, 2, C.Complex> = ({
  a,
  b,
  c,
  d,
}) =>
  M.fromNestedTuples([
    [C.of(a, b), C.of(c, d)],
    [C.of(-c, d), C.of(a, -b)],
  ])

/**
 * @since 1.0.0
 * @category Destructors
 */
export const toNumericMatrix: (q: Quaternion) => M.MatC<4, 4, number> = ({
  a,
  b,
  c,
  d,
}) =>
  M.fromNestedTuples([
    [a, -b, -c, -d],
    [b, a, -d, c],
    [c, d, a, -b],
    [d, -c, b, a],
  ])

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
export const IsoVector4: Iso.Iso0<Quaternion, V.VecC<4, number>> = {
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
  axis: V.VecC<3, number>
) => (theta: number) => Quaternion = axis => theta =>
  Field.add(
    scalar(Math.cos(theta / 2)),
    Bimodule.leftScalarMul(Math.sin(theta / 2), asUnit(fromVector3(axis)))
  )
