import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, message, DatePicker } from "antd";
import axios from "axios";

const { Option } = Select;

const Addstuform = () => {
  const [grades, setGrades] = useState([]);
  const [balance, setBalance] = useState({});
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/grades");
        setGrades(response.data);
       // Reset form fields
      } catch (error) {
        console.error("Error fetching grades:", error);
      }
    };
  
    fetchGrades();
  }, []); 

  const handleSubmit = async (values) => {
    const { doj, advanceFees, feesRemarks, internId } = values;
  
    console.log("Submitting values:", values);
  
    try {
      // Send only doj, advanceFees, and feesRemarks to the fees API
      const feesResponse = await axios.post(
        "http://localhost:5000/api/fees/ins",
        { doj, advanceFees, feesRemarks, internId }
      );
  
      console.log("Fees API Response:", feesResponse.data);
  
      const studentsResponse = await axios.post(
        "http://localhost:5000/api/students",
        values
      );
  
      console.log("Students API Response:", studentsResponse.data);
  
      if (studentsResponse.status === 201) {
        message.success("Student Added successfully!");
        form.resetFields();
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error
    }
  };
  

  const handleFeesChange = (type, value) => {
    const totalFees = parseFloat(form.getFieldValue("totalFees"));
    
    const advanceFees = parseFloat(form.getFieldValue("advanceFees"));
    
    let newBalance = 0;
    if (type === "total") {
      newBalance = value - advanceFees;
    } else if (type === "advance") {
      newBalance = totalFees - value;
    }
  
    setBalance(newBalance);
    form.setFieldsValue({ balance: newBalance });
  };

  return (
    <>
      <div className="container-fluid py-5 mt-3">
        <div className="rounded pb-5 px-2">
          <div className="px-1 py-2 purple col-md-12"></div>
          <div className="rounded my-3 mx-auto border border-1 border-secondary col-md-10">
            <div
              className="text-success rounded"
              style={{ backgroundColor: "#DFF0D8" }}
            >
              <p className="ms-4 py-3">Add Student Details</p>
            </div>
            <Form
              layout="horizontal"
              labelCol={{ span: 5 }}
              form={form}
              wrapperCol={{ span: 18 }}
              onFinish={(values) => handleSubmit(values)}
            >
              <fieldset className="border p-2 m-3">
                <legend className="float-none fw-bold text-dark w-auto border-0">
                  Personal Information
                </legend>

                <div className="form-group">
                  <Form.Item
                    label={<strong>Full Name*</strong>}
                    name="FullName"
                    rules={[
                      {
                        required: true,
                        message: "Please enter full name!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </div>  
                <div className="form-group">
                <Form.Item
                  label={<strong>Intern ID*</strong>}
                  name="internId"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Intern ID!",
                    },
                    {
                      pattern: /^[a-zA-Z0-9]*$/,
                      message: "Please enter only letters and numbers",
                    },
                  ]}
                >
                  <Input placeholder="Enter your intern id"/>
                </Form.Item>
              </div>


                <div className="form-group">
                  <Form.Item
                    label={<strong>Contact*</strong>}
                    name="contact"
                    rules={[
                      {
                        required: true,
                        message: "Please enter contact number!",
                      },
                      {
                        pattern: /^[0-9]*$/,
                        message: "Please enter only numbers",
                      },
                      {
                        len: 10,
                        message: "Contact number must be 10 digits",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </div>
                <div className="form-group">
                  <Form.Item
                    label={<strong>Parent Contact*</strong>}
                    name="parentContact"
                    rules={[
                      {
                        required: true,
                        message: "Please enter parent contact number!",
                      },
                      {
                        pattern: /^[0-9]*$/,
                        message: "Please enter only numbers",
                      },
                      {
                        len: 10,
                        message: "Parent contact number must be 10 digits",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </div>
                <div className="form-group">
                  <Form.Item
                    label={<strong>Aadhar*</strong>}
                    name="aadhar"
                    rules={[
                      {
                        required: true,
                        message: "Please enter Aadhar number!",
                      },
                      {
                        pattern: /^[0-9]*$/,
                        message: "Please enter only numbers",
                      },
                      {
                        len: 12,
                        message: "Aadhar number must be 12 digits",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </div>
                <div className="form-group">
                  <Form.Item
                    label={<strong>Grade*</strong>}
                    name="grade"
                    rules={[
                      {
                        required: true,
                        message: "Please select grade!",
                      },
                    ]}
                  >
                    <Select placeholder="Select Grade">
                      {grades.map((grade) => (
                        <Option key={grade._id} value={grade.grade}>
                          {grade.gradeName}
                        </Option>
                        
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="form-group">
                  <Form.Item
                    label={<strong>Date of Joining*</strong>}
                    name="doj"
                    rules={[
                      {
                        required: true,
                        message: "Please enter date of joining!",
                      },
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      format="YYYY-MM-DD"
                      showTime={false}
                      disabledDate={(current) => current && current.year() < 2020}
                    />
                  </Form.Item>
                </div>
              </fieldset>

              <fieldset className="border p-2 m-3">
                <legend className="float-none fw-bold text-dark w-auto border-0 ">
                  Fees Information
                </legend>
                <div className="form-group">
                  <Form.Item
                    label={<strong>Total Fees*</strong>}
                    name="totalFees"
                    rules={[
                      {
                        required: true,
                        message: "Please enter total fees!",
                      },
                      {
                        pattern: /^[0-9]*$/,
                        message: "Please enter only numbers",
                      }
                    
                    ]}
                  >
                    <Input onChange={(e) => handleFeesChange("total", parseFloat(e.target.value))}/>
                  </Form.Item>
                </div>
                <div className="form-group">
                  <Form.Item
                    label={<strong>Advance Fees*</strong>}
                    name="advanceFees"
                    rules={[
                      {
                        required: true,
                        message: "Please enter advance fees!",
                      },
                      {
                        pattern: /^[0-9]*$/,
                        message: "Please enter only numbers",
                      }
                   
                    ]}
                  >
                    <Input onChange={(e) => handleFeesChange("advance", parseFloat(e.target.value))} />
                  </Form.Item>
                </div>
                <div className="form-group">
                  <Form.Item
                    label={<strong>Balance*</strong>}
                    name="balance"
                  >
                    <Input value={balance} placeholder="0" disabled />
                  </Form.Item>
                </div>
                <div className="form-group">
                  <Form.Item
                    label={<strong>Fees Remarks*</strong>}
                    name="feesRemarks"
                    rules={[
                      {
                        required: true,
                        message: "Please enter fees remarks!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </div>
              </fieldset>
              <fieldset className="border p-2 m-3">
                <legend className="float-none fw-bold text-dark w-auto border-0">
                  Optional Information
                </legend>
                <div className="form-group">
                  <Form.Item
                    label={<strong>About Student*</strong>}
                    name="aboutStudent"
                    rules={[
                      {
                        required: true,
                        message: "Please enter information about student!",
                      },
                    ]}
                  >
                    <Input.TextArea rows={2} placeholder="Enter information about the student" />
                  </Form.Item>
                </div>
                <div className="form-group">
                  <Form.Item
                    label={<strong>Email ID*</strong>}
                    name="email"
                    rules={[
                      {
                        type: "email",
                        message: "The input is not valid E-mail!",
                      },
                      {
                        required: true,
                        message: "Please enter your E-mail!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter email" />
                  </Form.Item>
                </div>
              </fieldset>
              <div className="d-grid">
                <Button className="rounded-top-0" type="primary" htmlType="submit">
                  Submit
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Addstuform;
