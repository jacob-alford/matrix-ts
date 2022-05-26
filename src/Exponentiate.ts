/**
 * Technically, exponentiation can be derived from a plain ring structure, but given a
 * Monoid M (positive integers), you ought to be able to construct exponetiation for any
 * Ring R This is to avoid unnecessary complexity
 */

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export interface Exp<A> {
  exp: (a: A, n: number) => A
}

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const ERing: Exp<number> = {
  exp: (a, n) => Math.pow(a, n),
}
