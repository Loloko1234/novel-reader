from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

def scrape_novelbin(url):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        paragraphs = soup.find_all('p')
        chapters = soup.find_all('span', class_='chr-text')
        
        result = {
            "chapters": [chapter.text.strip() for chapter in chapters if chapter.text.strip().startswith("Chapter")],
            "paragraphs": [p.text.strip() for p in paragraphs if p.text.strip()]
        }
        return result
    else:
        return {"error": f"Failed to retrieve the webpage. Status code: {response.status_code}"}

@app.route('/scrape', methods=['POST'])
def scrape():
    url = request.json['url']
    result = scrape_novelbin(url)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)