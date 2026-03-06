/**
 * Calculator.tsx — 自社データ入力フォーム
 *
 * 3ステップで自社のCO2排出量を算定・可視化
 *   Step 1: 業界テンプレート選択
 *   Step 2: 企業情報入力（従業員数・削減目標）
 *   Step 3: 月次排出量データ入力 & ダッシュボード表示
 *
 * 入力データは LocalStorage に保存され、次回アクセス時も保持される。
 */
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  industryTemplates,
  calculateMonthlyEmissions,
  formatTonnes,
  formatNumber,
  type MonthlyEmissionData,
} from "@/lib/industry-templates";
import { motion } from "framer-motion";
import {
  Building2,
  Factory,
  Store,
  Check,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  BarChart3,
  Target,
  Flame,
  Zap,
  Truck,
  TrendingDown,
  TrendingUp,
  Download,
  RotateCcw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ===== 型定義 =====

interface ReductionTarget {
  baseYear: number;
  targetYear: number;
  reductionRate: number;
  baseEmission: number; // kgCO2e
}

interface UserData {
  templateId: string;
  companyName: string;
  employees: number;
  reductionTarget: ReductionTarget;
  /** "2025-01" -> { itemId -> 入力文字列 } */
  monthlyEntries: Record<string, Record<string, string>>;
}

const DEFAULT_DATA: UserData = {
  templateId: "",
  companyName: "",
  employees: 50,
  reductionTarget: {
    baseYear: 2024,
    targetYear: 2030,
    reductionRate: 30,
    baseEmission: 0,
  },
  monthlyEntries: {},
};

// ===== 定数 =====

const SCOPE_COLORS = {
  scope1: "#0d9488",
  scope2: "#10b981",
  scope3: "#f59e0b",
};

const industryIcons: Record<string, React.ReactNode> = {
  office: <Building2 className="w-6 h-6" />,
  manufacturing: <Factory className="w-6 h-6" />,
  retail: <Store className="w-6 h-6" />,
};

// ===== ユーティリティ =====

function toMonthlyData(
  monthlyEntries: Record<string, Record<string, string>>
): MonthlyEmissionData[] {
  return Object.entries(monthlyEntries)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, items]) => ({
      month,
      entries: Object.entries(items)
        .filter(([, v]) => v !== "" && !isNaN(Number(v)) && Number(v) > 0)
        .map(([itemId, value]) => ({ itemId, value: Number(value) })),
    }));
}

function currentYearMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

// ===== ステップインジケーター =====

