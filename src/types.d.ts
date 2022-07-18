declare type Entry = {
    type: 'dir' | 'file';
    name: string;
    path: string;
};

declare type Entries = Array<Entry>;