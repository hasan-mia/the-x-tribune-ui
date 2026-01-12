"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import {
    type MutationParameters,
    updateJsonMutationConfig,
    useGet,
} from "@/api/api"
import useCustomToast from "@/hooks/use-custom-toast"
import { useDebouncedValue } from "@/utils/debounce"

// Types
export type OrganizerStatus = "draft" | "submitted" | "in_progress" | "completed" | "rejected"
export type ReturnType = "individual" | "joint" | "married_separate" | "head_of_household"

interface Taxpayer {
    id: string
    organizer_id: string
    taxpayer_type: string
    first_name: string
    middle_name: string | null
    last_name: string
    suffix: string | null
    ssn: string
    date_of_birth: string
    occupation: string | null
    phone: string | null
    email: string | null
    filing_status: string | null
    identity_protection_pin: string | null
    is_65_or_older: boolean
    is_blind: boolean
    can_be_claimed_dependent: boolean
    presidential_campaign_fund: boolean
    created_at: string
    updated_at: string
}

interface AddressInfo {
    id: string
    organizer_id: string
    address_line1: string
    apt_number: string | null
    address_line2: string | null
    city: string
    state: string
    zip_code: string
    address_changed: boolean
    is_po_box: boolean
    has_different_mailing: boolean
    mailing_address: string | null
    mailing_city: string | null
    mailing_state: string | null
    mailing_zip: string | null
    created_at: string
    updated_at: string
}

interface GeneralInfo {
    id: string
    organizer_id: string
    virtual_currency: boolean
    health_insurance_full_year: boolean
    created_at: string
    updated_at: string
}

interface Dependent {
    id: string
    organizer_id: string
    first_name: string
    last_name: string
    ssn: string
    date_of_birth: string
    relationship: string
    months_lived_with_you: number
    is_student: boolean
    is_disabled: boolean
    child_tax_credit_eligible: boolean
    dependent_care_eligible: boolean
}

interface IncomeSource {
    id: string
    organizer_id: string
    source_type_id: string
    employer_name: string
    employer_ein: string
    wages_amount: number
    federal_tax_withheld: number
    social_security_wages: number
    social_security_tax: number
    medicare_wages: number
    medicare_tax: number
    state_wages: number
    state_tax_withheld: number
    retirement_plan: boolean
    additional_data: any
    sourceType?: {
        id: string
        name: string
        code: string
        description: string
    }
}

interface SelfEmployment {
    id: string
    organizer_id: string
    has_self_employment: boolean
    business_name: string
    business_type: string
    business_ein: string
    principal_business_code: string
    accounting_method: string
    gross_receipts: number
    returns_allowances: number
    cost_of_goods_sold: number
    advertising: number
    car_truck_expenses: number
    contract_labor: number
    insurance: number
    legal_professional: number
    office_expense: number
    supplies: number
    travel: number
    meals: number
    utilities: number
    home_office_deduction: boolean
    home_office_sqft: number
    home_total_sqft: number
}

interface Deduction {
    id: string
    organizer_id: string
    deduction_type: string
    amount: number
}

interface TaxCredit {
    id: string
    organizer_id: string
    has_child_care_credit: boolean
    care_provider_name: string | null
    care_provider_ein: string | null
    child_care_amount: number | null
    has_education_credit: boolean
    student_name: string | null
    institution_name: string | null
    tuition_paid: number | null
    received_1098t: boolean
    has_energy_credit: boolean
    solar_cost: number | null
    energy_improvements: number | null
    has_ev_credit: boolean
    ev_make_model: string | null
    ev_purchase_date: string | null
    ev_purchase_price: number | null
    ev_vin: string | null
    has_saver_credit: boolean
    retirement_contributions: number | null
}

interface ForeignIncome {
    id: string
    organizer_id: string
    has_foreign_income: boolean
    foreign_country: string | null
    income_type: string | null
    amount_in_usd: number | null
    foreign_tax_paid: number | null
    days_outside_us: number | null
    has_fbar_requirement: boolean
    max_foreign_account_value: number | null
    foreign_bank_name: string | null
    has_form8938_requirement: boolean
}

interface BankAccount {
    id: string
    organizer_id: string
    use_direct_deposit: boolean
    bank_name: string | null
    routing_number: string | null
    account_number: string | null
    account_type: string | null
    account_purpose: string | null
    est_q1: number
    est_q2: number
    est_q3: number
    est_q4: number
}

interface Document {
    id: string
    organizer_id: string
    document_type_id: string
    file_name: string
    file_url: string
    file_path: string
    file_size: number
    mime_type: string
    status: string
    notes: string | null
    uploaded_by: string
    uploaded_at: string
    documentType?: {
        id: string
        name: string
        code: string
        description: string
        required: boolean
    }
}

interface Signature {
    id: string
    organizer_id: string
    consent_to_efile: boolean
    consent_to_disclose: boolean
    declaration_accurate: boolean
    pin: string | null
    signature_date: string | null
    typed_signature: string | null
    ip_address: string | null
}

