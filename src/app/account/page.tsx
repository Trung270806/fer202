"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";

export default function AccountPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div
          data-testid="account-page"
          className="glass-card rounded-2xl p-8 shadow-2xl border border-slate-800"
        >
          <h1 className="text-2xl font-bold mb-6 text-white">My Account</h1>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email Address
              </label>
              <p
                data-testid="account-email"
                className="text-lg font-medium text-violet-300 mt-1"
              >
                {user.email}
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                User ID
              </label>
              <p className="text-sm font-mono text-slate-400 mt-1">{user.id}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
