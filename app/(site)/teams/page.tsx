import { connectToDatabase } from "@/lib/mongodb";
import { TeamMember as TeamMemberModel } from "@/lib/models";
import TeamsClient, { TeamMember } from "./TeamsClient";
import { aboutUsData } from "../data";
import { breadcrumbJsonLd, ORG_ID, SITE_URL } from "@/lib/seo/jsonLd";

export const dynamic = "force-dynamic";

interface TeamDoc {
  _id: unknown;
  name?: string;
  title?: string;
  role?: string;
  image?: { url?: string; alt?: string };
  sameAs?: string[];
}

async function getTeamMembers(): Promise<(TeamMember & { sameAs?: string[] })[]> {
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
    sameAs: Array.isArray(d.sameAs) ? d.sameAs.filter(Boolean) : undefined,
  }));
}

const CEO_SOCIALS = Object.values(aboutUsData.ceo.socials || {}).filter(Boolean) as string[];

export default async function TeamPage() {
  const teamMembersData = await getTeamMembers();
  const canonicalUrl = `${SITE_URL}/teams`;

  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Team", url: canonicalUrl },
  ]);

  const ceoPerson = {
    "@type": "Person",
    "@id": `${SITE_URL}/teams#ceo`,
    name: aboutUsData.ceo.name,
    jobTitle: aboutUsData.ceo.role,
    image: `${SITE_URL}${aboutUsData.ceo.image}`,
    worksFor: { "@id": ORG_ID },
    url: canonicalUrl,
    sameAs: CEO_SOCIALS,
  };

  const memberPersons = teamMembersData.map((member) => {
    const person: Record<string, unknown> = {
      "@type": "Person",
      name: member.name,
      jobTitle: member.title,
      worksFor: { "@id": ORG_ID },
      url: canonicalUrl,
    };
    if (member.image?.url) {
      const url = member.image.url.startsWith("http")
        ? member.image.url
        : `${SITE_URL}${member.image.url}`;
      person.image = url;
    }
    if (member.sameAs?.length) {
      person.sameAs = member.sameAs;
    }
    return person;
  });

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Nepatronix Team Members",
    url: canonicalUrl,
    numberOfItems: memberPersons.length + 1,
    itemListElement: [ceoPerson, ...memberPersons].map((person, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: person,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <TeamsClient teamMembersData={teamMembersData} />
    </>
  );
}
