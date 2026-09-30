/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  LOGO_URL,
  AVATAR_URL,
  NavTab,
  DateRangeKey,
  METRICS_BY_RANGE,
  INITIAL_ACTIVITY_FEED,
  INITIAL_CUSTOMERS,
  INITIAL_REWARDS,
  INITIAL_REVIEWS,
  SALON_SERVICES,
  INITIAL_AUTOMATIONS,
  ActivityFeedItem,
  CustomerRecord,
} from "./data/mockData";
import { LuminaQrSvg, downloadQrPng } from "./components/QrCodeCard";
import {
  CustomersScreen,
  LoyaltyScreen,
  ReviewsScreen,
  MarketingScreen,
  AutomationsScreen,
  InsightsScreen,
  SettingsScreen,
} from "./components/SecondaryScreens";
import { ActionModals, ActiveModalType } from "./components/ActionModals";

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [customerSubFilter, setCustomerSubFilter] = useState<
    "all" | "inactive" | "vip" | "new"
  >("all");

  // Header & Dashboard controls
  const [dateRange, setDateRange] = useState<DateRangeKey>("Last 30 Days");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(true);
  const [setupDismissed, setSetupDismissed] = useState(false);
  const [qrPrinted, setQrPrinted] = useState(false);
  const [primaryGoal, setPrimaryGoal] = useState(
    "Build Customer Loyalty & Repeat Visits"
  );
  const [syncStatusText, setSyncStatusText] = useState("AI synced 4 mins ago");

  // Action states for the 3 Growth Plan cards
  const [card1State, setCard1State] = useState<"idle" | "loading" | "done">("idle");
  const [card2State, setCard2State] = useState<"idle" | "loading" | "done">("idle");
  const [card3State, setCard3State] = useState<"idle" | "done">("idle");
  const [winBackSent, setWinBackSent] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);

  // Shared application state
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>(
    INITIAL_ACTIVITY_FEED
  );
  const [customers, setCustomers] = useState<CustomerRecord[]>(INITIAL_CUSTOMERS);
  const [rewards, setRewards] = useState(INITIAL_REWARDS);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [automations, setAutomations] = useState(INITIAL_AUTOMATIONS);
  const [pendingReviewsCount, setPendingReviewsCount] = useState(14);
  const [activeModal, setActiveModal] = useState<ActiveModalType>(null);

  // Image fallback states
  const [logoError, setLogoError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const currentMetrics = METRICS_BY_RANGE[dateRange];

  const navigateTo = (
    tab: NavTab,
    subFilter: "all" | "inactive" | "vip" | "new" = "all"
  ) => {
    setCustomerSubFilter(subFilter);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handlers for Growth Plan Cards
  const handleLaunchVipDoublePoints = () => {
    if (card1State !== "idle") return;
    setCard1State("loading");
    setTimeout(() => {
      setCard1State("done");
      setActivityFeed((prev) => [
        {
          id: `act-${Date.now()}`,
          type: "campaign",
          title: "VIP Weekend Double Points Launched",
          badge: "38 Returning Clients",
          body: "SMS & Email invitations sent to returning VIP cohort • Projected +$1,420 revenue",
          verified: true,
          timeAgo: "Just now",
        },
        ...prev,
      ]);
    }, 900);
  };

  const handleSendPendingReviewRequests = () => {
    if (card2State === "loading" || pendingReviewsCount === 0) return;
    setCard2State("loading");
    setTimeout(() => {
      setCard2State("done");
      setPendingReviewsCount(0);
      setActivityFeed((prev) => [
        {
          id: `act-${Date.now()}`,
          type: "review",
          title: "14 Review Requests Dispatched",
          subtitle: "SMS Gateway",
          body: "Personalized 5-star Google review links sent to 14 recent clients",
          verified: true,
          timeAgo: "Just now",
        },
        ...prev,
      ]);
    }, 900);
  };

  const handleApproveMarcusReply = (feedId: string) => {
    setActivityFeed((prev) =>
      prev.map((item) =>
        item.id === feedId ? { ...item, replyApproved: true } : item
      )
    );
    setReviews((prev) =>
      prev.map((r) =>
        r.id === "rev-1"
          ? { ...r, status: "Replied", publishedReply: r.aiDraftReply }
          : r
      )
    );
  };

  const handleConfirmWinBack = () => {
    setWinBackSent(true);
    setActivityFeed((prev) => [
      {
        id: `act-${Date.now()}`,
        type: "campaign",
        title: "Win-Back Campaign Sent (18 Clients)",
        badge: "15% Off Voucher",
        body: "‘We Miss You’ 10-day voucher delivered via Direct SMS & Email to 18 lapsed guests",
        verified: true,
        timeAgo: "Just now",
      },
      ...prev,
    ]);
  };

  const handlePublishPromo = (captionText: string) => {
    setCard3State("done");
    setActivityFeed((prev) => [
      {
        id: `act-${Date.now()}`,
        type: "marketing",
        title: "Spring Refresh Promotion Published",
        subtitle: "@luminahaven + FB",
        body: `‘Hydra-Glow Facial’ live on Instagram & Facebook • "${captionText.slice(
          0,
          58
        )}..."`,
        timeAgo: "Just now",
      },
      ...prev,
    ]);
  };

  const handleTriggerSync = () => {
    setSyncStatusText("Syncing POS & Channels...");
    setTimeout(() => {
      setSyncStatusText("AI synced just now");
    }, 600);
  };

  const navItems: { id: NavTab; label: string; icon: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: "grid_view" },
    { id: "customers", label: "Customers", icon: "group" },
    { id: "loyalty-and-rewards", label: "Loyalty & Rewards", icon: "card_giftcard" },
    { id: "reviews", label: "Reviews", icon: "star" },
    { id: "marketing", label: "Marketing", icon: "campaign" },
    { id: "automations", label: "Automations", icon: "bolt" },
    { id: "insights", label: "Insights", icon: "bar_chart" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];

  const headerTitleMap: Record<NavTab, string> = {
    dashboard: "Dashboard",
    customers: "Customers",
    "loyalty-and-rewards": "Loyalty & Rewards",
    reviews: "Reviews",
    marketing: "Marketing",
    automations: "Automations",
    insights: "Insights",
    settings: "Settings",
  };

  const inactiveCustomers = customers.filter(
    (c) => c.status === "Inactive 45+ Days"
  );

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen">
      {/* =====================================================================
          PERSISTENT LEFT SIDEBAR (260px)
      ===================================================================== */}
      <aside className="fixed left-0 top-0 h-full w-[260px] bg-[#0b0f19] border-r border-[#1e293b] z-50 flex flex-col justify-between overflow-y-auto">
        <div className="flex flex-col">
          <div className="px-5 pt-6 pb-5 border-b border-[#1e293b]">
            <button
              type="button"
              onClick={() => navigateTo("dashboard")}
              className="flex items-center gap-3 text-left w-full"
            >
              {!logoError ? (
                <img
                  alt="AdVantage AI Logo"
                  className="h-8 w-auto object-contain"
                  referrerPolicy="no-referrer"
                  src={LOGO_URL}
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold">
                  A
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-white font-headline-sm text-headline-sm font-bold tracking-tight leading-tight">
                  AdVantage AI™
                </span>
                <span className="text-[#818cf8] font-label-sm text-label-sm tracking-wide leading-none mt-0.5">
                  Powered by Femylabs
                </span>
              </div>
            </button>

            <div className="mt-5 p-3 rounded-lg bg-[#131b2e] border border-[#1e293b] flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary font-headline-sm text-headline-sm flex items-center justify-center shrink-0 font-bold shadow-sm">
                  LH
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-white font-label-lg text-label-lg truncate leading-tight">
                    Lumina Haven
                  </span>
                  <span className="text-secondary-fixed-dim font-body-sm text-body-sm truncate">
                    Salon &amp; Spa
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm shrink-0 font-semibold shadow-sm">
                Growth Plan
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-4 flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigateTo(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={
                    isActive
                      ? "flex items-center gap-3 px-3 py-2.5 transition-all bg-primary-container text-on-primary font-label-lg text-label-lg font-bold rounded-lg shadow-sm w-full text-left"
                      : "flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary-fixed-dim hover:bg-[#1e293b] hover:text-white transition-all font-label-lg text-label-lg w-full text-left"
                  }
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom AI Assistant Companion & Support */}
        <div className="p-3 flex flex-col gap-3">
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#1a142e] to-[#0f172a] border border-[#3b2d6b] shadow-lg flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-primary-container text-on-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px]">
                    smart_toy
                  </span>
                </div>
                <span className="text-white font-label-md text-label-md font-semibold">
                  AI Assistant
                </span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-primary-container/40 border border-primary-container text-primary-fixed-dim font-label-sm text-label-sm uppercase font-bold tracking-wider">
                Beta
              </span>
            </div>
            <p className="text-secondary-fixed-dim font-body-sm text-body-sm leading-snug">
              Ask about growth, automated actions &amp; retention campaigns.
            </p>
            <button
              onClick={() => setActiveModal("ai-assistant")}
              className="w-full py-1.5 px-3 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-sm text-label-sm font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">
                auto_awesome
              </span>
              <span>Ask AI</span>
            </button>
          </div>

          <div className="pt-2 border-t border-[#1e293b] flex items-center justify-between px-1">
            <button
              type="button"
              onClick={() => setActiveModal("ai-assistant")}
              className="flex items-center gap-2 text-secondary-fixed-dim hover:text-white font-label-md text-label-md transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">help</span>
              <span>Help &amp; Support</span>
            </button>
            <button
              aria-label="Account Settings"
              onClick={() => navigateTo("settings")}
              className="p-1 text-secondary-fixed-dim hover:text-white rounded hover:bg-[#1e293b] transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                logout
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* =====================================================================
          MAIN VIEWPORT CONTAINER
      ===================================================================== */}
      <div className="pl-[260px] min-h-screen flex flex-col">
        {/* TOP HEADER */}
        <header className="fixed top-0 left-[260px] right-0 h-[70px] bg-surface-container-lowest border-b border-surface-container shadow-[0_1px_8px_rgba(0,0,0,0.03)] z-40 flex items-center justify-between px-8">
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                {headerTitleMap[activeTab]}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                Live Preview
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-tight mt-0.5">
              Here is what is happening with your business today.
            </p>
          </div>

          <div className="flex items-center gap-3.5 relative">
            {/* Date Range Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDateDropdown(!showDateDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-lowest border border-outline-variant hover:border-outline rounded-lg text-on-surface font-label-md text-label-md transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary">
                  calendar_today
                </span>
                <span>{dateRange}</span>
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  expand_more
                </span>
              </button>
              {showDateDropdown && (
                <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-surface-container-lowest border border-surface-container shadow-lg py-1 z-50">
                  {(
                    [
                      "Last 7 Days",
                      "Last 30 Days",
                      "This Quarter",
                      "Year to Date",
                    ] as DateRangeKey[]
                  ).map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => {
                        setDateRange(range);
                        setShowDateDropdown(false);
                      }}
                      className={`w-full px-3.5 py-2 text-left font-label-md flex items-center justify-between hover:bg-surface-container-low ${
                        dateRange === range
                          ? "text-primary font-semibold bg-primary-container/5"
                          : "text-on-surface"
                      }`}
                    >
                      <span>{range}</span>
                      {dateRange === range && (
                        <span className="material-symbols-outlined text-[15px]">
                          check
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Verified Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-fixed opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary-container"></span>
              </span>
              <span className="font-label-sm text-label-sm text-tertiary font-semibold">
                All systems verified
              </span>
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                aria-label="Notifications"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setUnreadNotifications(false);
                }}
                className="relative p-2 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">
                  notifications
                </span>
                {unreadNotifications && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xl p-4 z-50 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between border-b border-surface-container pb-2">
                    <span className="font-label-lg text-on-surface font-semibold">
                      System Alerts
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                      className="text-secondary hover:text-on-surface font-label-sm"
                    >
                      Close
                    </button>
                  </div>
                  <div className="text-body-sm text-on-surface bg-surface-container-low p-2.5 rounded-lg">
                    <strong className="text-primary block">
                      ★ New 5-Star Google Review
                    </strong>
                    Marcus Thorne left a 5★ review 12m ago. AI reply draft is ready.
                  </div>
                  <div className="text-body-sm text-on-surface bg-surface-container-low p-2.5 rounded-lg">
                    <strong className="text-tertiary block">
                      ✓ 18 Win-Back Clients Identified
                    </strong>
                    ‘We Miss You’ 15% off voucher queued for single-click approval.
                  </div>
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-surface-container mx-0.5"></div>

            {/* Owner Profile */}
            <button
              type="button"
              onClick={() => navigateTo("settings")}
              className="flex items-center gap-2.5 pl-1 text-left hover:opacity-90 transition-opacity"
            >
              {!avatarError ? (
                <img
                  alt="Elena Vance Profile"
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-outline-variant"
                  referrerPolicy="no-referrer"
                  src={AVATAR_URL}
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary font-label-md font-bold flex items-center justify-center">
                  EV
                </div>
              )}
              <div className="flex flex-col text-left">
                <span className="font-label-md text-label-md font-semibold text-on-surface leading-tight">
                  Elena Vance
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant leading-none">
                  Owner
                </span>
              </div>
            </button>
          </div>
        </header>

        {/* ===================================================================
            MAIN CONTENT AREA
        =================================================================== */}
        <main className="relative pt-[70px] w-full p-8 bg-surface flex-1">
          {activeTab === "dashboard" && (
            <div className="flex flex-col w-full gap-6">
              {/* 1. Personalized Greeting & Context Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2.5">
                    <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                      Good morning, Elena 👋
                    </h1>
                  </div>
                  <p className="font-body-md text-body-md text-secondary mt-1 flex items-center gap-1.5 flex-wrap">
                    <span>
                      Here&apos;s what&apos;s happening with{" "}
                      <strong className="text-on-surface font-semibold">
                        Lumina Haven
                      </strong>{" "}
                      today.
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[14px] text-primary">
                        target
                      </span>
                      #1 Goal: {primaryGoal}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-3 self-start lg:self-center shrink-0">
                  <button
                    type="button"
                    onClick={handleTriggerSync}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-secondary font-label-sm text-label-sm transition-colors"
                  >
                    <span
                      className="material-symbols-outlined text-[15px] text-primary animate-spin"
                      style={{ animationDuration: "4s" }}
                    >
                      autorenew
                    </span>
                    <span>{syncStatusText}</span>
                  </button>
                  <button
                    onClick={() => setActiveModal("preview-post")}
                    className="group relative px-4 py-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg shadow-sm transition-all flex items-center gap-2 active:scale-[0.98]"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      bolt
                    </span>
                    <span>Promote Today</span>
                  </button>
                  <button
                    onClick={() => setActiveModal("quick-action")}
                    className="px-3.5 py-2 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container font-label-lg text-label-lg shadow-sm transition-colors flex items-center gap-1.5"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary">
                      add
                    </span>
                    <span>Quick Action</span>
                  </button>
                </div>
              </div>

              {/* 2. Dismissible Fast-Track Setup Progress Checklist */}
              {!setupDismissed && (
                <div
                  className="w-full rounded-xl bg-surface-container-lowest shadow-sm p-5 relative overflow-hidden transition-all duration-300"
                  id="setup-banner"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-container"></div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-secondary-container text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[22px]">
                          rocket_launch
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h2 className="font-headline-sm text-headline-sm text-on-surface">
                            Fast-Track Setup:{" "}
                            {qrPrinted ? "4 of 4" : "3 of 4"} Growth Engines
                            Active
                          </h2>
                          <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
                            {qrPrinted ? "100% Complete" : "75% Complete"}
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-secondary mt-0.5">
                          Activate in-store QR displays to double returning
                          client acquisition this week.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        aria-label="Dismiss setup guide"
                        className="p-1.5 text-secondary hover:text-on-surface rounded-lg hover:bg-surface-container-low transition-colors"
                        onClick={() => setSetupDismissed(true)}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          close
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Stepper Pipeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 bg-surface-container-low/50 rounded-xl p-3">
                    <div className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-container-lowest">
                      <div className="w-6 h-6 rounded-full bg-tertiary-container text-on-tertiary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[15px]">
                          check
                        </span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-md text-label-md text-on-surface truncate font-semibold">
                          1. Business Profile
                        </span>
                        <span className="font-body-sm text-body-sm text-tertiary font-medium">
                          Completed
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-container-lowest">
                      <div className="w-6 h-6 rounded-full bg-tertiary-container text-on-tertiary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[15px]">
                          check
                        </span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-md text-label-md text-on-surface truncate font-semibold">
                          2. Products &amp; Services
                        </span>
                        <span className="font-body-sm text-body-sm text-tertiary font-medium">
                          8 Services synced
                        </span>
                      </div>
                    </div>

                    <div
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        qrPrinted
                          ? "bg-surface-container-lowest"
                          : "bg-primary-container/10"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {qrPrinted ? (
                          <div className="w-6 h-6 rounded-full bg-tertiary-container text-on-tertiary flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[15px]">
                              check
                            </span>
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 text-label-sm font-bold">
                            3
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="font-label-md text-label-md text-on-surface truncate font-semibold">
                            Loyalty QR Code
                          </span>
                          <span
                            className={`font-body-sm text-body-sm font-semibold ${
                              qrPrinted ? "text-tertiary" : "text-primary"
                            }`}
                          >
                            {qrPrinted ? "Stand Active" : "Action needed"}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveModal("qr-stand")}
                        className="px-2 py-1 rounded bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold shrink-0 hover:bg-primary transition-colors"
                        type="button"
                      >
                        {qrPrinted ? "View QR" : "Print QR"}
                      </button>
                    </div>

                    <div className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-container-lowest">
                      <div className="w-6 h-6 rounded-full bg-tertiary-container text-on-tertiary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[15px]">
                          check
                        </span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-md text-label-md text-on-surface truncate font-semibold">
                          4. Google Reviews
                        </span>
                        <span className="font-body-sm text-body-sm text-tertiary font-medium">
                          Connected (4.9★)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. "Your AI Growth Plan" (3 Priority Action Cards) */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">
                        auto_awesome
                      </span>
                    </div>
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">
                        Your AI Growth Plan
                      </h2>
                      <p className="font-body-sm text-body-sm text-secondary">
                        3 high-impact actions generated from your business goals
                      </p>
                    </div>
                  </div>
                  <span className="font-label-sm text-label-sm text-secondary">
                    Updated real-time by AdVantage AI™ Engine
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Growth Card 1 */}
                  <div className="relative bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-container"></div>
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-primary-container/10 text-primary font-label-sm text-label-sm font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                          Primary Goal
                        </span>
                        <span className="font-label-sm text-label-sm text-secondary">
                          Retain &amp; Loyalty
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">
                        Launch VIP Weekend Double Points
                      </h3>
                      <p className="font-body-md text-body-md text-secondary mt-2">
                        Drive repeat visits from your 38 returning customers
                        this weekend. AI calculated a projected $1,420 net
                        revenue bump.
                      </p>
                    </div>
                    <div className="mt-5 pt-4 bg-surface-container-low/40 -mx-5 -mb-5 px-5 pb-5 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-tertiary font-label-sm text-label-sm font-semibold">
                        <span className="material-symbols-outlined text-[16px]">
                          trending_up
                        </span>
                        +22% projected visits
                      </div>
                      <button
                        onClick={handleLaunchVipDoublePoints}
                        className={`px-3.5 py-1.5 rounded-lg text-on-primary font-label-sm text-label-sm font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                          card1State === "done"
                            ? "bg-tertiary-container"
                            : "bg-primary-container hover:bg-primary"
                        }`}
                        type="button"
                      >
                        {card1State === "loading" && (
                          <>
                            <span className="material-symbols-outlined text-[14px] animate-spin">
                              sync
                            </span>
                            <span>In Progress...</span>
                          </>
                        )}
                        {card1State === "done" && (
                          <>
                            <span className="material-symbols-outlined text-[14px]">
                              check
                            </span>
                            <span>Complete</span>
                          </>
                        )}
                        {card1State === "idle" && (
                          <>
                            <span>Launch Offer</span>
                            <span className="material-symbols-outlined text-[14px]">
                              arrow_forward
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Growth Card 2 */}
                  <div className="relative bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary"></div>
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                          High Impact
                        </span>
                        <span className="font-label-sm text-label-sm text-secondary">
                          Reviews
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">
                        Send {pendingReviewsCount || 14} Pending Review Requests
                      </h3>
                      <p className="font-body-md text-body-md text-secondary mt-2">
                        14 recent clients haven&apos;t been asked for feedback
                        yet. AI drafted personal SMS invites optimized for
                        5-star Google ratings.
                      </p>
                    </div>
                    <div className="mt-5 pt-4 bg-surface-container-low/40 -mx-5 -mb-5 px-5 pb-5 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-secondary font-label-sm text-label-sm">
                        <span className="material-symbols-outlined text-[16px] text-amber-500 fill-1">
                          star
                        </span>
                        Target: 4.95 Rating
                      </div>
                      <button
                        onClick={handleSendPendingReviewRequests}
                        className={`px-3.5 py-1.5 rounded-lg font-label-sm text-label-sm font-semibold flex items-center gap-1.5 transition-colors ${
                          card2State === "done"
                            ? "bg-tertiary-container text-on-tertiary"
                            : "bg-surface-container-high hover:bg-surface-container-highest text-on-surface"
                        }`}
                        type="button"
                      >
                        {card2State === "loading" && (
                          <>
                            <span className="material-symbols-outlined text-[14px] animate-spin">
                              sync
                            </span>
                            <span>In Progress...</span>
                          </>
                        )}
                        {card2State === "done" && (
                          <>
                            <span className="material-symbols-outlined text-[14px]">
                              check
                            </span>
                            <span>Complete</span>
                          </>
                        )}
                        {card2State === "idle" && (
                          <>
                            <span>Send Requests</span>
                            <span className="material-symbols-outlined text-[14px]">
                              send
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Growth Card 3 */}
                  <div className="relative bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary"></div>
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-semibold">
                          {card3State === "done"
                            ? "Published Live"
                            : "Ready to Publish"}
                        </span>
                        <span className="font-label-sm text-label-sm text-secondary">
                          Attract &amp; Social
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">
                        Publish Spring Refresh Promotion
                      </h3>
                      <p className="font-body-md text-body-md text-secondary mt-2">
                        Promote your featured &apos;Hydra-Glow Facial&apos;
                        service on Instagram &amp; Facebook. AI generated custom
                        copy and carousel tags.
                      </p>
                    </div>
                    <div className="mt-5 pt-4 bg-surface-container-low/40 -mx-5 -mb-5 px-5 pb-5 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-secondary font-label-sm text-label-sm">
                        <span className="material-symbols-outlined text-[16px] text-primary">
                          photo_camera
                        </span>
                        2 Channels Ready
                      </div>
                      <button
                        onClick={() => setActiveModal("preview-post")}
                        className={`px-3.5 py-1.5 rounded-lg font-label-sm text-label-sm font-semibold flex items-center gap-1.5 transition-colors ${
                          card3State === "done"
                            ? "bg-tertiary-container text-on-tertiary"
                            : "bg-surface-container-high hover:bg-surface-container-highest text-on-surface"
                        }`}
                        type="button"
                      >
                        <span>
                          {card3State === "done"
                            ? "Published"
                            : "Preview Post"}
                        </span>
                        <span className="material-symbols-outlined text-[14px]">
                          {card3State === "done" ? "check" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. System-Verified Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Metric 1 */}
                <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-secondary font-medium">
                      New Customers
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-fixed/30 text-tertiary font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[12px]">
                        verified
                      </span>
                      Verified
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-display-lg text-display-lg text-on-surface font-bold tracking-tight tabular-nums">
                      {currentMetrics.newCustomers.count}
                    </span>
                    <span className="font-body-sm text-body-sm text-secondary">
                      {currentMetrics.newCustomers.periodLabel}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 flex items-center justify-between bg-surface-container-low/50 rounded-lg px-2.5 py-1.5">
                    <span className="inline-flex items-center text-tertiary font-label-sm text-label-sm font-bold gap-0.5 tabular-nums">
                      <span className="material-symbols-outlined text-[15px]">
                        arrow_upward
                      </span>
                      {currentMetrics.newCustomers.delta}
                    </span>
                    <span className="font-body-sm text-body-sm text-secondary truncate">
                      {currentMetrics.newCustomers.source}
                    </span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-secondary font-medium">
                      5-Star Reviews
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-fixed/30 text-tertiary font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[12px]">
                        verified
                      </span>
                      Google Sync
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-display-lg text-display-lg text-on-surface font-bold tracking-tight tabular-nums">
                      {currentMetrics.fiveStarReviews.count}
                    </span>
                    <div className="flex items-center text-amber-500 font-label-lg text-label-lg font-bold gap-0.5 tabular-nums">
                      <span>{currentMetrics.fiveStarReviews.rating}</span>
                      <span className="material-symbols-outlined text-[16px] fill-1">
                        star
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 flex items-center justify-between bg-surface-container-low/50 rounded-lg px-2.5 py-1.5">
                    <span className="inline-flex items-center text-tertiary font-label-sm text-label-sm font-bold gap-0.5 tabular-nums">
                      <span className="material-symbols-outlined text-[15px]">
                        arrow_upward
                      </span>
                      {currentMetrics.fiveStarReviews.delta}
                    </span>
                    <span className="font-body-sm text-body-sm text-secondary">
                      {currentMetrics.fiveStarReviews.subLabel}
                    </span>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-secondary font-medium">
                      Rewards Redeemed
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-fixed/30 text-tertiary font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[12px]">
                        verified
                      </span>
                      Loyalty Hub
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-display-lg text-display-lg text-on-surface font-bold tracking-tight tabular-nums">
                      {currentMetrics.rewardsRedeemed.count}
                    </span>
                    <span className="font-body-sm text-body-sm text-secondary">
                      perks redeemed
                    </span>
                  </div>
                  <div className="mt-3 pt-3 flex items-center justify-between bg-surface-container-low/50 rounded-lg px-2.5 py-1.5">
                    <span className="inline-flex items-center text-tertiary font-label-sm text-label-sm font-bold gap-0.5 tabular-nums">
                      <span className="material-symbols-outlined text-[15px]">
                        arrow_upward
                      </span>
                      {currentMetrics.rewardsRedeemed.delta}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface font-medium truncate tabular-nums">
                      {currentMetrics.rewardsRedeemed.repeatRev}
                    </span>
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-secondary font-medium">
                      Marketing Reach
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-fixed/30 text-tertiary font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[12px]">
                        verified
                      </span>
                      Live Feed
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-display-lg text-display-lg text-on-surface font-bold tracking-tight tabular-nums">
                      {currentMetrics.marketingReach.impressions}
                    </span>
                    <span className="font-body-sm text-body-sm text-secondary">
                      impressions
                    </span>
                  </div>
                  <div className="mt-3 pt-3 flex items-center justify-between bg-surface-container-low/50 rounded-lg px-2.5 py-1.5">
                    <span className="inline-flex items-center text-primary font-label-sm text-label-sm font-bold gap-0.5 tabular-nums">
                      <span className="material-symbols-outlined text-[15px]">
                        insights
                      </span>
                      {currentMetrics.marketingReach.engagementRate}
                    </span>
                    <span className="font-body-sm text-body-sm text-secondary">
                      engagement rate
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. Two-Column Core Layout (Left 65% / Right 35%) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* LEFT COLUMN (8 of 12 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  {/* Prominent AI Recommendation Banner */}
                  <div className="rounded-2xl bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-secondary-container/30 p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary-container"></div>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[17px]">
                              smart_toy
                            </span>
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-primary-container/15 text-primary font-label-sm text-label-sm font-bold">
                            Goal: Build Customer Loyalty
                          </span>
                        </div>
                        <span className="font-label-sm text-label-sm text-secondary bg-surface-container-lowest px-2.5 py-1 rounded-md shadow-xs">
                          High Probability Win
                        </span>
                      </div>

                      <div>
                        <h3 className="font-headline-md text-headline-md text-on-surface tracking-tight">
                          18 customers haven&apos;t visited in 45+ days — Win
                          them back before they churn
                        </h3>
                        <p className="font-body-md text-body-md text-secondary mt-1.5">
                          AdVantage AI identified clients who previously booked
                          at least 2 services but have lapsed past their normal
                          3-week appointment cadence.
                        </p>
                      </div>

                      {/* Structured Checklist */}
                      <div className="bg-surface-container-lowest/80 rounded-xl p-4 flex flex-col gap-2.5 shadow-xs">
                        <div className="flex items-center gap-2.5 text-on-surface font-body-md text-body-md">
                          <span className="w-5 h-5 rounded-full bg-tertiary-container text-on-tertiary flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[13px]">
                              done
                            </span>
                          </span>
                          <span>
                            <strong>18 clients identified</strong> based on
                            verified visit records &amp; spend tiers
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5 text-on-surface font-body-md text-body-md">
                          <span className="w-5 h-5 rounded-full bg-tertiary-container text-on-tertiary flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[13px]">
                              done
                            </span>
                          </span>
                          <span>
                            AI generated a customized{" "}
                            <strong>
                              &apos;We Miss You&apos; 15% off voucher
                            </strong>{" "}
                            valid for 10 days
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5 text-on-surface font-body-md text-body-md">
                          <span className="w-5 h-5 rounded-full bg-tertiary-container text-on-tertiary flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[13px]">
                              done
                            </span>
                          </span>
                          <span>
                            Channel: <strong>Direct SMS &amp; Email</strong>{" "}
                            queued and ready with a single approval
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 pt-2 flex-wrap">
                        <button
                          onClick={() => setActiveModal("win-back")}
                          className={`px-5 py-2.5 rounded-xl text-on-primary font-label-lg text-label-lg font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-[0.99] ${
                            winBackSent
                              ? "bg-tertiary-container"
                              : "bg-primary-container hover:bg-primary"
                          }`}
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {winBackSent ? "check_circle" : "auto_awesome"}
                          </span>
                          <span>
                            {winBackSent
                              ? "Win-Back Campaign Sent to 18 Clients"
                              : "Review & Send Win-Back Campaign"}
                          </span>
                        </button>
                        <button
                          onClick={() => navigateTo("customers", "inactive")}
                          className="px-4 py-2.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-lg text-label-lg transition-colors"
                          type="button"
                        >
                          View Inactive Segment (18)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Recent Verified Activity Feed */}
                  <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-headline-sm text-headline-sm text-on-surface">
                          Recent Verified Activity
                        </h3>
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-tertiary-fixed/30 text-tertiary font-label-sm text-label-sm font-semibold">
                          <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
                          Live Feed
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAllHistory(!showAllHistory)}
                        className="font-label-sm text-label-sm text-primary hover:underline"
                      >
                        {showAllHistory ? "Show recent" : "View all history"}
                      </button>
                    </div>

                    <div className="flex flex-col gap-3">
                      {activityFeed
                        .slice(0, showAllHistory ? activityFeed.length : 5)
                        .map((item) => {
                          if (item.type === "review") {
                            return (
                              <div
                                key={item.id}
                                className="p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="material-symbols-outlined text-[20px] fill-1">
                                      star
                                    </span>
                                  </div>
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                                        {item.title}
                                      </span>
                                      {item.rating && (
                                        <span className="text-amber-500 font-label-sm text-label-sm flex items-center">
                                          ★★★★★
                                        </span>
                                      )}
                                      {item.subtitle && (
                                        <span className="font-label-sm text-label-sm text-secondary">
                                          {item.subtitle}
                                        </span>
                                      )}
                                    </div>
                                    <p className="font-body-md text-body-md text-on-surface-variant italic mt-0.5">
                                      {item.body}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                      {item.aiDraftReply && (
                                        <span className="px-2 py-0.5 rounded bg-primary-container/10 text-primary font-label-sm text-label-sm font-semibold flex items-center gap-1">
                                          <span className="material-symbols-outlined text-[13px]">
                                            auto_awesome
                                          </span>
                                          {item.replyApproved
                                            ? "AI Reply Published"
                                            : "AI Reply Drafted"}
                                        </span>
                                      )}
                                      <span className="font-body-sm text-body-sm text-secondary">
                                        {item.timeAgo}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                {item.aiDraftReply && (
                                  <button
                                    onClick={() =>
                                      handleApproveMarcusReply(item.id)
                                    }
                                    disabled={item.replyApproved}
                                    className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-semibold shrink-0 self-start sm:self-center transition-colors shadow-xs ${
                                      item.replyApproved
                                        ? "bg-tertiary-container text-on-tertiary"
                                        : "bg-primary-container hover:bg-primary text-on-primary"
                                    }`}
                                    type="button"
                                  >
                                    {item.replyApproved
                                      ? "✓ Replied"
                                      : "Approve Reply"}
                                  </button>
                                )}
                              </div>
                            );
                          }

                          if (item.type === "loyalty") {
                            return (
                              <div
                                key={item.id}
                                className="p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between gap-3"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-secondary-container text-on-secondary-fixed flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="material-symbols-outlined text-[20px]">
                                      card_giftcard
                                    </span>
                                  </div>
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                                        {item.title}
                                      </span>
                                      {item.badge && (
                                        <span className="px-2 py-0.2 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                                          {item.badge}
                                        </span>
                                      )}
                                    </div>
                                    <p className="font-body-md text-body-md text-secondary mt-0.5">
                                      Redeemed{" "}
                                      <strong className="text-on-surface font-medium">
                                        {item.highlightText ??
                                          "‘Free Botanical Scalp Treatment’"}
                                      </strong>{" "}
                                      at register
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right shrink-0">
                                  <span className="font-label-sm text-label-sm text-tertiary font-semibold flex items-center justify-end gap-1">
                                    <span className="material-symbols-outlined text-[14px]">
                                      check_circle
                                    </span>
                                    Verified
                                  </span>
                                  <span className="font-body-sm text-body-sm text-secondary block">
                                    {item.timeAgo}
                                  </span>
                                </div>
                              </div>
                            );
                          }

                          if (item.type === "marketing") {
                            return (
                              <div
                                key={item.id}
                                className="p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between gap-3"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="material-symbols-outlined text-[20px]">
                                      photo_library
                                    </span>
                                  </div>
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                      <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                                        {item.title}
                                      </span>
                                      {item.subtitle && (
                                        <span className="font-label-sm text-label-sm text-secondary">
                                          {item.subtitle}
                                        </span>
                                      )}
                                    </div>
                                    <p className="font-body-md text-body-md text-secondary mt-0.5">
                                      {item.body}
                                      {item.highlightText && (
                                        <span className="text-on-surface font-semibold">
                                          {item.highlightText}
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <span className="font-body-sm text-body-sm text-secondary shrink-0">
                                  {item.timeAgo}
                                </span>
                              </div>
                            );
                          }

                          // join, referral, campaign
                          return (
                            <div
                              key={item.id}
                              className="p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between gap-3"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-xl bg-primary-container/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                                  <span className="material-symbols-outlined text-[20px]">
                                    {item.type === "referral"
                                      ? "group_add"
                                      : item.type === "campaign"
                                      ? "bolt"
                                      : "person_add"}
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                                      {item.title}
                                    </span>
                                    {item.badge && (
                                      <span
                                        className={`px-2 py-0.2 rounded-full font-label-sm text-label-sm ${
                                          item.type === "referral"
                                            ? "bg-secondary-fixed text-on-secondary-fixed"
                                            : "bg-primary-container/15 text-primary"
                                        }`}
                                      >
                                        {item.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="font-body-md text-body-md text-secondary mt-0.5">
                                    {item.body}
                                  </p>
                                </div>
                              </div>
                              <span className="font-body-sm text-body-sm text-secondary shrink-0">
                                {item.timeAgo}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN (4 of 12 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  {/* Goal-Aware Quick Actions Panel */}
                  <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm flex flex-col gap-3">
                    <div className="flex items-center justify-between pb-1">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">
                        Quick Actions
                      </h3>
                      <span className="material-symbols-outlined text-[20px] text-secondary">
                        flash_on
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {/* Action 1 */}
                      <button
                        onClick={() => setActiveModal("preview-post")}
                        className="w-full p-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-left flex items-center justify-between transition-colors group"
                        type="button"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary-container/10 text-primary group-hover:bg-primary-container group-hover:text-on-primary transition-colors flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">
                              campaign
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-label-lg text-label-lg text-on-surface font-semibold leading-snug">
                              Promote My Business
                            </span>
                            <span className="font-body-sm text-body-sm text-secondary leading-none">
                              Auto-fill Hydra-Glow Facial
                            </span>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-[18px] text-secondary group-hover:text-primary transition-colors">
                          chevron_right
                        </span>
                      </button>

                      {/* Action 2 */}
                      <button
                        onClick={() => navigateTo("reviews")}
                        className="w-full p-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-left flex items-center justify-between transition-colors group"
                        type="button"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 group-hover:bg-amber-500 group-hover:text-white transition-colors flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px] fill-1">
                              star
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-label-lg text-label-lg text-on-surface font-semibold leading-snug">
                              Request a Review
                            </span>
                            <span className="font-body-sm text-body-sm text-secondary leading-none">
                              Generate SMS / WhatsApp link
                            </span>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-[18px] text-secondary group-hover:text-primary transition-colors">
                          chevron_right
                        </span>
                      </button>

                      {/* Action 3 */}
                      <button
                        onClick={() => navigateTo("loyalty-and-rewards")}
                        className="w-full p-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-left flex items-center justify-between transition-colors group"
                        type="button"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-container group-hover:bg-secondary group-hover:text-white transition-colors flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">
                              redeem
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-label-lg text-label-lg text-on-surface font-semibold leading-snug">
                              Add Loyalty Reward
                            </span>
                            <span className="font-body-sm text-body-sm text-secondary leading-none">
                              Configure new customer perk
                            </span>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-[18px] text-secondary group-hover:text-primary transition-colors">
                          chevron_right
                        </span>
                      </button>

                      {/* Action 4 */}
                      <button
                        onClick={() => navigateTo("marketing")}
                        className="w-full p-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-left flex items-center justify-between transition-colors group"
                        type="button"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">
                              auto_awesome
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-label-lg text-label-lg text-on-surface font-semibold leading-snug">
                              Create an AI Post
                            </span>
                            <span className="font-body-sm text-body-sm text-secondary leading-none">
                              Instant visual &amp; caption draft
                            </span>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-[18px] text-secondary group-hover:text-primary transition-colors">
                          chevron_right
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Connected Channels & Live Status */}
                  <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm flex flex-col gap-3.5">
                    <div className="flex items-center justify-between pb-1">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">
                        Connected Channels
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed/30 text-tertiary font-label-sm text-label-sm font-semibold">
                        4 / 4 Live
                      </span>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center font-bold text-red-500">
                            G
                          </div>
                          <div className="flex flex-col">
                            <span className="font-label-md text-label-md text-on-surface font-semibold">
                              Google Business Profile
                            </span>
                            <span className="font-body-sm text-body-sm text-secondary">
                              Syncing reviews &amp; ratings
                            </span>
                          </div>
                        </div>
                        <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container"></span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white flex items-center justify-center text-[12px] font-bold">
                            IG
                          </div>
                          <div className="flex flex-col">
                            <span className="font-label-md text-label-md text-on-surface font-semibold">
                              Instagram Business
                            </span>
                            <span className="font-body-sm text-body-sm text-secondary">
                              @luminahaven
                            </span>
                          </div>
                        </div>
                        <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container"></span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[12px] font-bold">
                            f
                          </div>
                          <div className="flex flex-col">
                            <span className="font-label-md text-label-md text-on-surface font-semibold">
                              Facebook Page
                            </span>
                            <span className="font-body-sm text-body-sm text-secondary">
                              Connected &amp; Posting
                            </span>
                          </div>
                        </div>
                        <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container"></span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-surface-container text-on-surface-variant flex items-center justify-center">
                            <span className="material-symbols-outlined text-[16px]">
                              sms
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-label-md text-label-md text-on-surface font-semibold">
                              Email &amp; SMS Gateway
                            </span>
                            <span className="font-body-sm text-body-sm text-secondary">
                              100% Deliverability score
                            </span>
                          </div>
                        </div>
                        <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container"></span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigateTo("settings")}
                      className="font-label-sm text-label-sm text-primary hover:underline flex items-center gap-1 pt-1 justify-end"
                    >
                      <span>Manage Channels in Settings</span>
                      <span className="material-symbols-outlined text-[14px]">
                        arrow_forward
                      </span>
                    </button>
                  </div>

                  {/* Live QR Code Mini-Card */}
                  <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm flex flex-col items-center text-center">
                    <div className="flex items-center justify-between w-full mb-3">
                      <span className="font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-wider">
                        In-Store Growth Tool
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
                        Front Desk
                      </span>
                    </div>
                    <div className="relative p-3 rounded-2xl bg-surface-container-low shadow-inner">
                      <LuminaQrSvg className="w-36 h-36" />
                    </div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface mt-3">
                      Scan to Join &amp; Review
                    </h4>
                    <p className="font-body-sm text-body-sm text-secondary mt-0.5">
                      Dual-action QR route: automatically prompts review after
                      loyalty punch.
                    </p>
                    <div className="grid grid-cols-2 gap-2 w-full mt-4">
                      <button
                        onClick={() =>
                          downloadQrPng(() => setQrPrinted(true))
                        }
                        className="py-2 px-3 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-sm text-label-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          download
                        </span>
                        <span>Download PNG</span>
                      </button>
                      <button
                        onClick={() => setActiveModal("qr-stand")}
                        className="py-2 px-3 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-sm text-label-sm font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          print
                        </span>
                        <span>Print Stand</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "customers" && (
            <CustomersScreen
              customers={customers}
              initialFilter={customerSubFilter}
              winBackSent={winBackSent}
              onSendWinBack={() => setActiveModal("win-back")}
              onAddPoints={(id, pts) => {
                setCustomers((prev) =>
                  prev.map((c) =>
                    c.id === id
                      ? {
                          ...c,
                          points: c.points + pts,
                          totalVisits: c.totalVisits + 1,
                          lastVisitDaysAgo: 0,
                          status: "Active",
                        }
                      : c
                  )
                );
              }}
              onAddCustomer={(newCust) => {
                const created: CustomerRecord = {
                  ...newCust,
                  id: `cust-${Date.now()}`,
                };
                setCustomers((prev) => [created, ...prev]);
                setActivityFeed((prev) => [
                  {
                    id: `act-${Date.now()}`,
                    type: "join",
                    title: created.name,
                    badge: "New Member",
                    body: `Joined VIP Loyalty Program (${created.lastService})`,
                    timeAgo: "Just now",
                  },
                  ...prev,
                ]);
              }}
            />
          )}

          {activeTab === "loyalty-and-rewards" && (
            <LoyaltyScreen
              rewards={rewards}
              onOpenQrModal={() => setActiveModal("qr-stand")}
              onRedeemReward={(rewardId) => {
                const target = rewards.find((r) => r.id === rewardId);
                setRewards((prev) =>
                  prev.map((r) =>
                    r.id === rewardId
                      ? { ...r, redemptionsCount: r.redemptionsCount + 1 }
                      : r
                  )
                );
                if (target) {
                  setActivityFeed((prev) => [
                    {
                      id: `act-${Date.now()}`,
                      type: "loyalty",
                      title: "VIP Register Check-In",
                      badge: `${target.pointsCost} pts`,
                      body: `Redeemed ‘${target.title}’ at register`,
                      highlightText: `‘${target.title}’`,
                      verified: true,
                      timeAgo: "Just now",
                    },
                    ...prev,
                  ]);
                }
              }}
              onAddReward={(title, pointsCost, description) => {
                setRewards((prev) => [
                  {
                    id: `rew-${Date.now()}`,
                    title,
                    pointsCost,
                    category: "Service Perk",
                    redemptionsCount: 0,
                    revenueImpact: "Active Perk",
                    active: true,
                    description,
                  },
                  ...prev,
                ]);
              }}
            />
          )}

          {activeTab === "reviews" && (
            <ReviewsScreen
              reviews={reviews}
              pendingRequestsCount={pendingReviewsCount}
              onSendPendingRequests={handleSendPendingReviewRequests}
              onApproveReply={(reviewId, customReply) => {
                setReviews((prev) =>
                  prev.map((r) =>
                    r.id === reviewId
                      ? {
                          ...r,
                          status: "Replied",
                          publishedReply: customReply,
                        }
                      : r
                  )
                );
                if (reviewId === "rev-1") {
                  setActivityFeed((prev) =>
                    prev.map((item) =>
                      item.id === "act-1"
                        ? { ...item, replyApproved: true }
                        : item
                    )
                  );
                }
              }}
            />
          )}

          {activeTab === "marketing" && (
            <MarketingScreen
              services={SALON_SERVICES}
              onPublishPost={(serviceName, caption) => {
                handlePublishPromo(`${serviceName}: ${caption}`);
              }}
            />
          )}

          {activeTab === "automations" && (
            <AutomationsScreen
              automations={automations}
              onToggleAutomation={(id) => {
                setAutomations((prev) =>
                  prev.map((a) =>
                    a.id === id ? { ...a, active: !a.active } : a
                  )
                );
              }}
            />
          )}

          {activeTab === "insights" && (
            <InsightsScreen services={SALON_SERVICES} />
          )}

          {activeTab === "settings" && (
            <SettingsScreen
              primaryGoal={primaryGoal}
              onChangeGoal={setPrimaryGoal}
            />
          )}
        </main>
      </div>

      {/* =====================================================================
          INTERACTIVE MODALS & DRAWERS
      ===================================================================== */}
      <ActionModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        qrActivated={qrPrinted}
        onActivateQr={() => setQrPrinted(true)}
        winBackSent={winBackSent}
        onConfirmWinBack={handleConfirmWinBack}
        onPublishPromo={handlePublishPromo}
        inactiveCustomers={inactiveCustomers}
        onNavigate={navigateTo}
      />
    </div>
  );
}
