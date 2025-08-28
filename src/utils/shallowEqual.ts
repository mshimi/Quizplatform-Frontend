// src/utils/shallowEqual.ts
export function shallowEqual<T extends object>(
    a: T | null | undefined,
    b: T | null | undefined
): boolean {
    if (a === b) return true;
    if (!a || !b) return false;

    const aKeys = Object.keys(a) as Array<keyof T>;
    const bKeys = Object.keys(b) as Array<keyof T>;
    if (aKeys.length !== bKeys.length) return false;

    for (const key of aKeys) {
        if (!Object.prototype.hasOwnProperty.call(b, key)) return false;

        // typed, no `any`
        const av = (a as Record<PropertyKey, unknown>)[key as PropertyKey];
        const bv = (b as Record<PropertyKey, unknown>)[key as PropertyKey];
        if (av !== bv) return false;
    }
    return true;
}
