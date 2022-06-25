/**
 * Adapted from:
 * https://pursuit.purescript.org/packages/purescript-polynomials/1.0.1/docs/Data.Polynomial#t:Polynomial
 */
import * as ChnRec from 'fp-ts/ChainRec'
import * as Eq from 'fp-ts/Eq'
import * as E from 'fp-ts/Either'
import * as Fld from 'fp-ts/Field'
import * as Fun from 'fp-ts/Functor'
import * as FunI from 'fp-ts/FunctorWithIndex'
import * as IO from 'fp-ts/IO'
import { Monoid } from 'fp-ts/Monoid'
import * as O from 'fp-ts/Option'
import * as Ord from 'fp-ts/Ord'
import * as RA from 'fp-ts/ReadonlyArray'
import * as Rng from 'fp-ts/Ring'
import { Semigroup } from 'fp-ts/Semigroup'
import { flow, identity as id, pipe, tuple, unsafeCoerce } from 'fp-ts/function'

import * as TC from './typeclasses'
import { Complex } from './complex'

const PolynomialSymbol = Symbol('Polynomial')
type PolynomialSymbol = typeof PolynomialSymbol

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export interface Polynomial<R> extends ReadonlyArray<R> {
  _URI: PolynomialSymbol
}

// ####################
// ### Constructors ###
// ####################

/**
 * @since 1.0.0
 * @category Internal
 */
const wrap: <R>(as: ReadonlyArray<R>) => Polynomial<R> = unsafeCoerce

/**
 * @since 1.0.0
 * @category Constructors
 */
export const fromCoefficientArray =
  <R>(Eq: Eq.Eq<R>, R: Rng.Ring<R>) =>
  (rs: ReadonlyArray<R>): Polynomial<R> => {
    const go: (
      acc: ReadonlyArray<R>
    ) => E.Either<ReadonlyArray<R>, Polynomial<R>> = acc => {
      const last = RA.last(acc)

      // Base case: array is empty
      if (O.isNone(last)) return E.right(wrap(acc))

      // Base case: ends in non-zero coefficient
      if (!Eq.equals(R.zero, last.value)) return E.right(wrap(acc))

      // Continue dropping the zerod-value ending coefficient
      return pipe(acc, RA.dropRight(1), E.left)
    }
    return ChnRec.tailRec(rs, go)
  }

/**
 * @since 1.0.0
 * @category Constructors
 */
export const one: <R>(R: Rng.Ring<R>) => Polynomial<R> = R => wrap([R.one])

/**
 * @since 1.0.0
 * @category Constructors
 */
export const zero = <R>(): Polynomial<R> => wrap(RA.zero())

/**
 * @since 1.0.0
 * @category Constructors
 */
export const randPolynomial: <R>(
  terms: number,
  make: IO.IO<R>
) => IO.IO<Polynomial<R>> = (terms, make) =>
  flow(RA.sequence(IO.Applicative)(RA.replicate(terms, make)), wrap)

// #####################
// ### Non-Pipeables ###
// #####################

const _map: Fun.Functor1<URI>['map'] = (fa, a) => pipe(fa, map(a))
const _mapWithIndex: FunI.FunctorWithIndex1<URI, number>['mapWithIndex'] = (fa, f) =>
  pipe(fa, mapWithIndex(f))

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
  interface URItoKind<A> {
    readonly [URI]: Polynomial<A>
  }
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const getPolynomialEq: <R>(Eq: Eq.Eq<R>) => Eq.Eq<Polynomial<R>> = RA.getEq

/**
 * @since 1.0.0
 * @category Instances
 */
export const getPolynomialOrd: <R>(Eq: Ord.Ord<R>) => Ord.Ord<Polynomial<R>> = RA.getOrd

/**
 * @since 1.0.0
 * @category Instance Operations
 */
export const add: <R>(
  Eq: Eq.Eq<R>,
  R: Rng.Ring<R>
) => (x: Polynomial<R>, y: Polynomial<R>) => Polynomial<R> = (E, R) =>
  flow(preservingZipWith(R.add, R.zero), fromCoefficientArray(E, R))

