export type Vehicle = {
  slug: string; model: string; category: string; brand: string; descriptor: string;
  powertrain: string; featured?: boolean; confirm?: boolean;
};

export const vehicles: Vehicle[] = [
  { slug: 'zeekr-9x', model: 'Zeekr 9X', category: 'Flagship SUV', brand: 'Zeekr', descriptor: 'Luxury full-size SUV', powertrain: 'EV / extended-range', featured: true, confirm: true },
  { slug: 'rox-01', model: 'ROX 01', category: 'Flagship SUV', brand: 'ROX', descriptor: 'Extended-range flagship SUV', powertrain: 'Extended-range', featured: true },
  { slug: 'xiaomi-pengcheng-n90', model: 'Xiaomi Pengcheng N90', category: 'Flagship SUV', brand: 'Xiaomi', descriptor: 'Next-generation flagship SUV', powertrain: 'Confirm with client', confirm: true },
  { slug: 'xiaomi-su7-ev', model: 'Xiaomi SU7 EV', category: 'EV Sedan', brand: 'Xiaomi', descriptor: 'High-performance EV sedan', powertrain: 'EV', featured: true },
  { slug: 'avatr-12', model: 'Avatr 12', category: 'EV Sedan', brand: 'Avatr', descriptor: 'Modern intelligent electric sedan', powertrain: 'EV', featured: true },
  { slug: 'byd-tang-l', model: 'BYD Tang L', category: 'EV Crossover', brand: 'BYD', descriptor: 'Modern intelligent EV crossover', powertrain: 'EV', featured: true },
  { slug: 'toyota-rav4', model: 'Toyota RAV4', category: 'Toyota', brand: 'Toyota', descriptor: 'High-demand SUV', powertrain: 'Confirm with client', featured: true, confirm: true },
  { slug: 'toyota-corolla-cross', model: 'Toyota Corolla Cross', category: 'Toyota', brand: 'Toyota', descriptor: 'Compact crossover', powertrain: 'Confirm with client', confirm: true },
  { slug: 'toyota-corolla', model: 'Toyota Corolla', category: 'Toyota', brand: 'Toyota', descriptor: 'Sedan', powertrain: 'Confirm with client', confirm: true },
  { slug: 'bmw-x5', model: 'BMW X5', category: 'Premium', brand: 'BMW', descriptor: 'Premium mid-size SUV', powertrain: 'Confirm with client', featured: true, confirm: true },
  { slug: 'mercedes-benz-glc', model: 'Mercedes-Benz GLC', category: 'Premium', brand: 'Mercedes-Benz', descriptor: 'Premium mid-size SUV', powertrain: 'Confirm with client', confirm: true },
  { slug: 'ford-raptor-f-150', model: 'Ford Raptor F-150', category: 'Pickup', brand: 'Ford', descriptor: 'Large-format vehicle for rugged markets', powertrain: 'Confirm with client', featured: true, confirm: true },
  { slug: 'nissan-frontier-pro-phev', model: 'Nissan Frontier Pro PHEV', category: 'Pickup', brand: 'Nissan', descriptor: 'Spacious all-purpose vehicle', powertrain: 'PHEV', confirm: true },
  { slug: 'jetour-traveler', model: 'Jetour Traveler', category: 'Gasoline', brand: 'Jetour', descriptor: 'Adventure-style gasoline SUV', powertrain: 'Gasoline' },
  { slug: 'geely-coolray-15t', model: 'Geely Coolray 1.5T', category: 'Gasoline', brand: 'Geely', descriptor: 'Reliable market favorite', powertrain: 'Gasoline', featured: true },
  { slug: 'chinese-passenger-van', model: 'Chinese Passenger Van', category: 'Utility / Van', brand: 'Multiple brands', descriptor: 'Comfortable & spacious', powertrain: 'Confirm with client', confirm: true },
  { slug: 'chinese-commercial-van', model: 'Chinese Commercial Van', category: 'Utility / Van', brand: 'Multiple brands', descriptor: 'Reliable & efficient', powertrain: 'Confirm with client', confirm: true },
  { slug: 'gac-gasoline-mpv', model: 'GAC Gasoline MPV', category: 'MPV', brand: 'GAC', descriptor: 'Comfortable & spacious', powertrain: 'Gasoline' },
  { slug: 'denza-ev-mpv', model: 'Denza EV MPV', category: 'MPV', brand: 'Denza', descriptor: 'Luxury & intelligent', powertrain: 'EV' },
  { slug: 'howo-truck', model: 'HOWO Truck', category: 'Commercial', brand: 'HOWO', descriptor: 'Heavy duty & reliable', powertrain: 'Confirm with client', confirm: true },
  { slug: 'commercial-crane', model: 'Commercial Crane', category: 'Commercial', brand: 'Multiple brands', descriptor: 'Strong lifting capacity', powertrain: 'Confirm with client', confirm: true },
];

// Confirm these public contact details and operational values before launch.
export const businessConfig = {
  whatsappEnabled: false,
  wechatEnabled: false,
  showLicense: false,
  contactPerson: 'PENDING CONFIRMATION',
  phone: 'PENDING CONFIRMATION',
  whatsapp: 'PENDING CONFIRMATION',
  wechat: 'PENDING CONFIRMATION',
  email: 'PENDING CONFIRMATION',
  addressZh: '陕西省西安市浐灞生态区东三环立交通塬路1680号浐灞汽车主题公园内以西6号',
  addressEn: 'English address pending client confirmation',
  establishment: '17 June 2026',
  registeredCapital: 'RMB 1,000,000',
};

export const destinationCountries = [
  { code: 'RU', en: 'Russia', zh: '俄罗斯' }, { code: 'KZ', en: 'Kazakhstan', zh: '哈萨克斯坦' },
  { code: 'UZ', en: 'Uzbekistan', zh: '乌兹别克斯坦' }, { code: 'TM', en: 'Turkmenistan', zh: '土库曼斯坦' },
  { code: 'IR', en: 'Iran', zh: '伊朗' }, { code: 'IQ', en: 'Iraq', zh: '伊拉克' },
  { code: 'PK', en: 'Pakistan', zh: '巴基斯坦' }, { code: 'SA', en: 'Saudi Arabia', zh: '沙特阿拉伯' },
  { code: 'AE', en: 'United Arab Emirates', zh: '阿联酋' }, { code: 'DZ', en: 'Algeria', zh: '阿尔及利亚' },
  { code: 'CO', en: 'Colombia', zh: '哥伦比亚' }, { code: 'BR', en: 'Brazil', zh: '巴西' },
];