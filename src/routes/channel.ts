import express, {Request, Response} from "express";
import {find_document, FunctionMap, onRequest} from "../common/util";
import {ChannelDocuments} from "../db/documents/channel";
import {ItemDocuments} from "../db/documents/item";

type ChannelCreateParam =
    {
        channel_id : string;
        room_id : string;
    };

async function onCreate( req : Request, res : Response )
{
    if ( await find_document( ChannelDocuments, req, 'channel_id', 'room_id' ) )
    {
        throw  "ALREADY ITEM HERE.";
    }

    let create_params : ChannelCreateParam = { channel_id: req.body.id, room_id: req.body.room_id };
    let new_channel = await ItemDocuments.create( create_params  );

    res.send( new_channel );
}

let FuncMap : FunctionMap  =
{
    'Create': onCreate,
    'Read': onCreate,
    'Update': onCreate,
    'Delete': onCreate,
}

export let channelRouter = express.Router();

channelRouter.post('/create', async  function ( req, res, next )
{
    await onRequest( req, res, FuncMap, 'Create' );
});


channelRouter.post('/update', async  function ( req, res, next )
{
    await onRequest( req, res, FuncMap, 'Update' );
});

channelRouter.get('/get', async  function ( req, res, next )
{
    await onRequest( req, res, FuncMap, 'Read' );
});

channelRouter.post('/delete', async  function ( req, res, next )
{
    await onRequest( req, res, FuncMap, 'Delete' );
});