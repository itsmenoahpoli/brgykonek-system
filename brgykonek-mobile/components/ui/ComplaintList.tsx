import React from 'react';
import { View, Text, FlatList } from 'react-native';

type Complaint = {
  id: string;
  date: string;
  complainant: string;
  type: string;
  status: string;
};

type ComplaintListProps = {
  complaints: Complaint[];
};

const ComplaintList: React.FC<ComplaintListProps> = ({ complaints }) => {
  return (
    <FlatList
      data={complaints}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View className="flex-row border-b border-gray-100 px-2 py-1">
          <Text className="w-[20%] text-xs text-gray-700">{item.date}</Text>
          <Text className="w-[30%] text-xs text-gray-700">{item.complainant}</Text>
          <Text className="w-[25%] text-xs text-gray-700">{item.type}</Text>
          <Text
            className={`w-[25%] text-xs ${item.status === 'Resolved' ? 'text-green-500' : 'text-yellow-500'}`}>
            {item.status}
          </Text>
        </View>
      )}
      ListEmptyComponent={
        <Text className="px-2 py-1 text-xs text-gray-400">No complaints found.</Text>
      }
    />
  );
};

export default ComplaintList;
