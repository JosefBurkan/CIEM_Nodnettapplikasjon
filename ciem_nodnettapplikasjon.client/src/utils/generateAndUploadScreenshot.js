import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import mime from 'mime-types';

const [,, networkSlug] = process.argv;
if (!networkSlug) {
  console.error('Please provide a network slug, e.g. `node generateAndUploadScreenshot.js eksempel-hendelse`');
  process.exit(1);
}

const SCREENSHOT_PATH = `./${networkSlug}.png`;
const SUPABASE_URL = 'https://vigjqzuqrnxapqxhkwds.supabase.co';
const SUPABASE_BUCKET = 'screenshots';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY'; // TODO: Replace with your real anon/public key

async function takeScreenshot() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const url = `http://localhost:5173/sn/${networkSlug}/preview`;
  console.log('Opening:', url);

  await page.setViewport({ width: 1280, height: 720 });
  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.waitForTimeout(1000); // Give time for React to render fully

  await page.screenshot({ path: SCREENSHOT_PATH });
  console.log('✅ Screenshot saved to', SCREENSHOT_PATH);

  await browser.close();
}

async function uploadToSupabase() {
  const fileBuffer = fs.readFileSync(SCREENSHOT_PATH);
  const contentType = mime.lookup(SCREENSHOT_PATH);

  const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/${SUPABASE_BUCKET}/${networkSlug}.png`, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'x-upsert': 'true',
    },
    body: fileBuffer
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    console.error('❌ Upload failed:', err);
  } else {
    console.log('✅ Upload successful');
  }
}

(async () => {
  try {
    await takeScreenshot();
    await uploadToSupabase();
  } catch (err) {
    console.error('❌ Error:', err);
  }
})();