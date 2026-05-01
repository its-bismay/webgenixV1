import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
	const currUser = await currentUser();

	if (!currUser) {
		return NextResponse.json(
			{ error: "Please login first" },
			{ status: 401 },
		);
	}

	const fullName = currUser.fullName ?? "";
	const email = currUser.primaryEmailAddress?.emailAddress;

	if (!email) {
		return NextResponse.json(
			{ error: "No email associated with this account" },
			{ status: 400 },
		);
	}

	const user = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.email, email));

	if (user.length === 0) {
		const data = {
			name: fullName,
			email: email,
			credits: 2,
		};
		const result = await db
			.insert(usersTable)
			.values({
				...data,
			})
			.onConflictDoNothing();
		console.log(`result is: `, result);
		return NextResponse.json({
			message: "Account registered successfully",
			user: data,
		});
	}
	return NextResponse.json({
		message: "User already exists",
		user: user[0],
	});
}
