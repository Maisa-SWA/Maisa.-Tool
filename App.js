import { useState, useEffect, useCallback } from "react";

// ── Persistent Storage — localStorage (يعمل على أي جهاز وأي متصفح) ──────────
const STORAGE_KEY = "swa_eval_data_v1";

async function saveData(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  catch(e) { console.error("Save error:", e); }
}

async function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return null;
}

// ── Methodology Data ──────────────────────────────────────────────────────────
const INDICATORS = [
  { id:1,  dim:"E", name:"التغير المناخي وكفاءة الطاقة",           w:4.91, gri:"GRI 302+305", sdg:"SDG 7+13",
    questions:["هل يوجد إفصاح عن انبعاثات Scope 1 و2 و3 بأرقام كمية؟","هل هناك أهداف تخفيض الانبعاثات مع جداول زمنية؟","هل يوجد بيانات استهلاك الطاقة المتجددة مع نسب مئوية؟","هل هناك مقارنة بيانات مع السنوات السابقة؟","هل هناك مراجعة خارجية للبيانات أو التزام بـ SBTi؟"],
    scale:{1:"لا ذكر للموضوع",2:"ذكر عام دون أرقام",3:"أرقام موجودة لكن ناقصة (Scope 1+2 فقط أو بدون مقارنة)",4:"بيانات كاملة Scope 1+2+3 مع أهداف ومقارنة زمنية",5:"بيانات كاملة + مراجعة خارجية + SBTi أو ما يعادله"} },
  { id:2,  dim:"E", name:"التنوع البيولوجي واستخدام الأراضي",      w:4.29, gri:"GRI 304", sdg:"SDG 15",
    questions:["هل يوجد سياسة للتنوع البيولوجي؟","هل هناك بيانات كمية عن المواقع المحسّنة أو الأراضي الرطبة؟","هل يوجد تقييم للأثر على النظم البيئية؟","هل هناك أهداف قابلة للقياس للتنوع البيولوجي؟"],
    scale:{1:"لا ذكر",2:"ذكر عرضي للبيئة الطبيعية",3:"سياسة موجودة مع بعض البيانات",4:"بيانات كمية مع أهداف محددة",5:"استراتيجية كاملة + بيانات + مراجعة خارجية + Net gain"} },
  { id:3,  dim:"E", name:"الالتزام البيئي",                        w:6.13, gri:"GRI 307", sdg:"SDG 6.3",
    questions:["هل هناك سياسة بيئية رسمية معتمدة؟","هل يوجد نظام إدارة بيئية (ISO 14001 أو ما يعادله)؟","هل هناك إفصاح عن الامتثال للتراخيص البيئية؟","هل يوجد بيانات عن الملاحقات أو الغرامات البيئية؟"],
    scale:{1:"لا توجد سياسة بيئية",2:"ذكر الالتزام دون تفاصيل",3:"سياسة موجودة مع بعض مؤشرات الأداء",4:"سياسة + بيانات امتثال + معدل الامتثال",5:"ISO 14001 + صفر ملاحقات + مراجعة خارجية كاملة"} },
  { id:4,  dim:"E", name:"الاقتصاد الدائري",                      w:4.29, gri:"GRI 306", sdg:"SDG 12",
    questions:["هل يوجد استراتيجية أو برنامج للاقتصاد الدائري؟","هل هناك بيانات عن إعادة استخدام الحمأة أو المخلفات؟","هل يوجد إنتاج طاقة من النفايات أو البيوغاز؟","هل هناك بيانات كمية عن نسب إعادة التدوير؟"],
    scale:{1:"لا ذكر للاقتصاد الدائري أو إعادة التدوير",2:"ذكر عام لإدارة النفايات",3:"برامج موجودة مع بعض البيانات",4:"بيانات كمية كاملة مع نسب وأهداف",5:"استراتيجية كاملة + بيانات + شهادة خارجية"} },
  { id:5,  dim:"E", name:"إدارة الموارد المائية",                  w:6.13, gri:"GRI 303", sdg:"SDG 6.4+6.5",
    questions:["هل يوجد بيانات كمية عن الفاقد المائي (%)؟","هل هناك خطة طويلة الأمد لإدارة الموارد المائية؟","هل يوجد بيانات عن كفاءة استخدام المياه؟","هل هناك إفصاح عن مصادر المياه وتنويعها؟","هل هناك مقارنة بيانات مع السنوات السابقة؟"],
    scale:{1:"لا بيانات عن إدارة الموارد",2:"ذكر عام لإدارة المياه",3:"بيانات كمية جزئية",4:"بيانات كاملة مع خطة طويلة الأمد وأهداف",5:"بيانات كاملة + خطة 50 سنة + مراجعة خارجية + معايير عالمية"} },
  { id:6,  dim:"E", name:"جودة المياه وسلامة الإمدادات",           w:6.13, gri:"GRI 303-3", sdg:"SDG 6.1",
    questions:["هل يوجد بيانات عن معدل الامتثال لجودة مياه الشرب (%)؟","هل هناك إفصاح عن معايير الجودة المعتمدة؟","هل يوجد إجراءات للتعامل مع الملوثات الناشئة؟","هل هناك مقارنة بيانات مع السنوات السابقة؟"],
    scale:{1:"لا بيانات عن جودة المياه",2:"ذكر عام للجودة",3:"معدل امتثال موجود لكن بدون سياق",4:"بيانات امتثال كاملة مع خطط التحسين",5:"100% امتثال + بيانات متعددة السنوات + مراجعة مستقلة"} },
  { id:7,  dim:"E", name:"إدارة التلوث ومعالجة المياه",            w:4.91, gri:"GRI 306+303", sdg:"SDG 6.2+6.3",
    questions:["هل يوجد بيانات عن حوادث التلوث (عدد وتصنيف)؟","هل هناك معدل امتثال لرخص الصرف؟","هل يوجد خطة للحد من التلوث؟","هل هناك بيانات عن كميات مياه الصرف المعالجة؟"],
    scale:{1:"لا بيانات عن التلوث",2:"ذكر عام للمعالجة",3:"بيانات موجودة لكن ناقصة",4:"بيانات كاملة مع خطة تحسين",5:"صفر حوادث أو خطة تفصيلية + بيانات 5 سنوات + مراجعة خارجية"} },
  { id:8,  dim:"S", name:"خدمات المستفيدين",                       w:6.13, gri:"GRI 417", sdg:"SDG 6.1",
    questions:["هل يوجد مؤشر رضا المستفيدين بأرقام؟","هل هناك بيانات عن معالجة الشكاوى ووقت الاستجابة؟","هل يوجد برامج لتحسين تجربة المستفيد؟","هل هناك مقارنة بيانات مع السنوات السابقة أو المعايير القطاعية؟"],
    scale:{1:"لا ذكر لخدمة المستفيدين",2:"ذكر عام دون أرقام",3:"بيانات رضا موجودة",4:"بيانات رضا + شكاوى + مقارنة صناعية",5:"درجة رضا متميزة + مراجعة مستقلة + برامج تطوير مستمر"} },
  { id:9,  dim:"S", name:"السلامة والصحة المهنية",                 w:6.13, gri:"GRI 403", sdg:"SDG 3+8",
    questions:["هل يوجد معدل LTIF أو TRIR بأرقام؟","هل هناك بيانات عن الوفيات والإصابات الجسيمة؟","هل يوجد برنامج سلامة موثّق؟","هل هناك مقارنة بيانات مع السنوات السابقة؟","هل يوجد شهادة ISO 45001 أو ما يعادلها؟"],
    scale:{1:"لا بيانات سلامة",2:"ذكر السلامة دون أرقام",3:"معدلات موجودة مع بيانات محدودة",4:"بيانات كاملة متعددة السنوات مع أهداف",5:"صفر وفيات + ISO 45001 + بيانات 5 سنوات + مراجعة خارجية"} },
  { id:10, dim:"S", name:"المساهمة المجتمعية وتمكين القوى العاملة", w:4.29, gri:"GRI 413+401", sdg:"SDG 8+11",
    questions:["هل يوجد بيانات عن حجم الاستثمار المجتمعي (رقم مالي)؟","هل هناك بيانات عن التنوع والشمول في القوى العاملة؟","هل يوجد فجوة الأجور بين الجنسين (Gender Pay Gap)؟","هل هناك برامج لتمكين المجتمع موثّقة؟"],
    scale:{1:"لا ذكر للمجتمع أو القوى العاملة",2:"ذكر عام للمساهمة",3:"بيانات جزئية عن أحدهما",4:"بيانات كاملة عن كليهما مع مقارنة",5:"استراتيجية متكاملة + قياس الأثر الاجتماعي + مراجعة خارجية"} },
  { id:11, dim:"S", name:"التوعية وبناء القدرات",                  w:4.29, gri:"GRI 404", sdg:"SDG 4+6.b",
    questions:["هل يوجد بيانات عن ساعات التدريب أو عدد المستفيدين؟","هل هناك برامج توعية مجتمعية موثّقة؟","هل يوجد برنامج بناء قدرات استراتيجي؟","هل هناك ميزانية مخصصة للتدريب؟"],
    scale:{1:"لا ذكر للتدريب أو التوعية",2:"ذكر عام",3:"برامج موجودة مع بيانات جزئية",4:"بيانات كاملة مع أهداف",5:"استراتيجية تعلم + قياس الأثر + شهادات خارجية"} },
  { id:12, dim:"S", name:"إشراك أصحاب المصلحة",                   w:4.91, gri:"GRI 2-29", sdg:"SDG 16+17",
    questions:["هل يوجد قائمة بأصحاب المصلحة وطريقة إشراكهم؟","هل هناك تقييم للأهمية النسبية (Materiality Assessment) موثّق؟","هل يوجد آلية لدمج ملاحظات أصحاب المصلحة في القرارات؟","هل هناك تقرير عن نتائج الإشراك؟"],
    scale:{1:"لا ذكر لأصحاب المصلحة",2:"ذكر عام",3:"عملية إشراك موصوفة",4:"تقييم أهمية نسبية + نتائج موثّقة",5:"AA1000 SES + مصفوفة أهمية نسبية منشورة + متابعة موثّقة"} },
  { id:13, dim:"S", name:"الإمداد العادل للمياه والصرف الصحي",     w:6.13, gri:"GRI 303+413", sdg:"SDG 6.1+6.2",
    questions:["هل يوجد برامج للتعرفة الاجتماعية أو دعم محدودي الدخل؟","هل هناك بيانات عن نسبة التغطية بخدمات المياه؟","هل يوجد هدف الوصول العادل للمياه مرتبط بـ SDG 6؟","هل هناك بيانات عن الفئات الهشة والمحرومة؟"],
    scale:{1:"لا ذكر للإمداد العادل",2:"ذكر عام للوصول للمياه",3:"برامج موجودة مع بيانات",4:"بيانات كاملة مع ربط SDG 6",5:"استراتيجية عدالة مائية كاملة + تحقق خارجي + أهداف محددة"} },
  { id:14, dim:"G", name:"تطوير السياسات والامتثال التنظيمي",      w:7.28, gri:"GRI 2-23", sdg:"SDG 16",
    questions:["هل يوجد إطار سياسات رسمي موثّق؟","هل هناك بيانات عن معدل الامتثال التنظيمي؟","هل يوجد دور الجهة في تطوير القطاع؟","هل هناك ربط بالإطار التنظيمي الوطني والدولي؟"],
    scale:{1:"لا ذكر للسياسات التنظيمية",2:"ذكر عام",3:"إطار سياسات موصوف",4:"سياسات + بيانات امتثال + دور تنظيمي",5:"قيادة قطاعية + سياسات مرجعية + ربط دولي + تحقق خارجي"} },
  { id:15, dim:"G", name:"الحوكمة المؤسسية وإدارة المخاطر",       w:7.28, gri:"GRI 2-9", sdg:"SDG 16.6",
    questions:["هل يوجد هيكل حوكمة واضح (مجلس + لجان)؟","هل هناك إطار إدارة مخاطر موثّق؟","هل يوجد إفصاح عن تنوع مجلس الإدارة؟","هل هناك سياسات مكافحة الفساد والرشوة؟","هل يوجد تقرير مراجعة داخلية أو خارجية؟"],
    scale:{1:"لا ذكر للحوكمة",2:"هيكل مذكور دون تفاصيل",3:"هيكل موصوف مع بعض السياسات",4:"حوكمة كاملة + مخاطر + تنوع + سياسات",5:"UK Corporate Governance Code أو ما يعادله + مراجعة خارجية"} },
  { id:16, dim:"G", name:"الشراكات بين القطاع العام والخاص",       w:5.10, gri:"GRI 2-28", sdg:"SDG 17",
    questions:["هل يوجد وصف لشراكات استراتيجية محددة؟","هل هناك بيانات عن نتائج الشراكات؟","هل يوجد نماذج شراكة مع القطاع الخاص (PPP)؟","هل هناك شراكات دولية موثّقة؟"],
    scale:{1:"لا ذكر للشراكات",2:"ذكر عام",3:"شراكات موصوفة بأسماء",4:"شراكات + نتائج + نماذج PPP",5:"إطار شراكة استراتيجي + قياس الأثر + شراكات دولية موثّقة"} },
  { id:17, dim:"G", name:"التوريد المستدام والمحتوى المحلي",        w:5.10, gri:"GRI 204+308", sdg:"SDG 8+12",
    questions:["هل يوجد سياسة توريد مستدام رسمية؟","هل هناك بيانات عن نسبة المحتوى المحلي؟","هل يوجد تقييم استدامة للموردين؟","هل هناك بيانات عن سلسلة التوريد؟"],
    scale:{1:"لا ذكر للتوريد المستدام",2:"سياسة مذكورة دون تفاصيل",3:"سياسة + بعض بيانات الموردين",4:"بيانات كاملة + تقييم الموردين + نسبة محلية",5:"شهادة توريد دولية + 100% تقييم موردين + بيانات متعددة السنوات"} },
  { id:18, dim:"G", name:"البحث والابتكار والتطوير",               w:6.55, gri:"SASB+GRI 2", sdg:"SDG 9",
    questions:["هل يوجد بيانات عن الاستثمار في البحث والتطوير (رقم مالي أو نسبة)؟","هل هناك وصف لمبادرات ابتكارية محددة؟","هل يوجد شراكات بحثية مع جامعات أو مؤسسات؟","هل هناك استراتيجية رقمنة واضحة؟"],
    scale:{1:"لا ذكر للابتكار",2:"ذكر عام",3:"مبادرات موصوفة بدون أرقام",4:"مبادرات + استثمارات + شراكات بحثية",5:"استراتيجية ابتكار + R&D investment + براءات اختراع + مراجعة خارجية"} },
];

