import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const useCustomToast = () => {
    const { toast } = useToast();

    return {
        success: (message: any) =>
            toast({
                title: "Success",
                description: message,
                variant: "default",
                className: cn("bg-green-500 text-white"),
            }),
        error: (message: any) =>
            toast({
                title: "Error",
                description: message,
                variant: "destructive",
                className: cn("bg-red-500 text-white"),
            }),
        warn: (message: any) =>
            toast({
                title: "Warning",
                description: message,
                variant: "default",
                className: cn("bg-yellow-500 text-black"),
            }),
        info: (message: any) =>
            toast({
                title: "Info",
                description: message,
                variant: "default",
                className: cn("bg-blue-500 text-white"),
            }),
    };
};

export default useCustomToast;