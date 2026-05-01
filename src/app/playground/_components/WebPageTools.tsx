"use client"

import { Button } from "@/components/ui/button";
import {
	Code2Icon,
	Download,
	Monitor,
	SquareArrowOutUpRight,
	TabletSmartphone,
} from "lucide-react";
import ViewCodeModal from "./ViewCodeModal";
import { useEffect, useState } from "react";

const Html_Snippet = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="description" content="AI Website Builder - Modern TailwindCSS + Flowbite Template">
          <title>AI Website Builder</title>

          <!-- Tailwind CSS -->
          <script src="https://cdn.tailwindcss.com"></script>

          <!-- Flowbite CSS & JS -->
          <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
          <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

          <!-- Font Awesome / Lucide -->
          <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>

          <!-- Chart.js -->
          <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

          <!-- AOS -->
          <link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet">
          <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>

          <!-- GSAP -->
          <script src="https://cdnjs.cloudflare
          <!-- Swiper -->
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
          <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>

          <!-- Tippy.js -->
          <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/dist/tippy.css" />
          <script src="https://unpkg.com/@popperjs/core@2"></script>
          <script src="https://unpkg.com/tippy.js@6"></script>
      </head>
      <body id="root">
      {code}
      </body>
      </html>
    `;

const WebPageTools = ({
	selectedScreenSize,
	setSelectedScreenSize,
	code,
}: any) => {

    const [finalCode, setFinalCode] = useState<string>("");

    useEffect(() => {
       		if (!code) return;
		const cleanCode = (Html_Snippet.replace("{code}", code) || "")
			.replaceAll("```html", "")
			.replace("```", "")
			.replaceAll("html", ""); 
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setFinalCode(cleanCode);
    }, [code]);

	const ViewInNewTab = () => {
		if (!finalCode) return;
		const blob = new Blob([finalCode??""], { type: "text/html" });
		const url = URL.createObjectURL(blob);
		window.open(url, "_blank");
	};


    const downloadCode = () => {
        const blob = new Blob([finalCode??""], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "index.html";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

	return (
		<div className="p-2 shadow rounded-xl w-full flex items-center justify-between">
			<div className="flex items-center gap-2">
				<Button
					variant={"ghost"}
					onClick={() => setSelectedScreenSize("web")}
					className={`${selectedScreenSize === "web" ? "border-primary" : ""}`}
				>
					<Monitor />
				</Button>
				<Button
					variant={"ghost"}
					onClick={() => setSelectedScreenSize("mobile")}
					className={`${selectedScreenSize === "mobile" ? "border-primary" : ""}`}
				>
					<TabletSmartphone />
				</Button>
			</div>

			<div className="flex gap-2 items-center">
				<Button variant={"outline"} onClick={() => ViewInNewTab()}>
					View <SquareArrowOutUpRight />
				</Button>
				<ViewCodeModal code={finalCode}>
					<Button>
						Code <Code2Icon />
					</Button>
				</ViewCodeModal>
				<Button onClick={() => downloadCode()}>
					Download <Download />
				</Button>
			</div>
		</div>
	);
};
export default WebPageTools;
