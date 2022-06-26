import * as Rng from 'fp-ts/Ring'
import * as Fld from 'fp-ts/Field'
import { flow, pipe, tuple, unsafeCoerce } from 'fp-ts/function'

import * as M from './Matrix'
import * as Iso from './Iso'

const UpperTriangularSymbol = Symbol('UpperTriangular')
type UpperTriangularSymbol = typeof UpperTriangularSymbol

const LowerTriangularSymbol = Symbol('LowerTriangular')
type LowerTriangularSymbol = typeof LowerTriangularSymbol

const DiagonalSymbol = Symbol('Diagonal')
type DiagonalSymbol = typeof DiagonalSymbol

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
M

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
 * @since 1.0.0
 * @category Matrix Operations
 */
export const diagonalInverse: <A>(
  F: Fld.Field<A>
) => <M>(m: DiagonalMatrix<M, A>) => DiagonalMatrix<M, A> = F =>
  diagonalMap(a => F.div(F.one, a))
