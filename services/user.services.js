import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { usersTable } from "../models/users.schema.js";
export async function isUserExists(email) {
    const [existingUser]=await db.select({
        id: usersTable.id,
        firstName:usersTable.firstName,
        lastName: usersTable.lastName,
        email:usersTable.email,
        salt:usersTable.salt,
        password: usersTable.password,
    })
                                .from(usersTable)
                                .where(table=>eq(table.email,email))
    return existingUser;
};
export async function createNewUser(userData){
    const {firstName,lastName,email,salt,hashPassword}=userData;    
    
    const [user]=await db.insert(usersTable).values({
        firstName,
        lastName,
        email,
        password:hashPassword,
        salt,
    }).returning({
        id: usersTable.id,
    })
    return user;
}