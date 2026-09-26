import { getRepo, type Doc } from "@/lib/repo";
import type {
  CertificateData,
  ProfileData,
  ProjectData,
  ReviewData,
  TimelineItemData,
} from "@/lib/types";
import Navbar, { type NavLink } from "@/components/site/Navbar";
import Hero, { type HeroStat } from "@/components/site/Hero";
import TechMarquee from "@/components/site/TechMarquee";
import About from "@/components/site/About";
import Timeline from "@/components/site/Timeline";
import Projects from "@/components/site/Projects";
import Certificates from "@/components/site/Certificates";
import Reviews from "@/components/site/Reviews";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const defaultProfile: ProfileData = {
  name: "Gaurav Pathak",
  tagline: "",
  headline: "",
  summary: "",
  highlights: [],
  bio: "",
  skills: [],
  resumeUrl: "",
  heroImage: "",
  aboutImage: "",
  email: "",
  socialLinks: {},
};

const projectDefaults: Omit<ProjectData, "_id" | "title" | "order"> = {
  projectType: "Personal Project",
  tagline: "",
  description: "",
  role: "",
  highlights: [],
  architecture: [],
  icon: "code",
  image: "",
  techStack: [],
  liveUrl: "",
  githubUrl: "",
  featured: false,
};

async function getData() {
  try {
    const repo = await getRepo();
    const [profile, projects, certificates, timeline, reviews] = await Promise.all([
      repo.getProfile(),
      repo.list("projects"),
      repo.list("certificates"),
      repo.list("timeline"),
      repo.list("reviews"),
    ]);

    return {
      profile: { ...defaultProfile, ...profile } as ProfileData,
      projects: projects.map((p: Doc) => ({ ...projectDefaults, ...p }) as unknown as ProjectData),
      certificates: certificates as unknown as CertificateData[],
      timeline: timeline as unknown as TimelineItemData[],
      // Drafts stay hidden until the client has approved their testimonial.
      reviews: (reviews as unknown as ReviewData[]).filter((r) => r.published !== false),
    };
  } catch (err) {
    console.error("Failed to load portfolio data — falling back to defaults:", err);
    return {
      profile: defaultProfile,
      projects: [] as ProjectData[],
      certificates: [] as CertificateData[],
      timeline: [] as TimelineItemData[],
      reviews: [] as ReviewData[],
    };
  }
}

export default async function Home() {
  const { profile, projects, certificates, timeline, reviews } = await getData();

  const navLinks: NavLink[] = [
    { href: "#about", label: "About", show: true },
    { href: "#projects", label: "Projects", show: projects.length > 0 },
    { href: "#certificates", label: "Certificates", show: certificates.length > 0 },
    { href: "#reviews", label: "Reviews", show: reviews.length > 0 },
    { href: "#timeline", label: "Journey", show: timeline.length > 0 },
    { href: "#contact", label: "Contact", show: true },
  ].filter((link) => link.show);

  const years = timeline.map((t) => Number(t.date.match(/\d{4}/)?.[0])).filter(Boolean);
  const featuredCount = projects.filter((p) => p.featured).length;
  const stats: HeroStat[] = [
    years.length ? { value: String(Math.min(...years)), label: "Building since" } : null,
    featuredCount ? { value: String(featuredCount), label: "Featured projects" } : null,
    { value: "3", label: "Client countries" },
    certificates.length ? { value: String(certificates.length), label: "Certifications" } : null,
  ].filter((stat): stat is HeroStat => stat !== null);

  return (
    <>
      <Navbar name={profile.name} links={navLinks} />
      <Hero profile={profile} stats={stats} />
      <TechMarquee />
      <About profile={profile} />
      <Projects projects={projects} />
      <Certificates certificates={certificates} />
      <Reviews reviews={reviews} />
      <Timeline items={timeline} />
      <Contact />
      <Footer profile={profile} links={navLinks} />
    </>
  );
}
