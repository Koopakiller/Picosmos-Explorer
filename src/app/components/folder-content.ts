import { Component, OnInit } from '@angular/core';
import { FileSystemService } from '../services/FileSystemService';

@Component({
  selector: 'folder-content',
  templateUrl: './folder-content.html',
  styleUrls: ['./folder-content.less']
})
export class FolderContentComponent implements OnInit {

  public constructor(
    protected _fileSystemService: FileSystemService
  ) {
  }

  files: ListEntryViewModel[];

  public ngOnInit() {
    this._fileSystemService.getContents("/home/tl/").then((result) => {
      console.log(result);
      this.files = result.map(fullPath => new ListEntryViewModel(fullPath, this._fileSystemService));
    });
  }

}

class ListEntryViewModel {

  public constructor(
    protected _fullPath: string,
    protected _fileSystemService: FileSystemService) {
  }

  public getValue(key: string) {
    return this._fileSystemService.getProperty(this._fullPath, key);
  }
}
