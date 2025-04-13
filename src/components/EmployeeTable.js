import React, { useState, useEffect } from "react";
import EmployeeForm from "./EmployeeForm";

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // New state for view modal

  // Fetch employees from JSON server
  useEffect(() => {
    fetch("http://localhost:5000/employees")
      .then((response) => response.json())
      .then((data) => setEmployees(data));
  }, [employees]);

  const handleAddClick = () => {
    setIsModalOpen(true);
    setCurrentEmployee(null);  // Reset form for adding a new employee
  };

  const handleEditClick = (employee) => {
    setIsModalOpen(true);
    setCurrentEmployee(employee);  // Pass employee data for editing
  };

  const handleViewClick = (employee) => {
    setCurrentEmployee(employee);  // Pass employee data for viewing
    setIsViewModalOpen(true); // Open view modal
  };

  const handleDeleteClick = (id) => {
    fetch(`http://localhost:5000/employees/${id}`, {
      method: "DELETE",
    }).then(() => {
      setEmployees(employees.filter((employee) => employee.id !== id));
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-2 p-2 bg-gray-100">
  Employee CRUD Application
</h1>
      <button
        onClick={handleAddClick}
        className="bg-blue-500 text-white p-2 rounded mb-4"
      >
        Add Employee
      </button>

      <table className="min-w-full table-auto">
         <thead>
           <tr className="bg-blue-500 text-white border-b-2 border-blue-500">
             <th className="px-4 py-2 font-semibold text-lg">Name</th>
             <th className="px-4 py-2 font-semibold text-lg">Phone</th>
             <th className="px-4 py-2 font-semibold text-lg">Country</th>
             <th className="px-4 py-2 font-semibold text-lg">State</th>
             <th className="px-4 py-2 font-semibold text-lg">City</th>
             <th className="px-4 py-2 font-semibold text-lg">Pincode</th>
             <th className="px-4 py-2 font-semibold text-lg">Actions</th>
           </tr>
         </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td className="border px-4 py-2">{employee.name}</td>
              <td className="border px-4 py-2">{employee.phone}</td>
              <td className="border px-4 py-2">{employee.country}</td>
              <td className="border px-4 py-2">{employee.state}</td>
              <td className="border px-4 py-2">{employee.city}</td>
              <td className="border px-4 py-2">{employee.pincode}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleViewClick(employee)}
                  className="bg-green-500 text-white p-2 rounded mr-2"
                >
                  View
                </button>
                <button
                  onClick={() => handleEditClick(employee)}
                  className="bg-yellow-500 text-white p-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(employee.id)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <EmployeeForm
          employee={currentEmployee}
          setIsModalOpen={setIsModalOpen}
          setEmployees={setEmployees}
        />
      )}

      {isViewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded">
            <h2 className="text-xl mb-4">Employee Details</h2>
            <p><strong>Name:</strong> {currentEmployee.name}</p>
            <p><strong>Phone:</strong> {currentEmployee.phone}</p>
            <p><strong>Country:</strong> {currentEmployee.country}</p>
            <p><strong>State:</strong> {currentEmployee.state}</p>
            <p><strong>City:</strong> {currentEmployee.city}</p>
            <p><strong>Pincode:</strong> {currentEmployee.pincode}</p>
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="bg-gray-500 text-white p-2 rounded mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;
