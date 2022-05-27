/**
 * A polynomial expression type.
 *
 * In order for algebraic instances to be lawful, all like terms must have identical
 * evaluation functions. But this is baked into the definition of a polynomial.
 *
 * In other words, the polynomial described here is not a sum of mixed Symbols. This is
 * enforced with a branded newtype
 */

import * as Cnvt from 'fp-ts/Contravariant'
import * as Eq from 'fp-ts/Eq'
import * as Mg from 'fp-ts/Magma'
import * as N from 'fp-ts/number'
import * as O from 'fp-ts/Option'
import * as Ord from 'fp-ts/Ord'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import * as Rng from 'fp-ts/Ring'
import * as Z from 'fp-ts/Zero'
import { flow, identity, pipe, tuple } from 'fp-ts/function'

import * as Exp from './Expression'
import * as Ex from './Exponentiate'
import * as U from './lib/utilities'
import * as Comm from './Commutative'
import * as Mod from './Module'

const PolynomialSymbol = Symbol('Polynomial')
type PolynomialSymbol = typeof PolynomialSymbol

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Monomial<S, R, C> = Exp.Term<[R, S, number], C, R>

/**
 * @since 1.0.0
 * @category Model
 */
export interface Polynomial<S, R, C> extends Exp.Expression<[R, S, number], C, R> {
  _URI: PolynomialSymbol
}

// ####################
// ### Constructors ###
// ####################

/**
 * @since 1.0.0
 * @category Internal
 */
const wrap: <S, R, C>(exp: Exp.Expression<[R, S, number], C, R>) => Polynomial<S, R, C> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  identity as any

/**
 * @since 1.0.0
 * @category Constructors
 */
export const fromCoefficientArray =
  <S, R>(baseSymbol: S) =>
  (rs: ReadonlyArray<R>): Polynomial<S, R, R> =>
    pipe(
      rs,
      RA.mapWithIndex(
        (i, coefficient): Monomial<S, R, R> => ({
          symbol: tuple(coefficient, baseSymbol, i),
          evaluate: identity,
        })
      ),
      a => wrap(a)
    )

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
export const getMonomialEq: <S, R, C>(eqS: Eq.Eq<S>) => Eq.Eq<Monomial<S, R, C>> = eqS =>
  pipe(
    Eq.tuple(Ord.trivial, eqS, N.Eq),
    Eq.contramap(({ symbol }) => symbol)
  )

/**
 * @since 1.0.0
 * @category Instances
 */
export const getMonomialOrd: <S, R, C>(
  ordS: Ord.Ord<S>
) => Ord.Ord<Monomial<S, R, C>> = ordS =>
  pipe(
    Ord.tuple(Ord.trivial, ordS, N.Ord),
    Ord.contramap(({ symbol }) => symbol)
  )

/**
 * Monomial addition is only a Magma, because it assumes that the two terms added are of
 * the same symbol (and hence evaluate function). But this means that it is not
 * commutative, and doesn't follow Semigroup laws
 *
 * @since 1.0.0
 * @category Instances
 */
export const getMonomialAdditiveMagma: <S, R, C>(
  R: Rng.Ring<R>
) => Mg.Magma<Monomial<S, R, C>> = R => ({
  concat: (x, y) => ({
    evaluate: x.evaluate,
    symbol: [R.add(x.symbol[0], y.symbol[0]), x.symbol[1], x.symbol[2]],
  }),
})

/**
 * Monomial multiplication is only a Magma, because it can't be guaranteed that the two
 * monomials being multipled are of the same symbol. And thus fail to satisfy Semigroup laws.
 *
 * @since 1.0.0
 * @category Instances
 */
export const getMonomialMultiplicativeMagma: <S, R, C>(
  R: Rng.Ring<R>
) => Mg.Magma<Monomial<S, R, C>> = R => ({
  concat: (x, y) => ({
    evaluate: x.evaluate,
    symbol: [R.mul(x.symbol[0], y.symbol[0]), x.symbol[1], x.symbol[2] + y.symbol[2]],
  }),
})

/**
 * @since 1.0.0
 * @category Instances
 */
export const getAdditiveAbelianGroup = <S, R, C>(
  ordS: Ord.Ord<S>,
  R: Rng.Ring<R>
): Comm.AbelianGroup<Polynomial<S, R, C>> => ({
  concat: add(ordS, R),
  inverse: inverse(R),
  empty: zero(),
})

/**
 * @since 1.0.0
 * @category Internal
 */
const scaleMonomialCoefficient: <R>(
  R: Rng.Ring<R>
) => (scalar: R) => <S, C>(fa: Monomial<S, R, C>) => Monomial<S, R, C> =
  R =>
  scalar =>
  ({ symbol, evaluate }) => ({
    symbol: [R.mul(scalar, symbol[0]), symbol[1], symbol[2]],
    evaluate,
  })

/**
 * @since 1.0.0
 * @category Instances
 */
export const getBimodule: <S, R, C>(
  ordS: Ord.Ord<S>,
  R: Rng.Ring<R>
) => Mod.Bimodule<R, Polynomial<S, R, C>> = (ordS, R) => ({
  ...getAdditiveAbelianGroup(ordS, R),
  leftScalarMul: (n, as) => pipe(as, RA.map(scaleMonomialCoefficient(R)(n)), wrap),
  rightScalarMul: (as, n) => pipe(as, RA.map(scaleMonomialCoefficient(R)(n)), wrap),
})

