import express, {Request, Response} from 'express';
import { CharacterDocuments } from "../db/documents/character";
import {find_document, FunctionMap, get_document, update_attr} from "../common/util";
import Maker from "./maker";


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

async function onCreate( req : Request, res : Response )
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


async function onRead( req : Request, res : Response )
{
    res.send( await get_document(CharacterDocuments, req) );
}

async function onUpdate( req : Request, res : Response )
{
    let character =  await get_document( CharacterDocuments, req ) as CharacterDocuments;
    let param = make_character_params_from_req( req );

    update_attr( character, param, [ 'name', 'comment', 'hp_max', 'hp', 'sp_max', 'sp' ] );
    await character.save();

    res.send( character );
}

async function onDelete( req : Request, res : Response )
{
    let character =  await get_document( CharacterDocuments, req ) as CharacterDocuments;
    await character.destroy();

    res.statusCode = 200;
    res.send("character delete");
}

let FuncMap : FunctionMap  = Maker.MakeFunctionMap( onCreate, onRead, onUpdate, onDelete );
export let characterRouter = express.Router();
Maker.MakeRouter( characterRouter, FuncMap );
