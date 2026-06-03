import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  componentDidCatch(err, info) { console.error('VPP3D ERROR:', err, info); }
  render() {
    if (this.state.err) {
      return (
        <div style={{
          position: 'fixed', inset: 0, padding: 24, overflow: 'auto',
          background: '#fff', color: '#b91c1c', fontFamily: 'monospace', fontSize: 13, zIndex: 9999,
        }}>
          <h2 style={{ color: '#0ea5e9' }}>⚠️ 렌더링 오류 (이 메시지를 캡쳐해서 보내주세요)</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{String(this.state.err && this.state.err.stack || this.state.err)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
