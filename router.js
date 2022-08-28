import Router from 'express';
import * as rateController from './controllers/rateController.js';
import * as emailController from './controllers/emailController.js';

const router = new Router();

router.get('/rate', rateController.getRate);
router.post('/subscribe', emailController.subscribeEmail);
router.post('/sendEmails', emailController.sendEmails);

export default router;