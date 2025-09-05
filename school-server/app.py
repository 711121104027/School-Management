import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import pymysql  # replace with mysql-connector-python if you prefer

# ----------------------------------
# Load environment variables
# ----------------------------------
DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_PORT = int(os.environ.get("DB_PORT", 3306))
DB_USER = os.environ.get("DB_USER", "root")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "")
DB_NAME = os.environ.get("DB_NAME", "school_db")

UPLOAD_FOLDER = "schoolImages"

# ----------------------------------
# Flask app setup
# ----------------------------------
app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# CORS: allow only frontend origin (set in Render dashboard)
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "*")
CORS(app, origins=[FRONTEND_ORIGIN])


# ----------------------------------
# DB connection helper
# ----------------------------------
def get_connection():
    return pymysql.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        db=DB_NAME,
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=True,
    )


# ----------------------------------
# Routes
# ----------------------------------

@app.route("/add-school", methods=["POST"])
def add_school():
    data = request.form
    image = request.files["image"]
    filename = secure_filename(image.filename)
    image.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))

    conn = get_connection()
    cursor = conn.cursor()
    query = """INSERT INTO schools (name, address, city, state, contact, image, email_id)
               VALUES (%s, %s, %s, %s, %s, %s, %s)"""
    values = (
        data["name"],
        data["address"],
        data["city"],
        data["state"],
        data["contact"],
        filename,
        data["email_id"],
    )
    cursor.execute(query, values)
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "School added successfully"}), 201


@app.route("/get-schools", methods=["GET"])
def get_schools():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM schools")
    schools = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(schools)


@app.route("/delete-school/<int:school_id>", methods=["DELETE"])
def delete_school(school_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT image FROM schools WHERE id = %s", (school_id,))
    school = cursor.fetchone()

    if not school:
        cursor.close()
        conn.close()
        return jsonify({"error": "School not found"}), 404

    cursor.execute("DELETE FROM schools WHERE id = %s", (school_id,))
    conn.commit()

    if school["image"]:
        image_path = os.path.join(app.config["UPLOAD_FOLDER"], school["image"])
        if os.path.exists(image_path):
            os.remove(image_path)

    cursor.close()
    conn.close()
    return jsonify({"message": "School deleted successfully"}), 200


@app.route("/schoolImages/<filename>")
def serve_image(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


# ----------------------------------
# Local dev entrypoint
# ----------------------------------
if __name__ == "__main__":
    if not os.path.exists(app.config["UPLOAD_FOLDER"]):
        os.makedirs(app.config["UPLOAD_FOLDER"])
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "0") == "1"
    app.run(host="0.0.0.0", port=port, debug=debug)
