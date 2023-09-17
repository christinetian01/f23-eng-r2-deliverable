"use client";

import type { Database } from "@/lib/schema";

interface ProfileCard {
  email: string;
  display_name: string;
  biography: string | null;
}

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function ProfileCard(profiles: Profile) {
  return (
    <div>
      {/*Overview of Profile Information*/}
      <div className="min-w-72 m-4 w-72 flex-none rounded border-2 p-3 shadow">
        <h3 className="mt-3 text-2xl font-semibold">{profiles.display_name}</h3>
        <h4 className="text-lg font-light italic">{profiles.email}</h4>
        <p>{profiles ? profiles.biography.slice(0, 150).trim() + "..." : ""}</p>
      </div>
    </div>
  );
}
