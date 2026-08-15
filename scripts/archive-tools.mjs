import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT_FOLDER_ID = "1nKIwoQ7qUZBszeQlQ384f5DhQiI4NS1_";
export const ROOT_TITLE = "XIAOHONGSHU MEDIA";

const MEMBER_ORDER = ["SANGYEON", "JACOB", "YOUNGHOON", "HYUNJAE", "JUYEON", "KEVIN", "Q", "CHANGMIN", "SUNWOO", "ERIC", "HAKNYEON", "NEW"];

function dateCode(value, fallback = "") {
  const match = String(value).match(/^(\d{6})/u);
  if (match) return Number(`20${match[1]}`);
  const time = Date.parse(fallback);
  if (Number.isNaN(time)) return 0;
  const date = new Date(time);
  return Number(`${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, "0")}${String(date.getUTCDate()).padStart(2, "0")}`);
}

function compactMedia(node, includeName = false) {
  const kind = node.mimeType.startsWith("image/") ? "image" : node.mimeType.startsWith("audio/") ? "audio" : node.mimeType.startsWith("video/") ? "video" : "other";
  const date = dateCode(node.name, node.modifiedTime);
  const value = String(date).padStart(8, "0");
  return { id: node.id, ...(includeName ? { name: node.name } : {}), kind, mimeType: node.mimeType, date, year: Number(value.slice(0, 4)), month: Number(value.slice(4, 6)) };
}

function displayName(value) {
  return value.replace(/^\d+\.\s*/u, "").replace(/\s*\([^)]*\)\s*$/u, "").trim();
}

function collectionFor(raw, folder, includeName) {
  return {
    id: folder.id,
    name: displayName(folder.name),
    media: raw.nodes.filter((node) => node.type !== "folder" && node.path[1] === folder.name).map((node) => compactMedia(node, includeName)).sort((a, b) => b.date - a.date),
  };
}

export function normalizeArchive(raw) {
  const topFolders = raw.nodes.filter((node) => node.type === "folder" && node.path.length === 1);
  const specialFolder = topFolders.find((folder) => /XHS POSTS RELATED TO TBZ/iu.test(folder.name));
  const orderOf = (folder) => {
    const clean = displayName(folder.name).toUpperCase();
    const index = MEMBER_ORDER.indexOf(clean);
    return index === -1 ? MEMBER_ORDER.length : index;
  };
  const profiles = topFolders
    .filter((folder) => folder.id !== specialFolder?.id)
    .sort((a, b) => orderOf(a) - orderOf(b) || displayName(a.name).localeCompare(displayName(b.name)))
    .map((folder) => collectionFor(raw, folder, false));
  const special = specialFolder ? collectionFor(raw, specialFolder, true) : { id: "", name: "XHS Posts Related to TBZ", media: [] };
  return { generatedAt: raw.generatedAt, sourceFolderId: ROOT_FOLDER_ID, profiles, special };
}

export async function writeNormalized(raw, outputFile) {
  const target = outputFile instanceof URL ? fileURLToPath(outputFile) : outputFile;
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, `${JSON.stringify(normalizeArchive(raw))}\n`, "utf8");
}
