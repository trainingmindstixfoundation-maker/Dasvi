(async () => {
  try {
    const res = await fetch('http://localhost:5000/api/classes');
    console.log('HTTP 5000 classes status:', res.status);
    const data = await res.json();
    console.log('Classes:', data.map(c => c.name));
  } catch (err) {
    console.error('HTTP 5000 failed:', err);
  }
})();
