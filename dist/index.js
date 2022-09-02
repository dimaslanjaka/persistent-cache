"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const mkdirp_no_bin_1 = __importDefault(require("mkdirp-no-bin"));
const rmdir_1 = __importDefault(require("rmdir"));
const upath_1 = __importDefault(require("upath"));
require("./JSON");
function exists(dir) {
    try {
        fs_1.default.accessSync(dir);
    }
    catch (err) {
        return false;
    }
    return true;
}
function safeCb(cb) {
    if (typeof cb === "function")
        return cb;
    return function () {
        //
    };
}
/**
 * write to file recursive
 * @param {string} filepath
 * @param {any} content
 */
function writeFile(filepath, content) {
    if (!fs_1.default.existsSync(upath_1.default.dirname(filepath))) {
        fs_1.default.mkdirSync(upath_1.default.dirname(filepath), { recursive: true });
    }
    fs_1.default.writeFileSync(filepath, content);
}
/**
 * Persistent Cache
 * @param options
 * @returns
 */
function cache(options = {}) {
    options = options || {};
    const base = upath_1.default.normalize((options.base ||
        (require.main ? upath_1.default.dirname(require.main.filename) : undefined) ||
        process.cwd()) + "/cache");
    if (!fs_1.default.existsSync(upath_1.default.dirname(base)))
        fs_1.default.mkdirSync(upath_1.default.dirname(base), { recursive: true });
    const cacheDir = upath_1.default.normalize(base + "/" + (options.name || "cache"));
    const cacheInfinitely = !(typeof options.duration === "number");
    const cacheDuration = options.duration;
    const ram = typeof options.memory == "boolean" ? options.memory : true;
    const persist = typeof options.persist == "boolean" ? options.persist : true;
    const memoryCache = {};
    if (persist && !exists(cacheDir))
        mkdirp_no_bin_1.default.sync(cacheDir);
    function buildFilePath(name) {
        return upath_1.default.normalize(cacheDir + "/" + name + ".json");
    }
    function buildCacheEntry(data) {
        return {
            cacheUntil: !cacheInfinitely
                ? new Date().getTime() + cacheDuration
                : undefined,
            data: data,
        };
    }
    function put(name, data, cb) {
        const entry = buildCacheEntry(data);
        if (persist)
            fs_1.default.writeFile(buildFilePath(name), JSON.stringify(entry), cb);
        if (ram) {
            entry.data = JSON.stringify(entry.data);
            memoryCache[name] = entry;
            if (!persist)
                return safeCb(cb)(null);
        }
    }
    function putSync(name, data) {
        const entry = buildCacheEntry(data);
        if (persist)
            writeFile(buildFilePath(name), JSON.stringify(entry));
        if (ram) {
            memoryCache[name] = entry;
            memoryCache[name].data = JSON.stringify(memoryCache[name].data);
        }
    }
    function get(name, cb) {
        if (ram && !!memoryCache[name]) {
            let entry = memoryCache[name];
            if (!!entry.cacheUntil && new Date().getTime() > entry.cacheUntil) {
                return safeCb(cb)(null, undefined);
            }
            try {
                entry = JSON.parse(entry.data);
            }
            catch (e) {
                return safeCb(cb)(e);
            }
            return safeCb(cb)(null, entry);
        }
        fs_1.default.readFile(buildFilePath(name), "utf8", onFileRead);
        function onFileRead(err, content) {
            if (err != null) {
                return safeCb(cb)(null, undefined);
            }
            let entry;
            try {
                entry = JSON.parse(content);
            }
            catch (e) {
                return safeCb(cb)(e);
            }
            if (!!entry.cacheUntil && new Date().getTime() > entry.cacheUntil) {
                return safeCb(cb)(null, undefined);
            }
            return safeCb(cb)(null, entry.data);
        }
    }
    function getSync(name) {
        if (ram && !!memoryCache[name]) {
            const entry = memoryCache[name];
            if (entry.cacheUntil && new Date().getTime() > entry.cacheUntil) {
                return undefined;
            }
            return JSON.parse(entry.data);
        }
        let data;
        try {
            data = JSON.parse(fs_1.default.readFileSync(buildFilePath(name), "utf8"));
        }
        catch (e) {
            return undefined;
        }
        if (data.cacheUntil && new Date().getTime() > data.cacheUntil)
            return undefined;
        return data.data;
    }
    function deleteEntry(name, cb) {
        if (ram) {
            delete memoryCache[name];
            if (!persist)
                safeCb(cb)(null);
        }
        fs_1.default.unlink(buildFilePath(name), cb);
    }
    function deleteEntrySync(name) {
        if (ram) {
            delete memoryCache[name];
            if (!persist)
                return;
        }
        fs_1.default.unlinkSync(buildFilePath(name));
    }
    function unlink(cb) {
        if (persist)
            return (0, rmdir_1.default)(cacheDir, safeCb(cb));
        safeCb(cb)(null);
    }
    function transformFileNameToKey(fileName) {
        return fileName.slice(0, -5);
    }
    function resolveDir(dirPath) {
        if (!fs_1.default.existsSync(dirPath))
            fs_1.default.mkdirSync(dirPath, { recursive: true });
    }
    function keys(cb) {
        cb = safeCb(cb);
        if (ram && !persist)
            return cb(null, Object.keys(memoryCache));
        fs_1.default.readdir(cacheDir, onDirRead);
        function onDirRead(err, files) {
            return err ? cb(err) : cb(err, files.map(transformFileNameToKey));
        }
    }
    function keysSync() {
        if (ram && !persist)
            return Object.keys(memoryCache);
        resolveDir(cacheDir);
        return fs_1.default.readdirSync(cacheDir).map(transformFileNameToKey);
    }
    function valuesSync() {
        return keysSync().map((key) => {
            return get(key);
        });
    }
    return {
        put: put,
        set: put,
        get: get,
        delete: deleteEntry,
        putSync: putSync,
        setSync: putSync,
        getSync: getSync,
        deleteSync: deleteEntrySync,
        keys: keys,
        keysSync: keysSync,
        /**
         * get all values
         */
        valuesSync: valuesSync,
        /**
         * delete the folder and files of a persistent cache
         */
        unlink,
    };
}
exports.default = cache;