const DISC_DIMS = [
  { id:"d1", label:"الإفصاح", icon:"📢", pts:16.7,
    desc:"هل المعلومة موجودة وشاملة ومنظّمة وفق GRI؟",
    scale:{1:"الموضوع غير مذكور",2:"مذكور عرضاً دون تخصيص",3:"قسم مخصص لكن ناقص",4:"إفصاح كامل ومنظّم مع GRI index",5:"إفصاح كامل + مقارنة زمنية + GRI index كامل + فهرس محتوى"} },
  { id:"d2", label:"الموثوقية", icon:"✅", pts:16.7,
    desc:"هل البيانات موثوقة وقابلة للتحقق وفق ISSA 5000؟",
    scale:{1:"لا بيانات ولا توثيق",2:"بيانات بدون مصدر",3:"بيانات بمصادر داخلية موثّقة",4:"بيانات + منهجية قياس واضحة + Limited Assurance",5:"Reasonable Assurance وفق ISSA 5000 أو AA1000AS"} },
  { id:"d3", label:"سرد الأثر", icon:"🎯", pts:16.6,
    desc:"هل الجهة تربط أنشطتها بنتائج حقيقية قابلة للقياس؟",
    scale:{1:"لا ربط بين النشاط والأثر",2:"ذكر أثر نوعي عام",3:"أثر كمي بدون مقارنة بالهدف",4:"أثر كمي مع مقارنة بالهدف",5:"أثر كمي + ربط SDG + قصة تغيير واضحة + مقارنة دولية"} },
];

const DIM_META = {
  E: { label:"البيئة (E)", color:"#1E8B4C", bg:"#F0FBF4", border:"#AADCB8" },
  S: { label:"المجتمع (S)", color:"#C86010", bg:"#FEF6EC", border:"#F0C080" },
  G: { label:"الحوكمة والاقتصاد (G)", color:"#5A3090", bg:"#F5F0FC", border:"#C0A0E0" },
};

const LV_BG=["","#FFCCBC","#FFE0B2","#FFFDE7","#E3F2FD","#D4EDDA"];
const LV_COL=["","#BF360C","#E65100","#856404","#004085","#155724"];
const LV_LABELS=["","غائب","مبدئي","متطور","متقدم","رائد"];

function calcScores(scores) {
  const WEIGHTS = {1:4.91,2:4.29,3:6.13,4:4.29,5:6.13,6:6.13,7:4.91,8:6.13,9:6.13,10:4.29,11:4.29,12:4.91,13:6.13,14:7.28,15:7.28,16:5.10,17:5.10,18:6.55};
  const DPTS = {d1:16.7,d2:16.7,d3:16.6};
  if(!scores?.p1) return null;
  const p1Raw = Object.entries(WEIGHTS).reduce((a,[i,w])=>a+((scores.p1[i]||1)/5)*w, 0);
  const p1 = Math.round(p1Raw * 0.5 * 10) / 10;
  const p2 = Math.round(Object.entries(DPTS).reduce((a,[d,pts])=>a+((scores.p2?.[d]||1)/5)*pts, 0) * 10) / 10;
  const E = Math.round([1,2,3,4,5,6,7].reduce((a,i)=>a+((scores.p1[i]||1)/5)*WEIGHTS[i], 0)*0.5*10)/10;
  const S = Math.round([8,9,10,11,12,13].reduce((a,i)=>a+((scores.p1[i]||1)/5)*WEIGHTS[i], 0)*0.5*10)/10;
  const G = Math.round([14,15,16,17,18].reduce((a,i)=>a+((scores.p1[i]||1)/5)*WEIGHTS[i], 0)*0.5*10)/10;
  return { p1, p2, total: Math.round((p1+p2)*10)/10, E, S, G };
}

function getLevel(t) {
  if(!t) return { label:"لم يُقيَّم", color:"#888", bg:"#F0F4F8", short:"—" };
  if(t>=85) return { label:"رائد عالمياً 🏆", color:"#155724", bg:"#D4EDDA", short:"رائد" };
  if(t>=70) return { label:"متقدم ✅", color:"#004085", bg:"#CCE5FF", short:"متقدم" };
  if(t>=55) return { label:"متطور 📈", color:"#856404", bg:"#FFF3CD", short:"متطور" };
  return { label:"مبدئي ⚠️", color:"#E65100", bg:"#FFE0B2", short:"مبدئي" };
}

