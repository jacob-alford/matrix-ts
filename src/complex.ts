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
import * as LM from './LinearMap'
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
export const zero: Complex = { Re: 0, Im: 0 }

/**
 * @since 1.0.0
 * @category Constructors
 */
export const one: Complex = { Re: 1, Im: 0 }

/**
 * @since 1.0.0
 * @category Constructors
 */
export const scalar: (a: number) => Complex = a => ({ Re: a, Im: 0 })

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
  empty: zero,
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const MonoidProduct: Mn.Monoid<Complex> = {
  ...SemigroupProduct,
  empty: one,
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
export const ComplexAdditiveAbelianGroup: TC.AbelianGroup<Complex> = {
  ...MonoidSum,
  inverse: a => ({ Re: -a.Re, Im: -a.Im }),
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const ComplexBimodule: TC.Bimodule<Complex, number> = {
  ...ComplexAdditiveAbelianGroup,
  leftScalarMul: (r, x) => ({ Re: r * x.Re, Im: r * x.Im }),
  rightScalarMul: (x, r) => ({ Re: r * x.Re, Im: r * x.Im }),
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
// ### Vec1d ####
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec1d = V.VecC<1, Complex>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup1d: TC.AbelianGroup<Vec1d> = V.getAbGroup(Field)(1)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule1d: TC.Bimodule<Vec1d, Complex> = V.getBimodule(Field)(1)

/**
 * @since 1.0.0
 * @category Instances
 */
export const VectorSpace1d: TC.VectorSpace<Complex, Vec1d> = V.getVectorSpace(Field)(1)

/**
 * @since 1.0.0
 * @category Instances
 */
export const InnerProductSpace1d: TC.InnerProductSpace<Complex, Vec1d> =
  V.getInnerProductSpace(Field, Conjugate)(1)

// #############
// ### Vec2d ####
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec2d = V.VecC<2, Complex>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup2d: TC.AbelianGroup<Vec2d> = V.getAbGroup(Field)(2)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule2d: TC.Bimodule<Vec2d, Complex> = V.getBimodule(Field)(2)

/**
 * @since 1.0.0
 * @category Instances
 */
export const VectorSpace2d: TC.VectorSpace<Complex, Vec2d> = V.getVectorSpace(Field)(2)

/**
 * @since 1.0.0
 * @category Instances
 */
export const InnerProductSpace2d: TC.InnerProductSpace<Complex, Vec2d> =
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
export const Bimodule22: TC.Bimodule<Mat22, Complex> = M.getBimodule(Field)(2, 2)

// #############
// ### Vec3d ####
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec3d = V.VecC<3, Complex>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup3d: TC.AbelianGroup<Vec3d> = V.getAbGroup(Field)(3)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule3d: TC.Bimodule<Vec3d, Complex> = V.getBimodule(Field)(3)

/**
 * @since 1.0.0
 * @category Instances
 */
export const VectorSpace3d: TC.VectorSpace<Complex, Vec3d> = V.getVectorSpace(Field)(3)

/**
 * @since 1.0.0
 * @category Instances
 */
export const InnerProductSpace3d: TC.InnerProductSpace<Complex, Vec3d> =
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
export const Bimodule33: TC.Bimodule<Mat33, Complex> = M.getBimodule(Field)(3, 3)

// #############
// ### Vec4d ####
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec4d = V.VecC<4, Complex>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup4d: TC.AbelianGroup<Vec4d> = V.getAbGroup(Field)(4)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule4d: TC.Bimodule<Vec4d, Complex> = V.getBimodule(Field)(4)

/**
 * @since 1.0.0
 * @category Instances
 */
export const VectorSpace4d: TC.VectorSpace<Complex, Vec4d> = V.getVectorSpace(Field)(4)

/**
 * @since 1.0.0
 * @category Instances
 */
export const InnerProductSpace4d: TC.InnerProductSpace<Complex, Vec4d> =
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
export const Bimodule44: TC.Bimodule<Mat44, Complex> = M.getBimodule(Field)(4, 4)

// #############
// ### Vec5d ####
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec5d = V.VecC<5, Complex>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup5d: TC.AbelianGroup<Vec5d> = V.getAbGroup(Field)(5)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule5d: TC.Bimodule<Vec5d, Complex> = V.getBimodule(Field)(5)

/**
 * @since 1.0.0
 * @category Instances
 */
export const VectorSpace5d: TC.VectorSpace<Complex, Vec5d> = V.getVectorSpace(Field)(5)

/**
 * @since 1.0.0
 * @category Instances
 */
export const InnerProductSpace5d: TC.InnerProductSpace<Complex, Vec5d> =
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
export const Bimodule55: TC.Bimodule<Mat55, Complex> = M.getBimodule(Field)(5, 5)

// #############
// ### Vec6d ####
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec6d = V.VecC<6, Complex>

/**
 * @since 1.0.0
 * @category Instances
 */
export const AbelianGroup6d: TC.AbelianGroup<Vec6d> = V.getAbGroup(Field)(6)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bimodule6d: TC.Bimodule<Vec6d, Complex> = V.getBimodule(Field)(6)

/**
 * @since 1.0.0
 * @category Instances
 */
export const VectorSpace6d: TC.VectorSpace<Complex, Vec6d> = V.getVectorSpace(Field)(6)

/**
 * @since 1.0.0
 * @category Instances
 */
export const InnerProductSpace6d: TC.InnerProductSpace<Complex, Vec6d> =
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
export const Bimodule66: TC.Bimodule<Mat66, Complex> = M.getBimodule(Field)(6, 6)

// #############################
// ### Polynomial Operations ###
// #############################

/**
 * @since 1.0.0
 * @category Operations
 */
export const differentiatePolynomial = Poly.getDifferentiateComplex(
  ComplexBimodule,
  Field
)

/**
 * @since 1.0.0
 * @category Polynomial Operations
 */
export const indefiniteIntegral = Poly.getIndefiniteIntegralComplex(
  ComplexBimodule,
  Field
)

// ############################
// ### Polynomial Instances ###
// ############################

/**
 * @since 1.0.0
 * @category Instances
 */
export const PolynomialAdditiveAbelianGroup = Poly.getAdditiveAbelianGroup(Field)

/**
 * @since 1.0.0
 * @category Instances
 */
export const PolynomialBimodule = Poly.getBimodule(Field)

/**
 * @since 1.0.0
 * @category Instances
 */
export const PolynomialRing = Poly.getRing(Field)

/**
 * @since 1.0.0
 * @category Instances
 */
export const PolynomialVectorSpace = Poly.getVectorSpace(Field)

/**
 * @since 1.0.0
 * @category Instances
 */
export const DifferentialLinearMap: LM.LinearMap2<Poly.URI, Complex, Complex, Complex> = {
  isoV: Iso.getId(),
  mapL: differentiatePolynomial,
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const getDefiniteIntegralLinearMap: (
  constantTerm: Complex
) => LM.LinearMap2<Poly.URI, Complex, Complex, Complex> = constantTerm => ({
  isoV: Iso.getId(),
  mapL: indefiniteIntegral(constantTerm),
})

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
