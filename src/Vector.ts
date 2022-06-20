import * as Fun from 'fp-ts/Functor'
import * as FunI from 'fp-ts/FunctorWithIndex'
import * as Ap from 'fp-ts/Apply'
import * as Apl from 'fp-ts/Applicative'
import * as Chn from 'fp-ts/Chain'
import * as Fl from 'fp-ts/Foldable'
import * as FlI from 'fp-ts/FoldableWithIndex'
import { HKT } from 'fp-ts/HKT'
import * as Mon from 'fp-ts/Monad'
import * as Mn from 'fp-ts/Monoid'
import * as O from 'fp-ts/Option'
import * as Tr from 'fp-ts/Traversable'
import * as TrI from 'fp-ts/TraversableWithIndex'
import * as Pt from 'fp-ts/Pointed'
import * as RA from 'fp-ts/ReadonlyArray'
import * as Rng from 'fp-ts/Ring'
import { flow, identity, pipe, tuple, unsafeCoerce } from 'fp-ts/function'

import * as TC from './typeclasses'
import * as U from './lib/utilities'

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export interface Vec<N, A> extends ReadonlyArray<A> {
  _length: N
}

// ####################
// ### Constructors ###
// ####################

/**
 * @since 1.0.0x
 * @category Internal
 */
const wrap: <N, A>(ks: ReadonlyArray<A>) => Vec<N, A> = unsafeCoerce

/**
 * @since 1.0.0
 * @category Internal
 */
const unwrap: <N, A>(ks: Vec<N, A>) => ReadonlyArray<A> = identity

/**
 * @since 1.0.0
 * @category Constructors
 */
export const fromTuple: {
  <A>(t: []): Vec<0, A>
  <A>(t: [A]): Vec<1, A>
  <A>(t: [A, A]): Vec<2, A>
  <A>(t: [A, A, A]): Vec<3, A>
  <A>(t: [A, A, A, A]): Vec<4, A>
  <A>(t: [A, A, A, A, A]): Vec<5, A>
  <A>(t: [A, A, A, A, A, A]): Vec<6, A>
  <A>(t: [A, A, A, A, A, A, A]): Vec<7, A>
  <A>(t: [A, A, A, A, A, A, A, A]): Vec<8, A>
  <A>(t: [A, A, A, A, A, A, A, A, A]): Vec<9, A>
  <A>(t: [A, A, A, A, A, A, A, A, A, A]): Vec<10, A>
} = wrap

/**
 * @since 1.0.0
 * @category Constructors
 */
export const repeat: <N extends number, A>(n: N, a: A) => Vec<N, A> = (n, a) =>
  wrap(RA.replicate(n, a))

/**
 * @since 1.0.0
 * @category Constructors
 */
export const fromReadonlyArray: <N extends number>(
  n: N
) => <A>(as: ReadonlyArray<A>) => O.Option<Vec<N, A>> = n =>
  flow(
    O.fromPredicate(xs => xs.length === n),
    O.map(a => wrap(a))
  )

/**
 * @since 1.0.0
 * @category Constructors
 */
export const zero: <A>() => Vec<0, A> = () => wrap([])

// #####################
// ### Non-Pipeables ###
// #####################

const _map: Fun.Functor2<URI>['map'] = (fa, f) => pipe(fa, map(f))
const _mapWithIndex: FunI.FunctorWithIndex2<URI, number>['mapWithIndex'] = (fa, f) =>
  pipe(fa, mapWithIndex(f))
const _ap: Apl.Applicative2<URI>['ap'] = (fab, fa) => pipe(fab, ap(fa))
const _chain: Mon.Monad2<URI>['chain'] = (fa, f) => pipe(fa, chain(f))
const _reduce: Fl.Foldable2<URI>['reduce'] = (fa, b, f) => pipe(fa, reduce(b, f))
const _foldMap: Fl.Foldable2<URI>['foldMap'] = M => (fa, f) => pipe(fa, foldMap(M)(f))
const _reduceRight: Fl.Foldable2<URI>['reduceRight'] = (fa, b, f) =>
  pipe(fa, reduceRight(b, f))
