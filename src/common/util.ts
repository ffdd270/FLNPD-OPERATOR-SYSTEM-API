import {Request, Response} from "express";

export function update_attr<Type, Key extends keyof Type>( dest_data : Type, data : Type, key : Key[] )
{
    key.map( (key) => {
        if ( data[key] !== undefined )
        {
            dest_data[key] = data[key];
        }
    } )
}

interface FindDocumentInterface<Type>
{
     findOne( param : any ) : Promise<Type>
}

export async function get_document<DocumentType>( document : FindDocumentInterface<DocumentType>, req : Request ) : Promise<DocumentType>
{
    if ( req.body.room_id === undefined || req.body.id === undefined ) { throw "Invalid Params."; }

    let room_id : string = req.body.room_id;
    let id : string = req.body.id;

    let result  = await document.findOne( { where: { id: id, room_id: room_id } })

    if ( result == null ) { throw "Not Found"; }
    return result;
}

export async function find_document<DocumentType>( document : FindDocumentInterface<DocumentType>, req : Request, primary_key1 : string = 'room_id', primary_key2 = 'id' ) : Promise<boolean>
{
    if ( req.body[primary_key1] === undefined || req.body[primary_key2] === undefined ) { throw "Invalid Params."; }

    let room_id : string = req.body.room_id;
    let id : string = req.body.id;

    return await document.findOne( { where: { id: id, room_id: room_id } }) !== null;
}


export function check_id_params( req : Request ) : boolean
{
    if ( req.body.room_id === undefined || req.body.id === undefined ) { throw "Invalid Params."; }
    return true;
}

export type ReqFunc = ( req : Request, res : Response ) => Promise<void>;

export interface FunctionMap
{
    ['Create'] : ReqFunc,
    ['Read'] : ReqFunc,
    ['Update'] : ReqFunc,
    ['Delete'] : ReqFunc
}


export async function onRequest( req : Request, res : Response, func_map : FunctionMap, req_name : keyof FunctionMap )
{
    try
    {
        await func_map[req_name]( req, res );
    }
    catch (e)
    {
        res.statusCode = 422;
        res.send(e);
    }
}
