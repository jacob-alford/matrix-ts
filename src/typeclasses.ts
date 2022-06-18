import * as Fld from 'fp-ts/Field'
import * as Grp from 'fp-ts/Group'
import * as Rng from 'fp-ts/Ring'

// #############
// ### Model ###
// #############

/**
 * An `AbelianGroup` is a `Group` that abides the following laws:
 *
 * - Commutativity: `a * b = b * a`
 *
 * @since 1.0.0
 * @category Type classes
 */
export interface AbelianGroup<A> extends Grp.Group<A> {}

/**
 * Adapted from:
 * https://pursuit.purescript.org/packages/purescript-prelude/6.0.0/docs/Data.DivisionRing
 *
 * A ring structure with division
 *
 * - One != zero
 * - Nonzero multiplicative inverse
 *
 * @since 1.0.0
 * @category Type classes
 */
export interface DivisionRing<A> extends Rng.Ring<A> {
  readonly recip: (x: A) => A
}

/**
 * Adapted from:
 * https://pursuit.purescript.org/packages/purescript-prelude/6.0.0/docs/Data.CommutativeRing
 *
 * A Ring structure with commutativity of multiplcation
 *
 * - Commutativity: `a * b = b * a`
 *
 * @since 1.0.0
 * @category Type classes
 */
export interface CommutativeRing<A> extends Rng.Ring<A> {}

/**
 * Adapted from:
 * https://pursuit.purescript.org/packages/purescript-prelude/6.0.0/docs/Data.EuclideanRing
 *
 * @since 1.0.0
 * @category Type classes
 */
export interface EuclidianRing<A> extends CommutativeRing<A> {
  readonly degree: (a: A) => number
  readonly div: (x: A, y: A) => A
  readonly mod: (x: A, y: A) => A
}

/**
 * `Conjugate A` over a Field F contains conj which abides the following laws:
 *
 * - Distributivity over Addtion, Subtraction, Multiplication and Division:
 *
 *   - `conj(a + b) = conj(a) + conj(b)`
 *   - `conj(a - b) = conj(a) - conj(b)`
 *   - `conj(a * b) = conj(a) * conj(b)`
 *   - `conj(a / b) = conj(a) / conj(b)`
 *
 * @since 1.0.0
 * @category Type classes
 */
export interface Conjugate<A> {
  readonly conj: (x: A) => A
}

/**
 * Technically, exponentiation can be derived from a plain ring structure, but given a
 * Monoid M (positive integers), you ought to be able to construct exponetiation for any
 * Ring R This is to avoid unnecessary complexity
 *
 * @since 1.0.0
 * @category Model
 */
export interface Exp<A> {
  readonly exp: (a: A, n: number) => A
}

/**
 * An `InnerProductSpace F A` over a `Field F` extends a `VectorSpace F A` with a notion
 * of inner product, and abides the following laws:
 *
 * - Conjugate Symmetry: <x, y> = conj(<y, x>)
 * - Positive Definiteness: <x,x> = 0 for x = 0; <x,x> > 0 = for x != 0
 * - Linearity in the first argument: a * <x, y> + b * <y, z> = <ax + by, z>
 *
 * @since 1.0.0
 * @category Type classes
 */
export interface InnerProductSpace<F, A> extends VectorSpace<F, A>, Conjugate<F> {
  readonly dot: (x: A, y: A) => F
}

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
 * @category Type classes
 */
export interface LeftModule<A, L> extends AbelianGroup<A> {
  readonly leftScalarMul: (r: L, x: A) => A
}

/**
 * See `LeftModule` for Module laws
 *
 * @since 1.0.0
 * @category Type classes
 */
export interface RightModule<A, R> extends AbelianGroup<A> {
  readonly rightScalarMul: (x: A, r: R) => A
}

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface Bimodule<A, L, R = L> extends LeftModule<A, L>, RightModule<A, R> {}

/**
 * A `VectorSpace A` over a `Field F` extends a `Module F A` abides Module laws:
 *
 * @since 1.0.0
 * @category Type classes
 */
export interface VectorSpace<F, A> extends LeftModule<A, F> {
  readonly _F: Fld.Field<F>
}
