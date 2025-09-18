import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { DashboardLayout } from '@/components';
import { dashboardService } from '@/services';
import Toast from 'react-native-toast-message';

interface ResidentStats {
  totalComplaints: number;
  totalAnnouncements: number;
  resolvedComplaints: number;
  pendingComplaints: number;
}

const ResidentHome: React.FC = () => {
  const [stats, setStats] = useState<ResidentStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    try {
      const data = await dashboardService.getResidentStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading resident stats:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load dashboard data',
      });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const StatCard = ({ title, value, icon, color }: { 
    title: string; 
    value: number | string; 
    icon: string;
    color: string;
  }) => (
    <View className={`${color} rounded-xl p-6 mb-4 shadow-sm`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-white mb-2">{title}</Text>
          <Text className="text-3xl font-bold text-white">{value}</Text>
        </View>
        <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
          <Text className="text-2xl">{icon}</Text>
        </View>
      </View>
    </View>
  );

  const QuickActionCard = ({ title, description, icon, onPress }: {
    title: string;
    description: string;
    icon: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-lg p-4 mb-3 shadow-sm"
    >
      <View className="flex-row items-center">
        <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
          <Text className="text-2xl">{icon}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">{title}</Text>
          <Text className="text-sm text-gray-600">{description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <DashboardLayout title="Home" subtitle="Welcome to your dashboard">
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <View className="p-4">
          <Text className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</Text>
          
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-700 mb-4">Your Statistics</Text>
            <StatCard
              title="Total Complaints"
              value={stats?.totalComplaints ?? '-'}
              icon="📝"
              color="bg-blue-500"
            />
            <StatCard
              title="Resolved Complaints"
              value={stats?.resolvedComplaints ?? '-'}
              icon="✅"
              color="bg-green-500"
            />
            <StatCard
              title="Pending Complaints"
              value={stats?.pendingComplaints ?? '-'}
              icon="⏳"
              color="bg-yellow-500"
            />
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</Text>
            <QuickActionCard
              title="Submit Complaint"
              description="Report an issue or concern"
              icon="📋"
              onPress={() => {/* Navigate to complaints */}}
            />
            <QuickActionCard
              title="View Announcements"
              description="Stay updated with latest news"
              icon="📢"
              onPress={() => {/* Navigate to announcements */}}
            />
            <QuickActionCard
              title="View Reports"
              description="Check your submitted reports"
              icon="📊"
              onPress={() => {/* Navigate to reports */}}
            />
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</Text>
            <View className="bg-white rounded-lg p-4 shadow-sm">
              <Text className="text-gray-600 text-center py-8">
                No recent activity to display
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </DashboardLayout>
  );
};

export default ResidentHome;
