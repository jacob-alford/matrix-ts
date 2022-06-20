/**
 * A module for an unconstrained matrix type. Heavily relies on failable operations with
 * the Option HKT.
 */
import * as Eq from 'fp-ts/Eq'
import * as Fun from 'fp-ts/Functor'
import * as FunI from 'fp-ts/FunctorWithIndex'
import * as Fl from 'fp-ts/Foldable'
import * as FlI from 'fp-ts/FoldableWithIndex'
import * as Mn from 'fp-ts/Monoid'
import * as N from 'fp-ts/number'
import * as RA from 'fp-ts/ReadonlyArray'
import * as Rng from 'fp-ts/Ring'
import * as O from 'fp-ts/Option'
import { flow, identity, pipe, tuple } from 'fp-ts/function'

import * as MC from './Matrix'
import * as U from './lib/utilities'

const MatrixBrand = Symbol('Matrix')
type MatrixBrand = typeof MatrixBrand

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Shape = [number, number]

/**
 * @since 1.0.0
 * @category Model
 */
export type Vec<A> = ReadonlyArray<A>

/**
 * @since 1.0.0
 * @category Model
 */
export interface Mat<A> extends ReadonlyArray<ReadonlyArray<A>> {
  readonly _URI: MatrixBrand
}

// ####################
// ### Constructors ###
// ####################

/**
 * @since 1.0.0
 * @category Internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const wrap: <A>(as: ReadonlyArray<ReadonlyArray<A>>) => Mat<A> = identity as any

/**
 * @since 1.0.0
 * @category Internal
 */
const nestedReadonlyArrayShapeIsUniform: <A>(
  as: ReadonlyArray<ReadonlyArray<A>>
) => boolean = flow(
  RA.reduce(tuple(true, -1), ([b, l], v) =>
    l === -1 ? tuple(true, v.length) : tuple(b && l === v.length, l)
  ),
  ([b]) => b
)

/**
 * @since 1.0.0
 * @category Constructors
 */
export const fromNestedReadonlyArrays: <A>(
  as: ReadonlyArray<ReadonlyArray<A>>
) => O.Option<Mat<A>> = flow(
  O.fromPredicate(nestedReadonlyArrayShapeIsUniform),
  O.map(wrap)
)

/**
 * @since 1.0.0
 * @category Constructors
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fromMat: <A>(as: MC.Mat<unknown, unknown, A>) => Mat<A> = identity as any

/**
 * @since 1.0.0
 * @category Constructors
 */
export const repeat: <A>(shape: Shape, value: A) => Mat<A> = (shape, value) =>
  pipe(RA.replicate(shape[0], RA.replicate(shape[1], value)), wrap)

/**
 * @since 1.0.0
 * @category Constructors
 */
export const fromRowVector = flow(MC.fromVectorAsRow, fromMat)

/**
 * @since 1.0.0
 * @category Constructors
 */
export const fromColumnVector = flow(MC.fromVectorAsColumn, fromMat)

// #####################
// ### Non-Pipeables ###
// #####################

const _map: Fun.Functor1<URI>['map'] = (fa, f) => pipe(fa, map(f))
const _mapWithIndex: FunI.FunctorWithIndex1<URI, [number, number]>['mapWithIndex'] = (
  fa,
  f
) => pipe(fa, mapWithIndex(f))
const _reduce: Fl.Foldable1<URI>['reduce'] = (fa, b, f) => pipe(fa, reduce(b, f))
const _foldMap: Fl.Foldable1<URI>['foldMap'] = M => (fa, f) => pipe(fa, foldMap(M)(f))
const _reduceRight: Fl.Foldable1<URI>['reduceRight'] = (fa, b, f) =>
  pipe(fa, reduceRight(b, f))
const _reduceWithIndex: FlI.FoldableWithIndex1<
  URI,
  [number, number]
>['reduceWithIndex'] = (fa, b, f) => pipe(fa, reduceWithIndex(b, f))
const _foldMapWithIndex: FlI.FoldableWithIndex1<
  URI,
  [number, number]
>['foldMapWithIndex'] = M => (fa, f) => pipe(fa, foldMapWithIndex(M)(f))
const _reduceRightWithIndex: FlI.FoldableWithIndex1<
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
export const URI = 'Matrix'

/**
 * @since 1.0.0
 * @category Instances
 */
