import express, {Request} from 'express';
import { ItemDocuments } from "../db/documents/item";
import {find_document, update_attr} from "../common/util";
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


function make_character_params_from_req( req : Request ) : ItemUpdateParams
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
        let params = make_character_params_from_req( req );

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
