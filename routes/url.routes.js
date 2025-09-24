import express from "express";
import {db} from "../db/index.js";
import { nanoid } from "nanoid";
import {urlsTable} from "../models/urls.schema.js";
import {urlValidation} from "../validation/url.validation.js"
import { ensureAuthentication } from "../middlewares/auth.middlewares.js";
import { insertUrl } from "../services/url.services.js";
import { and, eq } from "drizzle-orm";
import { usersTable } from "../models/users.schema.js";

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
router.get("/allCodes",ensureAuthentication,async(req,res)=>{
        const codes= await db.select()
                         .from(urlsTable)
                         .where(eq(urlsTable.userId,req.user.id));
    return res.json({
        codes,
    })
})
router.put("/update",ensureAuthentication,async (req,res)=>{
    const {
        currentCode,
        updateCode,
        currentTargetCode,
        updateTargetUrl} =req.body;
    const [result] = await db.update(urlsTable)
                              .set({shortUrl:updateCode,
                                targetUrl:updateTargetUrl?? urlsTable.targetUrl,}
                              ).where(and(
                                eq(urlsTable.userId,req.user.id),eq(urlsTable.shortUrl,currentCode)
                            )).returning({
                                targetUrl: urlsTable.targetUrl,
                                shortCode: urlsTable.shortUrl,
                              
                            })
                              
    return res.status(201).json({
        targetUrll: result?.targetUrl?? updateTargetUrl,
        shortCodee: result?.shortCode,
        // result,
        message: "hello verification",
    })

})

router.get("/:shortCode",async(req,res)=>{
    const shortCode=req.params.shortCode;
    const [codeExists]= await db.select({
        targetUrl: urlsTable.targetUrl,
        shortUrl: urlsTable.shortUrl,
    }).from(urlsTable)
      .where(eq(urlsTable.shortUrl,shortCode));

    
    if(!codeExists) return res.status(404).json({
        error: "this url is not present",
    });
   return res.redirect(codeExists.targetUrl);

})
router.delete("/:code",ensureAuthentication,async(req,res)=>{
    const code=req.params.code;
    const dremove = await db.delete(urlsTable)
                          .where(and(
                            eq(urlsTable.shortUrl,code),
                            eq(urlsTable.userId,req.user.id)
                          )).returning({
                            shortCode: urlsTable.shortUrl,
                            targetUrl: urlsTable.targetUrl,
                          });
    return res.json({
        delete:true,
        dremove,
    })
})
export default router;