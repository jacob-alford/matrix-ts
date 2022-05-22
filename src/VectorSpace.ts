/**
 * A `VectorSpace A` over a `Field F` extends a `Module F A` abides Module laws:
 *
 * @since 1.0.0
 */
import * as Fld from 'fp-ts/Field'

import * as Mod from './Module'

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface VectorSpace<F, A> extends Mod.Module<F, A> {
  _F: Fld.Field<F>
}
