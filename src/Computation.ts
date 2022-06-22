import * as Apl from 'fp-ts/Applicative'
import * as Ap from 'fp-ts/Apply'
import * as BiFun from 'fp-ts/Bifunctor'
import * as Chn from 'fp-ts/Chain'
import * as E from 'fp-ts/Either'
import * as FE from 'fp-ts/FromEither'
import * as Fun from 'fp-ts/Functor'
import * as Mon from 'fp-ts/Monad'
import * as MonThrow from 'fp-ts/MonadThrow'
import * as O from 'fp-ts/Option'
import * as RTup from 'fp-ts/ReadonlyTuple'
import { pipe, unsafeCoerce } from 'fp-ts/function'

import * as FM from './FreeMonoid'

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Computation<E, A> = readonly [E.Either<E, A>, FM.FreeMonoid<E>]

// ####################
// ### Constructors ###
// ####################

/**
 * @since 1.0.0
 * @category Constructors
 */
export const of: <A>(value: A) => Computation<never, A> = value => [
  E.right(value),
  FM.nil,
]

// #####################
// ### Non-Pipeables ###
// #####################

const _map: Fun.Functor2<URI>['map'] = (fa, f) => pipe(fa, map(f))
const _bimap: BiFun.Bifunctor2<URI>['bimap'] = (fa, f, g) => pipe(fa, bimap(f, g))
const _mapLeft: BiFun.Bifunctor2<URI>['mapLeft'] = (fa, f) => pipe(fa, mapLeft(f))
const _ap: Ap.Apply2<URI>['ap'] = (fab, fa) => pipe(fa, ap(fab))
const _chain: Chn.Chain2<URI>['chain'] = (fa, f) => pipe(fa, chain(f))

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const URI = 'Computation'

/**
 * @since 1.0.0
 * @category Instances
 */
export type URI = typeof URI

