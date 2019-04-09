WebGL Programming Guide
===========

> Plain webpack 4 boilerplate with Babel, SASS and lodash on board

## Requirements
You only need <b>node.js</b> pre-installed and you’re good to go. 

If you don’t want to work with lodash, just remove it from the node packages and the webpack config.


## Setup
Install dependencies
```sh
$ npm install
```

## Development
Run the local webpack-dev-server with livereload and autocompile on [http://localhost:8080/](http://localhost:8080/)
```sh
$ npm run dev
```
## Deployment
Build the current application
```sh
$ npm run build
```

## [webpack](https://webpack.js.org/)
If you're not familiar with webpack, the [webpack-dev-server](https://webpack.js.org/configuration/dev-server/) will serve the static files in your build folder and watch your source files for changes.
When changes are made the bundle will be recompiled. This modified bundle is served from memory at the relative path specified in publicPath.

## ch02

### WebGL 和 canvas 坐标系对应关系

1. canvas 中心点：(0.0, 0.0, 0.0)
2. canvas 上边缘和下边缘：(-1.0, 0.0, 0.0) 和 (1.0, 0.0, 0.0)
3. canvas 左边缘和右边缘：(0.0, -1.0, 0.0) 和 (0.0, 1.0, 0.0)

canvas的坐标系 相对于 WebGL的坐标系 相当于进行了 逆时针旋转了90°

### 绘制一个点(版本2)

> attribute // 传递与顶点相关的数据
> uniform // 传递对于所有顶点都相同的数据

1. attribute变量的使用方式

  * 在顶点着色器中，声明attribute变量；
  * 将attribute变量赋值给gl_Position变量；
  * 想attribute变量传输数据。


## ch03

> 构成三维模型的基本单位是三角形



**缓冲区对象(buffer object)**

> WebGL中的一块内存区域，可以一次向缓冲区传入大量数据，然后将顶点数据保留在其中，供顶点着色器使用。



*使用缓冲区对象的基本步骤*

1. 创建缓冲区对象

   ```javascript
   gl.createBuffer(); // returns a buffer
   gl.deleteBuffer(buffer);
   ```

   

2. 绑定缓冲区对象

   ```javascript
   gl.bindBuffer(target, buffer);
   
   // target is one of:
   // gl.ARRAY_BUFFER
   // gl.ELEMENT_ARRAY_BUFFER
   // buffer
   ```

   

3. 将数据写入缓冲区

   ```javascript
   gl.bufferData(target, data, usage)
   
   // usage is one of:
   // gl.STATIC_DRAW 一次写入，多次绘制
   // gl.STREAM_DRAW 一次写入，若干次绘制
   // gl.DYNAMIC_DRAW 多次写入，绘制多次
   ```

   

4. 将缓冲区分配给一个attribute变量

   ```javascript
   // gl.vertexAttrib[1234]f
   gl.vertexAttribPointer(location, size, type, normalized, stride, offset)
   
   ```

   

5. 开启attribute变量

   ```javascript
   gl.enableVertexArray(location);
   gl.disableVertexArray(location);
   ```

   



`gl.drawArrays`



| 基本图形 | 参数 mode         | 描述                                                         |
| -------- | ----------------- | ------------------------------------------------------------ |
| 点       | gl.POINTS         | 一系列点                                                     |
| 线段     | gl.LINES          | 一系列单独的线段, (v0, v1), (v1, v2)                         |
| 线条     | gl.LINE_STRIP     | 一系列连接的线段，绘制在(v0, v1), (v1, v2), ...              |
| 回路     | gl.LINE_LOOP      | 一系列连接的线段，首尾相接                                   |
| 三角形   | gl.TRIANGLES      | 一系列单独的三角形，绘制在(v0, v1, v2), (v3, v4, v5), ...    |
| 三角带   | Gl.TRIANGLE_STRIP | 一系列带状的三角形，绘制在(v0, v1, v2), (v2, v1, v3), (v3, v2, v4), ...(逆时针) |
| 三角扇形 | gl.TRIANGLE_FAN   | 一系列三角形组成的类似于扇形的图形，绘制在(v0, v1, v2), (v0, v2, v3) |



### 移动、旋转和缩放



**旋转**

1. 旋转轴
2. 旋转方向
3. 旋转角度



正旋转遵循右手法则。



旋转公式:
$$
x^{'} = x cos\beta - y sin \beta \\
y^{'} = x sin\beta + y cos \beta \\
z^{'} = z \\
$$
平移矩阵 和 旋转矩阵



## ch05

光栅化(rasterization)

纹理映射(texture mapping)



**纹理映射步骤**

1. 准备好纹理图像
2. 为几何图形配置纹理映射方式
3. 加载纹理图像，对其进行一些配置
4. 在偏远着色器中将相应的纹素从纹理中抽取出来，并将纹素的颜色赋给片元



**纹理坐标**

> WebGL 使用s和t命名纹理坐标

四个角的坐标

> 左下角(0.0, 0.0) 
>
> 右下角(1.0, 0.0)
>
> 右上角(1.0, 1.0)
>
> 左上角(0.0, 1.0)



**纹理单元**

> 同时使用多个纹理，每个纹理单元有一个单元编号来管理一张纹理图像。即使程序只需要使用一张纹理图像，也要为其指定一个纹理单元。
>
> WebGL至少支持8个纹理单元：`gl.TEXTURE0`



## GLSL

> 程序大小写敏感(case-sensitive)
>
> 语句以分号(semicolon)结束
>
> 所有程序都是从`main()`函数开始执行

*1. 注释*

单行注释：`//`

多行注释：`/* */`

*2. 数据值类型*

数值类型：整数 和 浮点数，区分规则包含小数点的是浮点数，反之为整数

布尔值：`true/false`

*3. 变量*

只包含`[a-zA-Z0-9_]`字符

首字母不能为数字

不能使关键字或者保留字

不能以`gl_`, `webgl_`, `_webgl_`开头

变量声明：type variable;



*4.基本类型*

* `float` 单精度浮点数
* `int` 整型
* `bool` 布尔值

*5. 赋值与类型转换*

不同类型无法赋值，不会进行隐式类型转换，可以执行显示类型转换

`int i = 8; float f1 = float(i);`

*6. 运算符*



| 类别                      | GLSL ES 数据类型 | 描述                                         |
| ------------------------- | ---------------- | -------------------------------------------- |
| `-`                       | 取负             | int或者float                                 |
| `*`                       | 乘法             | int或者float                                 |
| `/`                       | 除法             | 与运算的值类型相同                           |
| `+`                       | 加法             |                                              |
| `++`                      | 自增             | int或者float                                 |
| `--`                      | 自减             |                                              |
| `=`                       | 赋值             | int或者float或者bool                         |
| `+= -= /= *=`             | 算术赋值         | int或者float                                 |
| `< > <= >=`               | 比较             |                                              |
| `== !=`                   | 比较             | int、float或bool                             |
| `!`                       | 取反             | bool或者结果为bool的表达式                   |
| `&&`                      | 逻辑与           |                                              |
| `||`                      | 逻辑或           |                                              |
| `^^`                      | 逻辑异或         |                                              |
| `condition ? Exp1 : Exp2` | 三元选择         | condition为bool，exp可以是除数组外的任意类型 |



*7. 矢量和矩阵*



| 类别 | GLSL ES类型          | 描述                          |
| ---- | -------------------- | ----------------------------- |
| 矢量 | `vec2 vec3 vec4`     | 具有浮点数元素的矢量          |
|      | `ivec2 ivec3 ivec4`  | 具有整型元素的矢量            |
|      | `bvec2 bvec3 bvec4`  | 具有布尔值元素的矢量          |
| 矩阵 | `mat2` `mat3` `mat4` | 2x2, 3x3, 4x4的浮点数元素矩阵 |
|      |                      |                               |



*8. 赋值和构造*

`vec4 position = vec4(1.0, 2.0, 3.0, 4.0)`

创建指定类型的变量的函数被称为**构造函数(constructor function)**，构造函数的名称和其创建的变量的类型名称总是一致的。

**矢量构造函数**

```c
vec3 v3 = vec3(1.0, 0.0, 0.5);
vec2 v2 = vec2(v3); // 将v3的前两个元素赋值给v2
vec4 v4 = vec4(1.0); // 默认将所有元素设置为1.0
vec4 v4b = vec4(v2, v4); //将v4b设置为(1.0, 0.0, 1.0, 1.0)

```

**矩阵构造函数**

> 矩阵中的元素是按照列主序排列的

```c
mat4 m4 = mat4(1.0, 2.0, 3.0, 4.0,
               5.0, 6.0, 7.0, 8.0,
               9.0, 10.0, 11.0, 12.0,
               13.0, 14.0, 15.0, 16.0);

// |1.0, 5.0,  9.0, 13.0|
// |2.0, 6.0, 10.0, 14.0|
// |3.0, 7.0, 11.0, 15.0|
// |4.0, 8.0, 12.0, 16.0|
```

> 矢量初始化

```c
vec2 v2_1 = vec2(1.0, 3.0);
vec2 v2_2 = vec2(2.0, 4.0);
mat2 m2 = mat2(v2_1, v2_2);
// | 1.0, 2.0|
// | 3.0, 4.0|

vec4 v4 = vec4(1.0, 3.0, 2.0, 4.0);
mat2 m2_2 = mat2(v4);
// | 1.0, 2.0 |
// | 3.0, 4.0 |
```

> 矢量和数值初始化

```c
mat2 m2 = (1.0, 3.0, v2_2);
// | 1.0, 2.0 |
// | 3.0, 4.0 |
```

> 数值初始化

```c
mat2 m2 = mat2(1.0);
// | 1.0, 0.0 |
// | 0.0, 1.0 |
```



*9. 访问元素*

> 可以使用`.` 或者 `[]`来获取元素

| 类别         | 描述             |
| ------------ | ---------------- |
| `x, y, z, w` | 获取顶点坐标分量 |
| `r, g, b, a` | 获取颜色分量     |
| `s, t, p, q` | 获取纹理坐标分量 |

> 由于矢量可以用来存储顶点、颜色和纹理坐标，所以GLSL ES支持以上三种分量名称以增强程序的可读性

聚合分量：`v3a = v3.zyx`

```c
mat2 m2 = mat2(1.0, 2.0,
               3.0, 4.0);
vec2 v2 = m2[0]; // v2 = (1.0, 2.0); 第一列
```

> 在`[]`中出现的所因子必须是常量索引值(constant index)
>
> 整型字面量
>
> 用const修饰的全局变量或局部变量
>
> 循环索引
>
> 由前述三条中的项组成的表达式



*10. 运算符*

> 对于矢量和矩阵，只可以使用比较运算符中的`==`和`!=`，不可以使用`<, >, >=, <=`。

矩阵和矢量可用的运算符

| 运算符           | 运算     | 适用数据类型             |
| ---------------- | -------- | ------------------------ |
| `*`              | 乘法     | 适用于vec[234]和mat[234] |
| `/`              | 除法     |                          |
| `+`              | 加法     |                          |
| `-`              | 减法     |                          |
| ` --`            | 自减     |                          |
| `++`             | 自增     |                          |
| `=`              | 赋值     |                          |
| `+=, -=, *=, /=` | 运算赋值 |                          |
| `==, !=`         | 比较     |                          |



矢量和浮点数的运算

> 运算符重载

```c
v3b = v3a + f
// v3b.x = v3a.x + f
// v3b.y = v3a.y + f
// v3b.z = v3a.z + f
```

矢量运算

```c
v3c = v3a + v3b
// v3c.x = v3a.x + v3b.x
// v3c.y = v3a.y + v3b.y
// v3c.z = v3a.z + v3b.z
```

矩阵和浮点数的运算

```c
m3b = m3a + f
// m3b[0].x = m3a[0].x + f
// m3b[0].y = m3a[0].y + f
// m3b[0].z = m3a[0].z + f
// ...
```

矩阵右乘矢量

> 矩阵右乘的结果是矢量，其中每个分量都是原矢量中的对应分量，乘上矩阵对应行的每个元素的积的加和。

```c
v3b = m3a * v3a
```

矩阵左乘矢量

```c
v3b = v3a * m3a
```

矩阵与矩阵相乘

```c
m3c = m3a * m3b
```



*11. 结构体*

> 关键字 `struct`

```c
struct light {
  vec4 color;
  vec3 position;
}
light l1, l2;
```

赋值和构造

```c
l1 = light(vec4(0.0, 1.0, 0.0, 1.0), vec3(8.0, 3.0, 0.0));
```

访问成员

```c
vec4 color = l1.color;
vec3 position = l1.position;
```

运算符

> 结构体本身只支持两种运算：赋值(=) 和 比较(== 或 !=)



*12. 数组*

> GLSL ES 只支持一维数组，不支持pop() 和 push() 等操作，创建数组不用使用new运算符

```c
float floatArray[4];
vec4 vec4Array[2];
```

> 数组长度必须是大于0的整型常量表达式
>
> 整型字面值
>
> 用const限定字修饰的变量
>
> 前述两条中的项组成的表达式

数组索引

> 只有整型常量表达式和uniform变量可以用作数组索引值
>
> 数组不能被一次性地初始化，只能显式地对每个元素进行初始化



*13. 取样器*

取样器类型：sampler2D 和 samplerCube

> 取样器变量只能是uniform变量，或者需要访问纹理的函数的参数(texture2D())

唯一能够赋给取样器变量的就是纹理单元编号，而且必须通过`gl.uniform1i`的方法来赋值。



*14. 运算符优先级*

| 优先级 | 运算符                                              |
| ------ | --------------------------------------------------- |
| 1      | `()`                                                |
| 2      | 函数调用(`()`)，数组索引(`[]`)，点操作符(`.`)       |
| 3      | 自增和自减，负(`-`)，取反(`!`)                      |
| 4      | 乘，除，**求余**                                    |
| 5      | 加，减                                              |
| 6      | **按位移(<<, >>)**                                  |
| 7      | 大小比较(< ,<=, >, >=)                              |
| 8      | 判断相等(==, !=)                                    |
| 9      | **按位与(&)**                                       |
| 10     | **按位异或(^)**                                     |
| 11     | **按位或(\|)**                                      |
| 12     | 与(&&)                                              |
| 13     | 异或(^^)                                            |
| 14     | 或(\|\|)                                            |
| 15     | 三元判断符(?:)                                      |
| 16     | 运算赋值(+=, -=, *=, /=, %=, <<=, >>=, &=, ^=, \|=) |
| 17     | 顺序运算符，即逗号(`,`)                             |



加粗的字体表示运算符被保留了，供未来版本的GLSL使用。



优先级规则

> 一元操作符优先级高于二元操作符
>
> 算术运算符 > 移位运算符 > 比较运算符 > 位运算符 > 逻辑运算符 > 三元 > 运算赋值 > 顺序运算符



*15. 程序流程控制*

**if else**

```c
if (expr) {
  ;
} else if (expr2) {
  ;
} else {
  
}
```

> GLSL 中没有switch语句

**for语句**

```c
for(init; condition; step) {
  ;
}
int sum = 0;
for(int i = 0; i < 10; i++) {
  sum += i;
}
```

> 只允许有一个循环变量，只能是`int` 或者 `float`
>
> 循环表达式必须是以下的形式`i++`, `i—`, `i+=`, `i-=`
>
> 条件表达式必须是循环变量与整型常量的比较
>
> 在循环体内，循环变量不可被赋值

**continue, break, discard**

> discard只能在片元着色器中使用，表示放弃当前片元直接处理下一个片元



*16. 函数*

```
type funcName (type0 arg0, ...) {
  ...
  return type;
}
```

> 函数无法递归调用



*17. 规范声明*

> 如果函数定义在其调用之后，那么需要在调用之前进行函数声明。

```c
float luma(vec4);

main() {
  float brightness = luma(color);
}

float luma(vec4 color) {
  return 0.2126* color.r + 0.7162 * color.g + 0.0722 * color.b;
}
```



*18. 参数限定词*

> 在GLSL中可以为函数参数指定限定字，以控制参数的行为。

| 类别     | 规则     | 描述                                                         |
| -------- | -------- | ------------------------------------------------------------ |
| in       | 传入值   | 函数可以使用参数，也可以修改。但是不会影响传入的变量         |
| const in | 传入值   | 函数可以使用参数，但不能修改                                 |
| out      | 传出值   | 传入变量引用，在函数内修改                                   |
| inout    | 传入传出 | 传入变量的引用，函数会用到变量的初始值，可以修改，影响传入变量 |
| 无       |          | 和 in 一样                                                   |

```c
void luma(in vec3 color, out float brightness) {
  brightness = 0.2126* color.r + 0.7162 * color.g + 0.0722 * color.b;
}

main() {
  float brightness = luma(color);
}
```



*19. 内置函数*

| 类别         | 内置函数                                                     |
| ------------ | ------------------------------------------------------------ |
| 角度函数     | `radians(角度->弧度)` , `degrees(弧度->角度)`                |
| 三角函数     | `sin, cos, tan, asin, acos, atan`                            |
| 指数函数     | `pow, exp, log, exp2(2^x), log2,sqrt, inversesqrt`           |
| 通用函数     | `abs`, `min`, `max`, `mod`, `sign`, `floor`,` ceil`,` clamp(限定范围)`, `mix(线性内插)`,` step(步进函数)`, `smoothstep(艾米内插步进)`， `fract(取小数部分)` |
| 几何函数     | `length(矢量长度), distance, dot, cross, normalize, reflect, faceforward` |
| 矩阵函数     | `matrixCmpMult`                                              |
| 矢量函数     | `lessThan, lessThanEqual, greaterThan, greaterThanEqual, equal, noEqual, any, all, not` |
| 纹理查询函数 | `texture2D`, `textureCube`, `texture2DProj`, `texture2DLod`, `textureCubeLod`, `texture2DProjLod` |



*20.全局变量和局部变量*

> 声明在函数外部的为全局变量，函数内部的为局部变量



*21. 存储限定字*

`const` `attribute` `uniform` `varying`

**attribute**

> 只能出现在顶点着色器中，只能被声明为全局变量
>
> 变量类型只能是`float vec2 vec3 vec4 mat2 mat3 mat4`
>
> 顶点着色器中能够容纳的attribute变量的最大数目与设备有关，你可以通过访问内置的全局变量来获取该值。至少支持8个attribute变量

**uniform**

> 可以用在顶点和片元着色器中，且必须是全局变量
>
> 只读，可以是除了数组或结构体之外的任意类型
>
> 顶点着色器和片元着色器声明了同名的uniform变量，会被两种着色器共享

**varying**

> 全局变量，用于从顶点着色器向片元着色器传输数据
>
> 两种着色器中必须声明同名，同类型的varying变量
>
> 变量类型只能是`float vec2 vec3 vec4 mat2 mat3 mat4`
>
> 至少支持8个varying变量



*22. 精度限定字*

> 精细控制程序在效果和性能间的平衡
>
> 默认值：
>
> ```c
> #ifdef GL_ES
> precision mediump float;
> #endif
> ```
>
> 

| 精度限定字 | 描述                           | 默认数值范围和精度                |                     |
| ---------- | ------------------------------ | --------------------------------- | ------------------- |
|            |                                | Float                             | Int                 |
| highp      | 高精度，顶点着色器中的最低精度 | $(-2^{62}, 2^{62})$ 精度$2^{-16}​$ | $(-2^{16}, 2^{16})$ |
| mediump    | 中精度，片元着色器的最低精度   | $(-2^{14}, 2^{14})$ 精度$2^{-10}​$ | $(-2^{10}, 2^{10})$ |
| lowp       | 低精度，可以表示所有颜色       | $(-2, 2)$ 精度$2^{-8}​$            | $(2^{-8}, 2^{8})$   |

为每个变量都声明精度很繁琐，可以使用precision来声明着色器的默认精度

> ```c
> // precision 精度限定字 类型名称;
> precision mediump float;
> ```



*22. 预处理指令*

