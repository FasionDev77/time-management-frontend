import dayjs from "dayjs";

export interface RecordValuesInterface {
    description: string;
    date: dayjs.Dayjs;
    duration: number;
  }