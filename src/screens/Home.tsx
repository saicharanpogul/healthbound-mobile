import React, {useCallback, useRef} from 'react';
import {FlatList, Text, View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {ScaledSheet} from 'react-native-size-matters';
import {SvgUri} from 'react-native-svg';
import BottomSheet from '../components/common/BottomSheet';
import Button from '../components/common/Button';
import useHealthKit from '../hooks/useHealthKit';
import {colors} from '../styles/theme';

interface ItemProps {
  burned: number;
  goal: number;
  date: number;
}

const Item: React.FC<ItemProps> = ({burned, goal, date}) => {
  const bottomSheetRef = useRef<RBSheet>();
  const isDisabled = burned < goal;
  const onClick = useCallback(async () => {}, []);
  return (
    <View style={styles.svgContainer}>
      <BottomSheet
        // @ts-ignore
        ref={bottomSheetRef}
        height={200}
        onPress={() => bottomSheetRef.current?.open()}>
        <SvgUri
          uri={`https://healthbound.run/api/hbt/v1?data=${burned}/${goal}&address=GXHE..2x2y&datetime=${date}&type=svg`}
          style={styles.svg}
        />
        <View style={styles.info}>
          <Text style={styles.key}>Total Burnt</Text>
          <Text style={[styles.value, isDisabled ? styles.red : styles.green]}>
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
        <Button onButtonPress={onClick} title="Claim" disabled={isDisabled} />
      </BottomSheet>
    </View>
  );
};

const Home = () => {
  const healthData = useHealthKit();

  // Function to render two items in a row
  const renderPair = (firstItem: HealthData, secondItem?: HealthData) => (
    <View style={styles.itemContainer}>
      <Item
        burned={firstItem?.data.activeEnergyBurned as number}
        goal={firstItem?.data.activeEnergyBurnedGoal as number}
        date={firstItem?.date as number}
      />
      {secondItem && (
        <Item
          burned={secondItem?.data.activeEnergyBurned as number}
          goal={secondItem?.data.activeEnergyBurnedGoal as number}
          date={secondItem?.date as number}
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
        contentContainerStyle={styles.flatlist}
        data={healthData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = ScaledSheet.create({
  screen: {
    paddingVertical: '2@s',
    backgroundColor: colors.background.main,
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
});

export default Home;