function Bar({v,max=100,color="#1A5F9E",h=6}) {
  return (
    <div style={{background:"#E8EDF2",borderRadius:99,height:h,overflow:"hidden"}}>
      <div style={{width:`${Math.min((v/max)*100,100)}%`,height:"100%",background:color,borderRadius:99,transition:"width 0.8s ease"}} />
    </div>
  );
}

// ── DEWA Pre-loaded Data ──────────────────────────────────────────────────────
const DEWA_SEED = {
  org: { id: "dewa_seed", name: "DEWA دبي", flag: "🇦🇪" },
  scores: {
    p1: {
      "1": 5,  // 11.47M طن CO2e تخفيض + MBR Solar 3,060MW + 6.62 TWh clean (أعلى تاريخياً) + نت زيرو 2050
      "2": 3,  // Biodiversity في materiality matrix — بدون بيانات كمية أو أهداف محددة
      "3": 5,  // GRI 12 سنة + Globe of Honour for Environmental compliance + DNV verified
      "4": 4,  // CE strategy 5 مبادئ + waste data 3 سنوات + AED 64.69M scrap revenue
      "5": 5,  // أقل خسائر مياه عالمياً 4.5% + 1.1M smart meters + 150,478 MIG + AED 225M وفورات
      "6": 4,  // CML=0.94 min (أقل عالمياً) + 495 MIGD — بدون compliance % صريح
      "7": 4,  // effluent data كاملة DNV verified: process + desal + treated sewage
      "8": 4,  // 1,270,285 عميل + 100% IDCXS + happiness index — بدون satisfaction % صريح
      "9": 5,  // Fatality=0 + LTIFR=0.7 + TRIR=0.14 + ISO 45001 + Sword of Honour BSI (5★) + DNV
      "10": 4, // 10,722 موظف + 107 برنامج + Emiratisation + People of Determination + parental leave
      "11": 4, // تدريب 6 سنوات: قيادة 96.67 + إدارة 56.07 + تفصيل جندري
      "12": 4, // 3 ورش stakeholder نوفمبر 2024 + 47 موضوع مادي + materiality matrix بدرجات
      "13": 4, // 52,296 وصلة مياه + 48,746 كهرباء + تغطية شاملة دبي + Dubai Vision 2040
      "14": 5, // GRI 12 سنة + Integrated Report + DFM listed + Golden Peacock for Governance
      "15": 5, // Integrated Report = Sustainability + Governance + Financial + DFM AED 124B + ERM
      "16": 4, // IWPP 180 MIGD SWRO + Shuaa Energy 3 1,800MW + EV PPP — نتائج مالية موثّقة
      "17": 4, // 90.04% محتوى محلي + 13,863 معاملة + 173 موردون عالميون + تقييم استدامة
      "18": 5, // Green Hydrogen (أول إماراتي) + AI ISO/IEC 24028 (أول حكومة) + R&D Centre
    },
    p2: { d1: 5, d2: 4, d3: 4 }
  },
  evidence: {
    "p1_1": "Carbon emissions reduced by 11.47 million tonnes (2006-2024) — 43.61% كفاءة إنتاج. MBR Solar Park 3,060MW. Clean energy 6.62 TWh (أعلى تاريخياً). Net Zero 2050. Dubai Net Zero Strategy 2050. UAE Energy Strategy 2050.",
    "p1_2": "Biodiversity مُدرَج في materiality matrix (درجة 7.5-8.5 من 10). ذُكر ضمن الأولويات البيئية. لكن التقرير لا يحتوي على بيانات كمية (هكتارات، أنواع) أو أهداف محددة للتنوع البيولوجي.",
    "p1_3": "GRI Standards 2021 كامل — 12 سنة متتالية (منذ 2013). Globe of Honour for Environmental compliance. DNV Business Assurance verified. Dubai Government directives + 8 Guiding Principles.",
    "p1_4": "Circular Economy strategy بـ 5 مبادئ رسمية. نفايات 3 سنوات: عامة 5,773 طن | خطرة 375 طن | ورق 152 طن | مياه معادة 314 MIG. إيرادات خردة AED 64,693,000 (2024). استراتيجية Value Retention رسمية.",
    "p1_5": "Water losses: 7.1% (2018) → 4.5% (2024) — أقل في العالم. 1.1+ مليون عداد مياه ذكي. إنتاج 150,478 MIG. 52,296 وصلة جديدة. سعة تخزين →1,121 MIG. AED 225M وفورات على 10 سنوات.",
    "p1_6": "CML = 0.94 دقيقة/عميل/سنة (أقل عالمياً). سعة 495 MIGD. تخزين 1.01 BIG (707→808 MIG). إنتاج 150,478 MIG (DNV verified). لكن بدون compliance % صريح كـ PUB.",
    "p1_7": "DNV Verified effluents: Process water (power) 1,646,907,036 م³ + (desal) 4,093,431,368 م³ + WTP effluent 107,770 م³ + Treated sewage 24,140 م³. تغطية 100% نقاط الصرف.",
    "p1_8": "1,270,285 حساب عميل (58,810 جديد 2024). 100% IDCXS score. happiness index. Smart services. 22 خدمة عامة محدّثة. 10/10 smart app accessibility. بدون CSAT % صريح.",
    "p1_9": "DNV Verified: Fatality=0 | High consequence injuries=0 | LTIFR=0.7 | TRIR=0.14 | Chemical exposure=0 | Work-related ill-health=0. ISO 45001:2018 + ISO 45003. Sword of Honour (5★) BSI. Globe of Honour.",
    "p1_10": "10,722 موظف (DNV verified). 18% إناث | 82% ذكور. 107 برامج تنمية بشرية. 128 موظف إماراتي جديد. People of Determination. إجازة أمومة: 97.99% احتفاظ | أبوة: 95.42%.",
    "p1_11": "Training 6 سنوات (2019-2024): Leadership: 96.67h | Management: 56.07h | Non-Supervisory: 45.59h | UAE Nationals: 60.02h. تفصيل جندري متاح في التقرير.",
    "p1_12": "3 ورش إشراك أصحاب مصلحة (نوفمبر 2024). 47 موضوعاً مادياً مُقيَّماً. Materiality matrix منشورة بدرجات. GRI 2-29 موثّق. لكن بدون formal stakeholder panel أو AA1000 SES.",
    "p1_13": "52,296 وصلة مياه جديدة + 48,746 وصلة كهرباء 2024. تغطية شاملة لإمارة دبي (سكني + تجاري + صناعي). Dubai Vision 2040 = SDG ضمنياً. خدمة 1,270,285 حساب.",
    "p1_14": "GRI Content Index كامل + Integrated Report (Sustainability + Governance + Financial) — 12 سنة متتالية. DFM listed (AED 124B). Golden Peacock for Excellence in Governance. Dubai 8 Guiding Principles.",
    "p1_15": "Integrated Report = Sustainability + Corporate Governance + Financial Statements (IFRS). DFM listed — largest IPO by market value AED 124B. Enterprise Risk Management. Board = Executive Council Chairman.",
    "p1_16": "IWPP: 180 MIGD SWRO (Financial close achieved 2024). Shuaa Energy 3: 1,800MW solar PV (Financial close + first 200MW energised). EV Green Charger: public + private sector partnership — نتائج مالية موثّقة.",
    "p1_17": "90.04% من المنتجات والخدمات من موردين محليين. 13,863 معاملة في 2024. 173 موردون عالميون. تقييم استدامة الموردين موجود. GRI 2-6 موثّق.",
    "p1_18": "Green Hydrogen Project (طاقة شمسية + هيدروجين — أول مشروع إماراتي). AI ISO/IEC TR 24028:2020 (أول جهة حكومية في الدولة). R&D Centre. EV Green Charger. MBR Solar Phase VI. Smart Grid.",
    "p2_d1": "GRI Content Index كامل + Integrated Report + DFM listed + فهرس SASB EU + GRI 12 سنة. بيانات متعددة السنوات. أكثر تقرير شمولاً في المنطقة.",
    "p2_d2": "DNV Business Assurance — Verification على مؤشرات مختارة: GRI 303 (مياه) + GRI 401 (توظيف) + GRI 403 (سلامة). ليس Reasonable Assurance كاملاً وفق ISSA 5000 على جميع البيانات.",
    "p2_d3": "أهداف كمية: نت زيرو 2050 + أقل خسائر مياه 4.5% + CML 0.94 min. مقارنة بـ 2006 (43.61%). بيانات 6 سنوات. SDG ضمنياً عبر Dubai Vision. بدون قصة تغيير مجتمعية بعمق PUB.",
  }
};

