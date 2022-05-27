import * as NT from 'fp-ts/NaturalTransformation'
import { HKT, URIS, URIS2, URIS3, URIS4 } from 'fp-ts/HKT'

import * as V from './VectorC'

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface FromVector<F> {
  readonly URI: F
  readonly fromVector: <N, A>(v: V.VecC<N, A>) => HKT<F, A>
}

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface FromVector1<F extends URIS> {
  readonly URI: F
  readonly fromVector: NT.NaturalTransformation21<V.URI, F>
}

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface FromVector2<F extends URIS2> {
  readonly URI: F
  readonly fromVector: NT.NaturalTransformation22<V.URI, F>
}

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface FromVector2C<F extends URIS2, E> {
  readonly URI: F
  readonly fromVector: NT.NaturalTransformation22C<V.URI, F, E>
}

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface FromVector3<F extends URIS3> {
  readonly URI: F
  readonly fromVector: NT.NaturalTransformation23<V.URI, F>
}

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface FromVector3C<F extends URIS3, E> {
  readonly URI: F
  readonly fromVector: NT.NaturalTransformation23C<V.URI, F, E>
}

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface FromVector4<F extends URIS4> {
  readonly URI: F
  readonly fromVector: NT.NaturalTransformation24<V.URI, F>
}
