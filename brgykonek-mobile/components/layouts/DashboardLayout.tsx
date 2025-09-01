import React, { useState } from 'react';
import { View, Text, Pressable, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import authService from '../../services/auth.service';
import Toast from 'react-native-toast-message';

type Props = {
  children: React.ReactNode;
  title?: string;
};

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = 256;

export const DashboardLayout: React.FC<Props> = ({ children, title = 'Dashboard' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-width));
  const router = useRouter();

  const toggleSidebar = () => {
    const toValue = sidebarOpen ? -width : 0;
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setSidebarOpen(false);
  };

  const handleNavigation = async (route: string) => {
    closeSidebar();
    if (route === 'logout') {
      try {
        await authService.logout();
        Toast.show({
          type: 'success',
          text1: 'Logged Out',
          text2: 'You have been successfully logged out.',
        });
        router.replace('/auth/signin' as any);
      } catch (error) {
        console.error('Logout error:', error);
        Toast.show({
          type: 'error',
          text1: 'Logout Failed',
          text2: 'There was an error logging out. Please try again.',
        });
      }
    } else if (route === 'home') {
      router.push('/user' as any);
    } else if (route === 'profile') {
      router.push('/user/my-pofile' as any);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="border-b border-gray-200 bg-white shadow-sm">
        <View className="flex-row items-center justify-between px-4 py-3">
          <Pressable onPress={toggleSidebar} className="p-2">
            <Ionicons name="menu" size={24} color="#1f2937" />
          </Pressable>
          <Text className="text-lg font-semibold text-gray-800">{title}</Text>
          <View className="w-10" />
        </View>
      </View>

      <Animated.View
        className="absolute bottom-0 left-0 top-0 z-40 bg-yellow-400 shadow-lg"
        style={{ width: SIDEBAR_WIDTH, transform: [{ translateX: slideAnim }] }}>
        <View className="flex-1 pt-16">
          <View className="px-4 py-6">
            <Text className="mb-6 text-xl font-bold text-gray-800">Menu</Text>

            <Pressable
              onPress={() => handleNavigation('home')}
              className="mb-2 flex-row items-center rounded-lg px-2 py-3">
              <Ionicons name="home" size={20} color="#1f2937" />
              <Text className="ml-3 text-base font-medium text-gray-800">Home</Text>
            </Pressable>

            <Pressable
              onPress={() => handleNavigation('profile')}
              className="mb-2 flex-row items-center rounded-lg px-2 py-3">
              <Ionicons name="person" size={20} color="#1f2937" />
              <Text className="ml-3 text-base font-medium text-gray-800">My Account</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/user/complaints')}
              className="mb-2 flex-row items-center rounded-lg px-2 py-3">
              <Ionicons name="alert-circle" size={20} color="#1f2937" />
              <Text className="ml-3 text-base font-medium text-gray-800">Complaints</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/user/announcements')}
              className="mb-2 flex-row items-center rounded-lg px-2 py-3">
              <Ionicons name="megaphone" size={20} color="#1f2937" />
              <Text className="ml-3 text-base font-medium text-gray-800">Announcements</Text>
            </Pressable>

            <View className="flex-1" />

            <Pressable
              onPress={() => handleNavigation('logout')}
              className="flex-row items-center rounded-lg border border-red-200 bg-red-50 px-2 py-3">
              <Ionicons name="log-out" size={20} color="#dc2626" />
              <Text className="ml-3 text-base font-medium text-red-600">Logout</Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>

      {sidebarOpen && (
        <Pressable
          className="absolute bottom-0 top-0 z-30 !w-full"
          style={{ left: SIDEBAR_WIDTH, right: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
          onPress={closeSidebar}
        />
      )}

      <View className="flex-1 bg-gray-50">{children}</View>
    </SafeAreaView>
  );
};
