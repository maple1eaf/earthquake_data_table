import React from 'react';
import { Icon, InputNumber } from 'antd';
import { Modal, Radio, Slider, Input, Divider, Switch } from 'antd';
// import NumChart from './numchart';
// import Strchart from './strchart';
// import { View } from '@antv/data-set';

const NULL_TEXT = [];

class TableTh extends React.Component {
    constructor(props){
        super(props);
        if (this.props.contentType === 'number' ) {
            this.state = {
                modalVisible: false,
                sortDirection: 'NOTSORT',
                filterRange: [],
                inputMinValue: this.props.numRange['min'],
                inputMaxValue: this.props.numRange['max'],
                includeNull: true,
                filterColor: 'outlined', // 'outlined' or 'twoTone'
                // inputText: NULL_TEXT,
                // inputTextDisplay: '',
                id: "id_" + this.props.titleName,
            };
        } else {
            this.state = {
                modalVisible: false,
                sortDirection: 'NOTSORT',
                filterRange: [],
                // inputMinValue: null,
                // inputMaxValue: null,
                includeNull: true,
                inputText: NULL_TEXT,
                inputTextDisplay: '',
            };
        }
    }

    setSortDirection = (e) => {
        // console.log(e.target.value);   // "ASC" or "DESC" or "NOTSORT"
        this.setState({
            sortDirection: e.target.value
        });
    }

    showModal = () => {
        this.setState({
            modalVisible: true,
        });
    };
    
    okSortAndFilt = () => {
        let data = {
            column_title: this.props.titleName,
            sort_direction: this.state.sortDirection,
            include_null: this.state.includeNull,
        };
        if (this.props.contentType === 'number') {
            data['filter_range'] = [this.state.inputMinValue, this.state.inputMaxValue];
        } else {
            data['filter_keywords'] = this.state.inputText;
        }

        this.props.onSortAndFilter(data, this.props.page_limit_num, 0);
        // this.props.onSettedChange(this.props.titleName);
        this.props.getNumRow(data);

        this.setState({
            modalVisible: false,
        });
    };
    
    handleClear = () => {
        this.props.onClear();
        this.clearModel();
    };

    clearModel = () => {
        console.log('clear model');
        this.setState({
            modalVisible: false,
            sortDirection: 'NOTSORT',
        });
        if (this.props.contentType === 'number') {
            this.setState({
                inputMinValue: this.props.numRange['min'],
                inputMaxValue: this.props.numRange['max'],
                includeNull: true,
            });
        } else {
            this.setState({
                inputText: NULL_TEXT,
                inputTextDisplay: ''
            });
        }
    }

    onRangeChange = value => {
        // console.log('value='+value[0]+',,,'+value[1]+typeof(value));
        if (value[0] !== this.props.numRange['min']) {
            this.setState({
                includeNull: false,
                inputMinValue: value[0],
                inputMaxValue: value[1]
            });
        } else {
            this.setState({
                inputMinValue: value[0],
                inputMaxValue: value[1]
            });
        }
    };

    onMinChange = min_val => {
        this.setState({
            inputMinValue: min_val
        });
    };

    onMaxChange = max_val => {
        this.setState({
            inputMaxValue: max_val
        });
    };

    onInputChange = content => {
        console.log(content.target.value);
        this.setState({
            inputTextDisplay: content.target.value,
        })
        // delete space
        const _str = content.target.value.replace(/\s*/g,"");
        const input_list = _str.split(',');
        let new_list = [];
        // delete null string, comma, space
        input_list.forEach(element => {
            if(element !== "" && element !== "," && element !== " ") {
                new_list.push(element);
            }
        });
        console.log(new_list)
        this.setState({
            inputText: new_list
        });
    }

    switchNullChange = value => {
        if (value === true) {
            this.setState({
                inputMinValue: this.props.numRange['min'],
                includeNull: true,
            });
        } else {
            this.setState({
                includeNull: false,
            });
        }
    }

