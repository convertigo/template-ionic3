import {C8o, FullSyncPolicy} from "./c8o.service";
import {C8oResponseListener, C8oResponseJsonListener, C8oResponseXmlListener} from "./c8oResponse.service";
import {C8oUtils} from "./c8oUtils.service";
import {C8oException} from "./Exception/c8oException.service";
import {C8oExceptionMessage} from "./Exception/c8oExceptionMessage.service";
import {FullSyncRequestable} from "./fullSyncRequestable.service";
import {C8oFullSyncDatabase} from "./fullSyncDatabase.service";
import {FullSyncDocumentOperationResponse, FullSyncDefaultResponse} from "./fullSyncResponse.service";
import {C8oFullSyncTranslator} from "./c8oFullSyncTranslator.service";
import {C8oRessourceNotFoundException} from "./Exception/c8oRessourceNotFoundException.service";
import {C8oUnavailableLocalCacheException} from "./Exception/c8oUnavailableLocalCacheException.service";
import {C8oLocalCacheResponse} from "./c8oLocalCacheResponse.service";
import {FullSyncDeleteDocumentParameter} from "./fullSyncDeleteDocumentParameter.service";
import {C8oCouchBaseLiteException} from "./Exception/c8oCouchBaseLiteException.service";

export class C8oFullSync {
    private static FULL_SYNC_URL_PATH : string = "/fullsync/";
    /**
     * The project requestable value to execute a fullSync request.
     */
    public static FULL_SYNC_PROJECT  : string= "fs://";
    public static FULL_SYNC__ID  : string = "_id";
    public static FULL_SYNC__REV  : string = "_rev";
    public static FULL_SYNC__ATTACHMENTS : string = "_attachments";

    c8o : C8o;
    protected fullSyncDatabaseUrlBase : string;
    protected localSuffix : string;

    public constructor(c8o : C8o){
        this.c8o = c8o;
        this.fullSyncDatabaseUrlBase = c8o.endpointConvertigo + C8oFullSync.FULL_SYNC_URL_PATH;
        this.localSuffix = (c8o.fullSyncLocalSuffix != null) ? c8o.fullSyncLocalSuffix : "_device";
    }

    /**
     * Handles a fullSync request.<br/>
     * It determines the type of the request thanks to parameters.
     *
     * @param parameters
     * @param listener
     * @return promise<any>
     * @throws C8oException
     */
    public handleFullSyncRequest(parameters : Object, listener : C8oResponseListener) : Promise<any>{
        let params = (JSON.parse(JSON.stringify(parameters)));
        let projectParameterValue : string = C8oUtils.peekParameterStringValue(params, C8o.ENGINE_PARAMETER_PROJECT, true);
        if(!projectParameterValue.startsWith(C8oFullSync.FULL_SYNC_PROJECT)){
            throw new C8oException(C8oExceptionMessage.invalidParameterValue(projectParameterValue, "its don't start with" + C8oFullSync.FULL_SYNC_PROJECT))
        }
        let fullSyncRequestableValue : string = C8oUtils.peekParameterStringValue(params, C8o.ENGINE_PARAMETER_SEQUENCE, true);

        // get rid of the optional trailing #RouteHint present in the sequence
        if (fullSyncRequestableValue.indexOf("#") != -1)
            fullSyncRequestableValue = fullSyncRequestableValue.substring(0, fullSyncRequestableValue.indexOf("#"))

        let fullSyncRequestable : FullSyncRequestable = FullSyncRequestable.getFullSyncRequestable(fullSyncRequestableValue)
        if(fullSyncRequestable == null){
            throw new C8oException(C8oExceptionMessage.invalidParameterValue(C8o.ENGINE_PARAMETER_PROJECT, C8oExceptionMessage.unknownValue("fullSync requestable", fullSyncRequestableValue)))
        }
        let databaseName : string = projectParameterValue.substring(C8oFullSync.FULL_SYNC_PROJECT.length)
        if(databaseName.length < 1){
            databaseName = this.c8o.defaultDatabaseName
            if(databaseName == null){
                throw new C8oException(C8oExceptionMessage.invalidParameterValue(C8o.ENGINE_PARAMETER_PROJECT, C8oExceptionMessage.missingValue("fullSync database name")))
            }
        }

        var response : any
        return new Promise((resolve, reject)=>{
            fullSyncRequestable.handleFullSyncRequest(this, databaseName, parameters, listener).then((result)=>{
                response = result
                if(response == null){
                    reject(new C8oException(C8oExceptionMessage.couchNullResult()))
                }
                resolve(this.handleFullSyncResponse(response, listener))
            }).catch((error)=>{
                if(error instanceof C8oException){
                    reject(error)
                }
                else{
                    reject(new C8oException(C8oExceptionMessage.FullSyncRequestFail(), error))
                }
            })
        })
    }

