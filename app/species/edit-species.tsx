"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Database } from "@/lib/schema";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { speciesSchema } from "./add-species-dialog";

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

  const handleClickToOpenEdit = () => {
    setOpenEdit(true);
  };
  const handleToCloseEdit = () => {
    setOpenEdit(false);
    setEditError("");
  };

  type FormData = z.infer<typeof speciesSchema>;

  const editInfo = async (input: FormData) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      // this is a protected route - only users who are signed in can view this route
      redirect("/");
    }

    if (thisSpecies.author == session.user.id) {
      const { data, error } = await supabase
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
      setEditError("Login to the correct account to edit");
    }
  };

  const form = useForm();
  const kingdoms = z.enum(["Animalia", "Plantae", "Fungi", "Protista", "Archaea", "Bacteria"]);

  return (
    <div>
      {/*Implementing editing functionality*/}
      <Button variant="outline" onClick={handleClickToOpenEdit}>
        Edit
      </Button>
      <Dialog open={openEdit}>
        <DialogContent>
          <h3> Edit Species Information</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(editInfo)}>
              <FormField
                control={form.control}
                name="scientific_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scientific Name</FormLabel>
                    <FormControl>
                      <Input defaultValue={thisSpecies.scientific_name} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="common_name"
                render={({ field }) => {
                  // We must extract value from field and convert a potential defaultValue of `null` to "" because inputs can't handle null values: https://github.com/orgs/react-hook-form/discussions/4091
                  const { value, ...rest } = field;
                  return (
                    <FormItem>
                      <FormLabel>Common Name</FormLabel>
                      <FormControl>
                        <Input defaultValue={thisSpecies.common_name} {...rest} />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="kingdom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kingdom</FormLabel>
                    {/* Using shadcn/ui form with enum: https://github.com/shadcn-ui/ui/issues/772 */}
                    <Select onValueChange={(value) => field.onChange(kingdoms.parse(value))} defaultValue={field.value}>
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
                      {/* Using shadcn/ui form with number: https://github.com/shadcn-ui/ui/issues/421 */}
                      <Input
                        type="number"
                        placeholder={thisSpecies.total_population}
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input defaultValue={thisSpecies.image} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => {
                  // We must extract value from field and convert a potential defaultValue of `null` to "" because textareas can't handle null values: https://github.com/orgs/react-hook-form/discussions/4091
                  const { value, ...rest } = field;
                  return (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea defaultValue={thisSpecies.description} {...rest} />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              <div className="flex">
                <Button type="submit">Save</Button>
                <Button type="button" variant="secondary" onClick={handleToCloseEdit}>
                  Cancel
                </Button>
                <br />
                {editError && <p> Login to the correct account to edit</p>}
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
