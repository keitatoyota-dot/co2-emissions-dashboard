/**
 * 業界テンプレート定義
 * 
 * 設計思想: テンプレートとデータの分離
 * - 各業界は「どのデータ項目を入力するか」を定義する
 * - 計算ロジックは共通で、排出係数のみが項目ごとに異なる
 * - 新しい業界テンプレートを追加する際は、このファイルに定義を追加するだけ
 */

export type ScopeType = 'scope1' | 'scope2' | 'scope3';

export interface EmissionItem {
  id: string;
  name: string;
  unit: string;
  scope: ScopeType;
  emissionFactor: number; // kgCO2e per unit
  description: string;
  placeholder?: string;
}

export interface IndustryTemplate {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  imageUrl: string;
  items: EmissionItem[];
  benchmarks: {
    scope1PerEmployee: number; // kgCO2e/人/年
    scope2PerEmployee: number;
    scope3PerEmployee: number;
    totalPerEmployee: number;
  };
}

export interface DemoCompany {
  id: string;
  name: string;
  industry: string;
  templateId: string;
  employees: number;
  description: string;
  monthlyData: MonthlyEmissionData[];
  reductionTarget: {
    baseYear: number;
    targetYear: number;
    reductionRate: number; // %
    baseEmission: number; // kgCO2e/年
  };
}

export interface MonthlyEmissionData {
  month: string; // "2025-01" format
  entries: { itemId: string; value: number }[];
}

// ===== 業界テンプレート定義 =====

const IMAGES = {
  manufacturing: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663328488369/YXLp63tB2vrCWpgV7unZMi/industry-manufacturing-jdreJzZBzdtEfyChje2JdY.webp',
  office: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663328488369/YXLp63tB2vrCWpgV7unZMi/industry-office-QAMPfyQ4zS2iaH2QeW7jxv.webp',
  retail: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663328488369/YXLp63tB2vrCWpgV7unZMi/industry-retail-eSGFfYk68wm7Mvfd9334xV.webp',
};

