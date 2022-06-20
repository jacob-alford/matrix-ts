import * as Rng from 'fp-ts/Ring'
import { pipe, unsafeCoerce } from 'fp-ts/function'

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
export const toMatrix =
  <M extends number, A>(m: M, R: Rng.Ring<A>) =>
  ([l, u]: [LowerTriangularMatrix<M, A>, UpperTriangularMatrix<M, A>]): M.Mat<
    M,
    M,
    A
  > => {
    const Ab = M.getAdditiveAbelianGroup(R)(m, m)
    return Ab.concat(u, Ab.concat(l, Ab.inverse(M.id(R)(m))))
  }

// ####################
// ### Isomorphisms ###
// ####################

export const getLUIso: <A>(
  R: Rng.Ring<A>
) => <M extends number>(
  m: M
) => Iso.Iso0<
  M.Mat<M, M, A>,
  [LowerTriangularMatrix<M, A>, UpperTriangularMatrix<M, A>]
> = R => m => ({
  get: fromMatrix(R),
  reverseGet: toMatrix(m, R),
})
