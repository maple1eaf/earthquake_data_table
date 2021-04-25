import React from 'react';
import axios from 'axios';
import { Table, Spin, Pagination } from 'antd';
import TableTh from './tableth';

const primary_headers = ["id", "date", "time", "latitude", "longitude", "country", "city", "area", "direction", "distance", "depth", "xm", "md", "richter", "mw", "ms", "mb"];
const nums = ["id", "latitude", "longitude", "distance", "depth", "xm", "md", "richter", "mw", "ms", "mb"];
const strs = ["date", "time", "country", "city", "area", "direction"];

// axios.defaults.baseURL = "http://localhost:3001/";
axios.defaults.baseURL = "http://106.14.216.118:3001/";

class EarthQuakeTable extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            page_limit_num: 100,
            page: 1,
            tableData: [],
            isLoaded: false,
            tableColumnRange: {},
            rangeIsLoaded: false,
            // webUrl: ek_data_sample_url,
            setColumn: 'none', // 'none' or one in primary_headers
            tableState: 'default', // 'default', 'number', 'string'
            tablethData: '',
            n_rows: 0,
            n_rows_all: 0,
        }
    }

    getDefaultPage = (limit, offset) => {
        axios.post('/api/getdefaultpage', {page_limit_num: limit, page_offset: offset})
        .then((res) => {
            console.log(res.data);
            this.setState({
                tableData: res.data,
                isLoaded: true
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

    getMaxMin = (num_headers) => {
        axios.post('/api/getmaxmin', {headers: num_headers})
        .then((res) => {
            console.log(res.data);
            this.setState({
                tableColumnRange: res.data,
                rangeIsLoaded: true,
                n_rows: res.data['countrows'],
                n_rows_all: res.data['countrows'],
            });
        })
        .catch((err) => {
            console.log('getMaxMin: ' + err);
        });
    }

    componentDidMount(){
        this.getDefaultPage(this.state.page_limit_num, 0);
        this.getMaxMin(nums);
        console.log('componetdidmount')
    }

    numSortAndFilter = (sort_and_filter, limit, offset) => {
        sort_and_filter['page_limit_num'] = limit;
        sort_and_filter['page_offset'] = offset;
        // console.log(sort_and_filter);
        axios.post('/api/numsortandfilter', sort_and_filter)
        .then((res) => {
            // console.log(res.data);
            this.setState({
                tableData: res.data,
                isLoaded: true,
                tablethData: sort_and_filter,
                tableState: 'number',
                page: 1,
                setColumn: sort_and_filter['column_title'],
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

    numGetNumOfRows = (sort_and_filter) => {
        axios.post('/api/numsortandfilternrow', sort_and_filter)
        .then((res) => {
            console.log(res.data);
            this.setState({
                n_rows: res.data[0]['rows'],
                isLoaded: true,
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

    numSortAndFilterChangePage = (sort_and_filter, limit, offset) => {
        sort_and_filter['page_limit_num'] = limit;
        sort_and_filter['page_offset'] = offset;
        // console.log(sort_and_filter);
        axios.post('/api/numsortandfilter', sort_and_filter)
        .then((res) => {
            // console.log(res.data);
            this.setState({
                tableData: res.data,
                isLoaded: true,
                tablethData: sort_and_filter,
                tableState: 'number'
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

    strSortAndFilter = (sort_and_filter, limit, offset) => {
        sort_and_filter['page_limit_num'] = limit;
        sort_and_filter['page_offset'] = offset;
        // console.log(sort_and_filter);
        axios.post('/api/strsortandfilter', sort_and_filter)
        .then((res) => {
            console.log(res.data);
            this.setState({
                tableData: res.data,
                isLoaded: true,
                tablethData: sort_and_filter,
                tableState: 'string',
                page: 1,
                setColumn: sort_and_filter['column_title'],
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

    strGetNumOfRows = (sort_and_filter) => {
        axios.post('/api/strsortandfilternrow', sort_and_filter)
        .then((res) => {
            console.log(res.data);
            this.setState({
                n_rows: res.data[0]['rows'],
                isLoaded: true,
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

    strSortAndFilterChangePage = (sort_and_filter, limit, offset) => {
        sort_and_filter['page_limit_num'] = limit;
        sort_and_filter['page_offset'] = offset;
        // console.log(sort_and_filter);
        axios.post('/api/strsortandfilter', sort_and_filter)
        .then((res) => {
            // console.log(res.data);
            this.setState({
                tableData: res.data,
                isLoaded: true,
                tablethData: sort_and_filter,
                tableState: 'string',
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

    clearTable = () => {
        this.getDefaultPage(this.state.page_limit_num, 0);
        this.setState({
            tableState: 'default',
            page: 1,
            setColumn: 'none',
            n_rows: this.state.n_rows_all,
        });
    }

    changePage = (page, pageSize) => {
        const limit = this.state.page_limit_num;
        const offset = (page - 1) * limit;
        console.log(offset);
        const table_state = this.state.tableState;

        if (table_state === 'default') {
            this.getDefaultPage(limit, offset);
        } else if (table_state === 'number') {
            const th_data = this.state.tablethData;
            console.log(th_data);
            this.numSortAndFilterChangePage(th_data, limit, offset);
        } else {
            // table_state === 'string'
            const th_data = this.state.tablethData;
            console.log(th_data);
            this.strSortAndFilterChangePage(th_data, limit, offset);
        }
        this.setState({
            page: page
        });
    }

    render(){
        if(!this.state.isLoaded || !this.state.rangeIsLoaded){
            return (
            <div style={{textAlign: "center"}} ><Spin size="large" /></div>
            );
        } else {
            const data_0 = this.state.tableData;
            const columns = [];
            // console.log(this.state.tableColumnRange);

            primary_headers.forEach((value, i) => {
                // check content type
                let content_type = ''; //could be 'number' or 'string' or unknow'
                let table_th = '';

                let isSet = false;
                const { setColumn } = this.state;
                if (setColumn === 'none') {
                    isSet = false;
                } else if (setColumn === value) {
                    isSet = true;
                } else {
                    isSet = false;
                }


                if (nums.indexOf(value) > -1) {
                    content_type = 'number';
                    table_th = <TableTh
                                    titleName={value}
                                    contentType={content_type}
                                    numRange={this.state.tableColumnRange[value]}
                                    onSortAndFilter={this.numSortAndFilter}
                                    getNumRow={this.numGetNumOfRows}
                                    onClear={this.clearTable}
                                    // onSettedChange={this.focusOnNewColumn}
                                    // unsettedColumn={this.state.prevSettedColumn}
                                    page_limit_num={this.state.page_limit_num}
                                    isSet={isSet}
                                />;
                } else if (strs.indexOf(value) > -1) {
                    content_type = 'string';
                    table_th = <TableTh
                                    titleName={value}
                                    contentType={content_type}
                                    onSortAndFilter={this.strSortAndFilter}
                                    getNumRow={this.strGetNumOfRows}
                                    onClear={this.clearTable}
                                    // onSettedChange={this.focusOnNewColumn}
                                    // unsettedColumn={this.state.prevSettedColumn}
                                    page_limit_num={this.state.page_limit_num}
                                    isSet={isSet}
                                />;
                } else {
                    content_type = 'unknow'
                }

                columns.push({
                    title: table_th,
                    dataIndex: value,
                    key: value,
                    width: 160,
                    //for word wrap
                    render: (text, record) => (
                        <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
                            {text}
                        </div>
                    ),
                });
            });
            // delete columns[columns.length-1]['width'];
            console.log(this.state.n_rows);
            

            return (
                <div>
                    <div style={{ marginBottom: 16}}>
                        <Pagination
                            current={this.state.page}
                            total={this.state.n_rows}
                            pageSize={this.state.page_limit_num}
                            // hideOnSinglePage={true}
                            onChange={this.changePage}
                            showQuickJumper
                            size="small"
                        />
                    </div>
                    <div>
                        <Table 
                            columns={columns}
                            dataSource={data_0}
                            bordered
                            // title={() => 'Earthquake in Turkey'}
                            pagination={false}
                            scroll={{ x: "max-content", y: 1000 }}
                            // showHeader={false}
                        />
                    </div>
                </div>
            );
        }
    }
}



export default EarthQuakeTable;















