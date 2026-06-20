async function test() {
  try {
    const text = "Safe Working Practices";
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log("Response:", JSON.stringify(data));
    console.log("Translated:", data[0][0][0]);
  } catch (err) {
    console.error("Error:", err);
  }
}
test();
