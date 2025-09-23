
import jwt from "jsonwebtoken";
const JWT_SECRET_KEY=process.env.JWT_SECRET_KEY;
import { tokenValidation } from "../validation/token.validation.js";
export  async function createJWTToken(payload) {
    const validationResult= await tokenValidation.safeParseAsync(payload);
    if(validationResult.error){
        throw new Error(validationResult.error.format);
    }
    const token=jwt.sign(validationResult.data,JWT_SECRET_KEY);
    return token;
}

export async function getJWTData(token) {
    try {
        const data=jwt.verify(token,JWT_SECRET_KEY);
        return data;
    } catch (error) {
        return res.status(400).json({
            error: error,
        })
    }
}