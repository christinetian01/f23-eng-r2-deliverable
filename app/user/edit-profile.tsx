"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Database } from "@/lib/schema";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect, useRouter } from "next/navigation";
import { useState, type BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface EditProfile {
  email: string;
  display_name: string;
  biography: string | null;
}

// profileSchema that will serve as the blueprint for the editing form, only can change display_name and biography
export const profileSchema = z.object({
  display_name: z
    .string()
    .nullable()
    // Transform empty string or only whitespace input to null before form submission
    .transform((val) => val?.trim()),
  biography: z
    .string()
    .nullable()
    .transform((val) => (val?.trim() === "" ? null : val?.trim())),
});

export default function EditProfile(thisProfile: Profile) {
  // opens the editing dialog for a profile
  const [openEdit, setOpenEdit] = useState<boolean>(false);

  // error that appears if the user is editing a different profile card
  const [editError, setEditError] = useState("");

  //error that appears if the required field (display_name) is empty
  const [inputError, setInputError] = useState("");

  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  //opens the editing dialog
  const handleClickToOpenEdit = () => {
    setOpenEdit(true);
  };
  //closes the editing dialog
  const handleToCloseEdit = () => {
    setOpenEdit(false);
    setEditError("");
  };

  type FormData = z.infer<typeof profileSchema>;

  const editInfo = async (input: FormData) => {
    // get session info to access the user's id
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      // this is a protected route - only users who are signed in can view this route
      redirect("/");
    }

    // update "profiles" only if the profile card's id matches the session user's id
    if (thisProfile.id == session.user.id) {
      if (input.display_name != "") {
        await supabase
          .from("profiles")
          .update({
            display_name: input.display_name,
            biography: input.biography,
          })
          .eq("id", thisProfile.id);
        handleToCloseEdit();
        setInputError("");
        router.refresh();
      } else {
        // error if the required field (display_name) is left blank
        setInputError("Please fill out the required fields");
      }
    } else {
      // error if the user is editing a different profile card
      setEditError("Login to the correct account to edit");
    }
  };

  const form = useForm();

  return (
    <div>
      {/*Implementing editing functionality*/}
      <Button variant="outline" onClick={handleClickToOpenEdit}>
        Edit
      </Button>
      <Dialog open={openEdit}>
        <DialogContent>
          <h3> Edit Profile Information</h3>
          <Form {...form}>
            <form onSubmit={(e: BaseSyntheticEvent) => void form.handleSubmit(editInfo)(e)}>
              <FormField
                control={form.control}
                name="display_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name*</FormLabel>
                    <FormControl>
                      <Input defaultValue={thisProfile.display_name} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Biography</FormLabel>
                <FormControl>
                  <Input defaultValue={thisProfile.biography!} />
                </FormControl>
              </FormItem>

              <div className="flex">
                <Button type="submit">Save</Button>
                <Button type="button" variant="secondary" onClick={handleToCloseEdit}>
                  Cancel
                </Button>
                <br />
                {/* Errors that appears if the useState functions are triggered */}
                {editError && <p> {editError}</p>}
                {inputError && <p> {inputError}</p>}
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
