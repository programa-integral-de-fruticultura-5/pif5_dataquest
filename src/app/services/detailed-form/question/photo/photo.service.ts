import { Injectable } from '@angular/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import {
  Filesystem,
  Directory,
  ReaddirResult,
  FileInfo,
} from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { FormDetail } from '@models/FormDetail.namespace';
import { FilesystemService } from '@services/filesystem/filesystem.service';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  constructor(private filesystemService: FilesystemService) {}

  public async takePhoto(): Promise<Photo> {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 30,
    });

    return capturedPhoto;
  }

  public async savePhoto(
    path: string,
    base64Photo: string
  ): Promise<void> {
    await this.filesystemService.writeFile(path, base64Photo);
  }

  public async readPhoto(photoPath: string): Promise<string | undefined> {
    const photoAsBase64: string | undefined =
      await this.filesystemService.readFileAsBase64(photoPath);
    return photoAsBase64;
  }

  public async getPhotoAbsolutePath(
    folderPath: string,
    photoName: string
  ): Promise<string | undefined> {
    const result: ReaddirResult = await this.filesystemService.readFolder(
      folderPath
    );
    const file: FileInfo | undefined = result.files.find(
      (file) => file.name === photoName
    );
    if (file) {
      return file.uri;
    }
    return undefined;
  }
}
