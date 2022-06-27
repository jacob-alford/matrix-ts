---
title: infix.ts
nav_order: 6
parent: Modules
---

## infix overview

A module for making uniform APIs for similar operations across different typeclass
instances. For example, `_(a, "+", b)` could be applied to a rational Field instance,
or a matrix AbelianGroup instance for adding together two fractions or matricies respectively.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Instances](#instances)
  - [getAbGrpInfix](#getabgrpinfix)
  - [getAbGrpPolishInfix](#getabgrppolishinfix)
  - [getAbGrpReversePolishInfix](#getabgrpreversepolishinfix)
  - [getDivisionRingInfix](#getdivisionringinfix)
  - [getDivisionRingPolishInfix](#getdivisionringpolishinfix)
  - [getDivisionRingReversePolishInfix](#getdivisionringreversepolishinfix)
  - [getEqInfix](#geteqinfix)
  - [getEqPolishInfix](#geteqpolishinfix)
  - [getEqReversePolishInfix](#geteqreversepolishinfix)
  - [getEuclideanRingInfix](#geteuclideanringinfix)
  - [getEuclideanRingPolishInfix](#geteuclideanringpolishinfix)
  - [getEuclideanRingReversePolishInfix](#geteuclideanringreversepolishinfix)
  - [getFieldInfix](#getfieldinfix)
  - [getFieldPolishInfix](#getfieldpolishinfix)
  - [getFieldReversePolishInfix](#getfieldreversepolishinfix)
  - [getLeftModuleInfix](#getleftmoduleinfix)
  - [getLeftModulePolishInfix](#getleftmodulepolishinfix)
  - [getLeftModuleReversePolishInfix](#getleftmodulereversepolishinfix)
  - [getMonoidInfix](#getmonoidinfix)
  - [getMonoidPolishInfix](#getmonoidpolishinfix)
  - [getMonoidReversePolishInfix](#getmonoidreversepolishinfix)
  - [getOrdInfix](#getordinfix)
  - [getOrdPolishInfix](#getordpolishinfix)
  - [getOrdReverseInfix](#getordreverseinfix)
  - [getRightModuleInfix](#getrightmoduleinfix)
  - [getRightModulePolishInfix](#getrightmodulepolishinfix)
  - [getRightModuleReversePolishInfix](#getrightmodulereversepolishinfix)
  - [getRingInfix](#getringinfix)
  - [getRingPolishInfix](#getringpolishinfix)
  - [getRingReversePolishInfix](#getringreversepolishinfix)
- [Model](#model)
  - [AbelianGroupSymbol (type alias)](#abeliangroupsymbol-type-alias)
  - [DivisionRingSymbol (type alias)](#divisionringsymbol-type-alias)
  - [EqSymbol (type alias)](#eqsymbol-type-alias)
  - [EuclideanRingSymbol (type alias)](#euclideanringsymbol-type-alias)
  - [FieldSymbol (type alias)](#fieldsymbol-type-alias)
  - [LeftModuleSymbol (type alias)](#leftmodulesymbol-type-alias)
  - [MonoidSymbol (type alias)](#monoidsymbol-type-alias)
  - [OrdSymbol (type alias)](#ordsymbol-type-alias)
  - [RightModuleSymbol (type alias)](#rightmodulesymbol-type-alias)
  - [RingSymbol (type alias)](#ringsymbol-type-alias)
- [utils](#utils)
  - [makeInfix](#makeinfix)
  - [makePolishInfix](#makepolishinfix)
  - [makeReversePolishInfix](#makereversepolishinfix)

---

# Instances

## getAbGrpInfix

**Signature**

```ts
export declare const getAbGrpInfix: <A>(M: TC.AbelianGroup<A>) => (a: A, s: AbelianGroupSymbol, b: A) => A
```

Added in v1.0.0

## getAbGrpPolishInfix

**Signature**

```ts
export declare const getAbGrpPolishInfix: <A>(M: TC.AbelianGroup<A>) => (s: AbelianGroupSymbol, x: A, y: A) => A
```

Added in v1.0.0

## getAbGrpReversePolishInfix

**Signature**

```ts
export declare const getAbGrpReversePolishInfix: <A>(M: TC.AbelianGroup<A>) => (a: A, b: A, s: AbelianGroupSymbol) => A
```

Added in v1.0.0

## getDivisionRingInfix

**Signature**

```ts
export declare const getDivisionRingInfix: <A>(F: TC.DivisionRing<A>) => (a: A, s: DivisionRingSymbol, b: A) => A
```

Added in v1.0.0

## getDivisionRingPolishInfix

**Signature**

```ts
export declare const getDivisionRingPolishInfix: <A>(F: TC.DivisionRing<A>) => (s: DivisionRingSymbol, x: A, y: A) => A
```

Added in v1.0.0

## getDivisionRingReversePolishInfix

**Signature**

```ts
export declare const getDivisionRingReversePolishInfix: <A>(
  F: TC.DivisionRing<A>
) => (a: A, b: A, s: DivisionRingSymbol) => A
```

Added in v1.0.0

## getEqInfix

**Signature**

```ts
export declare const getEqInfix: <A>(E: Eq.Eq<A>) => (a: A, s: EqSymbol, b: A) => boolean
```

Added in v1.0.0

## getEqPolishInfix

**Signature**

```ts
export declare const getEqPolishInfix: <A>(E: Eq.Eq<A>) => (s: EqSymbol, x: A, y: A) => boolean
```

Added in v1.0.0

## getEqReversePolishInfix

**Signature**

```ts
export declare const getEqReversePolishInfix: <A>(E: Eq.Eq<A>) => (a: A, b: A, s: EqSymbol) => boolean
```

Added in v1.0.0

## getEuclideanRingInfix

**Signature**

```ts
export declare const getEuclideanRingInfix: <A>(F: TC.EuclidianRing<A>) => (a: A, s: EuclideanRingSymbol, b: A) => A
```

Added in v1.0.0

## getEuclideanRingPolishInfix

**Signature**

```ts
export declare const getEuclideanRingPolishInfix: <A>(
  F: TC.EuclidianRing<A>
) => (s: EuclideanRingSymbol, x: A, y: A) => A
```

Added in v1.0.0

## getEuclideanRingReversePolishInfix

**Signature**

```ts
export declare const getEuclideanRingReversePolishInfix: <A>(
  F: TC.EuclidianRing<A>
) => (a: A, b: A, s: EuclideanRingSymbol) => A
```

Added in v1.0.0

## getFieldInfix

**Signature**

```ts
export declare const getFieldInfix: <A>(F: Fld.Field<A>) => (a: A, s: FieldSymbol, b: A) => A
```

Added in v1.0.0

## getFieldPolishInfix

**Signature**

```ts
export declare const getFieldPolishInfix: <A>(F: Fld.Field<A>) => (s: FieldSymbol, x: A, y: A) => A
```

Added in v1.0.0

## getFieldReversePolishInfix

**Signature**

```ts
export declare const getFieldReversePolishInfix: <A>(F: Fld.Field<A>) => (a: A, b: A, s: FieldSymbol) => A
```

Added in v1.0.0

## getLeftModuleInfix

**Signature**

```ts
export declare const getLeftModuleInfix: <L, A>(L: TC.LeftModule<A, L>) => (a: L, s: '.*', b: A) => A
```

Added in v1.0.0

## getLeftModulePolishInfix

**Signature**

```ts
export declare const getLeftModulePolishInfix: <L, A>(L: TC.LeftModule<A, L>) => (s: LeftModuleSymbol, l: L, a: A) => A
```

Added in v1.0.0

## getLeftModuleReversePolishInfix

**Signature**

```ts
export declare const getLeftModuleReversePolishInfix: <L, A>(L: TC.LeftModule<A, L>) => (a: L, b: A, s: '.*') => A
```

Added in v1.0.0

## getMonoidInfix

**Signature**

```ts
export declare const getMonoidInfix: <A>(M: Mn.Monoid<A>) => (a: A, s: '<>', b: A) => A
```

Added in v1.0.0

## getMonoidPolishInfix

**Signature**

```ts
export declare const getMonoidPolishInfix: <A>(M: Mn.Monoid<A>) => (s: MonoidSymbol, x: A, y: A) => A
```

Added in v1.0.0

## getMonoidReversePolishInfix

**Signature**

```ts
export declare const getMonoidReversePolishInfix: <A>(M: Mn.Monoid<A>) => (a: A, b: A, s: '<>') => A
```

Added in v1.0.0

## getOrdInfix

**Signature**

```ts
export declare const getOrdInfix: <A>(O: Ord.Ord<A>) => (a: A, s: OrdSymbol, b: A) => boolean
```

Added in v1.0.0

## getOrdPolishInfix

**Signature**

```ts
export declare const getOrdPolishInfix: <A>(O: Ord.Ord<A>) => (s: OrdSymbol, x: A, y: A) => boolean
```

Added in v1.0.0

## getOrdReverseInfix

**Signature**

```ts
export declare const getOrdReverseInfix: <A>(O: Ord.Ord<A>) => (a: A, b: A, s: OrdSymbol) => boolean
```

Added in v1.0.0

## getRightModuleInfix

**Signature**

```ts
export declare const getRightModuleInfix: <L, A>(L: TC.LeftModule<A, L>) => (a: L, s: '.*', b: A) => A
```

Added in v1.0.0

## getRightModulePolishInfix

**Signature**

```ts
export declare const getRightModulePolishInfix: <R, A>(
  L: TC.RightModule<A, R>
) => (s: RightModuleSymbol, a: A, r: R) => A
```

Added in v1.0.0

## getRightModuleReversePolishInfix

**Signature**

```ts
export declare const getRightModuleReversePolishInfix: <R, A>(L: TC.RightModule<A, R>) => (a: A, b: R, s: '*.') => A
```

Added in v1.0.0

## getRingInfix

**Signature**

```ts
export declare const getRingInfix: <A>(F: Rng.Ring<A>) => (a: A, s: RingSymbol, b: A) => A
```

Added in v1.0.0

## getRingPolishInfix

**Signature**

```ts
export declare const getRingPolishInfix: <A>(F: Rng.Ring<A>) => (s: RingSymbol, x: A, y: A) => A
```

Added in v1.0.0

## getRingReversePolishInfix

**Signature**

```ts
export declare const getRingReversePolishInfix: <A>(F: Rng.Ring<A>) => (a: A, b: A, s: RingSymbol) => A
```

Added in v1.0.0

# Model

## AbelianGroupSymbol (type alias)

**Signature**

```ts
export type AbelianGroupSymbol = '+' | '-'
```

Added in v1.0.0

## DivisionRingSymbol (type alias)

**Signature**

```ts
export type DivisionRingSymbol = RingSymbol | '/.' | './'
```

Added in v1.0.0

## EqSymbol (type alias)

**Signature**

```ts
export type EqSymbol = '==' | '!='
```

Added in v1.0.0

## EuclideanRingSymbol (type alias)

**Signature**

```ts
export type EuclideanRingSymbol = RingSymbol | '/'
```

Added in v1.0.0

## FieldSymbol (type alias)

**Signature**

```ts
export type FieldSymbol = EuclideanRingSymbol | '%'
```

Added in v1.0.0

## LeftModuleSymbol (type alias)

**Signature**

```ts
export type LeftModuleSymbol = '.*'
```

Added in v1.0.0

## MonoidSymbol (type alias)

**Signature**

```ts
export type MonoidSymbol = '<>'
```

Added in v1.0.0

## OrdSymbol (type alias)

**Signature**

```ts
export type OrdSymbol = EqSymbol | '<' | '<=' | '>' | '>='
```

Added in v1.0.0

## RightModuleSymbol (type alias)

**Signature**

```ts
export type RightModuleSymbol = '*.'
```

Added in v1.0.0

## RingSymbol (type alias)

**Signature**

```ts
export type RingSymbol = AbelianGroupSymbol | '*'
```

Added in v1.0.0

# utils

## makeInfix

Infix operators can sometimes be more convenient than using the full typeclass instance

**Signature**

```ts
export declare const makeInfix: <S extends string, A, B, C>(
  fns: Readonly<Record<S, (x: A, y: B) => C>>
) => (x: A, s: S, y: B) => C
```

**Example**

```ts
import { makeInfix } from 'matrix-ts/infix'
import * as H from 'matrix-ts/quaternion'

type QuatSymbol = '+' | '-' | '*' | '/'

const _ = makeInfix<QuatSymbol, H.Quaternion, H.Quaternion, H.Quaternion>({
  '+': H.DivisionRing.add,
  '-': H.DivisionRing.sub,
  '*': H.DivisionRing.mul,
  '/': (x, y) => H.DivisionRing.mul(x, H.DivisionRing.recip(y)),
})

_(H.zero, '+', H.zero)
```

Added in v1.0.0

## makePolishInfix

Infix operators can sometimes be more convenient than using the full typeclass instance

**Signature**

```ts
export declare const makePolishInfix: <S extends string, A, B, C>(
  fns: Readonly<Record<S, (x: A, y: B) => C>>
) => (s: S, x: A, y: B) => C
```

**Example**

```ts
import { makePolishInfix } from 'matrix-ts/infix'
import * as H from 'matrix-ts/quaternion'

type QuatSymbol = '+' | '-' | '*' | '/'

const _ = makePolishInfix<QuatSymbol, H.Quaternion, H.Quaternion, H.Quaternion>({
  '+': H.DivisionRing.add,
  '-': H.DivisionRing.sub,
  '*': H.DivisionRing.mul,
  '/': (x, y) => H.DivisionRing.mul(x, H.DivisionRing.recip(y)),
})

_('+', H.zero, H.zero)
```

Added in v1.0.0

## makeReversePolishInfix

Infix operators can sometimes be more convenient than using the full typeclass instance

**Signature**

```ts
export declare const makeReversePolishInfix: <S extends string, A, B, C>(
  fns: Readonly<Record<S, (x: A, y: B) => C>>
) => (x: A, y: B, s: S) => C
```

**Example**

```ts
import { makeReversePolishInfix } from 'matrix-ts/infix'
import * as H from 'matrix-ts/quaternion'

type QuatSymbol = '+' | '-' | '*' | '/'

const _ = makeReversePolishInfix<QuatSymbol, H.Quaternion, H.Quaternion, H.Quaternion>({
  '+': H.DivisionRing.add,
  '-': H.DivisionRing.sub,
  '*': H.DivisionRing.mul,
  '/': (x, y) => H.DivisionRing.mul(x, H.DivisionRing.recip(y)),
})

_(H.zero, H.zero, '+')
```

Added in v1.0.0
