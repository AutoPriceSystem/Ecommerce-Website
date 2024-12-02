# from flask import Flask, request, jsonify
# import requests
# from bs4 import BeautifulSoup

# app = Flask(__name__)

# # Function to scrape Walmart data
# def scrape_walmart(query):
#     headers = {
#         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
#     }
#     url = f"https://www.walmart.com/search/?q={query}"

#     response = requests.get(url, headers=headers)
#     soup = BeautifulSoup(response.text, "html.parser")

#     products = []
#     for item in soup.find_all('div', class_='mb0 ph0-xl pt0-xl bb b--near-white w-25 pb3-m ph1'):  # Update the class
#         name_tag = item.find('span', class_='normal dark-gray mb0 mt1 lh-title f6 f5-l lh-copy')
#         name = name_tag.text.strip() if name_tag else "N/A"

#         price_tag = item.find('span', class_='f2')
#         price = price_tag.text.strip() if price_tag else "N/A"

#         products.append({'Name': name, 'Price': price})

#     return products

# # Define a POST route for scraping
# @app.route('/scrape', methods=['POST'])
# def scrape():
#     try:
#         # Get the query from the POST request body
#         data = request.get_json()
#         query = data.get('query', '') 

#         products = scrape_walmart(query)
#         return jsonify({'status': 'success', 'data': products})
#     except Exception as e:
#         return jsonify({'status': 'error', 'message': str(e)})

# # Entry point
# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=4000)
from flask import Flask
from quart import Quart, request, jsonify
import math
import httpx
import asyncio
from typing import Dict, List, Literal
from urllib.parse import urlencode
from parsel import Selector

# Flask application
app = Quart(__name__)

# Sorting map for eBay search
SORTING_MAP = {
    "best_match": 12,  # Ensure sorting prioritizes best matches
    "ending_soonest": 1,
    "newly_listed": 10,
}

# Initialize an HTTPX async client
session = httpx.AsyncClient(
    headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.35",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
    },
    http2=True,
    follow_redirects=True,
)

# Function to parse eBay search results (Title and Price only)
def parse_search(response: httpx.Response) -> List[Dict]:
    """Parse eBay's search page for listing titles and prices."""
    previews = []
    sel = Selector(response.text)
    listing_boxes = sel.css(".srp-results li.s-item")
    for box in listing_boxes:
        css = lambda css: box.css(css).get("").strip()
        previews.append(
            {
                "title": css(".s-item__title>span::text"),
                "price": css(".s-item__price::text"),
            }
        )
    return previews

# Function to scrape eBay search results
async def scrape_search(
    query: str,
    max_pages: int = 1,
    category: int = 0,
    items_per_page: int = 240,
    sort: Literal["best_match", "ending_soonest", "newly_listed"] = "best_match",
    max_results: int = 20,  # Maximum number of results to return
) -> List[Dict]:
    """Scrape eBay's search results page for titles and prices."""
    def make_request(page: int) -> str:
        return "https://www.ebay.com/sch/i.html?" + urlencode(
            {
                "_nkw": query,
                "_sacat": category,
                "_ipg": items_per_page,
                "_sop": SORTING_MAP[sort],
                "_pgn": page,
            }
        )

    first_page = await session.get(make_request(page=1))
    results = parse_search(first_page)
    if len(results) >= max_results:
        return results[:max_results]

    # Find total results for pagination
    sel = Selector(first_page.text)
    total_results = sel.css(".srp-controls__count-heading>span::text").get()
    total_results = int(total_results.replace(",", "")) if total_results else 0
    total_pages = math.ceil(total_results / items_per_page)
    if total_pages > max_pages:
        total_pages = max_pages

    # Gather results from additional pages
    other_pages = [session.get(make_request(page=i)) for i in range(2, total_pages + 1)]
    for response in asyncio.as_completed(other_pages):
        response = await response
        try:
            results.extend(parse_search(response))
            if len(results) >= max_results:
                break
        except Exception as e:
            print(f"Failed to scrape search page {response.url}: {e}")
    return results[:max_results]


# Flask route to handle the scraping
@app.route("/scrape", methods=["POST"])
async def scrape():
    try:
        # Parse request JSON
        data = await request.get_json()
        query = data.get("query", "")
     
        # Validate input
        if not query:
            return jsonify({"error": "Query parameter is required"}), 400

        # Run the async scraping function in an event loop
       
        results = await scrape_search(query=query, max_pages=1)
  
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=4000, debug=True)
