import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BRAND_LOGO } from '@/assets/images';
import { announcementService } from '@/services';
import Toast from 'react-native-toast-message';

const { width: screenWidth } = Dimensions.get('window');

interface Announcement {
  id: string;
  title: string;
  content: string;
  body: string;
  banner_image?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const LandingPage: React.FC = () => {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await announcementService.getAnnouncements();
      const publishedAnnouncements = (data || [])
        .filter((a: Announcement) => a.status === 'published')
        .sort(
          (a: Announcement, b: Announcement) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 6);
      setAnnouncements(publishedAnnouncements);
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

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const navigateToLogin = () => {
    router.push('/auth/signin');
  };

  const navigateToRegister = () => {
    router.push('/auth/create-account');
  };

  const navigateToAnnouncements = () => {
    router.push('/user/announcements');
  };

  const ServiceCard = ({ title, description, icon }: {
    title: string;
    description: string;
    icon: string;
  }) => (
    <View className="bg-white rounded-2xl shadow-sm flex flex-col items-center p-6 text-center mb-4">
      <View className="mb-4 flex items-center justify-center h-14 w-14 rounded-full bg-blue-100">
        <Text className="text-3xl">{icon}</Text>
      </View>
      <Text className="font-bold text-lg text-gray-900 mb-2 text-center">
        {title}
      </Text>
      <Text className="text-gray-600 text-sm text-center leading-5">
        {description}
      </Text>
    </View>
  );

  const AnnouncementCard = ({ announcement }: { announcement: Announcement }) => (
    <View className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col mb-4">
      {announcement.banner_image && (
        <Image
          source={{ uri: announcement.banner_image }}
          className="h-48 w-full"
          resizeMode="cover"
        />
      )}
      <View className="p-6 flex-1 flex flex-col">
        <View className="flex-row items-center text-gray-500 text-sm mb-2">
          <Text className="text-xs text-gray-500">
            {new Date(announcement.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
        <Text className="font-bold text-lg mb-2 text-gray-900">
          {announcement.title}
        </Text>
        <Text className="text-gray-700 text-sm mb-4" numberOfLines={3}>
          {announcement.body || announcement.content}
        </Text>
        <TouchableOpacity
          onPress={navigateToAnnouncements}
          className="mt-auto"
        >
          <Text className="text-blue-700 font-medium flex items-center gap-1">
            Read More →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const StatCard = ({ value, label }: { value: string; label: string }) => (
    <View className="bg-gray-50 rounded-xl flex flex-col items-center justify-center py-6 flex-1 mx-1">
      <Text className="text-3xl font-bold text-blue-700">{value}</Text>
      <Text className="text-gray-500 text-sm text-center">{label}</Text>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View className="h-screen w-full relative">
        <Image
          source={require('@/assets/images/splash-bg.png')}
          className="absolute inset-0 w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-black/40" />
        
        <View className="relative flex-1 flex flex-col justify-center items-start px-4 pt-32">
          <View className="flex flex-row justify-center gap-x-2 mb-8">
            <Text className="text-4xl font-bold text-blue-500">BRGY</Text>
            <Text className="text-4xl font-bold text-red-500">KONEK</Text>
          </View>
          
          <Text className="text-4xl font-bold leading-tight mb-4 text-white">
            Serving Our Community{'\n'}Together
          </Text>
          
          <Text className="text-base font-medium mb-8 text-white max-w-xs leading-6">
            Welcome to Barangay Masaguisi's official portal. Stay informed, connected,
            and engaged with your community through our digital services.
          </Text>
          
          <View className="flex flex-col gap-4 w-full max-w-xs">
            <TouchableOpacity
              onPress={navigateToLogin}
              className="flex-row items-center gap-3 bg-blue-600 px-4 py-4 rounded-lg"
            >
              <View className="flex-shrink-0 flex items-center justify-center h-6 w-6">
                <Text className="text-white text-lg">📢</Text>
              </View>
              <Text className="text-white font-bold flex-1 text-center">View Announcement</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={navigateToRegister}
              className="flex-row items-center gap-3 bg-white px-4 py-4 rounded-lg border border-blue-200"
            >
              <View className="flex-shrink-0 flex items-center justify-center h-6 w-6">
                <Text className="text-blue-700 text-lg">📋</Text>
              </View>
              <Text className="text-blue-700 font-bold flex-1 text-center">File Complaint</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Recent Announcements Section */}
      <View className="w-full bg-gray-50 flex flex-col items-center pt-16 px-4">
        <View className="w-full max-w-7xl">
          <View className="flex-row justify-between items-center mb-8">
            <Text className="text-3xl font-bold text-gray-900">Recent Announcements</Text>
            <TouchableOpacity onPress={navigateToAnnouncements}>
              <Text className="text-blue-700 font-medium flex items-center gap-1">
                View All →
              </Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <View className="flex justify-center items-center h-64 w-full">
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text className="text-gray-500 text-lg mt-4">Loading...</Text>
            </View>
          ) : announcements.length === 0 ? (
            <View className="flex justify-center items-center h-64 w-full">
              <Text className="text-gray-500 text-lg">No announcements found.</Text>
            </View>
          ) : (
            <View className="flex flex-col gap-4">
              {announcements.map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Services Section */}
      <View className="w-full bg-gray-50 flex flex-col items-center py-16 px-4">
        <Text className="text-3xl font-bold text-gray-900 mb-10">Our Services</Text>
        
        <View className="w-full max-w-7xl">
          <View className="flex flex-col gap-4">
            <View className="flex-row gap-4">
              <ServiceCard
                title="Certificate Issuance"
                description="Barangay clearance, residency, and other official certificates"
                icon="📄"
              />
              <ServiceCard
                title="Dispute Resolution"
                description="Mediation services for community conflicts and disputes"
                icon="⚖️"
              />
            </View>
            
            <View className="flex-row gap-4">
              <ServiceCard
                title="Security Patrol"
                description="24/7 barangay tanod patrol for community safety"
                icon="🚔"
              />
              <ServiceCard
                title="Health Services"
                description="Basic health services and medical assistance programs"
                icon="🏥"
              />
            </View>
            
            <View className="flex-row gap-4">
              <ServiceCard
                title="Business Permits"
                description="Processing and issuance of local business permits"
                icon="🏢"
              />
              <ServiceCard
                title="Community Programs"
                description="Youth development, senior citizen, and livelihood programs"
                icon="👥"
              />
            </View>
            
            <View className="flex-row gap-4">
              <ServiceCard
                title="Waste Management"
                description="Garbage collection schedules and recycling initiatives"
                icon="♻️"
              />
              <ServiceCard
                title="Public Information"
                description="Announcements, bulletins, and community updates"
                icon="📢"
              />
            </View>
          </View>
        </View>
      </View>

      {/* About Section */}
      <View className="w-full bg-white flex flex-col items-center justify-center gap-8 px-4 py-16">
        <View className="flex-1 flex flex-col gap-8 max-w-lg w-full">
          <View className="grid grid-cols-2 gap-4 mb-6">
            <StatCard value="12,487" label="Population" />
            <StatCard value="3.2 km²" label="Land Area" />
            <StatCard value="3,245" label="Households" />
            <StatCard value="24" label="Puroks" />
          </View>
          
          <View className="bg-gray-50 rounded-xl p-6 w-full">
            <Text className="font-semibold text-lg text-gray-900 mb-4">
              Office Hours & Contact
            </Text>
            
            <View className="flex flex-col gap-4">
              <View className="flex-row gap-3 items-start">
                <View className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                  <Text className="text-blue-600 text-lg">🕒</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800">Office Hours</Text>
                  <Text className="text-gray-600 text-sm">Monday to Friday: 8:00 AM - 5:00 PM</Text>
                  <Text className="text-gray-600 text-sm">Saturday: 8:00 AM - 12:00 PM</Text>
                  <Text className="text-gray-600 text-sm">Sunday: Closed</Text>
                </View>
              </View>
              
              <View className="flex-row gap-3 items-start">
                <View className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                  <Text className="text-blue-600 text-lg">📞</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800">Contact Numbers</Text>
                  <Text className="text-gray-600 text-sm">Office: (02) 8123-4567</Text>
                  <Text className="text-gray-600 text-sm">Mobile: 0917-123-4567</Text>
                  <Text className="text-gray-600 text-sm">Email: mabuhay@barangay.gov.ph</Text>
                </View>
              </View>
              
              <View className="flex-row gap-3 items-start">
                <View className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                  <Text className="text-blue-600 text-lg">🚨</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800">Emergency Hotlines</Text>
                  <Text className="text-gray-600 text-sm">Barangay Patrol: 0917-888-9999</Text>
                  <Text className="text-gray-600 text-sm">Fire Station: 0917-777-8888</Text>
                  <Text className="text-gray-600 text-sm">Health Center: 0917-666-7777</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        
        <View className="flex-1 flex items-center justify-center w-full max-w-xl h-96">
          <View className="w-full h-full bg-gray-200 rounded-2xl flex items-center justify-center">
            <Text className="text-gray-400 text-lg">Map Placeholder</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default LandingPage;
