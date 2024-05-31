import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  message,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
} from "antd";
import axios from "axios";
import moment from "moment";

const { Option } = Select;

const EditStudentForm = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  grades,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        doj: initialValues.doj ? moment(initialValues.doj) : null,
      });
    }
  }, [initialValues, form]);

  return (
    <Modal
      title="Edit Student Details"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Update
        </Button>,
      ]}
    >
      <Form
        layout="horizontal"
        labelCol={{ span: 5 }}
        form={form}
        wrapperCol={{ span: 18 }}
        onFinish={onSubmit}
      >
        <fieldset className="border p-2 m-3">
          <legend className="float-none fw-bold text-dark w-auto border-0">
            Personal Information
          </legend>

          <div className="form-group">
            <Form.Item label="Full Name" name="FullName">
              <Input />
            </Form.Item>
          </div>
          <div className="form-group">
            <Form.Item label="Intern ID" name="internId">
              <Input />
            </Form.Item>
          </div>

          <div className="form-group">
            <Form.Item label="Contact" name="contact">
              <Input />
            </Form.Item>
          </div>
          <div className="form-group">
            <Form.Item label="parentContact" name="parentContact">
              <Input />
            </Form.Item>
          </div>
          <div className="form-group">
            <Form.Item label="Aadhar" name="aadhar">
              <Input />
            </Form.Item>
          </div>
          <div className="form-group">
            <Form.Item label="Grade" name="grade">
              <Select placeholder="Select Grade">
                {grades.map((grade) => (
                  <Option key={grade._id} value={grade.grade}>
                    {grade.grade}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div className="form-group">
            <Form.Item label="Date of Joining" name="doj">
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>
          </div>
        </fieldset>

        <fieldset className="border p-2 m-3">
          <legend className="float-none fw-bold text-dark w-auto border-0 ">
            Fees Information
          </legend>
          <div className="form-group">
            <Form.Item label="Total Fees" name="totalFees">
              <Input disabled />
            </Form.Item>
          </div>

          <div className="form-group">
            <Form.Item label="Balance" name="balance">
              <Input disabled />
            </Form.Item>
          </div>
          <div className="form-group">
            <Form.Item label="Fees Remarks" name="feesRemarks">
              <Input disabled />
            </Form.Item>
          </div>
        </fieldset>

        <fieldset className="border p-2 m-3">
          <legend className="float-none fw-bold text-dark w-auto border-0">
            Optional Information
          </legend>
          <div className="form-group">
            <Form.Item label="About Student*" name="aboutStudent">
              <Input.TextArea />
            </Form.Item>
          </div>
          <div className="form-group">
            <Form.Item label="Email ID" name="email">
              <Input placeholder="Enter email" />
            </Form.Item>
          </div>
        </fieldset>
      </Form>
    </Modal>
  );
};

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchStudents();
    fetchGrades();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchGrades = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/grades");
      setGrades(response.data);
    } catch (error) {
      console.error("Error fetching grades:", error);
    }
  };

  const handleDelete = async (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to inactivate this Field"
    );
    if (confirmDelete) {
      try {
        const studentToDelete = students[index];
        await axios.post(
          "http://localhost:5000/api/students/deleted1",
          studentToDelete
        );
        await axios.delete(
          `http://localhost:5000/api/students/${studentToDelete._id}`
        );
        fetchStudents();
        message.success("Student Inactivated successfully!");
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  const handleEdit = (index) => {
    const studentToEdit = { ...students[index] };
    setEditingStudent(studentToEdit);
    setIsModalVisible(true);
  };

  const handleEditSubmit = async (values) => {
    try {
      await axios.put(
        `http://localhost:5000/api/students/${editingStudent._id}`,
        values
      );
      fetchStudents();
      setIsModalVisible(false);
      setEditingStudent(null);
      message.success("Student details updated successfully!");
    } catch (error) {
      console.error("Error editing student:", error);
    }
  };

  const FullNameContact = ({ fullName, contact }) => (
    <>
      <div>{fullName}</div>
      <div>{contact}</div>
    </>
  );

  const filteredStudents = students.filter((student) => {
    return (
      student.internId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.FullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.grade.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const dataSource = filteredStudents.map((student, index) => ({
    key: index,
    index: index + 1,
    id: student._id,
    intern: student.internId,
    parent: student.parentContact,
    nameContact: (
      <FullNameContact fullName={student.FullName} contact={student.contact} />
    ),
    grade: student.grade,
    joinedOn: new Date(student.doj).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }),
    fees: student.totalFees,
    balance: student.balance,
  }));

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      sorter: (a, b) => a.index - b.index,
    },
    {
      title: "Intern ID",
      dataIndex: "intern",
      key: "intern",
      width: 100,
      sorter: (a, b) => a.intern.localeCompare(b.intern),
    },
    {
      title: "FullName | Contact",
      dataIndex: "nameContact",
      key: "nameContact",
      width: 300,
      sorter: (a, b) => {
        const nameA = `${a.nameContact.props.fullName} | ${a.nameContact.props.contact}`;
        const nameB = `${b.nameContact.props.fullName} | ${b.nameContact.props.contact}`;
        return nameA.localeCompare(nameB);
      },
      render: (nameContact) => (
        <>
          <div>{nameContact.props.fullName}</div>
          <div>{nameContact.props.contact}</div>
        </>
      ),
    },
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
      width: 120,
      sorter: (a, b) => a.grade.localeCompare(b.grade),
    },
    {
      title: "Joined On",
      dataIndex: "joinedOn",
      key: "joinedOn",
      width: 150,
      sorter: (a, b) => a.joinedOn.localeCompare(b.joinedOn),
    },
    {
      title: "Fees",
      dataIndex: "fees",
      key: "fees",
      width: 120,
      sorter: (a, b) => a.fees.localeCompare(b.fees),
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      width: 120,
      sorter: (a, b) => a.balance.localeCompare(b.balance),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      width: 250,
      render: (_, record) => (
        <>
          <Button
            className="btn btn-primary btn-sm rounded-0 me-1"
            onClick={() => handleEdit(record.key)}
          >
            Edit
          </Button>
          <Button
            className="btn btn-danger btn-sm rounded-0 ps-1"
            onClick={() => handleDelete(record.key)}
          >
            Inactive
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="mb-3">
        <Input
          placeholder="Search by Name, ID, Grade, etc."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div className="table-responsive" style={{ overflowX: 'auto' }}>
      <Table
        className="custom-table"
        dataSource={dataSource}
        columns={columns}
      />
      </div>
      <EditStudentForm
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleEditSubmit}
        initialValues={editingStudent}
        grades={grades}
      />
    </>
  );
};

export default StudentTable;
