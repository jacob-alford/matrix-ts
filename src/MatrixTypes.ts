/**
 * Various Matrix sub-types that are guarded by various constructors and branded-newtypes.
 * Allows for convenient inverses if the inverse need be applied to the diagonal of a
 * particular matrix, such as with the Pearson Correlation Matrix for multivariate samples.
 *
 * @since 1.0.0
 */
import * as Rng from 'fp-ts/Ring'
import * as Fld from 'fp-ts/Field'
import * as Mon from 'fp-ts/Monoid'
import * as O from 'fp-ts/Option'
import { flow, pipe, tuple, unsafeCoerce } from 'fp-ts/function'

import * as M from './Matrix'
import * as V from './Vector'
import * as Iso from './Iso'

const UpperTriangularSymbol = Symbol('UpperTriangular')
type UpperTriangularSymbol = typeof UpperTriangularSymbol

const LowerTriangularSymbol = Symbol('LowerTriangular')
type LowerTriangularSymbol = typeof LowerTriangularSymbol

const DiagonalSymbol = Symbol('Diagonal')
type DiagonalSymbol = typeof DiagonalSymbol

const OrthogonalSymbol = Symbol('Orthogonal')
type OrthogonalSymbol = typeof OrthogonalSymbol

// #############
// ### Model ###
// #############

/**
 * Upper Triangular Matricies
 *
 * @since 1.0.0
 * @category Model
 */
export interface UpperTriangularMatrix<M, A> extends M.Mat<M, M, A> {
  _URI: UpperTriangularSymbol
}

/**
 * Lower Triangular Matricies
 *
 * @since 1.0.0
 * @category Model
 */
export interface LowerTriangularMatrix<M, A> extends M.Mat<M, M, A> {
  _URI: LowerTriangularSymbol
}

/**
 * Diagonal Matricies
 *
 * @since 1.0.0
 * @category Model
 */
export interface DiagonalMatrix<M, A> extends M.Mat<M, M, A> {
  _URI: DiagonalSymbol
}

/**
 * Orthogonal Matricies
 *
 * @since 1.1.0
 * @category Model
 */
export interface OrthogonalMatrix<M, A> extends M.Mat<M, M, A> {
  _URI: OrthogonalSymbol
}

// ####################
// ### Constructors ###
// ####################

/**
 * @since 1.0.0
 * @category Constructors
 */
export const fromMatrix: <A>(
  R: Rng.Ring<A>
) => <M>(
  m: M.Mat<M, M, A>
) => [LowerTriangularMatrix<M, A>, UpperTriangularMatrix<M, A>] = R => m => {
  const lower = pipe(
    m,
    M.mapWithIndex(([i, j], a) => (i === j ? R.one : i < j ? R.zero : a))
  )
  const upper = pipe(
    m,
    M.mapWithIndex(([i, j], a) => (i > j ? R.zero : a))
  )
  return [unsafeCoerce(lower), unsafeCoerce(upper)]
}

/**
 * @since 1.0.0
 * @category Constructors
 */
export const toMatrix = <M, A>([l, u]: [
  LowerTriangularMatrix<M, A>,
  UpperTriangularMatrix<M, A>
]): M.Mat<M, M, A> =>
  pipe(
    M.lift2<A, [A, A]>((a, b) => tuple(a, b))(l, u),
    M.mapWithIndex(([i, j], [lower, upper]) => (i > j ? lower : upper))
  )

/**
 * @since 1.0.0
 * @category Constructors
 */
export const extractDiagonal: <A>(
  zero: A
) => <M>(m: M.Mat<M, M, A>) => DiagonalMatrix<M, A> = zero =>
  flow(
    M.mapWithIndex(([i, j], a) => (i === j ? a : zero)),
    a => unsafeCoerce(a)
  )

// ####################
// ### Isomorphisms ###
// ####################

/**
 * @since 1.0.0
 * @category Isomorphisms
 */
