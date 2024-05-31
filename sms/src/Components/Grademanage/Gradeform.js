import React from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";

const GradeForm = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/grades",
        values
      );

      message.success("Grade submitted successfully!");
      form.resetFields();
    } catch (error) {
      console.error("Failed:", error);
      message.error("Failed to submit grade.");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.error("Failed:", errorInfo);
  };

  return (
    <div className="container-fluid py-3 mt-3">
      <div className="my-3 mx-auto rounded border border-1 border-secondary pb-2 col-md-10 w-75">
        <div
          className="text-success rounded"
          style={{ backgroundColor: "#DFF0D8" }}
        >
          <p className="ms-4 py-3">Add Grades</p>
        </div>
        <Form
          form={form}
          layout="horizontal"
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 17 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <div className="form-group">
            <Form.Item
              label={<strong>Grade*</strong>}
              name="grade"
              rules={[{ required: true, message: "Please input Grade!" }]}
            >
              <Input />
            </Form.Item>
          </div>
          <div className="form-group">
            <Form.Item
              label={<strong>Detail*</strong>}
              name="detail"
              rules={[
                {
                  required: true,
                  message: "Please input the information Grade!",
                },
              ]}
            >
              <Input.TextArea
                rows={2}
                placeholder="Enter information about the Grade"
              />
            </Form.Item>
          </div>
          <div className="  ">
            <Button
              className="rounded-0 d-block mx-auto"
              type="primary"
              htmlType="submit"
            >
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default GradeForm;
