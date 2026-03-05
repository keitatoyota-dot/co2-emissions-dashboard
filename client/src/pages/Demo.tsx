/**
 * Demo.tsx — モデルケース企業のデモダッシュボード
 * 
 * 企業を選択し、Scope別排出量・月次推移・目標進捗を可視化
 */
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  demoCompanies,
  industryTemplates,
  calculateAnnualSummary,
  formatNumber,
  formatTonnes,
  type DemoCompany,
} from "@/lib/industry-templates";
import { useSearch } from "wouter";
import { motion } from "framer-motion";
import {
  Building2,
  Factory,
  Store,
  TrendingDown,
  TrendingUp,
  Target,
  Users,
  Flame,
  Zap,
  Truck,
  Download,
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
  AreaChart,
  Area,
} from "recharts";

const industryIcons: Record<string, React.ReactNode> = {
  office: <Building2 className="w-5 h-5" />,
  manufacturing: <Factory className="w-5 h-5" />,
  retail: <Store className="w-5 h-5" />,
};

const SCOPE_COLORS = {
  scope1: "#0d9488",
  scope2: "#10b981",
  scope3: "#f59e0b",
};

function CompanySelector({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {demoCompanies.map((company) => {
        const isActive = selected === company.id;
        return (
          <button
            key={company.id}
            onClick={() => onSelect(company.id)}
            className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
              isActive
                ? "border-teal-500 bg-teal-50 shadow-md"
                : "border-border hover:border-teal-300 hover:bg-muted/30"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isActive
                    ? "bg-teal-600 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {industryIcons[company.templateId]}
              </div>
              <div>
                <div className="font-bold text-sm">{company.name}</div>
                <div className="text-xs text-muted-foreground">{company.industry}</div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              従業員 {company.employees}名 ・ {
                industryTemplates.find(t => t.id === company.templateId)?.name
              }
            </div>
          </button>
        );
      })}
    </div>
  );
}

