import { useState, useEffect } from 'react';

export function useIsMobile(bp = 820) {
  const [m, setM] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < bp : false));
  useEffect(() => {
    const f = () => setM(window.innerWidth < bp);
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, [bp]);
  return m;
}

// 모바일 접이식 패널: 칩 버튼 → 시트
export function MobilePanel({ chip, side = 'left', children }) {
  const [open, setOpen] = useState(false);
  const pos = side === 'left' ? { left: 8 } : { right: 8 };
  return (
    <>
      <button onClick={() => setOpen(true)} className="glass font-round"
        style={{ position: 'absolute', top: 56, ...pos, zIndex: 25, border: 'none', borderRadius: 14, padding: '7px 12px', fontSize: 12, color: '#0ea5e9', cursor: 'pointer' }}>
        {chip}
      </button>
      {open && (
        <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 45, background: 'rgba(30,41,59,0.32)' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: 50, left: 8, right: 8, maxHeight: '78vh', overflowY: 'auto' }}>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setOpen(false)}
                style={{ position: 'absolute', top: 8, right: 8, zIndex: 2, border: 'none', background: 'rgba(255,255,255,0.85)', borderRadius: 999, width: 26, height: 26, cursor: 'pointer', color: '#64748b', fontSize: 15 }}>✕</button>
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
