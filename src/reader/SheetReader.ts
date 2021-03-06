import * as XLSX from 'xlsx';
import Cell from '../data/Cell';
import SheetData, {ContentRange} from '../data/SheetData';
import Logger from '../Logger';
import WorkSheet = XLSX.WorkSheet;

enum EnumSheetHead {
    TYPE    = 1,
    DES     = 2,
    FIELD   = 3,
    USER    = 4
}

export default class SheetReader {

    // /** 字段类型 */
    // private static typeMap: Map<number,any> = new Map<number,any>();
    // /** 字段描述 */
    // private static desMap: Map<number,any> = new Map<number,any>();
    // /** 字段名 */
    // private static fieldMap: Map<number,any> = new Map<number,any>();
    
    public static Read(sheet: WorkSheet): SheetData {
        // this.Reset();
        let st = SheetData.Create(sheet);
        let range = this._getContentRange(sheet["!ref"]);
        st.range = range;
        //读表头
      
        //遍历cell
        for(let row = range.minRow;row <= range.maxRow;row++) {
            
            for(let column = range.minColunm;column <= range.maxColumn;column++) {
                let cellKey = this._convertNum2Code(column) + row;
                let cell = new Cell(row,column);
                let rawCell = sheet[cellKey];
                cell.value = rawCell?rawCell.v: 0;
                // if(st.sheetName.indexOf("Global") != -1) {

                // }
                // if(row <= 4) {
                //     let columnChar = this._convertNum2Code(column);
                //     let rowType = columnChar + EnumSheetHead.TYPE;
                //     if(!sheet[rowType]) {
                //         Logger.Error(`${sheet.sheetName}表 ${EnumSheetHead.TYPE}行，${columnChar}列，类型字段错误`);
                //     }
                //     if(EnumSheetHead.TYPE == row) {
                //         this.typeMap.set(column,cell.value);
                //     } else if(EnumSheetHead.DES == row) {
                //         this.desMap.set(column,cell.value);
                //     } else if(EnumSheetHead.FIELD == row) {
                //         this.fieldMap.set(column,cell.value);
                //     }
                // }else {
                //     cell.type = this.typeMap.get(column);
                // }
                let bSort = row == range.maxRow && column == range.maxColumn;
                st.AddCell(cell, bSort);
            }
        }
        return st;
    }

    private static Reset() {
        // this.typeMap.clear();
        // this.desMap.clear();
        // this.fieldMap.clear();
    }

    
    /** 获取工作表的内容范围 */
    private static _getContentRange(ref: string): ContentRange
    {
        let list = ref.replace(":","").split(/([0-9]+)/);
        let range = <ContentRange> {};
        range.minColunm = this._convertCode2Num(list[0]);
        range.minRow = Number(list[1]);
        range.maxColumn = this._convertCode2Num(list[2]);
        range.maxRow = Number(list[3]);
        return range;
    }

    private static _convertCode2Num(str: string)
    {
        let n = 0;
        var s = str.match(/./g);//求出字符数组
        var j = 0;
        for(var i = str.length - 1,j = 1;i >= 0;i--,j *= 26)
        {
            var c = s[i].toUpperCase();
            if(c < 'A' || c > 'Z')
                return 0;
            n += (c.charCodeAt(0) - 64) * j;
        }
        return n;
    }

    private static _convertNum2Code(num: number)
    {
        var str = "";
        while(num > 0)
        {
            var m = num % 26;
            if(m == 0)
                m = 26;
            str = String.fromCharCode(m + 64) + str;
            num = (num - m) / 26;
        }
        return str;
    }

    
}




