import * as Apl from 'fp-ts/Applicative'
import * as Ap from 'fp-ts/Apply'
import * as Chn from 'fp-ts/Chain'
import * as E from 'fp-ts/Either'
import * as Fun from 'fp-ts/Functor'
import * as Mon from 'fp-ts/Monad'
import * as MonThrow from 'fp-ts/MonadThrow'
import * as RTup from 'fp-ts/ReadonlyTuple'
import { pipe } from 'fp-ts/function'

import * as FM from './LoggerFreeMonoid'

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
export const guard: <E, A>(
  predicate: (a: A) => boolean,
  onFalse: (a: A) => E
) => (fa: Computation<E, A>) => Computation<E, A> = (predicate, onFalse) =>
  chain(a => (predicate(a) ? of(a) : throwError(onFalse(a))))

/**
 * @since 1.0.0
 * @category Utilities
 */
export const apFirst = Ap.apFirst(Apply)

/**
 * @since 1.0.0
 * @category Utilities
 */
export const apSecond = Ap.apSecond(Apply)

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
