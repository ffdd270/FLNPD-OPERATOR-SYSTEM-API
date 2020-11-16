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

import { indexRouter } from './routes/index';
import { characterRouter } from './routes/character';
import { itemRouter } from './routes/item';
import { channelRouter } from './routes/channel';

app.use( "/", indexRouter );
app.use( "/character", characterRouter );
app.use( "/item", itemRouter );
app.use( "/channel", channelRouter );


// 데베
import {Database} from "./db/database";

import {CharacterDocuments} from "./db/documents/character";
import {ChannelDocuments} from "./db/documents/channel";
import {ItemDocuments} from "./db/documents/item";
import {InventoryDocuments} from "./db/documents/inventory";

let load_db = async ()=>
{
    await Database.ClearDatabase();
    await Database.AddModels([CharacterDocuments, ChannelDocuments, ItemDocuments, InventoryDocuments]);
    console.log("READY.");
}

load_db().then(r => { Database.AfterLoad(); });

module.exports = app;