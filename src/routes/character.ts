import express, {Request} from 'express';
import { CharacterDocuments } from "../db/documents/character";

export let characterRouter = express.Router();


async function get_character( req : Request ) : Promise<CharacterDocuments>
{
    if ( req.body.room_id === undefined || req.body.id === undefined ) { throw "Invalid Params."; }

    let room_id : string = req.body.room_id;
    let id : string = req.body.id;

    let result  = await CharacterDocuments.findOne( { where: { id: id, room_id: room_id } })

    if ( result == null ) { throw "Not Found"; }
    return result;
}

async function find_character( req : Request ) : Promise<boolean>
{
    if ( req.body.room_id === undefined || req.body.id === undefined ) { throw "Invalid Params."; }

    let room_id : string = req.body.room_id;
    let id : string = req.body.id;

    return await CharacterDocuments.findOne( { where: { id: id, room_id: room_id } }) !== null;
}

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


function update_attr<Type, Key extends keyof Type>( dest_data : Type, data : Type, key : Key[] )
{
    key.map( (key) => {
        if ( data[key] !== undefined )
        {
            dest_data[key] = data[key];
        }
    } )
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
        if ( await find_character(req) )
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
        res.send( await get_character( req ) );
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
        let character =  await get_character( req );
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
        let character =  await get_character( req );
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

