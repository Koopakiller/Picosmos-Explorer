import { FileSystemService } from "../services/FileSystemService";

export class FileSystemEntryViewModel {

  public constructor(
    public fullPath: string,
    protected _fileSystemService: FileSystemService) {
  }

  public getValue(key: string) {
    return this._fileSystemService.getProperty(this.fullPath, key);
  }

  public isSelected: boolean = false;
}
