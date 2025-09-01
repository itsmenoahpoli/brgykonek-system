import api from '../api';
import { authStorage } from '../utils/storage';
import Toast from 'react-native-toast-message';

const authService = {
  login: async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      console.log(res);

      if (res.data && res.data.token) {
        await authStorage.saveAuthData(res.data.token, res.data.user || res.data);
        Toast.show({
          type: 'success',
          text1: 'Redirecting ....',
          text2: '2FA Verification Required',
        });
      }

      return res.data;
    } catch (err: any) {
      console.log(err);
      let errorMessage = 'Login failed. Please try again.';

      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.status === 401) {
        errorMessage = 'Invalid email or password.';
      } else if (err?.response?.status === 422) {
        errorMessage = 'Please check your input data and try again.';
      } else if (err?.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err?.code === 'NETWORK_ERROR' || err?.code === 'ECONNABORTED') {
        errorMessage = 'Network error. Please check your connection.';
      }

      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: errorMessage,
      });

      throw err;
    }
  },
  register: async (data: any) => {
    try {
      const res = await api.post('/auth/register', data);
      console.log(res);
      return res.data;
    } catch (err: any) {
      console.log(err);
      let errorMessage = 'Registration failed. Please try again.';

      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.status === 422) {
        errorMessage = 'Please check your input data and try again.';
      } else if (err?.response?.status === 409) {
        errorMessage = 'An account with this email already exists.';
      } else if (err?.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err?.code === 'NETWORK_ERROR' || err?.code === 'ECONNABORTED') {
        errorMessage = 'Network error. Please check your connection.';
      }

      const formattedError = {
        message: errorMessage,
        originalError: err,
      };

      throw formattedError;
    }
  },
  logout: async () => {
    try {
      await authStorage.clearAuthData();
    } catch (err: any) {
      console.log(err);
      throw err;
    }
  },
  forgotPassword: async (email: string, router?: any) => {
    try {
      const res = await api.post('/auth/request-otp', { email });
      console.log(res);

      Toast.show({
        type: 'success',
        text1: 'Reset Email Sent',
        text2: 'Please check your email for password reset instructions.',
      });

      if (router) {
        router.push({
          pathname: '/auth/verify-otp',
          params: { email, from: 'forgot-password' },
        });
      }

      return res.data;
    } catch (err: any) {
      console.log(err);
      let errorMessage = 'Failed to send reset email. Please try again.';

      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.status === 404) {
        errorMessage = 'Email address not found. Please check your email.';
      } else if (err?.response?.status === 422) {
        errorMessage = 'Please enter a valid email address.';
      } else if (err?.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err?.code === 'NETWORK_ERROR' || err?.code === 'ECONNABORTED') {
        errorMessage = 'Network error. Please check your connection.';
      }

      Toast.show({
        type: 'error',
        text1: 'Reset Failed',
        text2: errorMessage,
      });

      throw err;
    }
  },
  verifyOTP: async (email: string, otp: string) => {
    try {
      const res = await api.post('/auth/verify-otp', { email, otp_code: otp });
      console.log(res);

      Toast.show({
        type: 'success',
        text1: 'OTP Verified',
        text2: 'Your account has been verified successfully.',
      });

      return res.data;
    } catch (err: any) {
      console.log(err);
      let errorMessage = 'OTP verification failed. Please try again.';

      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.status === 400) {
        errorMessage = 'Invalid OTP. Please check and try again.';
      } else if (err?.response?.status === 422) {
        errorMessage = 'Please enter a valid 6-digit OTP.';
      } else if (err?.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err?.code === 'NETWORK_ERROR' || err?.code === 'ECONNABORTED') {
        errorMessage = 'Network error. Please check your connection.';
      }

      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: errorMessage,
      });

      throw err;
    }
  },
  resendOTP: async () => {
    try {
      const res = await api.post('/auth/resend-otp');
      console.log(res);

      Toast.show({
        type: 'success',
        text1: 'OTP Resent',
        text2: 'A new verification code has been sent to your email.',
      });

      return res.data;
    } catch (err: any) {
      console.log(err);
      let errorMessage = 'Failed to resend OTP. Please try again.';

      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.status === 429) {
        errorMessage = 'Too many requests. Please wait before trying again.';
      } else if (err?.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err?.code === 'NETWORK_ERROR' || err?.code === 'ECONNABORTED') {
        errorMessage = 'Network error. Please check your connection.';
      }

      Toast.show({
        type: 'error',
        text1: 'Resend Failed',
        text2: errorMessage,
      });

      throw err;
    }
  },
  resetPassword: async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/reset-password', { email, new_password: password });
      console.log(res);

      Toast.show({
        type: 'success',
        text1: 'Password Reset Successful',
        text2: 'Your password has been updated successfully.',
      });

      return res.data;
    } catch (err: any) {
      console.log(err);
      let errorMessage = 'Password reset failed. Please try again.';

      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.errors) {
        const validationErrors = Object.values(err.response.data.errors).flat();
        errorMessage = validationErrors.join(', ');
      } else if (err?.response?.status === 400) {
        errorMessage = 'Invalid request. Please check your input.';
      } else if (err?.response?.status === 422) {
        errorMessage = 'Please check your input data and try again.';
      } else if (err?.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err?.code === 'NETWORK_ERROR' || err?.code === 'ECONNABORTED') {
        errorMessage = 'Network error. Please check your connection.';
      }

      Toast.show({
        type: 'error',
        text1: 'Reset Failed',
        text2: errorMessage,
      });

      const formattedError = {
        message: errorMessage,
        originalError: err,
      };

      throw formattedError;
    }
  },
  updateProfile: async (data: {
    name: string;
    mobile_number: string;
    address: string;
    birthdate: string;
  }) => {
    try {
      console.log('Original data:', data);

      const token = await authStorage.getAuthToken();

      if (!token) {
        throw new Error('No authentication token found');
      }

      const formattedData = {
        name: data.name.trim(),
        mobile_number: data.mobile_number.trim(),
        address: data.address.trim(),
        birthdate: data.birthdate,
      };

      if (
        !formattedData.name ||
        !formattedData.mobile_number ||
        !formattedData.address ||
        !formattedData.birthdate
      ) {
        throw new Error('All fields are required');
      }

      console.log('Formatted data:', formattedData);

      const res = await api.put('/auth/update-profile', formattedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Response:', res.data);

      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: 'Your profile has been updated successfully.',
      });

      return res.data;
    } catch (err: any) {
      console.log('Update profile error:', err);
      console.log('Error response:', err?.response?.data);

      let errorMessage = 'Profile update failed. Please try again.';

      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.errors) {
        const validationErrors = Object.values(err.response.data.errors).flat();
        errorMessage = validationErrors.join(', ');
      } else if (err?.response?.status === 400) {
        errorMessage = 'Invalid request. Please check your input.';
      } else if (err?.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (err?.response?.status === 422) {
        errorMessage = 'Please check your input data and try again.';
      } else if (err?.response?.status === 409) {
        errorMessage = 'Email already exists. Please use a different email.';
      } else if (err?.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err?.code === 'NETWORK_ERROR' || err?.code === 'ECONNABORTED') {
        errorMessage = 'Network error. Please check your connection.';
      }

      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: errorMessage,
      });

      const formattedError = {
        message: errorMessage,
        originalError: err,
      };

      throw formattedError;
    }
  },
};

export default authService;
