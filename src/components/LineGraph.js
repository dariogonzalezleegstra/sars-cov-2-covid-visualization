import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2';

import options from "./graphOptions";


function LineGraph( { dataType='cases' }) {

    const [data, setData] = useState({});

    useEffect(() => {
        const getHistoricalData = async () => {   
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then(response => response.json())
            .then(data => {
                const chartData = buildChartData(data, dataType);
                setData(chartData);
            })
        }

        getHistoricalData();
    }, [dataType])

    const buildChartData = (data, dataType='cases') => {
        const charData = [];
        let yesterdayTotal = 0;

        //data.cases is an array [{date: totalThatDate}, ...]

        const dates = Object.keys(data[dataType]);

        dates.forEach(date => {
            const todayTotal = data[dataType][date];
            
            //Avoid the first day because they loaded +26 million cases in one day
            if (yesterdayTotal !== 0) {
                const newDataPoint = {
                    x: date,
                    y: todayTotal - yesterdayTotal
                }
                charData.push(newDataPoint);
            }

            yesterdayTotal = todayTotal;
        });

        return charData;
    }


    return (
        <div>
            {data?.length > 0 && (<Line
                data = {{
                    datasets: [
                        {
                            backgroundColor: "rgba(204,16,52,0.5)",
                            borderColor: "#CC1034",
                            data
                        }
                    ]
                }}
                options={options}
            />)}
        </div>
    )
}

export default LineGraph
