export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "user" | "admin";
export type HomeType = "Owned" | "Rented" | "Shared" | "Other";
export type BudgetTier = "Zero-Cost" | "Low" | "Moderate" | "High";
export type ActionStatus = "planned" | "in_progress" | "completed" | "dismissed";
export type BillStatus = "draft" | "confirmed" | "archived";
export type ExtractionStatus = "processing" | "success" | "failed" | "corrected";
export type RecommendationDifficulty = "Easy" | "Moderate" | "Advanced";
export type RecommendationCategory = "electricity" | "heating" | "appliances" | "habits";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          updated_at?: string;
        };
        Relationships: [];
      };
      household_profiles: {
        Row: {
          id: string;
          user_id: string;
          household_name: string;
          home_type: HomeType;
          occupants_count: number;
          region: string | null;
          budget_tier: BudgetTier;
          heating_type: string | null;
          cooling_type: string | null;
          preferred_currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          household_name?: string;
          home_type?: HomeType;
          occupants_count?: number;
          region?: string | null;
          budget_tier?: BudgetTier;
          heating_type?: string | null;
          cooling_type?: string | null;
          preferred_currency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          household_name?: string;
          home_type?: HomeType;
          occupants_count?: number;
          region?: string | null;
          budget_tier?: BudgetTier;
          heating_type?: string | null;
          cooling_type?: string | null;
          preferred_currency?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      emission_factors: {
        Row: {
          id: string;
          region_code: string;
          region_name: string;
          factor_kg_co2e_per_kwh: number;
          currency_code: string;
          default_tariff_per_kwh: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          region_code: string;
          region_name: string;
          factor_kg_co2e_per_kwh: number;
          currency_code?: string;
          default_tariff_per_kwh?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          region_code?: string;
          region_name?: string;
          factor_kg_co2e_per_kwh?: number;
          currency_code?: string;
          default_tariff_per_kwh?: number;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      electricity_bills: {
        Row: {
          id: string;
          user_id: string;
          provider_name: string;
          consumer_number: string | null;
          bill_number: string | null;
          billing_period_start: string;
          billing_period_end: string;
          billing_days: number;
          energy_consumed_kwh: number;
          bill_amount: number;
          tariff_rate: number | null;
          currency: string;
          due_date: string | null;
          file_path: string | null;
          status: BillStatus;
          estimated_emissions_kg: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          provider_name: string;
          consumer_number?: string | null;
          bill_number?: string | null;
          billing_period_start: string;
          billing_period_end: string;
          energy_consumed_kwh: number;
          bill_amount: number;
          tariff_rate?: number | null;
          currency?: string;
          due_date?: string | null;
          file_path?: string | null;
          status?: BillStatus;
          estimated_emissions_kg?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          provider_name?: string;
          consumer_number?: string | null;
          bill_number?: string | null;
          billing_period_start?: string;
          billing_period_end?: string;
          energy_consumed_kwh?: number;
          bill_amount?: number;
          tariff_rate?: number | null;
          currency?: string;
          due_date?: string | null;
          file_path?: string | null;
          status?: BillStatus;
          estimated_emissions_kg?: number | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      bill_extraction_logs: {
        Row: {
          id: string;
          user_id: string;
          file_path: string;
          raw_ai_response: Json | null;
          validated_payload: Json | null;
          status: ExtractionStatus;
          error_message: string | null;
          processing_time_ms: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          file_path: string;
          raw_ai_response?: Json | null;
          validated_payload?: Json | null;
          status: ExtractionStatus;
          error_message?: string | null;
          processing_time_ms?: number | null;
          created_at?: string;
        };
        Update: {
          raw_ai_response?: Json | null;
          validated_payload?: Json | null;
          status?: ExtractionStatus;
          error_message?: string | null;
          processing_time_ms?: number | null;
        };
        Relationships: [];
      };
      recommendation_templates: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: RecommendationCategory;
          applicable_home_types: HomeType[];
          applicable_budget_tiers: BudgetTier[];
          difficulty: RecommendationDifficulty;
          estimated_kwh_reduction_annual: number;
          estimated_percent_reduction: number;
          upfront_cost_estimate: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          category?: RecommendationCategory;
          applicable_home_types?: HomeType[];
          applicable_budget_tiers?: BudgetTier[];
          difficulty?: RecommendationDifficulty;
          estimated_kwh_reduction_annual?: number;
          estimated_percent_reduction?: number;
          upfront_cost_estimate?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          category?: RecommendationCategory;
          applicable_home_types?: HomeType[];
          applicable_budget_tiers?: BudgetTier[];
          difficulty?: RecommendationDifficulty;
          estimated_kwh_reduction_annual?: number;
          estimated_percent_reduction?: number;
          upfront_cost_estimate?: number;
          is_active?: boolean;
        };
        Relationships: [];
      };
      user_actions: {
        Row: {
          id: string;
          user_id: string;
          template_id: string | null;
          custom_title: string | null;
          status: ActionStatus;
          estimated_kwh_saving: number;
          estimated_cost_saving: number;
          estimated_co2_saving: number;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          template_id?: string | null;
          custom_title?: string | null;
          status?: ActionStatus;
          estimated_kwh_saving?: number;
          estimated_cost_saving?: number;
          estimated_co2_saving?: number;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          custom_title?: string | null;
          status?: ActionStatus;
          estimated_kwh_saving?: number;
          estimated_cost_saving?: number;
          estimated_co2_saving?: number;
          completed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      simulation_runs: {
        Row: {
          id: string;
          user_id: string;
          simulation_type: string;
          input_parameters: Json;
          calculated_kwh_saving: number;
          calculated_cost_saving: number;
          calculated_co2_saving: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          simulation_type?: string;
          input_parameters: Json;
          calculated_kwh_saving: number;
          calculated_cost_saving: number;
          calculated_co2_saving: number;
          created_at?: string;
        };
        Update: {
          simulation_type?: string;
          input_parameters?: Json;
          calculated_kwh_saving?: number;
          calculated_cost_saving?: number;
          calculated_co2_saving?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
