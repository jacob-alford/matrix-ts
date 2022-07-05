/**
 * A constrained matrix type. Allows for matrix/vector operations that won't fail due to
 * incompatible shapes
 *
 * @since 1.0.0
 */
import * as Apl from 'fp-ts/Applicative'
import * as Fun from 'fp-ts/Functor'
import * as FunI from 'fp-ts/FunctorWithIndex'
import * as Fl from 'fp-ts/Foldable'
import * as FlI from 'fp-ts/FoldableWithIndex'
import * as IO from 'fp-ts/IO'
import { HKT, Kind, Kind2, Kind3, Kind4, URIS, URIS2, URIS3, URIS4 } from 'fp-ts/HKT'
import * as Mn from 'fp-ts/Monoid'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as Rng from 'fp-ts/Ring'
import { flow, identity as id, pipe, tuple, unsafeCoerce } from 'fp-ts/function'

import * as TC from './typeclasses'
import * as V from './Vector'

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

/**
 * @since 1.0.0
 * @category Constructors
 */
export const makeBy: <M extends number, N extends number, A>(
  m: M,
  n: N,
  f: (a: [number, number]) => A
) => Mat<M, N, A> = (m, n, f) =>
  from2dVectors(V.makeBy(m, i => V.makeBy(n, j => f([i, j]))))

/**
 * Constructs the identity matrix
 *
 * @since 1.0.0
 * @category Constructors
 */
export const identity: <A>(R: Rng.Ring<A>) => <M extends number>(m: M) => Mat<M, M, A> =
  R => m =>
    makeBy(m, m, ([i, j]) => (i === j ? R.one : R.zero))

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
export const randMatrix: <M extends number, N extends number, A>(
  m: M,
  n: N,
  make: IO.IO<A>
) => IO.IO<Mat<M, N, A>> = (m, n, make) =>
  pipe(V.randVec(m, V.randVec(n, make)), IO.map(from2dVectors))

/**
 * @since 1.0.0
 * @category Constructors
 */
export const outerProduct: <A>(
  R: Rng.Ring<A>
) => <M extends number, N extends number>(
  v1: V.Vec<M, A>,
  v2: V.Vec<N, A>
) => Mat<M, N, A> = R => (v1, v2) => mul(R)(fromVectorAsColumn(v1), fromVectorAsRow(v2))

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
    concat: lift2(R.add),
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
 * @category Instance Operations
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
 * @category Instance Operations
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
 * @category Instance Operations
 */
export const reduce: <M, N, A, B>(
  b: B,
  f: (b: B, a: A) => B
) => (fa: Mat<M, N, A>) => B = (b, f) => V.reduce(b, (b, a) => pipe(a, V.reduce(b, f)))

/**
 * @since 1.0.0
 * @category Instance Operations
 */
export const foldMap: <M>(
  M: Mn.Monoid<M>
) => <N, O, A>(f: (a: A) => M) => (fa: Mat<N, O, A>) => M = M => f =>
  V.foldMap(M)(a => pipe(a, V.foldMap(M)(f)))

/**
 * @since 1.0.0
 * @category Instance Operations
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
 * @category Instance Operations
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
 * @category Instance Operations
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
 * @category Instance Operations
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

/**
 * @since 1.0.0
 * @category Instance Operations
 */
export function sequence<F extends URIS4>(
  F: Apl.Applicative4<F>
): <S, R, E, A, M, N>(
  ta: Mat<M, N, Kind4<F, S, R, E, A>>
) => Kind4<F, S, R, E, Mat<M, N, A>>
export function sequence<F extends URIS3>(
  F: Apl.Applicative3<F>
): <R, E, A, M, N>(ta: Mat<M, N, Kind3<F, R, E, A>>) => Kind3<F, R, E, Mat<M, N, A>>
export function sequence<F extends URIS2>(
  F: Apl.Applicative2<F>
): <E, A, M, N>(ta: Mat<M, N, Kind2<F, E, A>>) => Kind2<F, E, Mat<M, N, A>>
export function sequence<F extends URIS>(
  F: Apl.Applicative1<F>
): <A, M, N>(ta: Mat<M, N, Kind<F, A>>) => Kind<F, Mat<M, N, A>>
export function sequence<F>(
  F: Apl.Applicative<F>
): <A, M, N>(ta: Mat<M, N, HKT<F, A>>) => HKT<F, Mat<M, N, A>> {
  return ta =>
    pipe(
      ta,
      V.traverse(F)(a => pipe(a, V.traverse(F)(id))),
      a => F.map(a, b => wrap(b))
    )
}

