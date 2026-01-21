# 📦 InventoryPro: Digital Vault
### *A Minimalist Japandi Inventory Management System*

**InventoryPro** is a high-performance, browser-based inventory management application designed with the **Japandi** aesthetic—a fusion of Japanese minimalism and Scandinavian functionality. It focuses on clean lines, high contrast, and a "Bento Box" layout to provide a clutter-free data management experience for modern asset tracking.



---

## 🛑 Problem Statement
Small business owners and warehouse managers often struggle with overly complex inventory software that is cluttered, difficult to navigate, and slow to load. Many systems lack immediate visual feedback for critical stock levels or require multiple clicks just to update a single quantity.

**InventoryPro** solves this by providing:
1.  **Instant Visual Hierarchy:** A Bento-style dashboard that highlights the most important metrics (Valuation and Alerts) at a glance.
2.  **Efficient Data Entry:** Streamlined manual editing and bulk CSV uploads to reduce administrative overhead.
3.  **Proactive Monitoring:** Real-time system notifications and automated filtering to ensure stock never runs out unexpectedly.

---

## ✨ Features Implemented

### 1. **Live Stats Dashboard**
* **Total Valuation:** Automatically calculates the monetary value of current stock.
* **Search-Synced Metrics:** The valuation and alert counters update in real-time based on your current search/filter view.

### 2. **Interactive Low-Stock Filtering**
* The "Low Stock Alerts" card acts as a functional toggle. Click it to instantly filter the table to show *only* items requiring attention.

### 3. **Manual Stock Entry (Double-Click)**
* Double-click any stock quantity to transform static text into an active input field for rapid adjustments without using increment buttons.



### 4. **Auto-Purge Intelligence**
* To maintain a clean database, items are automatically removed from the system when stock reaches zero, accompanied by a native OS notification.

### 5. **Bulk Data Migration**
* Support for CSV file uploads to import hundreds of items instantly using the format: `Name, Price, Quantity, AlertLevel`.

### 6. **Desktop Notifications**
* Leverages the Browser Notification API to send alerts when stock levels drop below thresholds, even if the application is in a background tab.

---

## 🛠️ DOM Concepts Used

This project demonstrates mastery of advanced Vanilla JavaScript and DOM API manipulation:

* **Dynamic Element Creation:** Uses `document.createElement('tr')` and template literals to build the UI based on `LocalStorage` state.
* **Element Swapping:** Implementation of `element.replaceWith(input)` to swap UI states during inline editing.
* **Event Handling:** Utilization of multiple event types including `click`, `dblclick`, `input`, `submit`, and `change`.
* **Live DOM Updates:** Real-time calculation and injection of data into specific IDs (`total-val`, `alert-count`) without page refreshes.
* **CSS Class Toggling:** Dynamic use of `classList.toggle()` to manage visual filter states and high-contrast status badges.



---

## 🚀 Steps to Run the Project

Follow these steps to set up the project on your local machine:

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/your-username/inventory-pro.git](https://github.com/your-username/inventory-pro.git)
    ```
2.  **Navigate to Directory:**
    ```bash
    cd inventory-pro
    ```
3.  **Launch the App:**
    * Open the `index.html` file in any modern web browser (Chrome, Edge, or Firefox).
    * *Tip:* Use the "Live Server" extension in VS Code for the best experience.
4.  **Enable Notifications:**
    * When the browser asks for permission, click **Allow** to enable the native low-stock alert feature.
5.  **Test with CSV:**
    * Use the "Bulk Data Import" section to upload a `.csv` file with the headers: `Name, Price, Qty, AlertLevel`.

---

