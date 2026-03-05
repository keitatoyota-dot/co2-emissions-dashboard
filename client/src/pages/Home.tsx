/**
 * Home.tsx — 企業向けカーボンフットプリント管理ツール ランディングページ
 * 
 * Design: Terrain — 等高線地図インスパイア × スカンジナビアンミニマリズム
 * Target: 中小企業の環境担当者・経営者
 */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { industryTemplates, demoCompanies } from "@/lib/industry-templates";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Building2, Factory, FileText, Layers, ShieldCheck, Store, Target } from "lucide-react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663328488369/YXLp63tB2vrCWpgV7unZMi/corporate-hero-dyPyaAVA2LinutcVYf8Haf.webp";
const SCOPE_DIAGRAM = "https://d2xsxph8kpxj0f.cloudfront.net/310519663328488369/YXLp63tB2vrCWpgV7unZMi/scope-diagram-PkPzfXAWeaUCLoyzcP3WED.webp";
const PATTERN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663328488369/YXLp63tB2vrCWpgV7unZMi/pattern-nature-WWj7tGsZ2FTFkPJX6Dv3Gg.webp";

const industryIcons: Record<string, React.ReactNode> = {
  office: <Building2 className="w-6 h-6" />,
  manufacturing: <Factory className="w-6 h-6" />,
  retail: <Store className="w-6 h-6" />,
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6 },
  }),
};

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* ===== Hero Section ===== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2f2a]/90 via-[#1a2f2a]/70 to-transparent" />
        </div>
        <div className="container relative z-10 py-20">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-emerald-300 text-sm font-medium border border-emerald-400/20 mb-6">
                <ShieldCheck className="w-4 h-4" />
                GHGプロトコル準拠
              </span>
            </motion.div>
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{ fontFamily: "'Noto Serif JP', serif" }}
            >
              企業のCO2排出量を
              <br />
              <span className="text-emerald-400">見える化</span>する
            </motion.h1>
            <motion.p
              className="text-lg text-gray-300 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              EcoTrace for Businessは、GHGプロトコルに基づくScope 1・2・3の
              CO2排出量を業界別テンプレートで簡単に算定・可視化。
              中小企業のESG経営とカーボンニュートラルへの第一歩を支援します。
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <Link href="/demo">
                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 text-base px-6">
                  デモを見る <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/templates">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2 text-base px-6">
                  業界テンプレート一覧
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== Stats Bar ===== */}
      <section className="bg-[#1a2f2a] border-t border-emerald-900/50">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "3", label: "業界テンプレート", suffix: "種" },
              { value: "3", label: "モデルケース企業", suffix: "社" },
              { value: "Scope 1·2·3", label: "GHGプロトコル対応", suffix: "" },
              { value: "30+", label: "排出項目", suffix: "種" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="text-2xl md:text-3xl font-bold text-emerald-400">
                  {stat.value}<span className="text-lg">{stat.suffix}</span>
                </div>
                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Scope Explanation ===== */}
      <section className="py-20 bg-[var(--background)]">
        <div className="container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Noto Serif JP', serif" }}>
              GHGプロトコルに基づく排出量算定
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              企業のCO2排出量は国際基準であるGHGプロトコルに従い、
              3つのスコープに分類して算定します。
            </p>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={SCOPE_DIAGRAM}
                alt="GHGプロトコル Scope 1, 2, 3 の概念図"
                className="rounded-2xl shadow-lg w-full"
              />
            </motion.div>
            <div className="space-y-6">
              {[
                {
                  scope: "Scope 1",
                  title: "直接排出",
                  description: "自社の工場・オフィス・社用車から直接排出されるCO2。燃料の燃焼、冷媒の漏洩などが該当します。",
                  color: "bg-teal-600",
                  textColor: "text-teal-600",
                },
                {
                  scope: "Scope 2",
                  title: "エネルギー起源の間接排出",
                  description: "購入した電力・熱・蒸気の使用に伴う間接排出。電力会社の発電時に排出されるCO2が該当します。",
                  color: "bg-emerald-500",
                  textColor: "text-emerald-600",
                },
                {
                  scope: "Scope 3",
                  title: "その他の間接排出",
                  description: "サプライチェーン全体の排出。原材料調達、製品輸送、従業員の通勤・出張、廃棄物処理などが該当します。",
                  color: "bg-amber-500",
                  textColor: "text-amber-600",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Card className="border-l-4 shadow-sm" style={{ borderLeftColor: item.scope === "Scope 1" ? "#0d9488" : item.scope === "Scope 2" ? "#10b981" : "#f59e0b" }}>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2.5 py-0.5 rounded text-xs font-bold text-white ${item.color}`}>
                          {item.scope}
                        </span>
                        <h3 className={`font-bold text-lg ${item.textColor}`}>{item.title}</h3>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Industry Templates ===== */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Noto Serif JP', serif" }}>
              業界別テンプレート
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              業界ごとに異なる排出源の構造に対応。テンプレートを選ぶだけで、
              最適な入力項目と排出係数が自動的にセットされます。
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {industryTemplates.map((template, i) => (
              <motion.div
                key={template.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-full">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={template.imageUrl}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700">
                        {industryIcons[template.id]}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{template.name}</h3>
                        <span className="text-xs text-muted-foreground">{template.nameEn}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {template.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                      <span>{template.items.length}項目の入力フォーム</span>
                      <span>Scope 1·2·3 対応</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/templates">
              <Button variant="outline" size="lg" className="gap-2">
                テンプレート詳細を見る <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Demo Companies ===== */}
      <section className="py-20">
        <div className="container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Noto Serif JP', serif" }}>
              モデルケース企業
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              3つの架空企業を想定し、業界ごとの排出量構造と削減目標の管理を
              デモンストレーションします。
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {demoCompanies.map((company, i) => {
              const template = industryTemplates.find(t => t.id === company.templateId);
              return (
                <motion.div
                  key={company.id}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white">
                          {industryIcons[company.templateId]}
                        </div>
                        <div>
                          <h3 className="font-bold">{company.name}</h3>
                          <span className="text-xs text-muted-foreground">{company.industry}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {company.description}
                      </p>
                      <div className="space-y-3 border-t pt-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">従業員数</span>
                          <span className="font-semibold">{company.employees}名</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">使用テンプレート</span>
                          <span className="font-semibold">{template?.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">削減目標</span>
                          <span className="font-semibold text-emerald-600">
                            {company.reductionTarget.targetYear}年までに{company.reductionTarget.reductionRate}%削減
                          </span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Link href={`/demo?company=${company.id}`}>
                          <Button variant="outline" className="w-full gap-2">
                            ダッシュボードを見る <BarChart3 className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Noto Serif JP', serif" }}>
              主な機能
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Layers className="w-6 h-6" />, title: "業界別テンプレート", desc: "業界ごとの排出源に最適化された入力フォームを自動生成" },
              { icon: <BarChart3 className="w-6 h-6" />, title: "Scope別可視化", desc: "Scope 1・2・3別の排出量をグラフで直感的に把握" },
              { icon: <Target className="w-6 h-6" />, title: "目標管理", desc: "削減目標の設定と進捗率をリアルタイムでトラッキング" },
              { icon: <FileText className="w-6 h-6" />, title: "レポート出力", desc: "ESGレポート向けのデータをCSV形式でエクスポート" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 mx-auto mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={PATTERN} alt="" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a2f2a] to-[#0d3b2e]" />
        </div>
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Noto Serif JP', serif" }}>
              デモダッシュボードを体験する
            </h2>
            <p className="text-gray-300 max-w-xl mx-auto mb-8">
              架空のモデルケース企業のデータで、EcoTrace for Businessの
              全機能をお試しいただけます。
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/demo">
                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 text-base px-8">
                  デモを見る <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8">
                  このプロジェクトについて
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
