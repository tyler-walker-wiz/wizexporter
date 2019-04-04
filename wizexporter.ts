namespace WIZ.Services {
    export class ExporterService {
        constructor() { }
        /**
         * Creates word document from existing html
         * @param element
         * @param filename
         */
        toDoc(element: string, filename: string) {
            var html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' 
                            xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'></head>
                            <body>${document.getElementById(element).innerHTML}</body></html>`;
            var blob = new Blob(['\ufeff', html], {
                type: 'application/msword'
            });

            //Specify link url
            var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
            filename = filename ? filename + '.doc' : 'document.doc';
            //Create download link
            var downloadLink = document.createElement("a");
            document.body.appendChild(downloadLink);

            if (navigator.msSaveOrOpenBlob) {
                navigator.msSaveOrOpenBlob(blob, filename);
            } else {
                downloadLink.href = url;
                downloadLink.download = filename;
                //Trigger download
                downloadLink.click();
            }

            document.body.removeChild(downloadLink);
        }

        getPapaCsvFormat(data: Papa.ICSVData, options?: Papa.ICSVUnparseOptions) {
            return Papa.unparse(data, options);
        }

        downloadCsv(csvString: string, fileName?: string) {
            var a = document.createElement("a");

            if (window.navigator.msSaveOrOpenBlob) {
                var blob = new Blob([decodeURIComponent(encodeURI(csvString))], {
                    type: "text/csv;charset=utf-8;"
                });
                navigator.msSaveBlob(blob, fileName || 'sample.csv');
            } else {

                a.href = 'data:attachment/csv;charset=utf-8,' + encodeURI(csvString);
                a.target = '_blank';
                a.download = fileName || 'sample.csv';
                document.body.appendChild(a);
                a.click();
            }
        }

        csvInstance<T>(data?: Papa.ICSVData<T>): ICSVExport {
            return new CSVExport(this, data);
        }
    }
    export class CSVExport<TData = any> {
        static lineBreak = "\r\n";
        private _data: Papa.ICSVData;
        private _options: Papa.ICSVUnparseOptions;
        private _headers: string[] = [];
        constructor(private exporterService: IExporterService, data?: Papa.ICSVData<TData>) {
            if (data)
                this._data = data;
        }
        static addLineBreak(csv: string, breakOther?: string) {
            if (breakOther)
                csv += breakOther;
            else
                csv += this.lineBreak;
            return csv;
        }

        addLineBreak() {
            this.addData(CSVExport.lineBreak);
        }

        setOptions(options: Papa.ICSVUnparseOptions) {
            this._options = options;
            return this;
        }

        setData<T = any>(data: Papa.ICSVData<T>) {
            this._data = data;
            return this;
        }

        addData<T = any>(data: Papa.ICSVData<T>) {
            let arrData: any[] = data as T[];
            if (this._headers && this._headers.length)
                arrData = (this._data as { fields: string[], data: { [index: string]: string }[] }).data;
            if (typeof arrData === "object" && arrData.length) {
                (this._data as T[]).pushRange(arrData);
            }
            else if (typeof data === "string") {
                if (!this._data)
                    this.setData(data);
                else
                    this._data += data;
            }
        }

        setHeaderData(headers: string[], data?: { [index: string]: string }[]) {
            this._headers = headers;
            let newData = { fields: this._headers, data };
            this.setData(newData);
            return this;
        }

        private convertToCsv() {
            if (typeof this._data === "string") return this._data as string;
            let data: any = this._data;
            if (angular && angular.toJson)
                data = angular.toJson(this._data);
            return this.exporterService.getPapaCsvFormat(data, this._options);
        }

        get csv() {
            return this.convertToCsv();
        }

        private get data() {
            return this._data;
        }

        download(name: string, csv?: string) {
            if (csv)
                this.exporterService.downloadCsv(csv, name);
            else this.exporterService.downloadCsv(this.csv, name);
        }
    }
    export interface IExporterService extends ExporterService { }
    export interface ICSVExport extends CSVExport { }
}