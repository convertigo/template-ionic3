import { C8oRouter } from './convertigo.router'
import { NavParams, LoadingController  } from 'ionic-angular';
import { DomSanitizer }          from '@angular/platform-browser';



export class C8oPage {
    public router;
    public navParams;
    private loader;
    private didLoad;
    private imgCache : Object = new Object()
    private prefixId : string;
    public form = {};

    constructor(public routerProvider : C8oRouter, private navParam: NavParams, public loadingCtrl: LoadingController, private sanitizer : DomSanitizer){
	    this.router = routerProvider;
        this.navParams = (navParam.get("navParams") != undefined && navParam.get("navParams") != null) ? navParam.get("navParams") : ""
        this.router.storeResponseForView(this, navParam.get("requestable"), navParam.get("data"), this.navParams, navParam.get("didEnter") ,navParam.get("didLeave"))
        this.prefixId = "_C8o" + new Date().getTime().toString();
    } 
    
    /**
     * Gets the data from previous called requestable list. can be used in an Angular 2 directive such as 
     * 
     *   *ngFor="let category of listen(['fs://.view']).rows" or
     *   *ngFor="let Page2 of listen(['fs://.view', 'fs://.view#search']).rows"
     *   
     * The data for the first requestable to match is returned
     *   
     * @return the data for one of the requestables in the list.  
     */
    public listen(requestables : string[]) : any {
    	return(this.router.getResponseForView(this, requestables));
    }

    /**
     * Gets the data from previous called requestable list. can be used in an Angular 2 directive such as 
     * 
     *   *ngFor="let category of listen(['fs://.view']).rows" or
     *   *ngFor="let Page2 of listen(['fs://.view', 'fs://.view#search']).rows"
     *   
     * The data for the first requestable to match is returned
     *   
     * @return the data for one of the requestables in the list.  
     */
    public listenNavParams(requestable : string) : any {
    	return(this.router.getParamForView(this, requestable));
    }

    /**
     * Calls a Convertigo requestable with parameters as Object
     * 
     * @param	requestable the requestable to call (examples : "Myproject.MySequence" or "fs://MyLocalDataBase.get")
     * @param	data , the data to send to the requestable (for example {"var1" : "value1, ..., "var2" : "value2})
     * 
     */
    public call(requestable, data: any = null, navParams : any = null, timeout : number = 500) {
        if(this.form != {} && data == null){
            data = this.form;
        }
        let shown = false
        let finish = false
        setTimeout(()=> {
            if(finish == false){
                this.loader = this.loadingCtrl.create({
                })
                this.loader.present();
                shown = true
            }
        }, timeout)
        this.router.c8oCall(requestable, data, navParams).then(()=>{
            finish = true
            if(shown == true) {
                this.loader.dismiss();
                shown = false;
            }
        }).catch(()=>{
            finish = true
            if(shown == true) this.loader.dismiss();
        })

    }

    public ionViewDidLoad(){
        
        if(!(this.navParam.get("didLoad") == null || this.navParam.get("didLoad") == undefined || this.navParam.get("didLoad") == '')){
           this.navParam.get("didLoad")(this, this.router.c8o)
        }
    }

    public ionViewWillEnter(){
        if(!(this.navParam.get("willEnter") == null || this.navParam.get("willEnter") == undefined || this.navParam.get("willEnter") == '')){
           this.navParam.get("willEnter")(this, this.router.c8o)
        }
    }

    public ionViewDidEnter(){
        this.didLoad = true; 
        if(!(this.navParam.get("didEnter") == null || this.navParam.get("didEnter") == undefined || this.navParam.get("didEnter") == '')){
           this.navParam.get("didEnter")(this, this.router.c8o)
        }
    }

    public ionViewWillLeave(){
        if(!(this.navParam.get("willLeave") == null || this.navParam.get("willLeave") == undefined || this.navParam.get("willLeave") == '')){
           this.navParam.get("willLeave")(this, this.router.c8o)  
        }
    }

    public ionViewDidLeave(){
        if(!(this.navParam.get("didLeave") == null || this.navParam.get("didLeave") == undefined || this.navParam.get("didLeave") == '')){
           this.navParam.get("didLeave")(this, this.router.c8o)  
        }
    }

    public ionViewWillUnload(){
        if(!(this.navParam.get("willUnLoad") == null || this.navParam.get("willUnLoad") == undefined || this.navParam.get("willUnLoad") == '')){
           this.navParam.get("willUnLoad")(this, this.router.c8o)  
        }
    }

    

    



    /**
     * Get attachment data url a requestable response
     * 
     * @param	requestables, target requestable list to listen to and build attachment urls (examples : "Myproject.MySequence" or "fs://MyLocalDataBase.get")
     * @param	attachmentName , the name of the attachment to get
     * 
     */
    public getAttachmentUrl(id: string, attachmentName: string, placeholderURL : string): Object{
        
        if(id != null){
            if(this.imgCache[id+"/"+attachmentName] == undefined){
                this.imgCache[id+"/"+attachmentName] = placeholderURL
                this.router.c8o.get_attachment(id, attachmentName).then((response)=>{
                    this.imgCache[id+"/"+attachmentName] = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(response))
                })                
            }            
        }
        return this.imgCache[id+"/"+attachmentName]
    }

    public getNextLetter(char: String): String {
        let code: number = char.charCodeAt(0);
        code ++;
        return String.fromCharCode(code);
    }

    public wordPlusOne(word :string) : any{
        if(word != undefined) {
            let word1 = word.slice(0, -1)
            let word2 = this.getNextLetter(word)
            return word1 + word2
        }
        else{
            return {}
        }
    }
    
}



