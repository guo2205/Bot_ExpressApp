"use strict";
(function (RedisCollection) {
    /// <summary>
    /// 用户发的消息
    /// </summary>
    RedisCollection[RedisCollection["message"] = 0] = "message";
    /// <summary>
    /// 微软意图解析
    /// </summary>
    RedisCollection[RedisCollection["MicrosoftLUIS"] = 1] = "MicrosoftLUIS";
    /// <summary>
    /// 分析得出的结果
    /// </summary>
    RedisCollection[RedisCollection["UserIntents"] = 2] = "UserIntents";
    /// <summary>
    /// 感知
    /// </summary>
    RedisCollection[RedisCollection["perception"] = 3] = "perception";
    /// <summary>
    /// 神经网络
    /// </summary>
    RedisCollection[RedisCollection["NeuralNetwork"] = 4] = "NeuralNetwork";
    /// <summary>
    /// 词转向量
    /// </summary>
    RedisCollection[RedisCollection["Word2VectorData"] = 5] = "Word2VectorData";
    /// <summary>
    /// 回答
    /// </summary>
    RedisCollection[RedisCollection["response"] = 6] = "response";
    /// <summary>
    /// 用户TOKEN
    /// </summary>
    RedisCollection[RedisCollection["UserToken"] = 7] = "UserToken";
    /// <summary>
    /// 智能管家的私有属性
    /// </summary>
    RedisCollection[RedisCollection["MindAgent"] = 8] = "MindAgent";
    /// <summary>
    /// JD授权
    /// </summary>
    RedisCollection[RedisCollection["JD_Token"] = 9] = "JD_Token";
    /// <summary>
    /// 数据观察
    /// </summary>
    RedisCollection[RedisCollection["Test"] = 10] = "Test";
    /// <summary>
    /// HttpTest
    /// </summary>
    RedisCollection[RedisCollection["HttpTest"] = 11] = "HttpTest";
    /// <summary>
    /// 短信验证
    /// </summary>
    RedisCollection[RedisCollection["MessageIdentification"] = 12] = "MessageIdentification";
    /// <summary>
    /// 数据中间表
    /// </summary>
    RedisCollection[RedisCollection["MidTable"] = 16] = "MidTable";
})(exports.RedisCollection || (exports.RedisCollection = {}));
var RedisCollection = exports.RedisCollection;
//# sourceMappingURL=Enum.js.map