const API_BASE_URL = "https://api.poiskkino.dev/v1.4";

export default async function handler(req, res) {
  const apiKey = process.env.KINOPOISK_API_KEY;
  if (!apiKey) {
    res.status(500).json({ message: "Missing KINOPOISK_API_KEY" });
    return;
  }

  const pathParam = req.query.path;
  const path = Array.isArray(pathParam) ? pathParam.join("/") : pathParam || "";

  const params = new URLSearchParams();
  Object.entries(req.query).forEach(([key, value]) => {
    if (key === "path") {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, String(item)));
      return;
    }

    if (value !== undefined) {
      params.append(key, String(value));
    }
  });

  const target = `${API_BASE_URL}/${path}${params.toString() ? `?${params.toString()}` : ""}`;

  try {
    const response = await fetch(target, {
      method: req.method,
      headers: {
        accept: "application/json",
        "X-API-KEY": apiKey
      }
    });

    const contentType = response.headers.get("content-type");
    if (contentType) {
      res.setHeader("content-type", contentType);
    }

    const body = await response.text();
    res.status(response.status).send(body);
  } catch {
    res.status(502).json({ message: "Upstream request failed" });
  }
}
