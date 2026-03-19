import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6 border border-destructive/20 shadow-[0_0_30px_rgba(var(--destructive),0.2)]">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-4 tracking-tight">System Fault Detected</h1>
          <p className="text-muted-foreground mb-8 max-w-md font-light">
            The neural link encountered an unexpected exception. Please attempt to re-initialize the interface.
          </p>
          <div className="flex gap-4">
            <Button 
              onClick={() => window.location.reload()} 
              variant="default"
              className="px-8 shadow-glow-accent"
            >
              <RefreshCcw className="w-4 h-4 mr-2" /> Re-initialize
            </Button>
            <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="px-8"
            >
                Return to Base
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-12 p-6 rounded-2xl bg-black/40 border border-white/5 text-left text-xs text-destructive-foreground overflow-auto max-w-2xl max-h-48 scrollbar-hide">
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
