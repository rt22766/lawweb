import Link from "next/link";

import { getCurrentSession } from "@/lib/auth-session";
import { siteConfig } from "@/lib/site";

export async function SiteHeader() {
  const session = await getCurrentSession();
  const navItems = siteConfig.nav.filter((item) => item.href !== "/login" && item.href !== "/register");

  return (
    <header className="site-header">
      <div className="site-container shell-row">
        <Link href="/" className="brand" aria-label={`${siteConfig.name} 首页`}>
          <div className="brand-mark-wrapper">
            <span className="brand-mark" aria-hidden="true" />
          </div>
          <span className="brand-copy">
            <strong>{siteConfig.shortName}</strong>
            <span>辅助决策平台</span>
          </span>
        </Link>

        <nav className="site-nav" aria-label="主导航">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions auth-header-actions">
          {session ? (
            <>
              <span className="header-session-pill">
                {session.displayName} · {session.role === "resident" ? "居民/当事人" : "法官/专业用户"}
              </span>
              <form action="/api/auth/logout" method="post">
                <button type="submit" className="button button-secondary header-cta">
                  退出登录
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="button button-secondary header-cta">
                登录
              </Link>
              <Link href="/register" className="button button-primary header-cta">
                注册
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
