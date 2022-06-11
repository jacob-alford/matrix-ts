import * as Mn from 'fp-ts/Monoid'
import * as Rng from 'fp-ts/Ring'

import * as Comm from '../Commutative'

/**
 * @since 1.0.0
 * @category Internal
 */
export const getAdditionMonoid: <A>(F: Rng.Ring<A>) => Mn.Monoid<A> = F => ({
  concat: F.add,
  empty: F.zero,
})

/**
 * @since 1.0.0
 * @category Internal
 */
export const getMultiplicationMonoid: <A>(F: Rng.Ring<A>) => Mn.Monoid<A> = F => ({
  concat: F.mul,
  empty: F.one,
})

/**
 * @since 1.0.0
 * @category Internal
 */
export const getAdditiveAbelianGroup: <A>(
  F: Rng.Ring<A>
) => Comm.AbelianGroup<A> = F => ({
  concat: F.add,
  inverse: a => F.sub(F.zero, a),
  empty: F.zero,
})
