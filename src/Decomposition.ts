/**
 * Decompose matricies into various forms, such as `LUP`. Can be used in various
 * applications like solving a system of equations, or calculating the principle
 * components of a multivariate distribution (SVD)
 *
 * @since 1.0.0
 */
import * as A from 'fp-ts/Array'
import * as O from 'fp-ts/Option'
import * as ChnR from 'fp-ts/ChainRec'
import * as IO from 'fp-ts/IO'
import * as E from 'fp-ts/Either'
import * as RA from 'fp-ts/ReadonlyArray'
import * as Mn from 'fp-ts/Monoid'
import { identity, tuple, pipe, unsafeCoerce } from 'fp-ts/function'

import * as M from './Matrix'
import * as MatTypes from './MatrixTypes'
import * as N from './number'
import * as V from './Vector'
import * as C from './Computation'

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export interface Decomposition<M, R, A> {
  input: M.Mat<M, M, R>
  result: A
}

/**
 * Represents the result of a computation that can solve:
 *
 * ```math
 * Ax = b
 * ```
 *
 * @since 1.0.4
 * @category Model
 */
export interface Solvable<M, R> {
  solve: (b: V.Vec<M, R>) => V.Vec<M, R>
}

/**
 * Represents the result of a computation that can be used to calculate the determinant
 *
 * @since 1.0.4
 * @category Model
 */
export interface Determinant {
  det: IO.IO<number>
}

/**
 * Represents a solution to an overdetermined system
 *
 * @since 1.1.0
 * @category Model
 */
export interface LeastSquares<N, R> {
  solve: (b: V.Vec<N, R>) => V.Vec<N, R>
}

// ####################
// ### Constructors ###
// ####################

/**
 * Decomposition of a square matrix into a lower triangular matrix L and an upper
 * triangular matrix U, with a permutation matrix P, such that:
 *
 * ```math
 * PA = LU
 * ```
 *
 * @since 1.0.0
 * @category Constructors
 */
export const LUP = <M extends number>(
  m: M.Mat<M, M, number>
): C.Computation<
  string,
  Decomposition<
    M,
    number,
    [
      MatTypes.LowerTriangularMatrix<M, number>,
      MatTypes.UpperTriangularMatrix<M, number>,
      MatTypes.OrthogonalMatrix<M, number>
    ]
  > &
    Solvable<M, number> &
    Determinant
> => {
  type ComputationParams = {
    LU: M.Mat<M, M, number>
    P: M.Mat<M, M, number>
    numPivots: number
    i: number
  }

  type Computation = C.Computation<string, ComputationParams>

  const [, columns] = M.shape(m)

  const go = (computation: Computation): E.Either<Computation, Computation> => {
    const [result] = computation

    /*
     * Base case: computation has failed in prior iterations
     * -----------------------------------------------------
     */
    if (E.isLeft(result)) {
      return E.right(pipe(computation, C.log('[1] Failed to decompose matrix')))
    }

    /*
     * Base case: Matrix reduction is complete
     * ---------------------------------------
     */
    if (result.right.i >= columns) {
      return E.right(pipe(computation, C.log('[0] Successfully decomposed matrix')))
    }

    return pipe(
      computation,
      C.bindTo('acc'),
      /*
       * Find pivot index
       * ----------------
       */
      C.bindW('maxI', ({ acc: { i, LU } }) => C.of(getMaxI(i, LU))),
      /*
       * Pivot A
       * -------
       */
      C.bindW('pivoted', ({ acc: { LU, i }, maxI }) =>
        pipe(
          O.isSome(maxI) ? pipe(LU, M.switchRows(i, maxI.value[1])) : O.some(LU),
          C.fromOption(() => '[01] Unreachable: index not found')
        )
      ),
      /*
       * Pivot P
       * -------
       */
      C.bind('P', ({ acc: { i, P }, maxI }) =>
        pipe(
          O.isSome(maxI) ? pipe(P, M.switchRows(i, maxI.value[1])) : O.some(P),
          C.fromOption(() => '[02] Unreachable: index not found')
        )
      ),
      C.bindW('numPivots', ({ acc: { numPivots }, maxI }) =>
        O.isSome(maxI) ? C.of(numPivots + 1) : C.of(numPivots)
      ),
      C.logOption(({ maxI, acc: { i } }) =>
        pipe(
          maxI,
          O.map(maxI => `Swapped ${i} and ${maxI[1]}, with max value: ${maxI[0]}`)
        )
      ),
      /*
       * Calculate multipliers, find next iteration of LU
       * ------------------------------------------------
       */
      C.bind('LU', ({ acc: { i }, pivoted }) =>
        pipe(
          subAndScale(i, pivoted),
          C.fromOption(() => '[10] Matrix is singular')
        )
      ),
      C.map(
        ({ LU, acc: { i }, P, numPivots }): ComputationParams => ({
          LU,
          i: i + 1,
          P,
          numPivots,
        })
      ),
      E.left
    )
  }

  const Id = pipe(
    m,
    M.mapWithIndex(([i, j]) => (i === j ? 1 : 0))
  )

  return pipe(
    ChnR.tailRec(C.of({ LU: m, i: 0, P: Id, numPivots: 0 }), go),
    C.map(({ LU, P, numPivots }) => {
      const [L, U] = MatTypes.fromMatrix(N.Field)(LU)
      return {
        input: m,
        result: tuple(L, U, unsafeCoerce(P)),
        solve: b => backSub(U, forwardSub(L, N.linMap(P, b))),
        det: () =>
          (numPivots % 2 === 0 ? 1 : -1) *
          pipe(U, MatTypes.extractDiagonal(0), MatTypes.diagonalFoldMap(N.MonoidProduct)),
      }
    })
  )
}

