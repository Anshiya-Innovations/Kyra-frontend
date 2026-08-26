# Global Regions Map - SAP UI5 Fiori Component (Isolated Map Wrapper)

This folder contains a lightweight, responsive world map overlay component built using the **SAP UI5** framework with the modern **Fiori Horizon** theme (`sap_horizon`).

It places location pin markers and region names on top of the world map dynamically. The world map checkers have been removed using high-contrast CSS filters to ensure it renders with a clean, pure white background.

## Folder Structure

```text
region/
├── world-map.jpg           # The world map image asset
├── index.html              # Loader page bootstrapping SAP UI5 & declaring views/controllers inline
├── style.css               # Stylesheet for custom map overlays & filters
└── README.md               # Developer integration guide (this file)
```

---

## 🚀 Running the App

To run the application, you can simply open the `index.html` file directly in your web browser by double-clicking it on your Desktop. Since all view and controller structures are inline, it does **not** trigger CORS security blocks when running locally!

Alternatively, you can serve it via a local web server:

1. **Using Node.js (`http-server`)**:
   Run the following inside this directory:
   ```bash
   npx http-server -p 8082
   ```
   Then open `http://localhost:8082/index.html` in your browser.

2. **Using Python (built-in)**:
   Run the following in the terminal:
   ```bash
   python -m http.server 8082
   ```
   Then open `http://localhost:8082/index.html` in your browser.

---

## 🛠️ Customization & Key Features

### 1. Pure White Background Filter
The uploaded world map image has a grey/white checkered pattern. In [`style.css`](style.css), we apply a high-contrast CSS filter to the image:
```css
.world-map-img {
  filter: contrast(3.8) brightness(1.22);
}
```
This forces all grey checkered pixels to blend into solid pure white, leaving the dark continents black.

### 2. Adding/Modifying Regions
To add or modify regions, update the JSON model array inside the `onInit` hook in the `<script>` tag of [`index.html`](index.html).

Pins are placed using percentage coordinates:
* `left`: Horizontal location percentage (0% to 100%).
* `top`: Vertical location percentage (0% to 100%).

Example:
```javascript
{ id: "na", name: "North America", left: "20.5%", top: "32%" }
```
Using percentages ensures that the markers remain aligned over the map regardless of window resizing or desktop resolution changes.
