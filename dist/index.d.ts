/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import "./JSON";
export interface Opt {
    [key: string]: any;
    base: string;
    name: string;
    duration: number;
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
    getSync: <T = string>(name: string) => T;
    deleteSync: (name: any) => void;
    keys: (cb: (e: Error, ...args: any[]) => any) => any;
    keysSync: () => any[];
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
