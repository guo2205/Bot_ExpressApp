"use strict";
(function (RedisCollection) {
    /// <summary>
    /// 用户发的消息
    /// </summary>
    RedisCollection[RedisCollection["UserSendMessage"] = 0] = "UserSendMessage";
    /// <summary>
    /// 用户的意图
    /// </summary>
    RedisCollection[RedisCollection["UserIntents"] = 1] = "UserIntents";
    /// <summary>
    /// AI的意图
    /// </summary>
    RedisCollection[RedisCollection["AIIntents"] = 2] = "AIIntents";
    /// <summary>
    /// 分析得出的结果
    /// </summary>
    RedisCollection[RedisCollection["UserGetMessage"] = 3] = "UserGetMessage";
    /// <summary>
    /// 感知
    /// </summary>
    RedisCollection[RedisCollection["perception"] = 4] = "perception";
    /// <summary>
    /// 神经网络
    /// </summary>
    RedisCollection[RedisCollection["NeuralNetwork"] = 5] = "NeuralNetwork";
    /// <summary>
    /// 词转向量
    /// </summary>
    RedisCollection[RedisCollection["Word2VectorData"] = 6] = "Word2VectorData";
    /// <summary>
    /// 回答
    /// </summary>
    RedisCollection[RedisCollection["response"] = 7] = "response";
    /// <summary>
    /// 用户TOKEN
    /// </summary>
    RedisCollection[RedisCollection["UserToken"] = 8] = "UserToken";
    /// <summary>
    /// 智能管家的私有属性
    /// </summary>
    RedisCollection[RedisCollection["MindAgent"] = 9] = "MindAgent";
    /// <summary>
    /// JD授权
    /// </summary>
    RedisCollection[RedisCollection["JD_Token"] = 10] = "JD_Token";
    /// <summary>
    /// 数据观察
    /// </summary>
    RedisCollection[RedisCollection["Test"] = 11] = "Test";
    /// <summary>
    /// HttpTest
    /// </summary>
    RedisCollection[RedisCollection["HttpTest"] = 12] = "HttpTest";
    /// <summary>
    /// 短信验证
    /// </summary>
    RedisCollection[RedisCollection["MessageIdentification"] = 13] = "MessageIdentification";
    /// <summary>
    /// 数据中间表
    /// </summary>
    RedisCollection[RedisCollection["MidTable"] = 16] = "MidTable";
})(exports.RedisCollection || (exports.RedisCollection = {}));
var RedisCollection = exports.RedisCollection;
//# sourceMappingURL=Enum.js.map