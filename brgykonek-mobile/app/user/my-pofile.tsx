import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import type { DocumentPickerAsset } from 'expo-document-picker';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { authStorage } from '../../utils/storage';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import authService from '../../services/auth.service';

const countryCode = '+639';
const countryFlag = require('@/assets/images/brand-logo.png');

type FormData = {
  name: string;
  birthdate: string;
  address: string;
  email: string;
  password: string;
  confirmPassword: string;
  clearance: DocumentPickerAsset | null;
  phone: string;
};

const MyProfile: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      birthdate: '',
      address: '',
      email: '',
      password: '',
      confirmPassword: '',
      clearance: null,
      phone: '',
    },
    mode: 'onTouched',
  });
  const router = useRouter();

  useEffect(() => {
    authStorage.getUserData().then((user) => {
      if (user) {
        console.log('Original user data:', user);
        console.log('Original phone:', user.phone);
        console.log('Original mobile_number:', user.mobile_number);

        let phoneNumber = user.mobile_number || user.phone || '';

        if (phoneNumber.startsWith(countryCode)) {
          phoneNumber = phoneNumber.substring(countryCode.length);
        }

        console.log('Processed phone number:', phoneNumber);
        console.log('Country code:', countryCode);

        reset({
          name: user.name || '',
          birthdate: user.birthdate || '',
          address: user.address || '',
          email: user.email || '',
          password: '',
          confirmPassword: '',
          clearance: null,
          phone: phoneNumber,
        });
        if (user.profileImage) setProfileImage(user.profileImage);
      }
    });
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      console.log('Form data:', data);

      console.log('Form data phone:', data.phone);
      console.log('Form data phone trimmed:', data.phone.trim());

      const updateData = {
        name: data.name.trim(),
        mobile_number: countryCode + data.phone.trim(),
        address: data.address.trim(),
        birthdate: data.birthdate,
      };

      console.log('Update data:', updateData);

      const response = await authService.updateProfile(updateData);

      if (response) {
        const currentUser = await authStorage.getUserData();
        const authToken = await authStorage.getAuthToken();

        console.log('Current user data:', currentUser);
        console.log('Auth token:', authToken);

        if (currentUser && authToken) {
          const updatedUser = {
            id: currentUser.id,
            name: updateData.name,
            email: currentUser.email,
            mobile_number: updateData.mobile_number,
            phone: updateData.mobile_number,
            address: updateData.address,
            birthdate: updateData.birthdate,
            profileImage: currentUser.profileImage || null,
          };

          console.log('Updated user data:', updatedUser);
          await authStorage.saveAuthData(authToken, updatedUser);
        } else {
          console.error('Missing user data or auth token');
        }
      }
    } catch (error: any) {
      console.log('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateValue: any) => {
    if (!dateValue) return '';
    const d = dayjs(dateValue);
    if (!d.isValid()) return '';
    return d.format('DD / MM / YYYY');
  };

  return (
    <DashboardLayout>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: 'center',
            paddingTop: 24,
            paddingBottom: 32,
          }}
          keyboardShouldPersistTaps="handled">
          <View className="w-full flex-1 items-center bg-transparent pt-6">
            <View className="mb-2 w-[85%] flex-row items-center">
              <Pressable onPress={() => router.push('/')}>
                <Text className="text-blue-600">Home</Text>
              </Pressable>
              <Text className="mx-2 text-gray-400">/</Text>
              <Text className="font-medium text-gray-800">My Profile</Text>
            </View>
            <View className="mb-4 w-[85%] items-start">
              <Text className="text-2xl font-bold text-gray-800">Edit Profile</Text>
            </View>
            <View className="mb-8 w-full items-center">
              <View className="relative mb-3">
                <Image
                  source={
                    profileImage ? { uri: profileImage } : require('@/assets/images/brand-logo.png')
                  }
                  className="h-32 w-32 rounded-full border-4 border-white"
                  style={{ resizeMode: 'cover' }}
                />
                <Pressable
                  className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full bg-white"
                  style={{ elevation: 2 }}>
                  <Ionicons name="camera" size={20} color="#FF7A00" />
                </Pressable>
              </View>
            </View>
            <View className="w-[85%] items-center rounded-2xl bg-white p-6 shadow-lg">
              <View className="mb-2 self-stretch">
                <Text className="mb-1 text-base font-medium text-gray-700">Fullname</Text>
                <Controller
                  control={control}
                  name="name"
                  rules={{ required: 'Full Name is required' }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Full Name"
                      className={`mb-1 self-stretch rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-200'} bg-gray-50 p-3 text-base`}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
              </View>
              <View className="mb-2 self-stretch">
                <Text className="mb-1 text-base font-medium text-gray-700">Phone Number</Text>
                <View className="flex-row items-center">
                  <View
                    className="mr-2 flex-row items-center rounded-lg border border-gray-200 bg-gray-50 px-2 py-3"
                    style={{ width: 80 }}>
                    <Image source={countryFlag} className="mr-1 h-5 w-5" />
                    <Text className="text-base text-gray-700">{countryCode}</Text>
                  </View>
                  <Controller
                    control={control}
                    name="phone"
                    rules={{ required: 'Phone number is required' }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="81218991001"
                        keyboardType="phone-pad"
                        className={`flex-1 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-200'} bg-gray-50 p-3 text-base`}
                        placeholderTextColor="#9ca3af"
                      />
                    )}
                  />
                </View>
              </View>
              <View className="mb-2 self-stretch">
                <Text className="mb-1 text-base font-medium text-gray-700">Email Address</Text>
                <Controller
                  control={control}
                  name="email"
                  rules={{ required: 'Email Address is required' }}
                  render={({ field: { value } }) => (
                    <TextInput
                      value={value}
                      editable={false}
                      placeholder="Email Address"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      className={`mb-1 self-stretch rounded-lg border border-gray-200 bg-gray-100 p-3 text-base text-gray-400`}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
              </View>
              <View className="mb-2 self-stretch">
                <Text className="mb-1 text-base font-medium text-gray-700">Date of Birth</Text>
                <View className="flex-row items-center">
                  <Controller
                    control={control}
                    name="birthdate"
                    rules={{ required: 'Birthdate is required' }}
                    render={({ field: { value } }) => (
                      <TextInput
                        value={formatDate(value)}
                        editable={false}
                        placeholder="DD/MM/YY"
                        className={`flex-1 rounded-lg border border-gray-200 bg-gray-100 p-3 text-base text-gray-400`}
                        placeholderTextColor="#9ca3af"
                      />
                    )}
                  />
                  <View className="absolute right-3">
                    <Ionicons name="calendar-outline" size={20} color="#9ca3af" />
                  </View>
                </View>
              </View>
              <View className="mb-2 mt-4 flex-row items-center self-stretch">
                <Ionicons name="location-outline" size={20} color="#FF7A00" />
                <Text className="ml-2 text-base font-semibold text-gray-800">
                  Address & Location
                </Text>
              </View>
              <View className="mb-2 self-stretch">
                <Text className="mb-1 text-base font-medium text-gray-700">Address</Text>
                <Controller
                  control={control}
                  name="address"
                  rules={{ required: 'Address is required' }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Pattimura Road 12, Sukomoro Regency, Nganjuk City"
                      className={`mb-1 self-stretch rounded-lg border ${errors.address ? 'border-red-500' : 'border-gray-200'} bg-gray-50 p-3 text-base`}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
              </View>
              <Pressable
                className={`mb-2 mt-8 w-full items-center rounded-full py-4 ${
                  isLoading ? 'bg-gray-400' : 'bg-gradient-to-r from-orange-400 to-orange-600'
                }`}
                style={{ backgroundColor: isLoading ? '#9ca3af' : '#FF7A00' }}
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}>
                {isLoading ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator size="small" color="#ffffff" />
                    <Text className="ml-2 text-base font-bold text-white">Saving...</Text>
                  </View>
                ) : (
                  <Text className="text-base font-bold text-white">Save Changes</Text>
                )}
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </DashboardLayout>
  );
};

export default MyProfile;
