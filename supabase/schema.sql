-- ============================================================================
-- BARBER CRM - Comprehensive PostgreSQL Database Schema (Supabase)
-- 20 Core Relational Tables, Indexes, Constraints, and Row Level Security
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ROLES TABLE
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO roles (id, name, description) VALUES
('super_admin', 'Super Admin', 'Mengelola seluruh sistem, akun pengguna, konfigurasi dan akses penuh.'),
('admin_barber', 'Admin Barbershop', 'Mengelola operasional harian, pelanggan, reservasi, kasir, promosi dan laporan.'),
('barber', 'Barber Staff', 'Melihat jadwal kerja, reservasi yang ditugaskan, melayani pelanggan dan status layanan.')
ON CONFLICT (id) DO NOTHING;

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(255) NOT NULL,
    role_id VARCHAR(50) REFERENCES roles(id) ON DELETE RESTRICT,
    phone VARCHAR(50),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CUSTOMER SOURCES TABLE
CREATE TABLE IF NOT EXISTS customer_sources (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(20) DEFAULT '#D4AF37',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO customer_sources (id, name, color) VALUES
('instagram', 'Instagram Ads / Reels', '#E1306C'),
('tiktok', 'TikTok Video', '#000000'),
('google_maps', 'Google Maps / Search', '#4285F4'),
('friend_referral', 'Rekomendasi Teman', '#10B981'),
('walk_in', 'Walk-in / Lewat Depan', '#F59E0B'),
('other', 'Sumber Lainnya', '#6B7280')
ON CONFLICT (id) DO NOTHING;

-- 4. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    birth_date DATE,
    address TEXT,
    gender VARCHAR(20) DEFAULT 'Pria',
    source_id VARCHAR(50) REFERENCES customer_sources(id),
    favorite_barber_id UUID,
    hair_preference TEXT,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'Aktif', -- Aktif, Kurang Aktif, Tidak Aktif
    membership_tier VARCHAR(50) DEFAULT 'Silver', -- Silver, Gold, Platinum
    loyalty_points INTEGER DEFAULT 0,
    total_spend NUMERIC(15,2) DEFAULT 0,
    total_visits INTEGER DEFAULT 0,
    last_visit_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BARBERS TABLE
CREATE TABLE IF NOT EXISTS barbers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    avatar_url TEXT,
    specialization VARCHAR(255) DEFAULT 'Master Barber & Styling',
    status VARCHAR(50) DEFAULT 'Hadir', -- Hadir, Istirahat, Libur, Cuti
    commission_rate NUMERIC(5,2) DEFAULT 25.00, -- Persentase komisi (misal 25%)
    total_customers_served INTEGER DEFAULT 0,
    total_revenue_generated NUMERIC(15,2) DEFAULT 0,
    average_rating NUMERIC(3,2) DEFAULT 5.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraint for customers favorite_barber_id
ALTER TABLE customers 
    ADD CONSTRAINT fk_customers_favorite_barber 
    FOREIGN KEY (favorite_barber_id) REFERENCES barbers(id) ON DELETE SET NULL;

-- 6. BARBER SCHEDULES TABLE
CREATE TABLE IF NOT EXISTS barber_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barber_id UUID NOT NULL REFERENCES barbers(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL, -- 0 = Minggu, 1 = Senin, ... 6 = Sabtu
    start_time TIME NOT NULL DEFAULT '10:00:00',
    end_time TIME NOT NULL DEFAULT '21:00:00',
    is_day_off BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SERVICES TABLE
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- Haircut, Shaving, Coloring, Treatment, Combo
    price NUMERIC(12,2) NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 45,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CUSTOMER JOURNEY (Current Stage)
CREATE TABLE IF NOT EXISTS customer_journey (
    customer_id VARCHAR(50) PRIMARY KEY REFERENCES customers(id) ON DELETE CASCADE,
    current_stage VARCHAR(50) NOT NULL DEFAULT 'AWARENESS', 
    -- AWARENESS, INTEREST, FIRST_VISIT, TRANSACTION, RETENTION, LOYALTY
    source_channel VARCHAR(100),
    entered_stage_at TIMESTAMPTZ DEFAULT NOW(),
    last_interaction_at TIMESTAMPTZ DEFAULT NOW(),
    last_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. JOURNEY HISTORY TABLE
CREATE TABLE IF NOT EXISTS journey_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id VARCHAR(50) NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    from_stage VARCHAR(50),
    to_stage VARCHAR(50) NOT NULL,
    notes TEXT,
    changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. CUSTOMER INTERACTIONS TABLE
CREATE TABLE IF NOT EXISTS customer_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id VARCHAR(50) NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    interaction_type VARCHAR(100) NOT NULL, -- WhatsApp Chat, Reservasi, Kunjungan, Komplain, Penukaran Poin
    notes TEXT NOT NULL,
    staff_name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. APPOINTMENTS (Reservasi & Antrean)
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    queue_number VARCHAR(20) NOT NULL, -- e.g. Q-01, Q-02
    customer_id VARCHAR(50) NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    barber_id UUID NOT NULL REFERENCES barbers(id) ON DELETE RESTRICT,
    service_id VARCHAR(50) NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'Menunggu', 
    -- Menunggu, Dikonfirmasi, Sedang Dilayani, Selesai, Dibatalkan
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. TRANSACTIONS (POS Header)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    customer_id VARCHAR(50) NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    barber_id UUID NOT NULL REFERENCES barbers(id) ON DELETE RESTRICT,
    subtotal NUMERIC(15,2) NOT NULL,
    discount_amount NUMERIC(15,2) DEFAULT 0,
    total_amount NUMERIC(15,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- Tunai, QRIS, Transfer Bank
    payment_status VARCHAR(50) DEFAULT 'Lunas', -- Lunas, Pending, Batal
    cash_tendered NUMERIC(15,2),
    cash_change NUMERIC(15,2),
    points_earned INTEGER DEFAULT 0,
    points_used INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. TRANSACTION DETAILS (POS Items)
CREATE TABLE IF NOT EXISTS transaction_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    service_id VARCHAR(50) NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    service_name VARCHAR(255) NOT NULL,
    price NUMERIC(15,2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    subtotal NUMERIC(15,2) NOT NULL,
    barber_commission NUMERIC(15,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. MEMBERSHIPS TABLE
CREATE TABLE IF NOT EXISTS memberships (
    id VARCHAR(50) PRIMARY KEY, -- Silver, Gold, Platinum
    name VARCHAR(100) NOT NULL,
    min_spend NUMERIC(15,2) NOT NULL,
    points_multiplier NUMERIC(3,2) DEFAULT 1.0,
    discount_percent NUMERIC(5,2) DEFAULT 0,
    benefits JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO memberships (id, name, min_spend, points_multiplier, discount_percent, benefits) VALUES
('Silver', 'Silver VIP', 0, 1.0, 0, '["1 Poin per Rp 10.000", "Promo Ulang Tahun Diskon 10%", "Digital Member Card"]'::jsonb),
('Gold', 'Gold VIP', 500000, 1.2, 5, '["1.2x Poin per Belanja", "Diskon 5% Semua Layanan", "Promo Ulang Tahun Diskon 20%", "Free Hair Tonic Setiap Kunjungan"]'::jsonb),
('Platinum', 'Royal Platinum VIP', 2000000, 1.5, 10, '["1.5x Poin per Belanja", "Diskon 10% Semua Layanan", "Free Shave pada Hari Ulang Tahun", "Prioritas Booking Weekend", "Complimentary Premium Beverage"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 15. LOYALTY POINTS LOG
CREATE TABLE IF NOT EXISTS loyalty_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id VARCHAR(50) NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
    points INTEGER NOT NULL, -- Positif untuk penambahan, negatif untuk penukaran
    description TEXT NOT NULL,
    balance_after INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. VOUCHERS / REWARDS
CREATE TABLE IF NOT EXISTS vouchers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    points_required INTEGER DEFAULT 0,
    discount_amount NUMERIC(15,2) DEFAULT 0,
    discount_percent NUMERIC(5,2) DEFAULT 0,
    min_spend NUMERIC(15,2) DEFAULT 0,
    valid_until DATE,
    quota INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. CAMPAIGNS (Marketing & Promosi)
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    target_segment VARCHAR(100) NOT NULL, 
    -- 'all', 'new', 'inactive_churn', 'birthday_this_month', 'vip_platinum', 'at_risk'
    channel VARCHAR(50) DEFAULT 'WhatsApp',
    message_template TEXT NOT NULL,
    scheduled_at TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'Draft', -- Draft, Berjalan, Selesai, Dibatalkan
    total_recipients INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. CAMPAIGN RECIPIENTS
CREATE TABLE IF NOT EXISTS campaign_recipients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    customer_id VARCHAR(50) NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    phone VARCHAR(50) NOT NULL,
    message_sent TEXT,
    delivery_status VARCHAR(50) DEFAULT 'Pending', -- Pending, Terkirim, Gagal, Dibaca
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. REVIEWS (Feedback & Rating)
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id VARCHAR(50) NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    barber_id UUID NOT NULL REFERENCES barbers(id) ON DELETE CASCADE,
    service_id VARCHAR(50) REFERENCES services(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    review_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO settings (key, value, description) VALUES
('shop_profile', '{"name": "The Royal Cut Barbershop", "phone": "+6281298765432", "address": "Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan", "instagram": "@royalcut.barber", "opening_hour": "10:00", "closing_hour": "21:00"}'::jsonb, 'Profil Barbershop'),
('loyalty_rules', '{"spend_per_point": 10000, "point_value_rupiah": 100, "points_expiration_days": 365}'::jsonb, 'Aturan Perolehan Loyalty Points'),
('rfm_thresholds', '{"recency_days_active": 30, "recency_days_at_risk": 60, "frequency_loyal": 4, "monetary_high_spender": 500000}'::jsonb, 'Batas Ambang RFM & Churn Analysis'),
('whatsapp_gateway', '{"provider": "Fonnte", "api_url": "https://api.fonnte.com/send", "is_simulation": true, "token_masked": "fonnte-demo-****-2026"}'::jsonb, 'Konfigurasi WhatsApp Gateway')
ON CONFLICT (key) DO NOTHING;

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(full_name);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(whatsapp);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_tier ON customers(membership_tier);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date, start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_barber ON appointments(barber_id);
CREATE INDEX IF NOT EXISTS idx_transactions_invoice ON transactions(invoice_number);
CREATE INDEX IF NOT EXISTS idx_transactions_customer ON transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_journey_stage ON customer_journey(current_stage);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read on customers" ON customers FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert/update on customers" ON customers FOR ALL USING (true);

CREATE POLICY "Allow read on services" ON services FOR SELECT USING (true);
CREATE POLICY "Allow read on barbers" ON barbers FOR SELECT USING (true);
CREATE POLICY "Allow authenticated on appointments" ON appointments FOR ALL USING (true);
CREATE POLICY "Allow authenticated on transactions" ON transactions FOR ALL USING (true);
