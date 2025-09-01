import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#2C73D2', '#00A878', '#FF6B6B', '#FAD643'];
const degreeNames = ['Uzman', 'Stajyer', 'Asistan', 'Akademisyen'];

export const DegreeChart = ({ data }: { data: number[] }) => {
  const chartData = data.map((value, index) => ({
    name: degreeNames[index], 
    value,
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          dataKey="value"
          label
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};