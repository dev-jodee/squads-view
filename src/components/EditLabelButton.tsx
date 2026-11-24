import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useAddressLabels } from '@/hooks/useAddressLabels';

const EditLabelButton = ({ address }: { address: string }) => {
  const { labels, setLabel } = useAddressLabels();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (next) setDraft(labels[address] ?? '');
        setOpen(next);
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="shrink-0" aria-label="Edit label">
          <Pencil className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <form
          className="space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            setLabel.mutate({ address, label: draft });
            setOpen(false);
          }}
        >
          <p className="break-all font-mono text-xs text-muted-foreground">{address}</p>
          <Input
            autoFocus
            placeholder="Label (empty to remove)"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <Button type="submit" size="sm" className="w-full">
            Save
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default EditLabelButton;
