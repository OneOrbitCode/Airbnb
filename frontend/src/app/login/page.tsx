"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, DEMO_ACCOUNTS, UserProfile } from "@/components/AuthContext";
import { useTheme } from "@/components/ThemeProvider";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams?.get("redirect") || "/";
  const { currentUser, loginAsUser, loginWithEmail } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [selectedDemoId, setSelectedDemoId] = useState<number>(DEMO_ACCOUNTS[0].id);
  const [emailInput, setEmailInput] = useState<string>(DEMO_ACCOUNTS[0].email);
  const [passwordInput, setPasswordInput] = useState<string>("airbnb_demo_2026");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [successUser, setSuccessUser] = useState<UserProfile | null>(null);

  const handleSelectDemo = (demo: UserProfile) => {
    setSelectedDemoId(demo.id);
    setEmailInput(demo.email);
    setPasswordInput("airbnb_demo_2026");
  };

  const handleDirectLogin = (demo: UserProfile) => {
    setSelectedDemoId(demo.id);
    setEmailInput(demo.email);
    setIsLoading(true);

    setTimeout(() => {
      loginAsUser(demo);
      setSuccessUser(demo);
      setIsLoading(false);

      setTimeout(() => {
        if (demo.role === "host" && redirectPath === "/") {
          router.push("/host");
        } else {
          router.push(redirectPath);
        }
      }, 1200);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      const match = DEMO_ACCOUNTS.find(
        (u) => u.email.toLowerCase() === emailInput.trim().toLowerCase()
      );
      const userToLogin =
        match ||
        DEMO_ACCOUNTS.find((u) => u.id === selectedDemoId) ||
        DEMO_ACCOUNTS[0];

      loginAsUser(userToLogin);
      setSuccessUser(userToLogin);
      setIsLoading(false);

      setTimeout(() => {
        if (userToLogin.role === "host" && redirectPath === "/") {
          router.push("/host");
        } else {
          router.push(redirectPath);
        }
      }, 1200);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#121212] flex flex-col justify-between transition-colors">
      
      {/* Top Simple Header */}
      <header className="h-16 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#181818] px-4 sm:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer" aria-label="Airbnb Home">
          <img 
            src="https://download.logo.wine/logo/Airbnb/Airbnb-Logo.wine.png" 
            alt="Airbnb" 
            className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            title="Toggle theme"
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm transition cursor-pointer"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <Link
            href="/"
            className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white underline cursor-pointer"
          >
            Return to Home
          </Link>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-6 my-4">
        <div className="w-full max-w-lg bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-xl border border-gray-200 dark:border-neutral-800 overflow-hidden transition-all">
          
          {/* Card Title */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between">
            <h1 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
              Log in or sign up
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FF385C]/10 text-[#FF385C] px-2.5 py-1 rounded-full">
              Demo Mode Active
            </span>
          </div>

          <div className="p-6 sm:p-7 flex flex-col gap-6">
            
            {/* Success Animation Banner */}
            {successUser && (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 rounded-2xl p-4 flex items-center gap-3.5 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500 flex-shrink-0">
                  <img src={successUser.avatar} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-200 truncate">
                    Welcome back, {successUser.name}!
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
                    Logged in as {successUser.role === "host" ? "Host" : "Guest"}. Redirecting now...
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
              </div>
            )}

            {/* Quick 1-Click Demo Accounts Section */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  ⚡ Pre-fed Demo Accounts (1-Click)
                </span>
                <span className="text-[11px] text-neutral-400">Click to switch</span>
              </div>

              <div className="flex flex-col gap-2.5">
                {DEMO_ACCOUNTS.map((demo) => {
                  const isSelected = selectedDemoId === demo.id;
                  const isHost = demo.role === "host";

                  return (
                    <div
                      key={demo.id}
                      onClick={() => handleSelectDemo(demo)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? "border-[#FF385C] bg-[#FF385C]/5 dark:bg-[#FF385C]/10 shadow-xs"
                          : "border-gray-200 dark:border-neutral-700 hover:border-gray-400 dark:hover:border-neutral-500 bg-neutral-50/50 dark:bg-neutral-800/40"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-300 dark:border-neutral-600 flex-shrink-0">
                          <img src={demo.avatar} alt={demo.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white truncate">
                              {demo.name}
                            </span>
                            {isHost ? (
                              <span className="bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                                ★ Superhost
                              </span>
                            ) : (
                              <span className="bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                                Verified Guest
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                            {demo.email}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDirectLogin(demo);
                        }}
                        disabled={isLoading}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-xs flex-shrink-0 cursor-pointer ${
                          isSelected
                            ? "bg-[#FF385C] hover:bg-[#E00B41] text-white"
                            : "bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100"
                        }`}
                      >
                        {isSelected ? "Log in →" : "Select"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <hr className="flex-1 border-gray-200 dark:border-neutral-800" />
              <span className="text-xs text-neutral-400 font-medium">or continue below</span>
              <hr className="flex-1 border-gray-200 dark:border-neutral-800" />
            </div>

            {/* Standard Form Pre-filled */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-neutral-700 bg-transparent text-sm text-neutral-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-neutral-500 hover:text-black dark:hover:text-white underline cursor-pointer"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-neutral-700 bg-transparent text-sm text-neutral-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400 py-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-[#FF385C] rounded"
                  />
                  <span>Remember my login</span>
                </label>
                <span className="text-[#FF385C] font-semibold cursor-pointer">
                  Forgot password?
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-1 bg-[#FF385C] hover:bg-[#E00B41] active:scale-98 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Continue with Demo Login</span>
                )}
              </button>
            </form>

            {/* Social Logins */}
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => handleDirectLogin(DEMO_ACCOUNTS[0])}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-300 dark:border-neutral-700 hover:border-black dark:hover:border-white bg-transparent flex items-center justify-center gap-3 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleDirectLogin(DEMO_ACCOUNTS[1])}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-300 dark:border-neutral-700 hover:border-black dark:hover:border-white bg-transparent flex items-center justify-center gap-3 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.8 1.44-.59.69-1.12 1.81-.98 2.91 1.07.08 2.14-.55 2.79-1.31z" />
                </svg>
                <span>Continue with Apple</span>
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-neutral-500 border-t border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#181818]">
        © 2026 Airbnb, Inc. Clone · Privacy · Terms · Sitemap
      </footer>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-b-2 border-[#FF385C] animate-spin" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
