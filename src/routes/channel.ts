import express, {Request, Response} from "express";
import {find_document, FunctionMap, get_document, update_attr} from "../common/util";
import {ChannelDocuments} from "../db/documents/channel";
import Maker from "./maker";

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
    res.send( await get_document( ChannelDocuments, req, 'channel_id', 'room_id' ) );
}

async function onUpdate( req : Request, res : Response )
{
    let channel = await get_document( ChannelDocuments, req, 'channel_id', 'room_id' ) as ChannelDocuments;
    let param = { channel_id : req.body.channel_id, room_id: req.body.room_id }
    update_attr(channel, param, [ 'room_id' ] );
    await channel.save();
    res.send( channel );
}

async function onDelete( req : Request, res : Response )
{
    let channel = await get_document( ChannelDocuments, req, 'channel_id', 'room_id' ) as ChannelDocuments;
    await channel.destroy();
    res.send("OK");
}


let FuncMap : FunctionMap  = Maker.MakeFunctionMap( onCreate, onRead, onUpdate, onDelete );
export let channelRouter = express.Router();
Maker.MakeRouter( channelRouter, FuncMap );