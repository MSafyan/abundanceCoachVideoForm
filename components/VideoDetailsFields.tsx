import React, { useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/hooks/useCategories";

export const VideoDetailsFields = ({
  form,
  categories,
}: {
  form: any;
  categories: Category[];
}) => {
  const [showAmtPointsRequired, setShowAmtPointsRequired] = useState(false);

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
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setShowAmtPointsRequired(value === "amtPoints");
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unlock criteria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="accountabilityPartner">
                    Accountability Partner
                  </SelectItem>
                  <SelectItem value="amtPoints">AMT Points</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {showAmtPointsRequired && (
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