// ── PUB Pre-loaded Data (مستخرجة من التقرير الكامل ومُتحقَّق منها) ────────────
const PUB_SEED = {
  org: { id: "pub_seed", name: "PUB سنغافورة", flag: "🇸🇬" },
  scores: {
    p1: {
      "1": 4,  // Scope 1+2+3 كاملة + أهداف نت زيرو — لكن EUI ارتفع ولا SBTi
      "2": 3,  // مبادرات خضراء موجودة لكن بدون أهداف كمية محددة للتنوع البيولوجي (Tengeh، CFI) لكن بدون مؤشرات كمية للتنوع البيولوجي
      "3": 5,  // GRI كامل + GreenGov + 100% امتثال WHO + مراجعة داخلية
      "4": 4,  // WDI تجاوز الهدف (0.203 من 0.325) + بيانات 3 سنوات + استراتيجية حمأة
      "5": 5,  // Four National Taps + فاقد 7.1% + NEWater + بيانات 3 سنوات كاملة
      "6": 5,  // 100% امتثال WHO لـ 3 سنوات متتالية — أعلى معيار ممكن
      "7": 3,  // انقطاعات 9.7 + نقاط فيضان 22 — بدون discharge compliance أو pollution incidents + نقاط فيضان 22 — تحسّن تدريجي موثّق
      "8": 3,  // 100% رقمي + تغطية شاملة — بدون أي مؤشر رضا كمي (CSAT/NPS/شكاوى) — لكن بدون مؤشر رضا كمي (CSAT/NPS)
      "9": 3,  // 3 وفيات FY2024 (ارتفاع من 0) — ارتفاع حاد يُضعف المؤشر رغم انخفاض معدل الإصابات
      "10": 4, // بيانات قوى عاملة مفصّلة — لكن فجوة الأجور وحجم الاستثمار المجتمعي غير مُفصَح عنهما
      "11": 4, // 59 ساعة/موظف مع تفصيل جندري وإداري + Core+ Training جديد
      "12": 5, // تقييم أهمية نسبية سنوي + Appendix 1 + Alliance for Action + آليات متنوعة
      "13": 5, // 100% تغطية مياه وصرف صحي + SDG 6 مُدرَج + هدف 130 LPCD
      "14": 5, // هيئة قانونية حكومية + GreenGov + قيادة قطاعية + GRI 2-23 موثّق
      "15": 5, // 14 عضو مجلس + BSC (مرتين سنوياً) + ERM + Internal Audit مستقل
      "16": 3, // DBOO + Alliance for Action + CFI — بدون نتائج شراكات مقاسة أو نموذج PPP رسمي
      "17": 3, // ضوابط موردين موجودة — لكن بدون نسبة محتوى محلي أو تقييم كمي للموردين
      "18": 5, // AI + طاقة شمسية (Tengeh 60MW) + إزالة كربون المحيطات + Smart Grid + CFI
    },
    p2: {
      d1: 5,  // GRI فهرس 4 صفحات + بيانات 3 سنوات + ملاحق منظّمة + GreenGov
      d2: 4,  // مراجعة داخلية رسمية مذكورة (GRI 2-5) — لكن بدون External Assurance ISSA 5000
      d3: 5,  // ربط SDG 6 + أهداف كمية محددة + مقارنة بالهدف + قصة "Four National Taps" الـ 60 سنة
    }
  },
  evidence: {
    "p1_1": "Scope 1: 7.5 | Scope 2 Market: 230.4 | Scope 3: 204 ktCO₂e (FY2024). طاقة متجددة: 167.4 GWh. هدف نت زيرو ~2045. EUI ارتفع من 124 إلى 132 (دون الهدف). لا SBTi.",
    "p1_2": "خزان Tengeh 60MW. CFI 9 مشاريع. أنواع حيوانية مذكورة (Lesser Mousedeer، Sunda Pangolin، كاميرات رصد). هكتارات مذكورة لكن بدون هدف كمي محدد للتنوع البيولوجي ← درجة 3 لا 4.",
    "p1_3": "GRI 1:2021 كامل. GreenGov.SG — يتجاوز المتطلبات. 100% امتثال WHO (FY2022-2024). مراجعة داخلية على بيانات الاستدامة — لا ملاحظات جوهرية.",
    "p1_4": "WDI: 0.325 → 0.296 → 0.203 kg/pax/day (تجاوز هدف 30% تخفيض). نفايات تشغيلية 193,469 طن. نفايات خطرة: مختبر بيولوجي 26,400L. استراتيجية R&D لإغلاق حلقة الحمأة.",
    "p1_5": "فاقد شبكة: 7.5%→7.2%→7.1%. NEWater 148.3 مليون م³. مياه محلية 303.9 + غير محلية 213.7 مليون م³. WEI=44 L/pax/day (خط أساس 52). هدف 130 LPCD بحلول 2030.",
    "p1_6": "100% امتثال WHO لمعايير جودة مياه الشرب لـ 3 سنوات متتالية (2022-2024). LPCD: 149→141→142. 100% تغطية السكان بمياه الصنبور.",
    "p1_7": "انقطاعات الخدمة: 9.9→9.9→9.7 لكل شهر/1000كم. نقاط فيضان: 26→23→22. 4 دراسات حماية ساحلية مطلقة. بيانات جيدة لكن محدودة مقارنة بالتحلية وإعادة الاستخدام.",
    "p1_8": "100% معاملات رقمية. لكن: لا customer satisfaction، لا complaint data، لا NPS، لا response time في أي جزء من التقرير. السلّم يشترط بيانات رضا للدرجة 3 فما فوق ← درجة 3.",
    "p1_9": "⚠️ وفيات FY2024: 3 (حادثة غاز H₂S في Choa Chu Kang + سقوط رباط تسليح في DTSS2). FY2023: 0 وفيات. معدل إصابات: 243→204 لكل 100,000 عامل (↓16%). إصابات طفيفة: 33→35→28.",
    "p1_10": "إجمالي موظفين: 3,311 (823 إناث + 2,488 ذكور). عقود مستديمة 2,506 + مؤقتة 805. تغطية اتفاقيات عمل جماعية: 68.9%. توظيف جديد: 250. بدون فجوة أجور أو حجم استثمار مجتمعي.",
    "p1_11": "متوسط ساعات تدريب: 52→50→59 ساعة/موظف. إناث: 60.7 | ذكور: 58.8. إدارة: 74.1 | غير إدارة: 57.7. Core+ Training مبادرة جديدة 2025.",
    "p1_12": "Appendix 1 لإشراك أصحاب المصلحة. مراجعة سنوية للأهمية النسبية. Alliance for Action (حكومة+خاص+مجتمع). GRI 2-29 موثّق. 9 مواضيع جوهرية مؤكّدة.",
    "p1_13": "100% من السكان بخدمة مياه صنبور + صرف صحي حديث (FY2022-2024). هدف 130 LPCD. SDG 6 مُدرَج في GRI. لا برامج تعرفة اجتماعية — جهة حكومية بتسعير موحّد.",
    "p1_14": "هيئة قانونية تحت Ministry of Sustainability & Environment. قانون PUA 2001. GreenGov.SG كامل. دور قيادي في معايير قطاع المياه. GRI 2-23 موثّق على صفحات 13،16،20،31.",
    "p1_15": "14 عضو مجلس (متجدد 1 أبريل 2025). Board Sustainability Committee (BSC) مرتين سنوياً. ERM مرفوع للمجلس. Internal Audit مستقل. Code of Board Governance مُقنَّن.",
    "p1_16": "DBOO موجود (محطات تحلية وNEWater). AfA للفيضانات. CFI 9 مشاريع. لكن: لا PPP رسمي مُعتمَد، لا نتائج شراكات مقاسة، لا إطار شراكة استراتيجي ← درجة 3 لا 4.",
    "p1_17": "شركات نفايات مرخّصة مع عقود امتثال. ضوابط سلسلة توريد موجودة. لكن بدون نسبة محتوى محلي أو معيار CIPS أو تقييم كمي للموردين.",
    "p1_18": "AI في العمليات (استراتيجية). إزالة كربون المحيطات (مشروع بحثي). Solar Masterplan (Tengeh 60MW). Smart Grid. CFI Singapore. R&D حمأة. بدون رقم استثمار R&D محدد.",
    "p2_d1": "GRI content index 4 صفحات كاملة. Statement of Use: GRI 1:2021. بيانات FY2022+2023+2024. ملاحق 1+2+3 منظّمة. GreenGov.SG فوق المتطلبات.",
    "p2_d2": "GRI 2-5 External Assurance → يُحيل إلى 'Reporting Standards and Internal Audit' (صفحة 2). مراجعة داخلية رسمية فقط. لا External Assurance وفق ISSA 5000 أو AA1000AS.",
    "p2_d3": "ربط صريح بـ SDG 6 في GRI index. أهداف كمية محددة: نت زيرو ~2045، WDI -30%، LPCD 130 بحلول 2030. مقارنة بالأهداف مع التعليق. قصة 'Four National Taps' — 60 سنة من الريادة.",
  }
};

