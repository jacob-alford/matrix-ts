import * as Fun from 'fp-ts/Functor'
import * as FunI from 'fp-ts/FunctorWithIndex'
import * as Fl from 'fp-ts/Foldable'
import * as FlI from 'fp-ts/FoldableWithIndex'
import * as Mn from 'fp-ts/Monoid'
import * as RA from 'fp-ts/ReadonlyArray'
import * as Rng from 'fp-ts/Ring'
import { flow, identity, pipe } from 'fp-ts/function'

import * as V from './VecC'
import * as AbGrp from './AbelianGroup'
import * as Mod from './Module'
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
const _reduce: Fl.Foldable3<URI>['reduce'] = (fa, b, f) => pipe(fa, reduce(b, f))
const _foldMap: Fl.Foldable3<URI>['foldMap'] = M => (fa, f) => pipe(fa, foldMap(M)(f))
const _reduceRight: Fl.Foldable3<URI>['reduceRight'] = (fa, b, f) =>
  pipe(fa, reduceRight(b, f))
const _reduceWithIndex: FlI.FoldableWithIndex3<
  URI,
  [number, number]
>['reduceWithIndex'] = (fa, b, f) => pipe(fa, reduceWithIndex(b, f))
const _foldMapWithIndex: FlI.FoldableWithIndex3<
  URI,
  [number, number]
>['foldMapWithIndex'] = M => (fa, f) => pipe(fa, foldMapWithIndex(M)(f))
const _reduceRightWithIndex: FlI.FoldableWithIndex3<
  URI,
  [number, number]
>['reduceRightWithIndex'] = (fa, b, f) => pipe(fa, reduceRightWithIndex(b, f))

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
 * @category Instances
 */
export const getBimodule: <A>(
  R: Rng.Ring<A>
) => <M extends number, N extends number>(m: M, n: N) => Mod.Bimodule<A, MatC<M, N, A>> =
  R => (m, n) => ({
    ...getAdditiveAbelianGroup(R)(m, n),
    _R: R,
    leftScalarMul: (r, x) =>
      pipe(
        x,
        map(a => R.mul(r, a))
      ),
    rightScalarMul: (x, r) =>
      pipe(
        x,
        map(a => R.mul(r, a))
      ),
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
 * @category Instance operations
 */
export const reduce: <M, N, A, B>(
  b: B,
  f: (b: B, a: A) => B
) => (fa: MatC<M, N, A>) => B = (b, f) => fa =>
  pipe(
    fa,
    RA.reduce(b, (b, a) => pipe(a, RA.reduce(b, f)))
  )

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const foldMap: <M>(
  M: Mn.Monoid<M>
) => <N, O, A>(f: (a: A) => M) => (fa: MatC<N, O, A>) => M = M => f => fa =>
  pipe(
    fa,
    RA.foldMap(M)(a => pipe(a, RA.foldMap(M)(f)))
  )

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const reduceRight: <M, N, B, A>(
  b: A,
  f: (b: B, a: A) => A
) => (fa: MatC<M, N, B>) => A = (a, f) => fa =>
  pipe(
    fa,
    RA.reduceRight(a, (b, a) => pipe(b, RA.reduceRight(a, f)))
  )

/**
 * @since 1.0.0
 * @category Instances
 */
export const Foldable: Fl.Foldable3<URI> = {
  URI,
  reduce: _reduce,
  foldMap: _foldMap,
  reduceRight: _reduceRight,
}

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const reduceWithIndex: <M, N, A, B>(
  b: B,
  f: (i: [number, number], b: B, a: A) => B
) => (fa: MatC<M, N, A>) => B = (b, f) => fa =>
  pipe(
    fa,
    RA.reduceWithIndex(b, (i, b, a) =>
      pipe(
        a,
        RA.reduceWithIndex(b, (j, b, a) => f([i, j], b, a))
      )
    )
  )

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const foldMapWithIndex: <M>(
  M: Mn.Monoid<M>
) => <N, O, A>(f: (i: [number, number], a: A) => M) => (fa: MatC<N, O, A>) => M =
  M => f => fa =>
    pipe(
      fa,
      RA.foldMapWithIndex(M)((i, a) =>
        pipe(
          a,
          RA.foldMapWithIndex(M)((j, a) => f([i, j], a))
        )
      )
    )

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const reduceRightWithIndex: <M, N, B, A>(
  b: A,
  f: (i: [number, number], b: B, a: A) => A
) => (fa: MatC<M, N, B>) => A = (a, f) => fa =>
  pipe(
    fa,
    RA.reduceRightWithIndex(a, (i, a, b) =>
      pipe(
        a,
        RA.reduceRightWithIndex(b, (j, a, b) => f([i, j], a, b))
      )
    )
  )

/**
 * @since 1.0.0
 * @category Instances
 */
export const FoldableWithIndex: FlI.FoldableWithIndex3<URI, [number, number]> = {
  ...Foldable,
  reduceWithIndex: _reduceWithIndex,
  foldMapWithIndex: _foldMapWithIndex,
  reduceRightWithIndex: _reduceRightWithIndex,
}

// #########################
// ### Matrix Operations ###
// #########################

/**
 * @since 1.0.0
 * @category Matrix Operations
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
          mapWithIndex(([i, j]) =>
            pipe(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              RA.makeBy(y.length, k => R.mul((x[i] as any)[k], (y[k] as any)[j])),
              RA.foldMap(U.getAdditionMonoid(R))(identity)
            )
          )
        )

/**
 * @since 1.0.0
 * @category Matrix Operations
 */
export const trace: <M extends number, A>(
  R: Rng.Ring<A>
) => (fa: MatC<M, M, A>) => A = R =>
  foldMapWithIndex(U.getAdditionMonoid(R))(([i, j], a) => (i === j ? a : R.zero))

/**
 * @since 1.0.0
 * @category Matrix Operations
 */
export const transpose = <M extends number, N extends number, A>(
  v: MatC<M, N, A>
): MatC<N, M, A> =>
  v[0] === undefined
    ? wrap([])
    : pipe(
        repeat(0)(v[0].length as N, v.length as M),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mapWithIndex(([i, j]) => (v[j] as any)[i])
      )
