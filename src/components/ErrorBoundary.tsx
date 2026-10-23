import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#011230] text-white flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
            <AlertTriangle size={28} />
          </div>
          <h2 className="text-xl font-bold font-headline mb-2 text-[#e2e8f0]">
            화면을 불러오는 도중 문제가 발생했습니다
          </h2>
          <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
            일시적인 브라우저 DOM 동기화 문제일 수 있습니다. 아래 버튼을 눌러 다시 로드해 주세요.
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#00E5FF] hover:bg-[#00E5FF]/85 text-[#011230] font-bold rounded-lg text-xs transition-colors cursor-pointer shadow-lg"
          >
            <RefreshCw size={14} />
            <span>페이지 새로고침</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
