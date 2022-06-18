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
import * as Fld from 'fp-ts/Field'
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
import * as TC from './typeclasses'
import * as U from './lib/utilities'

const PolynomialSymbol = Symbol('Polynomial')
type PolynomialSymbol = typeof PolynomialSymbol

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Monomial<R, C> = Exp.Term<[R, number], C, R>

/**
 * @since 1.0.0
 * @category Model
 */
export interface Polynomial<R, C> extends Exp.Expression<[R, number], C, R> {
  _URI: PolynomialSymbol
}

// ####################
// ### Constructors ###
// ####################

/**
 * @since 1.0.0
 * @category Internal
 */
const wrap: <R, C>(exp: Exp.Expression<[R, number], C, R>) => Polynomial<R, C> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  identity as any

/**
 * @since 1.0.0
 * @category Internal
 */
const monomial: <R, C>(symbol: [R, number], evaluate: (c: C) => R) => Monomial<R, C> = (
  symbol,
  evaluate
) => ({ symbol, evaluate })

/**
 * @since 1.0.0
 * @category Constructors
 */
export const fromCoefficientArray = <R>(rs: ReadonlyArray<R>): Polynomial<R, R> =>
  pipe(
    rs,
    RA.mapWithIndex(
      (i, coefficient): Monomial<R, R> => ({
        symbol: tuple(coefficient, i),
        evaluate: identity,
      })
    ),
    a => wrap(a)
  )

// #####################
// ### Non-Pipeables ###
// #####################

export const _contramap: Cnvt.Contravariant2<URI>['contramap'] = (fa, f) =>
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
  interface URItoKind2<E, A> {
    readonly [URI]: Polynomial<E, A>
  }
  interface URItoKind<A> {
    readonly [URI]: Polynomial<A, A>
  }
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const getMonomialEq: <R, C>() => Eq.Eq<Monomial<R, C>> = () =>
  pipe(
    Eq.tuple(Ord.trivial, N.Eq),
    Eq.contramap(({ symbol }) => symbol)
  )

/**
 * @since 1.0.0
 * @category Instances
 */
export const getMonomialOrd: <R, C>() => Ord.Ord<Monomial<R, C>> = () =>
  pipe(
    Ord.tuple(Ord.trivial, N.Ord),
    Ord.contramap(({ symbol }) => symbol)
  )

/**
 * @since 1.0.0
 * @category Instances
 */
export const getPolynomialEq = <R, C>(R: Rng.Ring<R>): Eq.Eq<Polynomial<R, C>> =>
  pipe(RA.getEq(getMonomialEq<R, C>()), Eq.contramap(combineLikeTerms(R)))

/**
 * Monomial addition is only a Magma, because it assumes that the two terms added are of
 * the same symbol (and hence evaluate function). But this means that it is not
 * commutative, and doesn't follow Semigroup laws
 *
 * @since 1.0.0
 * @category Instances
 */
export const getMonomialAdditiveMagma: <R, C>(
  R: Rng.Ring<R>
) => Mg.Magma<Monomial<R, C>> = R => ({
  concat: (x, y) => ({
    evaluate: x.evaluate,
    symbol: [R.add(x.symbol[0], y.symbol[0]), x.symbol[1]],
  }),
})

/**
 * Monomial multiplication is only a Magma, because it can't be guaranteed that the two
 * monomials being multipled are of the same symbol. And thus fail to satisfy Semigroup laws.
 *
 * @since 1.0.0
 * @category Instances
 */
export const getMonomialMultiplicativeMagma: <R, C>(
  R: Rng.Ring<R>
) => Mg.Magma<Monomial<R, C>> = R => ({
  concat: (x, y) => ({
    evaluate: x.evaluate,
    symbol: [R.mul(x.symbol[0], y.symbol[0]), x.symbol[1] + y.symbol[1]],
  }),
})

/**
 * @since 1.0.0
 * @category Instances
 */
export const getAdditiveAbelianGroup = <R>(
  R: Rng.Ring<R>
): TC.AbelianGroup<Polynomial<R, R>> => ({
  concat: add(R),
  inverse: inverse(R),
  empty: zero(),
})

/**
 * @since 1.0.0
 * @category Internal
 */
const scaleMonomialCoefficient: <R>(
  R: Rng.Ring<R>
) => (scalar: R) => <C>(fa: Monomial<R, C>) => Monomial<R, C> =
  R =>
  scalar =>
  ({ symbol, evaluate }) => ({
    symbol: [R.mul(scalar, symbol[0]), symbol[1]],
    evaluate,
  })

/**
 * @since 1.0.0
 * @category Instances
 */
export const getBimodule: <R>(
  R: Rng.Ring<R>
) => TC.Bimodule<Polynomial<R, R>, R> = R => ({
  ...getAdditiveAbelianGroup(R),
  leftScalarMul: (n, as) => pipe(as, RA.map(scaleMonomialCoefficient(R)(n)), wrap),
  rightScalarMul: (as, n) => pipe(as, RA.map(scaleMonomialCoefficient(R)(n)), wrap),
})

/**
 * @since 1.0.0
 * @category Instances
 */
export const getVectorSpace: <F>(
  F: Fld.Field<F>
) => TC.VectorSpace<F, Polynomial<F, F>> = F => ({
  ...getBimodule(F),
  _F: F,
})

/**
 * @since 1.0.0
 * @category Instances
 */
export const getRing = <R>(R: Rng.Ring<R>): TC.CommutativeRing<Polynomial<R, R>> => ({
  add: add(R),
  sub: (x, y) => add(R)(x, inverse(R)(y)),
  zero: zero(),
  mul: mul(R),
  one: one(R),
})

/**
 * @since 1.0.0
 * @category Instance Operations
 */
