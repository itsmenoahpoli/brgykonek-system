import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function AnnouncementsPage() {
  const router = useRouter();
  return (
    <DashboardLayout title="Announcements">
      <View className="w-full items-center bg-transparent pt-6">
        <View className="mb-2 w-[85%] flex-row items-center">
          <Pressable onPress={() => router.push('/user')}>
            <Text className="text-blue-600">User</Text>
          </Pressable>
          <Text className="mx-2 text-gray-400">/</Text>
          <Text className="font-medium text-gray-800">Announcements</Text>
        </View>
        <View className="mb-4 w-[85%] items-start">
          <Text className="text-2xl font-bold text-gray-800">Announcements</Text>
        </View>
      </View>
    </DashboardLayout>
  );
}
