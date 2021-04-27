import React from 'react';
import { Spin } from 'antd';
import { Chart, Geom, Axis, Tooltip, Coord } from "bizcharts";
import DataSet from "@antv/data-set";

import conf_axios from './configure_axios';

const CHART_TYPE = ["ns", "ds", "ts"];
const NORMAL_STR = ["country", "city", "area", "direction"]; // use pie chart
const DATE_STR = ["date"];
const TIME_STR = ["time"];

class StrChart extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading: true,
            chartData: '',
            chartType: '',
        }
    }

    componentWillMount() {
        const title = this.props.title;
        // decide use which kind of chart
        if (NORMAL_STR.indexOf(title) > -1) {
            this.setState({
                chartType: CHART_TYPE[0]
            });
        } else if (DATE_STR.indexOf(title) > -1) {
            this.setState({
                chartType: CHART_TYPE[1]
            });
        } else if (TIME_STR.indexOf(title) > -1) {
            this.setState({
                chartType: CHART_TYPE[2]
            });
        } else {
            // others are all treated as normal string
            this.setState({
                chartType: CHART_TYPE[0]
            });
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
        console.log(`load ${title} chart data`);
        const chart_type = this.state.chartType;
        // get data
        if (chart_type === CHART_TYPE[0]) {
            conf_axios.get('/api/chartdatagroupcount', {params: {title: title}})
            .then((res) => {
                let data = res.data;
                
                // change null into "null"
                if(data[0][title] === null){
                    data[0][title] = "null";
                }

                this.setState({
                    chartData: data,
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
        } else if (chart_type === CHART_TYPE[1]) {
            conf_axios.get('/api/chartdata', {params: {title: title}})
            .then((res) => {
                let data = res.data;
                // console.log(data);

                // {date: "2003.05.20"} => {date: 2003}
                data.forEach(element => {
                    element[title] = element[title].substr(0, 4) * 1;
                });
                // console.log(data);

                this.setState({
                    chartData: data,
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
        } else if (chart_type === CHART_TYPE[2]) {
            conf_axios.get('/api/chartdata', {params: {title: title}})
            .then((res) => {
                let data = res.data;
                // console.log(data);

                // {time: "12:17:44 AM"} => {time: "12 AM"}
                data.forEach(element => {
                    element[title] = element[title].substr(0, 2) + " " + element[title].substr(-2, 2);
                });
                // console.log(data);

                this.setState({
                    chartData: data,
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
        } else {
            console.log('type err.');
        }
        
    }

    render(){
        if (this.state.loading) {
            return(
                <div style={{textAlign: "center"}} ><Spin size="small" /></div>
            );
        } else {
            const title = this.props.title;
            const chartdata = this.state.chartData;
            const type = this.state.chartType;

            let render_chart = <div></div>
            if (type === CHART_TYPE[0]){
                const pos_v = title+"*percent";
                // console.log(chartdata);
                // create data view
                let ds = new DataSet();
                let dv = ds.createView().source(chartdata);
                dv.transform({
                    type: 'percent',
                    field: 'count',
                    dimension: title,
                    as: "percent",
                });
                // console.log(dv);

                const cols = {
                    percent: {
                        formatter: val => {
                            val = val * 100 + "%";
                            return val;
                        }
                    }
                };

                render_chart =  <div>
                                    <Chart
                                        width={127}
                                        height={90}
                                        padding={[ 0,0,0,0 ]}
                                        data={dv}
                                        scale={cols}
                                    >
                                    <Coord type="theta" radius={1} />
                                    <Axis name="percent" />
                                    <Tooltip
                                        inPlot={false}
                                        position={"right"}
                                        showTitle={false}
                                        itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"                        
                                    />
                                    <Geom
                                        type="intervalStack"
                                        position="percent"
                                        color={title}
                                        tooltip={[
                                            pos_v,
                                            (item, percent) => {
                                                percent = (percent * 100).toFixed(2) + "%";
                                                return {
                                                name: item,
                                                value: percent
                                                };
                                            }
                                        ]}
                                        
                                    />
                                    </Chart>
                                </div>
            } else if (type === CHART_TYPE[1]){
                const pos_v = title+"*count";
                // console.log(chartdata);
                let ds = new DataSet();
                let dv = ds.createView().source(chartdata);
                dv.transform({
                    type: 'aggregate',
                    groupBy: [title],
                });
                // console.log(dv);

                render_chart =  <div>
                                    <Chart
                                        width={127}
                                        height={90}
                                        padding={[ 0,0,0,0 ]}
                                        data={dv}
                                    >
                                        <Axis name={title} />
                                        <Axis name="count" />
                                        <Tooltip
                                            inPlot={false}
                                            crosshairs={{
                                            type: "y"
                                            }}
                                            position={"right"}
                                        />
                                        <Geom
                                            type="line"
                                            position={pos_v}
                                            size={0.3} />
                                        <Geom
                                            type="point"
                                            position={pos_v}
                                            size={1}
                                            shape={"circle"}
                                            // style={{
                                            // stroke: "#fff",
                                            // lineWidth: 0.1
                                            // }}
                                        />
                                    </Chart>
                                </div>
            } else if (type === CHART_TYPE[2]){
                const pos_v = title+"*count";
                console.log(chartdata);
                let ds = new DataSet();
                let dv = ds.createView().source(chartdata);
                dv.transform({
                    type: 'aggregate',
                    groupBy: [title],
                });
                console.log(dv);

                render_chart =  <div>
                                    <Chart
                                        width={127}
                                        height={90}
                                        padding={[ 0,0,0,0 ]}
                                        data={dv}
                                    >
                                    <Axis name={title} />
                                    <Axis name="count" />
                                    <Tooltip inPlot={false} crosshairs={true} position={"right"}/>
                                    <Geom
                                        type="interval"
                                        position={pos_v}
                                    />
                                    </Chart>
                                </div>
            } else {
                console.log('ERR!')
            }

            return(
                <div>
                    {render_chart}
                </div>
            );
        }
    }
}
// label={null}
export default StrChart;