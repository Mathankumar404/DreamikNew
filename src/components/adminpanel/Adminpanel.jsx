import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Adminpanel.css";

const Adminpanel = () => {
  const [adminData, setAdminData] = useState([]);
  const [selectedUserName,setSelectedUserName]=useState()
  const [selectedUserPassword,setSelectedUserPassword]=useState()
  const [loggedIn, setLoggedIn] = useState(false);
  const [action, setAction] = useState("");
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    email: "",
    password: "",
    mobileno: "",
    whatsappno: "",
    address1: "",
    address2: "",
    pincode: "",
    district: "",
    state: "",
    landmark: "",
    products: [],
    walkin: "no",
    chekin: "no",
    courier: "no",
  });
  const [loginDetails, setLoginDetails] = useState({ name: "", password: "" });

  useEffect(() => {
    fetch("/admin.json")
      .then((response) => response.json())
      .then((data) => setAdminData(data))
      .catch((error) => console.error("Error loading admin data:", error));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const admin = adminData.find(
      (user) =>
        user.name === loginDetails.name && user.password === loginDetails.password
    );

    if (admin) {
      setLoggedIn(true);
    } else {
      alert("Invalid username or password!");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProductChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      products: checked
        ? [...prevState.products, value]
        : prevState.products.filter((product) => product !== value),
    }));
  };

  const handleAddUser = () => {
    if (!formData.id.trim() || !formData.name.trim() || !formData.email.trim() || !formData.password.trim() || !formData.mobileno.trim()) {
      alert("Some Inputs cannot be empty! Please enter valid values.");
      return;
    }
  
    fetch("https://dreamik-intern.onrender.com/addReseller", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Reseller ID already exists") {
          alert("User ID already exists! Please use a different ID.");
        } else if (data.message === "Email already exists") {
          alert("Email already exists! Please use a different email.");
        } else {
          alert("User added successfully!");
          setFormData({
            name: "",
            id: "",
            email: "",
            password: "",
            mobileno: "",
            whatsappno: "",
            address1: "",
            address2: "",
            pincode: "",
            district: "",
            state: "",
            landmark: "",
            products: [],
            walkin: "no",
            chekin: "no",
            courier: "no",
          });
        }
      })
      .catch((error) => console.error("Error adding user:", error));
  };
  

  const handleEditUser = async () => {
    if (!selectedUserName.trim() || !selectedUserPassword.trim()) {
      alert("⚠️ Please enter a Username and Password.");
      return;
    }
    try {
      const response = await fetch("https://dreamik-intern.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: selectedUserName, password:selectedUserPassword }),
      });

      const userData = await response.json();

      if (userData.success) {
        setFormData({
          id: userData.user.id || "",
          name: userData.user.name || "",
          email: userData.user.email || "",
          password: userData.user.password || "", 
          mobileno: userData.user.mobileno || "",
          whatsappno: userData.user.whatsappno || "",
          products: Array.isArray(userData.user.products)
          ? userData.user.products
          : JSON.parse(userData.user.products || "[]"),
          walkin: userData.user.walkin || "no",
          chekin: userData.user.chekin || "no",
          courier: userData.user.courier || "no"
        });
        console.log(userData.user);
      } else {
        alert("❌ There is no such a Reseller Details!");
      }
    } catch (error) {
      console.error("Error:", error);
    } 
  };
  const handleUpdateUser = () => {
    if (!formData.id.trim() || !formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      alert("Some inputs cannot be empty! Please enter valid values.");
      return;
    }
  
    fetch(`https://dreamik-intern.onrender.com/updateReseller/${formData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "User not found") {
          alert("User not found! Please check the ID.");
        } else if (data.message === "User updated successfully") {
          alert("User updated successfully!");
          setFormData({
            name: "",
            id: "",
            email: "",
            password: "",
            mobileno: "",
            whatsappno: "",
            address1: "",
            address2: "",
            pincode: "",
            district: "",
            state: "",
            landmark: "",
            products: [],
            walkin: "no",
            chekin: "no",
            courier: "no",
          });
        } else {
          alert("Failed to update user.");
        }
      })
      .catch((error) => console.error("Error updating user:", error));
  };
  const handleDeleteUser = async () => {
    if (!formData.id) {
      alert("Invalid User ID!");
      return;
    }
  
    const confirmDelete = window.confirm("⚠️ Are you sure you want to delete this reseller?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`https://dreamik-intern.onrender.com/deleteReseller/${formData.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const result = await response.json();
  
      if (result.message==='Reseller deleted successfully') {
        alert("✅ Reseller deleted successfully!");
        // Refresh the user list after deletion (Modify according to your state management)
        // setUsers((prevUsers) => prevUsers.filter((user) => user.id !== formData.id));
      } else {
        alert("❌ Failed to delete reseller. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("❌ Error deleting reseller. Check console for details.");
    }
  };
  

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Panel</h1>
      {!loggedIn ? (
        <form className="admin-login-form" onSubmit={handleLogin}>
          <input type="text" className="admin-input" name="name" placeholder="Admin Name" value={loginDetails.name} onChange={(e) => setLoginDetails({ ...loginDetails, name: e.target.value })} required />
          <input type="password" className="admin-input" name="password" placeholder="Password" value={loginDetails.password} onChange={(e) => setLoginDetails({ ...loginDetails, password: e.target.value })} required />
          <button className="admin-button" type="submit">Login</button>
        </form>
      ) : action === "" ? (
        <div className="admin-action-selection">
          <h2>Select an Action</h2>
          <button className="admin-button" onClick={() => setAction("addUser")}>Add User</button>
          <button className="admin-button" onClick={() => setAction("editUser")}>Edit User</button>
          <button className="admin-button" onClick={() => navigate("/admincoupontable")}>Coupon Management</button>
        </div>
      ) : action === "addUser" ? (
        <>
                   <h2 className="admin-subtitle">Enter User Details</h2>
                   <form className="admin-user-form">
                     <input type="text" className="admin-input" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                     <input type="text" className="admin-input" name="id" placeholder="ID" value={formData.id} onChange={handleChange} required />
                     <input type="email" className="admin-input" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                     <input type="password" className="admin-input" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                     <input type="number" className="admin-input" name="mobileno" placeholder="Mobile No" value={formData.mobileno} onChange={handleChange} required style={{width:'100%'}}/>
                     <input type="number" className="admin-input" name="whatsappno" placeholder="WhatsApp No" value={formData.whatsappno} onChange={handleChange} required style={{width:'100%'}}/>
                   
                     <label className="admin-label">Products:(only they can order)</label>
                   <div className="admin-product-checkboxes" >
                      {["Name Slips", "Cutout Nameslip", "Bulk Order", "Custom Name Slips", "Customizable Posters", "Customizable Bag Tags", "Customizable Stickers", "Customizable Fridge Magnets", "Notebooks", "AI Prompt Generating Nameslips", "Customizable Pencil Engraving","Dreamik Glossy Inkjet/Laser printer"].map((product) => (
                        <h5 key={product}>
                          <input type="checkbox" value={product} onChange={handleProductChange} checked={formData.products.includes(product)} /> {product}
                        </h5>
                      ))}
                    </div>
        
                    <label className="admin-label">Walk-in:</label>
                    <select name="walkin" className="admin-select" value={formData.walkin} onChange={handleChange}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
        
                    <label className="admin-label">Check-in:</label>
                    <select name="chekin" className="admin-select" value={formData.walkin}onChange={handleChange}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
        
                    <label className="admin-label">Courier:</label>
                    <select name="courier" className="admin-select" value={formData.walkin} onChange={handleChange}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
        
                    <button type="button" className="admin-button" onClick={handleAddUser}>Add User</button>
                  </form>
                  <button className="admin-button" onClick={() => setAction("")}>Back</button>
                </>
      ) : 
        // <h2>Feature not implemented yet!</h2>
        action === "editUser" ? (
          <>
            <h2>Edit User</h2>
            <input type="text" placeholder="Enter User Name" value={selectedUserName} onChange={(e) => setSelectedUserName(e.target.value)} />
            <input type="text" placeholder="Enter User Password" value={selectedUserPassword} onChange={(e) => setSelectedUserPassword(e.target.value)}/>
            <button onClick={handleEditUser}>Fetch User Details</button>
            {formData.id && (
              <form className="admin-user-form">
                <input type="text" className="admin-input" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                <input type="text" className="admin-input" name="id" placeholder="ID" value={formData.id} onChange={handleChange} required />
                <input type="email" className="admin-input" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="password" className="admin-input" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <input type="number" className="admin-input" name="mobileno" placeholder="Mobile No" value={formData.mobileno} onChange={handleChange} required style={{width:'100%'}}/>
                <input type="number" className="admin-input" name="whatsappno" placeholder="WhatsApp No" value={formData.whatsappno} onChange={handleChange} required style={{width:'100%'}}/>
              
                <label className="admin-label">Products:(only they can order)</label>
                <div className="admin-product-checkboxes">
                    {["Name Slips", "Cutout Nameslip", "Bulk Order", "Custom Name Slips", "Customizable Posters", "Customizable Bag Tags", "Customizable Stickers", "Customizable Fridge Magnets", "Notebooks", "AI Prompt Generating Nameslips", "Customizable Pencil Engraving","Dreamik Glossy Inkjet/Laser printer"].map((product) => (
                      <h5 key={product}>
                        <input type="checkbox" value={product} onChange={handleProductChange} checked={formData.products.includes(product)} /> {product}
                      </h5>
                    ))}
                </div>

                <label className="admin-label">Walk-in:</label>
                <select name="walkin" className="admin-select" value={formData.walkin} onChange={handleChange}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>

                <label className="admin-label">Check-in:</label>
                <select name="chekin" className="admin-select" value={formData.chekin} onChange={handleChange}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>

                <label className="admin-label">Courier:</label>
                <select name="courier" className="admin-select" value={formData.courier} onChange={handleChange}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>

                <button type="button" className="admin-button" onClick={handleUpdateUser}>Update User</button>
                Reseller delete:
                <button type="button" className="admin-button" onClick={handleDeleteUser} style={{backgroundColor:'red'}}>Delete User</button>
              </form>
            )}
            <button className="admin-button" onClick={() => setAction("")}>Back</button>
          </>
        ):(
           <h2>Implement</h2>
      )}
    </div>
  );
};

export default Adminpanel;