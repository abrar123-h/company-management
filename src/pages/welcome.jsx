
import { useEffect, useState } from "react";
import "./welcome.css";
import CompanyDialog from "./CompanyDialog";
import ProductDialog from "./ProductDialog"; 
import VendorDialog from "./VendorDialog";
import AssignStockDialog from "./AssignStockDialog"; 

function Welcome() {

    const [showCompany, setShowCompany] = useState(false);
    const [showProduct, setShowProduct] = useState(false);
    const [showVendor, setShowVendor] = useState(false);
    const [showAssignStock, setShowAssignStock] = useState(false);

    const [companyCount, setCompanyCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [vendorCount, setVendorCount] = useState(0);

    const [selectedVendor, setSelectedVendor] = useState(null);

    const [activeSection, setActiveSection] = useState("dashboard");

    const [companies, setCompanies] = useState([]);
    const [products, setProducts] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [stock, setStock] = useState([]);


    
    // LOAD COUNTS
    

   useEffect(() => {
    loadCounts();
    loadProducts();
}, []);

    const loadCounts = async () => {

        try {

            const companyResponse = await fetch(
                "http://127.0.0.1:8000/companies/count"
            );

            const companyData = await companyResponse.json();

            if (companyResponse.ok) {
                setCompanyCount(companyData.count || 0);
            }


            const productResponse = await fetch(
                "http://127.0.0.1:8000/products/count"
            );

            const productData = await productResponse.json();

            if (productResponse.ok) {
                setProductCount(productData.count || 0);
            }


            const vendorResponse = await fetch(
                "http://127.0.0.1:8000/vendors/count"
            );

            const vendorData = await vendorResponse.json();

            if (vendorResponse.ok) {
                setVendorCount(vendorData.count || 0);
            }

        } catch (error) {

            console.error("COUNT ERROR:", error);

        }
    };


    
    // LOAD COMPANIE
    

    const loadCompanies = async () => {

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/companies"
            );

            const data = await response.json();

            if (response.ok && Array.isArray(data)) {
                setCompanies(data);
            } else {
                console.error("COMPANIES ERROR:", data);
                setCompanies([]);
            }

        } catch (error) {

            console.error("COMPANIES ERROR:", error);
            setCompanies([]);

        }
    };



    // LOAD PRODUCTS
    

    const loadProducts = async () => {

    try {

        console.log("Loading products...");

        const response = await fetch(
            "http://127.0.0.1:8000/products"
        );

        console.log("Products API status:", response.status);

        const data = await response.json();

        console.log("Products API data:", data);

        if (!response.ok) {

            console.error("PRODUCTS API ERROR:", data);

            setProducts([]);

            return;
        }

        if (Array.isArray(data)) {

            setProducts(data);

        } else {

            console.error("PRODUCTS DATA IS NOT ARRAY:", data);

            setProducts([]);

        }

    } catch (error) {

        console.error("PRODUCTS FETCH ERROR:", error);

        setProducts([]);

    }
};


    
    // LOAD VENDORS
    

    const loadVendors = async () => {

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/vendors"
            );

            const data = await response.json();

            if (response.ok && Array.isArray(data)) {
                setVendors(data);
            } else {
                console.error("VENDORS ERROR:", data);
                setVendors([]);
            }

        } catch (error) {

            console.error("VENDORS ERROR:", error);
            setVendors([]);

        }
    };


    
    // LOAD ASSIGNED STOCK
    

    const loadStock = async () => {

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/vendors/assigned-stock"
            );

            const data = await response.json();

            if (response.ok) {

                setStock(Array.isArray(data) ? data : []);

            } else {

                console.error("STOCK ERROR:", data);

                setStock([]);

            }

        } catch (error) {

            console.error("STOCK ERROR:", error);

            setStock([]);

        }
    };


    
    // SIDEBAR
    

    const showDashboard = () => {

        setActiveSection("dashboard");

    };


    const showCompanies = () => {

        setActiveSection("companies");

        loadCompanies();

    };


    const showProducts = () => {

        setActiveSection("products");

        // Load products immediately when Products is clicked
        loadProducts();

    };


    const showVendors = () => {

        setActiveSection("vendors");

        loadVendors();

    };


    const showStock = () => {

        setActiveSection("stock");

        loadStock();

    };


    
    // VENDOR CREATED

    const handleVendorCreated = (vendor) => {

        console.log("NEW VENDOR RECEIVED:", vendor);

        setSelectedVendor(vendor);

        setShowVendor(false);

        setShowAssignStock(true);

        loadCounts();

        loadVendors();

    };


    return (

        <div className="welcome-container">


            {/* =================================================
                SIDE MENU
            ================================================= */}

            <div className="side-menu">

                <h2>
                    Company Management
                </h2>


                <button
                    className={
                        activeSection === "dashboard"
                            ? "menu-button active"
                            : "menu-button"
                    }
                    onClick={showDashboard}
                >
                    Dashboard
                </button>


                <button
                    className={
                        activeSection === "companies"
                            ? "menu-button active"
                            : "menu-button"
                    }
                    onClick={showCompanies}
                >
                    Companies
                </button>


                <button
                    className={
                        activeSection === "products"
                            ? "menu-button active"
                            : "menu-button"
                    }
                    onClick={showProducts}
                >
                    Products
                </button>


                <button
                    className={
                        activeSection === "vendors"
                            ? "menu-button active"
                            : "menu-button"
                    }
                    onClick={showVendors}
                >
                    Vendors
                </button>


                <button
                    className={
                        activeSection === "stock"
                            ? "menu-button active"
                            : "menu-button"
                    }
                    onClick={showStock}
                >
                    Stock
                </button>

            </div>


            {/* 
                MAIN AREA
             */}

            <div className="main-area">


                {/* 
                    DASHBOARD
                == */}

                {activeSection === "dashboard" && (

                    <>

                        <div className="dashboard-header">

                            <div>

                                <h1>
                                    Dashboard
                                </h1>

                                <p>
                                    Manage your companies, products and vendors
                                </p>

                            </div>

                        </div>


                        <div className="dashboard-cards">


                            <div className="dashboard-card">

                                <div className="card-top">

                                    <div className="card-icon company-icon">
                                        C
                                    </div>

                                    <button
                                        className="plus-button"
                                        onClick={() =>
                                            setShowCompany(true)
                                        }
                                    >
                                        +
                                    </button>

                                </div>

                                <h3>
                                    Companies
                                </h3>

                                <h1>
                                    {companyCount}
                                </h1>

                                <p className="card-text">
                                    Total companies
                                </p>

                            </div>


                            <div className="dashboard-card">

                                <div className="card-top">

                                    <div className="card-icon product-icon">
                                        P
                                    </div>

                                    <button
                                        className="plus-button"
                                        onClick={() =>
                                            setShowProduct(true)
                                        }
                                    >
                                        +
                                    </button>

                                </div>

                                <h3>
                                    Products
                                </h3>

                                <h1>
                                    {productCount}
                                </h1>

                                <p className="card-text">
                                    Total products
                                </p>

                            </div>


                            <div className="dashboard-card">

                                <div className="card-top">

                                    <div className="card-icon vendor-icon">
                                        V
                                    </div>

                                    <button
                                        className="plus-button"
                                        onClick={() =>
                                            setShowVendor(true)
                                        }
                                    >
                                        +
                                    </button>

                                </div>

                                <h3>
                                    Vendors
                                </h3>

                                <h1>
                                    {vendorCount}
                                </h1>

                                <p className="card-text">
                                    Total vendors
                                </p>

                            </div>

                        </div>

                    </>

                )}


                {/* 
                    COMPANIES
                 */}

                {activeSection === "companies" && (

                    <div className="list-section">

                        <div className="list-header">

                            <div>

                                <h1>
                                    Companies
                                </h1>

                                <p>
                                    Manage your companies
                                </p>

                            </div>

                            <button
                                className="add-button"
                                onClick={() =>
                                    setShowCompany(true)
                                }
                            >
                                + Add Company
                            </button>

                        </div>


                        <div className="table-container">

                            <table>

                                <thead>

                                    <tr>
                                        <th>ID</th>
                                        <th>Company Name</th>
                                    </tr>

                                </thead>


                                <tbody>

                                    {companies.length > 0 ? (

                                        companies.map((company) => (

                                            <tr key={company.id}>

                                                <td>
                                                    {company.id}
                                                </td>

                                                <td>
                                                    {company.company_name}
                                                </td>

                                            </tr>

                                        ))

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="2"
                                                className="empty-message"
                                            >
                                                No companies found
                                            </td>

                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                )}


                {/* 
                    PRODUCTS
                 */}

                {activeSection === "products" && (

                    <div className="list-section">

                        <div className="list-header">

                            <div>

                                <h1>
                                    Products
                                </h1>

                                <p>
                                    Products and company stock
                                </p>

                            </div>

                            <button
                                className="add-button"
                                onClick={() =>
                                    setShowProduct(true)
                                }
                            >
                                + Add Product
                            </button>

                        </div>


                        <div className="table-container">

                            <table>

                                <thead>

                                    <tr>
                                        <th>ID</th>
                                        <th>Product</th>
                                        <th>Company ID</th>
                                        <th>Stock</th>
                                        <th>Items</th>
                                        <th>Serial Code</th>
                                        <th>Retail Price</th>
                                    </tr>

                                </thead>


                                <tbody>

                                    {products.length > 0 ? (

                                        products.map((product) => (

                                            <tr key={product.id}>

                                                <td>
                                                    {product.id}
                                                </td>

                                                <td>
                                                    {product.product_name}
                                                </td>

                                                <td>
                                                    {product.company_id}
                                                </td>

                                                <td>
                                                    {Number(
                                                        product.quantity || 0
                                                    )}
                                                </td>

                                                <td>
                                                    {Number(
                                                        product.number_of_items || 0
                                                    )}
                                                </td>

                                                <td>
                                                    {product.serial_code || "-"}
                                                </td>

                                                <td>
                                                    {Number(
                                                        product.retail_price || 0
                                                    ).toLocaleString()}
                                                </td>

                                            </tr>

                                        ))

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="7"
                                                className="empty-message"
                                            >
                                                No products found
                                            </td>

                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                )}


                {/* 
                    VENDORS
                 */}

                {activeSection === "vendors" && (

                    <div className="list-section">

                        <div className="list-header">

                            <div>

                                <h1>
                                    Vendors
                                </h1>

                                <p>
                                    Manage your vendors
                                </p>

                            </div>

                            <button
                                className="add-button"
                                onClick={() =>
                                    setShowVendor(true)
                                }
                            >
                                + Add Vendor
                            </button>

                        </div>


                        <div className="table-container">

                            <table>

                                <thead>

                                    <tr>
                                        <th>ID</th>
                                        <th>Vendor Name</th>
                                        <th>Business</th>
                                        <th>Contact</th>
                                        <th>Address</th>
                                    </tr>

                                </thead>


                                <tbody>

                                    {vendors.length > 0 ? (

                                        vendors.map((vendor) => (

                                            <tr key={vendor.id}>

                                                <td>
                                                    {vendor.id}
                                                </td>

                                                <td>
                                                    {vendor.vendor_name}
                                                </td>

                                                <td>
                                                    {vendor.business_name}
                                                </td>

                                                <td>
                                                    {vendor.contact}
                                                </td>

                                                <td>
                                                    {vendor.address}
                                                </td>

                                            </tr>

                                        ))

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="5"
                                                className="empty-message"
                                            >
                                                No vendors found
                                            </td>

                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                )}

                {/* 
                    STOCK
                 */}

                {activeSection === "stock" && (

                    <div className="list-section">

                        <div className="list-header">

                            <div>

                                <h1>
                                    Stock
                                </h1>

                                <p>
                                    Stock assigned to vendors
                                </p>

                            </div>

                        </div>


                        <div className="stock-summary">

                            <div className="stock-summary-card">

                                <span>
                                    Assigned Records
                                </span>

                                <strong>
                                    {stock.length}
                                </strong>

                            </div>


                            <div className="stock-summary-card">

                                <span>
                                    Assigned Stock
                                </span>

                                <strong>
                                    {stock.reduce(
                                        (total, item) =>
                                            total +
                                            Number(
                                                item.assigned_quantity || 0
                                            ),
                                        0
                                    )}
                                </strong>

                            </div>


                            <div className="stock-summary-card">

                                <span>
                                    Remaining Company Stock
                                </span>

                                <strong>
                                    {stock.reduce(
                                        (total, item) =>
                                            total +
                                            Number(
                                                item.remaining_stock || 0
                                            ),
                                        0
                                    )}
                                </strong>

                            </div>

                        </div>


                        <div className="table-container">

                            <table>

                                <thead>

                                    <tr>
                                        <th>ID</th>
                                        <th>Product</th>
                                        <th>Serial Code</th>
                                        <th>Vendor</th>
                                        <th>Assigned Stock</th>
                                        <th>Remaining Stock</th>
                                        <th>Retail Price</th>
                                        <th>Total Amount</th>
                                        <th>Paid</th>
                                        <th>Credit</th>
                                        <th>Status</th>
                                    </tr>

                                </thead>


                                <tbody>

                                    {stock.length > 0 ? (

                                        stock.map((item) => (

                                            <tr key={item.id}>

                                                <td>
                                                    {item.id}
                                                </td>

                                                <td>
                                                    {item.product_name}
                                                </td>

                                                <td>
                                                    {item.serial_code || "-"}
                                                </td>

                                                <td>
                                                    {item.vendor_name}
                                                </td>

                                                <td>
                                                    {Number(
                                                        item.assigned_quantity || 0
                                                    )}
                                                </td>

                                                <td>
                                                    {Number(
                                                        item.remaining_stock || 0
                                                    )}
                                                </td>

                                                <td>
                                                    {Number(
                                                        item.retail_price || 0
                                                    ).toLocaleString()}
                                                </td>

                                                <td>
                                                    {Number(
                                                        item.total_amount || 0
                                                    ).toLocaleString()}
                                                </td>

                                                <td>
                                                    {Number(
                                                        item.paid_amount || 0
                                                    ).toLocaleString()}
                                                </td>

                                                <td>
                                                    {Number(
                                                        item.credit_amount || 0
                                                    ).toLocaleString()}
                                                </td>

                                                <td>

                                                    <span
                                                        className={
                                                            item.payment_status === "Paid"
                                                                ? "status-paid"
                                                                : item.payment_status === "Half"
                                                                    ? "status-half"
                                                                    : "status-credit"
                                                        }
                                                    >
                                                        {item.payment_status}
                                                    </span>

                                                </td>

                                            </tr>

                                        ))

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="11"
                                                className="empty-message"
                                            >
                                                No stock assigned yet
                                            </td>

                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                )}

            </div>


            {/* 
                COMPANY DIALOG
             */}

            {showCompany && (

                <CompanyDialog

                    close={() => {

                        setShowCompany(false);

                        loadCounts();

                        if (activeSection === "companies") {
                            loadCompanies();
                        }

                    }}

                />

            )}


            {/* 
                PRODUCT DIALOG
             */}

            {showProduct && (

                <ProductDialog

                    close={() => {

                        setShowProduct(false);

                        loadCounts();

                        if (activeSection === "products") {
                            loadProducts();
                        }

                    }}

                />

            )}


            {/* 
                VENDOR DIALOG
             */}

            {showVendor && (

                <VendorDialog

                    close={() =>
                        setShowVendor(false)
                    }

                    onVendorCreated={handleVendorCreated}

                />

            )}


            {/* 
                ASSIGN STOCK DIALOG
            */}

            {showAssignStock && selectedVendor && (

                <AssignStockDialog

                    vendorId={
                        selectedVendor.id ||
                        selectedVendor.vendor_id
                    }

                    close={() => {

                        setShowAssignStock(false);

                        setSelectedVendor(null);

                        loadStock();

                        loadProducts();

                    }}

                />

            )}

        </div>
    );
}

export default Welcome;
