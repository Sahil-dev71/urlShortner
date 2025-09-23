import { pgTable,timestamp,uuid, varchar,text } from "drizzle-orm/pg-core";
import { usersTable } from "./users.schema.js";


export const urlsTable=pgTable("urls",{
    id: uuid().primaryKey().defaultRandom(),

    shortUrl: varchar("short_url").notNull(),
    targetUrl: text("target_Url").notNull(),
    
    userId: uuid("owner").references(()=>usersTable.id).notNull(),
    
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().$onUpdate(()=>new Date()).notNull(),

})