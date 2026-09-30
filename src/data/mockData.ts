export const LOGO_URL =
  "https://lh3.googleusercontent.com/aida/AEtjO1XsgpnxVbXQakKKtzAKZRuFyBbhNs6ENI6DKnNY4-7vh9HE4xD72Ylb_v2OB5YqMtlsJogywGks_RLu7NncZHPW5KrCYul-KE7T0FC0Qd1SeGZ4Ptu_0aDTMAVQrP4vTM8P09dTBUE8t7nfrpdPx1cMCPgqJdv8dlQZVMpGsz_huA9x4w011Cr6Cip8_o4zAz-29IyzyrcCKB0ffktbfCVNpfplUUu4UA81OwJLDcmyP8paz2vY1skkB7E";

export const AVATAR_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD1b8-aTjMWe3V9hV_uRhuIKsLq8HsRr-mqdTTavPzkNQ6jVpZWSTsSJ-unw5KHW7TamST6McrjnES5lLgv2I7pxSaUdoNgt39FFurxu3Z7PQkEQlQs-ybESg9ASqShv-KEzyjYcukBDdT1m6hRufMkA-hg4xcM6cg5sb8-Hun55KinbITqdL5pwYWLwUpsSoUFvoeUcxZONvqWXZISyceOGFLXZKIjLp2a7Cj40TDQbBQUSjccxhtN";

export type NavTab =
  | "dashboard"
  | "customers"
  | "loyalty-and-rewards"
  | "reviews"
  | "marketing"
  | "automations"
  | "insights"
  | "settings";

export type DateRangeKey = "Last 7 Days" | "Last 30 Days" | "This Quarter" | "Year to Date";

export interface MetricSet {
  newCustomers: { count: number; periodLabel: string; delta: string; source: string };
  fiveStarReviews: { count: number; rating: string; delta: string; subLabel: string };
  rewardsRedeemed: { count: number; delta: string; repeatRev: string };
  marketingReach: { impressions: string; engagementRate: string };
}

export const METRICS_BY_RANGE: Record<DateRangeKey, MetricSet> = {
  "Last 7 Days": {
    newCustomers: { count: 11, periodLabel: "this week", delta: "+21%", source: "via Booking & QR link" },
    fiveStarReviews: { count: 5, rating: "4.9", delta: "+5", subLabel: "new this week" },
    rewardsRedeemed: { count: 18, delta: "+19%", repeatRev: "$260 repeat rev" },
    marketingReach: { impressions: "940", engagementRate: "4.9%" },
  },
  "Last 30 Days": {
    newCustomers: { count: 42, periodLabel: "this month", delta: "+18%", source: "via Booking & QR link" },
    fiveStarReviews: { count: 28, rating: "4.9", delta: "+5", subLabel: "new this week" },
    rewardsRedeemed: { count: 64, delta: "+24%", repeatRev: "$890 repeat rev" },
    marketingReach: { impressions: "3,420", engagementRate: "4.6%" },
  },
  "This Quarter": {
    newCustomers: { count: 128, periodLabel: "this quarter", delta: "+26%", source: "via Booking & QR link" },
    fiveStarReviews: { count: 84, rating: "4.9", delta: "+19", subLabel: "this quarter" },
    rewardsRedeemed: { count: 192, delta: "+31%", repeatRev: "$2,740 repeat rev" },
    marketingReach: { impressions: "11,280", engagementRate: "4.8%" },
  },
  "Year to Date": {
    newCustomers: { count: 416, periodLabel: "this year", delta: "+34%", source: "via Booking & QR link" },
    fiveStarReviews: { count: 245, rating: "4.9", delta: "+68", subLabel: "this year" },
    rewardsRedeemed: { count: 610, delta: "+29%", repeatRev: "$8,920 repeat rev" },
    marketingReach: { impressions: "38,900", engagementRate: "4.7%" },
  },
};

