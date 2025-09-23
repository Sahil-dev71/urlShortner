/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
import  {getJWTData} from "../utils/token.js";

export async function userAuthentication(req,res,next){
    const authHeader=req.headers["authorization"];
    if(!authHeader) return next();
    if(!authHeader.startsWith("Bearer")){
        return res.status(400)
                  .json({
                    error: "Token must be starts with Bearer",
                  })
    }
    const [_,Token]=authHeader.split(" ");
    const data= await getJWTData(Token);
    req.user=data;
    return next();
}
export async function ensureAuthentication(req,res,next) {
  const userId=req.user;
  
  if(!userId) {
     return res.status(401)
                      .json({
                        message: "you are not logged-in ",
                      })
  }
  return next();
}