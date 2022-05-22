/**
 * A `Module` over a Ring R extends an Abelian Group A follows all the laws for an Abelian
 * Group and the following:
 *
 * - Distributivity over the Abelian Group: `r * (x + y) = r * x + r * y`
 * - Distributivity over the Ring R: `(r + s) * x = r * x + s * x`
 * - Associativity over the Ring R: `(r * s) * x = r * (s * x)`
 * - Unital element over the Ring R: `1 * x = x`
 *
 * @since 1.0.0
 */
import * as Rng from 'fp-ts/Ring'

import * as AbGrp from './AbelianGroup'

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface Module<R, A> extends AbGrp.AbelianGroup<A> {
  _R: Rng.Ring<R>
  scalarMul: (r: R, x: A) => A
}
