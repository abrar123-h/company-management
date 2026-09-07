import os
import uuid

from flask import Flask, request, jsonify
from flask_cors import CORS
app = Flask(__name__)

CORS(
    app,
    resources={
        r"/*": {
            "origins": [
                "https://company-management-liart.vercel.app",
                "http://localhost:5173"
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
        }
    }
)


# DATABASE TYPE

DATABASE_TYPE = os.environ.get(
    "DATABASE_TYPE",
    "sqlserver"
).lower()

# DATABASE CONNECTION

def get_connection():

    if DATABASE_TYPE == "postgres":

        import psycopg2

        database_url = os.environ.get("DATABASE_URL")

        if not database_url:
            raise RuntimeError(
                "DATABASE_URL environment variable is not set"
            )

        return psycopg2.connect(database_url)

    import pyodbc

    return pyodbc.connect(
        "DRIVER={ODBC Driver 17 for SQL Server};"
        r"SERVER=Abibro\SQLEXPRESS01;"
        "DATABASE=StudentAuthDB;"
        "Trusted_Connection=yes;"
    )

# DATABASE EXECUTE HELPER

def execute_query(cursor, query, params=None):

    if DATABASE_TYPE == "sqlserver":
        query = query.replace("%s", "?")

    if params is None:
        cursor.execute(query)
    else:
        cursor.execute(query, params)

# HOME

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "message": "Flask API is working",
        "database": DATABASE_TYPE
    }), 200

# SIGNUP

