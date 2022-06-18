/**
 * Linear maps (over the category of vector-spaces) preserve the structure of the
 * underlying vector space. This is equivalent to the existence of an ismorphism between
 * the two vector spaces belonging to the domain / codomain of the linear map.
 *
 * In practice, it'd be quite tricky to implement an isomorphism between two vector
 * spaces. However, the identity Isomorphism is a perfectly valid use case for linear maps
 * over identical types.
 */
import { HKT, Kind, Kind2, Kind3, Kind4, URIS, URIS2, URIS3, URIS4 } from 'fp-ts/HKT'
import { flow, identity } from 'fp-ts/function'

// ###################
// ### Typeclasses ###
// ###################

/**
 * @since 1.0.0
 * @category Typeclasses
 */
export interface LinearMap<F, A, B> {
  mapL: (a: HKT<F, A>) => HKT<F, B>
}

/**
 * @since 1.0.0
 * @category Typeclasses
 */
export interface LinearMap1<F extends URIS, A, B> {
  mapL: (a: Kind<F, A>) => Kind<F, B>
}

/**
 * @since 1.0.0
 * @category Typeclasses
 */
export interface LinearMap2<F extends URIS2, E, A, B> {
  mapL: (a: Kind2<F, E, A>) => Kind2<F, E, B>
}

/**
 * @since 1.0.0
 * @category Typeclasses
 */
export interface LinearMap3<F extends URIS3, R, E, A, B> {
  mapL: (a: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
}

/**
 * @since 1.0.0
 * @category Typeclasses
 */
export interface LinearMap4<F extends URIS4, S, R, E, A, B> {
  mapL: (a: Kind4<F, S, R, E, A>) => Kind4<F, S, R, E, B>
}

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instance Operations
 */
export function compose<F extends URIS4, S, R, E, A, B, C>(
  f: LinearMap4<F, S, R, E, A, B>,
  g: LinearMap4<F, S, R, E, B, C>
): LinearMap4<F, S, R, E, A, C>
export function compose<F extends URIS3, R, E, A, B, C>(
  f: LinearMap3<F, R, E, A, B>,
  g: LinearMap3<F, R, E, B, C>
): LinearMap3<F, R, E, A, C>
export function compose<F extends URIS2, E, A, B, C>(
  f: LinearMap2<F, E, A, B>,
  g: LinearMap2<F, E, B, C>
): LinearMap2<F, E, A, C>
export function compose<F extends URIS, A, B, C>(
  f: LinearMap1<F, A, B>,
  g: LinearMap1<F, B, C>
): LinearMap1<F, A, C> {
  return {
    mapL: flow(f.mapL, g.mapL),
  }
}

/**
 * @since 1.0.0
 * @category Instance Operations
 */
export function id<F extends URIS4, S, R, E, A>(): LinearMap4<F, S, R, E, A, A>
export function id<F extends URIS3, R, E, A>(): LinearMap3<F, R, E, A, A>
export function id<F extends URIS2, E, A>(): LinearMap2<F, E, A, A>
export function id<F extends URIS, A>(): LinearMap1<F, A, A> {
  return {
    mapL: identity,
  }
}
