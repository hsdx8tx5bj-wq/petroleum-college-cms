import { useMemo, useState } from "react";
import { announcements as staticAnnouncements, departments as staticDepartments } from "@/content-data";
import { ArrowLeft, ArrowUpRight, Bell, BookOpen, Building2, Car, Check, Crosshair, FileText, Gauge, GraduationCap, HardHat, Info, Landmark, MapPin, Menu, Minus, Navigation, Plus, Radio, Settings2, ShieldCheck, Sparkles, X } from "lucide-react";

type AreaKey = "main" | "deanery" | "garden" | "parking";
type DepartmentKey = "control" | "refining";

const departmentFallback = {
  control: {
    key: "control" as const,
    name: "قسم هندسة سيطرة المنظومات النفطية",
    intro: "يختص بعمليات السيطرة المركزية وإدارة المنشآت النفطية، ويجمع بين القياس والأتمتة والحاسوب والعمليات الصناعية.",
    focus: "أنظمة السيطرة الخطية والرقمية، المتحكمات الدقيقة، PLC، معالجة الإشارة، السيطرة النفطية والتكيفية، وتشخيص الأعطال.",
    courses: "الإلكترونيات، مقدمة في السيطرة، السيطرة الخطية والرقمية، المعالجات الدقيقة، PLC، السيطرة النفطية، السيطرة التكيفية.",
    studentCount: "يُحدّث سنويًا",
    morningCutoff: "يُحدّث سنويًا",
    eveningCutoff: "يُحدّث سنويًا",
  },
  refining: {
    key: "refining" as const,
    name: "قسم هندسة تكرير النفط والغاز",
    intro: "يختص بمعالجة وتكرير النفط الخام والمنتجات النفطية، ويرتبط بالصناعات البتروكيمياوية وتكنولوجيا الغاز.",
    focus: "عمليات الفصل والتحويل، الديناميكا الحرارية، انتقال الحرارة والمادة، تصميم المفاعلات والمعدات، السيطرة على العمليات.",
    courses: "خواص النفط والغاز، جريان الموائع، تكرير النفط، البتروكيمياويات، تصميم المفاعلات، انتقال الحرارة والمادة، تكنولوجيا الغاز.",
    studentCount: "يُحدّث سنويًا",
    morningCutoff: "يُحدّث سنويًا",
    eveningCutoff: "يُحدّث سنويًا",
  },
};

const officialFacebook = "https://www.facebook.com/61552557681412/";
const officialCollege = "https://cpme.tu.edu.iq/index.php/ar/";

const announcementsFallback = [
  { id: 1, title: "أهلاً بكم في البوابة التفاعلية للكلية", body: "تعرّف على أقسام الكلية وخدماتها من خلال الخريطة التفاعلية.", dateLabel: "جديد", category: "ترحيب" },
  { id: 2, title: "تحديث بيانات القبول والطلبة", body: "يتم تحديث الأعداد ومعدلات القبول عند صدور البيانات الرسمية من الجامعة.", dateLabel: "مهم", category: "تنبيه" },
  { id: 3, title: "زيارة علمية إلى مصفى بيجي", body: "نشاطات علمية تربط المحاضرات بالواقع العملي في غرف السيطرة ووحدات التكرير.", dateLabel: "نشاط", category: "خبر" },
];

function SectionTitle({ eyebrow, title, light = false }: { eyebrow: string; title: string; light?: boolean }) {
  return <div className={`section-title ${light ? "light" : ""}`}><span>{eyebrow}</span><h2>{title}</h2></div>;
}

