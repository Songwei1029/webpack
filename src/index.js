import '@/styles/index.less';

import axios from 'axios';


new Promise((resolve, reject) => {
    axios.get('/apis/getUser').then(res => {
        resolve(res);
    }).catch(err => {
        reject(err);
    })
}).then(({ data: { list } }) => {
    console.log(list);
})


import React, { Component } from "react";
import ReactDom from "react-dom";

class Home extends Component {
    state = {
        count: 1,
        list: []
    }
    btnclick = (num) => {
        this.setState({
            count: this.state.count + num
        });
    }
    componentDidMount(){
        axios.get('/apis/getUser').then(res => {
            const {data: {list}} = res;
            this.setState({
                list
            });
        });
    }
    
    render() {
        const { list, count } = this.state;
        return <div>
            <button onClick={() => this.btnclick(1)}>加</button>
            <span>{count}</span>
            <button onClick={() => this.btnclick(-1)}>减</button>
            {
                list.map(item => <p key={item.id}>{item.id} - {item.name} - {item.age}</p>)
            }
        </div>
    }
}
ReactDom.render(<Home />, document.getElementById('root'));