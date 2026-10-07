import { type FormEvent, type KeyboardEvent as ReactKeyboardEvent, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useEmblaCarousel from 'embla-carousel-react';
import Fade from 'embla-carousel-fade';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useCreateQuote } from '@workspace/api-client-react';
import type { QuoteInput } from '@workspace/api-client-react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, CircleHelp, Copy, Globe2, Menu, PackageCheck, Search, Ship, ShieldCheck, Truck, X } from 'lucide-react';
import { Link, Route, Switch, useLocation, useParams, Router as WouterRouter } from 'wouter';
import { activeVehicles, businessConfig, destinationCountries, vehicles, type Vehicle } from './data';

const queryClient = new QueryClient();
type Locale = 'en' | 'zh';
const copy = {
  en: {
    home: 'Home', vehicles: 'Vehicles', services: 'Services', markets: 'Markets', showrooms: 'Showrooms', about: 'About', contact: 'Contact',
    quote: 'Get a quote', title: 'Cars beyond borders.', subtitle: 'China-based vehicle sourcing and export, from quotation to delivery.',
    browse: 'Explore vehicles', process: 'See how it works', scroll: 'Scroll to explore', range: 'A considered route from China to your market',
    trust: 'A clear path to your next order', sourcing: 'Vehicle sourcing', docs: 'Export documentation', shipping: 'Loading & shipment', support: 'After-sales support',
    popular: 'A sample of the range', popularTitle: 'Vehicles for export', seeAll: 'View all vehicles', request: 'Request a quote', details: 'View details',
    processTitle: 'From first enquiry to shipment', sixSteps: ['Quote', 'PI & Payment', 'VIN Check', 'Export Docs', 'Port Loading', 'Shipment'],
    approach: 'Built around clarity', why: 'The details that keep orders moving', oneOwner: 'One client, one responsible owner, one visible process.',
    marketsTitle: 'China at the centre. Your market in view.', showroomTitle: 'A local presence, built together',
    ready: 'Have a vehicle in mind?', readyText: 'Tell us what you are sourcing, the quantity and destination. We will prepare a response around your requirements.',
    send: 'Send an enquiry', contactTitle: 'Start a conversation', contactCopy: 'Tell us what you are looking for. Enquiries are saved for review while public follow-up contact details are being confirmed.',
    catalog: 'Vehicles for export', search: 'Search by model or brand', all: 'All', clear: 'Clear all', results: 'models shown', none: 'No vehicles match those filters.',
    ask: 'Can’t find your model? Tell us what you need.', category: 'Category', powertrain: 'Powertrain', brand: 'Brand',
    overview: 'About this model', available: 'Detailed specifications, trims and colors available on request.',
    included: 'Support with every export', vin: 'VIN & color confirmation', document: 'Document support', load: 'Loading coordination', track: 'Shipment tracking',
    servicesTitle: 'Export support, from quotation to delivery.', marketsHeading: 'Routes shaped around your destination.',
    aboutHeading: 'A China-based sourcing and export partner.', showroomHeading: 'Build a showroom partnership.',
    legal: 'This content is a draft and requires review before publication.', back: 'Back to home', by: 'Available for export',
  },
  zh: {
    home: '首页', vehicles: '车辆目录', services: '服务流程', markets: '目标市场', showrooms: '展厅合作', about: '关于我们', contact: '联系我们',
    quote: '获取报价', title: '车通天下。', subtitle: '立足中国的汽车车源及出口服务，从询价到交付。',
    browse: '浏览车型', process: '了解流程', scroll: '向下探索', range: '从中国出发，通往您的市场',
    trust: '清晰透明的采购路径', sourcing: '车辆采购', docs: '出口文件', shipping: '装运协调', support: '售后支持',
    popular: '车型精选', popularTitle: '出口车型', seeAll: '查看全部车型', request: '申请报价', details: '查看详情',
    processTitle: '从初次询价到装运', sixSteps: ['报价', '形式发票与付款', '车架号确认', '出口资料', '港口装车', '装运'],
    approach: '以清晰流程为核心', why: '让订单顺畅推进的细节', oneOwner: '一个客户，一个责任人，一个可追踪流程。',
    marketsTitle: '立足中国，连接您的市场。', showroomTitle: '携手建立本地展示点',
    ready: '已有意向车型？', readyText: '请告诉我们车型、数量和目的地。我们将根据您的需求准备回复。',
    send: '发送询价', contactTitle: '开启沟通', contactCopy: '请告诉我们您的需求。询价会保存供团队查阅，公开联系信息仍在确认中。',
    catalog: '出口车型', search: '搜索车型或品牌', all: '全部', clear: '清除筛选', results: '款车型', none: '没有符合筛选条件的车型。',
    ask: '没有找到想要的车型？告诉我们您的需求。', category: '车型类别', powertrain: '动力类型', brand: '品牌',
    overview: '车型简介', available: '详细规格、配置与颜色可按需咨询。',
    included: '出口服务支持', vin: '车架号与颜色确认', document: '文件支持', load: '装车协调', track: '运输跟进',
    servicesTitle: '从询价到交付的出口支持。', marketsHeading: '根据目的地协调运输路线。',
    aboutHeading: '立足中国的汽车采购与出口伙伴。', showroomHeading: '携手建立展厅合作。',
    legal: '此内容为待审核草稿，发布前需确认。', back: '返回首页', by: '可供出口',
  },
};

const routes = [
  ['/', 'home'], ['/vehicles', 'vehicles'], ['/services', 'services'], ['/markets', 'markets'],
  ['/showrooms', 'showrooms'], ['/about', 'about'], ['/contact', 'contact'],
] as const;

function useLocale() {
  const [locale, setLocale] = useState<Locale>(() => (localStorage.getItem('huivex-locale') === 'zh' ? 'zh' : 'en'));
  const change = (value: Locale) => { setLocale(value); localStorage.setItem('huivex-locale', value); };
  return { locale, t: copy[locale], change };
}

function BrandMark() {
  return <img
    className="brand-mark"
    src="/brand/hag-mark-dark-128.png"
    srcSet="/brand/hag-mark-dark-128.png 128w, /brand/hag-mark-dark.png 256w"
    sizes="40px"
    width={40}
    height={40}
    alt=""
  />;
}

