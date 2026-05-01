"use client";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const MenuItems = [
	{
		name: "Pricing",
		path: "/pricing",
	},
	{
		name: "Contact us",
		path: "/contact-us",
	},
];

function Header() {
	const user = useUser();
	return (
		<nav className="shadow-xl">
			<div className="flex items-center justify-between max-w-7xl mx-auto py-2 px-2 ">
				<div className="flex items-center gap-2">
					<Image
						src={"/logo.png"}
						alt="Webgenix-logo"
						width={30}
						height={30}
					/>
					<h2 className="font-semibold text-lg">Webgenix</h2>
				</div>

				<div className="flex items-center gap-2">
					{MenuItems.map((item, index) => (
						<Button variant={"secondary"} key={index}>
							{item.name}
						</Button>
					))}
				</div>

				<div>
					{!user ? (
						<SignInButton
							mode="modal"
							forceRedirectUrl={"/workspace"}
						></SignInButton>
					) : (
						<Link href={"/workspace"}>
							<Button>
								<span className="flex items-center gap-2">
									Get Started <ArrowRight />
								</span>
							</Button>
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
}
export default Header;
