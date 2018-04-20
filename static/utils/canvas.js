CanvasRenderingContext2D.prototype.setFillStyle = function (color) {
	this.fillStyle = color
}

CanvasRenderingContext2D.prototype.setStrokeStyle = function (color) {
	this.strokeStyle = color
}

CanvasRenderingContext2D.prototype.setShadow = function (offsetX, offsetY, blur, color) {
	this.shadowOffsetX = offsetX
	this.shadowOffsetY = offsetY
	this.shadowBlur = blur
	this.shadowColor = color
}

CanvasRenderingContext2D.prototype.setLineWidth = function (lineWidth) {
	this.lineWidth = lineWidth
}

CanvasRenderingContext2D.prototype.setLineCap = function (lineCap) {
	this.lineCap = lineCap
}

CanvasRenderingContext2D.prototype.setMiterLimit = function (miterLimit) {
	this.miterLimit = miterLimit
}

CanvasRenderingContext2D.prototype.setTextAlign = function (textAlign) {
	this.textAlign = textAlign
}

// var dImage = CanvasRenderingContext2D.prototype.drawImage

CanvasRenderingContext2D.prototype.setGlobalAlpha = function (globalAlpha) {
	this.globalAlpha = globalAlpha
}

CanvasRenderingContext2D.prototype.setFontSize = function (fontSize) {
	this.font = fontSize + "px 微软雅黑"
}

CanvasRenderingContext2D.prototype.draw = function () {
	return
}


// CanvasRenderingContext2D.prototype. = function (textAlign) {
// 	this.textAlign = textAlign
// }


export default {
	createCanvasContext (id) {
		var canvas = document.getElementById(id)
		var ctx = canvas.getContext('2d')
		return ctx;
	}
}