export const zero = <R, C>(): Polynomial<R, C> => pipe(RA.zero<Monomial<R, C>>(), wrap)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Zero: Z.Zero2<URI> = {
  URI,
  zero,
}

/**
 * @since 1.0.0
 * @category Internal
 */
const contramapEvaluate: <C, R, D>(
  f: (x: D) => C
) => (t: Monomial<R, C>) => Monomial<R, D> = f => t => ({
  ...t,
  evaluate: flow(f, t.evaluate),
})

/**
 * Can be used for change-of-variables, or any generic change of domain
 *
 * @since 1.0.0
 * @category Instance operations
 */
export const contramap: <R, C, D>(
  f: (d: D) => C
) => (fa: Polynomial<R, C>) => Polynomial<R, D> = f =>
  flow(RA.map(contramapEvaluate(f)), wrap)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Contravariant: Cnvt.Contravariant2<URI> = {
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
  expR: TC.Exp<R>
) => <C>(fa: Polynomial<R, C>, x: C) => R = (R, expR) => (xs, x) =>
  pipe(
    xs,
    RA.foldMap(U.getAdditionMonoid(R))(({ evaluate, symbol: [coefficient, power] }) =>
      R.mul(coefficient, expR.exp(evaluate(x), power))
    )
  )

/**
 * @since 1.0.0
 * @category Destructors
 */
export const toExpression: <T, R>(
  R: Rng.Ring<R>,
  expR: TC.Exp<R>,
  symbolize: (sP: [R, number]) => T
) => <C>(ps: Polynomial<R, C>) => Exp.Expression<T, C, R> = (R, expR, symbolize) =>
  RA.map(({ symbol: [coefficient, power], evaluate }) => ({
    evaluate: x => R.mul(coefficient, expR.exp(evaluate(x), power)),
    symbol: symbolize([coefficient, power]),
  }))

// #############################
// ### Polynomial Operations ###
// #############################

/**
 * @since 1.0.0
 * @category Internal
 */
const concatPolynomials = <R, C>(
  x: Polynomial<R, C>,
  y: Polynomial<R, C>
): Polynomial<R, C> => pipe(x, RA.concat(y), wrap)

/**
 * @since 1.0.0
 * @category Internal
 */
const combineLikeTerms =
  <R>(R: Rng.Ring<R>) =>
  <C>(x: Polynomial<R, C>): Polynomial<R, C> =>
    pipe(
      x,
      RNEA.fromReadonlyArray,
      O.map(flow(RNEA.sort(getMonomialOrd<R, C>()), RNEA.group(getMonomialEq<R, C>()))),
      O.fold(
        () => zero(),
        flow(
          RA.map(likeTerms => {
            const { evaluate, symbol } = RNEA.head(likeTerms)
            const zero: Monomial<R, C> = {
              evaluate,
              symbol: [R.zero, symbol[1]],
            }
            return pipe(
              likeTerms,
              RNEA.reduce(zero, getMonomialAdditiveMagma<R, C>(R).concat)
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
export const one = <R>(R: Rng.Ring<R>): Polynomial<R, R> =>
  pipe(RA.of<Monomial<R, R>>({ symbol: tuple(R.one, 0), evaluate: identity }), wrap)

/**
 * @since 1.0.0
 * @category Polynomial Operations
 */
export const add =
  <R>(R: Rng.Ring<R>) =>
  <C>(x: Polynomial<R, C>, y: Polynomial<R, C>): Polynomial<R, C> =>
    pipe(concatPolynomials(x, y), combineLikeTerms(R))

/**
 * @since 1.0.0
 * @category Polynomial Operations
 */
export const mul =
  <R>(R: Rng.Ring<R>) =>
  <C>(x: Polynomial<R, C>, y: Polynomial<R, C>): Polynomial<R, C> =>
    pipe(
      RA.Do,
      RA.apS('a', x),
      RA.apS('b', y),
      RA.map(({ a, b }) => getMonomialMultiplicativeMagma<R, C>(R).concat(a, b)),
      wrap,
      combineLikeTerms(R)
    )

/**
 * @since 1.0.0
 * @category Polynomial Operations
 */
export const inverse: <R>(
  R: Rng.Ring<R>
) => <C>(x: Polynomial<R, C>) => Polynomial<R, C> = R =>
  flow(
    RA.map(({ evaluate, symbol }) => ({
      evaluate,
      symbol: tuple(R.sub(R.zero, symbol[0]), symbol[1]),
    })),
    wrap
  )

/**
 * @since 1.0.0
 * @category Polynomial Operations
 */
export const getDerivative =
  <R>(scale: (power: number, coeff: R) => R, F: Fld.Field<R>) =>
  (x: Polynomial<R, R>): Polynomial<R, R> =>
    pipe(
      x,
      RA.filterMap(({ symbol: [coefficient, power], evaluate }) =>
        pipe(
          monomial(tuple(scale(power, coefficient), power - 1), evaluate),
          O.fromPredicate(() => power >= 1)
        )
      ),
      a => wrap(a),
      combineLikeTerms(F)
    )

/**
 * @since 1.0.0
 * @category Polynomial Operations
 */
export const getAntiderivative =
  <R>(scale: (power: number, coeff: R) => R, F: Fld.Field<R>) =>
  (constantTerm: R) =>
  (x: Polynomial<R, R>): Polynomial<R, R> =>
    pipe(
      x,
      RA.map(({ symbol: [coefficient, power], evaluate }) =>
        monomial(tuple(scale(1 / (power + 1), coefficient), power + 1), evaluate)
      ),
      RA.prepend(monomial(tuple(constantTerm, 0), identity)),
      a => wrap(a),
      combineLikeTerms(F)
    )
