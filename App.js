import { useState, useEffect } from "react";

const SK = "swa_eval_v4";
const save = d => { try { localStorage.setItem(SK, JSON.stringify(d)); } catch(e){} };
const load = () => { try { const r=localStorage.getItem(SK); return r?JSON.parse(r):null; } catch(e){ return null; } };

const W = {1:4.91,2:4.29,3:6.13,4:4.29,5:6.13,6:6.13,7:4.91,8:6.13,9:6.13,10:4.29,11:4.29,12:4.91,13:6.13,14:7.28,15:7.28,16:5.10,17:5.10,18:6.55};
const DP = {d1:16.7,d2:16.7,d3:16.6};

const INDS = [
  {id:1,dim:"E",name:"التغير المناخي وكفاءة الطاقة",w:4.91,gri:"GRI 302+305"},
  {id:2,dim:"E",name:"التنوع البيولوجي واستخدام الأراضي",w:4.29,gri:"GRI 304"},
  {id:3,dim:"E",name:"الالتزام البيئي",w:6.13,gri:"GRI 307"},
  {id:4,dim:"E",name:"الاقتصاد الدائري",w:4.29,gri:"GRI 306"},
  {id:5,dim:"E",name:"إدارة الموارد المائية",w:6.13,gri:"GRI 303"},
  {id:6,dim:"E",name:"جودة المياه وسلامة الإمدادات",w:6.13,gri:"GRI 303-3"},
  {id:7,dim:"E",name:"إدارة التلوث ومعالجة المياه",w:4.91,gri:"GRI 306+303"},
  {id:8,dim:"S",name:"خدمات المستفيدين",w:6.13,gri:"GRI 417"},
  {id:9,dim:"S",name:"السلامة والصحة المهنية",w:6.13,gri:"GRI 403"},
  {id:10,dim:"S",name:"المساهمة المجتمعية وتمكين القوى العاملة",w:4.29,gri:"GRI 413+401"},
  {id:11,dim:"S",name:"التوعية وبناء القدرات",w:4.29,gri:"GRI 404"},
  {id:12,dim:"S",name:"إشراك أصحاب المصلحة",w:4.91,gri:"GRI 2-29"},
  {id:13,dim:"S",name:"الإمداد العادل للمياه والصرف الصحي",w:6.13,gri:"GRI 303+413"},
  {id:14,dim:"G",name:"تطوير السياسات والامتثال التنظيمي",w:7.28,gri:"GRI 2-23"},
  {id:15,dim:"G",name:"الحوكمة المؤسسية وإدارة المخاطر",w:7.28,gri:"GRI 2-9"},
  {id:16,dim:"G",name:"الشراكات بين القطاع العام والخاص",w:5.10,gri:"GRI 2-28"},
  {id:17,dim:"G",name:"التوريد المستدام والمحتوى المحلي",w:5.10,gri:"GRI 204+308"},
  {id:18,dim:"G",name:"البحث والابتكار والتطوير",w:6.55,gri:"SASB"},
];
const DISCS = [
  {id:"d1",label:"الإفصاح",icon:"📢",pts:16.7,desc:"شمولية وتنظيم التقرير وفق GRI"},
  {id:"d2",label:"الموثوقية",icon:"✅",pts:16.7,desc:"التحقق الخارجي وجودة البيانات (ISSA 5000)"},
  {id:"d3",label:"سرد الأثر",icon:"🎯",pts:16.6,desc:"الربط الكمي بين الأنشطة والنتائج وSDG"},
];
const SCALE = {1:"غائب — لا ذكر للموضوع",2:"مبدئي — ذكر عام دون بيانات",3:"متطور — بيانات جزئية أو بدون أهداف",4:"متقدم — بيانات كاملة مع أهداف ومقارنة",5:"رائد — بيانات + مراجعة خارجية + مقارنة دولية"};
const SCALE_D = {
  d1:{1:"غير مذكور",2:"ذكر عرضي",3:"قسم ناقص",4:"إفصاح كامل+فهرس",5:"كامل+GRI+مقارنة زمنية"},
  d2:{1:"لا بيانات",2:"بدون مصدر",3:"مصادر داخلية",4:"Limited Assurance خارجي",5:"ISSA 5000 Reasonable Assurance"},
  d3:{1:"لا ربط بالأثر",2:"أثر نوعي",3:"أثر كمي بدون مقارنة",4:"كمي+مقارنة بهدف",5:"أثر+SDG+قصة تغيير دولية"},
};
const DM = {E:{label:"البيئة (E)",color:"#1E8B4C",bg:"#F0FBF4"},S:{label:"المجتمع (S)",color:"#C86010",bg:"#FEF6EC"},G:{label:"الحوكمة (G)",color:"#5A3090",bg:"#F5F0FC"}};
const LBG=["","#FFCCBC","#FFE0B2","#FFFDE7","#E3F2FD","#D4EDDA"];
const LCO=["","#BF360C","#E65100","#856404","#004085","#155724"];
const LLB=["","غائب","مبدئي","متطور","متقدم","رائد"];

