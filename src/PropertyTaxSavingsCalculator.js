// src/PropertyTaxSavingsCalculator.js

import React, { useState, useEffect } from 'react';

const PropertyTaxSavingsCalculator = () => {
  // Basic inputs
  const [income, setIncome] = useState(100000);
  const [loanAmount, setLoanAmount] = useState(300000);
  const [interestRate, setInterestRate] = useState(4);
  const [filingStatus, setFilingStatus] = useState('single');

  // Property-related inputs
  const [propertyTax, setPropertyTax] = useState(3000);
  const [homeRepairs, setHomeRepairs] = useState(2000);
  const [isRental, setIsRental] = useState(false);
  const [rentalIncome, setRentalIncome] = useState(0);
  const [rentalExpenses, setRentalExpenses] = useState(0);

  // Other deductions
  const [retirementContributions, setRetirementContributions] = useState(6000);
  const [otherDeductions, setOtherDeductions] = useState(1000);
  const [stateTaxes, setStateTaxes] = useState(5000);

  // Calculated values
  const [mortgageInterest, setMortgageInterest] = useState(0);
  const [standardDeduction, setStandardDeduction] = useState(0);
  const [itemizedDeduction, setItemizedDeduction] = useState(0);
  const [taxableIncomeStandard, setTaxableIncomeStandard] = useState(0);
  const [taxableIncomeItemized, setTaxableIncomeItemized] = useState(0);
  const [taxLiabilityStandard, setTaxLiabilityStandard] = useState(0);
  const [taxLiabilityItemized, setTaxLiabilityItemized] = useState(0);
  const [taxSavings, setTaxSavings] = useState(0);
  const [netRentalIncome, setNetRentalIncome] = useState(0);

  const calculateTax = (taxableIncome) => {
    // 2023 tax brackets (simplified)
    if (filingStatus === 'single') {
      if (taxableIncome <= 11000) return taxableIncome * 0.10;
      if (taxableIncome <= 44725) return 1100 + (taxableIncome - 11000) * 0.12;
      if (taxableIncome <= 95375) return 5147 + (taxableIncome - 44725) * 0.22;
      if (taxableIncome <= 182100) return 16290 + (taxableIncome - 95375) * 0.24;
      if (taxableIncome <= 231250) return 37104 + (taxableIncome - 182100) * 0.32;
      if (taxableIncome <= 578125) return 52832 + (taxableIncome - 231250) * 0.35;
      return 174238.25 + (taxableIncome - 578125) * 0.37;
    } else {
      // Married filing jointly
      if (taxableIncome <= 22000) return taxableIncome * 0.10;
      if (taxableIncome <= 89450) return 2200 + (taxableIncome - 22000) * 0.12;
      if (taxableIncome <= 190750) return 10294 + (taxableIncome - 89450) * 0.22;
      if (taxableIncome <= 364200) return 32580 + (taxableIncome - 190750) * 0.24;
      if (taxableIncome <= 462500) return 74208 + (taxableIncome - 364200) * 0.32;
      if (taxableIncome <= 693750) return 105664 + (taxableIncome - 462500) * 0.35;
      return 186601.50 + (taxableIncome - 693750) * 0.37;
    }
  };

  useEffect(() => {
    const calculateValues = () => {
      const annualMortgageInterest = (loanAmount * interestRate) / 100;
      setMortgageInterest(annualMortgageInterest);

      const standardDed = filingStatus === 'single' ? 13850 : 27700; // 2023 values
      setStandardDeduction(standardDed);

      let totalItemizedDeductions = annualMortgageInterest + propertyTax + Math.min(stateTaxes, 10000) + otherDeductions;
      if (!isRental) {
        totalItemizedDeductions += homeRepairs;
      }
      setItemizedDeduction(totalItemizedDeductions);

      let adjustedIncome = income - retirementContributions;
      if (isRental) {
        const netRental = rentalIncome - rentalExpenses - homeRepairs;
        setNetRentalIncome(netRental);
        adjustedIncome += netRental;
      }

      const taxableIncomeStd = Math.max(0, adjustedIncome - standardDed);
      setTaxableIncomeStandard(taxableIncomeStd);

      const taxableIncomeItem = Math.max(0, adjustedIncome - totalItemizedDeductions);
      setTaxableIncomeItemized(taxableIncomeItem);

      const taxLiabilityStd = calculateTax(taxableIncomeStd);
      setTaxLiabilityStandard(taxLiabilityStd);

      const taxLiabilityItem = calculateTax(taxableIncomeItem);
      setTaxLiabilityItemized(taxLiabilityItem);

      setTaxSavings(taxLiabilityStd - taxLiabilityItem);
    };

    calculateValues();
  }, [
    income,
    loanAmount,
    interestRate,
    filingStatus,
    propertyTax,
    homeRepairs,
    isRental,
    rentalIncome,
    rentalExpenses,
    retirementContributions,
    otherDeductions,
    stateTaxes,
  ]);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Explanatory Sections */}
      <div style={explanationStyle}>
        <h2>About This Calculator</h2>
        <p>
          The <strong>Property Tax Savings Calculator</strong> helps you estimate potential tax savings by itemizing deductions
          related to property ownership and retirement contributions. By inputting your financial details, the calculator 
          compares the standard deduction against itemized deductions to determine which option offers greater tax benefits.
        </p>
      
        <h2>How It Works</h2>
        <p>
          This calculator assesses your annual income, loan details, property taxes, home repairs, rental income (if applicable),
          retirement contributions, and other deductions. It then calculates your taxable income and tax liability under both 
          standard and itemized deduction scenarios, highlighting potential tax savings.
        </p>
      
        <h2>Assumptions</h2>
        <ul>
          <li>Tax rates are based on the 2023 federal tax brackets.</li>
          <li>The standard deduction values are set to $13,850 for single filers and $27,700 for married filing jointly.</li>
          <li>State and local taxes are capped at $10,000.</li>
          <li>Only mortgage interest, property tax, home repairs, rental income, rental expenses, retirement contributions, 
              and other specified deductions are considered.</li>
        </ul>
      
        <h2>Usage Instructions</h2>
        <ol>
          <li>Enter your annual income and loan details.</li>
          <li>Provide information about your property taxes and any home repairs or improvements.</li>
          <li>If you own a rental property, check the box and input your rental income and expenses.</li>
          <li>Include your retirement contributions and any other deductions.</li>
          <li>The calculator will automatically compute and display your tax liabilities and potential savings.</li>
        </ol>
        
        <h2>Additional Information</h2>
        <p>
          This tool is designed for estimation purposes only. For personalized tax advice, please consult a tax professional.
        </p>
      </div>
      
      {/* Existing Calculator UI */}
      <div style={cardStyle}>
        <h2>Basic Inputs</h2>
        <div style={gridStyle}>
          <div style={inputGroupStyle}>
            <label htmlFor="income">Annual Income ($)</label>
            <input
              id="income"
              type="number"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="loanAmount">Loan Amount ($)</label>
            <input
              id="loanAmount"
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="interestRate">Interest Rate (%)</label>
            <input
              id="interestRate"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="filingStatus">Filing Status</label>
            <select
              id="filingStatus"
              value={filingStatus}
              onChange={(e) => setFilingStatus(e.target.value)}
              style={inputStyle}
            >
              <option value="single">Single</option>
              <option value="married">Married Filing Jointly</option>
            </select>
          </div>
        </div>

        {/* Property-Related Inputs */}
        <h2>Property-Related Inputs</h2>
        <div style={gridStyle}>
          <div style={inputGroupStyle}>
            <label htmlFor="propertyTax">Annual Property Tax ($)</label>
            <input
              id="propertyTax"
              type="number"
              value={propertyTax}
              onChange={(e) => setPropertyTax(Number(e.target.value))}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="homeRepairs">Home Repairs/Improvements ($)</label>
            <input
              id="homeRepairs"
              type="number"
              value={homeRepairs}
              onChange={(e) => setHomeRepairs(Number(e.target.value))}
              style={inputStyle}
            />
          </div>
          <div style={{ ...inputGroupStyle, gridColumn: 'span 2' }}>
            <label>
              <input
                type="checkbox"
                checked={isRental}
                onChange={(e) => setIsRental(e.target.checked)}
                style={{ marginRight: '10px' }}
              />
              Is this a rental property?
            </label>
          </div>
          {isRental && (
            <>
              <div style={inputGroupStyle}>
                <label htmlFor="rentalIncome">Annual Rental Income ($)</label>
                <input
                  id="rentalIncome"
                  type="number"
                  value={rentalIncome}
                  onChange={(e) => setRentalIncome(Number(e.target.value))}
                  style={inputStyle}
                />
              </div>
              <div style={inputGroupStyle}>
                <label htmlFor="rentalExpenses">Rental Expenses ($)</label>
                <input
                  id="rentalExpenses"
                  type="number"
                  value={rentalExpenses}
                  onChange={(e) => setRentalExpenses(Number(e.target.value))}
                  style={inputStyle}
                />
              </div>
            </>
          )}
        </div>

        {/* Other Deductions and Contributions */}
        <h2>Other Deductions and Contributions</h2>
        <div style={gridStyle}>
          <div style={inputGroupStyle}>
            <label htmlFor="retirementContributions">401(k)/Traditional IRA Contributions ($)</label>
            <input
              id="retirementContributions"
              type="number"
              value={retirementContributions}
              onChange={(e) => setRetirementContributions(Number(e.target.value))}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="otherDeductions">Other Deductions ($)</label>
            <input
              id="otherDeductions"
              type="number"
              value={otherDeductions}
              onChange={(e) => setOtherDeductions(Number(e.target.value))}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="stateTaxes">State and Local Taxes ($)</label>
            <input
              id="stateTaxes"
              type="number"
              value={stateTaxes}
              onChange={(e) => setStateTaxes(Number(e.target.value))}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Results */}
        <h2>Results</h2>
        <div style={gridStyle}>
          <div>
            <p><strong>Annual Mortgage Interest:</strong> ${mortgageInterest.toFixed(2)}</p>
            <p><strong>Standard Deduction:</strong> ${standardDeduction.toFixed(2)}</p>
            <p><strong>Itemized Deduction:</strong> ${itemizedDeduction.toFixed(2)}</p>
            {isRental && <p><strong>Net Rental Income:</strong> ${netRentalIncome.toFixed(2)}</p>}
          </div>
          <div>
            <p><strong>Taxable Income (Standard):</strong> ${taxableIncomeStandard.toFixed(2)}</p>
            <p><strong>Taxable Income (Itemized):</strong> ${taxableIncomeItemized.toFixed(2)}</p>
            <p><strong>Tax Liability (Standard):</strong> ${taxLiabilityStandard.toFixed(2)}</p>
            <p><strong>Tax Liability (Itemized):</strong> ${taxLiabilityItemized.toFixed(2)}</p>
          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
            Tax Savings: ${taxSavings > 0 ? taxSavings.toFixed(2) : '0.00'}
          </p>
          <p>
            {taxSavings > 0
              ? "You save money by itemizing deductions."
              : "You save more by taking the standard deduction."}
          </p>
        </div>
      </div>
    </div>
  );
};

// Inline Styles
const cardStyle = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '20px',
  boxShadow: '2px 2px 12px rgba(0,0,0,0.1)',
  backgroundColor: '#fff',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
};

const inputGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const inputStyle = {
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  marginTop: '5px',
  fontSize: '1em',
};

const explanationStyle = {
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '20px',
  backgroundColor: '#fafafa',
  boxShadow: '1px 1px 8px rgba(0,0,0,0.05)',
};

export default PropertyTaxSavingsCalculator;
