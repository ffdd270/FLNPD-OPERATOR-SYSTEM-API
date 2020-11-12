import express from 'express';
import { CharacterDocuments } from "../db/documents/character";

export let characterRouter = express.Router();


characterRouter.post( '/create', function( req , res, next )
{
    res.send("character add");
});

characterRouter.get( '/get', async function( req , res, next )
{
    let room_id : string = req.body.room_id;
    let id : string = req.body.id;

    let result  = await CharacterDocuments.findOne( { where: { id: id, room_id: room_id } })
    if( result == null )
    {
        res.send("Not Found.");
        return;
    }

    res.send(result);
});

characterRouter.post( '/update', function( req , res, next )
{
    res.send("character update");
});


characterRouter.post( '/delete', function( req , res, next )
{
    res.send("character delete");
});

