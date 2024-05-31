import React, { useEffect, useState } from "react";
import { Table, Button, message, Input } from "antd";
import axios from "axios";

const Inactive = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/active/deleted"
      );
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching inactive students:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredStudents = students.filter((student) => {
    return (
      student.internId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.FullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.grade.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const ActiveStudent = async (index) => {
    const confirmActivate = window.confirm(
      "Are you sure you want to Activate this student?"
    );
    if (confirmActivate) {
      try {
        const studentToActivate = students[index];
        await axios.post("http://localhost:5000/api/active", studentToActivate);
        await axios.delete(
          `http://localhost:5000/api/active/${studentToActivate._id}`
        );
        fetchStudents();
        message.success("Student Activated Successfully!");
      } catch (error) {
        console.error("Error activating student:", error);
      }
    }
  };

  const handleDelete = async (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to Delete this student?"
    );

    if (confirmDelete) {
      const studentToDelete = students[index];
      try {
        await axios.delete(
          `http://localhost:5000/api/active/${studentToDelete._id}`
        );
        fetchStudents();
        message.success("Student Deleted Successfully!");
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  const FullNameContact = ({ fullName, contact }) => (
    <>
      <div>{fullName}</div>
      <div>{contact}</div>
    </>
  );

  const dataSource = filteredStudents.map((student, index) => ({
    key: index,
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
      title: "#",
      dataIndex: "index",
      key: "index",
      sorter: (a, b) => a.index - b.index,
    },
    {
      title: "Intern ID",
      dataIndex: "intern",
      key: "intern",
      sorter: (a, b) => a.intern.localeCompare(b.intern),
    },
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
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      width: 197,
      render: (_, record) => (
        <>
          <Button
            className="btn btn-success me-2 btn-sm rounded-0 ps-1"
            onClick={() => ActiveStudent(record.key)}
          >
            Active
          </Button>
          <Button
            className="btn btn-danger btn-sm rounded-0 ps-1"
            onClick={() => handleDelete(record.key)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="container-fluid card border-0">
      <div className="bg-white row shadow p-3">
        <h2 className="border_color ms-md-2 mb-3 pb-3">Inactive Students</h2>
        <div className="card-header border">Manage Inactive students</div>
        <div className="card-body border mb-5">
          <div className="mb-3">
            <Input
              placeholder="Search by Name, ID, Grade, etc."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="table-responsive" style={{ overflowX: "auto" }}>
            <Table
              className="custom-table"
              dataSource={dataSource}
              columns={columns}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inactive;
