// frontend/src/components/CustomerForm.js
import React from 'react';

const CustomerForm = ({ formData, setFormData }) => {
  return (
    <div>
      <h3>Customer Information</h3>
      <input
        type="text"
        placeholder="Company Name"
        value={formData.customerName}
        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
      />
      <input
        type="text"
        placeholder="Contact Person"
        value={formData.contact}
        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
    </div>
  );
};

export default CustomerForm;
