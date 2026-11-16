const https = require('https');

const SUBSTACK_HOST = 'malamiromba.substack.com';

/**
 * Fetch JSON cleanly from Substack public API over HTTPS (handles redirects).
 */
function fetchSubstackJson(path, redirectsRemaining = 3) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: SUBSTACK_HOST,
      path,
      method: 'GET',
      headers: {
        'User-Agent': 'TechInHausa-Newsletter/1.0',
        Accept: 'application/json'
      }
    };

    const req = https.get(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirectsRemaining > 0) {
        try {
          const nextUrl = new URL(res.headers.location, `https://${SUBSTACK_HOST}`);
          if (nextUrl.hostname.endsWith('substack.com') || nextUrl.hostname === 'newsletter.techinhausa.org') {
            return resolve(fetchUrlJson(nextUrl.toString(), redirectsRemaining - 1));
          }
        } catch (err) {
          return reject(err);
        }
      }

      if (res.statusCode < 200 || res.statusCode >= 300) {
        res.resume();
        return reject(new Error(`Substack API returned HTTP ${res.statusCode}`));
      }

      let raw = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { raw += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(raw));
        } catch (err) {
          reject(new Error('Invalid JSON response from Substack'));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(8000, () => {
      req.destroy(new Error('Substack API request timed out'));
    });
  });
}

function fetchUrlJson(urlString, redirectsRemaining = 2) {
  return new Promise((resolve, reject) => {
    https.get(urlString, {
      headers: {
        'User-Agent': 'TechInHausa-Newsletter/1.0',
        Accept: 'application/json'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirectsRemaining > 0) {
        return resolve(fetchUrlJson(new URL(res.headers.location, urlString).toString(), redirectsRemaining - 1));
      }
      if (res.statusCode < 200 || res.statusCode >= 300) {
        res.resume();
        return reject(new Error(`Upstream API returned HTTP ${res.statusCode}`));
      }
      let raw = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { raw += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(raw));
        } catch (err) {
          reject(new Error('Invalid JSON response from upstream'));
        }
      });
    }).on('error', reject);
  });
}

module.exports = { fetchSubstackJson, SUBSTACK_HOST };