// ── American Water Pre-loaded Data ───────────────────────────────────────────
const AW_SEED = {
  org: { id: "aw_seed", name: "American Water", flag: "🇺🇸" },
  scores: {
    p1: {
      "1": 5,  // Scope1+2+3 + ERM CVS ISAE 3000 + 41.5% achieved + SBTi aligned + نت زيرو 2050
      "2": 3,  // Environmental Policy + watershed — بدون بيانات كمية للتنوع البيولوجي
      "3": 4,  // GRI+SASB+TCFD+EEI + Safe DWA — "does not follow precautionary approach"
      "4": 2,  // "circular" غير موجود — recycled water في SASB بدون أرقام
      "5": 4,  // $3.3B رأسمالي + $40-42B خطة 10 سنوات + AWIA RRAs
      "6": 5,  // PFAS action plan + 0 violations + Safe DWA + EPA coordination
      "7": 4,  // AWIA compliance + effluent quality — بدون discharge compliance %
      "8": 4,  // 74,250 low-income + 9,550 wastewater + 12 ولاية — بدون NPS
      "9": 4,  // ORIR=0.40 (2x أفضل من الصناعة) + DART=0.14 + بيانات 3 سنوات
      "10": 4, // AWCF $4.7M + $5M مجتمعة + National Urban League + Red Cross
      "11": 3, // برامج تطوير موصوفة — ساعات التدريب في PDF charts غير قابلة للاستخراج
      "12": 4, // Materiality Assessment + Stakeholder by Group + GRI 2-29
      "13": 4, // 74,250 + 9,550 + 12 ولاية + disaster relief — بدون SDG 6 صريح
      "14": 4, // GRI 2-23 + PUC 50 ولاية + Safe DWA — "لا يتبع المبدأ الاحترازي لـ GRI"
      "15": 4, // SETO Committee + CEO/CFO/COO climate roles + TCFD governance
      "16": 3, // AWWA + NACWA + EEI + FRI + National Urban League — بدون PPP رسمي
      "17": 3, // 4,500 موردون + Supplier Code of Conduct — بدون % محتوى محلي
      "18": 4, // FRI + PFAS R&D + AMI + leak detection + $40-42B capital
    },
    p2: { d1: 5, d2: 4, d3: 4 }
  },
  evidence: {
    "p1_1": "Scope1=69,363 | Scope2 Location=430,362 | إجمالي 1+2=499,725 MT CO2e (FY2024). 41.5% تخفيض من 2007 ✅ (هدف 40%). نت زيرو 2050 + -50% بحلول 2035 (SBTi aligned). ERM CVS ISAE 3000 assurance — أعلى مستوى ضمان في المجموعة.",
    "p1_2": "Environmental Policy تشمل watershed protection + healthy ecosystem. 'blue heron' كمؤشر صحة. لكن بدون هكتارات أو أنواع أو أهداف كمية للتنوع البيولوجي.",
    "p1_3": "GRI+SASB+TCFD+EEI كاملة. Environmental Policy + Safe DWA + Clean Water Act + SETO Committee. لكن يُصرّح: 'does not follow the precautionary approach as outlined by GRI' + 'does not have a formal Human Rights policy'.",
    "p1_4": "كلمة 'circular' غير موجودة في كامل التقرير. recycled water ذُكر في SASB IF-WU-440a.2 بدون أرقام. Wastewater treatment خدمة موجودة لكن بدون استراتيجية اقتصاد دائري.",
    "p1_5": "$3.3 بليون استثمار رأسمالي 2024. $40-42 بليون خطة 10 سنوات. Dam Management Practice. AWIA Risk and Resiliency Assessments. Non-revenue water مُتتبَّع (SASB IF-WU-140a.2). % الفاقد لا يظهر كرقم صريح.",
    "p1_6": "PFAS action plan كامل + التزام بمعايير EPA. 0 acute health-based violations (SASB IF-WU-250a.1). Safe Drinking Water Act امتثال. خبرة واسعة في PFAS treatment. تعاون مستمر مع EPA.",
    "p1_7": "Wastewater treatment خدمة أساسية. AWIA compliance. Effluent quality (SASB IF-WU-140b.1). Sanitary sewer overflows: 'لا يُفصَح حالياً — plans to report in future'.",
    "p1_8": "74,250 عميل تعرفة منخفضة الدخل (12 ولاية). 9,550 صرف صحي. Budget billing مجاني. AWCF emergency + disaster programs. بدون NPS أو customer satisfaction score.",
    "p1_9": "ORIR: 0.85→0.86→0.40 (أفضل مرتين من متوسط الصناعة). DART: 0.37→0.52→0.14. 1 وفاة non-preventable 2024 (لا تُحتسب في المعدل). National Safety Council. GRI 403 كامل.",
    "p1_10": "AWCF: 400+ منحة + $4.7M (2024). موظفون + AWCF = $5M مجتمعة. National Urban League + American Red Cross. Employee matching 1:1 حتى $1,000. Turnover 10.5% (↓ من 11.5%). 6,700 موظف.",
    "p1_11": "GRI 404-1 يُحيل إلى 'Sustainability Data Summary' — الرقم في جدول PDF غير قابل للاستخراج نصياً. برامج تطوير موصوفة: performance reviews، succession planning، career development.",
    "p1_12": "Materiality Assessment (GRI 3-1) مُفصَّل. Stakeholder Engagement by Group. Public Policy advocacy. AWWA + NACWA + EEI + FRI memberships. GRI 2-29 موثّق.",
    "p1_13": "74,250 عميل مياه + 9,550 صرف صحي بأسعار مخفضة في 12 ولاية. AWCF Disaster Relief Program. Keep Communities Flowing. 14 ولاية خدمة. بدون ربط صريح بـ SDG 6.",
    "p1_14": "GRI 2-23 موثّق. PUC regulation في 50+ ولاية. Safe DWA + Clean Water Act. Public policy advocacy. تُصرّح صراحةً: 'does not follow the precautionary approach as outlined by GRI'.",
    "p1_15": "SETO Committee (Safety, Environmental, Technology, Operations) — رقابة بيئية ومناخية ربعية. CEO/CFO/COO مسؤوليات مناخ موثّقة في TCFD. Code of Ethics. Succession planning.",
    "p1_16": "GRI 2-28: Association Memberships — AWWA، NACWA، EEI، FRI، National Urban League، American Red Cross. بدون PPP رسمي أو شراكات حكومية-خاصة موثّقة النتائج.",
    "p1_17": "4,500 شركة مورّد. Supplier Code of Conduct + ethical procurement. Federal/state procurement compliance. بدون نسبة محتوى محلي أو ISO 20400 أو تقييم استدامة الموردين بأرقام.",
    "p1_18": "FRI (Foundation for Research and Innovation) عضوية. PFAS research & treatment innovation. AMI + leak detection technology. $40-42B capital plan. Risk and Resiliency Assessments (AWIA).",
    "p2_d1": "GRI+SASB+TCFD+EEI — أشمل أطر إفصاح في المجموعة. فهارس محتوى كاملة لكل إطار. بيانات FY2022+2023+2024. صراحة في الإقرار بما لا يُفصَح عنه (SSO، ozone) تُعزز المصداقية.",
    "p2_d2": "ERM CVS — ISAE 3000 (Revised) على Scope 1 و2 لأعوام 2022 و2024 — أعلى مستوى ضمان خارجي في المجموعة. لكن ليس ISSA 5000 ولا يشمل بيانات السلامة والمجتمع والحوكمة.",
    "p2_d3": "أهداف كمية: 41.5% تحقق ✅، -50% بحلول 2035، نت زيرو 2050. TCFD 2°C + 1.5°C scenarios. مقارنة بالهدف مع تعليق. بدون ربط صريح بـ SDG 6 أو قصة تغيير مجتمعية.",
  }
};

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [orgs, setOrgs] = useState([]);
  const [allScores, setAllScores] = useState({});
  const [allEvidence, setAllEvidence] = useState({});
  const [view, setView] = useState("home");
  const [activeOrgId, setActiveOrgId] = useState(null);
  const [activePhase, setActivePhase] = useState(1);
  const [activeIndId, setActiveIndId] = useState(1);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgFlag, setNewOrgFlag] = useState("🌍");
  const [showAddOrg, setShowAddOrg] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  // ── Load on mount — seed PUB if first time ───────────────────────────────────
  useEffect(() => {
    loadData().then(data => {
      if (data?.orgs && data.orgs.length > 0) {
        // Existing data — load as-is
        if (data.orgs) setOrgs(data.orgs);
        if (data.allScores) setAllScores(data.allScores);
        if (data.allEvidence) setAllEvidence(data.allEvidence);
      } else {
        // First time — seed PUB + American Water data
        const seedOrgs = [PUB_SEED.org, AW_SEED.org, DEWA_SEED.org];
        const seedScores = {
          [PUB_SEED.org.id]: PUB_SEED.scores,
          [AW_SEED.org.id]: AW_SEED.scores,
          [DEWA_SEED.org.id]: DEWA_SEED.scores,
        };
        const seedEvidence = {
          [PUB_SEED.org.id]: PUB_SEED.evidence,
          [AW_SEED.org.id]: AW_SEED.evidence,
          [DEWA_SEED.org.id]: DEWA_SEED.evidence,
        };
        setOrgs(seedOrgs);
        setAllScores(seedScores);
        setAllEvidence(seedEvidence);
      }
      setLoaded(true);
    });
  }, []);

  // ── Save on every change (debounced 500ms) ────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    setSaving(true);
    const t = setTimeout(async () => {
      await saveData({ orgs, allScores, allEvidence });
      setSaving(false);
    }, 500);
    return () => clearTimeout(t);
  }, [orgs, allScores, allEvidence, loaded]);

  const activeOrg = orgs.find(o => o.id === activeOrgId);
  const activeScores = allScores[activeOrgId] || { p1:{}, p2:{} };
  const activeEvidence = allEvidence[activeOrgId] || {};

  function addOrg() {
    if (!newOrgName.trim()) return;
    const id = `org_${Date.now()}`;
    const newOrg = { id, name: newOrgName.trim(), flag: newOrgFlag };
    setOrgs(prev => {
      const updated = [...prev, newOrg];
      try {
        const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, orgs: updated }));
      } catch(e) {}
      return updated;
    });
    setNewOrgName(""); setNewOrgFlag("🌍"); setShowAddOrg(false);
  }

  function removeOrg(id) {
    setOrgs(prev => {
      const updated = prev.filter(o => o.id !== id);
      try {
        const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, orgs: updated }));
      } catch(e) {}
      return updated;
    });
    setAllScores(p => { const n={...p}; delete n[id]; return n; });
    setAllEvidence(p => { const n={...p}; delete n[id]; return n; });
  }

  function setScore(type, id, val) {
    setAllScores(prev => {
      const updated = {
        ...prev,
        [activeOrgId]: {
          ...prev[activeOrgId],
          p1: { ...(prev[activeOrgId]?.p1 || {}) },
          p2: { ...(prev[activeOrgId]?.p2 || {}) },
          [type]: { ...(prev[activeOrgId]?.[type] || {}), [id]: val }
        }
      };
      // Save immediately as backup
      try {
        const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          ...current, allScores: updated
        }));
      } catch(e) {}
      return updated;
    });
  }

  // Show loading screen until data is loaded from storage
  if (!loaded) return (
    <div style={{minHeight:"100vh",background:"#F0F4F9",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Tajawal,sans-serif",direction:"rtl"}}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@700;800&display=swap" rel="stylesheet"/>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:16}}>💧</div>
        <div style={{fontSize:16,fontWeight:700,color:"#0D2B52"}}>جارٍ تحميل البيانات المحفوظة...</div>
      </div>
    </div>
  );

  function setEvidence(indKey, text) {
    setAllEvidence(prev => {
      const updated = {
        ...prev,
        [activeOrgId]: { ...(prev[activeOrgId] || {}), [indKey]: text }
      };
      try {
        const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          ...current, allEvidence: updated
        }));
      } catch(e) {}
      return updated;
    });
  }

  function completionRate(orgId) {
    const sc = allScores[orgId] || {};
    const p1Done = Object.keys(sc.p1 || {}).length;
    const p2Done = Object.keys(sc.p2 || {}).length;
    return Math.round(((p1Done + p2Done) / 21) * 100);
  }

  // ── HOME ───────────────────────────────────────────────────────────────────
  if (view === "home") return (
    <div style={{minHeight:"100vh",background:"#F0F4F9",fontFamily:"Tajawal,sans-serif",direction:"rtl"}}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap" rel="stylesheet"/>

      <div style={{background:"linear-gradient(135deg,#0D2B52,#1A5F9E,#0095C5)",padding:"28px 32px 22px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle at 85% 40%,rgba(0,149,197,0.25) 0%,transparent 60%)"}}/>
        <div style={{position:"relative"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
            <div style={{width:48,height:48,background:"rgba(255,255,255,0.15)",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>💧</div>
            <div>
              <div style={{color:"rgba(255,255,255,0.6)",fontSize:10,letterSpacing:3,textTransform:"uppercase"}}>Saudi Water Authority</div>
              <div style={{color:"#fff",fontWeight:800,fontSize:18}}>أداة تقييم تقارير الاستدامة</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {saving && <div style={{fontSize:10,color:"rgba(255,255,255,0.6)"}}>💾 حفظ...</div>}
            {!saving && loaded && <div style={{fontSize:10,color:"rgba(255,255,255,0.5)"}}>✅ محفوظ</div>}
          </div>
          <p style={{color:"rgba(255,255,255,0.7)",fontSize:12,margin:"6px 0 0"}}>
            GRI 1:2021 • AA1000AP • ISSA 5000 | 18 موضوعاً جوهرياً + 3 أبعاد جودة إفصاح
          </p>
        </div>
      </div>

      <div style={{maxWidth:900,margin:"0 auto",padding:"20px 28px"}}>

        {/* Methodology Summary */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
          {[
            {n:"18",l:"مؤشر أداء",sub:"موزون بالأهمية النسبية",c:"#1A5F9E",i:"📊"},
            {n:"50%",l:"الإفصاح عن ESG",sub:"الإفصاح عن ESG",c:"#1E8B4C",i:"🌊"},
            {n:"50%",l:"المرحلة الثانية",sub:"جودة الإفصاح",c:"#C86010",i:"📋"},
            {n:"5",l:"مستويات التقييم",sub:"1=غائب → 5=رائد",c:"#5A3090",i:"⭐"},
          ].map((s,i) => (
            <div key={i} style={{background:"#fff",borderRadius:12,padding:"14px",borderRight:`3px solid ${s.c}`,boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
              <div style={{fontSize:26,fontWeight:900,color:s.c}}>{s.n}</div>
              <div style={{fontSize:12,fontWeight:700,color:"#0D2B52"}}>{s.l}</div>
              <div style={{fontSize:10,color:"#888"}}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Add org */}
        {showAddOrg ? (
          <div style={{background:"#fff",borderRadius:14,padding:"16px",marginBottom:14,border:"2px solid #1A5F9E33",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
            <div style={{fontWeight:700,color:"#0D2B52",fontSize:13,marginBottom:10}}>➕ إضافة جهة للتقييم</div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <input value={newOrgName} onChange={e=>setNewOrgName(e.target.value)}
                placeholder="اسم الجهة *" onKeyDown={e=>e.key==="Enter"&&addOrg()}
                style={{flex:2,minWidth:160,padding:"9px 14px",border:"1px solid #D0DCE8",borderRadius:9,fontSize:13,fontFamily:"Tajawal",direction:"rtl"}}/>
              <input value={newOrgFlag} onChange={e=>setNewOrgFlag(e.target.value)}
                placeholder="🌍" maxLength={4}
                style={{width:56,padding:"9px",border:"1px solid #D0DCE8",borderRadius:9,fontSize:20,textAlign:"center"}}/>
              <button onClick={addOrg} style={{background:"#1A5F9E",color:"#fff",border:"none",borderRadius:9,padding:"9px 22px",fontSize:13,fontWeight:700,cursor:"pointer"}}>إضافة</button>
              <button onClick={()=>setShowAddOrg(false)} style={{background:"#F0F4F9",color:"#666",border:"1px solid #D0DCE8",borderRadius:9,padding:"9px 16px",fontSize:13,cursor:"pointer"}}>إلغاء</button>
            </div>
          </div>
        ) : (
          <button onClick={()=>setShowAddOrg(true)}
            style={{width:"100%",background:"#fff",border:"2px dashed #B0C8E0",borderRadius:12,padding:"13px",fontSize:13,fontWeight:600,color:"#1A5F9E",cursor:"pointer",marginBottom:14}}>
            ➕ إضافة جهة جديدة للتقييم
          </button>
        )}

        {/* Org Cards */}
        {orgs.length > 0 && (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:10,marginBottom:14}}>
            {orgs.map(org => {
              const sc = allScores[org.id] ? calcScores(allScores[org.id]) : null;
              const lv = sc ? getLevel(sc.total) : null;
              const pct = completionRate(org.id);
              return (
                <div key={org.id} style={{background:"#fff",border:`2px solid ${sc?lv.color+"44":"#E0EAF4"}`,borderRadius:14,padding:"16px",boxShadow:"0 2px 8px rgba(0,0,0,0.05)",position:"relative"}}>
                  <button onClick={()=>removeOrg(org.id)} title="حذف الجهة"
                    style={{position:"absolute",top:8,left:8,background:"none",border:"none",color:"#CCC",cursor:"pointer",fontSize:14,padding:"2px 6px",lineHeight:1}}
                    onMouseEnter={e=>e.target.style.color="#E65100"}
                    onMouseLeave={e=>e.target.style.color="#CCC"}>✕</button>                  <div style={{fontSize:28,marginBottom:4}}>{org.flag}</div>
                  <div style={{fontWeight:700,fontSize:14,color:"#0D2B52",marginBottom:2}}>{org.name}</div>

                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                    <div style={{flex:1,height:4,background:"#E8EDF2",borderRadius:99,overflow:"hidden"}}>
                      <div style={{width:`${pct}%`,height:"100%",background:pct===100?"#1E8B4C":"#1A5F9E",borderRadius:99,transition:"width 0.5s"}}/>
                    </div>
                    <span style={{fontSize:10,color:"#888",minWidth:28}}>{pct}%</span>
                  </div>

                  {sc ? (
                    <div style={{marginBottom:8}}>
                      <div style={{fontWeight:900,fontSize:28,color:lv.color,lineHeight:1}}>{sc.total}</div>
                      <div style={{fontSize:10,color:lv.color,fontWeight:600}}>{lv.label}</div>
                    </div>
                  ) : (
                    <div style={{fontSize:11,color:"#AAB",marginBottom:8}}>لم يُقيَّم بعد</div>
                  )}

                  <button onClick={()=>{setActiveOrgId(org.id);setActivePhase(1);setActiveIndId(1);setView("review");}}
                    style={{width:"100%",background:sc?"#F0F4F9":"#1A5F9E",color:sc?"#333":"#fff",border:"none",borderRadius:9,padding:"8px",fontSize:12,fontWeight:600,cursor:"pointer"}}>
                    {sc?`${pct===100?"✅ مراجعة":"✏️ استكمال"} التقييم`:"▶️ بدء التقييم"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {orgs.length === 0 && (
          <div style={{background:"#fff",borderRadius:16,padding:"48px",textAlign:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
            <div style={{fontSize:48,marginBottom:12}}>🏛️</div>
            <div style={{fontSize:16,fontWeight:700,color:"#0D2B52",marginBottom:6}}>ابدأ بإضافة الجهات</div>
            <div style={{fontSize:12,color:"#888"}}>أضف الجهات التي تريد تقييم تقارير استدامتها</div>
          </div>
        )}

        {orgs.filter(o=>completionRate(o.id)===100).length >= 2 && (
          <button onClick={()=>setView("compare")}
            style={{width:"100%",background:"linear-gradient(135deg,#0D2B52,#1A5F9E)",color:"#fff",border:"none",borderRadius:12,padding:"15px",fontSize:15,fontWeight:700,cursor:"pointer"}}>
            📊 عرض لوحة المقارنة الشاملة
          </button>
        )}
      </div>
    </div>
  );

  // ── REVIEW VIEW ────────────────────────────────────────────────────────────
  if (view === "review" && activeOrg) {
    const sc = calcScores(activeScores);
    const isP1 = activePhase === 1;
    const currentInd = isP1 ? INDICATORS.find(i => i.id === activeIndId) : DISC_DIMS.find(d => d.id === activeIndId);
    const totalItems = 21;
    const doneItems = Object.keys(activeScores.p1||{}).length + Object.keys(activeScores.p2||{}).length;

    return (
      <div style={{minHeight:"100vh",background:"#F0F4F9",fontFamily:"Tajawal,sans-serif",direction:"rtl"}}>
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap" rel="stylesheet"/>

        {/* Header */}
        <div style={{background:"linear-gradient(135deg,#0D2B52,#1A5F9E)",padding:"12px 20px",display:"flex",alignItems:"center",gap:10,position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 12px rgba(0,0,0,0.15)"}}>
          <button onClick={()=>setView("home")} style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:8,color:"#fff",padding:"5px 12px",cursor:"pointer",fontSize:12}}>→ الرئيسية</button>
          <div style={{flex:1}}>
            <div style={{color:"rgba(255,255,255,0.6)",fontSize:9}}>التقييم المنظّم وفق منهجية SWA</div>
            <div style={{color:"#fff",fontWeight:800,fontSize:14}}>{activeOrg.flag} {activeOrg.name}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.7)"}}>{doneItems}/{totalItems}</div>
            <div style={{width:80,height:5,background:"rgba(255,255,255,0.2)",borderRadius:99,overflow:"hidden"}}>
              <div style={{width:`${(doneItems/totalItems)*100}%`,height:"100%",background:"#00C58A",borderRadius:99,transition:"width 0.5s"}}/>
            </div>
            {sc && <div style={{background:"rgba(255,255,255,0.15)",borderRadius:8,padding:"4px 10px",fontWeight:900,fontSize:16,color:"#fff"}}>{sc.total}</div>}
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:0,maxHeight:"calc(100vh - 52px)"}}>

          {/* Sidebar */}
          <div style={{background:"#1A2744",overflowY:"auto",padding:"10px 0"}}>
            {/* Phase 1 */}
            <div style={{padding:"6px 12px",marginBottom:4}}>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.5)",letterSpacing:1,marginBottom:4}}>الإفصاح عن ESG — الإفصاح عن ESG</div>
              {Object.entries(DIM_META).map(([dim,meta]) => (
                <div key={dim}>
                  <div style={{fontSize:9,color:meta.color,padding:"4px 6px",fontWeight:700}}>{meta.label}</div>
                  {INDICATORS.filter(i=>i.dim===dim).map(ind => {
                    const s = activeScores.p1?.[ind.id];
                    const isActive = activePhase===1 && activeIndId===ind.id;
                    return (
                      <button key={ind.id} onClick={()=>{setActivePhase(1);setActiveIndId(ind.id);}}
                        style={{width:"100%",background:isActive?"rgba(255,255,255,0.15)":"transparent",border:"none",borderRadius:6,padding:"5px 8px",cursor:"pointer",display:"flex",alignItems:"center",gap:5,marginBottom:1,textAlign:"right"}}>
                        <div style={{width:16,height:16,borderRadius:3,background:s?LV_BG[s]:"rgba(255,255,255,0.1)",color:s?LV_COL[s]:"#888",fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          {s||"—"}
                        </div>
                        <span style={{fontSize:9,color:isActive?"#fff":"rgba(255,255,255,0.6)",flex:1,textAlign:"right",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ind.name}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Phase 2 */}
            <div style={{padding:"6px 12px",borderTop:"1px solid rgba(255,255,255,0.1)"}}>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.5)",letterSpacing:1,marginBottom:4}}>المرحلة الثانية — الإفصاح</div>
              {DISC_DIMS.map(d => {
                const s = activeScores.p2?.[d.id];
                const isActive = activePhase===2 && activeIndId===d.id;
                return (
                  <button key={d.id} onClick={()=>{setActivePhase(2);setActiveIndId(d.id);}}
                    style={{width:"100%",background:isActive?"rgba(255,255,255,0.15)":"transparent",border:"none",borderRadius:6,padding:"6px 8px",cursor:"pointer",display:"flex",alignItems:"center",gap:5,marginBottom:2,textAlign:"right"}}>
                    <div style={{width:16,height:16,borderRadius:3,background:s?LV_BG[s]:"rgba(255,255,255,0.1)",color:s?LV_COL[s]:"#888",fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      {s||"—"}
                    </div>
                    <span style={{fontSize:10,color:isActive?"#fff":"rgba(255,255,255,0.6)"}}>{d.icon} {d.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div style={{overflowY:"auto",padding:"16px 20px",background:"#F0F4F9"}}>
            {currentInd && (
              <div>
                {/* Indicator Header */}
                <div style={{background:"#fff",borderRadius:14,padding:"16px",marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                    {isP1 && (
                      <div style={{background:DIM_META[currentInd.dim]?.bg,border:`1px solid ${DIM_META[currentInd.dim]?.border}`,borderRadius:8,padding:"4px 10px",fontSize:10,fontWeight:700,color:DIM_META[currentInd.dim]?.color}}>
                        {DIM_META[currentInd.dim]?.label}
                      </div>
                    )}
                    {isP1 && <div style={{fontSize:10,color:"#888"}}>{currentInd.gri}</div>}
                    {isP1 && <div style={{fontSize:10,color:"#0095C5"}}>{currentInd.sdg || ""}</div>}
                  </div>
                  <div style={{fontWeight:800,fontSize:16,color:"#0D2B52",marginBottom:4}}>
                    {isP1 ? `${currentInd.id}. ${currentInd.name}` : `${currentInd.icon} ${currentInd.label}`}
                  </div>
                  {!isP1 && <div style={{fontSize:12,color:"#666"}}>{currentInd.desc}</div>}
                  {isP1 && <div style={{fontSize:11,color:"#888"}}>الوزن المرجّح: <strong>{currentInd.w}%</strong></div>}
                </div>

                {/* Checklist Questions */}
                {isP1 && currentInd.questions && (
                  <div style={{background:"#fff",borderRadius:14,padding:"14px",marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
                    <div style={{fontWeight:700,color:"#0D2B52",fontSize:13,marginBottom:10}}>✅ قائمة التحقق — ما الذي تبحث عنه في التقرير؟</div>
                    {currentInd.questions.map((q,i) => (
                      <div key={i} style={{display:"flex",gap:8,padding:"7px 0",borderBottom:"1px solid #F0F4F8"}}>
                        <div style={{width:18,height:18,borderRadius:4,background:"#E8F2FA",color:"#1A5F9E",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{i+1}</div>
                        <div style={{fontSize:12,color:"#333"}}>{q}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Scoring Scale */}
                <div style={{background:"#fff",borderRadius:14,padding:"14px",marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
                  <div style={{fontWeight:700,color:"#0D2B52",fontSize:13,marginBottom:10}}>📏 اختر الدرجة المناسبة</div>
                  {Object.entries(currentInd.scale).map(([grade,desc]) => {
                    const g = parseInt(grade);
                    const currentScore = isP1 ? (activeScores.p1?.[currentInd.id]) : (activeScores.p2?.[currentInd.id]);
                    const isSelected = currentScore === g;
                    return (
                      <button key={grade} onClick={() => isP1 ? setScore("p1",currentInd.id,g) : setScore("p2",currentInd.id,g)}
                        style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 12px",marginBottom:5,
                          background:isSelected?LV_BG[g]:"#F8FBFD",
                          border:`2px solid ${isSelected?LV_COL[g]+"88":"#E8EDF2"}`,
                          borderRadius:10,cursor:"pointer",textAlign:"right",transition:"all 0.15s"}}>
                        <div style={{width:28,height:28,borderRadius:7,background:isSelected?LV_COL[g]:"#E0E8F0",color:"#fff",fontSize:14,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          {grade}
                        </div>
                        <div style={{flex:1,textAlign:"right"}}>
                          <div style={{fontSize:11,fontWeight:700,color:isSelected?LV_COL[g]:"#555"}}>{LV_LABELS[g]}</div>
                          <div style={{fontSize:10,color:"#666",lineHeight:1.5}}>{desc}</div>
                        </div>
                        {isSelected && <div style={{fontSize:16}}>✓</div>}
                      </button>
                    );
                  })}
                </div>

                {/* Evidence Field */}
                <div style={{background:"#fff",borderRadius:14,padding:"14px",marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
                  <div style={{fontWeight:700,color:"#0D2B52",fontSize:13,marginBottom:6}}>📌 توثيق المبرر — اقتبس من التقرير أو سجّل ملاحظتك</div>
                  <textarea
                    value={activeEvidence[`${isP1?"p1":"p2"}_${currentInd.id}`] || ""}
                    onChange={e => setEvidence(`${isP1?"p1":"p2"}_${currentInd.id}`, e.target.value)}
                    placeholder={`مثال: "صفحة 45 — تقرير ${activeOrg.name} يذكر أن نسبة انبعاثات Scope 1 = 220 kTCO2e مع هدف تخفيض 30% بحلول 2030"`}
                    style={{width:"100%",minHeight:80,padding:"10px",border:"1px solid #D0DCE8",borderRadius:9,fontSize:11,fontFamily:"Tajawal",direction:"rtl",resize:"vertical",boxSizing:"border-box",color:"#333"}}
                  />
                </div>

                {/* Navigation */}
                <div style={{display:"flex",gap:8}}>
                  <button onClick={() => {
                    if(isP1) {
                      const idx = INDICATORS.findIndex(i=>i.id===activeIndId);
                      if(idx>0) setActiveIndId(INDICATORS[idx-1].id);
                      else { setActivePhase(2); setActiveIndId("d3"); }
                    } else {
                      const idx = DISC_DIMS.findIndex(d=>d.id===activeIndId);
                      if(idx>0) setActiveIndId(DISC_DIMS[idx-1].id);
                      else { setActivePhase(1); setActiveIndId(18); }
                    }
                  }} style={{flex:1,background:"#F0F4F9",color:"#444",border:"1px solid #D0DCE8",borderRadius:10,padding:"11px",fontSize:13,cursor:"pointer"}}>
                    ← السابق
                  </button>
                  <button onClick={() => {
                    if(isP1) {
                      const idx = INDICATORS.findIndex(i=>i.id===activeIndId);
                      if(idx<INDICATORS.length-1) setActiveIndId(INDICATORS[idx+1].id);
                      else { setActivePhase(2); setActiveIndId("d1"); }
                    } else {
                      const idx = DISC_DIMS.findIndex(d=>d.id===activeIndId);
                      if(idx<DISC_DIMS.length-1) setActiveIndId(DISC_DIMS[idx+1].id);
                    }
                  }} style={{flex:2,background:"linear-gradient(135deg,#1A5F9E,#0095C5)",color:"#fff",border:"none",borderRadius:10,padding:"11px",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                    التالي ←
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── COMPARE VIEW ───────────────────────────────────────────────────────────
  if (view === "compare") {
    const evaluated = orgs.filter(o => allScores[o.id] && calcScores(allScores[o.id]));
    const sorted = [...evaluated].sort((a,b) => calcScores(allScores[b.id]).total - calcScores(allScores[a.id]).total);
    const avg = (k) => Math.round(sorted.reduce((a,o)=>a+calcScores(allScores[o.id])[k],0)/sorted.length*10)/10;

    return (
      <div style={{minHeight:"100vh",background:"#F0F4F9",fontFamily:"Tajawal,sans-serif",direction:"rtl"}}>
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap" rel="stylesheet"/>
        <div style={{background:"linear-gradient(135deg,#0D2B52,#1A5F9E)",padding:"14px 24px",display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>setView("home")} style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:8,color:"#fff",padding:"5px 12px",cursor:"pointer",fontSize:12}}>→ الرئيسية</button>
          <div>
            <div style={{color:"rgba(255,255,255,0.6)",fontSize:9}}>نتائج التقييم المنظّم وفق منهجية SWA</div>
            <div style={{color:"#fff",fontWeight:800,fontSize:15}}>📊 لوحة المقارنة الشاملة — {sorted.length} جهات</div>
          </div>
        </div>

        <div style={{maxWidth:960,margin:"0 auto",padding:"16px 24px"}}>
          {/* Averages */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:14}}>
            {[["الإجمالي",avg("total"),"#0D2B52",100],["الإفصاح ESG",avg("p1"),"#1A5F9E",50],["الإفصاح P2",avg("p2"),"#1E8B4C",50],["البيئة",avg("E"),"#1E8B4C",18.4],["الحوكمة",avg("G"),"#5A3090",15.63]].map(([l,v,c,mx])=>(
              <div key={l} style={{background:"#fff",borderRadius:10,padding:"10px",boxShadow:"0 2px 6px rgba(0,0,0,0.05)",borderTop:`3px solid ${c}`}}>
                <div style={{fontWeight:900,fontSize:20,color:c}}>{v}</div>
                <div style={{fontSize:9,color:"#888",marginBottom:3}}>{l}</div>
                <Bar v={v} max={mx} color={c} h={3}/>
              </div>
            ))}
          </div>

          {/* Rankings */}
          <div style={{background:"#fff",borderRadius:16,padding:"16px",marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
            <div style={{fontWeight:700,color:"#0D2B52",fontSize:14,marginBottom:10}}>🏆 الترتيب النهائي — مراجعة بشرية معتمدة</div>
            {sorted.map((org,idx) => {
              const sc = calcScores(allScores[org.id]);
              const lv = getLevel(sc.total);
              const medal = idx===0?"🥇":idx===1?"🥈":idx===2?"🥉":`#${idx+1}`;
              return (
                <div key={org.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",
                  background:idx===0?"linear-gradient(135deg,#FFF8E1,#FFFDE7)":"#F8FBFD",
                  borderRadius:10,border:`1px solid ${idx===0?"#FFC10744":"#E0EAF4"}`,marginBottom:6}}>
                  <div style={{fontSize:18,minWidth:26,textAlign:"center"}}>{medal}</div>
                  <div style={{fontSize:22}}>{org.flag}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:13,color:"#0D2B52"}}>{org.name}</div>
                    <Bar v={sc.total} max={100} color={lv.color} h={4}/>
                  </div>
                  {[["E",sc.E,"#1E8B4C"],["S",sc.S,"#C86010"],["G",sc.G,"#5A3090"],["P1",sc.p1,"#1A5F9E"],["P2",sc.p2,"#0095C5"]].map(([k,v,c])=>(
                    <div key={k} style={{textAlign:"center",minWidth:30}}>
                      <div style={{fontWeight:700,fontSize:12,color:c}}>{v}</div>
                      <div style={{fontSize:8,color:"#AAB"}}>{k}</div>
                    </div>
                  ))}
                  <div style={{textAlign:"center",minWidth:50}}>
                    <div style={{fontWeight:900,fontSize:24,color:lv.color,lineHeight:1}}>{sc.total}</div>
                    <div style={{fontSize:8,color:"#888"}}>/100</div>
                    <div style={{fontSize:9,color:lv.color,fontWeight:600,background:lv.bg,borderRadius:3,padding:"1px 5px",marginTop:1}}>{lv.short}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Table */}
          <div style={{background:"#fff",borderRadius:14,padding:"14px",marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)",overflowX:"auto"}}>
            <div style={{fontWeight:700,color:"#0D2B52",fontSize:13,marginBottom:10}}>📋 جدول المقارنة التفصيلي — كل مؤشر</div>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:10,minWidth:700}}>
              <thead>
                <tr style={{background:"#0D2B52"}}>
                  <th style={{padding:"7px 10px",color:"#fff",textAlign:"right",fontFamily:"Tajawal",minWidth:80}}>المؤشر</th>
                  {sorted.map(o=><th key={o.id} style={{padding:"7px 8px",color:"#fff",textAlign:"center",fontFamily:"Tajawal",whiteSpace:"nowrap"}}>{o.flag} {o.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {Object.entries(DIM_META).map(([dim,meta]) => (
                  <>
                    <tr key={`header_${dim}`} style={{background:meta.bg}}>
                      <td colSpan={sorted.length+1} style={{padding:"5px 10px",fontWeight:700,color:meta.color,fontSize:10,fontFamily:"Tajawal"}}>
                        {meta.label}
                      </td>
                    </tr>
                    {INDICATORS.filter(i=>i.dim===dim).map(ind => (
                      <tr key={ind.id} style={{borderBottom:"1px solid #F0F4F8"}}>
                        <td style={{padding:"5px 10px",fontSize:9,color:"#444",fontFamily:"Tajawal"}}>{ind.id}. {ind.name}</td>
                        {sorted.map(o => {
                          const s = allScores[o.id]?.p1?.[ind.id] || 0;
                          return <td key={o.id} style={{padding:"5px 8px",textAlign:"center",background:s?LV_BG[s]:"#F8F8F8",fontWeight:700,color:s?LV_COL[s]:"#CCC"}}>{s||"—"}</td>;
                        })}
                      </tr>
                    ))}
                  </>
                ))}
                <tr style={{background:"#EEF5FB"}}>
                  <td style={{padding:"6px 10px",fontWeight:700,color:"#1A5F9E",fontSize:10,fontFamily:"Tajawal"}}>📢 الإفصاح</td>
                  {sorted.map(o => { const s=allScores[o.id]?.p2?.d1||0; return <td key={o.id} style={{padding:"6px 8px",textAlign:"center",background:s?LV_BG[s]:"#F8F8F8",fontWeight:700,color:s?LV_COL[s]:"#CCC"}}>{s||"—"}</td>; })}
                </tr>
                <tr style={{background:"#EEF5FB"}}>
                  <td style={{padding:"6px 10px",fontWeight:700,color:"#1A5F9E",fontSize:10,fontFamily:"Tajawal"}}>✅ الموثوقية</td>
                  {sorted.map(o => { const s=allScores[o.id]?.p2?.d2||0; return <td key={o.id} style={{padding:"6px 8px",textAlign:"center",background:s?LV_BG[s]:"#F8F8F8",fontWeight:700,color:s?LV_COL[s]:"#CCC"}}>{s||"—"}</td>; })}
                </tr>
                <tr style={{background:"#EEF5FB"}}>
                  <td style={{padding:"6px 10px",fontWeight:700,color:"#1A5F9E",fontSize:10,fontFamily:"Tajawal"}}>🎯 سرد الأثر</td>
                  {sorted.map(o => { const s=allScores[o.id]?.p2?.d3||0; return <td key={o.id} style={{padding:"6px 8px",textAlign:"center",background:s?LV_BG[s]:"#F8F8F8",fontWeight:700,color:s?LV_COL[s]:"#CCC"}}>{s||"—"}</td>; })}
                </tr>
              </tbody>
            </table>
          </div>
          <button onClick={()=>setView("home")} style={{width:"100%",background:"#0D2B52",color:"#fff",border:"none",borderRadius:12,padding:"13px",fontSize:13,fontWeight:700,cursor:"pointer"}}>→ العودة للرئيسية</button>
        </div>
      </div>
    );
  }

  return null;
}
