# **Multi-Channel Marketing Analytics Dashboard**

## **1\. Project Overview**

This project transforms raw, siloed advertising performance data from three major platforms (Google Ads, Facebook Ads, and TikTok Ads) into a unified data model.

The objective is to provide a single-page, interactive dashboard that centralizes key KPIs and offers actionable insights into cross-channel advertising performance and efficiency.

The dashboard is built with vanilla HTML, Tailwind CSS (loaded via CDN), and JavaScript (Chart.js), consuming a static JSON file for data visualization.

## **2\. Tech Stack**

* **Frontend:** HTML5, Tailwind CSS (via CDN), Chart.js  
* **Data:** Static JSON (data/unified\_data.json)  
* **Data Pipeline (Reference):** DB/unified\_ads\_model.sql (BigQuery script to generate the JSON from the source CSVs)

## **3\. File Structure**

```

/
├── index.html              # Main dashboard structure (HTML)
├── style.css               # Custom styles (CSS)
├── app.js                  # Application logic (KPI calculations & chart rendering)
├── data/
│   └── unified_data.json   # The clean, unified dataset (360 rows)
├── DB/
│   └── unified_ads_model.sql # Reference SQL script for data transformation
└── README.md               # This file

```

## **4\. How to Run Locally**

**Important\!** This project will **not** work by simply opening index.html directly in the browser (it will show a CORS policy error).

Because app.js uses the fetch() function to load the data/unified\_data.json file, the browser requires the files to be served from a web server.

The easiest way to start a local server is using Python:

1. **Clone or download** this repository.  
2. **Navigate** to the project's root folder in your terminal.  
3. **Start a web server.** If you have Python 3 installed, run:

```

python -m http.server

```

6.   
   (If you use Python 2, the command is python \-m SimpleHTTPServer)  
7. **Open the dashboard** in your browser by visiting the following URL:  
   [**http://localhost:8000**](https://www.google.com/search?q=http://localhost:8000)

## **5\. Analysis & Insights Summary**

This dashboard reveals several critical insights about the $51.6K media portfolio:

1. **Data Quality Alert:** 76.6% of total spend ($39.5K) is untracked for revenue (coming from Facebook and TikTok). Budget optimization is being done "blind" on 2 of the 3 platforms.  
2. **Efficiency vs. Scale:** TikTok is the highest-spend platform ($21.2K) and drives the most conversion volume (2,101), but it is also the most expensive (\*\*$10.08 CPA\*\*). Facebook is the most efficient, with the **lowest CPA ($7.77)**.  
3. **The Value Engine:** Google Ads is the only platform with a proven ROAS of **6.33x**. The Shopping\_All\_Products campaign is the portfolio star, generating a **7.76x ROAS** at an efficient $6.18 CPA, validating product-market fit.  
4. **The Blended CPA Trap:** Platform-level CPAs hide the truth.  
   * **Facebook:** The Conversions\_Retargeting campaign ($6.70 CPA) is highly efficient, while the Video\_Views\_Campaign ($13.10 CPA) is very expensive.  
   * **TikTok:** The Influencer\_Collab campaign ($9.89 CPA) is the most efficient, while Traffic\_Campaign ($13.45 CPA) is the least profitable.