/**
 * @since 1.0.0
 * @category Instance Operations
 */
export const sub: <R>(
  Eq: Eq.Eq<R>,
  R: Rng.Ring<R>
) => (x: Polynomial<R>, y: Polynomial<R>) => Polynomial<R> = (E, R) =>
  flow(preservingZipWith(R.sub, R.zero), fromCoefficientArray(E, R))

/**
 * @since 1.0.0
 * @category Instance Operations
 */
export const mul =
  <R>(Eq: Eq.Eq<R>, R: Rng.Ring<R>) =>
  (xs: Polynomial<R>, ys: Polynomial<R>): Polynomial<R> =>
    pipe(
      xs,
      RA.mapWithIndex((i, a) =>
        pipe(
          ys,
          shiftBy(i, R.zero),
          RA.map(y => R.mul(y, a))
        )
      ),
      RA.reduceRight(RA.zero<R>(), preservingZipWith(R.add, R.zero)),
      fromCoefficientArray(Eq, R)
    )

/**
 * @since 1.0.0
 * @category Instances
 */
export const getAdditiveAbelianGroup = <R>(
  Eq: Eq.Eq<R>,
  R: Rng.Ring<R>
): TC.AbelianGroup<Polynomial<R>> => ({
  concat: add(Eq, R),
  empty: zero(),
  inverse: a => sub(Eq, R)(zero(), a),
})

/**
 * @since 1.0.0
 * @category Instances
 */
export const getCommutativeRing = <R>(
  E: Eq.Eq<R>,
  R: Rng.Ring<R>
): TC.CommutativeRing<Polynomial<R>> => ({
  add: add(E, R),
  sub: sub(E, R),
  zero: zero(),
  mul: mul(E, R),
  one: one(R),
})

/**
 * @since 1.0.0
 * @category Instances
 */
export const getBimodule: <R>(
  E: Eq.Eq<R>,
  R: Rng.Ring<R>
) => TC.Bimodule<Polynomial<R>, R> = (E, R) => ({
  ...getAdditiveAbelianGroup(E, R),
  leftScalarMul: (n, as) =>
    pipe(
      as,
      RA.map(a => R.mul(n, a)),
      wrap
    ),
  rightScalarMul: (as, n) =>
    pipe(
      as,
      RA.map(a => R.mul(a, n)),
      wrap
    ),
})

/**
 * @since 1.0.0
 * @category Instances
 */
export const getEuclidianRing = <F>(
  E: Eq.Eq<F>,
  F: Fld.Field<F>
): TC.EuclidianRing<Polynomial<F>> => ({
  ...getCommutativeRing(E, F),
  div: (x, y) => polynomialDivMod(E, F)(x, y).div,
  mod: (x, y) => polynomialDivMod(E, F)(x, y).mod,
  degree: polynomialDegree,
})

/**
 * @since 1.0.0
 * @category Instances
 */
export const getCompositionSemigroup: <R>(
  Eq_: Eq.Eq<R>,
  R: Rng.Ring<R>
) => Semigroup<Polynomial<R>> = (E, R) => ({
  concat: (x, y) => polynomialCompose(E, R)(x)(y),
})

/**
 * @since 1.0.0
 * @category Instances
 */
export const getCompositionMonoid: <R>(
  Eq_: Eq.Eq<R>,
  R: Rng.Ring<R>
) => Monoid<Polynomial<R>> = (E, R) => ({
  ...getCompositionSemigroup(E, R),
  empty: identity(R),
})

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const map: <A, B>(f: (a: A) => B) => (fa: Polynomial<A>) => Polynomial<B> = f =>
  flow(RA.map(f), wrap)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Functor: Fun.Functor1<URI> = {
  URI,
  map: _map,
}

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const mapWithIndex: <A, B>(
  f: (i: number, a: A) => B
) => (fa: Polynomial<A>) => Polynomial<B> = f => flow(RA.mapWithIndex(f), wrap)

/**
 * @since 1.0.0
 * @category Instances
 */
