import { Injectable } from '@angular/core';
import {
  Filesystem,
  Directory,
  Encoding,
  WriteFileResult,
  ReaddirResult,
  PermissionStatus,
} from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root',
})
export class FilesystemService {
  constructor() {}

  public async createFolder(path: string): Promise<void> {
    try {
      const directoryExists = await this.checkFolderExists(path);

      if (directoryExists) {
        console.log(`${path} folder already exists`);
        return;
      }

      console.log(`Creating ${path} folder`);
      await Filesystem.mkdir({
        path: path,
        directory: Directory.External,
        recursive: true,
      });
      console.log(`${path} folder created`);
    } catch (error) {
      console.error('Error creating surveys folder', error);
    }
  }

  public async readFolder(path: string): Promise<ReaddirResult> {
    try {
      console.log(`Reading ${path} folder`);
      const result: ReaddirResult = await Filesystem.readdir({
        path: path,
        directory: Directory.External,
      });
      console.log(`${path} folder read`, result);
      return result;
    } catch (error) {
      console.error('Error reading surveys folder', error);
      return { files: [] };
    }
  }

  public async checkFolderExists(path: string): Promise<boolean> {
    try {
      const folder = await this.readFolder('/');

      return folder.files.some((file) => file.name === path);
    } catch (error) {
      console.error('Error checking if folder exists', error);
      return false;
    }
  }

  public async writeFile(
    path: string,
    data: string,
    directory: Directory = Directory.External
  ): Promise<void> {
    try {
      console.log(`Saving file in ${path}`);

      const permissionStatus: PermissionStatus = await this.checkPermissions();

      if (permissionStatus.publicStorage !== 'granted') {
        const permissionResult: PermissionStatus = await this.requestPermissions();
        if (permissionResult.publicStorage !== 'granted') {
          console.error('Permission not granted');
          console.log('Error saving in file');
          return;
        }
      }
      const writeFileResult: WriteFileResult = await Filesystem.writeFile({
        path: path,
        data: data,
        directory: directory,
        encoding: Encoding.UTF8,
        recursive: true,
      });
      console.log('File written in ', writeFileResult.uri);
    } catch (error) {
      console.error('Error saving survey in file', error);
    }
  }

  private async checkPermissions(): Promise<PermissionStatus> {
    try {
      const permissionStatus = await Filesystem.checkPermissions();
      console.log('Permission status: ', permissionStatus);
      return permissionStatus;
    } catch (error) {
      console.error('Error checking permissions', error);
      return { publicStorage: 'denied' };
    }
  }

  private async requestPermissions(): Promise<PermissionStatus> {
    try {
      const permissionResult = await Filesystem.requestPermissions();
      console.log('Permission result: ', permissionResult);
      return permissionResult;
    } catch (error) {
      console.error('Error requesting permissions', error);
      return { publicStorage: 'denied' };
    }
  }
}
