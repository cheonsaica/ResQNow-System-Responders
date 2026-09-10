import { useMemo, useState } from "react";
import {
  Activity,
  Bell,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  Flame,
  FileText,
  ImagePlus,
  LifeBuoy,
  List,
  Lock,
  LogIn,
  Mail,
  Map,
  MapPin,
  Navigation,
  Phone,
  Plus,
  Shield,
  Siren,
  Stethoscope,
  Eye,
  EyeOff,
  UserRound,
  Users,
  X,
} from "lucide-react";
import barangayPhoto from "../../src/assets/barangay/barangay-camunatan.jpg";

const initialReports = [
  {
    id: "RN-2408",
    type: "Flood Rescue",
    location: "Purok 4, Camunatan",
    priority: "High",
    status: "On the way",
    contact: "0917 555 0142",
    assigned: "Today, 8:42 AM",
    person: "Maria Santos",
    summary:
      "Water rising inside a single-storey home. Two seniors need assistance.",
    team: "Alpha Rescue Team",
    score: 6,
    checks: [
      "Life at risk",
      "Water above knee",
      "Immediate evacuation",
      "Senior affected",
      "Multiple people affected",
      "Medical help needed",
    ],
    hotline: "CDRRMO / Rescue",
    history: [
      { status: "Assigned", by: "Admin Carla", time: "8:42 AM" },
      { status: "On the way", by: "Joel Ramirez", time: "8:51 AM" },
    ],
  },
  {
    id: "RN-2405",
    type: "Medical Emergency",
    location: "Purok 2, Camunatan",
    priority: "High",
    status: "Arrived at location",
    contact: "0908 224 1029",
    assigned: "Today, 7:58 AM",
    person: "Ramon Dela Cruz",
    summary: "Resident reports chest pain and difficulty breathing.",
    team: "Bravo Medical Unit",
    score: 5,
    checks: [
      "Life at risk",
      "Medical help needed",
      "Senior affected",
      "Immediate evacuation",
      "Multiple people affected",
    ],
    hotline: "Hospital / Ambulance",
    history: [
      { status: "Assigned", by: "Admin Carla", time: "7:58 AM" },
      { status: "On the way", by: "Joel Ramirez", time: "8:04 AM" },
      { status: "Arrived at location", by: "Joel Ramirez", time: "8:19 AM" },
    ],
  },
  {
    id: "RN-2399",
    type: "Electrical / Fire Risk",
    location: "Purok 7, Camunatan",
    priority: "Medium",
    status: "Contacted resident",
    contact: "0920 781 3344",
    assigned: "Yesterday, 6:20 PM",
    person: "Lina Mercado",
    summary: "Sparking outlet reported near a wet kitchen wall.",
    team: "Alpha Rescue Team",
    score: 3,
    checks: ["Fire/electrical risk", "Water above knee", "Life at risk"],
    hotline: "BFP",
    history: [
      { status: "Assigned", by: "Admin Carla", time: "Yesterday, 6:20 PM" },
      {
        status: "Contacted resident",
        by: "Joel Ramirez",
        time: "Yesterday, 6:42 PM",
      },
    ],
  },
  {
    id: "RN-2388",
    type: "Public Safety",
    location: "Purok 1, Camunatan",
    priority: "Low",
    status: "Resolved",
    contact: "0998 331 7812",
    assigned: "Yesterday, 1:15 PM",
    person: "Danilo Reyes",
    summary: "Noise and access concern at the community center.",
    team: "Bravo Safety Unit",
    score: 2,
    checks: ["Multiple people affected", "Location confirmed"],
    hotline: "Police",
    history: [
      { status: "Assigned", by: "Admin Carla", time: "Yesterday, 1:15 PM" },
      { status: "Resolved", by: "Mika Torres", time: "Yesterday, 2:03 PM" },
    ],
  },
];

const updateOptions = [
  "On the way",
  "Arrived at location",
  "Contacted resident",
  "Assistance provided",
  "Needs additional support",
  "Resolved",
  "Unable to locate",
  "False/invalid after checking",
];
const checklistItems = [
  "Contact person reached",
  "Location confirmed",
  "Arrived at area",
  "Safety checked",
  "Assistance provided",
  "Evacuation assisted",
  "Medical help requested",
  "Hotline contacted",
  "Report resolved",
];

const dashboardMarkerPositions = [
  "left-[7%] top-[16%]",
  "left-[55%] top-[16%]",
  "left-[7%] top-[57%]",
  "left-[55%] top-[57%]",
];

function getPriorityColor(priority) {
  if (priority === "High") return "bg-resqnow-critical";
  if (priority === "Medium") return "bg-resqnow-caution";
  return "bg-resqnow-safe";
}

const initialNotifications = [
  {
    id: "dispatch-rn-2408",
    title: "Dispatch instruction",
    body: "Prioritize RN-2408 in Purok 4. Bring extra life vests.",
    time: "8 minutes ago",
    tone: "critical",
    destination: "report",
    reportId: "RN-2408",
  },
  {
    id: "team-medical-unit",
    title: "Team update",
    body: "Bravo Medical Unit is standing by at the barangay hall.",
    time: "22 minutes ago",
    tone: "mint",
    destination: "contacts",
  },
  {
    id: "assignment-rn-2399",
    title: "Assignment changed",
    body: "RN-2399 was assigned to Alpha Rescue Team.",
    time: "Yesterday, 6:20 PM",
    tone: "violet",
    destination: "report",
    reportId: "RN-2399",
  },
];

