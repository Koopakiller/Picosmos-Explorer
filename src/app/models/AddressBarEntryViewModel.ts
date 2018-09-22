export class AddressBarEntryViewModel {

  public constructor(
    public displayName: string,
    public fullPath: string
  ) {
  }

  public isSelected: boolean = false;
}
