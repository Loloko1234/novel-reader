import os
import requests
from bs4 import BeautifulSoup
from flask import Flask, request, render_template

# Get the current directory
current_dir = os.path.dirname(os.path.abspath(__file__))
# Set the template folder to a 'templates' subdirectory
template_dir = os.path.join(current_dir, 'templates')

# Create the Flask app with the template folder specified
app = Flask(__name__, template_folder=template_dir)

def scrape_novelbin(url):
    # Send a GET request to the URL
    response = requests.get(url)
    
    # Check if the request was successful
    if response.status_code == 200:
        # Parse the HTML content
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find all <p> and <h4> elements
        paragraphs = soup.find_all('p')
        headings = soup.find_all('h4')
        
        # Prepare the result
        result = []
        result.append("Headings (h4):")
        for heading in headings:
            result.append(heading.text.strip())
        
        result.append("\nParagraphs (p):")
        for paragraph in paragraphs:
            # Check if the paragraph is not empty
            if paragraph.text.strip():
                result.append(paragraph.text.strip())
        
        return "\n".join(result)
    else:
        return f"Failed to retrieve the webpage. Status code: {response.status_code}"

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/scrape', methods=['POST'])
def scrape():
    url = request.form['url']
    result = scrape_novelbin(url)
    return f"<pre>{result}</pre>"

if __name__ == '__main__':
    app.run(debug=True)