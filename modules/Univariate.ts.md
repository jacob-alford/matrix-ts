---
title: Univariate.ts
nav_order: 17
parent: Modules
---

## Univariate overview

A random sampling of data in one and two dimensions with associated statistical tools.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Model](#model)
  - [BivariateSample (type alias)](#bivariatesample-type-alias)
  - [Sample (type alias)](#sample-type-alias)
- [Statistics](#statistics)
  - [correlation](#correlation)
  - [covariance](#covariance)
  - [deviation](#deviation)
  - [mean](#mean)
  - [variance](#variance)

---

# Model

## BivariateSample (type alias)

A bivariate sample is a (free) sampling of two variables

**Signature**

```ts
export type BivariateSample = RNEA.ReadonlyNonEmptyArray<readonly [number, number]>
```

Added in v1.0.0

## Sample (type alias)

A sample is a univariate collection of data

**Signature**

```ts
export type Sample = RNEA.ReadonlyNonEmptyArray<number>
```

Added in v1.0.0

# Statistics

## correlation

The correlation matrix where each index: i, j represent the correlation between those
two random variables

**Signature**

```ts
export declare const correlation: (ab: BivariateSample) => number
```

Added in v1.0.0

## covariance

The covariance of a bivariate sample, is the mutual variance between the two random variables

**Signature**

```ts
export declare const covariance: (ab: BivariateSample) => number
```

Added in v1.0.0

## deviation

The difference in observation from a mean of Sample

**Signature**

```ts
export declare const deviation: (s: Sample) => Sample
```

Added in v1.0.0

## mean

The average value over different variables

**Signature**

```ts
export declare const mean: (s: Sample) => number
```

Added in v1.0.0

## variance

The variance of a univariate sample

**Signature**

```ts
export declare const variance: (ab: Sample) => number
```

Added in v1.0.0
