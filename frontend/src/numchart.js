import React from 'react';
import { Spin } from 'antd';
import axios from 'axios';
import { Chart, Geom, Axis, Tooltip } from "bizcharts";
import DataSet from "@antv/data-set";

// axios.defaults.baseURL = "http://localhost:3001/";
axios.defaults.baseURL = "http://106.14.216.118:3001/";

class NumChart extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading: true,
            chartData: '',
        }
    }

    componentDidMount() {
        this.getChartData(this.props.title);
    }

    shouldComponentUpdate (nextProps, nextState) {
        if (nextProps.title !== this.props.title) {
            return true
        }
        if (nextState.loading !== this.state.loading) {
            return true
        }
            return false
    }

    getChartData = title => {
        console.log(`load ${title} num chart data`);
        // get data
        axios.post('/api/chartdata', {title: title})
        .then((res) => {
            // render chart
            this.setState({
                chartData: res.data,
                loading: false,
            });
        })
        .catch((err) => {
            console.log(err);
            this.setState({
                loading: true,
                error: err
            });
        });
    }

    render(){
        if (this.state.loading) {
            return(
                <div style={{textAlign: "center"}} ><Spin size="small" /></div>
            );
        } else {
            const title = this.props.title;
            const chartdata = this.state.chartData;
            const pos_v = title+"*count";

            const min_data = this.props.range[0];
            const max_data = this.props.range[1];
            const range_data = max_data-min_data;
            let tick_data = 0;
            if (range_data <= 10.0) {
                tick_data = (range_data / 10.0).toFixed(2);
            } else {
                tick_data = (range_data / 15.0).toFixed(2);
            }
            
            // console.log(chartdata);
            // create data view
            var ds = new DataSet();
            var dv = ds.createView().source(chartdata);
            dv.transform({
                type: 'bin.histogram',
                field: title,
                binWidth: tick_data,
                as: [title, 'count']
            });
            // console.log(dv);

            // find max count
            const temp_count = dv['rows'];
            let count_max = 0;
            temp_count.forEach(element => {
                if (element['count'] > count_max) {
                    count_max = element['count'];
                }
            });

            let cols = {
                count: {
                    max: count_max
                }
            };
            // cols[title] = {
            //     nice: true,
            //     tickInterval:tick_data
            // }
            // console.log(cols);
            
            return(
                <div>
                    <Chart width={127} height={90} padding={[ 0,0,0,0 ]} data={dv} scale={cols} >
                    <Axis
                        name={title}
                        label={null}
                    />
                    <Axis name="count" label={null}/>
                    <Tooltip inPlot={false} crosshairs={true} position={"right"} />
                    <Geom type="interval" position={pos_v} />
                    </Chart>
                </div>
            );
        }
    }
}

export default NumChart;