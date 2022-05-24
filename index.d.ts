export interface Opt {
  base: string;
  name: string;
  duration: number;
}
declare function cache(options: Partial<Opt> = {}): {
  /**
   * Insert data
   */
  put: (name: string, data: any, callback: any) => any;
  /**
   * Retrieve data
   */
  get: <T>(name: string, callback: (err: Error, data: T) => any) => any;
  /**
   * Delete data
   */
  delete: (name: string, callback: any) => void;
  /**
   * Delete data synchronous
   */
  deleteSync: (name: string) => void;
  /**
   * Insert data synchronous
   */
  putSync: (name: string, data: any) => void;
  /**
   * Retrieve data synchronous
   */
  getSync: <T>(name: string) => T;

  /**
   * Getting available keys
   */
  keys: (callback: (keys: string[]) => any) => any;
  /**
   * Getting available keys synchronous
   */
  keysSync: () => string[];
  /**
   * delete the folder and files of a persistent cache
   */
  unlink: (callback: any) => any;
};
export default cache;
