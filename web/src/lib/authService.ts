const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  isEmailVerified: boolean;
}

interface TokenInfo {
  token: string;
  expiresAt: Date;
  issuedAt: Date;
  remainingTime: number;
}

interface SessionInfo {
  tokenInfo: TokenInfo;
  isExpiringSoon: boolean;
  user: User;
}

interface ChangePasswordResponse {
  message: string;
}

interface UpdateProfileResponse {
  message: string;
  user: User;
}

class AuthService {
  private tokenRefreshPromise: Promise<AuthTokens> | null = null;

  // Store tokens securely
  setTokens(tokens: AuthTokens): void {
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
  }

  // Get access token
  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  // Get refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  }

  // Store user data
  setUser(user: User): void {
    localStorage.setItem("user", JSON.stringify(user));
  }

  // Get user data
  getUser(): User | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();
    const user = this.getUser();
    return !!(accessToken && user);
  }

  // Check if token is expiring soon (within 5 minutes)
  isTokenExpiringSoon(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);
      const threshold = 5 * 60; // 5 minutes
      return payload.exp - now <= threshold;
    } catch {
      return true; // Assume expired if we can't decode
    }
  }

  // Authentication methods
  async register(
    username: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string; code?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, message: "Network error" };
    }
  }

  async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string; code?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.accessToken) {
        const tokens = {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };
        this.setTokens(tokens);
        this.setUser(data.user);
        this.setupTokenRefresh();
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Network error" };
    }
  }

  async verifyEmail(
    email: string,
    otp: string
  ): Promise<{ success: boolean; message: string; code?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok && data.accessToken) {
        const tokens = {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };
        this.setTokens(tokens);
        this.setUser(data.user);
        this.setupTokenRefresh();
      }

      return data;
    } catch (error) {
      console.error("Email verification error:", error);
      return { success: false, message: "Network error" };
    }
  }

  async resendVerification(
    email: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/resend-verification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Resend verification error:", error);
      return { success: false, message: "Network error" };
    }
  }

  async forgotPassword(
    email: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Forgot password error:", error);
      return { success: false, message: "Network error" };
    }
  }

  async resetPassword(
    email: string,
    otp: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Reset password error:", error);
      return { success: false, message: "Network error" };
    }
  }

  // Refresh token method
  async refreshToken(): Promise<AuthTokens | null> {
    // Prevent multiple simultaneous refresh requests
    if (this.tokenRefreshPromise) {
      return this.tokenRefreshPromise;
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return null;
    }

    this.tokenRefreshPromise = this.performTokenRefresh(refreshToken);

    try {
      const tokens = await this.tokenRefreshPromise;
      this.tokenRefreshPromise = null;
      return tokens;
    } catch {
      this.tokenRefreshPromise = null;
      this.logout();
      return null;
    }
  }

  private async performTokenRefresh(refreshToken: string): Promise<AuthTokens> {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    const data = await response.json();

    // Store new tokens
    this.setTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });

    // Update user data if provided
    if (data.user) {
      this.setUser(data.user);
    }

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  }

  // Make authenticated API requests with automatic token refresh
  async fetchWithAuth(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    let accessToken = this.getAccessToken();

    if (!accessToken) {
      throw new Error("No access token available");
    }

    // Check if token needs refresh
    if (this.isTokenExpiringSoon(accessToken)) {
      const tokens = await this.refreshToken();
      if (tokens) {
        accessToken = tokens.accessToken;
      }
    }

    // Make the request with the access token
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    // If token is invalid, try to refresh once
    if (response.status === 401) {
      const tokens = await this.refreshToken();
      if (tokens) {
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${tokens.accessToken}`,
            "Content-Type": "application/json",
          },
        });
      }
    }

    return response;
  }

  // Logout user
  async logout(logoutFromAllDevices = false): Promise<void> {
    const refreshToken = this.getRefreshToken();

    if (refreshToken) {
      try {
        const endpoint = logoutFromAllDevices
          ? "/api/auth/logout-all"
          : "/api/auth/logout";
        await this.fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        });
      } catch (error) {
        console.error("Logout API call failed:", error);
      }
    }

    // Clear local storage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }

  // Setup automatic token refresh
  setupTokenRefresh(): NodeJS.Timeout {
    const checkAndRefresh = async () => {
      const accessToken = this.getAccessToken();
      if (accessToken && this.isTokenExpiringSoon(accessToken)) {
        await this.refreshToken();
      }
    };

    // Check every 4 minutes
    const interval = setInterval(checkAndRefresh, 4 * 60 * 1000);

    // Clear interval when user logs out
    window.addEventListener("beforeunload", () => {
      clearInterval(interval);
    });

    return interval;
  }

  // Get session info
  async getSessionInfo(): Promise<SessionInfo> {
    const response = await this.fetchWithAuth(
      `${API_BASE_URL}/api/auth/session-info`
    );
    return response.json();
  }

  // Change password
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<ChangePasswordResponse> {
    const response = await this.fetchWithAuth(
      `${API_BASE_URL}/api/auth/change-password`,
      {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword }),
      }
    );
    return response.json();
  }

  // Update profile
  async updateProfile(updates: {
    username?: string;
    profilePicture?: string;
  }): Promise<UpdateProfileResponse> {
    const response = await this.fetchWithAuth(
      `${API_BASE_URL}/api/auth/profile`,
      {
        method: "PUT",
        body: JSON.stringify(updates),
      }
    );

    const data = await response.json();

    // Update local user data
    if (response.ok && data.user) {
      this.setUser(data.user);
    }

    return data;
  }
}

const authService = new AuthService();
export default authService;
