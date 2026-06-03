const { BetaAnalyticsDataClient } = require('@google-analytics/data');

function formatReport(response) {
  const dimensions = response.dimensionHeaders?.map((h) => h.name) || [];
  const metrics = response.metricHeaders?.map((h) => h.name) || [];
  return (response.rows || []).map((row) => {
    const item = {};
    row.dimensionValues?.forEach((v, i) => {
      item[dimensions[i]] = v.value;
    });
    row.metricValues?.forEach((v, i) => {
      item[metrics[i]] = Number(v.value);
    });
    return item;
  });
}

async function runReport(client, propertyId, report) {
  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    ...report,
  });
  return formatReport(response);
}

exports.handler = async function () {
  const propertyId = process.env.GA4_PROPERTY_ID;
  const credentialsJson = process.env.GA4_CREDENTIALS_JSON;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  if (!propertyId || !credentialsJson) {
    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({ error: 'not_configured' }),
    };
  }

  let credentials;
  try {
    credentials = JSON.parse(credentialsJson);
  } catch {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'invalid_credentials' }),
    };
  }

  const client = new BetaAnalyticsDataClient({ credentials });
  const range = [{ startDate: '28daysAgo', endDate: 'today' }];

  try {
    const [countries, devices, pages, timeline] = await Promise.all([
      runReport(client, propertyId, {
        dateRanges: range,
        dimensions: [{ name: 'country' }],
        metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
        orderBys: [{ desc: true, metric: { metricName: 'activeUsers' } }],
        limit: 20,
      }),
      runReport(client, propertyId, {
        dateRanges: range,
        dimensions: [{ name: 'deviceCategory' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ desc: true, metric: { metricName: 'activeUsers' } }],
      }),
      runReport(client, propertyId, {
        dateRanges: range,
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
        orderBys: [{ desc: true, metric: { metricName: 'screenPageViews' } }],
        limit: 10,
      }),
      runReport(client, propertyId, {
        dateRanges: range,
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
        orderBys: [{ dimension: { dimensionName: 'date' } }],
      }),
    ]);

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Cache-Control': 'public, max-age=3600',
      },
      body: JSON.stringify({
        period: 'Last 28 days',
        countries,
        devices,
        pages,
        timeline,
      }),
    };
  } catch (err) {
    console.error('GA4 analytics error:', err.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'fetch_failed', message: err.message }),
    };
  }
};
