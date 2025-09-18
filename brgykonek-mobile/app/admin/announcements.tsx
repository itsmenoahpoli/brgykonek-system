import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Modal,
  Alert,
} from 'react-native';
import { DashboardLayout } from '@/components';
import { announcementService } from '@/services';
import Toast from 'react-native-toast-message';

interface Announcement {
  id: string;
  title: string;
  content: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const AdminAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    content: '',
    status: 'published',
  });

  const loadAnnouncements = async () => {
    try {
      const data = await announcementService.getAnnouncements();
      setAnnouncements(data || []);
      setFilteredAnnouncements(data || []);
    } catch (error) {
      console.error('Error loading announcements:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load announcements',
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAnnouncements();
    setRefreshing(false);
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  useEffect(() => {
    let filtered = announcements;

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter((announcement) =>
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== '') {
      filtered = filtered.filter((announcement) => announcement.status === statusFilter);
    }

    setFilteredAnnouncements(filtered);
  }, [searchTerm, statusFilter, announcements]);

  const handleCreateAnnouncement = async () => {
    try {
      await announcementService.createAnnouncement(createForm);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Announcement created successfully',
      });
      setShowCreateModal(false);
      setCreateForm({ title: '', content: '', status: 'published' });
      loadAnnouncements();
    } catch (error) {
      console.error('Error creating announcement:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to create announcement',
      });
    }
  };

  const handleDeleteAnnouncement = (announcement: Announcement) => {
    Alert.alert(
      'Delete Announcement',
      `Are you sure you want to delete "${announcement.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await announcementService.deleteAnnouncement(announcement.id);
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Announcement deleted successfully',
              });
              loadAnnouncements();
            } catch (error) {
              console.error('Error deleting announcement:', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete announcement',
              });
            }
          },
        },
      ]
    );
  };

  const AnnouncementCard = ({ announcement }: { announcement: Announcement }) => (
    <View className="bg-white rounded-lg p-4 mb-3 shadow-sm">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-lg font-semibold text-gray-800 flex-1 mr-2">
          {announcement.title}
        </Text>
        <View className={`px-2 py-1 rounded-full ${
          announcement.status === 'published' ? 'bg-green-100' : 'bg-yellow-100'
        }`}>
          <Text className={`text-xs font-medium ${
            announcement.status === 'published' ? 'text-green-700' : 'text-yellow-700'
          }`}>
            {announcement.status.toUpperCase()}
          </Text>
        </View>
      </View>
      <Text className="text-gray-600 text-sm mb-3" numberOfLines={3}>
        {announcement.content}
      </Text>
      <View className="flex-row justify-between items-center">
        <Text className="text-xs text-gray-500">
          {new Date(announcement.created_at).toLocaleDateString()}
        </Text>
        <TouchableOpacity
          onPress={() => handleDeleteAnnouncement(announcement)}
          className="bg-red-500 px-3 py-1 rounded"
        >
          <Text className="text-white text-sm font-medium">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <DashboardLayout title="Announcements" subtitle="View and manage all announcements">
      <View className="flex-1">
        <View className="p-4">
          <View className="flex-row items-center mb-2">
            <TextInput
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 mr-2"
              placeholder="Search title..."
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
          <View className="flex-row mb-4">
            <TouchableOpacity
              onPress={() => setStatusFilter('')}
              className={`px-3 py-1 rounded-full mr-2 ${
                statusFilter === '' ? 'bg-blue-100' : 'bg-gray-100'
              }`}
            >
              <Text className={`text-sm ${
                statusFilter === '' ? 'text-blue-700' : 'text-gray-700'
              }`}>All Status</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setStatusFilter('published')}
              className={`px-3 py-1 rounded-full mr-2 ${
                statusFilter === 'published' ? 'bg-blue-100' : 'bg-gray-100'
              }`}
            >
              <Text className={`text-sm ${
                statusFilter === 'published' ? 'text-blue-700' : 'text-gray-700'
              }`}>Published</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setStatusFilter('draft')}
              className={`px-3 py-1 rounded-full ${
                statusFilter === 'draft' ? 'bg-blue-100' : 'bg-gray-100'
              }`}
            >
              <Text className={`text-sm ${
                statusFilter === 'draft' ? 'text-blue-700' : 'text-gray-700'
              }`}>Draft</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          className="flex-1 px-4"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        >
          {filteredAnnouncements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
          {filteredAnnouncements.length === 0 && (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-gray-500 text-lg">No announcements found</Text>
            </View>
          )}
        </ScrollView>

        <Modal visible={showCreateModal} animationType="slide" presentationStyle="pageSheet">
          <View className="flex-1 bg-white">
            <View className="p-4 border-b border-gray-200">
              <View className="flex-row items-center justify-between">
                <Text className="text-xl font-bold">Create Announcement</Text>
                <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                  <Text className="text-blue-600 font-medium">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <ScrollView className="flex-1 p-4">
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
                placeholder="Title"
                value={createForm.title}
                onChangeText={(text) => setCreateForm({ ...createForm, title: text })}
              />
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
                placeholder="Content"
                value={createForm.content}
                onChangeText={(text) => setCreateForm({ ...createForm, content: text })}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </ScrollView>
            
            <View className="p-4 border-t border-gray-200">
              <TouchableOpacity
                onPress={handleCreateAnnouncement}
                className="bg-blue-600 py-3 rounded-lg"
              >
                <Text className="text-white text-center font-medium">Create Announcement</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </DashboardLayout>
  );
};

export default AdminAnnouncements;
