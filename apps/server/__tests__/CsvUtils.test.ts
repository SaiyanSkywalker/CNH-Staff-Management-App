import ScheduleEntryAttributes from "@shared/src/interfaces/ScheduleEntryAttributes";
import { csvToScheduleData, validateSchedule, csvToArray } from "server/src/util/CsvUtils";
import moment from "moment";
import { UploadedFile } from "express-fileupload";

test("csvToArray splits data in csv file to an array", () => {
    let content: string="Col1,Col2\n1,2\n3,4";
    let strings: string[][] = csvToArray(content);
    console.log(strings);
    expect(strings).toStrictEqual([['1','2'], ['3','4']]);
});

test("csvToScheduleData converts strings to an array of ScheduleEntryAttributes", () => {
    const csv: string[][] = [
        ["SCHEDIMPORT", "50000", "Last001", "First001", "", "20230905", "7:00", "19:30", "12:30", "REG", "", "", "202309000000", "N1320", "47025", "47025", "CNMC" ],
        ["SCHEDIMPORT", "50001", "Last002", "First002", "M", "20230909", "19:00", "7:30", "12:30", "REG", "", "", "202309000000", "N1217", "42000", "42000", "CNMC" ]
    ]

    const scheduleEntries: ScheduleEntryAttributes[] = csvToScheduleData(csv);
    
    const scheduleEntryOne: ScheduleEntryAttributes = {
        employeeId: 50000,
        lastName: 'Last001',
        firstName: 'First001',
        middleInitial: '',
        shiftDate: moment("20230905", "YYYYMMDD").toDate(),
        startTime: '7:00',
        endTime: '19:30',
        duration: '12:30',
        shiftType: 'REG',
        jobCode: 'N1320',
        costCenterId: 47025
    };

    const scheduleEntryTwo: ScheduleEntryAttributes = {
        employeeId: 50001,
        lastName: 'Last002',
        firstName: 'First002',
        middleInitial: 'M',
        shiftDate: moment("20230909", "YYYYMMDD").toDate(),
        startTime: '19:00',
        endTime: '7:30',
        duration: '12:30',
        shiftType: 'REG',
        jobCode: 'N1217',
        costCenterId: 42000
    };

    expect(scheduleEntries.length).toBe(2);
    expect(scheduleEntries[0]).toStrictEqual(scheduleEntryOne);
    expect(scheduleEntries[1]).toStrictEqual(scheduleEntryTwo);
});


/*
test("uploaded file has no content", () => {
    let mv = (path: string, callback: (err: any) => void) => {
        callback(path);
    }

    let fileUpload: UploadedFile = {
        data: Buffer.alloc(0),
        name: "",
        encoding: "",
        mimetype: "",
        tempFilePath: "",
        truncated: false,
        size: 0,
        md5: "",
        mv
    }
});
*/
