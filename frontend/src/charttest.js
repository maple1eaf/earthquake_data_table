import React from "react";
import axios from 'axios';
import { Spin } from 'antd';


import {
    G2,
    Chart,
    Geom,
    Axis,
    Tooltip,
    Coord,
    Label,
    Legend,
    View,
    Guide,
    Shape,
    Facet,
    Util
} from "bizcharts";


const query = `select latitude, longitude from earthquake;`

class ChartTest extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading: true,
            chartData: '',
            chartType: '',
        }
    }

    componentDidMount() {
        this.getChartData(query);
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

    getChartData = (sql_query) => {
        axios.post('http://localhost:3001/api/mysqlquery', {query: sql_query})
        .then((res) => {
            let data = res.data;
            console.log('charttest.data: latitude, longitude');
            console.log(data);
            this.setState({
                chartData: data,
                loading: false,
            });
        })
        .catch((err) => {
            console.log(err);
            this.setState({
                isLoaded: false,
                error: err
            });
        });
    }

    render() {
        if (this.state.loading) {
            return(
                <div style={{textAlign: "center"}} ><Spin size="small" /></div>
            );
        } else {
            return (
            <div>
                <Chart height={window.innerHeight} data={this.state.chartData} forceFit>
                <Tooltip
                    showTitle={false}
                    crosshairs={{
                    type: "cross"
                    }}
                    itemTpl="<li data-index={index} style=&quot;margin-bottom:4px;&quot;><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}<br/>{value}</li>"
                />
                <Axis name="latitude" />
                <Axis name="longitude" />
                <Geom
                    type="point"
                    position="latitude*longitude"
                    opacity={0.65}
                    shape="circle"
                    size={1}
                    tooltip={[
                    "latitude*longitude",
                    (latitude, longitude) => {
                        return {
                            name: "lat: " + latitude,
                            value: "lon: " + longitude
                        };
                    }
                    ]}
                />
                </Chart>
            </div>
            );
        }
    }
}

export default ChartTest;