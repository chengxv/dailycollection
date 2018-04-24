//	停机记录图表
    MakeShutDownChart:function(){
    	var myShutDownChart=echarts.init(document.getElementById('shutDownChart'));
    	var jsonData=[
    		{workCenter:"生料磨",regularClass:"早班",startShutDownTime:"2",endShutDownTime:"4",useTime:2},
    		{workCenter:"测试磨",regularClass:"午班",startShutDownTime:"7",endShutDownTime:"8",useTime:1},
    		{workCenter:"生料磨",regularClass:"早班",startShutDownTime:"5",endShutDownTime:"6",useTime:1},
    		{workCenter:"一号水泥磨",regularClass:"午班",startShutDownTime:"1",endShutDownTime:"5",useTime:4},
    		{workCenter:"生料磨",regularClass:"午班",startShutDownTime:"7",endShutDownTime:"8",useTime:1},
    		{workCenter:"二号水泥磨",regularClass:"晚班",startShutDownTime:"3",endShutDownTime:"5",useTime:2}
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
		// Generate mock data
		echarts.util.each(objArr, function (value, index) {
			workCenters.push(value.workCenter);
			var num=value.Data.length;
		    for (var i = 0; i < num; i++) {
		    	var data = [];
		    	var $seriesObj={};
		    	var baseTime = Number(value.Data[i].startShutDownTime);
		    	var regularClass=value.Data[i].regularClass;
		    	var duration = value.Data[i].useTime;
		    	var currentIndex=types.findIndex(function(value){
			    	return value.name==regularClass;
			    })
		        var typeItem = types[currentIndex];
		        $seriesObj.name=regularClass;
		        $seriesObj.type='custom';
		        $seriesObj.renderItem=renderItem;
		        $seriesObj.itemStyle={normal: {opacity: 0.8}};
		        $seriesObj.encode={x: [1, 2],y: 0};
		        data.push({
		            name: typeItem.name,
		            value: [
		                index,
		                baseTime,
		                baseTime += duration,
		                duration
		            ]
		        });
		        $seriesObj.data=data;
		        series.push($seriesObj);
		    }
		});
		
		function renderItem(params, api) {
		    var categoryIndex = api.value(0);
		    var start = api.coord([api.value(1), categoryIndex]);
		    var end = api.coord([api.value(2), categoryIndex]);
		    var height = api.size([0, 1])[1] * 0.4;
		    return {
		        type: 'rect',
		        shape: echarts.graphic.clipRectByRect({
		            x: start[0],
		            y: start[1] - height / 2,
		            width: end[0] - start[0],
		            height: height  
		        }, {
		            x: params.coordSys.x,
		            y: params.coordSys.y,
		            width: params.coordSys.width,
		            height: params.coordSys.height
		        }),
		        style: api.style()
		    };
		}
		var option = {
		    tooltip: {
		        formatter: function (params) {
		        	console.log(JSON.stringify(params));
		            return params.marker + params.data.name + ': ' + params.value[3] + ' 小时';
		        }
		    },
		    legend: {
		        type:'plain',
		        data: ['晚班', '早班','午班']
		    },
		    color: ['#EEEE00', '#FF3E96','#4209ea'],
		    grid: {
		    	left:'-5',
		    	containLabel:true,
		    },
		    xAxis: { 
		        scale:true,
		    },
		    yAxis: {
		    	axisLabel:{
		    		rotate:'45',
		    		fontSize:5
		    	},
		        data: workCenters
		    },
		    series: series
		};
		myShutDownChart.setOption(option);
    }