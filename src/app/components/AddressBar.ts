import { Component, Output, Input, EventEmitter, OnInit } from "@angular/core";
import { AddressBarEntryViewModel } from "../models/AddressBarEntryViewModel";

@Component({
  selector: "address-bar",
  templateUrl: "./AddressBar.html",
  styleUrls: ["./AddressBar.less"]
})
export class AddressBarComponent implements OnInit {

  public constructor(
  ) {
  }

  @Output() public shouldNavigate: EventEmitter<string> = new EventEmitter();

  @Input() public list: AddressBarEntryViewModel;
  @Input() public listSeparator: string;


  public ngOnInit() {
  }

  public navigate(fullPath: string) {
    this.shouldNavigate.emit(fullPath);
  }
}