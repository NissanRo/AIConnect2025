'use client';

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { CheckCircle2 } from 'lucide-react';

interface SubmissionConfirmModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const SubmissionConfirmModal: FC<SubmissionConfirmModalProps> = ({ isOpen, onOpenChange }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-center items-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
          <DialogTitle className="text-2xl">Thank You!</DialogTitle>
          <DialogDescription>
            Your interest has been submitted successfully. We will get back to you shortly.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
