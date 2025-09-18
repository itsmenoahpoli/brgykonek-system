import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { DashboardLayout } from '@/components';
import { dashboardService } from '@/services';
import Toast from 'react-native-toast-message';

interface Statistics {
  totalComplaints: number;
  totalAnnouncements: number;
  totalUsers: number;
  totalResolvedComplaints: number;
}

const AdminDashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStatistics = async () => {
    try {
      const data = await dashboardService.getOverviewStatistics();
      setStatistics(data);
    } catch (error) {
      console.error('Error loading statistics:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load dashboard statistics',
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStatistics();
    setRefreshing(false);
  };

  useEffect(() => {
    loadStatistics();
  }, []);

  const StatCard = ({ title, value, icon }: { title: string; value: number | string; icon: string }) => (
    <View className="bg-white rounded-xl shadow-sm p-6 mb-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800 mb-2">{title}</Text>
          <Text className="text-3xl font-bold text-blue-600">{value}</Text>
        </View>
        <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
          <Text className="text-2xl">{icon}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <DashboardLayout title="Dashboard" subtitle="Overview of admin activities and statistics">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="mt-4 text-gray-600">Loading dashboard...</Text>
        </View>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard" subtitle="Overview of admin activities and statistics">
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <View className="p-4">
          <StatCard
            title="Total Complaints"
            value={statistics?.totalComplaints ?? '-'}
            icon="📝"
          />
          <StatCard
            title="Total Announcements"
            value={statistics?.totalAnnouncements ?? '-'}
            icon="📢"
          />
          <StatCard
            title="Total Users"
            value={statistics?.totalUsers ?? '-'}
            icon="👥"
          />
          <StatCard
            title="Resolved Complaints"
            value={statistics?.totalResolvedComplaints ?? '-'}
            icon="✅"
          />
        </View>
      </ScrollView>
    </DashboardLayout>
  );
};

export default AdminDashboard;