    render(){
        let {inputMinValue, inputMaxValue} = this.state;
        const col_title = this.props.titleName;
        const col_type = this.props.contentType;
        let col_slider = '';
        // let col_chart = '';
        let switch_null = null;
        // const {unsettedColumn} = this.props;

        let fcolor = '';
        if (this.props.isSet === true) {
            fcolor = 'twoTone';
        } else {
            fcolor = 'outlined';
        }

        if (col_type === 'number') {
            let range_max = this.props.numRange['max'];
            let range_min = this.props.numRange['min'];
            let has_null = this.props.numRange['hasnull'];
            // let inputMinValue = range_min;
            // let inputMaxValue = range_max;
            // this.renderChart();
            // this.generateChart(this.props.titleName)

            if (has_null === null) {
                switch_null =   <div>
                                    Include Null: <Switch
                                        size="small"
                                        checked={this.state.includeNull}
                                        onChange={this.switchNullChange}
                                            />
                                </div>
            }

            col_slider = <div>
                            <Slider
                                range
                                min={range_min}
                                max={range_max}
                                onChange={this.onRangeChange}
                                // defaultValue={[range_min, range_max]}
                                value={[inputMinValue, inputMaxValue]}
                                // value={typeof(inputMaxValue) === 'number' && typeof(inputMinValue) === 'number' ? [inputMinValue, inputMaxValue] : [range_min, range_max]}
                                step={0.01}
                            />
                            <div>
                                <div style={{float:"left"}}>
                                    <InputNumber
                                        min={range_min}
                                        max={range_max}
                                        step={0.01}
                                        // defaultValue={range_min}
                                        value={inputMinValue}
                                        // value={typeof(inputMinValue) === 'number' ? inputMinValue : range_min}
                                        onChange={this.onMinChange}
                                    />
                                </div>
                                <div style={{float:"right"}}>
                                    <InputNumber
                                        min={range_min}
                                        max={range_max}
                                        step={0.01}
                                        // defaultValue={range_max}
                                        value={inputMaxValue}
                                        // value={typeof(inputMaxValue) === 'number' ? inputMaxValue : range_max}
                                        onChange={this.onMaxChange}
                                    />
                                </div>
                            </div>
                        </div>;

        } else {
            col_slider = <Input
                            placeholder="eg: abc, def, ghi, ..."
                            // placeholder="search for one value"
                            value={this.state.inputTextDisplay}
                            allowClear
                            onChange={this.onInputChange}
                        />
        }

        // if (col_type === 'number') {
        //     const range_max = this.props.numRange['max'];
        //     const range_min = this.props.numRange['min'];
        //     const col_range = [range_min, range_max];
        //     col_chart = <div id={this.state.id}>
        //                     <NumChart title={col_title} range={col_range}/>
        //                 </div>;
        // } else {
        //     col_chart = <div>
        //                     <Strchart title={col_title} />
        //                 </div>;
        // }

        return(
            <div>
                <div style={{width: 127}}>
                    <div style={{float: "left"}}>{col_title}</div>
                    <div style={{float: "right"}}>
                        <Icon type="sliders" theme={fcolor} twoToneColor="#eb2f96" onClick={() => this.showModal(true)} />
                    </div>
                    {/* <Divider /> */}
                    {/* {col_chart} */}
                </div>

                <div className="table-header-modal-div">
                    <Modal
                        title={" Sort & Filer: "+ col_title}
                        visible={this.state.modalVisible}
                        onOk={this.okSortAndFilt}
                        onCancel={this.handleClear}
                        mask={false}
                        width={330}
                        cancelText={"Clear"}
                        okText={"Apply"}
                        bodyStyle={{
                            height: 265,
                        }}
                        // centered={true}
                        // style={{
                        //     top: 129,
                        // }}
                    >
                        <div>
                            <div class="modal-sort-font">Sort</div>
                            <div style={{ textAlign: 'center' }}>
                                <Radio.Group
                                    defaultValue=''
                                    buttonStyle='solid'
                                    onChange={this.setSortDirection}
                                    value={this.state.sortDirection}
                                >
                                    <Radio.Button value='ASC'><Icon type="sort-ascending" /> Ascend</Radio.Button>
                                    <Radio.Button value='DESC'><Icon type="sort-descending" /> Descend</Radio.Button>
                                    <Radio.Button value='NOTSORT'><Icon type="stop" /></Radio.Button>
                                </Radio.Group>
                            </div>
                        </div>
                        <Divider />
                        <div>
                            <div class="modal-filter-font">Filter</div>
                            <div style={{ textAlign: 'center' }}>
                                {switch_null}
                                {col_slider}
                            </div>
                            
                        </div>
                    </Modal>
                </div>
            </div>
        );
    }
}











export default TableTh;



