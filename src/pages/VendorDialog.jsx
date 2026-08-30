import { useState } from "react";
import "./VendorDialog.css";
import AssignStockDialog from "./AssignStockDialog";

function VendorDialog({ close, vendorId }) {

    const [vendorName, setVendorName] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [contact, setContact] = useState("");
    const [address, setAddress] = useState("");

    const [showAssignStock, setShowAssignStock] = useState(false);


    // ==============================
    // SAVE VENDOR
    // ==============================

    const saveVendor = async () => {

        if (!vendorName || !businessName || !contact || !address) {
            alert("Please fill all vendor fields");
            return;
        }

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/vendors",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        vendor_name: vendorName,
                        business_name: businessName,
                        contact: contact,
                        address: address
                    })
                }
            );

            const result = await response.json();

            if (response.ok) {

                alert("Vendor added successfully");

                setVendorName("");
                setBusinessName("");
                setContact("");
                setAddress("");

                close();

            } else {

                alert(result.message || result.error);

            }

        } catch (error) {

            console.error(error);

            alert("Cannot connect to Flask");

        }
    };


    
    // UI
    

    return (

        <div className="vendor-overlay">

            <div className="vendor-dialog">

                {/* HEADER */}

                <div className="vendor-header">

                    <h2>Add Vendor</h2>

                    <button
                        className="vendor-close"
                        onClick={close}
                    >
                        ×
                    </button>

                </div>


                {/* FORM */}

                <div className="vendor-form">

                    {/* VENDOR NAME */}

                    <label>
                        Vendor Name
                    </label>

                    <input
                        type="text"
                        placeholder="Enter vendor name"
                        value={vendorName}
                        onChange={(e) =>
                            setVendorName(e.target.value)
                        }
                    />


                    {/* BUSINESS NAME */}

                    <label>
                        Business Name
                    </label>

                    <input
                        type="text"
                        placeholder="Enter business name"
                        value={businessName}
                        onChange={(e) =>
                            setBusinessName(e.target.value)
                        }
                    />


                    {/* CONTACT */}

                    <label>
                        Vendor Contact
                    </label>

                    <input
                        type="text"
                        placeholder="Enter contact"
                        value={contact}
                        onChange={(e) =>
                            setContact(e.target.value)
                        }
                    />


                    {/* ADDRESS */}

                    <label>
                        Vendor Address
                    </label>

                    <textarea
                        placeholder="Enter vendor address"
                        value={address}
                        onChange={(e) =>
                            setAddress(e.target.value)
                        }
                    />


                    {/* SAVE VENDOR */}

                    <button
                        type="button"
                        className="vendor-save"
                        onClick={saveVendor}
                    >
                        Save Vendor
                    </button>


                    {/* ASSIGN STOCK */}

                    <button
                        type="button"
                        className="assign-stock-button"
                        onClick={() => setShowAssignStock(true)}
                    >
                        Assign Stock
                    </button>

                </div>


                {/* ASSIGN STOCK DIALOG */}

                {showAssignStock && (

                    <AssignStockDialog
                        vendorId={vendorId}
                        close={() => setShowAssignStock(false)}
                    />

                )}

            </div>

        </div>
    );
}

export default VendorDialog;