const _reduceWithIndex: FlI.FoldableWithIndex2<URI, number>['reduceWithIndex'] = (
  fa,
  b,
  f
) => pipe(fa, reduceWithIndex(b, f))
const _foldMapWithIndex: FlI.FoldableWithIndex2<URI, number>['foldMapWithIndex'] =
  M => (fa, f) =>
    pipe(fa, foldMapWithIndex(M)(f))
const _reduceRightWithIndex: FlI.FoldableWithIndex2<
  URI,
  number
>['reduceRightWithIndex'] = (fa, b, f) => pipe(fa, reduceRightWithIndex(b, f))
const _traverse: Tr.Traversable2<URI>['traverse'] = <F>(
  F: Apl.Applicative<F>
): (<N, A, B>(ta: Vec<N, A>, f: (a: A) => HKT<F, B>) => HKT<F, Vec<N, B>>) => {
  const traverseF = traverse(F)
  return (ta, f) => pipe(ta, traverseF(f))
}
/* istanbul ignore next */
const _traverseWithIndex: TrI.TraversableWithIndex2<URI, number>['traverseWithIndex'] = <
  F
>(
  F: Apl.Applicative<F>
): (<N, A, B>(ta: Vec<N, A>, f: (i: number, a: A) => HKT<F, B>) => HKT<F, Vec<N, B>>) => {
  const traverseWithIndexF = traverseWithIndex(F)
  return (ta, f) => pipe(ta, traverseWithIndexF(f))
}

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const URI = 'Vec'

/**
 * @since 1.0.0
 * @category Instances
 */
export type URI = typeof URI

declare module 'fp-ts/HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: Vec<E, A>
  }
}

/**
 * @since 1.0.0
 * @category Internal
 */
export const liftA2: <N, A>(
  f: (x: A, y: A) => A
) => (x: Vec<N, A>, y: Vec<N, A>) => Vec<N, A> = f => (x, y) =>
  pipe(RA.zipWith(x, y, f), a => wrap(a))

/**
 * @since 1.0.0
 * @category Instances
 */
export const getAbGroup: <A>(
  R: Rng.Ring<A>
) => <N extends number>(n: N) => TC.AbelianGroup<Vec<N, A>> = R => n => ({
  concat: liftA2(R.add),
  inverse: map(x => R.sub(R.zero, x)),
  empty: repeat(n, R.zero),
})

/**
 * @since 1.0.0
 * @category Instances
 */
export const getBimodule: <R>(
  R: Rng.Ring<R>
) => <N extends number>(n: N) => TC.Bimodule<Vec<N, R>, R> = R => n => ({
  ...getAbGroup(R)(n),
  leftScalarMul: (r, v) =>
    pipe(
      v,
      map(x => R.mul(r, x))
    ),
  rightScalarMul: (v, r) =>
    pipe(
      v,
      map(x => R.mul(x, r))
    ),
})

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const map: <N, A, B>(f: (a: A) => B) => (v: Vec<N, A>) => Vec<N, B> = f => v =>
  pipe(v, RA.map(f), a => wrap(a))

/**
 * @since 1.0.0
 * @category Instances
 */
export const Functor: Fun.Functor2<URI> = {
  URI,
  map: _map,
}

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const mapWithIndex: <N, A, B>(
  f: (i: number, a: A) => B
) => (v: Vec<N, A>) => Vec<N, B> = f => v => pipe(v, RA.mapWithIndex(f), a => wrap(a))

/**
 * @since 1.0.0
 * @category Instances
 */
export const FunctorWithIndex: FunI.FunctorWithIndex2<URI, number> = {
  ...Functor,
  mapWithIndex: _mapWithIndex,
}

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const of: <A>(a: A) => Vec<1, A> = a => fromTuple([a])

/**
 * @since 1.0.0
 * @category Instances
 */
export const Pointed: Pt.Pointed2C<URI, 1> = {
  _E: 1,
  URI,
  of,
}

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const ap: <N, A, B>(fa: Vec<N, A>) => (fab: Vec<N, (a: A) => B>) => Vec<N, B> =
  fa => fab =>
    pipe(fab, RA.ap(fa), a => wrap(a))

/**
 * @since 1.0.0
 * @category Instances
 */
export const Apply: Ap.Apply2<URI> = {
  ...Functor,
  ap: _ap,
}

/**
 * @since 1.0.0
 * @category Combinators
 */
export const apFirst = Ap.apFirst(Apply)

