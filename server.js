const express = require("express");
const playwright = require("playwright");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
res.send("PDF Microservice Running");
});

app.get("/pdf", async (req, res) => {
try {
const url = req.query.url;
  
```
if (!url) {
  return res.status(400).send("URL is required");
}

const browser = await playwright.chromium.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
const page = await browser.newPage();

await page.goto(url, { waitUntil: "networkidle" });

const pdf = await page.pdf({
  format: "A4",
  printBackground: true
});

await browser.close();

res.set({
  "Content-Type": "application/pdf",
  "Content-Disposition": "attachment; filename=itinerary.pdf"
});

res.send(pdf);
```

} catch (error) {
console.error(error);
res.status(500).send("PDF generation failed");
}
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log("Server running on port " + PORT);
});
