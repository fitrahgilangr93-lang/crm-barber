'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Customer, 
  Barber, 
  Service, 
  Appointment, 
  Transaction, 
  CustomerJourney, 
  JourneyHistory, 
  CustomerInteraction, 
  Review, 
  Campaign, 
  Voucher, 
  User, 
  UserRole,
  Settings,
  JourneyStageKey,
  AppointmentStatus,
  MembershipTier,
  PaymentMethod
} from '@/types';
import { 
  INITIAL_USERS, 
  INITIAL_CUSTOMERS, 
  INITIAL_BARBERS, 
  INITIAL_SERVICES, 
  INITIAL_APPOINTMENTS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_JOURNEYS, 
  INITIAL_JOURNEY_HISTORY, 
  INITIAL_INTERACTIONS, 
  INITIAL_REVIEWS, 
  INITIAL_CAMPAIGNS, 
  INITIAL_VOUCHERS, 
  INITIAL_SETTINGS 
} from '@/lib/seed-data';

export interface AppContextType {
  // Auth & Roles
  currentUser: User;
  switchUserRole: (role: UserRole) => void;
  users: User[];
  
  // Customers
  customers: Customer[];
  addCustomer: (data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'totalSpend' | 'totalVisits' | 'loyaltyPoints'>) => Customer;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  getCustomerById: (id: string) => Customer | undefined;
  
  // Customer Journey
  journeys: CustomerJourney[];
  journeyHistory: JourneyHistory[];
  moveJourneyStage: (customerId: string, targetStage: JourneyStageKey, notes?: string) => void;
  
  // Interactions
  interactions: CustomerInteraction[];
  addInteraction: (customerId: string, interactionType: CustomerInteraction['interactionType'], notes: string) => void;
  
  // Barbers
  barbers: Barber[];
  addBarber: (data: Omit<Barber, 'id' | 'totalCustomersServed' | 'totalRevenueGenerated' | 'averageRating'>) => Barber;
  updateBarber: (id: string, data: Partial<Barber>) => void;
  deleteBarber: (id: string) => void;
  
  // Services
  services: Service[];
  addService: (data: Omit<Service, 'id'>) => Service;
  updateService: (id: string, data: Partial<Service>) => void;
  deleteService: (id: string) => void;
  
  // Appointments
  appointments: Appointment[];
  addAppointment: (data: {
    customerId: string;
    barberId: string;
    serviceId: string;
    appointmentDate: string;
    startTime: string;
    notes?: string;
  }) => { success: boolean; appointment?: Appointment; error?: string };
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  checkBarberConflict: (barberId: string, date: string, startTime: string, durationMinutes: number, excludeAptId?: string) => boolean;
  
  // Transactions (POS)
  transactions: Transaction[];
  createTransaction: (data: {
    customerId: string;
    barberId: string;
    serviceIds: string[];
    discountAmount: number;
    paymentMethod: PaymentMethod;
    cashTendered?: number;
    notes?: string;
  }) => Transaction;
  
  // Reviews
  reviews: Review[];
  addReview: (data: Omit<Review, 'id' | 'createdAt' | 'reviewDate'>) => Review;
  
  // Campaigns
  campaigns: Campaign[];
  addCampaign: (data: Omit<Campaign, 'id' | 'createdAt' | 'deliveredCount'>) => Campaign;
  sendWhatsAppSimulation: (campaignId: string) => Promise<void>;
  
  // Vouchers
  vouchers: Voucher[];
  redeemVoucher: (customerId: string, voucherId: string) => boolean;
  
  // Settings
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  
  // Utilities
  resetDemoData: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'barber_crm_v1_';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [users] = useState<User[]>(INITIAL_USERS);
  
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [journeys, setJourneys] = useState<CustomerJourney[]>(INITIAL_JOURNEYS);
  const [journeyHistory, setJourneyHistory] = useState<JourneyHistory[]>(INITIAL_JOURNEY_HISTORY);
  const [interactions, setInteractions] = useState<CustomerInteraction[]>(INITIAL_INTERACTIONS);
  
  const [barbers, setBarbers] = useState<Barber[]>(INITIAL_BARBERS);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [vouchers, setVouchers] = useState<Voucher[]>(INITIAL_VOUCHERS);
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const savedUserRole = localStorage.getItem(`${STORAGE_KEY_PREFIX}role`);
      if (savedUserRole) {
        const found = INITIAL_USERS.find(u => u.role === savedUserRole);
        if (found) setCurrentUser(found);
      }

