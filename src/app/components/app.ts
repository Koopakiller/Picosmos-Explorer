import { Component, OnInit } from "@angular/core";
import { FileSystemService } from "../services/FileSystemService";
import { FileSystemEntryViewModel } from "../models/FileSystemEntryViewModel";
import { AddressBarEntryViewModel } from "../models/AddressBarEntryViewModel";

@Component({
  selector: "app-root",
  templateUrl: "./app.html",
  styleUrls: ["./app.less"]
})
export class AppComponent implements OnInit {

  constructor(
    protected _fileSystemService: FileSystemService
  ) {
  }

  public ngOnInit() {
    this.load();
  }

  public currentPath: string = "/home/tl/";

  public navigate(fullPath) {
    this.currentPath = fullPath;
    this.load();
  }

  isLoading: boolean;
  list: FileSystemEntryViewModel[];
  addressBarList: AddressBarEntryViewModel[];

  private load() {
    this.isLoading = true;

    this.addressBarList = [];
    let address = "";
    for (let part of this.currentPath.split("/")) {
      address = `${address}${part}/`;
      this.addressBarList.push(new AddressBarEntryViewModel(part, address))
    }

    this._fileSystemService.getContents(this.currentPath).then((result) => {
      this.list = result.map(fullPath => new FileSystemEntryViewModel(fullPath, this._fileSystemService));
      this.isLoading = false;
      console.log(this.list);
    });
  }
}
