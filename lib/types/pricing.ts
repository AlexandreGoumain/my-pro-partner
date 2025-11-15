export type IntervalType = "month" | "year";

export interface PlanFeature {
    text: string;
    included: boolean;
}

export interface PricingPlan {
    name: string;
    id: string;
    description: string;
    priceMonthly: number;
    priceYearly: number;
    popular?: boolean;
    features: PlanFeature[];
}