export const industryTemplates: IndustryTemplate[] = [
  {
    id: 'office',
    name: 'IT・オフィス業',
    nameEn: 'IT / Office',
    description: 'IT企業、コンサルティング、金融、一般事務所など、オフィスワーク中心の業種向けテンプレート',
    icon: '🏢',
    imageUrl: IMAGES.office,
    items: [
      // Scope 1: 直接排出
      { id: 'office-gas', name: '都市ガス（空調・給湯）', unit: 'm³', scope: 'scope1', emissionFactor: 2.23, description: 'オフィスビルの空調・給湯用都市ガス使用量', placeholder: '500' },
      { id: 'office-vehicle-gasoline', name: '社用車（ガソリン）', unit: 'L', scope: 'scope1', emissionFactor: 2.32, description: '社用車のガソリン消費量', placeholder: '200' },
      // Scope 2: 電力由来の間接排出
      { id: 'office-electricity', name: '電力使用量', unit: 'kWh', scope: 'scope2', emissionFactor: 0.457, description: 'オフィスの電力使用量（照明・空調・OA機器等）', placeholder: '8000' },
      // Scope 3: サプライチェーン排出
      { id: 'office-commute-train', name: '従業員通勤（電車）', unit: '人km', scope: 'scope3', emissionFactor: 0.017, description: '従業員の電車通勤距離の合計', placeholder: '15000' },
      { id: 'office-commute-car', name: '従業員通勤（自動車）', unit: '人km', scope: 'scope3', emissionFactor: 0.133, description: '従業員の自動車通勤距離の合計', placeholder: '3000' },
      { id: 'office-travel-air', name: '出張（航空機）', unit: '人km', scope: 'scope3', emissionFactor: 0.11, description: '出張における航空機の搭乗距離合計', placeholder: '20000' },
      { id: 'office-travel-shinkansen', name: '出張（新幹線）', unit: '人km', scope: 'scope3', emissionFactor: 0.029, description: '出張における新幹線の乗車距離合計', placeholder: '10000' },
      { id: 'office-paper', name: '用紙購入量', unit: 'kg', scope: 'scope3', emissionFactor: 1.48, description: 'コピー用紙等の購入量', placeholder: '100' },
      { id: 'office-waste', name: '一般廃棄物', unit: 'kg', scope: 'scope3', emissionFactor: 0.63, description: 'オフィスから排出される一般廃棄物量', placeholder: '500' },
    ],
    benchmarks: {
      scope1PerEmployee: 120,
      scope2PerEmployee: 880,
      scope3PerEmployee: 1500,
      totalPerEmployee: 2500,
    },
  },
  {
    id: 'manufacturing',
    name: '製造業',
    nameEn: 'Manufacturing',
    description: '工場を持つ製造業向けテンプレート。電力・燃料の直接使用量が大きい業種に最適',
    icon: '🏭',
    imageUrl: IMAGES.manufacturing,
    items: [
      // Scope 1: 直接排出
      { id: 'mfg-gas', name: '都市ガス（工場）', unit: 'm³', scope: 'scope1', emissionFactor: 2.23, description: '工場の加熱・乾燥工程等の都市ガス使用量', placeholder: '5000' },
      { id: 'mfg-heavy-oil', name: 'A重油', unit: 'L', scope: 'scope1', emissionFactor: 2.71, description: 'ボイラー等のA重油使用量', placeholder: '3000' },
      { id: 'mfg-lpg', name: 'LPG（プロパンガス）', unit: 'kg', scope: 'scope1', emissionFactor: 3.0, description: '工場で使用するLPG量', placeholder: '1000' },
      { id: 'mfg-vehicle-diesel', name: '社用車・フォークリフト（軽油）', unit: 'L', scope: 'scope1', emissionFactor: 2.58, description: '構内車両・フォークリフト等の軽油消費量', placeholder: '800' },
      { id: 'mfg-vehicle-gasoline', name: '社用車（ガソリン）', unit: 'L', scope: 'scope1', emissionFactor: 2.32, description: '社用車のガソリン消費量', placeholder: '300' },
      // Scope 2: 電力由来の間接排出
      { id: 'mfg-electricity', name: '電力使用量', unit: 'kWh', scope: 'scope2', emissionFactor: 0.457, description: '工場・事務所の電力使用量合計', placeholder: '50000' },
      // Scope 3: サプライチェーン排出
      { id: 'mfg-raw-material', name: '原材料調達（鉄鋼）', unit: 'ton', scope: 'scope3', emissionFactor: 1800, description: '鉄鋼系原材料の調達量', placeholder: '10' },
      { id: 'mfg-raw-plastic', name: '原材料調達（プラスチック）', unit: 'ton', scope: 'scope3', emissionFactor: 2500, description: 'プラスチック系原材料の調達量', placeholder: '5' },
      { id: 'mfg-logistics', name: '製品輸送（トラック）', unit: 'tkm', scope: 'scope3', emissionFactor: 0.167, description: '製品輸送のトンキロ（重量×距離）', placeholder: '50000' },
      { id: 'mfg-waste-industrial', name: '産業廃棄物', unit: 'ton', scope: 'scope3', emissionFactor: 290, description: '工場から排出される産業廃棄物量', placeholder: '20' },
      { id: 'mfg-commute', name: '従業員通勤', unit: '人km', scope: 'scope3', emissionFactor: 0.075, description: '従業員の通勤距離合計（平均交通手段）', placeholder: '30000' },
    ],
    benchmarks: {
      scope1PerEmployee: 3500,
      scope2PerEmployee: 5500,
      scope3PerEmployee: 12000,
      totalPerEmployee: 21000,
    },
  },
  {
    id: 'retail',
    name: '小売・流通業',
    nameEn: 'Retail / Distribution',
    description: '店舗・倉庫を持つ小売業・流通業向けテンプレート。冷蔵設備・物流が主要排出源',
    icon: '🏪',
    imageUrl: IMAGES.retail,
    items: [
      // Scope 1: 直接排出
      { id: 'retail-gas', name: '都市ガス（店舗）', unit: 'm³', scope: 'scope1', emissionFactor: 2.23, description: '店舗の調理・空調用都市ガス使用量', placeholder: '2000' },
      { id: 'retail-refrigerant', name: '冷媒漏洩（HFC）', unit: 'kg', scope: 'scope1', emissionFactor: 1430, description: '冷蔵・冷凍設備からの冷媒漏洩量（HFC-134a相当）', placeholder: '5' },
      { id: 'retail-vehicle', name: '配送車両（軽油）', unit: 'L', scope: 'scope1', emissionFactor: 2.58, description: '自社配送車両の軽油消費量', placeholder: '2000' },
      // Scope 2: 電力由来の間接排出
      { id: 'retail-electricity-store', name: '電力使用量（店舗）', unit: 'kWh', scope: 'scope2', emissionFactor: 0.457, description: '全店舗の電力使用量合計（照明・冷蔵・空調）', placeholder: '30000' },
      { id: 'retail-electricity-warehouse', name: '電力使用量（倉庫）', unit: 'kWh', scope: 'scope2', emissionFactor: 0.457, description: '倉庫・物流センターの電力使用量', placeholder: '15000' },
      // Scope 3: サプライチェーン排出
      { id: 'retail-procurement-food', name: '食品仕入れ', unit: 'ton', scope: 'scope3', emissionFactor: 3200, description: '食品の仕入れ量（加工食品含む）', placeholder: '50' },
      { id: 'retail-procurement-goods', name: '日用品仕入れ', unit: 'ton', scope: 'scope3', emissionFactor: 1800, description: '日用品・雑貨等の仕入れ量', placeholder: '30' },
      { id: 'retail-logistics-inbound', name: '仕入物流', unit: 'tkm', scope: 'scope3', emissionFactor: 0.167, description: '仕入先から倉庫・店舗への輸送トンキロ', placeholder: '80000' },
      { id: 'retail-packaging', name: '包装資材', unit: 'ton', scope: 'scope3', emissionFactor: 1500, description: 'レジ袋・段ボール等の包装資材使用量', placeholder: '10' },
      { id: 'retail-food-waste', name: '食品廃棄', unit: 'ton', scope: 'scope3', emissionFactor: 580, description: '売れ残り・期限切れ等の食品廃棄量', placeholder: '8' },
      { id: 'retail-commute', name: '従業員通勤', unit: '人km', scope: 'scope3', emissionFactor: 0.075, description: '従業員の通勤距離合計（平均交通手段）', placeholder: '20000' },
    ],
    benchmarks: {
      scope1PerEmployee: 2000,
      scope2PerEmployee: 4200,
      scope3PerEmployee: 15000,
      totalPerEmployee: 21200,
    },
  },
];

