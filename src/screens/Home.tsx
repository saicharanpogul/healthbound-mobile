import React, {useCallback, useRef, useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {ScaledSheet} from 'react-native-size-matters';
import {SvgUri} from 'react-native-svg';
import BottomSheet from '../components/common/BottomSheet';
import Button from '../components/common/Button';
import useHealthKit from '../hooks/useHealthKit';
import {colors} from '../styles/theme';
import {useMutation, useQuery} from 'convex/react';
import {api} from '../../convex/_generated/api';
import {useAppSelector} from '../hooks/useRedux';
import {Id} from '../../convex/_generated/dataModel';
import useUnderdog from '../hooks/useUnderdog';
import SimpleToast from 'react-native-simple-toast';
import {truncateAddress} from '../utils';

interface ItemProps {
  nftId?: string;
  id?: string;
  burned: number;
  goal: number;
  date: number;
  isClaimed: boolean;
  isBurnable: boolean;
  isBurned: boolean;
  user:
    | {
        _id: Id<'users'>;
        _creationTime: number;
        mint?: string | undefined;
        username?: string | undefined;
        primaryAddress?: string | undefined;
        address: string;
      }
    | null
    | undefined;
}

const Item: React.FC<ItemProps> = ({
  nftId,
  id,
  burned,
  goal,
  date,
  user,
  isClaimed,
  isBurnable,
  isBurned,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const bottomSheetRef = useRef<RBSheet>();
  const {createCT, burnCT} = useUnderdog();
  const createClaim = useMutation(api.claim.createClaim);
  const updateClaim = useMutation(api.claim.updateClaim);
  const isIncomplete = goal < 150 || burned < goal;
  const isDisabled = goal < 150 || burned < goal || isClaimed;
  const onClick = useCallback(async () => {
    try {
      setIsLoading(true);
      const {nftId} = await createCT(
        user?.address as string,
        burned,
        goal,
        date,
      );
      await createClaim({
        user: user?._id as Id<'users'>,
        date,
        mint: String(nftId),
      });
      SimpleToast.show('Claimed CT 🎉', 5);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [createCT, user?.address, user?._id, burned, goal, date, createClaim]);
  const onClickBurn = useCallback(async () => {
    try {
      setIsLoading(true);
      await burnCT(nftId as string);
      await updateClaim({
        id: id as Id<'claims'>,
        isBurned: true,
        user: user?._id as Id<'users'>,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [burnCT, id, nftId, updateClaim, user?._id]);
  return (
    <View style={styles.svgContainer}>
      <BottomSheet
        // @ts-ignore
        ref={bottomSheetRef}
        height={240}
        onPress={() => bottomSheetRef.current?.open()}>
        <View>
          {isBurnable && (
            <Text style={{position: 'absolute', right: 4, top: 4}}>🔥</Text>
          )}
          <SvgUri
            uri={`https://healthbound.run/api/ct/v1?data=${burned}/${goal}&address=${truncateAddress(
              user?.primaryAddress,
            )}&datetime=${date}&type=svg`}
            style={[styles.svg, {opacity: isClaimed ? 0.5 : 1}]}
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.key}>Total Burnt</Text>
          <Text
            style={[styles.value, isIncomplete ? styles.red : styles.green]}>
            {burned}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.key}>Total Burn Goal</Text>
          <Text style={styles.value}>{goal}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.key}>Date</Text>
          <Text style={styles.value}>
            {new Date(date).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.key}>Burnable</Text>
          <Text style={styles.value}>{isBurnable ? 'YES' : 'NO'}</Text>
        </View>
        {!isClaimed && (
          <Button
            onButtonPress={onClick}
            title={isClaimed ? 'Claimed' : 'Claim'}
            disabled={isDisabled}
            loading={isLoading}
          />
        )}
        {isClaimed && isBurnable && (
          <Button
            onButtonPress={onClickBurn}
            title={isBurned ? 'Burnt' : 'Burn'}
            disabled={isBurned}
            loading={isLoading}
          />
        )}
      </BottomSheet>
    </View>
  );
};

const Home = () => {
  const healthData = useHealthKit();
  const profileState = useAppSelector(state => state.profile);
  const user = useQuery(api.user.getUser, {id: profileState.id as Id<'users'>});

  // Function to render two items in a row
  const renderPair = (firstItem: HealthData, secondItem?: HealthData) => (
    <View style={styles.itemContainer}>
      <Item
        nftId={firstItem.nftId}
        id={firstItem.id}
        burned={firstItem?.data.activeEnergyBurned as number}
        goal={firstItem?.data.activeEnergyBurnedGoal as number}
        date={firstItem?.date as number}
        isClaimed={firstItem?.isClaimed}
        isBurnable={firstItem.isBurnable}
        isBurned={firstItem.isBurned}
        user={user}
      />
      {secondItem && (
        <Item
          nftId={secondItem.nftId}
          id={secondItem.id}
          burned={secondItem?.data.activeEnergyBurned as number}
          goal={secondItem?.data.activeEnergyBurnedGoal as number}
          date={secondItem?.date as number}
          isClaimed={secondItem?.isClaimed}
          isBurnable={secondItem.isBurnable}
          isBurned={secondItem.isBurned}
          user={user}
        />
      )}
    </View>
  );

  const renderItem = ({item, index}: {item: HealthData; index: number}) => {
    // Check if the current item is at an odd index (0-indexed)
    // Render pairs of items
    if (index % 2 === 0) {
      const nextItem = healthData[index + 1]; // Get the next item
      return renderPair(item, nextItem);
    }
    return null;
  };

  return (
    <View style={styles.screen}>
      <FlatList
        scrollEnabled={false}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Past Week Activity</Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footerComponent}>
            <Text style={styles.footerTitle}>
              {'Claim past week Calories Token (CT) before they are gone'}
            </Text>
          </View>
        }
        contentContainerStyle={styles.flatlist}
        ListHeaderComponentStyle={styles.headerView}
        data={healthData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = ScaledSheet.create({
  screen: {
    height: '100%',
    backgroundColor: colors.background.main,
  },
  title: {
    fontSize: '18@s',
    color: colors.text.main,
    fontWeight: '800',
    marginTop: '8@s',
    marginBottom: '16@s',
  },
  flatlist: {
    alignItems: 'center',
    width: '100%',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '12@s',
  },
  bottom: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  svgContainer: {
    marginHorizontal: '4@s',
    position: 'relative',
  },
  svg: {
    width: '150@s',
    height: '150@s',
    borderRadius: '4@s',
    overflow: 'hidden',
  },
  button: {
    height: '28@s',
    width: '40%',
  },
  textButton: {
    fontSize: '12@s',
  },
  info: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: '8@s',
  },
  key: {
    color: colors.text.main,
    fontSize: '16@s',
  },
  value: {
    color: colors.text.main,
    fontSize: '16@s',
    fontWeight: '800',
  },
  green: {
    color: colors.success.main,
  },
  red: {
    color: colors.error.main,
  },
  headerView: {
    marginVertical: '8@s',
  },
  footerComponent: {
    alignItems: 'center',
    marginTop: '16@s',
  },
  footerTitle: {
    fontSize: '12@s',
    fontWeight: '500',
    color: colors.text.light,
    textAlign: 'center',
    opacity: 0.7,
    maxWidth: '75%',
  },
});

export default Home;
