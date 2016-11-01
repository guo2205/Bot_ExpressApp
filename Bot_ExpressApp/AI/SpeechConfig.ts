//添加模板意图 用于上下文理解 添加空的entity: [] 可以取消上下文理解

export var SpeechConfig: Object =
{
        2003: { Intent: "QueryWeather", entity: ["city"] },
        10033: { Intent: "Shopping", entity: ["list", "goodtag"] },
        10003: { Intent: "Shopping", entity: ["goodtype"] },
        10013: { Intent: "Shopping", entity: [] },

}
