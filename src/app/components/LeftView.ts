import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { FileSystemService } from "../services/FileSystemService";
import { FileSystemEntryViewModel } from "../models/FileSystemEntryViewModel"
import { LeftViewItem } from "../models/LeftViewItem";
import { FileSystemLink } from "../models/FileSystemLink";

@Component({
  selector: "left-view",
  templateUrl: "./LeftView.html",
  styleUrls: ["./LeftView.less"]
})
export class LeftViewComponent implements OnInit {

  public constructor(
  ) {
  }

  @Output() public shouldNavigate: EventEmitter<string> = new EventEmitter();

  @Input() public items: LeftViewItem[];


  public ngOnInit() {
  }

  public navigate(entry: FileSystemLink) {
    this.shouldNavigate.emit(entry.fullPath);
  }
}
