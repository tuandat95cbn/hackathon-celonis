import { ResponsiveLine } from '@nivo/line';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../constant';

const TimeDistribution = ({ cases }) => {
    const [time, setTime] = useState([]);

    useEffect(() => {
        const postBody = cases;
        axios.post(API_URL + '/stat/throughput', postBody).then(res => (res.data)).then(res => {
            let temp = [];
            for (const [key, value] of Object.entries(res)) {
                temp.push({ x: key, y: value });
            }
            setTime([{ id: 'test', color: "hsl(175, 70%, 50%)", data: temp}]);
        });
    }, []);
    
    return (
        <ResponsiveLine
            data={time}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
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