import * as cache from 'memory-cache';
import * as _ from 'lodash';

class CachedEntity {
    private prefix: string;
    protected cache: any;

    constructor (prefix: string) {
        this.prefix = `${prefix}-`;
        this.cache = {
            put: (key, value, time = undefined, callback = undefined) => {
                cache.put(this.prefix + key, value, time, callback);
            },
            get: (key) => {
                return cache.get(this.prefix + key);
            },
            getKeys: () => {
                return _.filter(cache.keys(), (key: string) => {
                    _.startsWith(key, this.prefix);
                });
            },
            clear: () => {
                const keys = this.cache.getKeys();
                keys.map((key: string) => {
                    if (_.startsWith(key, this.prefix)) {
                        cache.del(key);
                    }
                });
                cache.clear();
            }
        };
    }
}

export { CachedEntity };
