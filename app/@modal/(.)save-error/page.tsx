// app/@modal/(.)save-error/page.tsx

// Use 'use client' since this modal will likely handle closing interaction
'use client';

const SaveErrorModal = () => {
  // Logic to handle displaying the specific error message and closing the modal
  return (
    <div
      style={{
        padding: '25px',
        border: '2px solid red',
        backgroundColor: '#fff3f3',
        borderRadius: '8px',
      }}
    >
      <h2>❌ Save Error</h2>
      <p>An error occurred while trying to save your data. Please try again.</p>
      {/* Add a close button here */}
    </div>
  );
};

export default SaveErrorModal;