export interface ActivityFeedItem {
  id: string;
  type: "review" | "loyalty" | "join" | "marketing" | "referral" | "campaign";
  title: string;
  badge?: string;
  subtitle?: string;
  body: string;
  highlightText?: string;
  timeAgo: string;
  rating?: number;
  aiDraftReply?: string;
  replyApproved?: boolean;
  verified?: boolean;
}

export const INITIAL_ACTIVITY_FEED: ActivityFeedItem[] = [
  {
    id: "act-1",
    type: "review",
    title: "Marcus Thorne",
    rating: 5,
    subtitle: "Google Review",
    body: "“Best salon experience in town, Elena and team are wizards!”",
    aiDraftReply:
      "Thank you so much, Marcus! We loved having you in the chair at Lumina Haven. Can't wait to see you for your next cut & style—your 50 bonus loyalty points have been added!",
    replyApproved: false,
    timeAgo: "12m ago",
  },
  {
    id: "act-2",
    type: "loyalty",
    title: "Sophia Chen",
    badge: "250 pts",
    body: "Redeemed ‘Free Botanical Scalp Treatment’ at register",
    highlightText: "‘Free Botanical Scalp Treatment’",
    verified: true,
    timeAgo: "45m ago",
  },
  {
    id: "act-3",
    type: "join",
    title: "David Kim",
    badge: "New Member",
    body: "Joined VIP Loyalty Program via In-Store QR code",
    timeAgo: "2h ago",
  },
  {
    id: "act-4",
    type: "marketing",
    title: "Instagram Post Published",
    subtitle: "@luminahaven",
    body: "‘Spring Renewal Specials’ live to 1,240 followers • ",
    highlightText: "68 likes, 12 saves",
    timeAgo: "4h ago",
  },
  {
    id: "act-5",
    type: "referral",
    title: "Amara Okafor",
    badge: "Invitation",
    body: "Joined via Customer Invitation link (Referred by Sarah Jenkins)",
    timeAgo: "5h ago",
  },
];

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: "Platinum VIP" | "Gold" | "Silver" | "New Member";
  points: number;
  totalVisits: number;
  totalSpend: number;
  lastVisitDaysAgo: number;
  lastService: string;
  status: "Active" | "Inactive 45+ Days" | "At Risk";
  source: "In-Store QR" | "Online Booking" | "Customer Referral" | "Instagram";
}

