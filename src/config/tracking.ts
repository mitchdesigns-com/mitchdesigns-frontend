/** ChatGPT Ads (OpenAI) pixel. One setup script per page, near the top of <head>. */
export const OPENAI_ADS_PIXEL_ID = "KemQ4guca7ZTJsby9CpkHf";

/** The pixel setup snippet from Ads Manager, with our pixel ID. */
export const OPENAI_ADS_PIXEL_SNIPPET = `!function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=1;j.src=u;var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f)}(window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");oaiq("init",{pixelId:"${OPENAI_ADS_PIXEL_ID}",debug:true});`;
