export interface NavMessages {
  home: string
  about: string
}

export interface WelcomeMessages {
  subtitle: string
  open: string
  newDrawing: string
  recent: string
  noRecent: string
  noRecentHint: string
  clearRecent: string
  more: string
  remove: string
  copyPath: string
  copied: string
}

export interface AboutMessages {
  pageTitle: string
  tagline: string
  description: string
  badgeOpenSource: string
  badgeBrowserNative: string
  badgeDataSafe: string
  advantages: string
  advantageNoServer: string
  advantageNoServerDesc: string
  advantageLocalData: string
  advantageLocalDataDesc: string
  advantageReady: string
  advantageReadyDesc: string
  ecosystem: string
  productViewer: string
  productViewerDesc: string
  productEditor: string
  productEditorDesc: string
  productSdk: string
  productSdkDesc: string
  productEngine: string
  productEngineDesc: string
  website: string
  docs: string
  github: string
  copyright: string
}

export interface MenuMessages {
  file: string
  open: string
  newDrawing: string
  closeDrawing: string
  openRecent: string
  noRecent: string
  clearRecent: string
  view: string
  reload: string
  fullscreen: string
  help: string
  homepage: string
  guide: string
  about: string
}

export interface DialogMessages {
  cadDrawings: string
  loadViewerFailed: string
  unsupportedFileType: string
  openFailed: string
  aboutDescription: string
  aboutDwg: string
}

export interface SidebarMessages {
  hide: string
  show: string
}

export interface HostMessages {
  language: string
  footTagline: string
  sidebar: SidebarMessages
  nav: NavMessages
  welcome: WelcomeMessages
  about: AboutMessages
  preparing: string
  menu: MenuMessages
  dialog: DialogMessages
}

export type AppLocale = 'en' | 'zh' | 'ja' | 'ko' | 'tr' | 'cs' | 'ar'

/** Native language names, aligned with cad-viewer's LOCALE_OPTIONS. */
export const LOCALE_OPTIONS: ReadonlyArray<{
  locale: AppLocale
  label: string
}> = [
  { locale: 'en', label: 'English' },
  { locale: 'zh', label: '简体中文' },
  { locale: 'ja', label: '日本語' },
  { locale: 'ko', label: '한국어' },
  { locale: 'tr', label: 'Türkçe' },
  { locale: 'cs', label: 'Čeština' },
  { locale: 'ar', label: 'العربية' }
]

const en: HostMessages = {
  language: 'Language',
  footTagline: 'Built for CAD Developers',
  sidebar: {
    hide: 'Hide sidebar',
    show: 'Show sidebar'
  },
  nav: {
    home: 'Home',
    about: 'About'
  },
  welcome: {
    subtitle: 'Open a DWG or DXF drawing and start efficient CAD work',
    open: 'Open Drawing…',
    newDrawing: 'New Drawing',
    recent: 'Recent',
    noRecent: 'No recent drawings',
    noRecentHint: 'Drawings you open will appear here.',
    clearRecent: 'Clear',
    more: 'More actions',
    remove: 'Remove from list',
    copyPath: 'Copy path',
    copied: 'Copied'
  },
  about: {
    pageTitle: 'About MLightCAD Studio',
    tagline: 'Web CAD Infrastructure for DWG & DXF',
    description: 'An open CAD platform for developers and professionals.',
    badgeOpenSource: 'OPEN SOURCE',
    badgeBrowserNative: 'BROWSER-NATIVE',
    badgeDataSafe: 'DATA SAFE',
    advantages: 'Highlights',
    advantageNoServer: 'No CAD server',
    advantageNoServerDesc: 'DWG/DXF is parsed and rendered locally.',
    advantageLocalData: 'Drawings stay on-device',
    advantageLocalDataDesc: 'Nothing is uploaded — design data stays private.',
    advantageReady: 'Ready out of the box',
    advantageReadyDesc: 'No extra CAD software to install.',
    ecosystem: 'Product ecosystem',
    productViewer: 'CAD Viewer',
    productViewerDesc: 'View and review',
    productEditor: 'CAD Editor',
    productEditorDesc: 'Edit in the browser',
    productSdk: 'CAD SDK',
    productSdkDesc: 'Embed into your product',
    productEngine: 'DWG Engine',
    productEngineDesc: 'Commercial-grade DWG engine',
    website: 'Website',
    docs: 'Documentation',
    github: 'GitHub',
    copyright: '© MLightCAD · Built for CAD developers'
  },
  preparing: 'Preparing viewer…',
  menu: {
    file: 'File',
    open: 'Open…',
    newDrawing: 'New Drawing',
    closeDrawing: 'Close Drawing',
    openRecent: 'Open Recent',
    noRecent: 'No Recent Drawings',
    clearRecent: 'Clear Recent Drawings',
    view: 'View',
    reload: 'Reload',
    fullscreen: 'Toggle Fullscreen',
    help: 'Help',
    homepage: 'Project Homepage',
    guide: 'User Guide',
    about: 'About'
  },
  dialog: {
    cadDrawings: 'CAD Drawings',
    loadViewerFailed: 'Failed to load the CAD viewer module.',
    unsupportedFileType: 'Unsupported file type:',
    openFailed: 'Failed to open drawing:',
    aboutDescription:
      'Desktop edition of MLightCAD — a fully offline DWG/DXF viewer and editor powered by a browser rendering engine.',
    aboutDwg: 'DWG support is provided by LibreDWG (GPL).'
  }
}