      const savedCustomers = localStorage.getItem(`${STORAGE_KEY_PREFIX}customers`);
      if (savedCustomers) setCustomers(JSON.parse(savedCustomers));

      const savedJourneys = localStorage.getItem(`${STORAGE_KEY_PREFIX}journeys`);
      if (savedJourneys) setJourneys(JSON.parse(savedJourneys));

      const savedAppointments = localStorage.getItem(`${STORAGE_KEY_PREFIX}appointments`);
      if (savedAppointments) setAppointments(JSON.parse(savedAppointments));

      const savedTransactions = localStorage.getItem(`${STORAGE_KEY_PREFIX}transactions`);
      if (savedTransactions) setTransactions(JSON.parse(savedTransactions));

      const savedBarbers = localStorage.getItem(`${STORAGE_KEY_PREFIX}barbers`);
      if (savedBarbers) setBarbers(JSON.parse(savedBarbers));

      const savedServices = localStorage.getItem(`${STORAGE_KEY_PREFIX}services`);
      if (savedServices) setServices(JSON.parse(savedServices));

      const savedReviews = localStorage.getItem(`${STORAGE_KEY_PREFIX}reviews`);
      if (savedReviews) setReviews(JSON.parse(savedReviews));

      const savedCampaigns = localStorage.getItem(`${STORAGE_KEY_PREFIX}campaigns`);
      if (savedCampaigns) setCampaigns(JSON.parse(savedCampaigns));

