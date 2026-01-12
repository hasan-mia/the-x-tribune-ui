import { FormData } from "@/app/(client)/organizer/page";
import { Briefcase, Building, Star, Zap } from "lucide-react";

export const generateTimeSlots = (date: Date): string[] => {
    const slots: string[] = [];
    for (let hour = 10; hour <= 23; hour++) {
        for (let min of [0, 15, 30, 45]) {
            const displayHour = hour > 12 ? hour - 12 : hour;
            const period = hour >= 12 ? 'PM' : 'AM';
            const time = `${displayHour}:${min.toString().padStart(2, '0')} ${period}`;
            slots.push(time);
        }
    }
    return slots;
};

export const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day));
    }
    return days;
};

export const formatDateDisplay = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

export const formatDateLong = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
};

export const formatDateTime = (dateString: string | number | Date) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}


// Format date helper
export const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date)
}

export const convertTo24Hour = (time: string): string => {
    // If already in 24-hour format (no AM/PM), return as is
    if (!time.includes('AM') && !time.includes('PM')) {
        return time;
    }

    const [timePart, period] = time.split(' ');
    const [hours, minutes] = timePart.split(':');
    let hour = parseInt(hours);

    if (period === 'PM' && hour !== 12) {
        hour += 12;
    } else if (period === 'AM' && hour === 12) {
        hour = 0;
    }

    return `${hour.toString().padStart(2, '0')}:${minutes}`;
};

export const isValidUrl = (string: string) => {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

export const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    star: Star,
    briefcase: Briefcase,
    building: Building,
    zap: Zap,
}

export const getRandomIcon = (seed: string) => {
    const icons = [Star, Briefcase, Building, Zap];
    const index = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % icons.length;
    return icons[index];
}

export const getDocumentIcon = (name: string): string => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('w-2') || nameLower.includes('wage')) return '📄';
    if (nameLower.includes('1099')) return '📄';
    if (nameLower.includes('mortgage') || nameLower.includes('1098') && !nameLower.includes('e') && !nameLower.includes('t')) return '🏠';
    if (nameLower.includes('tuition') || nameLower.includes('1098-t')) return '🎓';
    if (nameLower.includes('student') || nameLower.includes('1098-e')) return '🎓';
    if (nameLower.includes('k-1') || nameLower.includes('schedule')) return '📊';
    if (nameLower.includes('prior') || nameLower.includes('return')) return '📁';
    if (nameLower.includes('id') || nameLower.includes('license') || nameLower.includes('driver')) return '🪪';
    if (nameLower.includes('social') || nameLower.includes('security')) return '🪪';
    if (nameLower.includes('receipt') || nameLower.includes('invoice')) return '🧾';
    if (nameLower.includes('bank') || nameLower.includes('statement')) return '🏦';
    return '📁';
};


/**
 * Transform frontend form data to match the API payload structure
 * Based on the Postman example provided
 */