/**
 * @since 1.0.0
 * @category Instance Operations
 */
export function traverse<F extends URIS4>(
  F: Apl.Applicative4<F>
): <S, R, E, A, B>(
  f: (a: A) => Kind4<F, S, R, E, B>
) => <M, N>(ta: Mat<M, N, A>) => Kind4<F, S, R, E, Mat<M, N, B>>
export function traverse<F extends URIS3>(
  F: Apl.Applicative3<F>
): <R, E, A, B>(
  f: (a: A) => Kind3<F, R, E, B>
) => <M, N>(ta: Mat<M, N, A>) => Kind3<F, R, E, Mat<M, N, B>>
export function traverse<F extends URIS2>(
  F: Apl.Applicative2<F>
): <E, A, B>(
  f: (a: A) => Kind2<F, E, B>
) => <M, N>(ta: Mat<M, N, A>) => Kind2<F, E, Mat<M, N, B>>
export function traverse<F extends URIS>(
  F: Apl.Applicative1<F>
): <A, B>(f: (a: A) => Kind<F, B>) => <M, N>(ta: Mat<M, N, A>) => Kind<F, Mat<M, N, B>>
export function traverse<F>(
  F: Apl.Applicative<F>
): <A, B>(f: (a: A) => HKT<F, B>) => <M, N>(ta: Mat<M, N, A>) => HKT<F, Mat<M, N, B>> {
  return f => ta =>
    pipe(
      ta,
      V.traverse(F)(a =>
        pipe(
          a,
          V.traverse(F)(b => f(b))
        )
      ),
      a => F.map(a, b => wrap(b))
    )
}

/**
 * @since 1.0.0
 * @category Instance Operations
 */
export function traverseWithIndex<F extends URIS4>(
  F: Apl.Applicative4<F>
): <S, R, E, A, B>(
  f: (i: [number, number], a: A) => Kind4<F, S, R, E, B>
) => <M, N>(ta: Mat<M, N, A>) => Kind4<F, S, R, E, Mat<M, N, B>>
export function traverseWithIndex<F extends URIS3>(
  F: Apl.Applicative3<F>
): <R, E, A, B>(
  f: (i: [number, number], a: A) => Kind3<F, R, E, B>
) => <M, N>(ta: Mat<M, N, A>) => Kind3<F, R, E, Mat<M, N, B>>
export function traverseWithIndex<F extends URIS2>(
  F: Apl.Applicative2<F>
): <E, A, B>(
  f: (i: [number, number], a: A) => Kind2<F, E, B>
) => <M, N>(ta: Mat<M, N, A>) => Kind2<F, E, Mat<M, N, B>>
export function traverseWithIndex<F extends URIS>(
  F: Apl.Applicative1<F>
): <A, B>(
  f: (i: [number, number], a: A) => Kind<F, B>
) => <M, N>(ta: Mat<M, N, A>) => Kind<F, Mat<M, N, B>>
export function traverseWithIndex<F>(
  F: Apl.Applicative<F>
): <A, B>(
  f: (i: [number, number], a: A) => HKT<F, B>
) => <M, N>(ta: Mat<M, N, A>) => HKT<F, Mat<M, N, B>> {
  return f => ta =>
    pipe(
      ta,
      V.traverseWithIndex(F)((i, a) =>
        pipe(
          a,
          V.traverseWithIndex(F)((j, b) => f([i, j], b))
        )
      ),
      a => F.map(a, b => wrap(b))
    )
}

// ###################
// ### Destructors ###
// ###################

/**
 * @since 1.0.0
 * @category Destructors
 */
export const toNestedReadonlyArrays: <M, N, A>(
  m: Mat<M, N, A>
) => ReadonlyArray<ReadonlyArray<A>> = unsafeCoerce

