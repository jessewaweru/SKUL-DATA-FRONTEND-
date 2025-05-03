import { FiUser } from "react-icons/fi";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Line,
  LineChart,
} from "recharts";

const data = [
  {
    name: "Jan",
    Teachers: 275,
    NewStudents: 41,
  },
  {
    name: "Feb",
    Teachers: 620,
    NewStudents: 96,
  },
  {
    name: "Mar",
    Teachers: 202,
    NewStudents: 192,
  },
  {
    name: "Apr",
    Teachers: 500,
    NewStudents: 50,
  },
  {
    name: "May",
    Teachers: 355,
    NewStudents: 400,
  },
  {
    name: "Jun",
    Teachers: 875,
    NewStudents: 200,
  },
  {
    name: "Jul",
    Teachers: 700,
    NewStudents: 205,
  },
];

const TransactionGraph = () => {
  return (
    <div className="graph-container">
      <div className="graph-header">
        <h3 className="graph-title">
          <FiUser />
          Transactions
        </h3>
      </div>

      <div className="graph-content">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 0, right: 0, left: -24, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="NewStudents"
              className="recharts-line-new-students"
              stroke="#ff8a80"
              fill="#ff8a80"
            />
            <Line
              type="monotone"
              dataKey="Teachers"
              className="recharts-line-teachers"
              stroke="#007BFF"
              fill="#007BFF"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TransactionGraph;
