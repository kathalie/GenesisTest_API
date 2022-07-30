import * as rateService from '../services/rateService.js';

/**
 * An asynchronous function, that controls getting a current BTC to UAH exchange rate from the public API.
 *
 * Responses sent:
 * status 200 and current BTC to UAH exchange rate number value - successful obtaining of the exchange rate.
 * status 500 and error message - any errors occurred.
 *
 * @param req GET request
 * @param res response
 * @returns {Promise<void>}
 */
async function getRate(req, res) {
    try {
        let currentRate = await rateService.getRate().then(value => value.toString());
        res.status(200).send(currentRate);
    } catch (e) {
        res.status(500).json(e);
    }
}

export {getRate};