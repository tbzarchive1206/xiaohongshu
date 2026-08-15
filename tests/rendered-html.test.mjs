import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

test("builds the self-contained Xiaohongshu archive for GitHub Pages", async () => {
  const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  const assets = await readdir(new URL("../dist/assets/", import.meta.url));
  const scriptName = assets.find((name) => name.endsWith(".js"));
  assert.ok(scriptName, "compiled JavaScript asset is missing");
  const script = await readFile(new URL(`../dist/assets/${scriptName}`, import.meta.url), "utf8");
  assert.match(html, /XIAOHONGSHU MEDIA/);
  assert.match(html, /\.\/assets\//);
  assert.match(script, /SELECT A PROFILE/);
  assert.match(script, /XHS POSTS RELATED TO TBZ/);
  assert.match(script, /NEWEST FIRST/);
  assert.match(script, /VIDEO \/ OPEN IN GOOGLE DRIVE/);
  assert.doesNotMatch(html, /_next|_vinext/);
});
