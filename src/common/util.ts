import {Request} from "express";

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

export async function find_document<DocumentType>( document : FindDocumentInterface<DocumentType>, req : Request ) : Promise<boolean>
{
    if ( req.body.room_id === undefined || req.body.id === undefined ) { throw "Invalid Params."; }

    let room_id : string = req.body.room_id;
    let id : string = req.body.id;

    return await document.findOne( { where: { id: id, room_id: room_id } }) !== null;
}