    /**
     *
     * @param response
     * @param listener
     * @return response
     * @throws C8oException Failed to parse response to JSON or XML.
     */
    handleFullSyncResponse(response: any, listener: C8oResponseListener) : any{
        return response
    }

    /**
     * Checks if request parameters correspond to a fullSync request.
     */
    static isFullSyncRequest(requestParameter : Object) : boolean{
        if(C8oUtils.getParameterStringValue(requestParameter, C8o.ENGINE_PARAMETER_PROJECT, false) != null){
            return C8oUtils.getParameterStringValue(requestParameter, C8o.ENGINE_PARAMETER_PROJECT, false).startsWith(C8oFullSync.FULL_SYNC_PROJECT)
        }
        return false
    }

}

export class C8oFullSyncCbl extends C8oFullSync{
    private static ATTACHMENT_PROPERTY_KEY_CONTENT_URL : string = "content_url"
    private fullSyncDatabases: Object;

    constructor(c8o : C8o){
        super(c8o);
        this.fullSyncDatabases =  new Object()
    }

    /**
     * Returns the database with this name in the list.<br/>
     * If it does not already exist yet then creates it and adds it to the list.
     *
     * @param databaseName
     * @return C8oFullSyncDatabase
     * @throws C8oException Failed to create a new fullSync database.
     */
    public getOrCreateFullSyncDatabase(databaseName : string) : C8oFullSyncDatabase{
        let localDatabaseName : string = databaseName + this.localSuffix;

        if(this.fullSyncDatabases[localDatabaseName] == null){
            this.fullSyncDatabases[localDatabaseName] =  new C8oFullSyncDatabase(this.c8o, databaseName, this.fullSyncDatabaseUrlBase, this.localSuffix)
        }
        return this.fullSyncDatabases[localDatabaseName];
    }


    handleFullSyncResponse(response: any, listener: C8oResponseListener) : any{
        response = super.handleFullSyncResponse(response, listener)
        if(typeof(response) == 'void' ){
            return response
        }
        if(listener instanceof C8oResponseJsonListener){
            if(response instanceof FullSyncDocumentOperationResponse){
                return C8oFullSyncTranslator.fullSyncDocumentOperationResponseToJson(response as FullSyncDocumentOperationResponse)
            }
            else if(response instanceof FullSyncDefaultResponse){
                return C8oFullSyncTranslator.fullSyncDefaultResponseToJson(response as FullSyncDefaultResponse)
            }
            else if(typeof response == 'JSON'){
                return response
            }
            else if(response instanceof Object){
                return response as JSON
            }

            else{
                throw new C8oException(C8oExceptionMessage.illegalArgumentIncompatibleListener(listener.toString(), typeof response))
            }
        }
        else if (listener instanceof C8oResponseXmlListener){
            throw new C8oException(C8oExceptionMessage.unhandledListenerType(typeof listener))
        }


    }

