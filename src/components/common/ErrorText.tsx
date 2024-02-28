import React from 'react';
import {StyleProp, Text, TextStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {colors, fontSizes} from '../../styles/theme';

type Props = {
  message: string;
  style?: StyleProp<TextStyle>;
};

const ErrorText = ({message}: Props) => {
  return <Text style={styles.error}>{message}</Text>;
};

export default ErrorText;

const styles = ScaledSheet.create({
  error: {
    color: colors.error.main,
    padding: '4@s',
    fontSize: fontSizes[0],
    marginBottom: '2@s',
  },
});
