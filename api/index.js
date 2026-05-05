export default async function handler(req, res) {
  // 1. 智能判断：如果请求路径里包含 /fapi/ (合约接口)，就转发给 fapi.binance.com
  let targetHost = 'https://api.binance.com';
  if (req.url.startsWith('/fapi')) {
    targetHost = 'https://fapi.binance.com';
  }

  // 2. 拼接最终目标地址
  const targetUrl = targetHost + req.url;

  // 3. 抹除美国机房指纹
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
