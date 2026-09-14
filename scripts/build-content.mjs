// يقرأ هذا السكربت الملفات داخل content/announcements و content/departments
// (اللي تنشرها من لوحة /admin أو تعدلها يدويًا) ويولّد منها
// client/src/content-data.ts الذي يستخدمه الموقع مباشرة.
// يعمل تلقائيًا قبل "npm run dev" و "npm run build" — لا تحتاج تشغّله بنفسك.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = path.resolve(import.meta.dirname, "..");
const ANNOUNCEMENTS_DIR = path.join(ROOT, "content", "announcements");
const DEPARTMENTS_DIR = path.join(ROOT, "content", "departments");
const OUT_FILE = path.join(ROOT, "client", "src", "content-data.ts");

function readMarkdownDir(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter(f => f.endsWith(".md"))
    .map(f => {
      const raw = fs.readFileSync(path.join(dir, f), "utf-8");
      const { data } = matter(raw);
      return data;
    });
}

const announcements = readMarkdownDir(ANNOUNCEMENTS_DIR)
  .map((a, i) => ({
    id: i + 1,
    title: a.title ?? "",
    body: a.body ?? "",
    dateLabel: a.dateLabel ?? "",
    category: a.category ?? "",
    image: a.image || null,
    date: a.date ? new Date(a.date).toISOString() : new Date(0).toISOString(),
  }))
  .sort((a, b) => (a.date < b.date ? 1 : -1))
  .map((a, i) => ({ ...a, id: i + 1 }));

const departmentsRaw = readMarkdownDir(DEPARTMENTS_DIR);
const order = ["control", "refining"];
const departments = departmentsRaw
  .slice()
  .sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key))
  .map(d => ({
    key: d.key,
    name: d.name ?? "",
    intro: d.intro ?? "",
    focus: d.focus ?? "",
    courses: d.courses ?? "",
    studentCount: d.studentCount ?? "",
    morningCutoff: d.morningCutoff ?? "",
    eveningCutoff: d.eveningCutoff ?? "",
  }));

const banner =
  "// هذا الملف يتولّد تلقائيًا من مجلد content/ عند كل بناء (build).\n" +
  "// لا تعدّله يدويًا — عدّل الملفات داخل content/ أو استخدم لوحة /admin.\n\n";

const body =
  `export const departments = ${JSON.stringify(departments, null, 2)} as const;\n\n` +
  `export const announcements = ${JSON.stringify(announcements, null, 2)} as const;\n`;

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, banner + body, "utf-8");
console.log(
  `[build-content] تم توليد content-data.ts — أقسام: ${departments.length}, إعلانات: ${announcements.length}`
);
