import * as emailService from '../services/emailService.js';

async function subscribeEmail(req, res) {
    try {
        await emailService.subscribeEmail(req.body.email);
        res.status(200).send();
    } catch(e) {
        if (e.message === '409')
            res.status(e.message).json('Email has already been subscribed.');
        else
            res.status(500).json(e.message);
    }
}

async function sendEmails(res) {
    try {
        await emailService.sendEmails();
        res.status(200).send();
    } catch(e) {
        res.status(500).json(e.message);
    }
}

export {subscribeEmail, sendEmails};