// ===== 架空モデルケース企業 =====

export const demoCompanies: DemoCompany[] = [
  {
    id: 'techoffice',
    name: '株式会社グリーンテック',
    industry: 'ITサービス・ソフトウェア開発',
    templateId: 'office',
    employees: 50,
    description: '従業員50名のITサービス企業。東京都内にオフィスを構え、自社プロダクトの開発・運用を行う。2030年までにCO2排出量30%削減を目標に掲げている。',
    reductionTarget: {
      baseYear: 2024,
      targetYear: 2030,
      reductionRate: 30,
      baseEmission: 125000,
    },
    monthlyData: generateOfficeMonthlyData(),
  },
  {
    id: 'yamada-mfg',
    name: '山田精密工業株式会社',
    industry: '精密機器製造',
    templateId: 'manufacturing',
    employees: 200,
    description: '従業員200名の精密機器メーカー。埼玉県に本社工場を持ち、自動車部品・電子部品の精密加工を行う。SBT（Science Based Targets）に基づく削減目標を設定。',
    reductionTarget: {
      baseYear: 2024,
      targetYear: 2030,
      reductionRate: 42,
      baseEmission: 4200000,
    },
    monthlyData: generateManufacturingMonthlyData(),
  },
  {
    id: 'sakura-retail',
    name: 'さくらマート株式会社',
    industry: '食品スーパーマーケット',
    templateId: 'retail',
    employees: 120,
    description: '従業員120名の地域密着型食品スーパー。神奈川県内に5店舗と物流センター1拠点を運営。冷蔵設備の省エネ化と食品ロス削減に注力。',
    reductionTarget: {
      baseYear: 2024,
      targetYear: 2030,
      reductionRate: 35,
      baseEmission: 2540000,
    },
    monthlyData: generateRetailMonthlyData(),
  },
];

