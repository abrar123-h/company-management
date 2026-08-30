import { useEffect, useState } from "react";
import "./AssignStockDialog.css";

function AssignStockDialog({ close, vendorId: initialVendorId }) {

    const [vendors, setVendors] = useState([]);
    const [vendorId, setVendorId] = useState(initialVendorId || "");

    const [products, setProducts] = useState([]);
    const [productId, setProductId] = useState("");

    const [availableQuantity, setAvailableQuantity] = useState(0);
    const [assignQuantity, setAssignQuantity] = useState(0);
    const [paidAmount, setPaidAmount] = useState(0);

    const [loading, setLoading] = useState(false);


    // Load vendors and products
    useEffect(() => {

        const loadData = async () => {

            try {

                // Load vendors
                const vendorResponse = await fetch(
                    "http://127.0.0.1:8000/vendors"
                );

                const vendorData = await vendorResponse.json();

                if (vendorResponse.ok) {

                    setVendors(vendorData);

                } else {

                    alert(
                        vendorData.message ||
                        vendorData.error ||
                        "Unable to load vendors"
                    );

                }


                // Load products
                const productResponse = await fetch(
                    "http://127.0.0.1:8000/products"
                );

                const productData = await productResponse.json();

                if (productResponse.ok) {

                    setProducts(productData);

                } else {

                    alert(
                        productData.message ||
                        productData.error ||
                        "Unable to load products"
                    );

                }

            } catch (error) {

                console.error(error);

                alert("Cannot connect to Flask");

            }
        };

        loadData();

    }, []);


    // Product select
    const handleProductChange = (e) => {

        const id = e.target.value;

        setProductId(id);

        const selectedProduct = products.find(
            (product) =>
                String(product.id) === String(id)
        );

        if (selectedProduct) {

            setAvailableQuantity(
                Number(selectedProduct.quantity) || 0
            );

        } else {

            setAvailableQuantity(0);

        }

        setAssignQuantity(0);
    };


    // Remaining quantity
    const remainingQuantity =
        availableQuantity - assignQuantity;


    // Assign stock
    const assignStock = async () => {

        console.log("Vendor ID:", vendorId);
        console.log("Product ID:", productId);

        if (!vendorId) {

            alert("Please select a vendor first");

            return;
        }

        if (!productId) {

            alert("Please select a product");

            return;
        }

        if (!assignQuantity || assignQuantity <= 0) {

            alert("Please enter valid assign quantity");

            return;
        }

        if (assignQuantity > availableQuantity) {

            alert(
                "Assign quantity cannot be greater than available quantity"
            );

            return;
        }

        if (paidAmount < 0) {

            alert("Paid amount cannot be negative");

            return;
        }


        setLoading(true);

        try {

            const requestData = {

                vendor_id: Number(vendorId),

                product_id: Number(productId),

                quantity: Number(assignQuantity),

                paid_amount: Number(paidAmount)

            };


            console.log(
                "Sending to Flask:",
                requestData
            );


            const response = await fetch(
                "http://127.0.0.1:8000/vendors/assign-stock",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(requestData)
                }
            );


            const result = await response.json();


            console.log(
                "Flask response:",
                result
            );


            if (response.ok) {

                alert(
                    `Stock assigned successfully!\n\n` +
                    `Assigned: ${result.assigned_quantity}\n` +
                    `Remaining: ${result.remaining_quantity}\n` +
                    `Total Amount: ${result.total_amount}\n` +
                    `Paid: ${result.paid_amount}\n` +
                    `Credit: ${result.credit_amount}\n` +
                    `Status: ${result.payment_status}`
                );

                close();

            } else {

                alert(
                    result.message ||
                    result.error ||
                    "Stock assignment failed"
                );

            }

        } catch (error) {

            console.error(
                "ASSIGN STOCK ERROR:",
                error
            );

            alert("Cannot connect to Flask");

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="assign-stock-overlay">

            <div className="assign-stock-dialog">


                {/* HEADER */}

                <div className="assign-stock-header">

                    <h2>Assign Stock</h2>

                    <button
                        className="assign-stock-close"
                        onClick={close}
                    >
                        ×
                    </button>

                </div>


                {/* FORM */}

                <div className="assign-stock-form">


                    {/* VENDOR */}

                    <label>
                        Select Vendor
                    </label>

                    <select
                        value={vendorId}
                        onChange={(e) =>
                            setVendorId(e.target.value)
                        }
                    >

                        <option value="">
                            Select Vendor
                        </option>

                        {vendors.map((vendor) => (

                            <option
                                key={vendor.id || vendor.vendor_id}
                                value={
                                    vendor.id ||
                                    vendor.vendor_id
                                }
                            >
                                {
                                    vendor.vendor_name ||
                                    vendor.name
                                }
                            </option>

                        ))}

                    </select>


                    {/* PRODUCT */}

                    <label>
                        Select Product
                    </label>

                    <select
                        value={productId}
                        onChange={handleProductChange}
                    >

                        <option value="">
                            Select Product
                        </option>

                        {products.map((product) => (

                            <option
                                key={product.id}
                                value={product.id}
                            >
                                {product.product_name}
                            </option>

                        ))}

                    </select>


                    {/* AVAILABLE */}

                    <label>
                        Available Quantity
                    </label>

                    <input
                        type="number"
                        value={availableQuantity}
                        readOnly
                    />


                    {/* ASSIGN */}

                    <label>
                        Assign Quantity
                    </label>

                    <input
                        type="number"
                        min="1"
                        value={assignQuantity}
                        onChange={(e) =>
                            setAssignQuantity(
                                Number(e.target.value)
                            )
                        }
                        placeholder="Enter quantity"
                    />


                    {/* REMAINING */}

                    <label>
                        Remaining Quantity
                    </label>

                    <input
                        type="number"
                        value={
                            remainingQuantity >= 0
                                ? remainingQuantity
                                : 0
                        }
                        readOnly
                    />


                    {/* PAID */}

                    <label>
                        Paid Amount
                    </label>

                    <input
                        type="number"
                        min="0"
                        value={paidAmount}
                        onChange={(e) =>
                            setPaidAmount(
                                Number(e.target.value)
                            )
                        }
                        placeholder="Enter paid amount"
                    />


                    {/* BUTTON */}

                    <button
                        className="assign-stock-save"
                        onClick={assignStock}
                        disabled={loading}
                    >
                        {loading
                            ? "Assigning..."
                            : "Assign Stock"}
                    </button>

                </div>

            </div>

        </div>

    );
}

export default AssignStockDialog;