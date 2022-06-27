---
title: Polynomial.ts
nav_order: 13
parent: Modules
---

## Polynomial overview

Adapted from:
https://pursuit.purescript.org/packages/purescript-polynomials/1.0.1/docs/Data.Polynomial#t:Polynomial

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Constructors](#constructors)
  - [fromCoefficientArray](#fromcoefficientarray)
  - [one](#one)
  - [randPolynomial](#randpolynomial)
  - [zero](#zero)
- [Destructors](#destructors)
  - [coefficients](#coefficients)
- [Instance Operations](#instance-operations)
  - [add](#add)
  - [mul](#mul)
  - [sub](#sub)
- [Instance operations](#instance-operations)
  - [map](#map)
  - [mapWithIndex](#mapwithindex)
- [Instances](#instances)
  - [Functor](#functor)
  - [FunctorWithIndex](#functorwithindex)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
  - [getAdditiveAbelianGroup](#getadditiveabeliangroup)
  - [getBimodule](#getbimodule)
  - [getCommutativeRing](#getcommutativering)
  - [getCompositionMonoid](#getcompositionmonoid)
  - [getCompositionSemigroup](#getcompositionsemigroup)
  - [getEuclidianRing](#geteuclidianring)
  - [getPolynomialEq](#getpolynomialeq)
  - [getPolynomialOrd](#getpolynomialord)
  - [getShow](#getshow)
- [Internal](#internal)
  - [shiftBy](#shiftby)
- [Model](#model)
  - [Polynomial (interface)](#polynomial-interface)
- [Polynomial Operations](#polynomial-operations)
  - [antiderivative](#antiderivative)
  - [constant](#constant)
  - [derivative](#derivative)
  - [evaluate](#evaluate)
  - [identity](#identity)
  - [integrate](#integrate)
  - [l2InnerProduct](#l2innerproduct)
  - [norm](#norm)
  - [polynomialCompose](#polynomialcompose)
  - [polynomialDegree](#polynomialdegree)
  - [projection](#projection)
- [Utilities](#utilities)
  - [preservingZipWith](#preservingzipwith)

---

# Constructors

## fromCoefficientArray

**Signature**

```ts
export declare const fromCoefficientArray: <R>(Eq: Eq.Eq<R>, R: Rng.Ring<R>) => (rs: readonly R[]) => Polynomial<R>
```

Added in v1.0.0

## one

**Signature**

```ts
export declare const one: <R>(R: Rng.Ring<R>) => Polynomial<R>
```

Added in v1.0.0

## randPolynomial

**Signature**

```ts
export declare const randPolynomial: <R>(terms: number, make: IO.IO<R>) => IO.IO<Polynomial<R>>
```

Added in v1.0.0

## zero

**Signature**

```ts
export declare const zero: <R>() => Polynomial<R>
```

Added in v1.0.0

# Destructors

## coefficients

**Signature**

```ts
export declare const coefficients: <R>(p: Polynomial<R>) => readonly R[]
```

Added in v1.0.0

# Instance Operations

## add

**Signature**

```ts
export declare const add: <R>(Eq: Eq.Eq<R>, R: Rng.Ring<R>) => (x: Polynomial<R>, y: Polynomial<R>) => Polynomial<R>
```

Added in v1.0.0

## mul

**Signature**

```ts
export declare const mul: <R>(Eq: Eq.Eq<R>, R: Rng.Ring<R>) => (xs: Polynomial<R>, ys: Polynomial<R>) => Polynomial<R>
```

Added in v1.0.0

## sub

**Signature**

```ts
export declare const sub: <R>(Eq: Eq.Eq<R>, R: Rng.Ring<R>) => (x: Polynomial<R>, y: Polynomial<R>) => Polynomial<R>
```

Added in v1.0.0

# Instance operations

## map

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => (fa: Polynomial<A>) => Polynomial<B>
```

Added in v1.0.0

## mapWithIndex

**Signature**

```ts
export declare const mapWithIndex: <A, B>(f: (i: number, a: A) => B) => (fa: Polynomial<A>) => Polynomial<B>
```

Added in v1.0.0

# Instances

## Functor

**Signature**

```ts
export declare const Functor: Fun.Functor1<'Polynomial'>
```

Added in v1.0.0

## FunctorWithIndex

**Signature**

```ts
export declare const FunctorWithIndex: FunI.FunctorWithIndex1<'Polynomial', number>
```

Added in v1.0.0

## URI

**Signature**

```ts
export declare const URI: 'Polynomial'
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
export declare const getAdditiveAbelianGroup: <R>(Eq: Eq.Eq<R>, R: Rng.Ring<R>) => TC.AbelianGroup<Polynomial<R>>
```

Added in v1.0.0

## getBimodule

**Signature**

```ts
export declare const getBimodule: <R>(E: Eq.Eq<R>, R: Rng.Ring<R>) => TC.Bimodule<Polynomial<R>, R, R>
```

Added in v1.0.0

## getCommutativeRing

**Signature**

```ts
export declare const getCommutativeRing: <R>(E: Eq.Eq<R>, R: Rng.Ring<R>) => TC.CommutativeRing<Polynomial<R>>
```

Added in v1.0.0

## getCompositionMonoid

**Signature**

```ts
export declare const getCompositionMonoid: <R>(Eq_: Eq.Eq<R>, R: Rng.Ring<R>) => Monoid<Polynomial<R>>
```

Added in v1.0.0

## getCompositionSemigroup

**Signature**

```ts
export declare const getCompositionSemigroup: <R>(Eq_: Eq.Eq<R>, R: Rng.Ring<R>) => Semigroup<Polynomial<R>>
```

Added in v1.0.0

## getEuclidianRing

**Signature**

```ts
export declare const getEuclidianRing: <F>(E: Eq.Eq<F>, F: Fld.Field<F>) => TC.EuclidianRing<Polynomial<F>>
```

Added in v1.0.0

## getPolynomialEq

**Signature**

```ts
export declare const getPolynomialEq: <R>(Eq: Eq.Eq<R>) => Eq.Eq<Polynomial<R>>
```

Added in v1.0.0

## getPolynomialOrd

**Signature**

```ts
export declare const getPolynomialOrd: <R>(Eq: Ord.Ord<R>) => Ord.Ord<Polynomial<R>>
```

Added in v1.0.0

## getShow

**Signature**

```ts
export declare const getShow: (
  variable: string
) => <A>(S: Show<A>, isZero: (a: A) => boolean, isOne: (a: A) => boolean) => Show<Polynomial<A>>
```

Added in v1.0.0

# Internal

## shiftBy

**Signature**

```ts
export declare const shiftBy: <R>(n: number, r: R) => (p: readonly R[]) => readonly R[]
```

Added in v1.0.0

# Model

## Polynomial (interface)

**Signature**

```ts
export interface Polynomial<R> extends ReadonlyArray<R> {
  _URI: PolynomialSymbol
}
```

Added in v1.0.0

# Polynomial Operations

## antiderivative

**Signature**

```ts
export declare const antiderivative: <R>(
  constantTerm: R,
  scaleLeft: (n: number, r: R) => R
) => (p: Polynomial<R>) => Polynomial<R>
```

Added in v1.0.0

## constant

**Signature**

```ts
export declare const constant: <R>(Eq: Eq.Eq<R>, R: Rng.Ring<R>) => (a: R) => Polynomial<R>
```

Added in v1.0.0

## derivative

**Signature**

```ts
export declare const derivative: <R>(scaleLeft: (n: number, r: R) => R) => (coeffs: Polynomial<R>) => Polynomial<R>
```

Added in v1.0.0

## evaluate

**Signature**

```ts
export declare const evaluate: <R>(R: Rng.Ring<R>) => (p: Polynomial<R>) => (x: R) => R
```

Added in v1.0.0

## identity

**Signature**

```ts
export declare const identity: <R>(R: Rng.Ring<R>) => Polynomial<R>
```

Added in v1.0.0

## integrate

**Signature**

```ts
export declare const integrate: <R>(
  R: Rng.Ring<R>,
  scaleLeft: (n: number, r: R) => R
) => (lower: R, upper: R) => (p: Polynomial<R>) => R
```

Added in v1.0.0

## l2InnerProduct

**Signature**

```ts
export declare const l2InnerProduct: <R extends number | Complex>(
  Eq_: Eq.Eq<R>,
  R: Rng.Ring<R>,
  scaleLeft: (n: number, r: R) => R,
  conj: (r: R) => R
) => (p: Polynomial<R>, q: Polynomial<R>) => R
```

Added in v1.0.0

## norm

**Signature**

```ts
export declare const norm: <R extends number | Complex>(
  Eq_: Eq.Eq<R>,
  R: Rng.Ring<R>,
  scaleLeft: (n: number, r: R) => R,
  sqrt: (r: R) => R,
  conj: (r: R) => R
) => (p: Polynomial<R>) => R
```

Added in v1.0.0

## polynomialCompose

**Signature**

```ts
export declare const polynomialCompose: <R>(
  Eq: Eq.Eq<R>,
  R: Rng.Ring<R>
) => (x: Polynomial<R>) => (y: Polynomial<R>) => Polynomial<R>
```

Added in v1.0.0

## polynomialDegree

**Signature**

```ts
export declare const polynomialDegree: <R>(p: Polynomial<R>) => number
```

Added in v1.0.0

## projection

**Signature**

```ts
export declare const projection: <R extends number | Complex>(
  Eq_: Eq.Eq<R>,
  F: Fld.Field<R>,
  scaleLeft: (n: number, r: R) => R,
  conj: (r: R) => R
) => (p: Polynomial<R>, q: Polynomial<R>) => Polynomial<R>
```

Added in v1.0.0

# Utilities

## preservingZipWith

**Signature**

```ts
export declare const preservingZipWith: <R, S>(
  f: (x: R, y: R) => S,
  def: R
) => (xs: readonly R[], ys: readonly R[]) => readonly S[]
```

Added in v1.0.0
