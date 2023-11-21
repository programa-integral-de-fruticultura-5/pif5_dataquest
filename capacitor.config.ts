import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.blaucastmedia.dataquest.app',
  appName: 'Dataquest',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      launchFadeOutDuration: 1000,
      androidScaleType: "CENTER",
    },
  },
  android: {
      buildOptions: {
        keystorePath: 'c:\Projects\dataquest-keystore.jks',
        keystoreAlias: 'dataquest',
      }
  }
  };

export default config;
