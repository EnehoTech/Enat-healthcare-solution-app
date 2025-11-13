import ReportChart from "./ReportChart/ReportChart";

const Reports = () => {
  return (
    <div className="card report-wrapper">
      <div>
        <h5 className="card-title">
          General Reports <span>/This Year</span>
        </h5>

      </div>
      <div className="card-body">
        <ReportChart />
      </div>
    </div>
  );
};

export default Reports;
