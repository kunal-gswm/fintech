export async function apiClient<T>(url: string, options?: RequestInit): Promise<T> {
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  };

  const res = await fetch(url, { ...defaultOptions, ...options });

  if (!res.ok) {
    let errorMessage = "Request failed";
    try {
      const errorData = await res.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      // Ignore if not json
    }
    throw new Error(errorMessage);
  }

  return res.json() as Promise<T>;
}
