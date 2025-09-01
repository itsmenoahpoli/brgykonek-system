import { Request, Response } from "express";
import { authService } from "../services/authService";

interface AuthRequest extends Request {
  user?: any;
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      email,
      password,
      mobile_number,
      user_type,
      address,
      birthdate,
    } = req.body;

    const result = await authService.register({
      name,
      email,
      password,
      mobile_number,
      user_type,
      address,
      birthdate,
      barangay_clearance: req.file ? req.file.filename : undefined,
    });

    res.status(201).json({
      message: "User registered successfully",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage === "User with this email already exists") {
      res.status(400).json({ message: errorMessage });
    } else if (errorMessage === "JWT secret not configured") {
      res.status(500).json({ message: errorMessage });
    } else {
      res.status(400).json({ message: errorMessage });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const result = await authService.login({ email, password });

    res.status(200).json({
      message: "Login successful",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage === "Invalid credentials") {
      res.status(400).json({ message: errorMessage });
    } else if (errorMessage === "JWT secret not configured") {
      res.status(500).json({ message: errorMessage });
    } else {
      res.status(500).json({ message: "Server error", error: errorMessage });
    }
  }
};

export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const user = await authService.getProfile(req.user.id);

    res.status(200).json({
      message: "Profile retrieved successfully",
      user,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage === "User not found") {
      res.status(404).json({ message: errorMessage });
    } else {
      res.status(500).json({ message: "Server error", error: errorMessage });
    }
  }
};

export const requestOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    await authService.requestOTP(email);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage === "User not found") {
      res.status(404).json({ success: false, message: errorMessage });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Server error", error: errorMessage });
    }
  }
};

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp_code } = req.body;

    if (!email || !otp_code) {
      res
        .status(400)
        .json({ success: false, message: "Email and OTP code are required" });
      return;
    }

    await authService.verifyOTP(email, otp_code);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage === "User not found") {
      res.status(404).json({ success: false, message: errorMessage });
    } else if (errorMessage === "No OTP requested") {
      res.status(400).json({ success: false, message: errorMessage });
    } else if (errorMessage === "Invalid OTP code") {
      res.status(400).json({ success: false, message: errorMessage });
    } else if (errorMessage === "OTP code has expired") {
      res.status(400).json({ success: false, message: errorMessage });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Server error", error: errorMessage });
    }
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const { name, mobile_number, address, birthdate } = req.body;

    const result = await authService.updateProfile(req.user.id, {
      name,
      mobile_number,
      address,
      birthdate,
    });

    res.status(200).json({
      message: "Profile updated successfully",
      user: result,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage === "User not found") {
      res.status(404).json({ message: errorMessage });
    } else {
      res.status(500).json({ message: "Server error", error: errorMessage });
    }
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, new_password } = req.body;

    if (!email || !new_password) {
      res.status(400).json({
        message: "Email and new password are required",
      });
      return;
    }

    await authService.resetPassword({ email, new_password });

    res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage === "User not found") {
      res.status(404).json({ message: errorMessage });
    } else {
      res.status(500).json({ message: "Server error", error: errorMessage });
    }
  }
};

export const listUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await authService.listUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await authService.getUserById(req.params.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await authService.updateUserById(req.params.id, req.body);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const deleteUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await authService.deleteUserById(req.params.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