function ScopeKPI({
  label,
  value,
  icon,
  color,
  yoyChange,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  yoyChange?: number;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">{label}</span>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15`, color }}>
            {icon}
          </div>
        </div>
        <div className="text-2xl font-bold mb-1">{formatTonnes(value)}</div>
        {yoyChange !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${yoyChange < 0 ? "text-emerald-600" : "text-red-500"}`}>
            {yoyChange < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
            前年比 {yoyChange > 0 ? "+" : ""}{yoyChange.toFixed(1)}%
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DashboardContent({ company }: { company: DemoCompany }) {
  const [selectedYear, setSelectedYear] = useState(2025);
  const template = useMemo(
    () => industryTemplates.find(t => t.id === company.templateId)!,
    [company.templateId]
  );

  const summary2025 = useMemo(
    () => calculateAnnualSummary(template, company.monthlyData, 2025),
    [template, company.monthlyData]
  );
  const summary2024 = useMemo(
    () => calculateAnnualSummary(template, company.monthlyData, 2024),
    [template, company.monthlyData]
  );

  const currentSummary = selectedYear === 2025 ? summary2025 : summary2024;
  const prevSummary = selectedYear === 2025 ? summary2024 : null;

  const yoyTotal = prevSummary
    ? ((currentSummary.annual.total - prevSummary.annual.total) / prevSummary.annual.total) * 100
    : undefined;
  const yoyScope1 = prevSummary
    ? ((currentSummary.annual.scope1 - prevSummary.annual.scope1) / prevSummary.annual.scope1) * 100
    : undefined;
  const yoyScope2 = prevSummary
    ? ((currentSummary.annual.scope2 - prevSummary.annual.scope2) / prevSummary.annual.scope2) * 100
    : undefined;
  const yoyScope3 = prevSummary
    ? ((currentSummary.annual.scope3 - prevSummary.annual.scope3) / prevSummary.annual.scope3) * 100
    : undefined;

  // Pie chart data
  const pieData = [
    { name: "Scope 1", value: currentSummary.annual.scope1, color: SCOPE_COLORS.scope1 },
    { name: "Scope 2", value: currentSummary.annual.scope2, color: SCOPE_COLORS.scope2 },
    { name: "Scope 3", value: currentSummary.annual.scope3, color: SCOPE_COLORS.scope3 },
  ];

  // Monthly bar chart data
  const monthlyBarData = currentSummary.monthly.map(m => ({
    month: m.month.split("-")[1] + "月",
    "Scope 1": Math.round(m.scope1),
    "Scope 2": Math.round(m.scope2),
    "Scope 3": Math.round(m.scope3),
  }));

  // Year comparison area chart
  const comparisonData = summary2024.monthly.map((m2024, i) => {
    const m2025 = summary2025.monthly[i];
    return {
      month: m2024.month.split("-")[1] + "月",
      "2024年": Math.round(m2024.total),
      "2025年": m2025 ? Math.round(m2025.total) : 0,
    };
  });

  // Target progress
  const targetEmission = company.reductionTarget.baseEmission * (1 - company.reductionTarget.reductionRate / 100);
  const currentEmission = currentSummary.annual.total;
  const progressRate = Math.max(
    0,
    Math.min(
      100,
      ((company.reductionTarget.baseEmission - currentEmission) /
        (company.reductionTarget.baseEmission - targetEmission)) *
        100
    )
  );

  // Per employee
  const perEmployee = currentSummary.annual.total / company.employees;
  const benchmarkPerEmployee = template.benchmarks.totalPerEmployee;
  const vsBenchmark = ((perEmployee - benchmarkPerEmployee) / benchmarkPerEmployee) * 100;

  // CSV export
  const handleExportCSV = () => {
    const headers = ["月", "Scope 1 (kgCO2e)", "Scope 2 (kgCO2e)", "Scope 3 (kgCO2e)", "合計 (kgCO2e)"];
    const rows = currentSummary.monthly.map(m => [
      m.month,
      Math.round(m.scope1),
      Math.round(m.scope2),
      Math.round(m.scope3),
      Math.round(m.total),
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${company.name}_${selectedYear}_emissions.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Company Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{company.name}</h2>
          <p className="text-muted-foreground text-sm">{company.industry} ・ 従業員{company.employees}名</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border overflow-hidden">
            {[2024, 2025].map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  selectedYear === year
                    ? "bg-teal-600 text-white"
                    : "bg-background text-muted-foreground hover:bg-muted/50"
                }`}
              >
                {year}年
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExportCSV}>
            <Download className="w-4 h-4" /> CSV出力
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ScopeKPI label="合計排出量" value={currentSummary.annual.total} icon={<Target className="w-4 h-4" />} color="#0d9488" yoyChange={yoyTotal} />
        <ScopeKPI label="Scope 1（直接排出）" value={currentSummary.annual.scope1} icon={<Flame className="w-4 h-4" />} color={SCOPE_COLORS.scope1} yoyChange={yoyScope1} />
        <ScopeKPI label="Scope 2（電力由来）" value={currentSummary.annual.scope2} icon={<Zap className="w-4 h-4" />} color={SCOPE_COLORS.scope2} yoyChange={yoyScope2} />
        <ScopeKPI label="Scope 3（サプライチェーン）" value={currentSummary.annual.scope3} icon={<Truck className="w-4 h-4" />} color={SCOPE_COLORS.scope3} yoyChange={yoyScope3} />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Monthly Stacked Bar */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="font-bold mb-4">月別排出量推移（Scope別）</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={monthlyBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${(v / 1000).toFixed(0)}t`} />
                <Tooltip
                  formatter={(value: number) => [`${formatNumber(value)} kgCO2e`, ""]}
                  contentStyle={{ borderRadius: "8px", fontSize: "13px" }}
                />
                <Legend />
                <Bar dataKey="Scope 1" stackId="a" fill={SCOPE_COLORS.scope1} radius={[0, 0, 0, 0]} />
                <Bar dataKey="Scope 2" stackId="a" fill={SCOPE_COLORS.scope2} />
                <Bar dataKey="Scope 3" stackId="a" fill={SCOPE_COLORS.scope3} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Scope Pie */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold mb-4">Scope別構成比</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [formatTonnes(value), ""]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {pieData.map(d => {
                const pct = (d.value / currentSummary.annual.total * 100).toFixed(1);
                return (
                  <div key={d.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: d.color }} />
                      <span>{d.name}</span>
                    </div>
                    <span className="font-medium">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Year Comparison + Target */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Year Comparison */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold mb-4">前年比較（月別合計排出量）</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${(v / 1000).toFixed(0)}t`} />
                <Tooltip
                  formatter={(value: number) => [`${formatNumber(value)} kgCO2e`, ""]}
                  contentStyle={{ borderRadius: "8px", fontSize: "13px" }}
                />
                <Legend />
                <Area type="monotone" dataKey="2024年" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.15} strokeWidth={2} />
                <Area type="monotone" dataKey="2025年" stroke="#0d9488" fill="#0d9488" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Target Progress */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold mb-4">削減目標の進捗</h3>
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">目標</span>
                  <span className="font-medium">
                    {company.reductionTarget.targetYear}年までに{company.reductionTarget.reductionRate}%削減
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">基準年排出量（{company.reductionTarget.baseYear}年）</span>
                  <span className="font-medium">{formatTonnes(company.reductionTarget.baseEmission)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">目標排出量</span>
                  <span className="font-medium">{formatTonnes(targetEmission)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">現在の排出量（{selectedYear}年）</span>
                  <span className="font-bold text-teal-700">{formatTonnes(currentEmission)}</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">目標達成率</span>
                  <span className="font-bold text-teal-700">{progressRate.toFixed(1)}%</span>
                </div>
                <div className="w-full h-4 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progressRate, 100)}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              </div>

              {/* Per Employee Benchmark */}
              <div className="p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">従業員1人あたり排出量</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">自社</div>
                    <div className="text-lg font-bold">{formatNumber(Math.round(perEmployee))} kg</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">業界平均</div>
                    <div className="text-lg font-bold text-muted-foreground">{formatNumber(benchmarkPerEmployee)} kg</div>
                  </div>
                </div>
                <div className={`mt-2 text-xs font-medium ${vsBenchmark < 0 ? "text-emerald-600" : "text-red-500"}`}>
                  業界平均比 {vsBenchmark > 0 ? "+" : ""}{vsBenchmark.toFixed(1)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Demo() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const initialCompany = params.get("company") || demoCompanies[0].id;
  const [selectedCompany, setSelectedCompany] = useState(initialCompany);
  const company = demoCompanies.find(c => c.id === selectedCompany) || demoCompanies[0];

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Noto Serif JP', serif" }}>
            デモダッシュボード
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            架空のモデルケース企業を選択して、業界別テンプレートによるCO2排出量の算定・可視化・目標管理をお試しください。
          </p>
        </motion.div>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-3">企業を選択</h3>
          <CompanySelector selected={selectedCompany} onSelect={setSelectedCompany} />
        </motion.div>

        <motion.div
          key={selectedCompany}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <DashboardContent company={company} />
        </motion.div>
      </div>
    </div>
  );
}
