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
  isLoading: boolean = true;

  public ngOnInit() {
    this._fileSystemService.getContents("/home/tl/").then((result) => {
      this.files = result.map(fullPath => new ListEntryViewModel(fullPath, this._fileSystemService));
      this.isLoading=false;
    });
  }

  public navigate(entry:ListEntryViewModel){
    this.isLoading=true;
    this._fileSystemService.getContents(entry.fullPath).then((result) => {
      this.files = result.map(fullPath => new ListEntryViewModel(fullPath, this._fileSystemService));
      this.isLoading=false;
    });
  }
}

class ListEntryViewModel {

  public constructor(
    public fullPath: string,
    protected _fileSystemService: FileSystemService) {
  }

  public getValue(key: string) {
    return this._fileSystemService.getProperty(this.fullPath, key);
  }
}
