/**
* Created by kenkozheng on 2014/11/4.
*/

/**
* 只能用于控制Sprite的色调等，目标是实现类似Flash的内置基本滤镜
* 静态类
*/
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
        + "uniform sampler2D tex0; \n"
        + "void main() \n"
        + "{  \n"
        + "    vec4 texColor = texture2D(tex0, v_texCoord);  \n"
        + "    float gray = texColor.r * 0.299 + texColor.g * 0.587 + texColor.b * 0.114; \n"
        + "    gl_FragColor = vec4(gray, gray, gray, texColor.a);  \n"
        + "}",

    SEPIA_FRAGMENT_SHADER:
        "varying vec2 v_texCoord;   \n"
        + "uniform sampler2D tex0; \n"
        + "uniform float u_degree; \n"
        + "void main() \n"
        + "{  \n"
        + "    vec4 texColor = texture2D(tex0, v_texCoord);  \n"
        + "    float r = texColor.r * 0.393 + texColor.g * 0.769 + texColor.b * 0.189; \n"
        + "    float g = texColor.r * 0.349 + texColor.g * 0.686 + texColor.b * 0.168; \n"
        + "    float b = texColor.r * 0.272 + texColor.g * 0.534 + texColor.b * 0.131; \n"
        + "    gl_FragColor = mix(texColor, vec4(r, g, b, texColor.a), u_degree);  \n"
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
            program.initWithString(Filter.DEFAULT_VERTEX_SHADER, Filter.SEPIA_FRAGMENT_SHADER);
            program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);        //cocos会做初始化的工作
            program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
            program.link();
            program.updateUniforms();
            var degreeLocation = program.getUniformLocationForName("u_degree");
            program.setUniformLocationF32(degreeLocation, degree);
            Filter.programs["sepia"+degree] = program;
        }
        gl.useProgram(program.getProgram());
        sprite.shaderProgram = program;
    }

};
