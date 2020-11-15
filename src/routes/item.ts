import express, {Request} from 'express';
import { ItemDocuments } from "../db/documents/item";
import {find_document, get_document, update_attr} from "../common/util";
import {CharacterDocuments} from "../db/documents/character";

export let itemRouter = express.Router();

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

itemRouter.post('/create', async  function ( req, res, next )
{
    try
    {
        if ( await find_document( CharacterDocuments, req ) )
        {
            throw  "ALREADY ITEM HERE.";
        }

        let create_params : ItemCreateParams = { id: req.body.id, room_id: req.body.room_id };
        let params = make_item_params_from_req( req );

        update_attr( create_params, params, [ 'name', 'desc' ] );

        let new_item = await ItemDocuments.create( create_params );
        res.send( new_item );
    }
    catch (e)
    {
        res.statusCode = 422;
        res.send(e);
    }
});

itemRouter.post( '/update', async function( req, res, next )
{
    try
    {
        let item = await get_document( ItemDocuments, req ) as ItemDocuments;
        let param = make_item_params_from_req( req );

        update_attr( item, param, [ 'name', 'desc' ] );
        await item.save();

        res.send( item );
    }
    catch (e)
    {
        res.statusCode = 422;
        res.send(e);
    }
});


itemRouter.get( '/get', async function( req, res, next )
{
    try
    {
        res.send( await get_document( ItemDocuments, req ) );
    }
    catch (e)
    {
        res.statusCode = 422;
        res.send(e);
    }
});