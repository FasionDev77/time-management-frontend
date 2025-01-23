import { RecordDataInterface } from "./record.data.interface";
export interface TableColumn {
  title: string;
  dataIndex: string;
  key?: string;
  editable?: boolean;
  inputType?: "date" | "text" | "number";
  render?: (
    text: string | number,
    record: RecordDataInterface
  ) => React.ReactNode;
}
