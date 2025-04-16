import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';

const QuoteForm = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    contact: '',
    email: '',
    title: '',
    reference: '',
    validUntil: '',
    specifications: '',
    communication: '',
    productData: {
      ProfileType: '',
      Alloy: '',
      Weight_per_meter: '',
      Total_length: '',
      SurfaceTreatment: '',
      MachiningComplexity: ''
    }
  });

  const [predictedPrice, setPredictedPrice] = useState(null);
  const [generatedText, setGeneratedText] = useState('');
  const [uploadedFileNames, setUploadedFileNames] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [newCustomer, setNewCustomer] = useState({ name: '', contact: '', email: '' });

  useEffect(() => {
    fetch('http://localhost:5050/api/customers')
      .then(res => res.json())
      .then(data => setCustomers(data))
      .catch(err => console.error('Error loading customers', err));
  }, []);

  // ✅ Sync formData fields when customer is selected
  useEffect(() => {
    if (selectedCustomerId) {
      const customer = customers.find(c => c._id === selectedCustomerId);
      if (customer) {
        setFormData(prev => ({
          ...prev,
          customerName: customer.name || '',
          contact: customer.contact || '',
          email: customer.email || ''
        }));
      }
    }
  }, [selectedCustomerId, customers]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleProductChange = (field, value) => {
    setFormData({
      ...formData,
      productData: { ...formData.productData, [field]: value }
    });
  };

  const uploadFiles = async (selectedFiles) => {
    try {
      const uploaded = [];

      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('http://localhost:5050/api/upload', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();
        if (response.ok) {
          uploaded.push(data.file);
        } else {
          console.error('File upload failed for:', file.name);
        }
      }

      setUploadedFileNames(prev => [...prev, ...uploaded]);
      alert('✅ Files uploaded!');
    } catch (error) {
      console.error('❌ Upload error:', error);
    }
  };

  const handleNewCustomerSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5050/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer)
      });

      const data = await response.json();
      if (response.ok) {
        setCustomers([...customers, data]);
        setSelectedCustomerId(data._id);
        alert('✅ New customer created!');
        setNewCustomer({ name: '', contact: '', email: '' });
      } else {
        alert('❌ Could not create customer');
      }
    } catch (error) {
      console.error('❌ Customer creation error:', error);
    }
  };

  const sendEmail = async () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(14);
      doc.text(`Quote Title: ${formData.title}`, 10, 10);
      doc.text(`Contact Person: ${formData.contact}`, 10, 20);
      doc.text(`Valid Until: ${formData.validUntil}`, 10, 30);
      doc.text(`Predicted Price: ${predictedPrice} SEK`, 10, 40);

      const quoteLines = doc.splitTextToSize(generatedText, 180);
      doc.text(quoteLines, 10, 50);

      const pdfBase64 = doc.output('datauristring');

      const response = await fetch('http://localhost:5050/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: formData.email,
          subject: `Your Quote: ${formData.title}`,
          text: generatedText,
          pdfBase64,
          filename: `Quote_${formData.title || 'Generated'}.pdf`
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('📧 Email sent to customer!');
      } else {
        console.error('❌ Email send error:', data);
        alert('❌ Failed to send email');
      }
    } catch (err) {
      console.error('❌ Error sending email:', err);
      alert('Something went wrong');
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        customerId: selectedCustomerId,
        title: formData.title,
        reference: formData.reference,
        validUntil: formData.validUntil,
        specifications: formData.specifications,
        communication: formData.communication,
        productData: formData.productData,
        files: uploadedFileNames
      };

      console.log('📤 Submitting payload:', payload);

      const response = await fetch('http://localhost:5050/api/quotes/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setPredictedPrice(data.predictedPrice);
        setGeneratedText(data.generatedQuoteText);
      } else {
        alert('❌ Quote creation failed');
        console.error(data);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Something went wrong.');
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Quote Title: ${formData.title}`, 10, 10);
    doc.text(`Contact Person: ${formData.contact}`, 10, 20);
    doc.text(`Valid Until: ${formData.validUntil}`, 10, 30);
    doc.text(`Predicted Price: ${predictedPrice} SEK`, 10, 40);

    const quoteLines = doc.splitTextToSize(generatedText, 180);
    doc.text(quoteLines, 10, 50);

    doc.save(`Quote_${formData.title || 'Generated'}.pdf`);
  };

  return (
    <div className="container">
      <h2>🧾 Create New Quote</h2>

      <h4>Select Customer</h4>
      <select value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)}>
        <option value="">-- Choose Customer --</option>
        {customers.map((cust) => (
          <option key={cust._id} value={cust._id}>
            {cust.name} ({cust.contact})
          </option>
        ))}
      </select>

      <h4>Or Add New Customer</h4>
      <input type="text" placeholder="Name" value={newCustomer.name} onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })} /><br />
      <input type="text" placeholder="Contact" value={newCustomer.contact} onChange={(e) => setNewCustomer({ ...newCustomer, contact: e.target.value })} /><br />
      <input type="email" placeholder="Email" value={newCustomer.email} onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })} /><br />
      <button onClick={handleNewCustomerSubmit}>Add Customer</button>

      <h4>Quote Details</h4>
      <input type="text" placeholder="Quote Title" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} /><br />
      <input type="text" placeholder="Reference" value={formData.reference} onChange={(e) => handleChange('reference', e.target.value)} /><br />
      <input type="date" value={formData.validUntil} onChange={(e) => handleChange('validUntil', e.target.value)} /><br />

      <h4>Product Specifications</h4>
      <textarea placeholder="Specifications" value={formData.specifications} onChange={(e) => handleChange('specifications', e.target.value)} /><br />
      <input type="text" placeholder="Profile Type" onChange={(e) => handleProductChange('ProfileType', e.target.value)} /><br />
      <input type="text" placeholder="Alloy" onChange={(e) => handleProductChange('Alloy', e.target.value)} /><br />
      <input type="number" placeholder="Weight per meter" onChange={(e) => handleProductChange('Weight_per_meter', parseFloat(e.target.value))} /><br />
      <input type="number" placeholder="Total length" onChange={(e) => handleProductChange('Total_length', parseFloat(e.target.value))} /><br />
      <input type="text" placeholder="Surface Treatment" onChange={(e) => handleProductChange('SurfaceTreatment', e.target.value)} /><br />
      <input type="text" placeholder="Machining Complexity" onChange={(e) => handleProductChange('MachiningComplexity', e.target.value)} /><br />

      <h4>Customer Communication</h4>
      <textarea placeholder="Paste email excerpts or meeting notes" value={formData.communication} onChange={(e) => handleChange('communication', e.target.value)} /><br />

      <h4>Upload Files</h4>
      <input type="file" multiple onChange={(e) => uploadFiles(Array.from(e.target.files))} /><br />

      {uploadedFileNames.length > 0 && (
        <div>
          <p>Uploaded:</p>
          <ul>
            {uploadedFileNames.map((name, idx) => (
              <li key={idx}>{name}</li>
            ))}
          </ul>
        </div>
      )}

      <br />
      <button onClick={handleSubmit}>Submit Quote</button>

      {predictedPrice && (
        <div style={{ marginTop: '30px', padding: '20px', background: '#f4f4f4', borderRadius: '8px' }}>
          <h3>📊 Predicted Price: {predictedPrice} SEK</h3>
          <h4>📝 Edit Quote Text:</h4>
          <textarea
            style={{ width: '100%', minHeight: '200px' }}
            value={generatedText}
            onChange={(e) => setGeneratedText(e.target.value)}
          />
          <button onClick={downloadPDF} style={{ marginTop: '10px' }}>
            📄 Download PDF
          </button>
          <button onClick={sendEmail} style={{ marginLeft: '10px' }}>
            📧 Send Quote via Email
          </button>
        </div>
      )}
    </div>
  );
};

export default QuoteForm;