const zh: HostMessages = {
  language: '语言',
  footTagline: '为 CAD 开发者而生',
  sidebar: {
    hide: '隐藏侧边栏',
    show: '显示侧边栏'
  },
  nav: {
    home: '首页',
    about: '关于'
  },
  welcome: {
    subtitle: '打开 DWG 或 DXF 图纸，开始高效的 CAD 工作',
    open: '打开图纸…',
    newDrawing: '新建图纸',
    recent: '最近打开',
    noRecent: '暂无最近打开的图纸',
    noRecentHint: '打开图纸后，将显示在这里。',
    clearRecent: '清空记录',
    more: '更多操作',
    remove: '从列表中移除',
    copyPath: '复制路径',
    copied: '已复制'
  },
  about: {
    pageTitle: '关于 MLightCAD Studio',
    tagline: '面向 DWG 与 DXF 的 Web CAD 基础设施',
    description: '面向开发者与专业用户的开放式 CAD 技术平台',
    badgeOpenSource: '开源',
    badgeBrowserNative: '浏览器原生',
    badgeDataSafe: '数据安全',
    advantages: '核心优势',
    advantageNoServer: '无需 CAD 服务器',
    advantageNoServerDesc: 'DWG/DXF 在本地解析与渲染',
    advantageLocalData: '图纸数据留在本机',
    advantageLocalDataDesc: '无需上传，保护设计数据',
    advantageReady: '开箱即用',
    advantageReadyDesc: '无需安装额外 CAD 软件',
    ecosystem: '产品生态',
    productViewer: 'CAD Viewer',
    productViewerDesc: '浏览与审阅',
    productEditor: 'CAD Editor',
    productEditorDesc: '在线编辑',
    productSdk: 'CAD SDK',
    productSdkDesc: '集成到自己的产品',
    productEngine: 'DWG Engine',
    productEngineDesc: '商业级 DWG 引擎',
    website: '官方网站',
    docs: '文档中心',
    github: 'GitHub',
    copyright: '© MLightCAD · 为 CAD 开发者而生'
  },
  preparing: '正在准备查看器…',
  menu: {
    file: '文件',
    open: '打开…',
    newDrawing: '新建图纸',
    closeDrawing: '关闭图纸',
    openRecent: '打开最近文件',
    noRecent: '没有最近打开的图纸',
    clearRecent: '清空最近打开',
    view: '视图',
    reload: '重新加载',
    fullscreen: '切换全屏',
    help: '帮助',
    homepage: '项目主页',
    guide: '用户指南',
    about: '关于'
  },
  dialog: {
    cadDrawings: 'CAD 图纸',
    loadViewerFailed: '无法加载 CAD 查看器模块。',
    unsupportedFileType: '不支持的文件类型：',
    openFailed: '无法打开图纸：',
    aboutDescription:
      'MLightCAD 桌面版——基于浏览器渲染引擎、完全离线运行的 DWG/DXF 查看与编辑工具。',
    aboutDwg: 'DWG 支持由 LibreDWG（GPL）提供。'
  }
}

