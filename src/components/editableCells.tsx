import { Input, InputNumber, Form, DatePicker } from "antd";
import { UsersRecordsInterface } from "../types/users.records.interface";

// interface DataType {
//   key: string;
//   _id: string;
//   date: string;
//   description: string;
//   duration: number;
// }

const EditableCell: React.FC<{
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: "number" | "text" | "date";
  record: UsersRecordsInterface;
  children: React.ReactNode;
}> = ({ editing, dataIndex, title, inputType, children, ...restProps }) => {
  const inputNode =
    inputType === "number" ? (
      <InputNumber min={1} max={17} />
    ) : inputType === "date" ? (
      <DatePicker
        format="YYYY-MM-DD" // Specify the date format
        onChange={(date) => console.log(date?.toISOString())} // Debugging
      />
    ) : (
      <Input />
    );
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default EditableCell;
