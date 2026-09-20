import React from "react";

export interface PolicySectionItem {
  id: string;
  icon: string;
  title: string;
  description?: string;
  points?: string[];
  content?: Record<string, string[]>;
  contactCards?: {
    label: string;
    value: string;
    url: string;
    icon: string;
  }[];
}
