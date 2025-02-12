export interface Order {
    id: number;
    name: string; 
    cartSummary: string; 
    total: number; 
    displayTime: string; 
    paymentType: string;
    numBurgers: number;
    specialInstructions: string
};

export const MAXBURGERS = 4;
export const TOTALBURGERS = 80;