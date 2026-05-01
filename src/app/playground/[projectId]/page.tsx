// "use client";
// import PlaygroundHeader from "../_components/PlaygroundHeader";
// import ChatSection from "../_components/ChatSection";
// import WebsiteDesign from "../_components/WebsiteDesign";
// import ElementSettings from "../_components/ElementSettings";
// import { useParams, useSearchParams } from "next/navigation";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";

// export type Frame = {
//   projectId: string;
//   frameId: string;
//   designCode: string;
//   chatMessages: Messages[];
// };

// export type Messages = {
//   role: string;
//   content: string;
// };

// const Prompt = `userInput: {userInput}

// Instructions:

// 1. If the user input is explicitly asking to generate code, design, or HTML/CSS/JS output (e.g., "Create a landing page", "Build a dashboard", "Generate HTML Tailwind CSS code"), then:

//    - Generate a complete HTML Tailwind CSS code using Flowbite UI components.
//    - Use a modern design with clean, minimal and professional color theme like blue, blake etc..
//    - Only include the <body> content (do not add <head> or <title>).
//    - Make it fully responsive for all screen sizes.
//    - All primary components must match the theme color.
//    - Add proper padding and margin for each element.
//    - Components should be independent; do not connect them.
//    - Use placeholders for all images:
//        - Light mode: https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg
//        - Dark mode: https://www.cibaky.com/wp-content/uploads/2015/12/placeholder-3.jpg
//        - Add alt tag describing the image prompt.
//    - Use the following libraries/components where appropriate:
//        - FontAwesome icons (fa fa-)
//        - Flowbite UI components: buttons, modals, forms, tables, tabs, alerts, cards, dialogs, dropdowns, accordions, etc.
//        - Chart.js for charts & graphs
//        - Swiper.js for sliders/carousels
//        - Tippy.js for tooltips & popovers
//    - Include interactive components like modals, dropdowns, and accordions.
//    - Ensure proper spacing, alignment, hierarchy, and theme consistency.
//    - Ensure charts are visually appealing and match the theme color.
//    - Header menu options should be spread out and not connected.
//    - Do not include broken links.
//    - Do not add any extra text before or after the HTML code.

// 2. If the user input is **general text or greetings** (e.g., "Hi", "Hello", "How are you?") **or does not explicitly ask to generate code**, then:

//    - Respond with a simple, friendly text message instead of generating any code.

// Example:

// - User: "Hi" → Response: "Hello! How can I help you today?"
// - User: "Build a responsive landing page with Tailwind CSS" → Response: [Generate full HTML code as per instructions above]`;

// const PlaygroundPage = () => {
//   const { projectId } = useParams();
//   const params = useSearchParams();
//   const frameId = params.get("frameId");

//   const [frameDetails, setFrameDetails] = useState<Frame | null>(null);

//   const [loading, setLoading] = useState(true);   // ✅ only initial load
//   const [sending, setSending] = useState(false);  // ✅ for chat sending

//   const [messages, setMessages] = useState<Messages[]>([]);
//   const [generatedCode, setGeneratedCode] = useState<any>("");

//     const saveGeneratedCode = async (code: string) => {
//     const result = await axios.put("/api/frames",{
//             designCode: code,
//             frameId: frameId,
//             projectId: projectId,
//     })
//     console.log(result)
//     toast.success("Design code saved successfully!");
//   }

// const getFrameDetails = async () => {
//   try {
//     setLoading(true);

//     const result = await axios.get(
//       `/api/frames?frameId=${frameId}&projectId=${projectId}`
//     );

//     setFrameDetails(result.data);

//     const initialMessages = result.data?.chatMessages || [];

//     const designCode = result.data?.designCode || "";
//     const index = designCode.indexOf("```html") + 7;
//     const formattedCode = designCode.slice(index);

//     setGeneratedCode(formattedCode);
//     setMessages(initialMessages);

//     // 🔥 auto-trigger AI for first prompt
//     if (
//       initialMessages.length === 1 &&
//       initialMessages[0].role === "user"
//     ) {
//       sendMessage(initialMessages[0].content, true);
//     }

//   } catch (error) {
//     console.error("Error fetching frame details:", error);
//   } finally {
//     setLoading(false);
//   }
// };

// const sendMessage = async (
//   userInput: string,
//   skipUserAdd: boolean = false
// ) => {
//   setSending(true);

//   // only add if NOT coming from DB
//   if (!skipUserAdd) {
//     setMessages((prev) => [
//       ...prev,
//       { role: "user", content: userInput },
//     ]);
//   }

//   try {
//     const result = await fetch("/api/ai-model", {
//       method: "POST",
//       body: JSON.stringify({
//         messages: [
//           {
//             role: "user",
//             content: Prompt.replace("{userInput}", userInput),
//           },
//         ],
//       }),
//     });

//     const reader = result.body?.getReader();
//     const decoder = new TextDecoder();

