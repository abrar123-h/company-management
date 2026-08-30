import { useState } from "react";
import "./CompanyDialog.css";

function CompanyDialog({ close }) {

    const [companyName, setCompanyName] = useState("");
    const [companyDescription, setCompanyDescription] = useState("");

    const saveCompany = async () => {

        if (!companyName || !companyDescription) {
            alert("Please enter company name and description");
            return;
        }

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/companies",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        company_name: companyName,
                        company_description: companyDescription
                    })
                }
            );

            const result = await response.json();

            if (response.ok) {

                alert("Company added successfully");

                setCompanyName("");
                setCompanyDescription("");

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
        <div className="company-overlay">

            <div className="company-dialog">

                {/* HEADER */}

                <div className="company-dialog-header">

                    <h2>Add Company</h2>

                    <button
                        className="company-close"
                        onClick={close}
                    >
                        ×
                    </button>

                </div>


                {/* FORM */}

                <div className="company-form">

                    <label>
                        Company Name
                    </label>

                    <input
                        type="text"
                        placeholder="Enter company name"
                        value={companyName}
                        onChange={(e) =>
                            setCompanyName(e.target.value)
                        }
                    />


                    <label>
                        Company Description
                    </label>

                    <textarea
                        placeholder="Enter company description"
                        value={companyDescription}
                        onChange={(e) =>
                            setCompanyDescription(e.target.value)
                        }
                    />


                    <button
                        className="company-save"
                        onClick={saveCompany}
                    >
                        Save Company
                    </button>

                </div>

            </div>

        </div>
    );
}

export default CompanyDialog;