/**
 * @since 1.0.0
 * @category Constructors
 */
export const QR = <N extends number>(
  m: M.Mat<N, N, number>
): C.Computation<
  string,
  Decomposition<
    N,
    number,
    [MatTypes.OrthogonalMatrix<N, number>, MatTypes.UpperTriangularMatrix<N, number>]
  >
> => {
  type ComputationParams = {
    k: number
    A: M.Mat<N, N, number>
  }

  type Computation = C.Computation<string, ComputationParams>

  const [, columns] = M.shape(m)

  /** Here, P is a free constraint that represents N - 1 */
  const go = <P extends number>(
    computation: Computation
  ): E.Either<Computation, Computation> => {
    const [result] = computation

    /*
     * Base case: computation has failed in prior iterations
     * -----------------------------------------------------
     */
    if (E.isLeft(result)) {
      return E.right(pipe(computation, C.log('[1] Failed to decompose matrix')))
    }

    /*
     * Base case: Matrix reduction is complete
     * ---------------------------------------
     */
    if (result.right.k >= columns) {
      return E.right(pipe(computation, C.log('[0] Successfully decomposed matrix')))
    }

    return pipe(
      computation,
      C.bindTo('acc'),
      C.bind('xi', ({ acc: { A, k } }) =>
        pipe(
          getSubColumnToEnd(k, k + 1)<P, N, N, number>(A),
          O.map(orthogonalize),
          C.fromOption(() => '[01] Unreachable: index not found')
        )
      ),
      C.bind('B', ({ acc: { A, k }, xi: [, γ, uk] }) =>
        pipe(
          A,
          getSubMatrixToEnd<P, P>(k + 1, k + 1),
          O.map(reflect([γ, uk])),
          C.fromOption(() => '[02] Unreachable: index not found')
        )
      ),
      C.bind('nextA', ({ acc: { A, k }, xi: [τ, , uk], B }) =>
        pipe(
          A,
          replaceSubMatrix(k + 1, k + 1, B),
          O.chain(replaceSubColumn<P, number>(k, k, uk)),
          O.chain(M.updateAt(k, k, -τ)),
          C.fromOption(() => '[03] Unreachable: index not found')
        )
      ),
      C.map(({ nextA, acc: { k } }) => ({ A: nextA, k: k + 1 })),
      E.left
    )
  }

  return pipe(
    ChnR.tailRec<Computation, Computation>(C.of({ k: 0, A: m }), acc => go<N>(acc)),
    C.map(({ A }) => ({
      input: m,
      result: getQR(A),
    }))
  )
}

// ###########
// ### LUP ###
// ###########

/**
 * See: Fundamentals of Matrix Computation, David S. Watkins, page 26
 *
 * @since 1.0.0
 * @category Internal
 */
const forwardSub: <M>(
  L: MatTypes.LowerTriangularMatrix<M, number>,
  b: V.Vec<M, number>
) => V.Vec<M, number> = (L, b) => {
  const _: <A>(xs: ReadonlyArray<A>, i: number) => A = (xs, i) => unsafeCoerce(xs[i])
  const n = b.length
  const y: Array<number> = []
  for (let i = 0; i < n; ++i) {
    y[i] = _(b, i)
    for (let j = 0; j < i; ++j) {
      y[i] = _(y, i) - _(_(L, i), j) * _(y, j)
    }
    y[i] = _(y, i) / _(_(L, i), i)
  }
  return unsafeCoerce(y)
}

