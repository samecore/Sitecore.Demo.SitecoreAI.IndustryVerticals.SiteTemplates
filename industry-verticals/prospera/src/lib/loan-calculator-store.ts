export type LoanCalculatorSnapshot = {
  loanAmount: number;
  loanTerm: number;
  monthlyPayment: number;
  totalDebt: number;
  totalInterest: number;
  interestRate: number;
  bankFee: number;
  currency: string;
};

let snapshot: LoanCalculatorSnapshot | null = null;

export const setLoanCalculatorSnapshot = (data: LoanCalculatorSnapshot): void => {
  snapshot = data;
};

export const getLoanCalculatorSnapshot = (): LoanCalculatorSnapshot | null => snapshot;
