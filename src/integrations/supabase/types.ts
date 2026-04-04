export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      agency_listings: {
        Row: {
          approved: boolean
          contact_number: string
          created_at: string
          description: string
          email: string | null
          established_year: number | null
          id: string
          logo_url: string | null
          name: string
          price_range_max: number
          price_range_min: number
          team_size: number | null
          treks_offered: string[]
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          approved?: boolean
          contact_number: string
          created_at?: string
          description?: string
          email?: string | null
          established_year?: number | null
          id?: string
          logo_url?: string | null
          name: string
          price_range_max?: number
          price_range_min?: number
          team_size?: number | null
          treks_offered?: string[]
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          approved?: boolean
          contact_number?: string
          created_at?: string
          description?: string
          email?: string | null
          established_year?: number | null
          id?: string
          logo_url?: string | null
          name?: string
          price_range_max?: number
          price_range_min?: number
          team_size?: number | null
          treks_offered?: string[]
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      agency_reviews: {
        Row: {
          agency_listing_id: string
          comment: string
          created_at: string
          id: string
          rating: number
          user_id: string
        }
        Insert: {
          agency_listing_id: string
          comment?: string
          created_at?: string
          id?: string
          rating: number
          user_id: string
        }
        Update: {
          agency_listing_id?: string
          comment?: string
          created_at?: string
          id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_reviews_agency_listing_id_fkey"
            columns: ["agency_listing_id"]
            isOneToOne: false
            referencedRelation: "agency_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          content: string
          cover_image_url: string | null
          created_at: string
          excerpt: string
          id: string
          published: boolean
          slug: string
          tags: string[]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string
          id?: string
          published?: boolean
          slug: string
          tags?: string[]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string
          id?: string
          published?: boolean
          slug?: string
          tags?: string[]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      completed_treks: {
        Row: {
          completed_at: string
          created_at: string
          id: string
          notes: string | null
          trek_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          id?: string
          notes?: string | null
          trek_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          id?: string
          notes?: string | null
          trek_id?: string
          user_id?: string
        }
        Relationships: []
      }
      experiences: {
        Row: {
          approved: boolean
          created_at: string
          id: string
          photo_urls: string[]
          rating: number
          story: string
          trek_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approved?: boolean
          created_at?: string
          id?: string
          photo_urls?: string[]
          rating: number
          story: string
          trek_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approved?: boolean
          created_at?: string
          id?: string
          photo_urls?: string[]
          rating?: number
          story?: string
          trek_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      guesthouse_listings: {
        Row: {
          amenities: string[]
          approved: boolean
          contact_number: string
          created_at: string
          description: string
          food_options: string[]
          id: string
          location: string
          name: string
          photo_url: string | null
          price_range_max: number
          price_range_min: number
          room_photo_urls: string[]
          trek_region: string
          updated_at: string
          user_id: string
          view_photo_urls: string[]
        }
        Insert: {
          amenities?: string[]
          approved?: boolean
          contact_number: string
          created_at?: string
          description?: string
          food_options?: string[]
          id?: string
          location: string
          name: string
          photo_url?: string | null
          price_range_max?: number
          price_range_min?: number
          room_photo_urls?: string[]
          trek_region: string
          updated_at?: string
          user_id: string
          view_photo_urls?: string[]
        }
        Update: {
          amenities?: string[]
          approved?: boolean
          contact_number?: string
          created_at?: string
          description?: string
          food_options?: string[]
          id?: string
          location?: string
          name?: string
          photo_url?: string | null
          price_range_max?: number
          price_range_min?: number
          room_photo_urls?: string[]
          trek_region?: string
          updated_at?: string
          user_id?: string
          view_photo_urls?: string[]
        }
        Relationships: []
      }
      guesthouse_reviews: {
        Row: {
          comment: string
          created_at: string
          guesthouse_listing_id: string
          id: string
          rating: number
          user_id: string
        }
        Insert: {
          comment?: string
          created_at?: string
          guesthouse_listing_id: string
          id?: string
          rating: number
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          guesthouse_listing_id?: string
          id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guesthouse_reviews_guesthouse_listing_id_fkey"
            columns: ["guesthouse_listing_id"]
            isOneToOne: false
            referencedRelation: "guesthouse_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string
          health_conditions: string | null
          height_cm: number | null
          id: string
          updated_at: string
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          health_conditions?: string | null
          height_cm?: number | null
          id?: string
          updated_at?: string
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          health_conditions?: string | null
          height_cm?: number | null
          id?: string
          updated_at?: string
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      sherpa_listings: {
        Row: {
          approved: boolean
          contact_number: string
          created_at: string
          description: string
          gallery_urls: string[]
          id: string
          name: string
          photo_url: string | null
          price_range_max: number
          price_range_min: number
          treks_guided: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approved?: boolean
          contact_number: string
          created_at?: string
          description?: string
          gallery_urls?: string[]
          id?: string
          name: string
          photo_url?: string | null
          price_range_max?: number
          price_range_min?: number
          treks_guided: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approved?: boolean
          contact_number?: string
          created_at?: string
          description?: string
          gallery_urls?: string[]
          id?: string
          name?: string
          photo_url?: string | null
          price_range_max?: number
          price_range_min?: number
          treks_guided?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sherpa_reviews: {
        Row: {
          comment: string
          created_at: string
          id: string
          rating: number
          sherpa_listing_id: string
          user_id: string
        }
        Insert: {
          comment?: string
          created_at?: string
          id?: string
          rating: number
          sherpa_listing_id: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          rating?: number
          sherpa_listing_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sherpa_reviews_sherpa_listing_id_fkey"
            columns: ["sherpa_listing_id"]
            isOneToOne: false
            referencedRelation: "sherpa_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      trek_overrides: {
        Row: {
          description: string | null
          highlights: string[] | null
          id: string
          itinerary_json: Json | null
          trek_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          description?: string | null
          highlights?: string[] | null
          id?: string
          itinerary_json?: Json | null
          trek_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          description?: string | null
          highlights?: string[] | null
          id?: string
          itinerary_json?: Json | null
          trek_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      trek_reviews: {
        Row: {
          comment: string
          created_at: string
          id: string
          rating: number
          trek_id: string
          user_id: string
        }
        Insert: {
          comment?: string
          created_at?: string
          id?: string
          rating: number
          trek_id: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          rating?: number
          trek_id?: string
          user_id?: string
        }
        Relationships: []
      }
      trek_tea_houses: {
        Row: {
          contact_number: string | null
          created_at: string
          description: string | null
          facilities: string[] | null
          id: string
          name: string
          price_range: string | null
          trek_id: string
          updated_at: string
          village: string
        }
        Insert: {
          contact_number?: string | null
          created_at?: string
          description?: string | null
          facilities?: string[] | null
          id?: string
          name: string
          price_range?: string | null
          trek_id: string
          updated_at?: string
          village: string
        }
        Update: {
          contact_number?: string | null
          created_at?: string
          description?: string | null
          facilities?: string[] | null
          id?: string
          name?: string
          price_range?: string | null
          trek_id?: string
          updated_at?: string
          village?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishlisted_treks: {
        Row: {
          added_at: string
          id: string
          trek_id: string
          user_id: string
        }
        Insert: {
          added_at?: string
          id?: string
          trek_id: string
          user_id: string
        }
        Update: {
          added_at?: string
          id?: string
          trek_id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          display_name: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          display_name?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          display_name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
