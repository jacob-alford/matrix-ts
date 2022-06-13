import * as Eq_ from 'fp-ts/Eq'
import * as Mg from 'fp-ts/Magma'
import * as Mn from 'fp-ts/Monoid'
import * as Sg from 'fp-ts/Semigroup'
import * as Fld from 'fp-ts/Field'
import * as Sh from 'fp-ts/Show'
import * as O from 'fp-ts/Option'
import * as N from 'fp-ts/number'
import { flow, pipe } from 'fp-ts/function'

import * as Iso from './Iso'
import * as M from './MatrixC'
import * as Poly from './Polynomial'
import * as TC from './typeclasses'
import * as V from './VectorC'

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export interface Complex {
  readonly Re: number
  readonly Im: number
}

// ####################
// ### Constructors ###
// ####################

/**
 * @since 1.0.0
 * @category Constructors
 */
export const of: (Re: number, Im: number) => Complex = (Re, Im) => ({ Re, Im })

/**
 * Converts a polar-form complex tuple to `Complex`
 *
 * Note, psi here is in radians
 *
 * @since 1.0.0
 * @category Constructors
 */
export const fromPolarRadians: (r: number, psi: number) => Complex = (r, psi) =>
  of(Math.cos(psi) * r, Math.sin(psi) * r)

/**
 * Converts a polar-form complex tuple to `Complex`
 *
 * Note, psi here is in degrees
 *
 * @since 1.0.0
 * @category Constructors
 */
export const fromPolarDegrees: (r: number, psi: number) => Complex = (r, psi) =>
  fromPolarRadians(r, (psi * 180) / Math.PI)

/**
 * @since 1.0.0
 * @category Constructors
 */
export const fromVector: (v: V.VecC<2, number>) => Complex = as =>
  pipe(V.toTuple(as), ([Re, Im]) => of(Re, Im))

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const Eq: Eq_.Eq<Complex> = Eq_.struct({
  Re: N.Eq,
  Im: N.Eq,
})

/**
 * @since 1.0.0
 * @category Instances
 */
