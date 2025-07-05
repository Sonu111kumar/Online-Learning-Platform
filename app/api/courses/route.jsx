import { db } from "@/config/db";
import { coursesTable, usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq, ne, ilike, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {

    const { searchParams } = new URL(req.url);
    const courseId = searchParams?.get('courseId');
     const search = searchParams.get("search")?.toLowerCase() || "";
    const user = await currentUser();

   if (courseId == 0) {
  let query = db.select().from(coursesTable);

  if (search) {
    query = query.where(
      sql`${coursesTable.courseContent}::jsonb != '{}'::jsonb AND (
      ${coursesTable.name} ILIKE ${`%${search}%`} OR
    ${coursesTable.catetgory} ILIKE ${`%${search}%`} OR 
    ${coursesTable.description} ILIKE ${`%${search}%`} OR
    ${coursesTable.level} ILIKE ${`%${search}%`} 
   
    )`
    );
  } else {
    query = query.where(
      sql`${coursesTable.courseContent}::jsonb != '{}'::jsonb`
    );
  }

  query = query.orderBy(desc(coursesTable.id));

  const result = await query;

  if (result.length === 0) {
  return NextResponse.json({ message: "No courses found" }, { status: 404 });
}

  return NextResponse.json(result);
}
    if (courseId) {
        const result = await db.select().from(coursesTable)
            .where(eq(coursesTable.cid, courseId));

        console.log(result);

        return NextResponse.json(result[0]);
    }
    else {
        const result = await db.select().from(coursesTable)
            .where(eq(coursesTable.userEmail, user.primaryEmailAddress?.emailAddress))
            .orderBy(desc(coursesTable.id));


        console.log(result);

        return NextResponse.json(result);
    }
}