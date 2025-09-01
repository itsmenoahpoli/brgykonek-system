import {
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
  SafeAreaView,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import type { DocumentPickerAsset } from 'expo-document-picker';
import { useForm, Controller } from 'react-hook-form';
import authService from '../../services/auth.service';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type FormData = {
  name: string;
  birthdate: string;
  address: string;
  email: string;
  password: string;
  confirmPassword: string;
  clearance: DocumentPickerAsset | null;
};

const CreateAccountPage: React.FC = () => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date('1990-01-01'));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;

  const brandTextSize = isLargeScreen ? 'text-5xl' : isMediumScreen ? 'text-4xl' : 'text-3xl';
  const titleSize = isLargeScreen ? 'text-3xl' : isMediumScreen ? 'text-2xl' : 'text-xl';
  const inputPadding = isLargeScreen ? 'p-4' : isMediumScreen ? 'p-3' : 'p-2.5';
  const inputTextSize = isLargeScreen ? 'text-lg' : isMediumScreen ? 'text-base' : 'text-sm';
  const buttonPadding = isLargeScreen ? 'py-4' : isMediumScreen ? 'py-3' : 'py-2.5';
  const buttonTextSize = isLargeScreen ? 'text-lg' : isMediumScreen ? 'text-base' : 'text-sm';

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<FormData>({
    defaultValues: {},
    mode: 'onTouched',
  });
  const router = useRouter();

  const closeDatePicker = () => {
    setShowDatePicker(false);
  };

  const onSubmit = (data: any) => {
    setIsSubmitting(true);
    authService
      .register(data)
      .then((response) => {
        console.log('Registration successful:', response);
        Toast.show({ type: 'success', text1: 'Registration successful' });
        router.push('/auth/signin');
      })
      .catch((error: any) => {
        console.log('Registration error:', error);
        Toast.show({
          type: 'error',
          text1: 'Registration Failed',
          text2: error.message,
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const pickClearance = async (onChange: (file: DocumentPickerAsset | null) => void) => {
    if (isSubmitting) return;
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (result.assets && result.assets.length > 0) {
      onChange(result.assets[0]);
      setValue('clearance', result.assets[0], { shouldValidate: true });
      trigger('clearance');
    }
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
      const formattedDate = date.toISOString().split('T')[0];
      setValue('birthdate', formattedDate, { shouldValidate: true });
      trigger('birthdate');
    }
  };

  const formatDateForDisplay = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') return 'document-text';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) return 'image';
    return 'document';
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <View className="flex-1" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
          <View className="flex-row items-center justify-between px-6 py-6">
            <Pressable onPress={() => router.back()} className="rounded-full bg-gray-100 p-2">
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </Pressable>
            <View className="flex flex-row justify-center gap-x-2">
              <Text className={`${brandTextSize} font-bold text-blue-800`}>BRGY</Text>
              <Text className={`${brandTextSize} font-bold text-red-600`}>KONEK</Text>
            </View>
            <View className="w-10" />
          </View>

          <Text className={`px-6 pb-6 ${titleSize} text-center font-bold text-gray-800`}>
            REGISTER ACCOUNT
          </Text>

          <ScrollView
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <Controller
              control={control}
              name="name"
              rules={{ required: 'Full Name is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onFocus={closeDatePicker}
                    placeholder="Full Name"
                    editable={!isSubmitting}
                    className={`mb-1 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-200'} ${isSubmitting ? 'bg-gray-100' : 'bg-gray-50'} ${inputPadding} ${inputTextSize}`}
                    placeholderTextColor="#9ca3af"
                  />
                  {errors.name && (
                    <Text className="mb-4 text-xs text-red-600">
                      {errors.name.message as string}
                    </Text>
                  )}
                </>
              )}
            />
            <Controller
              control={control}
              name="birthdate"
              rules={{ required: 'Birthdate is required' }}
              render={({ field: { value, onChange } }) => (
                <>
                  <Pressable
                    disabled={isSubmitting}
                    className={`mb-1 rounded-lg border ${errors.birthdate ? 'border-red-500' : 'border-gray-200'} ${isSubmitting ? 'bg-gray-100' : 'bg-gray-50'} ${inputPadding}`}
                    onPress={() => setShowDatePicker(true)}>
                    <Text
                      className={`${inputTextSize} ${selectedDate ? 'text-gray-900' : 'text-gray-500'}`}>
                      {selectedDate ? formatDateForDisplay(selectedDate) : 'mm / dd / yyyy'}
                    </Text>
                  </Pressable>
                  {errors.birthdate && (
                    <Text className="mb-4 text-xs text-red-600">
                      {errors.birthdate.message as string}
                    </Text>
                  )}
                  {showDatePicker && (
                    <DateTimePicker
                      value={selectedDate || new Date()}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={handleDateChange}
                      maximumDate={new Date()}
                      minimumDate={new Date(1900, 0, 1)}
                    />
                  )}
                </>
              )}
            />
            <Controller
              control={control}
              name="address"
              rules={{ required: 'Address is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onFocus={closeDatePicker}
                    placeholder="Address"
                    editable={!isSubmitting}
                    className={`mb-1 rounded-lg border ${errors.address ? 'border-red-500' : 'border-gray-200'} ${isSubmitting ? 'bg-gray-100' : 'bg-gray-50'} ${inputPadding} ${inputTextSize}`}
                    placeholderTextColor="#9ca3af"
                  />
                  {errors.address && (
                    <Text className="mb-4 text-xs text-red-600">
                      {errors.address.message as string}
                    </Text>
                  )}
                </>
              )}
            />
            <Controller
              control={control}
              name="email"
              rules={{ required: 'Email Address is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onFocus={closeDatePicker}
                    placeholder="Email Address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!isSubmitting}
                    className={`mb-1 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-200'} ${isSubmitting ? 'bg-gray-100' : 'bg-gray-50'} ${inputPadding} ${inputTextSize}`}
                    placeholderTextColor="#9ca3af"
                  />
                  {errors.email && (
                    <Text className="mb-4 text-xs text-red-600">
                      {errors.email.message as string}
                    </Text>
                  )}
                </>
              )}
            />
            <Controller
              control={control}
              name="password"
              rules={{ required: 'Password is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onFocus={closeDatePicker}
                    placeholder="Password"
                    secureTextEntry
                    editable={!isSubmitting}
                    className={`mb-1 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-200'} ${isSubmitting ? 'bg-gray-100' : 'bg-gray-50'} ${inputPadding} ${inputTextSize}`}
                    placeholderTextColor="#9ca3af"
                  />
                  {errors.password && (
                    <Text className="mb-4 text-xs text-red-600">
                      {errors.password.message as string}
                    </Text>
                  )}
                </>
              )}
            />
            <Controller
              control={control}
              name="confirmPassword"
              rules={{ required: 'Confirm Password is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onFocus={closeDatePicker}
                    placeholder="Confirm Password"
                    secureTextEntry
                    editable={!isSubmitting}
                    className={`mb-1 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} ${isSubmitting ? 'bg-gray-100' : 'bg-gray-50'} ${inputPadding} ${inputTextSize}`}
                    placeholderTextColor="#9ca3af"
                  />
                  {errors.confirmPassword && (
                    <Text className="mb-4 text-xs text-red-600">
                      {errors.confirmPassword.message as string}
                    </Text>
                  )}
                </>
              )}
            />
            <Controller
              control={control}
              name="clearance"
              render={({ field: { value, onChange } }) => (
                <>
                  <View className="mb-1">
                    {value && typeof value === 'object' && 'name' in value ? (
                      <View
                        className={`rounded-lg border ${errors.clearance ? 'border-red-500' : 'border-gray-200'} ${isSubmitting ? 'bg-gray-100' : 'bg-gray-50'} ${inputPadding}`}>
                        <View className="flex-row items-center justify-between">
                          <View className="flex-1 flex-row items-center">
                            <Ionicons
                              name={getFileIcon(value.name) as any}
                              size={isLargeScreen ? 20 : isMediumScreen ? 18 : 16}
                              color="#6b7280"
                              className="mr-2"
                            />
                            <Text className={`${inputTextSize} text-gray-900`} numberOfLines={1}>
                              {value.name}
                            </Text>
                          </View>
                          <Pressable
                            disabled={isSubmitting}
                            onPress={() => {
                              onChange(null);
                              setValue('clearance', null);
                            }}
                            className="ml-2 rounded-full p-1">
                            <Ionicons
                              name="close"
                              size={isLargeScreen ? 16 : isMediumScreen ? 14 : 12}
                              color="#6b7280"
                            />
                          </Pressable>
                        </View>
                      </View>
                    ) : (
                      <View
                        className={`rounded-lg border-2 border-dashed ${errors.clearance ? 'border-red-500' : 'border-gray-300'} ${isSubmitting ? 'bg-gray-100' : 'bg-gray-50'} ${inputPadding}`}>
                        <View className="items-center py-4">
                          <Ionicons
                            name="cloud-upload"
                            size={isLargeScreen ? 32 : isMediumScreen ? 28 : 24}
                            color="#9ca3af"
                            className="mb-3"
                          />
                          <Text
                            className={`${inputTextSize} mb-2 text-center font-medium text-gray-700`}>
                            Barangay Clearance
                          </Text>
                          <Text className="mb-4 text-center text-xs text-gray-500">
                            Upload your barangay clearance document
                          </Text>
                          <Pressable
                            disabled={isSubmitting}
                            className="rounded-lg bg-blue-600 px-6 py-3"
                            onPress={() => {
                              closeDatePicker();
                              pickClearance(onChange);
                            }}>
                            <Text className={`${buttonTextSize} font-semibold text-white`}>
                              Choose File
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    )}
                  </View>
                  {errors.clearance && (
                    <Text className="mb-4 text-xs text-red-600">
                      {errors.clearance.message as string}
                    </Text>
                  )}
                </>
              )}
            />
            <View className="h-20" />
          </ScrollView>

          <View className="bg-white px-6 pb-6 pt-4">
            <Pressable
              disabled={isSubmitting}
              className={`items-center rounded-lg ${buttonPadding} ${isSubmitting ? 'bg-gray-400' : 'bg-[#333]'}`}
              onPress={handleSubmit(onSubmit)}>
              {isSubmitting ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="white" className="mr-2" />
                  <Text className={`${buttonTextSize} font-bold text-white`}>REGISTERING...</Text>
                </View>
              ) : (
                <Text className={`${buttonTextSize} font-bold text-white`}>REGISTER ACCOUNT</Text>
              )}
            </Pressable>
            <Pressable
              disabled={isSubmitting}
              className={`mt-3 items-center rounded-lg border border-gray-300 ${buttonPadding} ${isSubmitting ? 'bg-gray-100' : 'bg-white'}`}
              onPress={() => router.push('/auth/signin')}>
              <Text
                className={`${buttonTextSize} font-bold ${isSubmitting ? 'text-gray-400' : 'text-blue-700'}`}>
                BACK TO SIGN-IN
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateAccountPage;
