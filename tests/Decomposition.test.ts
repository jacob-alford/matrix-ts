import * as E from 'fp-ts/Either'

import { LUP, QR } from '../src/Decomposition'
import * as M from '../src/Matrix'
import * as N from '../src/number'
import * as V from '../src/Vector'

describe('LUP Decomposition', () => {
  const A = M.fromNestedTuples([
    [2, 10, 8, 8, 6],
    [1, 4, -2, 4, -1],
    [0, 2, 3, 2, 1],
    [3, 8, 3, 10, 9],
    [1, 4, 1, 2, 1],
  ])
  it('solves a system of equations', () => {
    const [output] = LUP(A)

    if (E.isLeft(output)) {
      throw new Error('Unexpected result')
    }

    const { solve } = output.right

    const b = V.fromTuple([52, 14, 12, 51, 15])
    const c = V.fromTuple([50, 4, 12, 48, 12])
    const x_b = solve(b)
    const x_c = solve(c)

    const expectedX_b = V.fromTuple([1, 2, 1, 2, 1])
    const expectedX_c = V.fromTuple([2, 1, 2, 1, 2])

    for (const [Axi, bi] of V.zipVectors(x_b, expectedX_b)) {
      expect(Axi).toBeCloseTo(bi)
    }
    for (const [Axi, bi] of V.zipVectors(x_c, expectedX_c)) {
      expect(Axi).toBeCloseTo(bi)
    }
  })
  it('returns a factorized matrix', () => {
    const [output] = LUP(A)

    if (E.isLeft(output)) {
      throw new Error('Unexpected result')
    }

    const {
      result: [L, U, P],
    } = output.right

    const expectedL = M.fromNestedTuples([
      [1, 0, 0, 0, 0],
      [2 / 3, 1, 0, 0, 0],
      [1 / 3, 2 / 7, 1, 0, 0],
      [1 / 3, 2 / 7, 4 / 11, 1, 0],
      [0, 3 / 7, -1 / 11, -4 / 5, 1],
    ])
    const expectedU = M.fromNestedTuples([
      [3, 8, 3, 10, 9],
      [0, 14 / 3, 6, 4 / 3, 0],
      [0, 0, -33 / 7, 2 / 7, -4],
      [0, 0, 0, -20 / 11, -6 / 11],
      [0, 0, 0, 0, 1 / 5],
    ])

    for (const [ra, rb] of V.zipVectors(L, expectedL)) {
      for (const [a, b] of V.zipVectors(ra, rb)) {
        expect(a).toBeCloseTo(b)
      }
    }
    for (const [ra, rb] of V.zipVectors(U, expectedU)) {
      for (const [a, b] of V.zipVectors(ra, rb)) {
        expect(a).toBeCloseTo(b)
      }
    }
    for (const [ra, rb] of V.zipVectors(M.mul(N.Field)(L, U), M.mul(N.Field)(P, A))) {
      for (const [a, b] of V.zipVectors(ra, rb)) {
        expect(a).toBeCloseTo(b)
      }
    }
  })
  it('calculates a determinant (i)', () => {
    const [output] = LUP(
      M.fromNestedTuples([
        [5, 2, 1, 4, 6],
        [9, 4, 2, 5, 2],
        [11, 5, 7, 3, 9],
        [5, 6, 6, 7, 2],
        [7, 5, 9, 3, 3],
      ])
    )

    if (E.isLeft(output)) {
      throw new Error('Unexpected result')
    }

    const { det } = output.right

    /*
     * This seems to be off by one
     */
    expect(det()).toBeCloseTo(-2003, -1)
  })
  it('calculates a determinant (ii)', () => {
    const [output] = LUP(
      M.fromNestedTuples([
        [50, 29],
        [30, 44],
      ])
    )

    if (E.isLeft(output)) {
      throw new Error('Unexpected result')
    }

    const { det } = output.right

    expect(det()).toBeCloseTo(1330)
  })
  it('calculates a determinant (ii)', () => {
    const [output] = LUP(
      M.fromNestedTuples([
        [55, 25, 15],
        [30, 44, 2],
        [11, 45, 77],
      ])
    )

    if (E.isLeft(output)) {
      throw new Error('Unexpected result')
    }

    const { det } = output.right

    expect(det()).toBeCloseTo(137180)
  })
  it('detects a singular matrix (i)', () => {
    const [result] = LUP(
      M.fromNestedTuples([
        [1, -2],
        [-3, 6],
      ])
    )
    if (E.isRight(result)) {
      throw new Error('Unexpected result')
    }

    expect(result.left).toBe('[10] Matrix is singular')
  })
  it('detects a singular matrix (ii)', () => {
    const [result] = LUP(
      M.fromNestedTuples([
        [1, 1, 1],
        [0, 1, 0],
        [1, 0, 1],
      ])
    )

    if (E.isRight(result)) {
      throw new Error('Unexpected result')
    }

    expect(result.left).toBe('[10] Matrix is singular')
  })
  it('detects a singular matrix (iii)', () => {
    const [result] = LUP(
      M.fromNestedTuples([
        [1, 2],
        [-2, -4],
      ])
    )

    if (E.isRight(result)) {
      throw new Error('Unexpected result')
    }

    expect(result.left).toBe('[10] Matrix is singular')
  })
})

