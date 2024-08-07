import * as XLSX from 'xlsx';

interface Transaction {
  title: string;
  date: string;
  description: string;
  amount: number;
}

const exportToExcel = (transactions: Transaction[], filename: string) => {
  const worksheet = XLSX.utils.json_to_sheet(transactions);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
  XLSX.writeFile(workbook, filename);
};



export  default exportToExcel ;
