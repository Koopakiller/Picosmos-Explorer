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
    if (this._fileSystemService.hasContent(fullPath)) {
      this.currentPath = fullPath;
      this.load();
    }
    else {
      alert("No known listable content!");
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

    if(fullPath.startsWith("/")){
      result.push(new AddressBarEntryViewModel("Root", "/"))
      address = "/";
    }

    fullPath = fullPath.replace(/\/$|^\//, "");

    for (let part of fullPath.split("/")) {
      address = `${address}${part}/`;
      result.push(new AddressBarEntryViewModel(part, address))
    }

    return result;
  }
}