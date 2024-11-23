from flask import Flask, jsonify
import requests
from bs4 import BeautifulSoup
import pandas as pd

app = Flask(__name__)

# Function to scrape Walmart data
def scrape_walmart():
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
    }
    url = "https://www.walmart.com/search/?q=phone"

    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")

    products = []
    for item in soup.find_all('div', class_='mb0 ph0-xl pt0-xl bb b--near-white w-25 pb3-m ph1'):  # Update the class
        name_tag = item.find('span', class_='normal dark-gray mb0 mt1 lh-title f6 f5-l lh-copy')
        name = name_tag.text.strip() if name_tag else "N/A"

        price_tag = item.find('span', class_='f2')
        price = price_tag.text.strip() if price_tag else "N/A"

        products.append({'Name': name, 'Price': price})

    return products

# Define a route for scraping
@app.route('/scrape', methods=['GET'])
def scrape():
    try:
        products = scrape_walmart()
        return jsonify({'status': 'success', 'data': products})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

# Entry point
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
