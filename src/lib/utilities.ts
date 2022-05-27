import * as Mn from 'fp-ts/Monoid'
import * as Rng from 'fp-ts/Ring'

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
