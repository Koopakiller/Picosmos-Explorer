import { Component, Output, Input, EventEmitter, OnInit } from "@angular/core";
import { AddressBarEntryViewModel } from "../models/AddressBarEntryViewModel";

@Component({
  selector: "address-bar",
  templateUrl: "./address-bar.html",
  styleUrls: ["./address-bar.less"]
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

  public navigate(id: string) {
    this.shouldNavigate.emit(id);
  }
}