/**
 * @since 1.0.0
 * @category Destructors
 */
export const toNestedArrays: <M, N, A>(m: Mat<M, N, A>) => Array<Array<A>> = flow(
  RA.map(a => a.concat()),
  bs => bs.concat()
)

/**
 * @since 1.0.0
 * @category Destructors
 */
export const shape: <M extends number, N extends number, A>(
  m: Mat<M, N, A>
) => [M, N] = m =>
  m[0] === undefined
    ? [0 as typeof m['_rows'], 0 as typeof m['_cols']]
    : [m.length as typeof m['_rows'], m[0].length as typeof m['_cols']]

// ##################
// ### Sub-Matrix ###
// ##################

/**
 * Used to extract a sub-column from a matrix, and returns a new generic `P` that
 * represents the the length of the sub-column.
 *
 * Note: `fromIncl` is the **inclusive** column start-index, and `toExcl` is the
 * **exclusive** column end-index. If `toExcl` is omitted, then the extracted sub-column
 * will span to the last row of the matrix.
 *
 * Note: In order to preserve type safety, P cannot be inferred, and must be passed
 * directly as a type argument.
 *
 * If `P` is unknown, it can be declared in the parent function as an arbitrary generic
 * that has a numeric constraint.
 *
 * See: Decomposition > QR as an example declaring an unknown length constraint
 *
 * @since 1.1.0
 * @category Sub-Matrix
 */
export const getSubColumn: (
  col: number,
  fromIncl: number,
  toExcl?: number
) => <P extends number, M extends number, N extends number, A>(
  m: Mat<M, N, A>
) => O.Option<V.Vec<P, A>> = (col, fromRowI, toExcl) => A => {
  const _: <A>(xs: ReadonlyArray<A>, i: number) => A = (xs, i) => unsafeCoerce(xs[i])
  return pipe(
    shape(A),
    O.fromPredicate(
      ([rows, cols]) =>
        col >= 0 &&
        col < cols &&
        fromRowI >= 0 &&
        fromRowI < rows &&
        (toExcl === undefined || (toExcl > fromRowI && toExcl <= rows))
    ),
    O.map(([rows]) => {
      const sub = []
      for (let i = fromRowI; i < (toExcl ?? rows); ++i) {
        sub.push(_(_(A, i), col))
      }
      return unsafeCoerce(sub)
    })
  )
}

/**
 * Used to replace a sub-column of a matrix along with a generic `P` that is the length of
 * the sub-column. If `P` is incompatible with matrix length `N`, or provided indices will
 * result in an overflow, `O.none` is returned.
 *
 * Note: `fromRowIncl` is the **inclusive** row start-index
 *
 * @since 1.1.0
 * @category Sub-Matrix
 */
export const updateSubColumn: <P extends number, A>(
  col: number,
  fromRowIncl: number,
  repl: V.Vec<P, A>
) => <M extends number, N extends number>(m: Mat<M, N, A>) => O.Option<Mat<M, N, A>> =
  (col, fromRowI, repl) => A => {
    const _: <A>(xs: ReadonlyArray<A>, i: number) => A = (xs, i) => unsafeCoerce(xs[i])
    const p = V.size(repl)
    return pipe(
      shape(A),
      O.fromPredicate(
        ([rows, cols]) => col >= 0 && col < cols && fromRowI >= 0 && fromRowI + p < rows
      ),
      O.map(() => {
        const Ap = toNestedArrays(A)
        for (let i = fromRowI; i < p + fromRowI; ++i) {
          _(Ap, i)[col] = _(repl, i - fromRowI)
        }
        return unsafeCoerce(Ap)
      })
    )
  }

/**
 * Used to extract a portion of a matrix, and returns new generics `P` and `Q` that
 * represents the the rows / columns of the extracted sub-matrix.
 *
 * Note: `rowFromIncl` and `colFromIncl` are the **inclusive** row / column start-indices,
 * and `rowToExcl` and `colToExcl` are the **exclusive** row / column end-indices. If
 * `rowToExcl` or `colToExcl` are omitted, the extracted sub-matrix will span to the final
 * row / column.
 *
 * Note: In order to preserve type safety, `P` and `Q` cannot be inferred, and must be
 * passed directly as type arguments.
 *
 * If `P` and `Q` are unknown, they can be declared in the parent function as arbitrary
 * generics that have a numeric constraint.
 *
 * See: Decomposition > QR as an example declaring unknown length constraints
 *
 * @since 1.1.0
 * @category Sub-Matrix
 */
