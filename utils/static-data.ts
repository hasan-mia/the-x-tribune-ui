import { Award, BadgeDollarSign, BarChart3, Calendar, CalendarCheck, CalendarClock, CheckCircle2, ClipboardList, Clock, Contact2Icon, DollarSign, FactoryIcon, Files, FileSpreadsheet, FileStack, FileText, FolderOpen, FolderTree, FormInput, HelpCircle, HelpingHand, LayoutDashboard, Mail, MailCheck, MapPin, MessageCircleDashed, MessageSquare, MessageSquareQuote, Newspaper, Phone, PrinterCheck, Receipt, ReceiptText, ReceiptTextIcon, Settings, Shield, ShieldQuestion, Sliders, SlidersHorizontal, Subscript, Target, TestTubeIcon, TrendingUp, User, UserCog, UserPlusIcon, Users, Wrench } from "lucide-react";

// ====================================
//  Public Static Data
// ====================================

// Home page data
export const features = [
    {
        icon: Shield,
        title: 'Trusted Expertise',
        description: 'Certified professionals with decades of combined experience in accounting and tax law.',
    },
    {
        icon: Award,
        title: 'Proven Results',
        description: 'Track record of helping clients save money and achieve their financial goals.',
    },
    {
        icon: Clock,
        title: 'Year-Round Support',
        description: 'Available when you need us, not just during tax season.',
    },
];

// How To Work Procession
export const process = [
    { step: '01', title: 'Initial Consultation', description: 'We discuss your needs and goals' },
    { step: '02', title: 'Custom Strategy', description: 'Develop tailored financial solutions' },
    { step: '03', title: 'Implementation', description: 'Execute the plan with precision' },
    { step: '04', title: 'Ongoing Support', description: 'Continuous monitoring and optimization' },
];

// Pricing page Trust Indicator
export const trustIndicators = [
    { icon: Shield, text: 'No hidden fees' },
    { icon: CheckCircle2, text: 'Money-back guarantee' },
    { icon: Users, text: '500+ satisfied clients' },
    { icon: DollarSign, text: 'Transparent pricing' },
]

// Additional Service
export const additionalServices = [
    {
        service: 'Personal Tax Return (Simple)',
        price: 'Starting at $250',
    },
    {
        service: 'Personal Tax Return (Complex)',
        price: 'Starting at $500',
    },
    {
        service: 'Business Tax Return (S-Corp/LLC)',
        price: 'Starting at $750',
    },
    {
        service: 'Business Tax Return (C-Corp)',
        price: 'Starting at $1,500',
    },
    {
        service: 'Tax Amendment',
        price: '$300 - $600',
    },
    {
        service: 'IRS Audit Representation',
        price: '$200/hour',
    },
    {
        service: 'Financial Statement Audit',
        price: 'Custom Quote',
    },
    {
        service: 'Business Formation',
        price: '$500 - $1,500',
    },
    {
        service: 'Payroll Setup',
        price: '$500 one-time',
    },
    {
        service: 'CFO Consulting',
        price: '$250/hour',
    },
]

// Referral Source
export const REFERRAL_SOURCES = [
    'Google',
    'TikTok',
    'Existing Client Referral',
    'LinkedIn',
    'Facebook',
    'Instagram',
    'Robert Goldberg',
    'Glitchy',
    'Attorney',
    'Financial Advisor/Banker',
    'Mortgage Broker/Loan Officer',
    'Accountant',
    'Real Estate Agent',
    'Insurance Agent/Broker',
    'TV/Newspaper Ad',
    'Word of Mouth',
    'Event',
    'From Your Emails',
    'Not Listed Here'
];

// Contact us reason
export const reasons = [
    'Schedule a consultation',
    'Request a quote',
    'Ask about our services',
    'General inquiry',
]

// About Page Data

export const stats = [
    { value: '30+', label: 'Years in Business' },
    { value: '50+', label: 'Expert CPAs' },
    { value: '1,000+', label: 'Satisfied Clients' },
    { value: '$100M+', label: 'Client Assets Managed' },
]

