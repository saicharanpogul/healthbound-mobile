import {yupResolver} from '@hookform/resolvers/yup';
import {PublicKey} from '@solana/web3.js';
import {useMutation, useQuery} from 'convex/react';
import React, {useCallback, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import {ScaledSheet} from 'react-native-size-matters';
import {SvgUri} from 'react-native-svg';
import {useDispatch} from 'react-redux';
import * as yup from 'yup';
import {api} from '../../convex/_generated/api';
import {Id} from '../../convex/_generated/dataModel';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import {useAppSelector} from '../hooks/useRedux';
import {resetProfile, setData} from '../rudux/reducers/profile';
import {colors} from '../styles/theme';
import {truncateAddress} from '../utils';
import {magic} from '../utils/magic';
import useUnderdog from '../hooks/useUnderdog';
import {CopyLightIcon} from '../assets/icons';
import {useClipboard} from '@react-native-clipboard/clipboard';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const profileState = useAppSelector(state => state.profile);
  const updateProfile = useMutation(api.user.updateUser);
  const user = useQuery(api.user.getUser, {id: profileState.id as Id<'users'>});
  const dispatch = useDispatch();
  const {createHBT} = useUnderdog();
  const [_, setAddress] = useClipboard();
  const schema = yup.object().shape({
    username: yup.string().required('Username is required'),
    address: yup.string().required('Primary address is required'),
  });
  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm<ProfileValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      address: '',
      username: '',
    },
  });
  useEffect(() => {
    if (user) {
      setData({username: user.username, primaryAddress: user.primaryAddress});
      setValue(
        'address',
        (user.primaryAddress as string) ||
          (profileState.primaryAddress as string),
      );
      setValue(
        'username',
        (user.username as string) || (profileState.username as string),
      );
    } else if (profileState) {
      setValue('address', profileState.primaryAddress as string);
      setValue('username', profileState.username as string);
    }
  }, [user, profileState, setValue]);
  const onSubmit = async (data: ProfileValues) => {
    try {
      setIsLoading(true);
      const isOnCurve = PublicKey.isOnCurve(data.address);
      if (!isOnCurve) {
        return;
      }
      await createHBT(
        data.username as string,
        data.address as string,
        user?.address as string,
      );
      await updateProfile({
        user: profileState.id as Id<'users'>,
        address: profileState.address,
        primaryAddress: data.address,
        username: data.username,
      });
      dispatch(
        setData({username: data.username, primaryAddress: data.address}),
      );
      SimpleToast.show('Claimed HBT 🎉', 5);
    } catch (error: any) {
      if (error.message.includes('public')) {
        SimpleToast.show('Invalid public key!', 3, {
          backgroundColor: colors.error.main,
        });
      } else {
        SimpleToast.show('Something went wrong!', 3, {
          backgroundColor: colors.error.main,
        });
      }
    } finally {
      setIsLoading(false);
    }
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
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity
            onPress={() => {
              setAddress(profileState.address);
              SimpleToast.show('Copied', 3);
            }}
            style={styles.addressBar}>
            <Text style={styles.address}>
              {truncateAddress(profileState?.address)}
            </Text>
            <Image source={CopyLightIcon} style={{width: 22, height: 22}} />
          </TouchableOpacity>
        </View>
        <Input
          label="Username"
          name="username"
          control={control}
          placeholder="Username"
          style={styles.addressInput}
          error={errors.username?.message}
          autoCapitalize="none"
          editable={!user?.username}
        />
        <Input
          label="Primary Address"
          name="address"
          control={control}
          placeholder="Primary Address"
          style={styles.addressInput}
          error={errors.address?.message}
          editable={!user?.primaryAddress}
        />
        {(!user?.username || !user?.primaryAddress) && (
          <Button
            onButtonPress={handleSubmit(onSubmit)}
            title="Claim HBT"
            style={styles.saveButton}
            loading={isLoading}
          />
        )}
      </View>
      <View style={styles.bottom}>
        <Button onButtonPress={logout} title="Log Out" loading={isLoading} />
      </View>

      {user?.primaryAddress && (
        <View>
          <Text style={styles.imageTitle}>Healthbound Token</Text>
          <SvgUri
            uri={`https://healthbound.run/api/hbt/v1?&address=${truncateAddress(
              user?.primaryAddress as string,
            )}&soul=${user?.username}&type=svg`}
            style={styles.svg}
            onPress={() => {
              SimpleToast.show('More coming soon...', 5);
            }}
          />
        </View>
      )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: '8@s',
  },
  title: {
    fontSize: '20@s',
    color: colors.text.main,
    fontWeight: '800',
    textAlign: 'center',
  },
  addressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.text.light,
    borderWidth: '1@s',
    borderRadius: '4@s',
    padding: '4@s',
  },
  address: {
    fontSize: '12@s',
    color: colors.text.main,
    fontWeight: '600',
    textAlign: 'center',
    marginLeft: '8@s',
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
  svg: {
    width: '280@s',
    height: '280@s',
    borderRadius: '4@s',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  imageTitle: {
    color: colors.text.light,
    fontSize: '14@s',
    marginHorizontal: '12@s',
    marginBottom: '8@s',
    fontWeight: '700',
  },
});
