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
    this.load("/home/tl/");
  }

  public currentPath: string;
  public history: string[] = [];
  public historyPosition: number = -1;

  public select(entry: FileSystemEntryViewModel) {
    entry.isSelected = !entry.isSelected;
  }

  public get canNavigateToPrevious() {
    return this.historyPosition > 0;
  }

  public get canNavigateToNext() {
    return this.historyPosition < this.history.length - 1;
  }

  public tryNavigateToPrevious() {
    if (this.canNavigateToPrevious) {
      this.load(this.history[--this.historyPosition]);
    }
  }

  public tryNavigateToNext() {
    if (this.canNavigateToNext) {
      this.load(this.history[++this.historyPosition]);
    }
  }

  public navigate(fullPath) {
    console.log(`Navigate: ${fullPath}`);
    try {
      if (this._fileSystemService.hasContent(fullPath)) {
        this.load(fullPath);
      }
      else if (this._fileSystemService.isFile(fullPath)) {
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

  private load(fullPath: string) {
    this.isLoading = true;
    this._fileSystemService.getContents(fullPath).then((result) => {
      this.list = result.map(fullPath => new FileSystemEntryViewModel(fullPath, this._fileSystemService));
      this.addressBarList = this.addressBarDataProvider.getParts(fullPath);

      if (this.history[this.historyPosition] != fullPath) {
        this.history.splice(this.historyPosition + 1);
        this.history.push(fullPath);
        this.historyPosition++;
      }

      this.currentPath = fullPath;
      this.isLoading = false;
    }).catch(reason => {
      console.log({ msg: "Error while loading content", info: reason });
      this.isLoading = false;
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