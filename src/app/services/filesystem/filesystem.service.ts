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
import { Logger, LoggingService } from 'ionic-logging-service';

@Injectable({
  providedIn: 'root',
})
export class FilesystemService {

  private logger: Logger;

  constructor(private loggingService: LoggingService) {
    this.logger = this.loggingService.getLogger("FilesystemService");
    this.logger.entry('constructor');
  }

  public async createFolder(path: string): Promise<void> {
    const methodName = 'createFolder';
    this.logger.entry(methodName, path);
    try {
      const directoryExists = await this.checkFolderExists(path);

      if (directoryExists) {
        this.logger.warn(methodName, `${path} folder already exists`);
        this.logger.exit(methodName);
        return;
      }

      this.logger.trace(`Creating ${path} folder`);
      await Filesystem.mkdir({
        path: path,
        directory: Directory.External,
        recursive: true,
      });
      this.logger.exit(methodName, path);
    } catch (error) {
      this.logger.error(methodName, 'Error creating surveys folder', error);
      this.logger.exit(methodName);
    }
  }

  public async readFolder(path: string): Promise<ReaddirResult> {
    const methodName = 'readFolder';
    this.logger.entry(methodName, path);
    try {
      this.logger.trace(`Reading ${path} folder`);
      const result: ReaddirResult = await Filesystem.readdir({
        path: path,
        directory: Directory.External,
      });
      this.logger.exit(methodName, `${path} folder read`, result);
      return result;
    } catch (error) {
      this.logger.error(methodName, 'Error reading surveys folder', error);
      this.logger.exit(methodName, { files: [] });
      return { files: [] };
    }
  }

  public async checkFolderExists(path: string): Promise<boolean> {
    const methodName = 'checkFolderExists';
    this.logger.entry(methodName, path);
    try {
      const folder = await this.readFolder('/');
      const exists: boolean = folder.files.some((file) => file.name === path);
      this.logger.exit(methodName, `${path} folder exists`, exists);
      return exists;
    } catch (error) {
      this.logger.error(methodName, 'Error checking if folder exists', error);
      this.logger.exit(methodName, false);
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
    this.logger.entry(methodName, path, data, isBase64, directory);
    try {
      this.logger.trace(methodName, `Saving file in ${path}`);

      const permissionStatus: PermissionStatus = await this.checkPermissions();

      if (permissionStatus.publicStorage !== 'granted') {
        const permissionResult: PermissionStatus = await this.requestPermissions();
        if (permissionResult.publicStorage !== 'granted') {
          this.logger.warn(methodName, 'Permission not granted');
          this.logger.exit(methodName);
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
      this.logger.info(methodName, 'File written in ', writeFileResult.uri);
      this.logger.exit(methodName);
    } catch (error) {
      this.logger.error(methodName, 'Error saving survey in file', error);
      this.logger.exit(methodName);
    }
  }

  private async checkPermissions(): Promise<PermissionStatus> {
    const methodName = 'checkPermissions';
    this.logger.entry(methodName);
    try {
      const permissionStatus = await Filesystem.checkPermissions();
      this.logger.exit(methodName, 'Permission status: ', permissionStatus);
      return permissionStatus;
    } catch (error) {
      this.logger.error(methodName, 'Error checking permissions', error);
      this.logger.exit(methodName, { publicStorage: 'denied' });
      return { publicStorage: 'denied' };
    }
  }

  private async requestPermissions(): Promise<PermissionStatus> {
    const methodName = 'requestPermissions';
    this.logger.entry(methodName);
    try {
      const permissionResult = await Filesystem.requestPermissions();
      this.logger.exit(methodName, 'Permission result: ', permissionResult);
      return permissionResult;
    } catch (error) {
      this.logger.error(methodName, 'Error requesting permissions', error);
      this.logger.exit(methodName, { publicStorage: 'denied' });
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
    this.logger.entry(methodName, oldPath, newPath, useFullPath, fromDirectory, toDirectory);
    try {
      this.logger.info(`Copying file from ${oldPath} to ${newPath}`);
      const copyResult: CopyResult = await Filesystem.copy({
        from: oldPath,
        to: newPath,
        ...(!useFullPath && {
          directory: fromDirectory
        }),
        toDirectory: toDirectory,
      });
      this.logger.exit(methodName, 'File copied', copyResult.uri);
      return copyResult.uri;
    } catch (error) {
      this.logger.error(methodName, 'Error copying file', error);
      return undefined;
    }
  }

  public async readFileAsBase64(
    path: string,
  ): Promise<string | undefined> {
    const methodName = 'readFileAsBase64';
    this.logger.entry(methodName, path);
    try {
      this.logger.info(`Reading file from ${path}`);
      const readFileResult = await Filesystem.readFile({
        path: path,
      });
      const fileResult: string = readFileResult.data as string;
      this.logger.exit(methodName, 'File read', fileResult);
      return fileResult;
    } catch (error) {
      this.logger.error(methodName, 'Error reading file', error);
      return undefined;
    }
  }

  public async readFile (
    path: string,
    directory: Directory = Directory.External
  ): Promise<string | undefined> {
    const methodName = 'readFile';
    this.logger.entry(methodName, path, directory);
    try {
      this.logger.info(`Reading file from ${path}`);
      const readFileResult = await Filesystem.readFile({
        path: path,
        directory: directory,
        encoding: Encoding.UTF8,
      });
      const fileResult: string = readFileResult.data as string;
      this.logger.exit(methodName, 'File read', fileResult);
      return fileResult;
    } catch (error) {
      this.logger.error(methodName, 'Error reading file', error);
      return undefined;
    }
  }
}
