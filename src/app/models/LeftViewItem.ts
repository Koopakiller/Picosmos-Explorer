import { FileSystemLink } from "./FileSystemLink";

export class LeftViewItem {
    constructor(
        public displayName: string,
        public links: FileSystemLink[]
    ) {
    }
}
