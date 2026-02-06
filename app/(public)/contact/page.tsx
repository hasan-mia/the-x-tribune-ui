import React from "react";
import { Metadata } from 'next';
import ContactContent from '@/components/pages/contact-content';

export const metadata: Metadata = {
  title: "Contact us || Beyond Tax Consultants – Professional Accounting & Tax Services",
  description: "Beyond Tax Consultants provides professional accounting and tax services for businesses and individuals.",
  keywords: ["tax", "accounting", "consulting", "business services"],
  authors: [{ name: "Beyond Tax Consultants" }],
}

export default function ContactPage() {
  return <ContactContent />;
}