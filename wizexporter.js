var WIZ;
(function (WIZ) {
    var Services;
    (function (Services) {
        class ExporterService {
            constructor() { }
            /**
             * Creates word document from existing html
             * @param element
             * @param filename
             */
            toDoc(element, filename) {
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
                }
                else {
                    downloadLink.href = url;
                    downloadLink.download = filename;
                    //Trigger download
                    downloadLink.click();
                }
                document.body.removeChild(downloadLink);
            }
            getPapaCsvFormat(data, options) {
                return Papa.unparse(data, options);
            }
            downloadCsv(csvString, fileName) {
                var a = document.createElement("a");
                if (window.navigator.msSaveOrOpenBlob) {
                    var blob = new Blob([decodeURIComponent(encodeURI(csvString))], {
                        type: "text/csv;charset=utf-8;"
                    });
                    navigator.msSaveBlob(blob, fileName || 'sample.csv');
                }
                else {
                    a.href = 'data:attachment/csv;charset=utf-8,' + encodeURI(csvString);
                    a.target = '_blank';
                    a.download = fileName || 'sample.csv';
                    document.body.appendChild(a);
                    a.click();
                }
            }
            csvInstance(data) {
                return new CSVExport(this, data);
            }
        }
        Services.ExporterService = ExporterService;
        class CSVExport {
            constructor(exporterService, data) {
                this.exporterService = exporterService;
                this._headers = [];
                if (data)
                    this._data = data;
            }
            static addLineBreak(csv, breakOther) {
                if (breakOther)
                    csv += breakOther;
                else
                    csv += this.lineBreak;
                return csv;
            }
            addLineBreak() {
                this.addData(CSVExport.lineBreak);
            }
            setOptions(options) {
                this._options = options;
                return this;
            }
            setData(data) {
                this._data = data;
                return this;
            }
            addData(data) {
                let arrData = data;
                if (this._headers && this._headers.length)
                    arrData = this._data.data;
                if (typeof arrData === "object" && arrData.length) {
                    this._data.pushRange(arrData);
                }
                else if (typeof data === "string") {
                    if (!this._data)
                        this.setData(data);
                    else
                        this._data += data;
                }
            }
            setHeaderData(headers, data) {
                this._headers = headers;
                let newData = { fields: this._headers, data };
                this.setData(newData);
                return this;
            }
            convertToCsv() {
                if (typeof this._data === "string")
                    return this._data;
                let data = this._data;
                if (angular && angular.toJson)
                    data = angular.toJson(this._data);
                return this.exporterService.getPapaCsvFormat(data, this._options);
            }
            get csv() {
                return this.convertToCsv();
            }
            get data() {
                return this._data;
            }
            download(name, csv) {
                if (csv)
                    this.exporterService.downloadCsv(csv, name);
                else
                    this.exporterService.downloadCsv(this.csv, name);
            }
        }
        CSVExport.lineBreak = "\r\n";
        Services.CSVExport = CSVExport;
    })(Services = WIZ.Services || (WIZ.Services = {}));
})(WIZ || (WIZ = {}));
//# sourceMappingURL=wizexporter.js.map