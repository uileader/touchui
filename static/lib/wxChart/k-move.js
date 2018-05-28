/**
 * Created by ChenChao on 2017/1/11.
 */
import wx from '../canvas.js'

export default function (canvasId) {
    return {
        canvasId: canvasId,
        ctx: null,
        unit: 60,
        canvasWidth: 0,
        canvasHeight: 0,
        lineWidth: 1,
        color: 'white',
        showVLine: true,
        showHLine: true,
        lastX: 0,
        lastY: 0,
        init: function (options) {
            this.ctx = wx.createCanvasContext(this.canvasId);
            this.initConfig(options);
            return this;
        },
        initConfig: function (options) {
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
            this.canvasWidth = w;
            this.canvasHeight = h;
            this.unit = options.unit || this.unit;
            this.color = options.color;
            this.lineWidth = options.lineWidth;
        },
        clear: function () {
            var ctx = this.ctx;
            ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            ctx.draw();
        },
        vLine: function (option) {
            //console.log('v line:', option);
            var ctx = this.ctx;
            var x = option.x;
            var step = this.canvasWidth / this.unit;
            x = Math.round(x / step);
            x = x * step - step/2;
            //if(x != this.lastX){
                //this.clear();
                ctx.beginPath();
                ctx.setLineWidth(this.lineWidth);
                ctx.moveTo(x + 0.5, 0);
                ctx.lineTo(x + 0.5, this.canvasHeight);
                ctx.setStrokeStyle('white');
                ctx.stroke();
                this.lastX = x;
            //}
        },
        hLine: function (option) {
            //console.log('h line:', option);
        },
        draw: function (opt) {
            this.clear();
            if(this.showVLine){
                this.vLine(opt);
            }
            if(this.showHLine){
                this.hLine(opt);
            }
            this.ctx.draw();
        }
    };
};