import axios from 'axios';
import {useCallback} from 'react';
import {UNDERDOG_API_ENDPOINT} from '../utils/magic';
import Config from 'react-native-config';
import {truncateAddress} from '../utils';

const useUnderdog = () => {
  const createHBT = useCallback(
    async (username: string, primaryAddress: string, address: string) => {
      try {
        const name = `HBT#${username}`;
        const symbol = 'HBT';
        const description = '';
        const attributes = {
          username,
          address,
        };
        const {} = await axios.post(
          `${UNDERDOG_API_ENDPOINT}/v2/projects/1/nfts`,
          {
            name,
            symbol,
            description,
            image: `https://healthbound.run/api/hbt/v1?&address=${truncateAddress(
              primaryAddress as string,
            )}&soul=${username}&type=svg`,
            attributes,
            receiverAddress: primaryAddress,
          },
          {
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
              Authorization: `Bearer ${Config.UNDERDOG_API_KEY}`,
            },
          },
        );
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    [],
  );

  const createCT = useCallback(
    async (address: string, burned: number, goal: number, date: number) => {
      try {
        const _date = new Date(Number(date));
        const formattedDate = `${_date.getDate()}/${_date.getMonth()}/${_date.getFullYear()}`;
        const name = `CT#${formattedDate}`;
        const symbol = 'CT';
        const description = '';
        const attributes = {
          burned,
          goal,
          date,
        };
        const {data} = await axios.post(
          `${UNDERDOG_API_ENDPOINT}/v2/projects/2/nfts`,
          {
            name,
            symbol,
            description,
            image: `https://healthbound.run/api/ct/v1?data=${burned}/${goal}&address=GXHE..2x2y&datetime=${date}&type=svg`,
            attributes,
            receiverAddress: address,
            delegated: true,
          },
          {
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
              Authorization: `Bearer ${Config.UNDERDOG_API_KEY}`,
            },
          },
        );
        return {nftId: data.nftId};
      } catch (error) {
        throw error;
      }
    },
    [],
  );

  const burnCT = useCallback(async (nftId: string) => {
    try {
      const {} = await axios.post(
        `${UNDERDOG_API_ENDPOINT}/v2/projects/2/nfts/${nftId}/burn`,
        {},
        {
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${Config.UNDERDOG_API_KEY}`,
          },
        },
      );
    } catch (error) {
      throw error;
    }
  }, []);
  return {createHBT, createCT, burnCT};
};

export default useUnderdog;
