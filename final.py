import subprocess
import os
import pdfplumber
import pandas as pd
import win32com.client
import sys 
import platform

def convert_docx_to_pdf(docx_filename):
    os_name = platform.system()
    if os_name == 'Windows':
        """ Converts DOCX file to PDF using Microsoft Word. """
        word = win32com.client.Dispatch('Word.Application')
        pdf_filename = docx_filename.replace(".docx", ".pdf")
        # Open the DOCX file
        doc = word.Documents.Open(docx_filename)
        # Save as PDF
        doc.SaveAs(pdf_filename, FileFormat=17)
        # Close the document and quit Word application
        doc.Close()
        word.Quit()    
    elif os_name == 'Linux':
        """ Converts DOCX file to PDF using LibreOffice. """
        pdf_filename = docx_filename.replace(".docx", ".pdf")
        # Use LibreOffice in headless mode to convert DOCX to PDF
        subprocess.run(['libreoffice', '--headless', '--convert-to', 'pdf', docx_filename], check=True)

    return pdf_filename

def extract_table_from_page(page):
    """ Extracts table from a single page and returns it. """
    table = page.extract_table()
    if table:
        return table
    return []

def find_table_after_heading(pdf, heading):
    heading_found = False
    all_table_rows = []
    columns = None

    # Iterate through pages to find the heading
    for page_number, page in enumerate(pdf.pages):
        text = page.extract_text()
        
        if heading in text:
            heading_found = True
            continue  # Start looking for the table on subsequent pages
        
        # Only start table extraction after the heading has been found
        if heading_found:
            table = extract_table_from_page(page)
            if table:
                if columns is None:
                    # Determine columns based on the first table found
                    columns = table[0]
                # Append table rows to the list
                all_table_rows.extend(row for row in table[1:] if len(row) == len(columns))

    if all_table_rows:
        return [columns] + all_table_rows
    else:
        return None

def convert_tab(filename, heading):
    with pdfplumber.open(filename) as pdf:
        # Extract the table following the specific heading
        table_data = find_table_after_heading(pdf, heading)
        
        if table_data:
            # Convert the table to a DataFrame
            df = pd.DataFrame(table_data[1:], columns=table_data[0])
            
            # Fill empty cells in the first column with the value from the cell above
            df[df.columns[0]] = df[df.columns[0]].replace('', pd.NA).ffill()
            
            # Save to CSV
            df.to_csv('converted_tab.csv', index=False)
            
            print("Conversion done")
        else:
            print("No valid table found for the given heading.")

def main(input_filename, heading):
    if input_filename.lower().endswith('.docx'):
        pdf_filename = convert_docx_to_pdf(input_filename)
        print(f"Converted {input_filename} to {pdf_filename}")
    else:
        pdf_filename = input_filename

    if pdf_filename.lower().endswith('.pdf'):
        convert_tab(pdf_filename, heading)
    else:
        print("Unsupported file type. Only DOCX and PDF are supported.")

text = sys.argv[1]
block = sys.argv[2]

if any(char in text for char in ["/", "\\", "\\\\"]):
    file = text
    head
else:
    current_directory = os.getcwd()
    file = current_directory + "\\" + text

head= block + " OBJECTIVES AND ENDPOINTS\n"

# Call the function with your specific file and heading
main(file, head)


