import React from 'react';
import {Image, Text, View, Platform} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {colors} from '../styles/theme';
import {Illustration} from '../assets/images';
import Input from '../components/common/Input';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import Button from '../components/common/Button';
import {KeyboardAvoidingView} from 'react-native';
import {magic} from '../utils/magic';
import {useDispatch} from 'react-redux';
import {setIsLoggedIn} from '../rudux/reducers/profile';

interface LoginValues {
  email: string;
}

const Login = () => {
  const dispatch = useDispatch();
  const schema = yup.object().shape({
    email: yup.string().required('Name is required'),
  });
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<LoginValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
    },
  });
  const onSubmit = async (data: LoginValues) => {
    try {
      await magic.auth.loginWithEmailOTP({email: data.email});
      dispatch(setIsLoggedIn({isLoggedIn: true}));
    } catch (error) {
      console.log(error);
      dispatch(setIsLoggedIn({isLoggedIn: false}));
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'position' : 'height'}>
      <View>
        <Image source={Illustration} style={styles.illustration} />
        <Text style={styles.header}>Healthbound</Text>
        <Text style={styles.subTitle}>
          Create your soulbound token associated to your health and claim
          <Text style={styles.subTitleHighlight}>{' Healthbound Tokens '}</Text>
          every day
        </Text>
        <Input
          control={control}
          error={errors?.email?.message}
          name="email"
          placeholder="hello@healthbound.run"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Button
          onButtonPress={handleSubmit(onSubmit)}
          title="Login"
          style={styles.button}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = ScaledSheet.create({
  screen: {
    paddingHorizontal: '24@s',
    height: '100%',
    backgroundColor: colors.background.main,
  },
  illustration: {
    height: '256@s',
    width: '256@s',
    alignSelf: 'center',
    marginTop: '48@s',
  },
  header: {
    fontSize: '24@s',
    color: colors.text.main,
    fontFamily: 'Poppins',
    fontWeight: '800',
    textAlign: 'center',
    marginTop: '48@s',
  },
  subTitle: {
    fontSize: '16@s',
    color: colors.text.main,
    fontFamily: 'Poppins',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: '16@s',
  },
  subTitleHighlight: {
    paddingHorizontal: '24@s',
    fontSize: '16@s',
    color: colors.text.main,
    fontFamily: 'Poppins',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: '16@s',
  },
  input: {
    marginTop: '36@s',
  },
  button: {
    marginTop: '-8@s',
  },
});