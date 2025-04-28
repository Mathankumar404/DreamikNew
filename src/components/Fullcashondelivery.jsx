import React, { useState } from 'react';

const Fullcashondelivery = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        pincode: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateEmail = (email) => {
        return email.endsWith('@gmail.com');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, email, phone, pincode } = formData;

        if (!name || !email || !phone || !pincode) {
            alert('Please enter all details');
            return;
        }

        if (!validateEmail(email)) {
            alert('Please enter a correct mail ID');
            return;
        }

        if (phone.length !== 10) {
            alert('Please enter a valid mobile number');
            return;
        }

        if (pincode.length !== 6) {
            alert('Please enter a valid pincode');
            return;
        }

        const date = new Date();
        const newDate = `${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
        const fileName = `${name}${newDate}.txt`;

        console.log(fileName);

        alert("Your Information Has Been Received Successfully!\nOur Team Will Contact You Through Mail To Give You the Reseller Details!");
    };

    return (
        <div id="fcod">
            <h2>Please Fill The Form To Contact The Resellers Near You</h2>
            <div id="form-container">
                <h2 className="topic">User Details</h2>
                <form id="address-form" onSubmit={handleSubmit}>
                    <label htmlFor="name">Name:</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        required 
                        value={formData.name} 
                        onChange={handleChange} 
                    />

                    <label htmlFor="email">Email:</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                    />

                    <label htmlFor="phone">Phone Number:</label>
                    <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        required 
                        value={formData.phone} 
                        onChange={handleChange} 
                    />

                    <label htmlFor="pincode">Pincode:</label>
                    <input 
                        type="text" 
                        id="pincode" 
                        name="pincode" 
                        maxLength="6" 
                        required 
                        value={formData.pincode} 
                        onChange={handleChange} 
                    />

                    <button type="submit" id="proceedtopay">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default Fullcashondelivery;
