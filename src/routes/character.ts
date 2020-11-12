import express, {Request} from 'express';
import { CharacterDocuments } from "../db/documents/character";

export let characterRouter = express.Router();


async function get_character( req : Request ) : Promise<CharacterDocuments>
{
    if (  req.body.room_id === undefined || req.body.id === undefined ) { throw "Invalid Params."; }

    let room_id : string = req.body.room_id;
    let id : string = req.body.id;

    let result  = await CharacterDocuments.findOne( { where: { id: id, room_id: room_id } })

    if ( result == null ) { throw "Not Found"; }
    return result;
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


characterRouter.post( '/create', function( req , res, next )
{
    res.send("character add");
});

characterRouter.get( '/get', async function( req : Request, res, next )
{
    try
    {
        res.send( await get_character( req ) );
    }
    catch (e)
    {
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
        res.send(e);
    }
});


characterRouter.post( '/delete', function( req , res, next )
{
    res.send("character delete");
});

