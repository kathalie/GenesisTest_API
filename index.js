import express from 'express';
import router from "./router.js";

const app = express();
const port = 5000;

app.use(express.urlencoded({extended: true}));
app.use('/api', router);

app.listen(port, () => console.log('SERVER STARTED ON PORT ' + port));
