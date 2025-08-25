import requests
from bs4 import BeautifulSoup
import logging
from typing import List, Dict
import os
import time
import re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
import os
from pymongo import MongoClient
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

def scrape_economic_times_news() -> List[Dict]:
    """
    Scrape news headlines and URLs from Economic Times markets page
    Returns list of dictionaries with headline, url, and source
    """
    url = "https://economictimes.indiatimes.com/markets"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        news_items = []
        
        # Find news elements - targeting the specific structure you mentioned
        news_elements = soup.find_all('p')
        
        for element in news_elements:
            # Find anchor tags within paragraph elements
            anchor = element.find('a', class_='font_faus')
            if anchor and anchor.get('href') and anchor.get('title'):
                headline = anchor.get_text(strip=True)
                news_url = anchor.get('href')
                
                # Ensure URL is absolute
                if not news_url.startswith('http'):
                    news_url = f"https://economictimes.indiatimes.com{news_url}"
                
                news_items.append({
                    'headline': headline,
                    'url': news_url,
                    'source': 'Economic Times'
                })
                
                # Limit to 5 news items as requested
                if len(news_items) >= 5:
                    break
        
        # If the above method doesn't work, try alternative selectors
        if len(news_items) < 5:
            alternative_anchors = soup.find_all('a', class_='font_faus')
            for anchor in alternative_anchors:
                if anchor.get('href') and anchor.get('title'):
                    headline = anchor.get_text(strip=True)
                    news_url = anchor.get('href')
                    
                    if not news_url.startswith('http'):
                        news_url = f"https://economictimes.indiatimes.com{news_url}"
                    
                    # Avoid duplicates
                    if not any(item['url'] == news_url for item in news_items):
                        news_items.append({
                            'headline': headline,
                            'url': news_url,
                            'source': 'Economic Times'
                        })
                    
                    if len(news_items) >= 5:
                        break
        
        logger.info(f"Successfully scraped {len(news_items)} news items")
        return news_items
        
    except requests.RequestException as e:
        logger.error(f"Network error while scraping news: {str(e)}")
        raise Exception(f"Network error: {str(e)}")
    except Exception as e:
        logger.error(f"Error scraping news: {str(e)}")
        raise Exception(f"Scraping error: {str(e)}")


