import React, { useEffect, useState } from "react";
import { Table, Input, Modal, Typography, Button } from "antd";
import axios from "axios";

const { Text } = Typography;

const Reporttable = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const studentsResponse = await axios.get(
        "http://localhost:5000/api/students"
      );
      const feesResponse = await axios.get("http://localhost:5000/api/fees");

      const studentsWithFees = studentsResponse.data.map((student) => {
        const fees = feesResponse.data.filter(
          (fee) => fee.intern === student.internId
        );
        return { ...student, fees };
      });

      setStudents(studentsWithFees);
      setFilteredStudents(studentsWithFees);
    } catch (error) {
      console.error("Error fetching data:", error);
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

  const showStudentDetails = (key) => {
    const student = students.find((s) => s._id === key);
    setSelectedStudent(student);
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  const FullNameContact = ({ fullName, contact }) => (
    <>
      <div>{fullName}</div>
      <div>{contact}</div>
    </>
  );

  const feesDataSource = selectedStudent.fees
    ? selectedStudent.fees.map((fee, index) => ({
        key: index,
        feeRemarks: fee.feeRemarks,
        paid: fee.paid,
        date: new Date(fee.paidDate).toLocaleDateString("en-US"),
      }))
    : [];

  const feesColumns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Paid",
      dataIndex: "paid",
      key: "paid",
    },
    {
      title: "Remarks",
      dataIndex: "feeRemarks",
      key: "feeRemarks",
    },
  ];
  const studentDetailsColumns = [
    {
      title: "Attribute",
      dataIndex: "attribute",
      key: "attribute",
      width: "50%", // Adjust the width as per your requirement
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      width: "50%", // Adjust the width as per your requirement
    },
  ];

  const studentDetailsData = selectedStudent
    ? [
        {
          key: "fullName",
          attribute: "Full Name",
          value: selectedStudent.FullName,
        },
        {
          key: "contact",
          attribute: "Contact",
          value: selectedStudent.contact,
        },
        { key: "grade", attribute: "Grade", value: selectedStudent.grade },
        {
          key: "joinedOn",
          attribute: "Joined On",
          value: new Date(selectedStudent.doj).toLocaleDateString("en-US"),
        },
      ]
    : [];

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
            onClick={() => showStudentDetails(record.key)}
          >
            Report
          </Button>
        </>
      ),
    },
  ];
  const totalFee = selectedStudent.totalFees;
  const balance = selectedStudent.balance;
  const totalPaid = totalFee - balance;

  return (
    <>
      <Input
        className="w-75 mx-auto mb-3"
        placeholder="Search by Name, ID, Grade, etc."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <Table
        dataSource={dataSource}
        columns={columns}
        className="custom-table"
      />

      <Modal
        title={`${selectedStudent.FullName}'s Details and Fees`}
        visible={visible}
        onCancel={closeModal}
        footer={null}
        style={{ minWidth: "75%" }} // Set the modal width to 75%
      >
        <div className="student-details">
          <Text strong>Student Details:</Text>
          <Table
            dataSource={studentDetailsData}
            columns={studentDetailsColumns}
            pagination={false}
            className="custom-table"
          />
        </div>
        <div className="fees-details fs-4 my-2">
          <Text strong>Student Fees:</Text>
          <Table
            dataSource={feesDataSource}
            columns={feesColumns}
            pagination={false}
            className="custom-table"
          />
          <strong>Total fee:</strong>
          {totalFee}
          <p>
            <strong>Total paid:</strong>
            {totalPaid}
          </p>
          <p>
            <strong>Balance:</strong>
            {balance}
          </p>
        </div>
      </Modal>
    </>
  );
};

export default Reporttable;
