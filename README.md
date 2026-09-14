# موقع كلية هندسة العمليات النفطية — جاهز للنشر على Netlify + لوحة نشر داخلية

هذه نسخة **مبسّطة (Static)** من الموقع الأصلي، لكن معها **لوحة نشر حقيقية داخل
الموقع** على `/admin` — تسجّل دخول بحسابك فقط وتنشر إعلانات (مع صورة) وتعدّل
الأقسام، بدون لمس الكود، وبدون سيرفر أو قاعدة بيانات منفصلة.

## 1) النشر الأول على Netlify (لازم يكون عبر GitHub هذي المرة)

لوحة النشر تحتاج المشروع يكون على GitHub حتى تقدر تحفظ التعديلات (git-gateway).

1. ارفع هذا المجلد كمستودع (repository) على GitHub.
2. من https://app.netlify.com : **Add new site → Import an existing project**
   → اختر المستودع.
3. Build command: `npm run build` — Publish directory: `dist`
   (موجودة تلقائيًا بملف `netlify.toml`).
4. اضغط Deploy — انتظر لين يخلص البناء ويعطيك رابط الموقع.

## 2) تفعيل لوحة النشر (مرة واحدة فقط)

1. من لوحة Netlify لموقعك: **Site configuration → Identity → Enable Identity**.
2. **Identity → Registration preferences → Invite only** (حتى ما يسجل غيرك).
3. **Identity → Services → Git Gateway → Enable Git Gateway**.
4. **Identity → Invite users** → اكتب إيميلك الشخصي → يجيك إيميل دعوة.
5. افتح الإيميل واضبط كلمة مرور لحسابك.
6. روح لـ: `https://موقعك.netlify.app/admin/` وسجّل دخول بنفس الإيميل وكلمة
   المرور.

الحين عندك لوحة فيها قسمين: **"الإعلانات والمقالات"** و **"الأقسام العلمية"**.

## 3) كيف تنشر مقال / صورة

من `/admin` → **الإعلانات والمقالات → New announcements**:
- اكتب العنوان والنص.
- ارفع صورة (اختياري) من حقل "صورة".
- اضبط التصنيف والوسم والتاريخ.
- اضغط **Publish**.

بعد الضغط على Publish، الموقع يبني وينشر النسخة الجديدة تلقائيًا (يستغرق
دقيقة أو دقيقتين). نفس الطريقة تعدّل بيانات الأقسام (عدد الطلبة، معدلات
القبول...) من **"الأقسام العلمية"**.

## 4) كيف تضيف إعلانات (Google AdSense)

1. سجّل حساب على Google AdSense وانتظر الموافقة على موقعك.
2. بعد الموافقة، خذ كود السكربت من AdSense والصقه داخل `client/index.html`
   بمكان التعليق الموضّح داخل `<head>`.
3. لعرض إعلان داخل الصفحة، أضف كود `<ins class="adsbygoogle">...</ins>` داخل
   أي `<section>` بملف `client/src/pages/Home.tsx`، ثم `git push`.

## 5) صورة الخريطة الجوية

الصورة الأصلية كانت على سيرفرات Manus ولم تعد متوفرة. حاليًا الخلفية متدرجة
مؤقتة. لإضافة صورتك الحقيقية: ضعها بـ
`client/public/images/satellite-map.webp`، وفعّل السطر المُعلّق بـ
`.map-stage` داخل `client/src/index.css`.

## 6) التشغيل محليًا (اختياري)

```
npm install
npm run dev
```

## كيف تعمل لوحة النشر من الداخل (لمن يريد يفهم)

- المحتوى محفوظ كملفات داخل `content/announcements` و `content/departments`.
- كل ما تنشر من `/admin`، اللوحة تحفظ التعديل مباشرة كـ commit بمستودع GitHub
  (عن طريق Git Gateway، بدون حاجة لحساب GitHub شخصي لك).
- Netlify يلاحظ أي تغيير بالمستودع وينشر الموقع من جديد تلقائيًا.
- عند البناء، سكربت `scripts/build-content.mjs` يقرأ هذي الملفات ويولّد
  `client/src/content-data.ts` الذي يستخدمه الموقع فعليًا.
- الصور المرفوعة تُحفظ داخل `client/public/uploads/`.

## ملاحظة عن التنظيف الذي تم

تم حذف: السيرفر (Express/tRPC)، قاعدة البيانات (Drizzle/MySQL)، نظام تسجيل
الدخول القديم (OAuth الخاص بـ Manus)، وملفات الذكاء الاصطناعي غير المستخدمة
أصلًا (`llm.ts`, `imageGeneration.ts`, `voiceTranscription.ts`) وكل الإشارات
لكلمة "Manus". بدلها نظام نشر أبسط ومستقل بالكامل (Decap CMS + Netlify
Identity) مبني على Netlify فقط.

