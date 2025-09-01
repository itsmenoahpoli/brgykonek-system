import { View, Text, TextInput, Image, Pressable } from 'react-native';
import { useState } from 'react';
import { BRAND_LOGO } from '@/assets/images';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import authService from '../../services/auth.service';

const ForgotPasswordPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: '',
    },
    mode: 'onTouched',
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email, router);
    } catch (error) {
      console.log(error);
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
          <Text className="mb-4 text-center text-xl font-bold text-gray-800">Forgot Password</Text>

          <Text className="mb-6 text-center text-sm leading-5 text-gray-600">
            Enter your registered email address below. We'll send you a password reset link that
            will allow you to create a new password for your account.
          </Text>

          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email Address is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address',
              },
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter your email address"
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

          <Pressable
            className={`mt-4 items-center self-stretch rounded-lg py-3 ${isLoading ? 'bg-gray-400' : 'bg-[#333]'}`}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}>
            <Text className="text-base font-bold text-white">
              {isLoading ? 'Sending...' : 'Send One-Time-Passcode'}
            </Text>
          </Pressable>

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

export default ForgotPasswordPage;
