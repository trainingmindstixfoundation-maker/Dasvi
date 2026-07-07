(async () => {
  try {
    const res = await fetch('http://localhost:3000');
    console.log('HTTP 3000 response status:', res.status);
  } catch (err) {
    console.error('HTTP 3000 failed:', err);
  }
})();
