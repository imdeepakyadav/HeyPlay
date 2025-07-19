// Navigation types for the HeyPlay mobile app

export type RootStackParamList = {
  MainTabs: undefined;
  Room: { roomId: string };
  CreateRoom: undefined;
  Auth: undefined;
};

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Profile: undefined;
};