const ja: HostMessages = {
  language: '言語',
  footTagline: '高速 · 高機能 · オープン',
  sidebar: {
    hide: 'サイドバーを隠す',
    show: 'サイドバーを表示'
  },
  nav: {
    home: 'ホーム',
    about: '概要'
  },
  welcome: {
    subtitle: 'DWG または DXF 図面を開いて、効率的な CAD 作業を始めましょう',
    open: '図面を開く…',
    newDrawing: '新規図面',
    recent: '最近開いた図面',
    noRecent: '最近開いた図面はありません',
    noRecentHint: '開いた図面がここに表示されます。',
    clearRecent: 'クリア',
    more: 'その他の操作',
    remove: 'リストから削除',
    copyPath: 'パスをコピー',
    copied: 'コピーしました'
  },
  about: {
    pageTitle: 'MLightCAD Studio について',
    tagline: 'DWG・DXF のための Web CAD 基盤',
    description: '開発者とプロフェッショナルのためのオープンな CAD プラットフォームです。',
    badgeOpenSource: 'オープンソース',
    badgeBrowserNative: 'ブラウザネイティブ',
    badgeDataSafe: 'データ安全',
    advantages: '主な特長',
    advantageNoServer: 'CAD サーバー不要',
    advantageNoServerDesc: 'DWG/DXF はローカルで解析・描画されます。',
    advantageLocalData: '図面はデバイス内に保持',
    advantageLocalDataDesc: 'アップロードは不要 — 設計データは保護されます。',
    advantageReady: 'すぐに使える',
    advantageReadyDesc: '追加の CAD ソフトウェアは不要です。',
    ecosystem: '製品エコシステム',
    productViewer: 'CAD Viewer',
    productViewerDesc: '表示とレビュー',
    productEditor: 'CAD Editor',
    productEditorDesc: 'ブラウザで編集',
    productSdk: 'CAD SDK',
    productSdkDesc: '自社製品に組み込み',
    productEngine: 'DWG Engine',
    productEngineDesc: '商用グレードの DWG エンジン',
    website: '公式サイト',
    docs: 'ドキュメント',
    github: 'GitHub',
    copyright: '© MLightCAD · CAD 開発者のために'
  },
  preparing: 'ビューアを準備しています…',
  menu: {
    file: 'ファイル',
    open: '開く…',
    newDrawing: '新規図面',
    closeDrawing: '図面を閉じる',
    openRecent: '最近使ったファイルを開く',
    noRecent: '最近の図面はありません',
    clearRecent: '最近の図面を消去',
    view: '表示',
    reload: '再読み込み',
    fullscreen: '全画面表示の切り替え',
    help: 'ヘルプ',
    homepage: 'プロジェクトのホームページ',
    guide: 'ユーザーガイド',
    about: '概要'
  },
  dialog: {
    cadDrawings: 'CAD 図面',
    loadViewerFailed: 'CAD ビューアモジュールを読み込めませんでした。',
    unsupportedFileType: 'サポートされていないファイル形式：',
    openFailed: '図面を開けませんでした：',
    aboutDescription:
      'MLightCAD のデスクトップ版 — ブラウザの描画エンジンを採用した、完全オフラインの DWG/DXF ビューア兼エディタです。',
    aboutDwg: 'DWG のサポートは LibreDWG（GPL）により提供されています。'
  }
}

