const express = require("express");
const { chromium } = require("playwright-core");

const app = express();

app.get("/", (req, res) => {
  res.send("PDF Microservice Running");
});

app.get("/pdf", async (req, res) => {
  try {

    const url = req.query.url;

    if (!url) {
      return res.status(400).send("URL is required");
    }

    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "load", timeout: 0 });

    await page.waitForTimeout(3000);

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=itinerary.pdf");

    res.send(pdf);

  } catch (error) {
    console.error("PDF ERROR:", error);
    res.status(500).send("PDF generation failed");
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
