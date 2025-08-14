(function(){
  function formatCurrencyIDR(value){
    try { return new Intl.NumberFormat('id-ID',{ style:'currency', currency:'IDR', maximumFractionDigits:0 }).format(value); } catch { return `Rp ${value}`; }
  }

  function categoryToClass(cat){
    const known = ['electronics','fashion','home','sports','beauty','toys'];
    return known.includes(cat) ? `cat-${cat}` : 'cat-other';
  }

  function createElement(tag, attrs={}, children=[]){
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k,v])=>{
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else if (v !== null && v !== undefined) el.setAttribute(k, v);
    });
    (Array.isArray(children) ? children : [children]).forEach(ch=>{
      if (ch === null || ch === undefined) return;
      if (typeof ch === 'string') el.appendChild(document.createTextNode(ch)); else el.appendChild(ch);
    });
    return el;
  }

  function getQueryParam(name){
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

  window.UIUtils = { formatCurrencyIDR, categoryToClass, createElement, getQueryParam, clamp };
})();