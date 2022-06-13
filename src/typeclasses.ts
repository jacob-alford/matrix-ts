import * as Fld from 'fp-ts/Field'
import * as Grp from 'fp-ts/Group'
import * as Rng from 'fp-ts/Ring'

// #############
// ### Model ###
// #############

/**
 * An `AbelianGroup` is a `Group` that abides the following laws:
 *
 * - Associativity: `(a * b) * c = a * (b * c)`
 * - Left / Right Unitor: `1 * a = a * 1 = a`
 * - Inverse Element: `a * a⁻¹ = 1`
 * - Commutativity: `a * b = b * a`
 *
 * @since 1.0.0
 * @category Type classes
 */
export interface AbelianGroup<A> extends Grp.Group<A> {}

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface CommutativeRing<A> extends Rng.Ring<A> {}

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
  conj: (x: A) => A
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
  exp: (a: A, n: number) => A
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
  dot: (x: A, y: A) => F
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
export interface LeftModule<R, A> extends AbelianGroup<A> {
  leftScalarMul: (r: R, x: A) => A
}

/**
 * See `LeftModule` for Module laws
 *
 * @since 1.0.0
 * @category Type classes
 */
export interface RightModule<R, A> extends AbelianGroup<A> {
  rightScalarMul: (x: A, r: R) => A
}

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface Bimodule<R, A> extends LeftModule<R, A>, RightModule<R, A> {}

/**
 * A `VectorSpace A` over a `Field F` extends a `Module F A` abides Module laws:
 *
 * @since 1.0.0
 * @category Type classes
 */
export interface VectorSpace<F, A> extends LeftModule<F, A> {
  _F: Fld.Field<F>
}
