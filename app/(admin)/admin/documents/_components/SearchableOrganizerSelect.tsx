import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Loader2, User, X } from 'lucide-react';
import { useGetAllOrganizers } from '@/api/organizer';

interface OrganizerSelectProps {
    value: string;
    onChange: (organizerId: string) => void;
    placeholder?: string;
    className?: string;
}

const SearchableOrganizerSelect: React.FC<OrganizerSelectProps> = ({
    value,
    onChange,
    placeholder = 'Select organizer...',
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const limit = 10;
    const { data, isLoading, isFetching } = useGetAllOrganizers(page, limit, searchTerm);

    const organizers = data?.data?.data || [];
    const pagination = data?.data?.pagination;
    const selectedOrganizer = organizers.find((org: any) => org.id === value);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    const handleSelect = (organizerId: string) => {
        onChange(organizerId);
        setIsOpen(false);
        setSearchTerm('');
        setPage(1);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
        setSearchTerm('');
        setPage(1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const loadMore = () => {
        if (pagination?.hasNextPage) {
            setPage(prev => prev + 1);
        }
    };

    const getDisplayName = (org: any) => {
        return `${org.return_type} ${org.return_type} : ${org.tax_year}`;
    };

    return (
        <div ref={dropdownRef} className={`relative ${className}`}>
            {/* Select Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-2.5 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors flex items-center justify-between"
            >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    {selectedOrganizer ? (
                        <>
                            <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                            <span className="truncate">
                                {getDisplayName(selectedOrganizer)}
                                {selectedOrganizer.email && (
                                    <span className="text-sm text-gray-500 ml-2">({selectedOrganizer.email})</span>
                                )}
                            </span>
                        </>
                    ) : (
                        <span className="text-gray-500">{placeholder}</span>
                    )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                    {value && (
                        <X
                            className="h-4 w-4 text-gray-400 hover:text-gray-600"
                            onClick={handleClear}
                        />
                    )}
                    <ChevronDown
                        className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                </div>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                    {/* Search Input */}
                    <div className="p-2 border-b border-gray-200">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder="Search by name or email..."
                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="max-h-64 overflow-y-auto">
                        {isLoading && page === 1 ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                                <span className="ml-2 text-sm text-gray-600">Loading organizers...</span>
                            </div>
                        ) : organizers.length === 0 ? (
                            <div className="py-8 text-center text-sm text-gray-500">
                                {searchTerm ? 'No organizers found' : 'No organizers available'}
                            </div>
                        ) : (
                            <>
                                {organizers.map((org: any) => (
                                    <button
                                        key={org.id}
                                        onClick={() => handleSelect(org.id)}
                                        className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-start gap-3 ${value === org.id ? 'bg-blue-50' : ''
                                            }`}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                            <User className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate">
                                                {getDisplayName(org)}
                                            </p>
                                            {org.email && (
                                                <p className="text-sm text-gray-500 truncate">{org.email}</p>
                                            )}
                                            {org.phone && (
                                                <p className="text-xs text-gray-400 truncate">{org.phone}</p>
                                            )}
                                        </div>
                                        {value === org.id && (
                                            <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-2" />
                                        )}
                                    </button>
                                ))}

                                {/* Load More Button */}
                                {pagination?.hasNextPage && (
                                    <button
                                        onClick={loadMore}
                                        disabled={isFetching}
                                        className="w-full px-4 py-2.5 text-sm text-blue-600 hover:bg-gray-50 border-t border-gray-200 flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isFetching ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Loading...
                                            </>
                                        ) : (
                                            <>Load More ({pagination.totalDocs - organizers.length} more)</>
                                        )}
                                    </button>
                                )}

                                {/* Pagination Info */}
                                {pagination && (
                                    <div className="px-4 py-2 text-xs text-gray-500 text-center border-t border-gray-200 bg-gray-50">
                                        Showing {organizers.length} of {pagination.totalDocs} organizers
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchableOrganizerSelect;