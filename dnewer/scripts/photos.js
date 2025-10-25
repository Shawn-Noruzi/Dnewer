/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * photoOptimization.js
 *
 * Converts mixed images (incl. HEIC/HEIF) into:
 *   {basename}-desktop.webp and {basename}-mobile.webp
 *
 * Decode order:
 *   1) sharp directly (if it can read the file)
 *   2) ImageMagick ("magick") if build supports HEIC
 *   3) heif-convert (libheif) → temp JPEG → sharp
 *
 * Usage:
 *   node photoOptimization.js public/gallery
 *
 * Env (optional):
 *   MOBILE_WIDTH=640
 *   DESKTOP_MAX_WIDTH=2400   // 0 = no cap
 *   WEBP_QUALITY=90
 *   FORCE=1                  // overwrite outputs
 *   MAGICK_EXE="C:\\Program Files\\ImageMagick-7.1.2-Q16-HDRI\\magick.exe"
 *   HEIF_CONVERT_EXE="C:\\path\\to\\heif-convert.exe"
 */

const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");
const os = require("os");
const { spawnSync } = require("child_process");

// ---- Config (env-overridable) ----
const MOBILE_WIDTH = Number(process.env.MOBILE_WIDTH || 640);
const DESKTOP_MAX_WIDTH = Number(process.env.DESKTOP_MAX_WIDTH || 2400); // 0 = no cap
const WEBP_QUALITY = Number(process.env.WEBP_QUALITY || 90);
const FORCE = String(process.env.FORCE || "0") === "1";

const MAGICK_EXE = process.env.MAGICK_EXE || "magick"; // allow absolute path to magick.exe
const HEIF_CONVERT_EXE = process.env.HEIF_CONVERT_EXE || "heif-convert";

const SUPPORTED_FORMATS = [".jpg", ".jpeg", ".png", ".heic", ".heif", ".tif", ".tiff"];
const DESKTOP_SUFFIX = "-desktop.webp";
const MOBILE_SUFFIX = "-mobile.webp";

// --- utils ---
function run(cmd, args, opts = {}) {
  return spawnSync(cmd, args, { ...opts, encoding: "utf8" });
}

function hasCmd(cmd) {
  const r = run(cmd, ["-version"], { stdio: "pipe" });
  return r.status === 0;
}

function magickSupportsHeic() {
  // On Windows/Git Bash, -list format piping can be finicky.
  // Parse 'magick -version' and look for 'Delegates' containing 'heic'
  const r = run(MAGICK_EXE, ["-version"], { stdio: "pipe" });
  if (r.status !== 0) return false;
  const out = (r.stdout || "") + (r.stderr || "");
  return /Delegates[^\n]*\bheic\b/i.test(out);
}

function hasHeifConvert() {
  const r = run(HEIF_CONVERT_EXE, ["-h"], { stdio: "pipe" });
  return r.status === 0;
}

const HAS_MAGICK = hasCmd(MAGICK_EXE);
const MAGICK_HEIC = HAS_MAGICK && magickSupportsHeic();
const HAS_HEIFCONVERT = hasHeifConvert();

function isHeicExt(ext) {
  return ext === ".heic" || ext === ".heif";
}

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

function tempDir() {
  return path.join(os.tmpdir(), "heic-temp-" + Math.random().toString(36).slice(2));
}

function getBaseNameNoSuffix(name) {
  const lower = name.toLowerCase();
  if (lower.endsWith(DESKTOP_SUFFIX)) {
    return name.slice(0, -DESKTOP_SUFFIX.length);
  }
  if (lower.endsWith(MOBILE_SUFFIX)) {
    return name.slice(0, -MOBILE_SUFFIX.length);
  }
  const ext = path.extname(name);
  return path.basename(name, ext);
}

// --- conversion building blocks ---
async function convertWithSharp(inputPath, outDesktop, outMobile) {
  const src = sharp(inputPath, { unlimited: true, sequentialRead: true }).rotate(); // honor EXIF
  const meta = await src.metadata();
  const width = meta.width || 0;
  const height = meta.height || 0;

  // Desktop
  if (FORCE || !(await fileExists(outDesktop))) {
    let pipe = src.clone();
    if (DESKTOP_MAX_WIDTH > 0 && width > DESKTOP_MAX_WIDTH) {
      pipe = pipe.resize({ width: DESKTOP_MAX_WIDTH });
    }
    await pipe.webp({ quality: WEBP_QUALITY }).toFile(outDesktop);
    console.log(
      `✓ Desktop: ${path.basename(outDesktop)} ${width}x${height}${
        DESKTOP_MAX_WIDTH > 0 && width > DESKTOP_MAX_WIDTH ? ` → max ${DESKTOP_MAX_WIDTH}px` : ""
      }`
    );
  } else {
    console.log(`• Desktop exists: ${path.basename(outDesktop)} (skip)`);
  }

  // Mobile
  if (FORCE || !(await fileExists(outMobile))) {
    if (width > MOBILE_WIDTH) {
      await src
        .clone()
        .resize({ width: MOBILE_WIDTH })
        .webp({ quality: WEBP_QUALITY })
        .toFile(outMobile);
      console.log(`✓ Mobile:  ${path.basename(outMobile)} ${width}→${MOBILE_WIDTH}px`);
    } else {
      await src.clone().webp({ quality: WEBP_QUALITY }).toFile(outMobile);
      console.log(`✓ Mobile:  ${path.basename(outMobile)} (source <= ${MOBILE_WIDTH}px)`);
    }
  } else {
    console.log(`• Mobile exists: ${path.basename(outMobile)} (skip)`);
  }
}

