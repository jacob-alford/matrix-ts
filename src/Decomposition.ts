/**
 * Decompose matricies into various forms, such as `LUP`. Can be used in various
 * applications like solving a system of equations, or calculating the principle
 * components of a multivariate distribution (SVD)
 *
 * @since 1.0.0
 */
import * as B from 'fp-ts/boolean'
import * as O from 'fp-ts/Option'
import * as ChnR from 'fp-ts/ChainRec'
import * as IO from 'fp-ts/IO'
import * as E from 'fp-ts/Either'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RTup from 'fp-ts/ReadonlyTuple'
import { tuple, pipe, unsafeCoerce, identity } from 'fp-ts/function'

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
export interface Decomposition<N, M, R, A> {
  input: M.Mat<N, M, R>
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
 * Represents a solution to an overdetermined system. Returns O.none if the `rank(A) < m`
 * (the number of columns). Returns a tuple with the residual, and solution vector
 *
 * @since 1.1.0
 * @category Model
 */
export interface LeastSquares<N, M, R> {
  solve: (b: V.Vec<N, R>) => C.Computation<string, [number, V.Vec<M, R>]>
}

/**
 * Determines if `A` is singular
 *
 * @since 1.1.0
 * @category Model
 */
export interface IsSingular {
  isSingular: boolean
}

/**
 * Returns the Rank of A
 *
 * @since 1.1.0
 * @category Model
 */
export interface Rank {
  rank: number
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
     * Base case: computation has failed in prior iterations, or has reached the last row
     * ----------------------------------------------------------------------------------
     */
    if (E.isLeft(result) || result.right.i >= columns) {
      return E.right(computation)
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
    C.bilog(
      () => '[1] Failed to decompose matrix',
      () => '[0] Successfully decomposed matrix'
    ),
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
 * QR decomposition with column pivoting using Householder Reflections. Based on an
 * algorithm described in Fundamentals of Matrix Computations, David S. Watkins.
 *
 * Can be used to calculate a matrix's:
 *
 * - Singularity
 * - Rank
 * - Least Square Solution for overdetermined systems
 *
 * Efficiency: `O(n^3)`
 *
 * Returns a tuple with:
 *
 * - `A'`: The assembled matrix R with lower triangular components being orthogonal vectors
 *   collectively used to construct the reflector `Q`.
 * - `Q`: An IO that returns a constructed reflector `Q`. This has the same efficiency as QR
 *   decomposition itself, so evaluation is deferred.
 * - `R`: The upper triangular matrix extracted from `A'`.
 * - `P`: The permutation matrix used to permute the columns of `A`
 *
 * QR decomposes a matrix A into a matrix `Q`, a matrix `R`, and a matrix `P` such that:
 *
 * ```math
 * AP = QR
 * ```
 *
 * @since 1.1.0
 * @category Constructors
 */
export function QR<N extends number, M extends number>(
  mat: M.Mat<N, M, number>
): C.Computation<
  string,
  Decomposition<
    N,
    M,
    number,
    [
      M.Mat<N, M, number>,
      IO.IO<MatTypes.OrthogonalMatrix<N, number>>,
      M.Mat<N, M, number>,
      MatTypes.OrthogonalMatrix<M, number>
    ]
  > &
    IsSingular &
    Rank &
    LeastSquares<N, M, number>
> {
  type ComputationParams = {
    k: number
    A: M.Mat<N, M, number>
    Q: ReadonlyArray<M.Mat<N, N, number>>
    ??: ReadonlyArray<number>
    P: M.Mat<M, M, number>
    sqColNorms: V.Vec<M, number>
    numPivots: number
  }

  type In = C.Computation<string, ComputationParams>
  type Out = C.Computation<string, ComputationParams & { rank: number }>

  const [n, m] = M.shape(mat)

  if (n < m) {
    return C.throwError(
      `[1] QR Decomposition only defined for matrix dimensions n >= m, received n = ${n} and m = ${m}`
    )
  }

  const IdN = N.idMat(n)
  const IdM = N.idMat(m)

  /** Here, P is a free constraint that represents (row) N - k, and Q represents (column) N - k - 1 */
  const go = <P extends number, Q extends number>(computation: In): E.Either<In, Out> => {
    /*
     * Base case: computation has failed in prior iterations
     * -----------------------------------------------------
     */
    if (C.isLeft(computation)) {
      return E.right(computation)
    }

    /*
     * Base case: Matrix reduction is complete
     * ---------------------------------------
     */
    if (C.isRight(computation) && computation[0].right.k >= m - 1) {
      return pipe(
        computation,
        C.chain(result =>
          pipe(
            result.A,
            M.get(m - 1, m - 1),
            C.fromOption(() => '[010] Unreachable: index not found'),
            C.map(ann => ({
              ...result,
              ??: [...result.??, ann],
              rank: m - (isSingular(ann) ? 1 : 0),
            }))
          )
        ),
        E.right
      )
    }

    const validatedComputation = pipe(
      computation,
      C.bindTo('acc'),
      /*
       * Subtract square row values from column norms
       * --------------------------------------------
       */
      C.bind('adjustedSqNorms', ({ acc: { A, k } }) =>
        pipe(
          A,
          V.get(k),
          O.map(V.map(Aki => Math.pow(Aki, 2))),
          O.map(Ak => N.subV(sqColNorms, Ak)),
          C.fromOption(() => '[001] Unreachable: index not found')
        )
      ),
      /*
       * Find max column length
       * ----------------------
       */
      C.bind('maxColIndex', ({ acc: { k }, adjustedSqNorms }) =>
        pipe(
          adjustedSqNorms,
          getMaxColFrom(k),
          C.fromPredicate(
            ([max]) => !(isSingular(max) && k === 0),
            () => `[1] Matrix has zero rank`
          )
        )
      )
    )

    /*
     * Base case: rest of matrix is filled with zeros
     * ----------------------------------------------
     */
    if (
      C.isRight(validatedComputation) &&
      isSingular(validatedComputation[0].right.maxColIndex[0])
    ) {
      return pipe(
        computation,
        C.map(a => ({ ...a, rank: a.k + 1 })),
        E.right
      )
    }

    return pipe(
      validatedComputation,
      C.logOption(({ acc: { k }, maxColIndex: [, maxI] }) =>
        pipe(
          `Swapped column ${k} and ${maxI}`,
          O.fromPredicate(() => k !== maxI)
        )
      ),
      /*
       * Pivot A
       * --------
       */
      C.bind('Ap', ({ maxColIndex: [, maxI], acc: { A, k } }) =>
        pipe(
          A,
          M.switchColumns(maxI, k),
          C.fromOption(() => '[003] Unreachable: index not found')
        )
      ),
      /*
       * Pivot norms
       * -----------
       */
      C.bind('nextSqNorms', ({ maxColIndex: [, maxI], acc: { k }, adjustedSqNorms }) =>
        pipe(
          adjustedSqNorms,
          V.switchIndices(maxI, k),
          C.fromOption(() => '[004] Unreachable: index not found')
        )
      ),
      /*
       * Pivot Permutation Matrix
       * ------------------------
       */
      C.bind('nextP', ({ maxColIndex: [, maxI], acc: { k, P } }) =>
        pipe(
          P,
          M.switchColumns(maxI, k),
          C.fromOption(() => '[005] Unreachable: index not found')
        )
      ),
      /*
       * Calculate reflector parameters: ??k, ??k, and uk (3.2.35, 201)
       * -------------------------------------------------------------
       */
      C.bind('xi', ({ acc: { k }, Ap }) =>
        pipe(
          M.getSubColumn(k, k)<P, N, M, number>(Ap),
          O.chain(orthogonalize),
          C.fromOption(() => '[006] Unreachable: index not found')
        )
      ),
      /*
       * Calculate Qk using reflector parameters
       * ----------------------------------------
       */
      C.bind('Qk', ({ xi: [, , ??k, uk], acc: { k } }) => {
        const repl = pipe(N.idMat(V.size(uk)), reflect([??k, uk]))
        return pipe(
          IdN,
          M.updateSubMatrix<P, P, number>(k, k, repl),
          C.fromOption(() => '[007] Unreachable: index not found')
        )
      }),
      /*
       * Reflect (k)x(k+1) submatrix of A
       * ----------------------------------
       */
      C.bind('B', ({ acc: { k }, xi: [, , ??k, uk], Ap }) =>
        pipe(
          Ap,
          M.getSubMatrix<P, Q>(k, k + 1),
          O.map(reflect([??k, uk])),
          C.fromOption(() => '[008] Unreachable: index not found')
        )
      ),
      /*
       * Update pivoted A with calculated B, and parameter ??k
       * --------------------------------------------
       */
      C.bind('nextA', ({ acc: { k }, B, xi: [, ??k, , uk], Ap }) =>
        pipe(
          Ap,
          M.updateSubMatrix(k, k + 1, B),
          O.chain(M.updateSubColumn(k, k, uk)),
          O.chain(M.updateAt(k, k, -??k)),
          C.fromOption(() => '[009] Unreachable: index not found')
        )
      ),
      C.map(
        ({
          nextA,
          nextSqNorms,
          nextP,
          acc: { k, Q, ??, numPivots },
          Qk,
          xi: [, , ??k],
          maxColIndex: [, maxI],
        }) => ({
          A: nextA,
          k: k + 1,
          Q: [...Q, Qk],
          ??: [...??, ??k],
          sqColNorms: nextSqNorms,
          P: nextP,
          numPivots: k === maxI ? numPivots : numPivots + 1,
        })
      ),
      E.left
    )
  }

  const sqColNorms = pipe(
    mat,
    M.reduceByColumn(col =>
      pipe(N.lInfNorm(col), max =>
        pipe(
          col,
          V.map(a => a / max),
          N.l2Norm,
          a => Math.pow(a * max, 2)
        )
      )
    )
  )

  return pipe(
    ChnR.tailRec<In, Out>(
      C.of({ k: 0, A: mat, Q: [], ??: [], sqColNorms, P: IdM, numPivots: 0 }),
      acc => go<N, M>(acc)
    ),
    C.bilog(
      () => '[1] Failed to decompose matrix',
      () => '[0] Successfully decomposed matrix'
    ),
    C.map(({ A, Q, ??, P, rank }) => {
      const R = pipe(
        A,
        M.mapWithIndex(([i, j], a) => (i > j ? 0 : a))
      )
      return {
        input: mat,
        result: tuple(
          A,
          () =>
            pipe(Q, RA.foldMap(M.getSquareMonoidProduct(N.Field)(n))(identity), a =>
              unsafeCoerce(a)
            ),
          R,
          unsafeCoerce(P)
        ),
        isSingular: pipe(??, RA.foldMap(B.MonoidAny)(isSingular)),
        rank,
        solve: leastSquares(rank, R, Q, unsafeCoerce(P)),
      }
    })
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
  if (isSingular(_(_(A, k), k))) return O.none
  for (let i = k + 1; i < n; ++i) {
    _(A, i)[k] = _(_(A, i), k) / _(_(A, k), k)
  }
  for (let i = k + 1; i < n; ++i) {
    for (let j = k + 1; j < n; ++j) {
      _(A, i)[j] -= _(_(A, i), k) * _(_(A, k), j)
    }
  }
  if (isSingular(_(_(A, k), k))) return O.none
  return O.some(unsafeCoerce(A))
}

// ##########
// ### QR ###
// ##########

/**
 * @since 1.1.0
 * @category Internal
 */
const getMaxColFrom: (
  k: number
) => <N extends number>(v: V.Vec<N, number>) => readonly [number, number] = k => v => {
  const _: <A>(xs: ReadonlyArray<A>, i: number) => A = (xs, i) => unsafeCoerce(xs[i])
  const c = pipe(v, RA.dropLeft(k))
  const go: (
    acc: readonly [number, number, number]
  ) => E.Either<readonly [number, number, number], readonly [number, number]> = ([
    j,
    max,
    maxI,
  ]) => {
    if (j >= c.length) return E.right(tuple(max, maxI))
    const cj = _(c, j)
    return Math.abs(cj) > max
      ? E.left([j + 1, Math.abs(cj), j + k])
      : E.left([j + 1, max, maxI])
  }
  return ChnR.tailRec(tuple(0, 0, -1), go)
}

/**
 * See 3.2.35 in Fundamentals of Matrix Computation, David S. Watkins, page 201
 *
 * @since 1.1.0
 * @category Internal
 */
const orthogonalize: <N extends number>(
  xi: V.Vec<N, number>
) => O.Option<[number, number, number, V.Vec<N, number>]> = x =>
  pipe(
    RA.head(x),
    O.map(x0 =>
      pipe(
        N.lInfNorm(x),
        O.fromPredicate(?? => ?? !== 0),
        O.fold(
          () =>
            tuple(
              x0,
              0,
              0,
              pipe(
                x,
                V.mapWithIndex(i => (i === 0 ? 1 : 0))
              )
            ),
          ?? => {
            const ?? = pipe(
              x,
              V.map(x => x / ??),
              N.l2Norm,
              ?? => ?? * Math.sign(x0) * ??
            )
            const x1 = ?? + x0
            const ?? = x1 / ??
            const u = pipe(
              x,
              V.mapWithIndex((j, xj) => (j === 0 ? 1 : xj / x1))
            )
            return tuple(x0, ??, ??, u)
          }
        )
      )
    )
  )

/**
 * See 3.2.38 in Fundamentals of Matrix Computation, David S. Watkins, page 202
 *
 * @since 1.1.0
 * @category Internal
 */
const reflect: <N extends number>(
  gammaU: [number, V.Vec<N, number>]
) => <M extends number>(B: M.Mat<N, M, number>) => M.Mat<N, M, number> =
  ([??, u]) =>
  B =>
    pipe(
      u,
      V.map(x => x * ??),
      vt => N.linMapR(vt, B),
      vtB => N.subM(B, N.outerProduct(u, vtB))
    )

/**
 * Determines if a value is close enough to zero
 *
 * @since 1.1.0
 * @category Internal
 */
const isSingular = (x: number) => Math.abs(x) < 10 ** -12

/**
 * Drop a number of rows from a matrix, where P is a generic which represents dimension of
 * the resulting matrix
 *
 * @since 1.1.0
 * @category Sub-Matrix
 */
const dropRowsRight: <P extends number>(
  n: number
) => <N extends number, M extends number, A>(m: M.Mat<N, M, A>) => M.Mat<P, M, A> =
  n => mat =>
    pipe(mat, RA.dropRight(n), a => unsafeCoerce(a))

/**
 * Drop a number of rows from a matrix, where P is a generic which represents dimension of
 * the resulting matrix
 *
 * @since 1.1.0
 * @category Sub-Matrix
 */
const dropRight: <P extends number>(
  n: number
) => <N extends number, A>(m: V.Vec<N, A>) => V.Vec<P, A> = n => mat =>
  pipe(mat, RA.dropRight(n), a => unsafeCoerce(a))

/**
 * Drop a number of rows from a matrix, where P is a generic which represents dimension of
 * the resulting matrix
 *
 * @since 1.1.0
 * @category Sub-Matrix
 */
const dropLeft: <P extends number>(
  n: number
) => <N extends number, A>(m: V.Vec<N, A>) => V.Vec<P, A> = n => mat =>
  pipe(mat, RA.dropLeft(n), a => unsafeCoerce(a))

/**
 * Solves the least-squares problem for a full rank matrix
 *
 * @since 1.1.0
 * @category Internal
 */
const leastSquares =
  <N extends number, M extends number>(
    r: number,
    R: M.Mat<N, M, number>,
    Q: ReadonlyArray<M.Mat<N, N, number>>,
    P: MatTypes.OrthogonalMatrix<M, number>
  ): ((b: V.Vec<N, number>) => C.Computation<string, [number, V.Vec<M, number>]>) =>
  b =>
    (<P extends number>() =>
      pipe(
        M.shape(R),
        C.fromPredicate(
          ([, m]) => r >= m,
          () => '[1] Matrix is not full rank'
        ),
        C.bindTo('shape'),
        C.bindW('cd', ({ shape: [n, m] }) =>
          pipe(
            Q,
            RA.reduce(b, (v, m) => N.linMap(m, v)),
            b_ => tuple(pipe(b_, dropRight<M>(n - m)), pipe(b_, dropLeft<P>(m))),
            C.of
          )
        ),
        C.bindW('R_', ({ shape: [n, m] }) =>
          pipe(R, dropRowsRight<M>(n - m), MatTypes.fromMatrix(N.Field), RTup.snd, C.of)
        ),
        C.map(({ R_, cd: [c_, d] }) =>
          tuple(
            N.l2Norm(d),
            pipe(backSub(R_, c_), x_ => N.linMapR(x_, M.transpose(P)))
          )
        )
      ))<N>()
