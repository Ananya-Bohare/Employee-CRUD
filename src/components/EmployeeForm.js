import { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";

const EmployeeForm = ({ employee, setIsModalOpen, setEmployees }) => {
  const [name, setName] = useState(employee ? employee.name : "");
  const [phone, setPhone] = useState(employee ? employee.phone : "");
  const [email] = useState(employee ? employee.email : ""); // New state for email
  const [joiningDate] = useState(employee ? employee.joiningDate : ""); // New state for joining date
  const [department] = useState(employee ? employee.department : ""); // New state for department
  const [country, setCountry] = useState(employee ? employee.country : "");
  const [state, setState] = useState(employee ? employee.state : "");
  const [city, setCity] = useState(employee ? employee.city : "");
  const [cityPincode, setCityPincode] = useState("");
  const [customPincode, setCustomPincode] = useState(""); // New state for custom pincode
  const [pincodeOptions, setPincodeOptions] = useState([]);

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (country) {
      setStates(State.getStatesOfCountry(country));
    }
  }, [country]);

  useEffect(() => {
    if (state) {
      setCities(City.getCitiesOfState(country, state));
    }
  }, [state, country]);

  useEffect(() => {
    if (city) {
      fetch(`https://api.postalpincode.in/postoffice/${city}`)
        .then((response) => response.json())
        .then((data) => {
          if (data && data[0].PostOffice && data[0].PostOffice.length > 0) {
            const uniquePincodes = Array.from(new Set(data[0].PostOffice.map(p => p.Pincode)))
              .map(code => data[0].PostOffice.find(p => p.Pincode === code));
            setPincodeOptions(uniquePincodes);
            setCityPincode(uniquePincodes[0].Pincode);
          } else {
            setPincodeOptions([]);
            setCityPincode("");
          }
        })
        .catch((error) => console.error("Error fetching pincode:", error));
    }
  }, [city]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEmployee = { name, phone, email, joiningDate, department, country, state, city, pincode: cityPincode === "Other" ? customPincode : cityPincode };

    if (employee) {
      fetch(`http://localhost:5000/employees/${employee.id}`, {
        method: "PUT",
        body: JSON.stringify(newEmployee),
        headers: { "Content-Type": "application/json" },
      }).then(() => {
        setEmployees((prev) =>
          prev.map((emp) => (emp.id === employee.id ? { ...emp, ...newEmployee } : emp))
        );
        setIsModalOpen(false);
      });
    } else {
      fetch("http://localhost:5000/employees", {
        method: "POST",
        body: JSON.stringify(newEmployee),
        headers: { "Content-Type": "application/json" },
      }).then((response) => response.json()).then((data) => {
        setEmployees((prev) => [...prev, data]);
        setIsModalOpen(false);
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded">
        <h2 className="text-xl mb-4">{employee ? "Edit" : "Add"} Employee</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 mb-4 w-full"
              required
            />
          </div>
          <div>
            <label>Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border p-2 mb-4 w-full"
              required
            />
          </div>
          <div>
            <label>Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="border p-2 mb-4 w-full"
              required
            >
              <option value="">Select Country</option>
              {Country.getAllCountries().map((item) => (
                <option key={item.isoCode} value={item.isoCode}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>State</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="border p-2 mb-4 w-full"
              required
            >
              <option value="">Select State</option>
              {states.map((item) => (
                <option key={item.isoCode} value={item.isoCode}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border p-2 mb-4 w-full"
              required
            >
              <option value="">Select City</option>
              {cities.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Pincode</label>
            <select
              value={cityPincode}
              onChange={(e) => {
                setCityPincode(e.target.value);
                if (e.target.value === "Other") {
                  setCustomPincode(""); // Clear custom pincode when "Other" is selected
                }
              }}
              className="border p-2 mb-4 w-full"
              required
            >
              <option value="">Select Pincode</option>
              {pincodeOptions.map((pincode) => (
                <option key={pincode.Pincode + pincode.Name} value={pincode.Pincode}>
                  {pincode.Pincode}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
            {cityPincode === "Other" && (
              <input
                type="text"
                value={customPincode}
                onChange={(e) => setCustomPincode(e.target.value)}
                placeholder="Enter custom pincode"
                className="border p-2 mb-4 w-full"
                required
              />
            )}
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-500 text-white p-2 rounded"
            >
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
