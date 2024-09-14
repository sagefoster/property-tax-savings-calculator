// src/PropertyTaxSavingsCalculator.js

import React, { useState, useEffect } from 'react';

// Collapsible Section Component
const CollapsibleSection = ({ title, children, defaultOpen = true, headerColor = '#1e90ff' }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={collapsibleSectionStyle}>
      <div
        onClick={toggleSection}
        style={collapsibleHeaderStyle}
        aria-expanded={isOpen}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            toggleSection();
          }
        }}
      >
        <h3 style={{ ...collapsibleTitleStyle, color: headerColor }}>{title}</h3>
        <span style={indicatorStyle}>{isOpen ? '-' : '+'}</span>
      </div>
      {isOpen && <div style={collapsibleContentStyle}>{children}</div>}
    </div>
  );
};

const PropertyTaxSavingsCalculator = () => {
  // Basic inputs with default values set to empty strings for easier input
  const [income, setIncome] = useState(''); // Annual Income
  const [loanAmount, setLoanAmount] = useState(''); // Loan Amount
  const [interestRate, setInterestRate] = useState(''); // Interest Rate
  const [homeRepairs, setHomeRepairs] = useState(''); // Home Repairs/Improvements
  const [filingStatus, setFilingStatus] = useState('single'); // Filing Status

  // Property-related inputs
  const [propertyTax, setPropertyTax] = useState(''); // Annual Property Tax
  const [isRental, setIsRental] = useState(false); // Rental Property Checkbox
  const [rentalIncome, setRentalIncome] = useState(''); // Rental Income
  const [rentalExpenses, setRentalExpenses] = useState(''); // Rental Expenses

  // Other deductions
  const [retirementContributions, setRetirementContributions] = useState(''); // Retirement Contributions
  const [otherDeductions, setOtherDeductions] = useState(''); // Other Deductions
  const [stateTaxes, setStateTaxes] = useState('0'); // State and Local Taxes (Default to 0)

  // Additional Quick Start Inputs
  const [dependents, setDependents] = useState(''); // Number of Dependents

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
  const [previousTaxLiability, setPreviousTaxLiability] = useState(null);
  const [explanation, setExplanation] = useState('');

  // Quick Input Inputs
  const [quickIncome, setQuickIncome] = useState('');
  const [quickRetirement, setQuickRetirement] = useState('');
  const [quickLoanAmount, setQuickLoanAmount] = useState('');
  const [quickInterestRate, setQuickInterestRate] = useState('');
  const [quickFilingStatus, setQuickFilingStatus] = useState('single');
  const [quickDependents, setQuickDependents] = useState('');

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Effect to set default interest rate and home repairs when loanAmount changes
  useEffect(() => {
    if (parseFloat(loanAmount) > 0) {
      if (interestRate === '') {
        // Set a reasonable default interest rate, e.g., 3.5%
        setInterestRate(3.5);
      }
      if (homeRepairs === '') {
        // Set a reasonable default home repairs, e.g., $2,000
        setHomeRepairs(2000);
      }
    } else {
      // Reset interest rate and home repairs if no loan
      setInterestRate('');
      setHomeRepairs('');
    }
  }, [loanAmount, interestRate, homeRepairs]);

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

  const handleCalculate = () => {
    // Validate and parse inputs
    const parsedIncome = parseFloat(income) || 0;
    const parsedLoanAmount = parseFloat(loanAmount) || 0;
    const parsedInterestRate = parseFloat(interestRate) || 0;
    const parsedHomeRepairs = parseFloat(homeRepairs) || 0;
    const parsedPropertyTax = parseFloat(propertyTax) || 0;
    const parsedRentalIncome = parseFloat(rentalIncome) || 0;
    const parsedRentalExpenses = parseFloat(rentalExpenses) || 0;
    const parsedRetirement = parseFloat(retirementContributions) || 0;
    const parsedOtherDeductions = parseFloat(otherDeductions) || 0;
    const parsedStateTaxes = parseFloat(stateTaxes) || 0;
    const parsedDependents = parseInt(dependents) || 0;

    // Store previous tax liability for comparison
    const previous = taxLiabilityItemized;
    setPreviousTaxLiability(previous);

    // Calculate mortgage interest
    const annualMortgageInterest = (parsedLoanAmount * parsedInterestRate) / 100;
    setMortgageInterest(annualMortgageInterest);

    // Determine standard deduction
    const standardDed = filingStatus === 'single' ? 13850 : 27700; // 2023 values
    setStandardDeduction(standardDed);

    // Calculate total itemized deductions
    let totalItemizedDeductions =
      annualMortgageInterest +
      parsedPropertyTax +
      Math.min(parsedStateTaxes, 10000) +
      parsedOtherDeductions;
    if (!isRental) {
      totalItemizedDeductions += parsedHomeRepairs;
    }
    setItemizedDeduction(totalItemizedDeductions);

    // Calculate net rental income
    let adjustedIncome = parsedIncome - parsedRetirement;
    if (isRental) {
      const netRental = parsedRentalIncome - parsedRentalExpenses - parsedHomeRepairs;
      setNetRentalIncome(netRental);
      adjustedIncome += netRental;
    } else {
      setNetRentalIncome(0);
    }

    // Calculate taxable incomes
    const taxableIncomeStd = Math.max(0, adjustedIncome - standardDed);
    setTaxableIncomeStandard(taxableIncomeStd);

    const taxableIncomeItem = Math.max(0, adjustedIncome - totalItemizedDeductions);
    setTaxableIncomeItemized(taxableIncomeItem);

    // Calculate tax liabilities
    const taxLiabilityStd = calculateTax(taxableIncomeStd);
    setTaxLiabilityStandard(taxLiabilityStd);

    const taxLiabilityItem = calculateTax(taxableIncomeItem);
    setTaxLiabilityItemized(taxLiabilityItem);

    // Calculate tax savings before credits
    const savingsBeforeCredits = taxLiabilityStd - taxLiabilityItem;

    // Calculate tax credits based on dependents ($2000 per dependent)
    const taxCredits = parsedDependents * 2000;
    const taxLiabilityItemWithCredits = Math.max(0, taxLiabilityItem - taxCredits);
    setTaxLiabilityItemized(taxLiabilityItemWithCredits);

    // Calculate final tax savings after credits
    const finalSavings = taxLiabilityStd - taxLiabilityItemWithCredits;
    setTaxSavings(finalSavings);

    // Generate explanation based on tax liability change
    if (previous !== null) {
      if (finalSavings > 0) {
        setExplanation(
          'Your tax liability decreased because your itemized deductions and dependents tax credits are higher than the standard deduction.'
        );
      } else if (finalSavings < 0) {
        setExplanation(
          'Your tax liability increased because your itemized deductions and dependents tax credits are lower than the standard deduction.'
        );
      } else {
        setExplanation(
          'Your tax liability remains the same as your itemized deductions and dependents tax credits equal the standard deduction.'
        );
      }
    } else {
      // First calculation
      if (finalSavings > 0) {
        setExplanation(
          'Based on your inputs, your itemized deductions and dependents tax credits are higher than the standard deduction, resulting in tax savings.'
        );
      } else if (finalSavings < 0) {
        setExplanation(
          'Based on your inputs, your itemized deductions and dependents tax credits are lower than the standard deduction, resulting in higher tax liability.'
        );
      } else {
        setExplanation(
          'Based on your inputs, your itemized deductions and dependents tax credits equal the standard deduction, resulting in no change to your tax liability.'
        );
      }
    }
  };

  const handleQuickInputSubmit = (e) => {
    e.preventDefault();
    // Validate and parse Quick Inputs
    const parsedQuickIncome = parseFloat(quickIncome) || 0;
    const parsedQuickRetirement = parseFloat(quickRetirement) || 0;
    const parsedQuickLoanAmount = parseFloat(quickLoanAmount) || 0;
    const parsedQuickInterestRate = parseFloat(quickInterestRate) || 0;
    const parsedQuickFilingStatus = quickFilingStatus;
    const parsedQuickDependents = parseInt(quickDependents) || 0;

    // Update the main calculator inputs
    setIncome(parsedQuickIncome);
    setRetirementContributions(parsedQuickRetirement);
    setLoanAmount(parsedQuickLoanAmount);
    setInterestRate(parsedQuickInterestRate);
    setFilingStatus(parsedQuickFilingStatus);
    setDependents(parsedQuickDependents);

    // If loan amount is entered, set default home repairs if empty
    if (parsedQuickLoanAmount > 0 && homeRepairs === '') {
      setHomeRepairs(2000);
    }
  };

  return (
    <div style={containerStyle}>
      
      {/* Quick Input Form */}
      <div style={quickInputContainerStyle}>
        <h2 style={sectionHeaderStyle}>Quick Start</h2>
        <form onSubmit={handleQuickInputSubmit} style={quickInputFormStyle}>
          <div style={quickInputGroupStyle}>
            <label htmlFor="quickIncome">I make </label>
            <input
              type="number"
              value={quickIncome}
              onChange={(e) => setQuickIncome(e.target.value)}
              placeholder="X"
              style={quickInputStyle}
              required
              min="0"
            />
            <span> dollars a year,</span>
          </div>
          <div style={quickInputGroupStyle}>
            <label htmlFor="quickRetirement">I contribute </label>
            <input
              type="number"
              value={quickRetirement}
              onChange={(e) => setQuickRetirement(e.target.value)}
              placeholder="X"
              style={quickInputStyle}
              required
              min="0"
            />
            <span> to retirement,</span>
          </div>
          <div style={quickInputGroupStyle}>
            <label htmlFor="quickLoanAmount">I have a mortgage amount of </label>
            <input
              type="number"
              value={quickLoanAmount}
              onChange={(e) => setQuickLoanAmount(e.target.value)}
              placeholder="X"
              style={quickInputStyle}
              min="0"
            />
            <span> with an interest rate of </span>
            <input
              type="number"
              value={quickInterestRate}
              onChange={(e) => setQuickInterestRate(e.target.value)}
              placeholder="X"
              style={quickInputStyle}
              min="0"
              step="0.01"
            />
            <span>% on the loan.</span>
          </div>
          <div style={quickInputGroupStyle}>
            <label htmlFor="quickFilingStatus">I file taxes as </label>
            <select
              id="quickFilingStatus"
              value={quickFilingStatus}
              onChange={(e) => setQuickFilingStatus(e.target.value)}
              style={quickInputStyle}
              required
            >
              <option value="single">Single</option>
              <option value="married">Married Filing Jointly</option>
            </select>
            <span>, and I have </span>
            <input
              type="number"
              value={quickDependents}
              onChange={(e) => setQuickDependents(e.target.value)}
              placeholder="X"
              style={quickInputStyle}
              min="0"
              step="1"
            />
            <span> dependents.</span>
          </div>
          <button type="submit" style={applyInputsButtonStyle}>
            Apply Inputs
          </button>
        </form>
      </div>

      {/* Collapsible Explanatory Sections */}
      <div style={explanatoryContainerStyle}>
        {/* Instructions and How to Use */}
        <CollapsibleSection title="Instructions and How to Use the Calculator" defaultOpen={false}>
          {/* Brief Message When Closed */}
          <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>
            Enter your inputs above, then click 'Apply Inputs' to add them to the calculator. Adjust if needed, then press 'Calculate' to see how you may lower your annual tax bill.
          </p>
          {/* Detailed Instructions When Expanded */}
          <div>
            <p>
              Welcome to the <strong>Property Tax Savings Calculator</strong>. This tool helps you estimate potential tax savings by comparing standard and itemized deductions based on your financial inputs.
            </p>
            <ol>
              <li>Use the "Quick Start" section above to input your basic financial details quickly.</li>
              <li>Provide additional information about your property taxes and any home repairs or improvements in the "Property-Related Inputs" section.</li>
              <li>If you own a rental property, check the box and input your rental income and expenses.</li>
              <li>Include your retirement contributions and any other deductions in the "Other Deductions and Contributions" section.</li>
              <li>Click the "Calculate" button to compute your tax liabilities and potential savings.</li>
            </ol>
          </div>
        </CollapsibleSection>
      </div>
      
      {/* Calculator UI */}
      <div style={cardStyle}>
        <h2 style={sectionHeaderStyle}>Basic Inputs</h2>
        <div style={gridStyle}>
          <div style={inputGroupStyle}>
            <label htmlFor="income">Annual Income ($)</label>
            <input
              id="income"
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              style={inputStyle}
              placeholder="e.g., 500000"
              min="0"
              step="1000"
            />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="loanAmount">Loan Amount ($)</label>
            <input
              id="loanAmount"
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              style={inputStyle}
              placeholder="e.g., 200000"
              min="0"
              step="1000"
            />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="interestRate">Interest Rate (%)</label>
            <input
              id="interestRate"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              style={inputStyle}
              placeholder="e.g., 3.5"
              disabled={loanAmount === '' || parseFloat(loanAmount) === 0}
              min="0"
              step="0.01"
            />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="homeRepairs">Home Repairs/Improvements ($)</label>
            <input
              id="homeRepairs"
              type="number"
              value={homeRepairs}
              onChange={(e) => setHomeRepairs(e.target.value)}
              style={inputStyle}
              placeholder="e.g., 2000"
              disabled={loanAmount === '' || parseFloat(loanAmount) === 0}
              min="0"
              step="100"
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
          <div style={inputGroupStyle}>
            <label htmlFor="dependents">Number of Dependents</label>
            <input
              id="dependents"
              type="number"
              value={dependents}
              onChange={(e) => setDependents(e.target.value)}
              style={inputStyle}
              placeholder="e.g., 2"
              min="0"
              step="1"
            />
          </div>
        </div>

        {/* Property-Related Inputs */}
        <h2 style={sectionHeaderStyle}>Property-Related Inputs</h2>
        <div style={gridStyle}>
          <div style={inputGroupStyle}>
            <label htmlFor="propertyTax">Annual Property Tax ($)</label>
            <input
              id="propertyTax"
              type="number"
              value={propertyTax}
              onChange={(e) => setPropertyTax(e.target.value)}
              style={inputStyle}
              placeholder="e.g., 10000"
              min="0"
              step="100"
            />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="homeRepairs">Home Repairs/Improvements ($)</label>
            <input
              id="homeRepairs"
              type="number"
              value={homeRepairs}
              onChange={(e) => setHomeRepairs(e.target.value)}
              style={inputStyle}
              placeholder="e.g., 2000"
              disabled={loanAmount === '' || parseFloat(loanAmount) === 0}
              min="0"
              step="100"
            />
          </div>
          <div style={{ ...inputGroupStyle, gridColumn: 'span 2' }}>
            <label style={checkboxLabelStyle}>
              <input
                type="checkbox"
                checked={isRental}
                onChange={(e) => setIsRental(e.target.checked)}
                style={checkboxStyle}
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
                  onChange={(e) => setRentalIncome(e.target.value)}
                  style={inputStyle}
                  placeholder="e.g., 15000"
                  min="0"
                  step="100"
                />
              </div>
              <div style={inputGroupStyle}>
                <label htmlFor="rentalExpenses">Rental Expenses ($)</label>
                <input
                  id="rentalExpenses"
                  type="number"
                  value={rentalExpenses}
                  onChange={(e) => setRentalExpenses(e.target.value)}
                  style={inputStyle}
                  placeholder="e.g., 5000"
                  min="0"
                  step="100"
                />
              </div>
            </>
          )}
        </div>

        {/* Other Deductions and Contributions */}
        <h2 style={sectionHeaderStyle}>Other Deductions and Contributions</h2>
        <div style={gridStyle}>
          <div style={inputGroupStyle}>
            <label htmlFor="retirementContributions">401(k)/Traditional IRA Contributions ($)</label>
            <input
              id="retirementContributions"
              type="number"
              value={retirementContributions}
              onChange={(e) => setRetirementContributions(e.target.value)}
              style={inputStyle}
              placeholder="e.g., 10000"
              min="0"
              step="100"
            />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="otherDeductions">Other Deductions ($)</label>
            <input
              id="otherDeductions"
              type="number"
              value={otherDeductions}
              onChange={(e) => setOtherDeductions(e.target.value)}
              style={inputStyle}
              placeholder="e.g., 3000"
              min="0"
              step="100"
            />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="stateTaxes">State and Local Taxes ($)</label>
            <input
              id="stateTaxes"
              type="number"
              value={stateTaxes}
              onChange={(e) => setStateTaxes(e.target.value)}
              style={inputStyle}
              placeholder="Assumed 0 for Texas"
              min="0"
              step="100"
            />
            <small style={{ color: '#555' }}>
              <em>Note:</em> State taxes are set to $0 by default, assuming many users may reside in states like Texas that do not impose state income tax. Please adjust accordingly based on your state's tax laws.
            </small>
          </div>
        </div>

        {/* Calculate Button */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={handleCalculate} style={calculateButtonStyle}>
            Calculate
          </button>
        </div>

        {/* Results */}
        {taxLiabilityStandard !== 0 && taxLiabilityItemized !== 0 && (
          <>
            <h2 style={sectionHeaderStyle}>Results</h2>
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
              <p style={taxSavingsStyle}>
                Tax Savings: ${taxSavings > 0 ? taxSavings.toFixed(2) : '0.00'}
              </p>
              <p style={taxSavingsExplanationStyle}>
                {explanation}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Learn More Section */}
      <div style={learnMoreContainerStyle}>
        <CollapsibleSection title="Learn More" defaultOpen={false}>
          {/* Additional Information moved here */}
          <div style={{ marginBottom: '20px' }}>
            <h4>Additional Information</h4>
            <p>
              Understanding the differences between standard deductions and itemizing deductions can help you make informed decisions to minimize your tax liability.
            </p>
          </div>
          
          {/* Expanded Learn More Content */}
          <h3>Understanding Standard vs. Itemized Deductions</h3>
          <p>
            In the United States, taxpayers can choose between taking the standard deduction or itemizing their deductions to reduce their taxable income. Here's a simple breakdown:
          </p>
          <ul>
            <li>
              <strong>Standard Deduction:</strong> 
              <ul>
                <li>A fixed dollar amount that reduces the income you're taxed on.</li>
                <li>The amount varies based on your filing status (e.g., single, married filing jointly).</li>
                <li>No need to keep track of individual expenses.</li>
                <li>Generally simpler and faster for taxpayers with fewer deductible expenses.</li>
              </ul>
            </li>
            <li>
              <strong>Itemized Deductions:</strong> 
              <ul>
                <li>Allows you to deduct specific expenses, potentially reducing your taxable income more than the standard deduction.</li>
                <li>Common itemized deductions include:</li>
                <ul>
                  <li>Mortgage interest on your home.</li>
                  <li>Property taxes.</li>
                  <li>Medical and dental expenses above a certain threshold.</li>
                  <li>Charitable contributions.</li>
                  <li>State and local taxes paid.</li>
                </ul>
                <li>Requires detailed record-keeping and documentation of expenses.</li>
                <li>Beneficial for taxpayers with significant deductible expenses.</li>
              </ul>
            </li>
          </ul>
          <p>
            To determine which option is best for you, compare the total of your itemized deductions against the standard deduction for your filing status. Choose the method that offers the greater tax benefit.
          </p>
          <p>
            <strong>Example:</strong> If your total itemized deductions amount to $15,000 and the standard deduction for your filing status is $13,850, itemizing your deductions would save you more on taxes.
          </p>
          <p>
            Additionally, having dependents can provide tax credits that further reduce your tax liability. For instance, the Child Tax Credit offers up to $2,000 per qualifying child, directly lowering the amount of tax you owe.
          </p>
          <p>
            Always consult with a tax professional to understand which deduction and credit options are most advantageous for your specific financial situation.
          </p>
        </CollapsibleSection>
      </div>
    </div>
  );
};