/**
 * @since 1.0.0
 * @category Instances
 */
export const getRing = <S, R>(
  baseSymbol: S,
  ordS: Ord.Ord<S>,
  R: Rng.Ring<R>
): Comm.CommutativeRing<Polynomial<S, R, R>> => ({
  add: add(ordS, R),
  sub: (x, y) => add(ordS, R)(x, inverse(R)(y)),
  zero: zero(),
  mul: mul(ordS, R),
  one: one(baseSymbol, R),
})

/**
 * @since 1.0.0
 * @category Instance Operations
 */
export const zero = <S, R, C>(): Polynomial<S, R, C> =>
  pipe(RA.zero<Monomial<S, R, C>>(), wrap)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Zero: Z.Zero3<URI> = {
  URI,
  zero,
}

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
 * Can be used for change-of-variables, or any generic change of domain
 *
 * @since 1.0.0
 * @category Instance operations
 */
export const contramap: <S, R, C, D>(
  f: (d: D) => C
) => (fa: Polynomial<S, R, C>) => Polynomial<S, R, D> = f =>
  flow(RA.map(contramapEvaluate(f)), wrap)

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
  R: Rng.Ring<R>,
  expR: Ex.Exp<R>
) => <S, C>(fa: Polynomial<S, R, C>, x: C) => R = (R, expR) => (xs, x) =>
  pipe(
    xs,
    RA.foldMap(U.getAdditionMonoid(R))(({ evaluate, symbol: [coefficient, , power] }) =>
      R.mul(coefficient, expR.exp(evaluate(x), power))
    )
  )

/**
 * @since 1.0.0
 * @category Destructors
 */
export const toExpression: <S, T, R>(
  R: Rng.Ring<R>,
  expR: Ex.Exp<R>,
  symbolize: (sP: [R, S, number]) => T
) => <C>(ps: Polynomial<S, R, C>) => Exp.Expression<T, C, R> = (R, expR, symbolize) =>
  RA.map(({ symbol: [coefficient, symbol, power], evaluate }) => ({
    evaluate: x => R.mul(coefficient, expR.exp(evaluate(x), power)),
    symbol: symbolize([coefficient, symbol, power]),
  }))

// #############################
// ### Polynomial Operations ###
// #############################

/**
 * @since 1.0.0
 * @category Internal
 */
const concatPolynomials = <S, R, C>(
  x: Polynomial<S, R, C>,
  y: Polynomial<S, R, C>
): Polynomial<S, R, C> => pipe(x, RA.concat(y), wrap)

/**
 * @since 1.0.0
 * @category Internal
 */
const combineLikeTerms =
  <S, R>(ordS: Ord.Ord<S>, R: Rng.Ring<R>) =>
  <C>(x: Polynomial<S, R, C>): Polynomial<S, R, C> =>
    pipe(
      x,
      RNEA.fromReadonlyArray,
      O.map(
        flow(
          RNEA.sort(getMonomialOrd<S, R, C>(ordS)),
          RNEA.group(getMonomialEq<S, R, C>(ordS))
        )
      ),
      O.fold(
        () => zero(),
        flow(
          RA.map(likeTerms => {
            const { evaluate, symbol } = RNEA.head(likeTerms)
            const zero: Monomial<S, R, C> = {
              evaluate,
              symbol: [R.zero, symbol[1], symbol[2]],
            }
            return pipe(
              likeTerms,
              RNEA.reduce(zero, getMonomialAdditiveMagma<S, R, C>(R).concat)
            )
          }),
          wrap
        )
      )
    )

/**
 * @since 1.0.0
 * @category Polynomial Operations
 */
export const one = <S, R>(baseSymbol: S, R: Rng.Ring<R>): Polynomial<S, R, R> =>
  pipe(
    RA.of<Monomial<S, R, R>>({ symbol: tuple(R.one, baseSymbol, 0), evaluate: identity }),
    wrap
  )

/**
 * @since 1.0.0
 * @category Polynomial Operations
 */
export const add =
  <S, R>(ordS: Ord.Ord<S>, R: Rng.Ring<R>) =>
  <C>(x: Polynomial<S, R, C>, y: Polynomial<S, R, C>): Polynomial<S, R, C> =>
    pipe(concatPolynomials(x, y), combineLikeTerms(ordS, R))

/**
 * @since 1.0.0
 * @category Polynomial Operations
 */
export const mul =
  <S, R>(ordS: Ord.Ord<S>, R: Rng.Ring<R>) =>
  <C>(x: Polynomial<S, R, C>, y: Polynomial<S, R, C>): Polynomial<S, R, C> =>
    pipe(
      RA.Do,
      RA.apS('a', x),
      RA.apS('b', y),
      RA.map(({ a, b }) => getMonomialMultiplicativeMagma<S, R, C>(R).concat(a, b)),
      wrap,
      combineLikeTerms(ordS, R)
    )

/**
 * @since 1.0.0
 * @category Polynomial Operations
 */
export const inverse: <R>(
  R: Rng.Ring<R>
) => <S, C>(x: Polynomial<S, R, C>) => Polynomial<S, R, C> = R =>
  flow(
    RA.map(({ evaluate, symbol }) => ({
      evaluate,
      symbol: tuple(R.sub(R.zero, symbol[0]), symbol[1], symbol[2]),
    })),
    wrap
  )