function Header({ locale, t, change }: { locale: Locale; t: typeof copy.en; change: (value: Locale) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);
  useEffect(() => {
    const listener = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', listener, { passive: true }); listener();
    return () => window.removeEventListener('scroll', listener);
  }, []);
  useEffect(() => {
    const previousHtml = document.documentElement.style.overflow;
    const previousBody = document.body.style.overflow;
    document.documentElement.style.overflow = open ? 'hidden' : '';
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = previousHtml;
      document.body.style.overflow = previousBody;
    };
  }, [open]);
  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;
    if (open) {
      root.setAttribute('aria-hidden', 'true');
      root.setAttribute('inert', '');
    } else {
      root.removeAttribute('aria-hidden');
      root.removeAttribute('inert');
    }
    return () => {
      root.removeAttribute('aria-hidden');
      root.removeAttribute('inert');
    };
  }, [open]);
  useEffect(() => {
    if (open) {
      drawerRef.current?.querySelector<HTMLElement>('a,button')?.focus();
      const trap = (event: KeyboardEvent) => {
        if (event.key === 'Escape') { setOpen(false); return; }
        if (event.key !== 'Tab' || !drawerRef.current) return;
        const controls = Array.from(drawerRef.current.querySelectorAll<HTMLElement>('a,button')).filter(el => !el.hasAttribute('disabled'));
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      };
      document.addEventListener('keydown', trap);
      wasOpenRef.current = true;
      return () => document.removeEventListener('keydown', trap);
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false;
      toggleRef.current?.focus();
    }
    return undefined;
  }, [open]);
  useEffect(() => { setOpen(false); }, [location]);
  const drawer = createPortal(
    <>
      {open && <button className="drawer-backdrop" aria-label="Close navigation" tabIndex={-1} aria-hidden="true" onClick={() => setOpen(false)} />}
      <div ref={drawerRef} className={`mobile-drawer ${open ? 'drawer-open' : ''}`} role="dialog" aria-modal="true" aria-label="Site menu" aria-hidden={!open} inert={!open ? true : undefined}>
        <div className="drawer-head">
          <Link href="/" className="brand drawer-brand" aria-label="Huivex Auto Global home"><BrandMark /><span className="brand-label">HUIVEX<small>AUTO GLOBAL, LTD</small></span></Link>
          <button className="menu-toggle drawer-close" aria-label="Close site menu" onClick={() => setOpen(false)}><X /></button>
        </div>
        <div className="drawer-links">{routes.map(([href, key], i) => <Link key={href} href={href} style={{ animationDelay: `${i * 45}ms` }}>{t[key]}<ArrowUpRight size={17} /></Link>)}</div>
        <div className="drawer-foot"><button className="language-btn" onClick={() => change(locale === 'en' ? 'zh' : 'en')}>{locale === 'en' ? '中文' : 'English'} <Globe2 size={16} /></button><Link className="button button-gold" href="/contact">{t.quote}<ArrowRight size={16} /></Link><p>Huivex Auto Global, Ltd. · Xi’an, China</p></div>
      </div>
    </>,
    document.body,
  );
  return <header className={`site-header ${scrolled || location !== '/' ? 'is-solid' : ''}`}>
    <div className="nav-inner wrap">
      <Link href="/" className="brand" aria-label="Huivex Auto Global home"><BrandMark /><span className="brand-label">HUIVEX<small>AUTO GLOBAL, LTD</small></span></Link>
      <nav className="desktop-nav" aria-label="Primary navigation">{routes.map(([href, key]) => <Link key={href} href={href} className={`nav-link ${location === href ? 'active' : ''}`}>{t[key]}</Link>)}</nav>
      <div className="nav-actions">
        <button className="language-btn" onClick={() => change(locale === 'en' ? 'zh' : 'en')} aria-label="Switch language">{locale === 'en' ? '中文' : 'EN'} <ChevronDown size={13} /></button>
        <Link href="/contact" className="button button-gold header-cta">{t.quote}<ArrowUpRight size={15} /></Link>
        <button ref={toggleRef} className="menu-toggle" aria-label={open ? 'Close main navigation' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
    </div>
    {drawer}
  </header>;
}

function Footer({ t, locale }: { t: typeof copy.en; locale: Locale }) {
  return <footer className="footer">
    <div className="wrap footer-main">
      <div className="footer-brand"><img src="/brand/hag-logo-full-dark.png" width={180} height={48} alt="Huivex Auto Global" /><p>{locale === 'en' ? 'Cars Beyond Borders' : '车通天下'}<br />{locale === 'en' ? 'Vehicle sourcing and export from China.' : '立足中国的汽车采购与出口服务。'}</p></div>
      <div className="footer-column"><span className="eyebrow">{locale === 'en' ? 'Explore' : '探索'}</span>{routes.slice(1, 6).map(([href, key]) => <Link key={href} href={href}>{t[key]}</Link>)}</div>
      <div className="footer-column"><span className="eyebrow">{locale === 'en' ? 'Company' : '公司'}</span><Link href="/contact">{t.contact}</Link><Link href="/privacy">{locale === 'en' ? 'Privacy' : '隐私政策'}</Link><Link href="/terms">{locale === 'en' ? 'Terms' : '使用条款'}</Link></div>
      <div className="footer-note"><div className="footer-stamp">HAG <span>·</span> XI’AN</div><p>{locale === 'en' ? 'Trusted vehicle sourcing · Export documentation · Loading & shipment · After-sales support' : '车辆采购 · 出口文件 · 装运协调 · 售后支持'}</p><Link href="/contact" className="text-link">{t.quote}<ArrowUpRight size={15} /></Link></div>
    </div>
    <div className="wrap footer-bottom"><span>© {new Date().getFullYear()} HUIVEX AUTO GLOBAL, LTD</span><span>{locale === 'en' ? 'China-based vehicle sourcing & export' : '立足中国的汽车采购与出口服务'}</span></div>
  </footer>;
}

function PageFrame({ children, locale, t, change }: { children: ReactNode; locale: Locale; t: typeof copy.en; change: (value: Locale) => void }) {
  return <div className="page-shell"><Header locale={locale} t={t} change={change} /><main>{children}</main><Footer t={t} locale={locale} /><QuickActions t={t} /></div>;
}

function QuickActions({ t }: { t: typeof copy.en }) {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const zh = t.home === '首页';
  useEffect(() => {
    const updateKeyboardState = () => {
      const active = document.activeElement;
      const textControl = active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement || active instanceof HTMLSelectElement;
      setKeyboardOpen(window.matchMedia('(max-width: 767px)').matches && textControl);
    };
    const handleFocusOut = () => window.setTimeout(updateKeyboardState, 0);
    document.addEventListener('focusin', updateKeyboardState);
    document.addEventListener('focusout', handleFocusOut);
    window.addEventListener('resize', updateKeyboardState);
    return () => {
      document.removeEventListener('focusin', updateKeyboardState);
      document.removeEventListener('focusout', handleFocusOut);
      window.removeEventListener('resize', updateKeyboardState);
    };
  }, []);
  const hidden = location === '/contact' || keyboardOpen;
  return <div className={`quick-wrap ${hidden ? 'quick-hidden' : ''}`}><div className={`quick-menu ${open ? 'quick-open' : ''}`}><Link href="/contact"><ArrowUpRight size={15} />{t.quote}</Link>{businessConfig.whatsappEnabled && <a href={`https://wa.me/${businessConfig.whatsapp.replace(/\D/g, '')}`}><Globe2 size={15} />WhatsApp</a>}{businessConfig.wechatEnabled && <button onClick={() => navigator.clipboard?.writeText(businessConfig.wechat)}><Copy size={15} />{zh ? '复制微信号' : 'Copy WeChat ID'}</button>}</div><button className="quick-button" onClick={() => setOpen(!open)} aria-label={zh ? '快速联系' : 'Quick contact'} aria-expanded={open}>{open ? <X /> : <ArrowUpRight />}</button></div>;
}

function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return <div className="page-intro"><div className="wrap intro-inner"><span className="eyebrow">{eyebrow}</span><h1 className="font-display">{title}</h1>{text && <p>{text}</p>}</div></div>;
}

function VehicleArt({ index = 0, compact = false }: { index?: number; compact?: boolean }) {
  return <div className={`vehicle-art art-${index % 6} ${compact ? 'art-compact' : ''}`} role="img" aria-label="Illustrative vehicle placeholder, vehicle photography pending approval"><div className="art-label">HUIVEX / VEHICLE</div><div className="art-road" /><div className="art-car"><i /><b /><span /></div></div>;
}

function VehicleCard({ vehicle, index, t }: { vehicle: Vehicle; index: number; t: typeof copy.en }) {
  const zh = t.home === '首页';
  const categories: Record<string, string> = { 'Flagship SUV':'旗舰SUV', 'EV Sedan':'纯电轿车', 'EV Crossover':'纯电跨界车', Toyota:'丰田', Premium:'豪华车型', Pickup:'皮卡', Gasoline:'燃油车', 'Utility / Van':'多用途厢式车', MPV:'MPV', Commercial:'商用车' };
  const descriptors: Record<string, string> = { 'Luxury full-size SUV':'豪华全尺寸SUV', 'Extended-range flagship SUV':'增程旗舰SUV', 'Next-generation flagship SUV':'新一代旗舰SUV', 'High-performance EV sedan':'高性能纯电轿车', 'Modern intelligent electric sedan':'现代智能电动轿车', 'Modern intelligent EV crossover':'现代智能电动跨界车', 'High-demand SUV':'高需求SUV', 'Compact crossover':'紧凑型跨界车', Sedan:'轿车', 'Premium mid-size SUV':'豪华中型SUV', 'Large-format vehicle for rugged markets':'面向复杂路况的大型车型', 'Spacious all-purpose vehicle':'宽敞多用途车型', 'Adventure-style gasoline SUV':'户外风格燃油SUV', 'Reliable market favorite':'可靠的市场热门车型', 'Comfortable & spacious':'舒适宽敞', 'Reliable & efficient':'可靠高效', 'Luxury & intelligent':'豪华智能', 'Heavy duty & reliable':'重载可靠', 'Strong lifting capacity':'起重能力强' };
  const power = vehicle.confirm ? (zh ? '规格可按需咨询' : 'Specifications on request') : (zh ? vehicle.powertrain.replace('EV / extended-range','纯电 / 增程').replace('Extended-range','增程').replace('EV','纯电').replace('PHEV','插电混动').replace('Gasoline','燃油') : vehicle.powertrain);
  return <article className="vehicle-card"><Link href={`/vehicles/${vehicle.slug}`} className="vehicle-image-link"><VehicleArt index={index} /><span className="category-tag">{zh ? categories[vehicle.category] || vehicle.category : vehicle.category}</span><span className="card-arrow"><ArrowUpRight size={18} /></span></Link><div className="vehicle-card-copy"><span className="vehicle-brand">{vehicle.brand}</span><h3>{vehicle.model}</h3><p>{zh ? descriptors[vehicle.descriptor] || vehicle.descriptor : vehicle.descriptor}</p><div className="card-meta"><span>{power}</span></div><div className="card-links"><Link href={`/vehicles/${vehicle.slug}`}>{t.details}<ArrowRight size={14} /></Link><Link href={`/contact?vehicle=${vehicle.slug}`}>{t.request}<ArrowUpRight size={14} /></Link></div></div></article>;
}

