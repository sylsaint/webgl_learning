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

