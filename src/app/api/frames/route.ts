import { db } from "@/config/db";
import { chatTable, framesTable } from "@/config/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const frameId = searchParams.get("frameId");
	const projectId = searchParams.get("projectId");


	const frameResults = await db
		.select()
		.from(framesTable)
		.where(eq(framesTable.frameId, frameId));


	const chatResults = await db
		.select()
		.from(chatTable)
		.where(eq(chatTable.frameId, frameId));

	const finalResult = {
		...frameResults[0],
		chatMessages: chatResults[0]?.chatMessage,
	};

	return NextResponse.json(finalResult);
}


export async function PUT (req: NextRequest) {
	const {designCode, frameId, projectId} = await req.json();

	const result = await db.update(framesTable).set({
		designCode: designCode,
	}).where(and(eq(framesTable.frameId, frameId), eq(framesTable.projectId, projectId)));


	return NextResponse.json({message: "Design code updated successfully", result});
}
