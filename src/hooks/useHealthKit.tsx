import {useCallback, useEffect, useState} from 'react';
import AppleHealthKit, {
  HealthInputOptions,
  HealthKitPermissions,
} from 'react-native-health';

/* Permission options */
const permissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.ActivitySummary,
      AppleHealthKit.Constants.Permissions.Steps,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
      AppleHealthKit.Constants.Permissions.StepCount,
    ],
  },
} as HealthKitPermissions;

const useHealthKit = () => {
  const [healthData, setHealthData] = useState<HealthData[]>([]);

  const fetchHealthData = useCallback(async () => {
    try {
      AppleHealthKit.initHealthKit(permissions, (error: string) => {
        /* Called after we receive a response from the system */

        if (error) {
          console.log('[ERROR] Cannot grant permissions!');
        }

        /* Can now read or write to HealthKit */
        const startDate = new Date(1706725800000);
        const endDate = new Date();

        const options: HealthInputOptions = {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        };

        AppleHealthKit.getActivitySummary(options, (err, result) => {
          /* Samples are now collected from HealthKit */
          if (err) {
            console.log('ERR:', err);
          } else {
            const summary = result.slice(0, result.length - 1);
            const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
            const totalDays = Math.round(
              Math.abs((startDate.getTime() - endDate.getTime()) / oneDay),
            );
            if (totalDays === summary.length) {
              // TODO: do something
            }
            // Map each summary object to its respective date
            const healthDataArray = summary.map((data, index) => {
              // Calculate the date for the current summary object
              const currentDate = new Date(startDate);
              currentDate.setDate(currentDate.getDate() + index); // Increment the date by the index

              // Convert date to local date time string
              const localDateTimeString = currentDate.getTime();
              return {
                date: localDateTimeString,
                data,
              };
            });
            setHealthData(healthDataArray);
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchHealthData();
  }, [fetchHealthData]);
  return healthData;
};

export default useHealthKit;
