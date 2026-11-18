/** ChatGPT Ads (OpenAI) pixel. One setup script per page, near the top of <head>. */
export const OPENAI_ADS_PIXEL_ID = "KemQ4guca7ZTJsby9CpkHf";

/** The pixel setup snippet from Ads Manager, with our pixel ID. */
export const OPENAI_ADS_PIXEL_SNIPPET = `!function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=1;j.src=u;var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f)}(window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");oaiq("init",{pixelId:"${OPENAI_ADS_PIXEL_ID}",debug:true});`;

/**
 * Google Tag Manager — the same container the previous site used, so the tags,
 * triggers and historical data inside it carry straight over.
 */
export const GTM_CONTAINER_ID = "GTM-P43HMWS";

/** Standard GTM loader. It creates `dataLayer` itself, so nothing else has to. */
export const GTM_SNIPPET = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');`;

/** `<noscript>` fallback, which GTM expects as the first thing in `<body>`. */
export const GTM_NOSCRIPT_SRC = `https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}`;
