import path from "node:path";
import fs from "node:fs";

const pdfjsDistPath = path.dirname(require.resolve("pdfjs-dist/package.json"));
const pdfWorkerPath = path.join(pdfjsDistPath, "build", "pdf.worker.js");

fs.cpSync(pdfWorkerPath, "./public/pdf.worker.mjs", { recursive: true });
