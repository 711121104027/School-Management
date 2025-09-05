from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from db_config import get_connection

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = 'schoolImages'


@app.route('/add-school', methods=['POST'])
def add_school():
    data = request.form
    image = request.files['image']
    filename = secure_filename(image.filename)
    image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    conn = get_connection()
    cursor = conn.cursor()
    query = """INSERT INTO schools (name, address, city, state, contact, image, email_id)
               VALUES (%s, %s, %s, %s, %s, %s, %s)"""
    values = (data['name'], data['address'], data['city'], data['state'],
              data['contact'], filename, data['email_id'])
    cursor.execute(query, values)
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "School added successfully"}), 201


@app.route('/get-schools', methods=['GET'])
def get_schools():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM schools")
    schools = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(schools)


@app.route('/delete-school/<int:school_id>', methods=['DELETE'])
def delete_school(school_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT image FROM schools WHERE id = %s", (school_id,))
    school = cursor.fetchone()

    if not school:
        cursor.close()
        conn.close()
        return jsonify({"error": "School not found"}), 404

    cursor.execute("DELETE FROM schools WHERE id = %s", (school_id,))
    conn.commit()

    if school["image"]:
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], school["image"])
        if os.path.exists(image_path):
            os.remove(image_path)

    cursor.close()
    conn.close()
    return jsonify({"message": "School deleted successfully"}), 200

@app.route('/schoolImages/<filename>')
def serve_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


if __name__ == '__main__':
    if not os.path.exists('schoolImages'):
        os.makedirs('schoolImages')
    app.run(debug=True)
