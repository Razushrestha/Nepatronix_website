import { connectToDatabase } from "@/lib/mongodb";
import { ContactPage as ContactPageModel } from "@/lib/models";
import ContactClient from "./ContactClient";

export const revalidate = 3600;

interface ContactPageData {
  pageTitle: string;
  pageDescription: string;
  contactDetails: {
    email: string;
    phone: string;
    address: string;
    hours: string;
  };
  formTitle: string;
  formSubtitle: string;
  socialMedia: {
    platform: string;
    url: string;
  }[];
}

const DEFAULT_CONTACT: ContactPageData = {
  pageTitle: "Contact Us",
  pageDescription: "Reach out to Nepatronix for courses, collaborations, and STEM solutions.",
  contactDetails: {
    email: "info@nepatronix.org",
    phone: "+977-9803661701",
    address: "Kupondole, Lalitpur, Nepal",
    hours: "Sun-Fri, 9:00 AM - 6:00 PM",
  },
  formTitle: "Send us a message",
  formSubtitle: "Tell us how we can help.",
  socialMedia: [
    { platform: "LinkedIn", url: "https://www.linkedin.com/company/nepatronix" },
    { platform: "Facebook", url: "https://www.facebook.com/NepaTronixx" },
  ],
};

async function getContactData(): Promise<ContactPageData> {
  try {
    await connectToDatabase();
    const data = await ContactPageModel.findOne({ key: "contact" }).lean<ContactPageData | null>();
    return data || DEFAULT_CONTACT;
  } catch (err) {
    console.warn("Contact page: MongoDB unavailable, using defaults.", err);
    return DEFAULT_CONTACT;
  }
}

export default async function ContactPage() {
  const data = await getContactData();
  const socialLinks = data.socialMedia?.length
    ? data.socialMedia
    : [
        { platform: "LinkedIn", url: "https://www.linkedin.com/company/nepatronix" },
        { platform: "Facebook", url: "https://www.facebook.com/NepaTronixx" },
      ];
  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": data.pageTitle || "Contact Nepatronix",
    "url": "https://nepatronix.org/contact",
    "description": data.pageDescription,
    "mainEntity": {
      "@type": "EducationalOrganization",
      "name": "Nepatronix Engineering Solutions",
      "url": "https://nepatronix.org",
      "email": data.contactDetails?.email,
      "telephone": data.contactDetails?.phone,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": data.contactDetails?.address,
        "addressLocality": "Lalitpur",
        "addressRegion": "Bagmati",
        "postalCode": "44700",
        "addressCountry": "NP"
      },
      "sameAs": socialLinks.map((s) => s.url),
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "customer support",
          "email": data.contactDetails?.email,
          "telephone": data.contactDetails?.phone,
          "availableLanguage": ["English", "Nepali"]
        }
      ]
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }} />
      <ContactClient initialData={data} />
    </>
  );
}
