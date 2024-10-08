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
  // Basic inputs with default values
  const [income, setIncome] = useState('100000'); // Annual Income
  const [loanAmount, setLoanAmount] = useState('400000'); // Loan Amount
  const [interestRate, setInterestRate] = useState('5'); // Interest Rate
  const [filingStatus, setFilingStatus] = useState('single'); // Filing Status
  const [dependents, setDependents] = useState('0'); // Number of Dependents

  // Property-related inputs
  const [propertyTax, setPropertyTax] = useState('10000'); // Annual Property Tax (Added default value)
  const [isRental, setIsRental] = useState(false); // Rental Property Checkbox
  const [rentalIncome, setRentalIncome] = useState('15000'); // Rental Income (Added default value)
  const [rentalExpenses, setRentalExpenses] = useState('5000'); // Rental Expenses (Added default value)
  const [homeRepairs, setHomeRepairs] = useState('5000'); // Home Repairs/Improvements

  // Other deductions
  const [retirementContributions, setRetirementContributions] = useState('10000'); // Retirement Contributions (Added default value)
  const [otherDeductions, setOtherDeductions] = useState('3000'); // Other Deductions (Added default value)
  const [stateTaxes, setStateTaxes] = useState('0'); // State and Local Taxes (Default to 0)

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
  const [recommendation, setRecommendation] = useState('');
  const [calculationBreakdown, setCalculationBreakdown] = useState('');
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
        // Set a reasonable default interest rate, e.g., 5%
        setInterestRate(5);
      }
      if (homeRepairs === '') {
        // Set a reasonable default home repairs, e.g., $5,000
        setHomeRepairs(5000);
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
      Math.min(parsedStateTaxes, 10000) + // SALT deduction cap
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

    // Calculate tax credits based on dependents ($2000 per dependent)
    const taxCredits = parsedDependents * 2000;
    const taxLiabilityItemWithCredits = Math.max(0, taxLiabilityItem - taxCredits);

    // Calculate tax savings
    const savings = taxLiabilityStd - taxLiabilityItemWithCredits;
    setTaxSavings(savings);

    // Determine recommendation
    if (savings > 0) {
      setRecommendation('Itemize Deductions');
    } else if (savings < 0) {
      setRecommendation('Take Standard Deduction');
    } else {
      setRecommendation('Either Option Works');
    }

    // Generate detailed explanation based on tax liability change
    if (savings > 0) {
      setExplanation(
        `Choosing to itemize your deductions reduces your taxable income more than the standard deduction, resulting in tax savings of $${savings.toFixed(
          2
        )}. This means you owe $${savings.toFixed(2)} less in taxes by itemizing your deductions compared to taking the standard deduction.`
      );
    } else if (savings < 0) {
      setExplanation(
        `Taking the standard deduction reduces your taxable income more effectively than itemizing your deductions, resulting in tax savings of $${Math.abs(
          savings
        ).toFixed(
          2
        )}. This means you owe $${Math.abs(savings).toFixed(
          2
        )} less in taxes by taking the standard deduction compared to itemizing your deductions.`
      );
    } else {
      setExplanation(
        'Your itemized deductions and the standard deduction are equal, resulting in no difference in your tax liability.'
      );
    }

    // Generate calculation breakdown
    setCalculationBreakdown(`
      **Standard Deduction:**
      - Taxable Income: $${taxableIncomeStd.toFixed(2)}
      - Tax Liability: $${taxLiabilityStd.toFixed(2)}

      **Itemized Deductions:**
      - Total Itemized Deductions: $${totalItemizedDeductions.toFixed(2)}
      - Taxable Income: $${taxableIncomeItem.toFixed(2)}
      - Tax Liability before Credits: $${taxLiabilityItem.toFixed(2)}
      - Tax Credits: $${taxCredits.toFixed(2)}
      - Tax Liability after Credits: $${taxLiabilityItemWithCredits.toFixed(2)}

      **Comparison:**
      - Tax Savings: $${savings > 0 ? savings.toFixed(2) : Math.abs(savings).toFixed(2)} ${
      savings > 0 ? 'by itemizing deductions.' : savings < 0 ? 'by taking the standard deduction.' : 'with either option.'
    }
    `);
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
    setIncome(parsedQuickIncome || '100000'); // Default to 100,000 if empty
    setRetirementContributions(parsedQuickRetirement || '10000'); // Default to 10,000
    setLoanAmount(parsedQuickLoanAmount || '400000'); // Default to 400,000
    setInterestRate(parsedQuickInterestRate || '5'); // Default to 5%
    setFilingStatus(parsedQuickFilingStatus || 'single');
    setDependents(parsedQuickDependents.toString() || '0');

    // If loan amount is entered, set default home repairs if empty
    if (parsedQuickLoanAmount > 0 && homeRepairs === '') {
      setHomeRepairs(5000);
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
              style={{ ...inputStyle, backgroundColor: '#f0f0f0' }}
              placeholder="e.g., 100000"
              min="0"
              step="1000"
            />
            <small style={{ color: '#555' }}>
              <em>Note:</em> Your annual income is used to determine your taxable income and potential deductions.
            </small>
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="loanAmount">Loan Amount ($)</label>
            <input
              id="loanAmount"
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              style={{ ...inputStyle, backgroundColor: '#f0f0f0' }}
              placeholder="e.g., 400000"
              min="0"
              step="1000"
            />
            <small style={{ color: '#555' }}>
              <em>Note:</em> Having a mortgage allows you to deduct mortgage interest from your taxable income, potentially lowering your tax liability.
            </small>
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="interestRate">Interest Rate (%)</label>
            <input
              id="interestRate"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              style={{ ...inputStyle, backgroundColor: '#f0f0f0' }}
              placeholder="e.g., 5"
              disabled={loanAmount === '' || parseFloat(loanAmount) === 0}
              min="0"
              step="0.01"
            />
            <small style={{ color: '#555' }}>
              <em>Note:</em> The interest rate on your loan affects the amount of mortgage interest you can deduct.
            </small>
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="filingStatus">Filing Status</label>
            <select
              id="filingStatus"
              value={filingStatus}
              onChange={(e) => setFilingStatus(e.target.value)}
              style={{ ...inputStyle, backgroundColor: '#f0f0f0' }}
            >
              <option value="single">Single</option>
              <option value="married">Married Filing Jointly</option>
            </select>
            <small style={{ color: '#555' }}>
              <em>Note:</em> Your filing status determines the standard deduction amount and tax brackets applicable to you.
            </small>
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="dependents">Number of Dependents</label>
            <input
              id="dependents"
              type="number"
              value={dependents}
              onChange={(e) => setDependents(e.target.value)}
              style={{ ...inputStyle, backgroundColor: '#f0f0f0' }}
              placeholder="e.g., 0"
              min="0"
              step="1"
            />
            <small style={{ color: '#555' }}>
              <em>Note:</em> Having dependents can provide tax credits that reduce your overall tax liability.
            </small>
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
            <small style={{ color: '#555' }}>
              <em>Note:</em> Property taxes are deductible if you itemize deductions, potentially lowering your taxable income.
            </small>
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="homeRepairs">Home Repairs/Improvements ($)</label>
            <input
              id="homeRepairs"
              type="number"
              value={homeRepairs}
              onChange={(e) => setHomeRepairs(e.target.value)}
              style={{ ...inputStyle, backgroundColor: '#f0f0f0' }}
              placeholder="e.g., 5000"
              disabled={loanAmount === '' || parseFloat(loanAmount) === 0}
              min="0"
              step="100"
            />
            <small style={{ color: '#555' }}>
              <em>Note:</em> Expenses for home repairs and improvements may be deductible if you itemize your deductions.
            </small>
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
                <small style={{ color: '#555' }}>
                  <em>Note:</em> Rental income is considered in your taxable income and affects your overall tax liability.
                </small>
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
                <small style={{ color: '#555' }}>
                  <em>Note:</em> Rental expenses can be deducted from your rental income, potentially lowering your tax liability.
                </small>
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
            <small style={{ color: '#555' }}>
              <em>Note:</em> Contributions to retirement accounts may be deductible, reducing your taxable income.
            </small>
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
            <small style={{ color: '#555' }}>
              <em>Note:</em> Other deductions can include various eligible expenses that reduce your taxable income when itemizing.
            </small>
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
              <em>Note:</em> State taxes are set to $0 by default, assuming users may reside in states like Texas that do not impose state income tax. Please adjust accordingly based on your state's tax laws.
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
        {(taxLiabilityStandard !== 0 || taxLiabilityItemized !== 0) && (
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
                Recommendation: <strong>{recommendation}</strong>
              </p>
              <p style={taxSavingsExplanationStyle}>
                {explanation}
              </p>
              <CollapsibleSection title="Calculation Breakdown" defaultOpen={false}>
                <pre style={{ whiteSpace: 'pre-wrap', color: '#333' }}>{calculationBreakdown}</pre>
              </CollapsibleSection>
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

      {/* Disclaimer Section */}
      <div style={disclaimerContainerStyle}>
        <p style={disclaimerStyle}>
          <strong>Disclaimer:</strong> The information and calculations provided by this tool are for informational purposes only and do not constitute professional tax advice. While efforts have been made to ensure accuracy, these estimates are not guaranteed to be 100% accurate. Users should consult a qualified tax professional before making any tax-related decisions.
        </p>
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

const disclaimerContainerStyle = {
  marginTop: '40px',
  paddingTop: '10px',
  borderTop: '1px solid #ccc',
};

const disclaimerStyle = {
  color: 'red',
  fontSize: '0.9em',
  lineHeight: '1.5',
};

// Export the component
export default PropertyTaxSavingsCalculator;