type HeroSlide = { small: string; title: string; text: string; action: string; href: string };

function HeroCarousel({ slides, locale, scrollLabel }: { slides: HeroSlide[]; locale: Locale; scrollLabel: string }) {
  const fadePlugins = useMemo(() => [Fade()], []);
  const [viewportRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 36 }, fadePlugins);
  const [active, setActive] = useState(0);
  const pausedFor = useRef(new Set<string>());
  const autoplayTimer = useRef<number | null>(null);
  const scheduleAutoplay = useRef<(delay: number) => void>(() => undefined);

  const clearAutoplay = () => {
    if (autoplayTimer.current !== null) window.clearTimeout(autoplayTimer.current);
    autoplayTimer.current = null;
  };
  const pauseAutoplay = (reason: string) => {
    pausedFor.current.add(reason);
    clearAutoplay();
  };
  const resumeAutoplay = (reason: string) => {
    pausedFor.current.delete(reason);
    if (pausedFor.current.size === 0) scheduleAutoplay.current(2000);
  };

  useEffect(() => {
    if (!emblaApi) return;
    const update = () => setActive(emblaApi.selectedScrollSnap());
    update();
    emblaApi.on('select', update);
    emblaApi.on('reInit', update);
    return () => {
      emblaApi.off('select', update);
      emblaApi.off('reInit', update);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const schedule = (delay: number) => {
      clearAutoplay();
      if (motionPreference.matches || document.hidden || pausedFor.current.size > 0) return;
      autoplayTimer.current = window.setTimeout(() => {
        autoplayTimer.current = null;
        if (document.hidden || pausedFor.current.size > 0) return;
        emblaApi.scrollNext();
        scheduleAutoplay.current(6500);
      }, delay);
    };
    scheduleAutoplay.current = schedule;

    const handleVisibility = () => {
      if (document.hidden) pauseAutoplay('visibility');
      else resumeAutoplay('visibility');
    };
    const handleMotionPreference = () => {
      if (motionPreference.matches) pauseAutoplay('reduced-motion');
      else resumeAutoplay('reduced-motion');
    };
    document.addEventListener('visibilitychange', handleVisibility);
    motionPreference.addEventListener('change', handleMotionPreference);
    if (document.hidden) pauseAutoplay('visibility');
    if (motionPreference.matches) pauseAutoplay('reduced-motion');
    else schedule(6500);

    return () => {
      clearAutoplay();
      scheduleAutoplay.current = () => undefined;
      document.removeEventListener('visibilitychange', handleVisibility);
      motionPreference.removeEventListener('change', handleMotionPreference);
      pausedFor.current.clear();
    };
  }, [emblaApi]);

  const moveByKey = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!emblaApi || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
    event.preventDefault();
    if (event.key === 'ArrowLeft') emblaApi.scrollPrev();
    else emblaApi.scrollNext();
  };
  const previousLabel = locale === 'en' ? 'Previous slide' : '上一张';
  const nextLabel = locale === 'en' ? 'Next slide' : '下一张';

  return <section className="hero" aria-label={locale === 'en' ? 'Featured introduction' : '精选介绍'}>
    <div className="hero-image" aria-hidden="true" />
    <div className="hero-grid" aria-hidden="true" />
    <div
      className="hero-viewport"
      ref={viewportRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={locale === 'en' ? 'Featured introduction' : '精选介绍'}
      tabIndex={0}
      onKeyDown={moveByKey}
      onMouseEnter={() => pauseAutoplay('hover')}
      onMouseLeave={() => resumeAutoplay('hover')}
      onFocusCapture={() => pauseAutoplay('focus')}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) resumeAutoplay('focus');
      }}
      onPointerDownCapture={() => pauseAutoplay('pointer')}
      onPointerUpCapture={() => resumeAutoplay('pointer')}
      onPointerCancelCapture={() => resumeAutoplay('pointer')}
    >
      <div className="hero-track">
        {slides.map((item, index) => <article
          key={`${item.small}-${index}`}
          className={`hero-slide ${index === active ? 'is-active' : ''}`}
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} / ${slides.length}`}
          aria-hidden={index !== active}
          inert={index !== active}
        >
          <div className="wrap hero-content">
            <div className="hero-kicker"><span />{item.small}</div>
            <h1 className="font-display">{item.title.split('\\n').map((line, lineIndex) => <span key={`${index}-${lineIndex}`}>{line}</span>)}</h1>
            <p>{item.text}</p>
            <div className="hero-actions">
              <Link href={item.href} className="button button-gold">{item.action}<ArrowUpRight size={16} /></Link>
              <Link href="/contact" className="hero-secondary">{copy[locale].quote}<ArrowRight size={16} /></Link>
            </div>
          </div>
        </article>)}
      </div>
    </div>
    <div className="hero-pagination" aria-label={locale === 'en' ? 'Choose a slide' : '选择幻灯片'}>
      {slides.map((item, index) => <button
        key={`${item.small}-control-${index}`}
        type="button"
        onClick={() => emblaApi?.scrollTo(index)}
        aria-label={locale === 'en' ? `Show slide ${index + 1}` : `显示第 ${index + 1} 张`}
        aria-current={index === active ? 'true' : undefined}
        className={index === active ? 'current' : ''}
      ><span /></button>)}
    </div>
    <div className="hero-controls">
      <span className="hero-index" aria-live="polite">0{active + 1} <i /> 0{slides.length}</span>
      <div className="hero-arrows">
        <button type="button" aria-label={previousLabel} onClick={() => emblaApi?.scrollPrev()}><ArrowLeft size={16} /></button>
        <button type="button" aria-label={nextLabel} onClick={() => emblaApi?.scrollNext()}><ArrowRight size={16} /></button>
      </div>
    </div>
    <a href="#intro" className="hero-scroll"><span>{scrollLabel}</span><ArrowDown size={15} /></a>
  </section>;
}

function FeaturedCarousel({ t, locale }: { t: typeof copy.en; locale: Locale }) {
  const featuredVehicles = activeVehicles.filter((vehicle) => vehicle.featured);
  const options = useMemo(() => ({
    align: 'center' as const,
    containScroll: 'trimSnaps' as const,
    dragFree: true,
    loop: featuredVehicles.length > 1,
  }), [featuredVehicles.length]);
  const [viewportRef, emblaApi] = useEmblaCarousel(options);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const update = () => setActive(emblaApi.selectedScrollSnap());
    update();
    emblaApi.on('select', update);
    emblaApi.on('reInit', update);
    return () => {
      emblaApi.off('select', update);
      emblaApi.off('reInit', update);
    };
  }, [emblaApi]);

  const previousLabel = locale === 'en' ? 'Previous vehicle' : '上一款车型';
  const nextLabel = locale === 'en' ? 'Next vehicle' : '下一款车型';

  return <div className="featured-carousel">
    <div
      className="featured-viewport"
      ref={viewportRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={t.popularTitle}
    >
      <div className="featured-track">
        {featuredVehicles.map((vehicle, index) => <div
          className={`featured-slide ${index === active ? 'is-selected' : ''}`}
          key={vehicle.slug}
          role="group"
          aria-roledescription="slide"
          aria-label={locale === 'en' ? `${index + 1} of ${featuredVehicles.length}` : `${index + 1} / ${featuredVehicles.length}`}
        >
          <VehicleCard vehicle={vehicle} index={index} t={t} />
        </div>)}
      </div>
    </div>
    <div className="featured-controls">
      <div className="featured-dots" aria-label={locale === 'en' ? 'Choose a vehicle' : '选择车型'}>
        {featuredVehicles.map((vehicle, index) => <button
          type="button"
          key={vehicle.slug}
          aria-label={locale === 'en' ? `Show ${vehicle.model}` : `显示${vehicle.model}`}
          aria-current={index === active ? 'true' : undefined}
          className={index === active ? 'current' : ''}
          onClick={() => emblaApi?.scrollTo(index)}
        ><span /></button>)}
      </div>
      <div className="featured-arrows">
        <button type="button" aria-label={previousLabel} onClick={() => emblaApi?.scrollPrev()}><ArrowLeft size={16} /></button>
        <button type="button" aria-label={nextLabel} onClick={() => emblaApi?.scrollNext()}><ArrowRight size={16} /></button>
      </div>
    </div>
  </div>;
}

function HomePage({ locale, t }: { locale: Locale; t: typeof copy.en }) {
  const slides: HeroSlide[] = [
    { small: 'HUIVEX AUTO GLOBAL', title: locale === 'en' ? 'Cars beyond\\nborders.' : '车通\\n天下。', text: t.subtitle, action: t.browse, href: '/vehicles' },
    { small: locale === 'en' ? 'A considered range' : '多元车型', title: locale === 'en' ? 'EVs, SUVs, sedans,\\npickups and more.' : '新能源、SUV、轿车、\\n皮卡及更多车型。', text: locale === 'en' ? 'One export partner across brands and body types.' : '覆盖多品牌与多种车型的出口服务。', action: t.browse, href: '/vehicles' },
    { small: locale === 'en' ? 'One visible process' : '流程清晰可追踪', title: locale === 'en' ? 'From quote to shipment,\\nevery step in view.' : '从报价到装运，\\n每一步清晰可见。', text: locale === 'en' ? 'Quote, PI & payment, VIN check, export documents, loading, shipment.' : '报价、付款、车架号确认、出口资料、装车与装运。', action: t.process, href: '/services' },
    { small: locale === 'en' ? 'Sourcing from China' : '从中国采购', title: locale === 'en' ? 'A clear route from\\nsourcing to shipment.' : '从车辆采购到装运，\\n流程清晰可见。', text: locale === 'en' ? 'Vehicle sourcing, documentation, loading and shipment coordination in one workflow.' : '在同一流程中协调车辆采购、文件准备、装车与运输。', action: t.process, href: '/services' },
  ];
  const benefitItems = locale === 'en' ? [
    ['01', 'Direct sourcing channels', 'Links with dealerships, traders and market resources across China.'],
    ['02', 'Competitive pricing', 'Fast price feedback based on market changes, trim level and delivery timing.'],
    ['03', 'VIN & color confirmation', 'Key order details reconfirmed before PI and loading arrangements.'],
    ['04', 'Multi-brand availability', 'Flexible choices across EVs, SUVs, sedans, premium and commercial models.'],
    ['05', 'Inspection transparency', 'Vehicle videos, basic checks and loading confirmation support confidence.'],
    ['06', 'Export coordination', 'Quotation, sourcing, documentation, loading and after-sales support in one workflow.'],
  ] : [
    ['01', '直接采购渠道', '连接中国各地经销商、贸易商与市场资源。'],
    ['02', '市场价格反馈', '结合市场变化、配置与交付时间快速反馈价格。'],
    ['03', '车架号与颜色确认', '在形式发票和装运安排前再次确认订单关键信息。'],
    ['04', '多品牌车型选择', '涵盖新能源、SUV、轿车、豪华及商用车型。'],
    ['05', '透明检查沟通', '通过车辆视频、基础检查与装车确认提升采购信心。'],
    ['06', '出口流程协调', '在同一流程中协调报价、采购、文件、装车与售后支持。'],
  ];
  return <>
    <HeroCarousel slides={slides} locale={locale} scrollLabel={t.scroll} />
    <section className="trust-strip"><div className="wrap trust-grid">
      {[['6,000+', locale === 'en' ? 'vehicles exported since 2022*' : '自2022年以来累计出口车辆*'], ['24h', locale === 'en' ? 'fast response' : '快速响应'], ['1-stop', locale === 'en' ? 'export service' : '一站式出口服务'], ['VIN', locale === 'en' ? 'confirmation before loading' : '装运前确认车架号']].map(([value, label], i) => <div className="trust-item" key={value}><span className="trust-num">{value}</span><span>{label}</span><small>0{i + 1}</small></div>)}
    </div><div className="wrap credential-note">* {locale === 'en' ? 'Team track record wording pending client confirmation.' : '团队业绩表述待客户确认。'} <span>{locale === 'en' ? `Est. ${businessConfig.establishment} · Registered capital ${businessConfig.registeredCapital} · Xi’an, China` : `成立于${businessConfig.establishment} · 注册资本${businessConfig.registeredCapital} · 中国西安`}</span></div></section>
    <section id="intro" className="section-space intro-section"><div className="wrap intro-grid"><div className="intro-copy"><span className="eyebrow">{locale === 'en' ? 'What we do' : '我们的服务'}</span><h2 className="font-display">{locale === 'en' ? 'Sourcing from China, with the process in focus.' : '从中国采购，让每个环节清晰可见。'}</h2><p>{locale === 'en' ? 'A China-based automobile sourcing and export service provider. We connect vehicle sourcing, documentation, loading and shipment in one visible workflow.' : '立足中国的汽车车源及出口服务商。将车辆采购、文件准备、装车和运输协调纳入清晰流程。'}</p><Link href="/services" className="text-link">{locale === 'en' ? 'Explore our approach' : '了解服务流程'}<ArrowUpRight size={16} /></Link></div><div className="intro-visual"><div className="intro-visual-image"><VehicleArt index={2} /></div><div className="intro-visual-stamp"><span>HAG</span><small>XI’AN · CHINA</small></div><div className="intro-vertical">SOURCE / CONFIRM / SHIP</div></div></div>
      <div className="wrap pillar-grid">{[[PackageCheck,t.sourcing,'01'],[ShieldCheck,t.docs,'02'],[Ship,t.shipping,'03'],[CircleHelp,t.support,'04']].map(([Icon,label,no]) => <div className="pillar" key={String(no)}><span className="pillar-no">{String(no)}</span><Icon size={20} strokeWidth={1.5} /><span>{String(label)}</span></div>)}</div></section>
    <section className="vehicles-feature section-space"><div className="wrap"><div className="section-heading"><div><span className="eyebrow">{t.popular}</span><h2 className="font-display">{t.popularTitle}</h2></div><Link className="text-link" href="/vehicles">{t.seeAll}<ArrowUpRight size={15} /></Link></div><FeaturedCarousel t={t} locale={locale} /></div></section>
    <ProcessBlock locale={locale} t={t} />
    <section className="markets-teaser"><div className="wrap markets-teaser-inner"><div><span className="eyebrow">{locale === 'en' ? 'Global reach' : '全球运输网络'}</span><h2 className="font-display">{t.marketsTitle}</h2><p>{locale === 'en' ? 'Road, container, RoRo and railway freight options. Flexible methods are selected based on destination, cost, urgency and market policy.' : '提供公路、集装箱、滚装船和铁路运输选择。根据目的地、成本、时效与市场政策灵活选择。'}</p><Link href="/markets" className="button button-outline-light">{locale === 'en' ? 'Explore markets' : '查看目标市场'}<ArrowUpRight size={16} /></Link></div><RouteGraphic /></div></section>
    <section className="section-space benefits"><div className="wrap"><div className="section-heading"><div><span className="eyebrow">{t.approach}</span><h2 className="font-display">{t.why}</h2></div></div><div className="benefit-grid">{benefitItems.map(([no, head, body]) => <article key={no} className="benefit-card"><span>{no}</span><h3>{head}</h3><p>{body}</p><ArrowUpRight size={16} /></article>)}</div><blockquote>{locale === 'en' ? 'For overseas dealers, good sourcing is not only about finding a car. It is about consistency in price, speed in confirmation, accuracy in specifications and confidence before shipment.' : '对于海外经销商而言，优质采购不仅是找到车辆，更关乎价格稳定、确认及时、信息准确，以及装运前的安心。'}</blockquote></div></section>
    <section className="brand-section"><div className="wrap brand-head"><span className="eyebrow">{t.by}</span><p>{locale === 'en' ? 'Brand availability is subject to confirmation. No official dealership or manufacturer endorsement is implied.' : '品牌供应情况需另行确认，不代表官方经销或制造商背书。'}</p></div><div className="brand-marquee"><div className="marquee">{['BYD','Geely','Toyota','Changan','GAC','Livan','Avatr','ROX','Zeekr','BMW','Mercedes-Benz','Mazda','Kia','Hyundai','Volkswagen','Jetour','BYD','Geely','Toyota','Changan','GAC','Livan','Avatr','ROX','Zeekr','BMW','Mercedes-Benz','Mazda','Kia','Hyundai','Volkswagen','Jetour'].map((brand,i) => <span key={`${brand}-${i}`}>{brand}</span>)}</div></div></section>
    <section className="showroom-teaser section-space"><div className="wrap showroom-grid"><div className="showroom-poster"><div className="poster-lines" /><span className="poster-mark">PARTNER<br />NETWORK</span><span className="poster-caption">HUIVEX / SHOWROOMS</span></div><div><span className="eyebrow">{locale === 'en' ? 'Beyond the shipment' : '不止于运输'}</span><h2 className="font-display">{t.showroomTitle}</h2><p>{locale === 'en' ? 'Cooperate with display points and partner locations that help overseas clients see product style, size and finish more intuitively.' : '携手展示点与合作伙伴，让海外客户更直观地了解车辆造型、尺寸与细节。'}</p><ul className="check-list">{['Display support','Model guidance','Trust building','Flexible cooperation'].map((item,i) => <li key={item}><Check size={15} />{locale === 'en' ? item : ['展示支持','车型建议','建立信任','灵活合作'][i]}</li>)}</ul><Link href="/showrooms" className="text-link">{locale === 'en' ? 'Explore showroom partnership' : '了解展厅合作'}<ArrowUpRight size={16} /></Link></div></div></section>
    <CTA locale={locale} t={t} />
  </>;
}

function RouteGraphic() {
  return <div className="route-graphic"><div className="map-grid" /><svg viewBox="0 0 550 300" aria-label="Illustrative trade routes from Xi'an to listed destinations"><path className="route-line" d="M275 128 Q210 70 163 83 M275 128 Q230 116 214 151 M275 128 Q351 74 393 93 M275 128 Q380 120 416 158 M275 128 Q240 195 188 213 M275 128 Q348 196 374 226" fill="none" stroke="#c9962e" strokeWidth="1.4" /><circle cx="275" cy="128" r="5" fill="#d7ad57" /><circle cx="163" cy="83" r="3" fill="#d7ad57" /><circle cx="214" cy="151" r="3" fill="#d7ad57" /><circle cx="393" cy="93" r="3" fill="#d7ad57" /><circle cx="416" cy="158" r="3" fill="#d7ad57" /><circle cx="188" cy="213" r="3" fill="#d7ad57" /><circle cx="374" cy="226" r="3" fill="#d7ad57" /><text x="287" y="121">XI’AN</text><text x="405" y="85">MIDDLE EAST</text><text x="357" y="249">SOUTH AMERICA</text></svg><div className="route-caption">ROUTES / INDICATIVE ONLY</div></div>;
}

function ProcessBlock({ locale, t }: { locale: Locale; t: typeof copy.en }) {
  const notes = locale === 'en' ? ['A quotation shaped around the inquiry.', 'Payment status, balance, cost and shipment fees tracked before release.', 'Key vehicle details reconfirmed before the next stage.', 'PI/CI, packing list, export declaration and customer files kept consistent.', 'Loading coordination and confirmation.', 'Road, sea or rail shipment coordination.'] : ['根据需求准备报价。','放行前跟进付款状态、余额、成本与运输费用。','进入后续阶段前再次确认车辆关键信息。','PI/CI、装箱单、出口申报及客户资料保持一致。','协调并确认港口装车。','协调公路、海运或铁路运输。'];
  return <section className="process-section section-space"><div className="wrap"><div className="section-heading"><div><span className="eyebrow">{locale === 'en' ? 'A visible workflow' : '清晰可见的流程'}</span><h2 className="font-display">{t.processTitle}</h2></div><Link className="text-link" href="/services">{locale === 'en' ? 'Our services' : '服务详情'}<ArrowUpRight size={15} /></Link></div><div className="process-line">{t.sixSteps.map((step,i) => <article key={step}><span className="process-node">0{i+1}</span><h3>{step}</h3><p>{notes[i]}</p></article>)}</div></div></section>;
}

function CTA({ locale, t }: { locale: Locale; t: typeof copy.en }) {
  return <section className="cta-band"><div className="wrap cta-inner"><div><span className="eyebrow">{locale === 'en' ? 'Your next step' : '下一步'}</span><h2 className="font-display">{t.ready}</h2><p>{t.readyText}</p></div><Link href="/contact" className="button button-gold">{t.send}<ArrowUpRight size={16} /></Link></div></section>;
}

function CatalogPage({ locale, t }: { locale: Locale; t: typeof copy.en }) {
  const [location, setLocation] = useLocation();
  const params = new URLSearchParams(location.split('?')[1] || '');
  const [search, setSearch] = useState(params.get('q') || '');
  const [category, setCategory] = useState(params.get('category') || '');
  const [power, setPower] = useState(params.get('power') || '');
  const [brand, setBrand] = useState(params.get('brand') || '');
  useEffect(() => {
    const current = new URLSearchParams(location.split('?')[1] || '');
    setSearch(current.get('q') || '');
    setCategory(current.get('category') || '');
    setPower(current.get('power') || '');
    setBrand(current.get('brand') || '');
  }, [location]);
  const categories = ['SUV','Sedan','Pickup','MPV','Van','Commercial','Premium','Toyota'];
  const brands = [...new Set(activeVehicles.map(v => v.brand))];
  const filtered = useMemo(() => activeVehicles.filter(v => {
    const catMatch = !category || `${v.category} ${v.model}`.toLowerCase().includes(category.toLowerCase()) || (category === 'SUV' && v.category.includes('SUV')) || (category === 'Van' && v.category.includes('Van'));
    const powerMatch = !power || (power === 'EV' ? v.powertrain.includes('EV') : power === 'EREV/PHEV' ? /extended|PHEV/i.test(v.powertrain) : power === 'Gasoline' ? /Gasoline/i.test(v.powertrain) : false);
    return catMatch && powerMatch && (!brand || v.brand === brand) && (!search || `${v.model} ${v.brand} ${v.category}`.toLowerCase().includes(search.toLowerCase()));
  }), [category, power, brand, search]);
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(location.split('?')[1] || '');
    if (value) next.set(key, value); else next.delete(key);
    setLocation(`/vehicles${next.size ? `?${next.toString()}` : ''}`);
  };
  const clear = () => { setCategory(''); setPower(''); setBrand(''); setSearch(''); setLocation('/vehicles'); };
  return <><PageIntro eyebrow="HUIVEX / CATALOG" title={t.catalog} text={locale === 'en' ? 'A selected starting point for your sourcing enquiry. Availability, trims and specifications are confirmed on request.' : '为采购询价提供车型参考。供应情况、配置与规格可按需确认。'} />
    <section className="catalog-section wrap">
      <div className="catalog-toolbar"><label className="search-field"><Search size={17} /><input aria-label={t.search} placeholder={t.search} value={search} onChange={e => { setSearch(e.target.value); update('q', e.target.value); }} /></label><div className="select-filter"><span>{t.brand}</span><select aria-label={t.brand} value={brand} onChange={e => {setBrand(e.target.value);update('brand',e.target.value);}}><option value="">{t.all}</option>{brands.map(b => <option key={b}>{b}</option>)}</select></div></div>
      <div className="filter-row"><b>{t.category}</b><div className="chips"><button className={!category ? 'selected' : ''} onClick={() => {setCategory('');update('category','');}}>{t.all}</button>{categories.map(c => <button key={c} className={category === c ? 'selected' : ''} onClick={() => {setCategory(category === c ? '' : c);update('category', category === c ? '' : c);}}>{c}</button>)}</div></div>
      <div className="filter-row power-filter"><b>{t.powertrain}</b><div className="chips">{['EV','EREV/PHEV','Gasoline','LPG'].map(c => <button key={c} className={power === c ? 'selected' : ''} onClick={() => {setPower(power === c ? '' : c);update('power',power === c ? '' : c);}}>{c}</button>)}</div></div>
      <div className="catalog-results"><span><strong>{filtered.length.toString().padStart(2,'0')}</strong> {t.results}</span>{(category||power||brand||search) && <button onClick={clear}>{t.clear}<X size={13} /></button>}</div>
      {filtered.length ? <div className="catalog-grid">{filtered.map((vehicle,i) => <VehicleCard key={vehicle.slug} vehicle={vehicle} index={i} t={t} />)}</div> : <div className="empty-state"><span>HAG / 00</span><h2>{t.none}</h2><p>{t.ask}</p><Link href={`/contact${search ? `?vehicle=${encodeURIComponent(search)}` : ''}`} className="button button-navy">{t.quote}<ArrowUpRight size={16} /></Link></div>}
    </section>
  </>;
}

function VehicleDetail({ locale, t }: { locale: Locale; t: typeof copy.en }) {
  const { slug } = useParams<{ slug: string }>();
  const vehicle = activeVehicles.find(v => v.slug === slug);
  if (!vehicle) return <NotFound locale={locale} t={t} />;
  const related = activeVehicles.filter(v => v.category === vehicle.category && v.slug !== vehicle.slug).slice(0, 3);
  return <><div className="detail-top wrap"><Link href="/vehicles"><ArrowLeft size={15} />{t.catalog}</Link></div><section className="detail-hero wrap"><div className="detail-art"><VehicleArt index={activeVehicles.indexOf(vehicle)} /></div><div className="detail-copy"><span className="eyebrow">{vehicle.category} / {vehicle.brand}</span><h1 className="font-display">{vehicle.model}</h1><p className="detail-descriptor">{vehicle.descriptor}</p><div className="detail-badges">{vehicle.confirm ? <span>{locale === 'en' ? 'Specifications on request' : '规格可按需咨询'}</span> : <><span>{vehicle.powertrain}</span><span>{locale === 'en' ? 'Specification on request' : '规格可按需咨询'}</span></>}</div><div className="detail-sep" /><span className="eyebrow">{t.overview}</span><p>{vehicle.descriptor}. {locale === 'en' ? 'Further model information is pending confirmation.' : '更多车型信息待确认。'}</p><Link href={`/contact?vehicle=${vehicle.slug}`} className="button button-gold">{t.request}<ArrowUpRight size={16} /></Link></div></section>
    <section className="detail-support"><div className="wrap support-inner"><div><span className="eyebrow">HAG / EXPORT SUPPORT</span><h2 className="font-display">{t.included}</h2><p>{t.available}</p></div><ul>{[t.vin,t.document,t.load,t.track].map((x,i)=><li key={x}><span>0{i+1}</span>{x}<Check size={15}/></li>)}</ul></div></section>
    {related.length > 0 && <section className="section-space wrap"><div className="section-heading"><div><span className="eyebrow">{locale === 'en' ? 'Related range' : '相关车型'}</span><h2 className="font-display">{locale === 'en' ? 'Continue exploring' : '继续浏览'}</h2></div></div><div className="featured-grid">{related.map((v,i)=><VehicleCard key={v.slug} vehicle={v} index={i+1} t={t}/>)}</div></section>}
  </>;
}

function QuoteForm({ locale, t, presetType = 'vehicle-quote', initialVehicle = '' }: { locale: Locale; t: typeof copy.en; presetType?: QuoteInput['inquiryType']; initialVehicle?: string }) {
  const mutation = useCreateQuote();
  const [sent, setSent] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [formName, setFormName] = useState('');
  const [selectedVehicles, setSelectedVehicles] = useState(initialVehicle ? [initialVehicle] : []);
  useEffect(() => { if (initialVehicle) setSelectedVehicles([initialVehicle]); }, [initialVehicle]);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError('');
    if (!country) { setError(locale === 'en' ? 'Choose a country to continue.' : '请选择国家或地区。'); return; }
    if (!formName.trim()) { setError(locale === 'en' ? 'Enter your full name.' : '请输入姓名。'); return; }
    if (!email.trim() && !phone.trim()) { setError(locale === 'en' ? 'Enter an email address or phone number.' : '请填写电子邮箱或电话号码。'); return; }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError(locale === 'en' ? 'Enter a valid email address.' : '请输入有效的电子邮箱地址。'); return; }
    const fd = new FormData(event.currentTarget);
    if (!fd.get('consent')) { setError(locale === 'en' ? 'Please agree before sending your enquiry.' : '请先同意信息使用说明。'); return; }
    const input: QuoteInput = {
      locale, name: String(fd.get('name') || '').trim(), country,
      ...(String(fd.get('company') || '').trim() ? { company: String(fd.get('company')).trim() } : {}),
      ...(email.trim() ? { email: email.trim() } : {}), ...(phone.trim() ? { phone: phone.trim() } : {}),
      inquiryType: String(fd.get('inquiryType') || presetType) as QuoteInput['inquiryType'],
      vehicles: selectedVehicles,
      ...(String(fd.get('quantity') || '') ? { quantity: String(fd.get('quantity')) as QuoteInput['quantity'] } : {}),
      ...(String(fd.get('destination') || '').trim() ? { destination: String(fd.get('destination')).trim() } : {}),
      ...(String(fd.get('message') || '').trim() ? { message: String(fd.get('message')).trim() } : {}),
      consent: true, hp: String(fd.get('hp') || ''),
    };
    mutation.mutate({ data: input }, { onSuccess: result => { setSent(result.id); }, onError: () => setError(locale === 'en' ? 'We could not send your enquiry. Your details are still here; please try again.' : '提交失败，您填写的信息仍已保留，请重试。') });
  };
   if (sent !== null) return <div className="success-panel"><span className="success-icon"><Check size={23} /></span><span className="eyebrow">{locale === 'en' ? 'Enquiry received' : '已收到询价'}</span><h2>{locale === 'en' ? 'Thank you. Your request is recorded.' : '感谢您的询价，信息已提交。'}</h2><p>{locale === 'en' ? `Reference ${sent}. Follow-up contact details are pending confirmation.` : `参考编号 ${sent}。后续联系信息待确认。`}</p></div>;
  return <form className="quote-form" onSubmit={submit} noValidate>
    <div className="form-two"><label>{locale === 'en' ? 'Full name' : '姓名'}<span>*</span><input autoComplete="name" required name="name" value={formName} onChange={e=>setFormName(e.target.value)} placeholder={locale === 'en' ? 'Your name' : '请输入姓名'} /></label><label>{locale === 'en' ? 'Company' : '公司'}<input autoComplete="organization" name="company" placeholder={locale === 'en' ? 'Company name (optional)' : '公司名称（选填）'} /></label></div>
    <div className="form-two"><label>{locale === 'en' ? 'Country / region' : '国家 / 地区'}<span>*</span><select value={country} onChange={e=>setCountry(e.target.value)} required><option value="">{locale === 'en' ? 'Select destination country' : '选择目的地国家'}</option>{destinationCountries.map(c=><option key={c.code} value={c.code}>{locale === 'en' ? c.en : c.zh} · {c.code}</option>)}</select></label><label>{locale === 'en' ? 'Inquiry type' : '询价类型'}<select name="inquiryType" defaultValue={presetType}><option value="vehicle-quote">{locale === 'en' ? 'Vehicle quote' : '车辆报价'}</option><option value="showroom-partner">{locale === 'en' ? 'Showroom partnership' : '展厅合作'}</option><option value="other">{locale === 'en' ? 'Other' : '其他'}</option></select></label></div>
    <div className="form-two"><label>{locale === 'en' ? 'Email' : '电子邮箱'}<input type="email" inputMode="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@company.com" /></label><label>{locale === 'en' ? 'Phone / WhatsApp' : '电话 / WhatsApp'}<input type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+__  ________" /></label></div>
    <div className="form-two"><label>{locale === 'en' ? 'Vehicles of interest' : '意向车型'}<select value="" onChange={e=>{if(e.target.value&&!selectedVehicles.includes(e.target.value))setSelectedVehicles([...selectedVehicles,e.target.value]);}}><option value="">{locale === 'en' ? 'Add a vehicle' : '添加车型'}</option>{activeVehicles.map(v=><option key={v.slug} value={v.slug}>{v.model}</option>)}</select><div className="chosen-vehicles">{selectedVehicles.map(v=><button type="button" key={v} onClick={()=>setSelectedVehicles(selectedVehicles.filter(x=>x!==v))}>{activeVehicles.find(x=>x.slug===v)?.model || vehicles.find(x=>x.slug===v)?.model || v}<X size={12}/></button>)}</div></label><label>{locale === 'en' ? 'Quantity' : '采购数量'}<select name="quantity"><option value="">{locale === 'en' ? 'Select quantity' : '选择数量'}</option><option value="1">1</option><option value="2-5">2–5</option><option value="6-20">6–20</option><option value="20+">20+</option></select></label></div>
    <label>{locale === 'en' ? 'Destination country / port' : '目的地国家 / 港口'}<input name="destination" placeholder={locale === 'en' ? 'Optional' : '选填'} /></label>
    <label>{locale === 'en' ? 'Message' : '留言'}<textarea name="message" maxLength={2000} rows={4} placeholder={locale === 'en' ? 'Models, requirements or questions (optional)' : '车型、需求或问题（选填）'} /></label>
    <label className="honeypot" aria-hidden="true">Website<input name="hp" tabIndex={-1} autoComplete="off" /></label>
    <label className="consent-row"><input required type="checkbox" name="consent" /><span>{locale === 'en' ? 'I agree to the use of my information to respond to this enquiry.' : '我同意使用所提供的信息回复本次询价。'} <Link href="/privacy">{locale === 'en' ? 'Privacy notice' : '隐私说明'}</Link></span></label>
    {error && <p className="form-error" role="alert">{error}</p>}
    <button className="button button-navy submit-button" disabled={mutation.isPending}>{mutation.isPending ? <>{locale === 'en' ? 'Sending…' : '正在提交…'}<span className="button-loader" /></> : <>{t.send}<ArrowUpRight size={16} /></>}</button>
    <p className="form-footnote">{locale === 'en' ? 'No pricing or availability is confirmed until a quotation is provided.' : '价格及供应情况以正式报价确认为准。'}</p>
  </form>;
}

function ContactPage({ locale, t, query }: { locale: Locale; t: typeof copy.en; query: string }) {
  const params = new URLSearchParams(query);
  const vehicle = params.get('vehicle') || '';
  return <><PageIntro eyebrow="HUIVEX / ENQUIRY" title={t.contactTitle} text={t.contactCopy} /><section className="contact-layout wrap"><div className="contact-form-card"><div className="form-heading"><span className="eyebrow">{locale === 'en' ? 'Quote request' : '询价表单'}</span><h2>{locale === 'en' ? 'A few details to get started.' : '请提供一些基本信息。'}</h2><p>{locale === 'en' ? 'Required fields are marked with an asterisk.' : '带星号的字段为必填项。'}</p></div><QuoteForm locale={locale} t={t} initialVehicle={vehicle} /></div><aside className="contact-aside"><div className="contact-mark">HAG<span> / XI’AN</span></div><span className="eyebrow">{locale === 'en' ? 'Company details' : '公司信息'}</span><h3>Huivex Auto Global, Ltd.</h3><p>陕西汇驰天下汽车贸易有限公司</p><div className="contact-divider" /><div className="contact-entry"><span>{locale === 'en' ? 'Contact' : '联系人'}</span><b>{businessConfig.contactPerson}</b></div><div className="contact-entry"><span>{locale === 'en' ? 'Phone' : '电话'}</span><b>{businessConfig.phone}</b></div><div className="contact-entry"><span>Email</span><b>{businessConfig.email}</b></div><div className="contact-entry"><span>WeChat</span><b>{businessConfig.wechat}</b></div><div className="contact-divider" /><span className="eyebrow">{locale === 'en' ? 'Office' : '办公地址'}</span><p className="address-copy">{locale === 'en' ? businessConfig.addressEn : businessConfig.addressZh}</p><small className="pending-label">PUBLIC CONTACT DETAILS PENDING APPROVAL</small></aside></section></>;
}

function GenericPage({ kind, locale, t }: { kind: string; locale: Locale; t: typeof copy.en }) {
  const services = kind === 'services';
  const markets = kind === 'markets';
  const showrooms = kind === 'showrooms';
  const about = kind === 'about';
  const heading = services ? t.servicesTitle : markets ? t.marketsHeading : showrooms ? t.showroomHeading : about ? t.aboutHeading : kind;
  return <><PageIntro eyebrow={`HUIVEX / ${kind.toUpperCase()}`} title={heading} text={services ? (locale==='en' ? 'One connected workflow for sourcing, documents, logistics, payment coordination and after-sales support.' : '涵盖车辆采购、文件、物流、付款协调与售后支持的一体化流程。') : markets ? (locale==='en' ? 'The destination list below reflects routes in the company profile. Regional groupings remain subject to client confirmation.' : '以下目的地来自公司资料。区域划分仍待客户确认。') : undefined} />
    {services && <><ProcessBlock locale={locale} t={t} /><section className="wrap section-space"><div className="section-heading"><div><span className="eyebrow">{locale==='en'?'Four functions':'四项职能'}</span><h2 className="font-display">{locale==='en'?'A team around every stage':'团队协同每个环节'}</h2></div></div><div className="benefit-grid service-team">{[['Trading & Sales','Market inquiry, quotation, negotiation and client follow-up.'],['Logistics & Customs','Loading plan, port coordination, customs declaration and shipment tracking.'],['Finance & Accounting','Payment confirmation, PI/CI files, cost control and settlement.'],['After-sales Service','Vehicle file keeping, technical communication and long-term support.']].map(([h,p],i)=><article key={h} className="benefit-card"><span>0{i+1}</span><h3>{locale==='en'?h:['贸易销售','物流报关','财务会计','售后服务'][i]}</h3><p>{locale==='en'?p:['市场询价、报价、协商与客户跟进。','装车计划、港口协调、海关申报与运输跟踪。','付款确认、PI/CI文件、成本控制与结算。','车辆档案、技术沟通与长期支持。'][i]}</p></article>)}</div><div className="document-panel"><span className="eyebrow">DOCUMENT CONTROL</span><h3>{locale==='en'?'Export documentation':'出口文件'}</h3><p>PI / CI · {locale==='en'?'Packing list · Export declaration · Customer files':'装箱单 · 出口申报 · 客户资料'}</p></div></section><div className="transport-band"><div className="wrap"><span className="eyebrow">{locale==='en'?'Transport options':'运输方式'}</span><div className="transport-grid">{['Road Transport','Container Loading','RoRo Shipment','Railway Freight'].map((x,i)=><div key={x}><span>0{i+1}</span><Truck size={21}/><h3>{locale==='en'?x:['公路运输','集装箱装运','滚装船运输','铁路运输'][i]}</h3></div>)}</div><p>{locale==='en'?'Flexible methods are selected based on destination, cost, urgency and market policy.':'根据目的地、成本、时效与市场政策选择灵活运输方式。'}</p></div></div></>}
    {markets && <section className="wrap section-space markets-page"><RouteGraphic /><div className="markets-country-list">{destinationCountries.map(c=><div key={c.code}><span>{c.code}</span><b>{locale==='en'?c.en:c.zh}</b><ArrowUpRight size={15}/></div>)}</div><div className="draft-note">{locale==='en'?'Country-to-region assignments are a draft and need client approval.':'国家与区域的对应关系为草稿，需客户确认。'}</div></section>}
    {showrooms && <section className="wrap section-space"><div className="benefit-grid">{[['Display Support','Localized showroom visuals, product cards and sales material support.'],['Model Guidance','Popular trims, color recommendations and market-oriented product advice.'],['Trust Building','On-site viewing, client reception and partner photo/video confirmation.'],['Flexible Cooperation','Suitable for display, promotion, dealer support and local market testing.']].map(([h,p],i)=><article className="benefit-card" key={h}><span>0{i+1}</span><h3>{locale==='en'?h:['展示支持','车型建议','建立信任','灵活合作'][i]}</h3><p>{locale==='en'?p:['本地化展厅视觉、产品卡片与销售资料支持。','热门配置、颜色建议与面向市场的产品建议。','现场看车、客户接待与合作伙伴图片或视频确认。','适用于展示、推广、经销商支持与本地市场测试。'][i]}</p></article>)}</div><div className="showroom-statement"><span className="eyebrow">HUIVEX / PARTNER NETWORK</span><p>{locale==='en'?'We cooperate with display points and partner locations that help overseas clients see product style, size and finish more intuitively. Visual identity can be localized with HUIVEX branding.':'我们与展示点及合作伙伴合作，帮助海外客户更直观地了解产品造型、尺寸与外观细节。视觉形象可结合HUIVEX品牌进行本地化。'}</p></div><div className="partner-form"><span className="eyebrow">{locale==='en'?'Partner enquiry':'合作咨询'}</span><h2>{locale==='en'?'Tell us about your market.':'请介绍您的市场。'}</h2><QuoteForm locale={locale} t={t} presetType="showroom-partner" /></div></section>}
    {about && <section className="wrap section-space about-page"><div className="about-story"><span className="eyebrow">{locale==='en'?'Our position':'公司定位'}</span><h2 className="font-display">{locale==='en'?'A sourcing partner with a visible process.':'流程清晰的汽车采购伙伴。'}</h2><p>{locale==='en'?'Huivex Auto Global, Ltd. is a China-based automobile sourcing and export service provider. Its mission is to deliver reliable vehicles, transparent pricing and smooth export execution.':'陕西汇驰天下汽车贸易有限公司是一家立足中国的汽车车源及出口服务商。使命是提供可靠车辆、透明价格与顺畅的出口执行。'}</p></div><div className="credentials"><div><span>REGISTERED NAME / EN</span><b>HUIVEX AUTO GLOBAL, LTD</b></div><div><span>REGISTERED NAME / 中文</span><b>陕西汇驰天下汽车贸易有限公司</b></div><div><span>{locale==='en'?'ESTABLISHED':'成立日期'}</span><b>{businessConfig.establishment}</b></div><div><span>{locale==='en'?'REGISTERED CAPITAL':'注册资本'}</span><b>{businessConfig.registeredCapital}</b></div><div><span>{locale==='en'?'ORIGIN / HQ':'总部'}</span><b>{locale==='en'?'Xi’an, China':'中国西安'}</b></div><div><span>{locale==='en'?'BUSINESS SCOPE':'经营范围'}</span><b>{locale==='en'?'Vehicle sales, NEV sales, parts, export support and related services':'车辆销售、新能源汽车销售、零部件、出口支持及相关服务'}</b></div></div><div className="draft-note">{locale==='en'?'Business-license image not displayed. Availability pending approval.':'营业执照图片暂不展示，需确认后方可使用。'}</div><h2 className="font-display team-title">{locale==='en'?'One team, four functions':'一个团队，四项职能'}</h2><div className="transport-grid">{['Trading & Sales','After-sales Service','Logistics & Customs','Finance & Accounting'].map((v,i)=><div key={v}><span>0{i+1}</span><h3>{locale==='en'?v:['贸易销售','售后服务','物流报关','财务会计'][i]}</h3></div>)}</div><blockquote>{t.oneOwner}</blockquote></section>}
  </>;
}

function LegalPage({ kind, locale, t }: { kind: string; locale: Locale; t: typeof copy.en }) {
  return <><PageIntro eyebrow={`HUIVEX / ${kind.toUpperCase()}`} title={kind === 'privacy' ? (locale==='en'?'Privacy notice':'隐私说明') : (locale==='en'?'Terms of use':'使用条款')} text={t.legal} /><section className="wrap legal-draft"><span className="draft-badge">DRAFT / APPROVAL REQUIRED</span><h2>{locale==='en'?'Information to be confirmed before publication':'发布前需确认的信息'}</h2><p>{locale==='en'?'This page is a temporary placeholder. Final policy language, retention periods, data controller details, applicable law and contact channel have not been supplied. Do not treat this draft as legal advice or publish until reviewed and approved.':'此页面为临时占位内容。最终政策语言、数据保留期限、数据控制者信息、适用法律及联系渠道尚未提供。请勿将本草稿视为法律建议，审核批准前不得发布。'}</p><Link href="/contact" className="text-link">{t.contact}<ArrowRight size={15}/></Link></section></>;
}

function NotFound({ locale = 'en', t = copy.en }: { locale?: Locale; t?: typeof copy.en }) {
  return <section className="not-found"><div className="wrap"><span className="eyebrow">HAG / 404</span><h1 className="font-display">Route not found.</h1><p>{locale==='en'?'This page is outside the route map.':'此页面不在当前导航范围内。'}</p><Link href="/" className="button button-gold">{t.back}<ArrowUpRight size={16}/></Link></div></section>;
}

function AppRouter() {
  const { locale, t, change } = useLocale();
  const [location] = useLocation();
  const query = location.split('?')[1] || '';
  useEffect(() => {
    const path = location.split('?')[0];
    const vehicle = path.startsWith('/vehicles/') ? activeVehicles.find((item) => item.slug === path.split('/')[2]) : undefined;
    const pageNames: Record<string, [string, string]> = {
      '/': ['Export Cars from China', '从中国出口汽车'],
      '/vehicles': ['Vehicles for Export', '出口车型'],
      '/services': ['Vehicle Export Services', '汽车出口服务'],
      '/markets': ['Markets and Shipping Routes', '目标市场与运输路线'],
      '/showrooms': ['Showroom Partnerships', '展厅合作'],
      '/about': ['About Huivex Auto Global', '关于汇驰天下'],
      '/contact': ['Request a Vehicle Export Quote', '申请汽车出口报价'],
      '/privacy': ['Privacy Notice', '隐私说明'],
      '/terms': ['Terms of Use', '使用条款'],
    };
    const pageName = vehicle
      ? [`${vehicle.model} for Export`, `${vehicle.model} 出口车型`]
      : pageNames[path] ?? ['Page not found', '页面未找到'];
    const title = `${pageName[locale === 'en' ? 0 : 1]} | Huivex Auto Global`;
    const description = locale === 'en'
      ? `${pageName[0]}. Vehicle sourcing and export support from Xi’an, China. Contact Huivex Auto Global to discuss your requirements.`
      : `${pageName[1]}。汇驰天下提供立足中国的汽车采购与出口支持，欢迎联系沟通需求。`;
    document.title = title;
    document.documentElement.lang = locale === 'en' ? 'en' : 'zh-CN';
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description);
  }, [location, locale]);
  return <ErrorBoundary resetKey={location}><PageFrame locale={locale} t={t} change={change}>
    <Switch>
      <Route path="/"><HomePage locale={locale} t={t}/></Route>
      <Route path="/vehicles"><CatalogPage locale={locale} t={t}/></Route>
      <Route path="/vehicles/:slug"><VehicleDetail locale={locale} t={t}/></Route>
      <Route path="/services"><GenericPage kind="services" locale={locale} t={t}/></Route>
      <Route path="/markets"><GenericPage kind="markets" locale={locale} t={t}/></Route>
      <Route path="/showrooms"><GenericPage kind="showrooms" locale={locale} t={t}/></Route>
      <Route path="/about"><GenericPage kind="about" locale={locale} t={t}/></Route>
      <Route path="/contact"><ContactPage locale={locale} t={t} query={query}/></Route>
      <Route path="/privacy"><LegalPage kind="privacy" locale={locale} t={t}/></Route>
      <Route path="/terms"><LegalPage kind="terms" locale={locale} t={t}/></Route>
      <Route path="/404"><NotFound locale={locale} t={t}/></Route>
      <Route><NotFound locale={locale} t={t}/></Route>
    </Switch>
  </PageFrame></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><AppRouter /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;