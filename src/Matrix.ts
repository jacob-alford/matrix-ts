/**
 * A constrained matrix type. Allows for matrix/vector operations that won't fail due to
 * incompatible shapes
 */
import * as Fun from 'fp-ts/Functor'
import * as FunI from 'fp-ts/FunctorWithIndex'
import * as Fl from 'fp-ts/Foldable'
import * as FlI from 'fp-ts/FoldableWithIndex'
import * as Mn from 'fp-ts/Monoid'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as Rng from 'fp-ts/Ring'
import { flow, identity, pipe, unsafeCoerce } from 'fp-ts/function'

import * as LM from './LinearMap'
import * as TC from './typeclasses'
import * as V from './Vector'
import * as U from './lib/utilities'

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export interface Mat<M, N, A> extends V.Vec<M, V.Vec<N, A>> {
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
const wrap: <M, N, A>(ks: ReadonlyArray<ReadonlyArray<A>>) => Mat<M, N, A> = unsafeCoerce

/**
 * @since 1.0.0
 * @category Constructors
 */
export const from2dVectors: <M, N, A>(ks: V.Vec<M, V.Vec<N, A>>) => Mat<M, N, A> =
  unsafeCoerce

/**
 * @since 1.0.0
 * @category Constructors
 */
export const fromNestedTuples: {
  <A>(t: []): Mat<0, 0, A>
  <A>(t: [[A]]): Mat<1, 1, A>
  <A>(t: [[A, A]]): Mat<1, 2, A>
  <A>(t: [[A], [A]]): Mat<2, 1, A>
  <A>(t: [[A, A], [A, A]]): Mat<2, 2, A>
  <A>(t: [[A, A, A]]): Mat<1, 3, A>
  <A>(t: [[A], [A], [A]]): Mat<3, 1, A>
  <A>(t: [[A, A, A], [A, A, A]]): Mat<2, 3, A>
  <A>(t: [[A, A], [A, A], [A, A]]): Mat<3, 2, A>
  <A>(t: [[A, A, A], [A, A, A], [A, A, A]]): Mat<3, 3, A>
  <A>(t: [[A, A, A, A]]): Mat<1, 4, A>
  <A>(t: [[A], [A], [A], [A]]): Mat<4, 1, A>
  <A>(t: [[A, A, A, A], [A, A, A, A]]): Mat<2, 4, A>
  <A>(t: [[A, A], [A, A], [A, A], [A, A]]): Mat<4, 2, A>
  <A>(t: [[A, A, A, A], [A, A, A, A], [A, A, A, A]]): Mat<3, 4, A>
  <A>(t: [[A, A, A], [A, A, A], [A, A, A], [A, A, A]]): Mat<4, 3, A>
  <A>(t: [[A, A, A, A], [A, A, A, A], [A, A, A, A], [A, A, A, A]]): Mat<4, 4, A>
  <A>(t: [[A, A, A, A, A]]): Mat<1, 5, A>
  <A>(t: [[A], [A], [A], [A], [A]]): Mat<5, 1, A>
  <A>(t: [[A, A, A, A, A], [A, A, A, A, A]]): Mat<2, 5, A>
  <A>(t: [[A, A], [A, A], [A, A], [A, A], [A, A]]): Mat<5, 2, A>
  <A>(t: [[A, A, A, A, A], [A, A, A, A, A], [A, A, A, A, A]]): Mat<3, 5, A>
  <A>(t: [[A, A, A], [A, A, A], [A, A, A], [A, A, A], [A, A, A]]): Mat<5, 3, A>
  <A>(t: [[A, A, A, A, A], [A, A, A, A, A], [A, A, A, A, A], [A, A, A, A, A]]): Mat<
    4,
    5,
    A
  >
  <A>(t: [[A, A, A, A], [A, A, A, A], [A, A, A, A], [A, A, A, A], [A, A, A, A]]): Mat<
    5,
    4,
    A
  >
  <A>(
    t: [
      [A, A, A, A, A],
      [A, A, A, A, A],
      [A, A, A, A, A],
      [A, A, A, A, A],
      [A, A, A, A, A]
    ]
  ): Mat<5, 5, A>
  <A>(t: [[A, A, A, A, A, A]]): Mat<1, 6, A>
  <A>(t: [[A], [A], [A], [A], [A], [A]]): Mat<6, 1, A>
  <A>(t: [[A, A, A, A, A, A], [A, A, A, A, A, A]]): Mat<2, 6, A>
  <A>(t: [[A, A], [A, A], [A, A], [A, A], [A, A], [A, A]]): Mat<6, 2, A>
  <A>(t: [[A, A, A, A, A, A], [A, A, A, A, A, A], [A, A, A, A, A, A]]): Mat<3, 6, A>
  <A>(t: [[A, A, A], [A, A, A], [A, A, A], [A, A, A], [A, A, A], [A, A, A]]): Mat<6, 3, A>
  <A>(
    t: [[A, A, A, A, A, A], [A, A, A, A, A, A], [A, A, A, A, A, A], [A, A, A, A, A, A]]
  ): Mat<4, 6, A>
  <A>(
    t: [
      [A, A, A, A],
      [A, A, A, A],
      [A, A, A, A],
      [A, A, A, A],
      [A, A, A, A],
      [A, A, A, A]
    ]
  ): Mat<6, 4, A>
  <A>(
    t: [
      [A, A, A, A, A, A],
      [A, A, A, A, A, A],
      [A, A, A, A, A, A],
      [A, A, A, A, A, A],
      [A, A, A, A, A, A]
    ]
  ): Mat<5, 6, A>
  <A>(
    t: [
      [A, A, A, A, A],
      [A, A, A, A, A],
      [A, A, A, A, A],
      [A, A, A, A, A],
      [A, A, A, A, A],
      [A, A, A, A, A]
    ]
  ): Mat<6, 5, A>
  <A>(
    t: [
      [A, A, A, A, A, A],
      [A, A, A, A, A, A],
      [A, A, A, A, A, A],
      [A, A, A, A, A, A],
      [A, A, A, A, A, A],
      [A, A, A, A, A, A]
    ]
  ): Mat<6, 6, A>
} = wrap

/**
 * @since 1.0.0
 * @category Constructors
 */
export const fromNestedReadonlyArrays: <M extends number, N extends number>(
  m: M,
  n: N
) => <A>(as: ReadonlyArray<ReadonlyArray<A>>) => O.Option<Mat<M, N, A>> = (m, n) =>
  flow(
    V.fromReadonlyArray(m),
    O.chain(V.traverse(O.Applicative)(V.fromReadonlyArray(n))),
    O.map(from2dVectors)
  )

/**
 * Constructs the identity matrix
 *
 * @since 1.0.0
 * @category Constructors
 */
export const id: <A>(R: Rng.Ring<A>) => <M extends number>(m: M) => Mat<M, M, A> =
  R => m =>
    pipe(
      RA.makeBy(m, i => RA.makeBy(m, j => (i === j ? R.one : R.zero))),
      a => wrap(a)
    )

/**
 * @since 1.0.0
 * @category Constructors
 */
export const repeat: <A>(
  a: A
) => <M extends number, N extends number>(m: M, n: N) => Mat<M, N, A> = a => (m, n) =>
  from2dVectors(V.repeat(m, V.repeat(n, a)))

/**
 * @since 1.0.0
 * @category Constructors
 */
export const fromVectorAsRow: <N, A>(v: V.Vec<N, A>) => Mat<1, N, A> = flow(
  V.of,
  from2dVectors
)

/**
 * @since 1.0.0
 * @category Constructors
 */
export const fromVectorAsColumn: <N, A>(v: V.Vec<N, A>) => Mat<N, 1, A> = flow(
  V.map(V.of),
  from2dVectors
)

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
export const URI = 'Mat'

/**
 * @since 1.0.0
 * @category Instances
 */
export type URI = typeof URI

declare module 'fp-ts/HKT' {
  interface URItoKind3<R, E, A> {
    readonly [URI]: Mat<R, E, A>
  }
  interface URItoKind2<E, A> {
    readonly [URI]: Mat<E, E, A>
  }
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const getAdditiveAbelianGroup =
  <A>(R: Rng.Ring<A>) =>
  <M extends number, N extends number>(m: M, n: N): TC.AbelianGroup<Mat<M, N, A>> => ({
    empty: repeat(R.zero)(m, n),
    concat: liftA2(R.add),
    inverse: flow(V.map(V.map(b => R.sub(R.zero, b))), a => from2dVectors(a)),
  })

/**
 * @since 1.0.0
 * @category Instances
 */
export const getBimodule: <A>(
  R: Rng.Ring<A>
) => <M extends number, N extends number>(m: M, n: N) => TC.Bimodule<Mat<M, N, A>, A> =
  R => (m, n) => ({
    ...getAdditiveAbelianGroup(R)(m, n),
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
 * @category Instances
 */
export const getLinearMap =
  <R>(R: Rng.Ring<R>) =>
  <M>(A: Mat<M, M, R>): LM.LinearMap2<V.URI, M, R, R> => ({
    mapL: x =>
      pipe(
        A,
        V.map(y => V.innerProduct(R)(x, y))
      ),
  })

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const map: <M, N, A, B>(f: (a: A) => B) => (v: Mat<M, N, A>) => Mat<M, N, B> = f =>
  flow(V.map(V.map(f)), a => wrap(a))

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
) => (v: Mat<M, N, A>) => Mat<M, N, B> = f =>
  flow(
    V.mapWithIndex((i, a) =>
      pipe(
        a,
        V.mapWithIndex((j, b) => f([i, j], b))
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
) => (fa: Mat<M, N, A>) => B = (b, f) => V.reduce(b, (b, a) => pipe(a, V.reduce(b, f)))

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const foldMap: <M>(
  M: Mn.Monoid<M>
) => <N, O, A>(f: (a: A) => M) => (fa: Mat<N, O, A>) => M = M => f =>
  V.foldMap(M)(a => pipe(a, V.foldMap(M)(f)))

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const reduceRight: <M, N, B, A>(
  b: A,
  f: (b: B, a: A) => A
) => (fa: Mat<M, N, B>) => A = (a, f) =>
  V.reduceRight(a, (b, a) => pipe(b, V.reduceRight(a, f)))

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
) => (fa: Mat<M, N, A>) => B = (b, f) =>
  V.reduceWithIndex(b, (i, b, a) =>
    pipe(
      a,
      V.reduceWithIndex(b, (j, b, a) => f([i, j], b, a))
    )
  )

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const foldMapWithIndex: <M>(
  M: Mn.Monoid<M>
) => <N, O, A>(f: (i: [number, number], a: A) => M) => (fa: Mat<N, O, A>) => M = M => f =>
  V.foldMapWithIndex(M)((i, a) =>
    pipe(
      a,
      V.foldMapWithIndex(M)((j, a) => f([i, j], a))
    )
  )

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const reduceRightWithIndex: <M, N, B, A>(
  b: A,
  f: (i: [number, number], b: B, a: A) => A
) => (fa: Mat<M, N, B>) => A = (a, f) =>
  V.reduceRightWithIndex(a, (i, a, b) =>
    pipe(
      a,
      V.reduceRightWithIndex(b, (j, a, b) => f([i, j], a, b))
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
    x: Mat<M, N, A>,
    y: Mat<N, P, A>
  ): Mat<M, P, A> =>
    x[0] === undefined || y[0] === undefined
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
) => (fa: Mat<M, M, A>) => A = R =>
  foldMapWithIndex(U.getAdditionMonoid(R))(([i, j], a) => (i === j ? a : R.zero))

/**
 * @since 1.0.0
 * @category Matrix Operations
 */
export const transpose = <M extends number, N extends number, A>(
  v: Mat<M, N, A>
): Mat<N, M, A> =>
  v[0] === undefined
    ? wrap([])
    : pipe(
        repeat(0)(v[0].length as N, v.length as M),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mapWithIndex(([i, j]) => (v[j] as any)[i])
      )

/**
 * @since 1.0.0
 * @category Matrix Operations
 */
export const replaceRow: (
  m: number
) => <M, N, A>(
  f: (vm: V.Vec<N, A>) => V.Vec<N, A>
) => (as: Mat<M, N, A>) => O.Option<Mat<M, N, A>> = m => f => as =>
  pipe(
    V.get(m)(as),
    O.chain(a => V.updateAt(m)(f(a))(as)),
    O.map(a => wrap(a))
  )

/**
 * @since 1.0.0
 * @category Matrix Operations
 */
export const addRows =
  <A, N>(A: TC.AbelianGroup<V.Vec<N, A>>) =>
  (a: number, b: number) =>
  <M>(vs: Mat<M, N, A>): O.Option<Mat<M, N, A>> =>
    pipe(
      V.get(a)(vs),
      O.chain(as =>
        pipe(
          vs,
          replaceRow(b)(bs => A.concat(as, bs))
        )
      )
    )

/**
 * @since 1.0.0
 * @category Matrix Operations
 */
export const scaleRow: <A, N>(
  M: TC.LeftModule<V.Vec<N, A>, A>
) => (i: number, a: A) => <M>(vs: Mat<M, N, A>) => O.Option<Mat<M, N, A>> = M => (i, a) =>
  replaceRow(i)(as => M.leftScalarMul(a, as))

/**
 * @since 1.0.0
 * @category Matrix Operations
 */
export const switchRows =
  (i: number, j: number) =>
  <A, N, M>(vs: Mat<M, N, A>): O.Option<Mat<M, N, A>> =>
    i === j
      ? O.some(vs)
      : pipe(
          O.Do,
          O.apS('ir', V.get(i)(vs)),
          O.apS('jr', V.get(j)(vs)),
          O.chain(({ ir, jr }) =>
            pipe(
              vs,
              replaceRow(i)(() => jr),
              O.chain(replaceRow(j)(() => ir))
            )
          )
        )

/**
 * @since 1.0.0
 * @category Matrix Operations
 */
export const get: (i: number, j: number) => <M, N, A>(m: Mat<M, N, A>) => O.Option<A> = (
  i,
  j
) => flow(V.get(i), O.chain(V.get(j)))

/**
 * @since 1.0.0
 * @category Matrix Operations
 */
export const liftA2: <A>(
  f: (x: A, y: A) => A
) => <M, N>(x: Mat<M, N, A>, y: Mat<M, N, A>) => Mat<M, N, A> = f =>
  flow(V.liftA2(V.liftA2(f)), from2dVectors)