function Badge({ children, tone = "violet" }) {
  const tones = {
    High: "bg-resqnow-critical/10 text-resqnow-crimson",
    Medium: "bg-resqnow-caution/15 text-[#9A6700]",
    Low: "bg-resqnow-safe/15 text-[#16834B]",
    violet: "bg-resqnow-violet/10 text-resqnow-violet",
    mint: "bg-resqnow-mint/10 text-[#008D78]",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold ${tones[tone] || tones.violet}`}
    >
      {children}
    </span>
  );
}

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const submit = (event) => {
    event.preventDefault();
    if (email.toLowerCase() === "rescuer@test.com" && password === "rescuer")
      onLogin();
    else
      setError("Invalid email or password.");
  };
  return (
    <main className="min-h-screen bg-resqnow-ivory flex items-center justify-center p-0 sm:p-5">
      <div className="w-full min-h-screen sm:min-h-0 sm:max-w-[900px] bg-white sm:rounded-3xl sm:shadow-[0_16px_50px_rgba(31,29,71,0.12)] sm:border sm:border-resqnow-border-soft overflow-hidden md:grid md:grid-cols-[0.9fr_1.1fr]">
        <section
          className="relative min-h-[225px] md:min-h-[650px] bg-cover bg-center"
          style={{ backgroundImage: `url(${barangayPhoto})` }}
        >
          <div className="absolute inset-0 bg-linear-to-br from-resqnow-primary/80 via-resqnow-violet/60 to-resqnow-mint/45" />
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
          <div className="relative z-10 flex h-full min-h-[225px] flex-col justify-between p-6 md:min-h-[650px] md:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/30 bg-white/15 text-white backdrop-blur-sm">
                <Shield className="h-6 w-6" strokeWidth={1.7} />
              </div>
              <div>
                <h1 className="text-[22px] font-extrabold leading-tight text-white">
                  ResQNow
                </h1>
                <p className="text-[10px] text-white/80">Barangay Camunatan</p>
              </div>
            </div>
            <div className="max-w-[320px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75">
                Responder Field Console
              </p>
              <h2 className="mt-2 text-[24px] font-bold leading-tight text-white md:text-[30px]">
                Fast response starts with the right information.
              </h2>
              <p className="mt-2 text-[12px] leading-relaxed text-white/80 md:text-[13px]">
                Review assigned incidents, coordinate field action, and keep the
                barangay team updated.
              </p>
            </div>
          </div>
        </section>
        <section className="flex flex-col justify-center px-6 py-7 sm:px-9 sm:py-9 md:px-10 md:py-10">
          <div className="mb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-resqnow-violet">
              Responder Access
            </p>
            <h2 className="mt-1 text-[24px] font-bold text-resqnow-primary">
              Welcome back
            </h2>
            <p className="mt-1 text-[12px] text-resqnow-muted">
              Sign in to access your ResQNow field desk.
            </p>
          </div>
          {error && (
            <p className="mb-5 rounded-xl border border-resqnow-critical/20 bg-resqnow-critical/10 px-4 py-3 text-[12px] text-resqnow-crimson">
              {error}
            </p>
          )}
          <form onSubmit={submit} className="space-y-5">
            <label className="block text-[12px] font-semibold text-resqnow-secondary">
              Email Address
              <span className="relative mt-1.5 block">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-resqnow-placeholder" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl bg-resqnow-canvas py-3.5 pl-[46px] pr-4 text-[14px] text-resqnow-primary outline-none ring-1 ring-resqnow-border focus:ring-2 focus:ring-resqnow-violet/25"
                />
              </span>
            </label>
            <label className="block text-[12px] font-semibold text-resqnow-secondary">
              Password
              <span className="relative mt-1.5 block">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-resqnow-placeholder" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-resqnow-canvas py-3.5 pl-[46px] pr-12 text-[14px] text-resqnow-primary outline-none ring-1 ring-resqnow-border focus:ring-2 focus:ring-resqnow-violet/25"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-resqnow-placeholder transition-colors hover:bg-resqnow-violet/5 hover:text-resqnow-violet"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </span>
            </label>
            <div className="flex items-center justify-between gap-3">
              <label className="flex cursor-pointer select-none items-center gap-2 text-[12px] font-medium text-resqnow-muted">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 accent-resqnow-violet"
                />
                Remember me
              </label>
              <button type="button" className="text-[13px] font-medium text-resqnow-violet hover:underline">
                Forgot password?
              </button>
            </div>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gradient px-4 py-3.5 text-[13px] font-bold text-white shadow-[0_8px_18px_rgba(131,70,242,.22)]">
              <LogIn className="h-4 w-4" />
              Sign in as responder
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

function Header({ onNotifications, onProfile, unread }) {
  return (
    <header className="relative h-[132px] overflow-hidden bg-brand-gradient">
      <div
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.45) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.45) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="relative z-20 mx-auto flex max-w-lg items-center justify-between px-4 pt-4">
        <button
          onClick={() => onProfile()}
          className="flex items-center gap-2.5 text-left active:scale-[.98]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 bg-white/20 text-white shadow-sm backdrop-blur-sm">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[17px] font-bold leading-tight text-white">
              ResQNow
            </p>
            <p className="mt-0.5 text-[9px] text-white/75">
              Barangay Camunatan
            </p>
          </div>
        </button>
        <div className="flex items-center gap-2.5">
          <button
            onClick={onNotifications}
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/15 text-white backdrop-blur-sm"
          >
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="resqnow-badge-pop absolute -right-1.5 -top-1.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-white bg-resqnow-critical px-1 text-[8px] font-bold">
                {unread}
              </span>
            )}
          </button>
          <button
            onClick={onProfile}
            aria-label="Responder profile"
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-linear-to-br from-resqnow-mint to-resqnow-violet text-[13px] font-bold text-white shadow-sm"
          >
            JR
          </button>
        </div>
      </div>
      <svg
        className="absolute bottom-0 left-0 z-10 block h-[55px] w-full"
        viewBox="0 0 500 60"
        preserveAspectRatio="none"
      >
        <path
          d="M0,34 C8,18 25,12 50,12 H160 C184,12 198,16 217,28 L250,47 C265,55 282,57 307,57 H500 V60 H0 Z"
          fill="var(--warm-ivory)"
        />
        <rect x="0" y="58" width="500" height="2" fill="var(--warm-ivory)" />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 z-[11] h-[2px] bg-[var(--warm-ivory)]" />
    </header>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-resqnow-border-soft bg-white p-3">
      <div
        className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${color}`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-2xl font-extrabold text-resqnow-primary">{value}</p>
      <p className="mt-0.5 text-[10px] font-semibold text-resqnow-muted">
        {label}
      </p>
    </div>
  );
}

