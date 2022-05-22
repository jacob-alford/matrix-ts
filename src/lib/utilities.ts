import * as Mn from 'fp-ts/Monoid'
import * as Fld from 'fp-ts/Field'

/**
 * @since 1.0.0
 * @category Internal
 */
export const getAdditionMonoid: <A>(F: Fld.Field<A>) => Mn.Monoid<A> = (F) => ({
  concat: F.add,
  empty: F.zero,
})
