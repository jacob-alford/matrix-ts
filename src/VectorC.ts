import * as Fun from 'fp-ts/Functor'
import * as FunI from 'fp-ts/FunctorWithIndex'
import * as Ap from 'fp-ts/Apply'
import * as Apl from 'fp-ts/Applicative'
import * as Chn from 'fp-ts/Chain'
import * as Fld from 'fp-ts/Field'
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
import { flow, pipe, tuple } from 'fp-ts/function'

import * as Mod from './Module'
import * as Comm from './Commutative'
import * as FP from './FromPolynomial'
import * as VecSpc from './VectorSpace'
import * as InPrSp from './InnerProductSpace'
import * as Conj from './Conjugate'
import * as U from './lib/utilities'

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export interface VecC<N, A> extends ReadonlyArray<A> {
  _over: A
  _length: N
}

// ####################
// ### Constructors ###
// ####################

/**
 * @since 1.0.0
 * @category Internal
 */
const wrap: <N, A>(ks: ReadonlyArray<A>) => VecC<N, A> = ks =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ks as any

/**
 * @since 1.0.0
 * @category Internal
 */
const unwrap: <N, A>(ks: VecC<N, A>) => ReadonlyArray<A> = ks =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ks as any

/**
 * @since 1.0.0
 * @category Constructors
 */
export const fromTuple: {
  <A>(t: []): VecC<0, A>
  <A>(t: [A]): VecC<1, A>
  <A>(t: [A, A]): VecC<2, A>
  <A>(t: [A, A, A]): VecC<3, A>
  <A>(t: [A, A, A, A]): VecC<4, A>
  <A>(t: [A, A, A, A, A]): VecC<5, A>
  <A>(t: [A, A, A, A, A, A]): VecC<6, A>
  <A>(t: [A, A, A, A, A, A, A]): VecC<7, A>
  <A>(t: [A, A, A, A, A, A, A, A]): VecC<8, A>
  <A>(t: [A, A, A, A, A, A, A, A, A]): VecC<9, A>
  <A>(t: [A, A, A, A, A, A, A, A, A, A]): VecC<10, A>
} = wrap

/**
 * @since 1.0.0
 * @category Constructors
 */
export const repeat: <N extends number, A>(n: N, a: A) => VecC<N, A> = (n, a) =>
  wrap(RA.replicate(n, a))

/**
 * @since 1.0.0
 * @category Constructors
 */
export const fromReadonlyArray: <N extends number>(
  n: N
) => <A>(as: ReadonlyArray<A>) => O.Option<VecC<N, A>> = n =>
  flow(
    O.fromPredicate(xs => xs.length === n),
    O.map(a => wrap(a))
  )

/**
 * @since 1.0.0
 * @category Constructors
 */
export const zero: <A>() => VecC<0, A> = () => wrap([])

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
): (<N, A, B>(ta: VecC<N, A>, f: (a: A) => HKT<F, B>) => HKT<F, VecC<N, B>>) => {
  const traverseF = traverse(F)
  return (ta, f) => pipe(ta, traverseF(f))
}
/* istanbul ignore next */
const _traverseWithIndex: TrI.TraversableWithIndex2<URI, number>['traverseWithIndex'] = <
  F
>(
  F: Apl.Applicative<F>
): (<N, A, B>(
  ta: VecC<N, A>,
  f: (i: number, a: A) => HKT<F, B>
) => HKT<F, VecC<N, B>>) => {
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
export const URI = 'VecC'

/**
 * @since 1.0.0
 * @category Instances
 */
export type URI = typeof URI

declare module 'fp-ts/HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: VecC<E, A>
  }
}

/**
 * @since 1.0.0
 * @category Internal
 */
export const liftA2: <N, A>(
  f: (x: A, y: A) => A
) => (x: VecC<N, A>, y: VecC<N, A>) => VecC<N, A> = f => (x, y) =>
  pipe(
    x,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapWithIndex((i, a) => f(a, y[i] as any))
  )

/**
 * @since 1.0.0
 * @category Instances
 */
