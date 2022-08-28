import nodemailer from "nodemailer";
import {getRate} from './rateService.js'
import * as fileManager from '../fileManager.js';

const subscribersFileName = 'emails.txt';
const subject = process.env.EMAIL_SUBJECT || 'Поточний курс біткоїна в гривні';
const currentRatePlaceholder = '%r%';
const text = process.env.EMAIL_TEXT || `1 BTC = ${currentRatePlaceholder} UAH`;
const service = process.env.EMAIL_SERVICE || 'gmail';
const sender = process.env.EMAIL_USER_NAME;
const senderPas = process.env.EMAIL_PASSWORD;

async function subscribeEmail(email) {
    if (emailExists(email))
        throw new Error('409');
    try {
        saveEmail(email);
    } catch (err) {
        throw new Error('Failed to subscribe an email. ' + err.message);
    }
}

function emailExists(email) {
    return getSubscribers().includes(email.toString());
}

function saveEmail(email) {
    fileManager.addToFile(subscribersFileName, `${email}\n`);
}

function getSubscribers() {
    let allSubscribers = [];

    try {
        allSubscribers = fileManager.getFileContent(subscribersFileName);
    } catch (ignored) {}

    return allSubscribers;
}


async function sendEmails() {
    let subscribers = getSubscribers();
    let currentRate;

    try {
        currentRate = await getRate();
    } catch (err) {
        console.log(err);
        throw err;
    }

    for (let subscriber of subscribers) {
        sendEmail(subscriber, subject, text.replace(currentRatePlaceholder, currentRate))
            .catch(err => console.log(err));
    }
}

function getTransporter() {
    return nodemailer.createTransport({
        service: service,
        auth: {
            user: sender,
            pass: senderPas,
        },
    });
}

async function sendEmail(emailReceiver, emailSubject, emailText) {
    let info = await getTransporter().sendMail({
        from: sender,
        to: emailReceiver,
        subject: emailSubject,
        text: emailText,
    });

    console.log(`Message sent: ${info.messageId} (sent to: ${emailReceiver})`);
}

// AUTOMATIC SENDING
let rate;
const timeDelay = 1000*60*10; // 10 min

setInterval(await automaticSending, timeDelay);

async function automaticSending() {
    const newRate = await getRate();

    if (newRate === rate) return;

    rate = newRate;
    try {
        await sendEmails();
    } catch(ignored) {}
}

export {subscribeEmail, sendEmails};