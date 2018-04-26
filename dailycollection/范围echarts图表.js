//	停机记录图表
    MakeShutDownChart:function(){
    	var myShutDownChart=echarts.init(document.getElementById('shutDownChart'));
    	var jsonData=[
    		{workCenter:"生料磨",regularClass:"午班",startShutDownTime:"2018-04-25 09:00:00",endShutDownTime:"2018-04-25 16:00:00",useTime:6.070},
    		{workCenter:"煤磨",regularClass:"早班",startShutDownTime:"2018-04-25 12:36:53",endShutDownTime:"2018-04-25 13:29:21",useTime:0.870},
    		{workCenter:"测试磨",regularClass:"晚班",startShutDownTime:"2018-04-25 12:36:53",endShutDownTime:"2018-04-25 20:29:21",useTime:0.870},
    		{workCenter:"测试磨",regularClass:"早班",startShutDownTime:"2018-04-25 02:36:53",endShutDownTime:"2018-04-25 11:29:21",useTime:0.870}
    	];
    	var workCenterName="";
    	var objArr=[];
    	jQuery.each(jsonData,function(index,value){
    		if(value.workCenter!=workCenterName){
    			workCenterName=value.workCenter;
    			var groupData = jQuery.grep(jsonData,function(groupValue,groupIndex){
    				return groupValue.workCenter==workCenterName;
    			})
    			if(groupData){
    				var obj={};
    				obj.workCenter=groupData[0].workCenter;
    				obj.Data=[];
    				jQuery.each(groupData,function(ginde,gvalue){
	    				var subObj={};
	    				subObj.regularClass=gvalue.regularClass;
	    				subObj.startShutDownTime=gvalue.startShutDownTime;
	    				subObj.endShutDownTime=gvalue.endShutDownTime;
	    				subObj.useTime=gvalue.useTime;
	    				obj.Data.push(subObj);
    				})
    				if(JSON.stringify(objArr).indexOf(JSON.stringify(obj))==-1){
    					objArr.push(obj);
    				}
    			}
    		}
    	})
    	var workCenters=[];
		var types = [
		    {name: '晚班'},
		    {name: '早班'},
		    {name: '午班'}
		];
		var series=[];
		var xData=[];
		for(var i=0;i<23;i++){
			var dateString;
			dateString=i<10?"0"+i+":00":i+":00";
			xData.push(dateString);
		}
		// Generate mock data
		echarts.util.each(objArr, function (value, index) {
			workCenters.push(value.workCenter);
			var num=value.Data.length;
		    for (var i = 0; i < num; i++) {
		    	var data = [];
		    	var $seriesObj={};
		    	var baseTime = parseTime(TimeSpinnerOperation.Formatter(new Date(value.Data[i].startShutDownTime)));
		    	var endTime = parseTime(TimeSpinnerOperation.Formatter(new Date(value.Data[i].endShutDownTime)));
		    	var regularClass=value.Data[i].regularClass;
		    	var currentIndex=types.findIndex(function(value){
			    	return value.name==regularClass;
			    })
		        var typeItem = types[currentIndex];
		        $seriesObj.name=regularClass;
		        $seriesObj.type='custom';
		        $seriesObj.itemStyle={normal: {opacity: 0.8}};
		        $seriesObj.encode={x: [1, 2],y: 0};
		        data.push({
		            name: typeItem.name,
		            value: [
		                index,
		                baseTime,
		                endTime,
		                endTime-baseTime
		            ]
		        });
		        $seriesObj.data=data;
		        $seriesObj.renderItem=renderItem;
		        series.push($seriesObj);
		    }
		});
		function formatDuring(mss) {
		    var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		    hours=hours<10?"0"+hours:hours;
		    var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
		    minutes=minutes<10?"0"+minutes:minutes;
		    return   hours+ " : " + minutes;
		}
		function parseTime(time) {
		    var seconds=time.substr(0,2)*1000*3600+time.substr(3,2)*60*1000+time.substr(-2)*1000
		    return  seconds;
		}
		function renderItem(params, api) {
		    var categoryIndex = api.value(0);
		    var start = api.coord([api.value(1), categoryIndex]);
		    var end = api.coord([api.value(2), categoryIndex]);
		    var height = api.size([0, 1])[1] * 0.4;
		    return {
		        type: 'rect',
		        shape: {
                    // 矩形的位置和大小。
                    x: start[0],
                    y: start[1] - height / 2,
                    width: end[0] - start[0],
                    height: height
                },
		        style: api.style()
		    };
		}
		var option = {
		    tooltip: {
		        formatter: function (params) {
		            return params.marker + params.data.name + ': ' + (params.value[3]/(3600*1000)).toFixed(2) + ' 小时';
		        }
		    },
		    legend: { 
		        type:'plain',
		        data: ['晚班', '早班','午班']
		    },
		    color: ['#cfd1f1', '#1e9ce8','#9599de'],
		    grid: {
		    	left:'-5',
		    	containLabel:true,
		    },
		    xAxis: {
		    	type:'time',
		    	min:0,
		    	max:24*3600*1000,
		    	interval:2*3600*1000,
		    	axisLabel:{
		    		rotate:'45',	
		    		fontSize:5,
		    		formatter: function(value,index){
		    			return formatDuring(value);
		    		}
		    	},
		        scale:true
		    },
		    yAxis: { 
		    	axisLabel:{
		    		rotate:'45',
		    		fontSize:9
		    	},
		        data: workCenters
		    },
		    series: series
		};
		myShutDownChart.setOption(option);
    }
