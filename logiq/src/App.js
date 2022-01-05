import './App.css';
import { Button, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import * as Plotly from 'plotly.js';
const moment = require('moment');
function App() {
  const [graphData, setGraphData] = useState(null);
  const convertdate = () => {

  }
  const convertdate2 = () =>{

  }
  useEffect(()=>{
    
    axios.get('/api/getanamoly')
    .then((res)=>{
      const data = res.data;
      let dataframe = data.dataframe.time;
      let xvalues = []
      let yvalues = []
      dataframe.forEach((item, index)=>{
        xvalues.push(item)
        yvalues.push(data.dataframe.value[index])
      })
      
      let anamoliex = []
      let anamoliey = []
      let anamolies = data.outlier_dates;
      let anamolieValues = data.anamoly_values;
      
      anamolies.forEach((datestring, index)=>{
        anamoliex.push(datestring)
        anamoliey.push(anamolieValues[index])
      })

      rendergraph(xvalues, yvalues, anamoliex, anamoliey)
    })
    .catch((err)=>{
      console.log(err);
    })

    axios.get('/api/getmean')
    .then((res)=>{
      const data = res.data;
      let x1 = [];
      let y1 = [];
      let y2 = [];
      let y3 = [];
      
      let timestamp = data.timestamp;
      let values = data.value;
      let MA48 = data.MA48;
      let MA336 = data.MA336;

      timestamp.forEach((item, index)=>{
        
        x1.push(item);
        
        y1.push(values[index]);
        y2.push(MA48[index]);
        y3.push(MA336[index]);
      
      })
      // rendergraph(data);
      
      var trace1 = {
        x: x1,
        y: y1,
        type: 'scatter',
        mode: 'lines',
        name:'value'
      };
      var trace2 = {
        x: x1,
        y: y2,
        type: 'scatter',
        mode: 'lines',
        name: 'MA48'
      };
      var trace3 = {
        x: x1,
        y: y3,
        type: 'scatter',
        mode: 'lines',
        name: 'MA336'
      };
      rendermeangraph(trace1, trace2, trace3);
    })
    .catch((err)=>{
      console.log(err);
    })
  },[])

  const rendergraph = (xvalues, yvalues, anamoliex, anamoliey)=>{
    var trace1 = {
      x: xvalues,
      y: yvalues,
      type: 'scatter',
      mode: 'lines',
      name: 'value',
      line: {
        color: '#2a9ef7'
      }
    };
    var trace2 = {
      x: anamoliex,
      y: anamoliey,
      type: 'scatter',
      mode: 'markers',
      name: 'anamoly',
      // color:'red'
      marker: {
        color: 'red',
        size:'9'
      },
    };

    var data = [
      trace2,
      trace1
    ];
    
    var layout = {
      // "width": 500,
      "height": 700,
      "title": {
        "text": "NYC TAXI TRIPS - UNSUPERVISED ANAMOLY DETECTION"
      },
      plot_bgcolor:"black",
      paper_bgcolor:"#FFF3",
      "yaxis": {
        // "tickcolor": "rgba(255,0,0,0.75)",
        // "tickwidth": 15,
        title: {
          text: 'value'
        },
        "gridcolor": "grey",
        // "gridwidth": 15,
        
        // "zerolinecolor": "green",
        // "zerolinewidth": 2,
      },
      "xaxis": {
        // "tickcolor": "orange",
        // "tickwidth": 50,
        title: {
          text: 'timestamp'
        },
        "gridcolor": "grey",
        // "gridwidth": 2,  
      },
      showlegend: true,
      // displayModeBar: false
    };

    Plotly.newPlot('myDiv', data, layout, {scrollZoom: true, displayModeBar: false});
  }
  const rendermeangraph = (trace1, trace2, trace3)=>{
    
    var data = [
      trace1, 
      trace2,
      trace3
    ];
    var layout = {
      // "width": 500,
      "height": 700,
      "title": {
        "text": "NYC TAXI TRIPS"
      },
      plot_bgcolor:"black",
      paper_bgcolor:"#FFF3",
      "yaxis": {
        // "tickcolor": "rgba(255,0,0,0.75)",
        // "tickwidth": 15,
        title: {
          text: 'value'
        },
        "gridcolor": "grey",
        // "gridwidth": 15,
        
        // "zerolinecolor": "green",
        // "zerolinewidth": 2,
      },
      "xaxis": {
        // "tickcolor": "orange",
        // "tickwidth": 50,
        title: {
          text: 'timestamp'
        },
        "gridcolor": "grey",
        // "gridwidth": 2,  
      },
      // displayModeBar: false
    };

    Plotly.newPlot('myDiv1', data, layout, {scrollZoom: true, displayModeBar: false});
  }
  return (
    <div className="App">
      <div>
        <Row className='justify-content-center'>
          <Col>
            <div id='myDiv'></div>
          </Col>
        </Row>
        <Row className='justify-content-center'>
          <Col>
            <div id='myDiv1'></div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default App;
// 7/1/2014 5:30:00 1404172800000