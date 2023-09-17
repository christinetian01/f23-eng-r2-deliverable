"use client";

import type { Database } from "@/lib/schema";
import Image from "next/image";
import EditSpecies from "./edit-species";
import SpeciesDialog from "./species-card-detailed-view";

type Species = Database["public"]["Tables"]["species"]["Row"];

export default function SpeciesCard(species: Species) {
  return (
    <div>
      {/*Overview of Species Information*/}
      <div className="min-w-72 m-4 w-72 flex-none rounded border-2 p-3 shadow">
        <EditSpecies key={species.id} {...species} />
        {species.image && (
          <div className="relative h-40 w-full">
            <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
          </div>
        )}
        <h3 className="mt-3 text-2xl font-semibold">{species.common_name}</h3>
        <h4 className="text-lg font-light italic">{species.scientific_name}</h4>
        <p>{species.description ? species.description.slice(0, 150).trim() + "..." : ""}</p>
        {/*The following code pertains to implementing the pop-up dialog*/}
        <SpeciesDialog key={species.id} {...species} />
      </div>
      {/* Replace with detailed view */}
    </div>
  );
}
