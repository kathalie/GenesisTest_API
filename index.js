import express from 'express';
import router from "./router.js";

/**
 * Creating an express app.
 * @type {Express}
 */
const app = express();
/**
 * Default port for running the app.
 * @type {number}
 */
const port = 5000;


//Calling a middleware to recognize the incoming Request Object as strings or arrays.
app.use(express.urlencoded({extended: true}));

//Registering router to the '/api' path.
app.use('/api', router);

// Listening for any connection on the specific port.
app.listen(port, () => console.log('SERVER STARTED ON PORT ' + port));
