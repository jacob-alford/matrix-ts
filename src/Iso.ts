import { flow, identity as id } from 'fp-ts/function'

// ###################
// ### Typeclasses ###
// ###################

/**
 * @since 1.0.0
 * @category Typeclasses
 */
export interface Iso<A, B> {
  get: (a: A) => B
  reverseGet: (b: B) => A
}

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instance Operations
 */
export const compose: <A, B, C>(a: Iso<A, B>, b: Iso<B, C>) => Iso<A, C> = (a, b) => ({
  get: flow(a.get, b.get),
  reverseGet: flow(b.reverseGet, a.reverseGet),
})

/**
 * @since 1.0.0
 * @category Instance Operations
 */
export const identity: <A>() => Iso<A, A> = () => ({
  get: id,
  reverseGet: id,
})
