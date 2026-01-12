"use client";

import { useGetOrganizeDetails } from "@/api/organizer";
import { EyeIcon } from "lucide-react";
import { useParams } from "next/navigation";

interface Taxpayer {
    id: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    suffix?: string;
    taxpayer_type: string;
    email: string;
    phone?: string;
    ssn: string;
    date_of_birth: string;
    occupation: string;
    filing_status: string;
    is_65_or_older: boolean;
    is_blind: boolean;
    can_be_claimed_dependent: boolean;
    presidential_campaign_fund: boolean;
}

interface Address {
    address_line1: string;
    apt_number?: string;
    address_line2?: string;
    city: string;
    state: string;
    zip_code: string;
    address_changed: boolean;
    is_po_box: boolean;
    has_different_mailing: boolean;
    mailing_address?: string;
    mailing_city?: string;
    mailing_state?: string;
    mailing_zip?: string;
}

interface GeneralInfo {
    virtual_currency: boolean;
    health_insurance_full_year: boolean;
}

interface Dependent {
    id: string;
    first_name: string;
    last_name: string;
    ssn: string;
    relationship: string;
    date_of_birth: string;
    months_lived_with_you: number;
    is_student: boolean;
    is_disabled: boolean;
    child_tax_credit_eligible: boolean;
    dependent_care_eligible: boolean;
}

interface IncomeSource {
    id: string;
    employer_name: string;
    employer_ein: string;
    wages_amount: string;
    federal_tax_withheld: string;
    social_security_wages: string;
    social_security_tax: string;
    medicare_wages: string;
    medicare_tax: string;
    state_wages: string;
    state_tax_withheld: string;
    retirement_plan: boolean;
    sourceType?: {
        id: string;
        name: string;
    };
}

interface SelfEmployment {
    has_self_employment: boolean;
    business_name: string;
    business_type: string;
    business_ein: string;
    principal_business_code: string;
    accounting_method: string;
    gross_receipts: string;
    returns_allowances: string;
    cost_of_goods_sold: string;
    advertising: string;
    car_truck_expenses: string;
    contract_labor: string;
    insurance: string;
    legal_professional: string;
    office_expense: string;
    supplies: string;
    travel: string;
    meals: string;
    utilities: string;
    home_office_deduction: boolean;
    home_office_sqft: number;
    home_total_sqft: number;
}

interface Deduction {
    id: string;
    deduction_type: string;
    amount: string;
}

interface TaxCredit {
    has_child_care_credit: boolean;
    care_provider_name?: string;
    care_provider_ein?: string;
    child_care_amount?: string;
    has_education_credit: boolean;
    student_name?: string;
    institution_name?: string;
    tuition_paid?: string;
    received_1098t: boolean;
    has_energy_credit: boolean;
    solar_cost?: string;
    energy_improvements?: string;
    has_ev_credit: boolean;
    ev_make_model?: string;
    ev_purchase_date?: string;
    ev_purchase_price?: string;
    ev_vin?: string;
    has_saver_credit: boolean;
    retirement_contributions?: string;
}

interface ForeignIncome {
    has_foreign_income: boolean;
    foreign_country?: string;
    income_type?: string;
    amount_in_usd?: string;
    foreign_tax_paid?: string;
    days_outside_us?: number;
    has_fbar_requirement: boolean;
    max_foreign_account_value?: string;
    foreign_bank_name?: string;
    has_form8938_requirement: boolean;
}

interface BankAccount {
    use_direct_deposit: boolean;
    bank_name?: string;
    routing_number?: string;
    account_number?: string;
    account_type?: string;
    account_purpose?: string;
    est_q1: string;
    est_q2: string;
    est_q3: string;
    est_q4: string;
}

interface Document {
    id: string;
    file_name: string;
    documentType?: {
        name: string;
    };
    file_size: number;
    file_url: string;
    mime_type: string;
    status: string;
    notes?: string;
    uploaded_at: string;
}

interface Signature {
    consent_to_efile: boolean;
    consent_to_disclose: boolean;
    declaration_accurate: boolean;
    pin?: string;
    signature_date?: string;
    typed_signature?: string;
    ip_address?: string;
}

