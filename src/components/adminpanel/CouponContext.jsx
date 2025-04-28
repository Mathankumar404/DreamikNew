import React, { createContext, useContext, useState} from "react";
const CouponContext = createContext();

export const CouponProvider = ({ children }) => {
    const [coupons, setCoupons] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editedCoupon, setEditedCoupon] = useState({});
    const [loading, setLoading] = useState(false);
    const [addingNew, setAddingNew] = useState(false);
    const [newCoupon, setNewCoupon] = useState({
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


    return (
        <CouponContext.Provider
            value={{
                coupons,
                setCoupons,
                editingId,
                setEditingId,
                editedCoupon,
                setEditedCoupon,
                loading,
                setLoading,
                addingNew,
                setAddingNew,
                newCoupon,
                setNewCoupon,
            }}
        >
            {children}
        </CouponContext.Provider>
    );
};

export const useCouponContext = () => useContext(CouponContext);
