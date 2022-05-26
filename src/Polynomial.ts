import * as Cnvt from 'fp-ts/Contravariant'
import * as Eq from 'fp-ts/Eq'
import * as O from 'fp-ts/Option'
import * as Ord from 'fp-ts/Ord'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import * as Rng from 'fp-ts/Ring'
import * as Str from 'fp-ts/string'
import { flow, pipe } from 'fp-ts/function'

import * as Exp from './Expression'
import * as Expo from './Exponentiate'
import * as U from './lib/utilities'
import * as Comm from './Commutative'
import * as Mod from './Module'

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export interface Monomial<S, R, C> extends Exp.Term<S, C, R> {
  coefficient: R
}

/**
 * @since 1.0.0
 * @category Model
 */
export type Polynomial<S, R, C> = ReadonlyArray<Monomial<S, R, C>>

// ####################
// ### Constructors ###
// ####################

export const fromCoefficientArray: <R, S extends string>(
  Expo: Expo.Exp<R>
) => (baseSymbol: S) => (rs: ReadonlyArray<R>) => Polynomial<`${S}^${number}`, R, R> =
  ({ exp }) =>
  baseSymbol =>
    RA.mapWithIndex((i, coefficient) => ({
      _eqS: Str.Eq,
      coefficient,
      symbol: `${baseSymbol}^${i}`,
      evaluate: x => exp(x, i),
    }))

// #####################
// ### Non-Pipeables ###
// #####################

export const _contramap: Cnvt.Contravariant3<URI>['contramap'] = (fa, f) =>
  pipe(fa, contramap(f))

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const URI = 'Polynomial'

/**
 * @since 1.0.0
 * @category Instances
 */
export type URI = typeof URI

declare module 'fp-ts/HKT' {
  interface URItoKind3<R, E, A> {
    readonly [URI]: Polynomial<R, E, A>
  }
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const getMonomialEq: <S extends string, R, C>() => Eq.Eq<Monomial<S, R, C>> = () =>
  pipe(
    Str.Eq,
    Eq.contramap(({ symbol }) => symbol)
  )

/**
 * @since 1.0.0
 * @category Instances
 */
export const getMonomialOrd: <S extends string, R, C>() => Ord.Ord<
  Monomial<S, R, C>
> = () =>
  pipe(
    Str.Ord,
    Ord.contramap(({ symbol }) => symbol)
  )

/**
 * @since 1.0.0
 * @category Instances
 */
export const getAdditiveAbelianGroup: <S, R, C>(
  R: Rng.Ring<R>
) => Comm.AbelianGroup<Polynomial<S, R, C>> = R => ({})

/**
 * @since 1.0.0
 * @category Instances
 */
export const getBimodule: <S, R, C>(
  R: Rng.Ring<R>
) => Mod.Bimodule<R, Polynomial<S, R, C>> = R => ({
  _R: R,
  ...getAdditiveAbelianGroup(R),
  leftScalarMul: (n, as) => pipe(as, RA.map(scaleMonomialCoefficient(R)(n))),
  rightScalarMul: (as, n) => pipe(as, RA.map(scaleMonomialCoefficient(R)(n))),
})

/**
 * @since 1.0.0
 * @category Instances
 */
export const getRing: <S, R, C>(
  R: Rng.Ring<R>
) => Comm.CommutativeRing<Polynomial<S, R, C>> = R => ({})

/**
 * @since 1.0.0
 * @category Internal
 */
const contramapEvaluate: <S, C, R, D>(
  f: (x: D) => C
) => (t: Monomial<S, R, C>) => Monomial<S, R, D> = f => t => ({
  ...t,
  evaluate: flow(f, t.evaluate),
})

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const contramap: <S, R, C, D>(
  f: (d: D) => C
) => (fa: Polynomial<S, R, C>) => Polynomial<S, R, D> = f => RA.map(contramapEvaluate(f))

/**
 * @since 1.0.0
 * @category Instances
 */
export const Contravariant: Cnvt.Contravariant3<URI> = {
  URI,
  contramap: _contramap,
}

// ###################
// ### Destructors ###
// ###################

/**
 * @since 1.0.0
 * @category Destructors
 */
export const evaluate: <R>(
  R: Rng.Ring<R>
) => <C>(x: C) => <S>(fa: Polynomial<S, R, C>) => R = R => x =>
  RA.foldMap(U.getAdditionMonoid(R))(({ evaluate }) => evaluate(x))

// #############################
// ### Polynomial Operations ###
// #############################

/**
 * @since 1.0.0
 * @category Polynomial Operations
 */
export const scaleMonomialCoefficient: <R>(
  R: Rng.Ring<R>
) => (scalar: R) => <S, C>(fa: Monomial<S, R, C>) => Monomial<S, R, C> =
  R => scalar => t => ({
    ...t,
    coefficient: R.mul(scalar, t.coefficient),
  })

/**
 * @since 1.0.0
 * @category Polynomial Operations
 */
export const add =
  <R>(R: Rng.Ring<R>) =>
  <S extends string, C>(
    x: Polynomial<S, R, C>,
    y: Polynomial<S, R, C>
  ): Polynomial<S, R, C> =>
    pipe(
      y,
      RA.concat(x),
      RNEA.fromReadonlyArray,
      O.map(
        flow(RNEA.sort(getMonomialOrd<S, R, C>()), RNEA.group(getMonomialEq<S, R, C>()))
      ),
      O.fold(
        () => RA.zero(),
        RA.map(likeTerms =>
          pipe(
            likeTerms,
            RNEA.foldMap(U.getAdditionMonoid(R))(({ coefficient }) => coefficient),
            a => ({ ...RNEA.head(likeTerms), coefficient: a })
          )
        )
      )
    )

/**
 * @since 1.0.0
 * @category Polynomial Operations
 */
export const inverse: <R>(
  R: Rng.Ring<R>
) => <S extends string, C>(x: Polynomial<S, R, C>) => Polynomial<S, R, C> = R =>
  RA.map(m => ({ ...m, coefficient: R.sub(R.zero, m.coefficient) }))
