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
 */

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface Conjugate<A> {
  conj: (x: A) => A
}
