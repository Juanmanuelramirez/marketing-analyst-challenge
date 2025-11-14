/*
==================================================================
Dashboard Application Logic (app.js)
==================================================================
Purpose: To fetch unified ad data, calculate KPIs, and
render all visualizations for the dashboard.
*/

// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Utility Functions ---
    
    /**
     * Formats a number as USD currency.
     * @param {number} value - The number to format.
     * @returns {string} - Formatted currency string (e.g., "$1,234").
     */
    const formatCurrency = (value) => {
        if (value === null || isNaN(value)) return "$0";
        return value.toLocaleString('en-US', { 
            style: 'currency', 
            currency: 'USD', 
            maximumFractionDigits: 0 
        });
    };

    /**
     * Formats a number as USD currency with cents.
     * @param {number} value - The number to format.
     * @returns {string} - Formatted currency string (e.g., "$1.23").
     */
    const formatCurrencyCents = (value) => {
        if (value === null || isNaN(value)) return "$0.00";
        return value.toLocaleString('en-US', { 
            style: 'currency', 
            currency: 'USD', 
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 
        });
    };

    /**
     * Formats a number with commas.
     * @param {number} value - The number to format.
     * @returns {string} - Formatted number string (e.g., "1,234").
     */
    const formatNumber = (value) => {
        if (value === null || isNaN(value)) return "0";
        return value.toLocaleString('en-US');
    };

    /**
     * Formats a number as a multiplier (e.g., "6.33x").
     * @param {number} value - The number to format.
     * @returns {string} - Formatted multiplier string.
     */
    const formatMultiplier = (value) => {
        if (value === null || isNaN(value)) return "N/A";
        return `${value.toFixed(2)}x`;
    };

    /**
     * Formats a number as a percentage.
     * @param {number} value - The number (e.g., 0.691).
     * @returns {string} - Formatted percentage string (e.g., "69.1%").
     */
    const formatPercent = (value) => {
        if (value === null || isNaN(value)) return "0.0%";
        return (value * 100).toFixed(1) + '%';
    }

    /**
     * Fetches and processes the dashboard data.
     */
    async function initializeDashboard() {
        try {
            // 1. Fetch Data
            const response = await fetch('data/unified_data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const unifiedData = await response.json();

            // 2. Data Validation & Cleaning (Simple)
            // Ensure key metrics are numbers and handle nulls
            const cleanedData = unifiedData.map(row => {
                // Fix for known date inconsistencies in source data
                let dateStr = row.date;
                if (dateStr.includes("Gacrux-Light") || dateStr.includes("Enceladus-Light")) {
                    // Extract the valid date part
                    dateStr = dateStr.split("-")[0] + "-" + dateStr.split("-")[1] + "-" + dateStr.split("-")[2];
                }

                return {
                    ...row,
                    impressions: parseInt(row.impressions) || 0,
                    clicks: parseInt(row.clicks) || 0,
                    spend: parseFloat(row.spend) || 0,
                    conversions: parseInt(row.conversions) || 0,
                    revenue: parseFloat(row.revenue) || null, // Keep nulls for revenue
                    date: new Date(dateStr) // Convert date strings to Date objects
                }
            });

            // 3. Calculate Global KPIs
            const totals = cleanedData.reduce((acc, row) => {
                acc.spend += row.spend;
                acc.conversions += row.conversions;
                acc.clicks += row.clicks;
                acc.impressions += row.impressions;
                if (row.revenue !== null && !isNaN(row.revenue)) {
                    acc.revenue += row.revenue;
                    acc.trackedSpend += row.spend;
                }
                return acc;
            }, { spend: 0, conversions: 0, clicks: 0, impressions: 0, revenue: 0, trackedSpend: 0 });

            const overallCPA = totals.spend / totals.conversions;
            const overallCPC = totals.spend / totals.clicks;
            const trackedROAS = totals.revenue / totals.trackedSpend;
            const untrackedSpend = totals.spend - totals.trackedSpend;
            const untrackedSpendPercent = untrackedSpend / totals.spend;

            // 4. Populate KPI Cards
            document.getElementById('kpi-spend').textContent = formatCurrency(totals.spend);
            document.getElementById('kpi-conversions').textContent = formatNumber(totals.conversions);
            document.getElementById('kpi-cpa').textContent = formatCurrencyCents(overallCPA);
            document.getElementById('kpi-revenue').textContent = formatCurrency(totals.revenue);
            document.getElementById('kpi-roas').textContent = formatMultiplier(trackedROAS);
            document.getElementById('kpi-untracked').textContent = formatPercent(untrackedSpendPercent);

            // 5. Aggregate Data by Platform
            const platformData = cleanedData.reduce((acc, row) => {
                if (!acc[row.platform]) {
                    acc[row.platform] = { spend: 0, conversions: 0, clicks: 0, impressions: 0 };
                }
                acc[row.platform].spend += row.spend;
                acc[row.platform].conversions += row.conversions;
                acc[row.platform].clicks += row.clicks;
                acc[row.platform].impressions += row.impressions;
                return acc;
            }, {});

            const platforms = Object.keys(platformData);
            const platformSpend = platforms.map(p => platformData[p].spend);
            const platformConversions = platforms.map(p => platformData[p].conversions);
            const platformCPA = platforms.map(p => platformData[p].spend / platformData[p].conversions);
            const platformCPC = platforms.map(p => platformData[p].spend / platformData[p].clicks);

            // 6. Aggregate Data by Day
            const timeSeriesData = cleanedData.reduce((acc, row) => {
                // Ensure date is valid before processing
                if (row.date && typeof row.date.toISOString === 'function') {
                    const dateString = row.date.toISOString().split('T')[0]; // Group by YYYY-MM-DD
                    if (!acc[dateString]) {
                        acc[dateString] = { spend: 0, conversions: 0, date: row.date };
                    }
                    acc[dateString].spend += row.spend;
                    acc[dateString].conversions += row.conversions;
                } else {
                    console.warn("Invalid date encountered:", row);
                }
                return acc;
            }, {});

            const sortedTimeSeries = Object.values(timeSeriesData).sort((a, b) => a.date - b.date);
            const sortedDates = sortedTimeSeries.map(d => d.date);
            const dailySpend = sortedTimeSeries.map(d => d.spend);
            const dailyConversions = sortedTimeSeries.map(d => d.conversions);

            // --- Charting ---
            
            // Brand Colors
            const COLORS = {
                facebook: 'rgb(24, 119, 242)',
                google: 'rgb(234, 67, 53)', // Google Red
                tiktok: 'rgb(0, 0, 0)'      // TikTok Black
            };

            // Chart 1: Platform Performance (Doughnut)
            new Chart(document.getElementById('platformPerformanceChart'), {
                type: 'doughnut',
                data: {
                    labels: platforms,
                    datasets: [
                        {
                            label: 'Spend',
                            data: platformSpend,
                            backgroundColor: [COLORS.facebook, COLORS.google, COLORS.tiktok],
                            borderWidth: 0,
                        },
                        {
                            label: 'Conversions',
                            data: platformConversions,
                            backgroundColor: [COLORS.facebook, COLORS.google, COLORS.tiktok],
                            borderWidth: 0,
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom' },
                        tooltip: { 
                            callbacks: { 
                                label: (c) => `${c.dataset.label}: ${formatCurrency(c.raw)}` 
                            } 
                        }
                    }
                }
            });

            // Chart 2: Time Series (Line)
            new Chart(document.getElementById('timeSeriesChart'), {
                type: 'line',
                data: {
                    labels: sortedDates,
                    datasets: [
                        {
                            label: 'Total Spend',
                            data: dailySpend,
                            borderColor: 'rgb(59, 130, 246)', // Tailwind 'blue-500'
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            fill: true,
                            tension: 0.1,
                            yAxisID: 'ySpend'
                        },
                        {
                            label: 'Total Conversions',
                            data: dailyConversions,
                            borderColor: 'rgb(22, 163, 74)', // Tailwind 'green-600'
                            backgroundColor: 'rgba(22, 163, 74, 0.1)',
                            fill: false,
                            tension: 0.1,
                            yAxisID: 'yConversions'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { 
                            type: 'time',
                            time: { unit: 'day', tooltipFormat: 'MMM dd' },
                            grid: { display: false }
                        },
                        ySpend: {
                            type: 'linear',
                            position: 'left',
                            title: { display: true, text: 'Spend ($)' },
                            ticks: { callback: (val) => formatCurrency(val) }
                        },
                        yConversions: {
                            type: 'linear',
                            position: 'right',
                            title: { display: true, text: 'Conversions' },
                            grid: { drawOnChartArea: false }, // No overlapping grids
                        }
                    },
                    plugins: {
                        tooltip: { mode: 'index', intersect: false }
                    }
                }
            });

            // Chart 3: Efficiency (Bar)
            new Chart(document.getElementById('efficiencyChart'), {
                type: 'bar',
                data: {
                    labels: platforms,
                    datasets: [
                        {
                            label: 'CPA (Cost per Acquisition)',
                            data: platformCPA,
                            backgroundColor: [COLORS.facebook, COLORS.google, COLORS.tiktok],
                            yAxisID: 'yCPA'
                        },
                        {
                            label: 'CPC (Cost per Click)',
                            data: platformCPC,
                            backgroundColor: ['#93c5fd', '#fca5a5', '#9ca3af'], // Lighter tones
                            yAxisID: 'yCPC'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        yCPA: {
                            type: 'linear',
                            position: 'left',
                            title: { display: true, text: 'CPA ($)' },
                            ticks: { callback: (val) => formatCurrencyCents(val) }
                        },
                        yCPC: {
                            type: 'linear',
                            position: 'right',
                            title: { display: true, text: 'CPC ($)' },
                            grid: { drawOnChartArea: false },
                            ticks: { callback: (val) => formatCurrencyCents(val) }
                        }
                    },
                    plugins: {
                        tooltip: { 
                            callbacks: { 
                                label: (c) => `${c.dataset.label}: ${formatCurrencyCents(c.raw)}` 
                            } 
                        }
                    }
                }
            });

        } catch (error) {
            console.error("Failed to initialize dashboard:", error);
            // You could show an error message to the user on the page
            document.body.innerHTML = `<div class="p-8 text-red-500"><strong>Error:</strong> Failed to load dashboard data. ${error.message}</div>`;
        }
    }

    // Run the application
    initializeDashboard();
});