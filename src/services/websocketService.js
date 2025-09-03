export class WebSocketService {
  constructor() {
    this.socket = null;
    this.messageHandlers = new Set();
    this.notificationHandlers = new Set();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000; // 3 seconds
    this.userId = null;
    this.isConnecting = false;
  }

  connect(userId) {
    if (
      this.isConnecting ||
      (this.socket && this.socket.readyState === WebSocket.OPEN)
    ) {
      return;
    }

    if (!userId) {
      console.warn("Cannot connect WebSocket: No userId provided");
      return;
    }

    this.userId = userId;
    this.isConnecting = true;

    if (this.socket) {
      this.disconnect();
    }

    try {
      // Fix WebSocket URL - use the correct backend port
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const backendHost = "localhost:8000"; // Your Django backend host
      const wsUrl = `${protocol}//${backendHost}/ws/messages/${userId}/`;

      console.log("Connecting to WebSocket:", wsUrl);
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log("WebSocket connected successfully");
        this.reconnectAttempts = 0;
        this.isConnecting = false;
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("WebSocket message received:", data);

          // Handle different message types
          if (data.type === "message" || data.message_id) {
            this.messageHandlers.forEach((handler) => {
              try {
                handler(data);
              } catch (error) {
                console.error("Error in message handler:", error);
              }
            });
          }

          if (data.type === "notification") {
            this.notificationHandlers.forEach((handler) => {
              try {
                handler(data);
              } catch (error) {
                console.error("Error in notification handler:", error);
              }
            });
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      this.socket.onclose = (event) => {
        console.log("WebSocket disconnected", event);
        this.isConnecting = false;

        // Only attempt reconnection if it wasn't a clean close and we haven't exceeded max attempts
        if (
          !event.wasClean &&
          this.reconnectAttempts < this.maxReconnectAttempts
        ) {
          console.log(
            `Attempting to reconnect (${this.reconnectAttempts + 1}/${
              this.maxReconnectAttempts
            })`
          );
          setTimeout(() => {
            this.reconnectAttempts++;
            this.connect(this.userId);
          }, this.reconnectDelay);
        } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.warn("Max reconnection attempts reached");
        }
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.isConnecting = false;
      };
    } catch (error) {
      console.error("Error creating WebSocket connection:", error);
      this.isConnecting = false;
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close(1000, "Client disconnecting"); // Clean close
      this.socket = null;
    }
    this.isConnecting = false;
    this.userId = null;
    this.reconnectAttempts = 0;
  }

  sendMessage(data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
      return true;
    }
    return false;
  }

  addMessageHandler(handler) {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  addNotificationHandler(handler) {
    this.notificationHandlers.add(handler);
    return () => this.notificationHandlers.delete(handler);
  }
}

export const webSocketService = new WebSocketService();
