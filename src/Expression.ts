import * as Eq from 'fp-ts/Eq'
import * as Fun from 'fp-ts/Functor'
import * as FunI from 'fp-ts/FunctorWithIndex'
import * as Prof from 'fp-ts/Profunctor'
import * as RA from 'fp-ts/ReadonlyArray'
import { flow, pipe } from 'fp-ts/function'

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export interface Term<S, C, R> {
  _eqS: Eq.Eq<S>
  symbol: S
  evaluate: (x: C) => R
}

/**
 * @since 1.0.0
 * @category Model
 */
export type Expression<S, C, R> = ReadonlyArray<Term<S, C, R>>

// #####################
// ### Non-Pipeables ###
// #####################

const _map: Fun.Functor3<URI>['map'] = (fa, a) => pipe(fa, map(a))
const _mapWithIndex: FunI.FunctorWithIndex3<URI, number>['mapWithIndex'] = (fa, f) =>
  pipe(fa, mapWithIndex(f))
const _promap: Prof.Profunctor3<URI>['promap'] = (fa, f, g) => pipe(fa, promap(f, g))

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const URI = 'Expression'

/**
 * @since 1.0.0
 * @category Instances
 */
export type URI = typeof URI

declare module 'fp-ts/HKT' {
  interface URItoKind3<R, E, A> {
    readonly [URI]: Expression<R, E, A>
  }
}

/**
 * @since 1.0.0
 * @category Internal
 */
const contramapEvaluate: <S, C, R, D>(
  f: (x: D) => C
) => (t: Term<S, C, R>) => Term<S, D, R> = f => t => ({
  ...t,
  evaluate: flow(f, t.evaluate),
})

/**
 * @since 1.0.0
 * @category Internal
 */
const mapEvaluate: <S, C, A, B>(f: (x: A) => B) => (t: Term<S, C, A>) => Term<S, C, B> =
  f => t => ({
    ...t,
    evaluate: flow(t.evaluate, f),
  })

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const map: <S, C, A, B>(
  f: (a: A) => B
) => (fa: Expression<S, C, A>) => Expression<S, C, B> = f => RA.map(mapEvaluate(f))

/**
 * @since 1.0.0
 * @category Instances
 */
export const Functor: Fun.Functor3<URI> = {
  URI,
  map: _map,
}

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const mapWithIndex: <S, C, A, B>(
  f: (i: number, a: A) => B
) => (v: Expression<S, C, A>) => Expression<S, C, B> = f =>
  RA.mapWithIndex((i, a) =>
    pipe(
      a,
      mapEvaluate(x => f(i, x))
    )
  )

/**
 * @since 1.0.0
 * @category Instances
 */
export const FunctorWithIndex: FunI.FunctorWithIndex3<URI, number> = {
  ...Functor,
  mapWithIndex: _mapWithIndex,
}

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const contramap: <S, C, R, D>(
  f: (x: D) => C
) => (exp: Expression<S, C, R>) => Expression<S, D, R> = f => RA.map(contramapEvaluate(f))

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const promap: <S, C, R, D, E>(
  f: (x: D) => C,
  g: (x: R) => E
) => (fa: Expression<S, C, R>) => Expression<S, D, E> = (f, g) =>
  RA.map(flow(contramapEvaluate(f), mapEvaluate(g)))

/**
 * @since 1.0.0
 * @category Instances
 */
export const Profunctor: Prof.Profunctor3<URI> = {
  ...Functor,
  promap: _promap,
}
