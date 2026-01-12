import { Metadata } from 'next';
import FAQContent from '@/components/pages/faq-content';

export const metadata: Metadata = {
  title: "FAQ || Beyond Tax Consultants – Professional Accounting & Tax Services",
  description: "Beyond Tax Consultants provides professional accounting and tax services for businesses and individuals.",
  keywords: ["tax", "accounting", "consulting", "business services"],
  authors: [{ name: "Beyond Tax Consultants" }],
}

export default function FAQPage() {
  return <FAQContent />;
}