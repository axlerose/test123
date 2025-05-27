// src/navigation/types.ts (Updated)
export type RootStackParamList = {
  Auth: undefined; 
  App: undefined; 
};

export type SongStackParamList = {
  SongList: undefined;
  SongDetail: { songId: number };
  AdminSongForm?: { songId?: number }; // Added for navigation from song list or admin dash
};

export type RehearsalStackParamList = {
  RehearsalCalendar: undefined;
  RehearsalDetail?: { rehearsalId?: number }; 
  AdminRehearsalForm?: { rehearsalId?: number }; // Added for navigation
};

export type AdminStackParamList = {
    AdminDashboard: undefined;
    AdminSongForm: { songId?: number }; // For creating new or editing existing
    AdminRehearsalForm: { rehearsalId?: number }; // For creating new or editing existing
    // Potentially add routes to list songs/rehearsals with edit/delete options for admin
};

export type AppTabParamList = {
  SongsTab: undefined; 
  RehearsalsTab: undefined; 
  AdminTab?: undefined; // Conditionally rendered
  // ProfileTab: undefined;
};
