import React from 'react';
import ReactDOM from 'react-dom';

import './index.less';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';

// import 'antd/dist/antd.css';
import EarthQuakeTable from './earthquaketable';
import { Layout, Tag } from 'antd';

// import ChartTest from './charttest';

const { Content, Footer, Header } = Layout;

// import * as serviceWorker from './serviceWorker';

const col_exp = [
    ["id", "DECIMAL", "id of earthquake"],
    ["date", "CHAR", "date of earthquake"],
    ["time", "CHAR", "time of earthquake"],
    ["latitude", "DECIMAL", "latitude of earthquake"],
    ["longitude", "DECIMAL", "longitude of earthquake"],
    ["country", "VARCHAR", "country of earthquake"],
    ["city", "VARCHAR", "city of earthquake"],
    ["area", "VARCHAR", "area of earthquake"],
    ["direction", "VARCHAR", "direction of earthquake"],
    ["distance", "DECIMAL", "distance of direction in km"],
    ["depth", "DECIMAL", "depth of earthquake"],
    ["xm", "DECIMAL", "xm of earthquake"],
    ["md", "DECIMAL", "md of earthquake"],
    ["richter", "DECIMAL", "Intensity of earthquake (Richter)"],
    ["mw", "DECIMAL", "mw of earthquake"],
    ["ms", "DECIMAL", "ms of earthquake"],
    ["mb", "DECIMAL", "mb of earthquake"],
]

let col_exp_ul = <ul class="col-md-12 col-md-push-1">
                    {
                        col_exp.map((value) => {
                            let tag_comp = '';
                            if (value[1] === "CHAR") {
                                tag_comp = <Tag color="magenta">{value[1]}</Tag>
                            } else if (value[1] === "VARCHAR") {
                                tag_comp = <Tag color="purple">{value[1]}</Tag>
                            } else if (value[1] === "DECIMAL") {
                                tag_comp = <Tag color="cyan">{value[1]}</Tag>
                            } else {
                                tag_comp = <Tag>{value[1]}</Tag>
                            }
                            const result =  <li>
                                                <span>
                                                    <strong>{value[0]} </strong>
                                                    {tag_comp}
                                                    {value[2]}
                                                </span>
                                            </li>
                            return result;
                        })
                    }
                </ul>

class ThisPage extends React.Component {
    render() {
        return(
            <div>
                <Layout>
                    <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                        <div id="header" class="container">
                            <p>Earthquakes in Turkey</p>
                        </div>
                    </Header>
                    <Content id="content-body" style={{ padding: '0px 0px 50px', marginTop: 64 }}>
                        <section id="section-overview">
                            <div class="container">
                                <div id="overview" class="col-sm-6">
                                    <h2>Overview</h2>
                                    <p class="col-md-10 col-md-push-1 col-lg-8 col-lg-push-2">
                                        The data covers up all the recorded earthquakes in the latitudes between 25 - 50; longitudes 15 - 60. As the metering stations are placed in Turkey most of the recorded earthquakes are in latitudes between 35 - 45; longitudes 25 - 45. The database search time filter was set to dates 27/09/1910 to 27/09/2017. As there are too many earthquakes which have intensities smaller than 4.0, the filter of intensity was set to 3.5 to 9.0 (there was no earthquakes recorded larger than 9.0 intensity). Not being an earthquake specilist or geologist, I have no idea about the different kind of intensity measurements in the dataset (the columns between xM and Ms).
                                    </p>
                                </div>
                                <div id="columns" class="col-sm-6">
                                    <h2>Columns</h2>
                                    {col_exp_ul}
                                </div>
                            </div>
                        </section>
                        <section id="section-table">
                            <div class="container">
                                <div id="datatable" class="col-sm-12">
                                    <h2>Data</h2>
                                    <div
                                        className="scrollable-container"
                                        class="col-md-10 col-md-push-1"
                                        // style={{
                                            // background: '#fff',
                                            // padding: 25,
                                            // Height: 850,
                                            // Width: 950
                                        // }}
                                    >
                                        <EarthQuakeTable id="eqtable"/>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </Content>
                    <Footer id="footer">
                        <div class="container">
                            <p style={{ textAlign: 'center' }}>Was it a bar or a bat I saw？</p>
                        </div>
                    </Footer>
                </Layout>
            </div>
        )
    }
}

ReactDOM.render(<ThisPage />, document.getElementById('root'));
// serviceWorker.unregister();






// ReactDOM.render(<ChartTest />, document.getElementById('test'));