export const transformToAPIPayload = (formData: FormData) => {
    // Remove temporary 'id' fields that are only used in frontend
    const cleanDependents = formData.dependents?.map(dep => {
        const { id, ...rest } = dep;
        return rest;
    }) || [];

    const cleanIncomeSources = formData.incomeSources?.map(income => {
        const { id, sourceType, ...rest } = income;
        return rest;
    }) || [];

    const cleanDeductions = formData.deductions?.map(ded => {
        const { id, ...rest } = ded;
        return rest;
    }) || [];

    // Construct the API payload
    const payload = {
        organizer: {
            mode: formData.organizer?.mode || 'new',
            taxYear: formData.organizer?.taxYear || new Date().getFullYear(),
            returnType: formData.organizer?.returnType || 'individual',
            clientName: formData.organizer?.clientName || '',
            isAmended: formData.organizer?.isAmended || false,
            extensionFiled: formData.organizer?.extensionFiled || false,
            extensionConfirmation: formData.organizer?.extensionConfirmation || null
        },

        generalInfo: {
            virtualCurrency: formData.generalInfo?.virtualCurrency ?? false,
            healthInsuranceFullYear: formData.generalInfo?.healthInsuranceFullYear ?? true
        },

        taxpayers: formData.taxpayers?.map(taxpayer => ({
            taxpayerType: taxpayer.taxpayerType || 'primary',
            firstName: taxpayer.firstName || '',
            middleName: taxpayer.middleName || null,
            lastName: taxpayer.lastName || '',
            suffix: taxpayer.suffix || null,
            ssn: taxpayer.ssn || '',
            dateOfBirth: taxpayer.dateOfBirth || '',
            occupation: taxpayer.occupation || null,
            phone: taxpayer.phone || null,
            email: taxpayer.email || null,
            filingStatus: taxpayer.filingStatus || null,
            identityProtectionPin: taxpayer.identityProtectionPin || null,
            is65OrOlder: taxpayer.is65OrOlder ?? false,
            isBlind: taxpayer.isBlind ?? false,
            canBeClaimedDependent: taxpayer.canBeClaimedDependent ?? false,
            presidentialCampaignFund: taxpayer.presidentialCampaignFund ?? false
        })) || [],

        address: {
            addressLine1: formData.address?.addressLine1 || '',
            aptNumber: formData.address?.aptNumber || null,
            addressLine2: formData.address?.addressLine2 || null,
            city: formData.address?.city || '',
            state: formData.address?.state || '',
            zipCode: formData.address?.zipCode || '',
            addressChanged: formData.address?.addressChanged ?? false,
            isPoBox: formData.address?.isPoBox ?? false,
            hasDifferentMailing: formData.address?.hasDifferentMailing ?? false,
            mailingAddress: formData.address?.mailingAddress || null,
            mailingCity: formData.address?.mailingCity || null,
            mailingState: formData.address?.mailingState || null,
            mailingZip: formData.address?.mailingZip || null
        },

        dependents: cleanDependents.map(dep => ({
            firstName: dep.firstName || '',
            lastName: dep.lastName || '',
            ssn: dep.ssn || '',
            dateOfBirth: dep.dateOfBirth || '',
            relationship: dep.relationship || 'son',
            monthsLivedWithYou: dep.monthsLivedWithYou || 12,
            isStudent: dep.isStudent ?? false,
            isDisabled: dep.isDisabled ?? false,
            childTaxCreditEligible: dep.childTaxCreditEligible ?? false,
            dependentCareEligible: dep.dependentCareEligible ?? false
        })),

        incomeSources: cleanIncomeSources.map(income => ({
            sourceTypeId: income.sourceTypeId || '',
            employerName: income.employerName || '',
            employerEin: income.employerEin || '',
            wagesAmount: income.wagesAmount || 0,
            federalTaxWithheld: income.federalTaxWithheld || 0,
            socialSecurityWages: income.socialSecurityWages || 0,
            socialSecurityTax: income.socialSecurityTax || 0,
            medicareWages: income.medicareWages || 0,
            medicareTax: income.medicareTax || 0,
            stateWages: income.stateWages || 0,
            stateTaxWithheld: income.stateTaxWithheld || 0,
            retirementPlan: income.retirementPlan ?? false
        })),

        selfEmployment: formData.selfEmployment ? {
            hasSelfEmployment: formData.selfEmployment.hasSelfEmployment ?? false,
            businessName: formData.selfEmployment.businessName || null,
            businessType: formData.selfEmployment.businessType || null,
            businessEin: formData.selfEmployment.businessEin || null,
            principalBusinessCode: formData.selfEmployment.principalBusinessCode || null,
            accountingMethod: formData.selfEmployment.accountingMethod || 'cash',
            grossReceipts: formData.selfEmployment.grossReceipts || 0,
            returnsAllowances: formData.selfEmployment.returnsAllowances || 0,
            costOfGoodsSold: formData.selfEmployment.costOfGoodsSold || 0,
            advertising: formData.selfEmployment.advertising || 0,
            carTruckExpenses: formData.selfEmployment.carTruckExpenses || 0,
            contractLabor: formData.selfEmployment.contractLabor || 0,
            insurance: formData.selfEmployment.insurance || 0,
            legalProfessional: formData.selfEmployment.legalProfessional || 0,
            officeExpense: formData.selfEmployment.officeExpense || 0,
            supplies: formData.selfEmployment.supplies || 0,
            travel: formData.selfEmployment.travel || 0,
            meals: formData.selfEmployment.meals || 0,
            utilities: formData.selfEmployment.utilities || 0,
            homeOfficeDeduction: formData.selfEmployment.homeOfficeDeduction ?? false,
            homeOfficeSqft: formData.selfEmployment.homeOfficeSqft || null,
            homeTotalSqft: formData.selfEmployment.homeTotalSqft || null
        } : { hasSelfEmployment: false },

        deductions: cleanDeductions.map(ded => ({
            deductionType: ded.deductionType || '',
            amount: ded.amount || 0
        })),

        credits: formData.credits ? {
            hasChildCareCredit: formData.credits.hasChildCareCredit ?? false,
            careProviderName: formData.credits.careProviderName || null,
            careProviderEin: formData.credits.careProviderEin || null,
            childCareAmount: formData.credits.childCareAmount || null,
            hasEducationCredit: formData.credits.hasEducationCredit ?? false,
            studentName: formData.credits.studentName || null,
            institutionName: formData.credits.institutionName || null,
            tuitionPaid: formData.credits.tuitionPaid || null,
            received1098t: formData.credits.received1098t ?? false,
            hasEnergyCredit: formData.credits.hasEnergyCredit ?? false,
            solarCost: formData.credits.solarCost || null,
            energyImprovements: formData.credits.energyImprovements || null,
            hasEvCredit: formData.credits.hasEvCredit ?? false,
            evMakeModel: formData.credits.evMakeModel || null,
            evPurchaseDate: formData.credits.evPurchaseDate || null,
            evPurchasePrice: formData.credits.evPurchasePrice || null,
            evVin: formData.credits.evVin || null,
            hasSaverCredit: formData.credits.hasSaverCredit ?? false,
            retirementContributions: formData.credits.retirementContributions || null
        } : {},

        foreignIncome: formData.foreignIncome ? {
            hasForeignIncome: formData.foreignIncome.hasForeignIncome ?? false,
            foreignCountry: formData.foreignIncome.foreignCountry || null,
            incomeType: formData.foreignIncome.incomeType || null,
            amountInUsd: formData.foreignIncome.amountInUsd || null,
            foreignTaxPaid: formData.foreignIncome.foreignTaxPaid || null,
            daysOutsideUs: formData.foreignIncome.daysOutsideUs || null,
            hasFbarRequirement: formData.foreignIncome.hasFbarRequirement ?? false,
            maxForeignAccountValue: formData.foreignIncome.maxForeignAccountValue || null,
            foreignBankName: formData.foreignIncome.foreignBankName || null,
            hasForm8938Requirement: formData.foreignIncome.hasForm8938Requirement ?? false
        } : { hasForeignIncome: false },

        bankAccount: formData.bankAccount ? {
            useDirectDeposit: formData.bankAccount.useDirectDeposit ?? false,
            bankName: formData.bankAccount.bankName || null,
            routingNumber: formData.bankAccount.routingNumber || null,
            accountNumber: formData.bankAccount.accountNumber || null,
            accountType: formData.bankAccount.accountType || null,
            accountPurpose: formData.bankAccount.accountPurpose || null,
            estQ1: formData.bankAccount.estQ1 || 0,
            estQ2: formData.bankAccount.estQ2 || 0,
            estQ3: formData.bankAccount.estQ3 || 0,
            estQ4: formData.bankAccount.estQ4 || 0
        } : {},

        documents: formData.documents?.map(doc => ({
            document_type_id: doc.document_type_id || '',
            file_name: doc.file_name || '',
            file_url: doc.file_url || '',
            file_path: doc.file_path || '',
            file_size: doc.file_size || 0,
            mime_type: doc.mime_type || 'application/pdf',
            status: doc.status || 'uploaded',
            notes: doc.notes || null,
            typeName: doc.typeName || '',
            uploaded_at: doc.uploaded_at || new Date().toISOString()
        })) || [],

        signature: formData.signature ? {
            consentToEfile: formData.signature.consentToEfile ?? false,
            consentToDisclose: formData.signature.consentToDisclose ?? false,
            declarationAccurate: formData.signature.declarationAccurate ?? false,
            pin: formData.signature.pin || '',
            signatureDate: formData.signature.signatureDate || new Date().toISOString().split('T')[0],
            typedSignature: formData.signature.typedSignature || ''
        } : {}
    };

    return payload;
};