    //DONE class C8oFullSyncCbl : function handleGetAttachmentUrlRequest
    handleGetAttachmentUrlRequest(fullSyncDatabaseName: string, docid: string, parameters: Object) : Promise<any>{
        var fullSyncDatabase : C8oFullSyncDatabase = null;
        fullSyncDatabase = this.getOrCreateFullSyncDatabase(fullSyncDatabaseName);
        let attachmentnName = C8oUtils.getParameterStringValue(parameters, "attachment_name", false)
        return new Promise((resolve, reject)=>{
            fullSyncDatabase.getdatabase.getAttachment(docid, attachmentnName).then((buffer)=>{
                resolve(buffer);
            })
        })
    }


    //DONE class C8oFullSyncCbl: function handleGetDocumentRequest
    handleGetDocumentRequest(fullSyncDatabaseName: string, docid: string, parameters: Object) : Promise<any>{
        var fullSyncDatabase : C8oFullSyncDatabase = null
        var dictDoc : Object = new Object();
        let param : Object
        param = parameters["attachments"] ? {'attachments': true} : {};
        parameters["binary"] ? param["binary"] = true : {};


        fullSyncDatabase = this.getOrCreateFullSyncDatabase(fullSyncDatabaseName);
        return new Promise((resolve, reject)=> {
            fullSyncDatabase.getdatabase.get(docid,param).then((document)=> {
                if(document != null){
                    dictDoc =  document
                    var attachments = document[C8oFullSync.FULL_SYNC__ATTACHMENTS];
                    if(attachments != null){

                        for(var attachmentName of attachments){
                            let url = attachments['url']
                            var attachementDesc: Object = attachments[attachmentName]
                            attachementDesc[C8oFullSyncCbl.ATTACHMENT_PROPERTY_KEY_CONTENT_URL] =  url.toString()
                            var dictAny : Object = new Object();
                            dictAny[attachmentName] = attachementDesc
                            dictDoc[C8oFullSyncCbl.FULL_SYNC__ATTACHMENTS] =  dictAny

                        }
                    }
                }
                else{
                    throw new C8oRessourceNotFoundException((C8oExceptionMessage.ressourceNotFound("requested document \"" + docid + "\"")));
                }
                if(dictDoc == null){
                    dictDoc = new Object()
                }
                resolve(dictDoc)
            })
                .catch((error)=>{
                    reject(error)
                })

        })
    }
    //DONE class C8oFullSyncCbl: function handleDeleteDocumentRequest
    handleDeleteDocumentRequest(DatabaseName : string, docid : string, parameters : Object) : Promise<any>{
        var fullSyncDatabase : C8oFullSyncDatabase = null;

        fullSyncDatabase = this.getOrCreateFullSyncDatabase(DatabaseName);
        let revParameterValue : string = C8oUtils.getParameterStringValue(parameters, FullSyncDeleteDocumentParameter.REV.name, false)
        let documentRevision : string
        if(revParameterValue == null){
            return new Promise((resolve, reject)=> {
                fullSyncDatabase.getdatabase.get(docid).then((doc)=> {
                    if(doc == null){
                        throw new C8oRessourceNotFoundException(C8oExceptionMessage.toDo());
                    }
                    documentRevision = doc._rev
                    return fullSyncDatabase.getdatabase.remove(doc);
                }).then((result)=> {
                    resolve(new FullSyncDocumentOperationResponse(docid, documentRevision, result.ok));
                }).catch((err) =>{
                    reject(new C8oException(C8oExceptionMessage.couchRequestDeleteDocument(), err));
                });
            })
        }
        else{
            return new Promise((resolve, reject)=> {
                fullSyncDatabase.getdatabase.remove(docid, revParameterValue)
                    .then((result)=> {
                        resolve(new FullSyncDocumentOperationResponse(docid, documentRevision, result.ok));
                    }).catch((err) =>{
                    reject(new C8oException(C8oExceptionMessage.couchRequestDeleteDocument(), err));
                });
            })

        }
    }