function IsometricMap({ activeArea, onArea }: { activeArea: AreaKey; onArea: (area: AreaKey) => void }) {
  return <div className="map-stage">
    <div className="map-toolbar"><div className="map-mode"><span className="live-dot" /> الخريطة التفاعلية <small>عرض مبسط مطابق للتوزيع الحقيقي</small></div><div className="map-actions"><button aria-label="تكبير"><Plus size={16}/></button><button aria-label="تصغير"><Minus size={16}/></button><button aria-label="اتجاه الشمال"><Navigation size={16}/></button></div></div>
    <div className="map-hint"><Crosshair size={15}/> حرّك المؤشر واضغط على المباني لاكتشاف المعلومات</div>
    <div className="map-compass"><span>N</span><div className="compass-ring"><Navigation size={22}/></div><small>موقع الكلية</small></div>
    <div className="satellite-grid" />
    <div className="field field-top" /><div className="field field-bottom" />
    <button className={`map-zone main-building ${activeArea === "main" ? "selected" : ""}`} onClick={() => onArea("main")}><div className="roof"><span /><span /><span /></div><div className="building-label"><BookOpen size={15}/> البناية الرئيسية <small>القاعات + القسمين</small></div></button>
    <button className={`map-zone deanery-building ${activeArea === "deanery" ? "selected" : ""}`} onClick={() => onArea("deanery")}><div className="roof-deanery"><Landmark size={32}/></div><div className="building-label"><Landmark size={15}/> العمادة <small>الإدارة والخدمات</small></div></button>
    <button className={`map-zone garden-zone ${activeArea === "garden" ? "selected" : ""}`} onClick={() => onArea("garden")}><div className="garden-path path-one"/><div className="garden-path path-two"/><span className="tree t1"/><span className="tree t2"/><span className="tree t3"/><span className="tree t4"/><span className="tree t5"/><div className="garden-label"><Sparkles size={14}/> الحديقة الوسطية <small>بدون بناية</small></div></button>
    <button className={`map-zone parking-zone ${activeArea === "parking" ? "selected" : ""}`} onClick={() => onArea("parking")}><div className="parking-lines" /> <Car size={17}/><span>كراج ومواقف السيارات</span></button>
    <div className="front-road"><span>الطريق الرئيسي أمام الكلية</span></div>
    <div className="map-legend"><span><i className="legend-building"/> مبنى</span><span><i className="legend-garden"/> حديقة</span><span><i className="legend-parking"/> كراج</span></div>
  </div>;
}

function DepartmentCard({ department, onOpen, accent }: { department: any; onOpen: () => void; accent: "blue" | "gold" }) {
  return <button className={`dept-card ${accent}`} onClick={onOpen}><div className="dept-icon">{accent === "blue" ? <Gauge size={21}/> : <HardHat size={21}/>}</div><div><small>قسم علمي</small><h3>{department.name.replace("قسم هندسة ", "")}</h3><p>{department.intro}</p></div><ArrowUpRight className="dept-arrow" size={18}/></button>;
}

function DetailsPanel({ area, onClose, departments, openDepartment }: { area: AreaKey; onClose: () => void; departments: ReadonlyArray<any>; openDepartment: (key: DepartmentKey) => void }) {
  const data = { main: { icon: <Building2 />, title: "البناية الرئيسية", text: "تضم القاعات الدراسية وقسمي هندسة التكرير والسيطرة في مبنى واحد.", action: "استكشف القسمين" }, deanery: { icon: <Landmark />, title: "العمادة", text: "الإدارة والخدمات الأكاديمية لكلية هندسة العمليات النفطية.", action: "معلومات العمادة" }, garden: { icon: <Sparkles />, title: "الحديقة الوسطية", text: "ساحة وحدائق داخلية تربط مباني الكلية. لا توجد بناية في المنطقة الوسطية.", action: "معلومة المكان" }, parking: { icon: <Car />, title: "كراج ومواقف السيارات", text: "مواقف السيارات في الواجهة الأمامية للكلية قرب الطريق الرئيسي.", action: "معلومة المكان" } }[area];
  return <aside className="details-panel"><button className="panel-close" onClick={onClose}><X size={18}/></button><div className="panel-icon">{data.icon}</div><small className="kicker">موقع على الخريطة</small><h3>{data.title}</h3><p>{data.text}</p>{area === "main" ? <div className="panel-depts"><DepartmentCard department={departments.find(d => d.key === "control") ?? departmentFallback.control} accent="blue" onOpen={() => openDepartment("control")}/><DepartmentCard department={departments.find(d => d.key === "refining") ?? departmentFallback.refining} accent="gold" onOpen={() => openDepartment("refining")}/></div> : <div className="panel-note"><Check size={16}/> مثبت حسب توزيع الكلية في الصورة الجوية</div>}<div className="panel-coordinates"><MapPin size={15}/> 34.67653° شمالًا، 43.64038° شرقًا</div></aside>;
}

