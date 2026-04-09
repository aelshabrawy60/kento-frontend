import React from 'react'
import ButtonComponent from './ButtonComponent';

function ModalComponent({ title, children, buttonLabel, confirmLabel, onConfirm, closeOnOverlayClick = true, openButtonType = "Solid" }) {

  const [isOpen, setIsOpen] = React.useState(false);

  if (!isOpen) return (
    <div>
      <ButtonComponent type={openButtonType} label={buttonLabel} onClick={() => setIsOpen(true)} />
    </div>
  );

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      setIsOpen(false);
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    setIsOpen(false);
  }

  return (
    <>
      <div className='w-full h-full fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4'>
        <div className='p-4 bg-white rounded-md shadow-lg'>
          <div className='flex justify-between mb-2'>
            <div>{title}</div>
            <div onClick={() => setIsOpen(false)} className='cursor-pointer'>
              X
            </div>
          </div>
          <div>
            {children}
          </div>
          <div className='mt-4'>
            <ButtonComponent label={confirmLabel} onClick={handleConfirm} className='bg-gray-500 hover:bg-gray-600' />
          </div>
        </div>
      </div>
    </>
  )
}

export default ModalComponent