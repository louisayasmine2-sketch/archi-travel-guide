// Audit tiga gateway LLM kompatibel-OpenAI.
// Jalankan: node --env-file=.env.local scripts/audit-gateways.mjs
// Kunci hanya dibaca dari process.env dan tidak pernah ditulis ke output/file.

const GATEWAYS = [
  { name: "agentrouter", base: "https://agentrouter.org", envVar: "AGENTROUTER_KEY" },
  { name: "vsllm", base: "https://vsllm.com", envVar: "VSLLM_KEY" },
  { name: "gorouter", base: "https://gorouter.app", envVar: "GOROUTER_KEY" },
];

const TIMEOUT_MS = 20_000;

const maskKey = (key) => (key ? key.slice(0, 6) + "..." : "(kosong)");

async function request(url, { method = "GET", headers = {}, body } = {}) {
  const started = Date.now();
  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    let text = "";
    try {
      text = await res.text();
    } catch {
      text = "";
    }
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      /* bukan JSON, biarkan null */
    }
    return { ok: res.ok, status: res.status, json, text, ms: Date.now() - started };
  } catch (err) {
    const reason = err?.name === "TimeoutError" ? "timeout" : (err?.cause?.code || err?.message || String(err));
    return { ok: false, status: null, json: null, text: "", error: reason, ms: Date.now() - started };
  }
}

// Ringkas body error tanpa membocorkan apa pun yang panjang/aneh.
function errorSnippet(r) {
  if (r.error) return r.error;
  const msg = r.json?.error?.message || r.json?.message || r.text || "";
  return String(msg).replace(/\s+/g, " ").slice(0, 160);
}

async function auditGateway(gw) {
  const key = process.env[gw.envVar];
  const result = {
    name: gw.name,
    base: gw.base,
    envVar: gw.envVar,
    keyPresent: Boolean(key),
    models: null,
    chatProbe: null,
    extraEndpoints: {},
  };

  if (!key) {
    result.summary = "kunci tidak ditemukan di environment";
    return result;
  }

  const auth = { Authorization: `Bearer ${key}` };

  // 1. GET /v1/models
  const modelsRes = await request(`${gw.base}/v1/models`, { headers: auth });
  const ids = Array.isArray(modelsRes.json?.data)
    ? modelsRes.json.data.map((m) => m.id).filter(Boolean).sort()
    : null;
  result.models = {
    status: modelsRes.status,
    error: modelsRes.ok ? undefined : errorSnippet(modelsRes),
    count: ids ? ids.length : 0,
    ids: ids || [],
    ms: modelsRes.ms,
  };

  // 2. Kalau daftar model gagal, tes apakah kuncinya hidup lewat chat kecil.
  //    Kalau daftar model berhasil pun, satu probe chat murah tetap berguna
  //    untuk memastikan kunci benar-benar bisa dipakai, bukan cuma baca katalog.
  const probeModel = ids?.[0] || "gpt-4o-mini";
  const chatRes = await request(`${gw.base}/v1/chat/completions`, {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/json" },
    body: {
      model: probeModel,
      messages: [{ role: "user", content: "ping" }],
      max_tokens: 5,
    },
  });
  result.chatProbe = {
    model: probeModel,
    status: chatRes.status,
    ok: chatRes.ok,
    error: chatRes.ok ? undefined : errorSnippet(chatRes),
    ms: chatRes.ms,
  };

  // 3. Probe ringan endpoint tambahan — cukup status kode.
  //    Body sengaja minimal/invalid ringan supaya tidak menghasilkan konten besar;
  //    yang kita bedakan hanya 404 (tidak ada) vs selain-404 (rute dikenal).
  const extraProbes = {
    "/v1/embeddings": { model: "text-embedding-3-small", input: "ping" },
    "/v1/audio/speech": { model: "tts-1", input: "ping", voice: "alloy" },
    "/v1/images/generations": { model: "dall-e-3", prompt: "ping", n: 1, size: "256x256" },
    "/v1/rerank": { model: "rerank", query: "ping", documents: ["a"] },
  };
  for (const [path, body] of Object.entries(extraProbes)) {
    const r = await request(`${gw.base}${path}`, {
      method: "POST",
      headers: { ...auth, "Content-Type": "application/json" },
      body,
    });
    result.extraEndpoints[path] = {
      status: r.status,
      error: r.ok ? undefined : errorSnippet(r),
    };
  }

  result.summary = result.models.count > 0
    ? `hidup — ${result.models.count} model`
    : result.chatProbe.ok
      ? "kunci hidup, tapi /v1/models tidak tersedia"
      : "tidak bisa dipakai";
  return result;
}