export const INITIAL_CUSTOMERS: CustomerRecord[] = [
  {
    id: "cust-1",
    name: "Sophia Chen",
    email: "sophia.chen@example.com",
    phone: "(555) 234-8910",
    tier: "Platinum VIP",
    points: 640,
    totalVisits: 14,
    totalSpend: 1890,
    lastVisitDaysAgo: 0,
    lastService: "Botanical Scalp Treatment & Blowout",
    status: "Active",
    source: "Online Booking",
  },
  {
    id: "cust-2",
    name: "Marcus Thorne",
    email: "m.thorne@example.com",
    phone: "(555) 876-5432",
    tier: "Gold",
    points: 410,
    totalVisits: 8,
    totalSpend: 920,
    lastVisitDaysAgo: 1,
    lastService: "Executive Cut & Hot Towel Finish",
    status: "Active",
    source: "In-Store QR",
  },
  {
    id: "cust-3",
    name: "David Kim",
    email: "david.kim@example.com",
    phone: "(555) 391-0021",
    tier: "New Member",
    points: 100,
    totalVisits: 1,
    totalSpend: 145,
    lastVisitDaysAgo: 0,
    lastService: "Hydra-Glow Facial",
    status: "Active",
    source: "In-Store QR",
  },
  {
    id: "cust-4",
    name: "Amara Okafor",
    email: "amara.o@example.com",
    phone: "(555) 612-7741",
    tier: "Silver",
    points: 150,
    totalVisits: 2,
    totalSpend: 280,
    lastVisitDaysAgo: 0,
    lastService: "Signature Balayage & Gloss",
    status: "Active",
    source: "Customer Referral",
  },
  {
    id: "cust-5",
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    phone: "(555) 901-3318",
    tier: "Platinum VIP",
    points: 820,
    totalVisits: 19,
    totalSpend: 2640,
    lastVisitDaysAgo: 9,
    lastService: "Hydra-Glow Facial & Brow Sculpt",
    status: "Active",
    source: "Online Booking",
  },
  {
    id: "cust-6",
    name: "Chloe Lindqvist",
    email: "chloe.l@example.com",
    phone: "(555) 443-1920",
    tier: "Gold",
    points: 320,
    totalVisits: 6,
    totalSpend: 780,
    lastVisitDaysAgo: 48,
    lastService: "Hydra-Glow Facial",
    status: "Inactive 45+ Days",
    source: "Instagram",
  },
  {
    id: "cust-7",
    name: "Hannah Morales",
    email: "hannah.m@example.com",
    phone: "(555) 772-8812",
    tier: "Gold",
    points: 290,
    totalVisits: 5,
    totalSpend: 650,
    lastVisitDaysAgo: 52,
    lastService: "Signature Balayage & Gloss",
    status: "Inactive 45+ Days",
    source: "Online Booking",
  },
  {
    id: "cust-8",
    name: "Natalie Brooks",
    email: "n.brooks@example.com",
    phone: "(555) 318-6549",
    tier: "Silver",
    points: 210,
    totalVisits: 4,
    totalSpend: 520,
    lastVisitDaysAgo: 56,
    lastService: "Botanical Scalp Treatment",
    status: "Inactive 45+ Days",
    source: "In-Store QR",
  },
  {
    id: "cust-9",
    name: "Olivia Sterling",
    email: "olivia.s@example.com",
    phone: "(555) 509-2214",
    tier: "Platinum VIP",
    points: 580,
    totalVisits: 11,
    totalSpend: 1540,
    lastVisitDaysAgo: 61,
    lastService: "Keratin Smoothing Ritual",
    status: "Inactive 45+ Days",
    source: "Online Booking",
  },
  {
    id: "cust-10",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    phone: "(555) 684-1109",
    tier: "Silver",
    points: 180,
    totalVisits: 3,
    totalSpend: 410,
    lastVisitDaysAgo: 47,
    lastService: "Aromatherapy Deep Tissue Massage",
    status: "Inactive 45+ Days",
    source: "Customer Referral",
  },
  {
    id: "cust-11",
    name: "Lauren Gallagher",
    email: "lauren.g@example.com",
    phone: "(555) 290-4412",
    tier: "Gold",
    points: 350,
    totalVisits: 7,
    totalSpend: 890,
    lastVisitDaysAgo: 59,
    lastService: "Hydra-Glow Facial",
    status: "Inactive 45+ Days",
    source: "Instagram",
  },
  {
    id: "cust-12",
    name: "Victoria Chang",
    email: "v.chang@example.com",
    phone: "(555) 812-3390",
    tier: "Silver",
    points: 195,
    totalVisits: 4,
    totalSpend: 480,
    lastVisitDaysAgo: 64,
    lastService: "Luxury Gel Manicure & Pedicure",
    status: "Inactive 45+ Days",
    source: "In-Store QR",
  },
];

export interface LoyaltyReward {
  id: string;
  title: string;
  pointsCost: number;
  category: "Service Perk" | "Product Gift" | "Discount Voucher" | "VIP Upgrade";
  redemptionsCount: number;
  revenueImpact: string;
  active: boolean;
  description: string;
}

