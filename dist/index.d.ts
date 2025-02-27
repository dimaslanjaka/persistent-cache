/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import "./JSON";
export interface Opt {
    /**
     * folder cache
     * @description The base directory where `persistent-cache` will save its caches.
     *
     * Defaults to the main modules directory
     */
    base: string;
    /**
     * cache instance name
     * @description The name of the cache. Determines the name of the created folder where the data is stored, which is just `base + name`.
     *
     * Defaults to `cache`
     */
    name: string;
    /**
     * expired in milliseconds
     * @description The amount of milliseconds a cache entry should be valid for. If not set, cache entries are not invalidated (stay until deleted).
     *
     * Defaults to `undefined` (infinite)
     */
    duration: number;
    /**
     * Whether the cache should use memory caching or not (mirrors all cache data in the ram,
     * saving disk I/O and increasing performance).
     *
     * Defaults to `true`
     */
    memory: boolean;
    /**
     * Whether the cache should be persistent, aka if it should write its data to the disk
     * for later use or not. Set this to `false` to create a memory-only cache.
     *
     * Defaults to `true`
     */
    persist: boolean;
}
/**
 * Persistent Cache
 * @param options
 * @returns
 */
declare function cache(options?: Partial<Opt>): {
    /**
     * insert new data
     */
    put: (name: string, data: any, cb: {
        (err: NodeJS.ErrnoException): void;
        (e: Error, ...args: any[]): any;
    }) => any;
    /**
     * insert new data
     */
    set: (name: string, data: any, cb: {
        (err: NodeJS.ErrnoException): void;
        (e: Error, ...args: any[]): any;
    }) => any;
    /**
     * get data
     */
    get: (name: string, cb?: (e: Error) => any) => any;
    delete: (name: string, cb: {
        (e: Error, ...args: any[]): any;
        (err: NodeJS.ErrnoException): void;
    }) => void;
    putSync: (name: string, data: any) => void;
    setSync: (name: string, data: any) => void;
    getSync: <T = string>(name: string, fallback?: T) => T;
    deleteSync: (name: string) => void;
    keys: (cb: (e: Error, ...args: any[]) => any) => any;
    keysSync: () => string[];
    /**
     * get all values
     */
    valuesSync: () => any[];
    /**
     * delete the folder and files of a persistent cache
     */
    unlink: (cb: {
        (e: Error, ...args: any[]): any;
        (e: Error, ...args: any[]): any;
    }) => any;
};
export default cache;
export declare const persistentCache: typeof cache;
