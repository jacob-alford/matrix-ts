import { HKT, Kind, Kind2, Kind3, Kind4, URIS, URIS2, URIS3, URIS4 } from 'fp-ts/HKT'
import { flow, identity } from 'fp-ts/function'

import * as LM from './LinearMap'

// ###################
// ### Typeclasses ###
// ###################

/**
 * @since 1.0.0
 * @category Typeclasses
 */
export interface LinearIsomorphism<F, A, B> extends LM.LinearMap<F, A, B> {
  reverseMapL: (b: HKT<F, B>) => HKT<F, A>
}

/**
 * @since 1.0.0
 * @category Typeclasses
 */
export interface LinearIsomorphism1<F extends URIS, A, B> extends LM.LinearMap1<F, A, B> {
  reverseMapL: (a: Kind<F, B>) => Kind<F, A>
}

/**
 * @since 1.0.0
 * @category Typeclasses
 */
export interface LinearIsomorphism2<F extends URIS2, E, A, B>
  extends LM.LinearMap2<F, E, A, B> {
  reverseMapL: (a: Kind2<F, E, B>) => Kind2<F, E, A>
}

/**
 * @since 1.0.0
 * @category Typeclasses
 */
export interface LinearIsomorphism3<F extends URIS3, R, E, A, B>
  extends LM.LinearMap3<F, R, E, A, B> {
  reverseMapL: (a: Kind3<F, R, E, B>) => Kind3<F, R, E, A>
}

/**
 * @since 1.0.0
 * @category Typeclasses
 */
export interface LinearIsomorphism4<F extends URIS4, S, R, E, A, B>
  extends LM.LinearMap4<F, S, R, E, A, B> {
  reverseMapL: (a: Kind4<F, S, R, E, B>) => Kind4<F, S, R, E, A>
}

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instance Operations
 */
export function compose<F extends URIS4, S, R, E, A, B, C>(
  f: LinearIsomorphism4<F, S, R, E, A, B>,
  g: LinearIsomorphism4<F, S, R, E, B, C>
): LinearIsomorphism4<F, S, R, E, A, C>
export function compose<F extends URIS3, R, E, A, B, C>(
  f: LinearIsomorphism3<F, R, E, A, B>,
  g: LinearIsomorphism3<F, R, E, B, C>
): LinearIsomorphism3<F, R, E, A, C>
export function compose<F extends URIS2, E, A, B, C>(
  f: LinearIsomorphism2<F, E, A, B>,
  g: LinearIsomorphism2<F, E, B, C>
): LinearIsomorphism2<F, E, A, C>
export function compose<F extends URIS, A, B, C>(
  f: LinearIsomorphism1<F, A, B>,
  g: LinearIsomorphism1<F, B, C>
): LinearIsomorphism1<F, A, C> {
  return {
    mapL: flow(f.mapL, g.mapL),
    reverseMapL: flow(g.reverseMapL, f.reverseMapL),
  }
}

/**
 * @since 1.0.0
 * @category Instance Operations
 */
export function id<F extends URIS4, S, R, E, A>(): LinearIsomorphism4<F, S, R, E, A, A>
export function id<F extends URIS3, R, E, A>(): LinearIsomorphism3<F, R, E, A, A>
export function id<F extends URIS2, E, A>(): LinearIsomorphism2<F, E, A, A>
export function id<F extends URIS, A>(): LinearIsomorphism1<F, A, A> {
  return {
    mapL: identity,
    reverseMapL: identity,
  }
}
