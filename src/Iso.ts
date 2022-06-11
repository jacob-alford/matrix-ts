import { HKT, Kind, Kind2, Kind3, Kind4, URIS, URIS2, URIS3, URIS4 } from 'fp-ts/HKT'

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface Iso<F, G> {
  get: <A>(fa: HKT<F, A>) => HKT<G, A>
  reverseGet: <A>(ga: HKT<G, A>) => HKT<F, A>
}

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface Iso0<A, B> {
  get: (a: A) => B
  reverseGet: (b: B) => A
}

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface Iso1<F extends URIS, G extends URIS> {
  get: <A>(fa: Kind<F, A>) => Kind<G, A>
  reverseGet: <A>(fb: Kind<G, A>) => Kind<F, A>
}

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface Iso2<F extends URIS2, G extends URIS2> {
  get: <E, A>(fa: Kind2<F, E, A>) => Kind2<G, E, A>
  reverseGet: <E, A>(fb: Kind2<G, E, A>) => Kind2<F, E, A>
}

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface Iso2C<F extends URIS2, G extends URIS2, E> {
  get: <A>(fa: Kind2<F, E, A>) => Kind2<G, E, A>
  reverseGet: <A>(fb: Kind2<G, E, A>) => Kind2<F, E, A>
}

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface Iso3<F extends URIS3, G extends URIS3> {
  get: <R, E, A>(fa: Kind3<F, R, E, A>) => Kind3<G, R, E, A>
  reverseGet: <R, E, A>(fb: Kind3<G, R, E, A>) => Kind3<G, R, E, A>
}

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface Iso3C<F extends URIS3, G extends URIS3, E> {
  get: <R, A>(fa: Kind3<F, R, E, A>) => Kind3<G, R, E, A>
  reverseGet: <R, A>(fb: Kind3<G, R, E, A>) => Kind3<F, R, E, A>
}

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface Iso4<F extends URIS4, G extends URIS4> {
  get: <S, R, E, A>(fa: Kind4<F, S, R, E, A>) => Kind4<G, S, R, E, A>
  reverseGet: <S, R, E, A>(fb: Kind4<G, S, R, E, A>) => Kind4<F, S, R, E, A>
}

/**
 * @since 1.0.0
 * @category Type classes
 */
export interface Iso4C<F extends URIS4, G extends URIS4, E> {
  get: <S, R, A>(fa: Kind4<F, S, R, E, A>) => Kind4<G, S, R, E, A>
  reverseGet: <S, R, A>(fb: Kind4<G, S, R, E, A>) => Kind4<F, S, R, E, A>
}