function DepartmentModal({ department, onClose }: { department: any; onClose: () => void }) {
  const isControl = department.key === "control";
  return <div className="modal-backdrop" onClick={onClose}><div className="department-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={onClose}><X /></button><div className={`modal-hero ${isControl ? "control" : "refining"}`}><div className="modal-icon">{isControl ? <Gauge size={30}/> : <HardHat size={30}/>}</div><div><small>قسم علمي · كلية هندسة العمليات النفطية</small><h2>{department.name}</h2><p>{isControl ? "أتمتة وقياس وإدارة المنشآت النفطية" : "تكرير النفط الخام والغاز والصناعات البتروكيمياوية"}</p></div></div><div className="modal-body"><div className="stat-row"><div><span>سنوات الدراسة</span><strong>4 سنوات</strong></div><div><span>نمط الدراسة</span><strong>صباحية ومسائية</strong></div><div><span>عدد الطلبة</span><strong>{department.studentCount}</strong></div></div><div className="modal-grid"><section><h4><Info size={16}/> نبذة عن القسم</h4><p>{department.intro}</p><h4><BookOpen size={16}/> ماذا يدرس الطالب؟</h4><p>{department.focus}</p></section><section><h4><GraduationCap size={16}/> المقررات والمحاور</h4><p>{department.courses}</p><h4><ShieldCheck size={16}/> القبول</h4><div className="admission-box"><p><b>الصباحية:</b> {department.morningCutoff}</p><p><b>المسائية:</b> {department.eveningCutoff}</p><small>تتغير معدلات القبول سنويًا حسب البيانات الرسمية الصادرة من الجامعة.</small></div></section></div><div className="career-strip"><div><Radio size={18}/><b>الآفاق المهنية</b></div><p>{isControl ? "أنظمة السيطرة والقياس والأتمتة، PLC، غرف السيطرة، وتشخيص أعطال العمليات الصناعية." : "تشغيل وحدات المصافي، هندسة العمليات والتصميم، تكنولوجيا الغاز، الجودة، التلوث والسيطرة على العمليات."}</p></div><div className="source-note"><FileText size={15}/> مصدر عام: صفحات كلية هندسة العمليات النفطية الرسمية ووثائق الوصف الأكاديمي · <a href="https://cpme.tu.edu.iq/index.php/ar/" target="_blank" rel="noreferrer">فتح المصدر</a></div></div></div></div>;
}