//     let aiResponse = "";
//     let isCode = false;

//     while (true) {
//       const { done, value } = await reader!.read();
//       if (done) break;

//       const chunk = decoder.decode(value, { stream: true });
//       aiResponse += chunk;

//       if (!isCode && aiResponse.includes("```html")) {
//         isCode = true;
//         const index = aiResponse.indexOf("```html") + 7;
//         const initialCodeChunk = aiResponse.slice(index);

//         setGeneratedCode((prev: any) => prev + initialCodeChunk);
//       } else if (isCode) {
//         setGeneratedCode((prev: any) => prev + chunk);
//       }
//     }

//     if (!isCode) {
//       setMessages((prev) => [
//         ...prev,
//         { role: "assistant", content: aiResponse },
//       ]);
//     } else {
//       setMessages((prev) => [
//         ...prev,
//         { role: "assistant", content: "Your code is ready" },
//       ]);
//     }

//     await saveGeneratedCode(aiResponse);

//   } catch (error) {
//     console.error("Send message error:", error);
//   } finally {
//     setSending(false);
//   }
// };
//   useEffect(() => {
//     if (frameId) {
//       getFrameDetails();
//     }
//   }, [frameId]);

//     const SaveMessages = async () => {
//     const result = await axios.put("/api/chats",{
//             messages: messages,
//             frameId: frameId,
//     })
//     console.log(result)
//   }

//   useEffect(() => {
//     if (messages.length > 0 && !loading && !sending) {
//       SaveMessages();
//     }
//   },[messages])

//   return (
//     <div>
//       <PlaygroundHeader />

//       <div className="flex">
//         {/* chat section */}
//         <ChatSection
//           messages={messages}
//           loading={loading}
//           sending={sending}
//           onSend={(input: string) => sendMessage(input)}
//         />

//         <WebsiteDesign generatedCode={generatedCode?.replace('```html', '')} />
//       </div>
//     </div>
//   );
// };

// export default PlaygroundPage;

"use client";
import PlaygroundHeader from "../_components/PlaygroundHeader";
import ChatSection from "../_components/ChatSection";
import WebsiteDesign from "../_components/WebsiteDesign";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export type Frame = {
	projectId: string;
	frameId: string;
	designCode: string;
	chatMessages: Messages[];
};

export type Messages = {
	role: string;
	content: string;
};

const Prompt = `userInput: {userInput}

Instructions:

1. If the user input is asking to generate UI, website, landing page, dashboard, or any HTML/CSS design:

- Generate a complete, modern UI using Tailwind CSS and Flowbite components.
- Use a clean, minimal, professional theme (prefer dark + blue accents).
- Ensure fully responsive design for all screen sizes.

 OUTPUT RULES (STRICT):
- Return ONLY raw HTML.
- DO NOT wrap in \`\`\` or markdown.
- DO NOT include <html>, <head>, or <title>.
- DO NOT include <html>, <head>, <title>, or <!DOCTYPE>.
- DO NOT include partial or broken tags like "< lang='en'>" or "< html>".
- ONLY valid HTML inside <body> is allowed.
- START directly with <body> and END with </body>.
- DO NOT include any explanation or text outside HTML.

 DESIGN REQUIREMENTS:
- Maintain proper spacing, padding, and layout hierarchy.
- Use consistent color theme across all components.
- Header navigation should be clean, well spaced, and not cluttered.
- Components should be visually separated and structured.

 COMPONENT USAGE (use when relevant):
- Flowbite UI: navbar, buttons, cards, modals, forms, tables, tabs, alerts, dropdowns, accordions
- FontAwesome icons (fa fa-)
- Chart.js for charts and graphs
- Swiper.js for sliders/carousels
- Tippy.js for tooltips/popovers

🖼 IMAGE RULES (VERY IMPORTANT):

- ALWAYS use placeholder images:
  - Light: https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg
  - Dark: https://www.cibaky.com/wp-content/uploads/2015/12/placeholder-3.jpg

- EVERY <img> MUST include an ALT TAG that acts as an AI IMAGE GENERATION PROMPT.

- The alt text MUST:
  • Be descriptive and specific  
  • Describe subject, style, lighting, and context  
  • Be usable directly for AI image generation  

- Format:
  "[subject], [style], [lighting], [context]"

GOOD examples:
- "modern SaaS dashboard UI, dark mode, glowing analytics charts, futuristic interface"
- "startup team collaborating in office, natural lighting, professional photography"
- "mobile fintech app UI, clean minimal design, blue theme, soft shadows"
- "developer workspace with multiple monitors, coding environment, cyberpunk lighting"

BAD examples:
- "image"
- "placeholder"
- "photo"
- "dashboard"

- DO NOT leave alt empty.
- DO NOT use generic alt text.

INTERACTION RULES (VERY IMPORTANT):

- Images MUST always be directly clickable.
- DO NOT place any overlay, absolute element, or div above images that blocks pointer events.

- If overlays are used for design (hover effects, gradients, etc.):
  • They MUST include: pointer-events: none;
  • OR be placed behind the image using z-index

- DO NOT wrap images inside containers that block click interaction.

- The <img> element must always be the top clickable layer.

RESTRICTIONS:
- No broken links.
- Avoid unnecessary "#" links unless required.
- No explanation text outside HTML.
- No markdown formatting.

---

2. If the user input is casual (Hi, Hello, etc.) or NOT asking for UI/code:

- Respond with a short, friendly text message.
- DO NOT generate HTML.

---

Examples:

User: "Hi"
→ "Hello! How can I help you today?"

User: "Build a modern dashboard UI"
→ (Return ONLY raw HTML starting with <body> and ending with </body>)`;

