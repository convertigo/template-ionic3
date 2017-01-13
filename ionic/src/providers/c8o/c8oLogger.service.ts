import {Injectable} from "@angular/core";
import {C8oLogLevel} from "./c8oLogLevel.service";
import {C8o} from "./c8o.service";
import {C8oException} from "./Exception/c8oException.service";
import {C8oExceptionMessage} from "./Exception/c8oExceptionMessage.service";
import {Queue} from "./c8oUtils.service";
@Injectable()
export class C8oLogger {

    // *** Constants ***//
    //private static LOG_TAG: string = "c8o";
    private static LOG_INTERNAL_PREFIX: string = "[c8o] ";

    static REMOTE_LOG_LIMIT: number = 100;

    private static JSON_KEY_REMOTE_LOG_LEVEL: string = "remoteLogLevel";
    private static JSON_KEY_TIME: string = "time";
    private static JSON_KEY_LEVEL: string = "level";
    private static JSON_KEY_MESSAGE: string = "msg";
    private static JSON_KEY_LOGS: string = "logs";
    private static JSON_KEY_ENV: string = "env";

    /** Attributes */

    private remoteLogUrl: string;
    private remoteLogs: Queue<JSON>;
    private alreadyRemoteLogging: boolean[];
    private remoteLogLevel: C8oLogLevel;
    private uidRemoteLogs: string;
    private startTimeRemoteLog: number;

    private c8o: C8o

    private env: string
    constructor(c8o: C8o) {
        this.c8o = c8o;

        this.remoteLogUrl = c8o.endpointConvertigo + "/admin/services/logs.Add"
        this.remoteLogs = new Queue<JSON>();
        this.alreadyRemoteLogging = new Array<boolean>();
        this.alreadyRemoteLogging.push(false);

        this.remoteLogLevel = C8oLogLevel.TRACE;
        this.startTimeRemoteLog = new Date().getTime();
        this.uidRemoteLogs =  Math.round((new Date().getTime() * Math.random())).toString(36);
        var obj = {};
        obj["uid"] = this.uidRemoteLogs.toUpperCase();
        obj["uuid"] = C8o.deviceUUID.toUpperCase();
        obj["project"] = encodeURIComponent(c8o.endpointProject.toString());
        this.env = JSON.stringify(obj);
    }

    private isLoggableRemote(logLevel: C8oLogLevel): boolean {
        return this.c8o.logRemote && logLevel != null && C8oLogLevel.TRACE.priority <= this.remoteLogLevel.priority && this.remoteLogLevel.priority <= logLevel.priority;
    }

    private isLoggableConsole(logLevel: C8oLogLevel): boolean {
        return logLevel != null && C8oLogLevel.TRACE.priority <= this.c8o.logLevelLocal.priority && this.c8o.logLevelLocal.priority <= logLevel.priority;
    }

    public canLog(logLevel: C8oLogLevel): boolean {
        return this.isLoggableConsole(logLevel) || this.isLoggableRemote(logLevel);
    }

    public get isFatal(): boolean {
        return this.canLog(C8oLogLevel.FATAL);
    }
    public get isError(): boolean {
        return this.canLog(C8oLogLevel.ERROR);
    }
    public get isWarn(): boolean {
        return this.canLog(C8oLogLevel.WARN);
    }
    public get isInfo(): boolean {
        return this.canLog(C8oLogLevel.INFO);
    }
    public get isDebug(): boolean {
        return this.canLog(C8oLogLevel.DEBUG);
    }
    public get isTrace(): boolean {
        return this.canLog(C8oLogLevel.TRACE);
    }

    private log(logLevel: C8oLogLevel, message: string, exception: Error) {
        let isLogConsole: boolean = this.isLoggableConsole(logLevel);
        let isLogRemote: boolean = this.isLoggableRemote(logLevel);

        if (isLogConsole || isLogRemote) {
            if (exception != null) {
                message += "\n" + exception.toString();
            }

            let time: string = (((new Date().getTime().valueOf()) - (this.startTimeRemoteLog)) /1000).toString();
            if (isLogRemote) {
                var obj = {};
                obj[(C8oLogger.JSON_KEY_TIME.valueOf())] =  time;
                obj[(C8oLogger.JSON_KEY_LEVEL.valueOf())] =  logLevel.name;
                obj[(C8oLogger.JSON_KEY_MESSAGE.valueOf())] =  message.toString();
                let objJson: JSON = <JSON>obj;
                this.remoteLogs.push(objJson);
                this.logRemote();

            }
            if (isLogConsole) {
                console.log("(" + time + ") [" + logLevel.name + "] " + message);
            }
        }
    }

    public fatal(message: string, exceptions: Error = null) {
        this.log(C8oLogLevel.FATAL, message, exceptions);
    }

    public error(message: string, exceptions: Error = null) {
        this.log(C8oLogLevel.ERROR, message, exceptions);
    }

    public warn(message: string, exceptions: Error = null) {
        this.log(C8oLogLevel.WARN, message, exceptions);
    }

    public info(message: string, exceptions: Error = null) {
        this.log(C8oLogLevel.INFO, message, exceptions);
    }

    public debug(message: string, exceptions: Error = null) {
        this.log(C8oLogLevel.DEBUG, message, exceptions);
    }

