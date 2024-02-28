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
  date: number;
  data: HealthActivitySummary;
}

type ProfileValues = {
  name: string;
  address: string;
};
