import React, { useState } from "react";
import { LuminaQrSvg, downloadQrPng } from "./QrCodeCard";
import { CustomerRecord } from "../data/mockData";

export type ActiveModalType =
  | null
  | "qr-stand"
  | "win-back"
  | "preview-post"
  | "quick-action"
  | "ai-assistant";

interface ActionModalsProps {
  activeModal: ActiveModalType;
  onClose: () => void;
  qrActivated: boolean;
  onActivateQr: () => void;
  winBackSent: boolean;
  onConfirmWinBack: () => void;
  onPublishPromo: (caption: string) => void;
  inactiveCustomers: CustomerRecord[];
  onNavigate: (tab: any, subFilter?: "all" | "inactive" | "vip" | "new") => void;
}

export const ActionModals: React.FC<ActionModalsProps> = ({
  activeModal,
  onClose,
  qrActivated,
  onActivateQr,
  winBackSent,
  onConfirmWinBack,
  onPublishPromo,
  inactiveCustomers,
  onNavigate,
}) => {
  const [promoCaption, setPromoCaption] = useState(
    "✨ Spring Refresh Special at Lumina Haven! Book our signature Hydra-Glow Facial this week and enjoy radiant botanical hydration + 2x VIP Loyalty Points. Tap link in bio to reserve your glow! #LuminaHaven #HydraGlowFacial #SalonAndSpa"
  );
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState<{ role: "ai" | "user"; text: string }[]>([
    {
      role: "ai",
      text: "Good morning, Elena! I’ve analyzed Lumina Haven’s booking cadence today. You have 3 high-impact actions ready: launching VIP Weekend Double Points (+$1,420 projected), sending 14 pending Google Review invites, or winning back 18 clients who haven’t visited in 45+ days. What would you like to execute first?",
    },
  ]);

  if (!activeModal) return null;

  const handleAiSend = (promptText?: string) => {
    const query = (promptText ?? aiInput).trim();
    if (!query) return;
    const nextMsgs = [...aiMessages, { role: "user" as const, text: query }];
    let reply =
      "I’ve prepared that workflow for Lumina Haven. You can launch it with one click from your Dashboard or Marketing Studio.";
    if (query.toLowerCase().includes("weekend") || query.toLowerCase().includes("double")) {
      reply =
        "Your 38 returning VIP members average $168 per visit. Sending a Fri–Sun Double Points SMS blast today at 11:00 AM projects +22% repeat bookings ($1,420 net revenue bump).";
    } else if (query.toLowerCase().includes("churn") || query.toLowerCase().includes("18")) {
      reply =
        "I identified 18 clients (including Chloe Lindqvist, Hannah Morales, and Olivia Sterling) who usually book every 3 weeks but haven't visited in 45+ days. Their 'We Miss You' 15% off 10-day voucher is queued and ready for your approval.";
    } else if (query.toLowerCase().includes("review")) {
      reply =
        "14 recent guests checked out in the last 72 hours with high satisfaction scores. Sending personalized SMS Google Review links now is projected to lift your rating from 4.9★ to 4.95★.";
    }
    setAiMessages([...nextMsgs, { role: "ai" as const, text: reply }]);
    setAiInput("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0b1c30]/50 backdrop-blur-xs flex items-center justify-center p-4">
      {/* 1. QR STAND MODAL */}
      {activeModal === "qr-stand" && (
        <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-xl border border-surface-container flex flex-col items-center text-center relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container-low"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
          <span className="px-2.5 py-0.5 rounded-full bg-primary-container/15 text-primary font-label-sm text-label-sm font-bold uppercase">
            Lumina Haven • Front Desk Display
          </span>
          <h3 className="font-headline-md text-headline-md text-on-surface mt-2">
            Scan to Join VIP Loyalty &amp; Review
          </h3>
          <p className="font-body-sm text-body-sm text-secondary mt-1">
            Place this stand at your reception register. Guests scan once to log their visit points and get routed to leave a 5-star Google review.
          </p>

          <div className="my-5 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/50 flex flex-col items-center shadow-inner">
            <LuminaQrSvg className="w-48 h-48" />
            <span className="font-label-md text-label-md text-on-surface font-semibold mt-3">
              Lumina Haven Salon &amp; Spa
            </span>
            <span className="font-label-sm text-label-sm text-primary">
              +50 Instant Welcome Points • Free Scalp Ritual at 250 Pts
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              type="button"
              onClick={() => downloadQrPng(onActivateQr)}
              className="py-2.5 px-4 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[17px]">download</span>
              <span>Download PNG</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onActivateQr();
                onClose();
              }}
              className="py-2.5 px-4 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[17px]">check_circle</span>
              <span>{qrActivated ? "QR Stand Active" : "Mark Printed & Active"}</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. WIN-BACK CAMPAIGN MODAL */}
      {activeModal === "win-back" && (
        <div className="bg-surface-container-lowest rounded-2xl max-w-xl w-full p-6 shadow-xl border border-surface-container flex flex-col gap-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              </span>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  45+ Day Win-Back Campaign Approval
                </h3>
                <span className="font-body-sm text-body-sm text-secondary">
                  18 lapsed returning clients • Direct SMS &amp; Email Gateway
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2">
            <span className="font-label-sm text-label-sm text-primary uppercase font-bold">
              Personalized SMS &amp; Email Voucher Copy
            </span>
            <p className="font-body-md text-body-md text-on-surface leading-relaxed">
              “Hi &#123;First_Name&#125;, we miss seeing you at <strong>Lumina Haven</strong>! Because it’s been a little while since your last appointment, Elena reserved a special{" "}
              <strong className="text-primary">15% OFF ‘We Miss You’ Voucher</strong> for your next visit—valid for the next 10 days. Tap here to claim &amp; book: luminahaven.com/vip15”
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface font-semibold">
                Recipient Preview (18 Verified Lapsed Clients)
              </span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigate("customers", "inactive");
                }}
                className="font-label-sm text-label-sm text-primary hover:underline"
              >
                Inspect full segment →
              </button>
            </div>
            <div className="max-h-36 overflow-y-auto divide-y divide-surface-container border border-surface-container rounded-xl px-3">
              {inactiveCustomers.map((c) => (
                <div key={c.id} className="py-2 flex items-center justify-between text-body-sm">
                  <div>
                    <span className="font-semibold text-on-surface">{c.name}</span>{" "}
                    <span className="text-secondary">· {c.lastService}</span>
                  </div>
                  <span className="text-amber-700 font-medium tabular-nums">
                    {c.lastVisitDaysAgo}d since visit
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-container-low text-secondary font-label-md"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirmWinBack();
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg font-semibold flex items-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>
                {winBackSent ? "Resend Win-Back Campaign (18)" : "Approve & Send to 18 Clients"}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* 3. PREVIEW POST / PROMOTE TODAY MODAL */}
      {activeModal === "preview-post" && (
        <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-xl border border-surface-container flex flex-col gap-4 relative">
          <div className="flex items-center justify-between">
            <div>
              <span className="px-2 py-0.5 rounded-full bg-primary-container/15 text-primary font-label-sm font-semibold">
                Ready to Publish • 2 Channels
              </span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1">
                Spring Refresh Promotion — Hydra-Glow Facial
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-[#25005a] via-[#630ed4] to-[#7c3aed] text-white p-5 flex flex-col justify-between h-40">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-label-sm">
                INSTAGRAM &amp; FACEBOOK CAROUSEL
              </span>
              <span className="font-label-sm text-white/80">@luminahaven</span>
            </div>
            <div>
              <h4 className="font-headline-md text-headline-md font-bold">
                Hydra-Glow Botanical Facial • $145
              </h4>
              <p className="font-body-sm text-white/90 mt-0.5">
                Includes 2x VIP Loyalty Points + Complimentary Peptide Booster
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-sm text-label-sm text-secondary">
              AI-Generated Caption &amp; Carousel Tags (Editable)
            </label>
            <textarea
              rows={3}
              value={promoCaption}
              onChange={(e) => setPromoCaption(e.target.value)}
              className="w-full p-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-body-md text-on-surface focus:outline-none focus:border-primary-container"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-container-low text-secondary font-label-md"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onPublishPromo(promoCaption);
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg font-semibold flex items-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
              <span>Publish to Instagram &amp; Facebook</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. QUICK ACTION LAUNCHER MODAL */}
      {activeModal === "quick-action" && (
        <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-xl border border-surface-container flex flex-col gap-4 relative">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Execute Quick Growth Action
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigate("customers");
              }}
              className="p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-left flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">person_add</span>
                <div>
                  <span className="font-label-lg text-on-surface block">
                    Check In Client &amp; Award Points
                  </span>
                  <span className="font-body-sm text-secondary">
                    Add +50 loyalty points at reception
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-secondary">chevron_right</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigate("reviews");
              }}
              className="p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-left flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-amber-500 fill-1">star</span>
                <div>
                  <span className="font-label-lg text-on-surface block">
                    Send 14 Pending Review Invites
                  </span>
                  <span className="font-body-sm text-secondary">
                    SMS deep-link optimized for 5★ Google ratings
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-secondary">chevron_right</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigate("loyalty-and-rewards");
              }}
              className="p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-left flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-tertiary">card_giftcard</span>
                <div>
                  <span className="font-label-lg text-on-surface block">
                    Configure New Loyalty Reward
                  </span>
                  <span className="font-body-sm text-secondary">
                    Add a custom salon perk or voucher tier
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-secondary">chevron_right</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. AI ASSISTANT COMPANION MODAL */}
      {activeModal === "ai-assistant" && (
        <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-xl border border-surface-container flex flex-col gap-4 relative">
          <div className="flex items-center justify-between border-b border-surface-container pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">smart_toy</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">
                    AdVantage AI™ Growth Assistant
                  </h3>
                  <span className="px-1.5 py-0.5 rounded bg-primary-container/15 text-primary font-label-sm uppercase font-bold">
                    Beta
                  </span>
                </div>
                <span className="font-body-sm text-secondary">
                  Synced with Lumina Haven POS, Loyalty &amp; Google Reviews
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
            {aiMessages.map((m, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl font-body-md text-body-md ${
                  m.role === "ai"
                    ? "bg-surface-container-low text-on-surface"
                    : "bg-primary-container text-on-primary self-end max-w-[85%]"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              "Why did 18 clients lapse?",
              "Project Weekend Double Points ROI",
              "Boost Google Review rating to 4.95★",
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleAiSend(chip)}
                className="px-2.5 py-1 rounded-full bg-surface-container-high hover:bg-primary-container/15 text-on-surface-variant hover:text-primary font-label-sm transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAiSend();
            }}
            className="flex items-center gap-2 pt-1"
          >
            <input
              type="text"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="Ask about retention, slow chairs, or review automation..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-body-md text-on-surface focus:outline-none focus:border-primary-container"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-label-md font-semibold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>Ask</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