/**
 * @since 1.0.0
 * @category Combinators
 */
export const apSecond = Ap.apSecond(Apply)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Applicative: Apl.Applicative2C<URI, 1> = {
  ...Apply,
  ...Pointed,
}

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const chain: <N, A, B>(f: (a: A) => Vec<N, B>) => (ma: Vec<N, A>) => Vec<N, B> =
  f => ma =>
    pipe(ma, RA.chain(f), a => wrap(a))

/**
 * @since 1.0.0
 * @category Instances
 */
export const Chain: Chn.Chain2<URI> = {
  ...Apply,
  chain: _chain,
}

/**
 * @since 1.0.0
 * @category Combinators
 */
export const chainFirst = Chn.chainFirst(Chain)

/**
 * @since 1.0.0
 * @category Instances
 */
export const Monad: Mon.Monad2C<URI, 1> = {
  ...Applicative,
  ...Chain,
}

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const reduce: <N, A, B>(b: B, f: (b: B, a: A) => B) => (fa: Vec<N, A>) => B =
  (b, f) => fa =>
    pipe(fa, RA.reduce(b, f))

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const foldMap: <M>(
  M: Mn.Monoid<M>
) => <N, A>(f: (a: A) => M) => (fa: Vec<N, A>) => M = M => f => fa =>
  pipe(fa, RA.foldMap(M)(f))

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const reduceRight: <N, B, A>(b: A, f: (b: B, a: A) => A) => (fa: Vec<N, B>) => A =
  (a, f) => fa =>
    pipe(fa, RA.reduceRight(a, f))

/**
 * @since 1.0.0
 * @category Instances
 */
export const Foldable: Fl.Foldable2<URI> = {
  URI,
  reduce: _reduce,
  foldMap: _foldMap,
  reduceRight: _reduceRight,
}

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const reduceWithIndex: <N, A, B>(
  b: B,
  f: (i: number, b: B, a: A) => B
) => (fa: Vec<N, A>) => B = (b, f) => fa => pipe(fa, RA.reduceWithIndex(b, f))

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const foldMapWithIndex: <M>(
  M: Mn.Monoid<M>
) => <N, A>(f: (i: number, a: A) => M) => (fa: Vec<N, A>) => M = M => f => fa =>
  pipe(fa, RA.foldMapWithIndex(M)(f))

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const reduceRightWithIndex: <N, B, A>(
  b: A,
  f: (i: number, b: B, a: A) => A
) => (fa: Vec<N, B>) => A = (a, f) => fa => pipe(fa, RA.reduceRightWithIndex(a, f))

/**
 * @since 1.0.0
 * @category Instances
 */
export const FoldableWithIndex: FlI.FoldableWithIndex2<URI, number> = {
  ...Foldable,
  reduceWithIndex: _reduceWithIndex,
  foldMapWithIndex: _foldMapWithIndex,
  reduceRightWithIndex: _reduceRightWithIndex,
}

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const traverse: Tr.PipeableTraverse2<URI> =
  <F>(F: Apl.Applicative<F>) =>
  <A, B>(f: (a: A) => HKT<F, B>) =>
  <N>(fa: Vec<N, A>): HKT<F, Vec<N, B>> => {
    const traverseWithIndexF = traverseWithIndex(F)
    return pipe(
      fa,
      traverseWithIndexF((_, a) => f(a))
    )
  }

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const sequence =
  <F>(F: Apl.Applicative<F>) =>
  <N, A>(fa: Vec<N, HKT<F, A>>): HKT<F, Vec<N, A>> =>
    pipe(fa, RA.sequence(F), as => F.map(as, a => wrap(a)))

/**
 * @since 1.0.0
 * @category Instances
 */
export const Traversable: Tr.Traversable2<URI> = {
  URI,
  map: _map,
  reduce: _reduce,
  foldMap: _foldMap,
  reduceRight: _reduceRight,
  traverse: _traverse,
  sequence,
}

/**
 * @since 1.0.0
 * @category Instance Operations
 */
export const traverseWithIndex: TrI.PipeableTraverseWithIndex2<URI, number> =
  <F>(F: Apl.Applicative<F>) =>
  <A, B>(f: (i: number, a: A) => HKT<F, B>) =>
  <N>(ta: Vec<N, A>): HKT<F, Vec<N, B>> =>
    pipe(ta, RA.traverseWithIndex(F)(f), fbs => F.map(fbs, bs => wrap(bs)))

