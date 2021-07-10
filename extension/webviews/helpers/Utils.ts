
export class Utils {
    /**
 * Checks if n is between start and up to, but not including, end.
 * If end is not specified, it's set to start with start then set to 0.
 * If start is greater than end the params are swapped to support negative ranges.
 * @param {Number} num - The number to check.
 * @param {Number} [start=0] - The start of the range.
 * @param {Number} end - The end of the range.
 */
    static inRange(num: number, start = 0, end?: number): boolean {
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
     static times(n: number, cb = (i: number) => i) {
        return Array.from({ length: n }).map((_, i) => cb(i));
    }

    /**
     * Creates a public that returns value.
     * @param {*} value - The value to return from the new public.
     */
     static constant<T>(value: T) {
        return () => value;
    }

    /**
     * Creates a public that invokes func with boundArgs prepended to the arguments it receives.
     * @param {public} func - The public to partially apply arguments to.
     * @param  {...any} boundArgs - The arguments to be partially applied.
     */
    static partial<R extends Function, T>(func: R, ...boundArgs: T[]) {
        return (...remainingArgs: T[]) => {
            return func(...boundArgs, ...remainingArgs) as T[];
        };
    }

    /**
     * Checks if a is less than b.
     * @param {*} a
     * @param {*} b
     */
     static lessThan = (a: number, b: number): boolean => a < b;
}