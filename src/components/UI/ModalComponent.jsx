import React, { useEffect } from 'react'
import ButtonComponent from './ButtonComponent';
import { X } from 'lucide-react';

function ModalComponent({ title, children, buttonLabel, confirmLabel, onConfirm, closeOnOverlayClick = true, openButtonType = "Solid", className = "", overflowVisible = false }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [show, setShow] = React.useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShow(true), 10);
      document.body.style.overflow = 'hidden';
    } else {
      setShow(false);
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      handleClose();
    }
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(() => setIsOpen(false), 200);
  }

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    handleClose();
  }

  return (
    <>
      <div className={className}>
        <ButtonComponent type={openButtonType} label={buttonLabel} onClick={() => setIsOpen(true)} />
      </div>

      {(isOpen || show) && (
        <div 
          className={`fixed inset-0 z-[100] flex justify-center items-center p-4 sm:p-6 transition-all duration-300 ${show ? 'opacity-100 bg-gray-900/40 backdrop-blur-sm' : 'opacity-0 bg-transparent'}`}
          onClick={handleOverlayClick}
        >
          <div 
            className={`bg-white rounded-3xl shadow-2xl w-full max-w-md ${overflowVisible ? '' : 'overflow-hidden'} transform transition-all duration-300 flex flex-col max-h-full ${show ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'}`}
          >
            {/* Header */}
            <div className='flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0 rounded-t-3xl bg-white'>
              <h3 className='text-xl font-bold text-gray-900'>{title}</h3>
              <button 
                onClick={handleClose} 
                className='p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none'
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Body */}
            <div className={`p-6 ${overflowVisible ? 'overflow-visible' : 'overflow-y-auto min-h-0'}`}>
              {children}
            </div>
            
            {/* Footer */}
            <div className='px-6 py-5 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0 rounded-b-3xl'>
              <ButtonComponent 
                label={confirmLabel} 
                onClick={handleConfirm} 
                className='!w-auto !max-w-none px-8 font-semibold shadow-sm hover:shadow transition-all hover:-translate-y-0.5' 
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ModalComponent