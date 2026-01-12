export interface ContactBlock {
    icon: string;
    title: string;
    details: string[];
    link?: string;
}

export interface TimelineItem {
    year: string;
    title: string;
    description: string;
}
export interface AboutSection {
    title: string;
    description: string;
}

export interface Organizer {
    mode?: 'new' | 'existing';
    taxYear?: number;
    returnType?: 'individual' | 'amended';
    clientName?: string;
    isAmended?: boolean;
    extensionFiled?: boolean;
    extensionConfirmation?: string;
    selectedId?: string;
    status?: 'draft' | 'submitted' | 'in_review' | 'completed';
    currentStep?: number;
}
export interface Taxpayer {
    taxpayerType?: 'primary' | 'spouse';
    firstName?: string;
    middleName?: string;
    lastName?: string;
    suffix?: string;
    ssn?: string;
    dateOfBirth?: string;
    occupation?: string;
    phone?: string;
    email?: string;
    filingStatus?: 'single' | 'married_joint' | 'married_separate' | 'head_household' | 'qualifying_widow';
    identityProtectionPin?: string;
    is65OrOlder?: boolean;
    isBlind?: boolean;
    canBeClaimedDependent?: boolean;
    presidentialCampaignFund?: boolean;
}

export interface Address {
    addressLine1?: string;
    aptNumber?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    addressChanged?: boolean;
    isPoBox?: boolean;
    hasDifferentMailing?: boolean;
    mailingAddress?: string;
    mailingCity?: string;
    mailingState?: string;
    mailingZip?: string;
}

export interface Dependent {
    id: number;
    firstName?: string;
    lastName?: string;
    ssn?: string;
    dateOfBirth?: string;
    relationship?: 'son' | 'daughter' | 'stepchild' | 'foster_child' | 'sibling' | 'parent' | 'grandchild' | 'other';
    monthsLivedWithYou?: number;
    isStudent?: boolean;
    isDisabled?: boolean;
    childTaxCreditEligible?: boolean;
    dependentCareEligible?: boolean;
}

export interface IncomeSource {
    id: number;
    sourceType?: string;
    sourceTypeId?: string;
    employerName?: string;
    employerEin?: string;
    wagesAmount?: number;
    federalTaxWithheld?: number;
    socialSecurityWages?: number;
    socialSecurityTax?: number;
    medicareWages?: number;
    medicareTax?: number;
    stateWages?: number;
    stateTaxWithheld?: number;
    retirementPlan?: boolean;
}

export interface SelfEmployment {
    hasSelfEmployment?: boolean;
    businessName?: string;
    businessType?: 'sole_prop' | 'single_llc';
    businessEin?: string;
    principalBusinessCode?: string;
    accountingMethod?: 'cash' | 'accrual';
    grossReceipts?: number;
    returnsAllowances?: number;
    costOfGoodsSold?: number;
    advertising?: number;
    carTruckExpenses?: number;
    contractLabor?: number;
    insurance?: number;
    legalProfessional?: number;
    officeExpense?: number;
    supplies?: number;
    travel?: number;
    meals?: number;
    utilities?: number;
    homeOfficeDeduction?: boolean;
    homeOfficeSqft?: number;
    homeTotalSqft?: number;
}

export interface Deduction {
    id: number;
    deductionType?: 'medical_dental' | 'state_local_taxes' | 'real_estate_taxes' | 'mortgage_interest' | 'charitable_cash' | 'charitable_noncash' | 'student_loan_interest' | 'educator_expenses' | 'ira_contribution' | 'hsa_contribution';
    amount?: number;
}

export interface Credits {
    hasChildCareCredit?: boolean;
    careProviderName?: string;
    careProviderEin?: string;
    childCareAmount?: number;
    hasEducationCredit?: boolean;
    studentName?: string;
    institutionName?: string;
    tuitionPaid?: number;
    received1098t?: boolean;
    hasEnergyCredit?: boolean;
    solarCost?: number;
    energyImprovements?: number;
    hasEvCredit?: boolean;
    evMakeModel?: string;
    evPurchaseDate?: string;
    evPurchasePrice?: number;
    evVin?: string;
    hasSaverCredit?: boolean;
    retirementContributions?: number;
}

export interface ForeignIncome {
    hasForeignIncome?: boolean;
    foreignCountry?: string;
    incomeType?: 'wages' | 'self_employment' | 'rental' | 'dividends' | 'interest' | 'pension';
    amountInUsd?: number;
    foreignTaxPaid?: number;
    daysOutsideUs?: number;
    hasFbarRequirement?: boolean;
    maxForeignAccountValue?: number;
    foreignBankName?: string;
    hasForm8938Requirement?: boolean;
}
export interface BankAccount {
    useDirectDeposit?: boolean;
    bankName?: string;
    routingNumber?: string;
    accountNumber?: string;
    accountType?: 'checking' | 'savings';
    accountPurpose?: 'refund' | 'payment' | 'both';
    estQ1?: number;
    estQ2?: number;
    estQ3?: number;
    estQ4?: number;
}

export interface SignatureType {
    consentToEfile?: boolean;
    consentToDisclose?: boolean;
    declarationAccurate?: boolean;
    pin?: string;
    signatureDate?: string;
    typedSignature?: string;
}

export interface GeneralInfo {
    virtualCurrency?: boolean;
    healthInsuranceFullYear?: boolean;
}
