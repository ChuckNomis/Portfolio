export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const formatTimestamp = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const scrollToBottom = (element: HTMLElement | null) => {
  if (element) {
    element.scrollTop = element.scrollHeight;
  }
};

export const formatMessageContent = (content: string): string => {
  // Simple preprocessing for better display
  return content.trim();
};