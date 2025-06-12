import * as XLSX from 'xlsx';

export function converToExcel(data: any, docName: any): void {
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data)
  const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']}
  XLSX.writeFile(workbook, docName + '.xlsx')
}


export function converToExcelTittle(titleDoc: any, data: any, docName: any){
  const title = [[titleDoc]]; //fila 1
  const headers = [Object.keys(data[0])]; // fila 2: encabezados
  const rows = data.map(Object.values); // resto de filas

  const fullData = [...title, ...headers, ...rows];

  const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(fullData);
  const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };

  XLSX.writeFile(workbook, docName + '.xlsx');
}
