import fs from "node:fs";
import path from "node:path";

function scanDir(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.isFile() && entry.name === "route.ts") {
      let content = fs.readFileSync(fullPath, "utf-8");
      if (!content.includes("export const dynamic =")) {
        console.log(`Adding force-dynamic to: ${path.relative(process.cwd(), fullPath)}`);
        content = `export const dynamic = "force-dynamic";\n\n` + content;
        fs.writeFileSync(fullPath, content, "utf-8");
      }
    }
  }
}

const apiDir = path.join(process.cwd(), "src", "app", "api");
scanDir(apiDir);
console.log("✅ All API routes successfully updated with force-dynamic!");
