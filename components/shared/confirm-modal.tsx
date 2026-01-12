import React from "react";

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    isLoading?: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    isLoading,
    isOpen,
    onClose,
    onConfirm,
    title = "Are you sure?",
    description = "This action cannot be undone. Do you want to proceed?",
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-[90%] sm:w-[400px]">
                <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                    {title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    {description}
                </p>

                <div className="flex justify-between mt-6 space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        No
                    </button>
                    <button
                        disabled={isLoading && isLoading}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`px-4 py-2  bg-red-600 text-white rounded hover:bg-red-700 ${isLoading && "cursor-not-allowed"
                            }`}
                    >
                        {isLoading ? "Deleting..." : "Yes"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;