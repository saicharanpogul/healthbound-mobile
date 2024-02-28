import React, {useCallback, useState} from 'react';
import {Text, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import Input from '../components/common/Input';
import {colors} from '../styles/theme';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import Button from '../components/common/Button';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../rudux/store';
import {setData, setIsLoggedIn} from '../rudux/reducers/profile';
import {magic} from '../utils/magic';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const profileState = useSelector<RootState>(
    state => state.profile,
  ) as unknown as ProfileValues;
  const dispatch = useDispatch();
  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    address: yup.string().required('Address is required'),
  });
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<ProfileValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      address: profileState.address || '',
      name: profileState.name || '',
    },
  });
  const onSubmit = (data: ProfileValues) => {
    // console.log(data.address);
    dispatch(setData({address: data.address, name: data.name}));
  };
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await magic.user.logout();
      dispatch(setIsLoggedIn({isLoggedIn: false}));
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);
  return (
    <View style={styles.screen}>
      <View style={styles.view}>
        <Text style={styles.title}>Profile</Text>
        <Input
          label="Name"
          name="name"
          control={control}
          placeholder="Name"
          style={styles.addressInput}
          error={errors.address?.message}
        />
        <Input
          label="Address"
          name="address"
          control={control}
          placeholder="Address"
          style={styles.addressInput}
          error={errors.address?.message}
        />
        <Button
          onButtonPress={handleSubmit(onSubmit)}
          title="Save"
          style={styles.saveButton}
        />
      </View>
      <View style={styles.bottom}>
        <Button onButtonPress={logout} title="Log Out" loading={isLoading} />
      </View>
    </View>
  );
};

export default Profile;

const styles = ScaledSheet.create({
  screen: {
    paddingHorizontal: '24@s',
    backgroundColor: colors.background.main,
    height: '100%',
  },
  view: {
    paddingHorizontal: '8@s',
    marginTop: '16@s',
  },
  title: {
    fontSize: '20@s',
    color: colors.text.main,
    marginTop: '8@s',
    fontWeight: '800',
    textAlign: 'center',
  },
  addressInput: {
    width: '100%',
  },
  saveButton: {},
  bottom: {
    position: 'absolute',
    bottom: '16@s',
    width: '100%',
    alignSelf: 'center',
  },
});
