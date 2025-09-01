import { View, Image, Text, ActivityIndicator } from 'react-native';
import { SplashLayout } from '@/components';
import { BRAND_LOGO } from '@/assets/images';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

const RootPage: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/auth/signin');
    }, 3000);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <SplashLayout>
      <View className="relative w-full flex-1 items-center justify-center">
        <View className="absolute left-0 top-0 h-full w-full bg-black/70" />
        <View className="mb-10 flex flex-col gap-y-2">
          <Image source={BRAND_LOGO} className="mb-10 h-72 w-72" />
          <View className="flex flex-row justify-center gap-x-2">
            <Text className="text-3xl font-bold text-blue-500">BRGY</Text>
            <Text className="text-3xl font-bold text-red-500">KONEK</Text>
          </View>
        </View>

        <ActivityIndicator color="#eee" />

        <Text className="absolute bottom-8 left-7 text-center font-medium text-gray-300">
          App Version 1.0.1 (BETA)
        </Text>
      </View>
    </SplashLayout>
  );
};

export default RootPage;
