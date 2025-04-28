import {React,useEffect} from "react";
import axios from "axios";
import { useCouponContext } from "./CouponContext";

const AdminCouponTable = () => {
    const {
        coupons,
        setCoupons,
        setEditingId,
        editingId,
        editedCoupon,
        setEditedCoupon,
        loading,
        setLoading,
        addingNew,
        setAddingNew,
        newCoupon,
        setNewCoupon,
    } = useCouponContext();

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const response = await axios.get("https://dreamik-intern.onrender.com/api/coupons");
            setCoupons(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching coupons:", error);
            setCoupons([]);
        }
        setLoading(false);
    };
    console.log(coupons);

    const handleEdit = (coupon) => {
        setEditingId(coupon.id);
        setEditedCoupon({ ...coupon });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditedCoupon({});
    };

    const handleChange = (e, field, isNew = false) => {
        if (isNew) {
            setNewCoupon({ ...newCoupon, [field]: e.target.value });
        } else {
            setEditedCoupon({ ...editedCoupon, [field]: e.target.value });
        }
    };

    const handleSave = async () => {
        try {
            await axios.put(`https://dreamik-intern.onrender.com/api/coupons/${editingId}`, editedCoupon);
            setEditingId(null);
            fetchCoupons();
        } catch (error) {
            console.error("Error updating coupon:", error);
        }
    };

    const handleAddNew = () => setAddingNew(true);

    const handleCancelAdd = () => {
        setAddingNew(false);
        setNewCoupon({
            coupon_name: "",
            coupon_code: "",
            coupon_value: "",
            coupon_discount_mode: "0",
            coupon_start: "",
            coupon_end: "",
            coupon_count: "",
            coupon_usage_count: "",
            coupon_status: "Active",
            coupon_applicable_products: "",
        });
    };

    const handleSaveNew = async () => {
        try {
            await axios.post("https://dreamik-intern.onrender.com/api/newcoupons", newCoupon);
            setAddingNew(false);
            fetchCoupons();
        } catch (error) {
            console.error("Error adding new coupon:", error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB");
    };

    return (
        <main className="main-container">
            <h2 className="heading">Manage Coupons</h2>
            <div className="table-container">
                {loading ? (
                    <div className="loading-spinner">
                        <p>Loading Coupons...</p>
                    </div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Code</th>
                                <th>Value</th>
                                <th>Mode</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Count</th>
                                <th>Usage Count</th>
                                <th>Status</th>
                                <th>Applicable Products</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.length > 0 ? (
                                coupons.map((coupon) => (
                                    <tr key={coupon.id}>
                                        <td>
                                            {editingId === coupon.id ? (
                                                <input type="text" className="input" value={editedCoupon.coupon_name} onChange={(e) => handleChange(e, "coupon_name")} />
                                            ) : (
                                                coupon.coupon_name
                                            )}
                                        </td>
                                        <td className="font-mono">{coupon.coupon_code}</td>
                                        <td>
                                            {editingId === coupon.id ? (
                                                <input type="number" className="input" value={editedCoupon.coupon_value} onChange={(e) => handleChange(e, "coupon_value")} />
                                            ) : (
                                                `₹${coupon.coupon_value}`
                                            )}
                                        </td>
                                        <td>
                                            {editingId === coupon.id ? (
                                                <select className="select" value={editedCoupon.coupon_discount_mode} onChange={(e) => handleChange(e, "coupon_discount_mode")}>
                                                    <option value="true">Percent</option>
                                                    <option value="false">Rupees</option>
                                                </select>
                                            ) : (
                                                coupon.coupon_discount_mode ? "%" : "₹"
                                            )}
                                        </td>
                                        <td>{formatDate(coupon.coupon_start)}</td>
                                        <td>{formatDate(coupon.coupon_end)}</td>
                                        <td>{coupon.coupon_count}</td>
                                        <td>{coupon.coupon_usage_count}</td>
                                        <td>{coupon.coupon_status}</td>
                                        <td className="applicable-products">
                                            {editingId === coupon.id ? (
                                                <input type="text" className="input" value={editedCoupon.coupon_applicable_products} onChange={(e) => handleChange(e, "coupon_applicable_products")} />
                                            ) : (
                                                coupon.coupon_applicable_products
                                            )}
                                        </td>
                                        <td>
                                            {editingId === coupon.id ? (
                                                <>
                                                    <button className="btn btn-save" onClick={handleSave}>Save</button>
                                                    <button className="btn btn-cancel" onClick={handleCancelEdit}>✕</button>
                                                </>
                                            ) : (
                                                <button className="btn btn-edit" onClick={() => handleEdit(coupon)}>Edit</button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="11" className="text-center py-8 text-gray-500">No coupons available</td>
                                </tr>
                            )}
                            {addingNew && (
                                <tr>
                                    <td><input type="text" className="input" value={newCoupon.coupon_name} onChange={(e) => handleChange(e, "coupon_name", true)} /></td>
                                    <td><input type="text" className="input" value={newCoupon.coupon_code} onChange={(e) => handleChange(e, "coupon_code", true)} /></td>
                                    <td><input type="number" className="input" value={newCoupon.coupon_value} onChange={(e) => handleChange(e, "coupon_value", true)} /></td>
                                    <td>
                                        <select className="select" value={newCoupon.coupon_discount_mode} onChange={(e) => handleChange(e, "coupon_discount_mode", true)}>
                                            <option value="1">Percent</option>
                                            <option value="0">Rupees</option>
                                        </select>
                                    </td>
                                    <td><input type="date" className="input" value={newCoupon.coupon_start} onChange={(e) => handleChange(e, "coupon_start", true)} /></td>
                                    <td><input type="date" className="input" value={newCoupon.coupon_end} onChange={(e) => handleChange(e, "coupon_end", true)} /></td>
                                    <td><input type="number" className="input" value={newCoupon.coupon_count} onChange={(e) => handleChange(e, "coupon_count", true)} /></td>
                                    <td><input type="number" className="input" value={newCoupon.coupon_usage_count} onChange={(e) => handleChange(e, "coupon_usage_count", true)} /></td> {/* ✅ New field */}
                                    <td>
                                        <select className="select" value={newCoupon.coupon_status} onChange={(e) => handleChange(e, "coupon_status", true)}>
                                            <option value="Active">Active</option>
                                            <option value="Expired">Inactive</option>
                                        </select>
                                    </td>
                                    <td><input type="text" className="input" value={newCoupon.coupon_applicable_products} onChange={(e) => handleChange(e, "coupon_applicable_products", true)} /></td>
                                    <td>
                                        <button className="btn btn-save" onClick={handleSaveNew}>Save</button>
                                        <button className="btn btn-cancel" onClick={handleCancelAdd}>✕</button>
                                    </td>
                                </tr>
                            )}

                        </tbody>

                    </table>
                )}
            </div>
            <br />
            {!addingNew && <button className="btn btn-add" onClick={handleAddNew}>Add Coupon</button>}

        </main>
    );
};

export default AdminCouponTable;