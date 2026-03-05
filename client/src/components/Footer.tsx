/**
 * Footer — 企業向けカーボンフットプリント管理ツール
 */
import { Leaf } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/20 py-10">
      <div className="container">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-teal-600 to-emerald-600 flex items-center justify-center">
                <Leaf className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <span className="font-bold text-foreground">EcoTrace</span>
                <span className="text-[10px] text-muted-foreground ml-1">for Business</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              中小企業のCO2排出量算定・可視化を支援する<br />
              Webアプリケーション プロトタイプ
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-3">ページ</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">ホーム</Link>
              <Link href="/templates" className="hover:text-foreground transition-colors">業界テンプレート</Link>
              <Link href="/demo" className="hover:text-foreground transition-colors">デモ</Link>
              <Link href="/about" className="hover:text-foreground transition-colors">このプロジェクトについて</Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-3">参考文献</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a href="https://ghgprotocol.org/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                GHG Protocol
              </a>
              <a href="https://www.env.go.jp/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                環境省
              </a>
              <a href="https://sciencebasedtargets.org/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                SBTi
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <p>
            東京都市大学 環境学部 環境経営システム学科 経営工学研究室
          </p>
          <p>
            &copy; {new Date().getFullYear()} EcoTrace for Business — Portfolio Project
          </p>
        </div>
      </div>
    </footer>
  );
}
