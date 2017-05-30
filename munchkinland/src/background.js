/**
 * Long-running script to intercept request headers and detect plain text.
 *
 * All plain text files are assumed to need color.
 * TODO make this configurable in settings.
 */


/**
 * Map from URL to info about that URL parsed from headers.
 * @type {Object}
 */
const state = {};


/**
 * Length of time (ms) to keep items in state before cleaning up. Usually the
 * state will be used pretty much immediately. But it's not uncommon for
 * background scripts to make AJAX requests for text/plain resources, which
 * won't naturally get cleaned up as they have no associated content script
 * that will request them.
 * @type {Number}
 */
const TIMEOUT = 1000 * 60 * 5;


/**
 * Test whether a URL should be colorized.
 * @param  {String} url
 * @return {Boolean}
 */
function shouldColorize(url) {
    return !!(state[url] && state[url].isText);
}


/**
 * Clear state associated with URL.
 * @param  {String} url
 */
function cleanup(url) {
    delete state[url];
}


/**
 * Clean up stale items in state to prevent unbounded memory usage.
 */
function cleanHouse() {
    const now = Date.now();
    const invalidated = [];

    for (let key in state) {
        if (state.hasOwnProperty(key)) {
            if ((now - state[key].ts) > TIMEOUT) {
                invalidated.push(key);
            }
        }
    }

    for (let key of invalidated) {
        cleanup(key);
    }
}


/**
 * Process headers and mark requested URLs that should be colorized.
 * @param  {Object} details - see https://developer.chrome.com/extensions/webRequest
 */
function processRequestHeaders(details) {
    const headers = details.responseHeaders;

    if (headers) {
        let contentTypeHeader = headers.filter(function(header) {
            return /content-type/i.test(header.name);
        });

        if (contentTypeHeader.length) {
            if (/text\/plain/i.test(contentTypeHeader[0].value)) {
                state[details.url] = {
                    isText: true,
                    ts: Date.now()
                };
            }
        }
    } else {
        console.warn('Response headers are missing in details', details);
    }

    // Clean up stale things in state.
    cleanHouse();
}


/**
 * Handle messages from the content-script.
 * @param  {Any} request
 * @param  {Object} sender
 * @param  {Function} sendResponse
 */
function handleMessage(request, sender, sendResponse) {
    const url = sender.tab.url;

    switch (request.action) {
    // Test whether the script's page should be colorized.
    case 'analyze':
        sendResponse({
            colorize: shouldColorize(url)
        });
        break;
    // Discard state associated with script's page.
    case 'thanks':
        cleanup(url);
        break;
    default:
        console.warn('Unknown request from content script:', request.action);
    }
}


function init() {
    // Attach listener to intercept response headers.
    chrome.webRequest.onResponseStarted.addListener(
        processRequestHeaders,
        { urls: ['*://*/*'] },
        ['responseHeaders']
    );


    // Handle messages from the content script.
    chrome.runtime.onMessage.addListener(handleMessage);
}


init();
