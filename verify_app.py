import asyncio
import os
import sys
from playwright.async_api import async_playwright, expect
import threading
from http.server import HTTPServer, SimpleHTTPRequestHandler

# Ensure verification directory exists
os.makedirs("verification", exist_ok=True)

# Start a simple HTTP server in a separate thread
def start_server():
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)
    print("Serving HTTP on port 8000...")
    httpd.serve_forever()

server_thread = threading.Thread(target=start_server, daemon=True)
server_thread.start()

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        url = 'http://localhost:8000/wwwroot/verification.html'
        print(f"Navigating to {url}")

        await page.goto(url)

        # Wait for app to load
        print("Waiting for app to load...")
        await expect(page.get_by_text("Akıllı Okuma")).to_be_visible(timeout=30000)

        # Wait for note list and click the first one
        print("Waiting for note list...")
        await expect(page.get_by_text("Hızlı Başlangıç")).to_be_visible(timeout=10000)

        print("Opening note...")
        await page.click('text=Hızlı Başlangıç')

        # Wait for reader view
        print("Waiting for reader view...")
        await expect(page.locator('.sentence-container').first).to_be_visible(timeout=10000)

        # Wait a bit for background to render
        await asyncio.sleep(2)

        screenshot_path = "verification/reader_view.png"
        await page.screenshot(path=screenshot_path)
        print(f"Screenshot saved to {screenshot_path}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
