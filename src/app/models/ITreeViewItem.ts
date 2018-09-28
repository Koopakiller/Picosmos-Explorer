export interface ITreeViewItem {
    imagePath: string;
    displayName: string;
    getChildren(): Promise<ITreeViewItem[]>;
    isExpanded: boolean;
    hasChildren: boolean;
}