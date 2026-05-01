"use client";

import { useContext, useEffect, useRef, useState } from "react";
import WebPageTools from "./WebPageTools";
import ElementSettings from "./ElementSettings";
import ImageSettingSection from "./ImageSettings";
import { OnSaveContext } from "@/context/OnSaveContext";
import axios from "axios";
import { toast } from "sonner";
import { useParams, useSearchParams } from "next/navigation";

type Props = {
	generatedCode: string;
	setGeneratedCode: React.Dispatch<React.SetStateAction<string>>;
};

const HTML_CODE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AI Website Builder</title>

  <script src="https://cdn.tailwindcss.com"></script>

  <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <style>
    .hover-outline {
      outline: 2px dotted blue;
    }
    .selected-outline {
      outline: 2px solid red;
    }
  </style>
</head>
<body>
  <div id="root"></div>
</body>
</html>
`;

function WebsiteDesign({ generatedCode, setGeneratedCode }: Props) {
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const [selectedScreenSize, setSelectedScreenSize] = useState("web");

	// ✅ FIXED state
	const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(
		null,
	);

	const { onSaveData } = useContext(OnSaveContext);

	const { projectId } = useParams();
	const params = useSearchParams();
	const frameId = params.get("frameId");

	// 🔥 CLEAN HTML (FIXED)
	const extractBodyContent = (html: string) => {
		if (!html) return "";

		return html
			.replace(/```html/gi, "")
			.replace(/```/g, "")
			.replace(/<!DOCTYPE[^>]*>/gi, "")
			.replace(/<\/?html[^>]*>/gi, "")
			.replace(/<\/?head[^>]*>[\s\S]*?<\/head>/gi, "")
			.replace(/<\/?body[^>]*>/gi, "") // 🔥 CRITICAL FIX
			.trim();
	};

	// 🔹 Init iframe
	useEffect(() => {
		const iframe = iframeRef.current;
		if (!iframe) return;

		const doc = iframe.contentDocument;
		if (!doc) return;

		doc.open();
		doc.write(HTML_CODE);
		doc.close();
	}, []);

	// 🔹 Inject content + events
	useEffect(() => {
		const iframe = iframeRef.current;
		if (!iframe) return;

		const doc = iframe.contentDocument;
		if (!doc) return;

		const root = doc.getElementById("root");
		if (!root) return;

		const cleanCode = extractBodyContent(generatedCode);

		root.innerHTML = `<div id="ai-root">${cleanCode}</div>`;

		const container = doc.getElementById("ai-root");
		if (!container) return;

		let hoverEl: HTMLElement | null = null;
		let selectedEl: HTMLElement | null = null;

		const handleMouseOver = (e: MouseEvent) => {
			const target = e.target as HTMLElement;

			if (selectedEl && target !== selectedEl) return;

			if (hoverEl && hoverEl !== target) {
				hoverEl.classList.remove("hover-outline");
			}

			hoverEl = target;
			hoverEl.classList.add("hover-outline");
		};

		const handleMouseOut = () => {
			if (hoverEl) {
				hoverEl.classList.remove("hover-outline");
				hoverEl = null;
			}
		};

		const handleClick = (e: MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();

			let target = e.target as HTMLElement;

			const imgEl = target.closest("img");

			if (imgEl) {
				target = imgEl as HTMLElement;
			}

			if (selectedEl && selectedEl !== target) {
				selectedEl.classList.remove("selected-outline");
				selectedEl.removeAttribute("contenteditable");
			}

			selectedEl = target;
			selectedEl.classList.add("selected-outline");
			selectedEl.setAttribute("contenteditable", "true");
			selectedEl.focus();

			setSelectedElement(selectedEl);
		};

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && selectedEl) {
				selectedEl.classList.remove("selected-outline");
				selectedEl.removeAttribute("contenteditable");
				selectedEl = null;
				setSelectedElement(null);
			}
		};

		container.addEventListener("mouseover", handleMouseOver);
		container.addEventListener("mouseout", handleMouseOut);
		container.addEventListener("click", handleClick);
		doc.addEventListener("keydown", handleKeyDown);

		return () => {
			container.removeEventListener("mouseover", handleMouseOver);
			container.removeEventListener("mouseout", handleMouseOut);
			container.removeEventListener("click", handleClick);
			doc.removeEventListener("keydown", handleKeyDown);
		};
	}, [generatedCode]);

	const onSaveCode = async () => {
		if (!iframeRef.current) return;

		try {
			const iframeDoc =
				iframeRef.current.contentDocument ||
				iframeRef.current.contentWindow?.document;

			if (!iframeDoc) return;

			const cloneDoc = iframeDoc.documentElement.cloneNode(
				true,
			) as HTMLElement;

			cloneDoc.querySelectorAll<HTMLElement>("*").forEach((el) => {
				el.style.outline = "";
				el.style.cursor = "";

				el.classList.remove("selected-outline");
				el.classList.remove("hover-outline");
			});

			const html = cloneDoc.outerHTML;

			await axios.put("/api/frames", {
				designCode: html,
				frameId,
				projectId,
			});
			setGeneratedCode(html);

			toast.success("Project saved successfully");
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (onSaveData) onSaveCode();
	}, [onSaveData]);

	return (
		<div className="flex gap-2 w-full">
			<div className="p-2 w-full flex flex-col items-center">
				<iframe
					ref={iframeRef}
					className={`${
						selectedScreenSize === "web" ? "w-full" : "w-[400px]"
					} h-[575px] border-2 rounded-xl`}
					sandbox="allow-scripts allow-same-origin"
				/>

				<WebPageTools
					selectedScreenSize={selectedScreenSize}
					setSelectedScreenSize={setSelectedScreenSize}
					code={generatedCode}
				/>
			</div>

			{selectedElement &&
				(selectedElement.tagName.toLowerCase() === "img" ? (
					<ImageSettingSection
						selectedEl={selectedElement as HTMLImageElement}
					/>
				) : (
					<ElementSettings
						selectedEl={selectedElement}
						clearSelection={() => setSelectedElement(null)}
					/>
				))}
		</div>
	);
}

export default WebsiteDesign;
