import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

let app = express();

app.use( logger('dev') );
app.use( express.json() );
app.use( express.urlencoded(  {extended: false } ) );
app.use( cookieParser() );
app.use( express.static( path.join(__dirname, 'public' )));

// 여기서부터 라우터

import { indexRouter } from './routes';

app.use( "/", indexRouter );


module.exports = app;