export const getAbGroup: <A>(
  R: Rng.Ring<A>
) => <N extends number>(n: N) => Comm.AbelianGroup<VecC<N, A>> = R => n => ({
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
) => <N extends number>(n: N) => Mod.Bimodule<R, VecC<N, R>> = R => n => ({
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
 * @category Instances
 */
export const getVectorSpace: <F>(
  F: Fld.Field<F>
) => <N extends number>(n: N) => VecSpc.VectorSpace<F, VecC<N, F>> = F => n => ({
  ...getBimodule(F)(n),
  _F: F,
})

/**
 * @since 1.0.0
 * @category Instances
 */
export const getInnerProductSpace: <F>(
  F: Fld.Field<F>,
  conj: Conj.Conjugate<F>
) => <N extends number>(n: N) => InPrSp.InnerProductSpace<F, VecC<N, F>> =
  (F, { conj }) =>
  n => ({
    ...getVectorSpace(F)(n),
    conj,
    dot: (x, y) =>
      pipe(
        x,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        foldMapWithIndex(U.getAdditionMonoid(F))((i, a) => F.mul(a, y[i] as any))
      ),
  })

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const map: <N, A, B>(f: (a: A) => B) => (v: VecC<N, A>) => VecC<N, B> = f => v =>
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
) => (v: VecC<N, A>) => VecC<N, B> = f => v => pipe(v, RA.mapWithIndex(f), a => wrap(a))

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
export const of: <A>(a: A) => VecC<1, A> = a => fromTuple([a])

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
export const ap: <N, A, B>(fa: VecC<N, A>) => (fab: VecC<N, (a: A) => B>) => VecC<N, B> =
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
export const chain: <N, A, B>(
  f: (a: A) => VecC<N, B>
) => (ma: VecC<N, A>) => VecC<N, B> = f => ma => pipe(ma, RA.chain(f), a => wrap(a))

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
export const reduce: <N, A, B>(b: B, f: (b: B, a: A) => B) => (fa: VecC<N, A>) => B =
  (b, f) => fa =>
    pipe(fa, RA.reduce(b, f))

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const foldMap: <M>(
  M: Mn.Monoid<M>
) => <N, A>(f: (a: A) => M) => (fa: VecC<N, A>) => M = M => f => fa =>
  pipe(fa, RA.foldMap(M)(f))

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const reduceRight: <N, B, A>(
  b: A,
  f: (b: B, a: A) => A
) => (fa: VecC<N, B>) => A = (a, f) => fa => pipe(fa, RA.reduceRight(a, f))

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
) => (fa: VecC<N, A>) => B = (b, f) => fa => pipe(fa, RA.reduceWithIndex(b, f))

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const foldMapWithIndex: <M>(
  M: Mn.Monoid<M>
) => <N, A>(f: (i: number, a: A) => M) => (fa: VecC<N, A>) => M = M => f => fa =>
  pipe(fa, RA.foldMapWithIndex(M)(f))

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const reduceRightWithIndex: <N, B, A>(
  b: A,
  f: (i: number, b: B, a: A) => A
) => (fa: VecC<N, B>) => A = (a, f) => fa => pipe(fa, RA.reduceRightWithIndex(a, f))

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
  <N>(fa: VecC<N, A>): HKT<F, VecC<N, B>> => {
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
  <N, A>(fa: VecC<N, HKT<F, A>>): HKT<F, VecC<N, A>> =>
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
export const traverseWithIndex =
  <F>(F: Apl.Applicative<F>) =>
  <N, A, B>(f: (i: number, a: A) => HKT<F, B>) =>
  (ta: VecC<N, A>): HKT<F, VecC<N, B>> =>
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
/**
 * @since 1.0.0
 * @category Constructors
 */
export const toTuple: {
  <A>(t: VecC<0, A>): []
  <A>(t: VecC<1, A>): [A]
  <A>(t: VecC<2, A>): [A, A]
  <A>(t: VecC<3, A>): [A, A, A]
  <A>(t: VecC<4, A>): [A, A, A, A]
  <A>(t: VecC<5, A>): [A, A, A, A, A]
  <A>(t: VecC<6, A>): [A, A, A, A, A, A]
  <A>(t: VecC<7, A>): [A, A, A, A, A, A, A]
  <A>(t: VecC<8, A>): [A, A, A, A, A, A, A, A]
  <A>(t: VecC<9, A>): [A, A, A, A, A, A, A, A, A]
  <A>(t: VecC<10, A>): [A, A, A, A, A, A, A, A, A, A]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} = unwrap as any

// #########################
// ### Vector Operations ###
// #########################

/**
 * @since 1.0.0
 * @category Vector Operations
 */
export const updateAt: (
  n: number
) => <A>(a: A) => <N>(fa: VecC<N, A>) => O.Option<VecC<N, A>> = n => a =>
  flow(
    RA.updateAt(n, a),
    O.map(a => wrap(a))
  )

/**
 * @since 1.0.0
 * @category Vector Operations
 */
export const get: (i: number) => <N, A>(fa: VecC<N, A>) => O.Option<A> = RA.lookup

/**
 * @since 1.0.0
 * @category Vector Operations
 */
export const crossProduct: <A>(
  F: Fld.Field<A>
) => (x: VecC<3, A>, y: VecC<3, A>) => VecC<3, A> = F => (x, y) =>
  pipe(tuple(toTuple(x), toTuple(y)), ([[a1, a2, a3], [b1, b2, b3]]) =>
    fromTuple([
      F.sub(F.mul(a2, b3), F.mul(a3, b2)),
      F.sub(F.mul(a3, b1), F.mul(a1, b3)),
      F.sub(F.mul(a1, b2), F.mul(a2, b1)),
    ])
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