function ReportCard({ report, onDetails, onMap, onUpdate }) {
  return (
    <article className="rounded-2xl border border-resqnow-border-soft bg-white p-4 shadow-[0_3px_14px_rgba(31,29,71,.04)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-resqnow-primary">
              {report.id}
            </span>
            <Badge tone={report.priority}>{report.priority}</Badge>
          </div>
          <h3 className="mt-2 text-sm font-extrabold text-resqnow-primary">
            {report.type}
          </h3>
        </div>
        <Badge tone={report.status === "Resolved" ? "mint" : "violet"}>
          {report.status}
        </Badge>
      </div>
      <div className="mt-3 space-y-2 text-xs text-resqnow-muted">
        <p className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-resqnow-violet" />
          {report.location}
        </p>
        <p className="flex items-center gap-2">
          <Phone className="h-3.5 w-3.5 text-resqnow-mint" />
          {report.contact}
        </p>
        <p className="flex items-center gap-2">
          <Clock3 className="h-3.5 w-3.5 text-resqnow-pending" />
          Assigned {report.assigned}
        </p>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        <button
          onClick={() => onDetails(report)}
          className="col-span-2 rounded-lg bg-resqnow-indigo px-2 py-2 text-[10px] font-bold text-white"
        >
          View details
        </button>
        <button
          onClick={() => onMap(report)}
          className="flex items-center justify-center gap-1 rounded-lg bg-resqnow-mist px-2 py-2 text-[10px] font-bold text-resqnow-indigo"
        >
          <Navigation className="h-3 w-3" />
          Map
        </button>
        <button
          onClick={() => onUpdate(report)}
          className="flex items-center justify-center gap-1 rounded-lg bg-resqnow-violet/10 px-2 py-2 text-[10px] font-bold text-resqnow-violet"
        >
          <Plus className="h-3 w-3" />
          Update
        </button>
      </div>
    </article>
  );
}

