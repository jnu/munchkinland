/**
 * Create an shallow clone of an object merged with another object.
 * @param  {Object} obj
 * @param  {Object} newVals
 * @return {Object}
 */
export function update(obj, newVals) {
    return Object.assign({}, obj, newVals);
}


/**
 * Convert object to style string.
 * @param  {Object} style
 * @return {String}
 */
export function toStyleString(style) {
    let str = '';

    for (let key in style) {
        if (style.hasOwnProperty(key)) {
            if (str.length > 0) {
                str += '; ';
            }
            str += key + ': ' + style[key];
        }
    }

    return str;
}


/**
 * Check if two lists are equivalent.
 * @param  {Any[]} a
 * @param  {Any[]} b
 * @return {Boolean}
 */
export function compareLists(a, b) {
    return JSON.stringify(a.sort()) === JSON.stringify(b.sort());
}
