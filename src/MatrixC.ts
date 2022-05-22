import * as Fun from 'fp-ts/Functor'
import * as FunI from 'fp-ts/FunctorWithIndex'
import * as Ap from 'fp-ts/Apply'
import * as Apl from 'fp-ts/Applicative'
import * as Chn from 'fp-ts/Chain'
import * as Fld from 'fp-ts/Field'
import * as Fl from 'fp-ts/Foldable'
import * as FlI from 'fp-ts/FoldableWithIndex'
import * as Mon from 'fp-ts/Monad'
import * as Mn from 'fp-ts/Monoid'
import * as N from 'fp-ts/number'
import * as Pt from 'fp-ts/Pointed'
import * as RA from 'fp-ts/ReadonlyArray'
import * as Rng from 'fp-ts/Ring'
import { flow, identity, pipe } from 'fp-ts/function'

import * as V from './VecC'
import * as AbGrp from './AbelianGroup'
import * as U from './lib/utilities'

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export interface MatC<M, N, A> extends V.VecC<M, V.VecC<N, A>> {
  _rows: M
  _cols: N
}

// ####################
// ### Constructors ###
// ####################

/**
 * @since 1.0.0
 * @category Internal
 */
const wrap: <M, N, A>(ks: ReadonlyArray<ReadonlyArray<A>>) => MatC<M, N, A> = ks =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ks as any

/**
 * @since 1.0.0
 * @category Constructors
 */
export const from2dVectors: <M, N, A>(
  ks: V.VecC<M, V.VecC<N, A>>
) => MatC<M, N, A> = ks =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ks as any

/**
 * @since 1.0.0
 * @category Constructors
 */
export const fromNestedTuples: {
  <A>(t: []): MatC<0, 0, A>
  <A>(t: [[A]]): MatC<1, 1, A>
  <A>(t: [[A, A]]): MatC<1, 2, A>
  <A>(t: [[A], [A]]): MatC<2, 1, A>
  <A>(t: [[A, A], [A, A]]): MatC<2, 2, A>
  <A>(t: [[A, A, A]]): MatC<1, 3, A>
  <A>(t: [[A], [A], [A]]): MatC<3, 1, A>
  <A>(t: [[A, A, A], [A, A, A]]): MatC<2, 3, A>
  <A>(t: [[A, A], [A, A], [A, A]]): MatC<3, 2, A>
  <A>(t: [[A, A, A], [A, A, A], [A, A, A]]): MatC<3, 3, A>
  <A>(t: [[A, A, A, A]]): MatC<1, 4, A>
  <A>(t: [[A], [A], [A], [A]]): MatC<4, 1, A>
  <A>(t: [[A, A, A, A], [A, A, A, A]]): MatC<2, 4, A>
  <A>(t: [[A, A], [A, A], [A, A], [A, A]]): MatC<4, 2, A>
  <A>(t: [[A, A, A, A], [A, A, A, A], [A, A, A, A]]): MatC<3, 4, A>
  <A>(t: [[A, A, A], [A, A, A], [A, A, A], [A, A, A]]): MatC<4, 3, A>
  <A>(t: [[A, A, A, A], [A, A, A, A], [A, A, A, A], [A, A, A, A]]): MatC<4, 4, A>
} = wrap

/**
 * Constructs the identity matrix
 *
 * @since 1.0.0
 * @category Constructors
 */
export const id: <A>(R: Rng.Ring<A>) => <M extends number>(m: M) => MatC<M, M, A> =
  R => m =>
    pipe(
      RA.makeBy(m, i => RA.makeBy(m, j => (i === j ? R.one : R.zero))),
      a => wrap(a)
    )

export const repeat: <A>(
  a: A
) => <M extends number, N extends number>(m: M, n: N) => MatC<M, N, A> = a => (m, n) =>
  from2dVectors(V.repeat(m, V.repeat(n, a)))

// #####################
// ### Non-Pipeables ###
// #####################

const _map: Fun.Functor3<URI>['map'] = (fa, f) => pipe(fa, map(f))
const _mapWithIndex: FunI.FunctorWithIndex3<URI, [number, number]>['mapWithIndex'] = (
  fa,
  f
) => pipe(fa, mapWithIndex(f))

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const URI = 'MatC'

/**
 * @since 1.0.0
 * @category Instances
 */
export type URI = typeof URI

declare module 'fp-ts/HKT' {
  interface URItoKind3<R, E, A> {
    readonly [URI]: MatC<R, E, A>
  }
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const getAdditiveAbelianGroup =
  <A>(R: Rng.Ring<A>) =>
  <M extends number, N extends number>(
    m: M,
    n: N
  ): AbGrp.AbelianGroup<MatC<M, N, A>> => ({
    empty: repeat(R.zero)(m, n),
    concat: (x, y) =>
      pipe(
        x,
        V.mapWithIndex((i, a) =>
          pipe(
            a,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            V.mapWithIndex((j, b) => R.add(b, (y[i] as any)[j] as any))
          )
        ),
        a => from2dVectors(a)
      ),
    inverse: flow(V.map(V.map(b => R.sub(R.zero, b))), a => from2dVectors(a)),
  })

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const map: <M, N, A, B>(f: (a: A) => B) => (v: MatC<M, N, A>) => MatC<M, N, B> =
  f => v =>
    pipe(v, RA.map(RA.map(f)), a => wrap(a))

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
export const mapWithIndex: <M, N, A, B>(
  f: (ij: [number, number], a: A) => B
) => (v: MatC<M, N, A>) => MatC<M, N, B> = f => v =>
  pipe(
    v,
    RA.mapWithIndex((i, a) =>
      pipe(
        a,
        RA.mapWithIndex((j, b) => f([i, j], b))
      )
    ),
    a => wrap(a)
  )

/**
 * @since 1.0.0
 * @category Instances
 */
export const FunctorWithIndex: FunI.FunctorWithIndex3<URI, [number, number]> = {
  ...Functor,
  mapWithIndex: _mapWithIndex,
}

/**
 * @since 1.0.0
 * @category Utilities
 */
export const mul =
  <A>(R: Rng.Ring<A>) =>
  <M extends number, N extends number, P extends number>(
    x: MatC<M, N, A>,
    y: MatC<N, P, A>
  ): MatC<M, P, A> =>
    x[0] === undefined
      ? wrap([])
      : y[0] === undefined
      ? wrap([])
      : pipe(
          repeat(R.zero)(x.length as M, y[0].length as P),
          V.mapWithIndex((i, r) =>
            pipe(
              r,
              V.mapWithIndex(j =>
                pipe(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  RA.makeBy(y.length, k => R.mul((x[i] as any)[k], (y[k] as any)[j])),
                  RA.foldMap(U.getAdditionMonoid(R))(identity)
                )
              )
            )
          ),
          a => from2dVectors(a)
        )
