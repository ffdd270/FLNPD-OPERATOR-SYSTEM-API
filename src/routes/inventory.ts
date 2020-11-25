import express, {Request, Response} from "express";
import {
    find_document,
    FunctionMap,
    get_document,
    update_attr
} from "../common/util";

import Maker from "./maker";

import {InventoryDocuments} from "../db/documents/inventory";

type InventoryCreateParam =
    {
        id : string;
        item_id : string;
        room_id: string;
        item_count? : number;
    };

type InventoryUpdateParam =
    {
        item_count? : number;
    }

async function onCreate( req : Request, res : Response )
{
    if ( await find_document( InventoryDocuments, req, 'id', 'room_id' ) )
    {
        throw  "ALREADY ITEM HERE.";
    }

    let create_params : InventoryCreateParam = { id: req.body.id,  item_id: req.body.item_id, room_id: req.body.room_id,
        item_count: req.body.item_count === undefined ?  0 : parseInt( req.body.item_count ) };

    let new_channel = await InventoryDocuments.create( create_params );

    res.send( new_channel );
}

async function onRead( req : Request, res : Response )
{
    res.send( await get_document( InventoryDocuments, req, 'id', 'room_id' ) );
}

async function onUpdate( req : Request, res : Response )
{
    let inventory = await get_document( InventoryDocuments, req, 'id', 'room_id' ) as InventoryDocuments;
    let param : InventoryUpdateParam = { item_count: req.body.item_count };
    update_attr(inventory, param, [ 'item_count' ] );

    await inventory.save();

    res.send( inventory );
}

async function onDelete( req : Request, res : Response )
{
    let channel = await get_document( InventoryDocuments, req, 'id', 'room_id' ) as InventoryDocuments;
    await channel.destroy();
    res.send("OK");
}


let FuncMap : FunctionMap  = Maker.MakeFunctionMap( onCreate, onRead, onUpdate, onDelete );
export let inventoryRouter = express.Router();
Maker.MakeRouter( inventoryRouter, FuncMap );