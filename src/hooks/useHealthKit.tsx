import {useQuery} from 'convex/react';
import {useCallback, useEffect, useMemo, useState} from 'react';
import AppleHealthKit, {
  HealthInputOptions,
  HealthKitPermissions,
} from 'react-native-health';
import {api} from '../../convex/_generated/api';
import {useAppSelector} from './useRedux';
import {Id} from '../../convex/_generated/dataModel';

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
  const profileState = useAppSelector(state => state.profile);
  const startDate = useMemo(() => {
    const _startDate = new Date();
    _startDate.setDate(_startDate.getDate() - 6);
    return _startDate;
  }, []);
  const currentDate = useMemo(() => {
    const _currentDate = new Date();
    return _currentDate.getTime();
  }, []);
  const claims = useQuery(api.claim.getClaims, {
    id: profileState.id as Id<'users'>,
    startDate: startDate.getTime(),
    currentDate: currentDate,
  });

  const fetchHealthData = useCallback(async () => {
    try {
      AppleHealthKit.initHealthKit(permissions, (error: string) => {
        /* Called after we receive a response from the system */

        if (error) {
          console.log('[ERROR] Cannot grant permissions!');
        }

        /* Can now read or write to HealthKit */
        // const startDate = new Date(1706725800000);
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
            const claimedDates = new Set(claims?.map(claim => claim.date));

            let previousActiveEnergyBurned = -1; // Initialize to a non-negative value

            // Map each summary object to its respective date
            const healthDataArray = summary.map((data, index) => {
              // Calculate the date for the current summary object
              const currentDate = new Date(startDate);
              currentDate.setDate(currentDate.getDate() + index); // Increment the date by the index

              // Set hours, minutes, seconds, and milliseconds to 00:00
              currentDate.setHours(0, 0, 0, 0);

              // Convert date to local date time string
              const localDateTimeString = currentDate.getTime();

              // Determine if data is burnable and burned
              const isBurnable =
                previousActiveEnergyBurned !== -1 &&
                // Previous day's activeEnergyBurned is more than current day's
                data.activeEnergyBurned > previousActiveEnergyBurned &&
                previousActiveEnergyBurned > data.activeEnergyBurnedGoal &&
                // Current day's activeEnergyBurned is greater than the activeEnergyBurnedGoal
                data.activeEnergyBurned > data.activeEnergyBurnedGoal;

              // Update previousActiveEnergyBurned for the next iteration
              previousActiveEnergyBurned = data.activeEnergyBurned;

              const isClaimed = claimedDates.has(localDateTimeString);
              const id = claims?.find(c => c.date === localDateTimeString)?._id;
              const nftId = claims?.find(
                c => c.date === localDateTimeString,
              )?.mint;
              return {
                id: id,
                nftId,
                date: localDateTimeString,
                data,
                isClaimed: isClaimed,
                isBurnable,
                isBurned: claims?.filter(
                  c => c.date === localDateTimeString && c.isBurned,
                )?.[0]?.isBurned,
              } as HealthData;
            });
            setHealthData(healthDataArray);
            // console.log(claims);
            // console.log(healthDataArray);
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  }, [startDate, claims]);

  useEffect(() => {
    fetchHealthData();
  }, [fetchHealthData]);
  return healthData;
};

export default useHealthKit;
