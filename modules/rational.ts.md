---
title: rational.ts
nav_order: 15
parent: Modules
---

## rational overview

A fractional number type with typeclass instances. **Note:** this data type shouldn't
be used for computations involving large numbers, because the lawfulness of these
particular instances breaks down due to floating point error quicker than the others by
the nature of reducing fractional values

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Aliases](#aliases)
  - [add](#add)
  - [div](#div)
  - [mul](#mul)
  - [sub](#sub)
- [Constructors](#constructors)
  - [fromInt](#fromint)
  - [of](#of)
  - [one](#one)
  - [randRational](#randrational)
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
  - [Field](#field)
  - [MagmaSub](#magmasub)
  - [MonoidProduct](#monoidproduct)
  - [MonoidSum](#monoidsum)
  - [Ord](#ord)
  - [SemigroupProduct](#semigroupproduct)
  - [SemigroupSum](#semigroupsum)
  - [Show](#show)
- [Model](#model)
  - [Mat (type alias)](#mat-type-alias)
  - [Rational (interface)](#rational-interface)
  - [Vec (type alias)](#vec-type-alias)
- [Rational Ops](#rational-ops)
  - [abs](#abs)

---

# Aliases

## add

**Signature**

```ts
export declare const add: (x: Rational, y: Rational) => Rational
```

Added in v1.0.0

## div

**Signature**

```ts
export declare const div: (x: Rational, y: Rational) => Rational
```

Added in v1.0.0

## mul

**Signature**

```ts
export declare const mul: (x: Rational, y: Rational) => Rational
```

Added in v1.0.0

## sub

**Signature**

```ts
export declare const sub: (x: Rational, y: Rational) => Rational
```

Added in v1.0.0

# Constructors

## fromInt

**Signature**

```ts
export declare const fromInt: (top: Int.Int) => Rational
```

Added in v1.0.0

## of

**Signature**

```ts
export declare const of: (top: Int.Int, bottom: Int.Int) => O.Option<Rational>
```

Added in v1.0.0

## one

**Signature**

```ts
export declare const one: Rational
```

Added in v1.0.0

## randRational

**Signature**

```ts
export declare const randRational: (low: number, high: number) => IO.IO<Rational>
```

Added in v1.0.0

## zero

**Signature**

```ts
export declare const zero: Rational
```

Added in v1.0.0

# Destructors

## toNumber

**Signature**

```ts
export declare const toNumber: (r: Rational) => number
```

Added in v1.0.0

# Infix

## $\_

**Signature**

```ts
export declare const $_: (s: Inf.FieldSymbol, x: Rational, y: Rational) => Rational
```

Added in v1.0.0

## \_

**Signature**

```ts
export declare const _: (a: Rational, s: Inf.FieldSymbol, b: Rational) => Rational
```

Added in v1.0.0

## \_$

**Signature**

```ts
export declare const _$: (a: Rational, b: Rational, s: Inf.FieldSymbol) => Rational
```

Added in v1.0.0

# Instances

## AdditiveAbGrpMN

**Signature**

```ts
export declare const AdditiveAbGrpMN: <M, N>(m: M, n: N) => AbelianGroup<M.Mat<M, N, Rational>>
```

Added in v1.0.0

## AdditiveAbGrpN

**Signature**

```ts
export declare const AdditiveAbGrpN: <N>(n: N) => AbelianGroup<V.Vec<N, Rational>>
```

Added in v1.0.0

## BiModMN

**Signature**

```ts
export declare const BiModMN: <M, N>(m: M, n: N) => Bimodule<M.Mat<M, N, Rational>, Rational, Rational>
```

Added in v1.0.0

## BiModN

**Signature**

```ts
export declare const BiModN: <N>(n: N) => Bimodule<V.Vec<N, Rational>, Rational, Rational>
```

Added in v1.0.0

## Bounded

**Signature**

```ts
export declare const Bounded: Bnd.Bounded<Rational>
```

Added in v1.0.0

## Eq

**Signature**

```ts
export declare const Eq: Eq_.Eq<Rational>
```

Added in v1.0.0

## Field

Adapted from Purescript:
https://github.com/purescript/purescript-prelude/blob/v6.0.0/src/Data/EuclideanRing.js

**Signature**

```ts
export declare const Field: Fld.Field<Rational>
```

Added in v1.0.0

## MagmaSub

**Signature**

```ts
export declare const MagmaSub: Mg.Magma<Rational>
```

Added in v1.0.0

## MonoidProduct

**Signature**

```ts
export declare const MonoidProduct: Mn.Monoid<Rational>
```

Added in v1.0.0

## MonoidSum

**Signature**

```ts
export declare const MonoidSum: Mn.Monoid<Rational>
```

Added in v1.0.0

## Ord

**Signature**

```ts
export declare const Ord: Ord_.Ord<Rational>
```

Added in v1.0.0

## SemigroupProduct

**Signature**

```ts
export declare const SemigroupProduct: Sg.Semigroup<Rational>
```

Added in v1.0.0

## SemigroupSum

**Signature**

```ts
export declare const SemigroupSum: Sg.Semigroup<Rational>
```

Added in v1.0.0

## Show

**Signature**

```ts
export declare const Show: Sh.Show<Rational>
```

Added in v1.0.0

# Model

## Mat (type alias)

**Signature**

```ts
export type Mat<M, N> = M.Mat<M, N, Rational>
```

Added in v1.0.0

## Rational (interface)

**Signature**

```ts
export interface Rational {
  readonly _URI: RationalSymbol
  readonly top: Int.Int
  readonly bottom: Int.Int
}
```

Added in v1.0.0

## Vec (type alias)

**Signature**

```ts
export type Vec<N> = V.Vec<N, Rational>
```

Added in v1.0.0

# Rational Ops

## abs

**Signature**

```ts
export declare const abs: (a: Rational) => Rational
```

Added in v1.0.0
