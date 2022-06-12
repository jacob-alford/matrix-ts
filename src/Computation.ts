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
import { pipe } from 'fp-ts/function'

import * as FM from './FreeMonoid'

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type Computation<R, E, A> = readonly [E.Either<E, A>, FM.FreeMonoid<R>]

// ####################
// ### Constructors ###
// ####################

/**
 * @since 1.0.0
 * @category Constructors
 */
export const of: <A>(value: A) => Computation<never, never, A> = value => [
  E.right(value),
  FM.nil,
]

// #####################
// ### Non-Pipeables ###
// #####################

const _map: Fun.Functor3<URI>['map'] = (fa, f) => pipe(fa, map(f))
const _bimap: BiFun.Bifunctor3<URI>['bimap'] = (fa, f, g) => pipe(fa, bimap(f, g))
const _mapLeft: BiFun.Bifunctor3<URI>['mapLeft'] = (fa, f) => pipe(fa, mapLeft(f))
const _ap: Ap.Apply3<URI>['ap'] = (fab, fa) => pipe(fa, ap(fab))
const _chain: Chn.Chain3<URI>['chain'] = (fa, f) => pipe(fa, chain(f))

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
  interface URItoKind3<R, E, A> {
    readonly [URI]: Computation<R, E, A>
  }
  interface URItoKind2<E, A> {
    readonly [URI]: Computation<E, E, A>
  }
}

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const map: <A, B>(
  f: (a: A) => B
) => <R, E>(fa: Computation<R, E, A>) => Computation<R, E, B> = f => RTup.mapFst(E.map(f))

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
export const bimap: <E, G, A, B>(
  f: (e: E) => G,
  g: (a: A) => B
) => <R>(fa: Computation<R, E, A>) => Computation<R, G, B> = (f, g) =>
  RTup.mapFst(E.bimap(f, g))

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const mapLeft: <E, G>(
  f: (e: E) => G
) => <R, A>(fa: Computation<R, E, A>) => Computation<R, G, A> = f =>
  RTup.mapFst(E.mapLeft(f))

/**
 * @since 1.0.0
 * @category Instances
 */
export const Bifunctor: BiFun.Bifunctor3<URI> = {
  URI,
  bimap: _bimap,
  mapLeft: _mapLeft,
}

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const ap: <R, E, A, B>(
  fab: Computation<R, E, (a: A) => B>
) => (fa: Computation<R, E, A>) => Computation<R, E, B> =
  ([fab, ls1]) =>
  ([fa, ls2]) =>
    [pipe(fab, E.ap(fa)), FM.concat(ls1, ls2)]

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const Apply: Ap.Apply3<URI> = {
  ...Functor,
  ap: _ap,
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const Applicative: Apl.Applicative3<URI> = {
  ...Apply,
  of,
}

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const chain: <R, E, A, B>(
  f: (a: A) => Computation<R, E, B>
) => (fa: Computation<R, E, A>) => Computation<R, E, B> =
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
export const Chain: Chn.Chain3<URI> = {
  ...Apply,
  chain: _chain,
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const Monad: Mon.Monad3<URI> = {
  ...Applicative,
  ...Chain,
}

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const throwError: <E, A>(e: E) => Computation<E, E, A> = e => [E.left(e), FM.of(e)]

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const throwErrorMessage: <R, E, A>(
  e: E,
  createMessage: (e: E) => R
) => Computation<R, E, A> = (e, createMessage) => [E.left(e), FM.of(createMessage(e))]

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

/**
 * @since 1.0.0
 * @category Natural Transformations
 */
export const fromOptionWithMessage: <R, E>(
  onNone: () => E,
  createMessage: (e: E) => R
) => <A>(from: O.Option<A>) => Computation<R, E, A> = (onNone, createMessage) =>
  O.fold(
    () => throwErrorMessage(onNone(), createMessage),
    a => [E.right(a), FM.nil]
  )

// ####################
// ### Refinements ####
// ####################

/**
 * @since 1.0.0
 * @category Refinements
 */
export const isLeft = <R, E, A>(
  e: Computation<R, E, A>
): e is readonly [E.Left<E>, FM.FreeMonoid<R>] => e[0]._tag === 'Left'

/**
 * @since 1.0.0
 * @category Refinements
 */
export const isRight = <R, E, A>(
  e: Computation<R, E, A>
): e is readonly [E.Right<A>, FM.FreeMonoid<R>] => e[0]._tag === 'Right'

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
export const tell: <R>(message: R) => Computation<R, never, void> = message => [
  E.right(undefined),
  FM.of(message),
]

/**
 * @since 1.0.0
 * @category Utilities
 */
export const log: <R>(
  message: R
) => <E, A>(fa: Computation<R, E, A>) => Computation<R, E, A> =
  message =>
  ([a, logs]) =>
    [a, FM.concat(logs, FM.of(message))]

/**
 * @since 1.0.0
 * @category Utilities
 */
export const logOption: <R, E, A>(
  getOptionalMesasge: (a: A) => O.Option<R>
) => (fa: Computation<R, E, A>) => Computation<R, E, A> =
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
export const filter: <R, E, A>(
  predicate: (a: A) => boolean,
  onFalse: (a: A) => E,
  logMessage: (e: E) => R
) => (fa: Computation<R, E, A>) => Computation<R, E, A> = (
  predicate,
  onFalse,
  logMessage
) => chain(a => (predicate(a) ? of(a) : throwErrorMessage(onFalse(a), logMessage)))

/**
 * @since 1.0.0
 * @category Utilities
 */
export const filterOptionK: <R, E, A, B>(
  test: (a: A) => O.Option<B>,
  onFalse: (a: A) => E,
  logMessage: (e: E) => R
) => (a: A) => Computation<R, E, B> = (test, onFalse, logMessage) => a =>
  pipe(
    test(a),
    O.fold(() => throwErrorMessage(onFalse(a), logMessage), of)
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
export const bindW: <R1, R2, N extends string, A, E2, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Computation<R1, E2, B>
) => <E1>(
  fa: Computation<R2, E1, A>
) => Computation<
  R1 | R2,
  E1 | E2,
  { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }
> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bind as any
