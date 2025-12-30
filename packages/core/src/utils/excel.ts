import type { WorkSheet, ColInfo, CellObject } from 'xlsx';
import { Toast } from '@douyinfe/semi-ui';
// import { slardarLog, slardarCaptureException } from '..';

const loadXLSX = () => import(/* webpackPrefetch: true */ 'xlsx');

interface ColumnField extends ColInfo {
  title: string;
  field: string;
}
interface ColumnRender<RecordType> extends ColInfo {
  title: string;
  render: (row: RecordType) => string | undefined | number;
}

type Column<RecordType> = ColumnField | ColumnRender<RecordType>;

function genLetters() {
  const str: Array<string> = [];
  for (let i = 65; i < 91; i++) {
    str.push(String.fromCharCode(i));
  }
  return str;
}

const letters = genLetters();

const getWordCh = (val: any) => {
  /* 先判断是否为null/undefined */
  // eslint-disable-next-line eqeqeq
  if (val == null) {
    return 10;
  } else if (val.toString().charCodeAt(0) > 255) {
    /* 再判断是否为中文 */
    return val.toString().length * 2;
  } else {
    return val.toString().length;
  }
};

/**
 * 导出excel
 * @example
  exportExcel(
    checkResult.list,
    [
      {
        title: '视频ID',
        wpx: 120,
        render: row => row.id,
      },
      {
        title: '上传结果',
        wpx: 120,
        render: row => (row.success ? '上传成功' : '上传失败'),
      },
      {
        title: '失败原因',
        wpx: 300,
        render: row => row.reason,
      },
    ],
    '上传记录.xlsx'
  )
*/
export const exportExcel = <RecordType = Record<string, unknown>>(
  dataSource: RecordType[],
  columns: Column<RecordType>[],
  filename: string
) => {
  loadXLSX().then(XLSX => {
    const sheet: WorkSheet = {};

    const defaultColumnCh = new Array(columns.length || 2);
    const cols: ColInfo[] = [];
    columns.forEach((item, index) => {
      const letter = letters[index];
      sheet[`${letter}1`] = { v: item.title };
      defaultColumnCh[index] = 0;
    });

    dataSource.forEach((item, rowIndex) => {
      columns.forEach((column, columIndex) => {
        // @ts-ignore next-line
        const value = column.render ? column.render(item) : item[column.field];
        const letter = letters[columIndex];
        sheet[letter + (rowIndex + 2)] = { v: value };

        defaultColumnCh[columIndex] = Math.max(defaultColumnCh[columIndex] || 0, getWordCh(value));
      });
    });

    columns.forEach((item, index) => {
      // @ts-ignore next-line
      const { render, title, field, ...ret } = item;
      cols.push({ wch: Math.max(defaultColumnCh[index] || 0, getWordCh(title)), ...ret });
    });

    // 获取所有单元格的位置
    const outputPos = Object.keys(sheet);
    // 计算出范围 ,["A1",..., "H2"]
    const ref = `${outputPos[0]}:${outputPos[outputPos.length - 1]}`;
    sheet['!cols'] = cols;
    sheet['!ref'] = ref;

    console.log(' sheet: ', sheet);
    // 导出 Excel
    XLSX.writeFileXLSX(
      {
        SheetNames: ['Sheet1'],
        Sheets: {
          Sheet1: sheet
        }
      },
      filename
    );
  });
};



interface Row {
  [key: string]: string | number;
}

/**
 *
 * 解析excel
 * @description

  ```tsx
    // 解析 .csv/.xlsx/.txt格式，文件首行不要包含字段名
    const data = (await transformCsvExcel(files[0], { header: 'A' })) as Array<{
        A: string | number;
        B?: string | number;
        // 类型是这么一样的一个格式
        // [C-Z]?: string | number;
      }>;
   data.map(item => item.A) // item.A 拿到第一列的
  ```
 */
export const transformCsvExcel = async (f: Blob, opts?: { header?: 'A' | number | string[] }): Promise<Array<Row>> => {
  let showToast = true;

  return new Promise<Array<Row>>(async (resolve, reject) => {
    const XLSX = await loadXLSX();
    const reader = new FileReader();
    reader.onload = async function () {
      // 这里面可能解析失败
      try {
        let data: Row[] = [];
        const { result } = this;
        // 以二进制流方式读取得到整份excel表格对象

        const workbook = XLSX.read(result, { type: 'binary', raw: true }); // raw: true 解决csv中的数字被识别为数字
        // 遍历每张工作表进行读取（这里默认只读取第一张表）
        // eslint-disable-next-line no-restricted-syntax
        for (const key in workbook.Sheets) {
          if (Object.prototype.hasOwnProperty.call(workbook.Sheets, key)) {
            const sheet = workbook.Sheets[key];

            await checkWorkSheet(sheet, key).catch(err => {
              showToast = false;
              return Promise.reject(err);
            });
            data = data.concat(XLSX.utils.sheet_to_json(sheet, { ...opts }));
          }
        }
        // 把key和value两边的空格去掉
        const ret: Row[] = data.map(item => {
          const row: Row = Object.keys(item).reduce((obj: Row, key) => {
            const value = item[key];
            if (typeof value === 'string') {
              obj[key.trim()] = value.trim();
            } else {
              obj[key.trim()] = value;
            }
            return obj;
          }, {});
          return row;
        });
        resolve(ret);
      } catch (error: any) {
        // excel 文件不正确
        reject(error);
      }
    };
    reader.onerror = e => {
      reject(e);
    };
    reader.readAsBinaryString(f);
  }).catch(err => {
    // if (!showToast) {
    //   slardarCaptureException(err, {
    //     errorType: 'excel'
    //   });
    // }

    showToast && Toast.error('解析失败');
    return Promise.reject(err);
  });
};

// 检查工作表
export async function checkWorkSheet(sheet: WorkSheet, sheetName?: string) {
  const XLSX = await loadXLSX();
  const ref = sheet['!ref'];
  if (!ref) {
    return;
  }
  const range = XLSX.utils.decode_range(ref);
  // 遍历所有单元格
  for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
    for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
      const cellAddress = XLSX.utils.encode_cell({
        r: rowNum,
        c: colNum
      });
      const cell = sheet[cellAddress] as CellObject;

      // number 类型
      if (cell && typeof cell.v === 'number') {
        const value = cell.v;

        // 超出安全整数
        // eslint-disable-next-line max-depth
        if (value > Number.MAX_SAFE_INTEGER) {
          const colAddress = XLSX.utils.encode_col(colNum);

          const oldMsg = `检测发现${
            sheetName ? `${sheetName}工作表` : ''
          }${colAddress}列中存在超大数字，避免识别错误，请设置${colAddress}列单元格为文本类型`;

          console.log({
            colAddress,
            cellAddress,
            msg: oldMsg
          });

          const msg = `经检测您上传的excel文件列中存在超长数字格式，均为文本类型格式才能正确显示哦，请按模版填写重新上传`;
          Toast.error({
            content: msg,
            showClose: true,
            duration: 4 * 1000
          });

          throw new Error(msg);
        }
      }
    }
  }
}
