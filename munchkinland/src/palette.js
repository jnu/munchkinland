/**
 * Define color palette and storage accessors.
 */

import { compareLists } from './util';


/**
 * Color palette. TODO: make this customizable.
 * @type {Object}
 */
const DEFAULT_PALETTE = {
    black: '#222',
    red: '#c10',
    green: '#58dc0b',
    yellow: '#fe0',
    blue: '#2d57ff',
    magenta: '#a19',
    cyan: '#1bf',
    lightgray: '#b9b9b9',
    darkgray: '#797979',
    lightred: '#f65',
    lightgreen: '#8d4',
    lightyellow: '#fe6',
    lightblue: '#58f',
    lightmagenta: '#d8e',
    lightcyan: '#8ef',
    white: '#fff',
};


/**
 * Base style settings.
 * @type {Object}
 */
const DEFAULT_BASE = {
    background: 'white',
    foreground: 'black',
};


/**
 * Get the palette from storage. Use hard-coded palette as fallback.
 * @return {Promise<Object>}
 */
export function getPalette() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(DEFAULT_PALETTE, resolve);
    });
}


/**
 * Persist palette settings
 * @param {Object} palette
 * @return {Promise<Object>}
 */
export function setPalette(palette) {
    return new Promise((resolve, reject) => {
        if (!compareLists(Object.keys(palette), Object.keys(DEFAULT_PALETTE))) {
            reject('invalid palette');
        } else {
            chrome.storage.sync.set(palette, resolve);
        }
    });
}


/**
 * Get the base settings from storage, using hardcoded ones as fallback.
 * @return {Promise<Object>}
 */
export function getBase() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(DEFAULT_BASE, resolve);
    });
}


/**
 * Set the base settings in storage.
 * @param {Promise<Object>} base
 */
export function setBase(base) {
    return new Promise((resolve, reject) => {
        if (!compareLists(Object.keys(base), Object.keys(DEFAULT_BASE))) {
            reject('invalid base settings');
        } else {
            chrome.storage.sync.set(base, resolve);
        }
    });
}
