import { api } from '../api';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile_number: string;
  user_type: string;
  address: string;
  birthdate: string;
  barangay_clearance?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  mobile_number: string;
  user_type: string;
  address: string;
  birthdate: string;
  password: string;
  barangay_clearance?: File;
}

export const usersService = {
  async getUsers(): Promise<User[]> {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async createUser(userData: CreateUserData): Promise<User> {
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('email', userData.email);
      formData.append('mobile_number', userData.mobile_number);
      formData.append('user_type', userData.user_type);
      formData.append('address', userData.address);
      formData.append('birthdate', userData.birthdate);
      formData.append('password', userData.password);
      
      if (userData.barangay_clearance) {
        formData.append('barangay_clearance', userData.barangay_clearance);
      }

      const response = await api.post('/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async deleteUser(userId: string): Promise<void> {
    try {
      await api.delete(`/users/${userId}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  async updateUser(userId: string, userData: Partial<CreateUserData>): Promise<User> {
    try {
      const formData = new FormData();
      Object.keys(userData).forEach(key => {
        if (userData[key as keyof CreateUserData]) {
          formData.append(key, userData[key as keyof CreateUserData] as string);
        }
      });

      const response = await api.put(`/users/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },
};
