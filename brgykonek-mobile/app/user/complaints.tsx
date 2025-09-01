import { useState } from 'react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import {
  View,
  Text,
  Pressable,
  FlatList,
  TouchableOpacity,
  Modal,
  Button,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import complaintService from '../../services/complaint.service';
import { authStorage } from '../../utils/storage';
import { useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Picker } from '@react-native-picker/picker';

type Complaint = {
  id?: string;
  _id?: string;
  category: string;
  date_of_report: string;
  complaint_content: string;
  attachments: any[];
  status: boolean;
};

export default function ComplaintsPage() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const categories = Array.from(new Set(complaints.map((c) => c.category).filter(Boolean)));
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const filteredComplaints = complaints.filter((c) => {
    const statusMatch =
      statusFilter === 'all' || (statusFilter === 'published' ? c.status : !c.status);
    const categoryMatch = categoryFilter === 'all' || c.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  const { control, handleSubmit, reset, setValue } = useForm<Complaint>({
    defaultValues: {
      category: '',
      date_of_report: '',
      complaint_content: '',
      attachments: [],
      status: false,
    },
  });

  useEffect(() => {
    const fetchComplaints = async () => {
      const userData = await authStorage.getUserData();
      const residentId = userData?.resident_id || userData?.id;
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
    };
    fetchComplaints();
  }, []);

  const openCreateModal = () => {
    reset({
      category: '',
      date_of_report: '',
      complaint_content: '',
      attachments: [],
      status: false,
    });
    setEditingIndex(null);
    setModalVisible(true);
  };

  const openEditModal = (index: number) => {
    const c = complaints[index];
    setValue('category', c.category);
    setValue('date_of_report', c.date_of_report);
    setValue('complaint_content', c.complaint_content);
    setValue('attachments', c.attachments);
    setValue('status', c.status);
    setEditingIndex(index);
    setModalVisible(true);
  };

  const onSubmit = async (data: Complaint) => {
    const userData = await authStorage.getUserData();
    const residentId = userData?.resident_id || userData?.id;
    if (editingIndex !== null) {
      const complaintId = complaints[editingIndex]?.id || complaints[editingIndex]?._id;
      if (complaintId) {
        await complaintService.updateComplaint(complaintId, { ...data, resident_id: residentId });
        const complaintsData = await complaintService.getComplaintsByResident(residentId);
        setComplaints(complaintsData);
      }
    } else {
      await complaintService.createComplaint({ ...data, resident_id: residentId });
      const complaintsData = await complaintService.getComplaintsByResident(residentId);
      setComplaints(complaintsData);
    }
    setModalVisible(false);
    reset();
    setEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    const updated = complaints.filter((_, i) => i !== index);
    setComplaints(updated);
    if (editingIndex === index) {
      setModalVisible(false);
      reset();
      setEditingIndex(null);
    }
  };

  return (
    <DashboardLayout title="Complaints">
      <View className="w-full items-center bg-transparent pt-6">
        <View className="mb-2 w-11/12 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Pressable onPress={() => router.push('/user')}>
              <Text className="text-blue-600">User</Text>
            </Pressable>
            <Text className="mx-2 text-gray-400">/</Text>
            <Text className="font-medium text-gray-800">Complaints</Text>
          </View>
          <TouchableOpacity className="rounded bg-blue-600 px-4 py-2" onPress={openCreateModal}>
            <Text className="font-semibold text-white">Create Complaint</Text>
          </TouchableOpacity>
        </View>
        <View className="mb-4 w-11/12 flex-row space-x-8">
          <View className="flex-1">
            <Text className="mb-1 font-bold">Status</Text>
            <TouchableOpacity
              className="flex-row items-center justify-between rounded border border-gray-300 bg-white px-3 py-2"
              onPress={() => setStatusDropdownOpen((open) => !open)}>
              <Text className={statusFilter === 'all' ? 'text-gray-400' : 'text-gray-800'}>
                {statusFilter === 'all'
                  ? 'All Status'
                  : statusFilter === 'published'
                    ? 'Published'
                    : 'Draft'}
              </Text>
              <Feather
                name={statusDropdownOpen ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#6b7280"
              />
            </TouchableOpacity>
            {statusDropdownOpen && (
              <View className="rounded-b border border-t-0 border-gray-300 bg-white">
                <TouchableOpacity
                  onPress={() => {
                    setStatusFilter('all');
                    setStatusDropdownOpen(false);
                  }}
                  className="px-3 py-2">
                  <Text
                    className={
                      statusFilter === 'all' ? 'font-semibold text-blue-600' : 'text-gray-800'
                    }>
                    All Status
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setStatusFilter('published');
                    setStatusDropdownOpen(false);
                  }}
                  className="px-3 py-2">
                  <Text
                    className={
                      statusFilter === 'published' ? 'font-semibold text-blue-600' : 'text-gray-800'
                    }>
                    Published
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setStatusFilter('draft');
                    setStatusDropdownOpen(false);
                  }}
                  className="px-3 py-2">
                  <Text
                    className={
                      statusFilter === 'draft' ? 'font-semibold text-blue-600' : 'text-gray-800'
                    }>
                    Draft
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View className="flex-1">
            <Text className="mb-1 font-bold">Category</Text>
            <TouchableOpacity
              className="flex-row items-center justify-between rounded border border-gray-300 bg-white px-3 py-2"
              onPress={() => setCategoryDropdownOpen((open) => !open)}>
              <Text className={categoryFilter === 'all' ? 'text-gray-400' : 'text-gray-800'}>
                {categoryFilter === 'all' ? 'All Categories' : categoryFilter}
              </Text>
              <Feather
                name={categoryDropdownOpen ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#6b7280"
              />
            </TouchableOpacity>
            {categoryDropdownOpen && (
              <View className="rounded-b border border-t-0 border-gray-300 bg-white">
                <TouchableOpacity
                  onPress={() => {
                    setCategoryFilter('all');
                    setCategoryDropdownOpen(false);
                  }}
                  className="px-3 py-2">
                  <Text
                    className={
                      categoryFilter === 'all' ? 'font-semibold text-blue-600' : 'text-gray-800'
                    }>
                    All Categories
                  </Text>
                </TouchableOpacity>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => {
                      setCategoryFilter(cat);
                      setCategoryDropdownOpen(false);
                    }}
                    className="px-3 py-2">
                    <Text
                      className={
                        categoryFilter === cat ? 'font-semibold text-blue-600' : 'text-gray-800'
                      }>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
        <FlatList
          data={filteredComplaints}
          keyExtractor={(_, i) => i.toString()}
          className="w-11/12"
          renderItem={({ item, index }) => (
            <View className="relative mb-2 rounded border border-gray-200 bg-white p-4">
              <TouchableOpacity
                onPress={() => handleDelete(index)}
                className="absolute right-2 top-2 z-10 p-1">
                <Feather name="x" size={22} color="#ef4444" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => openEditModal(index)}
                className="absolute right-2 top-10 z-10 p-1">
                <MaterialIcons name="edit" size={22} color="#2563eb" />
              </TouchableOpacity>
              <Text className="font-semibold">
                Category: <Text className="font-normal">{item.category}</Text>
              </Text>
              <Text className="font-semibold">
                Date: <Text className="font-normal">{item.date_of_report}</Text>
              </Text>
              <Text className="font-semibold">
                Content: <Text className="font-normal">{item.complaint_content}</Text>
              </Text>
              <View className="mt-2 flex-row items-center">
                <View
                  className={`rounded-full px-3 py-1 ${item.status ? 'bg-green-100' : 'bg-yellow-100'}`}>
                  <Text
                    className={`text-xs font-semibold ${item.status ? 'text-green-700' : 'text-yellow-700'}`}>
                    {item.status ? 'Published' : 'Draft'}
                  </Text>
                </View>
              </View>
              <View className="mt-2 flex-row">{/* Edit button removed */}</View>
            </View>
          )}
        />
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View className="flex-1 items-center justify-center bg-black/40">
            <View className="w-11/12 rounded-lg bg-white p-6">
              <Text className="mb-4 text-xl font-bold">
                {editingIndex !== null ? 'Edit Complaint' : 'Create Complaint'}
              </Text>
              <Controller
                control={control}
                name="category"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <View className="mb-3">
                    <Text className="mb-1">Category</Text>
                    <View className="rounded border border-gray-300 px-2 py-1">
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        className="text-base"
                        placeholder="Category"
                      />
                    </View>
                  </View>
                )}
              />
              <Controller
                control={control}
                name="date_of_report"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <View className="mb-3">
                    <Text className="mb-1">Date of Report</Text>
                    <View className="rounded border border-gray-300 px-2 py-1">
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        className="text-base"
                        placeholder="YYYY-MM-DD"
                      />
                    </View>
                  </View>
                )}
              />
              <Controller
                control={control}
                name="complaint_content"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <View className="mb-3">
                    <Text className="mb-1">Complaint Content</Text>
                    <View className="rounded border border-gray-300 px-2 py-1">
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        className="text-base"
                        placeholder="Describe your complaint"
                        multiline
                      />
                    </View>
                  </View>
                )}
              />
              <Controller
                control={control}
                name="attachments"
                render={({ field: { value, onChange } }) => (
                  <View className="mb-3">
                    <Text className="mb-1">Attachments</Text>
                    <TouchableOpacity
                      className="mb-2 items-center rounded bg-blue-100 px-3 py-2"
                      onPress={async () => {
                        const result = await DocumentPicker.getDocumentAsync({ multiple: true });
                        if (!result.canceled) {
                          const files = result.assets || [];
                          onChange([...(value || []), ...files]);
                        }
                      }}>
                      <Text className="font-semibold text-blue-700">Select Files</Text>
                    </TouchableOpacity>
                    {Array.isArray(value) && value.length > 0 && (
                      <View className="space-y-1">
                        {value.map((file, idx) => (
                          <View
                            key={file.uri || idx}
                            className="flex-row items-center justify-between">
                            <Text className="text-xs text-gray-700" numberOfLines={1}>
                              {file.name || file.uri}
                            </Text>
                            <TouchableOpacity
                              onPress={() => onChange(value.filter((_, i) => i !== idx))}>
                              <Feather name="x" size={16} color="#ef4444" />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}
              />
              <Controller
                control={control}
                name="status"
                render={({ field: { onChange, value } }) => (
                  <View className="mb-4">
                    <Text className="mb-2">Status:</Text>
                    <View className="flex-row items-center space-x-6">
                      <TouchableOpacity
                        className="mr-5 flex-row items-center space-x-2 py-2"
                        onPress={() => onChange(false)}>
                        <View
                          className={`mr-1 h-4 w-4 rounded-full border border-gray-400 ${!value ? 'border-yellow-400 bg-yellow-400' : 'bg-white'}`}
                        />
                        <Text className="text-sm">Draft</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="flex-row items-center space-x-2 py-2"
                        onPress={() => onChange(true)}>
                        <View
                          className={`mr-1 h-4 w-4 rounded-full border border-gray-400 ${value ? 'border-green-500 bg-green-500' : 'bg-white'}`}
                        />
                        <Text className="text-sm">Published</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
              <View className="flex-row justify-end">
                <TouchableOpacity
                  className="mr-3 rounded bg-gray-200 px-4 py-2"
                  onPress={() => {
                    setModalVisible(false);
                    reset();
                    setEditingIndex(null);
                  }}>
                  <Text className="text-gray-700">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="rounded bg-blue-600 px-4 py-2"
                  onPress={handleSubmit(onSubmit)}>
                  <Text className="font-semibold text-white">
                    {editingIndex !== null ? 'Update' : 'Create'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </DashboardLayout>
  );
}
