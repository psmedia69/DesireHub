export type ModelCategory = "DESI" | "Latina" | "White" | "Arab" | "Asian";

export type SortOption = "newest" | "oldest" | "name-asc" | "name-desc" | "popular" | "random";

export interface ModelProfile {
  id: string;
  name: string;
  category: ModelCategory;
  bio: string;
  thumbnail: string;
  gallery: string[];
  socials: {
    instagram?: string;
    onlyfans?: string;
    twitter?: string;
  };
  clicks: number;
  views: number;
  recentClicks: number;
  featured: boolean;
  heatScore?: number;
  countryName?: string;
  displayCategory?: string;
  followersCount?: string;
  createdAt?: string;
}

export interface AppState {
  isDarkMode: boolean;
  searchQuery: string;
  selectedCategory: ModelCategory | "All";
}
