const fs = require('fs');

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  for (const { search, replace } of replacements) {
    content = content.replace(search, replace);
  }
  fs.writeFileSync(filePath, content);
}

// 1. Redesign Navbar.jsx
replaceInFile('src/components/Navbar.jsx', [
  {
    search: /E-Kaushalaya Hub/g,
    replace: 'Dasvi Platform'
  },
  {
    search: /<nav className="navbar glass-nav sticky-top p-0">/,
    replace: '<nav className="navbar sticky-top p-0 border-bottom" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-subtle)", boxShadow: "0 4px 20px rgba(92, 64, 51, 0.04)" }}>'
  },
  {
    search: /filter: 'drop-shadow\(0 2px 4px rgba\(28, 68, 133, 0\.08\)\)'/g,
    replace: "filter: 'drop-shadow(0 2px 4px rgba(92, 64, 51, 0.08))'"
  }
]);

// 2. Redesign HeroBanner.jsx
replaceInFile('src/components/HeroBanner.jsx', [
  {
    search: /background: 'var\(--hero-gradient\)',\s*padding: '5rem 2rem 4rem 2rem',\s*borderColor: 'rgba\(0, 119, 204, 0\.12\)',\s*boxShadow: '0 10px 30px rgba\(0, 119, 204, 0\.03\)'/,
    replace: "backgroundColor: 'var(--bg-primary)', padding: '6rem 2rem', border: '1px solid var(--border-subtle)', borderRadius: '30px', boxShadow: '0 20px 40px rgba(92, 64, 51, 0.05)'"
  },
  {
    search: /backgroundColor: 'rgba\(28, 68, 133, 0\.06\)',\s*color: 'var\(--brand-primary\)',\s*border: '1px solid rgba\(28, 68, 133, 0\.12\)',/g,
    replace: "backgroundColor: 'rgba(92, 64, 51, 0.08)', color: 'var(--brand-primary)', border: '1px solid rgba(92, 64, 51, 0.15)',"
  },
  {
    search: /background: 'linear-gradient\(135deg, var\(--brand-secondary\) 0%, var\(--brand-primary\) 100%\)'/g,
    replace: "background: 'linear-gradient(135deg, var(--brand-secondary) 0%, var(--brand-primary) 100%)'"
  },
  {
    search: /background: 'linear-gradient\(135deg, #10b981 0%, #059669 100%\)'/,
    replace: "background: 'linear-gradient(135deg, var(--brand-secondary) 0%, var(--brand-primary) 100%)'"
  },
  {
    search: /border: lastSession \? '2px solid var\(--brand-primary\)' : 'none',/g,
    replace: "border: lastSession ? '2px solid var(--brand-primary)' : '1px solid var(--brand-primary)',"
  }
]);

// 3. Redesign TradeCard.jsx
replaceInFile('src/components/TradeCard.jsx', [
  {
    search: /border: '1px solid var\(--border-subtle\)', backgroundColor: 'var\(--bg-secondary\)'/,
    replace: "border: 'none', backgroundColor: 'var(--bg-secondary)', borderRadius: '24px', boxShadow: '0 12px 30px rgba(92, 64, 51, 0.04)'"
  },
  {
    search: /<div className="trade-icon-container">/,
    replace: '<div className="trade-icon-container" style={{ background: "var(--bg-primary)", borderRadius: "50%", width: "70px", height: "70px", boxShadow: "0 8px 20px rgba(92, 64, 51, 0.05)" }}>'
  },
  {
    search: /style={{ fontSize: '0\.88rem', lineHeight: '1\.45' }}/,
    replace: "style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}"
  }
]);

// 4. Redesign Home.jsx
replaceInFile('src/pages/Home.jsx', [
  {
    search: /border: '1px solid var\(--border-subtle\)'/g,
    replace: "border: 'none', boxShadow: '0 8px 25px rgba(92, 64, 51, 0.04)', borderRadius: '20px'"
  },
  {
    search: /backgroundColor: 'rgba\(92, 64, 51, 0\.08\)'/g,
    replace: "backgroundColor: 'rgba(139, 90, 43, 0.1)'"
  }
]);

console.log('Component redesign patched successfully.');
