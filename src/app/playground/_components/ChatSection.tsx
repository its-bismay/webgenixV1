import { Button } from "@/components/ui/button";
import { Messages } from "../[projectId]/page";
import { ArrowUp } from "lucide-react";
import { useState } from "react";

type Props = {
  messages: Messages[];
  loading: boolean;
  sending: boolean;
  onSend: any;
};

const ChatSection = ({ messages, loading, sending, onSend }: Props) => {
  const [input, setInput] = useState<string>("");

  const handelSubmit = () => {
    if (!input?.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="w-96 h-[92vh] shadow p-2 flex flex-col">

      <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">

        {/* 🔄 ONLY for initial load */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-2 items-end">
                <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse" />
                <div className="h-4 bg-gray-300 rounded w-2/3 animate-pulse" />
              </div>
            ))}
          </div>

        ) : messages?.length === 0 ? (
          <p className="text-gray-400 text-center">No messages yet</p>

        ) : (
          <>
            {/* 💬 Messages */}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                } gap-2`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-400 text-white">
                    🤖
                  </div>
                )}

                <div
                  className={`p-2 rounded-b-lg max-w-[80%]
                  ${
                    message.role === "user"
                      ? "bg-accent text-black"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  {message.content}
                </div>

                {message.role === "user" && (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white">
                    👤
                  </div>
                )}
              </div>
            ))}

            {/* 🤖 Typing indicator (when sending) */}
            {sending && (
              <div className="flex justify-start gap-2 items-end">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-400 text-white">
                  🤖
                </div>
                <div className="px-3 py-2 bg-gray-300 rounded-2xl text-sm animate-pulse">
                  typing...
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* input section */}
      <div className="p-3 border-t flex items-center gap-2">
        <textarea
          value={input}
          className="flex-1 resize-none border rounded-lg px-3 py-2 focus:outline-none"
          placeholder="Describe your website idea"
          onChange={(e) => setInput(e.target.value)}
        />
        <Button onClick={handelSubmit} disabled={sending}>
          <ArrowUp />
        </Button>
      </div>
    </div>
  );
};

export default ChatSection;