import { client } from "@/sanity/lib/client";
import BlogContent from "./BlogContent";
import { Metadata } from "next";
import Breadcrumb from "../components/Breadcrumb";

export const metadata: Metadata = {
  title: "Insights & Updates",
  description: "Explore the latest news, expert insights, and success stories in IoT, Robotics, and STEM education from Nepatronix Nepal.",
  keywords: ["Robotics blog Nepal", "IoT insights Nepal", "STEM education articles", "Nepatronix news", "Technology trends Nepal"],
  alternates: {
    canonical: "https://nepatronix.com/blog",
  },
  openGraph: {
    title: "Nepatronix Blog | Technology & Education Insights",
    description: "Stay updated with the latest trends in engineering, robotics, and hands-on learning in Nepal.",
    url: "https://nepatronix.com/blog",
    type: "website",
  }
};

// Revalidate every hour
export const revalidate = 3600;

export default async function BlogPage() {
  const query = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    excerpt,
    publishedAt,
    readingTime,
    "categories": categories[],
    mainImage,
    author,
    slug
  }`;

  const posts = await client.fetch(query);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Nepatronix Blog",
    "description": "Insights & Updates on IoT, Robotics, and STEM education in Nepal.",
    "url": "https://nepatronix.com/blog",
    "blogPost": posts.map((post: any) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "url": `https://nepatronix.com/blog/${post.slug.current}`,
      "datePublished": post.publishedAt,
    }))
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://nepatronix.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://nepatronix.com/blog"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Breadcrumb />
      <BlogContent initialPosts={posts} />
    </>
  );
}