export const FunctorWithIndex: FunI.FunctorWithIndex1<URI, number> = {
  ...Functor,
  mapWithIndex: _mapWithIndex,
}

// ###################
// ### Destructors ###
// ###################

/**
 * @since 1.0.0
 * @category Destructors
 */
export const coefficients: <R>(p: Polynomial<R>) => ReadonlyArray<R> = id

// #############################
// ### Polynomial Operations ###
// #############################

/**
 * @since 1.0.0
 * @category Polynomial Operations
 */
export const identity: <R>(R: Rng.Ring<R>) => Polynomial<R> = R => wrap([R.zero, R.one])

/**
 * @since 1.0.0
 * @category Polynomial Operations
 */
export const constant: <R>(Eq: Eq.Eq<R>, R: Rng.Ring<R>) => (a: R) => Polynomial<R> = (
  Eq,
  R
) => flow(RA.of, fromCoefficientArray(Eq, R))

/**
 * @since 1.0.0
 * @category Polynomial Operations
 */
export const evaluate =
  <R>(R: Rng.Ring<R>) =>
  (p: Polynomial<R>) =>
  (x: R): R =>
    pipe(
      p,
      RA.reduce(tuple(R.zero, R.one), ([acc, val], coeff) => {
        const newVal = R.mul(val, x)
        const term = R.mul(coeff, val)
        return tuple(R.add(acc, term), newVal)
      }),
      ([acc]) => acc
    )

/**
 * @since 1.0.0
 * @category Polynomial Operations
 */
export const polynomialCompose: <R>(
  Eq: Eq.Eq<R>,
  R: Rng.Ring<R>
) => (x: Polynomial<R>) => (y: Polynomial<R>) => Polynomial<R> = (Eq, R) => x =>
  pipe(x, map(constant(Eq, R)), evaluate(getCommutativeRing(Eq, R)))

/**
 * @since 1.0.0
 * @category Polynomial Operations
 */
export const polynomialDegree: <R>(p: Polynomial<R>) => number = flow(
  coefficients,
  RA.size,
  n => n - 1
)

/**
 * @since 1.0.0
 * @category Polynomial Operations
 */
export const derivative: <R>(
  scaleLeft: (n: number, r: R) => R
) => (coeffs: Polynomial<R>) => Polynomial<R> = scaleLeft =>
  flow(
    RA.mapWithIndex((i, coeff) => scaleLeft(i, coeff)),
    RA.dropLeft(1),
    wrap
  )

/**
 * @since 1.0.0
 * @category Polynomial Operations
 */
export const integrate: <R>(
  R: Rng.Ring<R>,
  scaleLeft: (n: number, r: R) => R
) => (lower: R, upper: R) => (p: Polynomial<R>) => R = (R, scaleLeft) => (lower, upper) =>
  flow(
    mapWithIndex((i, coeff) => scaleLeft(1 / (i + 1), coeff)),
    x => R.sub(evaluate(R)(x)(upper), evaluate(R)(x)(lower))
  )

/**
 * @since 1.0.0
 * @category Polynomial Operations
 */
export const antiderivative: <R>(
  constantTerm: R,
  scaleLeft: (n: number, r: R) => R
) => (p: Polynomial<R>) => Polynomial<R> = (constantTerm, scaleLeft) =>
  flow(
    RA.mapWithIndex((i, coeff) => scaleLeft(1 / (i + 1), coeff)),
    RA.prepend(constantTerm),
    wrap
  )

/**
 * @since 1.0.0
 * @category Polynomial Operations
 */
export const l2InnerProduct: <R extends number | Complex>(
  Eq_: Eq.Eq<R>,
  R: Rng.Ring<R>,
  scaleLeft: (n: number, r: R) => R,
  conj: (r: R) => R
) => (p: Polynomial<R>, q: Polynomial<R>) => R = (Eq_, R, scaleLeft, conj) => (p, q) => {
  const RP = getCommutativeRing(Eq_, R)
  const evaluateR = evaluate(R)
  const convolution = antiderivative(R.zero, scaleLeft)(RP.mul(p, pipe(q, map(conj))))
  return evaluateR(convolution)(R.one)
}