export const MagmaSub: Mg.Magma<Complex> = {
  concat: (x, y) => ({ Re: x.Re - y.Re, Im: x.Im - y.Im }),
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const SemigroupSum: Sg.Semigroup<Complex> = {
  concat: (x, y) => ({ Re: x.Re + y.Re, Im: x.Im + y.Im }),
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const SemigroupProduct: Sg.Semigroup<Complex> = {
  concat: (x, y) => ({ Re: x.Re * y.Re - x.Im * y.Im, Im: x.Im * y.Re + y.Im * x.Re }),
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const MonoidSum: Mn.Monoid<Complex> = {
  ...SemigroupSum,
  empty: {
    Re: 0,
    Im: 0,
  },
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const MonoidProduct: Mn.Monoid<Complex> = {
  ...SemigroupProduct,
  empty: {
    Re: 1,
    Im: 0,
  },
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const Field: Fld.Field<Complex> = {
  add: MonoidSum.concat,
  zero: MonoidSum.empty,
  mul: MonoidProduct.concat,
  one: MonoidProduct.empty,
  sub: MagmaSub.concat,
  div: ({ Re: a, Im: b }, { Re: c, Im: d }) => ({
    Re: (a * c + b * d) / (c ** 2 + d ** 2),
    Im: (b * c - a * d) / (c ** 2 + d ** 2),
  }),
  mod: () => MonoidSum.empty,
  degree: () => 1,
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const Show: Sh.Show<Complex> = {
  show: ({ Re, Im }) => `${Re}+${Im}i`,
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const Conjugate: TC.Conjugate<Complex> = {
  conj: ({ Re, Im }) => ({ Re, Im: -Im }),
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const Exp: TC.Exp<Complex> = {
  exp: (c, n) =>
    pipe(
      argumentRadians(c),
      O.fold(
        () => of(0, 0),
        psi => fromPolarRadians(modulus(c) ** n, psi * n)
      )
    ),
}

// ###################
// ### Destructors ###
// ###################

/**
 * @since 1.0.0
 * @category Destructors
 */
export const toVector: (c: Complex) => V.VecC<2, number> = ({ Re, Im }) =>
  V.fromTuple([Re, Im])

/**
 * @since 1.0.0
 * @category Destructors
 */
export const argumentRadians: (c: Complex) => O.Option<number> = ({ Re, Im }) =>
  Im !== 0 || Re > 0
    ? O.some(Math.atan2(Im, Re))
    : Im === 0 && Re < 0
    ? O.some(Math.PI)
    : O.none

/**
 * @since 1.0.0
 * @category Destructors
 */
export const argumentDegrees: (c: Complex) => O.Option<number> = flow(
  argumentRadians,
  O.map(radians => (radians * 180) / Math.PI)
)

/**
 * @since 1.0.0
 * @category Destructors
 */
export const modulus: (c: Complex) => number = ({ Re, Im }) =>
  Math.sqrt(Re ** 2 + Im ** 2)

// ####################
// ### Isomorphisms ###
// ####################

/**
 * @since 1.0.0
 * @category Isomorphisms
 */
export const IsoVector: Iso.Iso0<Complex, V.VecC<2, number>> = {
  get: toVector,
  reverseGet: fromVector,
}

// #############
// ### Vec1 ####
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec1 = V.VecC<1, Complex>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup1: TC.AbelianGroup<Vec1> = V.getAbGroup(Field)(1)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule1: TC.Bimodule<Complex, Vec1> = V.getBimodule(Field)(1)

/**
 * @since 1.0.0
 * @category Instances
 */
export const VectorField1: TC.VectorSpace<Complex, Vec1> = V.getVectorSpace(Field)(1)

/**
 * @since 1.0.0
 * @category Instances
 */
export const InnerProductSpace1: TC.InnerProductSpace<Complex, Vec1> =
  V.getInnerProductSpace(Field, Conjugate)(1)

// #############
// ### Vec2 ####
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec2 = V.VecC<2, Complex>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup2: TC.AbelianGroup<Vec2> = V.getAbGroup(Field)(2)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule2: TC.Bimodule<Complex, Vec2> = V.getBimodule(Field)(2)

/**
 * @since 1.0.0
 * @category Instances
 */
export const VectorField2: TC.VectorSpace<Complex, Vec2> = V.getVectorSpace(Field)(2)

/**
 * @since 1.0.0
 * @category Instances
 */
export const InnerProductSpace2: TC.InnerProductSpace<Complex, Vec2> =
  V.getInnerProductSpace(Field, Conjugate)(2)

// ###############
// ### Mat 2x2 ###
// ###############

/**
 * @since 1.0.0
 * @category Model
 */
export type Mat22 = M.MatC<2, 2, Complex>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AdditiveAbelianGroup22: TC.AbelianGroup<Mat22> = M.getAdditiveAbelianGroup(
  Field
)(2, 2)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule22: TC.Bimodule<Complex, Mat22> = M.getBimodule(Field)(2, 2)

// #############
// ### Vec3 ####
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec3 = V.VecC<3, Complex>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup3: TC.AbelianGroup<Vec3> = V.getAbGroup(Field)(3)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule3: TC.Bimodule<Complex, Vec3> = V.getBimodule(Field)(3)

/**
 * @since 1.0.0
 * @category Instances
 */
export const VectorField3: TC.VectorSpace<Complex, Vec3> = V.getVectorSpace(Field)(3)

/**
 * @since 1.0.0
 * @category Instances
 */
export const InnerProductSpace3: TC.InnerProductSpace<Complex, Vec3> =
  V.getInnerProductSpace(Field, Conjugate)(3)

/**
 * @since 1.0.0
 * @category Vector Operations
 */
export const cross = V.crossProduct(Field)

// ###############
// ### Mat 3x3 ###
// ###############

/**
 * @since 1.0.0
 * @category Model
 */
export type Mat33 = M.MatC<3, 3, Complex>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AdditiveAbelianGroup33: TC.AbelianGroup<Mat33> = M.getAdditiveAbelianGroup(
  Field
)(3, 3)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule33: TC.Bimodule<Complex, Mat33> = M.getBimodule(Field)(3, 3)

// #############
// ### Vec4 ####
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec4 = V.VecC<4, Complex>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup4: TC.AbelianGroup<Vec4> = V.getAbGroup(Field)(4)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule4: TC.Bimodule<Complex, Vec4> = V.getBimodule(Field)(4)

/**
 * @since 1.0.0
 * @category Instances
 */
export const VectorField4: TC.VectorSpace<Complex, Vec4> = V.getVectorSpace(Field)(4)

/**
 * @since 1.0.0
 * @category Instances
 */
export const InnerProductSpace4: TC.InnerProductSpace<Complex, Vec4> =
  V.getInnerProductSpace(Field, Conjugate)(4)

// ###############
// ### Mat 4x4 ###
// ###############

/**
 * @since 1.0.0
 * @category Model
 */
export type Mat44 = M.MatC<4, 4, Complex>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AdditiveAbelianGroup44: TC.AbelianGroup<Mat44> = M.getAdditiveAbelianGroup(
  Field
)(4, 4)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule44: TC.Bimodule<Complex, Mat44> = M.getBimodule(Field)(4, 4)

// #############
// ### Vec5 ####
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec5 = V.VecC<5, Complex>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup5: TC.AbelianGroup<Vec5> = V.getAbGroup(Field)(5)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule5: TC.Bimodule<Complex, Vec5> = V.getBimodule(Field)(5)

/**
 * @since 1.0.0
 * @category Instances
 */
export const VectorField5: TC.VectorSpace<Complex, Vec5> = V.getVectorSpace(Field)(5)

/**
 * @since 1.0.0
 * @category Instances
 */
export const InnerProductSpace5: TC.InnerProductSpace<Complex, Vec5> =
  V.getInnerProductSpace(Field, Conjugate)(5)

// ###############
// ### Mat 5x5 ###
// ###############

/**
 * @since 1.0.0
 * @category Model
 */
export type Mat55 = M.MatC<5, 5, Complex>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AdditiveAbelianGroup55: TC.AbelianGroup<Mat55> = M.getAdditiveAbelianGroup(
  Field
)(5, 5)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule55: TC.Bimodule<Complex, Mat55> = M.getBimodule(Field)(5, 5)

// #############
// ### Vec6 ####
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec6 = V.VecC<6, Complex>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup6: TC.AbelianGroup<Vec6> = V.getAbGroup(Field)(6)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule6: TC.Bimodule<Complex, Vec6> = V.getBimodule(Field)(6)

/**
 * @since 1.0.0
 * @category Instances
 */
export const VectorField6: TC.VectorSpace<Complex, Vec6> = V.getVectorSpace(Field)(6)

/**
 * @since 1.0.0
 * @category Instances
 */
export const InnerProductSpace6: TC.InnerProductSpace<Complex, Vec6> =
  V.getInnerProductSpace(Field, Conjugate)(6)

// ###############
// ### Mat 6x6 ###
// ###############

/**
 * @since 1.0.0
 * @category Model
 */
export type Mat66 = M.MatC<6, 6, Complex>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AdditiveAbelianGroup66: TC.AbelianGroup<Mat66> = M.getAdditiveAbelianGroup(
  Field
)(6, 6)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule66: TC.Bimodule<Complex, Mat66> = M.getBimodule(Field)(6, 6)

// ############################
// ### Polynomial Instances ###
// ############################

/**
 * @since 1.0.0
 * @category Instances
 */
export const AdditiveAbelianGroup = Poly.getAdditiveAbelianGroup(Field)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule = Poly.getBimodule(Field)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Ring = Poly.getRing(Field)

// ##############################
// ### Polynomial Destructors ###
// ##############################

/**
 * @since 1.0.0
 * @category Destructors
 */
export const evaluatePolynomial = Poly.evaluate(Field, Exp)

/**
 * @since 1.0.0
 * @category Destructors
 */
export const polynomialToExpression = Poly.toExpression<
  `(${string})z^${number}`,
  Complex
>(Field, Exp, ([coefficient, power]) => `(${Show.show(coefficient)})z^${power}`)
