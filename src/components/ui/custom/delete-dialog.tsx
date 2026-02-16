'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { LoadingButton } from './loading-button';

interface DeleteConfirmationDialogProps {
  visible: boolean;
  isLoading: boolean;
  itemDescription: string;
  onHide: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  visible,
  isLoading,
  itemDescription,
  onHide,
  onConfirm
}) => {
  return (
    <Dialog open={visible} onOpenChange={onHide}>
      <DialogContent className='flex w-full max-w-md flex-col justify-center p-6 sm:max-w-[40vw]'>
        <DialogHeader className='flex flex-col items-center gap-4 text-center'>
          <div className='flex items-center justify-center rounded-full bg-red-100 p-4'>
            <Trash className='text-red-600' />
          </div>
          <DialogTitle>Delete Confirmation</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{' '}
            <span className='font-medium'>{itemDescription}</span>? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex !justify-center gap-4 pt-4'>
          <Button variant='outline' onClick={onHide} disabled={isLoading}>
            Cancel
          </Button>
          <LoadingButton
            variant='destructive'
            onClick={onConfirm}
            disabled={isLoading}
            isLoading={isLoading}
          >
            Delete
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
