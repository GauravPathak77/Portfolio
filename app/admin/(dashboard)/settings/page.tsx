"use client";

import { useEffect, useState } from "react";
import type { ProfileData, SkillGroup } from "@/lib/types";
import CloudinaryUploader from "@/components/admin/CloudinaryUploader";
import { Input, Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const emptyProfile: ProfileData = {
  name: "",
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

const skillsToText = (skills: SkillGroup[]) =>
  skills.map((group) => `${group.category}: ${group.items.join(", ")}`).join("\n");

const textToSkills = (text: string): SkillGroup[] =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.includes(":"))
    .map((line) => {
      const [category, ...rest] = line.split(":");
      return {
        category: category.trim(),
        items: rest
          .join(":")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };
    });

export default function SettingsAdminPage() {
  const [profile, setProfile] = useState<ProfileData>(emptyProfile);
  const [highlightsText, setHighlightsText] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          const merged = { ...emptyProfile, ...data };
          setProfile(merged);
          setHighlightsText(merged.highlights.join("\n"));
          setSkillsText(skillsToText(merged.skills));
        }
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const payload = {
      ...profile,
      highlights: highlightsText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      skills: textToSkills(skillsText),
    };
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    setSaved(true);
  }

  if (loading) return <p className="text-sm text-[var(--text-muted)]">Loading...</p>;

  const set = <K extends keyof ProfileData>(key: K, value: ProfileData[K]) =>
    setProfile((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold">Site Settings</h1>

      <div className="surface-card flex flex-col gap-4 p-6">
        <h2 className="text-lg font-semibold">Hero</h2>
        <Input label="Name (typed out in the hero)" value={profile.name} onChange={(e) => set("name", e.target.value)} />
        <Input
          label="Headline (main hero message)"
          value={profile.headline}
          onChange={(e) => set("headline", e.target.value)}
        />
        <Input
          label="Role line (pill under the headline)"
          value={profile.tagline}
          onChange={(e) => set("tagline", e.target.value)}
        />
        <Textarea
          label="Summary (supporting text)"
          rows={3}
          value={profile.summary}
          onChange={(e) => set("summary", e.target.value)}
        />
        <Textarea
          label="Highlights (one per line — the grid under the hero)"
          rows={6}
          value={highlightsText}
          onChange={(e) => setHighlightsText(e.target.value)}
        />

        <h2 className="mt-4 text-lg font-semibold">About</h2>
        <Textarea
          label="Bio (separate paragraphs with a blank line)"
          rows={7}
          value={profile.bio}
          onChange={(e) => set("bio", e.target.value)}
        />
        <Textarea
          label='Skills (one group per line, e.g. "Backend & Data: Node.js, FastAPI")'
          rows={5}
          value={skillsText}
          onChange={(e) => setSkillsText(e.target.value)}
        />

        <h2 className="mt-4 text-lg font-semibold">Links & Images</h2>
        <Input label="Resume URL" value={profile.resumeUrl} onChange={(e) => set("resumeUrl", e.target.value)} />
        <Input label="Contact Email" value={profile.email} onChange={(e) => set("email", e.target.value)} />

        <div className="grid gap-4 sm:grid-cols-2">
          <CloudinaryUploader
            label="Hero Image"
            value={profile.heroImage}
            onChange={(url) => set("heroImage", url)}
          />
          <CloudinaryUploader
            label="About Image"
            value={profile.aboutImage}
            onChange={(url) => set("aboutImage", url)}
          />
        </div>

        <h2 className="mt-4 text-lg font-semibold">Social Links</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {(["github", "linkedin", "twitter", "facebook", "whatsapp"] as const).map((key) => (
            <Input
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              value={profile.socialLinks[key] ?? ""}
              onChange={(e) => set("socialLinks", { ...profile.socialLinks, [key]: e.target.value })}
            />
          ))}
        </div>

        <Button onClick={handleSave} disabled={saving} className="mt-2 self-start px-8">
          {saving ? "Saving..." : "Save Settings"}
        </Button>
        {saved && <p className="text-sm text-green-500">Saved!</p>}
      </div>
    </div>
  );
}
