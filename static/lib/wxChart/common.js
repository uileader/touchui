/**
 * Created by ChenChao on 2017/1/4.
 */
import wx from '../canvas.js'

export default {
    bezierLine: function (option) {
        if(option.hide){
            return;
        }
        var that = this;
        var ctx = this.ctx;
        var canvasHeight = this.canvasHeight;
        var canvasWidth = this.canvasWidth;
        var scaleX = option.scaleX || 1;
        var scaleY = option.scaleY || 1;
        var offsetX = canvasWidth * (1 - scaleX) - this.paddingRight;
        var offsetY = canvasHeight * (1 - scaleY) - this.paddingBottom;
        var step = canvasWidth / (option.xAxis.data.length - 1);
        var areaW = canvasWidth - this.paddingLeft - this.paddingRight;
        var areaH = canvasHeight - this.paddingTop - this.paddingBottom;
        var maxData = Math.max.apply(null, option.data);
        var minData = Math.min.apply(null, option.data);
        var areaUnit = areaH / (maxData - minData);
        var data = [];
        option.xAxis.data.map(function (item, index) {
            data.push([index * step, Math.abs(option.data[index] - maxData) * areaUnit + that.paddingTop + that.paddingBottom]);
        });
        data.unshift(data[0]);
        data.push(data[data.length - 1]);

        //ctx.scale(scaleX, scaleY);
        //ctx.translate(offsetX, offsetY);
        ctx.beginPath();
        data.map(function (item, index) {
            var a = 0.25;
            var b = 0.25;
            if (index == 0 || index == data.length - 1) {
                //
            } else if (index == 1) {
                ctx.moveTo(item[0], item[1]);
            } else {
                var a1 = data[index - 1][0] + a * (data[index][0] - data[index - 2][0]);
                var a2 = data[index - 1][1] + b * (data[index][1] - data[index - 2][1]);
                var b1 = data[index][0] - b * (data[index + 1][0] - data[index - 1][0]);
                var b2 = data[index][1] - b * (data[index + 1][1] - data[index - 1][1]);
                ctx.bezierCurveTo(a1, a2, b1, b2, item[0], item[1]);
            }
        });

        ctx.setLineWidth(1);
        ctx.setStrokeStyle(option.lineColor);
        ctx.stroke();
        //ctx.translate(-offsetX, -offsetY);
        //ctx.scale(1 / scaleX, 1 / scaleY);
    },
    candleBak: function (ctx, cx, cy, option) {
        var color = option.down ? '#1EBB54' : '#E22723';
        var w = option.width;
        var h = option.height;
        //画影线
        ctx.setFillStyle(color);
        ctx.fillRect(cx + w/2 - 1, cy - h/2, 2, 2*h);
        //画实体
        if(option.down){
            ctx.setFillStyle(color);
            ctx.fillRect(cx, cy, w, h);
        }else{
            ctx.setLineWidth(2);
            ctx.setStrokeStyle(color);
            ctx.strokeRect(cx, cy, w, h);
            ctx.setFillStyle('white');
            ctx.fillRect(cx, cy, w, h);
        }
    },
    candle: function (ctx, cx, w, h, l, s, c, isUp, max, min, areaH) {
        var color = isUp ? '#ff2f2f': '#4cda64';
        var ds = 1;

        //真实坐标计算
        h = areaH - (areaH * Math.abs(h - min) / (max - min));
        l = areaH - (areaH * Math.abs(l - min) / (max - min));
        s = areaH - (areaH * Math.abs(s - min) / (max - min));
        c = areaH - (areaH * Math.abs(c - min) / (max - min));

        //画影线
        var lineH = Math.abs(h - l);
        ctx.setFillStyle(color);
        ctx.fillRect(cx + w/2 + ds - 1 + (isUp ? 0.5 : 0), lineH == 0 ? h + 1 : h, 1, lineH || 1);

        //画实体
        var barH = Math.abs(c - s);
        if(isUp){
            if(barH == 0){
                ctx.setFillStyle(color);
                ctx.fillRect(cx + ds, c + 1, w - ds, 1);
            }else{
                ctx.setLineWidth(1);
                ctx.setStrokeStyle(color);
                ctx.strokeRect(cx + ds + 1, c + 1, w - ds - 1, barH - 1);
                ctx.setFillStyle('#1c1f27');
                ctx.fillRect(cx + ds + 1, c + 1, w - ds - 1, barH - 1);
            }
        }else{
            ctx.setFillStyle(color);
            ctx.fillRect(cx + ds, barH == 0 ? s + 1 : s, w - ds, barH || 1);
        }
    },
    disRepArr: function (array) {
        var hash = {},
            len = array.length,
            result = [];
    
        for (var i = 0; i < len; i++){
            if (!hash[array[i]]){
                hash[array[i]] = true;
                result.push(array[i]);
            }
        }
        return result;
    },
    metaUnit: function (value) {
        if(value > 99999999){
            return (value / 100000000).toFixed(2) + '亿';
        }
        if(value > 9999){
            return (value / 10000).toFixed(2) + '万';
        }
        return value.toFixed(2);
    }
};