export const values = [
    {
        icon: Shield,
        title: 'Integrity',
        description: 'We uphold the highest ethical standards in all our professional relationships and maintain strict confidentiality.',
    },
    {
        icon: Target,
        title: 'Client-Focused',
        description: 'Your success is our priority. We tailor our services to meet your unique needs and business objectives.',
    },
    {
        icon: TrendingUp,
        title: 'Excellence',
        description: 'We deliver exceptional quality in every engagement through continuous learning and professional development.',
    },
    {
        icon: Clock,
        title: 'Responsive',
        description: 'We provide timely support and proactive communication to keep you informed and confident.',
    },
]

export const timeline = [
    { year: '1995', title: 'Founded', description: 'Established with a vision to provide exceptional accounting services' },
    { year: '2005', title: 'Expansion', description: 'Opened three additional offices and doubled our team size' },
    { year: '2015', title: 'Digital Innovation', description: 'Launched client portal and cloud-based accounting solutions' },
    { year: '2025', title: 'Today', description: 'Serving 1,000+ clients with comprehensive financial services' },
]

export const certifications = [
    'AICPA Member Firm',
    'IRS Enrolled Agents',
    'Certified Financial Planners',
    'QuickBooks ProAdvisors',
    'Xero Certified Partners',
    'ISO 27001 Certified',
]

export const usaStates = [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' },
    { value: 'DC', label: 'District of Columbia' },
];


// ========================
// ADMIN SIDEBAR MENU DATA
// ========================
export const adminSidebar = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },

    { name: "Organizers", href: "/admin/organizer", icon: Users },
    { name: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
    { name: "Invoices", href: "/admin/invoices", icon: Receipt },

    { name: "Document Type", href: "/admin/document-type", icon: Files },
    { name: "Documents", href: "/admin/documents", icon: FileStack },

    { name: "Return Type", href: "/admin/return-type", icon: ClipboardList },
    { name: "Income Type", href: "/admin/income-source-type", icon: DollarSign },

    { name: "Hero Slider", href: "/admin/hero-slides", icon: SlidersHorizontal },
    { name: "Category", href: "/admin/categories", icon: FolderTree },
    { name: "Blog", href: "/admin/blogs", icon: Newspaper },
    { name: "Service", href: "/admin/services", icon: Wrench },
    { name: "Pricing", href: "/admin/pricing", icon: BadgeDollarSign },
    { name: "FAQ", href: "/admin/faqs", icon: HelpCircle },

    { name: "Why Choose Us", href: "/admin/why-chose-us", icon: Award },
    { name: "Clients", href: "/admin/clients", icon: Users },

    { name: "Contact Message", href: "/admin/contact-us", icon: MessageSquare },
    { name: "Subscribers", href: "/admin/subscribers", icon: MailCheck },
    { name: "Admin", href: "/admin/admins", icon: UserCog },
    { name: "Testimonial", href: "/admin/testimonials", icon: MessageSquareQuote },

    { name: "Profile", href: "/admin/profile", icon: User },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

// =========================
// CLIENT AREA DATA
// =========================
export const taxYears = [
    { value: '2026', label: '2026' },
    { value: '2025', label: '2025' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' },
    { value: '2019', label: '2019' },
    { value: '2018', label: '2018' },
    { value: '2017', label: '2017' },
    { value: '2016', label: '2016' },
    { value: '2015', label: '2015' },
    { value: '2014', label: '2014' },
    { value: '2013', label: '2013' },
    { value: '2012', label: '2012' },
    { value: '2011', label: '2011' },
    { value: '2010', label: '2010' },
]

export const clientSidebar = [
    // { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Organizer', href: '/organizer', icon: FormInput },
    { name: 'Documents', href: '/documents', icon: FolderOpen },
    { name: 'Bookings', href: '/bookings', icon: Calendar },
    { name: 'Invoices', href: '/invoices', icon: ReceiptText },
    { name: 'Profile', href: '/profile', icon: User },
]
