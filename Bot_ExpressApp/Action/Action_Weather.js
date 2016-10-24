"use strict";
function action_Weather(actionReq, OnFinish) {
    var res = {
        "res": false,
        "t_code": 0,
        "t_text": "晴",
        "t_max": 27,
        "t_min": 15
    };
    OnFinish(res);
    return;
}
exports.action_Weather = action_Weather;
//# sourceMappingURL=Action_Weather.js.map