export const INITIAL_REWARDS: LoyaltyReward[] = [
  {
    id: "rew-1",
    title: "Free Botanical Scalp Treatment",
    pointsCost: 250,
    category: "Service Perk",
    redemptionsCount: 29,
    revenueImpact: "$410 repeat rev",
    active: true,
    description: "15-minute organic rosemary & mint scalp massage added to any hair or spa booking.",
  },
  {
    id: "rew-2",
    title: "Hydra-Glow Peptide Booster Add-On",
    pointsCost: 150,
    category: "Service Perk",
    redemptionsCount: 19,
    revenueImpact: "$240 repeat rev",
    active: true,
    description: "Concentrated hyaluronic & peptide serum infusion during any facial appointment.",
  },
  {
    id: "rew-3",
    title: "Complimentary Luxury Blowout",
    pointsCost: 400,
    category: "VIP Upgrade",
    redemptionsCount: 11,
    revenueImpact: "$185 repeat rev",
    active: true,
    description: "Full wash, deep conditioning mask, and signature blowout with any color service.",
  },
  {
    id: "rew-4",
    title: "$25 Off Any Spa Package ($150+)",
    pointsCost: 300,
    category: "Discount Voucher",
    redemptionsCount: 5,
    revenueImpact: "$55 repeat rev",
    active: true,
    description: "Instant register credit toward multi-service spa rituals or seasonal packages.",
  },
];

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  service: string;
  source: "Google" | "Booking Direct";
  comment: string;
  aiDraftReply: string;
  status: "Needs Reply" | "Replied";
  publishedReply?: string;
}

export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    author: "Marcus Thorne",
    rating: 5,
    date: "12 mins ago",
    service: "Executive Cut & Hot Towel Finish",
    source: "Google",
    comment: "Best salon experience in town, Elena and team are wizards!",
    aiDraftReply:
      "Thank you so much, Marcus! We loved having you in the chair at Lumina Haven. Can't wait to see you for your next cut & style—your 50 bonus loyalty points have been added!",
    status: "Needs Reply",
  },
  {
    id: "rev-2",
    author: "Camille Laurent",
    rating: 5,
    date: "Yesterday",
    service: "Hydra-Glow Facial",
    source: "Google",
    comment: "My skin has never looked this radiant. The Hydra-Glow Facial was pure heaven and the front desk QR loyalty check-in took 5 seconds.",
    aiDraftReply:
      "We're thrilled your skin is glowing, Camille! The Hydra-Glow Facial is one of our absolute favorites too. See you in 4 weeks for your next glow session!",
    status: "Needs Reply",
  },
  {
    id: "rev-3",
    author: "Sarah Jenkins",
    rating: 5,
    date: "3 days ago",
    service: "Signature Balayage & Gloss",
    source: "Google",
    comment: "Elena nailed the exact warm honey tone I wanted without any brassiness. Worth every penny.",
    aiDraftReply:
      "Thank you, Sarah! That warm honey balayage suits you so well. Also, thank you for referring Amara to us this week—we've credited your VIP account!",
    status: "Replied",
    publishedReply:
      "Thank you, Sarah! That warm honey balayage suits you so well. Also, thank you for referring Amara to us this week—we've credited your VIP account!",
  },
  {
    id: "rev-4",
    author: "Jessica Vance-Miller",
    rating: 5,
    date: "5 days ago",
    service: "Botanical Scalp Treatment & Blowout",
    source: "Google",
    comment: "Redeemed my loyalty points for the free botanical scalp treatment and it felt incredible. Highly recommend Lumina Haven!",
    aiDraftReply:
      "So happy you enjoyed your VIP reward, Jessica! Nothing beats the botanical scalp ritual. Looking forward to pampering you again soon!",
    status: "Replied",
    publishedReply:
      "So happy you enjoyed your VIP reward, Jessica! Nothing beats the botanical scalp ritual. Looking forward to pampering you again soon!",
  },
];

export interface SalonService {
  id: string;
  name: string;
  category: "Facial & Skin" | "Hair & Color" | "Scalp & Wellness" | "Nails & Beauty";
  price: number;
  duration: string;
  bookingsThisMonth: number;
  featured: boolean;
}

