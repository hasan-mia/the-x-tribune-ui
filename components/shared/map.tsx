import { useGetSettings } from "@/api/settings"

function MapSkeleton() {
    return (
        <div className="bg-muted rounded-2xl h-64 overflow-hidden border">
            <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="text-center space-y-2">
                    <div className="h-8 w-8 bg-gray-300 rounded-full mx-auto animate-pulse" />
                    <div className="h-3 w-32 bg-gray-300 rounded mx-auto animate-pulse" />
                </div>
            </div>
        </div>
    )
}

export default function Map() {
    const { data, isLoading, isError } = useGetSettings('map')

    if (isLoading) {
        return <MapSkeleton />
    }

    if (isError || !data?.data?.value) {
        return null
    }

    const mapUrl = data.data.value

    return (
        <div className="bg-muted rounded-2xl h-64 overflow-hidden border">
            <iframe
                width="100%"
                height="100%"
                loading="lazy"
                allowFullScreen
                className="rounded-2xl"
                src={mapUrl}
                title="Location Map"
            />
        </div>
    )
}