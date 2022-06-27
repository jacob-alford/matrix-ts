---
title: Vector.ts
nav_order: 18
parent: Modules
---

## Vector overview

A vector type constrained to a particular size enforced by the type system, and
associated typeclasses.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Combinators](#combinators)
  - [apFirst](#apfirst)
  - [apSecond](#apsecond)
  - [chainFirst](#chainfirst)
- [Constructors](#constructors)
  - [fromReadonlyArray](#fromreadonlyarray)
  - [fromTuple](#fromtuple)
  - [makeBy](#makeby)
  - [randVec](#randvec)
  - [repeat](#repeat)
- [Destructors](#destructors)
  - [l1Norm](#l1norm)
  - [l2Norm](#l2norm)
  - [lInfNorm](#linfnorm)
  - [lpNorm](#lpnorm)
  - [size](#size)
  - [toTuple](#totuple)
- [Do notation](#do-notation)
  - [apS](#aps)
  - [bind](#bind)
  - [bindTo](#bindto)
- [Instance Operations](#instance-operations)
  - [traverseWithIndex](#traversewithindex)
- [Instance operations](#instance-operations)
  - [ap](#ap)
  - [chain](#chain)
  - [foldMap](#foldmap)
  - [foldMapWithIndex](#foldmapwithindex)
  - [map](#map)
  - [mapWithIndex](#mapwithindex)
  - [of](#of)
  - [reduce](#reduce)
  - [reduceRight](#reduceright)
  - [reduceRightWithIndex](#reducerightwithindex)
  - [reduceWithIndex](#reducewithindex)
  - [sequence](#sequence)
  - [traverse](#traverse)
- [Instances](#instances)
  - [Applicative](#applicative)
  - [Apply](#apply)
  - [Chain](#chain)
  - [Foldable](#foldable)
  - [FoldableWithIndex](#foldablewithindex)
  - [Functor](#functor)
  - [FunctorWithIndex](#functorwithindex)
  - [Monad](#monad)
  - [Pointed](#pointed)
  - [Traversable](#traversable)
  - [TraversableWithIndex](#traversablewithindex)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
  - [getAdditiveAbelianGroup](#getadditiveabeliangroup)
  - [getBimodule](#getbimodule)
- [Internal](#internal)
  - [liftA2](#lifta2)
- [Model](#model)
  - [Vec (interface)](#vec-interface)
- [Vector Operations](#vector-operations)
  - [crossProduct](#crossproduct)
  - [get](#get)
  - [innerProduct](#innerproduct)
  - [projection](#projection)
  - [reverse](#reverse)
  - [updateAt](#updateat)
  - [zipVectors](#zipvectors)

---

# Combinators

## apFirst

**Signature**

```ts
export declare const apFirst: <E, B>(second: Vec<E, B>) => <A>(first: Vec<E, A>) => Vec<E, A>
```

Added in v1.0.0

## apSecond

**Signature**

```ts
export declare const apSecond: <E, B>(second: Vec<E, B>) => <A>(first: Vec<E, A>) => Vec<E, B>
```

Added in v1.0.0

## chainFirst

**Signature**

```ts
export declare const chainFirst: <A, B>(f: (a: A) => Vec<1, B>) => (first: Vec<1, A>) => Vec<1, A>
```

Added in v1.0.0

# Constructors

## fromReadonlyArray

**Signature**

```ts
export declare const fromReadonlyArray: <N extends number>(n: N) => <A>(as: readonly A[]) => O.Option<Vec<N, A>>
```

Added in v1.0.0

## fromTuple

**Signature**

```ts
export declare const fromTuple: {
  <A>(t: []): Vec<0, A>
  <A>(t: [A]): Vec<1, A>
  <A>(t: [A, A]): Vec<2, A>
  <A>(t: [A, A, A]): Vec<3, A>
  <A>(t: [A, A, A, A]): Vec<4, A>
  <A>(t: [A, A, A, A, A]): Vec<5, A>
  <A>(t: [A, A, A, A, A, A]): Vec<6, A>
  <A>(t: [A, A, A, A, A, A, A]): Vec<7, A>
  <A>(t: [A, A, A, A, A, A, A, A]): Vec<8, A>
  <A>(t: [A, A, A, A, A, A, A, A, A]): Vec<9, A>
  <A>(t: [A, A, A, A, A, A, A, A, A, A]): Vec<10, A>
}
```

Added in v1.0.0

## makeBy

**Signature**

```ts
export declare const makeBy: <N extends number, A>(n: N, make: (i: number) => A) => Vec<N, A>
```

Added in v1.0.0

## randVec

**Signature**

```ts
export declare const randVec: <N extends number, A>(n: N, make: IO.IO<A>) => IO.IO<Vec<N, A>>
```

Added in v1.0.0

## repeat

**Signature**

```ts
export declare const repeat: <N extends number, A>(n: N, a: A) => Vec<N, A>
```

Added in v1.0.0

# Destructors

## l1Norm

**Signature**

```ts
export declare const l1Norm: <A extends number | Complex>(R: Rng.Ring<A>) => <N>(x: Vec<N, A>) => A
```

Added in v1.0.0

## l2Norm

**Signature**

```ts
export declare const l2Norm: <A extends number | Complex>(
  R: Rng.Ring<A>,
  abs: (x: A) => A,
  pow: (x: A, n: number) => A
) => <N>(x: Vec<N, A>) => A
```

Added in v1.0.0

## lInfNorm

**Signature**

```ts
export declare const lInfNorm: <A extends number | Complex>(
  B: Bnd.Bounded<A>,
  abs: (a: A) => A
) => <N>(x: Vec<N, A>) => A
```

Added in v1.0.0

## lpNorm

**Signature**

```ts
export declare const lpNorm: (
  p: number
) => <A extends number | Complex>(
  R: Rng.Ring<A>,
  abs: (x: A) => A,
  pow: (x: A, n: number) => A
) => <N>(x: Vec<N, A>) => A
```

Added in v1.0.0

## size

**Signature**

```ts
export declare const size: <N extends number, A>(v: Vec<N, A>) => N
```

Added in v1.0.0

## toTuple

**Signature**

```ts
export declare const toTuple: {
  <A>(t: Vec<0, A>): []
  <A>(t: Vec<1, A>): [A]
  <A>(t: Vec<2, A>): [A, A]
  <A>(t: Vec<3, A>): [A, A, A]
  <A>(t: Vec<4, A>): [A, A, A, A]
  <A>(t: Vec<5, A>): [A, A, A, A, A]
  <A>(t: Vec<6, A>): [A, A, A, A, A, A]
  <A>(t: Vec<7, A>): [A, A, A, A, A, A, A]
  <A>(t: Vec<8, A>): [A, A, A, A, A, A, A, A]
  <A>(t: Vec<9, A>): [A, A, A, A, A, A, A, A, A]
  <A>(t: Vec<10, A>): [A, A, A, A, A, A, A, A, A, A]
}
```

Added in v1.0.0

# Do notation

## apS

**Signature**

```ts
export declare const apS: <N, A, E, B>(
  name: Exclude<N, keyof A>,
  fb: Vec<E, B>
) => (fa: Vec<E, A>) => Vec<E, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v1.0.0

## bind

**Signature**

```ts
export declare const bind: <N, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Vec<1, B>
) => (ma: Vec<1, A>) => Vec<1, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v1.0.0

## bindTo

**Signature**

```ts
export declare const bindTo: <N>(name: N) => <E, A>(fa: Vec<E, A>) => Vec<E, { readonly [K in N]: A }>
```

Added in v1.0.0

# Instance Operations

## traverseWithIndex

**Signature**

```ts
export declare const traverseWithIndex: TrI.PipeableTraverseWithIndex2<'Vec', number>
```

Added in v1.0.0

# Instance operations

## ap

**Signature**

```ts
export declare const ap: <N, A, B>(fa: Vec<N, A>) => (fab: Vec<N, (a: A) => B>) => Vec<N, B>
```

Added in v1.0.0

## chain

**Signature**

```ts
export declare const chain: <A, B>(f: (a: A) => Vec<1, B>) => <N>(ma: Vec<N, A>) => Vec<N, B>
```

Added in v1.0.0

## foldMap

**Signature**

```ts
export declare const foldMap: <M>(M: Mn.Monoid<M>) => <N, A>(f: (a: A) => M) => (fa: Vec<N, A>) => M
```

Added in v1.0.0

## foldMapWithIndex

**Signature**

```ts
export declare const foldMapWithIndex: <M>(M: Mn.Monoid<M>) => <N, A>(f: (i: number, a: A) => M) => (fa: Vec<N, A>) => M
```

Added in v1.0.0

## map

**Signature**

```ts
export declare const map: <N, A, B>(f: (a: A) => B) => (v: Vec<N, A>) => Vec<N, B>
```

Added in v1.0.0

## mapWithIndex

**Signature**

```ts
export declare const mapWithIndex: <N, A, B>(f: (i: number, a: A) => B) => (v: Vec<N, A>) => Vec<N, B>
```

Added in v1.0.0

## of

**Signature**

```ts
export declare const of: <A>(a: A) => Vec<1, A>
```

Added in v1.0.0

## reduce

**Signature**

```ts
export declare const reduce: <N, A, B>(b: B, f: (b: B, a: A) => B) => (fa: Vec<N, A>) => B
```

Added in v1.0.0

## reduceRight

**Signature**

```ts
export declare const reduceRight: <N, B, A>(b: A, f: (b: B, a: A) => A) => (fa: Vec<N, B>) => A
```

Added in v1.0.0

## reduceRightWithIndex

**Signature**

```ts
export declare const reduceRightWithIndex: <N, B, A>(b: A, f: (i: number, b: B, a: A) => A) => (fa: Vec<N, B>) => A
```

Added in v1.0.0

## reduceWithIndex

**Signature**

```ts
export declare const reduceWithIndex: <N, A, B>(b: B, f: (i: number, b: B, a: A) => B) => (fa: Vec<N, A>) => B
```

Added in v1.0.0

## sequence

**Signature**

```ts
export declare const sequence: <F>(F: Apl.Applicative<F>) => <N, A>(fa: Vec<N, HKT<F, A>>) => HKT<F, Vec<N, A>>
```

Added in v1.0.0

## traverse

**Signature**

```ts
export declare const traverse: Tr.PipeableTraverse2<'Vec'>
```

Added in v1.0.0

# Instances

## Applicative

**Signature**

```ts
export declare const Applicative: Apl.Applicative2C<'Vec', 1>
```

Added in v1.0.0

## Apply

**Signature**

```ts
export declare const Apply: Ap.Apply2<'Vec'>
```

Added in v1.0.0

## Chain

**Signature**

```ts
export declare const Chain: Chn.Chain2C<'Vec', 1>
```

Added in v1.0.0

## Foldable

**Signature**

```ts
export declare const Foldable: Fl.Foldable2<'Vec'>
```

Added in v1.0.0

## FoldableWithIndex

**Signature**

```ts
export declare const FoldableWithIndex: FlI.FoldableWithIndex2<'Vec', number>
```

Added in v1.0.0

## Functor

**Signature**

```ts
export declare const Functor: Fun.Functor2<'Vec'>
```

Added in v1.0.0

## FunctorWithIndex

**Signature**

```ts
export declare const FunctorWithIndex: FunI.FunctorWithIndex2<'Vec', number>
```

Added in v1.0.0

## Monad

**Signature**

```ts
export declare const Monad: Mon.Monad2C<'Vec', 1>
```

Added in v1.0.0

## Pointed

**Signature**

```ts
export declare const Pointed: Pt.Pointed2C<'Vec', 1>
```

Added in v1.0.0

## Traversable

**Signature**

```ts
export declare const Traversable: Tr.Traversable2<'Vec'>
```

Added in v1.0.0

## TraversableWithIndex

**Signature**

```ts
export declare const TraversableWithIndex: TrI.TraversableWithIndex2<'Vec', number>
```

Added in v1.0.0

## URI

**Signature**

```ts
export declare const URI: 'Vec'
```

Added in v1.0.0

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v1.0.0

## getAdditiveAbelianGroup

**Signature**

```ts
export declare const getAdditiveAbelianGroup: <A>(
  R: Rng.Ring<A>
) => <N extends number>(n: N) => TC.AbelianGroup<Vec<N, A>>
```

Added in v1.0.0

## getBimodule

**Signature**

```ts
export declare const getBimodule: <R>(R: Rng.Ring<R>) => <N extends number>(n: N) => TC.Bimodule<Vec<N, R>, R, R>
```

Added in v1.0.0

# Internal

## liftA2

**Signature**

```ts
export declare const liftA2: <N, A, B>(f: (x: A, y: A) => B) => (x: Vec<N, A>, y: Vec<N, A>) => Vec<N, B>
```

Added in v1.0.0

# Model

## Vec (interface)

**Signature**

```ts
export interface Vec<N, A> extends ReadonlyArray<A> {
  _length: N
}
```

Added in v1.0.0

# Vector Operations

## crossProduct

**Signature**

```ts
export declare const crossProduct: <A>(R: Rng.Ring<A>) => (x: Vec<3, A>, y: Vec<3, A>) => Vec<3, A>
```

Added in v1.0.0

## get

**Signature**

```ts
export declare const get: (i: number) => <N, A>(fa: Vec<N, A>) => O.Option<A>
```

Added in v1.0.0

## innerProduct

**Signature**

```ts
export declare const innerProduct: <A extends number | Complex>(
  R: Rng.Ring<A>,
  conj: (r: A) => A
) => <N>(x: Vec<N, A>, y: Vec<N, A>) => A
```

Added in v1.0.0

## projection

**Signature**

```ts
export declare const projection: <R extends number | Complex>(
  F: Fld.Field<R>,
  conj: (r: R) => R
) => <N extends number>(u: Vec<N, R>, v: Vec<N, R>) => Vec<N, R>
```

Added in v1.0.0

## reverse

**Signature**

```ts
export declare const reverse: <N, A>(v1: Vec<N, A>) => Vec<N, A>
```

Added in v1.0.0

## updateAt

**Signature**

```ts
export declare const updateAt: (n: number) => <A>(a: A) => <N>(fa: Vec<N, A>) => O.Option<Vec<N, A>>
```

Added in v1.0.0

## zipVectors

**Signature**

```ts
export declare const zipVectors: <N, A, B>(v1: Vec<N, A>, v2: Vec<N, B>) => Vec<N, readonly [A, B]>
```

Added in v1.0.0
