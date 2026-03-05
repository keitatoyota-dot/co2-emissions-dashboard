/**
 * Templates.tsx — 業界テンプレート一覧・詳細ページ
 * 
 * 各業界テンプレートの入力項目・排出係数・Scope分類を一覧表示
 */
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { industryTemplates, type IndustryTemplate, type ScopeType } from "@/lib/industry-templates";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Factory, Store, ChevronDown, ChevronUp } from "lucide-react";

const industryIcons: Record<string, React.ReactNode> = {
  office: <Building2 className="w-6 h-6" />,
  manufacturing: <Factory className="w-6 h-6" />,
  retail: <Store className="w-6 h-6" />,
};

const scopeColors: Record<ScopeType, { bg: string; text: string; label: string }> = {
  scope1: { bg: "bg-teal-100 text-teal-800", text: "text-teal-700", label: "Scope 1" },
  scope2: { bg: "bg-emerald-100 text-emerald-800", text: "text-emerald-700", label: "Scope 2" },
  scope3: { bg: "bg-amber-100 text-amber-800", text: "text-amber-700", label: "Scope 3" },
};

function TemplateDetail({ template }: { template: IndustryTemplate }) {
  const [expanded, setExpanded] = useState(false);
  const scope1Items = template.items.filter(i => i.scope === "scope1");
  const scope2Items = template.items.filter(i => i.scope === "scope2");
  const scope3Items = template.items.filter(i => i.scope === "scope3");

  return (
    <Card className="overflow-hidden">
      <div className="grid lg:grid-cols-[360px_1fr]">
        <div className="aspect-[4/3] lg:aspect-auto overflow-hidden">
          <img
            src={template.imageUrl}
            alt={template.name}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white">
              {industryIcons[template.id]}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{template.name}</h2>
              <span className="text-sm text-muted-foreground">{template.nameEn}</span>
            </div>
          </div>
          <p className="text-muted-foreground mb-6">{template.description}</p>

          {/* Scope Summary */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { scope: "scope1" as ScopeType, items: scope1Items },
              { scope: "scope2" as ScopeType, items: scope2Items },
              { scope: "scope3" as ScopeType, items: scope3Items },
            ].map(({ scope, items }) => (
              <div key={scope} className="text-center p-3 rounded-lg bg-muted/50">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${scopeColors[scope].bg} mb-1`}>
                  {scopeColors[scope].label}
                </span>
                <div className="text-lg font-bold">{items.length}</div>
                <div className="text-xs text-muted-foreground">入力項目</div>
              </div>
            ))}
          </div>

          {/* Benchmarks */}
          <div className="p-4 rounded-lg bg-teal-50/50 border border-teal-100 mb-6">
            <h4 className="text-sm font-bold text-teal-800 mb-2">業界平均ベンチマーク（従業員1人あたり年間排出量）</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Scope 1</span>
                <div className="font-semibold">{template.benchmarks.scope1PerEmployee.toLocaleString()} kg</div>
              </div>
              <div>
                <span className="text-muted-foreground">Scope 2</span>
                <div className="font-semibold">{template.benchmarks.scope2PerEmployee.toLocaleString()} kg</div>
              </div>
              <div>
                <span className="text-muted-foreground">Scope 3</span>
                <div className="font-semibold">{template.benchmarks.scope3PerEmployee.toLocaleString()} kg</div>
              </div>
              <div>
                <span className="text-muted-foreground">合計</span>
                <div className="font-bold text-teal-700">{template.benchmarks.totalPerEmployee.toLocaleString()} kg</div>
              </div>
            </div>
          </div>

          {/* Toggle detail */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-800 transition-colors mb-4"
          >
            {expanded ? "入力項目を閉じる" : "入力項目の詳細を見る"}
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-4"
            >
              {[
                { scope: "scope1" as ScopeType, items: scope1Items, title: "Scope 1 — 直接排出" },
                { scope: "scope2" as ScopeType, items: scope2Items, title: "Scope 2 — エネルギー起源間接排出" },
                { scope: "scope3" as ScopeType, items: scope3Items, title: "Scope 3 — その他間接排出" },
              ].map(({ scope, items, title }) => (
                <div key={scope}>
                  <h4 className={`text-sm font-bold mb-2 ${scopeColors[scope].text}`}>{title}</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 pr-4 font-medium text-muted-foreground">項目名</th>
                          <th className="text-left py-2 pr-4 font-medium text-muted-foreground">単位</th>
                          <th className="text-left py-2 pr-4 font-medium text-muted-foreground">排出係数</th>
                          <th className="text-left py-2 font-medium text-muted-foreground">説明</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map(item => (
                          <tr key={item.id} className="border-b border-border/50">
                            <td className="py-2 pr-4 font-medium">{item.name}</td>
                            <td className="py-2 pr-4 text-muted-foreground">{item.unit}</td>
                            <td className="py-2 pr-4 font-mono text-xs">{item.emissionFactor} kgCO2e/{item.unit}</td>
                            <td className="py-2 text-muted-foreground text-xs">{item.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          <div className="mt-4">
            <Link href={`/demo?template=${template.id}`}>
              <Button className="gap-2 bg-teal-600 hover:bg-teal-700 text-white">
                このテンプレートでデモを見る <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export default function Templates() {
  return (
    <div className="min-h-screen py-12">
      <div className="container">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Noto Serif JP', serif" }}>
            業界別テンプレート
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            業界ごとに異なるCO2排出源の構造に対応するため、テンプレート方式を採用しています。
            テンプレートを選択するだけで、その業界に最適な入力項目・排出係数・ベンチマークが自動的にセットされます。
            新しい業界テンプレートの追加も容易な拡張可能な設計です。
          </p>
        </motion.div>

        <div className="space-y-8">
          {industryTemplates.map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <TemplateDetail template={template} />
            </motion.div>
          ))}
        </div>

        {/* Design Philosophy */}
        <motion.div
          className="mt-16 p-8 rounded-2xl bg-muted/30 border border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "'Noto Serif JP', serif" }}>
            設計思想：テンプレートとデータの分離
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-muted-foreground">
            <div>
              <h3 className="font-bold text-foreground mb-2">拡張性</h3>
              <p>
                新しい業界テンプレートを追加する際は、入力項目と排出係数を定義するだけ。
                計算ロジックや可視化の仕組みは共通で再利用されます。
              </p>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-2">正確性</h3>
              <p>
                排出係数は環境省「温室効果ガス排出量算定・報告マニュアル」に準拠。
                業界ごとのベンチマークは公開統計データに基づいています。
              </p>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-2">実用性</h3>
              <p>
                企業の環境担当者が実際に入手可能なデータ（請求書・管理記録）を
                入力項目として設計しています。
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