const PlaygroundPage = () => {
	const { projectId } = useParams();
	const params = useSearchParams();
	const frameId = params.get("frameId");

	const [frameDetails, setFrameDetails] = useState<Frame | null>(null);
	const [loading, setLoading] = useState(true);
	const [sending, setSending] = useState(false);

	const [messages, setMessages] = useState<Messages[]>([]);
	const [generatedCode, setGeneratedCode] = useState<string>("");

	const saveGeneratedCode = async (code: string) => {
		await axios.put("/api/frames", {
			designCode: code,
			frameId,
			projectId,
		});
		toast.success("Design code saved successfully!");
	};

	const getFrameDetails = async () => {
		try {
			setLoading(true);

			const result = await axios.get(
				`/api/frames?frameId=${frameId}&projectId=${projectId}`,
			);

			setFrameDetails(result.data);

			const initialMessages = result.data?.chatMessages || [];
			const designCode = result.data?.designCode || "";

			setGeneratedCode(designCode);
			setMessages(initialMessages);

			// auto trigger AI if first message
			if (
				initialMessages.length === 1 &&
				initialMessages[0].role === "user" &&
				(!designCode || designCode.trim() === "")
			) {
				sendMessage(initialMessages[0].content, true);
			}
		} catch (error) {
			console.error("Error fetching frame details:", error);
		} finally {
			setLoading(false);
		}
	};

	const sendMessage = async (
		userInput: string,
		skipUserAdd: boolean = false,
	) => {
		setSending(true);

		if (!skipUserAdd) {
			setMessages((prev) => [
				...prev,
				{ role: "user", content: userInput },
			]);
		}

		try {
			setGeneratedCode(""); // 🔥 reset before streaming

			const result = await fetch("/api/ai-model", {
				method: "POST",
				body: JSON.stringify({
					messages: [
						{
							role: "user",
							content: Prompt.replace("{userInput}", userInput),
						},
					],
				}),
			});

			const reader = result.body?.getReader();
			const decoder = new TextDecoder();

			let aiResponse = "";
			let isCode = false;

			while (true) {
				const { done, value } = await reader!.read();
				if (done) break;

				const chunk = decoder.decode(value, { stream: true });
				aiResponse += chunk;

				const trimmed = aiResponse.trim();

				// 🔥 KEY FIX: detect HTML instead of markdown
				if (!isCode) {
					if (
						trimmed.startsWith("<") ||
						trimmed.includes("<body") ||
						trimmed.includes("<div")
					) {
						isCode = true;

						const cleaned = trimmed
							.replace(/```html/gi, "")
							.replace(/```/g, "");

						setGeneratedCode(cleaned);
					}
				} else {
					setGeneratedCode((prev) => prev + chunk);
				}
			}

			const cleanedFinal = aiResponse
				.replace(/```html/gi, "")
				.replace(/```/g, "");

			if (!isCode) {
				setMessages((prev) => [
					...prev,
					{ role: "assistant", content: aiResponse },
				]);
			} else {
				setGeneratedCode(cleanedFinal);

				setMessages((prev) => [
					...prev,
					{ role: "assistant", content: "Your code is ready" },
				]);

				await saveGeneratedCode(cleanedFinal);
			}
		} catch (error) {
			console.error("Send message error:", error);
		} finally {
			setSending(false);
		}
	};

	useEffect(() => {
		if (frameId) {
			getFrameDetails();
		}
	}, [frameId]);

	const SaveMessages = async () => {
		await axios.put("/api/chats", {
			messages,
			frameId,
		});
	};

	useEffect(() => {
		if (messages.length > 0 && !loading && !sending) {
			SaveMessages();
		}
	}, [messages]);

	return (
		<div>
			<PlaygroundHeader />

			<div className="flex">
				<ChatSection
					messages={messages}
					loading={loading}
					sending={sending}
					onSend={(input: string) => sendMessage(input)}
				/>

				<WebsiteDesign generatedCode={generatedCode} setGeneratedCode={setGeneratedCode}/>
			</div>
		</div>
	);
};

export default PlaygroundPage;
