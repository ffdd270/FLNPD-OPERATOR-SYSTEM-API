import express, {Request, Response} from 'express';
import { ItemDocuments } from "../db/documents/item";
import {find_document, FunctionMap, get_document, update_attr} from "../common/util";
import Maker from "./maker";

type ItemCreateParams =
    {
        id : string;
        room_id : string;
        name? : string;
        desc? : string;
    };

type ItemUpdateParams =
    {
        name? : string;
        desc? : string;
    }


function make_item_params_from_req( req : Request ) : ItemUpdateParams
{
    let params : ItemUpdateParams = {};
    update_attr<ItemUpdateParams, keyof ItemUpdateParams>( params, req.body, [ 'name', 'desc' ] );
    return params;
}

async function onCreate( req : Request, res : Response )
{
    if ( await find_document( ItemDocuments, req ) )
    {
        throw  "ALREADY ITEM HERE.";
    }

    let create_params : ItemCreateParams = { id: req.body.id, room_id: req.body.room_id };
    let params = make_item_params_from_req( req );

    update_attr( create_params, params, [ 'name', 'desc' ] );

    let new_item = await ItemDocuments.create( create_params );
    res.send( new_item );
}

async function onUpdate( req : Request, res : Response )
{
    let item = await get_document( ItemDocuments, req ) as ItemDocuments;
    let param = make_item_params_from_req( req );

    update_attr( item, param, [ 'name', 'desc' ] );
    await item.save();

    res.send( item );
}

async function onRead( req : Request, res : Response )
{
    res.send( await get_document( ItemDocuments, req ) );
}

async function onDelete( req : Request, res : Response )
{
    let item =  await get_document( ItemDocuments, req ) as ItemDocuments;
    await item.destroy();

    res.statusCode = 200;
    res.send("item delete");
}

let FuncMap : FunctionMap  = Maker.MakeFunctionMap( onCreate, onRead, onUpdate, onDelete );
export let itemRouter = express.Router();
Maker.MakeRouter( itemRouter, FuncMap );\