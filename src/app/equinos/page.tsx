'use client';

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// ⚠️ Keep lucide icons that resolve locally; avoid CDN horse.js
import { Check, Zap, Calculator, Download, ChevronRight } from "lucide-react";

// ------------------------------------------------------------
// Utils
// ------------------------------------------------------------
const fmt = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

// Small helper for controlled numeric inputs
function useNumberState(initial: number) {
  const [v, setV] = React.useState<number>(initial);
  return {
    value: v,
    set: (n: number) => setV(Number.isFinite(n) ? n : 0),
    bind: {
      value: String(v),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const n = parseFloat(e.target.value.replace(",", "."));
        setV(Number.isNaN(n) ? 0 : n);
      },
    },
  } as const;
}

// Stat card
function Stat({ label, value, accent }: { label: string; value: React.ReactNode; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${accent ? "bg-emerald-50" : ""}`}>
      <div className="text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

// ------------------------------------------------------------
// Pricing Table (Équidos) — for clients (propietario/cuadra)
// ------------------------------------------------------------

type Plan = {
  id: string;
  title: string;
  price: number; // MXN per month (for memberships) or 0 for pay-per-use
  highlight?: boolean;
  badge?: string;
  features: string[];
  cta: string;
  sublabel?: string;
};

const payPerUse: Plan[] = [
  {
    id: "chat",
    title: "Chat 10 min",
    price: 0,
    sublabel: `${fmt.format(199)} – ${fmt.format(349)} por consulta`,
    features: ["Triage y orientación rápida", "Envío de fotos y audio", "Derivación acelerada si aplica"],
    cta: "Iniciar chat",
  },
  {
    id: "video",
    title: "Video 15 min",
    price: 0,
    sublabel: `${fmt.format(399)} – ${fmt.format(699)} por consulta`,
    features: ["Evaluación visual y marcha", "Análisis de heridas/ojos/ranilla", "Resumen y próximos pasos"],
    cta: "Agendar video",
  },
  {
    id: "followup",
    title: "Seguimiento 7 días",
    price: 0,
    sublabel: `${fmt.format(149)} – ${fmt.format(249)} por paquete`,
    features: ["Ajustes tras consulta digital", "Asíncrono con MVZ", "Alertas por banderas rojas"],
    cta: "Comprar seguimiento",
  },
];

const membershipsIndividual: Plan[] = [
  {
    id: "basic",
    title: "Básica Equina",
    price: 299,
    badge: "Ahorro",
    features: ["2 chats / mes", "10% de descuento en video", "Triage prioritario"],
    cta: "Elegir Básica",
  },
  {
    id: "plus",
    title: "Plus Equina",
    price: 549,
    highlight: true,
    badge: "Más popular",
    features: ["1 video + 3 chats / mes", "15% de descuento en servicios digitales", "Recordatorios de vacunas/desparasitación"],
    cta: "Elegir Plus",
  },
];

const membershipsStable: Plan[] = [
  {
    id: "cuadra5",
    title: "Cuadra 5",
    price: 999,
    features: ["Hasta 5 caballos", "6 chats + 2 videos / mes (compartidos)", "Reporte mensual por caballo"],
    cta: "Empezar Cuadra 5",
  },
  {
    id: "cuadra15",
    title: "Cuadra 15",
    price: 2499,
    highlight: true,
    badge: "Mejor valor",
    features: ["Hasta 15 caballos", "20 chats + 6 videos / mes", "Línea prioritaria y capacitación trimestral"],
    cta: "Empezar Cuadra 15",
  },
];

const proAndRanch: Plan[] = [
  {
    id: "pro",
    title: "Pro Entrenador",
    price: 1499,
    features: ["10 chats + 3 videos / mes", "Panel de casos", "Códigos de referido con comisión"],
    cta: "Unirme como Pro",
  },
  {
    id: "rancho",
    title: "Rancho Trabajo",
    price: 2999,
    features: ["Hasta 25 caballos", "30 chats + 8 videos / mes", "Coordinación de derivaciones"],
    cta: "Configurar plan",
  },
];

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <Card className={`relative h-full ${plan.highlight ? "border-emerald-600 shadow-lg" : ""}`}>
      <CardHeader>
        <div className="flex items-center gap-2">
          {/* Replaced Horse icon with emoji to avoid CDN icon fetch */}
          <span aria-hidden className="text-xl">🐎</span>
          <CardTitle className="text-xl">{plan.title}</CardTitle>
          {plan.badge && (
            <Badge className="ml-2" variant="secondary">
              {plan.badge}
            </Badge>
          )}
        </div>
        {plan.price > 0 ? (
          <CardDescription className="text-base mt-2">
            <span className="text-3xl font-semibold">{fmt.format(plan.price)}</span>
            <span className="text-muted-foreground"> / mes</span>
          </CardDescription>
        ) : (
          <CardDescription className="text-base mt-2">{plan.sublabel}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2">
              <Check className="h-4 w-4 mt-0.5 flex-none" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant={plan.highlight ? "default" : "secondary"}>
          {plan.cta}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export function PricingTableEquine() {
  return (
    <section className="space-y-10">
      <header className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Planes para équidos</h2>
        <p className="text-muted-foreground">Digital-first: triage rápido, video bajo demanda y coordinación con MVZ socios.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {payPerUse.map((p) => (
          <PlanCard key={p.id} plan={p} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {membershipsIndividual.map((p) => (
          <PlanCard key={p.id} plan={p} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {membershipsStable.map((p) => (
          <PlanCard key={p.id} plan={p} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {proAndRanch.map((p) => (
          <PlanCard key={p.id} plan={p} />
        ))}
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// ROI (Clientes) — Equinos (propietario/cuadra)
// ------------------------------------------------------------

// Shared computation for tests & UI
function computeEquineClientROI(params: {
  horses: number;
  eventsPerHorse: number;
  resolution: number;
  onsiteCost: number;
  travelCost: number;
  hoursSaved: number;
  downtimeCost: number;
  membershipCost: number;
}) {
  const totalEvents = params.horses * params.eventsPerHorse;
  const avoidedVisits = totalEvents * params.resolution;
  const savingsVisits = avoidedVisits * (params.onsiteCost + params.travelCost);
  const savingsTime = totalEvents * params.hoursSaved * params.downtimeCost;
  const totalSavings = savingsVisits + savingsTime;
  const roi = params.membershipCost > 0 ? (totalSavings - params.membershipCost) / params.membershipCost : 0;
  const paybackMonths = totalSavings > 0 ? params.membershipCost / totalSavings : 0;
  return { totalEvents, avoidedVisits, savingsVisits, savingsTime, totalSavings, roi, paybackMonths };
}

export function RoiCalculatorEquine() {
  // Inputs (defaults tuned to MX equino)
  const horses = useNumberState(5);
  const eventsPerHorse = useNumberState(0.2); // per month
  const resolution = useNumberState(0.6); // 60%
  const onsiteCost = useNumberState(2500);
  const travelCost = useNumberState(500);
  const hoursSaved = useNumberState(1.5);
  const downtimeCost = useNumberState(400);
  const membershipCost = useNumberState(999); // Cuadra 5 default

  const { totalEvents, avoidedVisits, savingsVisits, savingsTime, totalSavings, roi, paybackMonths } =
    computeEquineClientROI({
      horses: horses.value,
      eventsPerHorse: eventsPerHorse.value,
      resolution: resolution.value,
      onsiteCost: onsiteCost.value,
      travelCost: travelCost.value,
      hoursSaved: hoursSaved.value,
      downtimeCost: downtimeCost.value,
      membershipCost: membershipCost.value,
    });

  const downloadCSV = () => {
    const rows = [
      ["Variable", "Valor"],
      ["Número de caballos", horses.value],
      ["Eventos de triage por caballo (mes)", eventsPerHorse.value],
      ["Tasa de resolución digital", resolution.value],
      ["Costo visita in situ (MXN)", onsiteCost.value],
      ["Costo de traslado por visita (MXN)", travelCost.value],
      ["Horas ahorradas por evento", hoursSaved.value],
      ["Costo/hora de inactividad (MXN)", downtimeCost.value],
      ["Costo membresía (MXN/mes)", membershipCost.value],
      ["Eventos totales/mes", totalEvents],
      ["Visitas evitadas/mes", avoidedVisits],
      ["Ahorro por visitas (MXN)", savingsVisits],
      ["Ahorro por tiempo (MXN)", savingsTime],
      ["Ahorro total (MXN)", totalSavings],
      ["ROI mensual", roi],
      ["Payback (meses)", paybackMonths],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ROI_Equinos_Call-a-Vet_CLIENTE.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-6">
      <header className="flex items-center gap-3">
        <Calculator className="h-5 w-5" />
        <h3 className="text-2xl font-bold">Simulador para clientes</h3>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Entradas</CardTitle>
            <CardDescription>Ajusta a tu operación (costos locales, estacionalidad).</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">Número de caballos</Label>
                <Input className="mt-0 mb-3" type="number" min={0} step="1" {...horses.bind} />
              </div>
              <div>
                <Label className="mb-2 block">Eventos de triage / caballo (mes)</Label>
                <Input className="mt-0 mb-3" type="number" min={0} step="0.1" {...eventsPerHorse.bind} />
              </div>
              <div>
                <Label className="mb-2 block">Tasa de resolución digital</Label>
                <Input className="mt-0 mb-3" type="number" min={0} max={1} step="0.05" {...resolution.bind} />
              </div>
              <div>
                <Label className="mb-2 block">Costo visita in situ (MXN)</Label>
                <Input className="mt-0 mb-3" type="number" min={0} step="50" {...onsiteCost.bind} />
              </div>
              <div>
                <Label className="mb-2 block">Costo de traslado por visita (MXN)</Label>
                <Input className="mt-0 mb-3" type="number" min={0} step="50" {...travelCost.bind} />
              </div>
              <div>
                <Label className="mb-2 block">Horas ahorradas por evento</Label>
                <Input className="mt-0 mb-3" type="number" min={0} step="0.5" {...hoursSaved.bind} />
              </div>
              <div>
                <Label className="mb-2 block">Costo/hora de inactividad (MXN)</Label>
                <Input className="mt-0 mb-3" type="number" min={0} step="50" {...downtimeCost.bind} />
              </div>
              <div>
                <Label className="mb-2 block">Costo membresía (MXN/mes)</Label>
                <Input className="mt-0 mb-3" type="number" min={0} step="50" {...membershipCost.bind} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button variant="secondary" onClick={downloadCSV}>
              <Download className="mr-2 h-4 w-4" /> Descargar CSV
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-emerald-600">
          <CardHeader>
            <CardTitle>Resultados</CardTitle>
            <CardDescription>Estimaciones mensuales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Stat label="Eventos totales/mes" value={totalEvents.toFixed(2)} />
              <Stat label="Visitas evitadas/mes" value={avoidedVisits.toFixed(2)} />
              <Stat label="Ahorro por visitas" value={fmt.format(savingsVisits)} accent />
              <Stat label="Ahorro por tiempo" value={fmt.format(savingsTime)} />
              <Stat label="Ahorro total" value={fmt.format(totalSavings)} accent />
              <Stat label="ROI mensual" value={pct(roi)} />
              <Stat label="Payback (meses)" value={paybackMonths ? paybackMonths.toFixed(2) : "—"} />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <Zap className="mr-2 h-4 w-4" /> Optimizar con un plan de cuadra
            </Button>
          </CardFooter>
        </Card>
      </div>

    </section>
  );
}

// ✅ ADDED: Client test cases to fix reference error and ensure correctness
function RoiClientTestCases() {
  // Baseline from defaults — should match interactive calculator when left unchanged
  const baseline = computeEquineClientROI({
    horses: 5,
    eventsPerHorse: 0.2,
    resolution: 0.6,
    onsiteCost: 2500,
    travelCost: 500,
    hoursSaved: 1.5,
    downtimeCost: 400,
    membershipCost: 999,
  });

  // Scenario 2 — larger stable and higher costs
  const scenario2 = computeEquineClientROI({
    horses: 15,
    eventsPerHorse: 0.3,
    resolution: 0.65,
    onsiteCost: 3000,
    travelCost: 700,
    hoursSaved: 2,
    downtimeCost: 450,
    membershipCost: 2499,
  });

  // Scenario 3 — edge case (zero events, should produce zero savings and ROI 0)
  const scenario3 = computeEquineClientROI({
    horses: 10,
    eventsPerHorse: 0,
    resolution: 0.6,
    onsiteCost: 2500,
    travelCost: 500,
    hoursSaved: 1.5,
    downtimeCost: 400,
    membershipCost: 999,
  });

  const rows: Array<[string, string, string]> = [
    ["Ahorro total (baseline)", fmt.format(baseline.totalSavings), `ROI ${pct(baseline.roi)}`],
    ["Ahorro total (escenario 2)", fmt.format(scenario2.totalSavings), `ROI ${pct(scenario2.roi)}`],
    ["Caso borde (cero eventos)", fmt.format(scenario3.totalSavings), `ROI ${pct(scenario3.roi)}`],
  ];

}

// ------------------------------------------------------------
// Operator Economics (Call a Vet) — now appended below client calculator
// ------------------------------------------------------------

type OperatorParams = {
  chats: number;
  chatPrice: number;
  videos: number;
  videoPrice: number;
  memberships: number; // activos
  membershipPrice: number; // ARPU mensual
  takeRate: number; // plataforma DESPUÉS de fees
  payFeePct: number; // comisiones de pago (sobre GMV)
  refundPct: number; // % de reembolsos (sobre GMV)
  aiCostPerConsult: number; // costo IA por consulta
  livekitMinPerVideo: number;
  livekitCostPerMin: number;
  supportCostPerConsult: number;
  // Membresías con minutos/consultas incluidos
  includedChatsPerMembership: number;
  includedVideosPerMembership: number;
  // Costos fijos mensuales
  fixedServers: number;
  fixedOpenAIBase: number;
  operatorBaseSalary: number;
  ivaRate: number; // e.g. 0.16
};

function computeOperatorEconomics(p: OperatorParams) {
  // GMV
  const gmvConsults = p.chats * p.chatPrice + p.videos * p.videoPrice;
  const gmvMemberships = p.memberships * p.membershipPrice;
  const gmv = gmvConsults + gmvMemberships;

  // Net factor (present fees explicitly)
  const netFactorConsults = 1 - p.payFeePct - p.refundPct; // neto de fees+reembolsos

  // Ingresos plataforma en consultas: take rate sobre GMV neto
  const platformRevConsults = gmvConsults * netFactorConsults * p.takeRate;

  // Membresías: ingreso neto de fees (no marketplace), luego descontamos incluidos
  const platformRevMemberships = gmvMemberships * (1 - p.payFeePct);

  // Costos variables por consultas realizadas (no incluidas)
  const consultsCount = p.chats + p.videos;
  const aiCost = consultsCount * p.aiCostPerConsult;
  const livekitCost = p.videos * p.livekitMinPerVideo * p.livekitCostPerMin;
  const supportCost = consultsCount * p.supportCostPerConsult;

  // Incluidos por membresía (costeo)
  const incChats = p.memberships * p.includedChatsPerMembership;
  const incVideos = p.memberships * p.includedVideosPerMembership;
  const incCount = incChats + incVideos;
  const aiCostIncluded = incCount * p.aiCostPerConsult;
  const livekitCostIncluded = incVideos * p.livekitMinPerVideo * p.livekitCostPerMin;
  const supportCostIncluded = incCount * p.supportCostPerConsult;

  // Contribuciones
  const contributionConsults = platformRevConsults - (aiCost + livekitCost + supportCost);
  const membershipContribution = platformRevMemberships - (aiCostIncluded + livekitCostIncluded + supportCostIncluded);
  const totalContribution = contributionConsults + membershipContribution;
  const contribMarginPct = gmv > 0 ? totalContribution / gmv : 0;

  // Costos fijos
  const operatorSalaryWithIVA = p.operatorBaseSalary * (1 + p.ivaRate);
  const fixedCosts = p.fixedServers + p.fixedOpenAIBase + operatorSalaryWithIVA;
  const netOperating = totalContribution - fixedCosts;

  // Métricas marginales y break-even
  const mcChat = p.chatPrice * netFactorConsults * p.takeRate - (p.aiCostPerConsult + p.supportCostPerConsult);
  const mcVideo = p.videoPrice * netFactorConsults * p.takeRate - (p.aiCostPerConsult + p.supportCostPerConsult + p.livekitMinPerVideo * p.livekitCostPerMin);
  const mixChats = consultsCount > 0 ? p.chats / consultsCount : 0.5;
  const mixVideos = 1 - mixChats;
  const mcWeighted = mcChat * mixChats + mcVideo * mixVideos;
  const breakEvenConsults = mcWeighted > 0 ? fixedCosts / mcWeighted : Infinity;

  return {
    gmv,
    gmvConsults,
    gmvMemberships,
    platformRevConsults,
    platformRevMemberships,
    aiCost,
    livekitCost,
    supportCost,
    aiCostIncluded,
    livekitCostIncluded,
    supportCostIncluded,
    contributionConsults,
    membershipContribution,
    totalContribution,
    contribMarginPct,
    fixedCosts,
    netOperating,
    mcChat,
    mcVideo,
    breakEvenConsults,
    netFactorConsults,
  };
}

function OperatorEconomicsSection() {
  // Defaults (MX equino, conservadores)
  const chats = useNumberState(120);
  const chatPrice = useNumberState(279);
  const videos = useNumberState(60);
  const videoPrice = useNumberState(549);
  const memberships = useNumberState(30);
  const membershipPrice = useNumberState(999);

  // Fees & take: takeRate es sobre GMV neto (después de fees)
  const takeRate = useNumberState(0.25);
  const payFeePct = useNumberState(0.035);
  const refundPct = useNumberState(0.02);

  // Costos variables
  const aiCostPerConsult = useNumberState(3);
  const livekitMinPerVideo = useNumberState(15);
  const livekitCostPerMin = useNumberState(0.2);
  const supportCostPerConsult = useNumberState(8);

  // Incluidos por membresía
  const includedChatsPerMembership = useNumberState(2);
  const includedVideosPerMembership = useNumberState(0.5);

  // Costos fijos mensuales
  const fixedServers = useNumberState(8000);
  const fixedOpenAIBase = useNumberState(3000);
  const operatorBaseSalary = useNumberState(25000);
  const ivaRate = useNumberState(0.16);

  const p = {
    chats: chats.value,
    chatPrice: chatPrice.value,
    videos: videos.value,
    videoPrice: videoPrice.value,
    memberships: memberships.value,
    membershipPrice: membershipPrice.value,
    takeRate: takeRate.value,
    payFeePct: payFeePct.value,
    refundPct: refundPct.value,
    aiCostPerConsult: aiCostPerConsult.value,
    livekitMinPerVideo: livekitMinPerVideo.value,
    livekitCostPerMin: livekitCostPerMin.value,
    supportCostPerConsult: supportCostPerConsult.value,
    includedChatsPerMembership: includedChatsPerMembership.value,
    includedVideosPerMembership: includedVideosPerMembership.value,
    fixedServers: fixedServers.value,
    fixedOpenAIBase: fixedOpenAIBase.value,
    operatorBaseSalary: operatorBaseSalary.value,
    ivaRate: ivaRate.value,
  } satisfies OperatorParams;

  const r = computeOperatorEconomics(p);

  const downloadCSV = () => {
    const rows = [
      ["Variable", "Valor"],
      ["GMV total", r.gmv],
      ["GMV consultas", r.gmvConsults],
      ["GMV membresías", r.gmvMemberships],
      ["Ingresos plataforma (consultas)", r.platformRevConsults],
      ["Ingresos plataforma (membresías)", r.platformRevMemberships],
      ["Fee de pago (%)", payFeePct.value],
      ["Reembolsos (%)", refundPct.value],
      ["Take rate (sobre neto)", takeRate.value],
      ["Costo IA (consultas)", r.aiCost],
      ["Costo LiveKit (consultas)", r.livekitCost],
      ["Costo soporte (consultas)", r.supportCost],
      ["Costo IA incluidos", r.aiCostIncluded],
      ["Costo LiveKit incluidos", r.livekitCostIncluded],
      ["Costo soporte incluidos", r.supportCostIncluded],
      ["Contribución consultas", r.contributionConsults],
      ["Contribución membresías", r.membershipContribution],
      ["Contribución total", r.totalContribution],
      ["Costos fijos", r.fixedCosts],
      ["Margen operativo neto", r.netOperating],
      ["MC chat", r.mcChat],
      ["MC video", r.mcVideo],
      ["Break-even consultas (aprox)", r.breakEvenConsults],
    ];
    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Operator_Economics_Call-a-Vet.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-6">
      <header className="flex items-center gap-3">
        <Calculator className="h-5 w-5" />
        <h3 className="text-2xl font-bold">Cálculos Operativos</h3>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Entradas</CardTitle>
            <CardDescription>Volumen, precios, incluidos en membresía y costos fijos</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="mb-2 block">Chats / mes</Label><Input className="mt-0 mb-3" type="number" min={0} step="1" {...chats.bind} /></div>
              <div><Label className="mb-2 block">Precio chat (MXN)</Label><Input className="mt-0 mb-3" type="number" min={0} step="10" {...chatPrice.bind} /></div>
              <div><Label className="mb-2 block">Videos / mes</Label><Input className="mt-0 mb-3" type="number" min={0} step="1" {...videos.bind} /></div>
              <div><Label className="mb-2 block">Precio video (MXN)</Label><Input className="mt-0 mb-3" type="number" min={0} step="10" {...videoPrice.bind} /></div>
              <div><Label className="mb-2 block">Membresías activas</Label><Input className="mt-0 mb-3" type="number" min={0} step="1" {...memberships.bind} /></div>
              <div><Label className="mb-2 block">ARPU membresía (MXN)</Label><Input className="mt-0 mb-3" type="number" min={0} step="10" {...membershipPrice.bind} /></div>
              <div><Label className="mb-2 block">Fee de pago</Label><Input className="mt-0 mb-3" type="number" min={0} max={1} step="0.005" {...payFeePct.bind} /></div>
              <div><Label className="mb-2 block">Reembolsos</Label><Input className="mt-0 mb-3" type="number" min={0} max={1} step="0.005" {...refundPct.bind} /></div>
              <div><Label className="mb-2 block">Take rate (sobre neto)</Label><Input className="mt-0 mb-3" type="number" min={0} max={1} step="0.01" {...takeRate.bind} /></div>
              <div><Label className="mb-2 block">Costo IA/consulta</Label><Input className="mt-0 mb-3" type="number" min={0} step="1" {...aiCostPerConsult.bind} /></div>
              <div><Label className="mb-2 block">Min/video</Label><Input className="mt-0 mb-3" type="number" min={0} step="1" {...livekitMinPerVideo.bind} /></div>
              <div><Label className="mb-2 block">Costo LiveKit/min</Label><Input className="mt-0 mb-3" type="number" min={0} step="0.05" {...livekitCostPerMin.bind} /></div>
              <div><Label className="mb-2 block">Soporte/consulta</Label><Input className="mt-0 mb-3" type="number" min={0} step="1" {...supportCostPerConsult.bind} /></div>
              <div><Label className="mb-2 block">Incluidos: chats / membresía</Label><Input className="mt-0 mb-3" type="number" min={0} step="1" {...includedChatsPerMembership.bind} /></div>
              <div><Label className="mb-2 block">Incluidos: videos / membresía</Label><Input className="mt-0 mb-3" type="number" min={0} step="0.1" {...includedVideosPerMembership.bind} /></div>
              <div><Label className="mb-2 block">Fijo: servidores</Label><Input className="mt-0 mb-3" type="number" min={0} step="100" {...fixedServers.bind} /></div>
              <div><Label className="mb-2 block">Fijo: OpenAI (base)</Label><Input className="mt-0 mb-3" type="number" min={0} step="100" {...fixedOpenAIBase.bind} /></div>
              <div><Label className="mb-2 block">Sueldo operador (base)</Label><Input className="mt-0 mb-3" type="number" min={0} step="100" {...operatorBaseSalary.bind} /></div>
              <div><Label className="mb-2 block">IVA</Label><Input className="mt-0 mb-3" type="number" min={0} max={1} step="0.01" {...ivaRate.bind} /></div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button variant="secondary" onClick={downloadCSV}>
              <Download className="mr-2 h-4 w-4" /> Descargar CSV
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-emerald-600">
          <CardHeader>
            <CardTitle>Resultados</CardTitle>
            <CardDescription>Unit economics y costos fijos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Stat label="GMV total" value={fmt.format(r.gmv)} />
              <Stat label="GMV consultas" value={fmt.format(r.gmvConsults)} />
              <Stat label="GMV membresías" value={fmt.format(r.gmvMemberships)} />
              <Stat label="Ingresos plataforma (consultas)" value={fmt.format(r.platformRevConsults)} />
              <Stat label="Ingresos plataforma (membresías)" value={fmt.format(r.platformRevMemberships)} />
              <Stat label="Fee pago + reembolsos (net factor)" value={pct(1 - r.netFactorConsults)} />
              <Stat label="Costo IA (consultas)" value={fmt.format(r.aiCost)} />
              <Stat label="Costo LiveKit (consultas)" value={fmt.format(r.livekitCost)} />
              <Stat label="Costo soporte (consultas)" value={fmt.format(r.supportCost)} />
              <Stat label="Costos incluidos (IA+Video+Soporte)" value={fmt.format(r.aiCostIncluded + r.livekitCostIncluded + r.supportCostIncluded)} />
              <Stat label="Contribución consultas" value={fmt.format(r.contributionConsults)} />
              <Stat label="Contribución membresías" value={fmt.format(r.membershipContribution)} />
              <Stat label="Contribución total" value={fmt.format(r.totalContribution)} accent />
              <Stat label="Costos fijos" value={fmt.format(r.fixedCosts)} />
              <Stat label="Margen operativo neto" value={fmt.format(r.netOperating)} accent />
              <Stat label="MC chat" value={fmt.format(r.mcChat)} />
              <Stat label="MC video" value={fmt.format(r.mcVideo)} />
              <Stat label="Break-even (consultas aprox)" value={Number.isFinite(r.breakEvenConsults) ? r.breakEvenConsults.toFixed(1) : "—"} />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function OperatorTestCases() {
  const baseline = computeOperatorEconomics({
    chats: 120, chatPrice: 279,
    videos: 60, videoPrice: 549,
    memberships: 30, membershipPrice: 999,
    takeRate: 0.25, payFeePct: 0.035, refundPct: 0.02,
    aiCostPerConsult: 3, livekitMinPerVideo: 15, livekitCostPerMin: 0.2, supportCostPerConsult: 8,
    includedChatsPerMembership: 2, includedVideosPerMembership: 0.5,
    fixedServers: 8000, fixedOpenAIBase: 3000, operatorBaseSalary: 25000, ivaRate: 0.16,
  });

  const scale = computeOperatorEconomics({
    chats: 400, chatPrice: 279,
    videos: 200, videoPrice: 549,
    memberships: 120, membershipPrice: 999,
    takeRate: 0.28, payFeePct: 0.03, refundPct: 0.015,
    aiCostPerConsult: 2.5, livekitMinPerVideo: 15, livekitCostPerMin: 0.18, supportCostPerConsult: 7,
    includedChatsPerMembership: 2, includedVideosPerMembership: 0.8,
    fixedServers: 12000, fixedOpenAIBase: 5000, operatorBaseSalary: 25000, ivaRate: 0.16,
  });

  // ➕ Extra tests to strengthen coverage (do not modify existing rows)
  const lean = computeOperatorEconomics({
    chats: 40, chatPrice: 279,
    videos: 10, videoPrice: 549,
    memberships: 10, membershipPrice: 999,
    takeRate: 0.22, payFeePct: 0.035, refundPct: 0.02,
    aiCostPerConsult: 3.5, livekitMinPerVideo: 15, livekitCostPerMin: 0.22, supportCostPerConsult: 9,
    includedChatsPerMembership: 1, includedVideosPerMembership: 0.3,
    fixedServers: 8000, fixedOpenAIBase: 3000, operatorBaseSalary: 25000, ivaRate: 0.16,
  });

  const zeroRev = computeOperatorEconomics({
    chats: 0, chatPrice: 279,
    videos: 0, videoPrice: 549,
    memberships: 0, membershipPrice: 999,
    takeRate: 0.25, payFeePct: 0.035, refundPct: 0.02,
    aiCostPerConsult: 3, livekitMinPerVideo: 15, livekitCostPerMin: 0.2, supportCostPerConsult: 8,
    includedChatsPerMembership: 0, includedVideosPerMembership: 0,
    fixedServers: 8000, fixedOpenAIBase: 3000, operatorBaseSalary: 25000, ivaRate: 0.16,
  });

  const rows: Array<[string, string, string]> = [
    ["Contribución total (baseline)", fmt.format(baseline.totalContribution), `Net ${fmt.format(baseline.netOperating)}`],
    ["MC chat / MC video", fmt.format(baseline.mcChat), fmt.format(baseline.mcVideo)],
    ["Break-even consultas (base)", Number.isFinite(baseline.breakEvenConsults) ? baseline.breakEvenConsults.toFixed(1) : "—", ""],
    ["Contribución total (escala)", fmt.format(scale.totalContribution), `Net ${fmt.format(scale.netOperating)}`],
    ["Break-even consultas (escala)", Number.isFinite(scale.breakEvenConsults) ? scale.breakEvenConsults.toFixed(1) : "—", ""],
    // New rows (additive)
    ["Contribución total (lean)", fmt.format(lean.totalContribution), `Net ${fmt.format(lean.netOperating)}`],
    ["Break-even (lean)", Number.isFinite(lean.breakEvenConsults) ? lean.breakEvenConsults.toFixed(1) : "—", ""] ,
    ["Contribución total (0 ingresos)", fmt.format(zeroRev.totalContribution), `Net ${fmt.format(zeroRev.netOperating)}`],
  ];


}

// ------------------------------------------------------------
// Pages (SAME PAGE: Pricing + Client ROI + Operator Economics)
// ------------------------------------------------------------

export default function EquinePricingAndROIPage() {
  return (
    <main className="container mx-auto max-w-6xl px-4 py-10 space-y-16">
      <PricingTableEquine />
      <RoiCalculatorEquine />
      {/* New: appended operator economics below */}
      <OperatorEconomicsSection />
    </main>
  );
}
