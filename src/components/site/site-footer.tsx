import Link from "next/link";

import { siteConfig } from "../../lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container footer-grid">
        <div className="footer-block brand-block">
          <div className="brand-copy">
            <strong>{siteConfig.name}</strong>
            <span>让法律分析有迹可循</span>
          </div>
          <p className="footer-desc">
            我们致力于提供高透明度、事实驱动的辅助决策系统，而不是黑盒预测工具。
            通过严谨的规则引擎和类案模型，服务于司法机关与法律服务机构。
          </p>
        </div>

        <div className="footer-block">
          <strong>产品与方案</strong>
          <div className="footer-links">
            {siteConfig.nav.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="footer-block">
          <strong>合作咨询</strong>
          <a href={`mailto:${siteConfig.email}`} className="footer-email">{siteConfig.email}</a>
          <div className="footer-links" style={{ marginTop: '12px' }}>
            <Link href="/workspace">进入系统演示工作区</Link>
          </div>
        </div>
      </div>
      
      <div className="site-container footer-bottom">
        <p>© {new Date().getFullYear()} FactFlow AI. 拒绝黑盒预测，支持事实审查。</p>
        <div className="legal-links">
          <Link href="#">服务条款</Link>
          <Link href="#">隐私政策</Link>
        </div>
      </div>
    </footer>
  );
}