    public trace(message: string, exceptions: Error = null) {
        this.log(C8oLogLevel.TRACE, message, exceptions);
    }

    private _log(logLevel: C8oLogLevel, messages: string, exceptions: Error = null) {
        if (this.c8o.logC8o) {
            this.log(logLevel, C8oLogger.LOG_INTERNAL_PREFIX.toString() + messages.toString(), exceptions);
        }
    }

    /*private _fatal(message: string, exceptions: Error = null) {
     this._log(C8oLogLevel.FATAL, message, exceptions);
     }

     private _error(message: string, exceptions: Error = null) {
     this._log(C8oLogLevel.ERROR, message, exceptions);
     }

     private _warn(message: string, exceptions: Error = null) {
     this._log(C8oLogLevel.WARN, message, exceptions);
     }

     private _info(message: string, exceptions: Error = null) {
     this._log(C8oLogLevel.INFO, message, exceptions);
     }*/

    _debug(message: string, exceptions: Error = null) {
        this._log(C8oLogLevel.DEBUG, message, exceptions);
    }

    private _trace(message: string, exceptions: Error = null) {
        this._log(C8oLogLevel.TRACE, message, exceptions);
    }

    logRemote() {

        var canLog: boolean = false;
        canLog =  this.remoteLogs.count() > 0; //!this.alreadyRemoteLogging[0] &&
        if (canLog) {
            this.alreadyRemoteLogging[0] = true;
        }

        if (canLog) {
            // We're using Angular Http provider to request the data,
            // then on the response it'll map the JSON data to a parsed JS object.
            // Next we process the data and resolve the promise with the new data.
            //"/admin/services/logs.Add";
            var count: number = 0;
            let listSize: number = <number>this.remoteLogs.count();
            var logsArray = new Array<JSON>();
            while (count < listSize && count < C8oLogger.REMOTE_LOG_LIMIT) {
                logsArray.push(this.remoteLogs.pop());
                count += 1;
            }
            let parameters : Object = {};
            parameters[C8oLogger.JSON_KEY_LOGS.valueOf()] = JSON.stringify(logsArray)
            parameters[C8o.ENGINE_PARAMETER_DEVICE_UUID] = this.c8o.deviceUUID
            parameters[C8oLogger.JSON_KEY_ENV] = this.env


            this.c8o.httpInterface.handleRequest(this.remoteLogUrl, parameters)
                .then((response)=>{

                    var logLevelResponse = response[C8oLogger.JSON_KEY_REMOTE_LOG_LEVEL.toString()];
                    if (logLevelResponse != null) {
                        let logLevelResponseStr: string = logLevelResponse.toString();
                        let c8oLogLevel = C8oLogLevel.getC8oLogLevel(logLevelResponseStr);

                        if (c8oLogLevel != null) {
                            this.remoteLogLevel = c8oLogLevel;
                        }

                        this.alreadyRemoteLogging[0] = false;
                        this.logRemote();


                    }
                })
                .catch((error)=>{
                    this.c8o.logRemote = false
                    if(this.c8o.logOnFail != null){
                        this.c8o.logOnFail(new C8oException(C8oExceptionMessage.RemoteLogFail(), error), null)
                    }
                })
        }
    }


    logMethodCall(methodName: string, ...parameters: any[]) {
        if (this.c8o.logC8o && this.isDebug) {
            var methodCallLogMessage: string = "Method call : " + methodName
            if(parameters == null || Object.keys(parameters).length == 0){
                this._debug(methodCallLogMessage);
            }

            if(this.isTrace){
                methodCallLogMessage += ", Parameters : ["
                for(var param of parameters){
                    let paramStr = "null"
                    if(parameters != null){
                        paramStr = JSON.stringify(param);
                    }
                    methodCallLogMessage += "\n" + paramStr + ", "
                }

                //Remove the last character
                methodCallLogMessage = methodCallLogMessage.substring(0, methodCallLogMessage.length -2) + "]"

                this._trace(methodCallLogMessage)
            }
            else{
                this._debug(methodCallLogMessage)
            }
        }
    }

    logC8oCall(url: string, parameters: any) {
        if (this.c8o.logC8o && this.isDebug) {
            var c8oCallLogMessage: string = "C8o call : " + url;

            if (parameters.length > 0) {
                c8oCallLogMessage += "\n" + String(parameters);
            }

            this._debug(c8oCallLogMessage);
        }
    }


    logC8oCallJSONResponse(response: JSON, url: string, parameters: any) {
        this.logC8oCallResponse(JSON.stringify(response), "JSON", url, parameters);
    }

    logC8oCallXMLResponse(response: Document, url: string, parameters : Object) {
        this.logC8oCallResponse(response.toString(), "XML", url, parameters);
    }

    logC8oCallResponse(responseStr: string, responseType: string, url: string, parameters: any) {
        if (this.c8o.logC8o && this.isTrace) {
            var c8oCallResponseLogMessage: string;
            if (url == null) {
                c8oCallResponseLogMessage = "C8o call " + responseType + " response : ";
            } else {
                c8oCallResponseLogMessage = "C8o call " + responseType + " response : " + url;
            }

            if (parameters.count > 0) {
                c8oCallResponseLogMessage += "\n" + parameters.toString();
            }

            c8oCallResponseLogMessage += "\n" + responseStr;

            this._trace(c8oCallResponseLogMessage);
        }
    }
}