/**
 * Formatters. Each corresponds to an ANSI code. Each is a function that
 * accepts the current style object, the default style object, and the color
 * palette, and produces a new fully-specified style object.
 * @type {Object}
 */

import { update } from './util';


const FORMATTERS = {
    0: (style, defaults, palette) => {
        return update(style, defaults);
    },
    1: (style, defaults, palette) => {
        return update(style, { 'font-weight': 'bold' });
    },
    2: (style, defaults, palette) => {
        return update(style, { opacity:  0.75 });
    },
    4: (style, defaults, palette) => {
        return update(style, { 'text-decoration': 'underline' });
    },
    5: (style, defaults, palette) => {
        /* TODO: implement blink */
        return style;
    },
    6: (style, defaults, palette) => {
        return update(style, {
            'background-color': style.color,
            color: style['background-color']
        });
    },
    8: (style, defaults, palette) => {
        return update(style, {
            visibility: 'hidden'
        });
    },
    21: (style, defaults, palette) => {
        return update(style, {
            'font-weight': defaults['font-weight']
        });
    },
    22: (style, defaults, palette) => {
        return update(style, {
            opacity: defaults.opacity
        });
    },
    24: (style, defaults, palette) => {
        return update(style, {
            'text-decoration': defaults['text-decoration']
        });
    },
    25: (style, defaults, palette) => {
        /* TODO implement blink */
        return style;
    },
    27: (style, defaults, palette) => {
        return update(style, {
            color: style['background-color'],
            'background-color': style.color
        });
    },
    28: (style, defaults, palette) => {
        return update(style, {
            visibility: defaults.visibility
        });
    },
    30: (style, defaults, palette) => {
        return update(style, {
            color: palette.black
        });
    },
    31: (style, defaults, palette) => {
        return update(style, {
            color: palette.red
        });
    },
    32: (style, defaults, palette) => {
        return update(style, {
            color: palette.green
        });
    },
    33: (style, defaults, palette) => {
        return update(style, {
            color: palette.yellow
        });
    },
    34: (style, defaults, palette) => {
        return update(style, {
            color: palette.blue
        });
    },
    35: (style, defaults, palette) => {
        return update(style, {
            color: palette.magenta
        });
    },
    36: (style, defaults, palette) => {
        return update(style, {
            color: palette.cyan
        });
    },
    37: (style, defaults, palette) => {
        return update(style, {
            color: palette.lightgray
        });
    },
    39: (style, defaults, palette) => {
        return update(style, {
            color: defaults.color
        });
    },
    40: (style, defaults, palette) => {
        return update(style, {
            'background-color': palette.black
        });
    },
    41: (style, defaults, palette) => {
        return update(style, {
            'background-color': palette.red
        });
    },
    42: (style, defaults, palette) => {
        return update(style, {
            'background-color': palette.green
        });
    },
    43: (style, defaults, palette) => {
        return update(style, {
            'background-color': palette.yellow
        });
    },
    44: (style, defaults, palette) => {
        return update(style, {
            'background-color': palette.blue
        });
    },
    45: (style, defaults, palette) => {
        return update(style, {
            'background-color': palette.magenta
        });
    },
    46: (style, defaults, palette) => {
        return update(style, {
            'background-color': palette.cyan
        });
    },
    47: (style, defaults, palette) => {
        return update(style, {
            'background-color': palette.lightgray
        });
    },
    49: (style, defaults, palette) => {
        return update(style, {
            'background-color': defaults.backgroundColor
        });
    },
    90: (style, defaults, palette) => {
        return update(style, {
            color: palette.darkgray
        });
    },
    91: (style, defaults, palette) => {
        return update(style, {
            color: palette.lightred
        });
    },
    92: (style, defaults, palette) => {
        return update(style, {
            color: palette.lightgreen
        });
    },
    93: (style, defaults, palette) => {
        return update(style, {
            color: palette.lightyellow
        });
    },
    94: (style, defaults, palette) => {
        return update(style, {
            color: palette.lightblue
        });
    },
    95: (style, defaults, palette) => {
        return update(style, {
            color: palette.lightmagenta
        });
    },
    96: (style, defaults, palette) => {
        return update(style, {
            color: palette.lightcyan
        });
    },
    97: (style, defaults, palette) => {
        return update(style, {
            color: palette.white
        });
    },
    100: (style, defaults, palette) => {
        return update(style, {
            'background-color': palette.darkgray
        });
    },
    101: (style, defaults, palette) => {
        return update(style, {
            'background-color': palette.lightred
        });
    },
    102: (style, defaults, palette) => {
        return update(style, {
            'background-color': palette.lightgreen
        });
    },
    103: (style, defaults, palette) => {
        return update(style, {
            'background-color': palette.lightyellow
        });
    },
    104: (style, defaults, palette) => {
        return update(style, {
            'background-color': palette.lightblue
        });
    },
    105: (style, defaults, palette) => {
        return update(style, {
            'background-color': palette.lightmagenta
        });
    },
    106: (style, defaults, palette) => {
        return update(style, {
            'background-color': palette.lightcyan
        });
    },
    107: (style, defaults, palette) => {
        return update(style, {
            'background-color': palette.white
        });
    },
};


/**
 * Default no-op formatter in case an undefined sequence is requested.
 */
function noopFormatter(style, defaults, palette) {
    return style;
}


/**
 * Get a formatter by ID with a safe fallback.
 * @param  {Number} id - escape sequence
 * @return {Function}
 */
export function getFormatter(id) {
    if (FORMATTERS.hasOwnProperty(id)) {
        return FORMATTERS[id];
    } else {
        console.warn(`No formatter defined for code ${id}`);
        return noopFormatter;
    }
}
