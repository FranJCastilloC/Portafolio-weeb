export const STORAGE_KEY = "lang";

/* Runs synchronously in <head> before first paint. It picks the language
   (saved choice, else the browser's) and, for Spanish, hides the body until
   React has re-rendered in Spanish — otherwise the prerendered English flashes.
   The timeout is a safety net: content never stays hidden if hydration fails. */
export const languageBootScript = `(function(){try{var d=document.documentElement,l=null;try{l=localStorage.getItem("${STORAGE_KEY}")}catch(e){}if(l!=="en"&&l!=="es"){var n=navigator.languages||[navigator.language||""];l="en";for(var i=0;i<n.length;i++){if(/^es\\b/i.test(n[i])){l="es";break}if(/^en\\b/i.test(n[i]))break}}d.lang=l;d.setAttribute("data-lang",l);if(l==="es"){d.setAttribute("data-i18n-pending","");setTimeout(function(){d.removeAttribute("data-i18n-pending")},1500)}}catch(e){}})();`;