export interface TaxOrganizer {
    id: string
    user_id: string
    mode: string
    tax_year: number
    return_type: ReturnType
    client_name: string
    is_amended: boolean
    extension_filed: boolean
    extension_confirmation: string | null
    status: OrganizerStatus
    current_step: number
    submitted_at: string | null
    completed_at: string | null
    created_at: string
    updated_at: string
    Taxpayers?: Taxpayer[]
    address?: AddressInfo
    generalInfo?: GeneralInfo
    dependents?: Dependent[]
    incomeSources?: IncomeSource[]
    selfEmployment?: SelfEmployment
    deductions?: Deduction[]
    credits?: TaxCredit
    foreignIncome?: ForeignIncome
    bankAccount?: BankAccount
    documents?: Document[]
    signature?: Signature
}

interface Pagination {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
    nextPage: number | null
    prevPage: number | null
}

export default function useTaxOrganizers(pageName?: string) {
    const toast = useCustomToast()
    const queryClient = useQueryClient()
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [taxYearFilter, setTaxYearFilter] = useState<string>("all")
    const [selectedOrganizerId, setSelectedOrganizerId] = useState<string | null>(null)

    // Debounce search term with 500ms delay
    const debouncedSearch = useDebouncedValue(search, 500)

    // Build query params - now uses debounced search
    const queryParams = useMemo(() => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        })

        if (debouncedSearch) params.append("search", debouncedSearch)
        if (statusFilter && statusFilter !== "all") params.append("status", statusFilter)
        if (taxYearFilter && taxYearFilter !== "all") params.append("tax_year", taxYearFilter)

        return params.toString()
    }, [page, limit, debouncedSearch, statusFilter, taxYearFilter])

    // Fetch tax organizers list
    const {
        data: organizersData,
        isPending: organizersLoading,
        refetch: refetchOrganizers,
        isError: organizersError
    } = useGet(
        `/organizers/admin/all?${queryParams}`,
        `tax_organizers_list_${queryParams}`,
        pageName === "tax-organizers",
    )

    // Fetch single organizer by ID
    const {
        data: organizerDetailData,
        isPending: organizerDetailLoading,
        refetch: refetchOrganizerDetail,
        isError: organizerDetailError
    } = useGet(
        selectedOrganizerId ? `/organizers/${selectedOrganizerId}` : "",
        `tax_organizer_detail_${selectedOrganizerId}`,
        !!selectedOrganizerId,
    )



    // Update mutation
    // Update mutation - fix the query invalidation
    const updateMutation = useMutation<any, Error, MutationParameters>(
        updateJsonMutationConfig(queryClient, `tax_organizers_list_${queryParams}`), // Use the correct key
    )

    // Update the handleStatusChange function
    const handleStatusChange = async (
        organizerId: string,
        status: OrganizerStatus
    ) => {
        try {
            const response = await updateMutation.mutateAsync({
                url: `/organizers/${organizerId}`,
                data: { organizer: { status } },
            })

            if (response?.data) {
                toast.success("Organizer status updated successfully")

                // Invalidate with wildcard to catch all variations
                await Promise.all([
                    queryClient.invalidateQueries({
                        predicate: (query) =>
                            query.queryKey[0]?.toString().startsWith('tax_organizers_list') ?? false
                    }),
                    queryClient.invalidateQueries({
                        queryKey: [`tax_organizer_detail_${organizerId}`]
                    })
                ])
                return response.data
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message ||
                error?.message ||
                "Failed to update organizer status"
            toast.error(errorMessage)
            throw error
        }
    }

    // Load organizer details
    const loadOrganizerDetails = useCallback(async (organizerId: string) => {
        setSelectedOrganizerId(organizerId)
    }, [])

    // Clear organizer details
    const clearOrganizerDetails = useCallback(() => {
        setSelectedOrganizerId(null)
    }, [])

    const fetchData = useCallback(async () => {
        await refetchOrganizers()
    }, [refetchOrganizers])

    const memoizedFetchData = useMemo(() => fetchData, [fetchData])

    useEffect(() => {
        if (pageName === "tax-organizers") {
            memoizedFetchData()
        }
    }, [memoizedFetchData, page, limit, debouncedSearch, statusFilter, taxYearFilter, pageName])

    // Reset page to 1 when filters change (including debounced search)
    useEffect(() => {
        setPage(1)
    }, [debouncedSearch, statusFilter, taxYearFilter])

    return {
        // Pagination
        page,
        setPage,
        limit,
        setLimit,

        // Filters
        search,
        setSearch,
        debouncedSearch, // Expose debounced value if needed
        statusFilter,
        setStatusFilter,
        taxYearFilter,
        setTaxYearFilter,

        // Data
        organizers: (organizersData?.data?.data || []) as TaxOrganizer[],
        pagination: (organizersData?.data?.pagination || {
            total: organizersData?.data?.total || 0,
            page: organizersData?.data?.page || 1,
            limit: organizersData?.data?.limit || 10,
            totalPages: organizersData?.data?.totalPages || 0,
            hasNextPage: organizersData?.data?.hasNextPage || false,
            hasPrevPage: organizersData?.data?.hasPrevPage || false,
            nextPage: organizersData?.data?.nextPage || null,
            prevPage: organizersData?.data?.prevPage || null,
        }) as Pagination,

        // Single organizer detail
        organizerDetail: organizerDetailData?.data as TaxOrganizer | null,
        selectedOrganizerId,
        loadOrganizerDetails,
        clearOrganizerDetails,

        // Loading states
        organizersLoading,
        organizerDetailLoading,
        isUpdating: updateMutation.isPending,

        // Error states
        organizersError,
        organizerDetailError,

        // Actions
        handleStatusChange,
        refetchOrganizers,
        refetchOrganizerDetail,
    }
}