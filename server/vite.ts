// @ts-nocheck

const express = require('express');
const fs = require('fs');
const path = require('path');
const { createServer: createViteServer, createLogger } = require('vite');
const { nanoid } = require('nanoid');
const viteConfig = require('../vite.config');

const viteLogger = createLogger();

/**
 * @param {any} message
 * @param {any} [source]
 */
function log(message, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

/**
 * @param {any} app
 * @param {any} server
 */
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (/** @type {any} */ msg, /** @type {any} */ options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (/** @type {any} */ req, /** @type {any} */ res, /** @type {any} */ next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path.resolve(
        __dirname,
        "..",
        "client",
        "index.html",
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}

/**
 * @param {any} app
 */
function serveStatic(app) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }
  app.use(express.static(distPath));
  app.use("*", (/** @type {any} */ _req, /** @type {any} */ res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

module.exports = {
  log,
  setupVite,
  serveStatic,
};
