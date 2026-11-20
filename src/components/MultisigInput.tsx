import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useMultisigAddress } from '@/hooks/useMultisigAddress';

const MultisigInput = ({ onUpdate }: { onUpdate: () => void }) => {
  const { multisigAddress, setMultisigAddress } = useMultisigAddress();
  const [multisig, setMultisig] = useState(multisigAddress || '');

  const onSubmit = async () => {
    if (multisig.trim().length > 0) {
      await setMultisigAddress.mutateAsync(multisig); // Save using React Query
      onUpdate(); // Trigger any additional UI updates
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Squad</CardTitle>
        <CardDescription>Enter the multisig config address.</CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          placeholder="Multisig Address"
          value={multisig}
          onChange={(e) => setMultisig(e.target.value.trim())}
        />
        <Button onClick={onSubmit} className="mt-2">
          Set Multisig
        </Button>
      </CardContent>
    </Card>
  );
};

export default MultisigInput;