/**
 * See: Fundamentals of Matrix Computation, David S. Watkins, page 30
 *
 * @since 1.0.0
 * @category Internal
 */
const backSub = <M extends number>(
  U: MatTypes.UpperTriangularMatrix<M, number>,
  y: V.Vec<M, number>
): V.Vec<M, number> => {
  const _: <A>(xs: ReadonlyArray<A>, i: number) => A = (xs, i) => unsafeCoerce(xs[i])
  const n = y.length
  const x: Array<number> = []
  for (let i = n - 1; i > -1; --i) {
    x[i] = _(y, i)
    for (let j = i + 1; j < n; ++j) {
      x[i] = _(x, i) - _(_(U, i), j) * _(x, j)
    }
    x[i] = _(x, i) / _(_(U, i), i)
  }
  return unsafeCoerce(x)
}

/**
 * @since 1.0.0
 * @category Internal
 */
const getMaxI = <M, N>(
  i: number,
  m: M.Mat<M, N, number>
): O.Option<readonly [number, number]> => {
  const _: <A>(xs: ReadonlyArray<A>, i: number) => A = (xs, i) => unsafeCoerce(xs[i])
  const n = m.length
  const go: (
    acc: readonly [number, number, number]
  ) => E.Either<readonly [number, number, number], readonly [number, number]> = ([
    j,
    max,
    maxI,
  ]) => {
    if (j >= n) return E.right(tuple(max, maxI))
    const mc = _(_(m, j), i)
    return Math.abs(mc) > max
      ? E.left([j + 1, Math.abs(mc), j])
      : E.left([j + 1, max, maxI])
  }
  return pipe(
    ChnR.tailRec(tuple(i, 0, -1), go),
    O.fromPredicate(([max]) => max !== 0)
  )
}

/**
 * See: Fundamentals of Matrix Computation, David S. Watkins, page 100
 *
 * @since 1.0.0
 * @category Internal
 */
const subAndScale = <M, N>(
  k: number,
  m: M.Mat<M, N, number>
): O.Option<M.Mat<M, N, number>> => {
  const _: <A>(xs: ReadonlyArray<A>, i: number) => A = (xs, i) => unsafeCoerce(xs[i])
  const n = m.length
  const A = M.toNestedArrays(m)
  if (_(_(A, k), k) === 0) return O.none
  for (let i = k + 1; i < n; ++i) {
    _(A, i)[k] = _(_(A, i), k) / _(_(A, k), k)
  }
  for (let i = k + 1; i < n; ++i) {
    for (let j = k + 1; j < n; ++j) {
      _(A, i)[j] -= _(_(A, i), k) * _(_(A, k), j)
    }
  }
  if (_(_(A, k), k) === 0) return O.none
  return O.some(unsafeCoerce(A))
}

// ##########
// ### QR ###
// ##########

/**
 * @since 1.1.0
 * @category Internal
 */
const getSubColumnToEnd: (
  col: number,
  fromIncl: number
) => <P extends number, M extends number, N extends number, A>(
  m: M.Mat<M, N, A>
) => O.Option<V.Vec<P, A>> = (col, fromRowI) => A => {
  const _: <A>(xs: ReadonlyArray<A>, i: number) => A = (xs, i) => unsafeCoerce(xs[i])
  return pipe(
    M.shape(A),
    O.fromPredicate(([rows, cols]) => col < cols && fromRowI < rows),
    O.map(([rows]) => {
      const sub = []
      for (let i = fromRowI; i < rows; ++i) {
        sub.push(_(_(A, i), col))
      }
      return unsafeCoerce(sub)
    })
  )
}

/**
 * @since 1.1.0
 * @category Internal
 */
const replaceSubColumn: <P extends number, A>(
  col: number,
  fromRowIncl: number,
  repl: V.Vec<P, A>
) => <M extends number, N extends number>(
  m: M.Mat<M, N, A>
) => O.Option<M.Mat<M, N, A>> = (col, fromRowI, repl) => A => {
  const _: <A>(xs: ReadonlyArray<A>, i: number) => A = (xs, i) => unsafeCoerce(xs[i])
  const p = V.size(repl)
  return pipe(
    M.shape(A),
    O.fromPredicate(([rows, cols]) => col < cols && fromRowI + p < rows),
    O.map(([rows]) => {
      const Ap = M.toNestedArrays(A)
      for (let i = fromRowI; i < rows; ++i) {
        _(Ap, i)[col] = _(repl, i - fromRowI)
      }
      return unsafeCoerce(Ap)
    })
  )
}

/**
 * @since 1.1.0
 * @category Internal
 */
