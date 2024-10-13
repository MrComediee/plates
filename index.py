from flask import Flask, render_template, request
import pyodbc
import os

app = Flask(__name__, static_url_path='', static_folder='.', template_folder=".")

# Database connection function
def get_db_connection():
    conn = pyodbc.connect(r'DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=C:\\inetpub\\wwwroot\\Cars 01-10-2021.mdb;')
    return conn

# Dictionary for translating CodeDesc to Arabic
code_desc_translation = {
    "A": "أ",
    "B": "ب",
    "N": "ن",
    "Y": "ي",
    "O": "و",
    "G": "ج",
    "S": "س",
    "T": "ت",
    "K": "ك",
    "Z": "ز",
    "M": "م",
    "D": "د",
}

# Home route with form for searching ActualNB and CodeDesc
@app.route('/', methods=['GET', 'POST'])
def search():
    if request.method == 'POST':
        actualnb = request.form['actualnb']
        codedesc = request.form['codedesc']  # New input for CodeDesc
        
        # Translate to Arabic using the dictionary
        codedesc_arabic = code_desc_translation.get(codedesc)
        
        if not codedesc_arabic:
            return f"Invalid Code Description: {codedesc}. Please use a valid code."
        
        conn = get_db_connection()
        cursor = conn.cursor()
        # SQL query to fetch the records based on ActualNB and CodeDesc
        cursor.execute("SELECT * FROM CARMDI WHERE ActualNB = ? AND CodeDesc = ?", actualnb, codedesc_arabic)
        results = cursor.fetchall()  # Fetch all matching records
        conn.close()

        if results:
            # Prepare a list of dictionaries to pass data to the template
            cars_info = []
            for result in results:
                car_info = {
                    "ActualNB": result.ActualNB,
                    "Addresse": result.Addresse,
                    "AgeProp": result.AgeProp,
                    "BirthPlace": result.BirthPlace,
                    "Chassis": result.Chassis,
                    "CodeDesc": result.CodeDesc,
                    "CouleurDesc": result.CouleurDesc,
                    "dateacquisition": result.dateaquisition,
                    "HorsService": result.HorsService,
                    "MarqueDesc": result.MarqueDesc,
                    "Moteur": result.Moteur,
                    "Nom": result.Nom,
                    "NomMere": result.NomMere,
                    "NoRegProp": result.NoRegProp,
                    "PreMiseCirc": result.PreMiseCirc,
                    "Prenom": result.Prenom,
                    "PRODDATE": result.PRODDATE,
                    "TelProp": result.TelProp,
                    "TypeDesc": result.TypeDesc,
                    "UtilsDesc": result.UtilisDesc
                }
                cars_info.append(car_info)
            return render_template('result.html', cars_info=cars_info)
        else:
            return f"No data found for ActualNB: {actualnb} and CodeDesc: {codedesc_arabic}"
    
    return render_template('index.html')

# Run the app
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
