"use client";

import { ChatProvider } from "../../components/nc/ChatProvider";
import ChatScreen from "../../components/nc/ChatScreen";
import { BuildChatBootstrap } from "../../components/nc/BuildChatBootstrap";

export const runtime = "edge";

export default function BuildPage() {
  return (
    <ChatProvider>
      <BuildChatBootstrap />
      <ChatScreen />
    </ChatProvider>
  );
}
