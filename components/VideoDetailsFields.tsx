import React, { useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MultiSelect,
  MultiSelectTrigger,
  MultiSelectValue,
  MultiSelectContent,
  MultiSelectItem,
} from "@/components/ui/multi-select";
import { Category } from "@/hooks/useCategories";

export const VideoDetailsFields = ({
  form,
  categories,
}: {
  form: any;
  categories: Category[];
}) => {
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([
    "public",
  ]);

  const handleUnlockCriteriaChange = (values: string[]) => {
    setSelectedCriteria(values);
    form.setValue("unlockCriteria", values);
  };

  // Format selected values for display
  const formatSelected = (values: string[]) => {
    if (!values.length) return "Select unlock criteria";
    return values
      .map((value) => {
        const formatted =
          value.charAt(0).toUpperCase() +
          value.slice(1).replace(/([A-Z])/g, " $1");
        return formatted;
      })
      .join(", ");
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="categoryIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category: any) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="unlockCriteria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unlock Criteria</FormLabel>
              <FormControl>
                <MultiSelect
                  value={selectedCriteria}
                  onValueChange={handleUnlockCriteriaChange}
                  multiple={true}
                >
                  <MultiSelectTrigger>
                    <MultiSelectValue>
                      {formatSelected(selectedCriteria)}
                    </MultiSelectValue>
                  </MultiSelectTrigger>
                  <MultiSelectContent>
                    <MultiSelectItem value="public">
                      No Unlock Criteria
                    </MultiSelectItem>
                    <MultiSelectItem value="accountabilityPartner">
                      Accountability Partner
                    </MultiSelectItem>
                    <MultiSelectItem value="amtPoints">
                      Pay Wall
                    </MultiSelectItem>
                  </MultiSelectContent>
                </MultiSelect>
              </FormControl>
              <FormDescription>
                Select one or more unlock criteria for your video
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {selectedCriteria.includes("amtPoints") && (
        <FormField
          control={form.control}
          name="amtPointsRequired"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AMT Points Required</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter required AMT points"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};