// Inline Styles
const containerStyle = {
  padding: '20px',
  maxWidth: '1000px',
  margin: '0 auto',
  fontFamily: 'Arial, sans-serif',
  backgroundColor: '#e0f7fa', // Light blue background
};

const quickInputContainerStyle = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '40px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  backgroundColor: '#ffffff',
};

const quickInputFormStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const quickInputGroupStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '10px',
  flexWrap: 'wrap',
};

const quickInputStyle = {
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  margin: '0 5px',
  width: '80px',
};

const applyInputsButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#1e90ff', // Relaxing blue
  color: '#ffffff',
  border: 'none',
  borderRadius: '4px',
  fontSize: '1em',
  cursor: 'pointer',
  alignSelf: 'flex-start',
  marginTop: '10px',
};

const explanatoryContainerStyle = {
  marginBottom: '40px',
};

const cardStyle = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '30px',
  marginBottom: '40px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  backgroundColor: '#ffffff',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
};

const inputGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
};

const inputStyle = {
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  marginTop: '5px',
  fontSize: '1em',
};

const sectionHeaderStyle = {
  color: '#1e90ff', // Relaxing blue
  marginBottom: '15px',
};

const checkboxLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const checkboxStyle = {
  marginRight: '10px',
};

const collapsibleSectionStyle = {
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  padding: '15px',
  marginBottom: '15px',
  backgroundColor: '#ffffff', // White background for clarity
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
};

const collapsibleHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  cursor: 'pointer',
};

const collapsibleTitleStyle = {
  margin: '0',
};

const indicatorStyle = {
  fontSize: '1.5em',
  fontWeight: 'bold',
};

const collapsibleContentStyle = {
  marginTop: '10px',
  color: '#333',
};

const calculateButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#1e90ff', // Relaxing blue
  color: '#ffffff',
  border: 'none',
  borderRadius: '4px',
  fontSize: '1em',
  cursor: 'pointer',
};

const taxSavingsStyle = {
  fontSize: '1.2em',
  fontWeight: 'bold',
  color: '#28a745', // Green for positive outcome
};

const taxSavingsExplanationStyle = {
  color: '#333',
};

const learnMoreContainerStyle = {
  marginTop: '40px',
  marginBottom: '40px',
};

// Export the component
export default PropertyTaxSavingsCalculator;
