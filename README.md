# أداة تقييم تقارير الاستدامة — وفق منهجية SWA
**Saudi Water Authority | Sustainability Report Evaluation Tool**

---

## النشر على Vercel (10 دقائق)

### الخطوة 1 — رفع الكود على GitHub

1. افتح [github.com](https://github.com) وأنشئ حساباً مجانياً (أو سجّل الدخول)
2. اضغط **New Repository** → اسمه: `swa-evaluation-tool`
3. اختر **Public** أو **Private** ← اضغط **Create repository**
4. ارفع ملفات المشروع:
   - اضغط **uploading an existing file**
   - ارفع هذه المجلدات والملفات كاملةً: `src/`, `public/`, `package.json`
   - اضغط **Commit changes**

### الخطوة 2 — النشر على Vercel

1. افتح [vercel.com](https://vercel.com) وأنشئ حساباً مجانياً بـ GitHub
2. اضغط **Add New Project**
3. اختر المستودع `swa-evaluation-tool`
4. اضغط **Deploy** — لا تغيّر أي إعداد
5. انتظر دقيقة واحدة ← ستحصل على رابطك 🎉

**الرابط سيكون بهذا الشكل:**
```
https://swa-evaluation-tool.vercel.app
```

---

## المميزات

- ✅ يعمل من أي جهاز وأي متصفح
- ✅ البيانات تُحفظ تلقائياً في localStorage على كل جهاز
- ✅ 18 مؤشراً موزوناً + 3 أبعاد جودة إفصاح
- ✅ بيانات PUB سنغافورة مُضمَّنة كمثال مُتحقَّق منه
- ✅ لوحة مقارنة تفاعلية

---

## ملاحظة مهمة عن البيانات

البيانات تُحفظ في **localStorage** على كل جهاز بشكل منفصل.
إذا أردت مشاركة البيانات بين الأجهزة، تحتاج إضافة قاعدة بيانات (مثل Supabase — مجاني).

---

## المنهجية

- **GRI 1:2021** | **AA1000AP** | **ISSA 5000**
- **Materiality-Driven Weighting** — MSCI/LSEG/S&P
- **SDG 6** — أهداف التنمية المستدامة للمياه
