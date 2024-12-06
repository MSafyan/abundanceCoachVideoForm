"use client";

import React, { useState, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function TagInput({
  value = [],
  onChange,
  placeholder,
  disabled,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue) {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !value.includes(trimmedTag)) {
      onChange([...value, trimmedTag]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 border rounded-md">
      {Array.isArray(value) &&
        value.map((tag) => (
          <div
            key={tag}
            className="flex items-center bg-primary text-primary-foreground px-2 py-1 rounded-md"
          >
            {tag}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-1 p-0 h-auto"
              disabled={disabled}
              onClick={() => removeTag(tag)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder={placeholder}
        className="flex-grow border-none focus-visible:ring-0 focus-visible:ring-offset-0"
        disabled={disabled}
      />
    </div>
  );
}
