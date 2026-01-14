/**
 * GEH_API - Global API Client for Group Escape Houses
 * Base URL: https://api.groupescapehouses.com/v1
 * Auth: Bearer token from localStorage
 * Features: Auto 401 redirect, JSON-only, helpers for all HTTP methods
 */

const BASE_URL = "https://api.groupescapehouses.com/v1";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Get Bearer token from localStorage
   */
  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("bearer_token");
  }

  /**
   * Core request handler
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      method = "GET",
      body,
      headers = {},
      requiresAuth = true,
    } = options;

    const token = this.getToken();

    // Build headers
    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    // Add Bearer token if available and required
    if (requiresAuth && token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }

    // Build request config
    const config: RequestInit = {
      method,
      headers: requestHeaders,
    };

    // Add body for non-GET requests
    if (body && method !== "GET") {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      // Handle 401 Unauthorized - redirect to login
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("bearer_token");
          window.location.href = "/login";
        }
        throw new Error("Unauthorized");
      }

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `API Error: ${response.status} ${response.statusText}`
        );
      }

      // Return JSON response
      return await response.json();
    } catch (error) {
      console.error(`API Request Failed: ${method} ${endpoint}`, error);
      throw error;
    }
  }

  /**
   * GET request helper
   */
  async get<T>(endpoint: string, requiresAuth = true): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", requiresAuth });
  }

  /**
   * POST request helper
   */
  async post<T>(endpoint: string, body: any, requiresAuth = true): Promise<T> {
    return this.request<T>(endpoint, { method: "POST", body, requiresAuth });
  }

  /**
   * PUT request helper
   */
  async put<T>(endpoint: string, body: any, requiresAuth = true): Promise<T> {
    return this.request<T>(endpoint, { method: "PUT", body, requiresAuth });
  }

  /**
   * DELETE request helper
   */
  async delete<T>(endpoint: string, requiresAuth = true): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE", requiresAuth });
  }
}

// Export singleton instance
export const GEH_API = new APIClient(BASE_URL);
