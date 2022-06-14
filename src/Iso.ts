import { HKT, Kind, Kind2, Kind3, Kind4, URIS, URIS2, URIS3, URIS4 } from 'fp-ts/HKT'
import { flow, identity } from 'fp-ts/function'

// ####################
// ### Type Classes ###
// ####################

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
  reverseGet: <R, E, A>(fb: Kind3<G, R, E, A>) => Kind3<F, R, E, A>
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

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const getId: {
  <A>(): Iso0<A, A>
  <F extends URIS>(): Iso1<F, F>
  <F extends URIS2>(): Iso2<F, F>
  <F extends URIS3>(): Iso3<F, F>
  <F extends URIS4>(): Iso4<F, F>
} = () => ({
  get: identity,
  reverseGet: identity,
})

/**
 * @since 1.0.0
 * @category Instances
 */
export const compose0: {
  <A, B, C>(f: Iso0<A, B>, g: Iso0<B, C>): Iso0<A, C>
} = (f, g) => ({
  get: flow(f.get, g.get),
  reverseGet: flow(g.reverseGet, f.reverseGet),
})

/**
 * @since 1.0.0
 * @category Instances
 */
export const compose1: {
  <F extends URIS, G extends URIS, H extends URIS>(
    isoF: Iso1<F, G>,
    isoG: Iso1<G, H>
  ): Iso1<F, H>
} = (f, g) => ({
  get: flow(f.get, g.get),
  reverseGet: flow(g.reverseGet, f.reverseGet),
})

/**
 * @since 1.0.0
 * @category Instances
 */
export const compose2: {
  <F extends URIS2, G extends URIS2, H extends URIS2>(
    isoF: Iso2<F, G>,
    isoG: Iso2<G, H>
  ): Iso2<F, H>
} = (f, g) => ({
  get: flow(f.get, g.get),
  reverseGet: flow(g.reverseGet, f.reverseGet),
})

/**
 * @since 1.0.0
 * @category Instances
 */
export const compose3: {
  <F extends URIS3, G extends URIS3, H extends URIS3>(
    isoF: Iso3<F, G>,
    isoG: Iso3<G, H>
  ): Iso3<F, H>
} = (f, g) => ({
  get: flow(f.get, g.get),
  reverseGet: flow(g.reverseGet, f.reverseGet),
})

/**
 * @since 1.0.0
 * @category Instances
 */
export const compose4: {
  <F extends URIS4, G extends URIS4, H extends URIS4>(
    isoF: Iso4<F, G>,
    isoG: Iso4<G, H>
  ): Iso4<F, H>
} = (f, g) => ({
  get: flow(f.get, g.get),
  reverseGet: flow(g.reverseGet, f.reverseGet),
})