function Dashboard({
  reports,
  onOpen,
  onDetails,
  onMap,
  onUpdate,
}) {
  const active = reports.filter(
    (r) => !["Resolved", "False/invalid after checking"].includes(r.status),
  );
  return (
    <Page title="Field dashboard" subtitle="Good morning, Joel">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Assigned reports"
          value={active.length}
          icon={FileText}
          color="bg-resqnow-violet/10 text-resqnow-violet"
        />
        <StatCard
          label="High priority"
          value={active.filter((r) => r.priority === "High").length}
          icon={Siren}
          color="bg-resqnow-critical/10 text-resqnow-crimson"
        />
        <StatCard
          label="In progress"
          value={active.filter((r) => r.status !== "Assigned").length}
          icon={Activity}
          color="bg-resqnow-mint/10 text-[#008D78]"
        />
        <StatCard
          label="Resolved today"
          value="4"
          icon={CheckCircle2}
          color="bg-resqnow-safe/15 text-[#16834B]"
        />
      </div>
      <button
        type="button"
        onClick={() => onMap(reports[0])}
        className="w-full overflow-hidden rounded-2xl border border-resqnow-info/20 bg-white text-left transition hover:border-resqnow-info/40 active:scale-[0.99]"
      >
        <div className="flex items-center justify-between border-b border-resqnow-border-soft px-4 py-3">
          <div className="flex items-center gap-2">
            <Map className="h-4 w-4 text-resqnow-info" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-resqnow-info">
                Emergency map
              </p>
              <p className="mt-0.5 text-xs font-bold text-resqnow-primary">
                All reported incidents
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-bold text-resqnow-violet">
            Open map <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>
        <div className="map-grid relative h-56 overflow-hidden">
          <div className="map-road left-[-10%] top-[34%] w-[120%] rotate-[14deg]" />
          <div className="map-road left-[22%] top-[-35%] h-[180%] w-2 rotate-[35deg]" />
          <div className="map-road left-[-10%] top-[76%] w-[120%] rotate-[-18deg]" />
          <div className="absolute left-3 top-3 rounded-lg bg-white/90 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-resqnow-info shadow-sm">
            Live incident locations
          </div>
          {reports.map((report, index) => (
            <span
              key={report.id}
              className={`absolute flex max-w-[160px] items-center gap-1.5 ${dashboardMarkerPositions[index % dashboardMarkerPositions.length]}`}
            >
              <span className={`relative z-10 shrink-0 rounded-full border-2 border-white p-1.5 shadow-md ${getPriorityColor(report.priority)}`}>
                <MapPin className="h-4 w-4 fill-white text-white" />
              </span>
              <span className="min-w-0 rounded-lg border border-white/80 bg-white/95 px-2 py-1 shadow-sm">
                <span className="block truncate text-[9px] font-extrabold text-resqnow-primary">
                  {report.id} · {report.priority}
                </span>
                <span className="block truncate text-[10px] font-semibold text-resqnow-muted">
                  {report.location}
                </span>
              </span>
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-resqnow-border-soft bg-white px-4 py-2.5">
          <span className="text-[10px] font-bold text-resqnow-secondary">
            {reports.length} reported emergencies
          </span>
          <span className="flex items-center gap-2 text-[9px] font-semibold text-resqnow-muted">
            <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-resqnow-critical" />High</span>
            <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-resqnow-caution" />Medium</span>
            <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-resqnow-safe" />Low</span>
          </span>
        </div>
      </button>
      <SectionTitle
        title="High priority queue"
        action={
          <button
            onClick={onOpen}
            className="flex items-center gap-1 text-[11px] font-bold text-resqnow-violet"
          >
            Open assigned <ChevronRight className="h-3.5 w-3.5" />
          </button>
        }
      />
      <div className="space-y-3">
        {active
          .filter((r) => r.priority === "High")
          .map((r) => (
            <ReportCard
              key={r.id}
              report={r}
              onDetails={onDetails}
              onMap={onMap}
              onUpdate={onUpdate}
            />
          ))}
      </div>
      <SectionTitle title="Recent admin instructions" />
      <div className="rounded-2xl border border-resqnow-border-soft bg-white p-4">
        <div className="flex gap-3">
          <ClipboardCheck className="h-5 w-5 shrink-0 text-resqnow-violet" />
          <div>
            <p className="text-xs font-bold">
              Bring extra life vests to Purok 4
            </p>
            <p className="mt-1 text-[11px] text-resqnow-muted">
              Admin Carla · 8 minutes ago
            </p>
          </div>
        </div>
        <div className="mt-3 flex gap-3 border-t border-resqnow-border-soft pt-3">
          <MapPin className="h-5 w-5 shrink-0 text-resqnow-mint" />
          <div>
            <p className="text-xs font-bold">
              Medical unit is standing by at the barangay hall
            </p>
            <p className="mt-1 text-[11px] text-resqnow-muted">
              Dispatch · 22 minutes ago
            </p>
          </div>
        </div>
      </div>
    </Page>
  );
}

function Page({ title, subtitle, action, children }) {
  return (
    <main className="relative z-20 mx-auto max-w-lg px-4 pb-28 pt-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[13px] text-resqnow-muted">{subtitle}</p>
          <h1 className="mt-0.5 text-[22px] font-extrabold leading-tight text-resqnow-primary">
            {title}
          </h1>
        </div>
        {action}
      </div>
      <div className="fade-in space-y-4">{children}</div>
    </main>
  );
}
function SectionTitle({ title, action }) {
  return (
    <div className="flex items-center justify-between pt-1">
      <h2 className="text-sm font-extrabold text-resqnow-primary">{title}</h2>
      {action}
    </div>
  );
}

function AssignedReports({ reports, onDetails, onMap, onUpdate }) {
  const [filter, setFilter] = useState("All");
  const [listView, setListView] = useState(false);
  const visible =
    filter === "All" ? reports : reports.filter((r) => r.priority === filter);
  return (
    <Page title="Assigned reports" subtitle="Joel Ramirez · Rescuer">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {["All", "High", "Medium", "Low"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`rounded-full px-4 py-2 text-xs font-bold ${filter === item ? "bg-resqnow-indigo text-white" : "bg-white text-resqnow-muted"}`}
          >
            {item}{" "}
            {item !== "All" &&
              `(${reports.filter((r) => r.priority === item).length})`}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-resqnow-muted">
          {visible.length} reports assigned to you
        </p>
        <button
          type="button"
          onClick={() => setListView((current) => !current)}
          className="flex items-center gap-1 text-xs font-bold text-resqnow-violet"
        >
          <List className="h-4 w-4" /> {listView ? "Card view" : "List view"}
        </button>
      </div>
      {listView ? (
        <div className="overflow-hidden rounded-2xl border border-resqnow-border-soft bg-white">
          {visible.map((report, index) => (
            <div
              key={report.id}
              className={`p-3 ${index > 0 ? "border-t border-resqnow-border-soft" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-resqnow-primary">
                      {report.id}
                    </span>
                    <Badge tone={report.priority}>{report.priority}</Badge>
                  </div>
                  <p className="mt-1 truncate text-xs font-bold text-resqnow-primary">
                    {report.type}
                  </p>
                  <p className="mt-1 flex items-center gap-1 truncate text-[10px] text-resqnow-muted">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {report.location}
                  </p>
                </div>
                <Badge tone={report.status === "Resolved" ? "mint" : "violet"}>
                  {report.status}
                </Badge>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onDetails(report)}
                  className="rounded-lg bg-resqnow-indigo px-2 py-2 text-[10px] font-bold text-white"
                >
                  View details
                </button>
                <button
                  type="button"
                  onClick={() => onUpdate(report)}
                  className="rounded-lg bg-resqnow-violet/10 px-2 py-2 text-[10px] font-bold text-resqnow-violet"
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((r) => (
            <ReportCard
              key={r.id}
              report={r}
              onDetails={onDetails}
              onMap={onMap}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </Page>
  );
}

function UpdateQueueModal({ reports, onClose, onDetails, onUpdate }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-resqnow-indigo/40 p-0 sm:items-center sm:p-4">
      <div className="max-h-[86vh] w-full max-w-lg overflow-y-auto rounded-t-[28px] bg-white p-5 sm:rounded-[24px]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-resqnow-coral">
              Field update
            </p>
            <h2 className="mt-1 text-lg font-extrabold text-resqnow-primary">
              Choose an assigned report
            </h2>
            <p className="mt-1 text-xs text-resqnow-muted">
              Select a report to view its details or add a progress update.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-100 p-2"
            aria-label="Close assigned reports"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5 space-y-2">
          {reports.map((report) => (
            <div
              key={report.id}
              className="rounded-2xl border border-resqnow-border-soft p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-resqnow-primary">
                      {report.id}
                    </span>
                    <Badge tone={report.priority}>{report.priority}</Badge>
                  </div>
                  <p className="mt-1 text-xs font-bold text-resqnow-primary">
                    {report.type}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-[10px] text-resqnow-muted">
                    <MapPin className="h-3 w-3" />
                    {report.location}
                  </p>
                </div>
                <Badge tone={report.status === "Resolved" ? "mint" : "violet"}>
                  {report.status}
                </Badge>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onDetails(report)}
                  className="rounded-lg bg-resqnow-indigo px-2 py-2 text-[10px] font-bold text-white"
                >
                  View details
                </button>
                <button
                  type="button"
                  onClick={() => onUpdate(report)}
                  className="rounded-lg bg-resqnow-violet/10 px-2 py-2 text-[10px] font-bold text-resqnow-violet"
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UpdateModal({ report, onClose, onSave }) {
  const [status, setStatus] = useState(report.status);
  const [remarks, setRemarks] = useState("");
  const [proof, setProof] = useState(false);
  const save = () => {
    if (!remarks.trim()) return;
    onSave({ status, remarks, proof });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-resqnow-indigo/40 p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-lg rounded-t-[28px] bg-white p-5 sm:rounded-[24px]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-resqnow-violet">
              Field progress report
            </p>
            <h2 className="mt-1 text-lg font-extrabold">Update {report.id}</h2>
          </div>
          <button onClick={onClose} className="rounded-full bg-slate-100 p-2">
            <X className="h-4 w-4" />
          </button>
        </div>
        <label className="mt-5 block text-xs font-bold">
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm"
          >
            {updateOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="mt-4 block text-xs font-bold">
          Remarks <span className="text-resqnow-critical">* required</span>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows="4"
            placeholder="Describe what happened in the field..."
            className="mt-1 w-full resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-resqnow-violet"
          />
        </label>
        <button
          onClick={() => setProof(!proof)}
          className={`mt-3 flex w-full items-center gap-2 rounded-xl border px-3 py-3 text-left text-xs font-bold ${proof ? "border-resqnow-mint bg-resqnow-mint/10 text-[#008D78]" : "border-slate-200 text-resqnow-muted"}`}
        >
          <ImagePlus className="h-4 w-4" />
          {proof
            ? "Proof photo attached (demo)"
            : "Attach proof photo (optional)"}
        </button>
        <p className="mt-3 text-[10px] text-resqnow-muted">
          Updated automatically by Joel Ramirez · {new Date().toLocaleString()}
        </p>
        <button
          disabled={!remarks.trim()}
          onClick={save}
          className="mt-4 w-full rounded-xl bg-resqnow-violet px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Save field update
        </button>
      </div>
    </div>
  );
}

function ReportDetails({
  report,
  checklist = [],
  checklistSavedAt,
  onSaveChecklist,
  backLabel = "Back to assigned reports",
  onBack,
  onUpdate,
  onMap,
}) {
  const [checks, setChecks] = useState(checklist);
  const [checklistSaved, setChecklistSaved] = useState(false);

  const toggle = (item) =>
    setChecks((current) =>
      current.includes(item)
        ? current.filter((x) => x !== item)
        : [...current, item],
    );

  const saveChecklist = () => {
    onSaveChecklist(report.id, checks);
    setChecklistSaved(true);
  };

  return (
    <main className="relative z-20 mx-auto max-w-lg px-4 pb-28 pt-4">
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-1 text-xs font-bold text-resqnow-violet"
      >
        <ChevronLeft className="h-4 w-4" />
        {backLabel}
      </button>
      <div className="fade-in space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-resqnow-muted">{report.id}</p>
            <h1 className="mt-1 text-[22px] font-extrabold text-resqnow-primary">
              {report.type}
            </h1>
            <p className="mt-1 flex items-center gap-1 text-xs text-resqnow-muted">
              <MapPin className="h-3.5 w-3.5" />
              {report.location}
            </p>
          </div>
          <Badge tone={report.priority}>{report.priority}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onUpdate(report)}
            className="flex items-center justify-center gap-2 rounded-xl bg-resqnow-violet px-3 py-3 text-xs font-bold text-white"
          >
            <Plus className="h-4 w-4" />
            Update status
          </button>
          <button
            onClick={() => onMap(report)}
            className="flex items-center justify-center gap-2 rounded-xl bg-resqnow-indigo px-3 py-3 text-xs font-bold text-white"
          >
            <Navigation className="h-4 w-4" />
            Open map
          </button>
        </div>
        <InfoBlock title="Resident report">
          <p className="text-xs leading-relaxed text-resqnow-secondary">
            {report.summary}
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs font-bold text-resqnow-violet">
            <UserRound className="h-4 w-4" />
            {report.person}
            <a
              className="ml-auto flex items-center gap-1 text-resqnow-mint"
              href={`tel:${report.contact}`}
            >
              <Phone className="h-3.5 w-3.5" />
              {report.contact}
            </a>
          </div>
        </InfoBlock>
        <InfoBlock title="Barangay assessment">
          <div className="flex items-center justify-between">
            <p className="text-xs text-resqnow-secondary">
              Priority calculated from checklist
            </p>
            <Badge tone={report.priority}>{report.score}/8 criteria</Badge>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {report.checks.map((item) => (
              <span
                key={item}
                className="rounded-lg bg-resqnow-caution/10 px-2 py-1 text-[10px] font-semibold text-[#866000]"
              >
                {item}
              </span>
            ))}
          </div>
          <p className="mt-3 text-[11px] font-bold text-resqnow-violet">
            Suggested hotline: {report.hotline}
          </p>
        </InfoBlock>
        <InfoBlock title="Pinned location">
          <div className="map-grid relative h-36 overflow-hidden rounded-xl">
            <div className="map-road left-[-10%] top-1/2 w-[120%]" />
            <div className="map-road left-[25%] top-[-30%] h-[180%] w-2 rotate-[35deg]" />
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
              <span className="absolute h-12 w-12 animate-ping rounded-full bg-resqnow-critical/20" />
              <MapPin className="relative h-9 w-9 fill-resqnow-critical text-resqnow-critical" />
            </div>
            <span className="absolute bottom-2 left-2 rounded-lg bg-white/90 px-2 py-1 text-[10px] font-bold">
              {report.location}
            </span>
          </div>
          <button
            onClick={() => onMap(report)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-resqnow-mist py-2.5 text-xs font-bold text-resqnow-indigo"
          >
            <Navigation className="h-4 w-4" />
            Open navigation
          </button>
        </InfoBlock>
        <InfoBlock title="Assigned team">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-resqnow-mint/10 text-resqnow-mint">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold">{report.team}</p>
              <p className="text-[11px] text-resqnow-muted">
                Joel Ramirez · Lead responder
              </p>
            </div>
          </div>
        </InfoBlock>
        <InfoBlock title="Action checklist">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {checklistItems.map((item) => (
              <button
                key={item}
                onClick={() => toggle(item)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-[11px] font-semibold ${checks.includes(item) ? "border-resqnow-mint bg-resqnow-mint/10 text-[#008D78]" : "border-slate-200 text-resqnow-secondary"}`}
              >
                {checks.includes(item) ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <span className="h-4 w-4 rounded border border-slate-300" />
                )}
                {item}
                {checks.includes(item) && (
                  <span className="ml-auto text-[9px]">now</span>
                )}
              </button>
            ))}
          </div>
          <p className="mt-3 text-[10px] text-resqnow-muted">
            {checklistSavedAt
              ? `Saved by Joel Ramirez · ${checklistSavedAt}`
              : "Select the actions completed in the field, then save the checklist."}
          </p>
          <button
            type="button"
            onClick={saveChecklist}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-resqnow-mint px-3 py-2.5 text-xs font-bold text-white transition hover:bg-[#00ae91]"
          >
            <CheckCircle2 className="h-4 w-4" />
            {checklistSaved ? "Checklist saved" : "Save action checklist"}
          </button>
        </InfoBlock>
        <InfoBlock title="Status history">
          <div className="space-y-3">
            {report.history.map((item, index) => (
              <div key={`${item.status}-${index}`} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="h-2.5 w-2.5 rounded-full bg-resqnow-violet" />
                  {index < report.history.length - 1 && (
                    <span className="mt-1 h-full w-px bg-resqnow-violet/20" />
                  )}
                </div>
                <div className="pb-1">
                  <p className="text-xs font-bold">{item.status}</p>
                  <p className="text-[10px] text-resqnow-muted">
                    {item.by} · {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </InfoBlock>
      </div>
    </main>
  );
}
function InfoBlock({ title, children }) {
  return (
    <section className="rounded-2xl border border-resqnow-border-soft bg-white p-4">
      <h2 className="mb-3 text-xs font-extrabold uppercase tracking-wide text-resqnow-primary">
        {title}
      </h2>
      {children}
    </section>
  );
}

function MapView({ reports, onDetails }) {
  const [selected, setSelected] = useState(reports[0]);
  const markerPositions = [
    "left-[10%] top-[22%]",
    "left-[58%] top-[14%]",
    "left-[38%] top-[54%]",
    "left-[12%] top-[73%]",
  ];

  const priorityColor = (priority) => {
    if (priority === "High") return "bg-resqnow-critical";
    if (priority === "Medium") return "bg-resqnow-caution";
    return "bg-resqnow-safe";
  };

  return (
    <Page title="Map / navigation" subtitle="Assigned incident locations">
      <div className="map-grid relative h-[430px] overflow-hidden rounded-2xl border border-resqnow-border-soft shadow-[0_4px_16px_rgba(31,29,71,.06)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(255,255,255,.65),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,.5),transparent_30%)]" />
        <div className="map-road left-[-15%] top-[28%] w-[130%] rotate-[18deg]" />
        <div className="map-road left-[-15%] top-[69%] w-[130%] rotate-[-12deg]" />
        <div className="map-road left-[28%] top-[-20%] h-[150%] w-2 rotate-[32deg]" />
        <div className="map-road left-[73%] top-[-15%] h-[145%] w-2 rotate-[-28deg]" />
        <div className="absolute left-4 top-4 rounded-xl bg-white/95 px-3 py-2 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wide text-resqnow-info">
            Live assignment map
          </p>
          <p className="mt-0.5 text-xs font-extrabold text-resqnow-primary">
            {reports.length} reported emergencies
          </p>
        </div>
        {reports.map((report, index) => (
          <button
            key={report.id}
            onClick={() => setSelected(report)}
            title={`${report.id}: ${report.location}`}
            className={`absolute flex max-w-[150px] items-center gap-1.5 text-left transition-transform hover:scale-105 ${markerPositions[index % markerPositions.length]}`}
          >
            <span
              className={`relative z-10 block shrink-0 rounded-full border-2 border-white p-2 shadow-lg ${priorityColor(report.priority)} ${selected.id === report.id ? "ring-4 ring-white/70" : ""}`}
            >
              <MapPin className="h-5 w-5 fill-white text-white" />
            </span>
            <span className="min-w-0 rounded-lg border border-white/80 bg-white/95 px-2 py-1.5 shadow-sm">
              <span className="block truncate text-[9px] font-extrabold text-resqnow-primary">
                {report.id} · {report.priority}
              </span>
              <span className="mt-0.5 block truncate text-[10px] font-semibold text-resqnow-muted">
                {report.location}
              </span>
            </span>
          </button>
        ))}
        <div className="absolute bottom-3 right-3 rounded-xl bg-white/95 p-2.5 text-[10px] font-bold shadow-sm">
          <p className="mb-1 text-[9px] uppercase tracking-wide text-resqnow-muted">
            Priority
          </p>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-resqnow-critical" />
            High
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-resqnow-caution" />
            Medium
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-resqnow-safe" />
            Low
          </div>
        </div>
      </div>
      <InfoBlock title={`All assigned incidents (${reports.length})`}>
        <div className="divide-y divide-resqnow-border-soft">
          {reports.map((report) => (
            <button
              key={report.id}
              type="button"
              onClick={() => setSelected(report)}
              className={`flex w-full items-center gap-3 py-3 text-left first:pt-0 last:pb-0 ${selected.id === report.id ? "rounded-xl bg-resqnow-violet/5 px-2" : ""}`}
            >
              <span
                className={`shrink-0 rounded-full border-2 border-white p-1.5 shadow-sm ${priorityColor(report.priority)}`}
              >
                <MapPin className="h-4 w-4 fill-white text-white" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-resqnow-primary">
                    {report.id}
                  </span>
                  <Badge tone={report.priority}>{report.priority}</Badge>
                </span>
                <span className="mt-0.5 block truncate text-[11px] font-semibold text-resqnow-secondary">
                  {report.location}
                </span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-resqnow-placeholder" />
            </button>
          ))}
        </div>
      </InfoBlock>
      <div className="rounded-2xl border border-resqnow-border-soft bg-white p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-extrabold">
              {selected.id} · {selected.type}
            </p>
            <p className="mt-1 text-[11px] text-resqnow-muted">
              {selected.location}
            </p>
          </div>
          <Badge tone={selected.priority}>{selected.priority}</Badge>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={() => onDetails(selected)}
            className="rounded-xl bg-resqnow-indigo py-2.5 text-xs font-bold text-white"
          >
            View report
          </button>
          <button className="flex items-center justify-center gap-1 rounded-xl bg-resqnow-mist py-2.5 text-xs font-bold text-resqnow-indigo">
            <Navigation className="h-4 w-4" />
            Navigate
          </button>
        </div>
      </div>
    </Page>
  );
}

function Notifications({ notifications, onNotification, onBack }) {
  return (
    <Page
      title="Notifications"
      subtitle="Admin instructions and updates"
      action={
        <button
          onClick={onBack}
          className="text-xs font-bold text-resqnow-violet"
        >
          Done
        </button>
      }
    >
      <div className="space-y-3">
        {notifications.map((notification) => (
          <button
            key={notification.id}
            type="button"
            onClick={() => onNotification(notification)}
            className={`flex w-full gap-3 rounded-2xl border p-4 text-left transition-all active:scale-[.99] ${notification.isRead ? "border-resqnow-border-soft bg-white" : "border-resqnow-violet/20 bg-resqnow-violet/5 hover:bg-resqnow-violet/10"}`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${notification.tone === "critical" ? "bg-resqnow-critical/10 text-resqnow-critical" : notification.tone === "mint" ? "bg-resqnow-mint/10 text-resqnow-mint" : "bg-resqnow-violet/10 text-resqnow-violet"}`}
            >
              <Bell className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-xs font-extrabold">{notification.title}</p>
                {!notification.isRead && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-resqnow-critical" />}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-resqnow-secondary">
                {notification.body}
              </p>
              <p className="mt-2 text-[10px] text-resqnow-muted">{notification.time}</p>
            </div>
            <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-resqnow-placeholder" />
          </button>
        ))}
      </div>
    </Page>
  );
}

function EmergencyContacts({ onBack }) {
  const [showTeam, setShowTeam] = useState(false);
  const services = [
    { name: "BFP Fire Station", category: "Fire", number: "911", icon: Flame, color: "critical" },
    { name: "Ilagan City Police", category: "Police", number: "911", icon: Shield, color: "violet" },
    { name: "Hospital / Ambulance", category: "Medical", number: "911", icon: Stethoscope, color: "mint" },
    { name: "CDRRMO Rescue", category: "Rescue", number: "0917 555 0142", icon: LifeBuoy, color: "info" },
  ];
  const team = [
    { name: "Joel Ramirez", role: "Assigned responder", number: "0917 555 0142" },
    { name: "Alpha Rescue Team", role: "Field rescue unit", number: "0918 222 0144" },
    { name: "Barangay Camunatan Hall", role: "Barangay hotline", number: "(078) 624 1234" },
  ];
  const colorStyles = {
    critical: "bg-resqnow-critical/10 text-resqnow-critical border-resqnow-critical/20",
    violet: "bg-resqnow-violet/10 text-resqnow-violet border-resqnow-violet/20",
    mint: "bg-resqnow-mint/10 text-[#008D78] border-resqnow-mint/20",
    info: "bg-resqnow-info/10 text-[#1682B5] border-resqnow-info/20",
  };

  return (
    <Page
      title="Emergency contacts"
      subtitle="Responder hotlines and field support"
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-4 flex items-center gap-1 text-xs font-bold text-resqnow-violet"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to notifications
        </button>
      )}
      <section className="rounded-2xl bg-brand-gradient p-4 text-white shadow-[0_8px_20px_rgba(131,70,242,.20)]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-bold uppercase tracking-wide text-white/70">Barangay hotline</p>
            <p className="mt-0.5 text-[13px] font-bold">Barangay Camunatan Hall</p>
            <p className="mt-0.5 text-[16px] font-bold tracking-wide">(078) 624 1234</p>
          </div>
        </div>
        <a href="tel:0786241234" className="mt-3 flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-xl bg-white py-2.5 text-[11px] font-bold text-resqnow-violet">
          <Phone className="h-3.5 w-3.5" /> Call Barangay Hotline
        </a>
      </section>
      <section>
        <button type="button" onClick={() => setShowTeam((current) => !current)} aria-expanded={showTeam} className={`flex min-h-[58px] w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-all ${showTeam ? "border-resqnow-violet/30 bg-resqnow-violet/10" : "border-resqnow-violet/20 bg-resqnow-violet/5"}`}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-resqnow-violet/10 text-resqnow-violet"><Users className="h-5 w-5" /></div>
          <div className="flex-1"><p className="text-[14px] font-bold text-resqnow-primary">Responder team directory</p><p className="mt-0.5 text-[10px] text-resqnow-violet">Assigned personnel and field support contacts</p></div>
          <ChevronDown className={`h-4 w-4 text-resqnow-violet/70 transition-transform ${showTeam ? "rotate-180" : ""}`} />
        </button>
        {showTeam && <div className="mt-2 grid grid-cols-1 gap-2 rounded-2xl border border-resqnow-border-soft bg-white p-3">{team.map((person) => <a key={person.name} href={`tel:${person.number.replace(/[^0-9+]/g, "")}`} className="flex items-center gap-3 rounded-xl border border-resqnow-border-soft p-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-resqnow-violet/10 text-resqnow-violet"><UserRound className="h-4 w-4" /></div><div className="min-w-0 flex-1"><p className="text-xs font-bold text-resqnow-primary">{person.name}</p><p className="text-[10px] text-resqnow-muted">{person.role}</p></div><Phone className="h-4 w-4 text-resqnow-mint" /></a>)}</div>}
      </section>
      <section>
        <div className="mb-2 px-1"><h2 className="text-[13px] font-bold text-resqnow-primary">LGU & emergency services</h2><p className="mt-0.5 text-[10px] text-resqnow-muted">Tap a service to call.</p></div>
        <div className="grid grid-cols-2 gap-2">{services.map((service) => { const Icon = service.icon; return <a key={service.name} href={`tel:${service.number.replace(/[^0-9+]/g, "")}`} className={`min-h-[125px] rounded-xl border p-3 transition-all active:scale-[.98] ${colorStyles[service.color]}`}><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/70"><Icon className="h-4 w-4" /></div><p className="mt-2 text-[9px] font-bold uppercase tracking-wide">{service.category}</p><p className="mt-1 text-[12px] font-bold text-resqnow-primary">{service.name}</p><div className="mt-2 flex items-center gap-1"><Phone className="h-3 w-3 text-resqnow-muted" /><p className="text-[10px] font-bold text-resqnow-primary">{service.number}</p></div></a> })}</div>
      </section>
    </Page>
  );
}

function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [view, setView] = useState("dashboard");
  const [reports, setReports] = useState(initialReports);
  const [selected, setSelected] = useState(null);
  const [detailsBackView, setDetailsBackView] = useState("reports");
  const [updateReport, setUpdateReport] = useState(null);
  const [updateQueueOpen, setUpdateQueueOpen] = useState(false);
  const [checklists, setChecklists] = useState({});
  const [checklistSavedAt, setChecklistSavedAt] = useState({});
  const [notifications, setNotifications] = useState(initialNotifications);
  const [contactsBackView, setContactsBackView] = useState(null);
  const unread = notifications.filter((notification) => !notification.isRead).length;
  const currentReport = useMemo(
    () => reports.find((r) => r.id === selected?.id) || selected,
    [reports, selected],
  );
  if (!signedIn) return <Login onLogin={() => setSignedIn(true)} />;
  const openDetails = (report, backView = "reports") => {
    setUpdateQueueOpen(false);
    setSelected(report);
    setDetailsBackView(backView);
    setView("details");
  };
  const openMap = (report) => {
    setUpdateQueueOpen(false);
    setSelected(report);
    setView("map");
  };
  const openUpdate = (report) => {
    setUpdateQueueOpen(false);
    setUpdateReport(report);
  };
  const openNotification = (notification) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === notification.id ? { ...item, isRead: true } : item,
      ),
    );

    if (notification.destination === "report") {
      const report = reports.find((item) => item.id === notification.reportId);
      if (report) {
        openDetails(report, "notifications");
        return;
      }
      setView("reports");
      return;
    }

    if (notification.destination === "contacts") {
      setContactsBackView("notifications");
      setView("contacts");
      return;
    }

    setView("reports");
  };
  const saveChecklist = (reportId, items) => {
    setChecklists((current) => ({ ...current, [reportId]: items }));
    setChecklistSavedAt((current) => ({
      ...current,
      [reportId]: new Date().toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
    }));
  };
  const saveUpdate = ({ status, remarks, proof }) => {
    setReports((current) =>
      current.map((report) =>
        report.id === updateReport.id
          ? {
              ...report,
              status,
              history: [
                ...report.history,
                {
                  status,
                  by: "Joel Ramirez",
                  time: new Date().toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  }),
                },
              ],
              lastRemark: remarks,
              proof,
            }
          : report,
      ),
    );
    setUpdateReport(null);
  };
  const content =
    view === "dashboard" ? (
      <Dashboard
        reports={reports}
        onOpen={() => setView("reports")}
        onDetails={openDetails}
        onMap={openMap}
        onUpdate={openUpdate}
      />
    ) : view === "reports" ? (
      <AssignedReports
        reports={reports}
        onDetails={openDetails}
        onMap={openMap}
        onUpdate={openUpdate}
      />
    ) : view === "details" && currentReport ? (
      <ReportDetails
        key={currentReport.id}
        report={currentReport}
        checklist={checklists[currentReport.id] || []}
        checklistSavedAt={checklistSavedAt[currentReport.id]}
        onSaveChecklist={saveChecklist}
        backLabel={
          detailsBackView === "notifications"
            ? "Back to notifications"
            : "Back to assigned reports"
        }
        onBack={() => setView(detailsBackView)}
        onUpdate={openUpdate}
        onMap={openMap}
      />
    ) : view === "map" ? (
      <MapView reports={reports} onDetails={openDetails} />
    ) : view === "contacts" ? (
      <EmergencyContacts
        onBack={
          contactsBackView
            ? () => {
                setContactsBackView(null);
                setView(contactsBackView);
              }
            : undefined
        }
      />
    ) : (
      <Notifications
        notifications={notifications}
        onNotification={openNotification}
        onBack={() => setView("dashboard")}
      />
    );
  return (
    <div className="min-h-screen resqnow-page overflow-x-hidden pb-28">
      <Header
        onNotifications={() => setView("notifications")}
        onProfile={() => setSignedIn(false)}
        unread={unread}
      />
      {content}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 px-3"
        style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
      >
        <nav className="relative mx-auto h-[72px] max-w-lg rounded-[24px] border border-resqnow-border-soft bg-white/95 px-1.5 shadow-[0_8px_30px_rgba(31,29,71,0.12)] backdrop-blur-xl">
          <div className="relative z-10 grid h-full grid-cols-5 items-center">
            <NavButton
              active={view === "dashboard"}
              icon={Activity}
              label="Dashboard"
              onClick={() => setView("dashboard")}
            />
            <NavButton
              active={view === "reports"}
              icon={FileText}
              label="Assigned"
              onClick={() => setView("reports")}
            />
            <div className="relative flex h-full flex-col items-center justify-end">
              <button
                type="button"
                onClick={() => setUpdateQueueOpen(true)}
                aria-label="Update field status"
                className="absolute -top-6 flex h-[64px] w-[64px] items-center justify-center rounded-full border-4 border-white bg-report-gradient text-white ring-2 ring-resqnow-coral/20 shadow-[0_8px_22px_rgba(255,90,54,0.32)] transition-all hover:-translate-y-1 hover:scale-[1.03] active:scale-90"
              >
                <Plus className="h-8 w-8" />
              </button>
              <span className="mb-1 text-[10px] font-bold text-resqnow-coral">
                Update
              </span>
            </div>
            <NavButton
              active={view === "map"}
              icon={Map}
              label="Map"
              onClick={() => setView("map")}
            />
            <NavButton
              active={view === "contacts" || view === "notifications"}
              icon={Phone}
              label="Contacts"
              onClick={() => {
                setContactsBackView(null);
                setView("contacts");
              }}
            />
          </div>
        </nav>
      </div>
      {updateReport && (
        <UpdateModal
          report={updateReport}
          onClose={() => setUpdateReport(null)}
          onSave={saveUpdate}
        />
      )}
      {updateQueueOpen && (
        <UpdateQueueModal
          reports={reports}
          onClose={() => setUpdateQueueOpen(false)}
          onDetails={openDetails}
          onUpdate={openUpdate}
        />
      )}
    </div>
  );
}

function NavButton({ active, icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex h-full items-center justify-center px-1 focus:outline-none"
    >
      <span
        className={`relative z-10 flex h-[48px] w-full max-w-[58px] flex-col items-center justify-center gap-0.5 rounded-[16px] text-[9px] transition-all duration-300 ${active ? "bg-resqnow-violet/10 text-resqnow-violet" : "text-resqnow-muted hover:text-resqnow-primary"}`}
      >
        <Icon
          className={`h-5 w-5 ${active ? "-translate-y-0.5 scale-110" : ""}`}
        />
        <span className={active ? "font-bold" : "font-medium"}>{label}</span>
      </span>
    </button>
  );
}

export default App;
