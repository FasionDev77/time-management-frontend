import { Input, InputNumber, Form } from "antd";

interface DataType {
  key: string;
  _id: string;
  date: string;
  description: string;
  duration: number;
}

const EditableCell: React.FC<{
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: "number" | "text";
  record: DataType;
  children: React.ReactNode;
}> = ({ editing, dataIndex, title, inputType, children, ...restProps }) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
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
            ...(dataIndex === "email"
              ? [
                  {
                    type: "email" as const,
                    message: "Please enter a valid email!",
                  },
                ]
              : []),
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