const SEEDS = [
  {id:"engie_s",name:"ENGIE AMEA",flag:"🌍",country:"أفريقيا والشرق الأوسط وآسيا",
   p1:{1:4,2:4,3:4,4:3,5:3,6:3,7:3,8:3,9:4,10:3,11:4,12:4,13:3,14:4,15:4,16:4,17:3,18:4},
   p2:{d1:4,d2:2,d3:3},
   ev:{"p1_1":"GHG 34.48M tCO2e|56.7% of ENGIE Group|Net Zero 2045|SBTi -66% by 2030|Ways of Working 14.49 ktCO2e.","p1_2":"1M+ seeds by drone|500K mangroves|EAD partnership|ISO 14001 EMS|Biodiversity Conservation chapter.","p1_3":"GRI 2021|ISO 14001|Environmental Action Plan|CEMS monitoring|ENGIE Group SBTi|بدون إقليمي assurance.","p1_4":"Waste recovery 13.75%(↓ من 15.93%)|CE framework مذكور|e-waste recycling|بدون Zero Waste target.","p1_5":"Desalination 37M m³/yr|Yanbu 570,000 m³/day RO|Water Mgmt chapter|Energy+Desalination B2B.","p1_6":"RO desalination water quality|Yanbu water monitoring|ليست مرفق مياه بلدي|بدون % compliance.","p1_7":"CEMS monitoring Dedisa|Discharge monitoring|Water treatment في desalination|بدون compliance %.","p1_8":"Customer satisfaction 97/100(بعض المناطق)|B2B: حكومات+مرافق+صناعة|PPAs|ليست B2C مياه.","p1_9":"TRIFR=0.62|Fatal=0 employees+0 contractors✅|ISO 45001|ENGIE One Safety|HiPo 9|96.9% closure.","p1_10":"8,986 موظف|92% engagement|20.7% women mgmt|ENGIE Foundation|Morocco earthquake solar.","p1_11":"146,620h training|600 UCamp|Youth Development UAE+Singapore|SIT partnership|D&I programs.","p1_12":"Double Materiality|Stakeholder Engagement chapter|Community AMEA|GRI 2-29|Materiality matrix.","p1_13":"Desalination Yanbu 570K m³/day|SDG 6 ضمني|ENGIE Foundation مياه|B2B Govt/utilities.","p1_14":"GRI 2021|ENGIE Group governance|Anti-bribery|Human Rights|SBTi(Group)|15 countries.","p1_15":"ENGIE Board+AMEA Exec Committee|ESG compensation(Group)|Climate Risk|Cybersecurity|Whistleblowing.","p1_16":"PIF MoU(5GW+green H2 200kt/yr)|SIT Singapore R&D|ENGIE Foundation|PPA partnerships|15 countries.","p1_17":"Local Suppliers مذكور|Procurement policy|Supply chain due diligence|بدون % محتوى محلي.","p1_18":"RO testing platform|Green H2 200 kt/yr|SIT R&D|CCUS+Battery|District cooling|ENGIE Lab SG.","p2_d1":"GRI Standards 2021. 10 chapters هيكل. Sustainability Dashboard. SDG mapping. بيانات 2023 في تقرير 2024.","p2_d2":"'We did not commission independent assurance of our Regional Report.' — صريح. Group-level audit في URD فقط.","p2_d3":"Net Zero 2045+SBTi+TRIFR trend+1M seeds. SDGs مذكورة. Impact narrative محدود. أهداف على مستوى Group."} },
  {id:"veolia_s",name:"Veolia Group فرنسا",flag:"🇫🇷",country:"فرنسا",
   p1:{1:5,2:5,3:5,4:5,5:5,6:4,7:5,8:5,9:4,10:4,11:4,12:5,13:5,14:5,15:5,16:5,17:4,18:5},
   p2:{d1:5,d2:3,d3:5},
   ev:{"p1_1":"S1+2 -14.5% vs 2021|Scope 4: 13.45 Mt✅|SBTi -50% by 2032|Net Zero 2050|CDP A|€650M decarbonization.","p1_2":"158 sensitive sites|73% action plan✅|Act4nature renewed|TNFD LEAP|Davos early adopter|compensation KPI.","p1_3":"CSRD+Double Materiality 41 IROs|EU Taxonomy 44%+45%|EIMS 98.8%|CDP A+A|S&P Top 5%|DJSI|FTSE4Good.","p1_4":"CE revenue €9.5B|PlastiLoop 30+|493K T plastics|Battery recycling|TSA2 >95%|15.2 Mt CO2 eliminated.","p1_5":"Efficiency 75.9%✅|1.45B m³ saved✅|6.4B m³ drinking water|1,039M m³ reused|CEO Water Mandate.","p1_6":"111M drinking+96M sanitation|BeyondPFAS 2024|30 mobile PFAS|CDP Water A|بدون % compliance صريح.","p1_7":"BeyondPFAS E2E|PFAS+micropoll.+hazardous|9 Mt target 2027|1,039M m³ reuse|€4.2B hazardous waste.","p1_8":"NPS=55/81%✅|8.4M inclusive✅|Voice of Customers|Veolia Foundation €3.96M|Barometer 26 دولة.","p1_9":"LTIFR=4.33✅(target≤4.1)|ISO 45001|86.2% H&S training|12.7h avg|95% SMS|72.6%↓ since 2010.","p1_10":"215K employees|88% engagement✅|Veolia Cares|10K FTE community|€2.60 local multiplier.","p1_11":"30.5h✅(target 30h achieved already)|Veolia Academy|110K Learning@Veolia|84% skills enhanced.","p1_12":"Double Materiality 41 IROs|+1 200+ stakeholders|Critical Friends 10+yr|81% survey|Terra Academia.","p1_13":"111M+96M+43M+8.2M|8.4M inclusive✅|SDG 6+7+8+10+11+17|$1.5B UN|Foundation 20 years.","p1_14":"CSRD+EU Taxonomy|TCFD+TNFD|GRI+UN GC 2003|Duty of Care|Ethics+Human Rights|Compliance network.","p1_15":"14+1 directors|64% independent|54.5% female✅|5 committees|CEO 50% ESG-linked|16K managers.","p1_16":"Barometer 26 دولة|+1 collective|Terra Academia|$1.5B UN|Foundation|€30M GreenTech|56 دولة.","p1_17":"86% local purchases|300 high-emitting Scope3 strategy|CSR 5-20% weight|371K jobs|€24B GDP.","p1_18":"14 R&D centers|5,000 patents|+€200M(GreenUp)|Water tech €4.9B|PlastiLoop|CCUS|AI leaks.","p2_d1":"CSRD+Double Materiality+EU Taxonomy+TCFD+TNFD+GRI+UN GC. 15 KPIs مُراقَبة بـ 2027 targets.","p2_d2":"15 KPIs verified by independent third party. ESG Report 56 صفحة — CSRD الكامل في URD منفصل. طبيعة الضمان غير مُفصَّحة في هذا التقرير.","p2_d3":"15 KPIs: NPS✅+LTIFR✅+1.45B water✅+88%✅+30.5h✅+8.4M✅|SDG 14/17|CDP A+A|Moody NZ-2|Scope 4."} },
  {id:"suez_s",name:"SUEZ Group فرنسا",flag:"🇫🇷",country:"فرنسا",
   p1:{1:5,2:4,3:5,4:5,5:4,6:4,7:5,8:4,9:4,10:4,11:3,12:5,13:5,14:5,15:5,16:4,17:4,18:5},
   p2:{d1:5,d2:5,d3:4},
   ev:{"p1_1":"GHG water=746|Waste=2,145|WtE=1,728 ktCO2e|-4.8% target✅|Net Zero 2050|ESRS E1|EU Taxonomy|بدون SBTi.","p1_2":"ESRS E4 كامل|Biodiversity strategy|Macao 7% NRW|Microplastics R&D|سياسات وأهداف موجودة.","p1_3":"CSRD French law|ESRS 270 صفحة|FORVIS-MAZARS+EY Reasonable Assurance|EU Taxonomy|Double Materiality.","p1_4":"ESRS E5 كامل|32.4M MT waste|7.8M T recovered|13.1M people|Waste hierarchy|58+45+479 stations.","p1_5":"900 sites|4.5B m³ produced|2,200 WWTP|3B m³ treated|Macao 7% NRW(أفضل صين)|ESRS E3.","p1_6":"98% contract renewal|PFAS management|Microplastics R&D|ESRS E3-4|بدون drinking water%.","p1_7":"ESRS E2 كامل|3B m³ WW treated|PFAS+SOCs+SVHC|IRM 5,000 sites|Microplastics R&D CIRSEE.","p1_8":"98% contract renewal(record)|ESRS S4 كامل|13.1M waste|65,000 industrial|بدون NPS.","p1_9":"FR=5.58✅(target 5.9)|Severity=0.46❌(target 0.42)|Fatalities=0✅|BU plans 100%✅|ESG-STI 5%.","p1_10":"40,000 موظف|Engagement 67%+9pts✅|90% local economic flows|SDG 6+7+13|Purpose-driven.","p1_11":"Training:14.7h avg(F:13.6|M:15.0)|15.0h avg employee|ESRS S1-13|بدون هدف محدد.","p1_12":"Double Materiality CSRD|5 groups|CSR Committee|PULSE 67%✅|European Works Council|ESRS S2+S4.","p1_13":"4.5B m³ water|3B m³ WW|13.1M waste|SDG 6✅|160+ سنة|France+Africa+Asia.","p1_14":"CSRD French law|ESRS 270 صفحة|FORVIS-MAZARS+EY|EU Taxonomy|Board approved April 2025.","p1_15":"CSRD GOV كامل|STI 30% ESG-linked(H&S 5%+Climate 10%+Employees 10%)|ERM|Reasonable Assurance.","p1_16":"Macao PPP(أفضل آسيا)|New Delhi PPP 15M|55,000 suppliers|ESRS G1+S2|160+ سنة شراكات.","p1_17":"76% France purchases|55,000 suppliers €5.5B|90% local economic flows|ESRS G1.","p1_18":"R&D +50%(2023-2027)|CIRSEE|AI waste|CCUS|CH4/N2O|Wind/battery/PV recycling|Pyrolysis.","p2_d1":"CSRD+ESRS 270 صفحة+EU Taxonomy+GRI+Double Materiality+SDG 6+7+13+Board approval.","p2_d2":"FORVIS-MAZARS+EY—Reasonable Assurance وفق CSRD(French law)—مزدوج—أعلى ضمان في المجموعة.","p2_d3":"SDG 6+7+13✅|Net Zero 2050|-4.8%✅|0 Fatalities✅|FR=5.58✅|7.8M T recovered|بدون SBTi."} },
  {id:"xylem_s",name:"Xylem Inc. الولايات المتحدة",flag:"🇺🇸",country:"الولايات المتحدة",
   p1:{1:5,2:3,3:5,4:4,5:3,6:3,7:3,8:4,9:4,10:4,11:3,12:4,13:3,14:4,15:4,16:4,17:4,18:5},
   p2:{d1:4,d2:4,d3:5},
   ev:{"p1_1":"S1=73,943|S2 MB=18,272|S3=69.05M tCO2e. SBTi validated Dec 2024: -42% S1+2+-52% S3. Net Zero 2050. 80% renewable.","p1_2":"Biodiversity policy+ISO 14001+high water-stress facilities. بدون بيانات كمية.","p1_3":"GRI+SASB|LRQA Assurance|19/21 Triple Crown✅|SBTi|LCAs|EPDs|ISO 59004:2024.","p1_4":"ISO 59004:2024|51,507T waste|61% recycled|2,508 ML water reused|Zero landfill 19/21.","p1_5":"Water withdrawal=2,480 ML(↓3%)|2,508 ML recycled|Customer NRW: 3.71B m³✅|Technology provider.","p1_6":"PFAS solutions 80+ projects|Water treatment products|لا تُزوّد مياه مباشرة للسكان.","p1_7":"Customer: 10.74B m³ polluted water prevented✅|PFAS remediation|محدود operationally.","p1_8":"4/4 Customer Goals✅|3.71B NRW+18.15B reuse|43 disasters|Idrica|Xylem Vue digital suite.","p1_9":"IFR=0.52(↓14%)|هدف≤0.5(لم يتحقق)|ISO 45001|427 facilities|تحسّن مستمر.","p1_10":"79% تطوع 220,000h|WaterEquity fund|9M+ WASH|43 disasters|12M+ water education.","p1_11":"Training avg=16.4h/موظف(هدف 50h—↓↓)|70/20/10 model|CPG performance management.","p1_12":"Materiality+CSO+GRI 2-29+SASB+100+ supplier Watermark events.","p1_13":"9M+ WASH access(Americares)|WaterEquity|SDG 6|Technology provider لا مرفق مائي.","p1_14":"GRI+SASB|CSO+Board Committee|SBTi|Sustainable finance|Political engagement disclosed.","p1_15":"Board+Sustainability Committee|ESG compensation|ERM|Cybersecurity|Ethics chapters.","p1_16":"WaterEquity fund|Americares 25 دولة|Idrica|WASH4Work 79%|Watermark partnerships.","p1_17":"EcoVadis 42%|CDP Supply Chain 43%|WASH4Work 79%|Supplier Opportunity 9.2%✅.","p1_18":"R&D $230M+|Xylem Vue+Idrica|PFAS 80+|Digital twins|LCAs|EPDs|4/4 Goals✅.","p2_d1":"GRI+SASB+Sustainable Finance+SBTi reporting+Mini Reports. بدون ESRS أو TCFD كاملين.","p2_d2":"LRQA Limited Assurance على مؤشرات مختارة (p94-95). أقوى من Internal. ليس ISSA 5000.","p2_d3":"4/4 Customer Goals✅+SBTi+Net Zero 2050+2030 Goals+impact metrics=أعلى سرد أثر."} },
  {id:"canal_s",name:"Canal de Isabel II إسبانيا",flag:"🇪🇸",country:"إسبانيا",
   p1:{1:4,2:3,3:5,4:4,5:4,6:5,7:4,8:4,9:3,10:4,11:4,12:4,13:5,14:5,15:4,16:4,17:3,18:5},
   p2:{d1:5,d2:4,d3:4},
   ev:{"p1_1":"S1=65,162 tCO2e | S2=0 منذ 2018 (100% متجددة) | S3=13%. كثافة 0.192 kg/m³. 371 GWh ذاتي (75%). هدف 2050.","p1_2":"Sustainability Plan بيئي + 97.91% habitat quality. بدون أهداف كمية للتنوع البيولوجي.","p1_3":"ISO 14001+45001+9001 + GRI كامل + NFIS + CSOS 12 اجتماعاً + EY External Verification.","p1_4":"208.26 Mm³ reclaimed water | 15.63 hm³ irrigation | Green Hydrogen 80,000 kg/yr | 100 مشاريع.","p1_5":"198.1 L/cap/day ✅ (أول مرة <200) | أعطال ↓76% | 614,787 smart meters | 490M€ investments.","p1_6":"99.91% compliance (أعلى تاريخياً) | 6.64M سكان | 184 بلدية | EY verified | Water Health Plan.","p1_7":"Discharge 91.53 hm³/yr | 208.26 Mm³ reclaimed | SANEA Plan | Loeches WWTP | GRI 303-4.","p1_8":"رضا 8.78/10 (تاريخي) | NPS tracked | 284,000 تعرفات اجتماعية | Valencia DANA response.","p1_9":"ISO 45001:2018 | LTI freq=13 | Severity=0.21 | 22,176h OHS training | بيانات بالنوع والفئة.","p1_10":"3,253 موظف | Canal Educa 44,251 طالب | DANA response | Canal Voluntarios. بدون استثمار رقمي.","p1_11":"92,143h تدريب | 22,305h anti-corruption | 22,176h OHS | 13 فئة مهنية | dual vocational.","p1_12":"Materiality 2024 | CSOS 12 اجتماعاً | GRI 2-29 | 184 بلدية + 284,000 مستفيد اجتماعي.","p1_13":"6.64M مياه + 6.85M صرف | 284,000 تعرفات اجتماعية 4.7M€ | SDG 6 | 184 بلدية | شامل.","p1_14":"GRI + NFIS | Sustainability Plan 99.91% ✅ | Strategic Plan 2025-2030 €2B | CSOS | EY.","p1_15":"15 عضو | 47% مستقلون ✅ | CAU 15 + CNYR 11 + CSOS 12 + 3 مشتركة | Audit independent.","p1_16":"Canal Group 9.73M سكان | EIB €430M | DANA emergency response | 100 مشروع ابتكاري مع شركاء.","p1_17":"200 موردون + شركاء | Procurement policy + ISO | بدون % محتوى محلي أو CIPS/ISO 20400.","p1_18":"12 مشاريع 2024 (100 منذ 2018) | Vigia Drone+AI | Green Hydrogen 80,000 kg | Smart meters.","p2_d1":"GRI كامل + NFIS + SDG + EU Taxonomy + ISO + Sustainability Plan. 377 صفحة + بيانات 3 سنوات.","p2_d2":"EY (Ernst & Young) External Independent Verification على التقرير 2024. أعلى من Internal Audit.","p2_d3":"ثلاثة أهداف تاريخية ✅: 99.91% + 198.1 L/day + Sustainability Plan 99.91%. SDG 6. Impact قوي."} },
  {id:"acea_s",name:"Acea Group إيطاليا",flag:"🇮🇹",country:"إيطاليا",
   p1:{1:5,2:4,3:5,4:4,5:4,6:4,7:4,8:4,9:4,10:4,11:4,12:5,13:4,14:5,15:5,16:4,17:4,18:4},
   p2:{d1:5,d2:4,d3:4},
   ev:{"p1_1":"S1=428,043|S2 LB=396,740|S2 MB=301,649|S3=3,523,006 tCO2e. Net Zero 2050. SBTi. EU Taxonomy. ESRS E1 كامل.","p1_2":"55 EUAPs+61 SIC-ZSC+14 ZPS+404km grid. ESRS E4 كامل بأهداف وسياسات ومقاييس.","p1_3":"CSRD ملزم + Italian Legislative Decree + ESRS E1-E5 + EU Taxonomy + Duty of Care.","p1_4":"898,000T نفايات | 58% recovery | 3,377,247 m³ recycled water | biogas | ESRS E5 كامل.","p1_5":"Water withdrawals 4,002,270 m³ | -27% water loss (vs 32% target) | District metering.","p1_6":"Water quality monitoring + water supplied metrics + ESRS E3-4. بدون % جودة مياه الشرب صريح.","p1_7":"ESRS E2 كامل | 8,000T heavy metals tracked | discharge compliance | Roma Nord+Est plants.","p1_8":"ESRS S4 كامل | Customer satisfaction surveys | quality perceived. بدون NPS رقم صريح.","p1_9":"Accident freq 5.31 ✅ (target 5.44) | 8,236 covered (95%) | 226,195h training | ESRS S1-14.","p1_10":"8,715 موظف | 90% open-ended | ESRS S3 Communities كامل | 89% collective agreements | 4 دول.","p1_11":"226,195h training | Male avg 25h | Female avg 29h | 85% performance review | ESRS S1-13.","p1_12":"Double Materiality ESRS 1.7 + S2 Value Chain + S3 Communities + S4 Consumers — أشمل منهجية.","p1_13":"مشغّل مياه روما | 4M+ m³ | EU Taxonomy Water 72% aligned capex. بدون SDG 6 صريح.","p1_14":"CSRD ملزم + Italian Legislative Decree + ESRS + EU Taxonomy + GRI + Duty of Care.","p1_15":"ESRS 1.2 Governance كامل | ESG-linked remuneration | Risk Management | Board 5.4.","p1_16":"عمليات في 4 دول | ESRS S2 value chain | EU Taxonomy partnerships | Business Plan.","p1_17":"ESRS G1-6 | 50.9% works + 35.3% services | 94% external costs covered | Supplier ethics.","p1_18":"Digitalisation | Remote control 76.7% ✅ | Biogas +5.76% ✅ | Smart networks.","p2_d1":"CSRD+ESRS كاملة+EU Taxonomy+GRI — أشمل إطار إفصاح في المجموعة الدولية. Double Materiality.","p2_d2":"Limited Assurance إلزامي (Italian Legislative Decree/CSRD) + Statutory Auditor مستقل.","p2_d3":"Net Zero 2050+SBTi+-27% water loss+EU Taxonomy 72%+ESG remuneration. بدون SDG 6 صريح."} },
  {id:"epal_s",name:"EPAL + AdVT البرتغال",flag:"🇵🇹",country:"البرتغال",
   p1:{1:3,2:4,3:5,4:4,5:4,6:5,7:4,8:4,9:4,10:4,11:4,12:4,13:5,14:5,15:4,16:4,17:4,18:4},
   p2:{d1:4,d2:1,d3:4},
   ev:{"p1_1":"هدف -43% Scope1+2 (2019-2029). EPAL S1=1,120|AdVT S1=21,834 tCO2e. EPAL طاقة 559,721 GJ. بدون Scope 3.","p1_2":"ISO 14001 + corredores ecológicos + biodiversidade في 7 Ambições + ERSAR Selos.","p1_3":"ISO 14001+45001 + GRI كامل + Pacto Global ONU + ERSAR Selos + 0 prosecutions.","p1_4":"EPAL 98.8% + AdVT 77.06% waste valorized | biogás | lamas كسماد زراعي | ApR.","p1_5":"AdVT perdas: 10.9→12.2→12.7 m³/(km.dia)↑ | WONE App leak detection (جائزة وطنية).","p1_6":"ERSAR Selos de Qualidade + BECX Águas 2024 Best European CX + conformidade 97%+.","p1_7":"WW treated: 230,889 m³ primary + 29,367,940 m³ secondary | ApR | Constructed Wetlands.","p1_8":"BECX Águas 2024 Best European Customer Experience | ERSAR Selos | Fill Forever rPET.","p1_9":"ISO 45001 + Comissão SST ×5 + تدريب سلامة 1,153h + 256 متدرب + بيانات 3 سنوات.","p1_10":"Dia da Mulher + iGen Forum + licença parental 14+4 | Gender tracking | GRI 401.","p1_11":"16,014h تدريب 2024 (↑16% من 13,823 في 2023) | 1,643 مشارك | Academia das Águas Livres.","p1_12":"5 مجموعات أصحاب مصلحة + ERSAR + Municípios acionistas + Pacto Global + GRI 2-29.","p1_13":"Mission: abastecimento + saneamento universal | ODS 6 | ERSAR Selos | tarifas sociais.","p1_14":"ERSAR regulated + Decreto-Lei 124/2021 + GRI + Pacto Global + ISO 14001+45001.","p1_15":"Conselho de Administração + Comissão de Ética + Código Conduta v4 + Política Anticorrupção.","p1_16":"WICER Banco Mundial + Municípios acionistas + Cooperação internacional VEI + Grupo AdP.","p1_17":"EPAL 99.97% local suppliers | 125.3M€ total | 125.2M€ local | Código Ética Fornecedores.","p1_18":"WONE App (جائزة Transformação Digital) + CCEE energy platform + WICER + Academia.","p2_d1":"GRI Standards كاملة + 7 Ambições + Pacto Global + ODS + هيكل 102 صفحة. بدون SASB أو TCFD.","p2_d2":"'Este relatório não foi sujeito a verificação externa.' — صريح في GRI 2-5. لا أي ضمان خارجي.","p2_d3":"هدف -43% GEE + ODS 6 + 7 Ambições قابلة للقياس + BECX يقيس أثر الخدمة على العملاء."} },
  {id:"pub_s",name:"PUB سنغافورة",flag:"🇸🇬",country:"سنغافورة",
   p1:{1:4,2:3,3:5,4:4,5:5,6:5,7:4,8:3,9:3,10:4,11:4,12:5,13:5,14:5,15:5,16:3,17:3,18:5},
   p2:{d1:5,d2:4,d3:5},
   ev:{"p1_1":"Scope1=7.5|Scope2=230.4|Scope3=204 ktCO₂e. طاقة متجددة=167.4 GWh. نت زيرو ~2045. EUI↑132.","p1_2":"Tengeh 60MW + CFI 9 مشاريع. بدون أهداف كمية للتنوع البيولوجي.","p1_3":"GRI 1:2021 + GreenGov.SG. 100% امتثال WHO 3 سنوات. مراجعة داخلية.","p1_4":"WDI: 0.325→0.203 ✅ تجاوز هدف 30%. نفايات 193,469 طن.","p1_5":"فاقد 7.1%. NEWater 148.3M م³. Four National Taps.","p1_6":"100% WHO 3 سنوات. LPCD=142.","p1_7":"انقطاعات 9.7/شهر. نقاط فيضان 22.","p1_8":"100% رقمي. لا NPS أو CSAT.","p1_9":"⚠️ 3 وفيات FY2024. معدل إصابات ↓16%.","p1_10":"3,311 موظف (823 إناث). تغطية عقود 68.9%.","p1_11":"59h/موظف. إناث 60.7h | إدارة 74.1h.","p1_12":"Appendix 1 + مراجعة سنوية + Alliance for Action.","p1_13":"100% مياه+صرف. هدف LPCD 130. SDG 6.","p1_14":"Statutory Board + GreenGov.SG + GRI 2-23.","p1_15":"14 عضو + BSC×2 + ERM + Internal Audit.","p1_16":"DBOO + Alliance for Action + CFI.","p1_17":"ضوابط موردين. بدون % محتوى محلي.","p1_18":"AI + Tengeh + Carbon removal + Smart Grid.","p2_d1":"GRI 4 صفحات + بيانات 3 سنوات + GreenGov.","p2_d2":"Internal Audit فقط. لا ISSA 5000.","p2_d3":"أهداف: نت زيرو + WDI -30% ✅ + LPCD 130."} },
  {id:"aw_s",name:"American Water",flag:"🇺🇸",country:"الولايات المتحدة",
   p1:{1:5,2:3,3:4,4:2,5:4,6:5,7:4,8:4,9:4,10:4,11:3,12:4,13:4,14:4,15:4,16:3,17:3,18:4},
   p2:{d1:5,d2:4,d3:4},
   ev:{"p1_1":"S1=69,363 | S2=430,362 | إجمالي=499,725 MTCO2e. 41.5% ↓ ✅. ERM CVS ISAE 3000.","p1_2":"Environmental Policy + watershed. بدون بيانات كمية.","p1_3":"GRI+SASB+TCFD+EEI. 'لا يتبع المبدأ الاحترازي لـ GRI'.","p1_4":"'circular' غير موجود في التقرير. Recycled water بدون أرقام.","p1_5":"$3.3B رأسمالي 2024. $40-42B خطة 10 سنوات. AWIA RRAs.","p1_6":"PFAS action plan + 0 violations + Safe Drinking Water Act.","p1_7":"AWIA compliance + effluent quality. SSO: 'plans to report'.","p1_8":"74,250 low-income + 9,550 wastewater. بدون NPS.","p1_9":"ORIR: 0.85→0.40 (2x أفضل من الصناعة). 1 وفاة non-preventable.","p1_10":"AWCF $4.7M + 400+ grants + National Urban League.","p1_11":"Training في PDF charts — لا رقم صريح في النص.","p1_12":"Materiality Assessment + Stakeholder by Group.","p1_13":"74,250 + 9,550 low-income في 12 ولاية.","p1_14":"GRI 2-23 + PUC 50 ولاية. 'لا يتبع المبدأ الاحترازي'.","p1_15":"SETO Committee + CEO/CFO/COO climate roles + TCFD governance.","p1_16":"AWWA + NACWA + FRI memberships. بدون PPP رسمي.","p1_17":"4,500 موردون + Supplier Code of Conduct. بدون % محلي.","p1_18":"FRI + PFAS R&D + AMI + leak detection + $40-42B.","p2_d1":"GRI+SASB+TCFD+EEI — أشمل أطر في المجموعة.","p2_d2":"ERM CVS ISAE 3000 على Scope 1+2. ليس ISSA 5000 كامل.","p2_d3":"41.5% تحقق ✅. TCFD 1.5°C. بدون SDG 6 صريح."} },
  {id:"dewa_s",name:"DEWA دبي",flag:"🇦🇪",country:"الإمارات العربية المتحدة",
   p1:{1:5,2:3,3:5,4:4,5:5,6:4,7:4,8:4,9:5,10:4,11:4,12:4,13:4,14:5,15:5,16:4,17:4,18:5},
   p2:{d1:5,d2:4,d3:4},
   ev:{"p1_1":"11.47M طن CO2e تخفيض. MBR Solar 3,060MW. 6.62 TWh. نت زيرو 2050.","p1_2":"Biodiversity في materiality matrix. بدون هكتارات أو أنواع أو أهداف كمية.","p1_3":"GRI 12 سنة + Globe of Honour + DNV verified. ISO 14001 ضمنياً.","p1_4":"CE strategy 5 مبادئ. نفايات 5,773 طن. خردة AED 64.69M.","p1_5":"فاقد مياه 4.5% (أقل عالمياً). 1.1M smart meters. 150,478 MIG.","p1_6":"CML=0.94 min (أقل عالمياً). 495 MIGD. بدون compliance % صريح.","p1_7":"Process water DNV verified: power 1.647B + desal 4.093B م³.","p1_8":"1,270,285 عميل + 100% IDCXS + happiness index.","p1_9":"Fatality=0 | LTIFR=0.7 | TRIR=0.14 | ISO 45001 | Sword of Honour BSI 5★.","p1_10":"10,722 موظف + 107 برنامج + Emiratisation + 18% إناث.","p1_11":"تدريب 6 سنوات: قيادة 96.67h | إدارة 56.07h | إماراتيون 60.02h.","p1_12":"3 ورش نوفمبر 2024 + 47 موضوع مادي + materiality matrix بدرجات.","p1_13":"52,296 وصلة مياه + 48,746 كهرباء. تغطية شاملة دبي.","p1_14":"GRI 12 سنة + Integrated Report + DFM listed + Golden Peacock.","p1_15":"Integrated Report = Sustainability+Governance+Financial. DFM AED 124B.","p1_16":"IWPP 180 MIGD SWRO + Shuaa Energy 3 1,800MW. نتائج مالية موثّقة.","p1_17":"90.04% محتوى محلي. 13,863 معاملة. 173 موردون عالميون.","p1_18":"Green Hydrogen (أول إماراتي) + AI ISO/IEC 24028 (أول حكومة) + R&D.","p2_d1":"GRI Content Index + Integrated Report + DFM + 12 سنة متواصلة.","p2_d2":"DNV verified على GRI 303+401+403. ليس ISSA 5000 كامل.","p2_d3":"نت زيرو + فاقد 4.5% + CML 0.94 min. بيانات 6 سنوات."} },
  {id:"tw_s",name:"Thames Water",flag:"🇬🇧",country:"المملكة المتحدة",
   p1:{1:4,2:4,3:4,4:4,5:4,6:3,7:3,8:3,9:4,10:3,11:4,12:4,13:4,14:4,15:3,16:3,17:3,18:3},
   p2:{d1:4,d2:3,d3:3},
   ev:{"p1_1":"S1=9.7+220.2 | S2=103.6+87.5 | S3=42.1+78.5 kTCO2e. 73% ↓ من 1990. بدون SBTi.","p1_2":"SSSI 94.68% + 100% fav/recovering. 8 wetlands. 157 sites AMP7.","p1_3":"3 سياسات بيئية. 0 prosecutions 2024/25. Biosolids Assurance Scheme.","p1_4":"Gas-to-Grid 2 plants. Biosolids 100%. Heat 216GWh. Plastic 37.7T.","p1_5":"Leakage 569.1 Ml/d (أدنى تاريخي). 629,749 smart meters. WRMP approved.","p1_6":"CRI=2.04 (↑ من 1.43، هدفه 0.0). 99.97% abstraction. بدون drinking water%.","p1_7":"470 حادثة تلوث (↑ من 350). STW compliance 98.69% (↓). EDM 100%.","p1_8":"C-MeX=61.44 (17/17 في الصناعة). D-MeX=79.88. 408,670 social tariff.","p1_9":"0 fatal accidents. LTIF employee=0.15 (↑). LTIs: 25+11. 844 days lost.","p1_10":"Community investment £0.12M (↓ حاد من £1.13M). 4,966 volunteer hours.","p1_11":"Training 31.5K days. 71 apprenticeships. 35 مؤهل. Cyber+Ethics إلزامي.","p1_12":"Stakeholder programme 5 سنوات. Modern Slavery. Whistleblowing 24/7.","p1_13":"408,670 social (↑94%). 619,253 PSR (↑214%). WaterAid £156K.","p1_14":"UK Corp Gov Code + Ofwat Principles. ODI penalties -£68.18M.","p1_15":"Female board 8% (↓ من 36%). Credit Caa3. 75% independent. ISO 31000.","p1_16":"TfL+GLA Marylebone. WRSE collaboration. بدون PPP رسمي كمي.","p1_17":"473 strategic frameworks. 479 Achilles audit. £3.1B procurement.","p1_18":"Drones 30 flights (80% savings). Gas-to-Grid. بدون R&D رقم.","p2_d1":"ESG Statement 8th year + 5 سنوات بيانات. بدون GRI formal index.","p2_d2":"Biosolids Assurance Scheme فقط. بدون External Assurance رسمي.","p2_d3":"أهداف AMP7 + 9 case studies. بدون SDG 6 صريح."} },
  {id:"swa_s",name:"الهيئة السعودية للمياه",flag:"🇸🇦",country:"المملكة العربية السعودية",
   p1:{1:3,2:3,3:4,4:3,5:4,6:4,7:3,8:4,9:4,10:4,11:4,12:4,13:5,14:5,15:4,16:3,17:4,18:4},
   p2:{d1:4,d2:2,d3:3},
   ev:{"p1_1":"وقود ↓25% + solar integration. بدون Scope 1+2+3 أرقام صريحة. GRI 302.","p1_2":"+8M trees + Saudi Green Initiative + constructed wetlands. بدون أهداف كمية.","p1_3":"ISO 14001 + environmental policy + zero non-compliance incidents. تقرير أول.","p1_4":"Circular economy framework + recycled water لـ 612,000 شجرة + constructed wetlands.","p1_5":"+5M م³/يوم تحلية + 16.6M م³/يوم إنتاج + 14,000كم شبكات.","p1_6":"Saudi Water Quality Index + compliance monitoring + 5B لتر/يوم.","p1_7":"معالجة مياه الصرف + 612,000 شجرة مروية. بدون discharge compliance%.","p1_8":"استراتيجية حماية المستفيدين + تتبع الرضا + خدمات رقمية. GRI 417.","p1_9":"Zero work-related fatalities + 8M+ safe working hours + Great Workplace 2024.","p1_10":"Saudization 98.74% + 226 موظف جديد + 64 امرأة + 199 تطوع 51,350h.","p1_11":"21,570 ساعة تدريب + 4,600+ برنامج + 150 Tamkeen + 70 HiPo program.","p1_12":"Materiality assessment + 5 مجموعات أصحاب مصلحة + قنوات متعددة.","p1_13":"المفوّضية الأساسية للوصول للمياه + SDG 6 UN benchmark + Saudi Green.","p1_14":"قرار مجلس الوزراء 918 + دور تنظيمي محوري + ESG Disclosure Guidelines.","p1_15":"مجلس الإدارة + لجان التدقيق والشؤون التنظيمية + إطار المخاطر.","p1_16":"الشراكات في materiality matrix + سلسلة القيمة. بدون PPP رسمي بنتائج.","p1_17":"شهادة CIPS + SAR 23B محتوى محلي + معايير ESG لسلسلة التوريد.","p1_18":"Global Water Innovation Platform + digital twin + smart robotics + AI.","p2_d1":"GRI Core compliance + 129 صفحة + هيكل شامل. تقرير أول — بعض الفجوات.","p2_d2":"'No external assurance conducted' — صريح في GRI index صفحة 118.","p2_d3":"بعض الأهداف الكمية + SDG 6 + Vision 2030. Impact narrative محدود — تقرير أول."} },
];

