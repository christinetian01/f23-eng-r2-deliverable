"use client";

import type { Database } from "@/lib/schema";

interface ProfileCard {
  email: string;
  display_name: string;
  biography: string | null;
}

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function ProfileCard(profile: Profile) {
  return (
    <div>
      {/*Overview of Profile Information*/}
      <div className="min-w-72 m-4 w-72 flex-none rounded border-2 p-3 shadow">
        This is a profile card
        <h3 className="mt-3 text-2xl font-semibold">{profile.display_name}</h3>
        <h4 className="text-lg font-light italic">{profile.email}</h4>
      </div>
    </div>
  );
}
