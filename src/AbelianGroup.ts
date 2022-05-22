/**
 * An `AbelianGroup` is a `Group` that abides the following laws:
 *
 * - Associativity: `(a * b) * c = a * (b * c)`
 * - Left / Right Unitor: `1 * a = a * 1 = a`
 * - Inverse Element: `a * a⁻¹ = 1`
 * - Commutativity: `a * b = b * a`
 *
 * @since 2.0.0
 */
import * as Grp from 'fp-ts/Group'

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Type classes
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AbelianGroup<A> extends Grp.Group<A> {}
