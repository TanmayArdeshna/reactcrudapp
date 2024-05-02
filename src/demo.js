import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DownloadPDFButton from "./DownloadPDFButton";
import FileUploader from "./FileUploader";


const EmployeeList = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, ] = useState(1);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const navigate = useNavigate();

    const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/search?q=${searchTerm}&from=${fromDate}&to=${toDate}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setSearchResults(result);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setSearchResults([]);
      setError('Error fetching data');
    }
  };
    

  const fetchEmployees = async (page, pageSize) => {
    try {
      const response = await fetch(
        `http://localhost:3000/employees_pagi?page=${page}&pageSize=${pageSize}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      console.log("Content-Type:", contentType);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data when the component mounts
    fetchEmployees(2, 5);
  }, []);

  const handlePageChange = (newPage) => {
    // Update the page and fetch new data
    fetchEmployees(newPage, data.meta.pageSize);
  };

  const loadEdit = (id) => {
    // Navigate to the employee edit page
    navigate(`/employee/edit/${id}`);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const toggleCheckbox = (id) => {
    setSelectedEmployees((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((employeeId) => employeeId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const removeSelectedEmployees = () => {
    if (window.confirm("Do you want to remove selected employees?")) {
      // Remove selected employees based on their IDs
      selectedEmployees.forEach((id) => {
        fetch(`http://localhost:3000/deleteemployees/${id}`, {
          method: "DELETE",
        })
          .then((res) => {
            if (res.ok) {
              // Reload data or update your UI as needed
              fetchEmployees(data.meta.currentPage, data.meta.pageSize);
            } else {
              throw new Error(`Failed to remove. Status: ${res.status}`);
            }
          })
          .catch((err) => {
            console.error(err.message);
          });
      });

      // Clear the selected employees array
      setSelectedEmployees([]);
    }
  };
   
  
  return (
    <div>
      <h2>Employee List</h2>
      {/* Add New Employee Button */}
      <div className="divbtn">
        <Link to="employee/create" className="btn btn-primary">
          Add New (+)
        </Link>
      </div>
      <br></br>
      <div>
      <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search Id or Name"
  />
  <input
    type="date"
    value={fromDate}
    onChange={(e) => setFromDate(e.target.value)}
    placeholder="From Date"
  />
  <input
    type="date"
    value={toDate}
    onChange={(e) => setToDate(e.target.value)}
    placeholder="To Date"
  />
 <button
  onClick={handleSearch}
  disabled={!searchTerm.trim() && !fromDate && !toDate}
>
  Search
</button>

  {error && <p>{error}</p>}
      </div>

      <div style={{ textAlign: "left" }}>
        <button onClick={removeSelectedEmployees} className="btn btn-danger">
          Remove
        </button>
        
        <div>
            <DownloadPDFButton currentPage={currentPage} searchTerm={searchTerm} />

        </div>
        
      </div>

      <div>
        <FileUploader/>
      </div>

      


      <table className="table table-bordered">
        <thead className="bg-dark text-white">
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={() => {
                  // Select or deselect all employees
                  if (selectedEmployees.length === data.records.length) {
                    setSelectedEmployees([]);
                  } else {
                    setSelectedEmployees(
                      data.records.map((employee) => employee.id)
                    );
                  }
                }}
                checked={selectedEmployees.length === data.records.length}
              />
            </th>
            <th>ID</th>
            <th>Name</th>    
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {searchTerm && searchResults.length > 0
            ? // Render search results if there is a search term and results
              searchResults.map((employee) => (
                <tr key={employee.id}>
                  <td>
                    <input
                      type="checkbox"
                      onChange={() => toggleCheckbox(employee.id)}
                      checked={selectedEmployees.includes(employee.id)}
                    />
                  </td>
                  <td>{employee.id}</td>
                  <td>{employee.name}</td>
                  <td>
                    <button
                      onClick={() => loadEdit(employee.id)}
                      className="btn btn-success"
                    >
                      Edit
                    </button>{" "}
                  </td>
                </tr>
              ))
            : // Render original data if search term is empty or no results
              data.records.map((employee) => (
                <tr key={employee.id}>
                  <td>
                    <input
                      type="checkbox"
                      onChange={() => toggleCheckbox(employee.id)}
                      checked={selectedEmployees.includes(employee.id)}
                    />
                  </td>
                  <td>{employee.id}</td>
                  <td>{employee.name}</td>
                  
                  <td>
                    <button
                      onClick={() => loadEdit(employee.id)}
                      className="btn btn-success"
                    >
                      Edit
                    </button>{" "}
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      <p>Page {data.meta.currentPage}</p>

      <button
        className="btn btn-warning"
        onClick={() => {
          handlePageChange(data.meta.currentPage - 1);
        }}
        disabled={data.meta.currentPage === 1}
      >
        Previous Page
      </button>

      <button
        className="btn btn-warning"
        onClick={() => {
          handlePageChange(data.meta.currentPage + 1);
        }}
        disabled={data.meta.currentPage === data.meta.totalPages}
      >
        Next Page
      </button>
    </div>
  );
};  
export default EmployeeList;
