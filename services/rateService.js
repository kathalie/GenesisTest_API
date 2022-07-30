import fetch from "node-fetch";

const apiVersion = 1;
const date = 'latest';
const currencyFrom = 'btc';
const currencyTo = 'uah';
/**
 * URL for calling the public API function which returns a json file with exchange rates for the
 * {@link currencyFrom specified currency}.
 *
 * @type {string}
 */
const url = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@${apiVersion}/${date}/currencies/${currencyFrom}.json`;

/**
 * An asynchronous function, that fetches {@link url} and returns a current exchange rate from {@link currencyFrom
 * one specified currency} to {@link currencyTo another}.
 *
 * @returns {Promise<*|void>}
 */
async function getRate() {
    return await fetch(url)
        .then(res => {
            if (res.ok) return res.json();
            throw new Error('Something went wrong');
        })
        .then(data => data[currencyFrom][currencyTo].toString())
        .catch(err => console.log(err));
}

export {getRate};