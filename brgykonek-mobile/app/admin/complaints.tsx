import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { DashboardLayout } from '@/components';
import { complaintService } from '@/services';
import Toast from 'react-native-toast-message';

interface Complaint {
  id: string;
  title: string;
  content: string;
  category: string;
  status: string;
  resident_name: string;
  created_at: string;
  updated_at: string;
}

const AdminComplaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadComplaints = async () => {
    try {
      const data = await complaintService.getComplaints();
      setComplaints(data || []);
    } catch (error) {
      console.error('Error loading complaints:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load complaints',
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadComplaints();
    setRefreshing(false);
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleUpdateStatus = (complaintId: string, newStatus: string) => {
    Alert.alert(
      'Update Status',
      `Change status to ${newStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: async () => {
            try {
              await complaintService.updateComplaintStatus(complaintId, newStatus);
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Complaint status updated successfully',
              });
              loadComplaints();
            } catch (error) {
              console.error('Error updating complaint status:', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to update complaint status',
              });
            }
          },
        },
      ]
    );
  };

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

  const ComplaintCard = ({ complaint }: { complaint: Complaint }) => (
    <View className="bg-white rounded-lg p-4 mb-3 shadow-sm">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-lg font-semibold text-gray-800 flex-1 mr-2">
          {complaint.title}
        </Text>
        <View className={`px-2 py-1 rounded-full ${getStatusColor(complaint.status)}`}>
          <Text className="text-xs font-medium">{complaint.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <Text className="text-gray-600 text-sm mb-3" numberOfLines={3}>
        {complaint.content}
      </Text>
      
      <View className="flex-row items-center justify-between mb-3">
        <View className={`px-2 py-1 rounded-full ${getCategoryColor(complaint.category)}`}>
          <Text className="text-xs font-medium">{complaint.category.toUpperCase()}</Text>
        </View>
        <Text className="text-xs text-gray-500">By: {complaint.resident_name}</Text>
      </View>
      
      <View className="flex-row justify-between items-center">
        <Text className="text-xs text-gray-500">
          {new Date(complaint.created_at).toLocaleDateString()}
        </Text>
        
        <View className="flex-row space-x-2">
          {['Pending', 'In Progress', 'Resolved', 'Rejected'].map((status) => (
            <TouchableOpacity
              key={status}
              onPress={() => handleUpdateStatus(complaint.id, status)}
              className={`px-2 py-1 rounded ${
                complaint.status.toLowerCase() === status.toLowerCase()
                  ? 'bg-blue-500'
                  : 'bg-gray-200'
              }`}
            >
              <Text className={`text-xs font-medium ${
                complaint.status.toLowerCase() === status.toLowerCase()
                  ? 'text-white'
                  : 'text-gray-700'
              }`}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <DashboardLayout title="Complaints" subtitle="View and manage all complaints">
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <View className="p-4">
          {complaints.map((complaint) => (
            <ComplaintCard key={complaint.id} complaint={complaint} />
          ))}
          {complaints.length === 0 && (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-gray-500 text-lg">No complaints found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </DashboardLayout>
  );
};

export default AdminComplaints;