export const getSubMatrix: <P extends number, Q extends number>(
  rowFromIncl: number,
  colFromIncl: number,
  rowToExcl?: number,
  colToExcl?: number
) => <M extends number, N extends number, A>(m: Mat<M, N, A>) => O.Option<Mat<P, Q, A>> =
  (i1, j1, i2, j2) => A => {
    const _ = <A>(xs: ReadonlyArray<A>, i: number): A => unsafeCoerce(xs[i])
    return pipe(
      shape(A),
      O.fromPredicate(
        ([rows, cols]) =>
          i1 >= 0 &&
          i1 < rows &&
          j1 >= 0 &&
          j1 < cols &&
          (i2 === undefined || (i2 > i1 && i2 <= rows)) &&
          (j2 === undefined || (j2 > j1 && j2 <= cols))
      ),
      O.map(([m, n]) => {
        const out = []
        for (let i = i1; i < (i2 ?? m); ++i) {
          const outi = []
          for (let j = j1; j < (j2 ?? n); ++j) {
            outi.push(_(_(A, i), j))
          }
          out.push(outi)
        }
        return unsafeCoerce(out)
      })
    )
  }

/**
 * Used to replace a portion of a matrix with generics `P` and `Q` that are the rows /
 * columns of the replacement sub-matrix. If `P` is incompatible with matrix rows `M`, `Q`
 * is incompatible with matrix columns `N`, or if provided indices will result in an
 * overflow, `O.none` is returned.
 *
 * Note: `rowFromIncl` and `colFromIncl` are the **inclusive** row / column start-indices
 *
 * @since 1.1.0
 * @category Sub-Matrix
 */
export const updateSubMatrix: <P extends number, Q extends number, A>(
  rowFromIncl: number,
  colFromIncl: number,
  repl: Mat<P, Q, A>
) => <M extends number, N extends number>(m: Mat<M, N, A>) => O.Option<Mat<M, N, A>> =
  (i1, j1, repl) => m => {
    const _ = <A>(xs: ReadonlyArray<A>, i: number): A => unsafeCoerce(xs[i])
    return pipe(
      tuple(shape(m), shape(repl)),
      O.fromPredicate(
        ([[rows, cols], [replRows, replCols]]) =>
          i1 >= 0 && i1 + replRows <= rows && j1 >= 0 && j1 + replCols <= cols
      ),
      O.map(([, [i2, j2]]) => {
        const A = toNestedArrays(m)
        for (let i = i1; i < i1 + i2; ++i) {
          for (let j = j1; j < j1 + j2; ++j) {
            _(A, i)[j] = _(_(repl, i - i1), j - j1)
          }
        }
        return unsafeCoerce(A)
      })
    )
  }

// #########################
// ### Matrix Operations ###
// #########################

/**
 * Multiply two matricies with matching inner dimensions
 *
 * ```math
 * (A ∈ R_mn) (B ∈ R_np) = C ∈ R_mp
 * ```
 *
 * Efficiency: `2mpn` flops (for numeric Ring)
 *
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
          repeat(R.zero)(shape(x)[0], shape(y)[1]),
          mapWithIndex(([i, j]) => {
            const _ = <A>(rs: ReadonlyArray<A>, i: number): A => unsafeCoerce(rs[i])
            let out = R.zero
            for (let k = 0; k < y.length; ++k) {
              out = R.add(out, R.mul(_(_(x, i), k), _(_(y, k), j)))
            }
            return out
          })
        )

/**
 * Transform a vector `x` into vector `b` by matrix `A`
 *
 * ```math
 * Ax = b
 * ```
 *
 * Efficiency: `2mn` flops (for numeric Ring)
 *
 * @since 1.0.0
 * @category Matrix Operations
 */
