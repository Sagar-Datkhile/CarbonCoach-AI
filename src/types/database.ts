export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "user" | "admin";
export type HomeType = "owned" | "rented" | "shared" | "other" | "Owned" | "Rented" | "Shared" | "Other";
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
      households: {
        Row: {
          id: string;
          user_id: string;
          household_name: string;
          home_type: HomeType | null;
          occupants_count: number | null;
          region_code: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          household_name?: string;
          home_type?: HomeType | null;
          occupants_count?: number | null;
          region_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          household_name?: string;
          home_type?: HomeType | null;
          occupants_count?: number | null;
          region_code?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          upfront_budget: number | null;
          preferred_currency: string;
          already_using_leds: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          upfront_budget?: number | null;
          preferred_currency?: string;
          already_using_leds?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          upfront_budget?: number | null;
          preferred_currency?: string;
          already_using_leds?: boolean | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          user_id: string;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
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
          source_name: string;
          source_url?: string | null;
          source_year?: number | null;
          effective_from?: string | null;
          effective_to?: string | null;
          version?: string | null;
          currency_code?: string;
          default_tariff_per_kwh?: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          region_code: string;
          region_name: string;
          factor_kg_co2e_per_kwh: number;
          source_name?: string;
          source_url?: string | null;
          source_year?: number | null;
          effective_from?: string | null;
          effective_to?: string | null;
          version?: string | null;
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
          source_name?: string;
          source_url?: string | null;
          source_year?: number | null;
          effective_from?: string | null;
          effective_to?: string | null;
          version?: string | null;
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
          action_key?: string;
          title: string;
          description: string;
          category: RecommendationCategory | string;
          applicable_home_types: HomeType[];
          applicable_budget_tiers?: BudgetTier[];
          difficulty?: RecommendationDifficulty | string;
          minimum_budget?: number | null;
          maximum_budget?: number | null;
          calculation_type?: string | null;
          calculation_config?: Json | null;
          eligibility_config?: Json | null;
          estimated_kwh_reduction_annual: number;
          estimated_percent_reduction: number;
          upfront_cost_estimate: number;
          is_active: boolean;
          created_at: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          action_key?: string;
          title: string;
          description: string;
          category?: RecommendationCategory | string;
          applicable_home_types?: HomeType[];
          applicable_budget_tiers?: BudgetTier[];
          difficulty?: RecommendationDifficulty | string;
          minimum_budget?: number | null;
          maximum_budget?: number | null;
          calculation_type?: string | null;
          calculation_config?: Json | null;
          eligibility_config?: Json | null;
          estimated_kwh_reduction_annual?: number;
          estimated_percent_reduction?: number;
          upfront_cost_estimate?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          action_key?: string;
          title?: string;
          description?: string;
          category?: RecommendationCategory | string;
          applicable_home_types?: HomeType[];
          applicable_budget_tiers?: BudgetTier[];
          difficulty?: RecommendationDifficulty | string;
          minimum_budget?: number | null;
          maximum_budget?: number | null;
          calculation_type?: string | null;
          calculation_config?: Json | null;
          eligibility_config?: Json | null;
          estimated_kwh_reduction_annual?: number;
          estimated_percent_reduction?: number;
          upfront_cost_estimate?: number;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_actions: {
        Row: {
          id: string;
          user_id: string;
          household_id?: string;
          template_id?: string | null;
          recommendation_id?: string | null;
          title?: string | null;
          description?: string | null;
          custom_title?: string | null;
          status: ActionStatus;
          estimated_cost?: number | null;
          estimated_kwh_saving: number;
          estimated_money_saving?: number;
          estimated_cost_saving: number;
          estimated_co2_saving: number;
          estimated_co2_saving_kg?: number;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          household_id?: string;
          template_id?: string | null;
          recommendation_id?: string | null;
          title?: string | null;
          description?: string | null;
          custom_title?: string | null;
          status?: ActionStatus;
          estimated_cost?: number | null;
          estimated_kwh_saving?: number;
          estimated_money_saving?: number;
          estimated_cost_saving?: number;
          estimated_co2_saving?: number;
          estimated_co2_saving_kg?: number;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          household_id?: string;
          template_id?: string | null;
          recommendation_id?: string | null;
          title?: string | null;
          description?: string | null;
          custom_title?: string | null;
          status?: ActionStatus;
          estimated_cost?: number | null;
          estimated_kwh_saving?: number;
          estimated_money_saving?: number;
          estimated_cost_saving?: number;
          estimated_co2_saving?: number;
          estimated_co2_saving_kg?: number;
          completed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      simulation_runs: {
        Row: {
          id: string;
          user_id: string;
          household_id?: string;
          simulation_type: string;
          input_parameters: Json;
          projection_days?: number | null;
          calculated_kwh_saving: number;
          calculated_money_saving?: number;
          calculated_cost_saving?: number;
          calculated_co2_saving?: number;
          calculated_co2_saving_kg?: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          household_id?: string;
          simulation_type?: string;
          input_parameters: Json;
          projection_days?: number | null;
          calculated_kwh_saving?: number;
          calculated_money_saving?: number;
          calculated_cost_saving?: number;
          calculated_co2_saving?: number;
          calculated_co2_saving_kg?: number;
          created_at?: string;
        };
        Update: {
          household_id?: string;
          simulation_type?: string;
          input_parameters?: Json;
          projection_days?: number | null;
          calculated_kwh_saving?: number;
          calculated_money_saving?: number;
          calculated_cost_saving?: number;
          calculated_co2_saving?: number;
          calculated_co2_saving_kg?: number;
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
