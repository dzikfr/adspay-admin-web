import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  description: string
  onConfirm: () => Promise<void> | void
  onClose: () => void
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    try {
      setLoading(true)
      await onConfirm()
    } finally {
      setLoading(false)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-500">{description}</p>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={loading}>
            {loading ? 'Processing...' : 'Konfirmasi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
