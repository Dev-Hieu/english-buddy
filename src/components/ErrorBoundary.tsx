import React, { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">
            !
          </div>
          <h1 className="mb-2 text-xl font-bold text-gray-800">
            Da xay ra loi
          </h1>
          <p className="mb-6 text-sm text-gray-500">
            Ung dung gap su co. Vui long thu tai lai trang.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Thu tai lai trang
          </button>
          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="mt-3 w-full rounded-xl border border-gray-200 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Quay ve trang chinh
          </button>
        </div>
      </div>
    );
  }
}