// ===== モデルケースデータ生成関数 =====

function generateOfficeMonthlyData(): MonthlyEmissionData[] {
  const months: MonthlyEmissionData[] = [];
  const baseValues: Record<string, { base: number; seasonalFactor: number[] }> = {
    'office-gas': { base: 400, seasonalFactor: [1.8, 1.6, 1.2, 0.6, 0.3, 0.2, 0.2, 0.2, 0.3, 0.6, 1.0, 1.5] },
    'office-vehicle-gasoline': { base: 180, seasonalFactor: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
    'office-electricity': { base: 7000, seasonalFactor: [1.1, 1.0, 0.9, 0.85, 0.9, 1.2, 1.4, 1.5, 1.3, 0.95, 0.9, 1.0] },
    'office-commute-train': { base: 14000, seasonalFactor: [1, 1, 1, 1, 1, 1, 1, 0.7, 1, 1, 1, 1] },
    'office-commute-car': { base: 2800, seasonalFactor: [1, 1, 1, 1, 1, 1, 1, 0.7, 1, 1, 1, 1] },
    'office-travel-air': { base: 15000, seasonalFactor: [0.8, 0.9, 1.2, 1.0, 1.1, 1.3, 0.7, 0.5, 1.2, 1.1, 1.0, 0.6] },
    'office-travel-shinkansen': { base: 8000, seasonalFactor: [0.8, 0.9, 1.2, 1.0, 1.1, 1.3, 0.7, 0.5, 1.2, 1.1, 1.0, 0.6] },
    'office-paper': { base: 80, seasonalFactor: [1.1, 1, 1.2, 1.3, 1, 0.9, 0.8, 0.7, 1.1, 1, 1.1, 1.2] },
    'office-waste': { base: 450, seasonalFactor: [1, 1, 1, 1, 1, 1, 1, 0.8, 1, 1, 1, 1.2] },
  };

  for (let y = 2024; y <= 2025; y++) {
    for (let m = 1; m <= 12; m++) {
      if (y === 2025 && m > 12) break;
      const monthStr = `${y}-${String(m).padStart(2, '0')}`;
      const entries = Object.entries(baseValues).map(([itemId, config]) => {
        const seasonal = config.seasonalFactor[(m - 1) % 12];
        const yearFactor = y === 2025 ? 0.95 : 1; // 2025年は5%削減
        const noise = 0.9 + Math.random() * 0.2;
        return { itemId, value: Math.round(config.base * seasonal * yearFactor * noise) };
      });
      months.push({ month: monthStr, entries });
    }
  }
  return months;
}

function generateManufacturingMonthlyData(): MonthlyEmissionData[] {
  const months: MonthlyEmissionData[] = [];
  const baseValues: Record<string, { base: number; seasonalFactor: number[] }> = {
    'mfg-gas': { base: 4500, seasonalFactor: [1.2, 1.1, 1.0, 0.9, 0.85, 0.8, 0.8, 0.8, 0.85, 0.9, 1.0, 1.15] },
    'mfg-heavy-oil': { base: 2800, seasonalFactor: [1.1, 1.1, 1.0, 0.95, 0.9, 0.85, 0.85, 0.85, 0.9, 0.95, 1.0, 1.1] },
    'mfg-lpg': { base: 900, seasonalFactor: [1.1, 1.0, 1.0, 0.95, 0.9, 0.9, 0.9, 0.9, 0.95, 1.0, 1.0, 1.1] },
    'mfg-vehicle-diesel': { base: 700, seasonalFactor: [1, 1, 1, 1, 1, 1, 1, 0.8, 1, 1, 1, 1] },
    'mfg-vehicle-gasoline': { base: 250, seasonalFactor: [1, 1, 1, 1, 1, 1, 1, 0.8, 1, 1, 1, 1] },
    'mfg-electricity': { base: 45000, seasonalFactor: [1.0, 1.0, 0.95, 0.9, 0.95, 1.1, 1.2, 1.25, 1.15, 0.95, 0.95, 1.0] },
    'mfg-raw-material': { base: 8, seasonalFactor: [1, 1, 1.1, 1.1, 1, 1, 0.9, 0.7, 1, 1.1, 1, 1] },
    'mfg-raw-plastic': { base: 4, seasonalFactor: [1, 1, 1.1, 1.1, 1, 1, 0.9, 0.7, 1, 1.1, 1, 1] },
    'mfg-logistics': { base: 45000, seasonalFactor: [0.9, 0.9, 1.0, 1.1, 1.0, 1.0, 0.9, 0.7, 1.0, 1.1, 1.1, 1.2] },
    'mfg-waste-industrial': { base: 18, seasonalFactor: [1, 1, 1, 1, 1, 1, 1, 0.8, 1, 1, 1, 1] },
    'mfg-commute': { base: 28000, seasonalFactor: [1, 1, 1, 1, 1, 1, 1, 0.7, 1, 1, 1, 1] },
  };

  for (let y = 2024; y <= 2025; y++) {
    for (let m = 1; m <= 12; m++) {
      const monthStr = `${y}-${String(m).padStart(2, '0')}`;
      const entries = Object.entries(baseValues).map(([itemId, config]) => {
        const seasonal = config.seasonalFactor[(m - 1) % 12];
        const yearFactor = y === 2025 ? 0.93 : 1;
        const noise = 0.92 + Math.random() * 0.16;
        return { itemId, value: Math.round(config.base * seasonal * yearFactor * noise * 10) / 10 };
      });
      months.push({ month: monthStr, entries });
    }
  }
  return months;
}

function generateRetailMonthlyData(): MonthlyEmissionData[] {
  const months: MonthlyEmissionData[] = [];
  const baseValues: Record<string, { base: number; seasonalFactor: number[] }> = {
    'retail-gas': { base: 1800, seasonalFactor: [1.3, 1.2, 1.0, 0.7, 0.5, 0.4, 0.4, 0.4, 0.5, 0.7, 1.0, 1.2] },
    'retail-refrigerant': { base: 3, seasonalFactor: [0.5, 0.5, 0.7, 0.8, 1.0, 1.3, 1.5, 1.5, 1.3, 1.0, 0.7, 0.5] },
    'retail-vehicle': { base: 1800, seasonalFactor: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.1, 1.1, 1.0, 1.0, 1.0, 1.2] },
    'retail-electricity-store': { base: 28000, seasonalFactor: [1.0, 1.0, 0.95, 0.9, 0.95, 1.15, 1.3, 1.35, 1.2, 0.95, 0.95, 1.0] },
    'retail-electricity-warehouse': { base: 13000, seasonalFactor: [1.0, 1.0, 0.95, 0.9, 0.95, 1.1, 1.2, 1.25, 1.15, 0.95, 0.95, 1.0] },
    'retail-procurement-food': { base: 45, seasonalFactor: [0.9, 0.9, 1.0, 1.0, 1.0, 1.0, 1.1, 1.1, 1.0, 1.0, 1.0, 1.2] },
    'retail-procurement-goods': { base: 25, seasonalFactor: [0.8, 0.8, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.1, 1.3] },
    'retail-logistics-inbound': { base: 70000, seasonalFactor: [0.9, 0.9, 1.0, 1.0, 1.0, 1.0, 1.1, 1.1, 1.0, 1.0, 1.0, 1.2] },
    'retail-packaging': { base: 8, seasonalFactor: [0.9, 0.9, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.1, 1.3] },
    'retail-food-waste': { base: 7, seasonalFactor: [0.8, 0.8, 0.9, 1.0, 1.0, 1.1, 1.3, 1.3, 1.1, 1.0, 0.9, 1.0] },
    'retail-commute': { base: 18000, seasonalFactor: [1, 1, 1, 1, 1, 1, 1, 0.8, 1, 1, 1, 1] },
  };

  for (let y = 2024; y <= 2025; y++) {
    for (let m = 1; m <= 12; m++) {
      const monthStr = `${y}-${String(m).padStart(2, '0')}`;
      const entries = Object.entries(baseValues).map(([itemId, config]) => {
        const seasonal = config.seasonalFactor[(m - 1) % 12];
        const yearFactor = y === 2025 ? 0.94 : 1;
        const noise = 0.91 + Math.random() * 0.18;
        return { itemId, value: Math.round(config.base * seasonal * yearFactor * noise * 10) / 10 };
      });
      months.push({ month: monthStr, entries });
    }
  }
  return months;
}