const ko: HostMessages = {
  language: '언어',
  footTagline: '빠름 · 강력 · 개방',
  sidebar: {
    hide: '사이드바 숨기기',
    show: '사이드바 표시'
  },
  nav: {
    home: '홈',
    about: '정보'
  },
  welcome: {
    subtitle: 'DWG 또는 DXF 도면을 열고 효율적인 CAD 작업을 시작하세요',
    open: '도면 열기…',
    newDrawing: '새 도면',
    recent: '최근 도면',
    noRecent: '최근에 연 도면이 없습니다',
    noRecentHint: '연 도면이 여기에 표시됩니다.',
    clearRecent: '지우기',
    more: '추가 작업',
    remove: '목록에서 제거',
    copyPath: '경로 복사',
    copied: '복사됨'
  },
  about: {
    pageTitle: 'MLightCAD Studio 정보',
    tagline: 'DWG 및 DXF를 위한 웹 CAD 인프라',
    description: '개발자와 전문가를 위한 개방형 CAD 플랫폼입니다.',
    badgeOpenSource: '오픈 소스',
    badgeBrowserNative: '브라우저 네이티브',
    badgeDataSafe: '데이터 보호',
    advantages: '주요 특징',
    advantageNoServer: 'CAD 서버 불필요',
    advantageNoServerDesc: 'DWG/DXF를 로컬에서 해석하고 렌더링합니다.',
    advantageLocalData: '도면은 기기에 보관됩니다',
    advantageLocalDataDesc: '업로드가 없으므로 설계 데이터가 안전하게 보호됩니다.',
    advantageReady: '바로 사용 가능',
    advantageReadyDesc: '추가 CAD 소프트웨어를 설치할 필요가 없습니다.',
    ecosystem: '제품 생태계',
    productViewer: 'CAD Viewer',
    productViewerDesc: '보기 및 검토',
    productEditor: 'CAD Editor',
    productEditorDesc: '브라우저에서 편집',
    productSdk: 'CAD SDK',
    productSdkDesc: '제품에 통합',
    productEngine: 'DWG Engine',
    productEngineDesc: '상용급 DWG 엔진',
    website: '공식 웹사이트',
    docs: '문서',
    github: 'GitHub',
    copyright: '© MLightCAD · CAD 개발자를 위해'
  },
  preparing: '뷰어를 준비하는 중…',
  menu: {
    file: '파일',
    open: '열기…',
    newDrawing: '새 도면',
    closeDrawing: '도면 닫기',
    openRecent: '최근 파일 열기',
    noRecent: '최근 도면 없음',
    clearRecent: '최근 도면 지우기',
    view: '보기',
    reload: '새로 고침',
    fullscreen: '전체 화면 전환',
    help: '도움말',
    homepage: '프로젝트 홈페이지',
    guide: '사용자 가이드',
    about: '정보'
  },
  dialog: {
    cadDrawings: 'CAD 도면',
    loadViewerFailed: 'CAD 뷰어 모듈을 불러오지 못했습니다.',
    unsupportedFileType: '지원하지 않는 파일 형식:',
    openFailed: '도면을 열지 못했습니다:',
    aboutDescription:
      'MLightCAD 데스크톱 에디션 — 브라우저 렌더링 엔진으로 구동되는 완전 오프라인 DWG/DXF 뷰어 및 편집기입니다.',
    aboutDwg: 'DWG 지원은 LibreDWG(GPL)에서 제공됩니다.'
  }
}

const tr: HostMessages = {
  language: 'Dil',
  footTagline: 'Hızlı · Güçlü · Açık',
  sidebar: {
    hide: 'Kenar çubuğunu gizle',
    show: 'Kenar çubuğunu göster'
  },
  nav: {
    home: 'Ana Sayfa',
    about: 'Hakkında'
  },
  welcome: {
    subtitle: 'Bir DWG veya DXF çizimi açın, verimli CAD çalışmaya başlayın',
    open: 'Çizim Aç…',
    newDrawing: 'Yeni Çizim',
    recent: 'Son açılanlar',
    noRecent: 'Son açılan çizim yok',
    noRecentHint: 'Açtığınız çizimler burada görünür.',
    clearRecent: 'Temizle',
    more: 'Diğer işlemler',
    remove: 'Listeden kaldır',
    copyPath: 'Yolu kopyala',
    copied: 'Kopyalandı'
  },
  about: {
    pageTitle: 'MLightCAD Studio Hakkında',
    tagline: 'DWG ve DXF için Web CAD Altyapısı',
    description: 'Geliştiriciler ve profesyoneller için açık bir CAD platformu.',
    badgeOpenSource: 'AÇIK KAYNAK',
    badgeBrowserNative: 'TARAYICI YERELİ',
    badgeDataSafe: 'VERİ GÜVENLİ',
    advantages: 'Öne çıkanlar',
    advantageNoServer: 'CAD sunucusu gerekmez',
    advantageNoServerDesc: 'DWG/DXF yerel olarak ayrıştırılır ve işlenir.',
    advantageLocalData: 'Çizimler cihazınızda kalır',
    advantageLocalDataDesc: 'Hiçbir şey yüklenmez — tasarım verileriniz gizli kalır.',
    advantageReady: 'Kutudan çıkar çıkmaz çalışır',
    advantageReadyDesc: 'Ek CAD yazılımı kurmanıza gerek yok.',
    ecosystem: 'Ürün ekosistemi',
    productViewer: 'CAD Viewer',
    productViewerDesc: 'Görüntüle ve incele',
    productEditor: 'CAD Editor',
    productEditorDesc: 'Tarayıcıda düzenle',
    productSdk: 'CAD SDK',
    productSdkDesc: 'Ürününüze entegre edin',
    productEngine: 'DWG Engine',
    productEngineDesc: 'Ticari sınıf DWG motoru',
    website: 'Web sitesi',
    docs: 'Belgeler',
    github: 'GitHub',
    copyright: '© MLightCAD · CAD geliştiricileri için'
  },
  preparing: 'Görüntüleyici hazırlanıyor…',
  menu: {
    file: 'Dosya',
    open: 'Aç…',
    newDrawing: 'Yeni Çizim',
    closeDrawing: 'Çizimi Kapat',
    openRecent: 'Son Kullanılanları Aç',
    noRecent: 'Son Çizim Yok',
    clearRecent: 'Son Çizimleri Temizle',
    view: 'Görünüm',
    reload: 'Yeniden Yükle',
    fullscreen: 'Tam Ekranı Aç/Kapat',
    help: 'Yardım',
    homepage: 'Proje Ana Sayfası',
    guide: 'Kullanım Kılavuzu',
    about: 'Hakkında'
  },
  dialog: {
    cadDrawings: 'CAD Çizimleri',
    loadViewerFailed: 'CAD görüntüleyici modülü yüklenemedi.',
    unsupportedFileType: 'Desteklenmeyen dosya türü:',
    openFailed: 'Çizim açılamadı:',
    aboutDescription:
      'MLightCAD masaüstü sürümü — tarayıcı işleme motoruyla çalışan, tamamen çevrimdışı DWG/DXF görüntüleyici ve düzenleyici.',
    aboutDwg: 'DWG desteği LibreDWG (GPL) tarafından sağlanır.'
  }
}

