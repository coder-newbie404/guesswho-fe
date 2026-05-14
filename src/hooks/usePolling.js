import { useEffect, useState } from "react";

export function usePolling(fetchFn, intervalMs = 2000) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let active = true;

    const poll = async () => {
      try {
        const result = await fetchFn();
        if (active) setData(result);
      } catch {
        // ignore polling errors
      }
    };

    poll();
    const id = setInterval(poll, intervalMs);

    return () => {
      active = false;
      clearInterval(id);
    };
  }, [fetchFn, intervalMs]);

  return data;
}
