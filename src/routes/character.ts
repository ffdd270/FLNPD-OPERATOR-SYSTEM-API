import express, {Request} from 'express';
import { CharacterDocuments } from "../db/documents/character";
import {find_document, get_document, update_attr} from "../common/util";

export let characterRouter = express.Router();

type CharacterCreateParams =
{
    id : string;
    room_id : string;
    name? : string;
    comment? : string;
    hp_max? : number;
    hp? : number;
    sp_max? : number;
    sp? : number;
}

type CharacterParams =
{
    name? : string;
    comment? : string;
    hp_max? : number;
    hp? : number;
    sp_max? : number;
    sp? : number;
}

function make_character_params_from_req( req : Request ) : CharacterParams
{
    let params : CharacterParams = {};
    update_attr( params, req.body, [ 'name', 'comment', 'hp_max', 'hp', 'sp_max', 'sp' ]  );
    return params;
}


characterRouter.post( '/create',  async function( req , res, next )
{
    try
    {
        if ( await find_document( CharacterDocuments, req ) )
        {
            throw  "ALREADY CHARACTER HERE.";
        }

        let create_params : CharacterCreateParams = { id: req.body.id, room_id: req.body.room_id };
        let params = make_character_params_from_req( req );
        update_attr( create_params, params, [ 'name', 'comment', 'hp_max', 'hp', 'sp_max', 'sp' ] );

        let new_char = await CharacterDocuments.create( create_params );
        res.send( new_char );
    }
    catch (e)
    {
        res.statusCode = 422;
        res.send(e);
    }
});

characterRouter.get( '/get', async function( req : Request, res, next )
{
    try
    {
        res.send( await get_document(CharacterDocuments, req) );
    }
    catch (e)
    {
        res.statusCode = 422;
        res.send(e);
    }
});

characterRouter.post( '/update', async function( req , res, next )
{
    try
    {
        let character =  await get_document( CharacterDocuments, req ) as CharacterDocuments;
        let param = make_character_params_from_req( req );

        update_attr( character, param, [ 'name', 'comment', 'hp_max', 'hp', 'sp_max', 'sp' ] );
        await character.save();

        res.send( character );
    }
    catch (e)
    {
        res.statusCode = 422;
        res.send(e);
    }
});


characterRouter.post( '/delete', async function( req , res, next )
{
    try
    {
        let character =  await get_document( CharacterDocuments, req ) as CharacterDocuments;
        await character.destroy();

        res.statusCode = 200;
        res.send("character delete");
    }
    catch (e)
    {
        res.statusCode = 422;
        res.send(e);
    }
});