class ChartinkScraper:
    """Scraper for Chartink stock data"""
    
    def __init__(self):
        load_dotenv()
        self.mongo_uri = os.getenv("MONGO_URI")
        if not self.mongo_uri:
            raise ValueError("MONGO_URI not found in environment variables")

        self.client = MongoClient(self.mongo_uri)
        self.db = self.client["stocksensor"]

        # Setup Chrome options
        chrome_options = Options()
        chrome_options.add_argument("--headless=new")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        chrome_options.add_argument("--disable-software-rasterizer")
        chrome_options.add_argument("--remote-debugging-port=9222")
        chrome_options.add_argument("--disable-features=VizDisplayCompositor")
        chrome_options.add_argument("--single-process")
        chrome_options.add_argument("--no-zygote")
        chrome_options.add_argument(
            "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/119.0.0.0 Safari/537.36"
        )

        # Allow overriding Chrome binary via env (Render)
        chrome_bin = os.getenv("GOOGLE_CHROME_BIN")
        if chrome_bin and os.path.exists(chrome_bin):
            chrome_options.binary_location = chrome_bin
        else:
            # Try common paths
            for path in ["/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome"]:
                if os.path.exists(path):
                    chrome_options.binary_location = path
                    break

        # Use system chromedriver if provided, else default service
        chromedriver_path = os.getenv("CHROMEDRIVER_PATH")
        try:
            if chromedriver_path and os.path.exists(chromedriver_path):
                service = Service(chromedriver_path)
                self.driver = webdriver.Chrome(service=service, options=chrome_options)
            else:
                # Fallback: hope chromedriver is on PATH
                self.driver = webdriver.Chrome(options=chrome_options)
        except Exception as e:
            logger.error(f"Failed to start ChromeDriver/Chrome: {e}")
            raise
        self.wait = WebDriverWait(self.driver, 30)

    def get_column_indices(self, soup):
        """Get the correct column indices based on table headers"""
        table = soup.find("table", {"id": "DataTables_Table_0"})
        if not table:
            return None

        headers = table.find("thead").find_all("th")
        column_indices = {
            "stock_name": -1,
            "symbol": -1,
            "percent_change": -1,
            "price": -1,
        }

        for idx, header in enumerate(headers):
            header_text = header.get_text(strip=True)
            if "Stock Name" in header_text:
                column_indices["stock_name"] = idx
            elif "Symbol" in header_text:
                column_indices["symbol"] = idx
            elif "% Chg" in header_text:
                column_indices["percent_change"] = idx
            elif "Price" in header_text:
                column_indices["price"] = idx

        return column_indices

    def scrape_table_data(self, url, source_name):
        """Generic scraper with pagination (up to 8 pages, stop if % Chg < 0)"""
        logger.info(f"Starting {source_name} data scraping...")
        scraped_data = []
        try:
            self.driver.get(url)

            # Wait for and click Run Scan button
            run_scan_button = self.wait.until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "button.run_scan_button"))
            )
            run_scan_button.click()

            # Loop through up to 8 pages
            for page in range(1, 9):
                self.wait.until(
                    EC.presence_of_element_located(
                        (By.CSS_SELECTOR, "table#DataTables_Table_0 tbody tr")
                    )
                )
                time.sleep(3)

                soup = BeautifulSoup(self.driver.page_source, "html.parser")
                column_indices = self.get_column_indices(soup)
                if not column_indices:
                    logger.error("Could not determine column indices")
                    break

                table = soup.find("table", {"id": "DataTables_Table_0"})
                rows = table.find("tbody").find_all("tr")

                stop_scraping = False

                for row in rows:
                    columns = row.find_all("td")
                    if len(columns) >= max(column_indices.values()) + 1:
                        try:
                            stock_name = columns[column_indices["stock_name"]].get_text(strip=True)
                            symbol = columns[column_indices["symbol"]].get_text(strip=True)

                            # % change
                            percent_text = columns[column_indices["percent_change"]].get_text(strip=True)
                            percent_change = float(re.sub(r"[^\d.-]", "", percent_text.replace("%", "")))

                            # Price
                            price_text = columns[column_indices["price"]].get_text(strip=True)
                            price = float(re.sub(r"[^\d.]", "", price_text.replace(",", "")))

                            # Stop scraping if %Chg < 0
                            if percent_change < 0:
                                logger.info("Found % Chg < 0. Stopping further scraping.")
                                stop_scraping = True
                                break

                            # Save only positive % Chg
                            if percent_change > 0:
                                data = {
                                    "stock_name": stock_name,
                                    "symbol": symbol,
                                    "percent_change": percent_change,
                                    "price": price,
                                    "scraped_at": time.time(),
                                    "source": source_name,
                                }
                                scraped_data.append(data)

                        except Exception as e:
                            logger.warning(f"Error parsing row: {e}")
                            continue

                logger.info(f"Page {page}: Scraped {len(scraped_data)} {source_name} records so far")

                if stop_scraping:
                    break

                # Try next page
                try:
                    next_button = self.wait.until(
                        EC.element_to_be_clickable((By.CSS_SELECTOR, "a[data-dt-idx='next']"))
                    )
                    if "disabled" in next_button.get_attribute("class"):
                        logger.info("No more pages available.")
                        break
                    next_button.click()
                    time.sleep(2)
                except Exception:
                    logger.info("Next button not clickable or no more pages.")
                    break

            return scraped_data

        except Exception as e:
            logger.error(f"Error scraping {source_name}: {e}")
            return scraped_data

    def scrape_vcp_data(self):
        return self.scrape_table_data("https://chartink.com/screener/vcp-breakout-pattern-1", "VCP_Breakout")

    def scrape_ipo_base_data(self):
        return self.scrape_table_data("https://chartink.com/screener/stockexploder-ipo-base-3", "IPO_Base")

    def store_data(self, collection_name, data):
        """Store data in MongoDB"""
        if not data:
            logger.warning(f"No data to store for {collection_name}")
            return

        try:
            collection = self.db[collection_name]

            # Clear existing data before inserting new data
            collection.delete_many({})

            # Insert new data
            result = collection.insert_many(data)
            logger.info(f"Inserted {len(result.inserted_ids)} records into {collection_name}")

        except Exception as e:
            logger.error(f"Error storing data in MongoDB: {e}")

    def run_scraping(self):
        """Run both scraping tasks"""
        try:
            vcp_data = self.scrape_vcp_data()
            self.store_data("VCP_sample", vcp_data)

            ipo_data = self.scrape_ipo_base_data()
            self.store_data("IPO_Base_sample", ipo_data)

        finally:
            self.cleanup()

    def cleanup(self):
        """Clean up resources"""
        try:
            self.driver.quit()
            self.client.close()
        except Exception as e:
            logger.error(f"Error during cleanup: {e}")