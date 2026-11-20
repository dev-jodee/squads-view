import { useMultisigData } from './useMultisigData';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { AccountInfo, ParsedAccountData, PublicKey, RpcResponseAndContext } from '@solana/web3.js';
import invariant from 'invariant';
import bs58 from 'bs58';
import { BPF_UPGRADEABLE_LOADER_ID } from '@/lib/transaction/describe/misc';

export interface SimplifiedProgramInfo {
  programAddress: string;
  programDataAddress: string;
  authority: string;
}

export const useProgram = (managedProgramId: string | null) => {
  const { connection, multisigAddress } = useMultisigData();

  const getParsed = (
    account: RpcResponseAndContext<AccountInfo<Buffer | ParsedAccountData> | null>
  ) => {
    const { value } = account;
    if (value && value.data && 'parsed' in value.data) {
      const {
        data: { parsed },
      } = value;
      return parsed;
    }
    return null;
  };

  const getParsedProgramAccount = async (address: PublicKey) => {
    const programAccountInfo = await connection.getParsedAccountInfo(address);
    return getParsed(programAccountInfo);
  };

  const getParsedProgramInfos = async (programAddress: PublicKey) => {
    const programParsed = await getParsedProgramAccount(programAddress);
    invariant(programParsed, `Program account ${programAddress.toBase58()} not found`);
    const programDataParsed = await getParsedProgramAccount(
      new PublicKey(programParsed.info.programData)
    );

    return { programParsed, programDataParsed };
  };

  return useSuspenseQuery({
    queryKey: ['managedProgramId', managedProgramId],
    queryFn: async (): Promise<SimplifiedProgramInfo | null> => {
      if (!multisigAddress || !managedProgramId) return null;
      try {
        const programInfos = await getParsedProgramInfos(new PublicKey(managedProgramId));
        return {
          programAddress: managedProgramId,
          programDataAddress: programInfos.programParsed.info.programData,
          authority: programInfos.programDataParsed.info.authority,
        };
      } catch (error) {
        return null;
      }
    },
  });
};

const PROGRAM_DATA_TAG = bs58.encode(Uint8Array.from([3, 0, 0, 0]));
const PROGRAM_ACCOUNT_SIZE = 36;

export const useVaultPrograms = () => {
  const { connection, multisigVault } = useMultisigData();

  return useQuery({
    queryKey: ['vaultPrograms', connection.rpcEndpoint, multisigVault?.toBase58()],
    enabled: !!multisigVault,
    queryFn: async (): Promise<string[]> => {
      const loader = new PublicKey(BPF_UPGRADEABLE_LOADER_ID);
      const programDatas = await connection.getProgramAccounts(loader, {
        dataSlice: { offset: 0, length: 0 },
        filters: [
          { memcmp: { offset: 0, bytes: PROGRAM_DATA_TAG } },
          {
            memcmp: {
              offset: 12,
              bytes: bs58.encode(Uint8Array.from([1, ...multisigVault!.toBytes()])),
            },
          },
        ],
      });
      const programs = await Promise.all(
        programDatas.map(({ pubkey }) =>
          connection.getProgramAccounts(loader, {
            dataSlice: { offset: 0, length: 0 },
            filters: [
              { dataSize: PROGRAM_ACCOUNT_SIZE },
              { memcmp: { offset: 4, bytes: pubkey.toBase58() } },
            ],
          })
        )
      );
      return programs
        .flat()
        .map(({ pubkey }) => pubkey.toBase58())
        .sort();
    },
  });
};
