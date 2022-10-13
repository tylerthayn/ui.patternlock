/*!
 * @tyler.thayn/ui.patternlock
 * https://github.com/tylerthayn/ui.patternlock
 *
 * Copyright Tyler Thayn
 * Released under the MIT license
 * https://github.com/tylerthayn/ui.patternlock/blob/main/LICENSE
 */
define(['jquery', 'jquery-ui'], function ($) {
	/*
	 *  Pattern Lock - v1.0.0
	 *  Android like pattern lock for web with touch event support
	 *
	 *
	 *  Made by Bharat Patil
	 *  Under CustomLicense License
	 */
	;(function($, window, document, undefined) {var i,j,idCounter,context,len,pluginName='patternLock',defaults={rows:3,columns:3,width:250,height:250,randomizeIds:false,isCircle:true,showPatternLine:true,patternLineColor:'#000000',fieldName:'',valueSeparator:',',valueArray:[],centerCircle:false,lineWidth:4,centerCircleSize:10,drawEnd:null,selectionColor:'#0000ff',timeout:500,allowRepeatSelection:false},isCanvas=function(){var elem=document.createElement('canvas');return!!(elem.getContext&&elem.getContext('2d'))}(),cssstyle='<style id="patternLockStyylee"></style>';function Plugin(element,options){this.element=element;this.started=false;this.nums=[];this.arrCoordinates=[];this.patternClearTimeout=null;this.canvas=null;this.canvasContext=null;this.selectionClass='myselectionClass'+(new Date).getTime();this.selectionClassStyle='.'+this.selectionClass;this.options=$.extend({},defaults,options);this._defaults=defaults;this._name=pluginName;this.init()}Plugin.prototype={init:function(){this.initIESupport();0===$('#patternLockStyylee').length&&$(cssstyle).appendTo('head');try{this.selectionClassStyle+='{ background-color: '+this.options.selectionColor+' !important; }';$('#patternLockStyylee').append(this.selectionClassStyle)}catch(e){this.selectionClass='ie8FallbackHighlight'}var _that=this;if(0===this.options.valueArray.length||this.options.valueArray.length!==this.options.rows*this.options.columns)for(i=0,len=this.options.rows*this.options.columns;i<len;i++)this.options.valueArray[i]=i+1;var content='<div class="patternlock" style="width:'+this.options.width+'px;height:'+this.options.height+'px"><div class="insideWrapper">';false===$.isEmptyObject(this.options.fieldName)&&(content+='<input type="hidden" name="'+this.options.fieldName+'">');true===isCanvas&&true===this.options.showPatternLine&&(content+='<canvas class="patternLockCanvas" width="100%" height="100%;"></canvas>');content+='<table class="tbl tbl1" cellspacing="25px">';idCounter=0;for(i=1;i<=this.options.rows;i++){content+='<tr>';for(j=1;j<=this.options.columns;j++){content=content+'<td class="lockTd cell-'+this.options.valueArray[idCounter]+'" data-value="'+this.options.valueArray[idCounter]+'">';this.options.centerCircle&&(content=content+'<div class="centerCircle cir-'+this.options.valueArray[idCounter]+'" style="width:'+this.options.centerCircleSize+'px;height:'+this.options.centerCircleSize+'px"></div>');idCounter++;content+='</td>'}content+='</tr>'}content+='</table>';content+='</div></div>';$(this.element).append(content);var tableWidth=$('table.tbl',this.element).outerWidth(),tableHeight=$('table.tbl',this.element).outerHeight(),containerElement=$('.patternlock',this.element);tableWidth>this.options.width&&(this.options.width=tableWidth);tableHeight>this.options.height&&(this.options.height=tableHeight);containerElement.css({width:this.options.width,height:this.options.height});if(true===isCanvas&&true===this.options.showPatternLine){_that.canvas=$('.patternLockCanvas',this.element)[0];_that.canvas.width=this.options.width;_that.canvas.height=this.options.height;_that.canvasContext=_that.canvas.getContext('2d')}this.bindEvents()},initIESupport:function(){Array.prototype.indexOf||(Array.prototype.indexOf=function(elt){var len=this.length>>>0;var from=Number(arguments[1])||0;(from=from<0?Math.ceil(from):Math.floor(from))<0&&(from+=len);for(;from<len;from++)if(from in this&&this[from]===elt)return from;return-1})},bindEvents:function(){var _that=this;$('td.lockTd',this.element).bind('mouseenter',function(evt){evt.preventDefault();_that.lockMoveMouse(this)});$('td.lockTd',this.element).bind('mousedown',function(){if(_that.patternClearTimeout){clearTimeout(_that.patternClearTimeout);_that.clearSelection()}_that.lockStartMouse(this)});$('.tbl',this.element).bind('touchmove',function(evt){evt.preventDefault();context=$(this);var touch=evt.originalEvent.touches[0]||evt.originalEvent.changedTouches[0],xpos=touch.pageX,ypos=touch.pageY;_that.lockMoveTouch(context,xpos,ypos)});$('.tbl',this.element).bind('touchstart',function(evt){if(_that.patternClearTimeout){clearTimeout(_that.patternClearTimeout);_that.clearSelection()}var touch=evt.originalEvent.touches[0]||evt.originalEvent.changedTouches[0],xpos=touch.pageX,ypos=touch.pageY;evt.preventDefault();context=$(this);_that.lockStartTouch(context,xpos,ypos)});$('.tbl',this.element).bind('mouseup touchend',function(evt){evt.preventDefault();_that.pattenDrawEnd()});$(document).bind('mouseup touchend',function(){_that.pattenDrawEnd()})},lockStartMouse:function(thatTd){this.started=true;this.nums=[];this.arrCoordinates=[];$(thatTd).removeClass('selected '+this.selectionClass);this.clearCanvas();$(thatTd).addClass('selected '+this.selectionClass);this.nums.push($(thatTd).attr('data-value'));this.arrCoordinates.push(this.getCenter(thatTd))},lockMoveMouse:function(thatTd){var num=$(thatTd).attr('data-value'),lastNum=this.nums[this.nums.length-1];if(true===this.started&&lastNum!==num&&(this.options.allowRepeatSelection||-1===this.nums.indexOf(num))){this.arrCoordinates.push(this.getCenter(thatTd));this.drawLine();$(thatTd).addClass('selected '+this.selectionClass);this.nums.push($(thatTd).attr('data-value'))}},lockStartTouch:function(context,xpos,ypos){var element=null,_that=this;$('td.lockTd',context).each(function(){if(_that.isMouseOverLockHoles($(this),xpos,ypos)){element=$(this);_that.started=true;_that.nums=[];_that.arrCoordinates=[];_that.clearCanvas();$(element).addClass('selected '+_that.selectionClass);_that.nums.push($(element).attr('data-value'));_that.arrCoordinates.push(_that.getCenter(element))}else;})},lockMoveTouch:function(context,xpos,ypos){var element=null,_that=this;$('td.lockTd',context).each(function(){if(_that.isMouseOverLockHoles($(this),xpos,ypos)){element=$(this);var num=$(element).attr('data-value'),lastNum=_that.nums[_that.nums.length-1];if(true===_that.started&&lastNum!==num&&(_that.options.allowRepeatSelection||-1===_that.nums.indexOf(num))){_that.arrCoordinates.push(_that.getCenter(element));_that.drawLine();$(element).addClass('selected '+_that.selectionClass);_that.nums.push($(element).attr('data-value'))}}else;})},isInsideCircle:function(x,y,r,left,top){return Math.sqrt(Math.pow(left-x,2)+Math.pow(top-y,2))<=r},getCenter:function(ele){if(false!==isCanvas&&false!==this.options.showPatternLine){var offset=$(ele).position(),width=$(ele).outerWidth(),height=$(ele).outerHeight();return{x:offset.left+width/2,y:offset.top+height/2}}},clearCanvas:function(){if(false!==isCanvas&&false!==this.options.showPatternLine){this.canvasContext.clearRect(0,0,this.canvas.width,this.canvas.height);var w=this.canvas.width;this.canvas.width=1;this.canvas.width=w}},drawLine:function(){if(!(false===isCanvas||false===this.options.showPatternLine||this.arrCoordinates.length<2)){var c=this.arrCoordinates;i=c.length-1;this.canvasContext.lineWidth=this.options.lineWidth;this.canvasContext.beginPath();this.canvasContext.moveTo(c[i-1].x,c[i-1].y);this.canvasContext.lineTo(c[i].x,c[i].y);this.canvasContext.strokeStyle=this.options.patternLineColor;this.canvasContext.stroke();this.canvasContext.closePath()}},pattenDrawEnd:function(){if(true===this.started){this.started=false;this.patternClearTimeout&&clearTimeout(this.patternClearTimeout);var _that=this;this.patternClearTimeout=setTimeout(function(){_that.clearSelection()},_that.options.timeout);var patternValue=this.nums.join(this.options.valueSeparator);false===$.isEmptyObject(this.options.fieldName)&&$('input[type=hidden][name='+this.options.fieldName+']').val(patternValue);this.options.drawEnd&&$.isFunction(this.options.drawEnd)&&this.options.drawEnd.call(null,patternValue)}},clearSelection:function(){$('.tbl td',this.element).removeClass('selected '+this.selectionClass);this.clearCanvas()},isMouseOverLockHoles:function(element,left,top){var offset=element.offset();if(true===this.options.isCircle){var radius=element.width()/2;return this.isInsideCircle(offset.left+radius,offset.top+radius,radius,left,top)}return top>=offset.top&&left>=offset.left&&left<=offset.left+element[0].offsetWidth&&top<=offset.top+element[0].offsetHeight}};$.fn[pluginName]=function(options){if(void 0===options||'object'==typeof options)return this.each(function(){$.data(this,'plugin_'+pluginName)||$.data(this,'plugin_'+pluginName,new Plugin(this,options))});if('string'==typeof options&&'_'!==options[0]&&'init'!==options){this.each(function(){if('destroy'===options){$.data(this,'plugin_'+pluginName,null);$(this).empty()}});return this}};})(jQuery, window, document);

	let template = `<div class="Ui PatternLock" style="display:none;">`

	let Widget = $.widget('Ui.PatternLock', {
		options: {
			data: '',
			confirm: false,
			rows: 4,
			columns: 4,
			width: (innerWidth < innerHeight ? innerWidth : innerHeight) - 2 * 20,
			height: (innerWidth < innerHeight ? innerWidth : innerHeight) - 2 * 20,
			showPatternLine: true,
			patternLineColor: '#000000',
			lineWidth: 10,
			selectionColor: '#ff0000',
			fieldName: '',
			valueSeparator: ',',
			valueArray: [],
			centerCircle: true,
			centerCircleSize: 20,
			timeout: 100,
			allowRepeatSelection: true,

			entered: () => {},
			hidden: () => {},
			shown: () => {}
		},
		_cb: () => {},
		_confirm: false,
		_resolve: () => {},
		_reject: () => {},
		_create: function () {
			this.options.drawEnd = (data) => {
				if (this._confirm === false) {
					this.Hide()
					this.options.data = data
					this._trigger('entered', this.options.data, false)
					this._cb(data)
					this._resolve(data)
					this._cb = () => {}
				} else if (this._confirm === true) {
					this._confirm = data
				} else {
					if (data == this._confirm) {
						this._confirm = false
						this.Hide()
						this.options.data = data
						this._trigger('entered', this.options.data, true)
						this._cb(data)
						this._resolve(data)
						this._cb = () => {}
					} else {
						this._confirm = true
						this.element.children('.patternlock').effect('bounce', {distance: 25, times: 2}, 50)
					}
				}
			}
			this.element.patternLock(this.options)
		},
		Hide: function (...args) {
			let cb = args.slice(-1)[0] instanceof Function ? args.pop() : () => {}
			let effect = args.length > 0 ? args.shift() : 'fade'
			this._hide(this.element, effect, () => {
				cb()
				this._trigger('hidden')
			})
		},
		Show: function (...args) {
			this._cb = args.slice(-1)[0] instanceof Function ? args.pop() : () => {}
			this._confirm = (args.length > 0 && typeof args[0] === 'boolean' ? args.shift() : false) || this.options.confirm
			let effect = args.length > 0 ? args.shift() : 'fade'

			return new Promise((resolve, reject) => {
				this._resolve = resolve
				this._reject = reject
				this._show(this.element, effect, () => {
					this._trigger('shown')
				})
			})
		}
	})

	function PatternLock (options = {}) {
		let $e = $(template)
		let i = new Widget(options, $e)
		$('body').append($e)
		Object.defineProperty(this, 'data', {get: () => {return i.options.data}, enumerable: true})
		Object.defineProperty(this, 'options', {get: () => {return i.options}, enumerable: true})
		this.Hide = (...args) => {
			return i.Hide(...args)
		}
		this.Show = (...args) => {
			return i.Show(...args)
		}
		return this
	}

	$.extend({PatternLock: PatternLock})

	return PatternLock

})
