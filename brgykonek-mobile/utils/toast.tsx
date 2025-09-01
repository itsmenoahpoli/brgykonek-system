import { BaseToast, ErrorToast } from 'react-native-toast-message';

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#10B981', backgroundColor: '#D1FAE5' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#065F46',
      }}
      text2Style={{
        fontSize: 14,
        color: '#065F46',
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: '#EF4444', backgroundColor: '#FEE2E2' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#DC2626',
      }}
      text2Style={{
        fontSize: 14,
        color: '#DC2626',
      }}
    />
  ),
  warning: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#F59E0B', backgroundColor: '#FEF3C7' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#92400E',
      }}
      text2Style={{
        fontSize: 14,
        color: '#92400E',
      }}
    />
  ),
  info: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#3B82F6', backgroundColor: '#DBEAFE' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#1E40AF',
      }}
      text2Style={{
        fontSize: 14,
        color: '#1E40AF',
      }}
    />
  ),
};
