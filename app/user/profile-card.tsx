"use client";

import type { Database } from "@/lib/schema";
import EditProfile from "./edit-profile";
import ProfileDialog from "./profile-dialog";

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
        <EditProfile key={profiles.id} {...profiles} />
        <h3 className="mt-3 text-2xl font-semibold">{profiles.display_name}</h3>
        <h4 className="text-lg font-light italic">{profiles.email}</h4>
        <p>{profiles.biography ? profiles.biography.slice(0, 150).trim() + "..." : ""}</p>

        {/*Profile Dialog component that has a dialog pop up if 'View Information' is clicked*/}
        <ProfileDialog key={profiles.id} {...profiles} />
      </div>
    </div>
  );
}
