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

export async function get_document<DocumentType>( document : FindDocumentInterface<DocumentType>, req : Request, primary_key1 : string = 'room_id', primary_key2 = 'id' ) : Promise<DocumentType>
{
    if ( req.body[primary_key1] === undefined || req.body[primary_key2] === undefined ) { throw "Invalid Params."; }

    let pk_value1 : string = req.body[primary_key1];
    let pk_value2 : string = req.body[primary_key2];

    let result  = await document.findOne( { where: {
        [primary_key1]: pk_value1,
        [primary_key2]: pk_value2
    } } )

    if ( result == null ) { throw "Not Found"; }
    return result;
}

export async function find_document<DocumentType>( document : FindDocumentInterface<DocumentType>, req : Request, primary_key1 : string = 'room_id', primary_key2 = 'id' ) : Promise<boolean>
{
    if ( req.body[primary_key1] === undefined || req.body[primary_key2] === undefined ) { throw "Invalid Params."; }

    let pk_value1 : string = req.body[primary_key1];
    let pk_value2 : string = req.body[primary_key2];

    return await document.findOne( { where: {
            [primary_key1]: pk_value1,
            [primary_key2]: pk_value2
        } }) !== null;
}


export function validate_request_body( req : Request, req_param : string[] )
{
    for ( let param of req_param )
    {
        if ( req.body[ param ] === undefined ) { return false; }
    }

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
        res.statusCode = 200;
    }
    catch (e)
    {
        res.statusCode = 422;
        res.send(e);
    }
}
