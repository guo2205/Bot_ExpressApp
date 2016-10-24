import IAction = require("./IAction");

export function action_Weather(actionReq: IAction.Action.IActionReq, OnFinish: (ActionRes: IAction.Action.IActionRes) => void) {
        var res: Object = {
            "res": false,
            "t_code": 0,
            "t_text": "晴",
            "t_max": 27,
            "t_min": 15
        };
        OnFinish(res as IAction.Action.IActionRes);
        return;
    }




