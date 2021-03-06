1. HTTP协议的主要特征
    - 简单快速：URI统一资源符
    - 灵活：通过一个HTTP协议可以完成不同类型文件的传输
    - 无连接：连接一次就断掉，不会保持连接
    - 无状态：服务端 客户端两种身份，完成一次请求，下次请求无法区分客户端是不是同一个身份；无状态的。
2. HTTP报文的组成部分

```
graph LR
请求报文-->请求行
请求报文-->请求头,以KEY:VAL的形式
请求报文-->空行,服务端遇到空行后判断下一个为请求体
请求报文-->请求体

请求行-->HTTP方法
请求行-->页面地址
请求行-->HTTP协议
请求行-->版本
```

---

```
graph LR
响应报文-->状态行
响应报文-->响应头
响应报文-->空行
响应报文-->响应体
```

3. HTTP方法

```
graph LR
GET-->获取资源
POST-->传输资源
PUT-->更新资源
DELETE-->删除资源
HEAD-->获得报文的首部
```

4. POST和GET的区别
    1.     GET在浏览器回退时是无害的，而POST会再次提交请求
    2.     GET产生的URL是可以被收藏的，而POST不可以
    3.     GET会被浏览器主动缓存，而POST不会，除非手动设置
    4.     GET请求只能URL编码，而POST支持多种编码方式
    5.     GET请求参数会被完整的保留在浏览器历史记录，而POST中参数不会被保留
    6.     GET请求在URL中传送的参数是有长度限制的，而POST没有限制
    7.     对参数的数据类型，GET只接受ASCII字符，而POST没有限制
    8.     GET比POST更不安全，因为参数直接暴露在URL上，所以不能用来传递敏感信息
    9.     GET参数通过URL传递，POST放在Requst body中
5. HTTP状态码
    -     1xx：指示信息 - 表示请求已接收，继续处理
    -     2xx：成功 - 表示请求已被成功处理
               200 OK：客户端请求成功
               206 Partial Content：客户端发送了一个带有Range头的GET请求，服务器完成了它
    -     3xx：重定向 - 要完成请求必须进行更进一步的操作
               301 Moved Permanently：所请求的页面已经转移至新的URL
               302 Found：所请求的页面已经临时转移至新的URL
               304 Not Modified：客户端有缓冲的文档并发出了一个条件性的请求，服务端告诉客户端，原来缓冲的文档还可以继续使用。
    -     4xx：客户端错误 - 请求有语法错误或请求无法实现
               400 Bad Request：客户端请求有语法错误，不能被服务端所理解
               401 Unauthorized：请求未经授权，这个状态码必须和WWW-Authenticate报头域一起使用
               403 Forbidden：对请求页面的访问被禁止
               404 Not Found：请求资源不存在
    -     5xx：服务器错误 - 服务器未能实现合法的请求
               500 Internal Server Error：服务器发送不可预期的错误
               503 Server Unavailable：请求未完成，服务器临时过载或当机，一段时间后可能恢复正常。
6. 什么是持久连接
>     HTTP支持持久连接，在HTTP1.1及以后支持。
> HTTP协议采用"请求-应答"模式，当使用普通模式，既非Keep-Alive模式时，每个请求/应答客户端和服务器都要新建一个连接，完成之后立即断开连接（HTTP协议为无连接的协议）
> 当使用Keep-Alive模式（又称持久连接、连接重用）时，keep-alive功能使客户端到服务端的连接持续有效，当出现对服务器的后续请求时，keep-alive功能避免建立或重新建立连接

7. 什么是管线话
```
在使用持久连接的情况下，某个连接上消息的传递类似于
请求1 -> 响应1 -> 请求2 -> 响应2 -> 请求3 -> 响应3

某个连接上的消息变成了类似这样
请求1 -> 请求2 -> 请求3 -> 响应1 -> 响应2 -> 响应3

持久连接就是一次请求完成后连接也不断开，继续处理后续请求
管线化是通道是持久建立的，但不是请求一次就响应一次，而是把所有的请求打包一次发出，响应也打包返回回来

1.管线化机制通过持久话连接完成，仅HTTP/1.1支持此技术
2.只有GET和HEAD请求可以进行管线化，而POST则有所限制
3.初次连接不应启动管线化机制，因为对方（服务器）不一定支持HTTP/1.1版本协议
```
