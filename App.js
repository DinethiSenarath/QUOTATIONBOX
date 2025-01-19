import React, { useState } from "react";
import jsPDF from "jspdf";
import "./styles.css";
import logo from "./images/logoa.png";




const AccountingDashboard = () => {
  const [activeMenu, setActiveMenu] = useState("quotation");
  const [formData, setFormData] = useState({
    quotationNumber: "",
    date: "",
    clientName: "",
    clientAddress: "",
    items: [{ description: "", quantity: "", unitPrice: "", amount: "" }],
    subtotal: 0,
    tax: 0,
    total: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;

    if (field === "quantity" || field === "unitPrice") {
      const quantity = parseFloat(updatedItems[index].quantity) || 0;
      const unitPrice = parseFloat(updatedItems[index].unitPrice) || 0;
      updatedItems[index].amount = (quantity * unitPrice).toFixed(2);
    }

    const subtotal = updatedItems.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );

    setFormData({
      ...formData,
      items: updatedItems,
      subtotal: subtotal.toFixed(2),
      total: (subtotal + parseFloat(formData.tax || 0)).toFixed(2),
    });
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { description: "", quantity: "", unitPrice: "", amount: "" },
      ],
    }));
  };

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    const subtotal = updatedItems.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );

    setFormData({
      ...formData,
      items: updatedItems,
      subtotal: subtotal.toFixed(2),
      total: (subtotal + parseFloat(formData.tax || 0)).toFixed(2),
    });
  };

  const handleTaxChange = (e) => {
    const tax = parseFloat(e.target.value) || 0;
    const total = parseFloat(formData.subtotal) + tax;
    setFormData({
      ...formData,
      tax: tax.toFixed(2),
      total: total.toFixed(2),
    });
  };

  const downloadInvoice = () => {
    const doc = new jsPDF();
  
    // Set custom colors
    const primaryColor = "#4CAF50"; // Green
    const secondaryColor = "#f4f4f4"; // Light Gray
    const textColor = "#333333"; // Dark Gray
  
    // Add logo
    const img = new Image();
    img.src = require("./images/logoa.png");
    img.onload = () => {
      // Header
      doc.addImage(img, "PNG", 10, 10, 30, 30);
      doc.setFontSize(20);
      doc.setTextColor(primaryColor);
      doc.setFont("helvetica", "bold");
      doc.text("           QUOTATIONBOX", 50, 20);
  
      doc.setFontSize(12);
      doc.setTextColor(textColor);
      doc.text(`Quotation Number: ${formData.quotationNumber}`, 10, 50);
      doc.text(`Date: ${formData.date}`, 10, 60);
      doc.text(`Client Name: ${formData.clientName}`, 10, 70);
      doc.text(`Client Address: ${formData.clientAddress}`, 10, 80);
  
      // Table Header
      let y = 100;
      doc.setFillColor(primaryColor);
      doc.setTextColor("#FFFFFF");
      doc.rect(10, y, 190, 10, "F");
      doc.text("Description", 15, y + 7);
      doc.text("Quantity", 75, y + 7);
      doc.text("Unit Price", 115, y + 7);
      doc.text("Amount", 165, y + 7);
  
      // Table Rows
      y += 10;
      doc.setFontSize(10);
      doc.setTextColor(textColor);
      formData.items.forEach((item, index) => {
        doc.setFillColor(index % 2 === 0 ? secondaryColor : "#FFFFFF"); // Alternate row colors
        doc.rect(10, y, 190, 10, "F");
  
        doc.text(item.description, 15, y + 7);
        doc.text(item.quantity, 75, y + 7);
        doc.text(`$${item.unitPrice}`, 115, y + 7);
        doc.text(`$${item.amount}`, 165, y + 7);
  
        y += 10;
      });
  
      // Totals Section
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor);
      doc.text("Subtotal", 120, y);
      doc.text(`$${formData.subtotal}`, 165, y);
  
     
      y += 10;
      doc.text("Total", 120, y);
      doc.text(`$${formData.total}`, 165, y);
  
      // Footer
      y += 20;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor("#666666");
      doc.text("Thank you for your business!", 10, y);
  
      // Save PDF
      doc.save("invoice.pdf");
    };
  };
  
  
  

  const saveQuotation = () => {
    localStorage.setItem("savedQuotation", JSON.stringify(formData));
    alert("Quotation saved successfully!");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
        <img src={logo} alt="Logo" className="logo" />
          <h1>QUOTATIONBOX</h1>
        </div>
        <div className="menu">
          <button
            onClick={() => setActiveMenu("quotation")}
            className={`menu-button ${
              activeMenu === "quotation" ? "active" : ""
            }`}
          >
            Quotation
          </button>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeMenu === "quotation" && (
          <div className="quotation-form">
            <h2 className="form-title">Quotation</h2>
            <div className="form-grid">
              <div>
              <label className="block font-medium mb-2">Quotation Number</label>

                <input
                  type="text"
                  name="quotationNumber"
                  placeholder="Quotation Number"
                  value={formData.quotationNumber}
                  onChange={handleInputChange}
                  className="form-input"
                />


              </div>
              
              <div>
              <label className="block font-medium mb-2">Client Address</label>

                <input
                  type="text"
                  name="clientAddress"
                  placeholder=" Client Address"
                  value={formData.clientAddress}
                  onChange={handleInputChange}
                  className="form-input"
                />
                </div>


              <div>
              <label className="block font-medium mb-2">Client Name</label>

                <input
                  type="text"
                  name="clientName"
                  placeholder="Client Name"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  className="form-input"
                />
                <label className="block font-medium mb-2">Email</label>

                <input
                  type="text"
                  name="Email"
                  placeholder="Email"
                  value={formData.Email}
                  onChange={handleInputChange}
                  className="form-input"
                />

                




              


                <div>
              <label className="block font-medium mb-2">Contact Number</label>

                <input
                  type="text"
                  name="Phone"
                  placeholder="Phone"
                  value={formData.Phone}
                  onChange={handleInputChange}
                  className="form-input"
                />

                
               <label className="block font-medium mb-2">Date</label>

                <input

                   type="date"
                   name="date"
                   value={formData.date}
                   onChange={handleInputChange}
                   className="form-input"
/>
                </div>


              </div>
            </div>
            <div className="item-list">
            <label className="block font-medium mb-2">Items</label>
            

              
              {formData.items.map((item, index) => (
                <div key={index} className="item-row">
                  <input
                    type="text"
                    placeholder="Description"
                    className="item-input"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(index, "description", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    className="item-input"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="Unit Price"
                    className="item-input"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(index, "unitPrice", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    className="item-input"
                    value={item.amount}
                    disabled
                  />
                  <button
                    onClick={() => removeItem(index)}
                    className="remove-item-button"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button onClick={addItem} className="add-item-button">
                Add Item
              </button>
            </div>
            <div className="totals">
             
              <p>Subtotal: ${formData.subtotal}</p>
              <p>Total: ${formData.total}</p>
            </div>
            <button onClick={downloadInvoice} className="download-button">
              Download PDF
            </button>

            <button onClick={saveQuotation} className="save-button">
              Save Quotation
            </button>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountingDashboard;
