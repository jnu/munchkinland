/**
 * Content script to parse ANSI color codes and apply them as CSS.
 */


/**
 * Create an shallow clone of an object merged with another object.
 * @param  {Object} obj
 * @param  {Object} newVals
 * @return {Object}
 */
function update(obj, newVals) {
    return Object.assign({}, obj, newVals);
}


/**
 * Formatters. Each corresponds to an ANSI code. Each is a function that
 * accepts the current style object, the default style object, and the color
 * palette, and produces a new fully-specified style object.
 * @type {Object}
 */
var FORMAT = {
    0: function(style, defaults, palette) {
        return update(style, defaults);
    },
    1: function(style, defaults, palette) {
        return update(style, { 'font-weight': 'bold' });
    },
    2: function(style, defaults, palette) {
        return update(style, { opacity:  0.75 });
    },
    4: function(style, defaults, palette) {
        return update(style, { 'text-decoration': 'underline' });
    },
    5: function(style, defaults, palette) {
        /* TODO: implement blink */
        return style;
    },
    6: function(style, defaults, palette) {
        return update(style, {
            'background-color': style.color,
            color: style['background-color']
        });
    },
    8: function(style, defaults, palette) {
        return update(style, {
            visibility: 'hidden'
        });
    },
    21: function(style, defaults, palette) {
        return update(style, {
            'font-weight': defaults['font-weight']
        });
    },
    22: function(style, defaults, palette) {
        return update(style, {
            opacity: defaults.opacity
        });
    },
    24: function(style, defaults, palette) {
        return update(style, {
            'text-decoration': defaults['text-decoration']
        });
    },
    25: function(style, defaults, palette) {
        /* TODO implement blink */
        return style;
    },
    27: function(style, defaults, palette) {
        return update(style, {
            color: style['background-color'],
            'background-color': style.color
        });
    },
    28: function(style, defaults, palette) {
        return update(style, {
            visibility: defaults.visibility
        });
    },
    30: function(style, defaults, palette) {
        return update(style, {
            color: palette.black
        });
    },
    31: function(style, defaults, palette) {
        return update(style, {
            color: palette.red
        });
    },
    32: function(style, defaults, palette) {
        return update(style, {
            color: palette.green
        });
    },
    33: function(style, defaults, palette) {
        return update(style, {
            color: palette.yellow
        });
    },
    34: function(style, defaults, palette) {
        return update(style, {
            color: palette.blue
        });
    },
    35: function(style, defaults, palette) {
        return update(style, {
            color: palette.magenta
        });
    },
    36: function(style, defaults, palette) {
        return update(style, {
            color: palette.cyan
        });
    },
    37: function(style, defaults, palette) {
        return update(style, {
            color: palette.lightgray
        });
    },
    39: function(style, defaults, palette) {
        return update(style, {
            color: defaults.color
        });
    },
    40: function(style, defaults, palette) {
        return update(style, {
            'background-color': palette.black
        });
    },
    41: function(style, defaults, palette) {
        return update(style, {
            'background-color': palette.red
        });
    },
    42: function(style, defaults, palette) {
        return update(style, {
            'background-color': palette.green
        });
    },
    43: function(style, defaults, palette) {
        return update(style, {
            'background-color': palette.yellow
        });
    },
    44: function(style, defaults, palette) {
        return update(style, {
            'background-color': palette.blue
        });
    },
    45: function(style, defaults, palette) {
        return update(style, {
            'background-color': palette.magenta
        });
    },
    46: function(style, defaults, palette) {
        return update(style, {
            'background-color': palette.cyan
        });
    },
    47: function(style, defaults, palette) {
        return update(style, {
            'background-color': palette.lightgray
        });
    },
    49: function(style, defaults, palette) {
        return update(style, {
            'background-color': defaults.backgroundColor
        });
    },
    90: function(style, defaults, palette) {
        return update(style, {
            color: palette.darkgray
        });
    },
    91: function(style, defaults, palette) {
        return update(style, {
            color: palette.lightred
        });
    },
    92: function(style, defaults, palette) {
        return update(style, {
            color: palette.lightgreen
        });
    },
    93: function(style, defaults, palette) {
        return update(style, {
            color: palette.lightyellow
        });
    },
    94: function(style, defaults, palette) {
        return update(style, {
            color: palette.lightblue
        });
    },
    95: function(style, defaults, palette) {
        return update(style, {
            color: palette.lightmagenta
        });
    },
    96: function(style, defaults, palette) {
        return update(style, {
            color: palette.lightcyan
        });
    },
    97: function(style, defaults, palette) {
        return update(style, {
            color: palette.white
        });
    },
    100: function(style, defaults, palette) {
        return update(style, {
            'background-color': palette.darkgray
        });
    },
    101: function(style, defaults, palette) {
        return update(style, {
            'background-color': palette.lightred
        });
    },
    102: function(style, defaults, palette) {
        return update(style, {
            'background-color': palette.lightgreen
        });
    },
    103: function(style, defaults, palette) {
        return update(style, {
            'background-color': palette.lightyellow
        });
    },
    104: function(style, defaults, palette) {
        return update(style, {
            'background-color': palette.lightblue
        });
    },
    105: function(style, defaults, palette) {
        return update(style, {
            'background-color': palette.lightmagenta
        });
    },
    106: function(style, defaults, palette) {
        return update(style, {
            'background-color': palette.lightcyan
        });
    },
    107: function(style, defaults, palette) {
        return update(style, {
            'background-color': palette.white
        });
    },
}


/**
 * Color palette. TODO: make this customizable.
 * @type {Object}
 */
var PALETTE = {
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
}


/**
 * Default styles. TODO: make these customizable.
 * @type {Object}
 */
var DEFAULTS = {
    'background-color': PALETTE.black,
    color: PALETTE.white,
    visibility: 'visible',
    'text-decoration': 'none',
    'font-weight': 'normal',
    opacity: 1.0,
};


/**
 * Escape character.
 * @type {String}
 */
var ESCAPE = '\x1b';


/**
 * Convert object to style string.
 * @param  {Object} style
 * @return {String}
 */
function toStyleString(style) {
    var str = '';
    for (var key in style) {
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
 * Apply colorization.
 */
function colorize() {
    // Apply default styles ASAP.
    document.body.style = toStyleString(DEFAULTS);

    var style = update({}, DEFAULTS);
    var output = '';
    var text = document.body.innerText;
    var stack = 0;
    var char, tmp;

    // Rewrite content one char at a time.
    for (var i = 0; i < text.length; i++) {
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
            if (!FORMAT.hasOwnProperty(tmp)) {
                console.warn('[Munchkinland] No formatter for escape code', tmp);
            } else {
                style = FORMAT[tmp](style, DEFAULTS, PALETTE);
            }

            // Close preceding tags if there are any.
            // TODO: actually using cascading styles might be better for perf.
            char = '';
            if (stack > 0) {
                char += '</span>';
                stack--;
            }

            // Create a new block with the current style.
            // TODO: using CSS may be better for perf.
            char += '<span style="' + toStyleString(style) + '">';
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
    var preStyle = toStyleString({
        'word-wrap': 'break-word',
        'white-space': 'pre-wrap'
    });

    // Rewrite document content.
    // TODO: use a less brute-force updating technique?
    document.body.innerHTML = '<pre style="' + preStyle + '">' + output + '</pre>';
}


// Ask background script whether to colorize this page.
chrome.runtime.sendMessage({
    action: 'analyze'
}, function(response) {
    if (response.colorize) {
        colorize();
    }

    // Let background know we're done with this.
    chrome.runtime.sendMessage({
        action: 'thanks'
    });
});
