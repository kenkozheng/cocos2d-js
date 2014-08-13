cc.game.onStart = function(){
    cc.view.setDesignResolutionSize(800, 450, cc.ResolutionPolicy.SHOW_ALL);
	cc.view.resizeWithBrowserSize(true);
    cc.director.runScene(new MainScene());
	
	cc.log("js get from c++: " + osInfo());
	test_cpp_callback();
};
cc.game.run();

function cpp_callback(a, b) {
    cc.log("cpp return two integer: " + a + " " + b);
}