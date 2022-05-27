import * as Eq_ from 'fp-ts/Eq'
import * as Mg from 'fp-ts/Magma'
import * as Mn from 'fp-ts/Monoid'
import * as Sg from 'fp-ts/Semigroup'
import * as Fld from 'fp-ts/Field'
import * as Sh from 'fp-ts/Show'
import * as O from 'fp-ts/Option'
import * as N from 'fp-ts/number'
import { flow, pipe } from 'fp-ts/function'

import * as Conj from './Conjugate'
import * as Expo from './Exponentiate'
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
export const Conjugate: Conj.Conjugate<Complex> = {
  conj: ({ Re, Im }) => ({ Re, Im: -Im }),
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const Exp: Expo.Exp<Complex> = {
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
