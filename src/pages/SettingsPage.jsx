import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Bell, Download, Upload, Loader2, FileText, MessageSquare, ChevronRight, UserPlus, X, LogOut, Moon } from "lucide-react";
import { useAppState } from "@/lib/AppState";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { darkMode, setDarkMode, profile, setProfile, shots, journalEntries, dayMetrics, resetState, proxyAccess, addProxyAccess, revokeProxyAccess } = useAppState();
  const { logout } = useAuth();
  const [proxyEmail, setProxyEmail] = useState("");
  const [proxyScope, setProxyScope] = useState("read");
  const [proxySaving, setProxySaving] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(profile?.notifications_enabled || false);
  const [backupLoading, setBackupLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);

  const handleGrantProxy = async () => {
    if (!proxyEmail.trim()) { alert("Enter an email address"); return; }
    setProxySaving(true);
    try {
      await addProxyAccess({
        grantee_email: proxyEmail.trim(),
        scope: proxyScope,
        status: "pending",
        granted_date: new Date().toISOString(),
      });
      setProxyEmail("");
      alert("Access granted. The recipient will be able to view your data once they register with this email.");
    } catch (err) {
      alert("Failed to grant access");
    }
    setProxySaving(false);
  };

  const handleRevoke = async (id) => {
    if (!confirm("Revoke access for this proxy?")) return;
    await revokeProxyAccess(id);
  };

  const handleLogout = () => {
    resetState();
    logout();
  };

  const handleDarkMode = async (val) => {
    await setDarkMode(val);
  };

  const handleNotifications = async (val) => {
    setNotifEnabled(val);
    await setProfile({ ...profile, notifications_enabled: val });
    if (val && "Notification" in window) {
      Notification.requestPermission();
    }
  };

  const handleBackup = () => {
    setBackupLoading(true);
    const data = { shots, journalEntries, dayMetrics, profile, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `levli-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click(); URL.revokeObjectURL(url);
    setBackupLoading(false);
  };

  const handleRestore = async () => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = ".json";
    input.onchange = async (e) => {
      setRestoreLoading(true);
      const file = e.target.files[0];
      if (!file) { setRestoreLoading(false); return; }
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (data.profile) await setProfile({ ...profile, ...data.profile });
        if (data.shots && Array.isArray(data.shots) && data.shots.length) {
          await base44.entities.Shot.bulkCreate(data.shots.map((s) => ({
            medication: s.medication, dose: s.dose, drug_class: s.drug_class, molecular_class: s.molecular_class,
            route: s.route, device_type: s.device_type, dose_unit: s.dose_unit, medication_id: s.medication_id,
            date: s.date, time: s.time, site: s.site, pain: s.pain, notes: s.notes,
            reconstitution_date: s.reconstitution_date, in_use_expiry: s.in_use_expiry,
          })));
        }
        if (data.journalEntries && Array.isArray(data.journalEntries) && data.journalEntries.length) {
          await base44.entities.JournalEntry.bulkCreate(data.journalEntries.map((j) => ({
            text: j.text, date: j.date, time: j.time, mood: j.mood, mood_color: j.mood_color, category: j.category,
          })));
        }
        alert("Restore complete. Please reload the app to see your restored data.");
      } catch (err) {
        alert("Restore failed: " + (err.message || "invalid file"));
      }
      setRestoreLoading(false);
    };
    input.click();
  };

  const Toggle = ({ value, onChange }) => (
    <button
      onClick={() => onChange(!value)}
      className={`w-12 h-7 rounded-full transition-colors relative active:scale-95 ${value ? "bg-indigo-600" : "bg-gray-200"}`}
    >
      <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow ${value ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );

  const MenuItem = ({ icon, label, onPress, href, to }) => {
    const inner = (
      <div className="flex items-center justify-between py-3.5 w-full">
        <div className="flex items-center gap-3">
          {icon}
          <span className="text-sm text-gray-600">{label}</span>
        </div>
        <ChevronRight size={16} className="text-gray-300" />
      </div>
    );
    if (to) return <Link to={to}>{inner}</Link>;
    if (href) return <a href={href} target="_blank" rel="noopener noreferrer">{inner}</a>;
    if (onPress) return <button onClick={onPress} className="w-full text-left">{inner}</button>;
    return inner;
  };

  const MenuIcon = ({ children, tint }) => (
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${tint}`}>{children}</div>
  );

  return (
    <div className="bg-[#FAFAFA] min-h-screen w-full">
      <div className="w-full flex items-center gap-3 px-5 pt-6 pb-4 bg-[#FAFAFA] sticky top-0 z-30">
        <button onClick={() => navigate(-1)}><div className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center active:scale-95 transition-all"><ChevronLeft size={20} className="text-gray-500" /></div></button>
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      </div>

      <div className="max-w-lg mx-auto">
        {/* Appearance & Security */}
        <div className="px-4 mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-2 px-1">Appearance & Security</p>
          <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MenuIcon tint="bg-indigo-100"><Moon size={18} className="text-indigo-500" /></MenuIcon>
                <span className="text-sm text-gray-600">Dark Mode</span>
              </div>
              <Toggle value={darkMode} onChange={handleDarkMode} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MenuIcon tint="bg-teal-100"><Bell size={18} className="text-teal-500" /></MenuIcon>
                <div>
                  <span className="text-sm text-gray-600 block">Push Notifications</span>
                  <span className="text-[11px] text-gray-400">Saves your permission; reminders are not active yet.</span>
                </div>
              </div>
              <Toggle value={notifEnabled} onChange={handleNotifications} />
            </div>
          </div>
        </div>

        {/* General */}
        <div className="px-4 mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-2 px-1">General</p>
          <div className="bg-white rounded-2xl px-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80 divide-y divide-gray-100">
            <MenuItem icon={backupLoading ? <MenuIcon tint="bg-indigo-100"><Loader2 size={18} className="animate-spin text-indigo-500" /></MenuIcon> : <MenuIcon tint="bg-indigo-100"><Download size={18} className="text-indigo-500" /></MenuIcon>} label="Backup Data" onPress={handleBackup} />
            <MenuItem icon={restoreLoading ? <MenuIcon tint="bg-teal-100"><Loader2 size={18} className="animate-spin text-teal-500" /></MenuIcon> : <MenuIcon tint="bg-teal-100"><Upload size={18} className="text-teal-500" /></MenuIcon>} label="Restore Data" onPress={handleRestore} />
          </div>
        </div>

        {/* Policy */}
        <div className="px-4 mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-2 px-1">Policy and application terms</p>
          <div className="bg-white rounded-2xl px-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80 divide-y divide-gray-100">
            <MenuItem icon={<MenuIcon tint="bg-orange-100"><FileText size={18} className="text-orange-500" /></MenuIcon>} label="Privacy Policy" to="/privacy" />
            <MenuItem icon={<MenuIcon tint="bg-orange-100"><FileText size={18} className="text-orange-500" /></MenuIcon>} label="Terms and Conditions" to="/terms" />
          </div>
        </div>

        {/* Caregiver Access */}
        <div className="px-4 mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-2 px-1">Caregiver Access</p>
          <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80 space-y-3">
            <p className="text-xs text-gray-400">Grant scoped, revocable access to a caregiver or family member so they can view your logs. Your data stays yours.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input type="email" value={proxyEmail} onChange={(e) => setProxyEmail(e.target.value)} placeholder="caregiver@email.com"
                className="flex-1 border-2 border-gray-200 bg-white text-gray-800 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 transition-colors min-w-0" />
              <select value={proxyScope} onChange={(e) => setProxyScope(e.target.value)}
                className="border-2 border-gray-200 bg-white text-gray-800 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 sm:w-auto">
                <option value="read">Read only</option>
                <option value="read_write">Read & write</option>
              </select>
            </div>
            <button onClick={handleGrantProxy} disabled={proxySaving}
              className="w-full py-3 bg-indigo-600 text-white rounded-full font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
              <UserPlus size={16} /> {proxySaving ? "Granting…" : "Grant Access"}
            </button>
            {proxyAccess.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-gray-100">
                {proxyAccess.map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-sm gap-2">
                    <div className="min-w-0">
                      <span className="text-gray-700 truncate block">{p.grantee_email}</span>
                      <span className="text-xs text-gray-400">{p.scope} · {p.status}</span>
                    </div>
                    {p.status !== "revoked" && (
                      <button onClick={() => handleRevoke(p.id)} className="text-orange-500 flex items-center gap-1 text-xs">
                        <X size={14} /> Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Feedback */}
        <div className="px-4 mb-4">
          <div className="bg-white rounded-2xl px-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80">
            <MenuItem icon={<MenuIcon tint="bg-purple-100"><MessageSquare size={18} className="text-purple-500" /></MenuIcon>} label="Leave feedback" href="mailto:feedback@levli.app" />
          </div>
        </div>

        <div className="px-4 mb-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-white text-orange-500 font-semibold rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/80 active:scale-95 transition-all"
          >
            <LogOut size={18} /> Log Out
          </button>
        </div>

        <div className="py-6 text-center">
          <p className="text-xs text-gray-400">Version 1.0.0</p>
          <p className="text-xs text-gray-400">© 2026 Levli</p>
        </div>
      </div>
    </div>
  );
}