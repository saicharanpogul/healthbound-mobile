declare module '*.png';

type RootStackParamList = {
  Root: TabParamList;
  Login: {};
};

type TabParamList = {
  Home: {};
  Profile: {};
};

type NavigationProps = StackNavigationProp<TabParamList>;

interface HealthActivitySummary {
  activeEnergyBurned: number;
  activeEnergyBurnedGoal: number;
  appleExerciseTime: number;
  appleExerciseTimeGoal: number;
  appleStandHours: number;
  appleStandHoursGoal: number;
}

interface HealthData {
  nftId?: string;
  id?: string;
  date: number;
  data: HealthActivitySummary;
  isClaimed: boolean;
  isBurnable: boolean;
  isBurned: boolean;
}

type ProfileValues = {
  username: string;
  address: string;
};

type Attribute = {
  trait_type: string;
  value: any;
};

interface JsonMetadata {
  name: string;
  symbol: string;
  description: string;
  image?: string;
  animation_url?: string;
  external_url?: string;
  attributes?: Attribute[];
  properties?: {
    files: {
      uri: string;
      type: string;
      cdn?: boolean;
    }[];
    category?: string;
  };
}
