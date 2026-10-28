import React, { useState, useEffect } from "react";
import "../styles/UpdateEmployeeForm.css";
import { Link } from "react-router-dom";
import avatarImage from "../assets/avtar.png";
import uploadImage from "../assets/upload.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import APIEndpoints from "./endPoints";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";
const UpdateEmployeeForm = () => {
  const navigate = useNavigate();
  const Endpoints = new APIEndpoints();
  const location = useLocation();
  const { employee } = location.state || {};
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const [EmployeeImg, setEmployeeImg] = useState(null);
  // function getCookie(name) {
  //   const value = `; ${document.cookie}`;
  //   const parts = value.split(`; ${name}=`);
  //   if (parts.length === 2) return parts.pop().split(';').shift();
  // }

  const fetchEmployeeImage = async () => {
    try {
      const response = await axios.get(
        `${Endpoints.GET_EMPLOYEE_IMAGE}/${employee._id}`
      );
      if (response.status === 200) {
        const empdata = response.data;

        const binaryString = new Uint8Array(
          empdata.employeeImage[0].Image.data
        ).reduce((acc, byte) => acc + String.fromCharCode(byte), "");
        const base64String = btoa(binaryString);
        setEmployeeImg(`data:${empdata.Imagetype};base64,${base64String}`);
        console.log(EmployeeImg);
      }
    } catch (err) {
      console.error("Error fetching employee image:", err.message);
    }
  };
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/admin-login");
        return;
      }

      const decode = jwtDecode(token);
      if (decode.role !== "admin") {
        navigate("/admin-login");
        return;
      }
    } catch (err) {
      console.error("Error in admin dashboard:", err.message || "Server error");
    }
    fetchEmployeeImage();
  }, [navigate]);
  const [formData, setFormData] = useState({
    _id: employee._id || "",
    firstName: employee.firstName || "",
    middleName: employee.middleName || "",
    lastName: employee.lastName || "",
    employeeId: employee.employeeId || "",
    email: employee.email || "",
    employeeType: employee.employeeType || "",
    employeeStatus: employee.employeeStatus || "",
    endDate: employee.endDate || "",
    dateOfHire: employee.dateOfHire || "",
    department: employee.department || "",
    jobTitle: employee.jobTitle || "",
    location: employee.location || "",
    reportingTo: employee.reportingTo || "",
    source: employee.source || "",
    payRate: employee.payRate || "",
    bloodGroup: employee.bloodGroup || "",
    spouseName: employee.spouseName || "",
    fatherName: employee.fatherName || "",
    motherName: employee.motherName || "",
    mobile: employee.mobile || "",
    phone: employee.phone || "",
    otherEmail: employee.otherEmail || "",
    dob: employee.dob || "",
    nationality: employee.nationality || "",
    gender: employee.gender || "",
    maritalStatus: employee.maritalStatus || "",
    drivingLicence: employee.drivingLicence || "",
    address1: employee.address1 || "",
    address2: employee.address2 || "",
    city: employee.city || "",
    country: employee.country || "",
    state: employee.state || "",
    postalCode: employee.postalCode || "",
    biography: employee.biography || "",
    welcomeEmail: employee.welcomeEmail || false,
    loginDetails: employee.loginDetails || false,
    Image: employee.Image || null,
  });

  const [Image, setImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file)); // generate a temporary preview
    }
  };

  const handleCheckboxChange = () => {
    setShowAdvancedFields(!showAdvancedFields);
  };

  const handleCloseWorkForm = () => {
    setShowAdvancedFields(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const submitFormData = new FormData();

  Object.keys(formData).forEach((key) => {
    submitFormData.append(key, formData[key]);
  });

  if (Image) {
    submitFormData.append("Image", Image);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        Endpoints.EMPLOYEE_UPDATE,
        submitFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        navigate("/admin-dashboard");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("There was an error adding the employee!", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="update-employee">
      <header>
        <h1>Update Employee</h1>
        <Link to="/admin-dashboard" className="close-btn">
          X
        </Link>
      </header>
      <div className="update-container">
        <div className="content-section">
          <div className="photo-section">
            <div className="image-box">
              <img
                src={
                  previewImage
                    ? previewImage
                    : EmployeeImg
                    ? EmployeeImg
                    : avatarImage
                }
                width="150px"
                alt="Avatar"
              />
            </div>
            <button className="upload-btn">
              <img src={uploadImage} width="15px" height="15px" alt="Upload" />
              <label htmlFor="input-file">Upload Image</label>
              <input
                type="file"
                id="input-file"
                onChange={handleFileChange}
              ></input>
            </button>
          </div>
          <div className="form-box">
            <form className="update-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first-name">First Name</label>
                  <input
                    type="text"
                    id="first-name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="middle-name">Middle Name</label>
                  <input
                    type="text"
                    id="middle-name"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="last-name">Last Name</label>
                  <input
                    type="text"
                    id="last-name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="employee-id">Employee ID</label>
                  <input
                    type="text"
                    id="employee-id"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="employee-type">Employee Type</label>
                  <select
                    id="employee-type"
                    name="employeeType"
                    value={formData.employeeType}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      - Select -
                    </option>
                    <option value="full-time">Full-Time</option>
                    <option value="part-time">Part-Time</option>
                    <option value="contract">Contract</option>
                    <option value="Intern">Intern</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="employee-status">Employee Status</label>
                  <select
                    id="employee-status"
                    name="employeeStatus"
                    value={formData.employeeStatus}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      - Select -
                    </option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="end-date">Employee End Date</label>
                  <input
                    type="date"
                    id="end-date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date-of-hire">Date of Hire</label>
                  <input
                    type="date"
                    id="date-of-hire"
                    name="dateOfHire"
                    value={formData.dateOfHire}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="manager">Manager</label>
                  <select
                    id="manager"
                    name="manager"
                    value={formData.manager}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      - Select Manager -
                    </option>
                    <option value="test-manager-1">Test Manager 1</option>
                    <option value="test-manager-2">Test Manager 2</option>
                  </select>
                </div>
              </div>
              <div className="form-row advanced">
                <label>
                  <input
                    className="check-box"
                    type="checkbox"
                    id="show-advanced"
                    name="showAdvancedFields"
                    checked={showAdvancedFields}
                    onChange={handleCheckboxChange}
                  />
                  Show Advanced Fields
                </label>
              </div>

              {showAdvancedFields && (
                <div className="work">
                  <h2>Work</h2>
                  <hr className="section-line"></hr>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="department">Department</label>
                      <select
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                      >
                        <option value="" disabled>
                          - Select Department -
                        </option>
                        <option value="sales">Sales</option>
                        <option value="marketing">Marketing</option>
                        <option value="hr">HR</option>
                        <option value="engineering">Engineering</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="job-title">Job Title</label>
                      <input
                        type="text"
                        id="job-title"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="location">Location</label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="reporting-to">Reporting To</label>
                      <input
                        type="text"
                        id="reporting-to"
                        name="reportingTo"
                        value={formData.reportingTo}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="source">Source</label>
                      <input
                        type="text"
                        id="source"
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="pay-rate">Pay Rate</label>
                      <input
                        type="text"
                        id="pay-rate"
                        name="payRate"
                        value={formData.payRate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="personal">
                <h2>Personal</h2>
                <hr className="section-line"></hr>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="blood-group">Blood Group</label>
                    <input
                      type="text"
                      id="blood-group"
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="spouse-name">Spouse Name</label>
                    <input
                      type="text"
                      id="spouse-name"
                      name="spouseName"
                      value={formData.spouseName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="father-name">Father Name</label>
                    <input
                      type="text"
                      id="father-name"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="mother-name">Mother Name</label>
                    <input
                      type="text"
                      id="mother-name"
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="mobile">Mobile</label>
                    <input
                      type="text"
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="other-email">Other Email</label>
                    <input
                      type="email"
                      id="other-email"
                      name="otherEmail"
                      value={formData.otherEmail}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="dob">Date of Birth</label>
                    <input
                      type="date"
                      id="dob"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nationality">Nationality</label>
                    <input
                      type="text"
                      id="nationality"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        - Select Gender -
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="marital-status">Marital Status</label>
                    <select
                      id="marital-status"
                      name="maritalStatus"
                      value={formData.maritalStatus}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        - Select Marital Status -
                      </option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="driving-licence">Driving Licence</label>
                    <input
                      type="text"
                      id="driving-licence"
                      name="drivingLicence"
                      value={formData.drivingLicence}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="address">
                <h2>Address</h2>
                <hr className="section-line"></hr>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="address1">Address 1</label>
                    <input
                      type="text"
                      id="address1"
                      name="address1"
                      value={formData.address1}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address2">Address 2</label>
                    <input
                      type="text"
                      id="address2"
                      name="address2"
                      value={formData.address2}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="postal-code">Postal Code</label>
                    <input
                      type="text"
                      id="postal-code"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="biography">
                <h2>Biography</h2>
                <hr className="section-line"></hr>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="biography">Biography</label>
                    <textarea
                      id="biography"
                      name="biography"
                      value={formData.biography}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>
                <div className="form-row advanced">
                  <label>
                    <input
                      className="check-box"
                      type="checkbox"
                      id="welcome-email"
                      name="welcomeEmail"
                      checked={formData.welcomeEmail}
                      onChange={handleChange}
                    />
                    Send Welcome Email to Employee
                  </label>
                </div>
                <div className="form-row advanced">
                  <label>
                    <input
                      className="check-box"
                      type="checkbox"
                      id="login-details"
                      name="loginDetails"
                      checked={formData.loginDetails}
                      onChange={handleChange}
                    />
                    Send Login Details to Employee
                  </label>
                </div>
              </div>
              <button className="update-emp" type="submit">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Updating..
                  </span>
                ) : (
                  "Update Employee"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateEmployeeForm;
