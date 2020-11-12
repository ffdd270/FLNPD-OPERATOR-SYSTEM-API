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
        res.send( await get_character( req ) );
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

