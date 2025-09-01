import React from 'react';
import { View, Text, FlatList } from 'react-native';

type Announcement = {
  id: string;
  date: string;
  title: string;
  category: string;
  creator: string;
};

type AnnouncementListProps = {
  announcements: Announcement[];
};

const AnnouncementList: React.FC<AnnouncementListProps> = ({ announcements }) => {
  return (
    <FlatList
      data={announcements}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View className="flex-row border-b border-gray-100 px-2 py-1">
          <Text className="w-[20%] text-xs text-gray-700">{item.date}</Text>
          <Text className="w-[40%] text-xs text-gray-700">{item.title}</Text>
          <Text className="w-[20%] text-xs text-gray-700">{item.category}</Text>
          <Text className="w-[20%] text-xs text-gray-700">{item.creator}</Text>
        </View>
      )}
      ListEmptyComponent={
        <Text className="px-2 py-1 text-xs text-gray-400">No announcements found.</Text>
      }
    />
  );
};

export default AnnouncementList;