@app.route("/signup", methods=["POST"])
def signup():

    data = request.get_json(silent=True) or {}

    name = data.get("name") or data.get("username")
    email = data.get("email")
    phone = data.get("phone", "")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({
            "message": "Name, email and password are required"
        }), 400

    connection = None
    cursor = None

    try:

        connection = get_connection()
        cursor = connection.cursor()

        execute_query(
            cursor,
            """
            SELECT id
            FROM users
            WHERE email = %s
            """,
            (email,)
        )

        if cursor.fetchone():
            return jsonify({
                "message": "Email already registered"
            }), 400

        execute_query(
            cursor,
            """
            INSERT INTO users
            (
                name,
                email,
                phone,
                password
            )
            VALUES
            (
                %s,
                %s,
                %s,
                %s
            )
            """,
            (
                name,
                email,
                phone,
                password
            )
        )

        connection.commit()

        return jsonify({
            "message": "Signup successful"
        }), 201

    except Exception as e:

        if connection:
            connection.rollback()

        print("SIGNUP ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# LOGIN

@app.route("/login", methods=["POST"])
def login():

    data = request.get_json(silent=True) or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "message": "Email and password are required"
        }), 400

    connection = None
    cursor = None

    try:

        connection = get_connection()
        cursor = connection.cursor()

        execute_query(
            cursor,
            """
            SELECT id, name
            FROM users
            WHERE email = %s
            AND password = %s
            """,
            (
                email,
                password
            )
        )

        user = cursor.fetchone()

        if user:
            return jsonify({
                "message": "Login successful",
                "user_id": user[0],
                "name": user[1]
            }), 200

        return jsonify({
            "message": "Invalid email or password"
        }), 401

    except Exception as e:

        print("LOGIN ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# ADD COMPANY

@app.route("/companies", methods=["POST"])
def add_company():

    data = request.get_json(silent=True) or {}

    company_name = data.get("company_name")
    company_description = data.get("company_description")

    if not company_name or not company_description:
        return jsonify({
            "message": "Company name and description are required"
        }), 400

    connection = None
    cursor = None

    try:

        connection = get_connection()
        cursor = connection.cursor()

        execute_query(
            cursor,
            """
            INSERT INTO companies
            (
                company_name,
                company_description,
                creation_date
            )
            VALUES
            (
                %s,
                %s,
                CURRENT_TIMESTAMP
            )
            """,
            (
                company_name,
                company_description
            )
        )

        connection.commit()

        return jsonify({
            "message": "Company added successfully"
        }), 201

    except Exception as e:

        if connection:
            connection.rollback()

        print("COMPANY ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# GET COMPANIES

@app.route("/companies", methods=["GET"])
def get_companies():

    connection = None
    cursor = None

    try:

        connection = get_connection()
        cursor = connection.cursor()

        execute_query(
            cursor,
            """
            SELECT id, company_name
            FROM companies
            ORDER BY company_name
            """
        )

        rows = cursor.fetchall()

        result = []

        for row in rows:
            result.append({
                "id": row[0],
                "company_name": row[1]
            })

        return jsonify(result), 200

    except Exception as e:

        print("GET COMPANIES ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# ADD PRODUCT

@app.route("/products", methods=["POST"])
def add_product():

    data = request.get_json(silent=True) or {}

    company_id = data.get("company_id")
    product_name = data.get("product_name")
    quantity = data.get("quantity")
    number_of_items = data.get("number_of_items")
    retail_price = data.get("retail_price")

    if (
        company_id is None
        or not product_name
        or quantity is None
        or number_of_items is None
        or retail_price is None
    ):
        return jsonify({
            "message": "All product fields are required"
        }), 400

    connection = None
    cursor = None

    try:

        connection = get_connection()
        cursor = connection.cursor()

        execute_query(
            cursor,
            """
            SELECT id
            FROM companies
            WHERE id = %s
            """,
            (company_id,)
        )

        if not cursor.fetchone():
            return jsonify({
                "message": "Company not found"
            }), 404

        serial_code = (
            "PROD-"
            + uuid.uuid4().hex[:8].upper()
        )

        execute_query(
            cursor,
            """
            INSERT INTO products
            (
                company_id,
                product_name,
                quantity,
                number_of_items,
                serial_code,
                creation_date,
                retail_price
            )
            VALUES
            (
                %s,
                %s,
                %s,
                %s,
                %s,
                CURRENT_TIMESTAMP,
                %s
            )
            """,
            (
                company_id,
                product_name,
                quantity,
                number_of_items,
                serial_code,
                retail_price
            )
        )

        connection.commit()

        return jsonify({
            "message": "Product added successfully",
            "serial_code": serial_code
        }), 201

    except Exception as e:

        if connection:
            connection.rollback()

        print("PRODUCT ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# GET PRODUCTS

@app.route("/products", methods=["GET"])
def get_products():

    connection = None
    cursor = None

    try:

        connection = get_connection()
        cursor = connection.cursor()

        execute_query(
            cursor,
            """
            SELECT
                id,
                company_id,
                product_name,
                quantity,
                number_of_items,
                serial_code,
                retail_price
            FROM products
            ORDER BY id
            """
        )

        rows = cursor.fetchall()

        result = []

        for row in rows:

            result.append({
                "id": row[0],
                "company_id": row[1],
                "product_name": row[2],
                "quantity": (
                    str(row[3])
                    if row[3] is not None
                    else "0"
                ),
                "number_of_items": (
                    str(row[4])
                    if row[4] is not None
                    else "0"
                ),
                "serial_code": row[5],
                "retail_price": float(row[6] or 0)
            })

        return jsonify(result), 200

    except Exception as e:

        print("GET PRODUCTS ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# ADD VENDOR

@app.route("/vendors", methods=["POST"])
def add_vendor():

    data = request.get_json(silent=True) or {}

    vendor_name = data.get("vendor_name")
    business_name = data.get("business_name")
    contact = data.get("contact")
    address = data.get("address")

    if (
        not vendor_name
        or not business_name
        or not contact
        or not address
    ):
        return jsonify({
            "message": "All vendor fields are required"
        }), 400

    connection = None
    cursor = None

    try:

        connection = get_connection()
        cursor = connection.cursor()

        if DATABASE_TYPE == "postgres":

            cursor.execute(
                """
                INSERT INTO vendors
                (
                    vendor_name,
                    business_name,
                    contact,
                    address,
                    creation_date,
                    total_amount,
                    paid_amount,
                    credit_amount,
                    payment_status
                )
                VALUES
                (
                    %s,
                    %s,
                    %s,
                    %s,
                    CURRENT_TIMESTAMP,
                    %s,
                    %s,
                    %s,
                    %s
                )
                RETURNING id
                """,
                (
                    vendor_name,
                    business_name,
                    contact,
                    address,
                    0,
                    0,
                    0,
                    "Unpaid"
                )
            )

        else:

            cursor.execute(
                """
                INSERT INTO vendors
                (
                    vendor_name,
                    business_name,
                    contact,
                    address,
                    creation_date,
                    total_amount,
                    paid_amount,
                    credit_amount,
                    payment_status
                )
                OUTPUT INSERTED.id
                VALUES
                (
                    ?,
                    ?,
                    ?,
                    ?,
                    CURRENT_TIMESTAMP,
                    ?,
                    ?,
                    ?,
                    ?
                )
                """,
                (
                    vendor_name,
                    business_name,
                    contact,
                    address,
                    0,
                    0,
                    0,
                    "Unpaid"
                )
            )

        new_vendor_id = cursor.fetchone()[0]

        connection.commit()

        return jsonify({
            "message": "Vendor added successfully",
            "id": new_vendor_id,
            "vendor_id": new_vendor_id,
            "vendor_name": vendor_name,
            "business_name": business_name
        }), 201

    except Exception as e:

        if connection:
            connection.rollback()

        print("VENDOR ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# GET VENDORS

@app.route("/vendors", methods=["GET"])
def get_vendors():

    connection = None
    cursor = None

    try:

        connection = get_connection()
        cursor = connection.cursor()

        execute_query(
            cursor,
            """
            SELECT
                id,
                vendor_name,
                business_name,
                contact,
                address
            FROM vendors
            ORDER BY vendor_name
            """
        )

        rows = cursor.fetchall()

        result = []

        for row in rows:

            result.append({
                "id": row[0],
                "vendor_id": row[0],
                "vendor_name": row[1],
                "business_name": row[2],
                "contact": row[3],
                "address": row[4]
            })

        return jsonify(result), 200

    except Exception as e:

        print("GET VENDORS ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# ASSIGN STOCK

@app.route("/vendors/assign-stock", methods=["POST"])
def assign_stock():

    data = request.get_json(silent=True) or {}

    vendor_id = data.get("vendor_id")
    product_id = data.get("product_id")
    assign_quantity = data.get("quantity")
    paid_amount = data.get("paid_amount", 0)

    if (
        vendor_id is None
        or product_id is None
        or assign_quantity is None
    ):
        return jsonify({
            "message": "Vendor, product and quantity are required"
        }), 400

    try:

        vendor_id = int(vendor_id)
        product_id = int(product_id)
        assign_quantity = int(assign_quantity)
        paid_amount = float(paid_amount)

    except (ValueError, TypeError):

        return jsonify({
            "message": (
                "Vendor ID, product ID, quantity and "
                "paid amount must be valid numbers"
            )
        }), 400

    if vendor_id <= 0:
        return jsonify({
            "message": "Invalid vendor ID"
        }), 400

    if product_id <= 0:
        return jsonify({
            "message": "Invalid product ID"
        }), 400

    if assign_quantity <= 0:
        return jsonify({
            "message": "Quantity must be greater than 0"
        }), 400

    if paid_amount < 0:
        return jsonify({
            "message": "Paid amount cannot be negative"
        }), 400

    connection = None
    cursor = None

    try:

        connection = get_connection()
        cursor = connection.cursor()

        execute_query(
            cursor,
            """
            SELECT id
            FROM vendors
            WHERE id = %s
            """,
            (vendor_id,)
        )

        if not cursor.fetchone():
            return jsonify({
                "message": "Vendor not found"
            }), 404

        if DATABASE_TYPE == "postgres":

            cursor.execute(
                """
                SELECT
                    quantity,
                    retail_price
                FROM products
                WHERE id = %s
                FOR UPDATE
                """,
                (product_id,)
            )

        else:

            cursor.execute(
                """
                SELECT
                    quantity,
                    retail_price
                FROM products
                WHERE id = ?
                """,
                (product_id,)
            )

        product = cursor.fetchone()

        if not product:
            return jsonify({
                "message": "Product not found"
            }), 404

        try:

            available_quantity = int(
                product[0] or 0
            )

        except (ValueError, TypeError):

            return jsonify({
                "message": (
                    "Product stock must be numeric "
                    "for stock assignment"
                )
            }), 400

        retail_price = float(
            product[1] or 0
        )

        if assign_quantity > available_quantity:

            return jsonify({
                "message": "Not enough stock available",
                "available_quantity": available_quantity,
                "requested_quantity": assign_quantity
            }), 400

        remaining_quantity = (
            available_quantity
            - assign_quantity
        )

        total_amount = (
            assign_quantity
            * retail_price
        )

        if paid_amount > total_amount:

            return jsonify({
                "message": (
                    "Paid amount cannot be greater "
                    "than total amount"
                ),
                "total_amount": total_amount,
                "paid_amount": paid_amount
            }), 400

        credit_amount = (
            total_amount
            - paid_amount
        )

        if credit_amount == 0:
            payment_status = "Paid"
        elif paid_amount > 0:
            payment_status = "Half"
        else:
            payment_status = "Credit"

        execute_query(
            cursor,
            """
            UPDATE vendors
            SET
                product_id = %s,
                assigned_quantity = %s,
                total_amount = %s,
                paid_amount = %s,
                credit_amount = %s,
                payment_status = %s
            WHERE id = %s
            """,
            (
                product_id,
                assign_quantity,
                total_amount,
                paid_amount,
                credit_amount,
                payment_status,
                vendor_id
            )
        )

        execute_query(
            cursor,
            """
            UPDATE products
            SET quantity = %s
            WHERE id = %s
            """,
            (
                remaining_quantity,
                product_id
            )
        )

        connection.commit()

        return jsonify({

            "message":
                "Stock assigned successfully",

            "vendor_id":
                vendor_id,

            "product_id":
                product_id,

            "assigned_quantity":
                assign_quantity,

            "available_quantity_before":
                available_quantity,

            "remaining_quantity":
                remaining_quantity,

            "retail_price":
                retail_price,

            "total_amount":
                total_amount,

            "paid_amount":
                paid_amount,

            "credit_amount":
                credit_amount,

            "payment_status":
                payment_status

        }), 200

    except Exception as e:

        if connection:
            connection.rollback()

        print("ASSIGN STOCK ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# GET ASSIGNED STOCK

@app.route("/vendors/assigned-stock", methods=["GET"])
def get_assigned_stock():

    connection = None
    cursor = None

    try:

        connection = get_connection()
        cursor = connection.cursor()

        execute_query(
            cursor,
            """
            SELECT
                v.id AS vendor_id,
                v.vendor_name,
                v.business_name,
                p.id AS product_id,
                p.product_name,
                p.serial_code,
                p.retail_price,
                v.assigned_quantity,
                p.quantity AS remaining_stock,
                v.total_amount,
                v.paid_amount,
                v.credit_amount,
                v.payment_status
            FROM vendors v
            INNER JOIN products p
                ON v.product_id = p.id
            WHERE
                v.product_id IS NOT NULL
                AND v.assigned_quantity IS NOT NULL
                AND v.assigned_quantity > 0
            ORDER BY v.id DESC
            """
        )

        rows = cursor.fetchall()

        result = []

        for row in rows:

            try:
                remaining_stock = int(row[8] or 0)
            except (ValueError, TypeError):
                remaining_stock = 0

            result.append({

                "id": row[0],
                "vendor_id": row[0],
                "vendor_name": row[1],
                "business_name": row[2],
                "product_id": row[3],
                "product_name": row[4],
                "serial_code": row[5],
                "retail_price": float(row[6] or 0),
                "assigned_quantity": int(row[7] or 0),
                "remaining_stock": remaining_stock,
                "total_amount": float(row[9] or 0),
                "paid_amount": float(row[10] or 0),
                "credit_amount": float(row[11] or 0),
                "payment_status": row[12]
            })

        return jsonify(result), 200

    except Exception as e:

        print("GET ASSIGNED STOCK ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# DASHBOARD COUNTS

@app.route("/dashboard/counts", methods=["GET"])
def dashboard_counts():

    connection = None
    cursor = None

    try:

        connection = get_connection()
        cursor = connection.cursor()

        execute_query(
            cursor,
            "SELECT COUNT(*) FROM companies"
        )

        company_count = cursor.fetchone()[0]

        execute_query(
            cursor,
            "SELECT COUNT(*) FROM products"
        )

        product_count = cursor.fetchone()[0]

        execute_query(
            cursor,
            "SELECT COUNT(*) FROM vendors"
        )

        vendor_count = cursor.fetchone()[0]

        return jsonify({
            "companies": company_count,
            "products": product_count,
            "vendors": vendor_count
        }), 200

    except Exception as e:

        print("DASHBOARD COUNT ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# COMPANY COUNT

@app.route("/companies/count", methods=["GET"])
def companies_count():

    connection = None
    cursor = None

    try:

        connection = get_connection()
        cursor = connection.cursor()

        execute_query(
            cursor,
            "SELECT COUNT(*) FROM companies"
        )

        count = cursor.fetchone()[0]

        return jsonify({
            "count": count
        }), 200

    except Exception as e:

        print("COMPANY COUNT ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# PRODUCT COUNT

@app.route("/products/count", methods=["GET"])
def products_count():

    connection = None
    cursor = None

    try:

        connection = get_connection()
        cursor = connection.cursor()

        execute_query(
            cursor,
            "SELECT COUNT(*) FROM products"
        )

        count = cursor.fetchone()[0]

        return jsonify({
            "count": count
        }), 200

    except Exception as e:

        print("PRODUCT COUNT ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# VENDOR COUNT

@app.route("/vendors/count", methods=["GET"])
def vendors_count():

    connection = None
    cursor = None

    try:

        connection = get_connection()
        cursor = connection.cursor()

        execute_query(
            cursor,
            "SELECT COUNT(*) FROM vendors"
        )

        count = cursor.fetchone()[0]

        return jsonify({
            "count": count
        }), 200

    except Exception as e:

        print("VENDOR COUNT ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# START FLASK

if __name__ == "__main__":

    port = int(
        os.environ.get("PORT", 8000)
    )

    app.run(
        host="0.0.0.0",
        port=port,
        debug=False
    )
