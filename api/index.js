export default async function handler(req, res) {
  const targetUrl = 'https://api.binance.com' + req.url;

  const headers = { ...req.headers };
  delete headers['host'];
  delete headers['x-forwarded-for'];
  delete headers['x-real-ip'];
  delete headers['x-vercel-forwarded-for'];
  delete headers['x-vercel-ip-country'];

  try {
    const fetchOptions = {
      method: req.method,
      headers: headers,
    };
    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.text();
    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).send("Proxy Error: " + error.message);
  }
}
