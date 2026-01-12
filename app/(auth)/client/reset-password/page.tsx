import ResetPasswordForm from '@/app/(public)/auth/ResetPasswordForm';
import LoadingSkeleton from '@/components/shared/skelton/loading-skeleton';
import { Suspense } from 'react';


export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<LoadingSkeleton />}>
            <ResetPasswordForm />
        </Suspense>
    );
}