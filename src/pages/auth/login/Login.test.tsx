import { describe } from "@jest/globals";

import { it, jest, expect } from "@jest/globals";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { jwtDecode } from "jwt-decode";
import App from "../../../App";
import axiosInstance from "../../../utils/axiosInstance";
jest.mock("react-router-dom", () => {
  const actualModule = jest.requireActual("react-router-dom");
  return {
    ...actualModule,
    useNavigate: () => jest.fn(),
  };
});

jest.mock("antd", () => ({
  ...jest.requireActual("antd"),
  message: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("../../../../../context/App.Context", () => ({
  useAppContext: () => ({
    setAuthToken: jest.fn(),
  }),
}));

jest.mock("../../../utils/axiosInstance");
jest.mock("jwt-decode");

describe("Login Component", () => {
  const mockNavigate = jest.fn();
  const mockSetAuthToken = jest.fn();
  const mockMessage = {
    success: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useAppContext as jest.Mock).mockReturnValue({
      setAuthToken: mockSetAuthToken,
    });
  });

  it("should handle form submission with valid credentials for user role", async () => {
    const mockToken = "valid.user.token";
    const mockResponse = {
      data: {
        token: mockToken,
        message: "Login successful",
      },
    };

    (axiosInstance.post as jest.Mock).mockResolvedValueOnce(mockResponse);
    (jwtDecode as jest.Mock).mockReturnValue({ role: "user" });

    const { getByPlaceholderText, getByRole } = render(<App />);

    fireEvent.change(getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockSetAuthToken).toHaveBeenCalledWith(mockToken);
      expect(localStorage.setItem).toHaveBeenCalledWith("authToken", mockToken);
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
      expect(mockMessage.success).toHaveBeenCalledWith("Login successful");
    });
  });

  it("should handle form submission with valid credentials for admin role", async () => {
    const mockToken = "valid.admin.token";
    const mockResponse = {
      data: {
        token: mockToken,
        message: "Login successful",
      },
    };

    (axiosInstance.post as jest.Mock).mockResolvedValueOnce(mockResponse);
    (jwtDecode as jest.Mock).mockReturnValue({ role: "admin" });

    const { getByPlaceholderText, getByRole } = render(<App />);

    fireEvent.change(getByPlaceholderText("Email"), {
      target: { value: "admin@example.com" },
    });
    fireEvent.change(getByPlaceholderText("Password"), {
      target: { value: "admin123" },
    });

    fireEvent.click(getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard/admin");
    });
  });

  it("should handle invalid role from token", async () => {
    const mockToken = "invalid.role.token";
    const mockResponse = {
      data: {
        token: mockToken,
        message: "Login successful",
      },
    };

    (axiosInstance.post as jest.Mock).mockResolvedValueOnce(mockResponse);
    (jwtDecode as jest.Mock).mockReturnValue({ role: "invalid_role" });

    const { getByPlaceholderText, getByRole } = render(<App />);

    fireEvent.change(getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockMessage.error).toHaveBeenCalledWith(
        "Invalid role detected. Contact support."
      );
    });
  });

  it("should validate email format", async () => {
    const { getByPlaceholderText, getByRole } = render(<App />);

    fireEvent.change(getByPlaceholderText("Email"), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Email is not a valid email!")
      ).toBeInTheDocument();
    });
  });

  it("should handle network error during login", async () => {
    (axiosInstance.post as jest.Mock).mockRejectedValueOnce(
      new Error("Network Error")
    );

    const { getByPlaceholderText, getByRole } = render(<App />);

    fireEvent.change(getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockMessage.error).toHaveBeenCalledWith("Something went wrong!");
    });
  });
});