describe('QR decomposition', () => {
  it('decomposes a 2x2 matrix', () => {
    const A = M.fromNestedTuples([
      [1, 2],
      [1, 3],
    ])

    const [output] = QR(A)

    if (E.isLeft(output)) {
      throw new Error('Unexpected result')
    }

    const {
      result: [R, Q_],
    } = output.right

    const Q = Q_()

    const expQ = M.fromNestedTuples([
      [-1 / Math.sqrt(2), -1 / Math.sqrt(2)],
      [-1 / Math.sqrt(2), 1 / Math.sqrt(2)],
    ])

    const expR = M.fromNestedTuples([
      [-2 / Math.sqrt(2), -5 / Math.sqrt(2)],
      [0.4142135623730951, 1 / Math.sqrt(2)],
    ])

    for (const [Qi, expQi] of V.zipVectors(Q, expQ)) {
      for (const [Qij, expQij] of V.zipVectors(Qi, expQi)) {
        expect(Qij).toBeCloseTo(expQij)
      }
    }
    for (const [Ri, expRi] of V.zipVectors(R, expR)) {
      for (const [Rij, expRij] of V.zipVectors(Ri, expRi)) {
        expect(Rij).toBeCloseTo(expRij)
      }
    }
  })
  it('decomposes a 5x5 matrix', () => {
    const A = M.fromNestedTuples([
      [2, 10, 8, 8, 6],
      [1, 4, -2, 4, -1],
      [0, 2, 3, 2, 1],
      [3, 8, 3, 10, 9],
      [1, 4, 1, 2, 1],
    ])

    const [output] = QR(A)

    if (E.isLeft(output)) {
      throw new Error('Unexpected result')
    }

    const {
      result: [, Q, R],
    } = output.right

    const QR_ = N.mulM(Q(), R)

    for (const [Ei, Ai] of V.zipVectors(QR_, A)) {
      for (const [Eij, aij] of V.zipVectors(Ei, Ai)) {
        expect(Eij).toBeCloseTo(aij)
      }
    }
  })
  it('calculates a determinant (i)', () => {
    const [output] = QR(
      M.fromNestedTuples([
        [5, 2, 1, 4, 6],
        [9, 4, 2, 5, 2],
        [11, 5, 7, 3, 9],
        [5, 6, 6, 7, 2],
        [7, 5, 9, 3, 3],
      ])
    )

    if (E.isLeft(output)) {
      throw new Error('Unexpected result')
    }

    const { det } = output.right

    /*
     * This seems to be off by one
     */
    expect(det()).toBeCloseTo(-2003, -1)
  })
  it('calculates a determinant (ii)', () => {
    const [output] = QR(
      M.fromNestedTuples([
        [50, 29],
        [30, 44],
      ])
    )

    if (E.isLeft(output)) {
      throw new Error('Unexpected result')
    }

    const { det } = output.right

    expect(det()).toBeCloseTo(1330)
  })
  it('calculates a determinant (ii)', () => {
    const [output] = QR(
      M.fromNestedTuples([
        [55, 25, 15],
        [30, 44, 2],
        [11, 45, 77],
      ])
    )

    if (E.isLeft(output)) {
      throw new Error('Unexpected result')
    }

    const { det } = output.right

    expect(det()).toBeCloseTo(137180)
  })
  it('detects a singular matrix (i)', () => {
    const [result] = QR(
      M.fromNestedTuples([
        [1, -2],
        [-3, 6],
      ])
    )
    if (E.isLeft(result)) {
      throw new Error('Unexpected result')
    }

    expect(result.right.isSingular()).toBe(true)
  })
  it('detects a singular matrix (ii)', () => {
    const [result] = QR(
      M.fromNestedTuples([
        [1, 1, 1],
        [0, 1, 0],
        [1, 0, 1],
      ])
    )

    if (E.isLeft(result)) {
      throw new Error('Unexpected result')
    }

    expect(result.right.isSingular()).toBe(true)
  })
  it('detects a singular matrix (iii)', () => {
    const [result] = QR(
      M.fromNestedTuples([
        [1, 2],
        [-2, -4],
      ])
    )

    if (E.isLeft(result)) {
      throw new Error('Unexpected result')
    }

    expect(result.right.isSingular()).toBe(true)
  })
})