export default function Home() {
  const [activeArea, setActiveArea] = useState<AreaKey>("main");
  const [activeDepartment, setActiveDepartment] = useState<DepartmentKey | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const departments = staticDepartments;
  const announcements = staticAnnouncements;
  const activeDetails = useMemo(() => ({ main: "الخريطة والمباني", deanery: "العمادة", garden: "الحديقة الوسطية", parking: "الكراج والمواقف" }[activeArea]), [activeArea]);
  return <div className="site-shell" dir="rtl"><header className="topbar"><a className="brand" href="#home"><span className="brand-mark">CP</span><span><b>كلية هندسة العمليات النفطية</b><small>جامعة تكريت · بوابة الكلية</small></span></a><nav className={menuOpen ? "open" : ""}><a href="#home">الرئيسية</a><a href="#map">الخريطة الحقيقية</a><a href="#departments">الأقسام</a><a href={officialFacebook} target="_blank" rel="noreferrer">أخبار الكلية</a></nav><button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}><Menu /></button></header><main id="home"><section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="pulse"/> بوابة تعريفية تفاعلية · جامعة تكريت</div><h1>كلية هندسة العمليات النفطية<br/><em>من الخريطة إلى المعرفة</em></h1><p>استكشف مباني الكلية، تعرّف على قسمي التكرير والسيطرة، واطّلع على أحدث الإعلانات والمعلومات الأكاديمية من مكان واحد.</p><div className="hero-actions"><a href="#map" className="primary-btn">استكشف الخريطة <ArrowLeft size={17}/></a><a href="#departments" className="text-btn">تصفح الأقسام <ChevronLeft size={17}/></a></div><div className="hero-facts"><span><MapPin size={16}/> تكريت · صلاح الدين</span><span><Building2 size={16}/> مبنيان رئيسيان</span><span><Settings2 size={16}/> محتوى قابل للتحديث</span></div></div><div className="hero-orbit"><div className="orbit-ring ring-one"/><div className="orbit-ring ring-two"/><div className="orbit-center"><span>34.67653°</span><b>43.64038°</b><small>موقع الكلية</small></div><div className="orbit-tag tag-main"><Building2 size={16}/> البناية الرئيسية</div><div className="orbit-tag tag-dean"><Landmark size={16}/> العمادة</div><div className="orbit-tag tag-park"><Car size={16}/> الكراج</div></div></section><section id="map" className="map-section"><div className="section-head"><SectionTitle eyebrow="01 · استكشف المكان" title="الخريطة التفاعلية للكلية"/><div className="location-pill"><Navigation size={14}/> 34.67653, 43.64038 <span>·</span> صورة جوية مرجعية</div></div><div className="map-layout"><IsometricMap activeArea={activeArea} onArea={setActiveArea}/><DetailsPanel area={activeArea} onClose={() => setActiveArea("main")} departments={departments} openDepartment={setActiveDepartment}/></div><div className="map-caption"><div><Info size={16}/><span><b>{activeDetails}</b> · اضغط على أي منطقة لعرض تفاصيلها</span></div><span className="map-note">التوزيع مبسّط ومطابق للمعلومات التي زوّدنا بها صاحب الموقع</span></div></section><section id="departments" className="departments-section"><div className="section-head"><SectionTitle eyebrow="02 · الأقسام العلمية" title="القسمان داخل البناية الرئيسية"/><p>عند الضغط على أي قسم تظهر معلوماته، مواده، عدد الطلبة ومعدلات القبول.</p></div><div className="department-grid">{departments.map((department: any) => <DepartmentCard key={department.key} department={department} accent={department.key === "control" ? "blue" : "gold"} onOpen={() => setActiveDepartment(department.key)}/>)}</div><div className="departments-foot"><span><Check size={15}/> القاعات الدراسية جزء من البناية الرئيسية نفسها</span><span><Check size={15}/> بيانات القبول قابلة للتحديث سنويًا</span><span><Check size={15}/> كل المعلومات مرتبطة بالمصادر الرسمية</span></div></section><section id="announcements" className="announcements-section"><div className="section-head"><SectionTitle eyebrow="03 · آخر المستجدات" title="إعلانات وأخبار الكلية"/></div><div className="announcement-grid">{announcements.map((post: any, index: number) => <article className="announcement-card" key={post.id}>{post.image && <img src={post.image} alt={post.title} className="announcement-image" />}<div className={`announcement-icon a${index % 3}`}><Bell size={18}/></div><div className="announcement-meta"><span>{post.category}</span><small>{post.dateLabel}</small></div><h3>{post.title}</h3><p>{post.body}</p><a href={officialFacebook} target="_blank" rel="noreferrer">قراءة الأخبار على فيسبوك <ArrowUpRight size={14}/></a></article>)}</div></section><section className="source-section"><div><span className="eyebrow">الموقع · التوثيق · التحكم</span><h2>واجهة واحدة تعرفك بالكلية وتبقى تحت إدارتك.</h2><p>المحتوى التعريفي مبني على صفحات كلية هندسة العمليات النفطية في جامعة تكريت، وتبقى الأرقام المتغيرة مثل عدد الطلبة ومعدل القبول بيدك لتحديثها عند صدور كل سنة دراسية.</p></div><div className="credit-links"><span>إعداد بواسطة <b>مصطفى أكرم محمود</b></span><span>بالتعاون مع <b>c4lb</b></span><div><a className="primary-btn" href={officialCollege} target="_blank" rel="noreferrer">موقع الكلية <ArrowUpRight size={17}/></a><a className="outline-btn" href={officialFacebook} target="_blank" rel="noreferrer">صفحة فيسبوك الكلية <ArrowUpRight size={16}/></a></div></div></section></main><footer><div className="brand"><span className="brand-mark">CP</span><span><b>كلية هندسة العمليات النفطية</b><small>جامعة تكريت</small></span></div><span>الإحداثيات: 34.67653° ش · 43.64038° ق</span><span>إعداد: مصطفى أكرم محمود · بالتعاون مع c4lb</span><span>© 2026 بوابة الكلية التفاعلية</span></footer>{activeDepartment && <DepartmentModal department={departments.find((d: any) => d.key === activeDepartment) ?? departmentFallback[activeDepartment]} onClose={() => setActiveDepartment(null)}/>}</div>;
}
