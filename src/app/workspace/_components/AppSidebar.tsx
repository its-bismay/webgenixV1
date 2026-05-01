"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useAuth, UserButton } from "@clerk/nextjs";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const AppSidebar = () => {
	const [projectList, setProjectList] = useState([]);

	const { userDetails, setUserDetails } = useContext(UserDetailContext);
	const [loading, setLoading] = useState(false);
	const {has} = useAuth()
	const hasProAccess = has({ plan: 'pro' })

	const GetProjectList = async () => {
		try {
			setLoading(true);
			const result = await axios.get("/api/get-all-projects");
			setProjectList(result.data);
			console.log(result.data);
		} catch (error: any) {
			console.log(error);
			const message = error.message || "";
			toast.error("error fetching projects", message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		GetProjectList();
	}, []);
	return (
		<Sidebar>
			<SidebarHeader className="p-2">
				<div className="flex items-center gap-2 justify-center">
					<Image
						src={"/logo.png"}
						alt="webgenix-logo"
						width={30}
						height={30}
					/>

					<h2 className="font-semibold text-lg">Webgenix</h2>
				</div>

				<Link href={"/workspace"} className="w-full mt-5">
					<Button className="w-full">+ New Project</Button>
				</Link>
			</SidebarHeader>
			<SidebarContent className="p-2">
				<SidebarGroup>
					<SidebarGroupLabel>Projects</SidebarGroupLabel>
					{!loading && projectList?.length === 0 && (
						<h2 className="text-sm px-2 text-gray-500">
							No Project Found
						</h2>
					)}

					<div>
						{!loading && projectList?.length > 0
							? projectList.map((project: any, index) => (
									<Link
										href={`/playground/${project.projectId}?frameId=${project.frameId}`}
										key={index}
										className="my-2 hover:bg-secondary p-2 rouned-lg  cursor-pointer"
									>
										<h2 className="line-clamp-1">
											{project?.chats?.[0]
												?.chatMessage?.[0]?.content ||
												"Untitled Project"}
										</h2>
									</Link>
								))
							: [1, 2, 3, 4, 5].map((_, index) => (
									<Skeleton
										className="w-full h-10 rounded-lg mt-2"
										key={index}
									/>
								))}
					</div>
				</SidebarGroup>
				<SidebarGroup />
			</SidebarContent>
			<SidebarFooter className="p-2">
				{!hasProAccess && 
				<div className="p-2 border rounded-xl space-y-2 bg-secondary">
					<h2 className="flex items-center justify-between">
						Remaining Credits
						<span className="font-bold">
							{userDetails?.credits}
						</span>
					</h2>
					<Progress value={userDetails?.credits / 2 * 100} />
					<Link href={"/workspace//pricing"} className="w-full">
					<Button className="w-full">Upgrade Plan</Button>
					</Link>
					
				</div>
				}
				<div className="flex items-center gap-2">
					<UserButton />
					<Button variant={"ghost"}>Settings</Button>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
};
export default AppSidebar;