    //DONE class C8oFullSyncCbl: function handlePostDocumentRequest
    handlePostDocumentRequest(databaseName: string, fullSyncPolicy: FullSyncPolicy, parameters: Object) : Promise<FullSyncDocumentOperationResponse> {
        var fullSyncDatabase : C8oFullSyncDatabase = null
        fullSyncDatabase = this.getOrCreateFullSyncDatabase(databaseName);

        var subkeySeparatorParameterValue: string = C8oUtils.getParameterStringValue(parameters, C8o.FS_SUBKEY_SEPARATOR, false)
        if (subkeySeparatorParameterValue == null) {
            subkeySeparatorParameterValue = "."
        }

        var newProperties = new Object();

        for(var i = 0; i<Object.keys(parameters).length; i++) {

            var parameterName: string = Object.keys(parameters)[i];


            if(!parameterName.startsWith("__") && !parameterName.startsWith("_use_")){
                var objectparameterValue : any = parameters[Object.keys(parameters)[i]]
                let paths : Array<string> = parameterName.split(subkeySeparatorParameterValue);
                if(paths.length > 1){
                    parameterName = paths[0]

                    let count = paths.length - 1

                    while(count>0){
                        let tmpObject : Object = new Object()
                        tmpObject[paths[count]] =  objectparameterValue;
                        objectparameterValue = tmpObject
                        count --
                    }
                    let existProperty = newProperties[parameterName]
                    if(existProperty != null){
                        C8oFullSyncCbl.mergeProperties(objectparameterValue, existProperty);
                    }
                }

                newProperties[parameterName] =  objectparameterValue;
            }


        }

        var db = fullSyncDatabase.getdatabase
        return new Promise((resolve, reject)=>{
            fullSyncPolicy.action(db,  newProperties).then((createdDocument)=>{
                let fsDocOpeResp : FullSyncDocumentOperationResponse = new FullSyncDocumentOperationResponse(createdDocument.id, createdDocument.rev, createdDocument.ok)
                resolve(fsDocOpeResp)
            }).catch((error)=>{
                reject(error)
            })
        })

    }

    //DONE class C8oFullSyncCbl: function handlePutAttachmentRequest
    handlePutAttachmentRequest(databaseName : string, docid : string, attachmentName : string, attachmentType : string, attachmentContent : MSStream) : Promise<any> {
        var document : any = null
        let fullSyncDatabase : C8oFullSyncDatabase = this.getOrCreateFullSyncDatabase(databaseName)

        return new Promise((resolve)=> {
            fullSyncDatabase.getdatabase.get(docid).then((result)=> {
                document = result;

                if(document != null){
                    fullSyncDatabase.getdatabase.putAttachment(docid, attachmentName, attachmentContent, attachmentType)
                        .then((result)=> {
                            // handle result
                            resolve(new FullSyncDocumentOperationResponse(result._id, result._rev, result.ok));
                        }).catch((err)=> {
                        throw new C8oCouchBaseLiteException("Unable to put the attachment " + attachmentName + " to the document " + docid + ".", err)
                    });

                }else{
                    throw new C8oRessourceNotFoundException(C8oExceptionMessage.toDo())
                }

            })
        })


    }

    //DONE class C8oFullSyncCbl: function handleDeleteAttachmentRequest
    handleDeleteAttachmentRequest(databaseName: string, docid: string, attachmentName: string) : Promise<any>{
        var document : any = null
        let fullSyncDatabase : C8oFullSyncDatabase = this.getOrCreateFullSyncDatabase(databaseName)

        return new Promise((resolve)=> {
            fullSyncDatabase.getdatabase.get(docid).then((result) =>{
                document = result
            }).then(()=> {
                if(document != null){
                    fullSyncDatabase.getdatabase.removeAttachment(docid, attachmentName, document._rev).catch((err)=> {
                        throw new C8oCouchBaseLiteException("Unable to delete the attachment " + attachmentName + " to the document " + docid + ".", err)
                    })
                }
                else{
                    throw new C8oRessourceNotFoundException(C8oExceptionMessage.toDo())
                }
                resolve(new FullSyncDocumentOperationResponse(document._id, document._rev, true));
            })
        })
    }

