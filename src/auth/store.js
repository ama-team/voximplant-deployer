/**
 * @module auth/store
 */

import yaml from 'js-yaml';
import PromiseFs from '../utility/promise-fs';
import Authentication from './authentication';

/**
 * @class
 */
class Store {

    constructor(location) {
        this.location = location;
    }

    get(id) {
        return this
            .getAll()
            .then(data => data[id] ? new Authentication(data[id]) : null);
    }

    getAll() {
        return PromiseFs
            .read(this.location, 'utf-8')
            .then(content => yaml.safeLoad(content), error => {})
            .then(data => data ? data : {});
    }

    set(id, authentication) {
        return this.getAll()
            .then(data => {
                data[id] = authentication;
                PromiseFs.write(this.location, yaml.safeDump(data), 'utf-8');
            });
    }
}

export default Store;