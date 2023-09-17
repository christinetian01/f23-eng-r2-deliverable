"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Database } from "@/lib/schema";
import { useState } from "react";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function ProfileDialog(thisProfile: Profile) {
  // creates the dialog that pops up when users click "View Information"
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
        View Information
      </Button>

      {/* Dialog contains information on the user's name, email, and biography*/}
      <Dialog open={openDialog}>
        <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
          <h3>Profile Information</h3>
          <b>Username:</b> {thisProfile.display_name}
          <br />
          <b>Email:</b> {thisProfile.email}
          <br />
          <b>Biography:</b> {thisProfile.biography}
          <br />
          <Button onClick={handleToCloseDialog}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
