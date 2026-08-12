# ThessInfo - Environmental Data Platform.

🔗 Live Demo: users.it.teithe.gr/~iliasalt/ThessInfo/#/
<img width="1895" height="901" alt="thessinfo" src="https://github.com/user-attachments/assets/edee7ffe-b288-4254-ab42-b745b976c4d1" />

ThessInfo is a React application for visualizing water quality, air quality, and recycling compliance data across municipalities in Thessaloniki, Greece. Developed as an entry to the **Open Data Greece** competition, ThessInfo makes public environmental data accessible, interactive, and easy to explore for both citizens and decision‑makers.

## 📌 Purpose

* **Explore by Region**: Interactive map and sortable tables to compare environmental metrics in each municipality.
* **Transparent Insights**: Instant access to water turbidity, pH, chlorine, air pollutants (e.g. NO₂), and recycling rates per capita.
* **Highlight Excellence**: Showcase top-performing municipalities in each category with deep dives into monthly trends.
* **Data‑Driven Policy**: Support informed decision‑making for local authorities and environmental agencies.

## 🚀 Features

* **Interactive Leaflet Map**: Color‑coded regions based on compliance thresholds, tooltips, legends, and fit‑bounds.
* **Responsive Charts**: Recharts visualizations for trend analysis (monthly time series).
* **Sortable Tables**: Material‑UI tables with tabs for Water, Recycling, Air and column sorting.
* **Best Regions Cards**: Spotlight the leading municipality in each category, with custom alerts explaining methodology.
* **Global State**: React Context + Axios for centralized API calls and loading state.
* **Routing**: React Router powered navigation between search, map, and detail pages.
* **Responsive Design**: Fully responsive layouts, media queries for small screens.

## 🛠️ Technologies

* **Frontend**: React, React Router, React Leaflet, Recharts, Material‑UI, React‑Select, React‑Icons
* **Backend**: Python, Django, Django REST Framework
* **State Management**: React Context API, Axios
* **Styling**: CSS Modules, responsive design via media queries
* **APIs & Data**: OpenStreetMap tiles, GeoJSON boundaries
* **Tooling**: Vite, ESLint, Prettier

## 📦 Installation & Setup

1. **Clone repository**

   ```bash
   git clone https://github.com/Retsos/ThessInfo.git
   ```

2. **Frontend setup**

   ```bash
   cd thessinfo/frontend
   npm install    # or yarn install
   ```

3. **Backend setup**

   ```bash
   cd ../Backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Environment variables**
   Copy `.env.example` → `.env` and set:

   ```dotenv
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

5. **Run development servers**

   * Frontend: `npm run dev` (from `/frontend`)
   * Backend: `python manage.py runserver` (from `/backend`)

6. **Build for production**

   ```bash
   cd frontend
   npm run build
   ```

## 📊 Data Endpoints

* **Air Quality**:  `airqualit/area/<str:area>/latest-measurements/`, `airqualit/area/<str:area>/group-by-year/`
                    `airqualit/best-area-latest/`, `airqualit/monthly-compliance/`,`airqualit/worst-area/`
  
* **Water Quality**: `water/api/latest-measurements/`, `water/api/group-by-year/`,`water/api/regions-latest-compliance/`
                     `water/BestRegionView/`,`water/MarginAreas/`
  
* **Recycling**: `recycle/recycling-ota/`, `recycle/recycling-perperson/`,`recycle/recycling-good/`
                 `recycle/top-recycling-per-person/`,`recycle/top-recycling/`
  

Endpoints are served by a Django REST API using open data from Greek municipal and academic sources.

## 🤝 Contributing

1. Fork the repo
2. Create a branch (`git checkout -b feature/YourFeature`)
3. Commit changes (`git commit -m "Your message"`)
4. Push and open a PR against `main`

Please include tests and ensure consistency with the existing code style.

## 📄 License

This project is licensed under the **MIT License**. 

## 🙏 Acknowledgements

* **Open Data Greece** for hosting the competition.
* **OpenStreetMap** community for free map tiles.
* **Municipalities & Universities** for providing open environmental data.

---

*Built with ❤️ by the ThessInfo Team*
