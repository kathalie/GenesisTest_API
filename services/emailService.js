import fs from "fs";
import nodemailer from "nodemailer";
import {getRate} from './rateService.js'

/**
 * A name of the file where all the subscribed emails are saved and separated by '\n' symbol.
 * @type {string}
 */
const subscribersFileName = 'emails.txt';
/**
 * An email subject.
 * The value is either obtained from the EMAIL_SUBJECT environment variable or is default.
 * @type {string|string}
 */
const subject = process.env.EMAIL_SUBJECT || 'Поточний курс біткоїна в гривні';
/**
 * Placeholder for the current BTC to UAH exchange rate value in the email text.
 * @type {string}
 */
const currentRatePlaceholder = '%r%';
/**
 * An email text.
 * The value is either obtained from the EMAIL_TEXT environment variable or is default.
 * @type {string|string}
 */
const text = process.env.EMAIL_TEXT || `1 BTC = ${currentRatePlaceholder} UAH`;
/**
 * An email service.
 * The value is either obtained from the EMAIL_SERVICE environment variable or is default.
 * @type {string|string}
 */
const service = process.env.EMAIL_SERVICE || 'gmail';
/**
 * An email sender e-mail address.
 * The value is obtained from the EMAIL_USER_NAME environment variable.
 * Note: is required for correct API work.
 */
const sender = process.env.EMAIL_USER_NAME;
/**
 * An email sender e-mail password (or a password for third-party apps).
 * The value is obtained from the EMAIL_PASSWORD environment variable.
 * Note: is required for correct API work.
 */
const senderPas = process.env.EMAIL_PASSWORD;

// SUBSCRIBE AN EMAIL
/**
 * An asynchronous function, that subscribes the email for receiving updates about BTC to UAH exchange rate.
 * Throws 409 if the e-mail has been already subscribed.
 * Throws an error if something goes wrong while adding an email to the subscribers file.
 *
 * @param email email that is going to be subscribed for receiving updates about BTC to UAH exchange rate.
 * @returns {Promise<void>}
 */
async function subscribeEmail(email) {
    if (emailExists(email))
        throw 409;
    try {
        addEmail(email);
    } catch (err) {
        throw new Error('Failed to subscribe an email. ' + err.message);
    }
}

/**
 * A function, that adds the email to the subscribers file and separates with '\n' from other ones.
 * Throws an error if something goes wrong while adding the email to the file.
 *
 * @param email email that is going to be subscribed for receiving updates about BTC to UAH exchange rate.
 */
function addEmail(email) {
    fs.appendFile(subscribersFileName, `${email}\n`, err => {
        if (err) throw err;
    });
}

/**
 * A function, that checks whether subscribers file contains the email.
 *
 * @param email email that is checked.
 * @returns {boolean} true if the email is already subscribed.
 */
function emailExists(email) {
    return getSubscribers().includes(email.toString());
}

/**
 * A function, that returns an array of subscribed emails from the subscribers file.
 *
 * @returns {*[]} an array of subscribed emails.
 */
function getSubscribers() {
    let fileContent = [];
    try {
        fileContent = fs.readFileSync(subscribersFileName, 'utf-8').split('\n');
        // removes last empty string (occurs when emails are added and separated by new line)
        if (fileContent[fileContent.length - 1].replace(" ", "") === '')
            fileContent.pop();
    } catch (ignored) {}

    return fileContent;
}


// SEND EMAILS
/**
 * An asynchronous function, that sends emails with the current BTC to UAH exchange rate to all the subsccribers.
 * Throws an error if something goes wrong while getting the exchange rate.
 *
 * @returns {Promise<void>}
 */
async function sendEmails() {
    let subscribers = getSubscribers();
    let currentRate;
    try {
        currentRate = await getRate();
    } catch (err) {
        throw err;
    }

    for (let subscriber of subscribers) {
        sendEmail(subscriber, subject, text.replace(currentRatePlaceholder, currentRate))
            .catch(err => console.log(err));
    }
}

/**
 * A function, that creates a transporter for sending emails. Uses {@link service}, {@link sender} and {@link senderPas}
 * constants to set values of service, auth.user and auth.pass fields respectively.
 *
 * @returns {*} a transporter instance for sending emails.
 */
function getTransporter() {
    // create reusable transporter object using the default SMTP transport
    return nodemailer.createTransport({
        service: service,
        auth: {
            user: sender,
            pass: senderPas,
        },
    });
}

/**
 * An asynchronous function, that sends a single email containing particular subject and text to a particular receiver.
 *
 * @param receiver email address where the e-mail is going to be sent.
 * @param subject email subject.
 * @param text email text.
 * @returns {Promise<void>}
 */
async function sendEmail(receiver, subject, text) {
    let info = await getTransporter().sendMail({
        from: sender,
        to: receiver,
        subject: subject,
        text: text,
    });

    console.log(`Message sent: ${info.messageId} (sent to: ${receiver})`);
}

// AUTOMATIC SENDING
let rate;
const timeDelay = 1000*60*10; // 10 min

// Automatic sending of emails every {timeDelay} ms.
setInterval(await automaticSending, timeDelay);

/**
 * An asynchronous function, that sends emails with current rate when it is updated.
 * @returns {Promise<void>}
 */
async function automaticSending() {
    const newRate = await getRate();
    if (newRate === rate) return;

    rate = newRate;
    try {
        await sendEmails();
    } catch(ignored) {}
}

export {subscribeEmail, sendEmails};