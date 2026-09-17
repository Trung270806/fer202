"use client";

import React from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 sm:p-8">
      <div className="w-full max-w-md rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-lg border border-white/20 transition-transform duration-300 hover:scale-[1.02]">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</h1>
          <p className="text-white/70 text-sm">Please sign in to your account</p>
        </div>
        
        <form className="space-y-6" action="#" method="POST" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-white"
            >
              Email or Username
            </label>
            <div className="mt-2 relative">
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                required
                placeholder="Enter your email or username"
                className="block w-full rounded-lg border-0 bg-white/5 py-2.5 px-4 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-white/40 focus:bg-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6 transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-white"
              >
                Password
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-300 hover:text-indigo-200 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2 relative">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Enter your password"
                className="block w-full rounded-lg border-0 bg-white/5 py-2.5 px-4 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-white/40 focus:bg-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6 transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-lg bg-white px-3 py-3 text-sm font-semibold leading-6 text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Sign In
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-white/60">
          Not a member?{" "}
          <a
            href="#"
            className="font-semibold leading-6 text-indigo-300 hover:text-indigo-200 transition-colors"
          >
            Start a 14 day free trial
          </a>
        </p>
      </div>
    </main>
  );
}
