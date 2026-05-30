import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCcw } from 'lucide-react';
import { LotaLogo } from './LotaLogo';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-center items-center p-6 font-sans">
          <div className="max-w-sm w-full bg-zinc-900 border border-red-500/20 p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center">
            <div className="mb-6 p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
              <LotaLogo className="h-16 w-auto" forceColor="#EF4444" isDark={true} />
            </div>
            
            <h1 className="text-2xl font-black tracking-tight text-white mb-2">Ops, algo deu errado.</h1>
            <p className="text-sm text-zinc-400 leading-relaxed mb-8">
              O aplicativo encontrou um erro inesperado e não conseguiu carregar esta tela.
            </p>

            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all active:scale-95"
            >
              <RefreshCcw size={16} />
              Recarregar App
            </button>
            
            {this.state.error && (
              <div className="mt-6 w-full pt-4 border-t border-zinc-800 text-left">
                <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider mb-2 block">Log de Erro Técnico</span>
                <p className="text-[10px] font-mono text-rose-400 bg-rose-500/5 p-3 rounded-xl border border-rose-500/10 overflow-x-auto whitespace-pre-wrap">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
