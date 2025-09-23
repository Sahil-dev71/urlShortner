import express from "express";
import { loginPostRequestValidation, signupPostRequestValidation } from "../validation/request.validation.js";
import { hashPasswordWtihSalt } from "../utils/hash.js";
import { isUserExists,createNewUser } from "../services/user.services.js";
import {createJWTToken} from "../utils/token.js";

const router=express.Router();
router.post("/signup",async(req,res)=>{
    const validationRequest=await signupPostRequestValidation.safeParseAsync(req.body);
    
    if(validationRequest.error){
        return res.status(400).json({
            error: validationRequest.error.format(),
        })
    }
    const {firstName,lastName,email,password}=validationRequest.data;

    const existingUser= await isUserExists(email);
    if(existingUser) return res.status(400).json({
        error :  `user with email ${email} already exists `,
    })
    const  {salt,password:hashPassword}= hashPasswordWtihSalt(password);
    // const [user]=await db.insert(usersTable)
    //                     .values({
    //                         firstName,
    //                         lastName,
    //                         email,
    //                         salt,
    //                         password:hashPassword,
    //                     }).returning({
    //                         id:usersTable.id,
    //                     })
   const data={
    ...validationRequest.data,
    salt,
    hashPassword
   }
    const user= await createNewUser(data);
    return res.status(201).json({
        status: "success",
        data : {
            user_ID : user.id,
        }
    })
})
router.post('/login',async(req,res)=>{
    const validationResult=await loginPostRequestValidation.safeParseAsync(req.body);
    if(validationResult.error) return res.status(400).json({
        error: validationResult.error.format(),
    })
    const {email,password}=validationResult.data;
    const existingUser=await isUserExists(email);
    if(!existingUser) return res.status(400).json({
        error: `you are not signed-up`,
    })
    
    const {salt,password:hashedPassword}= hashPasswordWtihSalt(password,existingUser.salt);
    
    if(hashedPassword!==existingUser.password){
        return res.status(400).json({
            error:' you entered wrong password',
        })
    }
    // const tokern= jwt.sign({id: existingUser.id},process.env.JWT_SECRET_KEY);
    const token= await createJWTToken({id:existingUser.id});
    return res.status(200).json({
        status:"success",
        token,
    })
})

export default router;