import { client } from "@/sanity/lib/client";
import BlogContent from "./BlogContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights & Updates",
  description: "Explore the latest news, expert insights, and success stories in IoT, Robotics, and STEM education from Nepatronix Nepal.",
  keywords: ["Robotics blog Nepal", "IoT insights Nepal", "STEM education articles", "Nepatronix news", "Technology trends Nepal"],
  openGraph: {
    title: "Nepatronix Blog | Technology & Education Insights",
    description: "Stay updated with the latest trends in engineering, robotics, and hands-on learning in Nepal.",
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
    "categories": categories[]->title,
    mainImage,
    author,
    slug
  }`;

  const posts = await client.fetch(query);

  return <BlogContent initialPosts={posts} />;
}
