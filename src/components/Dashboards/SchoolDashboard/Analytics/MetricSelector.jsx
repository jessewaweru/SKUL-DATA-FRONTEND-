const MetricSelector = ({ metric }) => {
  return (
    <div className="metric-selector">
      <div className="metric-category">{metric.category}</div>
      <div className="metric-name">{metric.name}</div>
    </div>
  );
};

export default MetricSelector;
