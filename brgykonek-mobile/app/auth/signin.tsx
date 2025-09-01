import { View, Text, TextInput, Image, Pressable, Modal, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { BRAND_LOGO } from '@/assets/images';
import { SplashLayout } from '@/components';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import authService from '../../services/auth.service';
import { authStorage } from '../../utils/storage';

const SigninPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onTouched',
  });
  const router = useRouter();
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState<'email' | 'otp'>('email');
  const [modalEmail, setModalEmail] = useState('');
  const [modalOTP, setModalOTP] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkUserData = async () => {
      const userData = await authStorage.getUserData();
      if (userData) {
        router.replace('/user');
      }
    };
    checkUserData();
  }, []);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await authService.login(data.email, data.password);
      await authService.forgotPassword(data.email);
      setFailedAttempts(0);
      router.push(`/auth/verify-otp?email=${encodeURIComponent(data.email)}&from=login`);
      setLoading(false);
    } catch (e) {
      setFailedAttempts((prev) => prev + 1);
      if (failedAttempts + 1 >= 3) {
        setShowModal(true);
        setModalStep('email');
        setModalEmail('');
        setModalOTP('');
        setModalError('');
      }
      setLoading(false);
    }
  };

  const handleEmailSubmit = async () => {
    setModalLoading(true);
    setModalError('');
    try {
      await authService.forgotPassword(modalEmail);
      setModalStep('otp');
    } catch (e: any) {
      setModalError('Failed to send OTP. Please check your email.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleOTPSubmit = async () => {
    setModalLoading(true);
    setModalError('');
    try {
      await authService.verifyOTP(modalEmail, modalOTP);
      setShowModal(false);
      setFailedAttempts(0);
      setModalStep('email');
      setModalEmail('');
      setModalOTP('');
      setModalError('');
    } catch (e: any) {
      setModalError('Invalid OTP. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="flex-1 items-center justify-center px-4">
        <Image source={BRAND_LOGO} className="mb-6 h-48 w-48" style={{ resizeMode: 'contain' }} />
        <View className="mb-6 flex flex-row justify-center gap-x-2">
          <Text className="text-4xl font-bold text-blue-800">BRGY</Text>
          <Text className="text-4xl font-bold text-red-600">KONEK</Text>
        </View>
        <View className="w-full max-w-sm items-center rounded-2xl bg-white p-6">
          <Controller
            control={control}
            name="email"
            rules={{ required: 'Email Address is required' }}
            render={({ field: { onChange, value, onBlur } }) => (
              <>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Email Address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className={`mb-1 self-stretch rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-200'} bg-gray-50 p-3 text-base`}
                  placeholderTextColor="#9ca3af"
                />
                {errors.email && (
                  <Text className="mb-3 self-stretch text-xs text-red-600">
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
            render={({ field: { onChange, value, onBlur } }) => (
              <>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Password"
                  secureTextEntry
                  className={`mb-1 self-stretch rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-200'} bg-gray-50 p-3 text-base`}
                  placeholderTextColor="#9ca3af"
                />
                {errors.password && (
                  <Text className="mb-3 self-stretch text-xs text-red-600">
                    {errors.password.message as string}
                  </Text>
                )}
              </>
            )}
          />
          <View className="mb-4 w-full items-end">
            <Pressable onPress={() => router.push('/auth/forgot-password')}>
              <Text className="text-base font-medium text-blue-600">Forgot password?</Text>
            </Pressable>
          </View>
          <Pressable
            className="items-center self-stretch rounded-lg bg-[#333] py-3"
            onPress={handleSubmit(onSubmit)}>
            <Text className="text-base font-bold text-white">SIGN IN TO DASHBOARD</Text>
          </Pressable>
          <Pressable
            className="mt-3 items-center self-stretch rounded-lg border border-gray-300 bg-white py-3"
            onPress={() => router.push('/auth/create-account')}>
            <Text className="text-base font-bold text-black">REGISTER FOR AN ACCOUNT</Text>
          </Pressable>
        </View>
      </View>
      <Modal visible={showModal} transparent animationType="slide">
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="w-80 rounded-2xl bg-white p-6">
            {modalStep === 'email' && (
              <>
                <Text className="mb-4 text-lg font-bold text-gray-800">
                  Too many failed attempts
                </Text>
                <Text className="mb-2 text-sm text-gray-600">
                  Enter your email to receive a one-time passcode
                </Text>
                <TextInput
                  value={modalEmail}
                  onChangeText={setModalEmail}
                  placeholder="Email Address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="mb-2 self-stretch rounded-lg border border-gray-200 bg-gray-50 p-3 text-base"
                  placeholderTextColor="#9ca3af"
                />
                {modalError ? (
                  <Text className="mb-2 text-xs text-red-600">{modalError}</Text>
                ) : null}
                <Pressable
                  className={`mt-2 items-center self-stretch rounded-lg py-3 ${modalLoading ? 'bg-gray-400' : 'bg-[#333]'}`}
                  onPress={handleEmailSubmit}
                  disabled={modalLoading || !modalEmail}>
                  {modalLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-base font-bold text-white">Submit</Text>
                  )}
                </Pressable>
                <Pressable
                  className="mt-2 items-center self-stretch rounded-lg border border-gray-300 bg-white py-3"
                  onPress={() => setShowModal(false)}
                  disabled={modalLoading}>
                  <Text className="text-base font-bold text-black">Cancel</Text>
                </Pressable>
              </>
            )}
            {modalStep === 'otp' && (
              <>
                <Text className="mb-4 text-lg font-bold text-gray-800">Enter OTP</Text>
                <Text className="mb-2 text-sm text-gray-600">
                  Check your email for the one-time passcode
                </Text>
                <TextInput
                  value={modalOTP}
                  onChangeText={setModalOTP}
                  placeholder="OTP Code"
                  keyboardType="number-pad"
                  className="mb-2 self-stretch rounded-lg border border-gray-200 bg-gray-50 p-3 text-base"
                  placeholderTextColor="#9ca3af"
                  maxLength={6}
                />
                {modalError ? (
                  <Text className="mb-2 text-xs text-red-600">{modalError}</Text>
                ) : null}
                <Pressable
                  className={`mt-2 items-center self-stretch rounded-lg py-3 ${modalLoading ? 'bg-gray-400' : 'bg-[#333]'}`}
                  onPress={handleOTPSubmit}
                  disabled={modalLoading || !modalOTP}>
                  {modalLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-base font-bold text-white">Verify OTP</Text>
                  )}
                </Pressable>
                <Pressable
                  className="mt-2 items-center self-stretch rounded-lg border border-gray-300 bg-white py-3"
                  onPress={() => {
                    setModalStep('email');
                    setModalOTP('');
                    setModalError('');
                  }}
                  disabled={modalLoading}>
                  <Text className="text-base font-bold text-black">Back</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
      {loading && (
        <View className="absolute inset-0 z-50 items-center justify-center bg-black/40">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </SafeAreaView>
  );
};

export default SigninPage;
