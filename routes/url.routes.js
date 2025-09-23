import express from "express";
import {db} from "../db/index.js";
import { nanoid } from "nanoid";
import {urlsTable} from "../models/urls.schema.js";
import {urlValidation} from "../validation/url.validation.js"
import { ensureAuthentication } from "../middlewares/auth.middlewares.js";
import { insertUrl } from "../services/url.services.js";

const router=express.Router();

router.post("/shorten",ensureAuthentication,async(req,res)=>{
    const validationResult = await urlValidation.safeParseAsync(req.body);
    if(validationResult.error) return res.status(400).json({
        error : validationResult.error.format(),
    })
    
    const {url,code}= validationResult.data;
    const shortUrl=code?? nanoid(6);
    
    const pauload={
         shortUrl: shortUrl,
         targetUrl: url,
         userId : req.user.id,
}  
    const [result]= await insertUrl(pauload);
    return res.json({
        id : result.id,
        shortUrl: result.shortCode,
        targetUrl: result.targetUrl,
    });
    
})
export default router;