declare module 'fp-ts/HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: Computation<E, A>
  }
}

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const map: <A, B>(
  f: (a: A) => B
) => <E>(fa: Computation<E, A>) => Computation<E, B> = f => RTup.mapFst(E.map(f))

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
export const bimap: <E, G, A, B>(
  f: (e: E) => G,
  g: (a: A) => B
) => (fa: Computation<E, A>) => Computation<G, B> = (f, g) =>
  RTup.bimap(FM.map(f), E.bimap(f, g))

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const mapLeft: <E, G>(
  f: (e: E) => G
) => <A>(fa: Computation<E, A>) => Computation<G, A> = f =>
  RTup.bimap(FM.map(f), E.mapLeft(f))

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bifunctor: BiFun.Bifunctor2<URI> = {
  URI,
  bimap: _bimap,
  mapLeft: _mapLeft,
}

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const ap: <E, A, B>(
  fab: Computation<E, (a: A) => B>
) => (fa: Computation<E, A>) => Computation<E, B> =
  ([fab, ls1]) =>
  ([fa, ls2]) =>
    [pipe(fab, E.ap(fa)), FM.concat(ls1, ls2)]

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const Apply: Ap.Apply2<URI> = {
  ...Functor,
  ap: _ap,
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const Applicative: Apl.Applicative2<URI> = {
  ...Apply,
  of,
}

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const chain: <E, A, B>(
  f: (a: A) => Computation<E, B>
) => (fa: Computation<E, A>) => Computation<E, B> =
  f =>
  ([fa, logs]) =>
    pipe(
      fa,
      E.map(f),
      E.fold(
        err => [E.left(err), logs],
        ([result, logs2]) => [result, FM.concat(logs, logs2)]
      )
    )

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
 * @category Instances
 */
export const Monad: Mon.Monad2<URI> = {
  ...Applicative,
  ...Chain,
}

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const throwError: <E, A>(e: E) => Computation<E, A> = e => [E.left(e), FM.of(e)]

/**
 * @since 1.0.0
 * @category Instances
 */
export const MonadThrow: MonThrow.MonadThrow2<URI> = {
  ...Monad,
  throwError,
}

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const fromEither: FE.FromEither2<URI>['fromEither'] = a => [
  a,
  E.isLeft(a) ? FM.of(a.left) : FM.nil,
]

/**
 * @since 1.0.0
 * @category Instances
 */
export const FromEither: FE.FromEither2<URI> = {
  URI,
  fromEither,
}

// ###############################
// ### Natural Transformations ###
// ###############################

/**
 * @since 1.0.0
 * @category Natural Transformations
 */
export const fromOption = FE.fromOption(FromEither)

// ####################
// ### Refinements ####
// ####################

/**
 * @since 1.0.0
 * @category Refinements
 */
export const isLeft = <E, A>(
  e: Computation<E, A>
): e is readonly [E.Left<E>, FM.FreeMonoid<E>] => e[0]._tag === 'Left'

/**
 * @since 1.0.0
 * @category Refinements
 */
export const isRight = <E, A>(
  e: Computation<E, A>
): e is readonly [E.Right<A>, FM.FreeMonoid<E>] => e[0]._tag === 'Right'

// ###################
// ### Combinators ###
// ###################

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
 * @category Combinators
 */
export const chainFirst = Chn.chainFirst(Chain)

/**
 * @since 1.0.0
 * @category Combinators
 */
export const chainOptionK = FE.chainOptionK(FromEither, Chain)

/**
 * @since 1.0.0
 * @category Combinators
 */
export const chainEitherK = FE.chainEitherK(FromEither, Chain)

// #################
// ### Utilities ###
// #################

/**
 * @since 1.0.0
 * @category Utilities
 */
export const tell: <E>(message: E) => Computation<E, void> = message => [
  E.right(undefined),
  FM.of(message),
]

/**
 * @since 1.0.0
 * @category Utilities
 */
export const log: <E>(message: E) => <A>(fa: Computation<E, A>) => Computation<E, A> =
  message =>
  ([a, logs]) =>
    [a, FM.concat(logs, FM.of(message))]

/**
 * @since 1.0.0
 * @category Utilities
 */
export const logOption: <E, A>(
  getOptionalMesasge: (a: A) => O.Option<E>
) => (fa: Computation<E, A>) => Computation<E, A> =
  getOptionalMesasge =>
  ([a, logs]) => {
    const optionalMessage = pipe(O.fromEither(a), O.chain(getOptionalMesasge))
    return [
      a,
      O.isSome(optionalMessage) ? FM.concat(logs, FM.of(optionalMessage.value)) : logs,
    ]
  }

/**
 * @since 1.0.0
 * @category Utilities
 */
export const filter: <E, A>(
  predicate: (a: A) => boolean,
  onFalse: (a: A) => E
) => (fa: Computation<E, A>) => Computation<E, A> = (predicate, onFalse) =>
  chain(a => (predicate(a) ? of(a) : throwError(onFalse(a))))

/**
 * @since 1.0.0
 * @category Utilities
 */
export const filterOptionK: <E, A, B>(
  test: (a: A) => O.Option<B>,
  onFalse: (a: A) => E
) => (a: A) => Computation<E, B> = (test, onFalse) => a =>
  pipe(
    test(a),
    O.fold(() => throwError(onFalse(a)), of)
  )

// ###################
// ### Do Notation ###
// ###################

/**
 * @since 1.0.0
 * @category Do Notation
 */
export const Do = of({})

/**
 * @since 1.0.0
 * @category Do Notation
 */
export const apS = Ap.apS(Apply)

/**
 * @since 1.0.0
 * @category Do Notation
 */
export const bindTo = Fun.bindTo(Functor)

/**
 * @since 1.0.0
 * @category Do Notation
 */
export const bind = Chn.bind(Chain)

/**
 * @since 1.0.0
 * @category Do Notation
 */
export const bindW: <N extends string, A, E2, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Computation<E2, B>
) => <E1>(
  fa: Computation<E1, A>
) => Computation<E1 | E2, { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }> =
  unsafeCoerce(bind)
