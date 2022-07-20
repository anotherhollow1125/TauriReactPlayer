declare type FileEntry = {
    type: 'file';
    name: string;
    path: string;
    size: number;
};

declare type DirEntry = {
    type: 'dir';
    name: string;
    path: string;
}

declare type Entry = FileEntry | DirEntry;

declare type Entries = Array<Entry>;