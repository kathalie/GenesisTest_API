import * as rateService from '../services/rateService.js';

async function getRate(res) {
    try {
        let currentRate = await rateService.getRate().then(value => value.toString());
        res.status(200).send(currentRate);
    } catch (e) {
        res.status(500).json(e);
    }
}

export {getRate};