export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://nepatronix.com" },
      { "@type": "ListItem", position: 2, name: "Services", item: "https://nepatronix.com/services" },
      {
        "@type": "ListItem",
        position: 3,
        name: "Upcoming Sessions",
        item: "https://nepatronix.com/services/upcoming-sessions",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
