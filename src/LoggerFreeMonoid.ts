import { IO } from 'fp-ts/IO'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'

import * as Iso_ from './Iso'

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type FreeMonoid<A> =
  | { _tag: 'Nil' }
  | { _tag: 'Cons'; value: A }
  | { _tag: 'Concat'; left: FreeMonoid<A>; right: FreeMonoid<A> }

// ###################
// ### Typeclasses ###
// ###################

/**
 * @since 1.0.0
 * @category Typeclasses
 */
export interface Logger<A, B = A> {
  info: (a: A) => FreeMonoid<IO<B>>
  success: (a: A) => FreeMonoid<IO<B>>
  failure: (a: A) => FreeMonoid<IO<B>>
  warning: (a: A) => FreeMonoid<IO<B>>
}

// ####################
// ### Constructors ###
// ####################

/**
 * @since 1.0.0
 * @category Constructors
 */
export const nil: FreeMonoid<never> = { _tag: 'Nil' }

/**
 * @since 1.0.0
 * @category Constructors
 */
export const of = <A>(value: A): FreeMonoid<A> => ({
  _tag: 'Cons',
  value,
})

/**
 * @since 1.0.0
 * @category Constructors
 */

export const concat = <A>(a: FreeMonoid<A>, b: FreeMonoid<A>): FreeMonoid<A> => {
  if (a._tag === 'Nil') {
    return b
  } else if (b._tag === 'Nil') {
    return a
  } else {
    return { _tag: 'Concat', left: a, right: b }
  }
}

/**
 * @since 1.0.0
 * @category Constructors
 */
export const fromReadonlyArray = <A>(as: ReadonlyArray<A>): FreeMonoid<A> =>
  pipe(as, RA.foldMap<FreeMonoid<A>>({ empty: nil, concat })(of))

// ###################
// ### Destructors ###
// ###################

/**
 * @since 1.0.0
 * @category Destructors
 */
export const fold =
  <A, R>(
    onNil: () => R,
    onCons: (a: A) => R,
    onConcat: (left: FreeMonoid<A>, right: FreeMonoid<A>) => R
  ) =>
  (f: FreeMonoid<A>): R => {
    switch (f._tag) {
      case 'Nil':
        return onNil()
      case 'Cons':
        return onCons(f.value)
      case 'Concat':
        return onConcat(f.left, f.right)
    }
  }

/**
 * @since 1.0.0
 * @category Destructors
 */
export const toReadonlyArray: <A>(fa: FreeMonoid<A>) => ReadonlyArray<A> = fold(
  () => RA.zero(),
  RA.of,
  (left, right) => pipe(toReadonlyArray(left), RA.concat(toReadonlyArray(right)))
)

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const URI = 'FreeMonoid'

/**
 * @since 1.0.0
 * @category Instances
 */
export type URI = typeof URI

declare module 'fp-ts/HKT' {
  interface URItoKind<A> {
    readonly [URI]: FreeMonoid<A>
  }
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const IsoReadonlyArray: Iso_.Iso1<URI, RA.URI> = {
  get: toReadonlyArray,
  reverseGet: fromReadonlyArray,
}
