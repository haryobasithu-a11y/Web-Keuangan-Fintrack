import { strToU8, zipSync } from 'fflate';

const transactionHeaders = ['Tanggal', 'Deskripsi', 'Kategori', 'Tipe', 'Nominal (IDR)'];
const summaryHeaders = ['Ringkasan', 'Nilai'];

function toExcelColumn(index) {
  let column = '';
  let remaining = index;
  while (remaining > 0) {
    const digit = (remaining - 1) % 26;
    column = String.fromCharCode(65 + digit) + column;
    remaining = Math.floor((remaining - 1) / 26);
  }
  return column;
}

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getExcelDateSerial(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value));
  if (!match) return null;

  const [, year, month, day] = match;
  const timestamp = Date.UTC(Number(year), Number(month) - 1, Number(day));
  const date = new Date(timestamp);
  if (
    date.getUTCFullYear() !== Number(year)
    || date.getUTCMonth() !== Number(month) - 1
    || date.getUTCDate() !== Number(day)
  ) {
    return null;
  }
  return timestamp / 86400000 + 25569;
}

function createWorksheetXml(rows, { columnWidths, tableId, styleForCell }) {
  const worksheetRows = rows.map((row, rowIndex) => {
    const rowNumber = rowIndex + 1;
    const cells = row.map((value, columnIndex) => {
      const address = `${toExcelColumn(columnIndex + 1)}${rowNumber}`;
      const styleId = rowIndex > 0 ? styleForCell?.(rowIndex, columnIndex) : undefined;
      const styleAttribute = styleId ? ` s="${styleId}"` : '';
      if (columnIndex === 0 && rowIndex > 0) {
        const dateSerial = getExcelDateSerial(value);
        if (dateSerial !== null) {
          return `<c r="${address}"${styleAttribute} t="n"><v>${dateSerial}</v></c>`;
        }
      }
      if (typeof value === 'number' && Number.isFinite(value)) {
        return `<c r="${address}"${styleAttribute} t="n"><v>${value}</v></c>`;
      }
      return `<c r="${address}"${styleAttribute} t="inlineStr"><is><t>${escapeXml(value)}</t></is></c>`;
    }).join('');
    return `<row r="${rowNumber}">${cells}</row>`;
  }).join('');

  const columns = columnWidths.map((width, index) => (
    `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`
  )).join('');

  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
    '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/><selection pane="bottomLeft" activeCell="A2" sqref="A2"/></sheetView></sheetViews>' +
    '<sheetFormatPr defaultRowHeight="19"/>' +
    `<cols>${columns}</cols>` +
    `<sheetData>${worksheetRows}</sheetData>` +
    `<tableParts count="1"><tablePart r:id="rId${tableId}"/></tableParts>` +
    '</worksheet>';
}

function createTableXml({ id, name, headers, rowCount }) {
  const lastColumn = toExcelColumn(headers.length);
  const tableColumns = headers.map((header, index) => (
    `<tableColumn id="${index + 1}" name="${escapeXml(header)}"/>`
  )).join('');

  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<table xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ' +
    `id="${id}" name="${name}" displayName="${name}" ref="A1:${lastColumn}${rowCount}" headerRowCount="1">` +
    `<autoFilter ref="A1:${lastColumn}${rowCount}"/>` +
    `<tableColumns count="${headers.length}">${tableColumns}</tableColumns>` +
    '<tableStyleInfo name="TableStyleMedium2" showFirstColumn="0" showLastColumn="0" showRowStripes="1" showColumnStripes="0"/>' +
    '</table>';
}

function createStylesXml() {
  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    '<numFmts count="2"><numFmt numFmtId="164" formatCode="dd/mm/yyyy"/><numFmt numFmtId="165" formatCode="#,##0;[Red]-#,##0"/></numFmts>' +
    '<fonts count="1"><font><sz val="11"/><name val="Aptos"/></font></fonts>' +
    '<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>' +
    '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>' +
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
    '<cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="165" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/></cellXfs>' +
    '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>' +
    '</styleSheet>';
}

export function createTransactionWorkbook({ transactions, categories, profile }) {
  const categoryNames = new Map(categories.map((category) => [Number(category.id), category.name]));
  const totalIncome = transactions.reduce(
    (total, transaction) => total + (transaction.type === 'income' ? Number(transaction.amount) : 0),
    0,
  );
  const totalExpense = transactions.reduce(
    (total, transaction) => total + (transaction.type === 'expense' ? Number(transaction.amount) : 0),
    0,
  );
  const transactionRows = [...transactions]
    .sort((first, second) => new Date(second.date) - new Date(first.date))
    .map((transaction) => [
      transaction.date,
      transaction.description,
      categoryNames.get(Number(transaction.category_id)) || 'Umum',
      transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      Number(transaction.amount),
    ]);
  const transactionDataRows = [transactionHeaders, ...transactionRows];
  const summaryRows = [
    summaryHeaders,
    ['Nama', profile.name],
    ['Email', profile.email],
    ['Tanggal ekspor', new Date().toLocaleDateString('id-ID')],
    ['Jumlah transaksi', transactions.length],
    ['Total pemasukan (IDR)', totalIncome],
    ['Total pengeluaran (IDR)', totalExpense],
    ['Saldo bersih (IDR)', totalIncome - totalExpense],
  ];

  const files = {
    '[Content_Types].xml': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
      '<Default Extension="xml" ContentType="application/xml"/>' +
      '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
      '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
      '<Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
      '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
      '<Override PartName="/xl/tables/table1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml"/>' +
      '<Override PartName="/xl/tables/table2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml"/>' +
      '</Types>',
    '_rels/.rels': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
      '</Relationships>',
    'xl/workbook.xml': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
      '<sheets><sheet name="Transaksi" sheetId="1" r:id="rId1"/><sheet name="Ringkasan" sheetId="2" r:id="rId2"/></sheets>' +
      '</workbook>',
    'xl/_rels/workbook.xml.rels': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>' +
      '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>' +
      '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
      '</Relationships>',
    'xl/worksheets/sheet1.xml': createWorksheetXml(transactionDataRows, {
      columnWidths: [14, 38, 28, 18, 22],
      tableId: 1,
      styleForCell: (rowIndex, columnIndex) => (
        columnIndex === 0 ? 1 : columnIndex === 4 ? 2 : 0
      ),
    }),
    'xl/worksheets/sheet2.xml': createWorksheetXml(summaryRows, {
      columnWidths: [32, 36],
      tableId: 2,
      styleForCell: (rowIndex, columnIndex) => (
        columnIndex === 1 && rowIndex >= 5 ? 2 : 0
      ),
    }),
    'xl/worksheets/_rels/sheet1.xml.rels': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/table" Target="../tables/table1.xml"/>' +
      '</Relationships>',
    'xl/worksheets/_rels/sheet2.xml.rels': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/table" Target="../tables/table2.xml"/>' +
      '</Relationships>',
    'xl/styles.xml': createStylesXml(),
    'xl/tables/table1.xml': createTableXml({
      id: 1,
      name: 'TabelTransaksi',
      headers: transactionHeaders,
      rowCount: transactionDataRows.length,
    }),
    'xl/tables/table2.xml': createTableXml({
      id: 2,
      name: 'TabelRingkasan',
      headers: summaryHeaders,
      rowCount: summaryRows.length,
    }),
  };

  return zipSync(
    Object.fromEntries(
      Object.entries(files).map(([path, contents]) => [path, strToU8(contents)]),
    ),
    { level: 6 },
  );
}