/**
 * @since 1.0.0
 * @category Instances
 */
export const TraversableWithIndex: TrI.TraversableWithIndex2<URI, number> = {
  URI,
  map: _map,
  mapWithIndex: _mapWithIndex,
  reduce: _reduce,
  foldMap: _foldMap,
  reduceRight: _reduceRight,
  reduceWithIndex: _reduceWithIndex,
  foldMapWithIndex: _foldMapWithIndex,
  reduceRightWithIndex: _reduceRightWithIndex,
  traverse: _traverse,
  sequence,
  traverseWithIndex: _traverseWithIndex,
}

// ###################
// ### Destructors ###
// ###################

/**
 * @since 1.0.0
 * @category Destructors
 */
export const toTuple: {
  <A>(t: Vec<0, A>): []
  <A>(t: Vec<1, A>): [A]
  <A>(t: Vec<2, A>): [A, A]
  <A>(t: Vec<3, A>): [A, A, A]
  <A>(t: Vec<4, A>): [A, A, A, A]
  <A>(t: Vec<5, A>): [A, A, A, A, A]
  <A>(t: Vec<6, A>): [A, A, A, A, A, A]
  <A>(t: Vec<7, A>): [A, A, A, A, A, A, A]
  <A>(t: Vec<8, A>): [A, A, A, A, A, A, A, A]
  <A>(t: Vec<9, A>): [A, A, A, A, A, A, A, A, A]
  <A>(t: Vec<10, A>): [A, A, A, A, A, A, A, A, A, A]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} = unwrap as any

/**
 * @since 1.0.0
 * @category Vector Operations
 */
export const norm: <A>(R: Rng.Ring<A>) => <N>(x: Vec<N, A>) => A = R =>
  foldMap(U.getAdditiveAbelianGroup(R))(x => R.mul(x, x))

// #########################
// ### Vector Operations ###
// #########################

/**
 * @since 1.0.0
 * @category Vector Operations
 */
export const updateAt: (
  n: number
) => <A>(a: A) => <N>(fa: Vec<N, A>) => O.Option<Vec<N, A>> = n => a =>
  flow(
    RA.updateAt(n, a),
    O.map(a => wrap(a))
  )

/**
 * @since 1.0.0
 * @category Vector Operations
 */
export const zipVectors: <N, A>(
  v1: Vec<N, A>,
  v2: Vec<N, A>
) => Vec<N, readonly [A, A]> = (v1, v2) => pipe(RA.zip(v1, v2), a => wrap(a))

/**
 * @since 1.0.0
 * @category Vector Operations
 */
export const get: (i: number) => <N, A>(fa: Vec<N, A>) => O.Option<A> = RA.lookup

/**
 * @since 1.0.0
 * @category Vector Operations
 */
export const crossProduct: <A>(
  R: Rng.Ring<A>
) => (x: Vec<3, A>, y: Vec<3, A>) => Vec<3, A> = R => (x, y) =>
  pipe(tuple(toTuple(x), toTuple(y)), ([[a1, a2, a3], [b1, b2, b3]]) =>
    fromTuple([
      R.sub(R.mul(a2, b3), R.mul(a3, b2)),
      R.sub(R.mul(a3, b1), R.mul(a1, b3)),
      R.sub(R.mul(a1, b2), R.mul(a2, b1)),
    ])
  )

/**
 * @since 1.0.0
 * @category Vector Operations
 */
export const innerProduct: <A>(
  R: Rng.Ring<A>
) => <N>(x: Vec<N, A>, y: Vec<N, A>) => A = R =>
  flow(
    zipVectors,
    foldMap(U.getAdditionMonoid(R))(([a, b]) => R.mul(a, b))
  )

// ###################
// ### Do Notation ###
// ###################

/**
 * @since 1.0.0
 * @category Do notation
 */
export const bindTo = Fun.bindTo(Functor)

/**
 * @since 1.0.0
 * @category Do notation
 */
export const bind = Chn.bind(Chain)

/**
 * @since 1.0.0
 * @category Do notation
 */
export const apS = Ap.apS(Apply)
