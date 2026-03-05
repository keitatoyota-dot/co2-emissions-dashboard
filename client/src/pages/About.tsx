/**
 * About.tsx — プロジェクト説明ページ（企業向け）
 */
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BookOpen, Code2, Database, GraduationCap, Layers, Scale, Shield } from "lucide-react";

const DASHBOARD_PREVIEW = "https://d2xsxph8kpxj0f.cloudfront.net/310519663328488369/YXLp63tB2vrCWpgV7unZMi/dashboard-preview-KPdHdmvYSNtqyU5jJMNDWS.webp";

export default function About() {
  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Noto Serif JP', serif" }}>
            このプロジェクトについて
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            EcoTrace for Businessは、中小企業のCO2排出量算定・可視化を支援する
            Webアプリケーションのプロトタイプです。
          </p>
        </motion.div>

        <div className="space-y-10">
          {/* Project Overview */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold">制作背景</h2>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    2050年カーボンニュートラルの実現に向け、企業のGHG（温室効果ガス）排出量の
                    算定・報告は急速に重要性を増しています。大企業では専用システムの導入が進む一方、
                    中小企業では「何から始めればいいか分からない」「専用ツールは高額で手が出ない」
                    という課題が存在します。
                  </p>
                  <p>
                    本プロジェクトでは、環境経営システム学科で学んだGHGプロトコルの知識と、
                    経営工学研究室で培ったシステム設計の手法を組み合わせ、中小企業が
                    手軽にCO2排出量を算定・可視化できるツールのプロトタイプを開発しました。
                  </p>
                  <p>
                    特に、<strong className="text-foreground">業界ごとに異なる排出源の構造</strong>に対応するため、
                    <strong className="text-foreground">テンプレートとデータの分離</strong>という設計思想を採用。
                    製造業・IT/オフィス業・小売業の3業界テンプレートと、
                    それぞれの架空モデルケース企業を実装しています。
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Preview Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-2xl overflow-hidden shadow-lg"
          >
            <img src={DASHBOARD_PREVIEW} alt="ダッシュボードプレビュー" className="w-full" />
          </motion.div>

          {/* Design Philosophy */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold">設計思想</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-bold text-teal-700">テンプレートとデータの分離</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      業界ごとに「どのデータを入力するか」「どの排出係数を使うか」をテンプレートとして定義。
                      計算ロジックや可視化の仕組みは共通で再利用されるため、
                      新しい業界テンプレートの追加が容易な拡張可能な設計です。
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-bold text-teal-700">GHGプロトコル準拠</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      国際的に広く採用されているGHGプロトコルに基づき、
                      Scope 1（直接排出）・Scope 2（電力由来間接排出）・Scope 3（その他間接排出）の
                      3分類で排出量を算定します。
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-bold text-teal-700">実務データに基づく入力設計</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      企業の環境担当者が実際に入手可能なデータ（電力請求書、燃料購入記録、
                      出張精算データなど）を入力項目として設計しています。
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-bold text-teal-700">モデルケースによる実証</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      3つの架空企業（IT企業50名、製造業200名、小売業120名）を設定し、
                      業界ごとの排出量構造の違いと削減目標管理の実例を示しています。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Tech Stack */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold">技術スタック</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { category: "フロントエンド", items: "React 19, TypeScript, Tailwind CSS 4" },
                    { category: "UIコンポーネント", items: "shadcn/ui, Radix UI" },
                    { category: "データ可視化", items: "Recharts（棒グラフ・円グラフ・エリアチャート）" },
                    { category: "アニメーション", items: "Framer Motion" },
                    { category: "ルーティング", items: "Wouter（軽量SPA Router）" },
                    { category: "ビルドツール", items: "Vite 7" },
                    { category: "排出係数データ", items: "環境省マニュアル準拠の独自定義" },
                    { category: "デザインシステム", items: "Terrain（等高線地図インスパイア）" },
                  ].map(tech => (
                    <div key={tech.category} className="p-3 rounded-lg bg-muted/50">
                      <div className="text-xs text-muted-foreground mb-1">{tech.category}</div>
                      <div className="text-sm font-medium">{tech.items}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Data Sources */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700">
                    <Database className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold">データ出典・参考文献</h2>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Scale className="w-4 h-4 mt-0.5 text-teal-600 shrink-0" />
                    <span>環境省「温室効果ガス排出量算定・報告マニュアル」— 排出係数の参考値</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-4 h-4 mt-0.5 text-teal-600 shrink-0" />
                    <span>GHG Protocol Corporate Standard — Scope 1/2/3 の分類基準</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Scale className="w-4 h-4 mt-0.5 text-teal-600 shrink-0" />
                    <span>電気事業者別排出係数（環境省・経済産業省公表）— 電力の排出係数</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-4 h-4 mt-0.5 text-teal-600 shrink-0" />
                    <span>Science Based Targets initiative (SBTi) — 削減目標設定の参考</span>
                  </li>
                </ul>
                <p className="mt-4 text-xs text-muted-foreground italic">
                  ※ 本アプリケーションはプロトタイプであり、モデルケース企業のデータは架空のものです。
                  排出係数は参考値であり、実際の算定には最新の公式データをご使用ください。
                </p>
              </CardContent>
            </Card>
          </motion.section>

          {/* Creator */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold">制作者情報</h2>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="text-xs text-muted-foreground mb-1">所属</div>
                      <div className="text-sm font-medium text-foreground">東京都市大学 環境学部 環境経営システム学科</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="text-xs text-muted-foreground mb-1">研究室</div>
                      <div className="text-sm font-medium text-foreground">経営工学研究室</div>
                    </div>
                  </div>
                  <p>
                    環境経営の専門知識とシステム設計の手法を組み合わせ、
                    企業のカーボンニュートラル推進を支援するツールの開発に取り組んでいます。
                    本プロジェクトは、環境学とIT技術の融合による社会課題解決の実践として制作しました。
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
