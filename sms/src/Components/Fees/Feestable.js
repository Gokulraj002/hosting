import React, { useEffect, useState } from "react";
import { Table, Button, Input, Modal, Form, DatePicker, message } from "antd";
import axios from "axios";

const Feestable = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState({});
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/students");
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = students.filter(
      (student) =>
        student.FullName.toLowerCase().includes(query.toLowerCase()) ||
        student._id.toLowerCase().includes(query.toLowerCase()) ||
        student.grade.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  const showCollectFeeModal = (key) => {
    const student = students.find((s) => s._id === key);
    setSelectedStudent(student);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleFeesChange = (type, value) => {
    if (type === "paid") {
      const newBalance = selectedStudent.balance - value;
      form.setFieldsValue({ balance: newBalance });
    }
  };

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Check if paid amount is greater than balance
      if (values.paid > selectedStudent.balance) {
        message.error("Paid amount cannot be greater than the balance");
        return;
      }

      // Update the balance in the current student collection
      const updatedBalance = {
        balance: values.balance,
      };
      await axios.put(
        `http://localhost:5000/api/students/${selectedStudent._id}`,
        updatedBalance
      );

      // Insert the paid amount, date, and fee remarks into another collection
      const feeDetails = {
        intern: values.internId,
        paid: values.paid,
        paidDate: values.paidDate,
        feeRemarks: values.feeRemarks,
      };
      await axios.post(`http://localhost:5000/api/fees`, feeDetails);

      message.success("Fee collected successfully");
      setVisible(false);
      fetchStudents();
    } catch (error) {
      console.error("Error collecting fee:", error);
      message.error("Failed to collect fee");
    }
  };

  const FullNameContact = ({ fullName, contact }) => (
    <>
      <div>{fullName}</div>
      <div>{contact}</div>
    </>
  );

  const dataSource = filteredStudents.map((student, index) => ({
    key: student._id,
    index: index + 1,
    id: student._id,
    intern: student.internId,
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
      title: "FullName | Contact",
      dataIndex: "nameContact",
      key: "nameContact",
      width: 210,
      sorter: (a, b) =>
        a.nameContact.props.fullName.localeCompare(
          b.nameContact.props.fullName
        ),
    },
    {
      title: "Fees",
      dataIndex: "fees",
      key: "fees",
      sorter: (a, b) => a.fees - b.fees,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      sorter: (a, b) => a.balance - b.balance,
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
      width: 120,
      sorter: (a, b) => new Date(a.joinedOn) - new Date(b.joinedOn),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      width: 197,
      render: (_, record) => (
        <>
          <Button
            className="btn btn-success me-2 btn-sm rounded-0 ps-1"
            onClick={() => showCollectFeeModal(record.key)}
          >
            Collect Fee
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Input
        className="w-75 mx-auto mb-3"
        placeholder="Search by Name, ID, Grade, etc."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <div className="table-responsive" style={{ overflowX: "auto" }}>
        <Table
          dataSource={dataSource}
          columns={columns}
          className="custom-table"
        />
      </div>
      <Modal
        title="Collect Fee"
        visible={visible}
        onCancel={handleCancel}
        onOk={onSubmit}
        style={{ minWidth: "50%" }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={selectedStudent}
          className="w-75"
        >
          <Form.Item label="Name" name="FullName">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Contact" name="contact">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Total Fee" name="totalFees">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Balance" name="balance">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Intern Id" name="internId">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Paid"
            name="paid"
            rules={[
              {
                required: true,
                message: "Please enter full amount!",
              },
            ]}
          >
            <Input
              onChange={(e) =>
                handleFeesChange("paid", parseFloat(e.target.value))
              }
            />
          </Form.Item>
          <Form.Item
            label="Date"
            name="paidDate"
            rules={[
              {
                required: true,
                message: "Please enter full date!",
              },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Fee Remarks"
            name="feeRemarks"
            rules={[
              {
                required: true,
                message: "Please enter fee remark!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Feestable;
