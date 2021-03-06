/**
 * An Automorphism is an endomorphic isomorphism. It's used in this library as a
 * structure-preserving linear isomorphism.
 *
 * @since 1.0.0
 */
import * as Iso from './Iso'

// ###################
// ### Typeclasses ###
// ###################

/**
 * @since 1.0.0
 * @category Typeclasses
 */
export interface Automorphism<A> extends Iso.Iso<A, A> {}

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instance Operations
 */
export const compose: <A>(a: Automorphism<A>, b: Automorphism<A>) => Automorphism<A> =
  Iso.compose

/**
 * @since 1.0.0
 * @category Instance Operations
 */
export const identity: <A>() => Automorphism<A> = Iso.identity
