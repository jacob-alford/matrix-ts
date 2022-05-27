import * as NT from 'fp-ts/NaturalTransformation'
import { HKT2, URIS, URIS2, URIS3, URIS4 } from 'fp-ts/HKT'

import * as Poly from './Polynomial'

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface FromPolynomial<F> {
  readonly URI: F
  readonly fromPolynomial: <R, C>(v: Poly.Polynomial<R, C>) => HKT2<F, R, C>
}

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface FromPolynomial1<F extends URIS> {
  readonly URI: F
  readonly fromPolynomial: NT.NaturalTransformation21<Poly.URI, F>
}

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface FromPolynomial1I<F extends URIS> {
  readonly URI: F
  readonly fromPolynomial: NT.NaturalTransformation11<Poly.URI, F>
}

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface FromPolynomial2<F extends URIS2> {
  readonly URI: F
  readonly fromPolynomial: NT.NaturalTransformation22<Poly.URI, F>
}

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface FromPolynomial2I<F extends URIS2> {
  readonly URI: F
  readonly fromPolynomial: NT.NaturalTransformation12<Poly.URI, F>
}

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface FromPolynomial2C<F extends URIS2, E> {
  readonly URI: F
  readonly fromPolynomial: NT.NaturalTransformation22C<Poly.URI, F, E>
}

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface FromPolynomial2IC<F extends URIS2, E> {
  readonly URI: F
  readonly fromPolynomial: NT.NaturalTransformation12C<Poly.URI, F, E>
}

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface FromPolynomial3<F extends URIS3> {
  readonly URI: F
  readonly fromPolynomial: NT.NaturalTransformation23<Poly.URI, F>
}

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface FromPolynomial3I<F extends URIS3> {
  readonly URI: F
  readonly fromPolynomial: NT.NaturalTransformation13<Poly.URI, F>
}

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface FromPolynomial3C<F extends URIS3, E> {
  readonly URI: F
  readonly fromPolynomial: NT.NaturalTransformation23C<Poly.URI, F, E>
}

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface FromPolynomial3IC<F extends URIS3, E> {
  readonly URI: F
  readonly fromPolynomial: NT.NaturalTransformation13C<Poly.URI, F, E>
}

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface FromPolynomial4<F extends URIS4> {
  readonly URI: F
  readonly fromPolynomial: NT.NaturalTransformation24<Poly.URI, F>
}

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface FromPolynomial4I<F extends URIS4> {
  readonly URI: F
  readonly fromPolynomial: NT.NaturalTransformation14<Poly.URI, F>
}
