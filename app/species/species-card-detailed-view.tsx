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

  const handleClickToOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleToCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div>
      <Button className="mt-3 w-full" onClick={handleClickToOpenDialog}>
        Learn More
      </Button>
      <Dialog open={openDialog}>
        <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
          <h3>Species Information</h3>
          {thisSpecies.image && (
            <div className="relative h-40 w-full">
              <Image src={thisSpecies.image} alt={thisSpecies.scientific_name} fill style={{ objectFit: "cover" }} />
            </div>
          )}
          Species Name: {thisSpecies.common_name}
          <br></br>
          Scientific Name: {thisSpecies.scientific_name}
          <br></br>
          Total Population: {thisSpecies.total_population}
          <br></br>
          Kingdom: {thisSpecies.kingdom}
          <br></br>
          Desription: {thisSpecies.description}
          <br></br>
          <Button onClick={handleToCloseDialog}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
