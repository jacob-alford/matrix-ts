---
title: Matrix.ts
nav_order: 9
parent: Modules
---

## Matrix overview

A constrained matrix type. Allows for matrix/vector operations that won't fail due to
incompatible shapes

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Constructors](#constructors)
  - [from2dVectors](#from2dvectors)
  - [fromNestedReadonlyArrays](#fromnestedreadonlyarrays)
  - [fromNestedTuples](#fromnestedtuples)
  - [fromVectorAsColumn](#fromvectorascolumn)
  - [fromVectorAsRow](#fromvectorasrow)
  - [identity](#identity)
  - [makeBy](#makeby)
  - [outerProduct](#outerproduct)
  - [randMatrix](#randmatrix)
  - [repeat](#repeat)
- [Destructors](#destructors)
  - [shape](#shape)
  - [toNestedArrays](#tonestedarrays)
  - [toNestedReadonlyArrays](#tonestedreadonlyarrays)
- [Instance Operations](#instance-operations)
  - [foldMap](#foldmap)
  - [foldMapWithIndex](#foldmapwithindex)
  - [map](#map)
  - [mapWithIndex](#mapwithindex)
  - [reduce](#reduce)
  - [reduceRight](#reduceright)
  - [reduceRightWithIndex](#reducerightwithindex)
  - [reduceWithIndex](#reducewithindex)
  - [sequence](#sequence)
  - [traverse](#traverse)
  - [traverseWithIndex](#traversewithindex)
- [Instances](#instances)
  - [Foldable](#foldable)
  - [FoldableWithIndex](#foldablewithindex)
  - [Functor](#functor)
  - [FunctorWithIndex](#functorwithindex)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
  - [getAdditiveAbelianGroup](#getadditiveabeliangroup)
  - [getBimodule](#getbimodule)
- [Matrix Operations](#matrix-operations)
  - [get](#get)
  - [lift2](#lift2)
  - [linMap](#linmap)
  - [mul](#mul)
  - [switchRows](#switchrows)
  - [trace](#trace)
  - [transpose](#transpose)
- [Model](#model)
  - [Mat (interface)](#mat-interface)

---

# Constructors

## from2dVectors

**Signature**

```ts
export declare const from2dVectors: <M, N, A>(ks: V.Vec<M, V.Vec<N, A>>) => Mat<M, N, A>
```

Added in v1.0.0

## fromNestedReadonlyArrays

**Signature**

```ts
export declare const fromNestedReadonlyArrays: <M extends number, N extends number>(
  m: M,
  n: N
) => <A>(as: readonly (readonly A[])[]) => O.Option<Mat<M, N, A>>
```

Added in v1.0.0

## fromNestedTuples

**Signature**

```ts
export declare const fromNestedTuples: {
  <A>(t: []): Mat<0, 0, A>
  <A>(t: [[A]]): Mat<1, 1, A>
  <A>(t: [[A, A]]): Mat<1, 2, A>
  <A>(t: [[A], [A]]): Mat<2, 1, A>
  <A>(t: [[A, A], [A, A]]): Mat<2, 2, A>
  <A>(t: [[A, A, A]]): Mat<1, 3, A>
  <A>(t: [[A], [A], [A]]): Mat<3, 1, A>
  <A>(t: [[A, A, A], [A, A, A]]): Mat<2, 3, A>
  <A>(t: [[A, A], [A, A], [A, A]]): Mat<3, 2, A>
  <A>(t: [[A, A, A], [A, A, A], [A, A, A]]): Mat<3, 3, A>
  <A>(t: [[A, A, A, A]]): Mat<1, 4, A>
  <A>(t: [[A], [A], [A], [A]]): Mat<4, 1, A>
  <A>(t: [[A, A, A, A], [A, A, A, A]]): Mat<2, 4, A>
  <A>(t: [[A, A], [A, A], [A, A], [A, A]]): Mat<4, 2, A>
  <A>(t: [[A, A, A, A], [A, A, A, A], [A, A, A, A]]): Mat<3, 4, A>
  <A>(t: [[A, A, A], [A, A, A], [A, A, A], [A, A, A]]): Mat<4, 3, A>
  <A>(t: [[A, A, A, A], [A, A, A, A], [A, A, A, A], [A, A, A, A]]): Mat<4, 4, A>
  <A>(t: [[A, A, A, A, A]]): Mat<1, 5, A>
  <A>(t: [[A], [A], [A], [A], [A]]): Mat<5, 1, A>
  <A>(t: [[A, A, A, A, A], [A, A, A, A, A]]): Mat<2, 5, A>
  <A>(t: [[A, A], [A, A], [A, A], [A, A], [A, A]]): Mat<5, 2, A>
  <A>(t: [[A, A, A, A, A], [A, A, A, A, A], [A, A, A, A, A]]): Mat<3, 5, A>
  <A>(t: [[A, A, A], [A, A, A], [A, A, A], [A, A, A], [A, A, A]]): Mat<5, 3, A>
  <A>(t: [[A, A, A, A, A], [A, A, A, A, A], [A, A, A, A, A], [A, A, A, A, A]]): Mat<4, 5, A>
  <A>(t: [[A, A, A, A], [A, A, A, A], [A, A, A, A], [A, A, A, A], [A, A, A, A]]): Mat<5, 4, A>
  <A>(t: [[A, A, A, A, A], [A, A, A, A, A], [A, A, A, A, A], [A, A, A, A, A], [A, A, A, A, A]]): Mat<5, 5, A>
  <A>(t: [[A, A, A, A, A, A]]): Mat<1, 6, A>
  <A>(t: [[A], [A], [A], [A], [A], [A]]): Mat<6, 1, A>
  <A>(t: [[A, A, A, A, A, A], [A, A, A, A, A, A]]): Mat<2, 6, A>
  <A>(t: [[A, A], [A, A], [A, A], [A, A], [A, A], [A, A]]): Mat<6, 2, A>
  <A>(t: [[A, A, A, A, A, A], [A, A, A, A, A, A], [A, A, A, A, A, A]]): Mat<3, 6, A>
  <A>(t: [[A, A, A], [A, A, A], [A, A, A], [A, A, A], [A, A, A], [A, A, A]]): Mat<6, 3, A>
  <A>(t: [[A, A, A, A, A, A], [A, A, A, A, A, A], [A, A, A, A, A, A], [A, A, A, A, A, A]]): Mat<4, 6, A>
  <A>(t: [[A, A, A, A], [A, A, A, A], [A, A, A, A], [A, A, A, A], [A, A, A, A], [A, A, A, A]]): Mat<6, 4, A>
  <A>(t: [[A, A, A, A, A, A], [A, A, A, A, A, A], [A, A, A, A, A, A], [A, A, A, A, A, A], [A, A, A, A, A, A]]): Mat<
    5,
    6,
    A
  >
  <A>(t: [[A, A, A, A, A], [A, A, A, A, A], [A, A, A, A, A], [A, A, A, A, A], [A, A, A, A, A], [A, A, A, A, A]]): Mat<
    6,
    5,
    A
  >
  <A>(
    t: [
      [A, A, A, A, A, A],
      [A, A, A, A, A, A],
      [A, A, A, A, A, A],
      [A, A, A, A, A, A],
      [A, A, A, A, A, A],
      [A, A, A, A, A, A]
    ]
  ): Mat<6, 6, A>
}
```

Added in v1.0.0

## fromVectorAsColumn

**Signature**

```ts
export declare const fromVectorAsColumn: <N, A>(v: V.Vec<N, A>) => Mat<N, 1, A>
```

Added in v1.0.0

## fromVectorAsRow

**Signature**

```ts
export declare const fromVectorAsRow: <N, A>(v: V.Vec<N, A>) => Mat<1, N, A>
```

Added in v1.0.0

## identity

Constructs the identity matrix

**Signature**

```ts
export declare const identity: <A>(R: Rng.Ring<A>) => <M extends number>(m: M) => Mat<M, M, A>
```

Added in v1.0.0

## makeBy

**Signature**

```ts
export declare const makeBy: <M extends number, N extends number, A>(
  m: M,
  n: N,
  f: (a: [number, number]) => A
) => Mat<M, N, A>
```

Added in v1.0.0

## outerProduct

**Signature**

```ts
export declare const outerProduct: <A>(
  R: Rng.Ring<A>
) => <M extends number, N extends number>(v1: V.Vec<M, A>, v2: V.Vec<N, A>) => Mat<M, N, A>
```

Added in v1.0.0

## randMatrix

**Signature**

```ts
export declare const randMatrix: <M extends number, N extends number, A>(
  m: M,
  n: N,
  make: IO.IO<A>
) => IO.IO<Mat<M, N, A>>
```

Added in v1.0.0

## repeat

**Signature**

```ts
export declare const repeat: <A>(a: A) => <M extends number, N extends number>(m: M, n: N) => Mat<M, N, A>
```

Added in v1.0.0

# Destructors

## shape

**Signature**

```ts
export declare const shape: <M extends number, N extends number, A>(m: Mat<M, N, A>) => [M, N]
```

Added in v1.0.0

## toNestedArrays

**Signature**

```ts
export declare const toNestedArrays: <M, N, A>(m: Mat<M, N, A>) => A[][]
```

Added in v1.0.0

## toNestedReadonlyArrays

**Signature**

```ts
export declare const toNestedReadonlyArrays: <M, N, A>(m: Mat<M, N, A>) => readonly (readonly A[])[]
```

Added in v1.0.0

# Instance Operations

## foldMap

**Signature**

```ts
export declare const foldMap: <M>(M: Mn.Monoid<M>) => <N, O, A>(f: (a: A) => M) => (fa: Mat<N, O, A>) => M
```

Added in v1.0.0

## foldMapWithIndex

**Signature**

```ts
export declare const foldMapWithIndex: <M>(
  M: Mn.Monoid<M>
) => <N, O, A>(f: (i: [number, number], a: A) => M) => (fa: Mat<N, O, A>) => M
```

Added in v1.0.0

## map

**Signature**

```ts
export declare const map: <M, N, A, B>(f: (a: A) => B) => (v: Mat<M, N, A>) => Mat<M, N, B>
```

Added in v1.0.0

## mapWithIndex

**Signature**

```ts
export declare const mapWithIndex: <M, N, A, B>(
  f: (ij: [number, number], a: A) => B
) => (v: Mat<M, N, A>) => Mat<M, N, B>
```

Added in v1.0.0

## reduce

**Signature**

```ts
export declare const reduce: <M, N, A, B>(b: B, f: (b: B, a: A) => B) => (fa: Mat<M, N, A>) => B
```

Added in v1.0.0

## reduceRight

**Signature**

```ts
export declare const reduceRight: <M, N, B, A>(b: A, f: (b: B, a: A) => A) => (fa: Mat<M, N, B>) => A
```

Added in v1.0.0

## reduceRightWithIndex

**Signature**

```ts
export declare const reduceRightWithIndex: <M, N, B, A>(
  b: A,
  f: (i: [number, number], b: B, a: A) => A
) => (fa: Mat<M, N, B>) => A
```

Added in v1.0.0

## reduceWithIndex

**Signature**

```ts
export declare const reduceWithIndex: <M, N, A, B>(
  b: B,
  f: (i: [number, number], b: B, a: A) => B
) => (fa: Mat<M, N, A>) => B
```

Added in v1.0.0

## sequence

**Signature**

```ts
export declare function sequence<F extends URIS4>(
  F: Apl.Applicative4<F>
): <S, R, E, A, M, N>(ta: Mat<M, N, Kind4<F, S, R, E, A>>) => Kind4<F, S, R, E, Mat<M, N, A>>
export declare function sequence<F extends URIS3>(
  F: Apl.Applicative3<F>
): <R, E, A, M, N>(ta: Mat<M, N, Kind3<F, R, E, A>>) => Kind3<F, R, E, Mat<M, N, A>>
export declare function sequence<F extends URIS2>(
  F: Apl.Applicative2<F>
): <E, A, M, N>(ta: Mat<M, N, Kind2<F, E, A>>) => Kind2<F, E, Mat<M, N, A>>
export declare function sequence<F extends URIS>(
  F: Apl.Applicative1<F>
): <A, M, N>(ta: Mat<M, N, Kind<F, A>>) => Kind<F, Mat<M, N, A>>
```

Added in v1.0.0

## traverse

**Signature**

```ts
export declare function traverse<F extends URIS4>(
  F: Apl.Applicative4<F>
): <S, R, E, A, B>(f: (a: A) => Kind4<F, S, R, E, B>) => <M, N>(ta: Mat<M, N, A>) => Kind4<F, S, R, E, Mat<M, N, B>>
export declare function traverse<F extends URIS3>(
  F: Apl.Applicative3<F>
): <R, E, A, B>(f: (a: A) => Kind3<F, R, E, B>) => <M, N>(ta: Mat<M, N, A>) => Kind3<F, R, E, Mat<M, N, B>>
export declare function traverse<F extends URIS2>(
  F: Apl.Applicative2<F>
): <E, A, B>(f: (a: A) => Kind2<F, E, B>) => <M, N>(ta: Mat<M, N, A>) => Kind2<F, E, Mat<M, N, B>>
export declare function traverse<F extends URIS>(
  F: Apl.Applicative1<F>
): <A, B>(f: (a: A) => Kind<F, B>) => <M, N>(ta: Mat<M, N, A>) => Kind<F, Mat<M, N, B>>
```

Added in v1.0.0

## traverseWithIndex

**Signature**

```ts
export declare function traverseWithIndex<F extends URIS4>(
  F: Apl.Applicative4<F>
): <S, R, E, A, B>(
  f: (i: [number, number], a: A) => Kind4<F, S, R, E, B>
) => <M, N>(ta: Mat<M, N, A>) => Kind4<F, S, R, E, Mat<M, N, B>>
export declare function traverseWithIndex<F extends URIS3>(
  F: Apl.Applicative3<F>
): <R, E, A, B>(
  f: (i: [number, number], a: A) => Kind3<F, R, E, B>
) => <M, N>(ta: Mat<M, N, A>) => Kind3<F, R, E, Mat<M, N, B>>
export declare function traverseWithIndex<F extends URIS2>(
  F: Apl.Applicative2<F>
): <E, A, B>(f: (i: [number, number], a: A) => Kind2<F, E, B>) => <M, N>(ta: Mat<M, N, A>) => Kind2<F, E, Mat<M, N, B>>
export declare function traverseWithIndex<F extends URIS>(
  F: Apl.Applicative1<F>
): <A, B>(f: (i: [number, number], a: A) => Kind<F, B>) => <M, N>(ta: Mat<M, N, A>) => Kind<F, Mat<M, N, B>>
```

Added in v1.0.0

# Instances

## Foldable

**Signature**

```ts
export declare const Foldable: Fl.Foldable3<'Mat'>
```

Added in v1.0.0

## FoldableWithIndex

**Signature**

```ts
export declare const FoldableWithIndex: FlI.FoldableWithIndex3<'Mat', [number, number]>
```

Added in v1.0.0

## Functor

**Signature**

```ts
export declare const Functor: Fun.Functor3<'Mat'>
```

Added in v1.0.0

## FunctorWithIndex

**Signature**

```ts
export declare const FunctorWithIndex: FunI.FunctorWithIndex3<'Mat', [number, number]>
```

Added in v1.0.0

## URI

**Signature**

```ts
export declare const URI: 'Mat'
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
) => <M extends number, N extends number>(m: M, n: N) => TC.AbelianGroup<Mat<M, N, A>>
```

Added in v1.0.0

## getBimodule

**Signature**

```ts
export declare const getBimodule: <A>(
  R: Rng.Ring<A>
) => <M extends number, N extends number>(m: M, n: N) => TC.Bimodule<Mat<M, N, A>, A, A>
```

Added in v1.0.0

# Matrix Operations

## get

**Signature**

```ts
export declare const get: (i: number, j: number) => <M, N, A>(m: Mat<M, N, A>) => O.Option<A>
```

Added in v1.0.0

## lift2

**Signature**

```ts
export declare const lift2: <A, B>(f: (x: A, y: A) => B) => <M, N>(x: Mat<M, N, A>, y: Mat<M, N, A>) => Mat<M, N, B>
```

Added in v1.0.0

## linMap

Transform a vector `x` into vector `b` by matrix `A`

```math
Ax = b
```

**Signature**

```ts
export declare const linMap: <R>(R: Rng.Ring<R>) => <M, N>(A: Mat<M, N, R>, x: V.Vec<N, R>) => V.Vec<M, R>
```

Added in v1.0.0

## mul

**Signature**

```ts
export declare const mul: <A>(
  R: Rng.Ring<A>
) => <M extends number, N extends number, P extends number>(x: Mat<M, N, A>, y: Mat<N, P, A>) => Mat<M, P, A>
```

Added in v1.0.0

## switchRows

**Signature**

```ts
export declare const switchRows: (i: number, j: number) => <A, N, M>(vs: Mat<M, N, A>) => O.Option<Mat<M, N, A>>
```

Added in v1.0.0

## trace

**Signature**

```ts
export declare const trace: <A>(R: Rng.Ring<A>) => <M extends number>(fa: Mat<M, M, A>) => A
```

Added in v1.0.0

## transpose

**Signature**

```ts
export declare const transpose: <M extends number, N extends number, A>(v: Mat<M, N, A>) => Mat<N, M, A>
```

Added in v1.0.0

# Model

## Mat (interface)

**Signature**

```ts
export interface Mat<M, N, A> extends V.Vec<M, V.Vec<N, A>> {
  _rows: M
  _cols: N
}
```

Added in v1.0.0
