import e from "express";
import {FunctionMap, onRequest, ReqFunc} from "../common/util";

namespace Maker
{
    export function MakeFunctionMap(onCreate : ReqFunc, onRead : ReqFunc, onUpdate : ReqFunc, onDelete : ReqFunc) : FunctionMap
    {
        return {
            ['Create']: onCreate,
            ['Read']: onRead,
            ['Update']: onUpdate,
            ['Delete']: onDelete
        };
    }

    export function MakeRouter(router : e.Router, FuncMap : FunctionMap )
    {
        router.post('/create', async  function (req, res, next )
        {
            await onRequest( req, res, FuncMap, 'Create' );
        });

        router.post('/update', async  function (req, res, next )
        {
            await onRequest( req, res, FuncMap, 'Update' );
        });

        router.get('/get', async  function (req, res, next )
        {
            await onRequest( req, res, FuncMap, 'Read' );
        });

        router.post('/delete', async  function (req, res, next )
        {
            await onRequest( req, res, FuncMap, 'Delete' );
        });
    }
}

export = Maker;