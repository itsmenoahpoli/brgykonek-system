import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import complaintService from '../../services/complaint.service';
import announcementService from '../../services/announcement.service';
import dashboardService from '../../services/dashboard.service';
import { authStorage } from '../../utils/storage';
import { BarChart, LineChart } from 'react-native-gifted-charts';

type DashboardStats = {
  totalComplaints: number;
  totalActiveAnnouncements: number;
  totalResidents: number;
  complaintsPerMonth: { month: string; count: number }[];
  announcementsPerMonth: { month: string; count: number }[];
  usersPerMonth: { month: string; count: number }[];
};

const User = () => {
  const [complaints, setComplaints] = useState<
    Array<{
      id?: string;
      _id?: string;
      date_of_report?: string;
      resident_id?: {
        _id?: string;
        name?: string;
        email?: string;
        mobile_number?: string;
        user_type?: string;
        address?: string;
        birthdate?: string;
        barangay_clearance?: string;
      };
      category?: string;
      status?: string;
      created_at?: string;
      updated_at?: string;
      complaint_content?: string;
      attachments?: string[];
    }>
  >([]);
  const [announcements, setAnnouncements] = useState<
    Array<{
      id?: string;
      _id?: string;
      title?: string;
      title_slug?: string;
      header?: string;
      body?: string;
      banner_image?: string;
      status?: string;
      created_at?: string;
    }>
  >([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loadingDashboardStats, setLoadingDashboardStats] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingComplaints(true);
      setLoadingAnnouncements(true);
      setLoadingDashboardStats(true);
      const userData = await authStorage.getUserData();
      let residentId = userData?.resident_id || userData?.id;
      if (residentId) {
        try {
          const complaintsData = await complaintService.getComplaintsByResident(residentId);
          setComplaints(complaintsData);
        } catch (e) {
          setComplaints([]);
        }
      } else {
        setComplaints([]);
      }
      setLoadingComplaints(false);
      try {
        const announcementsData = await announcementService.getAnnouncements();
        setAnnouncements(announcementsData);
      } catch (e) {
        setAnnouncements([]);
      }
      setLoadingAnnouncements(false);
      try {
        const stats = await dashboardService.getOverviewStatistics();
        setDashboardStats(stats);
      } catch (e) {
        setDashboardStats(null);
      }
      setLoadingDashboardStats(false);
    };
    fetchData();
  }, []);

  const { width: windowWidth } = useWindowDimensions();
  const chartContainerWidth = Math.max(windowWidth * 0.85 - 32, 0);

  const dashboardHeader = useMemo(
    () => (
      <View style={{ alignItems: 'center', paddingTop: 24 }}>
        <View className="mb-4 w-[85%] flex-row justify-between">
          <View className="mb-2 w-[47%] items-center rounded-lg bg-white px-6 py-4 shadow-sm">
            <Text className="text-lg font-bold text-gray-800">
              {loadingDashboardStats ? '-' : (dashboardStats?.totalComplaints ?? '-')}
            </Text>
            <Text className="text-xs text-gray-500">Total Complaints</Text>
          </View>
          <View className="mb-2 w-[47%] items-center rounded-lg bg-white px-6 py-4 shadow-sm">
            <Text className="text-lg font-bold text-gray-800">
              {loadingDashboardStats ? '-' : (dashboardStats?.totalActiveAnnouncements ?? '-')}
            </Text>
            <Text className="text-xs text-gray-500">Active Announcements</Text>
          </View>
        </View>
        <View className="mb-4 w-[85%] flex-row justify-between">
          <View className="mb-2 w-[47%] items-center rounded-lg bg-white px-6 py-4 shadow-sm">
            <Text className="text-lg font-bold text-gray-800">
              {loadingDashboardStats ? '-' : (dashboardStats?.totalResidents ?? '-')}
            </Text>
            <Text className="text-xs text-gray-500">Registered Users</Text>
          </View>
          <View className="mb-2 w-[47%] items-center rounded-lg bg-white px-6 py-4 shadow-sm">
            <Text className="text-lg font-bold text-gray-800">-</Text>
            <Text className="text-xs text-gray-500">Resolved Complaints</Text>
          </View>
        </View>
        <View className="mb-4 w-[85%] rounded-lg bg-white p-4 shadow-sm">
          <Text className="mb-2 font-semibold text-gray-800">Complaint Volume</Text>
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              borderRadius: 12,
              backgroundColor: '#dbeafe',
              overflow: 'hidden',
            }}>
            {loadingDashboardStats || !dashboardStats?.complaintsPerMonth ? (
              <ActivityIndicator size="small" color="#1d4ed8" style={{ margin: 12 }} />
            ) : (
              <LineChart
                data={dashboardStats.complaintsPerMonth.map((item) => ({
                  value: item.count,
                  label: item.month,
                }))}
                thickness={3}
                color="#2563eb"
                areaChart
                startFillColor="#60a5fa"
                endFillColor="#2563eb"
                startOpacity={0.2}
                endOpacity={0.05}
                yAxisThickness={0}
                xAxisType={'dashed'}
                xAxisColor={'#d1d5db'}
                yAxisTextStyle={{ color: '#6b7280' }}
                noOfSections={6}
                xAxisLabelTextStyle={{ color: '#6b7280', textAlign: 'center' }}
                hideDataPoints={false}
                curved
                maxValue={Math.max(
                  ...dashboardStats.complaintsPerMonth.map((item) => item.count),
                  1
                )}
                width={chartContainerWidth}
                height={256}
              />
            )}
          </View>
        </View>
        <View className="mb-4 w-[85%] rounded-lg bg-white p-4 shadow-sm">
          <Text className="mb-2 font-semibold text-gray-800">Announcement Activity</Text>
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              borderRadius: 12,
              backgroundColor: '#dbeafe',
              overflow: 'hidden',
            }}>
            {loadingDashboardStats || !dashboardStats?.announcementsPerMonth ? (
              <ActivityIndicator size="small" color="#1d4ed8" style={{ margin: 12 }} />
            ) : (
              <BarChart
                data={dashboardStats.announcementsPerMonth.map((item) => ({
                  value: item.count,
                  label: item.month,
                  frontColor: '#2563eb',
                  gradientColor: '#60a5fa',
                }))}
                barWidth={16}
                initialSpacing={10}
                spacing={14}
                barBorderRadius={4}
                showGradient
                yAxisThickness={0}
                xAxisType={'dashed'}
                xAxisColor={'#d1d5db'}
                yAxisTextStyle={{ color: '#6b7280' }}
                noOfSections={6}
                labelWidth={40}
                xAxisLabelTextStyle={{ color: '#6b7280', textAlign: 'center' }}
                maxValue={Math.max(
                  ...dashboardStats.announcementsPerMonth.map((item) => item.count),
                  1
                )}
                showLine
                lineData={dashboardStats.announcementsPerMonth.map((item) => ({
                  value: item.count,
                }))}
                lineConfig={{
                  color: '#f59e42',
                  thickness: 2,
                  curved: true,
                  hideDataPoints: true,
                }}
                width={chartContainerWidth}
                height={256}
              />
            )}
          </View>
        </View>
        <View className="mb-4 w-[85%] rounded-lg bg-white p-4 shadow-sm">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="font-semibold text-gray-800">Complaints</Text>
            <View className="flex-row space-x-2">
              <View className="rounded bg-gray-100 px-2 py-1">
                <Text className="text-xs text-gray-600">Date range</Text>
              </View>
              <View className="rounded bg-gray-100 px-2 py-1">
                <Text className="text-xs text-gray-600">Type</Text>
              </View>
            </View>
          </View>
          <View className="rounded-lg bg-gray-50" style={{ minHeight: 120, maxHeight: 250 }}>
            {loadingComplaints ? (
              <ActivityIndicator size="small" color="#1d4ed8" style={{ margin: 12 }} />
            ) : (
              <ScrollView style={{ maxHeight: 250 }}>
                {complaints
                  .filter((item) => item && (item.id || item._id))
                  .map((item, idx) => (
                    <View
                      key={item.id || item._id || idx}
                      className="flex-row border-b border-gray-100 px-2 py-1">
                      <Text className="w-[33%] text-xs text-gray-700">
                        {item.date_of_report
                          ? new Date(item.date_of_report).toLocaleDateString()
                          : ''}
                      </Text>
                      <Text className="w-[34%] text-xs text-gray-700">{item.category || ''}</Text>
                      <Text
                        className={`w-[33%] text-xs ${item.status === 'Resolved' ? 'text-green-500' : 'text-yellow-500'}`}>
                        {item.status || ''}
                      </Text>
                    </View>
                  ))}
              </ScrollView>
            )}
          </View>
        </View>
        <View className="mb-8 w-[85%] rounded-lg bg-white p-4 shadow-sm">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="font-semibold text-gray-800">Announcement</Text>
            <View className="rounded bg-gray-100 px-2 py-1">
              <Text className="text-xs text-gray-600">Search</Text>
            </View>
          </View>
          <View className="rounded-lg bg-gray-50" style={{ minHeight: 120, maxHeight: 250 }}>
            {loadingAnnouncements ? (
              <ActivityIndicator size="small" color="#1d4ed8" style={{ margin: 12 }} />
            ) : (
              <ScrollView style={{ maxHeight: 250 }}>
                {announcements
                  .filter((item) => item && (item.id || item._id))
                  .map((item, idx) => (
                    <View
                      key={item.id || item._id || idx}
                      className="flex-row border-b border-gray-100 px-2 py-1">
                      <Text className="w-[30%] text-xs text-gray-700">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}
                      </Text>
                      <Text className="w-[50%] text-xs text-gray-700">{item.title || ''}</Text>
                      <Text className="w-[20%] text-xs text-gray-700">{item.status || ''}</Text>
                    </View>
                  ))}
              </ScrollView>
            )}
          </View>
        </View>
      </View>
    ),
    [
      complaints,
      announcements,
      loadingComplaints,
      loadingAnnouncements,
      loadingDashboardStats,
      dashboardStats,
    ]
  );

  return (
    <DashboardLayout>
      <View className="w-full items-center bg-transparent pt-6">
        <View className="mb-2 w-[85%] flex-row items-center">
          <Text className="text-blue-600">Home</Text>
          <Text className="mx-2 text-gray-400">/</Text>
          <Text className="font-medium text-gray-800">Dashboard</Text>
        </View>
        <View className="mb-4 w-[85%] items-start">
          <Text className="text-2xl font-bold text-gray-800">Dashboard</Text>
        </View>
      </View>
      <FlatList
        data={[{}]}
        renderItem={() => null}
        keyExtractor={(_, index) => index.toString()}
        ListHeaderComponent={dashboardHeader}
        showsVerticalScrollIndicator={false}
      />
    </DashboardLayout>
  );
};

export default User;
