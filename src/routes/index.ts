import express from 'express';

export let indexRouter = express.Router();

indexRouter.get( '/', function( req , res, next )
{
    res.send("Hello!");
});
