import { connectToDatabase } from "@/lib/mongodb";
import { TeamMember as TeamMemberModel } from "@/lib/models";
import TeamsClient, { TeamMember } from "./TeamsClient";

export const dynamic = "force-dynamic";

interface TeamDoc {
  _id: unknown;
  name?: string;
  title?: string;
  role?: string;
  image?: { url?: string; alt?: string };
}

async function getTeamMembers(): Promise<TeamMember[]> {
  await connectToDatabase();
  const docs = await TeamMemberModel.find()
    .sort({ order: 1, createdAt: 1 })
    .lean<TeamDoc[]>();
  return docs.map((d) => ({
    _id: String(d._id),
    name: d.name || "",
    title: d.title || "",
    role: (d.role as TeamMember["role"]) || "Team",
    image: d.image?.url ? { url: d.image.url, alt: d.image.alt } : undefined,
  }));
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
