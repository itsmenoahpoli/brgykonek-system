import '@/global.css';

import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/utils/toast';

export default function Layout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <Toast config={toastConfig} />
    </>
  );
}
