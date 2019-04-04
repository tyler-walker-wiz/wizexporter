declare var Papa: Papa.PapaStatic;

declare module Papa {
    export interface PapaStatic {
        unparse: (data: ICSVData, config?: ICSVUnparseOptions) => string;
        parse: <T>(data: string, config?: ICSVParseOptions) => IParseResult<T>;
    }

    export interface IParseResult<T> {
        data: T[];
        errors: IParseError[];
        meta: IParseMeta;
    }

    export interface IParseError {
        type: string;
        code: string;
        message: string;
        row: number; //default: 0
    }

    export interface IParseMeta {
        delimiter: string;
        linkbreak: string;
        aborted: boolean;
        fields: string[];
        truncated: boolean;
    }

    export type ICSVData<T = any> = string | T[] | { fields: string[], data: { [index: string]: string }[] | string };

    export interface ICSVUnparseOptions {
        quotes?: boolean; //default: false //or array of booleans
        quoteChar?: string; //default: '"'
        escapeChar?: string; //default: '"'
        delimiter?: string; //default: ","
        header?: boolean; //default: true,
        newline?: string; //default: "\r\n",
        skipEmptyLines?: boolean; //default: false //or 'greedy',
        columns?: string[]; //default: null //or array of strings
    }

    export interface ICSVParseOptions {
        delimiter?: string; //default: ""	// auto-detect
        newline?: string; //default: ""	// auto-detect
        quoteChar?: string; //default: '"'
        escapeChar?: string; //default: '"'
        header?: boolean; //default: false
        transformHeader?: string; //default: undefined
        dynamicTyping?: boolean; //default: false
        preview?: number; //default: 0
        encoding?: string; //default: ""
        worker?: boolean; //default: false
        comments?: boolean; //default: false
        step?: (results: { data: string, errors: string }, parser) => void; //default: undefined
        complete?: (results: { data: string, errors: string }, file) => void; //default: undefined
        error?: (error: string, file) => void; //default: undefined
        download?: boolean; //default: false
        downloadRequestHeaders?: { [index: string]: string }; //default: undefined
        skipEmptyLines?: boolean; //default: false
        chunk?: (results: { data: string, errors: string }, parser) => void; //default: undefined
        fastMode?: boolean; //default: undefined
        beforeFirstChunk?: (chunk) => any; //default: undefined
        withCredentials?: boolean; //default: undefined
        transform?: (value, i) => any; //default: undefined
        delimitersToGuess?: string[]; //default: [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP]
    }
}