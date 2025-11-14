# **Dashboard de Analítica de Marketing Multicanal**

## **1\. Resumen del Proyecto**

Este proyecto transforma datos de rendimiento publicitario brutos y aislados de tres plataformas principales (Google Ads, Facebook Ads y TikTok Ads) en un modelo de datos unificado.

El objetivo es proporcionar un dashboard interactivo de una sola página que centralice los KPIs clave y ofrezca insights accionables sobre el rendimiento y la eficiencia del gasto publicitario en todos los canales.

El dashboard está construido con HTML, CSS (Tailwind) y JavaScript (Chart.js), y consume un archivo JSON estático para la visualización de datos.

## **2\. Stack Tecnológico**

* **Frontend:** HTML5, Tailwind CSS (cargado vía CDN), Chart.js  
* **Datos:** JSON estático (data/unified\_data.json)  
* **Pipeline de Datos (Referencia):** unified\_ads\_model.sql (Script de BigQuery para generar el JSON desde los CSVs)

## **3\. Estructura de Archivos**

```

/
├── index.html              # Archivo principal de la estructura del dashboard (HTML)
├── style.css               # Estilos personalizados (CSS)
├── app.js                  # Lógica de la aplicación (Cálculos de KPI y renderizado de gráficos)
├── data/
│   └── unified_data.json   # El conjunto de datos unificado y limpio (360 filas)
└── unified_ads_model.sql     # Script SQL de referencia para la transformación de datos

```

## **4\. Cómo Ejecutar Localmente**

**¡Importante\!** Este proyecto no funcionará simplemente abriendo index.html directamente en el navegador (dará un error de política de CORS).

Debido a que app.js usa la función fetch() para cargar el archivo data/unified\_data.json, el navegador requiere que los archivos se sirvan desde un servidor web.

La forma más sencilla de iniciar un servidor local es usando Python:

1. **Clona o descarga** este repositorio.  
2. **Navega** a la carpeta raíz del proyecto en tu terminal.  
3. **Inicia un servidor web.** Si tienes Python 3 instalado, ejecuta:

```

python -m http.server

```

6.   
   (Si usas Python 2, el comando es python \-m SimpleHTTPServer)  
7. **Abre el dashboard** en tu navegador visitando la siguiente URL:  
   [**http://localhost:8000**](https://www.google.com/search?q=http://localhost:8000)

## **5\. Resumen del Análisis y Conclusiones**

Este dashboard revela varios insights críticos sobre el portafolio de medios de $51.6K:

1. **Alerta de Calidad de Datos:** El 76.6% del gasto total ($39.5K) no tiene seguimiento de ingresos (proviene de Facebook y TikTok). La optimización del presupuesto se está realizando "a ciegas" en 2 de las 3 plataformas.  
2. **Eficiencia vs. Escala:** TikTok es la plataforma de mayor gasto ($21.2K) y mayor volumen de conversiones (2,101), pero también la más cara (**CPA de $10.08**). Facebook es la más eficiente, con el **CPA más bajo ($7.77)**.  
3. **El Motor de Valor:** Google Ads es la única plataforma con un ROAS comprobado de **6.33x**. La campaña Shopping\_All\_Products es la estrella del portafolio, generando un **ROAS de 7.76x** con un CPA eficiente de $6.18, validando el product-market fit.  
4. **La Trampa del CPA Mixto:** Los CPAs a nivel de plataforma ocultan la verdad.  
   * **Facebook:** La campaña de Conversions\_Retargeting ($6.70 CPA) es altamente eficiente, mientras que la de Video\_Views\_Campaign ($13.10 CPA) es muy cara.  
   * **TikTok:** La campaña Influencer\_Collab ($9.89 CPA) es la más eficiente, mientras que Traffic\_Campaign ($13.45 CPA) es la menos rentable.
