import { Injectable } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { NativeSettings, AndroidSettings } from 'capacitor-native-settings';

@Injectable({
  providedIn: 'root',
})
export class LocationService {

  async getCurrentLocation(): Promise<Position | undefined> {
    try {
      const permissionStatus = await Geolocation.checkPermissions();
      console.log('Permission status: ', permissionStatus);

      if (permissionStatus.location !== 'granted') {
        const permissionResult = await Geolocation.requestPermissions();
        console.log('Permission result: ', permissionResult);
        if (permissionResult.location !== 'granted') {
          await this.openSettings(true);
          return this.getCurrentLocation();
        }
      }

      let options: PositionOptions = {
        maximumAge: 3000,
        timeout: 30000,
        enableHighAccuracy: true,
      };
      const position: Position = await Geolocation.getCurrentPosition(options);
      console.log(position);
      return position;
    } catch (error: any) {
      console.error('Error getting location', error);
      if (error?.message == 'Location services are not enabled') {
        await this.openSettings();
        return this.getCurrentLocation();
      }
      return undefined;
    }
  }

  async openSettings(app = false) {
    console.log('open settings...');
    return NativeSettings.openAndroid({
      option: app
        ? AndroidSettings.ApplicationDetails
        : AndroidSettings.Location,
    });
  }
}
