import fetch from "node-fetch";

const apiVersion = 1;
const date = 'latest';
const currencyFrom = 'btc';
const currencyTo = 'uah';

const url = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@${apiVersion}/${date}/currencies/${currencyFrom}.json`;

async function getRate() {
    return fetch(url)
        .then(res => {
            if (res.ok) return res.json();
            throw new Error('Something went wrong');
        })
        .then(data => data[currencyFrom][currencyTo].toString())
        .catch(err => console.log(err));
}

export {getRate};