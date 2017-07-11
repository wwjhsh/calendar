$.fn.calendar=function(options){
	return this.each(function(){
		var $this=$(this),
			_beginyear,
			_endyear,
			_beginmonth,
			_endmonth,
			_choosedyear,
			_choosedmonth,
			_begindate,
			_enddate;
		if ( $("#calendar").length > 0 ) { $("#calendar").remove(); }
		var _this = {
			targetId:               "",
			begindate:           	new Date("2008/02/02"),
			enddate: 				new Date("2008/09/09"),
			choosedyear: 			2008,
			choosedmonth: 			9,
			selectback : 			function(){ }, //选择日期的事件回调
            callback : 				function (){ } //初始化日期的事件回调
		}
		$.extend(_this,options);//导出配置设置，可在使用时修改设置
		//初始化日期
		$this._begindate=_this.begindate;
		$this._enddate=_this.enddate;
		$this._beginyear=$this._begindate.getFullYear();
		$this._endyear=$this._enddate.getFullYear();
		$this._choosedyear=_this.choosedyear;
		$this._choosedmonth=_this.choosedmonth;
		$.fn.calendar.setContainer($this,_this);
		$.fn.calendar.setMonth($this);
		$.fn.calendar.setPicker($this,_this);
		$.fn.calendar.setDateData($this,_this);
	});
};
//构建容器
$.fn.calendar.setContainer=function($this,_this){
	var $calendarDiv=$("<div id="+_this.targetId+"></div>");
	var _y=$this.offset().top+30;
	var _x=$this.offset().left;
	var $form=$('<form></form>').appendTo($calendarDiv);
	$("<div class='time-choose'></div>").appendTo($form);
	var $table=$("<table class='calendar-table calendar-day'></table>").appendTo($form);
	var $thead=$("<thead></thead>").appendTo($table);
	var $tbody=$("<tbody></tbody>").appendTo($table);
	var $tr=$("<tr></tr>").appendTo($thead);
	$("<th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th>").appendTo($tr);
	$calendarDiv.css({"left": _x+"px","top": _y+"px"}).appendTo("body");
	$calendarDiv.on("click",function(e){
        e.stopPropagation();
    });
    $(document).on("click",function(e){
        $calendarDiv.remove();
    });
}
//设置月份参数
$.fn.calendar.setMonth=function($this){
	if (($this._choosedyear<=$this._endyear)&&($this._choosedyear>=$this._beginyear)) {
		if ($this._choosedyear==$this._beginyear) {
			$this._beginmonth=$this._begindate.getMonth()+1;
		}
		if ($this._choosedyear==$this._endyear) {
			$this._endmonth=$this._enddate.getMonth()+1;
		}
		if ($this._choosedyear>$this._beginyear) {
			$this._beginmonth=1;
		}
		if ($this._choosedyear<$this._endyear) {
			$this._endmonth=12;
		}
	}
};
//组装选择器
$.fn.calendar.setPicker=function($this,_this){
	var _beginyear=$this._beginyear,
		_endyear=$this._endyear,
		_beginmonth=$this._beginmonth,
		_endmonth=$this._endmonth,
		_choosedyear=$this._choosedyear,
		_choosedmonth=$this._choosedmonth;
	console.log(_this.targetId);
	$("#"+_this.targetId+" .time-choose").empty();
	//组装年份选择器
	var $out_inline1=$("<div></div>").addClass("calendar-inline");
	var $lable1=$("<label></label>");
	var $in_inline1=$("<div></div>").addClass("calendar-inline");
	var $select_item1=$("<select></select>").addClass("calendar-year").attr({"name":"year"});
	$lable1.text("年份");
	for (var i = _beginyear; i <= _endyear; i++) {
		if (i==_choosedyear) {
			$("<option></option>").text(i).attr({"value":i,"selected":""}).appendTo($select_item1);
		}
		else{
			$("<option></option>").text(i).attr("value",i).appendTo($select_item1);
		}
	}
	$select_item1.appendTo($in_inline1);
	$out_inline1.append($lable1).append($in_inline1);
	$("#"+_this.targetId+" .time-choose").append($out_inline1);
	//组装月份选择器
	var $out_inline2=$("<div></div>").addClass("calendar-inline");
	var $lable2=$("<label></label>");
	var $in_inline2=$("<div></div>").addClass("calendar-inline");
	var $select_item2=$("<select></select>").addClass("calendar-month").attr({"name":"month"});
	$lable2.text("月份");
	for (var i = _beginmonth; i <= _endmonth; i++) {
		if (i==_choosedmonth) {
			$("<option></option>").text(i).attr({"value":i,"selected":""}).appendTo($select_item2);
		}
		else{
			$("<option></option>").text(i).attr("value",i).appendTo($select_item2);
		}
	}
	$select_item2.appendTo($in_inline2);
	$out_inline2.append($lable2).append($in_inline2);
	$("#"+_this.targetId+" .time-choose").append($out_inline2);
	//组装上下月按键
	$("<div></div>").addClass("calendar-last").text("上月").prependTo($("#"+_this.targetId+" .time-choose"));
	$("<div></div>").addClass("calendar-next").text("下月").prependTo($("#"+_this.targetId+" .time-choose"));
	// 组装好的选择器添加方法
	$("#"+_this.targetId+" select.calendar-year").change(function(){
		console.log($(this).val());
		$this._choosedyear=$(this).val();
		$.fn.calendar.setMonth($this);
		$this._choosedmonth=$this._beginmonth;
		$.fn.calendar.setPicker($this,_this);
		$.fn.calendar.setDateData($this,_this);
	});
	$("#"+_this.targetId+" select.calendar-month").change(function(){
		$this._choosedmonth=$(this).val();
		$.fn.calendar.setDateData($this,_this);
		$.fn.calendar.setMonthNear($this,_this);
	});
	$.fn.calendar.setMonthNear($this,_this);
}
$.fn.calendar.setMonthNear=function($this,_this){
	var _date01=new Date();
	_date01.setFullYear($this._choosedyear,$this._choosedmonth-2,1);//得到上月份1号的日期
	console.log(_date01);
	if (($.fn.calendar.isInRange($this,Date.UTC($this._choosedyear,$this._choosedmonth-2,$.fn.calendar.getMonthDateAmount(_date01))))
		||($.fn.calendar.isInRange($this,Date.UTC($this._choosedyear-1,11,31)))) {
		$("#"+_this.targetId+" .calendar-last").css("visibility","visible");
	}
	else{
		$("#"+_this.targetId+" .calendar-last").css("visibility","hidden");
	}
	if (($.fn.calendar.isInRange($this,Date.UTC($this._choosedyear,$this._choosedmonth,1)))
		||($.fn.calendar.isInRange($this,Date.UTC($this._choosedyear+1,0,1)))) {
		$("#"+_this.targetId+" .calendar-next").css("visibility","visible");
	}
	else{
		$("#"+_this.targetId+" .calendar-next").css("visibility","hidden");
	}
	$("#"+_this.targetId+" .calendar-last").on("click",function(){
		if ($this._choosedmonth>1) {
			$this._choosedmonth--;
			$.fn.calendar.setPicker($this,_this);
			$.fn.calendar.setDateData($this,_this);
		}else{
			$this._choosedmonth=12;
			$this._choosedyear--;
			$.fn.calendar.setMonth($this);
			$.fn.calendar.setPicker($this,_this);
			$.fn.calendar.setDateData($this,_this);
		}
	});
	$("#"+_this.targetId+" .calendar-next").on("click",function(){
		if ($this._choosedmonth<12) {
			$this._choosedmonth++;
			$.fn.calendar.setPicker($this,_this);
			$.fn.calendar.setDateData($this,_this);
		}else{
			$this._choosedmonth=1;
			$this._choosedyear++;
			$.fn.calendar.setMonth($this);
			$.fn.calendar.setPicker($this,_this);
			$.fn.calendar.setDateData($this,_this);
		}
	});
}
//组装日历主体部分
$.fn.calendar.setDateData=function($this,_this){
	var _choosedyear=$this._choosedyear,
	_choosedmonth=$this._choosedmonth;
	var $datePlace=$("#"+_this.targetId+" .calendar-day tbody");
	$datePlace.empty();
	var _date=new Date();
	_date.setFullYear(_choosedyear,_choosedmonth-1,1);//得到所选择月份1号的日期
	var _date_day=_date.getDay();//所选月份1号为星期几
	var _dayAmount=$.fn.calendar.getMonthDateAmount(_date);
	var _date_last=new Date();
	_date_last.setFullYear(_choosedyear,_choosedmonth-1,_dayAmount);//得到所选择月份最后一天的日期
	var _date_last_day=_date_last.getDay();
	var num=1;
	setDate:for (var i = 0;; i++) 
	{
		var $trItem=$("<tr></tr>");
		if (i==0) {
			if (_date_day!=0) {
				for (var j = 0; j <_date_day; j++) {
					$("<td></td>").addClass("forbid").appendTo($trItem);
				}
			}
			for (var j = _date_day; j < 7; j++,num++) {
				$("<td></td>").text(num).appendTo($trItem);
			}
		}else{
			for (var j = 0; j < 7; j++,num++) {
				$("<td></td>").text(num).appendTo($trItem);
				if (num==_dayAmount) {
					if (_date_last_day<6) {
						for (var j = _date_last_day+1; j < 7; j++,num++) {
							$("<td></td>").addClass("forbid").appendTo($trItem);
						}
					}
					$trItem.appendTo($datePlace);
					break setDate;
				}
			}
		}
		$trItem.appendTo($datePlace);
	}
}
//得到某一天月份天数
$.fn.calendar.getMonthDateAmount=function(date){
	var month=date.getMonth()+1;
	var year=date.getFullYear();
	switch(month){
		case 1:
		case 3:
		case 5:
		case 7:
		case 8:
		case 10:
		case 12: return 31;
		case 4:
		case 6:
		case 9:
		case 11: return 30;
		case 2:
		if (year%100==0) {
			if (year%4==0) {
				return 29;
			}else{
				return 28;
			}
		}
		if (year%4==0) {
			return 29
		}else {
			return 28;
		}
	}
}
//判断一个时间是否在某个时间范围内
$.fn.calendar.isInRange=function($this,date){
	var _begindate=Date.UTC($this._begindate.getFullYear(),$this._begindate.getMonth(),$this._begindate.getDate()),
		_enddate=Date.UTC($this._enddate.getFullYear(),$this._enddate.getMonth(),$this._enddate.getDate());
	// date=Date.UTC(date.getFullYear(),date.getMonth()+1,date.getDate());
	if ((date<=_enddate)&&(date>=_begindate)) {
		console.log(_begindate);
		console.log(Date.UTC("2012/2/02"));
		return true;
	}else {
		return false;
	}
}