import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { DashboardLayout } from '@/components';
import { complaintService } from '@/services';
import Toast from 'react-native-toast-message';

interface Report {
  id: string;
  title: string;
  content: string;
  category: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const ResidentListOfReports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadReports = async () => {
    try {
      const data = await complaintService.getComplaintsByResidentId();
      setReports(data || []);
    } catch (error) {
      console.error('Error loading reports:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load reports',
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReports();
    setRefreshing(false);
  };

  useEffect(() => {
    loadReports();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'in progress':
        return 'bg-blue-100 text-blue-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'noise':
        return 'bg-red-100 text-red-700';
      case 'garbage':
        return 'bg-green-100 text-green-700';
      case 'vandalism':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const ReportCard = ({ report }: { report: Report }) => (
    <View className="bg-white rounded-lg p-4 mb-3 shadow-sm">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-lg font-semibold text-gray-800 flex-1 mr-2">
          {report.title}
        </Text>
        <View className={`px-2 py-1 rounded-full ${getStatusColor(report.status)}`}>
          <Text className="text-xs font-medium">{report.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <Text className="text-gray-600 text-sm mb-3" numberOfLines={3}>
        {report.content}
      </Text>
      
      <View className="flex-row items-center justify-between mb-3">
        <View className={`px-2 py-1 rounded-full ${getCategoryColor(report.category)}`}>
          <Text className="text-xs font-medium">{report.category.toUpperCase()}</Text>
        </View>
        <Text className="text-xs text-gray-500">
          {new Date(report.created_at).toLocaleDateString()}
        </Text>
      </View>
      
      <View className="border-t border-gray-100 pt-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-gray-600">
            Report ID: {report.id.slice(-8)}
          </Text>
          <Text className="text-sm text-gray-600">
            Last updated: {new Date(report.updated_at).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <DashboardLayout title="List of Reports" subtitle="Your submitted reports and their status">
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <View className="p-4">
          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-2">
              Total Reports: {reports.length}
            </Text>
            <View className="flex-row space-x-4">
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
                <Text className="text-sm text-gray-600">Pending</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
                <Text className="text-sm text-gray-600">In Progress</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                <Text className="text-sm text-gray-600">Resolved</Text>
              </View>
            </View>
          </View>

          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
          
          {reports.length === 0 && (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-gray-500 text-lg mb-2">No reports found</Text>
              <Text className="text-gray-400 text-sm text-center">
                Submit your first complaint to see it here
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </DashboardLayout>
  );
};

export default ResidentListOfReports;