/**
 * Validate required fields before submission
 */
export const validateFormData = (formData: FormData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Organizer validation
    if (!formData.organizer?.clientName) {
        errors.push('Client name is required');
    }
    if (!formData.organizer?.taxYear) {
        errors.push('Tax year is required');
    }

    // Taxpayer validation
    if (!formData.taxpayers || formData.taxpayers.length === 0) {
        errors.push('At least one taxpayer is required');
    } else {
        formData.taxpayers.forEach((taxpayer, index) => {
            if (!taxpayer.firstName) errors.push(`Taxpayer ${index + 1}: First name is required`);
            if (!taxpayer.lastName) errors.push(`Taxpayer ${index + 1}: Last name is required`);
            if (!taxpayer.ssn) errors.push(`Taxpayer ${index + 1}: SSN is required`);
        });
    }

    // Address validation
    if (!formData.address?.addressLine1) {
        errors.push('Address line 1 is required');
    }
    if (!formData.address?.city) {
        errors.push('City is required');
    }
    if (!formData.address?.state) {
        errors.push('State is required');
    }
    if (!formData.address?.zipCode) {
        errors.push('ZIP code is required');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Example usage in your form component:
 * 
 * const handleSubmit = async () => {
 *   const validation = validateFormData(formData);
 *   
 *   if (!validation.isValid) {
 *     validation.errors.forEach(error => toast.error(error));
 *     return;
 *   }
 *   
 *   const apiPayload = transformToAPIPayload(formData);
 *   const response = await handleCreateOrganizer(apiPayload);
 * };
 */

