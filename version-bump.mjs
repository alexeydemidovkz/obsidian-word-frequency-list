import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const manifestPath = resolve("./manifest.json");
const versionsPath = resolve("./versions.json");

const manifest = JSON.parse(readFileSync(manifestPath, { encoding: "utf8" }));
const versions = JSON.parse(readFileSync(versionsPath, { encoding: "utf8" }));

const newVersion = process.argv[2];

if (!newVersion) {
    throw new Error("No version specified");
}

if (!/\d+\.\d+\.\d+/.test(newVersion)) {
    throw new Error(`Invalid version format: ${newVersion}`);
}

if (newVersion <= manifest.version) {
    throw new Error(
        `New version (${newVersion}) must be greater than current version (${manifest.version})`
    );
}

console.log(`Bumping version from ${manifest.version} to ${newVersion}...`);

// Update manifest.json
manifest.version = newVersion;
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

// Update versions.json
versions[newVersion] = manifest.minAppVersion;
writeFileSync(versionsPath, JSON.stringify(versions, null, 2) + "\n");

console.log("Version bump complete."); 