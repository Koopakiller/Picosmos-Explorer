import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { FileSystemService } from "../services/FileSystemService";
import { FileSystemEntryViewModel } from "../models/FileSystemEntryViewModel"

@Component({
  selector: "folder-content",
  templateUrl: "./folder-content.html",
  styleUrls: ["./folder-content.less"]
})
export class FolderContentComponent implements OnInit {

  public constructor(
  ) {
  }

  @Output() public shouldNavigate: EventEmitter<string> = new EventEmitter();
  @Output() public shouldSelect: EventEmitter<FileSystemEntryViewModel> = new EventEmitter();

  @Input() public list: FileSystemEntryViewModel;


  public ngOnInit() {
  }

  public navigate(entry: FileSystemEntryViewModel) {
    this.shouldNavigate.emit(entry.fullPath);
  }

  public select(entry: FileSystemEntryViewModel) {
    this.shouldSelect.emit(entry);
  }
}
