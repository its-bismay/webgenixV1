"use client";
import { OnSaveContext } from "@/context/OnSaveContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Provider = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	const { user } = useUser();
	const [userDetails, setUserDetails] = useState<any>();
	const [onSaveData, setOnSaveData] = useState<any>();

	const CreateNewUser = async () => {
		try {
			const result = await axios.post("/api/users");
			console.log(result.data);
			setUserDetails(result.data.user);
		} catch (error) {
			console.error("User creation failed:", error);

			let message = "Something went wrong";

			if (axios.isAxiosError(error)) {
				message = error.response?.data?.error || error.message;
			} else if (error instanceof Error) {
				message = error.message;
			}
			toast.error(message);
		}
	};

	useEffect(() => {
		if (user?.id) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			CreateNewUser();
		}
	}, [user?.id]);
	return (
		<>
			<UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
				<OnSaveContext.Provider value={{onSaveData, setOnSaveData}}>
					{children}
				</OnSaveContext.Provider>
			</UserDetailContext.Provider>
		</>
	);
};
export default Provider;
