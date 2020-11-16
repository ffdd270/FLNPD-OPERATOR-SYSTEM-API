import express, {Request, Response} from "express";
import {find_document, FunctionMap, get_document, onRequest, validate_request_body, update_attr} from "../common/util";
import {ChannelDocuments} from "../db/documents/channel";

type ChannelParam =
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

    let create_params : ChannelParam = { channel_id: req.body.id, room_id: req.body.room_id };
    let new_channel = await ChannelDocuments.create( create_params  );

    res.send( new_channel );
}

async function onRead( req : Request, res : Response )
{
    res.send( await get_document( ChannelDocuments, req ) );
}

async function onUpdate( req : Request, res : Response )
{
    let channel = await get_document( ChannelDocuments, req, 'channel_id', 'room_id' ) as ChannelDocuments;
    let param = { channel_id : req.body.channel_id, room_id: req.body.room_id }
    update_attr(channel, param, [ 'room_id' ] );
    await channel.save();
    res.send( channel );
}

let FuncMap : FunctionMap  =
{
    'Create': onCreate,
    'Read': onRead,
    'Update': onUpdate,
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