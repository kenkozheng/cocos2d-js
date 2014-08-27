/**
 * main.js发布后固定不变，负责处理资源更新工作的基础
 */
cc.game.onStart = function(){
    cc.view.setDesignResolutionSize(1024, 768, cc.ResolutionPolicy.SHOW_ALL);
	cc.view.resizeWithBrowserSize(true);
	
	var failCount = 0;
    var maxFailCount = 1;   //最大错误重试次数

    /**
     * 自动更新js和资源
     */
	var AssetsManagerLoaderScene = cc.Scene.extend({
		_am:null,
		_progress:null,
		_percent:0,
		run:function(){
			if (!cc.sys.isNative) {
                //html5必须先预加载，否则plist之类的就无效了
                var that = this;
                cc.loader.loadJs(["src/resource.js"], function(){
                    cc.loader.load(resources, that.loadGame);
                });
				return;
			}
            else {
                //这里特殊跳过所有更新逻辑
                this.loadGame();
                return;
            }

			var layer = new cc.Layer();
			this.addChild(layer);
			this._progress = new cc.LabelTTF.create("update 0%", "Arial", 12);
			this._progress.x = cc.winSize.width / 2;
			this._progress.y = cc.winSize.height / 2 + 50;
			layer.addChild(this._progress);

			var storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "./");

			this._am = new jsb.AssetsManager("res/project.manifest", storagePath);
			this._am.retain();

			if (!this._am.getLocalManifest().isLoaded())
			{
				cc.log("Fail to update assets, step skipped.");
				this.loadGame();
			}
			else
			{
				var that = this;
				var listener = new cc.EventListenerAssetsManager(this._am, function(event) {
					switch (event.getEventCode()){
						case cc.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
							cc.log("No local manifest file found, skip assets update.");
							that.loadGame();
							break;
						case cc.EventAssetsManager.UPDATE_PROGRESSION:
							that._percent = event.getPercent();
							cc.log(that._percent + "%");
							var msg = event.getMessage();
							if (msg) {
								cc.log(msg);
							}
							break;
						case cc.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
						case cc.EventAssetsManager.ERROR_PARSE_MANIFEST:
							cc.log("Fail to download manifest file, update skipped.");
							that.loadGame();
							break;
						case cc.EventAssetsManager.ALREADY_UP_TO_DATE:
                            cc.log("ALREADY_UP_TO_DATE.");
                            that.loadGame();
                            break;
						case cc.EventAssetsManager.UPDATE_FINISHED:
							cc.log("Update finished.");
							that.loadGame();
							break;
						case cc.EventAssetsManager.UPDATE_FAILED:
							cc.log("Update failed. " + event.getMessage());
                            failCount++;
							if (failCount < maxFailCount)
							{
								that._am.downloadFailedAssets();
							}
							else
							{
								cc.log("Reach maximum fail count, exit update process");
                                failCount = 0;
								that.loadGame();
							}
							break;
						case cc.EventAssetsManager.ERROR_UPDATING:
							cc.log("Asset update error: " + event.getAssetId() + ", " + event.getMessage());
							that.loadGame();
							break;
						case cc.EventAssetsManager.ERROR_DECOMPRESS:
							cc.log("ERROR_DECOMPRESS. " + event.getMessage());
							that.loadGame();
							break;
						default:
							break;
					}
				});

				cc.eventManager.addListener(listener, 1);
				this._am.update();
				cc.director.runScene(this);
			}

            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyReleased: function(keyCode, event) {
                    if (keyCode == cc.KEY.back) {
                        cc.director.end();
                    }
                }}, this);

			this.schedule(this.updateProgress, 0.5);
		},

		loadGame:function(){
            //jsList是jsList.js的变量，记录全部js。
			cc.loader.loadJs(["src/jsList.js"], function(){
				cc.loader.loadJs(jsList, function(){
					Game.start();
				});
			});
		},

		updateProgress:function(dt){
			this._progress.string = "update " + this._percent + "%";
		},

		onExit:function(){
			cc.log("AssetsManager::onExit");

			this._am.release();
			this._super();
		}
	});

	var scene = new AssetsManagerLoaderScene();
	scene.run();
};
cc.game.run();