/**
 * Linear maps (over the category of vector-spaces) preserve the structure of the
 * underlying vector space.
 */
import * as Cat from 'fp-ts/Category'
import * as Sgd from 'fp-ts/Semigroupoid'
import { flow, identity } from 'fp-ts/function'

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Model
 */

export interface LinearMap<A, B> {
  mapL: (a: A) => B
}

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const URI = 'LinearMap'

/**
 * @since 1.0.0
 * @category Instances
 */
export type URI = typeof URI

declare module 'fp-ts/HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: LinearMap<E, A>
  }
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const Semigroupoid: Sgd.Semigroupoid2<URI> = {
  URI,
  compose: (f, g) => ({
    mapL: flow(g.mapL, f.mapL),
  }),
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const Category: Cat.Category2<URI> = {
  ...Semigroupoid,
  id: () => ({
    _V: {},
    mapL: identity,
  }),
}