export type URI = typeof URI

declare module 'fp-ts/HKT' {
  interface URItoKind<A> {
    readonly [URI]: Mat<A>
  }
}

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const map: <A, B>(f: (a: A) => B) => (v: Mat<A>) => Mat<B> = f =>
  flow(RA.map(RA.map(f)), wrap)

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
  f: (ij: [number, number], a: A) => B
) => (v: Mat<A>) => Mat<B> = f =>
  flow(
    RA.mapWithIndex((i, a) =>
      pipe(
        a,
        RA.mapWithIndex((j, b) => f([i, j], b))
      )
    ),
    wrap
  )

/**
 * @since 1.0.0
 * @category Instances
 */
export const FunctorWithIndex: FunI.FunctorWithIndex1<URI, [number, number]> = {
  ...Functor,
  mapWithIndex: _mapWithIndex,
}

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const reduce: <A, B>(b: B, f: (b: B, a: A) => B) => (fa: Mat<A>) => B = (b, f) =>
  RA.reduce(b, (b, a) => pipe(a, RA.reduce(b, f)))

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const foldMap: <M>(M: Mn.Monoid<M>) => <A>(f: (a: A) => M) => (fa: Mat<A>) => M =
  M => f =>
    RA.foldMap(M)(a => pipe(a, RA.foldMap(M)(f)))

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const reduceRight: <B, A>(b: A, f: (b: B, a: A) => A) => (fa: Mat<B>) => A = (
  a,
  f
) => RA.reduceRight(a, (b, a) => pipe(b, RA.reduceRight(a, f)))

/**
 * @since 1.0.0
 * @category Instances
 */
export const Foldable: Fl.Foldable1<URI> = {
  URI,
  reduce: _reduce,
  foldMap: _foldMap,
  reduceRight: _reduceRight,
}

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const reduceWithIndex: <A, B>(
  b: B,
  f: (i: [number, number], b: B, a: A) => B
) => (fa: Mat<A>) => B = (b, f) =>
  RA.reduceWithIndex(b, (i, b, a) =>
    pipe(
      a,
      RA.reduceWithIndex(b, (j, b, a) => f([i, j], b, a))
    )
  )

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const foldMapWithIndex: <M>(
  M: Mn.Monoid<M>
) => <A>(f: (i: [number, number], a: A) => M) => (fa: Mat<A>) => M = M => f =>
  RA.foldMapWithIndex(M)((i, a) =>
    pipe(
      a,
      RA.foldMapWithIndex(M)((j, a) => f([i, j], a))
    )
  )

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const reduceRightWithIndex: <B, A>(
  b: A,
  f: (i: [number, number], b: B, a: A) => A
) => (fa: Mat<B>) => A = (a, f) =>
  RA.reduceRightWithIndex(a, (i, a, b) =>
    pipe(
      a,
      RA.reduceRightWithIndex(b, (j, a, b) => f([i, j], a, b))
    )
  )

/**
 * @since 1.0.0
 * @category Instances
 */
