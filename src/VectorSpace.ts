/**
 * A `VectorSpace A` over a `Field F` extends a `Module F A` abides Module laws:
 *
 * @since 1.0.0
 */

import * as Mod from './Module'

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Type classes
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VectorSpace<F, A> extends Mod.Module<F, A> {}
