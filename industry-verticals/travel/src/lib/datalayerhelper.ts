type identifier = {
  ref: string;
  createdAt: string;
  modifiedAt: string;
  provider: string;
  id: string;
};

type emails = [];

type energyDataExtension = {
  nextPaymentDate: string;
  contractStartDate: string;
  contractTerm: string;
  contractEndDate: string;
  tariff: string;
  tariffRates: string;
  accountBalance: number;
  plan: string;
  currentMonthElectricityUsage: string;
  currentMonthElectricitySplit: string;
  currentMonthGasUsage: string;
  currentMonthSolarEnergyProduced: string;
};

type dataExtension = {
  ref: string;
  createdAt: string;
  modifiedAt: string;
  name: string;
  key: string;
  values: energyDataExtension;
};

type segment = {
  ref: string;
  clientKey: string;
  name: string;
};

type order = {
  status: string;
};

export type guestDetailsResponse = {
  ref: string;
  lastName: string;
  gender: string;
  modifiedAt: string;
  identifiers: Array<identifier>;
  firstSeen: string;
  language: string;
  title: string;
  emails: emails;
  createdAt: string;
  firstName: string;
  lastSeen: string;
  nationality: string;
  dataExtensions: Array<dataExtension>;
  segmentMemberships: Array<segment>;
  orders: Array<order>;
  guestType: string;
  email: string;
  unknown: boolean;
};

export type planEstimateResponse = {
  currentPlan: string;
  predictedAnnualUsage: string;
  currentPlanEstimatedAnnualCost: string;
  newPlanEstimateAnnualCost: string;
  description: string;
};

export const allowedPlans = [
  'Time-of-Use (TOU) Energy Plan',
  'Fixed-Rate Energy Plan',
  'Green Energy Plan',
  'Prepaid Energy Plan',
] as const;

export type AllowedPlan = (typeof allowedPlans)[number];

export type PlanEstimateInputPayload = { planToCompare: AllowedPlan } & Partial<{
  lastYearElectricityUsage: string; // e.g., "4200 kWh"
  currentYearElectricityUsage: string; // e.g., "4200 kWh"
  currentYearGasUsage: string; // e.g., "400 therms"
  lastYearGasUsage: string; // e.g., "400 therms"
  currentYearSolarEnergyProduced: string; // e.g., "0 kWh"
  currentMonthElectricitySplit: string; // e.g., '{"peak":"50%","offPeak":"50%"}'
  currentPlan: string; // e.g., "Standard Variable"
  currentPlanCost: number; // e.g., 1500
}>;

export async function getGuestDetails() {
  const per = await import('@sitecore-cloudsdk/personalize/browser');

  const personalizationData = {
    channel: 'WEB',
    friendlyId: 'full_guest_details',
  };

  const response = (await per.personalize(personalizationData)) as guestDetailsResponse;
  console.log('guest details response:', response);

  return response;
}

export async function getPlanEstimate(payload: PlanEstimateInputPayload) {
  const per = await import('@sitecore-cloudsdk/personalize/browser');

  // Build params by stripping undefined values
  const rawParams = {
    planToCompare: payload.planToCompare,
    lastYearElectricityUsage: payload.lastYearElectricityUsage,
    currentYearElectricityUsage: payload.currentYearElectricityUsage,
    currentYearGasUsage: payload.currentYearGasUsage,
    lastYearGasUsage: payload.lastYearGasUsage,
    currentYearSolarEnergyProduced: payload.currentYearSolarEnergyProduced,
    currentMonthElectricitySplit: payload.currentMonthElectricitySplit,
    currentPlan: payload.currentPlan,
    currentPlanCost: payload.currentPlanCost,
  } as const;

  const params = Object.fromEntries(
    Object.entries(rawParams).filter(([, v]) => v !== undefined && v !== null)
  );

  const personalizationData = {
    channel: 'WEB',
    friendlyId: 'plan_estimate',
    params, // only defined values are sent
  };

  const response = await per.personalize(personalizationData);
  return response as planEstimateResponse;
}

export async function sendIdentityEvent(email: string) {
  const e = await import('@sitecore-cloudsdk/events/browser');

  const eventData = {
    email,
    identifiers: [
      {
        id: email,
        provider: 'email',
      },
    ],
  };

  e.identity(eventData);
}

export async function sendSearchEvent(type: string) {
  const e = await import('@sitecore-cloudsdk/events/browser');

  const eventData = {
    type,
    product_name: 'RUH-CAI',
    product_type: 'FLIGHT',
    flight_type: 'RT',
    origin: 'RUH',
    destination: 'CAI',
    start: '2026-02-19T00:00',
    end: '2026-02-26T00:00',
    adults: 2,
    children: 1,
    infants: 1,
    fare_class: 'Economy',
    fare_family: 'Economy Plus',
    extensionData: {
      onSale: false,
    },
  };

  e.event(eventData);
}

export async function sendAddEvent(type: string) {
  const e = await import('@sitecore-cloudsdk/events/browser');

  const eventData = {
    type,
    product: {
      type: 'FLIGHT',
      item_id: 'FLIGHT_1',
      name: 'RUH-CAI Family Flight',
      currency: 'SAR',
      price: 6000,
      product_id: 'RUH-CAI|Economy|EconomyPlus',
      origin: 'RUH',
      destination: 'CAI',
      flight_type: 'OW',
      pax_type: 'ADT',
      quantity: 2,
      flight_segment: [
        {
          origin: 'RUH',
          destination: 'CAI',
          departure_date_time: '2026-02-19T11:00',
          arrival_date_time: '2026-02-19T12:15',
          flight_number: '743',
          carrier: 'FN',
          fare_class: 'Economy',
          fare_family: 'Economy Plus',
        },
      ],
    },
  };

  e.event(eventData);
}