function calc(p1,p2){
  if(!p1) return null;
  const r=Object.entries(W).reduce((a,[i,w])=>a+((p1[i]||1)/5)*w,0);
  const p1s=Math.round(r*0.5*10)/10;
  const p2s=Math.round(Object.entries(DP).reduce((a,[d,pts])=>a+((p2?.[d]||1)/5)*pts,0)*10)/10;
  const E=Math.round([1,2,3,4,5,6,7].reduce((a,i)=>a+((p1[i]||1)/5)*W[i],0)*0.5*10)/10;
  const S=Math.round([8,9,10,11,12,13].reduce((a,i)=>a+((p1[i]||1)/5)*W[i],0)*0.5*10)/10;
  const G=Math.round([14,15,16,17,18].reduce((a,i)=>a+((p1[i]||1)/5)*W[i],0)*0.5*10)/10;
  return{p1:p1s,p2:p2s,total:Math.round((p1s+p2s)*10)/10,E,S,G};
}
function getLevel(t){
  if(t>=85) return{label:"رائد عالمياً 🏆",color:"#155724",bg:"#D4EDDA",short:"رائد"};
  if(t>=70) return{label:"متقدم ✅",color:"#004085",bg:"#CCE5FF",short:"متقدم"};
  if(t>=55) return{label:"متطور 📈",color:"#856404",bg:"#FFF3CD",short:"متطور"};
  return{label:"مبدئي ⚠️",color:"#E65100",bg:"#FFE0B2",short:"مبدئي"};
}
function Bar({v,max=100,color="#1A5F9E",h=5}){
  return <div style={{background:"#E8EDF2",borderRadius:99,height:h,overflow:"hidden"}}><div style={{width:`${Math.min((v/max)*100,100)}%`,height:"100%",background:color,borderRadius:99,transition:"width 0.7s"}} /></div>;
}

