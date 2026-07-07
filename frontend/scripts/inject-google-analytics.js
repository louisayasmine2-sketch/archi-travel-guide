const fs = require("fs");
const path = require("path");

const measurementId = process.env.REACT_APP_GA_MEASUREMENT_ID;
const buildDir = path.join(__dirname, "..", "build");

if (!measurementId || !measurementId.startsWith("G-")) {
  console.log("GA4 injection skipped: REACT_APP_GA_MEASUREMENT_ID is not set.");
  process.exit(0);
}

if (!fs.existsSync(buildDir)) {
  console.log("GA4 injection skipped: build directory does not exist.");
  process.exit(0);
}

const gaTag = `<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  window.gtag = window.gtag || gtag;
  gtag('js', new Date());
  gtag('config', '${measurementId}');
</script>`;

const htmlFiles = [];

const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".html")) {
      htmlFiles.push(fullPath);
    }
  }
};

walk(buildDir);

for (const file of htmlFiles) {
  let html = fs.readFileSync(file, "utf8");
  html = html.replace(/<!-- Google Analytics 4 -->[\s\S]*?<script>[\s\S]*?gtag\('config',\s*'G-[A-Z0-9]+'\);[\s\S]*?<\/script>/g, "");

  if (!html.includes("</head>")) {
    continue;
  }

  html = html.replace("</head>", `${gaTag}\n</head>`);
  fs.writeFileSync(file, html);
}

console.log(`GA4 tag injected into ${htmlFiles.length} HTML files with ${measurementId}.`);
