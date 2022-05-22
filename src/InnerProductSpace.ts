/**
 * An `InnerProductSpace F A` over a `Field F` extends a `VectorSpace F A` with a notion
 * of inner product, and abides the following laws:
 *
 * - Conjugate Symmetry: <x, y> = conj(<y, x>)
 * - Positive Definiteness: <x,x> = 0 for x = 0; <x,x> > 0 = for x != 0
 * - Linearity in the first argument: a * <x, y> + b * <y, z> = <ax + by, z>
 *
 * @since 1.0.0
 */

import * as VecSpc from './VectorSpace'
import * as Conj from './Conjugate'

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface InnerProductSpace<F, A>
  extends VecSpc.VectorSpace<F, A>,
    Conj.Conjugate<F> {
  dot: (x: A, y: A) => F
}
