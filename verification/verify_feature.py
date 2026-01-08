from playwright.sync_api import sync_playwright

def verify():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:8080/verification.html")
            page.wait_for_selector("#root", timeout=5000)

            # Wait for React to mount
            page.wait_for_selector("header", timeout=10000)

            print("Page loaded successfully.")

            # Check for missing aria-labels on ALL buttons
            buttons = page.query_selector_all("button")
            print(f"Found {len(buttons)} buttons total.")

            missing_aria = []
            for btn in buttons:
                text = btn.inner_text().strip()
                aria_label = btn.get_attribute("aria-label")
                if not text and not aria_label:
                    html = btn.inner_html()
                    missing_aria.append(html)

            if len(missing_aria) == 0:
                print("PASS: All buttons have text or aria-label.")
            else:
                print(f"FAIL: Found {len(missing_aria)} buttons missing accessible names.")
                for html in missing_aria:
                    print(f"Missing Label: {html[:100]}...")

            # Check Dashboard cards
            # We look for "Favoriler" text.
            try:
                fav_locator = page.get_by_text("Favoriler")
                # Traverse up to find button
                element = fav_locator
                found_button = False
                for _ in range(5): # Check 5 levels up
                    tag = element.evaluate("el => el.tagName.toLowerCase()")
                    print(f"Ancestor tag: {tag}")
                    if tag == "button":
                        found_button = True
                        break
                    element = element.locator("xpath=..")

                if found_button:
                    print("PASS: Favorites card is a BUTTON.")
                else:
                    print("FAIL: Favorites card is NOT a BUTTON.")
            except Exception as e:
                print(f"Could not check Favorites card: {e}")

            # Screenshot
            page.screenshot(path="verification/verification.png")
            print("Screenshot saved to verification/verification.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify()