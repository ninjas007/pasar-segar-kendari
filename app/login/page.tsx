"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    if (response.ok) router.replace("/admin"); else setMessage((await response.json()).message);
    setBusy(false);
  }
  return <main className="adminShell"><form className="adminCard loginCard" onSubmit={submit}><p className="eyebrow">AREA TERBATAS</p><h1>Masuk Admin</h1><p>Kelola produk Pasar Segar Kendari.</p><label>Kata sandi<input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus /></label>{message && <p className="formMessage error">{message}</p>}<button className="adminPrimary" disabled={busy}>{busy ? "Memeriksa..." : "Masuk"}</button></form></main>;
}
