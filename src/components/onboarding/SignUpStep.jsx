import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Mail, Lock, Check } from "lucide-react";
import GoogleIcon from "@/components/GoogleIcon";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

/**
 * Embedded sign-up / login step rendered inside the OnboardingScreen shell.
 * Matches the onboarding aesthetic (indigo accents, rounded inputs, pill CTA).
 * On successful auth, calls onSuccess so the parent persists the next step
 * before the hard redirect back to /onboarding (where the flow resumes).
 */
export default function SignUpStep({ isAuthed, onSuccess }) {
  const [mode, setMode] = useState("register"); // register | login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  if (isAuthed) {
    return (
      <div className="flex flex-col items-center text-center flex-1 justify-center">
        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
          <Check size={32} className="text-indigo-600" strokeWidth={3} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">You're signed in</h1>
        <p className="text-gray-500 text-sm mb-6">Continue to finish setting up your account.</p>
        <button
          onClick={onSuccess}
          className="w-full py-4 rounded-full font-semibold text-base bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/25 active:scale-95 transition-all"
        >
          Continue
        </button>
      </div>
    );
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await base44.auth.register({ email, password });
      setShowOtp(true);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) base44.auth.setToken(result.access_token);
      onSuccess();
      window.location.href = "/onboarding";
    } catch (err) {
      setError(err.message || "Invalid verification code");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await base44.auth.resendOtp(email);
    } catch (err) {
      setError(err.message || "Failed to resend code");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      onSuccess();
      window.location.href = "/onboarding";
    } catch (err) {
      setError(err.message || "Invalid email or password");
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    onSuccess();
    base44.auth.loginWithProvider("google", "/onboarding");
  };

  if (showOtp) {
    return (
      <div className="flex flex-col flex-1">
        <div className="text-center mt-2 mb-5">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Verify your email</h1>
          <p className="text-gray-500 text-sm">We sent a code to {email}</p>
        </div>
        {error && <div className="mb-3 p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}
        <div className="flex justify-center mb-5">
          <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode} autoFocus autoComplete="one-time-code">
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <button
          onClick={handleVerify}
          disabled={loading || otpCode.length < 6}
          className="w-full py-4 rounded-full font-semibold text-base bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/25 disabled:opacity-60 active:scale-95 transition-all"
        >
          {loading ? "Verifying…" : "Verify"}
        </button>
        <p className="text-center text-sm text-gray-500 mt-4">
          Didn't receive the code?{" "}
          <button onClick={handleResend} className="text-indigo-600 font-medium hover:underline">
            Resend
          </button>
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full border-2 border-gray-200 bg-white rounded-xl pl-11 pr-4 py-3 text-base text-gray-700 outline-none focus:border-indigo-500 transition-colors";

  return (
    <div className="flex flex-col flex-1">
      <div className="text-center mt-2 mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {mode === "register" ? "Create your account" : "Welcome back"}
        </h1>
        <p className="text-gray-500 text-sm">
          {mode === "register" ? "Sign up to save your progress." : "Log in to continue your setup."}
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-4 bg-gray-100 rounded-full p-1">
        <button
          onClick={() => setMode("register")}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
            mode === "register" ? "bg-white text-indigo-600 shadow" : "text-gray-500"
          }`}
        >
          Sign up
        </button>
        <button
          onClick={() => setMode("login")}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
            mode === "login" ? "bg-white text-indigo-600 shadow" : "text-gray-500"
          }`}
        >
          Log in
        </button>
      </div>

      <button
        onClick={handleGoogle}
        className="w-full py-3.5 rounded-xl border-2 border-gray-200 bg-white text-sm font-medium flex items-center justify-center gap-2 hover:border-gray-300 transition-all mb-4"
      >
        <GoogleIcon className="w-5 h-5" /> Continue with Google
      </button>

      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-gray-400">or</span>
        </div>
      </div>

      {error && <div className="mb-3 p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}

      <form onSubmit={mode === "register" ? handleRegister : handleLogin} className="space-y-3">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoFocus
            className={inputClass}
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className={inputClass}
          />
        </div>
        {mode === "register" && (
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              required
              className={inputClass}
            />
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-full font-semibold text-base bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/25 disabled:opacity-60 active:scale-95 transition-all"
        >
          {loading
            ? mode === "register"
              ? "Creating…"
              : "Logging in…"
            : mode === "register"
            ? "Create account"
            : "Log in"}
        </button>
      </form>
    </div>
  );
}