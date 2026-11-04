  export type UserRole = 'super_admin' | 'admin_barber' | 'barber';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
}

export type CustomerStatus = 'Aktif' | 'Kurang Aktif' | 'Tidak Aktif';
export type MembershipTier = 'Silver' | 'Gold' | 'Platinum';

export interface CustomerSource {
  id: string;
  name: string;
  color: string;
}

export interface Customer {
  id: string;
  fullName: string;
  whatsapp: string;
  email?: string;
  birthDate?: string;
  address?: string;
  gender: 'Pria' | 'Wanita';
  sourceId: string;
  favoriteBarberId?: string;
  hairPreference?: string;
  notes?: string;
  status: CustomerStatus;
  membershipTier: MembershipTier;
  loyaltyPoints: number;
  totalSpend: number;
  totalVisits: number;
  lastVisitAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type JourneyStageKey = 
  | 'AWARENESS'
  | 'INTEREST'
  | 'FIRST_VISIT'
  | 'TRANSACTION'
  | 'RETENTION'
  | 'LOYALTY';

export interface JourneyStageMeta {
  key: JourneyStageKey;
  label: string;
  description: string;
  color: string;
  badgeBg: string;
}

export interface CustomerJourney {
  customerId: string;
  currentStage: JourneyStageKey;
  sourceChannel: string;
  enteredStageAt: string;
  lastInteractionAt: string;
  lastNotes?: string;
}

export interface JourneyHistory {
  id: string;
  customerId: string;
  fromStage: JourneyStageKey | null;
  toStage: JourneyStageKey;
  notes?: string;
  changedBy?: string;
  createdAt: string;
}

export interface CustomerInteraction {
  id: string;
  customerId: string;
  interactionType: 'WhatsApp Chat' | 'Reservasi' | 'Kunjungan' | 'Komplain' | 'Penukaran Poin';
  notes: string;
  staffName?: string;
  createdAt: string;
}

export type BarberStatus = 'Hadir' | 'Istirahat' | 'Libur';

export interface Barber {
  id: string;
  name: string;
  phone: string;
  avatarUrl: string;
  specialization: string;
  status: BarberStatus;
  commissionRate: number; // in percent e.g. 25
  totalCustomersServed: number;
  totalRevenueGenerated: number;
  averageRating: number;
  isActive: boolean;
  address?: string;
  workingDays?: string; // e.g. "Senin - Sabtu"
  workingHours?: string; // e.g. "10:00 - 21:00"
}

export interface BarberSchedule {
  id: string;
  barberId: string;
  dayOfWeek: number; // 0=Min, 1=Sen, ...
  startTime: string;
  endTime: string;
  isDayOff: boolean;
}

export interface Service {
  id: string;
  name: string;
  category: 'Haircut' | 'Shaving' | 'Coloring' | 'Treatment' | 'Combo';
  price: number;
  durationMinutes: number;
  description: string;
  isActive: boolean;
}

export type AppointmentStatus = 'Menunggu' | 'Dikonfirmasi' | 'Sedang Dilayani' | 'Selesai' | 'Dibatalkan';

export interface Appointment {
  id: string;
  queueNumber: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  barberId: string;
  barberName?: string;
  serviceId: string;
  serviceName?: string;
  serviceDuration?: number;
  appointmentDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export type PaymentMethod = 'Tunai' | 'QRIS' | 'Transfer Bank';
export type PaymentStatus = 'Lunas' | 'Pending' | 'Batal';

export interface TransactionDetail {
  id: string;
  transactionId?: string;
  serviceId: string;
  serviceName: string;
  price: number;
  quantity: number;
  subtotal: number;
  barberCommission: number;
}

export interface Transaction {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName?: string;
  customerTier?: MembershipTier;
  barberId: string;
  barberName?: string;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  cashTendered?: number;
  cashChange?: number;
  pointsEarned: number;
  pointsUsed: number;
  notes?: string;
  createdAt: string;
  details: TransactionDetail[];
}

export interface Membership {
  id: MembershipTier;
  name: string;
  minSpend: number;
  pointsMultiplier: number;
  discountPercent: number;
  benefits: string[];
}

export interface LoyaltyPointLog {
  id: string;
  customerId: string;
  transactionId?: string;
  points: number; // positive = earned, negative = redeemed
  description: string;
  balanceAfter: number;
  createdAt: string;
}

export interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  pointsRequired: number;
  discountAmount: number;
  discountPercent: number;
  minSpend: number;
  validUntil: string;
  quota: number;
  isActive: boolean;
}

export type CampaignSegment = 
  | 'all' 
  | 'new' 
  | 'inactive_churn' 
  | 'birthday_this_month' 
  | 'vip_platinum' 
  | 'at_risk';

export interface Campaign {
  id: string;
  title: string;
  targetSegment: CampaignSegment;
  channel: 'WhatsApp';
  messageTemplate: string;
  scheduledAt?: string;
  status: 'Draft' | 'Berjalan' | 'Selesai';
  totalRecipients: number;
  deliveredCount: number;
  createdAt: string;
}

export interface CampaignRecipient {
  id: string;
  campaignId: string;
  customerId: string;
  customerName: string;
  phone: string;
  messageSent: string;
  deliveryStatus: 'Pending' | 'Terkirim' | 'Gagal' | 'Dibaca';
  sentAt?: string;
}

export interface Review {
  id: string;
  customerId: string;
  customerName?: string;
  barberId: string;
  barberName?: string;
  serviceName?: string;
  rating: number; // 1 to 5
  comment: string;
  reviewDate: string;
  createdAt: string;
}

export type RFMSegment =
  | 'Champions'
  | 'Loyal Customers'
  | 'Potential Loyalists'
  | 'New Customers'
  | 'Promising'
  | 'At Risk'
  | 'Hibernating'
  | 'Lost Customers';

export interface RFMScore {
  customerId: string;
  customerName: string;
  whatsapp: string;
  tier: MembershipTier;
  recencyDays: number;
  recencyScore: number; // 1-5
  frequencyCount: number;
  frequencyScore: number; // 1-5
  monetaryAmount: number;
  monetaryScore: number; // 1-5
  overallScore: string; // e.g. "555"
  segment: RFMSegment;
  actionRecommendation: string;
}

export interface Settings {
  shopProfile: {
    name: string;
    phone: string;
    address: string;
    instagram: string;
    openingHour: string;
    closingHour: string;
  };
  loyaltyRules: {
    spendPerPoint: number;
    pointValueRupiah: number;
    pointsExpirationDays: number;
  };
  rfmThresholds: {
    recencyDaysActive: number;
    recencyDaysAtRisk: number;
    frequencyLoyal: number;
    monetaryHighSpender: number;
  };
  whatsappGateway: {
    provider: string;
    apiUrl: string;
    isSimulation: boolean;
    tokenMasked: string;
  };
}
