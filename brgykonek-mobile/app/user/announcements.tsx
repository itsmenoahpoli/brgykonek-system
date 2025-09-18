import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator,
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

const ResidentAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAnnouncements = async () => {
    try {
      const data = await announcementService.getAnnouncements();
      const publishedAnnouncements = (data || []).filter(a => a.status === 'published');
      setAnnouncements(publishedAnnouncements);
      setFilteredAnnouncements(publishedAnnouncements);
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
    if (searchTerm.trim() === '') {
      setFilteredAnnouncements(announcements);
    } else {
      const filtered = announcements.filter((announcement) =>
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAnnouncements(filtered);
    }
  }, [searchTerm, announcements]);

  const AnnouncementCard = ({ announcement }: { announcement: Announcement }) => (
    <TouchableOpacity className="bg-white rounded-lg p-4 mb-3 shadow-sm">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-lg font-semibold text-gray-800 flex-1 mr-2">
          {announcement.title}
        </Text>
        <View className="bg-green-100 px-2 py-1 rounded-full">
          <Text className="text-xs font-medium text-green-700">PUBLISHED</Text>
        </View>
      </View>
      
      <Text className="text-gray-600 text-sm mb-3" numberOfLines={4}>
        {announcement.content}
      </Text>
      
      <View className="flex-row justify-between items-center">
        <Text className="text-xs text-gray-500">
          {new Date(announcement.created_at).toLocaleDateString()}
        </Text>
        <Text className="text-xs text-gray-500">
          {new Date(announcement.created_at).toLocaleTimeString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <DashboardLayout title="Announcements" subtitle="Stay updated with latest news">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="mt-4 text-gray-600">Loading announcements...</Text>
        </View>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Announcements" subtitle="Stay updated with latest news">
      <View className="flex-1">
        <View className="p-4">
          <TextInput
            className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
            placeholder="Search announcements..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
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
              <Text className="text-gray-500 text-lg mb-2">No announcements found</Text>
              <Text className="text-gray-400 text-sm text-center">
                {searchTerm ? 'Try adjusting your search terms' : 'Check back later for updates'}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </DashboardLayout>
  );
};

export default ResidentAnnouncements;
