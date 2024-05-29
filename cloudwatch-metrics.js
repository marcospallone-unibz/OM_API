const AWS = require('aws-sdk');
const cloudwatch = new AWS.CloudWatch({ region: 'your-region' });

function sendMetric(metricName, value, unit) {
  const params = {
    MetricData: [
      {
        MetricName: metricName,
        Unit: unit,
        Value: value,
      },
    ],
    Namespace: 'om'
  };

  cloudwatch.putMetricData(params, (err, data) => {
    if (err) {
      console.log("Error sending metric: ", err);
    } else {
      console.log("Metric sent successfully: ", data);
    }
  });
}

module.exports = sendMetric;