export default function App(){
  const [orgs,setOrgs]=useState([]);
  const [scores,setScores]=useState({});
  const [ev,setEvState]=useState({});
  const [view,setView]=useState("home");
  const [aid,setAid]=useState(null);
  const [phase,setPhase]=useState(1);
  const [iid,setIid]=useState(1);
  const [newName,setNewName]=useState("");
  const [newFlag,setNewFlag]=useState("🌍");
  const [newCountry,setNewCountry]=useState("");
  const [showAdd,setShowAdd]=useState(false);
  const [loaded,setLoaded]=useState(false);
  const [saving,setSaving]=useState(false);

  useEffect(()=>{
    const data=load();
    if(data?.orgs?.length>0){
      setOrgs(data.orgs); setScores(data.scores||{}); setEvState(data.ev||{});
    } else {
      setOrgs(SEEDS.map(s=>({id:s.id,name:s.name,flag:s.flag,country:s.country})));
      setScores(Object.fromEntries(SEEDS.map(s=>[s.id,{p1:s.p1,p2:s.p2}])));
      setEvState(Object.fromEntries(SEEDS.map(s=>[s.id,s.ev])));
    }
    setLoaded(true);
  },[]);

  useEffect(()=>{
    if(!loaded) return;
    setSaving(true);
    const t=setTimeout(()=>{ save({orgs,scores,ev}); setSaving(false); },600);
    return()=>clearTimeout(t);
  },[orgs,scores,ev,loaded]);

  const aOrg=orgs.find(o=>o.id===aid);
  const aSc=scores[aid]||{};
  const aEv=ev[aid]||{};

  function setScore(type,id,val){
    setScores(p=>({...p,[aid]:{...(p[aid]||{}),p1:{...(p[aid]?.p1||{})},p2:{...(p[aid]?.p2||{})},[type]:{...(p[aid]?.[type]||{}),[id]:val}}}));
  }
  function setEv(key,val){
    setEvState(p=>({...p,[aid]:{...(p[aid]||{}),[key]:val}}));
  }
  function addOrg(){
    if(!newName.trim()||orgs.length>=25) return;
    const id=`org_${Date.now()}`;
    setOrgs(p=>[...p,{id,name:newName.trim(),flag:newFlag,country:newCountry.trim()}]);
    setNewName(""); setNewFlag("🌍"); setNewCountry(""); setShowAdd(false);
  }
  function removeOrg(id){
    if(SEEDS.some(s=>s.id===id)) return;
    setOrgs(p=>p.filter(o=>o.id!==id));
    setScores(p=>{const n={...p};delete n[id];return n;});
    setEvState(p=>{const n={...p};delete n[id];return n;});
  }
  function completion(id){
    const sc=scores[id]||{};
    return Math.round(((Object.keys(sc.p1||{}).length+Object.keys(sc.p2||{}).length)/21)*100);
  }

  const evaluated=orgs.filter(o=>scores[o.id]?.p1);
  const sorted=[...evaluated].sort((a,b)=>(calc(scores[b.id].p1,scores[b.id].p2)?.total||0)-(calc(scores[a.id].p1,scores[a.id].p2)?.total||0));
  const avg=k=>sorted.length?Math.round(sorted.reduce((a,o)=>a+(calc(scores[o.id].p1,scores[o.id].p2)?.[k]||0),0)/sorted.length*10)/10:0;

  if(!loaded) return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#F0F4F9",fontFamily:"Tajawal,sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;800&display=swap" rel="stylesheet"/>
      <div style={{textAlign:"center"}}><div style={{fontSize:48}}>💧</div><div style={{marginTop:12,fontSize:16,fontWeight:700,color:"#0D2B52"}}>جارٍ تحميل البيانات...</div></div>
    </div>
  );

  // ── COMPARE ──────────────────────────────────────────────────────────────────
  if(view==="compare") return(
    <div style={{minHeight:"100vh",background:"#F0F4F9",fontFamily:"Tajawal,sans-serif",direction:"rtl"}}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;800&display=swap" rel="stylesheet"/>
      <div style={{background:"linear-gradient(135deg,#0D2B52,#1A5F9E)",padding:"13px 22px",display:"flex",gap:10,alignItems:"center",position:"sticky",top:0,zIndex:99,boxShadow:"0 2px 8px rgba(0,0,0,0.2)"}}>
        <button onClick={()=>setView("home")} style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:8,color:"#fff",padding:"5px 12px",cursor:"pointer",fontSize:12}}>→ الرئيسية</button>
        <div style={{flex:1,color:"#fff",fontWeight:800,fontSize:15}}>📊 لوحة المقارنة — {sorted.length} جهات</div>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.5)"}}>{saving?"💾":"✅"}</div>
      </div>
      <div style={{maxWidth:980,margin:"0 auto",padding:"14px 22px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:14}}>
          {[["متوسط الإجمالي",avg("total"),"#0D2B52",100],["الإفصاح ESG",avg("p1"),"#1A5F9E",50],["جودة الإفصاح",avg("p2"),"#1E8B4C",50],["البيئة E",avg("E"),"#1E8B4C",18.4],["الحوكمة G",avg("G"),"#5A3090",15.63]].map(([l,v,c,mx])=>(
            <div key={l} style={{background:"#fff",borderRadius:10,padding:"10px",boxShadow:"0 2px 6px rgba(0,0,0,0.05)",borderTop:`3px solid ${c}`}}>
              <div style={{fontWeight:900,fontSize:20,color:c}}>{v}</div>
              <div style={{fontSize:9,color:"#888",marginBottom:3}}>{l}</div>
              <Bar v={v} max={mx} color={c} h={3}/>
            </div>
          ))}
        </div>
        <div style={{background:"#fff",borderRadius:16,padding:"16px",marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
          <div style={{fontWeight:700,color:"#0D2B52",fontSize:14,marginBottom:10}}>🏆 الترتيب العالمي — اضغط للتفاصيل</div>
          {sorted.map((org,idx)=>{
            const sc=calc(scores[org.id].p1,scores[org.id].p2);
            const lv=getLevel(sc.total);
            const medal=idx===0?"🥇":idx===1?"🥈":idx===2?"🥉":`${idx+1}.`;
            return(
              <div key={org.id} onClick={()=>{setAid(org.id);setPhase(1);setIid(1);setView("eval");}}
                style={{display:"flex",alignItems:"center",gap:9,padding:"10px 12px",background:idx===0?"linear-gradient(135deg,#FFF8E1,#FFFDE7)":"#F8FBFD",borderRadius:10,border:`1px solid ${idx===0?"#FFC10744":"#E0EAF4"}`,marginBottom:6,cursor:"pointer",transition:"all 0.15s"}}
                onMouseEnter={e=>e.currentTarget.style.transform="translateX(-2px)"}
                onMouseLeave={e=>e.currentTarget.style.transform="translateX(0)"}>
                <div style={{fontSize:17,minWidth:26}}>{medal}</div>
                <div style={{fontSize:19}}>{org.flag}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:13,color:"#0D2B52",marginBottom:2}}>{org.name}</div>
                  <Bar v={sc.total} color={lv.color} h={4}/>
                </div>
                {[["E",sc.E,"#1E8B4C"],["S",sc.S,"#C86010"],["G",sc.G,"#5A3090"],["P1",sc.p1,"#1A5F9E"],["P2",sc.p2,"#0095C5"]].map(([k,v,c])=>(
                  <div key={k} style={{textAlign:"center",minWidth:28}}>
                    <div style={{fontWeight:700,fontSize:11,color:c}}>{v}</div>
                    <div style={{fontSize:7,color:"#AAB"}}>{k}</div>
                  </div>
                ))}
                <div style={{textAlign:"center",minWidth:50}}>
                  <div style={{fontWeight:900,fontSize:24,color:lv.color,lineHeight:1}}>{sc.total}</div>
                  <div style={{fontSize:7,color:"#888"}}>/100</div>
                  <div style={{fontSize:9,color:lv.color,fontWeight:600,background:lv.bg,borderRadius:4,padding:"1px 5px",marginTop:1}}>{lv.short}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{background:"#fff",borderRadius:14,padding:"14px",marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.05)",overflowX:"auto"}}>
          <div style={{fontWeight:700,color:"#0D2B52",fontSize:13,marginBottom:8}}>📋 مقارنة تفصيلية</div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:10,minWidth:560}}>
            <thead><tr style={{background:"#0D2B52"}}>
              {["الجهة","الإجمالي","P1","P2","E","S","G"].map(h=><th key={h} style={{padding:"7px 8px",color:"#fff",textAlign:"center",fontFamily:"Tajawal"}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {sorted.map((org,ri)=>{
                const sc=calc(scores[org.id].p1,scores[org.id].p2);
                return(<tr key={org.id} style={{background:ri%2===0?"#F8FBFD":"#fff"}}>
                  <td style={{padding:"7px 8px",fontWeight:600,fontFamily:"Tajawal"}}>{org.flag} {org.name}</td>
                  {[sc.total,sc.p1,sc.p2,sc.E,sc.S,sc.G].map((v,ci)=>{
                    const mx=[100,50,50,18.4,15.95,15.63][ci];
                    const pct=(v/mx)*100;
                    const bg=pct>=80?"#D4EDDA":pct>=65?"#CCE5FF":pct>=50?"#FFF3CD":"#FFE0B2";
                    const tc=pct>=80?"#155724":pct>=65?"#004085":pct>=50?"#856404":"#E65100";
                    return <td key={ci} style={{padding:"7px 8px",textAlign:"center",fontWeight:700,color:tc,background:bg}}>{v}</td>;
                  })}
                </tr>);
              })}
              <tr style={{background:"#E8F2FA"}}>
                <td style={{padding:"7px 8px",fontWeight:700,fontFamily:"Tajawal",color:"#0D2B52"}}>📊 متوسط</td>
                {["total","p1","p2","E","S","G"].map(k=><td key={k} style={{padding:"7px 8px",textAlign:"center",fontWeight:700,color:"#0D2B52"}}>{avg(k)}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
        <button onClick={()=>setView("home")} style={{width:"100%",background:"#0D2B52",color:"#fff",border:"none",borderRadius:12,padding:"12px",fontSize:13,fontWeight:700,cursor:"pointer"}}>→ الرئيسية</button>
      </div>
    </div>
  );

  // ── EVAL ──────────────────────────────────────────────────────────────────────
  if(view==="eval" && aOrg){
    const sc=aSc?.p1?calc(aSc.p1,aSc.p2):null;
    const isP1=phase===1;
    const curInd=isP1?INDS.find(i=>i.id===iid):DISCS.find(d=>d.id===iid);
    const done=Object.keys(aSc?.p1||{}).length+Object.keys(aSc?.p2||{}).length;
    const scaleNow=isP1?SCALE:SCALE_D[iid];

    return(
      <div style={{minHeight:"100vh",background:"#F0F4F9",fontFamily:"Tajawal,sans-serif",direction:"rtl"}}>
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;800&display=swap" rel="stylesheet"/>
        <div style={{background:"linear-gradient(135deg,#0D2B52,#1A5F9E)",padding:"10px 18px",display:"flex",gap:9,alignItems:"center",position:"sticky",top:0,zIndex:99}}>
          <button onClick={()=>setView("home")} style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:7,color:"#fff",padding:"4px 10px",cursor:"pointer",fontSize:11}}>→</button>
          <div style={{flex:1}}>
            <div style={{color:"rgba(255,255,255,0.55)",fontSize:9}}>{done}/21 مؤشر</div>
            <div style={{color:"#fff",fontWeight:800,fontSize:14}}>{aOrg.flag} {aOrg.name}</div>
          </div>
          <div style={{width:70,height:4,background:"rgba(255,255,255,0.2)",borderRadius:99,overflow:"hidden"}}>
            <div style={{width:`${(done/21)*100}%`,height:"100%",background:"#00E5A0"}}/>
          </div>
          {sc&&<div style={{background:"rgba(255,255,255,0.15)",borderRadius:7,padding:"3px 10px",color:"#fff",fontWeight:900,fontSize:15}}>{sc.total}</div>}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"196px 1fr",minHeight:"calc(100vh - 42px)"}}>
          <div style={{background:"#1A2744",overflowY:"auto",padding:"6px 0"}}>
            {Object.entries(DM).map(([dim,meta])=>(
              <div key={dim}>
                <div style={{fontSize:8,color:meta.color,padding:"4px 8px",fontWeight:700}}>{meta.label}</div>
                {INDS.filter(i=>i.dim===dim).map(ind=>{
                  const s=aSc?.p1?.[ind.id];
                  const isAct=phase===1&&iid===ind.id;
                  return(
                    <button key={ind.id} onClick={()=>{setPhase(1);setIid(ind.id);}}
                      style={{width:"100%",background:isAct?"rgba(255,255,255,0.15)":"transparent",border:"none",borderRadius:5,padding:"4px 6px",cursor:"pointer",display:"flex",alignItems:"center",gap:5,marginBottom:1}}>
                      <div style={{width:14,height:14,borderRadius:3,background:s?LBG[s]:"rgba(255,255,255,0.1)",color:s?LCO[s]:"#666",fontSize:8,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{s||"·"}</div>
                      <span style={{fontSize:8,color:isAct?"#fff":"rgba(255,255,255,0.5)",textAlign:"right",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ind.name}</span>
                    </button>
                  );
                })}
              </div>
            ))}
            <div style={{borderTop:"1px solid rgba(255,255,255,0.1)",margin:"6px 0 2px",padding:"4px 8px 2px"}}>
              <div style={{fontSize:8,color:"rgba(255,255,255,0.4)",marginBottom:2}}>جودة الإفصاح</div>
              {DISCS.map(d=>{
                const s=aSc?.p2?.[d.id];
                const isAct=phase===2&&iid===d.id;
                return(
                  <button key={d.id} onClick={()=>{setPhase(2);setIid(d.id);}}
                    style={{width:"100%",background:isAct?"rgba(255,255,255,0.15)":"transparent",border:"none",borderRadius:5,padding:"5px 6px",cursor:"pointer",display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
                    <div style={{width:14,height:14,borderRadius:3,background:s?LBG[s]:"rgba(255,255,255,0.1)",color:s?LCO[s]:"#666",fontSize:8,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{s||"·"}</div>
                    <span style={{fontSize:9,color:isAct?"#fff":"rgba(255,255,255,0.5)"}}>{d.icon} {d.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{overflowY:"auto",padding:"13px 17px"}}>
            {curInd&&(<>
              <div style={{background:"#fff",borderRadius:12,padding:"13px",marginBottom:9,boxShadow:"0 2px 5px rgba(0,0,0,0.05)"}}>
                {isP1&&<div style={{display:"inline-block",background:DM[curInd.dim]?.bg,color:DM[curInd.dim]?.color,borderRadius:5,padding:"2px 8px",fontSize:9,fontWeight:700,marginBottom:5}}>{DM[curInd.dim]?.label}</div>}
                <div style={{fontWeight:800,fontSize:15,color:"#0D2B52",marginBottom:3}}>{isP1?`${curInd.id}. ${curInd.name}`:`${curInd.icon} ${curInd.label}`}</div>
                <div style={{fontSize:10,color:"#888"}}>{isP1?`${curInd.gri} | وزن: ${curInd.w}%`:curInd.desc}</div>
              </div>
              <div style={{background:"#fff",borderRadius:12,padding:"13px",marginBottom:9,boxShadow:"0 2px 5px rgba(0,0,0,0.05)"}}>
                <div style={{fontWeight:700,color:"#0D2B52",fontSize:12,marginBottom:7}}>📏 اختر الدرجة</div>
                {Object.entries(scaleNow).map(([grade,desc])=>{
                  const g=parseInt(grade);
                  const cur=isP1?(aSc?.p1?.[curInd.id]):(aSc?.p2?.[curInd.id]);
                  const sel=cur===g;
                  return(
                    <button key={grade} onClick={()=>isP1?setScore("p1",curInd.id,g):setScore("p2",curInd.id,g)}
                      style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"8px 10px",marginBottom:4,background:sel?LBG[g]:"#F8FBFD",border:`2px solid ${sel?LCO[g]+"88":"#E8EDF2"}`,borderRadius:9,cursor:"pointer",textAlign:"right",transition:"all 0.1s"}}>
                      <div style={{width:26,height:26,borderRadius:6,background:sel?LCO[g]:"#DDD",color:"#fff",fontSize:13,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{grade}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:10,fontWeight:700,color:sel?LCO[g]:"#555"}}>{LLB[g]}</div>
                        <div style={{fontSize:9,color:"#777"}}>{desc}</div>
                      </div>
                      {sel&&<div style={{fontSize:14,color:LCO[g]}}>✓</div>}
                    </button>
                  );
                })}
              </div>
              <div style={{background:"#fff",borderRadius:12,padding:"13px",marginBottom:9,boxShadow:"0 2px 5px rgba(0,0,0,0.05)"}}>
                <div style={{fontWeight:700,color:"#0D2B52",fontSize:12,marginBottom:5}}>📌 المبرر والأدلة من التقرير</div>
                <textarea value={aEv[`${isP1?"p1":"p2"}_${curInd.id}`]||""} onChange={e=>setEv(`${isP1?"p1":"p2"}_${curInd.id}`,e.target.value)}
                  placeholder="الصفحة، الأرقام، الاقتباسات الداعمة..."
                  style={{width:"100%",minHeight:68,padding:"9px",border:"1px solid #D0DCE8",borderRadius:8,fontSize:11,fontFamily:"Tajawal",direction:"rtl",resize:"vertical",boxSizing:"border-box"}}/>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>{if(isP1){const idx=INDS.findIndex(i=>i.id===iid);idx>0?setIid(INDS[idx-1].id):(setPhase(2),setIid("d3"));}else{const idx=DISCS.findIndex(d=>d.id===iid);idx>0?setIid(DISCS[idx-1].id):(setPhase(1),setIid(18));}}}
                  style={{flex:1,background:"#F0F4F9",color:"#444",border:"1px solid #D0DCE8",borderRadius:9,padding:"10px",fontSize:12,cursor:"pointer"}}>← السابق</button>
                <button onClick={()=>{if(isP1){const idx=INDS.findIndex(i=>i.id===iid);idx<INDS.length-1?setIid(INDS[idx+1].id):(setPhase(2),setIid("d1"));}else{const idx=DISCS.findIndex(d=>d.id===iid);idx<DISCS.length-1&&setIid(DISCS[idx+1].id);}}}
                  style={{flex:2,background:"linear-gradient(135deg,#1A5F9E,#0095C5)",color:"#fff",border:"none",borderRadius:9,padding:"10px",fontSize:12,fontWeight:700,cursor:"pointer"}}>التالي →</button>
              </div>
            </>)}
          </div>
        </div>
      </div>
    );
  }

  // ── HOME ──────────────────────────────────────────────────────────────────────
  return(
    <div style={{minHeight:"100vh",background:"#F0F4F9",fontFamily:"Tajawal,sans-serif",direction:"rtl"}}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;800&display=swap" rel="stylesheet"/>
      <div style={{background:"linear-gradient(135deg,#0D2B52 0%,#1A5F9E 60%,#0095C5 100%)",padding:"22px 26px 16px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle at 80% 50%,rgba(0,149,197,0.2) 0%,transparent 60%)"}}/>
        <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:44,height:44,background:"rgba(255,255,255,0.15)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>💧</div>
            <div>
              <div style={{color:"rgba(255,255,255,0.55)",fontSize:9,letterSpacing:3}}>SAUDI WATER AUTHORITY</div>
              <div style={{color:"#fff",fontWeight:800,fontSize:17}}>أداة تقييم تقارير الاستدامة</div>
              <div style={{color:"rgba(255,255,255,0.6)",fontSize:10}}>وفق منهجية SWA | 18 مؤشراً موزوناً | حتى 25 تقريراً</div>
            </div>
          </div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",textAlign:"center"}}>
            <div>{saving?"💾 حفظ...":"✅ محفوظ"}</div>
          </div>
        </div>
      </div>
      <div style={{maxWidth:980,margin:"0 auto",padding:"16px 24px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>
          {[{n:orgs.length,sub:`من أصل 25`,l:"جهة مُضافة",c:"#1A5F9E"},{n:evaluated.length,sub:"مكتملة أو جزئية",l:"جهة مُقيَّمة",c:"#1E8B4C"},{n:25-orgs.length,sub:"يمكن إضافتها",l:"متبقية",c:"#C86010"},{n:sorted[0]?calc(scores[sorted[0].id].p1,scores[sorted[0].id].p2).total:"-",sub:sorted[0]?.name||"لا يوجد",l:"أعلى درجة",c:"#5A3090"}].map((s,i)=>(
            <div key={i} style={{background:"#fff",borderRadius:10,padding:"12px",borderRight:`3px solid ${s.c}`,boxShadow:"0 2px 6px rgba(0,0,0,0.05)"}}>
              <div style={{fontWeight:900,fontSize:24,color:s.c}}>{s.n}</div>
              <div style={{fontSize:11,fontWeight:600,color:"#333"}}>{s.l}</div>
              <div style={{fontSize:9,color:"#AAA"}}>{s.sub}</div>
            </div>
          ))}
        </div>

        {orgs.length<25&&(showAdd?(
          <div style={{background:"#fff",borderRadius:13,padding:"14px",marginBottom:12,border:"2px solid #1A5F9E33",boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
            <div style={{fontWeight:700,color:"#0D2B52",fontSize:13,marginBottom:8}}>➕ إضافة جهة جديدة ({25-orgs.length} متبقية)</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <input value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addOrg()} placeholder="اسم الجهة *"
                style={{flex:2,minWidth:150,padding:"8px 12px",border:"1px solid #D0DCE8",borderRadius:8,fontSize:13,fontFamily:"Tajawal",direction:"rtl"}}/>
              <input value={newCountry} onChange={e=>setNewCountry(e.target.value)} placeholder="الدولة"
                style={{flex:1,minWidth:90,padding:"8px 12px",border:"1px solid #D0DCE8",borderRadius:8,fontSize:13,fontFamily:"Tajawal",direction:"rtl"}}/>
              <input value={newFlag} onChange={e=>setNewFlag(e.target.value)} placeholder="🌍" maxLength={4}
                style={{width:48,padding:"8px",border:"1px solid #D0DCE8",borderRadius:8,fontSize:18,textAlign:"center"}}/>
              <button onClick={addOrg} style={{background:"#1A5F9E",color:"#fff",border:"none",borderRadius:8,padding:"8px 18px",fontSize:13,fontWeight:700,cursor:"pointer"}}>إضافة</button>
              <button onClick={()=>setShowAdd(false)} style={{background:"#F0F4F9",color:"#555",border:"1px solid #D0DCE8",borderRadius:8,padding:"8px 14px",fontSize:13,cursor:"pointer"}}>إلغاء</button>
            </div>
          </div>
        ):(
          <button onClick={()=>setShowAdd(true)}
            style={{width:"100%",background:"#fff",border:"2px dashed #B0C8E0",borderRadius:11,padding:"12px",fontSize:13,fontWeight:600,color:"#1A5F9E",cursor:"pointer",marginBottom:12,transition:"background 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.background="#EEF5FF"}
            onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
            ➕ إضافة جهة جديدة للتقييم ({25-orgs.length} متبقية من أصل 25)
          </button>
        ))}

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:10,marginBottom:14}}>
          {orgs.map(org=>{
            const sc=scores[org.id]?.p1?calc(scores[org.id].p1,scores[org.id].p2):null;
            const lv=sc?getLevel(sc.total):null;
            const pct=completion(org.id);
            const isSeed=SEEDS.some(s=>s.id===org.id);
            return(
              <div key={org.id}
                style={{background:sc?lv.bg:"#fff",border:`2px solid ${sc?lv.color+"55":"#E0EAF4"}`,borderRadius:14,padding:"14px",position:"relative",boxShadow:"0 2px 8px rgba(0,0,0,0.04)",transition:"transform 0.15s,box-shadow 0.15s"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 6px 16px rgba(0,0,0,0.1)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.04)";}}>
                {!isSeed&&<button onClick={()=>removeOrg(org.id)}
                  style={{position:"absolute",top:7,left:7,background:"none",border:"none",color:"#CCC",cursor:"pointer",fontSize:13,padding:"1px 5px",lineHeight:1}}
                  onMouseEnter={e=>e.target.style.color="#E65100"} onMouseLeave={e=>e.target.style.color="#CCC"}>✕</button>}
                <div style={{fontSize:28,marginBottom:4}}>{org.flag}</div>
                <div style={{fontWeight:700,fontSize:13,color:"#0D2B52",marginBottom:1}}>{org.name}</div>
                {org.country&&<div style={{fontSize:9,color:"#999",marginBottom:6}}>{org.country}</div>}
                <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:7}}>
                  <div style={{flex:1,height:3,background:"#E8EDF2",borderRadius:99,overflow:"hidden"}}>
                    <div style={{width:`${pct}%`,height:"100%",background:pct===100?"#1E8B4C":"#1A5F9E",borderRadius:99,transition:"width 0.5s"}}/>
                  </div>
                  <span style={{fontSize:9,color:"#999",minWidth:24}}>{pct}%</span>
                </div>
                {sc?(
                  <>
                    <div style={{fontWeight:900,fontSize:30,color:lv.color,lineHeight:1}}>{sc.total}</div>
                    <div style={{fontSize:10,color:lv.color,fontWeight:600,marginBottom:5}}>{lv.label}</div>
                    <div style={{display:"flex",gap:10,marginBottom:6}}>
                      {[["E",sc.E,"#1E8B4C"],["S",sc.S,"#C86010"],["G",sc.G,"#5A3090"]].map(([k,v,c])=>(
                        <div key={k} style={{textAlign:"center"}}>
                          <div style={{fontWeight:700,fontSize:12,color:c}}>{v}</div>
                          <div style={{fontSize:8,color:"#BBB"}}>{k}</div>
                        </div>
                      ))}
                    </div>
                  </>
                ):(
                  <div style={{fontSize:10,color:"#BBB",marginBottom:8}}>لم يُقيَّم بعد</div>
                )}
                <button onClick={()=>{setAid(org.id);setPhase(1);setIid(1);setView("eval");}}
                  style={{width:"100%",background:sc?"rgba(0,0,0,0.07)":"linear-gradient(135deg,#1A5F9E,#0095C5)",color:sc?"#333":"#fff",border:"none",borderRadius:8,padding:"8px",fontSize:11,fontWeight:600,cursor:"pointer"}}>
                  {sc?`${pct===100?"✅ مراجعة":"✏️ استكمال"} التقييم`:"▶️ بدء التقييم"}
                </button>
              </div>
            );
          })}
        </div>

        {sorted.length>=2&&(
          <button onClick={()=>setView("compare")}
            style={{width:"100%",background:"linear-gradient(135deg,#0D2B52,#1A5F9E)",color:"#fff",border:"none",borderRadius:13,padding:"15px",fontSize:15,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 12px rgba(13,43,82,0.3)"}}>
            📊 عرض لوحة المقارنة الشاملة ({evaluated.length} جهات مُقيَّمة)
          </button>
        )}

        <div style={{marginTop:12,padding:"10px 0",borderTop:"1px solid #E0EAF4",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:9,color:"#BBB"}}>GRI 1:2021 • AA1000AP • ISSA 5000 • Materiality-Driven Weighting</div>
          <div style={{fontSize:9,color:"#BBB"}}>الهيئة السعودية للمياه — منهجية SWA v2</div>
        </div>
      </div>
    </div>
  );
}
