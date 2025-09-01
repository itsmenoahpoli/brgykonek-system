import React from 'react';
import { View, ImageBackground } from 'react-native';
import { SPLASH_BG } from '@/assets/images';

type Props = {
  children: React.ReactNode;
};

export const SplashLayout: React.FC<Props> = (props) => {
  return (
    <ImageBackground source={SPLASH_BG} className="flex-1">
      <View className="flex-1 items-center justify-center">{props.children}</View>
    </ImageBackground>
  );
};
