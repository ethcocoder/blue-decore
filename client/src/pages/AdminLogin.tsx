// Broadcast Atelier direction: the private entry is the quiet threshold into Kasha's secure editorial control room.
import { FormEvent, useState } from "react";
import { ArrowLeft, ArrowUpRight, LockKeyhole, Moon, Sun } from "lucide-react";
import { useLocation } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import { firebaseAuth } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut as signOutFirebase } from "firebase/auth";
export { AdminDashboard } from "./AdminControlRoom";

export default function AdminLogin() {
  const [, setLocation] = useLocation(); const { theme, toggleTheme } = useTheme(); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [message, setMessage] = useState(""); const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) { setMessage("Enter both fields to continue."); return; }
    setMessage(""); setIsSubmitting(true);
    try {
      const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const idToken = await credential.user.getIdToken(true);
      const response = await fetch("/api/firebase/session", { method: "POST", headers: { "content-type": "application/json" }, credentials: "include", body: JSON.stringify({ idToken }) });
      const responseText = await response.text();
      let result: { role?: string; error?: string } = {};
      if (responseText.trim()) {
        try { result = JSON.parse(responseText) as { role?: string; error?: string }; }
        catch { result.error = "The admin service returned an invalid response. Please try again."; }
      }
      if (!response.ok || result.role !== "admin") {
        await signOutFirebase(firebaseAuth);
        const serviceError = response.status === 404 || response.status === 405
          ? "The admin service is not connected to this deployment yet. Please redeploy the Blue Decore server API."
          : "This Firebase account does not have administrator access.";
        throw new Error(result.error ?? serviceError);
      }
      setLocation("/admin/dashboard");
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "Sign-in could not be completed.");
    } finally { setIsSubmitting(false); }
  };
  return <main className="admin-shell"><div className="admin-topbar"><a className="admin-back" href="/"><ArrowLeft size={15} /> Back to Blue Decore</a><button className="header-tool" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>{theme === "light" ? <Moon size={16} /> : <Sun size={16} />}</button></div><section className="admin-card" aria-labelledby="admin-heading"><div className="admin-card-mark"><LockKeyhole size={20} /></div><p className="eyebrow">Blue Decore desk / private access</p><h1 id="admin-heading">Sign in to<br /><em>the desk.</em></h1><p className="admin-intro">Plan every beautiful detail from one calm room.</p><form className="admin-form" onSubmit={handleSubmit}><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@bluedecore.et" autoComplete="email" /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" autoComplete="current-password" /></label>{message && <p className="admin-error" role="alert">{message}</p>}<button className="button button-signal" type="submit" disabled={isSubmitting}>{isSubmitting ? "Verifying…" : "Enter the desk"} <ArrowUpRight size={16} /></button></form><p className="admin-note">Firebase verifies your email/password before the Blue Decore server issues the secure admin session.</p></section></main>;
}
