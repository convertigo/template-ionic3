/**
 * Created by charlesg on 10/01/2017.
 */
export interface C8oResponseListener{
}

export class C8oResponseJsonListener implements C8oResponseListener{
    /**
     * Called on c8o call JSON responses.
     *
     * @param response - C8o call response
     * @param parameters - C8o call parameters
     */
    public onJsonResponse: (JSON, Object)=>void

    constructor(onJsonResponse:(JSON, Object)=>void){
        this.onJsonResponse = onJsonResponse
    }
}

export class C8oResponseXmlListener implements C8oResponseListener {
    /**
     * Called on c8o call XML responses.
     *
     * @param response - C8o call response
     * @param parameters - C8o call parameters
     */
    onXmlResponseresponse: (any, parameters: Object) => void

    constructor(onXmlResponseresponse: (any, parameters: Object) => void) {
        this.onXmlResponseresponse = onXmlResponseresponse
    }
}

export class C8oResponseProgressListener implements C8oResponseListener{

    onProgressResponse : (C8oProgress, Object) => void;
    constructor(onProgressResponse: (C8oProgress, Object) => void){
        this.onProgressResponse = onProgressResponse;
    }
}