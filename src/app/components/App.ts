import { Component, OnInit } from "@angular/core";
import { FileSystemService } from "../services/FileSystemService";
import { FileSystemEntryViewModel } from "../models/FileSystemEntryViewModel";
import { AddressBarEntryViewModel } from "../models/AddressBarEntryViewModel";
import { ExplorerStyleListSelector, IListSelector } from "../helper/ListSelector";
import { LeftViewItem } from "../models/LeftViewItem";
import { FileSystemLink } from "../models/FileSystemLink";

@Component({
  selector: "app-root",
  templateUrl: "./App.html",
  styleUrls: [
    "./App.less",
    "../styles/toolbar.less"
  ]
})
export class AppComponent implements OnInit {

  constructor(
    protected _fileSystemService: FileSystemService
  ) {
  }

  // Common
  public currentPath: string;
  public list: FileSystemEntryViewModel[];

  isLoading: boolean;

  // Angular Lifecycle 

  public ngOnInit() {
    let homePath = this._fileSystemService.getHomePath();
    this.load(homePath);

    this.leftViewItems = [
      new LeftViewItem("Favorites", [
        new FileSystemLink("Desktop", this._fileSystemService.combinePaths(homePath, "Desktop")),
        new FileSystemLink("Downloads", this._fileSystemService.combinePaths(homePath, "Downloads"))
      ])
    ];
  }

  // Key Management

  private _observedKeys = ["Shift", "Control"];
  private _pressedKeys: string[] = [];

  isKeyPressed(checkKey: string) {
    for (let key of this._pressedKeys) {
      if (key.startsWith(checkKey)) {
        return true;
      }
    }
    return false;
  }

  public keyDown($event) {
    if (this._observedKeys.indexOf($event.key) === -1) {
      return;
    }
    let code = $event.key + "." + $event.code;
    if (this._pressedKeys.indexOf(code) === -1) {
      this._pressedKeys.push(code);
    }
  }

  public keyUp($event) {
    if (this._observedKeys.indexOf($event.key) === -1) {
      return;
    }
    let code = $event.key + "." + $event.code;
    while (this._pressedKeys.indexOf(code) > -1) {
      this._pressedKeys.splice(this._pressedKeys.indexOf(code), 1);
    }
  }

  // Left View

  public leftViewItems: LeftViewItem[];

  // FileSystemEntry Selection

  private _listSelector: IListSelector<FileSystemEntryViewModel> = new ExplorerStyleListSelector<FileSystemEntryViewModel>();

  public select(entry: FileSystemEntryViewModel) {
    this._listSelector.processChange(this.list, entry, this.isKeyPressed("Shift"), this.isKeyPressed("Control"),
      item => item.isSelected = true, item => item.isSelected = false, item => item.isSelected)
  }

  // Navigation History

  public history: string[] = [];
  public historyPosition: number = -1;

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

  // Navigation

  public tryNavigateUp() {
    if (!this.currentPath) {
      return;
    }
    let parent = this._fileSystemService.getParent(this.currentPath);
    this.navigate(parent);
  }

  public get canNavigateUp() {
    if (!this.currentPath) {
      return false;
    }
    let parent = this._fileSystemService.getParent(this.currentPath);
    return parent !== null && parent != this.currentPath;
  }

  public navigate(fullPath) {
    console.log(`Navigate: ${fullPath}`);
    try {
      if (this._fileSystemService.hasContent(fullPath)) {
        this.load(fullPath);
      }
      else if (this._fileSystemService.isFile(fullPath)) {
        alert("Should open file, but is still a to do..."); // ToDo
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

  private load(fullPath: string) {
    this.isLoading = true;
    this._fileSystemService.getContents(fullPath).then((result) => {
      this.list = result.map(fullPath => new FileSystemEntryViewModel(fullPath, this._fileSystemService));

      let addressBarData = this._addressBarDataProvider.getParts(fullPath, this._addressBarPath);
      this.addressBarList = addressBarData.items;
      this._addressBarPath = addressBarData.path;

      if (this.history[this.historyPosition] != fullPath) {
        this.history.splice(this.historyPosition + 1);
        this.history.push(fullPath);
        this.historyPosition++;
      }

      this._listSelector.reset();

      this.currentPath = fullPath;
      this.isLoading = false;
    }).catch(reason => {
      console.log({ msg: "Error while loading content", info: reason });
      this.isLoading = false;
    });
  }

  // AddressBar

  private addressBarList: AddressBarEntryViewModel[];
  private _addressBarPath: string;
  private _addressBarDataProvider: IAddressBarDataProvider = new UnixAddressBarDataProvider();
}


interface IAddressBarDataProvider {
  getParts(fullPath: string, oldFullPath: string): { items: AddressBarEntryViewModel[], path: string };
}

class UnixAddressBarDataProvider implements IAddressBarDataProvider {
  getParts(fullPath: string, oldFullPath: string = null) {
    if (!fullPath.endsWith("/")) {
      fullPath = fullPath + "/";
    }

    let path = oldFullPath && oldFullPath.startsWith(fullPath) ? oldFullPath : fullPath;

    let result: AddressBarEntryViewModel[] = [];

    let address = "";

    if (path.startsWith("/")) {
      result.push(new AddressBarEntryViewModel("Root", "/"))
      address = "/";
    }

    path = path.replace(/\/$/, "").replace(/^\//, "");

    for (let part of path.split("/")) {
      address = `${address}${part}/`;
      result.push(new AddressBarEntryViewModel(part, address))
    }

    console.log({ result });
    result.filter(item => item.fullPath === fullPath)[0].isSelected = true;

    return { items: result, path: "/" + path };
  }
}