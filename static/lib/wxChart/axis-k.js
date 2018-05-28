/**
 * Created by ChenChao on 2017/1/3.
 */
import wx from '../canvas.js'
export default function () {
    return {
        col: 5,
        row: 3,
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
        yMax: 0,
        yMin: 0,
        metaUnit: false,
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
            this.metaUnit = options.metaUnit;
            this.initConfig(options.axis);
            this.drawX(ctx, w, h, options.xAxis);
            this.showY && this.drawY(ctx, w, h, options.yAxis);
            return this;
        },
        initConfig: function (options) {
            this.col = options.col;
            this.row = options.row;
            this.showEdg = options.showEdg;
            this.showX = options.showX;
            this.showY = options.showY;
            this.yMax = options.yMax;
            this.yMin = options.yMin;
            this.paddingTop = options.paddingTop;
            this.paddingBottom = options.paddingBottom;
            this.paddingLeft = options.paddingLeft;
            this.paddingRight = options.paddingRight;
            this.color = options.color;
        },
        drawX: function (ctx, w, h, xOpt) {
            var col = this.col;
            var xLen = xOpt.data.length;
            var type = xOpt.type;
            var times;
            var startX = this.paddingLeft;
            var endX = w - this.paddingRight;
            var startY = this.paddingTop;
            var endY = h - this.paddingBottom;
            ctx.setFontSize(this.fontSize);
            if(this.showX){
                //todo
                this.onePixelLineTo(ctx, startX, startY, startX, endY, false);
                var step = (w - this.paddingLeft - this.paddingRight) / col;
                for (var i = 1; i < col; i++) {
                    var x = startX + step * i;
                    this.onePixelLineTo(ctx, x, startY, x, endY, false);
                }
                this.onePixelLineTo(ctx, endX, startY, endX, endY, false);
            }
            if(xOpt.times){
                times = xOpt.times;
                ctx.setFillStyle(this.txtColor);
                ctx.fillText(times[0], startX + 4, endY + this.paddingBottom - 2);
                ctx.fillText(times[1], endX - (times[1].length > 8 ? 90 : 56), endY + this.paddingBottom - 2);
            }
        },
        drawY: function (ctx, w, h, yOpt, xais) {
            var row = this.row;
            var startX = this.paddingLeft;
            var endX = w - this.paddingRight;
            var startY = this.paddingTop;
            var endY = h - this.paddingBottom;
            var step = (h - this.paddingTop - this.paddingBottom) / row;
            var showLabel = yOpt[0].showLabel;
            var max = this.yMax;
            var min = this.yMin;

            var labelStep = (max - min) / row;
            var middleIndex = row / 2;
            drawYLine.call(this);
            this.drawYUnit = drawYUnit;
            
            function drawYLine() {
                this.showEdg && this.onePixelLineTo(ctx, startX, startY + 1, endX, startY + 1, true);
                for(var i = 1; i < row; i++){
                    var y = startY + step * i;
                    this.onePixelLineTo(ctx, startX, y, endX, y, true);
                }
                this.showEdg && this.onePixelLineTo(ctx, startX, endY - 1, endX, endY - 1, true);
            }
            
            function drawYUnit() {
                ctx.setFillStyle(this.txtColor);
                showLabel && ctx.fillText(max.toFixed(2), startX + 3, startY + 12);
                for(var i = 1; i < row; i++){
                    var y = startY + step * i;
                    if(showLabel){
                        var label = (max - labelStep * i).toFixed(2);
                        if(i < middleIndex){
                            ctx.fillText(label, startX + 3, y + 10);
                        }
                        if(i === middleIndex){
                            ctx.fillText(label, startX + 3, y + 4);
                        }
                        if(i > middleIndex){
                            ctx.fillText(label, startX + 3, y - 4);
                        }
                    }
                }
                showLabel && ctx.fillText((max - labelStep * i).toFixed(2), startX + 3, startY + step * i - 4);
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