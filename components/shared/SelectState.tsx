import React, { ChangeEvent } from 'react';

import { usaStates } from '@/utils/static-data';
import Input from '@/app/(client)/organizer/_components/Input';
import Select from '@/app/(client)/organizer/_components/Select';

interface AddressData {
    addressLine1?: string;
    aptNumber?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
}

interface SelectStateProps {
    value: AddressData;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    required?: boolean;
    showAptNumber?: boolean;
    showAddressLine2?: boolean;
}

const SelectState: React.FC<SelectStateProps> = ({
    value,
    onChange,
    required = false,
    showAptNumber = true,
    showAddressLine2 = true,
}) => {
    return (
        <div className="grid grid-cols-2 gap-3">
            <Input
                label="Street Address"
                name="addressLine1"
                value={value.addressLine1 || ''}
                onChange={onChange}
                required={required}
                className="col-span-2"
            />

            {showAptNumber && (
                <Input
                    label="Apt/Suite/Unit"
                    name="aptNumber"
                    value={value.aptNumber || ''}
                    onChange={onChange}
                />
            )}

            {showAddressLine2 && (
                <Input
                    label="Address Line 2"
                    name="addressLine2"
                    value={value.addressLine2 || ''}
                    onChange={onChange}
                />
            )}

            <Input
                label="City"
                name="city"
                value={value.city || ''}
                onChange={onChange}
                required={required}
            />

            <Select
                label="State"
                name="state"
                value={value.state || ''}
                onChange={onChange}
                required={required}
                options={usaStates}
            />

            <Input
                label="ZIP Code"
                name="zipCode"
                value={value.zipCode || ''}
                onChange={onChange}
                required={required}
                placeholder="12345 or 12345-6789"
            />
        </div>
    );
};

export default SelectState;