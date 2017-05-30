/**
 * Content script to parse ANSI color codes and apply them as CSS.
 */

import { getFormatter } from './formatters';
import { getPalette, getBase } from './palette';
import { update, toStyleString } from './util';


/**
 * Default styles. TODO: make these customizable.
 * @type {Object}
 */
const getDefaultStyle = (palette, base) => ({
    'background-color': palette.hasOwnProperty(base.background) ?
        palette[base.background] : base.background,
    color: palette.hasOwnProperty(base.foreground) ?
        palette[base.foreground] : base.foreground,
    visibility: 'visible',
    'text-decoration': 'none',
    'font-weight': 'normal',
    opacity: 1.0,
});


/**
 * Escape character.
 * @type {String}
 */
const ESCAPE = '\x1b';


/**
 * Apply colorization.
 * @param  {Object} base
 * @param  {Object} palette
 */
function colorize(base, palette) {
    // Get default (base) styles.
    const defaults = getDefaultStyle(palette, base);

    // Apply default styles ASAP.
    document.body.style = toStyleString(defaults);
    const text = document.body.innerText;

    let style = update({}, defaults);
    let output = '';
    let stack = 0;
    let char, tmp;

    // Rewrite content one char at a time.
    for (let i = 0; i < text.length; i++) {
        char = text[i];

        // Check out escape sequences.
        if (char === ESCAPE) {
            tmp = '';
            char = '';

            // TODO: this may break some pages that aren't actually ANSI color
            // codes. We should do cleaner look-ahead matching to be sure only
            // to replace color codes.
            while (tmp !== 'm') {
                tmp = text[++i];
                if (/\d/.test(tmp)) {
                    char += tmp;
                }
            }

            tmp = +char;
            style = getFormatter(tmp)(style, defaults, palette);

            // Close preceding tags if there are any.
            // TODO: actually using cascading styles might be better for perf.
            char = '';
            if (stack > 0) {
                char += '</span>';
                stack--;
            }

            // Create a new block with the current style.
            // TODO: using CSS may be better for perf.
            char += `<span style="${toStyleString(style)}">`;
            stack++;
        }

        output += char;
    }

    // Close up any SPANs that were not closed.
    while (stack-- > 0) {
        output += '</span>';
    }

    // Create the PRE wrapper format. This is modeled off the default one
    // used by Chrome to display Content-Type: text/plain.
    const preStyle = toStyleString({
        'word-wrap': 'break-word',
        'white-space': 'pre-wrap',
    });

    // Rewrite document content.
    // TODO: use a less brute-force updating technique?
    document.body.innerHTML = `<pre style="${preStyle}">${output}</pre>`;
}


/**
 * Handle analyze response from background script.
 * @param  {Object} response
 */
function handleAnalyzeResponse(response) {
    if (response.colorize) {
        Promise.all([
            getBase(),
            getPalette(),
        ]).then(([base, palette]) => colorize(base, palette));
    }

    // Let background know we're done with this.
    chrome.runtime.sendMessage({
        action: 'thanks',
    });
}


/**
 * Initialize page actions.
 */
function init() {
    chrome.runtime.sendMessage({
        action: 'analyze',
    }, handleAnalyzeResponse);
}


init();
