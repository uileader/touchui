/**
 * Created by ChenChao on 2016/12/30.
 */
import wx from '../canvas.js'

import common from './common'
import axisFunction from './axis-t'
let axis = axisFunction()

export default function (canvasId) {
    return {
        name: '',
        unit: 240,
        canvasId: canvasId,
        ctx: null,
        canvasWidth: 0,
        canvasHeight: 0,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        options: null,
        dataStore: null,
        index: 0,
        base: 0,
        maxAbs: 0,
        txtColor: 'white',
        isClosed: false,
        axisObj: null,
        init: function (options) {
            this.ctx = wx.createCanvasContext(this.canvasId);
            this.initConfig(options);
            return this;
        },
        initConfig: function (options) {
            var that = this;
            var axis = options.axis;
            this.name = options.name;
            if(options.name == 'time-sharing-5day'){
                this.unit = this.unit * 5;
            }
            var w = options.width;
            var h = options.height;
            if(w === 'auto') {
                w = that.canvasWidth = window.innerWidth * 2

                // wx.getSystemInfo({
                //     success: function (result) {
                //         w = that.canvasWidth = result.windowWidth;
                //     }
                // });
            }
            if(h === 'auto'){
                h = 225;
            }
            this.canvasWidth = w;
            this.canvasHeight = h;
            options.xAxis.data.length = this.unit;
            this.paddingTop = axis.paddingTop;
            this.paddingBottom = axis.paddingBottom;
            this.paddingLeft = axis.paddingLeft;
            this.paddingRight = axis.paddingRight;
            this.dataStore = options;
        },
        metaData1: function (origin, options) {
            var dataStore = options;
            var data = origin.data;
            var xAxis = dataStore.xAxis;
            var yAxis = dataStore.yAxis;
            var base = origin.info.yc * 1;
            var h = origin.info.h * 1 || base;
            var l = origin.info.l * 1 || base;
            var maxAbs = !!h ? Math.max(Math.abs(h - base), Math.abs(l - base)) : this.maxAbs;

            //停盘
            if(origin.info.c == '-'){
                this.isClosed = true;
                yAxis[1].isAverageLine = true;
            }

            var data0 = yAxis[1].data;
            yAxis[0].base = base; //昨收
            var data1 = yAxis[0].data;
            if(data.length < 15){
                data = []
            }else if(data.length < 15 + this.unit){
                data = data.slice(15); //去掉前15条数据
            }else{
                data = data.slice(data.length - this.unit - 1); //去掉前15条数据
            }
            var day5 = [];
            data.forEach(function (item, index) {
                var d = item.split(',');
                xAxis.data[index] = d[0]; //时间
                data0[index] = d[3]; //均价
                data1[index] = d[1]; //现价
                maxAbs = Math.max(Math.abs(d[1] - base), Math.abs(d[3] - base), maxAbs);
                //yAxis[0].maxAbs = yAxis[1].maxAbs = maxAbs;
            });
            this.base = base;
            this.maxAbs = yAxis[0].maxAbs = yAxis[1].maxAbs = maxAbs;
            dataStore.axis.day5 = common.disRepArr(day5);
            this.setOptions(dataStore);
        },
        metaData2: function (origin, options) {
            var dataStore = options;
            var data = origin.data;

            //停盘
            if(origin.info.c == '-'){
                this.isClosed = true;
            }

            var xAxis = dataStore.xAxis;
            var yAxis = dataStore.yAxis;
            var data0 = yAxis[0].data;
            var dd = [];
            var color0 = yAxis[0].color;
            if(data.length < 15){
                data = []
            }else if(data.length < 15 + this.unit){
                data = data.slice(15); //去掉前15条数据
            }else{
                data = data.slice(data.length - this.unit - 1); //去掉前15条数据
            }
            var day5 = [];
            data.forEach(function (item, index) {
                var d = item.split(',');
                xAxis.data[index] = d[0]; //时间
                data0[index] = d[2]; //成交量
                dd[index] = d[1]; //现价
                color0[index] = dd[index] - dd[index - 1] < 0 ? '#4cda64' : '#ff2f2f';
                day5.push(d[0].split(' ')[0]);
            });
            dataStore.axis.day5 = common.disRepArr(day5);
            this.setOptions(dataStore);
        },
        setOptions: function (options) {
            this.options = options;
        },
        axis: function (ctx, options) {
            this.axisObj = axis.init(ctx, options);
        },
        line: function (option) {
            if(this.isClosed && !option.isAverageLine){
                return;
            }
            var that = this;
            var ctx = this.ctx;
            var canvasHeight = this.canvasHeight;
            var canvasWidth = this.canvasWidth;
            var step = (canvasWidth - this.paddingLeft - this.paddingRight) / this.unit;
            var areaH = canvasHeight - this.paddingTop - this.paddingBottom;
            var max = this.base + this.maxAbs;
            var min = this.base - this.maxAbs;
            var data = [];
            option.xAxis.data.map(function (item, index) {
                var d = option.data[index];
                var value = areaH - areaH * (d - min) / (max - min);
                data.push([index * step - that.paddingLeft, value - that.paddingBottom]);
            });

            if(option.isAverageLine){
                ctx.translate(0, canvasHeight/2);
            }

            //填充
            ctx.beginPath();
            ctx.moveTo(this.paddingLeft, this.canvasHeight - this.paddingBottom);
            var lastX = 0;
            data.map(function (item, index) {
                ctx.lineTo(item[0], item[1]);
                lastX = item[0];
            });
            ctx.lineTo(lastX, this.canvasHeight - this.paddingBottom);
            ctx.closePath();
            if(typeof option.background === 'function'){
                var colorStop = option.background();
                var grd = ctx.createLinearGradient(0, 0, 0, canvasHeight);
                grd.addColorStop(0, colorStop[0]);
                grd.addColorStop(1, colorStop[1]);
                ctx.setFillStyle(grd);
                ctx.fill();
            }
            if(typeof option.background === 'string'){
                ctx.setFillStyle(option.background);
                ctx.fill();
            }
            ctx.setLineWidth(1);
            ctx.setLineCap('square');
            ctx.setStrokeStyle('rgba(0,0,0,0)');
            ctx.stroke();

            //均线
            ctx.beginPath();
            data.map(function (item, index) {
                ctx[index === 0 ? 'moveTo' : 'lineTo'](item[0], item[1]);
            });
            ctx.setLineWidth(1);
            ctx.setLineCap('square');
            ctx.setStrokeStyle(option.lineColor);
            ctx.stroke();

            if(option.isAverageLine){
                ctx.translate(0, -canvasHeight/2);
            }
        },
        bezierLine: function (option) {
            if(this.isClosed){
                return;
            }
            common.bezierLine.call(this, option);
        },
        bar: function (option) {
            if(this.isClosed){
                return;
            }
            var startTime = +new Date();
            var data = option.data;
            var ctx = this.ctx;
            var canvasHeight = this.canvasHeight;
            var canvasWidth = this.canvasWidth;
            var pb = this.paddingBottom;
            var barW = (canvasWidth - this.paddingLeft - this.paddingRight) / this.unit;
            var max = data.length === 0 ? 0 : Math.max.apply(null, data) * 1;
            var step = max == 0 ? 0 : (canvasHeight - this.paddingTop - pb) / max;
            data.map(function (item, index) {
                var barH = item * step;
                ctx.beginPath();
                ctx.setLineWidth(barW);
                ctx.moveTo(index * barW + 1, canvasHeight - pb);
                ctx.lineTo(index * barW + 1, canvasHeight - pb - barH);
                ctx.setStrokeStyle(option.color[index]);
                ctx.stroke()
            });
            if(option.complete){
                option.complete(+new Date() - startTime);
            }
            if(option.showMax){
                ctx.setFillStyle(this.txtColor);
                ctx.fillText(common.metaUnit(max), this.paddingLeft + 2, this.paddingTop + 12);
            }
        },
        draw: function () {
            var that = this;
            var ctx = this.ctx;
            ctx.clearRect(0,0,1000,1000);
            var options = this.options;
            if(!options){
                console.log('Warn: No setting options!');
                return;
            }
            var xAxis = options.xAxis;
            var startTime = +new Date();
            this.axis(ctx, options);
            options.yAxis.map(function (option, index) {
                option.xAxis = xAxis;
                that[option.type](option);
                console.log(option.type)
            });
            this.axisObj.drawYUnit();
            ctx.draw();
            options.callback && options.callback(+new Date() - startTime);
        }
    }
};