function StepIndicator({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "テンプレート選択" },
    { n: 2, label: "企業情報" },
    { n: 3, label: "データ入力・結果" },
  ] as const;

  return (
    <div className="flex items-center justify-center mb-10">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                currentStep > s.n
                  ? "bg-teal-600 text-white"
                  : currentStep === s.n
                  ? "bg-teal-600 text-white ring-4 ring-teal-100"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {currentStep > s.n ? <Check className="w-4 h-4" /> : s.n}
            </div>
            <span
              className={`text-xs hidden sm:block ${
                currentStep === s.n
                  ? "text-teal-700 font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-16 sm:w-24 h-0.5 mb-5 mx-2 transition-colors ${
                currentStep > s.n ? "bg-teal-600" : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ===== Step 1: テンプレート選択 =====

function Step1({
  userData,
  setUserData,
  onNext,
}: {
  userData: UserData;
  setUserData: (d: UserData) => void;
  onNext: () => void;
}) {
  const handleSelect = (templateId: string) => {
    const isChanging =
      userData.templateId && userData.templateId !== templateId;
    const hasEntries = Object.keys(userData.monthlyEntries).length > 0;

    if (isChanging && hasEntries) {
      if (
        !confirm(
          "テンプレートを変更すると、入力済みの月次データがリセットされます。よろしいですか？"
        )
      ) {
        return;
      }
      setUserData({ ...userData, templateId, monthlyEntries: {} });
    } else {
      setUserData({ ...userData, templateId });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold mb-2">業界テンプレートを選択</h2>
      <p className="text-muted-foreground mb-8">
        貴社の業種に最も近いテンプレートを選んでください。
        テンプレートにより入力項目と排出係数が自動的に設定されます。
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {industryTemplates.map((template) => {
          const isSelected = userData.templateId === template.id;
          return (
            <button
              key={template.id}
              onClick={() => handleSelect(template.id)}
              className={`text-left rounded-2xl border-2 overflow-hidden transition-all duration-200 hover:shadow-lg ${
                isSelected
                  ? "border-teal-500 shadow-lg shadow-teal-100"
                  : "border-border hover:border-teal-200"
              }`}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={template.imageUrl}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        isSelected
                          ? "bg-teal-600 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {industryIcons[template.id]}
                    </div>
                    <div>
                      <div className="font-bold">{template.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {template.nameEn}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {template.description}
                </p>
                <div className="mt-3 flex gap-2 text-xs text-muted-foreground">
                  <span className="px-2 py-0.5 rounded bg-muted">
                    {template.items.length}項目
                  </span>
                  <span className="px-2 py-0.5 rounded bg-muted">
                    Scope 1·2·3
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button
          size="lg"
          className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
          disabled={!userData.templateId}
          onClick={onNext}
        >
          次へ：企業情報 <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

// ===== Step 2: 企業情報入力 =====

function Step2({
  userData,
  setUserData,
  onBack,
  onNext,
}: {
  userData: UserData;
  setUserData: (d: UserData) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const template = industryTemplates.find((t) => t.id === userData.templateId)!;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold mb-2">企業情報を入力</h2>
      <p className="text-muted-foreground mb-8">
        削減目標は任意です。設定するとダッシュボードで目標達成率を確認できます。
      </p>

      <div className="max-w-2xl space-y-6">
        {/* 基本情報 */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold">基本情報</h3>
            <div>
              <Label htmlFor="companyName">会社名（任意）</Label>
              <Input
                id="companyName"
                placeholder="例：株式会社サンプル"
                value={userData.companyName}
                onChange={(e) =>
                  setUserData({ ...userData, companyName: e.target.value })
                }
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="employees">
                従業員数 <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2 mt-1.5">
                <Input
                  id="employees"
                  type="number"
                  min={1}
                  placeholder="例：50"
                  value={userData.employees || ""}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      employees: parseInt(e.target.value) || 0,
                    })
                  }
                  className="max-w-[160px]"
                />
                <span className="text-muted-foreground text-sm">名</span>
              </div>
            </div>
            <div>
              <Label>選択中のテンプレート</Label>
              <div className="mt-1.5 flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-50 border border-teal-100 text-teal-700 text-sm w-fit">
                {industryIcons[template.id]}
                <span className="font-medium">{template.name}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 削減目標 */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <h3 className="font-bold">削減目標（任意）</h3>
              <p className="text-xs text-muted-foreground mt-1">
                基準年排出量を入力すると目標達成率が表示されます
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="baseYear">基準年</Label>
                <Input
                  id="baseYear"
                  type="number"
                  value={userData.reductionTarget.baseYear}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      reductionTarget: {
                        ...userData.reductionTarget,
                        baseYear: parseInt(e.target.value) || 2024,
                      },
                    })
                  }
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="targetYear">目標年</Label>
                <Input
                  id="targetYear"
                  type="number"
                  value={userData.reductionTarget.targetYear}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      reductionTarget: {
                        ...userData.reductionTarget,
                        targetYear: parseInt(e.target.value) || 2030,
                      },
                    })
                  }
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="reductionRate">削減目標率</Label>
                <div className="flex items-center gap-2 mt-1.5">
                  <Input
                    id="reductionRate"
                    type="number"
                    min={1}
                    max={100}
                    value={userData.reductionTarget.reductionRate}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        reductionTarget: {
                          ...userData.reductionTarget,
                          reductionRate: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="max-w-[120px]"
                  />
                  <span className="text-muted-foreground text-sm">%</span>
                </div>
              </div>
              <div>
                <Label htmlFor="baseEmission">基準年排出量</Label>
                <div className="flex items-center gap-2 mt-1.5">
                  <Input
                    id="baseEmission"
                    type="number"
                    min={0}
                    placeholder="例：125000"
                    value={userData.reductionTarget.baseEmission || ""}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        reductionTarget: {
                          ...userData.reductionTarget,
                          baseEmission: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                  />
                  <span className="text-muted-foreground text-sm">kgCO2e</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between mt-8 max-w-2xl">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ChevronLeft className="w-4 h-4" /> 戻る
        </Button>
        <Button
          size="lg"
          className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
          disabled={userData.employees <= 0}
          onClick={onNext}
        >
          次へ：データ入力 <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

// ===== Step 3: データ入力 & 結果ダッシュボード =====

function Step3({
  userData,
  setUserData,
  onBack,
  onReset,
}: {
  userData: UserData;
  setUserData: (d: UserData) => void;
  onBack: () => void;
  onReset: () => void;
}) {
  const template = industryTemplates.find((t) => t.id === userData.templateId)!;

  const defaultMonth = currentYearMonth();
  const [editingMonth, setEditingMonth] = useState(
    Object.keys(userData.monthlyEntries).sort().at(-1) ?? defaultMonth
  );
  const [formValues, setFormValues] = useState<Record<string, string>>(
    userData.monthlyEntries[editingMonth] ?? {}
  );

  const switchMonth = (month: string) => {
    setEditingMonth(month);
    setFormValues(userData.monthlyEntries[month] ?? {});
  };

  const saveMonth = () => {
    const updated = {
      ...userData,
      monthlyEntries: {
        ...userData.monthlyEntries,
        [editingMonth]: { ...formValues },
      },
    };
    setUserData(updated);
  };

  const deleteMonth = (month: string) => {
    const next = { ...userData.monthlyEntries };
    delete next[month];
    setUserData({ ...userData, monthlyEntries: next });
    if (editingMonth === month) {
      const remaining = Object.keys(next).sort();
      const fallback = remaining.at(-1) ?? defaultMonth;
      setEditingMonth(fallback);
      setFormValues(next[fallback] ?? {});
    }
  };

  const addNewMonth = () => {
    const existing = Object.keys(userData.monthlyEntries).sort();
    if (existing.length === 0) {
      switchMonth(defaultMonth);
      return;
    }
    const last = existing.at(-1)!;
    const [y, m] = last.split("-").map(Number);
    const nextMonth =
      m === 12
        ? `${y + 1}-01`
        : `${y}-${String(m + 1).padStart(2, "0")}`;
    switchMonth(nextMonth);
  };

  // 集計
  const monthlyData = useMemo(
    () => toMonthlyData(userData.monthlyEntries),
    [userData.monthlyEntries]
  );

  const allYears = useMemo(() => {
    const years = new Set(
      monthlyData.map((d) => parseInt(d.month.split("-")[0]))
    );
    return Array.from(years).sort();
  }, [monthlyData]);

  const [selectedYear, setSelectedYear] = useState<number>(
    allYears.at(-1) ?? new Date().getFullYear()
  );

  const effectiveYear = allYears.includes(selectedYear)
    ? selectedYear
    : (allYears.at(-1) ?? new Date().getFullYear());

  const annualCalc = useMemo(() => {
    const yearMonths = monthlyData.filter((d) =>
      d.month.startsWith(String(effectiveYear))
    );
    const monthly = yearMonths.map((d) => {
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
  }, [monthlyData, effectiveYear, template]);

  const hasData = monthlyData.length > 0;

  const handleExportCSV = () => {
    const headers = [
      "月",
      "Scope 1 (kgCO2e)",
      "Scope 2 (kgCO2e)",
      "Scope 3 (kgCO2e)",
      "合計 (kgCO2e)",
    ];
    const rows = annualCalc.monthly.map((m) => [
      m.month,
      Math.round(m.scope1),
      Math.round(m.scope2),
      Math.round(m.scope3),
      Math.round(m.total),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${userData.companyName || "自社"}_${effectiveYear}_emissions.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const pieData = [
    { name: "Scope 1", value: annualCalc.annual.scope1, color: SCOPE_COLORS.scope1 },
    { name: "Scope 2", value: annualCalc.annual.scope2, color: SCOPE_COLORS.scope2 },
    { name: "Scope 3", value: annualCalc.annual.scope3, color: SCOPE_COLORS.scope3 },
  ];

  const monthlyBarData = annualCalc.monthly.map((m) => ({
    month: m.month.split("-")[1] + "月",
    "Scope 1": Math.round(m.scope1),
    "Scope 2": Math.round(m.scope2),
    "Scope 3": Math.round(m.scope3),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold">月次排出量データの入力</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {template.name} · {userData.companyName || "貴社"} ·{" "}
            {userData.employees}名
          </p>
        </div>
        <Button
          variant="outline"
          onClick={onBack}
          className="gap-2 shrink-0"
        >
          <ChevronLeft className="w-4 h-4" /> 企業情報を編集
        </Button>
      </div>

      <div className="grid xl:grid-cols-[360px_1fr] gap-8">
        {/* ===== 左：入力フォーム ===== */}
        <div className="space-y-4">
          {/* 月選択 */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm">対象月を選択</h3>
                <button
                  onClick={addNewMonth}
                  className="flex items-center gap-1 text-xs text-teal-700 hover:text-teal-900 font-medium transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> 新しい月を追加
                </button>
              </div>
              <Input
                type="month"
                value={editingMonth}
                onChange={(e) => switchMonth(e.target.value)}
                className="mb-3"
              />
              {Object.keys(userData.monthlyEntries).length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground mb-2">
                    入力済み月
                  </p>
                  {Object.keys(userData.monthlyEntries)
                    .sort()
                    .map((month) => (
                      <div
                        key={month}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                          editingMonth === month
                            ? "bg-teal-50 text-teal-700 font-medium"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => switchMonth(month)}
                      >
                        <span>{month}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMonth(month);
                          }}
                          className="text-muted-foreground hover:text-red-500 transition-colors"
                          aria-label={`${month}を削除`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 排出量入力 */}
          <Card>
            <CardContent className="p-5">
              <h3 className="font-bold text-sm mb-4">
                {editingMonth} の排出量データ
              </h3>
              <div className="space-y-5">
                {(["scope1", "scope2", "scope3"] as const).map((scope) => {
                  const items = template.items.filter(
                    (i) => i.scope === scope
                  );
                  const scopeLabel =
                    scope === "scope1"
                      ? "Scope 1 — 直接排出"
                      : scope === "scope2"
                      ? "Scope 2 — 電力由来"
                      : "Scope 3 — サプライチェーン";
                  const scopeColor =
                    scope === "scope1"
                      ? "text-teal-700"
                      : scope === "scope2"
                      ? "text-emerald-700"
                      : "text-amber-700";
                  return (
                    <div key={scope}>
                      <h4 className={`text-xs font-bold mb-2 ${scopeColor}`}>
                        {scopeLabel}
                      </h4>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div key={item.id}>
                            <label className="text-xs text-muted-foreground mb-0.5 block">
                              {item.name}
                              <span className="ml-1 text-muted-foreground/60">
                                ({item.unit})
                              </span>
                            </label>
                            <Input
                              type="number"
                              min={0}
                              step="any"
                              placeholder={item.placeholder ?? "0"}
                              value={formValues[item.id] ?? ""}
                              onChange={(e) =>
                                setFormValues((prev) => ({
                                  ...prev,
                                  [item.id]: e.target.value,
                                }))
                              }
                              className="h-8 text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button
                className="w-full mt-5 bg-teal-600 hover:bg-teal-700 text-white gap-2"
                onClick={saveMonth}
              >
                <Check className="w-4 h-4" />
                {userData.monthlyEntries[editingMonth] ? "更新する" : "保存する"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* ===== 右：結果ダッシュボード ===== */}
        <div className="space-y-6">
          {!hasData ? (
            <div className="flex flex-col items-center justify-center h-80 text-muted-foreground gap-3 rounded-2xl border-2 border-dashed border-border">
              <BarChart3 className="w-12 h-12 opacity-30" />
              <p className="text-sm">
                データを入力・保存するとグラフが表示されます
              </p>
            </div>
          ) : (
            <>
              {/* 年切替 & CSV */}
              <div className="flex items-center justify-between">
                <div className="flex rounded-lg border overflow-hidden">
                  {allYears.map((year) => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${
                        effectiveYear === year
                          ? "bg-teal-600 text-white"
                          : "bg-background text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      {year}年
                    </button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={handleExportCSV}
                >
                  <Download className="w-4 h-4" /> CSV出力
                </Button>
              </div>

              {/* KPI カード */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {
                    label: "合計排出量",
                    value: annualCalc.annual.total,
                    icon: <Target className="w-4 h-4" />,
                    color: "#0d9488",
                  },
                  {
                    label: "Scope 1",
                    value: annualCalc.annual.scope1,
                    icon: <Flame className="w-4 h-4" />,
                    color: SCOPE_COLORS.scope1,
                  },
                  {
                    label: "Scope 2",
                    value: annualCalc.annual.scope2,
                    icon: <Zap className="w-4 h-4" />,
                    color: SCOPE_COLORS.scope2,
                  },
                  {
                    label: "Scope 3",
                    value: annualCalc.annual.scope3,
                    icon: <Truck className="w-4 h-4" />,
                    color: SCOPE_COLORS.scope3,
                  },
                ].map((kpi) => (
                  <Card key={kpi.label}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">
                          {kpi.label}
                        </span>
                        <div
                          className="w-7 h-7 rounded-md flex items-center justify-center"
                          style={{
                            backgroundColor: `${kpi.color}18`,
                            color: kpi.color,
                          }}
                        >
                          {kpi.icon}
                        </div>
                      </div>
                      <div className="text-lg font-bold">
                        {formatTonnes(kpi.value)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* チャート行 */}
              <div className="grid lg:grid-cols-3 gap-4">
                {/* 月別積み上げ棒グラフ */}
                <Card className="lg:col-span-2">
                  <CardContent className="p-5">
                    <h3 className="font-bold text-sm mb-4">
                      月別排出量推移（Scope別）
                    </h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={monthlyBarData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#e5e7eb"
                        />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis
                          tick={{ fontSize: 11 }}
                          tickFormatter={(v) =>
                            `${(v / 1000).toFixed(0)}t`
                          }
                        />
                        <Tooltip
                          formatter={(value: number) => [
                            `${formatNumber(value)} kgCO2e`,
                            "",
                          ]}
                          contentStyle={{
                            borderRadius: "8px",
                            fontSize: "12px",
                          }}
                        />
                        <Legend />
                        <Bar
                          dataKey="Scope 1"
                          stackId="a"
                          fill={SCOPE_COLORS.scope1}
                        />
                        <Bar
                          dataKey="Scope 2"
                          stackId="a"
                          fill={SCOPE_COLORS.scope2}
                        />
                        <Bar
                          dataKey="Scope 3"
                          stackId="a"
                          fill={SCOPE_COLORS.scope3}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Scope 別円グラフ */}
                <Card>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-sm mb-4">Scope別構成比</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => [
                            formatTonnes(value),
                            "",
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-1.5 mt-1">
                      {pieData.map((d) => {
                        const pct =
                          annualCalc.annual.total > 0
                            ? (
                                (d.value / annualCalc.annual.total) *
                                100
                              ).toFixed(1)
                            : "0.0";
                        return (
                          <div
                            key={d.name}
                            className="flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-1.5">
                              <div
                                className="w-2.5 h-2.5 rounded-sm"
                                style={{ backgroundColor: d.color }}
                              />
                              {d.name}
                            </div>
                            <span className="font-medium">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 削減目標 & ベンチマーク */}
              <div className="grid lg:grid-cols-2 gap-4">
                {/* 削減目標進捗（基準年排出量が設定済みの場合のみ） */}
                {userData.reductionTarget.baseEmission > 0 && (
                  <Card>
                    <CardContent className="p-5">
                      <h3 className="font-bold text-sm mb-4">
                        削減目標の進捗
                      </h3>
                      <div className="space-y-3">
                        {[
                          {
                            label: `基準年排出量（${userData.reductionTarget.baseYear}年）`,
                            value: formatTonnes(
                              userData.reductionTarget.baseEmission
                            ),
                          },
                          {
                            label: `目標排出量（${userData.reductionTarget.reductionRate}%削減）`,
                            value: formatTonnes(
                              userData.reductionTarget.baseEmission *
                                (1 -
                                  userData.reductionTarget.reductionRate / 100)
                            ),
                          },
                          {
                            label: `現在の排出量（${effectiveYear}年）`,
                            value: formatTonnes(annualCalc.annual.total),
                            bold: true,
                          },
                        ].map((row) => (
                          <div
                            key={row.label}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-muted-foreground">
                              {row.label}
                            </span>
                            <span
                              className={
                                row.bold ? "font-bold text-teal-700" : "font-medium"
                              }
                            >
                              {row.value}
                            </span>
                          </div>
                        ))}
                        {(() => {
                          const targetEmission =
                            userData.reductionTarget.baseEmission *
                            (1 - userData.reductionTarget.reductionRate / 100);
                          const progress = Math.max(
                            0,
                            Math.min(
                              100,
                              ((userData.reductionTarget.baseEmission -
                                annualCalc.annual.total) /
                                (userData.reductionTarget.baseEmission -
                                  targetEmission)) *
                                100
                            )
                          );
                          return (
                            <div className="pt-2">
                              <div className="flex justify-between text-sm mb-1.5">
                                <span className="font-medium">目標達成率</span>
                                <span className="font-bold text-teal-700">
                                  {progress.toFixed(1)}%
                                </span>
                              </div>
                              <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${progress}%` }}
                                  transition={{ duration: 1 }}
                                />
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 業界ベンチマーク比較 */}
                <Card>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-sm mb-4">
                      業界ベンチマーク比較（従業員1人あたり）
                    </h3>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="p-3 rounded-lg bg-teal-50 border border-teal-100">
                        <div className="text-xs text-muted-foreground mb-1">
                          自社
                        </div>
                        <div className="text-xl font-bold text-teal-700">
                          {formatNumber(
                            Math.round(
                              annualCalc.annual.total / userData.employees
                            )
                          )}{" "}
                          kg
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <div className="text-xs text-muted-foreground mb-1">
                          業界平均
                        </div>
                        <div className="text-xl font-bold text-muted-foreground">
                          {formatNumber(
                            template.benchmarks.totalPerEmployee
                          )}{" "}
                          kg
                        </div>
                      </div>
                    </div>
                    {(() => {
                      const perEmployee =
                        annualCalc.annual.total / userData.employees;
                      const diff =
                        ((perEmployee -
                          template.benchmarks.totalPerEmployee) /
                          template.benchmarks.totalPerEmployee) *
                        100;
                      return (
                        <div
                          className={`flex items-center gap-1.5 text-sm font-medium ${
                            diff < 0 ? "text-emerald-600" : "text-red-500"
                          }`}
                        >
                          {diff < 0 ? (
                            <TrendingDown className="w-4 h-4" />
                          ) : (
                            <TrendingUp className="w-4 h-4" />
                          )}
                          業界平均比 {diff > 0 ? "+" : ""}
                          {diff.toFixed(1)}%
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>

      {/* リセット */}
      <div className="mt-10 pt-6 border-t border-border">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-red-500 transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> 入力データをすべてリセット
        </button>
      </div>
    </motion.div>
  );
}

// ===== メインページ =====

export default function Calculator() {
  const [userData, setUserData] = useLocalStorage<UserData>(
    "ecotrace-user-data",
    DEFAULT_DATA
  );

  // 保存済みデータがある場合は対応するステップから開始
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(() => {
    const hasTemplate = userData.templateId !== "";
    const hasEntries = Object.keys(userData.monthlyEntries).length > 0;
    if (hasTemplate && hasEntries) return 3;
    if (hasTemplate) return 2;
    return 1;
  });

  const handleReset = () => {
    if (
      confirm(
        "入力データをすべてリセットしますか？この操作は元に戻せません。"
      )
    ) {
      setUserData(DEFAULT_DATA);
      setCurrentStep(1);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-7xl">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ fontFamily: "'Noto Serif JP', serif" }}
          >
            自社データ入力
          </h1>
          <p className="text-muted-foreground">
            貴社の実際の排出量データを入力して、CO2排出量を算定・可視化します。
            入力データはブラウザに自動保存され、次回アクセス時も引き続き使用できます。
          </p>
        </motion.div>

        <StepIndicator currentStep={currentStep} />

        {currentStep === 1 && (
          <Step1
            userData={userData}
            setUserData={setUserData}
            onNext={() => setCurrentStep(2)}
          />
        )}
        {currentStep === 2 && (
          <Step2
            userData={userData}
            setUserData={setUserData}
            onBack={() => setCurrentStep(1)}
            onNext={() => setCurrentStep(3)}
          />
        )}
        {currentStep === 3 && (
          <Step3
            userData={userData}
            setUserData={setUserData}
            onBack={() => setCurrentStep(2)}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}
