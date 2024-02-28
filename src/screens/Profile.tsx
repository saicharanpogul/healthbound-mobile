import {yupResolver} from '@hookform/resolvers/yup';
import React, {useCallback, useState} from 'react';
import {useForm} from 'react-hook-form';
import {Text, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {useDispatch} from 'react-redux';
import * as yup from 'yup';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import {useAppSelector} from '../hooks/useRedux';
import {resetProfile, setData} from '../rudux/reducers/profile';
import {colors} from '../styles/theme';
import {magic} from '../utils/magic';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const profileState = useAppSelector(state => state.profile);
  const dispatch = useDispatch();
  const schema = yup.object().shape({
    username: yup.string().required('Username is required'),
    address: yup.string().required('Primary address is required'),
  });
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<ProfileValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      address: profileState.primaryAddress || '',
      username: profileState.username || '',
    },
  });
  const onSubmit = (data: ProfileValues) => {
    dispatch(setData({address: data.address, username: data.username}));
  };
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await magic.user.logout();
      dispatch(resetProfile());
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
          label="Username"
          name="username"
          control={control}
          placeholder="Username"
          style={styles.addressInput}
          error={errors.username?.message}
        />
        <Input
          label="Primary Address"
          name="address"
          control={control}
          placeholder="Primary Address"
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
