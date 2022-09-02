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
    put: (name: any, data: any, cb: any) => any;
    set: (name: any, data: any, cb: any) => any;
    get: (name: string | number, cb?: (e: Error) => any) => any;
    delete: (name: any, cb: any) => void;
    putSync: (name: any, data: any) => void;
    setSync: (name: any, data: any) => void;
    getSync: <T = string>(name: string) => T;
    deleteSync: (name: any) => void;
    keys: (cb: any) => any;
    keysSync: () => any[];
    /**
     * get all values
     */
    valuesSync: () => any[];
    /**
     * delete the folder and files of a persistent cache
     */
    unlink: (cb: any) => any;
};
export default cache;
