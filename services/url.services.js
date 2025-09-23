import {urlsTable} from "../models/urls.schema.js";
import {db} from "../db/index.js";

export async function insertUrl(pauload) {
    const {shortUrl,targetUrl,userId}= pauload;
    const result =await db.insert(urlsTable)
                            .values({
                                shortUrl,
                                targetUrl,
                                userId,
                            }).returning({
                                 id: urlsTable.id,
                                shortCode: urlsTable.shortUrl,
                                targetUrl: urlsTable.targetUrl,
                            });    
    return result;
}