      const savedSettings = localStorage.getItem(`${STORAGE_KEY_PREFIX}settings`);
      if (savedSettings) setSettings(JSON.parse(savedSettings));
    } catch (e) {
      console.error('Error loading state from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to LocalStorage whenever key states change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}customers`, JSON.stringify(customers));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}journeys`, JSON.stringify(journeys));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}appointments`, JSON.stringify(appointments));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}transactions`, JSON.stringify(transactions));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}barbers`, JSON.stringify(barbers));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}services`, JSON.stringify(services));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}reviews`, JSON.stringify(reviews));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}campaigns`, JSON.stringify(campaigns));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}settings`, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving state to localStorage', e);
    }
  }, [isLoaded, customers, journeys, appointments, transactions, barbers, services, reviews, campaigns, settings]);

  const switchUserRole = (role: UserRole) => {
    const user = users.find(u => u.role === role) || users[0];
    setCurrentUser(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}role`, role);
    }
  };

  const getCustomerById = (id: string) => {
    return customers.find(c => c.id === id);
  };

  const addCustomer = (data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'totalSpend' | 'totalVisits' | 'loyaltyPoints'>): Customer => {
    const nextNum = customers.length + 1;
    const newId = `CUST-${String(nextNum).padStart(3, '0')}`;
    const now = new Date().toISOString();

    const newCustomer: Customer = {
      ...data,
      id: newId,
      loyaltyPoints: 0,
      totalSpend: 0,
      totalVisits: 0,
      createdAt: now,
      updatedAt: now,
    };

    setCustomers(prev => [newCustomer, ...prev]);

    // Add initial journey card (AWARENESS)
    const newJourney: CustomerJourney = {
      customerId: newId,
      currentStage: 'AWARENESS',
      sourceChannel: data.sourceId,
      enteredStageAt: now,
      lastInteractionAt: now,
      lastNotes: `Registrasi pelanggan baru oleh ${currentUser.fullName}`,
    };
    setJourneys(prev => [newJourney, ...prev]);

    return newCustomer;
  };

  const updateCustomer = (id: string, data: Partial<Customer>) => {
    setCustomers(prev =>
      prev.map(c => {
        if (c.id === id) {
          return {
            ...c,
            ...data,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    setJourneys(prev => prev.filter(j => j.customerId !== id));
    setAppointments(prev => prev.filter(a => a.customerId !== id));
  };

  const moveJourneyStage = (customerId: string, targetStage: JourneyStageKey, notes?: string) => {
    const now = new Date().toISOString();
    let fromStage: JourneyStageKey | null = null;

    setJourneys(prev =>
      prev.map(j => {
        if (j.customerId === customerId) {
          fromStage = j.currentStage;
          return {
            ...j,
            currentStage: targetStage,
            enteredStageAt: now,
            lastInteractionAt: now,
            lastNotes: notes || `Tahapan diubah ke ${targetStage}`,
          };
        }
        return j;
      })
    );

    // Record history log
    const newHistory: JourneyHistory = {
      id: `jh-${Date.now()}`,
      customerId,
      fromStage,
      toStage: targetStage,
      notes: notes || `Perubahan tahapan ke ${targetStage}`,
      changedBy: currentUser.id,
      createdAt: now,
    };
    setJourneyHistory(prev => [newHistory, ...prev]);
  };

  const addInteraction = (customerId: string, interactionType: CustomerInteraction['interactionType'], notes: string) => {
    const newInter: CustomerInteraction = {
      id: `inter-${Date.now()}`,
      customerId,
      interactionType,
      notes,
      staffName: currentUser.fullName,
      createdAt: new Date().toISOString(),
    };
    setInteractions(prev => [newInter, ...prev]);
  };

  const addBarber = (data: Omit<Barber, 'id' | 'totalCustomersServed' | 'totalRevenueGenerated' | 'averageRating'>): Barber => {
    const newBarber: Barber = {
      ...data,
      id: `barber-${Date.now()}`,
      totalCustomersServed: 0,
      totalRevenueGenerated: 0,
      averageRating: 5.0,
    };
    setBarbers(prev => [...prev, newBarber]);
    return newBarber;
  };

  const updateBarber = (id: string, data: Partial<Barber>) => {
    setBarbers(prev => prev.map(b => (b.id === id ? { ...b, ...data } : b)));
  };

  const deleteBarber = (id: string) => {
    setBarbers(prev => prev.filter(b => b.id !== id));
  };

  const addService = (data: Omit<Service, 'id'>): Service => {
    const newService: Service = {
      ...data,
      id: `SRV-${String(services.length + 1).padStart(2, '0')}`,
    };
    setServices(prev => [...prev, newService]);
    return newService;
  };

  const updateService = (id: string, data: Partial<Service>) => {
    setServices(prev => prev.map(s => (s.id === id ? { ...s, ...data } : s)));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  /**
   * Conflict Detection Logic
   */
  const checkBarberConflict = (
    barberId: string, 
    date: string, 
    startTime: string, 
    durationMinutes: number, 
    excludeAptId?: string
  ): boolean => {
    const [startH, startM] = startTime.split(':').map(Number);
    const newStartMins = startH * 60 + startM;
    const newEndMins = newStartMins + durationMinutes;

    const sameDayAppointments = appointments.filter(
      a => a.barberId === barberId &&
           a.appointmentDate === date &&
           a.status !== 'Dibatalkan' &&
           a.id !== excludeAptId
    );

    for (const apt of sameDayAppointments) {
      const [aptStartH, aptStartM] = apt.startTime.split(':').map(Number);
      const [aptEndH, aptEndM] = apt.endTime.split(':').map(Number);
      const aptStartMins = aptStartH * 60 + aptStartM;
      const aptEndMins = aptEndH * 60 + aptEndM;

      // Check overlap: (StartA < EndB) and (EndA > StartB)
      if (newStartMins < aptEndMins && newEndMins > aptStartMins) {
        return true; // Overlap detected!
      }
    }

    return false;
  };

  const addAppointment = (data: {
    customerId: string;
    barberId: string;
    serviceId: string;
    appointmentDate: string;
    startTime: string;
    notes?: string;
  }) => {
    const service = services.find(s => s.id === data.serviceId);
    const duration = service ? service.durationMinutes : 45;

    // Check conflict
    const hasConflict = checkBarberConflict(data.barberId, data.appointmentDate, data.startTime, duration);
    if (hasConflict) {
      return {
        success: false,
        error: `Jadwal bentrok! Barber yang dipilih sudah memiliki jadwal pada rentang jam tersebut. Silakan pilih jam atau barber lain.`,
      };
    }

    const [h, m] = data.startTime.split(':').map(Number);
    const endMinutesTotal = h * 60 + m + duration;
    const endH = Math.floor(endMinutesTotal / 60);
    const endM = endMinutesTotal % 60;
    const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    const customer = customers.find(c => c.id === data.customerId);
    const barber = barbers.find(b => b.id === data.barberId);

    // Generate queue number for that date
    const todayApts = appointments.filter(a => a.appointmentDate === data.appointmentDate);
    const queueNumber = `Q-${String(todayApts.length + 1).padStart(2, '0')}`;

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      queueNumber,
      customerId: data.customerId,
      customerName: customer?.fullName || 'Tamu Walk-in',
      customerPhone: customer?.whatsapp,
      barberId: data.barberId,
      barberName: barber?.name || 'Barber',
      serviceId: data.serviceId,
      serviceName: service?.name || 'Layanan',
      serviceDuration: duration,
      appointmentDate: data.appointmentDate,
      startTime: data.startTime,
      endTime,
      status: 'Menunggu',
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };

    setAppointments(prev => [newAppointment, ...prev]);

    // Record interaction
    addInteraction(data.customerId, 'Reservasi', `Booking reservasi ${service?.name} pada ${data.appointmentDate} ${data.startTime}`);

    return { success: true, appointment: newAppointment };
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev =>
      prev.map(a => {
        if (a.id === id) {
          // If status becomes completed, update customer last visit
          if (status === 'Selesai') {
            const now = new Date().toISOString();
            updateCustomer(a.customerId, { lastVisitAt: now });
          }
          return { ...a, status };
        }
        return a;
      })
    );
  };

  /**
   * Cashier POS: Create Transaction with Loyalty, Journey, & Barber Commission
   */
  const createTransaction = (data: {
    customerId: string;
    barberId: string;
    serviceIds: string[];
    discountAmount: number;
    paymentMethod: PaymentMethod;
    cashTendered?: number;
    notes?: string;
  }): Transaction => {
    const customer = customers.find(c => c.id === data.customerId);
    const barber = barbers.find(b => b.id === data.barberId);
    const now = new Date().toISOString();

    const selectedServices = services.filter(s => data.serviceIds.includes(s.id));
    const subtotal = selectedServices.reduce((sum, s) => sum + s.price, 0);
    const totalAmount = Math.max(0, subtotal - data.discountAmount);
    const cashChange = data.cashTendered && data.cashTendered > totalAmount ? data.cashTendered - totalAmount : 0;

    // Loyalty Points (1 point per spendPerPoint)
    const pointsMultiplier = customer?.membershipTier === 'Platinum' ? 1.5 : (customer?.membershipTier === 'Gold' ? 1.25 : 1.0);
    const basePoints = Math.floor(totalAmount / (settings.loyaltyRules.spendPerPoint || 10000));
    const pointsEarned = Math.round(basePoints * pointsMultiplier);

    const txDetails = selectedServices.map((srv, idx) => ({
      id: `txd-${Date.now()}-${idx}`,
      transactionId: `tx-${Date.now()}`,
      serviceId: srv.id,
      serviceName: srv.name,
      price: srv.price,
      quantity: 1,
      subtotal: srv.price,
      barberCommission: srv.price * ((barber?.commissionRate || 25) / 100),
    }));

    const datePrefix = new Date().toISOString().slice(0, 7).replace('-', '');
    const invoiceNumber = `INV-${datePrefix}-${String(transactions.length + 1).padStart(4, '0')}`;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      invoiceNumber,
      customerId: data.customerId,
      customerName: customer?.fullName || 'Walk-in Guest',
      customerTier: customer?.membershipTier || 'Silver',
      barberId: data.barberId,
      barberName: barber?.name || 'Staff Barber',
      subtotal,
      discountAmount: data.discountAmount,
      totalAmount,
      paymentMethod: data.paymentMethod,
      paymentStatus: 'Lunas',
      cashTendered: data.cashTendered,
      cashChange,
      pointsEarned,
      pointsUsed: 0,
      notes: data.notes,
      createdAt: now,
      details: txDetails,
    };

    setTransactions(prev => [newTx, ...prev]);

    // Update Customer metrics and Tier
    if (customer) {
      const newTotalSpend = customer.totalSpend + totalAmount;
      const newTotalVisits = customer.totalVisits + 1;
      const newPoints = customer.loyaltyPoints + pointsEarned;
      
      let newTier: MembershipTier = customer.membershipTier;
      if (newTotalSpend >= 1500000) newTier = 'Platinum';
      else if (newTotalSpend >= 500000) newTier = 'Gold';

      updateCustomer(customer.id, {
        totalSpend: newTotalSpend,
        totalVisits: newTotalVisits,
        loyaltyPoints: newPoints,
        membershipTier: newTier,
        lastVisitAt: now,
        status: 'Aktif',
      });

      // Advance journey stage if appropriate
      const currentJourney = journeys.find(j => j.customerId === customer.id);
      if (currentJourney) {
        if (currentJourney.currentStage === 'AWARENESS' || currentJourney.currentStage === 'INTEREST') {
          moveJourneyStage(customer.id, 'FIRST_VISIT', `Kunjungan pertama kali tercatat via transaksi ${invoiceNumber}`);
        } else if (currentJourney.currentStage === 'FIRST_VISIT') {
          moveJourneyStage(customer.id, 'TRANSACTION', `Pembayaran transaksi perdana berhasil (${invoiceNumber})`);
        } else if (currentJourney.currentStage === 'TRANSACTION' && newTotalVisits >= 2) {
          moveJourneyStage(customer.id, 'RETENTION', `Kunjungan berulang ke-${newTotalVisits}`);
        } else if (newTotalSpend >= 1500000 && currentJourney.currentStage !== 'LOYALTY') {
          moveJourneyStage(customer.id, 'LOYALTY', `Upgrade ke tier Royal Platinum VIP`);
        }
      }

      addInteraction(customer.id, 'Kunjungan', `Transaksi kasir ${invoiceNumber} senilai ${totalAmount} (${data.paymentMethod})`);
    }

    // Update Barber stats
    if (barber) {
      updateBarber(barber.id, {
        totalCustomersServed: barber.totalCustomersServed + 1,
        totalRevenueGenerated: barber.totalRevenueGenerated + totalAmount,
      });
    }

    return newTx;
  };

  const addReview = (data: Omit<Review, 'id' | 'createdAt' | 'reviewDate'>): Review => {
    const today = new Date().toISOString().slice(0, 10);
    const newRev: Review = {
      ...data,
      id: `rev-${Date.now()}`,
      reviewDate: today,
      createdAt: new Date().toISOString(),
    };
    setReviews(prev => [newRev, ...prev]);

    // Recalculate barber average rating
    const barberRevs = [...reviews, newRev].filter(r => r.barberId === data.barberId);
    if (barberRevs.length > 0) {
      const avg = barberRevs.reduce((sum, r) => sum + r.rating, 0) / barberRevs.length;
      updateBarber(data.barberId, { averageRating: parseFloat(avg.toFixed(2)) });
    }

    return newRev;
  };

  const addCampaign = (data: Omit<Campaign, 'id' | 'createdAt' | 'deliveredCount'>): Campaign => {
    const newCamp: Campaign = {
      ...data,
      id: `cmp-${Date.now()}`,
      deliveredCount: 0,
      createdAt: new Date().toISOString(),
    };
    setCampaigns(prev => [newCamp, ...prev]);
    return newCamp;
  };

  const sendWhatsAppSimulation = async (campaignId: string) => {
    setCampaigns(prev =>
      prev.map(c => {
        if (c.id === campaignId) {
          return {
            ...c,
            status: 'Berjalan',
            deliveredCount: c.totalRecipients,
          };
        }
        return c;
      })
    );

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    setCampaigns(prev =>
      prev.map(c => (c.id === campaignId ? { ...c, status: 'Selesai' } : c))
    );
  };

  const redeemVoucher = (customerId: string, voucherId: string): boolean => {
    const customer = customers.find(c => c.id === customerId);
    const voucher = vouchers.find(v => v.id === voucherId);
    if (!customer || !voucher) return false;

    if (customer.loyaltyPoints < voucher.pointsRequired) {
      return false; // insufficient points
    }

    const updatedPoints = customer.loyaltyPoints - voucher.pointsRequired;
    updateCustomer(customerId, { loyaltyPoints: updatedPoints });
    addInteraction(customerId, 'Penukaran Poin', `Menukarkan ${voucher.pointsRequired} poin untuk voucher ${voucher.title}`);
    return true;
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
    }));
  };

  const resetDemoData = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    setCustomers(INITIAL_CUSTOMERS);
    setJourneys(INITIAL_JOURNEYS);
    setJourneyHistory(INITIAL_JOURNEY_HISTORY);
    setInteractions(INITIAL_INTERACTIONS);
    setBarbers(INITIAL_BARBERS);
    setServices(INITIAL_SERVICES);
    setAppointments(INITIAL_APPOINTMENTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setReviews(INITIAL_REVIEWS);
    setCampaigns(INITIAL_CAMPAIGNS);
    setVouchers(INITIAL_VOUCHERS);
    setSettings(INITIAL_SETTINGS);
    setCurrentUser(INITIAL_USERS[0]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchUserRole,
        users,
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        getCustomerById,
        journeys,
        journeyHistory,
        moveJourneyStage,
        interactions,
        addInteraction,
        barbers,
        addBarber,
        updateBarber,
        deleteBarber,
        services,
        addService,
        updateService,
        deleteService,
        appointments,
        addAppointment,
        updateAppointmentStatus,
        checkBarberConflict,
        transactions,
        createTransaction,
        reviews,
        addReview,
        campaigns,
        addCampaign,
        sendWhatsAppSimulation,
        vouchers,
        redeemVoucher,
        settings,
        updateSettings,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
}
