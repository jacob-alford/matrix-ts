---
title: integer.ts
nav_order: 7
parent: Modules
---

## integer overview

An integral data type without a decimal. Partially borrowed from Purescript.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Aliases](#aliases)
  - [add](#add)
  - [degree](#degree)
  - [div](#div)
  - [mod](#mod)
  - [mul](#mul)
  - [sub](#sub)
- [Constructors](#constructors)
  - [fromNumber](#fromnumber)
  - [one](#one)
  - [randInt](#randint)
  - [zero](#zero)
- [Destructors](#destructors)
  - [toNumber](#tonumber)
- [Infix](#infix)
  - [$\_](#_)
  - [\_](#_)
  - [\_$](#_)
- [Instances](#instances)
  - [AdditiveAbGrpMN](#additiveabgrpmn)
  - [AdditiveAbGrpN](#additiveabgrpn)
  - [BiModMN](#bimodmn)
  - [BiModN](#bimodn)
  - [Bounded](#bounded)
  - [Eq](#eq)
  - [EuclideanRing](#euclideanring)
  - [MagmaSub](#magmasub)
  - [MonoidProduct](#monoidproduct)
  - [MonoidSum](#monoidsum)
  - [Ord](#ord)
  - [PolynomialAdditiveAbelianGroup](#polynomialadditiveabeliangroup)
  - [PolynomialBimodule](#polynomialbimodule)
  - [PolynomialEuclidianRing](#polynomialeuclidianring)
  - [PolynomialRing](#polynomialring)
  - [SemigroupProduct](#semigroupproduct)
  - [SemigroupSum](#semigroupsum)
  - [Show](#show)
- [Integer Ops](#integer-ops)
  - [abs](#abs)
- [Isomorphisms](#isomorphisms)
  - [isoNumber](#isonumber)
- [Model](#model)
  - [Int (type alias)](#int-type-alias)
  - [Mat (type alias)](#mat-type-alias)
  - [Vec (type alias)](#vec-type-alias)

---

# Aliases

## add

**Signature**

```ts
export declare const add: (x: Int, y: Int) => Int
```

Added in v1.0.0

## degree

**Signature**

```ts
export declare const degree: (a: Int) => number
```

Added in v1.0.0

## div

**Signature**

```ts
export declare const div: (x: Int, y: Int) => Int
```

Added in v1.0.0

## mod

**Signature**

```ts
export declare const mod: (x: Int, y: Int) => Int
```

Added in v1.0.0

## mul

**Signature**

```ts
export declare const mul: (x: Int, y: Int) => Int
```

Added in v1.0.0

## sub

**Signature**

```ts
export declare const sub: (x: Int, y: Int) => Int
```

Added in v1.0.0

# Constructors

## fromNumber

**Signature**

```ts
export declare const fromNumber: (n: number) => Int
```

Added in v1.0.0

## one

**Signature**

```ts
export declare const one: Int
```

Added in v1.0.0

## randInt

**Signature**

```ts
export declare const randInt: (min: number, max: number) => IO.IO<Int>
```

Added in v1.0.0

## zero

**Signature**

```ts
export declare const zero: Int
```

Added in v1.0.0

# Destructors

## toNumber

**Signature**

```ts
export declare const toNumber: (x: Int) => number
```

Added in v1.0.0

# Infix

## $\_

**Signature**

```ts
export declare const $_: (s: Inf.EuclideanRingSymbol, x: Int, y: Int) => Int
```

Added in v1.0.0

## \_

**Signature**

```ts
export declare const _: (a: Int, s: Inf.EuclideanRingSymbol, b: Int) => Int
```

Added in v1.0.0

## \_$

**Signature**

```ts
export declare const _$: (a: Int, b: Int, s: Inf.EuclideanRingSymbol) => Int
```

Added in v1.0.0

# Instances

## AdditiveAbGrpMN

**Signature**

```ts
export declare const AdditiveAbGrpMN: <M, N>(m: M, n: N) => TC.AbelianGroup<M.Mat<M, N, Int>>
```

Added in v1.0.0

## AdditiveAbGrpN

**Signature**

```ts
export declare const AdditiveAbGrpN: <N>(n: N) => TC.AbelianGroup<V.Vec<N, Int>>
```

Added in v1.0.0

## BiModMN

**Signature**

```ts
export declare const BiModMN: <M, N>(m: M, n: N) => TC.Bimodule<M.Mat<M, N, Int>, Int, Int>
```

Added in v1.0.0

## BiModN

**Signature**

```ts
export declare const BiModN: <N>(n: N) => TC.Bimodule<V.Vec<N, Int>, Int, Int>
```

Added in v1.0.0

## Bounded

**Signature**

```ts
export declare const Bounded: Bnd.Bounded<Int>
```

Added in v1.0.0

## Eq

**Signature**

```ts
export declare const Eq: Eq_.Eq<Int>
```

Added in v1.0.0

## EuclideanRing

Adapted from Purescript:
https://github.com/purescript/purescript-prelude/blob/v6.0.0/src/Data/EuclideanRing.js

**Signature**

```ts
export declare const EuclideanRing: TC.EuclidianRing<Int>
```

Added in v1.0.0

## MagmaSub

**Signature**

```ts
export declare const MagmaSub: Mg.Magma<Int>
```

Added in v1.0.0

## MonoidProduct

**Signature**

```ts
export declare const MonoidProduct: Mn.Monoid<Int>
```

Added in v1.0.0

## MonoidSum

**Signature**

```ts
export declare const MonoidSum: Mn.Monoid<Int>
```

Added in v1.0.0

## Ord

**Signature**

```ts
export declare const Ord: Ord_.Ord<Int>
```

Added in v1.0.0

## PolynomialAdditiveAbelianGroup

**Signature**

```ts
export declare const PolynomialAdditiveAbelianGroup: TC.AbelianGroup<Poly.Polynomial<Int>>
```

Added in v1.0.0

## PolynomialBimodule

**Signature**

```ts
export declare const PolynomialBimodule: TC.Bimodule<Poly.Polynomial<Int>, Int, Int>
```

Added in v1.0.0

## PolynomialEuclidianRing

**Signature**

```ts
export declare const PolynomialEuclidianRing: TC.EuclidianRing<Poly.Polynomial<Int>>
```

Added in v1.0.0

## PolynomialRing

**Signature**

```ts
export declare const PolynomialRing: TC.CommutativeRing<Poly.Polynomial<Int>>
```

Added in v1.0.0

## SemigroupProduct

**Signature**

```ts
export declare const SemigroupProduct: Sg.Semigroup<Int>
```

Added in v1.0.0

## SemigroupSum

**Signature**

```ts
export declare const SemigroupSum: Sg.Semigroup<Int>
```

Added in v1.0.0

## Show

**Signature**

```ts
export declare const Show: Sh.Show<Int>
```

Added in v1.0.0

# Integer Ops

## abs

**Signature**

```ts
export declare const abs: (a: Int) => Int
```

Added in v1.0.0

# Isomorphisms

## isoNumber

**Signature**

```ts
export declare const isoNumber: Iso.Iso<Int, number>
```

Added in v1.0.0

# Model

## Int (type alias)

**Signature**

```ts
export type Int = number & {
  readonly _URI: IntegerSymbol
}
```

Added in v1.0.0

## Mat (type alias)

**Signature**

```ts
export type Mat<M, N> = M.Mat<M, N, Int>
```

Added in v1.0.0

## Vec (type alias)

**Signature**

```ts
export type Vec<N> = V.Vec<N, Int>
```

Added in v1.0.0