export const getTransposeIso: <M extends number, A>() => Iso.Iso<
  LowerTriangularMatrix<M, A>,
  UpperTriangularMatrix<M, A>
> = () => ({
  get: flow(M.transpose, a => unsafeCoerce(a)),
  reverseGet: flow(M.transpose, a => unsafeCoerce(a)),
})

// #########################
// ### Matrix Operations ###
// #########################

/**
 * @since 1.0.0
 * @category Matrix Operations
 */
export const diagonalMap: <A>(
  f: (a: A) => A
) => <M>(m: DiagonalMatrix<M, A>) => DiagonalMatrix<M, A> = f => m => {
  const _ = <A>(as: ReadonlyArray<A>, i: number): A => unsafeCoerce(as[i])
  const a = M.toNestedArrays(m)
  for (let i = 0; i < m.length; ++i) {
    _(a, i)[i] = f(_(_(a, i), i))
  }
  return unsafeCoerce(a)
}

/**
 * @since 1.0.4
 * @category Matrix Operations
 */
export const diagonalFoldMap: <A>(
  Mn: Mon.Monoid<A>
) => <M>(as: DiagonalMatrix<M, A>) => A = M => as => {
  const _ = <A>(as: ReadonlyArray<A>, i: number): A => unsafeCoerce(as[i])
  let out = M.empty
  for (let i = 0; i < as.length; ++i) {
    out = M.concat(out, _(_(as, i), i))
  }
  return out
}

/**
 * @since 1.0.0
 * @category Matrix Operations
 */
export const diagonalInverse: <A>(
  F: Fld.Field<A>
) => <M>(m: DiagonalMatrix<M, A>) => DiagonalMatrix<M, A> = F =>
  diagonalMap(a => F.div(F.one, a))

/**
 * @since 1.1.0
 * @category Matrix Operations
 */
export const orthogonalInverse: <M extends number, A>(
  m: OrthogonalMatrix<M, A>
) => OrthogonalMatrix<M, A> = flow(M.transpose, a => unsafeCoerce(a))

/**
 * See: Fundamentals of Matrix Computation, David S. Watkins, page 26. Returns O.none if
 * matrix is singular
 *
 * @since 1.1.0
 * @category Matrix Operations
 */
export const forwardSub: <M>(
  L: LowerTriangularMatrix<M, number>,
  b: V.Vec<M, number>
) => O.Option<V.Vec<M, number>> = (L, b) => {
  const _: <A>(xs: ReadonlyArray<A>, i: number) => A = (xs, i) => unsafeCoerce(xs[i])
  const n = b.length
  const y: Array<number> = []
  for (let i = 0; i < n; ++i) {
    if (_(_(L, i), i) === 0) {
      return O.none
    }
    y[i] = _(b, i)
    for (let j = 0; j < i; ++j) {
      y[i] = _(y, i) - _(_(L, i), j) * _(y, j)
    }
    y[i] = _(y, i) / _(_(L, i), i)
  }
  return O.some(unsafeCoerce(y))
}

/**
 * See: Fundamentals of Matrix Computation, David S. Watkins, page 30. Returns O.none if
 * matrix is singular
 *
 * @since 1.1.0
 * @category Matrix Operations
 */
export const backSub = <M extends number>(
  U: UpperTriangularMatrix<M, number>,
  y: V.Vec<M, number>
): O.Option<V.Vec<M, number>> => {
  const _: <A>(xs: ReadonlyArray<A>, i: number) => A = (xs, i) => unsafeCoerce(xs[i])
  const n = y.length
  const x: Array<number> = []
  for (let i = n - 1; i > -1; --i) {
    if (_(_(U, i), i) === 0) {
      return O.none
    }
    x[i] = _(y, i)
    for (let j = i + 1; j < n; ++j) {
      x[i] = _(x, i) - _(_(U, i), j) * _(x, j)
    }
    x[i] = _(x, i) / _(_(U, i), i)
  }
  return O.some(unsafeCoerce(x))
}
