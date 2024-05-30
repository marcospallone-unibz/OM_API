const AWS = require('aws-sdk');
const cloudwatch = new AWS.CloudWatch({ region: 'us-east-1' });

function sendMetric(metricName, value, unit) {
  const params = {
    MetricData: [
      {
        MetricName: metricName,
        Unit: unit,
        Value: value,
      },
    ],
    Namespace: 'namespaceAPINOLAMBDA'
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
