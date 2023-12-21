import React, { useState } from 'react';

const DonateButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleAmountChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setAmount(e.target.value);
  };

  const handleSubmit = () => {
    console.log('Donation Amount:', amount);
    
  };

  return (
    <div>
      <button onClick={handleToggleDropdown}>Donate</button>
      {isOpen && (
        <div className="dropdown">
          <input
            type="number"
            placeholder="Donation Amount"
            value={amount}
            onChange={handleAmountChange}
          />
          <button onClick={handleSubmit}>Send</button>
        </div>
      )}
    </div>
  );
};

export default DonateButton;
