import * as emailService from '../services/emailService.js';

/**
 * An asynchronous function, that controls an email subscription.
 *
 * Request parameters:
 * email - is obtained from the request body (form data).
 *
 * Responses sent:
 * status 200 - an email is successfully subscribed.
 * status 409 and error message - such email has been already subscribed.
 * status 500 and error message - any other error occurred.
 *
 * @param req POST request
 * @param res response
 * @returns {Promise<void>}
 */
async function subscribeEmail(req, res) {
    try {
        await emailService.subscribeEmail(req.body.email);
        res.status(200).send();
    } catch(e) {
        if (e === 409)
            res.status(e).json('Email has already been subscribed.');
        else
            res.status(500).json(e.message);
    }
}

/**
 * An asynchronous function, that controls sending a current BTC to UAH exchange rate to the subscribed emails.
 *
 * Responses sent:
 * status 200 - emails are sent.
 * status 500 and error message - any error occurred.
 *
 * @param req POST request
 * @param res response
 * @returns {Promise<void>}
 */
async function sendEmails(req, res) {
    try {
        await emailService.sendEmails();
        res.status(200).send();
    } catch(e) {
        res.status(500).json(e.message);
    }
}

export {subscribeEmail, sendEmails};