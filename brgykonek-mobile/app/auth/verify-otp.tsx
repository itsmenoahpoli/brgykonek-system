import { View, Text, TextInput, Image, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { BRAND_LOGO } from '@/assets/images';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import authService from '../../services/auth.service';

const VerifyOTPPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      otp: '',
    },
    mode: 'onTouched',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { email, from } = useLocalSearchParams<{ email: string; from?: string }>();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await authService.verifyOTP(email, data.otp);
      if (from === 'forgot-password') {
        router.push({ pathname: '/auth/reset-password', params: { email } });
      } else {
        router.push('/user');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await authService.resendOTP();
      setCountdown(60);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          <Text className="mb-4 text-center text-xl font-bold text-gray-800">Verify OTP</Text>

          <Text className="mb-6 text-center text-sm leading-5 text-gray-600">
            Enter the 6-digit verification code sent to your email address.
          </Text>

          <Controller
            control={control}
            name="otp"
            rules={{
              required: 'OTP is required',
              pattern: {
                value: /^[0-9]{6}$/,
                message: 'Please enter a valid 6-digit OTP',
              },
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter 6-digit OTP"
                  keyboardType="numeric"
                  maxLength={6}
                  className={`mb-1 self-stretch rounded-lg border ${errors.otp ? 'border-red-500' : 'border-gray-200'} bg-gray-50 p-3 text-center text-base`}
                  placeholderTextColor="#9ca3af"
                />
                {errors.otp && (
                  <Text className="mb-3 self-stretch text-xs text-red-600">
                    {errors.otp.message as string}
                  </Text>
                )}
              </>
            )}
          />

          <Pressable
            className={`mt-4 items-center self-stretch rounded-lg py-3 ${isLoading ? 'bg-gray-400' : 'bg-[#333]'}`}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}>
            <Text className="text-base font-bold text-white">
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Text>
          </Pressable>

          <View className="mt-2 w-full items-center">
            <Pressable
              className={`items-center self-stretch rounded-lg border py-3 ${countdown > 0 || isLoading ? 'border-gray-300 bg-gray-100' : 'border-blue-500 bg-white'}`}
              onPress={handleResend}
              disabled={countdown > 0 || isLoading}>
              <Text
                className={`text-base font-bold ${countdown > 0 || isLoading ? 'text-gray-400' : 'text-blue-600'}`}>
                {countdown > 0 ? `Resend in ${formatTime(countdown)}` : 'Resend OTP'}
              </Text>
            </Pressable>
          </View>

          <Pressable
            className="mt-4 items-center self-stretch rounded-lg border border-gray-300 bg-white py-3"
            onPress={() => router.back()}>
            <Text className="text-base font-bold text-black">Back to Sign In</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VerifyOTPPage;
