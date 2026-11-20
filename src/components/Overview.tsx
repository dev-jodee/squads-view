import { TokenList } from '@/components/TokenList';
import { VaultDisplayer } from '@/components/VaultDisplayer';
import { useMultisigData } from '@/hooks/useMultisigData';
import { ChangeMultisig } from '@/components/ChangeMultisig';

export default function Overview() {
  const { multisigAddress } = useMultisigData();
  if (!multisigAddress) return null;

  return (
    <>
      <ChangeMultisig />
      <div className="sm:col-span-2">
        <VaultDisplayer />
      </div>
      <div className="sm:col-span-2">
        <TokenList multisigPda={multisigAddress} />
      </div>
    </>
  );
}
