import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { FileSystemService } from "../services/FileSystemService";
import { FileSystemEntryViewModel } from "../models/FileSystemEntryViewModel"
import { ITreeViewItem } from "../models/ITreeViewItem";

@Component({
  selector: "tree-view",
  templateUrl: "./tree-view.html",
  styleUrls: ["./tree-view.less"]
})
export class TreeViewComponent implements OnInit {

  public constructor(
  ) {
  }

  private _roots: ITreeViewItem[];
  @Input() public set roots(value) {
    this._roots = value;
    console.log("Set treeView.roots=", this._roots);
  }
  public get roots() {
    return this._roots;
  }

  public ngOnInit() {
  }

  public toggleIsExpanded(item: ITreeViewItem) {
    item.isExpanded = !item.isExpanded;
    console.log(`Changed isExapnded state of ${item.displayName} to ${item.isExpanded}`);
  }
}
