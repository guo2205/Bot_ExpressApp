
    export enum RedisCollection {
        /// <summary>
        /// 用户发的消息
        /// </summary>
        UserSendMessage=0,
        /// <summary>
        /// 用户的意图
        /// </summary>
        UserIntents,
        /// <summary>
        /// AI的意图
        /// </summary>
        AIIntents,
        /// <summary>
        /// 分析得出的结果
        /// </summary>
        UserGetMessage,
        /// <summary>
        /// 感知
        /// </summary>
        perception,
        /// <summary>
        /// 神经网络
        /// </summary>
        NeuralNetwork,
        /// <summary>
        /// 词转向量
        /// </summary>
        Word2VectorData,
        /// <summary>
        /// 回答
        /// </summary>
        response,
        /// <summary>
        /// 用户TOKEN
        /// </summary>
        UserToken,
        /// <summary>
        /// 智能管家的私有属性
        /// </summary>
        MindAgent,
        /// <summary>
        /// JD授权
        /// </summary>
        JD_Token,
        /// <summary>
        /// 数据观察
        /// </summary>
        Test,
        /// <summary>
        /// HttpTest
        /// </summary>
        HttpTest,
        /// <summary>
        /// 短信验证
        /// </summary>
        MessageIdentification,
        /// <summary>
        /// 数据中间表
        /// </summary>
        MidTable = 16,
    }



