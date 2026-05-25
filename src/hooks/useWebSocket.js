import { useEffect, useRef, useState, useCallback } from "react";

export function useWebSocket(url, enabled = true) {
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const enabledRef = useRef(enabled);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  const connect = useCallback(() => {
    if (!enabledRef.current || !url) return;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastMessage(data);
      } catch {
        // ignore non-JSON messages
      }
    };

    ws.onclose = () => {
      setConnected(false);
      wsRef.current = null;

      if (enabledRef.current) {
        const attempt = reconnectTimeoutRef.current?.attempt ?? 0;
        const delay = Math.min(1000 * 2 ** attempt, 8000);
        reconnectTimeoutRef.current = { attempt: attempt + 1, id: setTimeout(connect, delay) };
      }
    };

    ws.onerror = () => {
      // onclose will handle reconnect
    };
  }, [url]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current?.id) {
      clearTimeout(reconnectTimeoutRef.current.id);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnected(false);
  }, []);

  useEffect(() => {
    if (enabled) {
      reconnectTimeoutRef.current = { attempt: 0, id: null };
      connect();
    } else {
      disconnect();
    }
    return disconnect;
  }, [enabled, url, connect, disconnect]);

  return { connected, lastMessage };
}
