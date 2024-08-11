// import path from "node:path";
// import { createRequire } from "node:module";
// import { defineConfig, normalizePath } from "vite";
// import { viteStaticCopy } from "vite-plugin-static-copy";

// const require = createRequire(import.meta.url);
// const standardFontsDir = normalizePath(
//   path.join(
//     path.dirname(require.resolve("pdfjs-dist/package.json")),
//     "standard_fonts"
//   )
// );

// export default defineConfig({
//   plugins: [
//     viteStaticCopy({
//       targets: [
//         {
//           src: standardFontsDir,
//           dest: "", // Destination is relative to the root of the build output (dist)
//         },
//       ],
//     }),
//   ],
// });
// import { defineConfig } from "vite";
// import { viteStaticCopy } from "vite-plugin-static-copy";

// export default defineConfig({
//   plugins: [
//     viteStaticCopy({
//       targets: [
//         {
//           src: "node_modules/pdfjs-dist/build/pdf.worker.min.js",
//           dest: "js", // this is relative to the base public path
//         },
//       ],
//     }),
//   ],
// });

// import { defineConfig } from "vite";
// import { viteStaticCopy } from "vite-plugin-static-copy";

// export default defineConfig({
//   plugins: [
//     viteStaticCopy({
//       targets: [
//         {
//           src: "node_modules/pdfjs-dist/build/pdf.worker.min.js",
//           dest: "", // copy to the root of the public directory
//         },
//       ],
//     }),
//   ],
//   build: {
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           // This ensures that the worker is treated as a separate chunk
//           "pdf.worker": ["pdfjs-dist/build/pdf.worker.min.js"],
//         },
//       },
//     },
//   },
// });

// import { defineConfig } from "vite";
// import html from "vite-plugin-html";
// import react from "@vitejs/plugin-react";
// import { createHtmlPlugin } from "vite-plugin-html";
// import { ViteStaticCopy } from "vite-plugin-static-copy";

// export default defineConfig({
//   plugins: [
//     react(),
//     ViteStaticCopy({
//       targets: [
//         {
//           src: "node_modules/pdfjs-dist/build/pdf.worker.min.js",
//           dest: "pdfjs-dist", // Path relative to the public directory
//         },
//       ],
//     }),
//     createHtmlPlugin(),
//   ],
// });

// import path from "node:path";
// import { createRequire } from "node:module";
// import { defineConfig, normalizePath } from "vite";
// import { viteStaticCopy } from "vite-plugin-static-copy";

// const require = createRequire(import.meta.url);

// const pdfjsDistPath = path.dirname(require.resolve("pdfjs-dist/package.json"));

// export default defineConfig({
//   plugins: [
//     viteStaticCopy({
//       targets: [
//         {
//           src: path.join(pdfjsDistPath, "build/pdf.worker.min.mjs"),
//           dest: "pdfjs-dist",
//         },
//       ],
//     }),
//   ],
// });

// import { defineConfig, normalizePath } from "vite";
// import { viteStaticCopy } from "vite-plugin-static-copy";
// import path from "node:path";

// const pdfjsDistPath = path.dirname(require.resolve("pdfjs-dist/package.json"));

// export default defineConfig({
//   plugins: [
//     viteStaticCopy({
//       targets: [
//         {
//           src: path.join(pdfjsDistPath, "build/pdf.worker.min.js"),
//           dest: "pdfjs-dist",
//         },
//       ],
//     }),
//   ],
// });

// import { defineConfig } from "vite";
// import { viteStaticCopy } from "vite-plugin-static-copy";
// import path from "path";

// // Define the path to pdf.worker.min.mjs
// const pdfWorkerPath = path.resolve(
//   "node_modules/pdfjs-dist/build/pdf.worker.min.mjs"
// );

// export default defineConfig({
//   plugins: [
//     viteStaticCopy({
//       targets: [
//         {
//           src: pdfWorkerPath,
//           dest: "pdfjs-dist",
//         },
//       ],
//     }),
//   ],
// });

// import path from 'node:path';
// import { createRequire } from 'node:module';

// // import { defineConfig } from 'vite';
// import { defineConfig, normalizePath } from 'vite';
// import { viteStaticCopy } from 'vite-plugin-static-copy';

// const require = createRequire(import.meta.url);

// const pdfjsDistPath = path.dirname(require.resolve('pdfjs-dist/package.json'));
// const cMapsDir = normalizePath(path.join(pdfjsDistPath, 'cmaps'));

// export default defineConfig({
//   plugins: [
//    viteStaticCopy({
//     targets: [
//        {
//          src: cMapsDir,
//          dest: '',
//        },
//      ],
//    }),
//   ]
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        pdfWorker: "path/to/pdf.worker.min.js", 
      },
    },
  },
});
