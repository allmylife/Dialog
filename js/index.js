;(function($) {
	var Dialog = function(config) {
		var _this_ = this;
		// 默认配置参数
		this.config = {
			// 宽度传的话 ，字比较多的时候，会自动换行
			width:"auto",
			height:"auto",
			message:null,
			type:"loading",
			buttons:null,
			delay:null,
			delayCallback:null,
			maskOpacity:null,
			maskClose:null,
			// 是否启用动画
			effect:null
		};

		// 默认参数扩展
		if (config && $.isPlainObject(config)) {
			$.extend(this.config, config);
		} else {
			this.isConfig = true;
		}

		this.body = $("body");
		// 创建基本的DOM结构
		this.mask = $('<div class="g_dialog_container">');
		this.win = $('<div class="dialog_window">');
		this.winHeader = $('<div class="dialog_header"></div>');
		this.winContent = $('<div class="dialog_content">');
		this.winFooter = $('<div class="dialog_footer">');

		// 渲染DOM
		this.create();
	};

	Dialog.zIndex = 99999;

	Dialog.prototype = {
		// 动画函数
		animate:function() {
			var _this_ = this;
			this.win.css('-webkit-transition','scale(0, 0)');
			window.setTimeout(function() {
				_this_.win.css('-webkit-transition','scale(1, 1)');
			},100);
		},
		create: function() {
			var _this_ = this,
				config = this.config,
				mask = this.mask,
				win = this.win,
				header = this.winHeader,
				content = this.winContent,
				footer = this.winFooter,
				body = this.body;

				Dialog.zIndex++;
				this.mask.css('zIndex', Dialog.zIndex);
			// 如果没有传递任何参数
			// 就弹出一个等待的弹出框
			if (this.isConfig) {
				win.append(header.addClass('loading'));

				if (config.effect) {
					this.animate();
				}

				mask.append(win);
				body.append(mask);
			} else {
				// 根据配置参数来创建相应的弹框
				header.addClass(config.type);
				win.append(header);
				// 如果传来信息文本
				if (config.message) {
					content.html(config.message);
					win.append(content);
				}
				// 按钮组
				if (config.buttons) {
					// 按钮还没加进去
					this.createButtons(footer, config.buttons);
					win.append(footer);
				}

				// 插入到页面
				mask.append(win);
				body.append(mask);

				// 设置对话框的宽高
				if (config.width != "auto") {
					win.width(config.width);
				}

				if(config.height != "auto") {
					win.height(config.height);
				}
				// 对话框的透明度
				if (config.maskOpacity) {
					mask.css("backgroundColor","rgba(0,0,0,"+config.maskOpacity+")");
				}
				// 设置弹出框弹出后多久关闭
				if (config.delay && config.delay != 0) {
					window.setTimeout(function() {
						_this_.close();

						config.delayCallback && config.delayCallback();
					},config.delay);
				}
				// 判断动画参数
				if (config.effect) {
					this.animate();
				}
				// 关闭后执行的回调函数
				if (config.delayCallback) {
					window.setTimeout(function() {

					},config.delay);
				}

				// 指定遮罩层是否关闭
				if (config.maskClose) {
					mask.on('click', function() {
						_this_.close();
					});
				}
			}
		},
		createButtons: function(footer, btn) {
			var _this_ = this;
			$(btn).each(function() {
				// {
				// 	type:"red",
				// 	text:"不好",
				// 	callback: function() {
				// 		alert('按钮1');
				// 	}
				// }

				// 获取按钮样式及文本
				var type = this.type ? 'class='+this.type:"";
				var btnText = this.text ? this.text:"按钮"+index;
				var callback = this.callback ? this.callback:null;
				var button = $('<button '+type+'>'+btnText+'</button>');

				if (callback) {
					button.on('click', function(e) {
						// 此处需要阻止事件冒泡
						e.stopPropagation();
						var isClose = callback();
						if (isClose != false) {
							_this_.close();
						}
					})
				} else {
					button.on('click', function(e) {
						e.stopPropagation();
						_this_.close();
					})
				}
				footer.append(button);
			});
		},
		close: function() {
			this.mask.remove();
		}
	};
	window.Dialog = Dialog;

	$.dialog = function(config) {
		return new Dialog(config);
	};
})(Zepto);