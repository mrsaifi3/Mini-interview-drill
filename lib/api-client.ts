// Client-side API utilities for making requests to our API routes
interface ApiResponse<T> {
  data?: T
  error?: string
  details?: Array<{ field: string; message: string }>
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: Array<{ field: string; message: string }>,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(endpoint, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  })

  const data: ApiResponse<T> = await response.json()

  if (!response.ok) {
    throw new ApiError(data.error || "An error occurred", response.status, data.details)
  }

  return data.data as T
}

export const apiClient = {
  // Drills
  async getDrills(difficulty?: string) {
    const params = difficulty ? `?difficulty=${difficulty}` : ""
    return apiRequest<{ drills: any[] }>(`/api/drills${params}`)
  },

  async getDrill(id: string) {
    return apiRequest<{ drill: any }>(`/api/drills/${id}`)
  },

  // Attempts
  async submitAttempt(data: { drill_id: string; answers: Array<{ questionId: number; answer: string }> }) {
    return apiRequest<{ attempt: any }>("/api/attempts", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  async getAttempts(limit?: number) {
    const params = limit ? `?limit=${limit}` : ""
    return apiRequest<{ attempts: any[] }>(`/api/attempts${params}`)
  },

  async getStats() {
    return apiRequest<{ stats: any }>("/api/attempts/stats")
  },
}

export { ApiError }
