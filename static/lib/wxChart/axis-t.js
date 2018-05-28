/**
 * Created by ChenChao on 2017/1/3.
 */
import wx from '../canvas.js'

export default function () {
    return {
        name: '',
        col: 5,
        row: 5,
        showEdg: true,
        showX: true,
        showY: true,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        color: '#2f2f2f',
        txtColor: 'white',
        lineWidth: 1,
        fontSize: 24,
        init: function (ctx, options) {
            var that = this;
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
            this.name = options.name;
            this.initConfig(options.axis);
            this.drawX(ctx, w, h, options);
            this.showY && this.drawY(ctx, w, h, options.yAxis);
            return this;
        },
        initConfig: function (options) {
            this.col = this.name == 'time-sharing-5day' ? 5 : options.col;
            this.row = options.row;
            this.showEdg = options.showEdg || true;
            this.showX = options.showX || true;
            this.showY = options.showY || true;
            this.paddingTop = options.paddingTop || 0;
            this.paddingBottom = options.paddingBottom || 0;
            this.paddingLeft = options.paddingLeft || 0;
            this.paddingRight = options.paddingRight || 0;
            this.color = options.color;
        },
        drawX: function (ctx, w, h, options) {
            var xOpt = options.xAxis;
            var col = this.col;
            var type = xOpt.type;
            var times;
            var pb = this.paddingBottom;
            var startX = this.paddingLeft;
            var endX = w - this.paddingRight;
            var startY = this.paddingTop;
            var endY = h - pb;
            var timeStep = Math.abs(endX - startX)/5;
            ctx.setFontSize(this.fontSize);
            if(this.showX) {
                this.onePixelLineTo(ctx, startX, startY, startX, endY, false);
                var step = (w - this.paddingLeft - this.paddingRight) / col;
                for (var i = 1; i < col; i++) {
                    var x = startX + step * i;
                    this.onePixelLineTo(ctx, x, startY, x, endY, false);
                }
                this.onePixelLineTo(ctx, endX, startY, endX, endY, false);
            }
            ctx.setFillStyle(this.txtColor);
            if(xOpt.times) {
                if (this.name == 'time-sharing-5day') {
                    times = options.axis.day5;
                    times.forEach(function (day, index) {
                        ctx.fillText(day.split('-').splice(1,2).join('/'),( timeStep/2 - 12 + timeStep * index) * 2, endY + pb - 2);
                    });
                } else {
                    times = xOpt.times;
                    ctx.fillText(times[0],( startX + 2) * 2, endY + pb - 2);
                    ctx.fillText(times[1],( endX - 32) * 2, endY + pb - 2);
                }
            }
            if(type === 'category'){

            }
        },
        drawY: function (ctx, w, h, yOpt) {
            var row = this.row;
            var startX = this.paddingLeft;
            var endX = w - this.paddingRight;
            var startY = this.paddingTop;
            var endY = h - this.paddingBottom;
            var s0 = yOpt[0];
            var base = s0.base || '';
            var maxAbs = s0.maxAbs;
            var max = base + maxAbs;

            var ss = 2 * maxAbs / row;
            var middleIndex = row / 2;
            var pt = this.paddingTop;
            var pb = this.paddingBottom;
            this.drawYUnit = drawYUnit;
            drawYLine.call(this);
            function drawYLine() {
                this.onePixelLineTo(ctx, startX, startY, endX, startY, true);
                var step = (h - pt - pb) / row;
                for(var i = 1; i < row; i++){
                    var y = startY + step * i;
                    this.onePixelLineTo(ctx, startX, y, endX, y, true);
                }
                this.onePixelLineTo(ctx, startX, endY, endX, endY, true);
            }
            function drawYUnit() {
                var rightTxtX = endX - 40;
                if(base){
                    ctx.setFillStyle('#ff2f2f');
                    ctx.fillText(max.toFixed(2),( startX + 3) * 2, startY + 10);
                    ctx.fillText((Math.abs(max - base) * 100 / base).toFixed(2) + '%',( rightTxtX) * 2, startY + 10);
                }
                var step = (h - pb - pb) / row;
                for(var i = 1; i < row; i++){
                    var y = startY + step * i;
                    if(base){
                        var txt = (max - ss * i).toFixed(2);
                        if(i < middleIndex){
                            ctx.setFillStyle('#ff2f2f');
                            ctx.fillText(txt,( startX + 3) * 2, y + 10);
                            ctx.fillText((Math.abs(max - ss * i - base) * 100 / base).toFixed(2) + '%',( rightTxtX) * 2, y + 10);
                        }
                        if(i === middleIndex){
                            ctx.setFillStyle('white');
                            ctx.fillText(base.toFixed(2),( startX + 3) * 2, y + 4);
                            ctx.fillText('0.00%',( rightTxtX) * 2, y + 4);
                        }
                        if(i > middleIndex){
                            ctx.setFillStyle('#4cd264');
                            ctx.fillText(txt,( startX + 3) * 2, y - 4);
                            ctx.fillText((Math.abs(base - max + ss * i) * 100 / base).toFixed(2) + '%',( rightTxtX) * 2, y - 4);
                        }
                    }
                }
                if(base){
                    ctx.setFillStyle('#4cd264');
                    ctx.fillText((max - ss * i).toFixed(2),( startX + 3) * 2, startY + step * i - 4);
                    ctx.fillText((Math.abs(base - max + ss * i) * 100 / base).toFixed(2) + '%',( rightTxtX) * 2, startY + step * i - 4);
                }
            }
        },
        onePixelLineTo: function (ctx, fromX, fromY, toX, toY, vertical) {
            var backgroundColor = '#1e1e26';
            var currentStrokeStyle = '#2f2f2f';
            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(toX, toY);
            ctx.closePath();
            ctx.setLineWidth(2);
            ctx.setStrokeStyle(backgroundColor);
            ctx.stroke();
            ctx.beginPath();
            if(vertical) {
                ctx.moveTo(fromX, fromY);
                ctx.lineTo(toX + 1, toY);
            } else {
                ctx.moveTo(fromX, fromY + 1);
                ctx.lineTo(toX, toY + 1);
            }
            ctx.closePath();
            ctx.setLineWidth(1);
            ctx.setStrokeStyle(currentStrokeStyle);
            ctx.stroke();
        }
    };
};