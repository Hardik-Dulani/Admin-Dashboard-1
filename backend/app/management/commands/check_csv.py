import csv

with open(r'C:\Users\Hardik\Dashboard-fs\data\data-1701387339917.csv', 'r', encoding='utf-8') as file:
    try:
        reader = csv.reader(file)
        for row in reader:
            pass  # Process each row
    except csv.Error as e:
        print(f"Error in CSV file: {e}")