import http from "node:http";
import fetch from "node-fetch";

const WORKDAY_MCP = "https://agent.us.wcp.workday.com/mcp";
const TOKEN = process.env.WORKDAY_TOKEN;

http.createServer(async (req, res) => {
  if (!req.url?.startsWith("/mcp")) {
    res.writeHead(404).end();
    return;
  }

  const body = await new Promise(resolve => {
    let data = "";
    req.on("data", c => (data += c));
    req.on("end", () => resolve(data));
  });

  const wdRes = await fetch(WORKDAY_MCP, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${TOKEN}`
    },
    body
  });

  res.writeHead(wdRes.status, {
    "Content-Type": "application/json"
  });

  res.end(await wdRes.text());
}).listen(8787, () =>
  console.log("Proxy MCP listening on :8787/mcp")
);