const cs: HostMessages = {
  language: 'Jazyk',
  footTagline: 'Rychlý · Výkonný · Otevřený',
  sidebar: {
    hide: 'Skrýt postranní panel',
    show: 'Zobrazit postranní panel'
  },
  nav: {
    home: 'Domů',
    about: 'O aplikaci'
  },
  welcome: {
    subtitle: 'Otevřete výkres DWG nebo DXF a pusťte se do efektivní CAD práce',
    open: 'Otevřít výkres…',
    newDrawing: 'Nový výkres',
    recent: 'Nedávné',
    noRecent: 'Žádné nedávné výkresy',
    noRecentHint: 'Otevřené výkresy se zobrazí zde.',
    clearRecent: 'Vymazat',
    more: 'Další akce',
    remove: 'Odebrat ze seznamu',
    copyPath: 'Kopírovat cestu',
    copied: 'Zkopírováno'
  },
  about: {
    pageTitle: 'O aplikaci MLightCAD Studio',
    tagline: 'Webová CAD infrastruktura pro DWG a DXF',
    description: 'Otevřená CAD platforma pro vývojáře a profesionály.',
    badgeOpenSource: 'OPEN SOURCE',
    badgeBrowserNative: 'NATIVNÍ V PROHLÍŽEČI',
    badgeDataSafe: 'DATA V BEZPEČÍ',
    advantages: 'Přednosti',
    advantageNoServer: 'Bez CAD serveru',
    advantageNoServerDesc: 'DWG/DXF se zpracovává přímo lokálně.',
    advantageLocalData: 'Výkresy zůstávají v zařízení',
    advantageLocalDataDesc: 'Nic se nenahrává — vaše data zůstávají v soukromí.',
    advantageReady: 'Připraveno k použití',
    advantageReadyDesc: 'Není třeba instalovat další CAD software.',
    ecosystem: 'Produktový ekosystém',
    productViewer: 'CAD Viewer',
    productViewerDesc: 'Prohlížení a revize',
    productEditor: 'CAD Editor',
    productEditorDesc: 'Úpravy v prohlížeči',
    productSdk: 'CAD SDK',
    productSdkDesc: 'Vestavte do svého produktu',
    productEngine: 'DWG Engine',
    productEngineDesc: 'Komerční DWG engine',
    website: 'Web',
    docs: 'Dokumentace',
    github: 'GitHub',
    copyright: '© MLightCAD · Pro CAD vývojáře'
  },
  preparing: 'Příprava prohlížeče…',
  menu: {
    file: 'Soubor',
    open: 'Otevřít…',
    newDrawing: 'Nový výkres',
    closeDrawing: 'Zavřít výkres',
    openRecent: 'Otevřít nedávné',
    noRecent: 'Žádné nedávné výkresy',
    clearRecent: 'Vymazat nedávné výkresy',
    view: 'Zobrazení',
    reload: 'Načíst znovu',
    fullscreen: 'Přepnout celou obrazovku',
    help: 'Nápověda',
    homepage: 'Domovská stránka projektu',
    guide: 'Uživatelská příručka',
    about: 'O aplikaci'
  },
  dialog: {
    cadDrawings: 'Výkresy CAD',
    loadViewerFailed: 'Modul prohlížeče CAD se nepodařilo načíst.',
    unsupportedFileType: 'Nepodporovaný typ souboru:',
    openFailed: 'Výkres se nepodařilo otevřít:',
    aboutDescription:
      'Desktopová edice MLightCAD — plně offline prohlížeč a editor DWG/DXF využívající vykreslovací jádro prohlížeče.',
    aboutDwg: 'Podpora DWG je poskytována knihovnou LibreDWG (GPL).'
  }
}

