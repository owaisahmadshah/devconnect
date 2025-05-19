interface SignUpData {
  fullName: string;
  email: string;
  password: string;
  accountType: "developer" | "recruiter";
}

interface SignUpResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    accountType: "developer" | "recruiter";
  };
}

export const authService = {
  async signUp(data: SignUpData): Promise<SignUpResponse> {
    // In a real app, this would make an API request
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        resolve({
          token: "fake-jwt-token-" + Math.random(),
          user: {
            id: "user-" + Math.random(),
            name: data.fullName,
            email: data.email,
            accountType: data.accountType
          }
        });
      }, 1000);
    });
  }
};