/**
 * @since 1.0.0
 * @category Polynomial Operations
 */
export const norm: <R extends number | Complex>(
  Eq_: Eq.Eq<R>,
  R: Rng.Ring<R>,
  scaleLeft: (n: number, r: R) => R,
  sqrt: (r: R) => R,
  conj: (r: R) => R
) => (p: Polynomial<R>) => R = (Eq_, R, scaleLeft, sqrt, conj) => p =>
  sqrt(l2InnerProduct(Eq_, R, scaleLeft, conj)(p, p))

/**
 * @since 1.0.0
 * @category Polynomial Operations
 */
export const projection: <R extends number | Complex>(
  Eq_: Eq.Eq<R>,
  F: Fld.Field<R>,
  scaleLeft: (n: number, r: R) => R,
  conj: (r: R) => R
) => (p: Polynomial<R>, q: Polynomial<R>) => Polynomial<R> =
  (Eq_, F, scaleLeft, conj) => (p, q) => {
    const ER = getEuclidianRing(Eq_, F)
    const ipF = l2InnerProduct(Eq_, F, scaleLeft, conj)
    return ER.mul(constant(Eq_, F)(F.div(ipF(p, q), ipF(p, p))), p)
  }

// #################
// ### Utilities ###
// #################

/**
 * @since 1.0.0
 * @category Utilities
 */
export const preservingZipWith =
  <R, S>(f: (x: R, y: R) => S, def: R) =>
  (xs: ReadonlyArray<R>, ys: ReadonlyArray<R>): ReadonlyArray<S> => {
    const go: (
      acc: [ReadonlyArray<S>, number]
    ) => E.Either<[ReadonlyArray<S>, number], ReadonlyArray<S>> = ([zs, i]) => {
      const x = RA.lookup(i)(xs)
      const y = RA.lookup(i)(ys)

      if (O.isSome(x) && O.isSome(y))
        return E.left(tuple(pipe(zs, RA.concat(RA.of(f(x.value, y.value))), wrap), i + 1))
      if (O.isSome(x) && O.isNone(y))
        return E.left(tuple(pipe(zs, RA.concat(RA.of(f(x.value, def))), wrap), i + 1))
      if (O.isNone(x) && O.isSome(y))
        return E.left(tuple(pipe(zs, RA.concat(RA.of(f(def, y.value))), wrap), i + 1))
      return E.right(zs)
    }
    return ChnRec.tailRec(tuple(RA.zero<S>(), 0), go)
  }

// ################
// ### Internal ###
// ################

/**
 * @since 1.0.0
 * @category Internal
 */
export const shiftBy: <R>(n: number, r: R) => (p: ReadonlyArray<R>) => ReadonlyArray<R> =
  (n, x) => xs =>
    pipe(RA.replicate(n, x), RA.concat(xs))

/**
 * @since 1.0.0
 * @category Internal
 */
const polynomialDivMod =
  <R>(Eq_: Eq.Eq<R>, F: Fld.Field<R>) =>
  (a: Polynomial<R>, b: Polynomial<R>): { div: Polynomial<R>; mod: Polynomial<R> } => {
    const lc: (as: ReadonlyArray<R>) => R = unsafeCoerce(
      (a: ReadonlyArray<R>) => a[a.length - 1]
    )
    const d = polynomialDegree(b)
    const c = lc(b)
    const R = getCommutativeRing(Eq_, F)
    const go: (
      acc: [Polynomial<R>, Polynomial<R>]
    ) => E.Either<
      [Polynomial<R>, Polynomial<R>],
      { div: Polynomial<R>; mod: Polynomial<R> }
    > = ([q, r]) => {
      const degreeDiff = polynomialDegree(r) - d
      if (degreeDiff < 0) return E.right({ div: q, mod: r })
      const s = wrap(pipe([F.div(lc(r), c)], shiftBy(degreeDiff, F.zero)))
      return E.left([R.add(q, s), R.sub(r, R.mul(s, b))])
    }
    return ChnRec.tailRec(tuple(R.zero, a), go)
  }