const argMaxVec: (xs: ReadonlyArray<number>) => number = RA.foldMap(Mn.max(N.Bounded))(
  identity
)

/**
 * See 3.2.35 in Fundamentals of Matrix Computation, David S. Watkins, page 201
 *
 * @since 1.1.0
 * @category Internal
 */
const orthogonalize: <N>(
  x0: V.Vec<N, number>
) => [number, number, V.Vec<N, number>] = xs => {
  const _: <A>(xs: Array<A>, i: number) => A = (xs, i) => unsafeCoerce(xs[i])
  let x = RA.toArray(xs)
  const β = argMaxVec(x)
  if (β === 0)
    return [
      0,
      0,
      pipe(
        xs,
        V.mapWithIndex(i => (i === 0 ? 1 : 0))
      ),
    ]
  x = pipe(
    x,
    A.map(x => x / β)
  )
  let τ = pipe(
    x,
    RA.foldMap(N.MonoidSum)(x => Math.pow(x, 2)),
    Math.sqrt
  )
  τ = _(x, 0) < 0 ? τ : -τ
  x[0] = τ + _(x, 0)
  const γ = _(x, 0) / τ
  x = pipe(
    x,
    A.mapWithIndex((i, a) => (i === 0 ? a : a / _(x, 0)))
  )
  x[0] = 1
  τ = τ * β
  return [τ, γ, unsafeCoerce(x)]
}

/**
 * See 3.2.38 in Fundamentals of Matrix Computation, David S. Watkins, page 202
 *
 * @since 1.1.0
 * @category Internal
 */
const reflect: <M extends number, N extends number>(
  gammaU: [number, V.Vec<N, number>]
) => (B: M.Mat<N, M, number>) => M.Mat<N, M, number> =
  ([γ, u]) =>
  B => {
    const [n, m] = M.shape(B)
    const vt = pipe(
      u,
      V.map(x => x * γ),
      vt => N.linMapR(vt, B)
    )
    const { inverse, concat } = N.AdditiveAbGrpMN(n, m)
    return concat(B, inverse(N.outerProduct(u, vt)))
  }

/**
 * @since 1.1.0
 * @category Internal
 */
const getSubMatrixToEnd: <P extends number, Q extends number>(
  rowFromIncl: number,
  colFromIncl: number
) => <M extends number, N extends number, A>(
  m: M.Mat<M, N, A>
) => O.Option<M.Mat<P, Q, A>> = (i1, j1) => A => {
  const _ = <A>(xs: ReadonlyArray<A>, i: number): A => unsafeCoerce(xs[i])
  return pipe(
    M.shape(A),
    O.fromPredicate(([rows, cols]) => i1 >= 0 && i1 < rows && j1 >= 0 && j1 < cols),
    O.map(([m, n]) => {
      const out = []
      for (let i = i1; i < m; ++i) {
        const outi = []
        for (let j = j1; j < n; ++j) {
          outi.push(_(_(A, i), j))
        }
        out.push(outi)
      }
      return unsafeCoerce(out)
    })
  )
}

/**
 * @since 1.1.0
 * @category Internal
 */
const replaceSubMatrix: <P extends number, Q extends number, A>(
  rowFromIncl: number,
  colFromIncl: number,
  repl: M.Mat<P, Q, A>
) => <M extends number, N extends number>(
  m: M.Mat<M, N, A>
) => O.Option<M.Mat<M, N, A>> = (i1, j1, repl) => m => {
  const _ = <A>(xs: ReadonlyArray<A>, i: number): A => unsafeCoerce(xs[i])
  return pipe(
    M.shape(m),
    O.fromPredicate(([rows, cols]) => i1 >= 0 && i1 < rows && j1 >= 0 && j1 < cols),
    O.bindTo('shapeA'),
    O.bind('shapeRepl', () => O.some(M.shape(repl))),
    O.filter(
      ({ shapeA: [rows, cols], shapeRepl: [replRows, replCols] }) =>
        replRows + i1 <= rows && replCols + j1 <= cols
    ),
    O.map(({ shapeRepl: [i2, j2] }) => {
      const A = M.toNestedArrays(m)
      for (let i = i1; i < i1 + i2; ++i) {
        for (let j = j1; j < j1 + j2; ++j) {
          _(A, i)[j] = _(_(repl, i - i1), j - j1)
        }
      }
      return unsafeCoerce(A)
    })
  )
}

/**
 * @since 1.1.0
 * @category Internal
 */
declare const getQR: <M>(
  m: M.Mat<M, M, number>
) => [MatTypes.OrthogonalMatrix<M, number>, MatTypes.UpperTriangularMatrix<M, number>]