export const FoldableWithIndex: FlI.FoldableWithIndex1<URI, [number, number]> = {
  ...Foldable,
  reduceWithIndex: _reduceWithIndex,
  foldMapWithIndex: _foldMapWithIndex,
  reduceRightWithIndex: _reduceRightWithIndex,
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const EqShape: Eq.Eq<Shape> = Eq.tuple(N.Eq, N.Eq)

// ####################
// ### Destructors ####
// ####################

/**
 * @since 1.0.0
 * @category Destructors
 */
export const toNestedReadonlyArrays: <A>(as: Mat<A>) => ReadonlyArray<ReadonlyArray<A>> =
  identity

/**
 * @since 1.0.0
 * @category Destructors
 */
export const toMat: <M extends number, N extends number>(
  m: M,
  n: N
) => <A>(ma: Mat<A>) => O.Option<MC.Mat<M, N, A>> = (m, n) =>
  flow(toNestedReadonlyArrays, MC.fromNestedReadonlyArrays(m, n))

// #########################
// ### Matrix Operations ###
// #########################

/**
 * @since 1.0.0
 * @category Matrix Operations
 */
export const shape: <A>(ma: Mat<A>) => Shape = ma =>
  ma[0] === undefined ? [0, 0] : [ma.length, ma[0].length]

/**
 * Returns two matricies that are guaranteed to have the same shape
 *
 * @since 1.0.0
 * @category Matrix Operations
 */
export const zipMatricies: <A>(ma: Mat<A>, mb: Mat<A>) => O.Option<[Mat<A>, Mat<A>]> = (
  ma,
  mb
) => (EqShape.equals(shape(ma), shape(mb)) ? O.some([ma, mb]) : O.none)

/**
 * @since 1.0.0
 * @category Matrix Operations
 */
export const mul =
  <A>(R: Rng.Ring<A>) =>
  (x: Mat<A>, y: Mat<A>): O.Option<Mat<A>> =>
    pipe(
      repeat(tuple(shape(x)[0], shape(y)[1]), 0),
      O.fromPredicate(() => EqShape.equals(shape(x), shape(y))),
      O.map(
        mapWithIndex(([i, j]) =>
          pipe(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            RA.makeBy(y.length, k => R.mul((x[i] as any)[k], (y[k] as any)[j])),
            RA.foldMap(U.getAdditionMonoid(R))(identity)
          )
        )
      )
    )

/**
 * @since 1.0.0
 * @category Matrix Operations
 */
export const scaleMatrix: <A>(R: Rng.Ring<A>) => (k: A) => (ma: Mat<A>) => Mat<A> =
  R => k =>
    map(a => R.mul(a, k))

/**
 * @since 1.0.0
 * @category Matrix Operations
 */
export const trace: <A>(R: Rng.Ring<A>) => (fa: Mat<A>) => A = R =>
  foldMapWithIndex(U.getAdditionMonoid(R))(([i, j], a) => (i === j ? a : R.zero))

/**
 * @since 1.0.0
 * @category Matrix Operations
 */
export const transpose = <A>(v: Mat<A>): Mat<A> =>
  pipe(
    repeat(tuple(shape(v)[1], shape(v)[0]), 0),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapWithIndex(([i, j]) => (v[j] as any)[i])
  )

/**
 * @since 1.0.0
 * @category Matrix Operations
 */
export const replaceRow: (
  m: number
) => <A>(f: (vm: Vec<A>) => Vec<A>) => (as: Mat<A>) => O.Option<Mat<A>> = m => f => as =>
  pipe(
    as,
    RA.lookup(m),
    O.chain(a => RA.updateAt(m, f(a))(as)),
    O.map(a => wrap(a))
  )

/**
 * @since 1.0.0
 * @category Matrix Operations
 */
export const addRows =
  <A>(R: Rng.Ring<A>) =>
  (a: number, b: number) =>
  (vs: Mat<A>): O.Option<Mat<A>> =>
    pipe(
      vs,
      RA.lookup(a),
      O.chain(as =>
        pipe(
          vs,
          replaceRow(b)(bs => RA.zipWith(as, bs, R.add))
        )
      )
    )

/**
 * @since 1.0.0
 * @category Matrix Operations
 */
export const scaleRow: <A>(
  R: Rng.Ring<A>
) => (i: number, a: A) => (vs: Mat<A>) => O.Option<Mat<A>> = R => (i, a) =>
  replaceRow(i)(RA.map(b => R.mul(b, a)))

/**
 * @since 1.0.0
 * @category Matrix Operations
 */
export const switchRows =
  (i: number, j: number) =>
  <A>(vs: Mat<A>): O.Option<Mat<A>> =>
    pipe(
      O.Do,
      O.apS('ir', RA.lookup(i)(vs)),
      O.apS('jr', RA.lookup(j)(vs)),
      O.chain(({ ir, jr }) =>
        pipe(
          vs,
          replaceRow(i)(() => jr),
          O.chain(replaceRow(j)(() => ir))
        )
      )
    )

/**
 * Matrix transformations over vectors
 *
 * (A in (m x n), v in (n x 1)) -> v in (m x 1)
 *
 * @since 1.0.0
 * @category Matrix Operations
 */
export const linearMap: <A>(
  R: Rng.Ring<A>
) => (A: Mat<A>, x: Vec<A>) => O.Option<Vec<A>> = R => (A, x) =>
  shape(A)[1] !== x.length
    ? O.none
    : pipe(
        A,
        RA.map(ai =>
          pipe(RA.zipWith(x, ai, R.mul), RA.foldMap(U.getAdditionMonoid(R))(identity))
        ),
        O.some
      )
