import {
	chatTable,
	framesTable,
	projectsTable,
	usersTable,
} from "@/config/schema";
import { db } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";
import { currentUser, auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
	const { has } = await auth();
	const hasProAccess = has && has({ plan: "pro" });
	try {
		const body = await req.json();
		const { projectId, frameId, messages } = body;

		// Validate input
		if (!projectId || !frameId || !messages) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		const user = await currentUser();

		if (!user || !user?.primaryEmailAddress?.emailAddress) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		const email = user.primaryEmailAddress.emailAddress;

		// Create Project
		const projectResult = await db.insert(projectsTable).values({
			projectId,
			createdBy: email,
		});

		// Create Frame
		const frameResult = await db.insert(framesTable).values({
			frameId,
			projectId,
		});

		// Create Chat Message
		const chatResult = await db.insert(chatTable).values({
			chatMessage: messages,
			frameId: frameId,
			createdBy: email,
		});

		if (!hasProAccess) {
			const userData = await db
				.select()
				.from(usersTable)
				.where(eq(usersTable.email, email));

			const currentCredits = userData[0]?.credits ?? 0;

			if (currentCredits <= 0) {
				return NextResponse.json(
					{ error: "No credits left" },
					{ status: 400 },
				);
			}

			await db
				.update(usersTable)
				.set({
					credits: currentCredits - 1,
				})
				.where(eq(usersTable.email, email));
		}

		return NextResponse.json({
			message: "Records added successfully",
			projectResult,
			frameResult,
			chatResult,
		});
	} catch (error: any) {
		console.error("API Error:", error);

		return NextResponse.json(
			{
				error: "Something went wrong",
				details: error?.message || "Unknown error",
			},
			{ status: 500 },
		);
	}
}
