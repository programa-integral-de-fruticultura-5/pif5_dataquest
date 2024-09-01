import { Injectable } from '@angular/core';
import {
  Filesystem,
  Directory,
  Encoding,
  WriteFileResult,
  ReaddirResult,
  PermissionStatus,
  CopyResult,
} from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root',
})
export class FilesystemService {


  constructor() { }

  public async createFolder(path: string): Promise<void> {
    const methodName = 'createFolder';
    try {
      const directoryExists = await this.checkFolderExists(path);

      if (directoryExists) {
        return;
      }

      await Filesystem.mkdir({
        path: path,
        directory: Directory.External,
        recursive: true,
      });
    } catch (error) {
    }
  }

  public async readFolder(path: string): Promise<ReaddirResult> {
    const methodName = 'readFolder';
    try {
      const result: ReaddirResult = await Filesystem.readdir({
        path: path,
        directory: Directory.External,
      });
      return result;
    } catch (error) {
      return { files: [] };
    }
  }

  public async checkFolderExists(path: string): Promise<boolean> {
    const methodName = 'checkFolderExists';
    try {
      const folder = await this.readFolder('/');
      const exists: boolean = folder.files.some((file) => file.name === path);
      return exists;
    } catch (error) {
      return false;
    }
  }

  public async writeFile(
    path: string,
    data: string,
    isBase64: boolean = false,
    directory: Directory = Directory.External
  ): Promise<void> {
    const methodName = 'writeFile';
    try {

      const permissionStatus: PermissionStatus = await this.checkPermissions();

      if (permissionStatus.publicStorage !== 'granted') {
        const permissionResult: PermissionStatus = await this.requestPermissions();
        if (permissionResult.publicStorage !== 'granted') {
          return;
        }
      }
      const writeFileResult: WriteFileResult = await Filesystem.writeFile({
        path: path,
        data: data,
        directory: directory,
        ...(!isBase64 && {
          encoding: Encoding.UTF8,
        }),
        recursive: true,
      });
    } catch (error) {
    }
  }

  private async checkPermissions(): Promise<PermissionStatus> {
    const methodName = 'checkPermissions';
    try {
      const permissionStatus = await Filesystem.checkPermissions();
      return permissionStatus;
    } catch (error) {
      return { publicStorage: 'denied' };
    }
  }

  private async requestPermissions(): Promise<PermissionStatus> {
    const methodName = 'requestPermissions';
    try {
      const permissionResult = await Filesystem.requestPermissions();
      return permissionResult;
    } catch (error) {
      return { publicStorage: 'denied' };
    }
  }

  public async copy(
    oldPath: string,
    newPath: string,
    useFullPath: boolean = false,
    fromDirectory: Directory = Directory.External,
    toDirectory: Directory = Directory.External
  ): Promise<string | undefined> {
    const methodName = 'copy';
    try {
      const copyResult: CopyResult = await Filesystem.copy({
        from: oldPath,
        to: newPath,
        ...(!useFullPath && {
          directory: fromDirectory
        }),
        toDirectory: toDirectory,
      });
      return copyResult.uri;
    } catch (error) {
      return undefined;
    }
  }

  public async readFileAsBase64(
    path: string,
  ): Promise<string | undefined> {
    const methodName = 'readFileAsBase64';
    try {
      const readFileResult = await Filesystem.readFile({
        path: path,
      });
      const fileResult: string = readFileResult.data as string;
      return fileResult;
    } catch (error) {
      return undefined;
    }
  }

  public async readFile (
    path: string,
    directory: Directory = Directory.External
  ): Promise<string | undefined> {
    const methodName = 'readFile';
    try {
      const readFileResult = await Filesystem.readFile({
        path: path,
        directory: directory,
        encoding: Encoding.UTF8,
      });
      const fileResult: string = readFileResult.data as string;
      return fileResult;
    } catch (error) {
      return undefined;
    }
  }
}
