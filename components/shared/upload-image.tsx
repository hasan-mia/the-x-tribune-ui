import { Upload, X } from 'lucide-react'
import React from 'react'

export default function UploadImage({ formState, uploading, handleFileChange, remove }: any) {
    return (
        <div>
            <label className="text-sm font-medium block mb-2">Category Icon</label>

            {/* Upload Button or Preview */}
            {!formState.icon ? (
                <div>
                    <label className="cursor-pointer">
                        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition">
                            <Upload className="mx-auto h-10 w-10 mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                {uploading ? "Uploading..." : "Click to upload icon"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Recommended: Square image (PNG, JPG, WebP)
                            </p>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                    </label>
                </div>
            ) : (
                <div className="relative inline-block">
                    <img
                        src={formState.icon}
                        alt="Category icon"
                        className="w-32 h-32 object-cover rounded-lg border"
                    />
                    <button
                        type="button"
                        onClick={remove}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    )
}
