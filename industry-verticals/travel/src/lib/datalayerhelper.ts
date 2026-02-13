export type personalizeResponse = {
  decisionOffers: [
    {
      ref: string;
      name: string;
      description: string;
      status: string;
      attributes: {
        Title: string;
        Description: string;
        Image: string;
      };
    },
  ];
};

export async function getPersonalizedPromo() {
  const per = await import('@sitecore-cloudsdk/personalize/browser');

  const personalizationData = {
    channel: 'WEB',
    friendlyId: 'flynas_personalized_promo',
  };

  const response = await per.personalize(personalizationData);
  return response as personalizeResponse;
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
