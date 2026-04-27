export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-CK-Appid, X-CK-Nonce");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { region = "us", path } = req.query;

    if (!path) {
      return res.status(400).json({ error: "Missing 'path' query parameter" });
    }

    const REGIONS = {
      us: "https://us-apia.coolkit.cc",
      eu: "https://eu-apia.coolkit.cc",
      as: "https://as-apia.coolkit.cc",
      cn: "https://cn-apia.coolkit.cn",
    };

    const baseUrl = REGIONS[region] || REGIONS.us;
    const targetUrl = `${baseUrl}${path}`;

    const forwardHeaders = {};
    const headerKeys = ["content-type", "authorization", "x-ck-appid", "x-ck-nonce"];
    for (const key of headerKeys) {
      if (req.headers[key]) {
        forwardHeaders[key] = req.headers[key];
      }
    }

    const fetchOptions = {
      method: req.method,
      headers: forwardHeaders,
    };

    if (req.method === "POST" || req.method === "PUT") {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
