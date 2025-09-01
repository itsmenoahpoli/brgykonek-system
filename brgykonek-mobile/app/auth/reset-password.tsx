import { View, Text, TextInput, Image, Pressable } from 'react-native';
import { useState } from 'react';
import { BRAND_LOGO } from '@/assets/images';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import authService from '../../services/auth.service';

const ResetPasswordPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const password = watch('password');

  const onSubmit = async (data: any) => {
    if (!email) {
      console.log('Email is missing from params');
      return;
    }

    setIsLoading(true);
    try {
      console.log(
        'Submitting reset password with email:',
        email,
        'password length:',
        data.password.length
      );
      await authService.resetPassword(email, data.password);
      router.push('/auth/signin');
    } catch (error: any) {
      console.log('Reset password error:', error);
      if (error?.message) {
        console.log('Error message:', error.message);
      }
      if (error?.originalError?.response?.data) {
        console.log('Server validation errors:', error.originalError.response.data);
      }
    } finally {
      setIsLoading(false);
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
          <Text className="mb-4 text-center text-xl font-bold text-gray-800">Reset Password</Text>

          <Text className="mb-6 text-center text-sm leading-5 text-gray-600">
            Enter your new password below. Make sure it's secure and easy to remember.
          </Text>

          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message:
                  'Password must contain at least one uppercase letter, one lowercase letter, and one number',
              },
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="New Password"
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

          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: 'Please confirm your password',
              validate: (value) => value === password || 'Passwords do not match',
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Confirm New Password"
                  secureTextEntry
                  className={`mb-1 self-stretch rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} bg-gray-50 p-3 text-base`}
                  placeholderTextColor="#9ca3af"
                />
                {errors.confirmPassword && (
                  <Text className="mb-3 self-stretch text-xs text-red-600">
                    {errors.confirmPassword.message as string}
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
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Text>
          </Pressable>

          <Pressable
            className="mt-4 items-center self-stretch rounded-lg border border-gray-300 bg-white py-3"
            onPress={() => router.push('/auth/signin')}>
            <Text className="text-base font-bold text-black">Back to Sign In</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ResetPasswordPage;
