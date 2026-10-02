import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';

export function NotFound() {
  return (
    <div style={{ paddingTop: '72px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container reveal-init" style={{ textAlign: 'center', maxWidth: '480px' }}>
        <p className="mono" style={{ fontSize: '14px', color: 'var(--terracotta)', marginBottom: '16px', letterSpacing: '0.1em' }}>404</p>
        <h1 style={{ marginBottom: '16px' }}>Page not found</h1>
        <p className="body-copy" style={{ margin: '0 auto 32px' }}>The page you're looking for doesn't exist or has moved.</p>
        <Link to="/" className="btn">Back home</Link>
      </div>
    </div>
  );
}

type PageHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="section page-header-section" style={{ paddingBottom: 'clamp(40px, 6vw, 64px)', position: 'relative' }}>
      <div className="page-header-glow" aria-hidden="true" />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--line)',
            paddingBottom: '16px',
            marginBottom: '48px',
          }}
        >
          <span className="eyebrow">{eyebrow}</span>
          <Link to="/" className="text-link" style={{ borderBottom: 'none' }}>
            Back to home <ArrowUpRight size={14} />
          </Link>
        </div>
        <h1 style={{ maxWidth: '880px' }}>
          {title}
        </h1>
        {description && (
          <p className="body-copy body-copy--lg" style={{ marginTop: '24px' }}>
            {description}
          </p>
        )}
      </div>
    </section>
  );
}

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: 'left' | 'center';
};

export function SectionHeading({ eyebrow, title, description, align = 'left' }: SectionHeadingProps) {
  return (
    <div className="reveal-init" style={{ textAlign: align === 'center' ? 'center' : 'left' }}>
      {eyebrow && <p className="eyebrow" style={{ marginBottom: '20px' }}>{eyebrow}</p>}
      <h2>{title}</h2>
      {description && <p className="body-copy" style={{ marginTop: '24px', marginLeft: 'auto', marginRight: 'auto' }}>{description}</p>}
    </div>
  );
}

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state reveal-init">
      {icon && <div className="es-icon">{icon}</div>}
      <h3>{title}</h3>
      {description && <p className="body-copy">{description}</p>}
      {action && <div style={{ marginTop: '28px' }}>{action}</div>}
    </div>
  );
}

type LoadingStateProps = {
  message: string;
};

export function LoadingState({ message }: LoadingStateProps) {
  return <div className="loading-state">{message}</div>;
}