    //DONE class C8oFullSyncCbl: function handleAllDocumentsRequest
    public handleAllDocumentsRequest(databaseName: string, parameters: Object) : Promise<any>{
        var fullSyncDatabase = null

        fullSyncDatabase = this.getOrCreateFullSyncDatabase(databaseName)
        return new Promise((resolve, reject)=>{
            fullSyncDatabase.getdatabase
                .allDocs(parameters
                ).then((res)=> {
                resolve(res);
            }).catch((err)=> {
                reject(new C8oException("TODO"))
            })
        })


    }

    //DONE class C8oFullSyncCbl: function handleGetViewRequest
    handleGetViewRequest(databaseName : string, ddocName : string, viewName: string, parameters: Object):Promise<any>{
        var fullSyncDatabase = null
        fullSyncDatabase = this.getOrCreateFullSyncDatabase(databaseName)
        let attachments;
        let binary;
        let include_docs;
        if(parameters["attachments"] && window["cblite"] != undefined){
            attachments = C8oUtils.getParameterStringValue(parameters, "attachments", false)
            binary = C8oUtils.getParameterStringValue(parameters, "binary", false)
            include_docs = C8oUtils.getParameterStringValue(parameters, "include_docs", false)
        }



        return new Promise((resolve, reject) =>{
            fullSyncDatabase.getdatabase.query(ddocName + "/"  + viewName, parameters)
                .then((result)=> {
                    if(attachments){
                        let array : Array<Object> = new Array()
                        let len = 0
                        for(var resp of result.rows){
                            this.handleGetDocumentRequest(databaseName, resp.id,{'attachments': true, "binary":true, 'include_docs' : true} ).then((getresult)=>{
                                array.push(getresult)
                                len ++
                                if(len == result.rows.length){
                                    result.rows = array
                                    resolve(result)
                                }
                            })
                        }
                    }
                    else{
                        resolve(result)
                    }

                }).catch((err)=> {
                reject(new C8oException(C8oExceptionMessage.couchRequestGetView()))
            })
        })

    }
    //DONE class C8oFullSyncCbl: function handleSyncRequest
    handleSyncRequest(databaseName: string, parameters : Object, c8oResponseListener : C8oResponseListener) : Promise<any> {
        let fullSyncDatabase :  C8oFullSyncDatabase = this.getOrCreateFullSyncDatabase(databaseName)
        return fullSyncDatabase.startAllReplications(parameters, c8oResponseListener)
    }

    //DONE class C8oFullSyncCbl: function handleReplicatePullRequest
    handleReplicatePullRequest(databaseName: string, parameters: Object, c8oResponseListener : C8oResponseListener) : Promise<any>{
        let fullSyncDatabase :  C8oFullSyncDatabase = this.getOrCreateFullSyncDatabase(databaseName)
        return fullSyncDatabase.startPullReplication(parameters, c8oResponseListener)
    }

    //DONE class C8oFullSyncCbl: function handleReplicatePushRequest
    handleReplicatePushRequest(databaseName: string, parameters: Object, c8oResponseListener : C8oResponseListener) : Promise<any> {
        let fullSyncDatabase :  C8oFullSyncDatabase = this.getOrCreateFullSyncDatabase(databaseName)
        return fullSyncDatabase.startPushReplication(parameters, c8oResponseListener)
    }

    //DONE class C8oFullSyncCbl: function handleResetDatabaseRequest
    handleResetDatabaseRequest(databaseName : string) : Promise<FullSyncDefaultResponse>{
        return new Promise((resolve, reject)=>{
            this.handleDestroyDatabaseRequest(databaseName).then((response: any)=>{

                resolve(this.handleCreateDatabaseRequest(databaseName))

            })
        })


    }

    //DONE class C8oFullSyncCbl: function handleCreateDatabaseRequest
    handleCreateDatabaseRequest(databaseName : string): FullSyncDefaultResponse{
        this.getOrCreateFullSyncDatabase(databaseName)
        return new FullSyncDefaultResponse(true)
    }

