declare interface Array<T> {
    pushRange: (array: T[]) => void;
    inArray: (key: string, value: any) => boolean;
}