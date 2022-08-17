import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.realtime.share',
  appName: 'Real time share',
  webDir: 'build',
  bundledWebRuntime: false,
  android:{
    allowMixedContent: true
  }
};

export default config;
