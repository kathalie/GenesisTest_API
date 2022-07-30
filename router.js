import Router from 'express';
import * as rateController from './controllers/rateController.js';
import * as emailController from './controllers/emailController.js';

const router = new Router();

// Routing GET request on '/rate' path.
router.get('/rate', rateController.getRate);
// Routing POST request on '/subscribe' path (requires form data with "email" field).
router.post('/subscribe', emailController.subscribeEmail);
// Routing POST request on  '/sendEmails' path.
router.post('/sendEmails', emailController.sendEmails);

export default router;