export const SALON_SERVICES: SalonService[] = [
  { id: "srv-1", name: "Hydra-Glow Facial", category: "Facial & Skin", price: 145, duration: "60 min", bookingsThisMonth: 68, featured: true },
  { id: "srv-2", name: "Botanical Scalp Treatment", category: "Scalp & Wellness", price: 65, duration: "30 min", bookingsThisMonth: 54, featured: true },
  { id: "srv-3", name: "Signature Balayage & Gloss", category: "Hair & Color", price: 220, duration: "150 min", bookingsThisMonth: 41, featured: true },
  { id: "srv-4", name: "Keratin Smoothing Ritual", category: "Hair & Color", price: 260, duration: "120 min", bookingsThisMonth: 22, featured: false },
  { id: "srv-5", name: "Executive Cut & Hot Towel Finish", category: "Hair & Color", price: 85, duration: "45 min", bookingsThisMonth: 49, featured: false },
  { id: "srv-6", name: "Aromatherapy Deep Tissue Massage", category: "Scalp & Wellness", price: 130, duration: "60 min", bookingsThisMonth: 37, featured: false },
  { id: "srv-7", name: "Luxury Gel Manicure & Pedicure", category: "Nails & Beauty", price: 95, duration: "75 min", bookingsThisMonth: 63, featured: false },
  { id: "srv-8", name: "Lash Lift & Brow Lamination", category: "Nails & Beauty", price: 110, duration: "50 min", bookingsThisMonth: 31, featured: false },
];

export interface AutomationWorkflow {
  id: string;
  name: string;
  category: "Retention" | "Reviews" | "Loyalty" | "Acquisition";
  trigger: string;
  action: string;
  active: boolean;
  sentCount: number;
  conversionRate: string;
  revenueGenerated: string;
}

export const INITIAL_AUTOMATIONS: AutomationWorkflow[] = [
  {
    id: "auto-1",
    name: "45-Day Lapsed Client Win-Back Engine",
    category: "Retention",
    trigger: "Client passes 45 days since last completed appointment",
    action: "Sends personalized SMS + Email with 'We Miss You' 15% off voucher (valid 10 days)",
    active: true,
    sentCount: 86,
    conversionRate: "31.4%",
    revenueGenerated: "$3,840",
  },
  {
    id: "auto-2",
    name: "5-Star Google Review SMS Booster",
    category: "Reviews",
    trigger: "2 hours after checkout for clients with 2+ visits or loyalty check-in",
    action: "Sends direct Google Review deep-link via SMS + 50 bonus loyalty points upon completion",
    active: true,
    sentCount: 142,
    conversionRate: "44.2%",
    revenueGenerated: "28 5★ Reviews",
  },
  {
    id: "auto-3",
    name: "In-Store QR Dual-Action Welcome Flow",
    category: "Loyalty",
    trigger: "Front desk QR scan at register",
    action: "Instant loyalty punch + auto-routes happy guests to Google Review prompt",
    active: true,
    sentCount: 218,
    conversionRate: "68.0%",
    revenueGenerated: "$2,190",
  },
  {
    id: "auto-4",
    name: "VIP Weekend Double Points Flash Fill",
    category: "Loyalty",
    trigger: "Thursday 10:00 AM when weekend chair utilization is below 80%",
    action: "Invites top returning loyalty members to book Fri–Sun for 2x points",
    active: true,
    sentCount: 38,
    conversionRate: "26.3%",
    revenueGenerated: "$1,420 proj.",
  },
  {
    id: "auto-5",
    name: "Birthday Month Botanical Perk",
    category: "Retention",
    trigger: "1st day of client's birthday month at 9:00 AM",
    action: "Gifts complimentary Botanical Scalp Treatment voucher via SMS & Email",
    active: false,
    sentCount: 19,
    conversionRate: "52.6%",
    revenueGenerated: "$1,150",
  },
];