function pad(s, n) {
  return String(s ?? "").padEnd(n);
}

function printReport(results) {
  console.log("\n=== Ringkasan gateway ===\n");
  console.log(pad("Gateway", 14) + pad("Kunci", 12) + pad("/v1/models", 14) + pad("Model", 8) + pad("Chat", 10) + "Status");
  console.log("-".repeat(80));
  for (const r of results) {
    console.log(
      pad(r.name, 14) +
        pad(maskKey(process.env[r.envVar]), 12) +
        pad(r.models ? (r.models.status ?? r.models.error) : "-", 14) +
        pad(r.models?.count ?? "-", 8) +
        pad(r.chatProbe ? (r.chatProbe.ok ? "OK" : r.chatProbe.status ?? "gagal") : "-", 10) +
        (r.summary || "")
    );
  }

  console.log("\n=== Endpoint tambahan (status kode; 404 = tidak ada) ===\n");
  const paths = ["/v1/embeddings", "/v1/audio/speech", "/v1/images/generations", "/v1/rerank"];
  console.log(pad("Gateway", 14) + paths.map((p) => pad(p.replace("/v1/", ""), 20)).join(""));
  console.log("-".repeat(90));
  for (const r of results) {
    console.log(
      pad(r.name, 14) +
        paths.map((p) => pad(r.extraEndpoints?.[p]?.status ?? "-", 20)).join("")
    );
  }

  console.log("\n=== Daftar model per gateway ===\n");
  for (const r of results) {
    console.log(`${r.name} (${r.models?.count ?? 0} model):`);
    if (r.models?.ids?.length) {
      for (const id of r.models.ids) console.log(`  - ${id}`);
    } else {
      console.log(`  (tidak ada — ${r.models?.error || r.summary})`);
    }
    console.log("");
  }

  // Model yang muncul di lebih dari satu gateway.
  const seen = new Map();
  for (const r of results) {
    for (const id of r.models?.ids || []) {
      if (!seen.has(id)) seen.set(id, []);
      seen.get(id).push(r.name);
    }
  }
  const overlaps = [...seen.entries()].filter(([, gws]) => gws.length > 1);
  console.log("=== Model di lebih dari satu gateway ===\n");
  if (overlaps.length === 0) {
    console.log("(tidak ada)");
  } else {
    for (const [id, gws] of overlaps) console.log(`  - ${id}: ${gws.join(", ")}`);
  }
}

const results = [];
for (const gw of GATEWAYS) {
  console.log(`Memeriksa ${gw.name} (${gw.base}) — kunci ${maskKey(process.env[gw.envVar])}`);
  try {
    results.push(await auditGateway(gw));
  } catch (err) {
    results.push({
      name: gw.name,
      base: gw.base,
      envVar: gw.envVar,
      summary: `error tak terduga: ${err?.message || err}`,
    });
  }
}

printReport(results);

const { writeFile } = await import("node:fs/promises");
await writeFile(
  new URL("../.gateway-audit.json", import.meta.url),
  JSON.stringify({ auditedAt: new Date().toISOString(), results }, null, 2)
);
console.log("\nHasil lengkap tersimpan di .gateway-audit.json");
