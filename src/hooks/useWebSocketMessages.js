// hooks/useWebSocketMessages.js
// hooks/useWebSocketMessages.js
import { useEffect } from "react";
import { webSocketService } from "../services/websocketService";

export const useWebSocketMessages = (userId, callbacks = {}) => {
  useEffect(() => {
    if (!userId) return;

    // Connect to WebSocket
    webSocketService.connect(userId);

    // Enhanced message handler that processes both new messages and delivery receipts
    const handleIncomingMessage = (data) => {
      if (data.status === "new" && callbacks.onNewMessage) {
        // Handle incoming message
        callbacks.onNewMessage({
          id: data.message_id,
          sender: {
            id: data.sender_id,
            name: data.sender_name,
          },
          subject: data.subject,
          body: data.body,
          is_read: data.is_read,
          created_at: data.created_at,
          status: "new",
        });
      } else if (data.status === "delivered" && callbacks.onMessageDelivered) {
        // Handle delivery receipt
        callbacks.onMessageDelivered({
          message_id: data.message_id,
          recipient_id: data.recipient_id,
          created_at: data.created_at,
        });
      }
    };

    // Set up handlers
    const cleanups = [
      webSocketService.addMessageHandler(handleIncomingMessage),
    ];

    if (callbacks.onNewNotification) {
      cleanups.push(
        webSocketService.addNotificationHandler(callbacks.onNewNotification)
      );
    }

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      webSocketService.disconnect();
    };
  }, [
    userId,
    callbacks,
    callbacks.onNewMessage,
    callbacks.onMessageDelivered,
    callbacks.onNewNotification,
  ]);
};
