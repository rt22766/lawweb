import type { PropsWithChildren } from "react";

type SectionShellProps = PropsWithChildren<{
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}>;

export function SectionShell({
  eyebrow,
  title,
  description,
  children,
  className = "",
}: SectionShellProps) {
  return (
    <section className={`section-shell ${className}`}>
      <div className="section-heading">
        {eyebrow ? <span className="section-eyebrow">{eyebrow}</span> : null}
        <h2>{title}</h2>
        {description ? <p className="section-desc">{description}</p> : null}
      </div>
      <div className="section-body">{children}</div>
    </section>
  );
}
