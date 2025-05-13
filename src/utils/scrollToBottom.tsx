import { createRef } from "react";

export const messagesEndRef = createRef<HTMLDivElement>();

export const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};
