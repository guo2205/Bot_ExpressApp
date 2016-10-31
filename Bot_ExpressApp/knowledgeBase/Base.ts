import * as Data from "../Data";

export class kBase
{
    private str: string;
    kBase(str)
    {
        this.str = str;
    }
    public fenci(fun: Function)
    {
        var host: string = "http://localhost";
        var path: string = encodeURI("index.aspx?" + this.str);
        Data.Data.httpRequest(host, path, 53802, "GET", {}, {}, function (message) {
            fun(message);
        });
    }
}