function convertHeicWithMagickToJpeg(inputPath, jpegPath) {
  // magick input.heic -auto-orient -strip -quality 95 out.jpg
  const r = run(MAGICK_EXE, [inputPath, "-auto-orient", "-strip", "-quality", "95", jpegPath], {
    stdio: "pipe",
  });
  if (r.status !== 0) {
    return { ok: false, stderr: r.stderr || r.stdout || "magick failed" };
  }
  return { ok: true };
}

function convertHeicWithHeifConvertToJpeg(inputPath, jpegPath) {
  // heif-convert in.heic out.jpg
  const r = run(HEIF_CONVERT_EXE, [inputPath, jpegPath], { stdio: "pipe" });
  if (r.status !== 0) {
    return { ok: false, stderr: r.stderr || r.stdout || "heif-convert failed" };
  }
  return { ok: true };
}

async function ensureHeicToTempJpeg(inputPath) {
  const dir = tempDir();
  await fs.mkdir(dir, { recursive: true });
  const outJpeg = path.join(dir, path.basename(inputPath).replace(/\.[^.]+$/i, ".jpg"));

  // Prefer ImageMagick if it supports HEIC
  if (MAGICK_HEIC) {
    const r = convertHeicWithMagickToJpeg(inputPath, outJpeg);
    if (r.ok) return { dir, jpegPath: outJpeg };
    console.warn(`[magick] failed: ${r.stderr}`);
  }

  // Fallback: heif-convert (libheif CLI)
  if (HAS_HEIFCONVERT) {
    const r = convertHeicWithHeifConvertToJpeg(inputPath, outJpeg);
    if (r.ok) return { dir, jpegPath: outJpeg };
    console.warn(`[heif-convert] failed: ${r.stderr}`);
  }

  // If we get here, we couldn't decode HEIC.
  let hint = "";
  if (HAS_MAGICK && !MAGICK_HEIC) {
    hint +=
      "\n- Your ImageMagick build does not list HEIC in 'magick -version' Delegates. Install a build with HEIC/libheif support.";
  }
  if (!HAS_HEIFCONVERT) {
    hint += "\n- Install libheif tools and ensure 'heif-convert' is on your PATH (or set HEIF_CONVERT_EXE).";
  }
  throw new Error(
    "HEIC decode failed — no available decoder.\nTried: sharp, ImageMagick (HEIC), heif-convert." + hint
  );
}

// --- per-file pipeline ---
async function convertOne(absoluteDir, file) {
  const ext = path.extname(file).toLowerCase();
  if (!SUPPORTED_FORMATS.includes(ext)) {
    console.log(`– Skip ${file} (unsupported ext)`);
    return;
  }
  const lower = file.toLowerCase();
  if (lower.endsWith(DESKTOP_SUFFIX) || lower.endsWith(MOBILE_SUFFIX)) {
    console.log(`– Skip ${file} (already a webp output)`);
    return;
  }

  const inputPath = path.join(absoluteDir, file);
  const base = getBaseNameNoSuffix(file);
  const outDesktop = path.join(absoluteDir, `${base}${DESKTOP_SUFFIX}`);
  const outMobile = path.join(absoluteDir, `${base}${MOBILE_SUFFIX}`);

  // 1) Try sharp directly
  try {
    await convertWithSharp(inputPath, outDesktop, outMobile);
    return;
  } catch (err) {
    if (!isHeicExt(ext)) {
      console.error(`✗ Error processing ${file}:`, err?.message || err);
      return;
    }
  }

  // 2) HEIC path
  console.log(`↪ HEIC path for ${file}...`);
  try {
    const { dir, jpegPath } = await ensureHeicToTempJpeg(inputPath);
    await convertWithSharp(jpegPath, outDesktop, outMobile);
    // cleanup temp
    try {
      await fs.rm(dir, { recursive: true, force: true });
    } catch {}
  } catch (e2) {
    console.error(`✗ HEIC conversion failed for ${file}: ${e2?.message || e2}`);
  }
}

// --- batch runner ---
async function convertImages(inputPath) {
  const absolutePath = path.resolve(process.cwd(), inputPath);
  const stats = await fs.stat(absolutePath).catch(() => null);
  if (!stats || !stats.isDirectory()) {
    throw new Error(`Provided path is not a directory: ${absolutePath}`);
  }

  console.log(
    `Using decoders: sharp${HAS_MAGICK ? " + ImageMagick" : ""}${
      MAGICK_HEIC ? " (HEIC OK)" : HAS_MAGICK ? " (HEIC NOT SUPPORTED)" : ""
    }${HAS_HEIFCONVERT ? " + heif-convert" : ""}`
  );

  const entries = await fs.readdir(absolutePath);
  console.log(`\nProcessing: ${absolutePath}`);
  console.log(`Found ${entries.length} files\n`);

  for (const file of entries) {
    await convertOne(absolutePath, file);
  }

  console.log("\nConversion completed! 🎉");
  console.log(`Outputs: "*${DESKTOP_SUFFIX}", "*${MOBILE_SUFFIX}"\n`);
}

// --- CLI ---
const directoryPath = process.argv[2];
if (!directoryPath) {
  console.error("Usage: node photoOptimization.js public/gallery");
  process.exit(1);
}

convertImages(directoryPath).catch((err) => {
  console.error("Error:", err?.message || err);
  process.exit(1);
});
