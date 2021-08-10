import type { Matrix } from "../types";

export class Utils {
    /**
 * Checks if n is between start and up to, but not including, end.
 * If end is not specified, it's set to start with start then set to 0.
 * If start is greater than end the params are swapped to support negative ranges.
 * @param {Number} num - The number to check.
 * @param {Number} [start=0] - The start of the range.
 * @param {Number} end - The end of the range.
 */
    private inRange(num: number, start: number = 0, end?: number): boolean {
        if (!end) {
            end = start;
            start = 0;
        }
        return num >= Math.min(start, end) && num < Math.max(start, end);
    }

    /**
     * Invokes the iteratee n times, returning an array of the results of each invocation.
     * @param {Number} n - The number of times to invoke the iteratee public.
     * @param {public} [func = i => i] - The public invoked each iteration.
     */
    public times(n: number, cb = (i: number) => i) {
        return Array.from({ length: n }).map((_, i) => cb(i));
    }

    /**
     * Creates a public that returns value.
     * @param {*} value - The value to return from the new public.
     */
    public constant<T>(value: T) {
        return () => value;
    }

    /**
     * Creates a public that invokes func with boundArgs prepended to the arguments it receives.
     * @param {public} func - The public to partially apply arguments to.
     * @param  {...any} boundArgs - The arguments to be partially applied.
     */
    public partial<R extends Function, T>(func: R, ...boundArgs: T[]) {
        return (...remainingArgs: T[]) => {
            return func(...boundArgs, ...remainingArgs) as T[];
        };
    }

    public getMatrixHeight = (matrix: Matrix) => matrix.length;
    public getMatrixWidth = (matrix: Matrix) => matrix[0].length;
    /**
     * Combines two matrixes (a board and a piece) and returns the new matrix
     * @param {Array} destinationMatrix The board matrix
     * @param {Array} sourceMatrix The piece matrix
     * @param {number} [offsetX=0] The x location of the piece
     * @param {number} [offsetY=0] The y location of the piece
     * @param {boolean} [overwrite=true] Whether to overwrite the board matrix
     */
    public combineMatrices(
        destinationMatrix: Matrix,
        sourceMatrix: Matrix,
        offsetX = 0,
        offsetY = 0,
        overwrite = true
    ): Matrix {
        const lastXIndex = this.getMatrixWidth(sourceMatrix) + offsetX - 1;
        const lastYIndex = this.getMatrixHeight(sourceMatrix) + offsetY - 1;

        const newMatrix = destinationMatrix.map((rows, y) => {
            return rows.map((value, x) => {
                if (this.inRange(x, offsetX, lastXIndex + 1) && this.inRange(y, offsetY, lastYIndex + 1)) {
                    if (overwrite || !value) {
                        return sourceMatrix[y - offsetY][x - offsetX];
                    }
                }
                return value;
            });
        });

        return newMatrix;
    }

    public moduleOf(x: number, m: number) {
        return (x % m + m) % m;
    }

    /** Reverse a matrix*/
    public mirror = (matrix: Matrix): Matrix => matrix.map(row => row.reverse());
}

export const utils = new Utils();