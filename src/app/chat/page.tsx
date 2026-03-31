import type { Metadata } from "next";
import AIAssistant from "@/components/chat/AIAssistant";

export const metadata: Metadata = {
  title: "AI Assistant",
  description:
    "Chat with OLLIN\u2019s AI assistant for instant answers about contractor marketing.",
  alternates: { canonical: "/chat" },
  openGraph: {
    title: "AI Assistant",
    description:
      "Chat with OLLIN\u2019s AI assistant for instant answers about contractor marketing.",
    url: "/chat",
  },
  twitter: {
    card: "summary",
    title: "AI Assistant",
    description:
      "Chat with OLLIN\u2019s AI assistant for instant answers about contractor marketing.",
  },
};

export default function ChatPage() {
  return <AIAssistant />;
}
