import { useEffect, useState } from "react";
import "./ProductDialog.css";

function ProductDialog({ close }) {

    const [companies, setCompanies] = useState([]);
    const [companyId, setCompanyId] = useState("");

    const [productName, setProductName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [numberOfItems, setNumberOfItems] = useState("");
    const [retailPrice, setRetailPrice] = useState("");

    // Load companies from SQL
    useEffect(() => {

        const loadCompanies = async () => {

            try {

                const response = await fetch(
                    "http://127.0.0.1:8000/companies"
                );

                const result = await response.json();

                if (response.ok) {
                    setCompanies(result);
                } else {
                    alert(result.error || "Could not load companies");
                }

            } catch (error) {

                console.error(error);
                alert("Cannot connect to Flask");

            }
        };

        loadCompanies();

    }, []);


    // Save product
    const saveProduct = async () => {

        if (
            !companyId ||
            !productName ||
            !quantity ||
            !numberOfItems ||
            !retailPrice
        ) {
            alert("Please fill all product fields");
            return;
        }

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/products",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        company_id: Number(companyId),
                        product_name: productName,
                        quantity: quantity,
                        number_of_items: Number(numberOfItems),
                        retail_price: Number(retailPrice)
                    })
                }
            );

            const result = await response.json();

            if (response.ok) {

                alert(
                    "Product added successfully\nSerial Code: " +
                    result.serial_code
                );

                close();

            } else {

                alert(result.message || result.error);

            }

        } catch (error) {

            console.error(error);
            alert("Cannot connect to Flask");

        }
    };


    return (
        <div className="product-overlay">

            <div className="product-dialog">

                <div className="product-header">

                    <h2>Add Product</h2>

                    <button
                        className="product-close"
                        onClick={close}
                    >
                        ×
                    </button>

                </div>


                <div className="product-form">

                    {/* COMPANY */}

                    <label>Company</label>

                    <select
                        value={companyId}
                        onChange={(e) =>
                            setCompanyId(e.target.value)
                        }
                    >

                        <option value="">
                            Select Company
                        </option>

                        {companies.map((company) => (
                            <option
                                key={company.id}
                                value={company.id}
                            >
                                {company.company_name}
                            </option>
                        ))}

                    </select>


                    {/* PRODUCT NAME */}

                    <label>Product Name</label>

                    <input
                        type="text"
                        placeholder="Enter product name"
                        value={productName}
                        onChange={(e) =>
                            setProductName(e.target.value)
                        }
                    />


                    {/* QUANTITY */}

                    <label>Quantity</label>

                    <input
                        type="text"
                        placeholder="Example: 10 x 40"
                        value={quantity}
                        onChange={(e) =>
                            setQuantity(e.target.value)
                        }
                    />


                    {/* NUMBER OF ITEMS */}

                    <label>Number of Items</label>

                    <input
                        type="number"
                        placeholder="Enter number of items"
                        value={numberOfItems}
                        onChange={(e) =>
                            setNumberOfItems(e.target.value)
                        }
                    />


                    {/* RETAIL PRICE */}

                    <label>Retail Price</label>

                    <input
                        type="number"
                        placeholder="Enter retail price"
                        value={retailPrice}
                        onChange={(e) =>
                            setRetailPrice(e.target.value)
                        }
                    />


                    <button
                        className="product-save"
                        onClick={saveProduct}
                    >
                        Save Product
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ProductDialog;