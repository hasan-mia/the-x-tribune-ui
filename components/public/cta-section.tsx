"use client";

import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CtaSection() {
  const router = useRouter();
  return (
    <section className="py-24 px-4 bg-gradient-to-br from-primary via-primary to-blue-700 text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />

      <div className="relative max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold">Ready to Optimize Your Finances?</h2>
        <p className="text-xl opacity-95 max-w-2xl mx-auto leading-relaxed">
          Partner with a team that's committed to your financial success. Schedule a complimentary consultation today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button size="lg" variant="secondary" className="text-lg px-8 h-14 shadow-xl cursor-pointer" onClick={() => router.push("/free-consultants")}>
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 h-14 bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white"
          >
            Call (555) 123-4567
          </Button>
        </div>

        <div className="pt-8 flex flex-wrap justify-center gap-8 text-sm opacity-90">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            <span>Free Consultation</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            <span>No Obligations</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            <span>Quick Response</span>
          </div>
        </div>
      </div>
    </section>
  );
}