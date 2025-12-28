"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCcw, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error Boundary caught an error:", error, errorInfo);

    this.setState({
      hasError: true,
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Reload the page
    window.location.reload();
  };

  handleSignOut = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    signOut({ callbackUrl: "/" });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white p-8">
          {/* Soft background decor */}
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-rose-50/30 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-rose-50/30 rounded-full blur-[120px]"></div>

          <div className="max-w-md w-full p-12 text-center relative z-10">
            <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 soft-shadow border border-rose-100">
              <AlertTriangle className="text-rose-500" size={48} strokeWidth={2.5} />
            </div>

            <h1 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">
              Oops! Something went wrong
            </h1>
            <p className="text-slate-500 mb-12 font-medium leading-relaxed">
              We encountered an unexpected error while loading your analytics.
              This has been logged and we're working to fix it.
            </p>

            {this.state.error && (
              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 mb-8">
                <p className="text-sm font-bold text-rose-800 mb-2 tracking-tight">
                  Error Details
                </p>
                <p className="text-xs font-medium text-rose-600 font-mono">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <button
                onClick={this.handleRetry}
                className="w-full bg-white border border-slate-100 text-slate-700 px-8 py-4 rounded-2xl font-black hover:border-accent-primary/20 hover:text-accent-primary transition-all flex items-center justify-center gap-3 soft-shadow active:scale-95"
              >
                <RotateCcw size={20} strokeWidth={2.5} />
                <span>Try Again</span>
              </button>

              <button
                onClick={this.handleSignOut}
                className="w-full bg-rose-500 text-white border border-rose-600 px-8 py-4 rounded-2xl font-black hover:bg-rose-600 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <LogOut size={20} strokeWidth={2.5} />
                <span>Sign Out</span>
              </button>
            </div>

            <p className="mt-10 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
              If the problem persists, please contact support
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
