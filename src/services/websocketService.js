export class WebSocketService {
  constructor() {
    this.socket = null;
    this.messageHandlers = new Set();
    this.notificationHandlers = new Set();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000; // 3 seconds
  }

  connect(userId) {
    if (this.socket) {
      this.disconnect();
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;
    this.socket = new WebSocket(`${protocol}//${host}/ws/messages/${userId}/`);

    this.socket.onopen = () => {
      console.log("WebSocket connected");
      this.reconnectAttempts = 0;
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "message") {
        this.messageHandlers.forEach((handler) => handler(data));
      } else if (data.type === "notification") {
        this.notificationHandlers.forEach((handler) => handler(data));
      }
    };

    this.socket.onclose = (event) => {
      console.log("WebSocket disconnected", event);
      if (
        !event.wasClean &&
        this.reconnectAttempts < this.maxReconnectAttempts
      ) {
        setTimeout(() => {
          this.reconnectAttempts++;
          this.connect(userId);
        }, this.reconnectDelay);
      }
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
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