    //DONE class C8oFullSyncCbl: function handleCreateDatabaseRequest
    handleDestroyDatabaseRequest(databaseName: string): Promise<FullSyncDefaultResponse>{
        return new Promise((resolve, reject)=>{
            let localDatabaseName = databaseName + this.localSuffix
            this.getOrCreateFullSyncDatabase(databaseName).deleteDB().then((response)=>{
                if(this.fullSyncDatabases[localDatabaseName] !=  null){
                    delete this.fullSyncDatabases[localDatabaseName]
                }
                resolve(new FullSyncDefaultResponse(response.ok))
            }).catch((err)=>{
                reject(new C8oException("TODO", err))
            })
        })
    }

    //LATER class C8oFullSyncCbl: function compileView
    /*private compileView(db: any, viewName: string, viewProps: Object): any{
     throw new Error("TODO: class C8oFullSyncCbl: function compileView")
     }

     //LATER class C8oFullSyncCbl: function checkAndCreateJavaScriptView
     private checkAndCreateJavaScriptView(database: any, ddocName: string, viewName: string): any{
     throw new Error("TODO: C8oFullSyncCbl: function checkAndCreateJavaScriptView")
     }*/

    //LATER class C8oFullSyncCBL: function addParametersToQuery
    /*private static addParametersToQuery(query: any, parameters : Object){
     throw new Error("TODO: C8oFullSyncCbl: function addParametersToQuery")
     }*/

    //DONE class C8oFullSyncCBL-> mergeProperties
    static mergeProperties(newProperties: Object, oldProperties: Object){
        for(var i = 0; i< Object.keys(oldProperties).length; i++){
            let oldPropertyKey : any = Object.keys(oldProperties)[i]
            let oldPropertyValue : any = oldProperties[Object.keys(oldProperties)[i]]

            if(newProperties[oldPropertyKey] != null && newProperties[oldPropertyKey] != undefined){
                if(newProperties[oldPropertyKey] instanceof Object && oldPropertyValue instanceof Object){
                    C8oFullSyncCbl.mergeArrayProperties(newProperties[oldPropertyKey], oldPropertyValue)
                }
                else{

                }
            }
            else{
                newProperties[oldPropertyKey] =  oldPropertyValue
            }
        }

    }
    //DONE class C8oFullSyncCBL-> mergeArrayProperties
    static mergeArrayProperties( newArray : any, oldArray: any){
        let newArraySize = newArray.length
        let oldArraySize = oldArray.length
        for(var i=0; i< oldArraySize; i++){
            var newArrayValue : any = null
            if(i< newArraySize){
                newArrayValue = newArray[i]
            }
            let oldArrayValue = oldArray[i]

            if(newArrayValue != null){
                if(typeof newArrayValue == 'Object' && typeof oldArrayValue == 'Object'){
                    C8oFullSyncCbl.mergeProperties(newArrayValue, oldArrayValue)

                }
                else if(typeof newArrayValue == 'Array' && typeof oldArrayValue == 'Array'){
                    C8oFullSyncCbl.mergeArrayProperties(newArrayValue, oldArrayValue)
                }
                else{

                }
            }
            else{
                newArray.add(oldArrayValue)
            }
        }
    }

    //DONE class C8oFullSyncCBL->getDocucmentFromDatabase
    getDocucmentFromDatabase(c8o: C8o, databaseName: string, documentId: string) : Promise<any>{
        var c8oFullSyncDatabase: C8oFullSyncDatabase
        try {
            c8oFullSyncDatabase = this.getOrCreateFullSyncDatabase(databaseName)
        }
        catch(err){
            throw new C8oException(C8oExceptionMessage.fullSyncGetOrCreateDatabase(databaseName))
        }

        return new Promise((resolve)=> {
            c8oFullSyncDatabase.getdatabase().get(documentId).then((result)=> {
                resolve(result);
            })
        })
    }

