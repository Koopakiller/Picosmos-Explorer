import { Component, OnInit } from "@angular/core";
import { FileSystemService } from "./services/FileSystemService";
import { FileSystemEntryViewModel } from "./models/FileSystemEntryViewModel";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.less"]
})
export class AppComponent implements OnInit {

  constructor(
    protected _fileSystemService: FileSystemService
  ) {
  }

  public ngOnInit() {
    this.loadList();
  }

  public currentPath: string = "/home/tl/";

  public navigate(fullPath) {
    this.currentPath = fullPath;
    this.loadList();
  }

  isLoading: boolean;
  list: FileSystemEntryViewModel[];

  private loadList() {
    this.isLoading = true;
    this._fileSystemService.getContents(this.currentPath).then((result) => {
      this.list = result.map(fullPath => new FileSystemEntryViewModel(fullPath, this._fileSystemService));
      this.isLoading = false;
      console.log(this.list);
    });
  }
}
