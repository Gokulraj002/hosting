import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTimes } from "react-icons/fa";
import { Table, Button, Space, Modal, Form, Input, message } from "antd";

const GradeTable = () => {
  const [grades, setGrades] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/grades");
      setGrades(response.data);
    } catch (error) {
      console.error("Error fetching grades:", error);
    }
  };

  const handleEdit = (index) => {
    const gradeToEdit = grades[index];
    setEditingIndex(index);
    form.setFieldsValue(gradeToEdit);
    setIsModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      await axios.put(
        `http://localhost:5000/api/grades/${grades[editingIndex]._id}`,
        values
      );
      fetchData();
      setIsModalVisible(false);
      setEditingIndex(null);
    } catch (error) {
      console.error("Error editing grade:", error);
    }
  };

  const handleDelete = async (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this grade?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `http://localhost:5000/api/grades/${grades[index]._id}`
        );
        fetchData();
        message.success("Grade deleted successfully!");
      } catch (error) {
        console.error("Error deleting grade:", error);
      }
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    { title: "Grade", dataIndex: "grade", key: "grade" },
    { title: "Detail", dataIndex: "detail", key: "detail", width: 400 },
    {
      title: "Action",
      key: "action",
      render: (text, record, index) => (
        <Space size="middle">
          <FaEdit
            className="text-success fs-5"
            style={{ cursor: "pointer" }}
            onClick={() => handleEdit(index)}
          />
          <FaTimes
            className="text-danger fs-5"
            style={{ cursor: "pointer" }}
            onClick={() => handleDelete(index)}
          />
        </Space>
      ),
    },
  ];

  const data = grades.map((grade, index) => ({ ...grade, index }));

  return (
    <div>
      <div className="table-responsive" style={{ overflowX: "auto" }}>
        <Table className="custom-table " columns={columns} dataSource={data} />
      </div>

      <Modal
        title="Edit Grade"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleEditSubmit}>
            Update
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="grade"
            label="Grade"
            rules={[{ required: true, message: "Please input grade!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="detail"
            label="Detail"
            rules={[{ required: true, message: "Please input detail!" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GradeTable;
