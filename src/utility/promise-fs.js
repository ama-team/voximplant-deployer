/**
 * @module utility/promise-fs
 */

import filesystem from 'fs'
import Promise from 'promise'

/**
 * @class
 */
class PromiseFs {

    static read(path, options) {
        return new Promise((resolve, reject) => {
            filesystem.readFile(path, options, (error, content) => {
                if (error) {
                    return reject(error);
                }
                resolve(content);
            })
        });
    }

    static write(path, content, options) {
        return new Promise((resolve, reject) => {
            filesystem.writeFile(path, content, options, (error, content) => {
                if (error) {
                    return reject(error);
                }
                resolve(content);
            })
        });
    }
}

export default PromiseFs;