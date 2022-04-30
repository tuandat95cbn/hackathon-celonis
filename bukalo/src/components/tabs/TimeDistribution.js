import { ResponsiveLine } from '@nivo/line';

const TimeDistribution = ({ data }) => {
    return (
        <ResponsiveLine
            data={data}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'linear' }}
            yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
                stacked: true,
                reverse: false
            }}
            yFormat=" >-.2f"
            enableArea={true}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                orient: 'bottom',
                tickSize: 0,
                legend: 'Throughput Time (Days)',
                legendOffset: 36,
                legendPosition: 'middle'
            }}
            axisLeft={{
                orient: 'left',
                tickSize: 0,
                legend: 'Number of Cases',
                legendOffset: -37,
                legendPosition: 'middle'
            }}
            enablePoints={false}
            useMesh={true}
            legends={[]}
        />
    );

};

export default TimeDistribution