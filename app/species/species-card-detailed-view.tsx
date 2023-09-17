"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Database } from "@/lib/schema";
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
        <DialogContent>
          <h3>Species Information</h3>
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
