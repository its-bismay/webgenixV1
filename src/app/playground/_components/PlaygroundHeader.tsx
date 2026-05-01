import { Button } from "@/components/ui/button";
import { OnSaveContext } from "@/context/OnSaveContext";
import Image from "next/image";
import { useContext } from "react";

const PlaygroundHeader = () => {

	const {onSaveData, setOnSaveData} = useContext(OnSaveContext)
	return (
		<nav className="shadow-xl">
			<div className="flex items-center justify-between max-w-7xl mx-auto p-2">
				<div className="flex items-center gap-2">
					<Image
						src={"/logo.png"}
						alt="webgenix-logo"
						width={30}
						height={30}
					/>
					<h2 className="font-semibold text-lg">Webgenix</h2>
				</div>

				<Button onClick={() => setOnSaveData(Date.now())}>Save</Button>
			</div>
		</nav>
	);
};
export default PlaygroundHeader;
