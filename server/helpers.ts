import { DateTime } from 'luxon';

export function standardFormatDate(date: DateTime<boolean>): string {
    return date.toLocaleString(
        {
            weekday: 'short', month: 'short',
            day: '2-digit', hour: '2-digit',
            minute: '2-digit', second: '2-digit',
            timeZoneName: 'short'
        });
}

/**
 * Generate a random choice from an array.
 * @param arr Array to generate a random choice from. Must have length greater than 0, or an error is raised.
 * @returns A uniformly-random choice from `arr`.
 */
export function randomChoice<T>(arr: Array<T>): T {
    if (arr.length === 0) {
        throw new Error("Array size must be greater than 0.");
    }
    const randomElement = arr[Math.floor(Math.random() * arr.length)];
    if (!randomElement) {
        throw new Error("Random choice was undefined.");
    }
    return randomElement;
}

/**
 * Subtract two arrays.
 * 
 * @param a First array.
 * @param b Second array.
 * @returns Difference a - b. Equality between elements is compared objectively (i.e. with ===).
 */
export function arrayDifference<T>(a: readonly T[], b: readonly T[]): T[] {
    const bSet = new Set(b);
    return a.filter(x => !bSet.has(x));
}

/**
 * Union two arrays.
 * 
 * @param a First array.
 * @param b Second array.
 * @returns Union between a and b. Equality between elements is compared objectively (i.e. with ===).
 */
export function arrayUnion<T>(a: readonly T[], b: readonly T[]): T[] {
    return Array.from(new Set([...a, ...b]));
}

/**
 * Intersect two arrays.
 * 
 * @param a First array
 * @param b Second array.
 * @returns Intersection between a and b. Equality between elements is compared objectively (i.e. with ===)
 */
export function arrayIntersection<T>(a: readonly T[], b: readonly T[]): T[] {
    const bSet = new Set(b);
    return a.filter(x => bSet.has(x));
}

export function generateUniqueId(): string {
    const randomLargeNumber = Math.round(Math.random() * 100000)
    const ranomdNumberId = randomLargeNumber.toString(16);
    const timestampId = DateTime.now().toMillis().toString(16);
    return `${ranomdNumberId}${timestampId}`;
}