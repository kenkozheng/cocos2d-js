var trace = function() {
    cc.log(Array.prototype.join.call(arguments, ", "));
};

var Filter = {

    DEFAULT_VERTEX_SHADER:
        "attribute vec4 a_position; \n"
        + "attribute vec2 a_texCoord; \n"
        + "varying mediump vec2 v_texCoord; \n"
        + "void main() \n"
        + "{ \n"
        + "    gl_Position = (CC_PMatrix * CC_MVMatrix) * a_position;  \n"
        + "    v_texCoord = a_texCoord; \n"
        + "}",

    GRAY_SCALE_FRAGMENT_SHADER:
        "varying vec2 v_texCoord;   \n"
        //+ "uniform sampler2D CC_Texture0; \n"   //cocos2d 3.0jsb 3.1jsb/html5开始自动加入这个属性，不需要手工声明
        + "void main() \n"
        + "{  \n"
        + "    vec4 texColor = texture2D(CC_Texture0, v_texCoord);  \n"
        + "    float gray = texColor.r * 0.299 + texColor.g * 0.587 + texColor.b * 0.114; \n"
        + "    gl_FragColor = vec4(gray,gray,gray,1);  \n"
        + "}",

    SEPIA_FRAGMENT_SHADER:
        "varying vec2 v_texCoord;   \n"
        //+ "uniform sampler2D CC_Texture0; \n"
        + "uniform float u_degree; \n"
        + "void main() \n"
        + "{  \n"
        + "    vec4 texColor = texture2D(CC_Texture0, v_texCoord);  \n"
        + "    float r = texColor.r * 0.393 + texColor.g * 0.769 + texColor.b * 0.189; \n"
        + "    float g = texColor.r * 0.349 + texColor.g * 0.686 + texColor.b * 0.168; \n"
        + "    float b = texColor.r * 0.272 + texColor.g * 0.534 + texColor.b * 0.131; \n"
        + "    gl_FragColor = mix(texColor, vec4(r, g, b, texColor.a), float(u_degree));  \n"
        + "}",


    programs:{},

    /**
     * 灰度
     * @param sprite
     */
    grayScale: function (sprite) {
        var program = Filter.programs["grayScale"];
        if(!program){
            program = new cc.GLProgram();
               program.retain();          //jsb需要retain一下，否则会被回收了
            program.initWithString(Filter.DEFAULT_VERTEX_SHADER, Filter.GRAY_SCALE_FRAGMENT_SHADER);
            program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);        //cocos会做初始化的工作
            program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
            program.link();
            program.updateUniforms();
            Filter.programs["grayScale"] = program;
        }
        gl.useProgram(program.getProgram());
       sprite.shaderProgram = program;
    },

    /**
     * 造旧
     * @param sprite
     * @param degree 旧的程度 0~1
     */
    sepia: function (sprite, degree) {
        var program = Filter.programs["sepia"+degree];
        if(!program){
            program = new cc.GLProgram();
               program.retain();
            program.initWithString(Filter.DEFAULT_VERTEX_SHADER, Filter.SEPIA_FRAGMENT_SHADER);
            program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);        //cocos会做初始化的工作
            program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
            program.link();
            program.updateUniforms();
               
/*
     这两句只在html5中有效，在jsb中失效。原因可能是native版本绘制sprite前把这个glprogram重置了，丢掉了参数。
            var degreeLocation = program.getUniformLocationForName("u_degree");
            gl.uniform1f(degreeLocation, degree);
*/
              
            Filter.programs["sepia"+degree] = program;
        }
        gl.useProgram(program.getProgram());
        sprite.shaderProgram = program;
         
          sprite.scheduleUpdate();
          sprite.update = function(){
               program.use();
               program.setUniformsForBuiltins();
            var degreeLocation = program.getUniformLocationForName("u_degree");
               gl.uniform1f( degreeLocation, degree);     //这个函数由于jsb实现有问题，在手机侧实际只能传递整数，需要注意。html5是正常的。
          };
         
    }

};


cc.GLNode = cc.GLNode || cc.Node.extend({
    ctor:function(){
        this._super();
        this.init();
    },
    _initRendererCmd:function(){
        this._rendererCmd = new cc.CustomRenderCmdWebGL(this, function(){
            cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW);
            cc.kmGLPushMatrix();
            cc.kmGLLoadMatrix(this._stackMatrix);

            this.draw();

            cc.kmGLPopMatrix();
        });
    }
});

var ShaderLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        if( 'opengl' in cc.sys.capabilities ) {
            var node1 = new cc.Sprite("res/item_2.png");
            var node2 = new cc.Sprite("res/item_3.png");
            this.addChild(node1,11);
            this.addChild(node2,12);
            node1.x = 500;
            node2.x = 200;
            node1.y = node2.y = 130;
            Filter.grayScale(node1);
            Filter.sepia(node2, 1);

              
            var glnode = new cc.GLNode();
            this.addChild(glnode,1);
            this.glnode = glnode;
            var winSize = cc.director.getWinSize();
            glnode.x = winSize.width/2;
            glnode.y = winSize.height/2;
            glnode.width = 128;
            glnode.height = 128;
            glnode.anchorX = 0.5;
            glnode.anchorY = 0.5;

            var MULTI_TEXTURES_FRAGMENT_SHADER =
                "precision lowp float;   \n"
                + "varying vec2 v_texCoord;  \n"
                + "uniform sampler2D tex0; \n"          //为了避免跟自动加入的CC_Texture0冲突，改名
                + "uniform sampler2D tex1; \n"
                + "void main() \n"
                + "{  \n"
                + "    vec4 color1 =  texture2D(tex0, v_texCoord);   \n"
                + "    vec4 color2 =  texture2D(tex1, v_texCoord);   \n"
                    + "    gl_FragColor = vec4(color1.r*color2.r, color1.g*color2.g, color1.b*color2.b, color1.a*color2.a);   \n"
                + "}";
            var DEFAULT_VERTEX_SHADER =
                "attribute vec4 a_position; \n"
                + "attribute vec2 a_texCoord; \n"
                + "varying mediump vec2 v_texCoord; \n"
                + "void main() \n"
                + "{ \n"
                + "    gl_Position = (CC_PMatrix * CC_MVMatrix) * a_position;  \n"
                + "    v_texCoord = a_texCoord;               \n"
                + "}";
            this.shader = new cc.GLProgram();
               this.shader.retain();
            this.shader.initWithString(DEFAULT_VERTEX_SHADER, MULTI_TEXTURES_FRAGMENT_SHADER);
            this.shader.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
            this.shader.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
            this.shader.link();
            this.shader.updateUniforms();   //绑定位置，这个是cocos封装后必须做的事。详细可以看代码
            this.initGL();
            var p = this.shader.getProgram();
            this.tex1Location = gl.getUniformLocation(p, "tex0");    //如果frag shader最终没有用某个uniform，该uniform会被优化删掉
            this.tex2Location = gl.getUniformLocation(p, "tex1");

            glnode.draw = function() {
                this.shader.use();                      //使用这个shader来绘制，封装了gl的use。跟指定glnode.shaderProgram类似
                this.shader.setUniformsForBuiltins();   //设置坐标系变换

                gl.activeTexture(gl.TEXTURE0);          //webgl中一共32个，可以看cocos2d列的常量
                gl.bindTexture(gl.TEXTURE_2D, this.tex1.getName());
                gl.uniform1i(this.tex1Location, 0);     //把CC_Texture0指向gl.TEXTURE0
                gl.activeTexture(gl.TEXTURE1);
                gl.bindTexture(gl.TEXTURE_2D, this.tex2.getName());
                gl.uniform1i(this.tex2Location, 1);
                cc.glEnableVertexAttribs( cc.VERTEX_ATTRIB_FLAG_TEX_COORDS | cc.VERTEX_ATTRIB_FLAG_POSITION);   //实际对gl的api做了封装，增加了这两个属性的位置映射。用于vertexAttribPointer

                // Draw fullscreen Square
                gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
                gl.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, gl.FLOAT, false, 0, 0);
                gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexTextureBuffer);
                gl.vertexAttribPointer(cc.VERTEX_ATTRIB_TEX_COORDS, 2, gl.FLOAT, false, 0, 0);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

                gl.activeTexture(gl.TEXTURE1);
                gl.bindTexture(gl.TEXTURE_2D, null);        //使用完必须置为空，否则影响其他node
                gl.activeTexture(gl.TEXTURE0);          //另外必须设置回第0个，否则cocos2d框架中如果没有显示设置第0个，就会错误使用了上边的TEXTURE1
                gl.bindTexture(gl.TEXTURE_2D, null);
                gl.bindBuffer(gl.ARRAY_BUFFER, null);

            }.bind(this);
        }
    },

    initGL:function() {
        var tex1 = cc.textureCache.addImage("res/item_2.png");
        var tex2 = cc.textureCache.addImage("res/item_3.png");
        this.tex1 = tex1;
        this.tex2 = tex2;
        //
        // Square
        //
        var squareVertexPositionBuffer = this.squareVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
        var vertices = [
            128,  128,
            0,    128,
            128,  0,
            0,    0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        var squareVertexTextureBuffer = this.squareVertexTextureBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexTextureBuffer);
        var texcoords = [
            0, 0,
            1, 0,
            0, 1,
            1, 1
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new ShaderLayer();
        this.addChild(layer);
         
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyReleased: function(keyCode, event) {
                    if (keyCode == cc.KEY.back) {
                        cc.director.end();
                    }
                }}, this);
    }
});
