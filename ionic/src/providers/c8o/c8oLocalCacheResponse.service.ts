export class C8oLocalCacheResponse{
    private response : string
    private responseType: string
    private expirationDate : number

    constructor(response: string, responseType: string, expirationDate: number){
        this.response = response
        this.responseType = responseType
        this.expirationDate = expirationDate
    }

    isExpired() : boolean{
        if(this.expirationDate <= 0){
            return false
        }
        else{
            let currentDate = new Date().getTime()
            return this.expirationDate < currentDate
        }
    }

    getResponse() : string{
        return this.response
    }

    getResponseType() : string{
        return this.responseType
    }

    getExpirationDate() : number{
        return this.expirationDate
    }
}