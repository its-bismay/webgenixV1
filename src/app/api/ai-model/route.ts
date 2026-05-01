// import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";

// export async function POST(req: NextRequest) {
// 	try {
// 		const { messages } = await req.json();

// 		const response = await axios.post(
// 			"https://openrouter.ai/api/v1/chat/completions",
// 			{
// 				model: "openai/gpt-oss-120b:free",
// 				messages,
// 				stream: true,
// 				reasoning: { enabled: false },
// 			},
// 			{
// 				headers: {
// 					Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
// 					"Content-Type": "application/json",
// 				},
// 				responseType: "stream", // important for streaming
// 			},
// 		);

// 		const stream = response.data;

// 		// Return as a web stream so frontend can consume
// 		const encoder = new TextEncoder();

// 		const readable = new ReadableStream({
// 			async start(controller) {
// 				stream.on("data", (chunk:any) => {
// 					const payloads = chunk.toString().split("\n\n");
// 					for (const payload of payloads) {
// 						if (payload.includes("[DONE]")) {
// 							controller.close();
// 							return;
// 						}
// 						if (payload.startsWith("data:")) {
// 							try {
// 								const data = JSON.parse(
// 									payload.replace("data:", ""),
// 								);
// 								const text = data.choices[0]?.delta?.content;
// 								if (text) {
// 									controller.enqueue(encoder.encode(text));
// 								}
// 							} catch (err) {
// 								console.error("Error parsing stream", err);
// 							}
// 						}
// 					}
// 				});

// 				stream.on("end", () => {
// 					controller.close();
// 				});

// 				stream.on("error", (err:any) => {
// 					console.error("Stream error", err);
// 					controller.error(err);
// 				});
// 			},
// 		});

// 		return new NextResponse(readable, {
// 			headers: {
// 				"Content-Type": "text/plain; charset=utf-8",
// 				"Transfer-Encoding": "chunked",
// 			},
// 		});
// 	} catch (error) {
// 		console.error("API error:", error);
// 		return NextResponse.json(
// 			{ error: "Something went wrong" },
// 			{ status: 500 },
// 		);
// 	}
// }


import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Convert your chat messages → single prompt
    const prompt = messages.map((m: any) => m.content).join("\n");

    const response = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (err) {
          console.error("Stream error:", err);
          controller.error(err);
        }
      },
    });

    return new NextResponse(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}