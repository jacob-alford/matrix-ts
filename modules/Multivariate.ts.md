---
title: Multivariate.ts
nav_order: 11
parent: Modules
---

## Multivariate overview

Useful matrix operations for multivariate samples.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Model](#model)
  - [MultivariateSample (type alias)](#multivariatesample-type-alias)
- [Multivariate Statistics](#multivariate-statistics)
  - [correlation](#correlation)
  - [covariance](#covariance)
  - [deviation](#deviation)
  - [mean](#mean)

---

# Model

## MultivariateSample (type alias)

An observation is a (free) collection of data vectors, where N is the number of
variables associated with the observation

**Signature**

```ts
export type MultivariateSample<N> = RNEA.ReadonlyNonEmptyArray<V.Vec<N, number>>
```

**Example**

```ts
// Given three subjects whose measurements are height, weight, shoe size, we can construct a correlation matrix as follows:

import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import * as V from '@jacob-alford/matrix-ts/Vector'
import * as MStat from '@jacob-alford/matrix-ts/Multivariate'

const obs1 = V.fromTuple([167, 63, 8])
const obs2 = V.fromTuple([200, 94, 12])
const obs3 = V.fromTuple([160, 65, 9])
const observations = RNEA.concat(RNEA.of(obs3))([obs1, obs2])

// This determines how mutually correlated the different variables are
MStat.correlation(observations)
```

Added in v1.0.0

# Multivariate Statistics

## correlation

The correlation matrix where each index: i, j represent the correlation between those
two random variables

**Signature**

```ts
export declare const correlation: <N extends number>(
  s: RNEA.ReadonlyNonEmptyArray<V.Vec<N, number>>
) => M.Mat<N, N, number>
```

Added in v1.0.0

## covariance

The covariance matrix where each index: i, j represent the variance between each random
variable of the Multivariatesample

**Signature**

```ts
export declare const covariance: <N extends number>(
  s: RNEA.ReadonlyNonEmptyArray<V.Vec<N, number>>
) => M.Mat<N, N, number>
```

Added in v1.0.0

## deviation

The difference in observation from a mean of MultivariateSample

**Signature**

```ts
export declare const deviation: <N extends number>(
  s: RNEA.ReadonlyNonEmptyArray<V.Vec<N, number>>
) => RNEA.ReadonlyNonEmptyArray<V.Vec<N, number>>
```

Added in v1.0.0

## mean

The average value over different variables

**Signature**

```ts
export declare const mean: <N extends number>(s: RNEA.ReadonlyNonEmptyArray<V.Vec<N, number>>) => V.Vec<N, number>
```

Added in v1.0.0
