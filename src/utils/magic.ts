import Config from 'react-native-config';
import {Magic} from '@magic-sdk/react-native-bare';
import {SolanaExtension} from '@magic-ext/solana';

export const SOLANA_RPC = `https://mainnet.helius-rpc.com/?api-key=${Config.SOLANA_RPC}`;

export const MAGIC_LINK_API_KEY = Config.MAGIC_LINK_API_KEY as string;

export const magic = new Magic(MAGIC_LINK_API_KEY, {
  extensions: [
    new SolanaExtension({
      rpcUrl: SOLANA_RPC,
    }),
  ],
});
