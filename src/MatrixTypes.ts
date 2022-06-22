import * as Rng from 'fp-ts/Ring'
import { flow, pipe, tuple, unsafeCoerce } from 'fp-ts/function'

import * as M from './Matrix'
import * as Iso from './Iso'

const UpperTriangularSymbol = Symbol('UpperTriangular')
type UpperTriangularSymbol = typeof UpperTriangularSymbol

const LowerTriangularSymbol = Symbol('LowerTriangular')
type LowerTriangularSymbol = typeof LowerTriangularSymbol

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
    M.liftA2<A, [A, A]>((a, b) => tuple(a, b))(l, u),
    M.mapWithIndex(([i, j], [lower, upper]) => (i > j ? lower : upper))
  )

// ####################
// ### Isomorphisms ###
// ####################

export const getLUIso: <M, A>(
  R: Rng.Ring<A>
) => Iso.Iso0<
  M.Mat<M, M, A>,
  [LowerTriangularMatrix<M, A>, UpperTriangularMatrix<M, A>]
> = R => ({
  get: fromMatrix(R),
  reverseGet: toMatrix,
})

export const getTransposeIso: <M extends number, A>() => Iso.Iso0<
  LowerTriangularMatrix<M, A>,
  UpperTriangularMatrix<M, A>
> = () => ({
  get: flow(M.transpose, a => unsafeCoerce(a)),
  reverseGet: flow(M.transpose, a => unsafeCoerce(a)),
})
M
