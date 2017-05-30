/**
 * Options page.
 */

import {
    getPalette,
    setPalette,
    getBase,
    setBase,
} from './palette';


/**
 * Map from palette color to human-readable label.
 * @type {Object}
 */
const PALETTE_LABELS = {
    black: 'Black',
    red: 'Red',
    green: 'Green',
    yellow: 'Yellow',
    blue: 'Blue',
    magenta: 'Magenta',
    cyan: 'Cyan',
    lightgray: 'Light Gray',
    darkgray: 'Dark Gray',
    lightred: 'Light Red',
    lightgreen: 'Light Green',
    lightyellow: 'Light Yellow',
    lightblue: 'Light Blue',
    lightmagenta: 'Light Magenta',
    lightcyan: 'Light Cyan',
    white: 'White',
};


/**
 * Map from base setting to human-readable label.
 * @type {Object}
 */
const BASE_LABELS = {
    foreground: 'Foreground',
    background: 'Background',
};


/**
 * CSS class to identify palette inputs.
 * @type {String}
 */
const PALETTE_CLS = 'palette-input';


/**
 * CSS class to identify base inputs.
 * @type {String}
 */
const BASE_CLS = 'base-input';


/**
 * Class to mark color inputs.
 * @type {String}
 */
const CLR_INPUT_CLS = '-clr';


/**
 * Class to mark swatch class.
 * @type {String}
 */
const SWATCH_CLS = '-swatch';


/**
 * Generate HTML for a config section.
 * @param  {Object} config
 * @param  {Object} labels
 * @param  {String} className
 */
function generateConfigHtml(config, labels, className) {
    const opts = Object.keys(config).map(key => {
        const label = labels[key] || key;
        const value = config[key];
        return `<div>
            <span class="col1">${label}</span>
            <span class="col2">
                <input type="text"
                       value="${value}"
                       data-key="${key}"
                       class="${className} ${CLR_INPUT_CLS}" />
            </span>
            <span class="col3">
                <i class="${SWATCH_CLS}" data-key="${key}"></i>
            </span>
        </div>`;
    });

    return opts.join('');
}


/**
 * Render palette config section.
 * @param  {Object} palette
 */
function renderPalette(palette) {
    const html = generateConfigHtml(palette, PALETTE_LABELS, PALETTE_CLS);
    document.getElementById('palette').innerHTML = html;
}


/**
 * Render base config section.
 * @param  {Object} base
 */
function renderBase(base) {
    const html = generateConfigHtml(base, BASE_LABELS, BASE_CLS);
    document.getElementById('base').innerHTML = html;
}


/**
 * Show a message for a given time.
 * @param  {String} msg - message to show
 * @param  {Number} time - time to show message (0 means forever).
 */
function showMessage(msg, time) {
    const statusEl = document.getElementById('status');
    statusEl.innerText = msg;
    if (time) {
        setTimeout(() => {
            statusEl.innerText = '';
        }, time);
    }
}


/**
 * Save the current palette.
 */
function buildConfig(cls) {
    const els = Array.from(document.getElementsByClassName(cls));
    return els.reduce((map, el) => {
        const clr = el.dataset.key;
        map[clr] = el.value;
        return map;
    }, {});
}


/**
 * Save options.
 */
function save(e) {
    e.target.disabled = true;
    Promise.all([
        setPalette(buildConfig(PALETTE_CLS)),
        setBase(buildConfig(BASE_CLS)),
    ]).then(() => {
        showMessage('Saved!', 1500);
        e.target.disabled = false;
    });
}


/**
 * Update the swatch for a target input.
 * @param  {InputElement} target
 */
function updateSwatch(target) {
    const key = target.dataset.key;
    const swatch = document.querySelector(`.${SWATCH_CLS}[data-key=${key}]`);
    swatch.style.backgroundColor = target.value;
}


/**
 * Delegated keyUp event handlers.
 * @type {Object}
 */
const DELEGATED_KEY_HANDLERS = {
    [CLR_INPUT_CLS]: e => {
        updateSwatch(e.target);
    }
};


/**
 * Sync colors from the inputs to the swatches.
 */
function syncColors() {
    const els = Array.from(document.getElementsByClassName(CLR_INPUT_CLS));
    els.forEach(el => updateSwatch(el));
}


/**
 * Handle a key up event.
 * @param  {Event} e
 */
function handleKeyUpEvent(e) {
    Object.keys(DELEGATED_KEY_HANDLERS).forEach(cls => {
        if (e.target.classList.contains(cls)) {
            DELEGATED_KEY_HANDLERS[cls](e);
        }
    });
}


/**
 * Install event handlers on document.
 */
function setHandlers() {
    document.body.addEventListener('keyup', handleKeyUpEvent);
}


/**
 * Render options.
 */
function render() {
    Promise.all([
        getPalette().then(renderPalette),
        getBase().then(renderBase),
    ]).then(() => {
        setHandlers();
        syncColors();
    });
}


/**
 * Initialize page.
 */
function init() {
    document.getElementById('save').addEventListener('click', save);
}


init();
render();
