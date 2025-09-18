import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
  Modal,
} from 'react-native';
import { DashboardLayout } from '@/components';
import { usersService } from '@/services';
import Toast from 'react-native-toast-message';

interface User {
  id: string;
  name: string;
  email: string;
  mobile_number: string;
  user_type: string;
  address: string;
  birthdate: string;
  created_at: string;
  updated_at: string;
}

const AdminAccounts: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    mobile_number: '',
    user_type: 'resident',
    address: '',
    birthdate: '',
    password: '',
  });

  const loadUsers = async () => {
    try {
      const data = await usersService.getUsers();
      setUsers(data || []);
      setFilteredUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load users',
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.mobile_number.includes(searchTerm)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleCreateUser = async () => {
    try {
      await usersService.createUser(createForm);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'User created successfully',
      });
      setShowCreateModal(false);
      setCreateForm({
        name: '',
        email: '',
        mobile_number: '',
        user_type: 'resident',
        address: '',
        birthdate: '',
        password: '',
      });
      loadUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to create user',
      });
    }
  };

  const handleDeleteUser = (user: User) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${user.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await usersService.deleteUser(user.id);
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'User deleted successfully',
              });
              loadUsers();
            } catch (error) {
              console.error('Error deleting user:', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete user',
              });
            }
          },
        },
      ]
    );
  };

  const UserCard = ({ user }: { user: User }) => (
    <View className="bg-white rounded-lg p-4 mb-3 shadow-sm">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">{user.name}</Text>
          <Text className="text-sm text-gray-600">{user.email}</Text>
          <Text className="text-sm text-gray-600">{user.mobile_number}</Text>
          <View className="flex-row items-center mt-2">
            <View className={`px-2 py-1 rounded-full ${
              user.user_type === 'admin' ? 'bg-red-100' : 'bg-blue-100'
            }`}>
              <Text className={`text-xs font-medium ${
                user.user_type === 'admin' ? 'text-red-700' : 'text-blue-700'
              }`}>
                {user.user_type.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteUser(user)}
          className="bg-red-500 px-3 py-1 rounded"
        >
          <Text className="text-white text-sm font-medium">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <DashboardLayout title="Accounts" subtitle="View and manage user accounts">
      <View className="flex-1">
        <View className="p-4">
          <View className="flex-row items-center mb-4">
            <TextInput
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 mr-2"
              placeholder="Search by name, email, or mobile"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            <TouchableOpacity
              onPress={() => setShowCreateModal(true)}
              className="bg-blue-600 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-medium">Create</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          className="flex-1 px-4"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        >
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
          {filteredUsers.length === 0 && (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-gray-500 text-lg">No users found</Text>
            </View>
          )}
        </ScrollView>

        <Modal visible={showCreateModal} animationType="slide" presentationStyle="pageSheet">
          <View className="flex-1 bg-white">
            <View className="p-4 border-b border-gray-200">
              <View className="flex-row items-center justify-between">
                <Text className="text-xl font-bold">Create User</Text>
                <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                  <Text className="text-blue-600 font-medium">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <ScrollView className="flex-1 p-4">
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
                placeholder="Name"
                value={createForm.name}
                onChangeText={(text) => setCreateForm({ ...createForm, name: text })}
              />
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
                placeholder="Email"
                value={createForm.email}
                onChangeText={(text) => setCreateForm({ ...createForm, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
                placeholder="Mobile Number"
                value={createForm.mobile_number}
                onChangeText={(text) => setCreateForm({ ...createForm, mobile_number: text })}
                keyboardType="phone-pad"
              />
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
                placeholder="Address"
                value={createForm.address}
                onChangeText={(text) => setCreateForm({ ...createForm, address: text })}
              />
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
                placeholder="Birthdate (YYYY-MM-DD)"
                value={createForm.birthdate}
                onChangeText={(text) => setCreateForm({ ...createForm, birthdate: text })}
              />
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
                placeholder="Password"
                value={createForm.password}
                onChangeText={(text) => setCreateForm({ ...createForm, password: text })}
                secureTextEntry
              />
            </ScrollView>
            
            <View className="p-4 border-t border-gray-200">
              <TouchableOpacity
                onPress={handleCreateUser}
                className="bg-blue-600 py-3 rounded-lg"
              >
                <Text className="text-white text-center font-medium">Create User</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </DashboardLayout>
  );
};

export default AdminAccounts;
