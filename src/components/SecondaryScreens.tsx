import React, { useState } from "react";
import {
  CustomerRecord,
  LoyaltyReward,
  ReviewItem,
  SalonService,
  AutomationWorkflow,
} from "../data/mockData";
import { LuminaQrSvg, downloadQrPng } from "./QrCodeCard";

/* ============================================================================
   1. CUSTOMERS SCREEN
============================================================================ */
interface CustomersScreenProps {
  customers: CustomerRecord[];
  initialFilter?: "all" | "inactive" | "vip" | "new";
  onAddPoints: (customerId: string, pts: number) => void;
  onSendWinBack: () => void;
  onAddCustomer: (c: Omit<CustomerRecord, "id">) => void;
  winBackSent: boolean;
}

export const CustomersScreen: React.FC<CustomersScreenProps> = ({
  customers,
  initialFilter = "all",
  onAddPoints,
  onSendWinBack,
  onAddCustomer,
  winBackSent,
}) => {
  const [filter, setFilter] = useState<"all" | "inactive" | "vip" | "new">(initialFilter);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newService, setNewService] = useState("Hydra-Glow Facial");

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.lastService.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "inactive") return c.status === "Inactive 45+ Days";
    if (filter === "vip") return c.tier === "Platinum VIP" || c.tier === "Gold";
    if (filter === "new") return c.tier === "New Member";
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAddCustomer({
      name: newName.trim(),
      email: newEmail.trim() || `${newName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      phone: newPhone.trim() || "(555) 409-8821",
      tier: "New Member",
      points: 50,
      totalVisits: 1,
      totalSpend: 145,
      lastVisitDaysAgo: 0,
      lastService: newService,
      status: "Active",
      source: "In-Store QR",
    });
    setNewName("");
    setNewEmail("");
    setNewPhone("");
    setShowAddForm(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            Customer Directory &amp; Segments
          </h1>
          <p className="font-body-md text-body-md text-secondary mt-1">
            Verified visit records, loyalty spend tiers, and automated churn detection for{" "}
            <strong className="text-on-surface font-semibold">Lumina Haven</strong>.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onSendWinBack}
            className="px-4 py-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg shadow-sm transition-all flex items-center gap-2"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            <span>{winBackSent ? "Win-Back Campaign Active" : "Win Back 18 Inactive Clients"}</span>
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant hover:bg-surface-container text-on-surface font-label-lg text-label-lg transition-colors flex items-center gap-1.5"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">person_add</span>
            <span>Add Client</span>
          </button>
        </div>
      </div>

      {/* Add Client Inline Card */}
      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-xl bg-surface-container-lowest p-5 shadow-sm border border-primary-container/30 flex flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Check In &amp; Register New Loyalty Client (+50 Welcome Points)
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-secondary hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              required
              placeholder="Client full name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md focus:outline-none focus:border-primary-container"
            />
            <input
              type="email"
              placeholder="Email address"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md focus:outline-none focus:border-primary-container"
            />
            <input
              type="text"
              placeholder="Mobile phone"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md focus:outline-none focus:border-primary-container"
            />
            <select
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              className="px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md focus:outline-none focus:border-primary-container"
            >
              <option>Hydra-Glow Facial</option>
              <option>Botanical Scalp Treatment</option>
              <option>Signature Balayage &amp; Gloss</option>
              <option>Executive Cut &amp; Hot Towel Finish</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-1.5 rounded-lg bg-surface-container-low text-secondary font-label-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-primary-container text-on-primary font-label-lg font-semibold"
            >
              Save &amp; Award 50 Pts
            </button>
          </div>
        </form>
      )}

      {/* Filter Bar & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest p-3.5 rounded-xl shadow-sm">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1.5 rounded-lg font-label-md text-label-md transition-colors ${
              filter === "all"
                ? "bg-primary-container text-on-primary font-semibold"
                : "text-secondary hover:bg-surface-container-low"
            }`}
          >
            All Verified Clients ({customers.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("inactive")}
            className={`px-3.5 py-1.5 rounded-lg font-label-md text-label-md transition-colors flex items-center gap-1.5 ${
              filter === "inactive"
                ? "bg-primary-container text-on-primary font-semibold"
                : "text-secondary hover:bg-surface-container-low"
            }`}
          >
            <span>Inactive 45+ Days</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-label-sm">
              18 Flagged
            </span>
          </button>
          <button
            type="button"
            onClick={() => setFilter("vip")}
            className={`px-3.5 py-1.5 rounded-lg font-label-md text-label-md transition-colors ${
              filter === "vip"
                ? "bg-primary-container text-on-primary font-semibold"
                : "text-secondary hover:bg-surface-container-low"
            }`}
          >
            VIP &amp; Gold Tiers
          </button>
          <button
            type="button"
            onClick={() => setFilter("new")}
            className={`px-3.5 py-1.5 rounded-lg font-label-md text-label-md transition-colors ${
              filter === "new"
                ? "bg-primary-container text-on-primary font-semibold"
                : "text-secondary hover:bg-surface-container-low"
            }`}
          >
            New This Month
          </button>
        </div>
        <div className="relative min-w-[240px]">
          <span className="material-symbols-outlined text-[18px] text-secondary absolute left-3 top-1/2 -translate-y-1/2">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search client or service..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-container-low border border-transparent focus:border-primary-container focus:bg-surface-container-lowest text-body-md text-on-surface focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-container bg-surface-container-low/60 text-secondary font-label-sm text-label-sm uppercase">
                <th className="py-3.5 px-5">Client</th>
                <th className="py-3.5 px-4">Loyalty Tier &amp; Pts</th>
                <th className="py-3.5 px-4">Last Service</th>
                <th className="py-3.5 px-4 text-right">Visits</th>
                <th className="py-3.5 px-4 text-right">Total Spend</th>
                <th className="py-3.5 px-4">Cadence Status</th>
                <th className="py-3.5 px-5 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container font-body-md text-body-md">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                        {c.name}
                      </span>
                      <span className="font-body-sm text-body-sm text-secondary">
                        {c.phone} · {c.source}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${
                          c.tier === "Platinum VIP"
                            ? "bg-primary-container/15 text-primary"
                            : c.tier === "Gold"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-secondary-container text-on-secondary-fixed"
                        }`}
                      >
                        {c.tier}
                      </span>
                      <span className="font-mono text-body-sm font-semibold text-on-surface tabular-nums">
                        {c.points} pts
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant">{c.lastService}</td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-on-surface">
                    {c.totalVisits}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-semibold text-on-surface">
                    ${c.totalSpend.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    {c.status === "Inactive 45+ Days" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-label-sm text-label-sm">
                        <span className="material-symbols-outlined text-[13px]">schedule</span>
                        {c.lastVisitDaysAgo}d ago · Lapsed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed/30 text-tertiary font-label-sm text-label-sm">
                        <span className="material-symbols-outlined text-[13px]">verified</span>
                        {c.lastVisitDaysAgo === 0 ? "Visited Today" : `${c.lastVisitDaysAgo}d ago`}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      type="button"
                      onClick={() => onAddPoints(c.id, 50)}
                      className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-primary-container hover:text-on-primary text-on-surface font-label-sm text-label-sm font-semibold transition-colors"
                    >
                      +50 Loyalty Pts
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   2. LOYALTY & REWARDS SCREEN
============================================================================ */
interface LoyaltyScreenProps {
  rewards: LoyaltyReward[];
  onRedeemReward: (rewardId: string) => void;
  onAddReward: (title: string, pointsCost: number, description: string) => void;
  onOpenQrModal: () => void;
}

export const LoyaltyScreen: React.FC<LoyaltyScreenProps> = ({
  rewards,
  onRedeemReward,
  onAddReward,
  onOpenQrModal,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [points, setPoints] = useState(200);
  const [desc, setDesc] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddReward(
      title.trim(),
      points,
      desc.trim() || "Complimentary VIP treatment added to any regular salon booking."
    );
    setTitle("");
    setDesc("");
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            VIP Loyalty &amp; Rewards Hub
          </h1>
          <p className="font-body-md text-body-md text-secondary mt-1">
            Automated point accrual, register perk redemptions, and dual-action Front Desk QR stand.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowAddModal(!showAddModal)}
            className="px-4 py-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg shadow-sm transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Add Loyalty Reward</span>
          </button>
        </div>
      </div>

      {showAddModal && (
        <form
          onSubmit={handleCreate}
          className="rounded-xl bg-surface-container-lowest p-5 shadow-sm border border-primary-container/30 flex flex-col gap-4"
        >
          <h3 className="font-headline-sm text-headline-sm text-on-surface">
            Configure New Customer Perk
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Perk title (e.g. Free Brow Sculpt)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md"
            />
            <input
              type="number"
              min={50}
              step={25}
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
              placeholder="Points cost"
              className="px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md"
            />
            <input
              type="text"
              placeholder="Short perk description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-1.5 rounded-lg bg-surface-container-low text-secondary font-label-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-primary-container text-on-primary font-label-lg font-semibold"
            >
              Publish Perk
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rewards.map((r) => (
            <div
              key={r.id}
              className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col justify-between gap-4 border border-surface-container"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-container/10 text-primary font-label-sm text-label-sm font-semibold">
                    {r.pointsCost} Points
                  </span>
                  <span className="font-label-sm text-label-sm text-tertiary font-semibold">
                    {r.revenueImpact}
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mt-3">
                  {r.title}
                </h3>
                <p className="font-body-md text-body-md text-secondary mt-1.5">{r.description}</p>
              </div>
              <div className="pt-3 border-t border-surface-container flex items-center justify-between">
                <span className="font-body-sm text-body-sm text-secondary tabular-nums">
                  <strong className="text-on-surface">{r.redemptionsCount}</strong> redeemed this month
                </span>
                <button
                  type="button"
                  onClick={() => onRedeemReward(r.id)}
                  className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-primary-container hover:text-on-primary text-on-surface font-label-sm text-label-sm font-semibold transition-colors"
                >
                  Log Redemption
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4 rounded-2xl bg-surface-container-lowest p-5 shadow-sm flex flex-col items-center text-center">
          <div className="flex items-center justify-between w-full mb-3">
            <span className="font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-wider">
              In-Store Growth Tool
            </span>
            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
              Front Desk
            </span>
          </div>
          <div className="relative p-3 rounded-2xl bg-surface-container-low shadow-inner">
            <LuminaQrSvg className="w-40 h-40" />
          </div>
          <h4 className="font-headline-sm text-headline-sm text-on-surface mt-3">
            Scan to Join &amp; Review
          </h4>
          <p className="font-body-sm text-body-sm text-secondary mt-0.5">
            Dual-action QR route: automatically prompts review after loyalty punch.
          </p>
          <div className="grid grid-cols-2 gap-2 w-full mt-4">
            <button
              type="button"
              onClick={() => downloadQrPng()}
              className="py-2 px-3 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-sm text-label-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[15px]">download</span>
              <span>Download PNG</span>
            </button>
            <button
              type="button"
              onClick={onOpenQrModal}
              className="py-2 px-3 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-sm text-label-sm font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[15px]">print</span>
              <span>Print Stand</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   3. REVIEWS SCREEN
============================================================================ */
interface ReviewsScreenProps {
  reviews: ReviewItem[];
  pendingRequestsCount: number;
  onApproveReply: (reviewId: string, customReply: string) => void;
  onSendPendingRequests: () => void;
}

export const ReviewsScreen: React.FC<ReviewsScreenProps> = ({
  reviews,
  pendingRequestsCount,
  onApproveReply,
  onSendPendingRequests,
}) => {
  const [draftEdits, setDraftEdits] = useState<Record<string, string>>({});

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            Google Reviews &amp; AI Reputation Engine
          </h1>
          <p className="font-body-md text-body-md text-secondary mt-1">
            4.9★ Verified Google Business Profile rating · Personalized AI review replies &amp; SMS invites.
          </p>
        </div>
        <button
          type="button"
          onClick={onSendPendingRequests}
          disabled={pendingRequestsCount === 0}
          className={`px-4 py-2 rounded-lg font-label-lg text-label-lg shadow-sm transition-all flex items-center gap-2 ${
            pendingRequestsCount > 0
              ? "bg-primary-container hover:bg-primary text-on-primary"
              : "bg-tertiary-container text-on-tertiary"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {pendingRequestsCount > 0 ? "send" : "check_circle"}
          </span>
          <span>
            {pendingRequestsCount > 0
              ? `Send ${pendingRequestsCount} Pending Review Requests`
              : "All 14 Review Requests Sent"}
          </span>
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {reviews.map((rev) => {
          const currentDraft = draftEdits[rev.id] ?? rev.aiDraftReply;
          return (
            <div
              key={rev.id}
              className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col gap-4"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[22px] fill-1">star</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-headline-sm text-headline-sm text-on-surface">
                        {rev.author}
                      </span>
                      <span className="text-amber-500 font-label-md">★★★★★</span>
                      <span className="font-body-sm text-body-sm text-secondary">
                        · {rev.source} · {rev.date}
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-secondary">
                      Service: {rev.service}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm font-semibold ${
                    rev.status === "Replied"
                      ? "bg-tertiary-fixed/30 text-tertiary"
                      : "bg-primary-container/15 text-primary"
                  }`}
                >
                  {rev.status === "Replied" ? "✓ Reply Published on Google" : "AI Reply Ready"}
                </span>
              </div>

              <p className="font-body-lg text-body-lg text-on-surface italic bg-surface-container-low/60 p-4 rounded-xl">
                “{rev.comment}”
              </p>

              {rev.status === "Needs Reply" ? (
                <div className="flex flex-col gap-2.5 pt-1">
                  <label className="font-label-sm text-label-sm text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                    AI-Drafted Personal Response (Editable before publishing)
                  </label>
                  <textarea
                    rows={2}
                    value={currentDraft}
                    onChange={(e) => setDraftEdits({ ...draftEdits, [rev.id]: e.target.value })}
                    className="w-full p-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-body-md text-on-surface focus:outline-none focus:border-primary-container"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => onApproveReply(rev.id, currentDraft)}
                      className="px-4 py-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md font-semibold flex items-center gap-1.5 shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                      <span>Approve &amp; Publish Reply</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-l-2 border-tertiary-container pl-4 py-1">
                  <span className="font-label-sm text-label-sm text-tertiary block">
                    Elena Vance (Owner) replied:
                  </span>
                  <p className="font-body-md text-body-md text-secondary mt-0.5">
                    {rev.publishedReply}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================================
   4. MARKETING SCREEN
============================================================================ */
interface MarketingScreenProps {
  services: SalonService[];
  onPublishPost: (serviceName: string, caption: string, channels: string[]) => void;
}

export const MarketingScreen: React.FC<MarketingScreenProps> = ({
  services,
  onPublishPost,
}) => {
  const [selectedService, setSelectedService] = useState(services[0].name);
  const [caption, setCaption] = useState(
    "✨ Treat your skin to our signature Hydra-Glow Facial this week at Lumina Haven! Deep botanical hydration + LED renewal. Book through our bio link & earn 2x VIP loyalty points! #LuminaHaven #HydraGlow #SalonAndSpa"
  );
  const [useIg, setUseIg] = useState(true);
  const [useFb, setUseFb] = useState(true);
  const [useSms, setUseSms] = useState(false);
  const [justPublished, setJustPublished] = useState(false);

  const handleSelectService = (srvName: string) => {
    setSelectedService(srvName);
    setCaption(
      `✨ Experience our featured ${srvName} at Lumina Haven Salon & Spa! Reserve your appointment this week and receive 50 bonus VIP loyalty points at check-in. #LuminaHaven #SelfCare #SpaDay`
    );
  };

  const handlePublish = () => {
    const ch = [
      ...(useIg ? ["Instagram @luminahaven"] : []),
      ...(useFb ? ["Facebook Page"] : []),
      ...(useSms ? ["VIP SMS List"] : []),
    ];
    onPublishPost(selectedService, caption, ch.length ? ch : ["Instagram @luminahaven"]);
    setJustPublished(true);
    setTimeout(() => setJustPublished(false), 2500);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
          Multi-Channel AI Marketing Studio
        </h1>
        <p className="font-body-md text-body-md text-secondary mt-1">
          Generate high-converting social carousels and direct SMS promotions from your 8 synced salon services.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col gap-5">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">
            1. Select Featured Service &amp; Channels
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {services.slice(0, 6).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelectService(s.name)}
                className={`p-3 rounded-xl text-left border transition-all flex items-center justify-between ${
                  selectedService === s.name
                    ? "border-primary-container bg-primary-container/10"
                    : "border-surface-container bg-surface-container-low/50 hover:bg-surface-container-low"
                }`}
              >
                <div>
                  <span className="font-label-lg text-label-lg text-on-surface block">
                    {s.name}
                  </span>
                  <span className="font-body-sm text-body-sm text-secondary">
                    ${s.price} · {s.duration}
                  </span>
                </div>
                {selectedService === s.name && (
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    check_circle
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-label-md text-label-md text-on-surface font-semibold">
              2. AI-Generated Copy &amp; Offer Tags
            </label>
            <textarea
              rows={4}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-body-md text-on-surface focus:outline-none focus:border-primary-container"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container-low cursor-pointer">
              <input
                type="checkbox"
                checked={useIg}
                onChange={(e) => setUseIg(e.target.checked)}
                className="accent-primary-container"
              />
              <span className="font-label-md text-label-md text-on-surface">
                Instagram (@luminahaven)
              </span>
            </label>
            <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container-low cursor-pointer">
              <input
                type="checkbox"
                checked={useFb}
                onChange={(e) => setUseFb(e.target.checked)}
                className="accent-primary-container"
              />
              <span className="font-label-md text-label-md text-on-surface">Facebook Page</span>
            </label>
            <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container-low cursor-pointer">
              <input
                type="checkbox"
                checked={useSms}
                onChange={(e) => setUseSms(e.target.checked)}
                className="accent-primary-container"
              />
              <span className="font-label-md text-label-md text-on-surface">
                VIP SMS Blast (38 Returning)
              </span>
            </label>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handlePublish}
              className="w-full py-3 px-5 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">
                {justPublished ? "check_circle" : "rocket_launch"}
              </span>
              <span>
                {justPublished
                  ? "Published to Live Feed!"
                  : `Publish '${selectedService}' Promotion Now`}
              </span>
            </button>
          </div>
        </div>

        {/* Live Social Preview */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-secondary uppercase">
              Live Multi-Channel Preview
            </span>
            <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed/30 text-tertiary font-label-sm">
              Ready to Publish
            </span>
          </div>
          <div className="rounded-xl border border-surface-container overflow-hidden bg-surface-container-low/40 p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary font-bold flex items-center justify-center text-xs">
                LH
              </div>
              <div>
                <span className="font-label-md text-label-md text-on-surface font-semibold block">
                  luminahaven
                </span>
                <span className="font-body-sm text-body-sm text-secondary">
                  Lumina Haven Salon &amp; Spa • Sponsored
                </span>
              </div>
            </div>
            <div className="h-44 rounded-xl bg-gradient-to-br from-[#25005a] via-[#630ed4] to-[#7c3aed] text-white p-5 flex flex-col justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-label-sm w-fit">
                SPRING REFRESH SPECIAL
              </span>
              <div>
                <h4 className="font-headline-md text-headline-md font-bold">{selectedService}</h4>
                <p className="font-body-sm text-white/85 mt-1">
                  Book today at Lumina Haven • Double VIP Points Included
                </p>
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">{caption}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   5. AUTOMATIONS SCREEN
============================================================================ */
interface AutomationsScreenProps {
  automations: AutomationWorkflow[];
  onToggleAutomation: (id: string) => void;
}

export const AutomationsScreen: React.FC<AutomationsScreenProps> = ({
  automations,
  onToggleAutomation,
}) => (
  <div className="flex flex-col gap-6">
    <div>
      <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
        Automated Growth Engines
      </h1>
      <p className="font-body-md text-body-md text-secondary mt-1">
        Always-on triggers that win back lapsed guests, collect 5-star Google reviews, and reward repeat visits automatically.
      </p>
    </div>

    <div className="flex flex-col gap-4">
      {automations.map((a) => (
        <div
          key={a.id}
          className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border border-surface-container"
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                a.active
                  ? "bg-primary-container text-on-primary"
                  : "bg-surface-container text-secondary"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">bolt</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">{a.name}</h3>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-secondary font-label-sm">
                  {a.category}
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-secondary">
                <strong className="text-on-surface">Trigger:</strong> {a.trigger}
              </p>
              <p className="font-body-sm text-body-sm text-secondary">
                <strong className="text-on-surface">Action:</strong> {a.action}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 self-end md:self-center shrink-0">
            <div className="text-right">
              <span className="font-label-lg text-label-lg text-tertiary font-bold block tabular-nums">
                {a.revenueGenerated}
              </span>
              <span className="font-body-sm text-body-sm text-secondary tabular-nums">
                {a.sentCount} sent · {a.conversionRate} conv.
              </span>
            </div>
            <button
              type="button"
              onClick={() => onToggleAutomation(a.id)}
              className={`px-4 py-2 rounded-xl font-label-md text-label-md font-semibold transition-colors ${
                a.active
                  ? "bg-tertiary-fixed/40 text-tertiary"
                  : "bg-surface-container-high text-secondary"
              }`}
            >
              {a.active ? "● Active" : "Paused"}
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ============================================================================
   6. INSIGHTS SCREEN
============================================================================ */
export const InsightsScreen: React.FC<{ services: SalonService[] }> = ({ services }) => (
  <div className="flex flex-col gap-6">
    <div>
      <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
        Executive Revenue &amp; Retention Insights
      </h1>
      <p className="font-body-md text-body-md text-secondary mt-1">
        Verified attribution from AdVantage AI™ loyalty, review, and win-back campaigns.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
        <span className="font-label-md text-secondary">AI-Attributed Net Revenue (30d)</span>
        <div className="font-display-lg text-display-lg text-on-surface font-bold mt-2 tabular-nums">
          $6,840
        </div>
        <span className="font-label-sm text-tertiary font-semibold mt-2 block">
          ↑ +28% vs prior 30 days · 4.9x ROI on Growth Plan
        </span>
      </div>
      <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
        <span className="font-label-md text-secondary">Repeat Client Retention Rate</span>
        <div className="font-display-lg text-display-lg text-on-surface font-bold mt-2 tabular-nums">
          78.4%
        </div>
        <span className="font-label-sm text-tertiary font-semibold mt-2 block">
          ↑ +14.2% since activating Front Desk Loyalty QR
        </span>
      </div>
      <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
        <span className="font-label-md text-secondary">Average Ticket Size (VIP vs Non-VIP)</span>
        <div className="font-display-lg text-display-lg text-on-surface font-bold mt-2 tabular-nums">
          $168
        </div>
        <span className="font-label-sm text-primary font-semibold mt-2 block">
          +$42 higher spend per visit from loyalty members
        </span>
      </div>
    </div>

    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col gap-4">
      <h2 className="font-headline-sm text-headline-sm text-on-surface">
        Synced Service Performance (8 Active Salon &amp; Spa Services)
      </h2>
      <div className="flex flex-col gap-3">
        {services.map((s) => {
          const pct = Math.min(100, Math.round((s.bookingsThisMonth / 70) * 100));
          return (
            <div key={s.id} className="flex flex-col gap-1">
              <div className="flex items-center justify-between font-body-md">
                <span className="font-semibold text-on-surface">
                  {s.name}{" "}
                  <span className="text-secondary font-normal">
                    (${s.price} · {s.duration})
                  </span>
                </span>
                <span className="font-mono text-body-sm font-semibold text-on-surface tabular-nums">
                  {s.bookingsThisMonth} bookings · ${(s.bookingsThisMonth * s.price).toLocaleString()}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-surface-container-low overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary-container"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

/* ============================================================================
   7. SETTINGS SCREEN
============================================================================ */
interface SettingsScreenProps {
  primaryGoal: string;
  onChangeGoal: (g: string) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  primaryGoal,
  onChangeGoal,
}) => {
  const [savedBanner, setSavedBanner] = useState(false);

  const goals = [
    "Build Customer Loyalty & Repeat Visits",
    "Maximize 5-Star Google Reviews & Local SEO",
    "Fill Slow Mid-Week Salon Chairs via Flash SMS",
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
          Business Profile &amp; Connected Channels
        </h1>
        <p className="font-body-md text-body-md text-secondary mt-1">
          Configure Lumina Haven’s #1 AI growth goal, connected social accounts, and SMS/Email gateway.
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col gap-4">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">
          #1 Business Goal (Drives Your AI Growth Plan)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {goals.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => {
                onChangeGoal(g);
                setSavedBanner(true);
                setTimeout(() => setSavedBanner(false), 2000);
              }}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 ${
                primaryGoal === g
                  ? "border-primary-container bg-primary-container/10"
                  : "border-surface-container bg-surface-container-low/50 hover:bg-surface-container-low"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="material-symbols-outlined text-primary text-[20px]">target</span>
                {primaryGoal === g && (
                  <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm">
                    Active #1 Goal
                  </span>
                )}
              </div>
              <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                {g}
              </span>
            </button>
          ))}
        </div>
        {savedBanner && (
          <div className="text-tertiary font-label-md flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>Primary AI Goal updated across Dashboard recommendations!</span>
          </div>
        )}
      </div>
    </div>
  );
};
