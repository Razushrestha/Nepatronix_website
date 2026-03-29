import { client } from "@/sanity/lib/client";
import TeamsClient, { TeamMember } from "./TeamsClient";

export const revalidate = 3600;

async function getTeamMembers(): Promise<TeamMember[]> {
  return client.fetch<TeamMember[]>(
    `*[_type == "teamMember"] | order(order asc) {
      _id,
      name,
      title,
      role,
      image
    }`,
    {},
    { next: { revalidate: 3600 } }
  );
}

export default async function TeamPage() {
  const teamMembersData = await getTeamMembers();
  const canonicalUrl = "https://nepatronix.org/teams";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://nepatronix.org" },
      { "@type": "ListItem", position: 2, name: "Team", item: canonicalUrl },
    ],
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Nepatronix Team Members",
    url: canonicalUrl,
    itemListElement: teamMembersData.map((member, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Person",
        name: member.name,
        jobTitle: member.title,
        worksFor: {
          "@type": "Organization",
          name: "Nepatronix Engineering Solutions",
          url: "https://nepatronix.org",
        },
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {teamMembersData.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      )}
      <TeamsClient teamMembersData={teamMembersData} />
    </>
  );
}