const ar: HostMessages = {
  language: 'اللغة',
  footTagline: 'سريع · قوي · مفتوح',
  sidebar: {
    hide: 'إخفاء الشريط الجانبي',
    show: 'إظهار الشريط الجانبي'
  },
  nav: {
    home: 'الرئيسية',
    about: 'حول'
  },
  welcome: {
    subtitle: 'افتح رسم DWG أو DXF وابدأ عمل CAD بكفاءة',
    open: 'فتح رسم…',
    newDrawing: 'رسم جديد',
    recent: 'فتح مؤخرًا',
    noRecent: 'لا توجد رسومات حديثة',
    noRecentHint: 'ستظهر الرسومات التي تفتحها هنا.',
    clearRecent: 'مسح',
    more: 'مزيد من الإجراءات',
    remove: 'إزالة من القائمة',
    copyPath: 'نسخ المسار',
    copied: 'تم النسخ'
  },
  about: {
    pageTitle: 'حول MLightCAD Studio',
    tagline: 'بنية CAD على الويب لملفات DWG و DXF',
    description: 'منصة CAD مفتوحة للمطورين والمحترفين.',
    badgeOpenSource: 'مفتوح المصدر',
    badgeBrowserNative: 'أصلي في المتصفح',
    badgeDataSafe: 'بيانات آمنة',
    advantages: 'المزايا',
    advantageNoServer: 'بدون خادم CAD',
    advantageNoServerDesc: 'تتم معالجة DWG/DXF محليًا.',
    advantageLocalData: 'تبقى الرسومات على جهازك',
    advantageLocalDataDesc: 'لا يتم رفع أي شيء — تبقى بياناتك خاصة.',
    advantageReady: 'جاهز للاستخدام',
    advantageReadyDesc: 'لا حاجة لتثبيت برامج CAD إضافية.',
    ecosystem: 'منظومة المنتجات',
    productViewer: 'CAD Viewer',
    productViewerDesc: 'عرض ومراجعة',
    productEditor: 'CAD Editor',
    productEditorDesc: 'تحرير داخل المتصفح',
    productSdk: 'CAD SDK',
    productSdkDesc: 'دمجه في منتجك',
    productEngine: 'DWG Engine',
    productEngineDesc: 'محرك DWG تجاري',
    website: 'الموقع',
    docs: 'المستندات',
    github: 'GitHub',
    copyright: '© MLightCAD · صُنع لمطوري CAD'
  },
  preparing: 'جارٍ تجهيز العارض…',
  menu: {
    file: 'ملف',
    open: 'فتح…',
    newDrawing: 'رسم جديد',
    closeDrawing: 'إغلاق الرسم',
    openRecent: 'فتح الأخيرة',
    noRecent: 'لا توجد رسومات حديثة',
    clearRecent: 'مسح الرسومات الأخيرة',
    view: 'عرض',
    reload: 'إعادة تحميل',
    fullscreen: 'تبديل ملء الشاشة',
    help: 'تعليمات',
    homepage: 'الصفحة الرئيسية للمشروع',
    guide: 'دليل المستخدم',
    about: 'حول'
  },
  dialog: {
    cadDrawings: 'رسومات CAD',
    loadViewerFailed: 'تعذر تحميل وحدة عارض CAD.',
    unsupportedFileType: 'نوع ملف غير مدعوم:',
    openFailed: 'تعذر فتح الرسم:',
    aboutDescription:
      'إصدار سطح المكتب من MLightCAD — عارض ومحرر DWG/DXF يعمل دون اتصال بالكامل باستخدام محرك عرض المتصفح.',
    aboutDwg: 'يتم توفير دعم DWG بواسطة LibreDWG (GPL).'
  }
}

export const MESSAGES: Record<AppLocale, HostMessages> = {
  en,
  zh,
  ja,
  ko,
  tr,
  cs,
  ar
}
