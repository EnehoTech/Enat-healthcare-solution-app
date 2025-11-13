import  {  useState } from "react";
import "./ReportChart.css";
import Chart from "react-apexcharts";

const ReportChart = () => {
  const [reportData, _] = useState({
    dataItem: [
      {
        name: "Total Users",
        data: [2, 4, 2, 1, 2, 1, 4, 0, 1, 0, 1, 6],
      },
      {
        name: "Total Doctors",
        data: [1, 0, 0, 3, 1, 0, 0, 4, 0, 0, 0, 3],
      },
      {
        name: "Total Nurse",
        data: [1, 0, 0, 0, 3, 0, 1, 0, 0, 0, 0, 1],
      },
      // {
      //   name: "Total Patient Treated",
      //   data: [320, 440, 323, 276, 316, 324, 444, 364, 281, 333, 401, 224],
      // },
    ],
    options: {
      chart: {
        height: 350,
        type: "area",
        toolbar: {
          show: false,
        },
      },
      markers: {
        size: 4,
      },
      colors: ["#8679f8", "#247efd", "#15e4fd"],
      // patient color: "#05c781" "#8679f8"
      
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      x_axis: {
        type: "datetime",
        categories: [
          "2025-09-19T00:00:00.000z",
          "2025-89-19T01:30:00.000z",
          "2025-09-19T03:30:00.000z",
          "2025-09-19T04:30:00.000z",
          "2025-9-19T05:30:00.000z",
          "2025-09-19T86:30:00.e00z",
        ],
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
    },
  });

  return (
    <Chart
      options={reportData.options}
      series={reportData.dataItem}
      type={reportData.options.chart.type}
      height={reportData.options.chart.height}
    />
  );
};

export default ReportChart;