export const linMap =
  <R>(R: Rng.Ring<R>) =>
  <M, N>(A: Mat<M, N, R>, x: V.Vec<N, R>): V.Vec<M, R> =>
    pipe(
      A,
      V.map(Ai => {
        const _ = <A>(rs: ReadonlyArray<A>, i: number): A => unsafeCoerce(rs[i])
        let out = R.zero
        for (let j = 0; j < Ai.length; ++j) {
          out = R.add(out, R.mul(_(Ai, j), _(x, j)))
        }
        return out
      })
    )

/**
 * Transform a row-vector `x` into vector `b` by matrix `A`
 *
 * ```math
 * xA = b
 * ```
 *
 * Efficiency: `2mn` flops (for numeric Ring)
 *
 * @since 1.1.0
 * @category Matrix Operations
 */
export const linMapR =
  <R>(R: Rng.Ring<R>) =>
  <M extends number, N extends number>(x: V.Vec<N, R>, A: Mat<N, M, R>): V.Vec<M, R> => {
    const _ = <A>(rs: ReadonlyArray<A>, i: number): A => unsafeCoerce(rs[i])
    const [n, m] = shape(A)
    const out = []
    for (let i = 0; i < m; ++i) {
      let outi = R.zero
      for (let j = 0; j < n; ++j) {
        outi = R.add(outi, R.mul(_(x, j), _(_(A, j), i)))
      }
      out.push(outi)
    }
    return unsafeCoerce(out)
  }

/**
 * The sum of the diagonal elements
 *
 * Efficiency: `m` flops (for numeric Ring)
 *
 * @since 1.0.0
 * @category Matrix Operations
 */
export const trace: <A>(R: Rng.Ring<A>) => <M extends number>(fa: Mat<M, M, A>) => A =
  R => fa => {
    const _ = <A>(rs: ReadonlyArray<A>, i: number): A => unsafeCoerce(rs[i])
    let out = R.zero
    for (let i = 0; i < fa.length; i++) {
      out = R.add(out, _(_(fa, i), i))
    }
    return out
  }

/**
 * @since 1.0.0
 * @category Matrix Operations
 */
export const transpose = <M extends number, N extends number, A>(
  v: Mat<M, N, A>
): Mat<N, M, A> => {
  const _ = <A>(xs: ReadonlyArray<A>, i: number): A => unsafeCoerce(xs[i])
  return v[0] === undefined
    ? wrap([])
    : pipe(
        repeat(0)(shape(v)[1] as N, shape(v)[0]),
        mapWithIndex(([i, j]) => _(_(v, j), i))
      )
}

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
 * @since 1.1.0
 * @category Matrix Operations
 */
export const updateAt: <A>(
  i: number,
  j: number,
  a: A
) => <M extends number, N extends number>(A: Mat<M, N, A>) => O.Option<Mat<M, N, A>> =
  (i, j, val) => A =>
    pipe(
      shape(A),
      O.fromPredicate(([rows, cols]) => i > 0 && j > 0 && i < rows && j < cols),
      O.map(() => {
        const _ = <A>(xs: ReadonlyArray<A>, i: number): A => unsafeCoerce(xs[i])
        const Ap = toNestedArrays(A)
        _(Ap, i)[j] = val
        return unsafeCoerce(Ap)
      })
    )

/**
 * @since 1.0.0
 * @category Matrix Operations
 */
export const lift2: <A, B>(
  f: (x: A, y: A) => B
) => <M, N>(x: Mat<M, N, A>, y: Mat<M, N, A>) => Mat<M, N, B> = f =>
  flow(V.lift2(V.lift2(f)), from2dVectors)

// ################
// ### Internal ###
// ################

/**
 * @since 1.0.0
 * @category Internal
 */
const replaceRow: (
  m: number
) => <M, N, A>(
  f: (vm: V.Vec<N, A>) => V.Vec<N, A>
) => (as: Mat<M, N, A>) => O.Option<Mat<M, N, A>> = m => f => as =>
  pipe(
    V.get(m)(as),
    O.chain(a => V.updateAt(m)(f(a))(as)),
    O.map(a => wrap(a))
  )
