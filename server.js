const express = require('express');
const { chromium } = require('playwright');

const app = express();

app.get('/pdf', async (req, res) => {

    const url = req.query.url;

    if (!url) {
        return res.send("URL missing");
    }

    try {

        const browser = await chromium.launch({
            args: ['--no-sandbox']
        });

        const page = await browser.newPage();

        await page.goto(url, {
            waitUntil: 'networkidle'
        });

        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true
        });

        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdf);

    } catch (error) {

        console.log(error);
        res.send("PDF generation failed");

    }

});

app.listen(3000, () => {
    console.log('PDF microservice running');
});