// ===== ユーティリティ関数 =====

export function getTemplate(templateId: string): IndustryTemplate | undefined {
  return industryTemplates.find(t => t.id === templateId);
}

export function getDemoCompany(companyId: string): DemoCompany | undefined {
  return demoCompanies.find(c => c.id === companyId);
}

export function calculateMonthlyEmissions(
  template: IndustryTemplate,
  entries: { itemId: string; value: number }[]
): { scope1: number; scope2: number; scope3: number; total: number; byItem: Record<string, number> } {
  let scope1 = 0, scope2 = 0, scope3 = 0;
  const byItem: Record<string, number> = {};

  for (const entry of entries) {
    const item = template.items.find(i => i.id === entry.itemId);
    if (!item) continue;
    const emission = entry.value * item.emissionFactor;
    byItem[entry.itemId] = emission;
    if (item.scope === 'scope1') scope1 += emission;
    else if (item.scope === 'scope2') scope2 += emission;
    else scope3 += emission;
  }

  return { scope1, scope2, scope3, total: scope1 + scope2 + scope3, byItem };
}

export function calculateAnnualSummary(
  template: IndustryTemplate,
  monthlyData: MonthlyEmissionData[],
  year: number
): {
  monthly: { month: string; scope1: number; scope2: number; scope3: number; total: number }[];
  annual: { scope1: number; scope2: number; scope3: number; total: number };
} {
  const yearData = monthlyData.filter(d => d.month.startsWith(String(year)));
  const monthly = yearData.map(d => {
    const calc = calculateMonthlyEmissions(template, d.entries);
    return { month: d.month, ...calc };
  });
  const annual = monthly.reduce(
    (acc, m) => ({
      scope1: acc.scope1 + m.scope1,
      scope2: acc.scope2 + m.scope2,
      scope3: acc.scope3 + m.scope3,
      total: acc.total + m.total,
    }),
    { scope1: 0, scope2: 0, scope3: 0, total: 0 }
  );
  return { monthly, annual };
}

export function formatNumber(num: number, decimals = 0): string {
  return num.toLocaleString('ja-JP', { maximumFractionDigits: decimals });
}

export function formatTonnes(kgCO2e: number): string {
  if (kgCO2e >= 1000) {
    return `${(kgCO2e / 1000).toLocaleString('ja-JP', { maximumFractionDigits: 1 })} tCO2e`;
  }
  return `${kgCO2e.toLocaleString('ja-JP', { maximumFractionDigits: 0 })} kgCO2e`;
}
