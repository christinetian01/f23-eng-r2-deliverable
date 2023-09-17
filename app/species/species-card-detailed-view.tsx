"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Database } from "@/lib/schema";
import Image from "next/image";
import { useState } from "react";

type Species = Database["public"]["Tables"]["species"]["Row"];

interface SpeciesDialog {
  common_name: string | null;
  scientific_name: string | null;
  total_population: number | null;
  kingdom: "Animalia" | "Plantae" | "Fungi" | "Protista" | "Archaea" | "Bacteria";
  description: string | null;
  image: string | null;
  author: string;
}

export default function SpeciesDialog(thisSpecies: Species) {
  // creates the dialog that pops up when users click "Learn More"
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // control when the dialog opens
  const handleClickToOpenDialog = () => {
    setOpenDialog(true);
  };

  // control when the dialog closes
  const handleToCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div>
      <Button className="mt-3 w-full" onClick={handleClickToOpenDialog}>
        Learn More
      </Button>

      {/* Dialog contains information on the species name, scientific name, population, kingdom, and description */}
      <Dialog open={openDialog}>
        <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
          <h3>Species Information</h3>
          {thisSpecies.image && (
            <div className="relative h-40 w-full">
              <Image src={thisSpecies.image} alt={thisSpecies.scientific_name} fill style={{ objectFit: "cover" }} />
            </div>
          )}
          <b>Species Name:</b> {thisSpecies.common_name}
          <br />
          <b>Scientific Name:</b> {thisSpecies.scientific_name}
          <br />
          <b>Total Population:</b> {thisSpecies.total_population}
          <br />
          <b>Kingdom:</b> {thisSpecies.kingdom}
          <br />
          <b>Desription:</b> {thisSpecies.description}
          <br />
          <Button onClick={handleToCloseDialog}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