    //DONE class C8oFullSyncCBL->overrideDocument but change sign cause need databaseName
    overrideDocument(document: any, properties: Object, databaseName){
        properties[C8oFullSync.FULL_SYNC__REV] =  document._rev
        var c8oFullSyncDatabase: C8oFullSyncDatabase
        try {
            c8oFullSyncDatabase = this.getOrCreateFullSyncDatabase(databaseName)
        }
        catch(err){
            throw new C8oException(C8oExceptionMessage.fullSyncGetOrCreateDatabase(databaseName))
        }


        c8oFullSyncDatabase.getdatabase().put(properties).catch((err)=> {
            throw new C8oException("TODO");
        })

    }

    //DONE class C8oFullSyncCBL->getResponseFromLocalCache
    getResponseFromLocalCache(c8oCallRequestIdentifier: string): Promise<any> {

        let fullSyncDatabase = this.getOrCreateFullSyncDatabase(C8o.LOCAL_CACHE_DATABASE_NAME)
        var localCacheDocument = null
        return new Promise((resolve)=> {
            fullSyncDatabase.getdatabase.get(c8oCallRequestIdentifier).then((result)=> {
                localCacheDocument = result
                if (localCacheDocument == null) {
                    throw new C8oUnavailableLocalCacheException(C8oExceptionMessage.localCacheDocumentJustCreated())
                }

                let response = localCacheDocument.get(C8o.LOCAL_CACHE_DOCUMENT_KEY_RESPONSE)
                let responseType = localCacheDocument.get(C8o.LOCAL_CACHE_DOCUMENT_KEY_RESPONSE_TYPE)
                let expirationDate = localCacheDocument.get(C8o.LOCAL_CACHE_DOCUMENT_KEY_EXPIRATION_DATE)

                var responseString: string = null
                var responseTypeString: string = null
                var expirationDateNumber: number = -1

                if (response != null) {
                    if (typeof response == 'string') {
                        responseString = response
                    }
                    else {
                        throw new C8oException(C8oExceptionMessage.InvalidLocalCacheResponseInformation())
                    }
                }
                if (responseType != null) {
                    if (typeof responseType == 'string') {
                        responseTypeString = responseType
                    }
                    else {
                        throw new C8oException(C8oExceptionMessage.InvalidLocalCacheResponseInformation())
                    }
                }
                if (expirationDate != null) {
                    if (typeof expirationDate == 'number') {
                        expirationDateNumber = expirationDate
                        let currentTime = new Date().getTime()
                        if (expirationDateNumber < currentTime) {
                            throw new C8oUnavailableLocalCacheException(C8oExceptionMessage.timeToLiveExpired())
                        }
                    }
                    else {
                        throw new C8oException(C8oExceptionMessage.InvalidLocalCacheResponseInformation())
                    }
                }
                resolve(new C8oLocalCacheResponse(responseString, responseTypeString, expirationDateNumber))
            })
        })


    }

    //DONE class C8oFullSyncCBL->saveResponseToLocalCache
    saveResponseToLocalCache(c8oCallRequestIdentifier: string, localCacheResponse: C8oLocalCacheResponse) : Promise<any>{
        let fullSyncDatabase : C8oFullSyncDatabase = this.getOrCreateFullSyncDatabase(C8o.LOCAL_CACHE_DATABASE_NAME)
        return new Promise((resolve, reject)=>{
            fullSyncDatabase.getdatabase.get(c8oCallRequestIdentifier).then((localCacheDocument)=> {
                var properties = new Object();
                properties[C8o.LOCAL_CACHE_DOCUMENT_KEY_RESPONSE] =  localCacheResponse.getResponse()
                properties[C8o.LOCAL_CACHE_DOCUMENT_KEY_RESPONSE_TYPE] =  localCacheResponse.getResponseType()
                if(localCacheResponse.getExpirationDate() > 0){
                    properties[C8o.LOCAL_CACHE_DOCUMENT_KEY_EXPIRATION_DATE] = localCacheResponse.getExpirationDate()
                }
                let currentRevision = localCacheDocument._rev
                if(currentRevision != null){
                    properties[C8oFullSyncCbl.FULL_SYNC__REV] = currentRevision
                }
                fullSyncDatabase.getdatabase.put(properties).then((result)=>{
                    resolve(result)
                })

            })
        })

    }
}