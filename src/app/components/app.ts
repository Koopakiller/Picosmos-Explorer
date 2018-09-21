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
    console.log(`Navigate: ${fullPath}`);
    try {
      if (this._fileSystemService.hasContent(fullPath)) {
        this.currentPath = fullPath;
        this.load();
      }
      if (this._fileSystemService.isFile(fullPath)) {
        alert("Should open file, but is still a to do...");
      }
      else {
        alert("No known listable content!");
      }
    }
    catch (ex) {
      console.log({ msg: "An error occured while navigating", info: ex });
      alert("An error occured");
    }
  }

  isLoading: boolean;
  list: FileSystemEntryViewModel[];
  addressBarList: AddressBarEntryViewModel[];
  addressBarDataProvider: IAddressBarDataProvider = new UnixAddressBarDataProvider();

  private load() {
    this.isLoading = true;

    this.addressBarList = this.addressBarDataProvider.getParts(this.currentPath);

    this._fileSystemService.getContents(this.currentPath).then((result) => {
      this.list = result.map(fullPath => new FileSystemEntryViewModel(fullPath, this._fileSystemService));
      this.isLoading = false;
      console.log(this.list);
    });
  }
}


interface IAddressBarDataProvider {
  getParts(fullPath: string);
}

class UnixAddressBarDataProvider implements IAddressBarDataProvider {
  getParts(fullPath: string) {
    let result = [];

    let address = "";

    if (fullPath.startsWith("/")) {
      result.push(new AddressBarEntryViewModel("Root", "/"))
      address = "/";
    }

    fullPath = fullPath.replace(/\/$/, "").replace(/^\//, "");

    for (let part of fullPath.split("/")) {
      address = `${address}${part}/`;
      result.push(new AddressBarEntryViewModel(part, address))
    }

    return result;
  }
}