interface OrganizerDetail {
    id: string;
    tax_year: number;
    return_type: string;
    client_name: string;
    status: string;
    current_step: number;
    is_amended: boolean;
    extension_filed: boolean;
    extension_confirmation?: string;
    submitted_at?: string;
    completed_at?: string;
    created_at: string;
    updated_at: string;
    Taxpayers?: Taxpayer[];
    address?: Address;
    generalInfo?: GeneralInfo;
    dependents?: Dependent[];
    incomeSources?: IncomeSource[];
    selfEmployment?: SelfEmployment;
    deductions?: Deduction[];
    credits?: TaxCredit;
    foreignIncome?: ForeignIncome;
    bankAccount?: BankAccount;
    documents?: Document[];
    signature?: Signature;
}

// Helper function to format currency
const formatCurrency = (value: string | number | undefined) => {
    if (!value) return "$0.00";
    const num = typeof value === "string" ? parseFloat(value) : value;
    return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Helper function to format date
const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

// Helper to format deduction type
const formatDeductionType = (type: string) => {
    return type
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

export default function TaxOrganizerDetail() {
    const params = useParams();
    const id = (params?.id as string)

    const { data, isLoading, error, isError } = useGetOrganizeDetails(id || "", !!id);

    const organizerDetail: OrganizerDetail | undefined = data?.data;

    if (!id) {
        return <div className="p-6 text-center text-red-600">No organizer ID provided</div>;
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 text-center">
                <div className="bg-red-50 text-red-800 p-4 rounded-lg">
                    <h3 className="font-semibold">Error loading organizer</h3>
                    <p className="text-sm mt-1">{error?.message || "Unknown error"}</p>
                </div>
            </div>
        );
    }

    if (!organizerDetail) {
        return <div className="p-6 text-center">Organizer not found</div>;
    }

    return (
        <div className="mx-auto space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-2">{organizerDetail.client_name}</h1>
                <div className="flex flex-wrap gap-4 text-sm">
                    <span className="bg-white/20 px-3 py-1 rounded-full">
                        Tax Year: {organizerDetail.tax_year}
                    </span>
                    <span className="bg-white/20 px-3 py-1 rounded-full capitalize">
                        {organizerDetail.return_type.replace("_", " ")}
                    </span>
                    <span className="bg-white/20 px-3 py-1 rounded-full capitalize">
                        Status: {organizerDetail.status}
                    </span>
                </div>
            </div>

            {/* General Information */}
            {organizerDetail.generalInfo && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">General Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${organizerDetail.generalInfo.virtual_currency ? "bg-green-500" : "bg-gray-300"}`}></div>
                            <span className="text-sm">Virtual Currency Transactions</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${organizerDetail.generalInfo.health_insurance_full_year ? "bg-green-500" : "bg-gray-300"}`}></div>
                            <span className="text-sm">Health Insurance Full Year</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Taxpayers */}
            {organizerDetail.Taxpayers && organizerDetail.Taxpayers.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Taxpayer Information</h3>
                    <div className="space-y-4">
                        {organizerDetail.Taxpayers.map((taxpayer) => (
                            <div key={taxpayer.id} className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50/50 rounded-r">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="font-semibold text-lg">
                                            {taxpayer.first_name} {taxpayer.middle_name} {taxpayer.last_name} {taxpayer.suffix}
                                        </p>
                                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded capitalize">
                                            {taxpayer.taxpayer_type}
                                        </span>
                                    </div>
                                    <div className="text-right text-sm">
                                        <p className="text-gray-600">{taxpayer.email}</p>
                                        <p className="text-gray-600">{taxpayer.phone}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mt-3">
                                    <div>
                                        <p className="text-gray-500 text-xs">SSN</p>
                                        <p className="font-medium">{taxpayer.ssn}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">Date of Birth</p>
                                        <p className="font-medium">{formatDate(taxpayer.date_of_birth)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">Occupation</p>
                                        <p className="font-medium">{taxpayer.occupation}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">Filing Status</p>
                                        <p className="font-medium capitalize">{taxpayer.filing_status?.replace("_", " ")}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {taxpayer.is_65_or_older && (
                                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">65 or Older</span>
                                    )}
                                    {taxpayer.is_blind && (
                                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Blind</span>
                                    )}
                                    {taxpayer.presidential_campaign_fund && (
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Campaign Fund</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Address */}
            {organizerDetail.address && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Address Information</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-medium text-sm text-gray-600 mb-2">Primary Address</h4>
                            <p className="font-medium">{organizerDetail.address.address_line1}</p>
                            {organizerDetail.address.apt_number && (
                                <p className="text-gray-600">{organizerDetail.address.apt_number}</p>
                            )}
                            {organizerDetail.address.address_line2 && (
                                <p className="text-gray-600">{organizerDetail.address.address_line2}</p>
                            )}
                            <p className="text-gray-600">
                                {organizerDetail.address.city}, {organizerDetail.address.state} {organizerDetail.address.zip_code}
                            </p>
                            <div className="flex gap-2 mt-2">
                                {organizerDetail.address.address_changed && (
                                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Address Changed</span>
                                )}
                                {organizerDetail.address.is_po_box && (
                                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">PO Box</span>
                                )}
                            </div>
                        </div>
                        {organizerDetail.address.has_different_mailing && (
                            <div>
                                <h4 className="font-medium text-sm text-gray-600 mb-2">Mailing Address</h4>
                                <p className="font-medium">{organizerDetail.address.mailing_address}</p>
                                <p className="text-gray-600">
                                    {organizerDetail.address.mailing_city}, {organizerDetail.address.mailing_state} {organizerDetail.address.mailing_zip}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Dependents */}
            {organizerDetail.dependents && organizerDetail.dependents.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Dependents</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {organizerDetail.dependents.map((dependent) => (
                            <div key={dependent.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="font-semibold">
                                            {dependent.first_name} {dependent.last_name}
                                        </p>
                                        <p className="text-sm text-gray-600 capitalize">{dependent.relationship}</p>
                                    </div>
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">SSN: {dependent.ssn}</span>
                                </div>
                                <div className="text-sm space-y-1 mb-2">
                                    <p className="text-gray-600">DOB: {formatDate(dependent.date_of_birth)}</p>
                                    <p className="text-gray-600">Months with you: {dependent.months_lived_with_you}</p>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {dependent.child_tax_credit_eligible && (
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Tax Credit</span>
                                    )}
                                    {dependent.dependent_care_eligible && (
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Care Eligible</span>
                                    )}
                                    {dependent.is_student && (
                                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Student</span>
                                    )}
                                    {dependent.is_disabled && (
                                        <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">Disabled</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Income Sources */}
            {organizerDetail.incomeSources && organizerDetail.incomeSources.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Income Sources</h3>
                    <div className="space-y-4">
                        {organizerDetail.incomeSources.map((income) => (
                            <div key={income.id} className="border-l-4 border-green-500 pl-4 py-3 bg-green-50/50 rounded-r">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="font-semibold text-lg">{income.employer_name}</p>
                                        <p className="text-sm text-gray-600">EIN: {income.employer_ein}</p>
                                        {income.sourceType && (
                                            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-1">
                                                {income.sourceType.name}
                                            </span>
                                        )}
                                    </div>
                                    {income.retirement_plan && (
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Retirement Plan</span>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500 text-xs">Wages</p>
                                        <p className="font-semibold">{formatCurrency(income.wages_amount)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">Federal Tax</p>
                                        <p className="font-semibold">{formatCurrency(income.federal_tax_withheld)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">SS Tax</p>
                                        <p className="font-semibold">{formatCurrency(income.social_security_tax)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">Medicare Tax</p>
                                        <p className="font-semibold">{formatCurrency(income.medicare_tax)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Self Employment */}
            {organizerDetail.selfEmployment?.has_self_employment && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Self Employment</h3>
                    <div className="border-l-4 border-purple-500 pl-4 py-3 bg-purple-50/50 rounded-r">
                        <div className="mb-4">
                            <p className="font-semibold text-lg">{organizerDetail.selfEmployment.business_name}</p>
                            <div className="flex gap-3 text-sm text-gray-600 mt-1">
                                <span className="capitalize">{organizerDetail.selfEmployment.business_type.replace("_", " ")}</span>
                                <span>•</span>
                                <span>EIN: {organizerDetail.selfEmployment.business_ein}</span>
                                <span>•</span>
                                <span>Code: {organizerDetail.selfEmployment.principal_business_code}</span>
                                <span>•</span>
                                <span className="capitalize">{organizerDetail.selfEmployment.accounting_method}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                            <div className="bg-white p-3 rounded border">
                                <p className="text-xs text-gray-500">Gross Receipts</p>
                                <p className="font-bold text-green-600">{formatCurrency(organizerDetail.selfEmployment.gross_receipts)}</p>
                            </div>
                            <div className="bg-white p-3 rounded border">
                                <p className="text-xs text-gray-500">Returns/Allowances</p>
                                <p className="font-bold text-red-600">{formatCurrency(organizerDetail.selfEmployment.returns_allowances)}</p>
                            </div>
                            <div className="bg-white p-3 rounded border">
                                <p className="text-xs text-gray-500">Cost of Goods Sold</p>
                                <p className="font-bold">{formatCurrency(organizerDetail.selfEmployment.cost_of_goods_sold)}</p>
                            </div>
                        </div>

                        <h4 className="font-medium text-sm text-gray-700 mb-2">Business Expenses</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                                <p className="text-gray-500 text-xs">Advertising</p>
                                <p className="font-medium">{formatCurrency(organizerDetail.selfEmployment.advertising)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Car/Truck</p>
                                <p className="font-medium">{formatCurrency(organizerDetail.selfEmployment.car_truck_expenses)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Contract Labor</p>
                                <p className="font-medium">{formatCurrency(organizerDetail.selfEmployment.contract_labor)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Insurance</p>
                                <p className="font-medium">{formatCurrency(organizerDetail.selfEmployment.insurance)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Legal/Professional</p>
                                <p className="font-medium">{formatCurrency(organizerDetail.selfEmployment.legal_professional)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Office Expense</p>
                                <p className="font-medium">{formatCurrency(organizerDetail.selfEmployment.office_expense)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Supplies</p>
                                <p className="font-medium">{formatCurrency(organizerDetail.selfEmployment.supplies)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Travel</p>
                                <p className="font-medium">{formatCurrency(organizerDetail.selfEmployment.travel)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Meals</p>
                                <p className="font-medium">{formatCurrency(organizerDetail.selfEmployment.meals)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Utilities</p>
                                <p className="font-medium">{formatCurrency(organizerDetail.selfEmployment.utilities)}</p>
                            </div>
                        </div>

                        {organizerDetail.selfEmployment.home_office_deduction && (
                            <div className="mt-4 bg-blue-50 p-3 rounded border border-blue-200">
                                <p className="font-medium text-sm text-blue-900 mb-1">Home Office Deduction</p>
                                <p className="text-sm text-blue-800">
                                    {organizerDetail.selfEmployment.home_office_sqft} sq ft of {organizerDetail.selfEmployment.home_total_sqft} sq ft total
                                    ({((organizerDetail.selfEmployment.home_office_sqft / organizerDetail.selfEmployment.home_total_sqft) * 100).toFixed(1)}%)
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Deductions */}
            {organizerDetail.deductions && organizerDetail.deductions.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Deductions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {organizerDetail.deductions.map((deduction) => (
                            <div key={deduction.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-600 mb-1">{formatDeductionType(deduction.deduction_type)}</p>
                                <p className="text-xl font-bold text-gray-900">{formatCurrency(deduction.amount)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-700">Total Deductions:</span>
                            <span className="text-2xl font-bold text-blue-600">
                                {formatCurrency(
                                    organizerDetail.deductions.reduce((sum, d) => sum + parseFloat(d.amount), 0)
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Tax Credits */}
            {
                organizerDetail.credits && (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Tax Credits</h3>
                        <div className="space-y-4">
                            {organizerDetail.credits.has_child_care_credit && (
                                <div className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-50/50 rounded-r">
                                    <p className="font-semibold">Child Care Credit</p>
                                    <p className="text-sm text-gray-600">Provider: {organizerDetail.credits.care_provider_name}</p>
                                    <p className="text-sm text-gray-600">EIN: {organizerDetail.credits.care_provider_ein}</p>
                                    <p className="font-bold text-lg mt-1">{formatCurrency(organizerDetail.credits.child_care_amount)}</p>
                                </div>
                            )}
                        </div>

                        {organizerDetail.credits.has_education_credit && (
                            <div className="border-l-4 border-indigo-500 pl-4 py-2 bg-indigo-50/50 rounded-r">
                                <p className="font-semibold">Education Credit</p>
                                <p className="text-sm text-gray-600">Student: {organizerDetail.credits.student_name}</p>
                                <p className="text-sm text-gray-600">Institution: {organizerDetail.credits.institution_name}</p>
                                <p className="font-bold text-lg mt-1">{formatCurrency(organizerDetail.credits.tuition_paid)}</p>
                                .received_1098t && (
                                <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">1098-T Received</span>
                                )
                            </div>
                        )}

                        {organizerDetail.credits.has_energy_credit && (
                            <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50/50 rounded-r">
                                <p className="font-semibold">Energy Credit</p>
                                <div className="text-sm space-y-1 mt-2">
                                    {organizerDetail.credits.solar_cost && (
                                        <p>Solar: {formatCurrency(organizerDetail.credits.solar_cost)}</p>
                                    )}
                                    {organizerDetail.credits.energy_improvements && (
                                        <p>Improvements: {formatCurrency(organizerDetail.credits.energy_improvements)}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {organizerDetail.credits.has_ev_credit && (
                            <div className="border-l-4 border-teal-500 pl-4 py-2 bg-teal-50/50 rounded-r">
                                <p className="font-semibold">Electric Vehicle Credit</p>
                                <div className="text-sm space-y-1 mt-2">
                                    <p>Vehicle: {organizerDetail.credits.ev_make_model}</p>
                                    <p>Purchase Date: {formatDate(organizerDetail.credits.ev_purchase_date)}</p>
                                    <p>Purchase Price: {formatCurrency(organizerDetail.credits.ev_purchase_price)}</p>
                                    <p className="text-xs text-gray-500">VIN: {organizerDetail.credits.ev_vin}</p>
                                </div>
                            </div>
                        )}

                        {organizerDetail.credits.has_saver_credit && (
                            <div className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-50/50 rounded-r">
                                <p className="font-semibold">Retirement Savings Credit</p>
                                <p className="font-bold text-lg mt-1">{formatCurrency(organizerDetail.credits.retirement_contributions)}</p>
                            </div>
                        )}
                    </div>
                )
            }

            {/* Foreign Income */}
            {
                organizerDetail.foreignIncome?.has_foreign_income && (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Foreign Income</h3>
                        <div className="border-l-4 border-orange-500 pl-4 py-3 bg-orange-50/50 rounded-r">
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500 text-xs">Country</p>
                                    <p className="font-medium">{organizerDetail.foreignIncome.foreign_country}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs">Income Type</p>
                                    <p className="font-medium capitalize">{organizerDetail.foreignIncome.income_type}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs">Amount (USD)</p>
                                    <p className="font-semibold">{formatCurrency(organizerDetail.foreignIncome.amount_in_usd)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs">Foreign Tax Paid</p>
                                    <p className="font-semibold">{formatCurrency(organizerDetail.foreignIncome.foreign_tax_paid)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs">Days Outside US</p>
                                    <p className="font-medium">{organizerDetail.foreignIncome.days_outside_us}</p>
                                </div>
                                {organizerDetail.foreignIncome.has_fbar_requirement && (
                                    <div>
                                        <p className="text-gray-500 text-xs">Max Foreign Account Value</p>
                                        <p className="font-semibold">{formatCurrency(organizerDetail.foreignIncome.max_foreign_account_value)}</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {organizerDetail.foreignIncome.has_fbar_requirement && (
                                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">FBAR Required</span>
                                )}
                                {organizerDetail.foreignIncome.has_form8938_requirement && (
                                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">Form 8938 Required</span>
                                )}
                            </div>
                            {organizerDetail.foreignIncome.foreign_bank_name && (
                                <p className="text-sm text-gray-600 mt-2">Bank: {organizerDetail.foreignIncome.foreign_bank_name}</p>
                            )}
                        </div>
                    </div>
                )
            }

            {/* Bank Account */}
            {
                organizerDetail.bankAccount && (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Banking & Estimated Payments</h3>
                        {organizerDetail.bankAccount.use_direct_deposit && (
                            <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg mb-4">
                                <h4 className="font-medium text-blue-900 mb-2">Direct Deposit Information</h4>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-blue-700 text-xs">Bank Name</p>
                                        <p className="font-medium">{organizerDetail.bankAccount.bank_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-blue-700 text-xs">Account Type</p>
                                        <p className="font-medium capitalize">{organizerDetail.bankAccount.account_type}</p>
                                    </div>
                                    <div>
                                        <p className="text-blue-700 text-xs">Routing Number</p>
                                        <p className="font-medium font-mono">{organizerDetail.bankAccount.routing_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-blue-700 text-xs">Account Number</p>
                                        <p className="font-medium font-mono">***{organizerDetail.bankAccount.account_number?.slice(-4)}</p>
                                    </div>
                                    <div>
                                        <p className="text-blue-700 text-xs">Purpose</p>
                                        <p className="font-medium capitalize">{organizerDetail.bankAccount.account_purpose}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <h4 className="font-medium text-sm text-gray-700 mb-3">Estimated Tax Payments</h4>
                        <div className="grid grid-cols-4 gap-3">
                            <div className="bg-gray-50 p-3 rounded border">
                                <p className="text-xs text-gray-500 mb-1">Q1</p>
                                <p className="font-bold">{formatCurrency(organizerDetail.bankAccount.est_q1)}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded border">
                                <p className="text-xs text-gray-500 mb-1">Q2</p>
                                <p className="font-bold">{formatCurrency(organizerDetail.bankAccount.est_q2)}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded border">
                                <p className="text-xs text-gray-500 mb-1">Q3</p>
                                <p className="font-bold">{formatCurrency(organizerDetail.bankAccount.est_q3)}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded border">
                                <p className="text-xs text-gray-500 mb-1">Q4</p>
                                <p className="font-bold">{formatCurrency(organizerDetail.bankAccount.est_q4)}</p>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Documents */}
            {
                organizerDetail.documents && organizerDetail.documents.length > 0 && (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Documents</h3>
                        <div className="space-y-2">
                            {organizerDetail.documents.map((doc) => (
                                <div key={doc.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-100 p-2 rounded">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium">{doc.file_name}</p>
                                            <div className="flex gap-3 text-xs text-gray-500 mt-1">
                                                {doc.documentType && (
                                                    <span className="bg-gray-100 px-2 py-0.5 rounded">{doc.documentType.name}</span>
                                                )}
                                                <span>{(doc.file_size / 1024).toFixed(2)} KB</span>
                                                <span className="capitalize">{doc.status}</span>
                                                <span>{formatDate(doc.uploaded_at)}</span>
                                            </div>
                                            {doc.notes && (
                                                <p className="text-xs text-gray-600 mt-1 italic">{doc.notes}</p>
                                            )}
                                        </div>
                                    </div>
                                    <a
                                        href={doc.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1.5 border border-blue-200 rounded hover:bg-blue-50 transition"
                                    >
                                        <EyeIcon className="w-4 h-4" />
                                        View
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }

            {/* Signature */}
            {
                organizerDetail.signature && (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Signature & Consent</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${organizerDetail.signature.consent_to_efile ? "bg-green-500" : "bg-gray-300"}`}>
                                    {organizerDetail.signature.consent_to_efile && (
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-sm">Consent to E-File</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${organizerDetail.signature.consent_to_disclose ? "bg-green-500" : "bg-gray-300"}`}>
                                    {organizerDetail.signature.consent_to_disclose && (
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-sm">Consent to Disclose</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${organizerDetail.signature.declaration_accurate ? "bg-green-500" : "bg-gray-300"}`}>
                                    {organizerDetail.signature.declaration_accurate && (
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-sm">Declaration of Accuracy</span>
                            </div>
                            {organizerDetail.signature.typed_signature && (
                                <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
                                    <p className="text-xs text-gray-500 mb-1">Signature</p>
                                    <p className="font-cursive text-2xl">{organizerDetail.signature.typed_signature}</p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Signed on {formatDate(organizerDetail.signature.signature_date)} from IP {organizerDetail.signature.ip_address}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }

            {/* Timeline */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Timeline</h3>
                <div className="space-y-3">
                    <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <div className="w-0.5 h-full bg-gray-300"></div>
                        </div>
                        <div className="pb-4">
                            <p className="font-medium text-sm">Created</p>
                            <p className="text-xs text-gray-500">{formatDate(organizerDetail.created_at)}</p>
                        </div>
                    </div>
                    {organizerDetail.submitted_at && (
                        <div className="flex gap-3">
                            <div className="flex flex-col items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                {organizerDetail.completed_at && <div className="w-0.5 h-full bg-gray-300"></div>}
                            </div>
                            <div className="pb-4">
                                <p className="font-medium text-sm">Submitted</p>
                                <p className="text-xs text-gray-500">{formatDate(organizerDetail.submitted_at)}</p>
                            </div>
                        </div>
                    )}
                    {organizerDetail.completed_at && (
                        <div className="flex gap-3">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <div>
                                <p className="font-medium text-sm">Completed</p>
                                <p className="text-xs text-gray-500">{formatDate(organizerDetail.completed_at)}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}