"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Database } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect, useRouter } from "next/navigation";
import { useState, type BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { speciesSchema } from "./add-species-dialog";

type Species = Database["public"]["Tables"]["species"]["Row"];

interface EditSpecies {
  common_name: string | null;
  scientific_name: string | null;
  total_population: number | null;
  kingdom: "Animalia" | "Plantae" | "Fungi" | "Protista" | "Archaea" | "Bacteria";
  description: string | null;
  image: string | null;
  author: string;
}

export default function EditSpecies(thisSpecies: Species) {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [editError, setEditError] = useState("");
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  // changes the openEdit variable and opens the editing dialog
  const handleClickToOpenEdit = () => {
    setOpenEdit(true);
  };

  // closes the editing dialog and resets any previous edit errors
  const handleToCloseEdit = () => {
    setOpenEdit(false);
    setEditError("");
  };

  type FormData = z.infer<typeof speciesSchema>;

  // editInfo is triggered when the editing form is saved and it updates the corresponding Supabase entries
  const editInfo = async (input: FormData) => {
    // get session in order to access the session user's id for later comparison
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      // this is a protected route - only users who are signed in can view this route
      redirect("/");
    }

    // if the session's user is the same as the species' author, then access to Supabase is granted
    if (thisSpecies.author == session.user.id) {
      await supabase
        .from("species")
        .update({
          scientific_name: input.scientific_name,
          common_name: input.common_name,
          kingdom: input.kingdom,
          total_population: input.total_population,
          image: input.image,
          description: input.description,
        })
        .eq("id", thisSpecies.id);
      handleToCloseEdit();
      router.refresh();
    } else {
      // an error message pops up that prompts users to use the correct account in order to edit info
      setEditError("Login to the correct account to edit");
    }
  };

  // form is build on the speciesSchema and the default values are the values currently in Supabase
  const form = useForm<FormData>({
    resolver: zodResolver(speciesSchema),
    defaultValues: {
      kingdom: "Animalia",
      common_name: thisSpecies.common_name,
      scientific_name: thisSpecies.scientific_name,
      image: thisSpecies.image!,
      description: thisSpecies.description,
    },
    mode: "onChange",
  });

  // kingdom options
  const kingdoms = z.enum(["Animalia", "Plantae", "Fungi", "Protista", "Archaea", "Bacteria"]);

  return (
    <div>
      {/*Implementing editing functionality*/}
      {/*opens the edintg dialog when clicked*/}
      <Button variant="outline" onClick={handleClickToOpenEdit}>
        Edit
      </Button>

      <Dialog open={openEdit}>
        <DialogContent>
          <h3> Edit Species Information</h3>
          <Form {...form}>
            <form onSubmit={(e: BaseSyntheticEvent) => void form.handleSubmit(editInfo)(e)}>
              <FormField
                control={form.control}
                name="scientific_name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Scientific Name</FormLabel>
                      <FormControl>
                        <Input defaultValue={thisSpecies.scientific_name} {...field} />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />

              <FormItem>
                <FormLabel>Common Name</FormLabel>
                <FormControl>
                  <Input defaultValue={thisSpecies.common_name!} />
                </FormControl>
              </FormItem>

              <FormField
                control={form.control}
                name="kingdom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kingdom</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(kingdoms.parse(value))}
                      defaultValue={thisSpecies.kingdom}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={thisSpecies.kingdom} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {kingdoms.options.map((kingdom, index) => (
                            <SelectItem key={index} value={kingdom}>
                              {kingdom}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="total_population"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total population</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        defaultValue={thisSpecies.total_population!}
                        {...field}
                        onChange={(event) => field.onChange(+event.target.value)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input defaultValue={thisSpecies.image!} {...field} />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => {
                      const { value, ...rest } = field;
                      return (
                        <FormItem>
                          <FormControl>
                            <Textarea defaultValue={value ?? thisSpecies.description!} {...rest} />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                </FormControl>
              </FormItem>

              <div className="flex">
                {/* Save button that submits the form if the speciesSchema conditions are met*/}
                <Button type="submit">Save</Button>
                {/* Button that closes the dialog when clicked*/}
                <Button type="button" variant="secondary" onClick={handleToCloseEdit}>
                  Cancel
                </Button>
                <br />
                {/* Error message that prompts user to use the correct account when editing species information if wrong account is being used */}
                {editError && <p> {editError}</p>}
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
