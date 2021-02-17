import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import routesConfig from './routesConfig';
import features from '../features';

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: true }));
routesConfig(app, features);

export default app;
