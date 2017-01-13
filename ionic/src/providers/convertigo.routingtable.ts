
import { C8oPage } from './convertigo.page';
import {C8o} from "./c8o/c8o.service";


export class C8oRouteOptions{
    //protected _requestable: string
    protected _condition : C8oConditionFunction
    protected _target : C8oTarget
    protected _beforeCall : C8oCallFunction
    protected _afterCall : C8oCallFunction
    protected _didLoad : C8oLifeCycleFunction
    protected _willEnter : C8oLifeCycleFunction
    protected _didEnter : C8oLifeCycleFunction
    protected _willLeave : C8oLifeCycleFunction
    protected _didLeave : C8oLifeCycleFunction
    protected _willUnLoad : C8oLifeCycleFunction

    //target
    protected _page : typeof C8oPage
    protected _action : C8oAction
    protected _alwaysNewPage : boolean
    
    //taget options
    protected _animate : boolean
    protected _animation : string
    protected _direction : string
    protected _duration : number
    protected _easing : string

    //toast options
    protected _toastMessage : string;
    protected _toastDuration : number;
    protected _toastPosition : string;
    protected _toastCssClass : string;
    protected _toastShowCloseButton : boolean;
    protected _toastCloseButtonText : string;
    protected _toastDismissOnPageChange : boolean;


    /**
     * C8oRouteOptions constructor
     *  
     */
    constructor(c8oTableOptions?: C8oRouteOptions){
        this.clone(c8oTableOptions)
    }


    /*** CONDITION***/

    /**
     * This function return condition:
     * 
     * @returns     The current condition
     *  
     */
    public get condition():C8oConditionFunction{
        return this._condition;
    }

    /*** TARGET***/

    /**
     * This function return target:
     * 
     * @returns     The current target
     *  
     */
    public get target():C8oTarget{
        return new C8oTarget(this._page, this._action, this._alwaysNewPage)
    }

    /**
     * This function set the target:
     * 
     * @param page	The target for this route
     * @param action      The condition to trigger route (examples : (data :any )=>{
     *                                                                      if(data.rows != undefined){
     *                                                                      return true;
     *                                                                      }
     *                                                                       else{
     *                                                                           return false;
     *                                                                       }   
     *                                                                   }
     * @param alwaysNewPage	        (optional: false by default) The current alwaysNewPage parameter
     * @returns             The instance of this Object
     *  
     */
    public setTarget(action : C8oAction, page : typeof C8oPage = null, alwaysNewPage: boolean = false): C8oRouteOptions{
        this._page = page;
        this._action = action
        this._alwaysNewPage = alwaysNewPage
        return this;
    }






    /*** TOAST_OPTION***/

        /*** MESSAGE***/

        /**
         * This function return the toast message parameters :
         *
         * @returns     The current toast parameters
         *
         */
        public get toastMesage():string{
            return this._toastMessage
        }

        /**
         * This function set the toast message parameters :
         *
         * @param toastMessage       The message for the toast. Long strings will wrap and the toast container will expand.
         * @returns             The instance of this Object
         *
         */
        public setToastMesage(toastMessage: string) : C8oRouteOptions{
            this._toastMessage = toastMessage;
            return this
        }

        /*** DURATION***/

        /**
         * This function return the toast duration parameters :
         *
         * @returns     The current toast duration parameters
         *
         */
        public get toastDuration():number{
            return this._toastDuration
        }

        /**
         * This function set the toast duration parameters :
         *
         * @param toastDuration     How many milliseconds to wait before hiding the toast. By default, it will show until dismiss() is called.
         * @returns             The instance of this Object
         *
         */
        public setToastDuration(toastDuration: number) : C8oRouteOptions{
            this._toastDuration = toastDuration;
            return this
        }

        /*** POSITION***/

        /**
         * This function return the toast position parameters :
         *
         * @returns     The current direction parameters
         *
         */
        public get toastPosition():string{
            return this._toastPosition
        }

        /**
         * This function set the toast positon parameters :
         *
         * @param toastPosition       The position of the toast on the screen. Accepted values: "top", "middle", "bottom".
         * @returns             The instance of this Object
         *
         */
        public setToastPosition(toastPosition: string) : C8oRouteOptions{
            this._toastPosition = toastPosition;
            return this
        }

        /*** CSSCLASS***/

        /**
         * This function return the toast cssClass parameters :
         *
         * @returns     The current duration parameters
         *
         */
        public get toastCssClass():string{
            return this._toastCssClass
        }

        /**
         * This function set the toast cssClass parameters :
         *
         * @param toastCssClass      Additional classes for custom styles, separated by spaces.
         * @returns             The instance of this Object
         *
         */
        public setToastCssClass(toastCssClass: string) : C8oRouteOptions{
            this._toastCssClass = toastCssClass;
            return this
        }

        /*** SHOWCLOSEBUTTON***/

        /**
         * This function return the toast showCloseButton parameters :
         *
         * @returns     The current easing parameters
         *
         */
        public get toastShowCloseButton():boolean{
            return this._toastShowCloseButton
        }

        /**
         * This function set the toast showCloseButton parameters :
         *
         * @param showCloseButton        Whether or not to show a button to close the toast.
         * @returns             The instance of this Object
         *
         */
        public setToastShowCloseButton(showCloseButton: boolean) : C8oRouteOptions{
            this._toastShowCloseButton = showCloseButton;
            return this
        }

        /*** CLOSEBUTTONTEXT***/

        /**
         * This function return the toast closeButtonText parameters :
         *
         * @returns     The current easing parameters
         *
         */
        public get toastCloseButtonText():string{
            return this._toastCloseButtonText
        }

        /**
         * This function set the toast closeButtonText parameters :
         *
         * @param closeButtonText        Text to display in the close button.
         * @returns             The instance of this Object
         *
         */
        public setToastCloseButtonText(closeButtonText: string) : C8oRouteOptions{
            this._toastCloseButtonText = closeButtonText;
            return this
        }

        /*** DISMISSONPAGECHANGE***/

        /**
         * This function return the toast dismissOnPageChange parameters :
         *
         * @returns     The current easing parameters
         *
         */
        public get toastDismissOnPageChange():boolean{
            return this._toastDismissOnPageChange
        }

        /**
         * This function set the easing parameters :
         *
         * @param closeButtonText        Whether to dismiss the toast when navigating to a new page.
         * @returns             The instance of this Object
         *
         */
        public setToastDismissOnPageChange(dismissOnPageChange: boolean) : C8oRouteOptions{
            this._toastDismissOnPageChange = dismissOnPageChange;
            return this
        }

    /*** TARGET_OPTION***/
        /**
         * This function return the animate parameters :
         * 
         * @returns     The current animate parameters
         *  
         */
        /*public get targetOption():C8oNavOptions{
            return new C8oNavOptions()
            .setAnimate(this._a)
        }*/
        
        /*** ANIMATE***/

        /**
         * This function return the animate parameters :
         * 
         * @returns     The current animate parameters
         *  
         */
        public get targetAnimate():boolean{
            return this._animate
        }

        /**
         * This function set the animate parameters :
         * 
         * @param animate       Whether or not the transition should animate.
         * @returns             The instance of this Object
         *  
         */
        public setTargetAnimate(animate: boolean) : C8oRouteOptions{
            this._animate = animate;
            return this
        }

        /*** ANIMATION***/

        /**
         * This function return the animation parameters :
         * 
         * @returns     The current animation parameters
         *  
         */
        public get targetAnimation():string{
            return this._animation
        }

        /**
         * This function set the animation parameters :
         * 
         * @param animation     What kind of animation should be used.
         *                      The property 'animation' understands the following values:
         *                      md-transition, ios-transition and wp-transition.
         * @returns             The instance of this Object
         *  
         */
        public setTargetAnimation(animation: string) : C8oRouteOptions{
            this._animation = animation;
            return this
        }

        /*** DIRECTION***/

        /**
         * This function return the direction parameters :
         * 
         * @returns     The current direction parameters
         *  
         */
        public get targetDirection():string{
            return this._direction
        }

        /**
         * This function set the direction parameters :
         * 
         * @param direction       The conceptual direction the user is navigating. For example, is the user navigating forward, or back?
         * @returns             The instance of this Object
         *  
         */
        public setTargetDirection(direction: string) : C8oRouteOptions{
            this._direction = direction;
            return this
        }

        /*** DURATION***/

        /**
         * This function return the duration parameters :
         * 
         * @returns     The current duration parameters
         *  
         */
        public get targetDuration():number{
            return this._duration
        }

        /**
         * This function set the direction parameters :
         * 
         * @param duration      The length in milliseconds the animation should take.
         * @returns             The instance of this Object
         *  
         */
        public setTargetDuration(duration: number) : C8oRouteOptions{
            this._duration = duration;
            return this
        }

        /*** EASING***/

        /**
         * This function return the easing parameters :
         * 
         * @returns     The current easing parameters
         *  
         */
        public get targetEasing():string{
            return this._easing
        }

        /**
         * This function set the easing parameters :
         * 
         * @param easing        The easing for the animation.
         * @returns             The instance of this Object
         *  
         */
        public setTargetEasing(easing: string) : C8oRouteOptions{
            this._easing = easing;
            return this
        }

    /*** BEFORECALL***/

    /**
     * This function return beforeCall function:
     * 
     * @returns     The current beforeCall function
     *  
     */
    public get beforeCall():C8oCallFunction{
        return this._beforeCall;
    }

    /**
     * This function set the beforeCall function:
     * 
     * @param beforeCall	The beforeCall function for this route
     * @returns             The instance of this Object
     *  
     */
    public setBeforeCall(beforeCall: C8oCallFunction): C8oRouteOptions{
        this._beforeCall = beforeCall;
        return this;
    }

    /*** AFTERCALL***/

    /**
     * This function return afterCall function:
     * 
     * @returns     The current afterCall function
     *  
     */
    public get afterCall():C8oCallFunction{
        return this._afterCall;
    }

    /**
     * This function set the afterCall function:
     * 
     * @param afterCall	The afterCall function for this route
     * @returns             The instance of this Object
     *  
     */
    public setAfterCall(afterCall: C8oCallFunction): C8oRouteOptions{
        this._afterCall = afterCall;
        return this;
    }

    /*** DIDENTER***/

    /**
     * This function return didEnter function:
     * 
     * @returns     The current didEnter function
     *  
     */
    public get didEnter():C8oLifeCycleFunction{
        return this._didEnter;
    }

    /**
     * This function set the didEnter function:
     * 
     * @param didEnter	The didEnter function for this route
     * @returns             The instance of this Object
     *  
     */
    public setDidEnter(didEnter: C8oLifeCycleFunction) : C8oRouteOptions{
        this._didEnter = didEnter;
        return this;
    }

    /*** DIDLEAVE***/

    /**
     * This function return didLeave function:
     * 
     * @returns     The current didLeave function
     *  
     */
    public get didLeave():C8oLifeCycleFunction{
        return this._didLeave;
    }

    /**
     * This function set the didLeave function:
     * 
     * @param didLeave	The didLeave function for this route
     * @returns             The instance of this Object
     *  
     */
    public setDidLeave(didLeave: C8oLifeCycleFunction) : C8oRouteOptions{
        this._didLeave = didLeave;
        return this;
    }
    /**
     * This function return page option :
     *
     * @returns     The current page option
     *
     */
    public get options():Object{
        return {
            "animate": (this.targetAnimate != undefined ? this.targetAnimate : false),
            "animation": (this.targetAnimation != undefined ? this.targetAnimation : ""),
            "direction": (this.targetDirection != undefined ? this.targetDirection : ""),
            "duration": (this.targetDuration != undefined ? this.targetDuration : 0),
            "easing" : (this.targetEasing != undefined ? this.targetEasing : "")
        }
    }

    /**
     * This function return page option :
     *
     * @returns     The current page option
     *
     */
    public get toastOptions():Object{
        return {
            "message": (this.toastMesage != undefined ? this.toastMesage : ""),
            "duration": (this.toastDuration != undefined ? this.toastDuration : 2000),
            "position": (this.toastPosition != undefined ? this.toastPosition : "bottom"),
            "cssClass": (this.toastCssClass != undefined ? this.toastCssClass : ""),
            "showCloseButton" : (this.toastShowCloseButton != undefined ? this.toastShowCloseButton : false),
            "closeButtonText" : (this.toastCloseButtonText != undefined ? this.toastCloseButtonText : "Close"),
            "dismissOnPageChange" : (this.toastDismissOnPageChange != undefined ? this.toastDismissOnPageChange : false)
        }
    }
    /**
     * This function clone a C8oRouteOptions into this C8oRouteOptions:
     * 
     * @param c8oTableOptions	any C8oRouteOptions
     *  
     */
    public clone(c8oTableOptions : C8oRouteOptions){
        if(c8oTableOptions != undefined){
            //this._requestable = c8oTableOptions._requestable
            this._condition = c8oTableOptions._condition
            this._target = c8oTableOptions._target
            this._beforeCall = c8oTableOptions._beforeCall
            this._afterCall = c8oTableOptions._afterCall
            this._didLoad = c8oTableOptions._didLoad
            this._willEnter = c8oTableOptions._willEnter
            this._didEnter = c8oTableOptions._didEnter
            this._willLeave = c8oTableOptions._willLeave
            this._didLeave = c8oTableOptions._didLeave
            this._willUnLoad = c8oTableOptions._willUnLoad
            this._animate = c8oTableOptions._animate
            this._animation = c8oTableOptions._animation
            this._direction = c8oTableOptions._direction
            this._duration = c8oTableOptions._duration
            this._easing = c8oTableOptions._easing
        }
    }
}


/*
 * The C8oRoute class is responsible to generate route for Convertigo. This will allow Convertigo to  manage navigation
 * Automatically from Convertigo server responses and avoids the programmer to handle the navigation by itself
 * 
 */
export class C8oRoute extends C8oRouteOptions{

    /**
     * C8oRoute constructor
     * 
     * @param requestable    The requestable to wrap (examples : "Myproject.MySequence#view1" or "fs://MyLocalDataBase.get")
     * @param condition      The condition to trigger route (examples : (data :any )=>{
     *                                                                      if(data.rows != undefined){
     *                                                                      return true;
     *                                                                      }
     *                                                                       else{
     *                                                                           return false;
     *                                                                       }   
     *                                                                   }
     * @param c8oTableOptions   (optional) The c8oTableOptions allow you to clone genreal parameters defined in c8oTableOptions in C8oRoute
     * 
     */
    constructor(/*requestable : string,*/ condition : C8oConditionFunction, c8oTableOptions? : C8oRouteOptions){
        super();
        this.clone(c8oTableOptions);
        //this._requestable = requestable
        this._condition = condition
    }

    
}

export class C8oRouteListener{

    private _requestable : Array<string>;
    private _arrayC8oRoute : Array<C8oRoute> = new Array<C8oRoute>();
    private _arrayC8oFail : Array<C8oRoute> = new Array<C8oRoute>();
    constructor(requestble : Array<string>){
        this._requestable = requestble;
    }

    /*** REQUESTABLE***/

    /**
     * This function return requestable:
     *
     * @returns     The current requestable
     *
     */
    public get requestable():Array<string>{
        return this._requestable;
    }



    /**
     * This function return an array of C8oRoute:
     *
     * @returns     The current array of C8oRoute
     *
     */
    public get routes():Array<C8oRoute>{
        return this._arrayC8oRoute;
    }

    /**
     * This function return an array of C8oRoute:
     *
     * @returns     The current array of C8oRoute
     *
     */
    public get routesFail():Array<C8oRoute>{
        return this._arrayC8oFail;
    }

    /**
     * This function add a C8oRoute to the current array:
     *
     * @param c8oRoute	the C8oRoute to add
     * @returns             The instance of this Object
     *
     */
    public addRoute(c8oRoute : C8oRoute) : C8oRouteListener{
        this._arrayC8oRoute.push(c8oRoute)
        return this;
    }

    /**
     * This function add a C8oRoute to the our c8oFailArray:
     *
     * @param C8oRoute	the C8oRoute to add
     * @returns             The instance of this Object
     *
     */
    public addFailedRoute(c8oRoute : C8oRoute) : C8oRouteListener{
        this._arrayC8oFail.push(c8oRoute)
        return this;
    }
}

/*
 * The C8oTarget class is responsible to generate a complex target object for C8oRoute
 * 
 */
export class C8oTarget {
    _page : typeof C8oPage
    _action : C8oAction
    _alwaysNewPage : boolean
    _options : C8oNavOptions
    /**
     * C8oTarget constructor
     * 
     * @param page                  The C8oPage to navigate
     * @param action                The condition to trigger route (examples : (data :any )=>{
     *                                                                      if(data.rows != undefined){
     *                                                                      return true;
     *                                                                      }
     *                                                                       else{
     *                                                                           return false;
     *                                                                       }   
     *                                                                   }
     * @param alwaysNewPage	        (optional: false by default) The current alwaysNewPage parameter
     * @param options               (optional: empty by default) the current C8oNavOptions parameter
     */
    constructor(page : typeof C8oPage, action : C8oAction, alwaysNewPage : boolean = false, options : C8oNavOptions = new C8oNavOptions()){
        this._page = page
        this._action = action
        this._alwaysNewPage = alwaysNewPage
        this._options = options
    }

    /*** PAGE***/

    /**
     * This function return Page:
     * 
     * @returns     The current Page
     *  
     */
    public get page():typeof C8oPage{
        return this._page;
    }

    /**
     * This function set the Page:
     * 
     * @param page	        The page choosen
     * @returns             The instance of this Object
     *  
     */
    public setPage(page: typeof C8oPage): C8oTarget{
        this._page = page;
        return this;
    }

    /*** ACTION***/

    /**
     * This function return page action to execute :
     * 
     * @returns     The current action
     *  
     */
    public get action():C8oAction{
        return this._action;
    }

    /**
     * This function set the page action to execute:
     * 
     * @param action	    The current action
     * @returns             The instance of this Object
     *  
     */
    public setAction(action: C8oAction): C8oTarget{
        this._action = action;
        return this
    }

    /*** ALWAYSNEWPAGE***/

    /**
     * This function return the action to execute in case of choosing the same page than the precedent :
     * 
     * @returns     The current alwaysNewPage parameters
     *  
     */
    public get alwaysNewPage():boolean{
        return this._alwaysNewPage;
    }

    /**
     * This function set the action to execute in case of choosing the same page than the precedent :
     * 
     * @param alwaysNewPage	        The current alwaysNewPage parameters
     * @returns             The instance of this Object
     *  
     */
    public setAlwaysNewPage(alwaysNewPage: boolean): C8oTarget{
        this._alwaysNewPage = alwaysNewPage;
        return this;
    }

    /*** C8ONAVOPTIONS***/

    /**
     * This function return navOptions :
     * 
     * @returns     The current navOptions
     *  
     */
    public get options():C8oNavOptions{
        return this._options;
    }

    /**
     * This function set the navOptions :
     * 
     * @param page	        The current alwaysNewPage parameters
     * @returns             The instance of this Object
     *  
     */
    public setOptions(navOptions: C8oNavOptions) : C8oTarget{
        this._options = navOptions;
        return this
    }
}

export class C8oNavOptions{
    private _animate : boolean
    private _animation : string
    private _direction : string
    private _duration : number
    private _easing : string
    constructor(){
    }

    /*** ANIMATE***/

    /**
     * This function return the animate parameters :
     * 
     * @returns     The current animate parameters
     *  
     */
    public getAnimate():boolean{
        return this._animate
    }

    /**
     * This function set the animate parameters :
     * 
     * @param animate       Whether or not the transition should animate.
     * @returns             The instance of this Object
     *  
     */
    public setAnimate(animate: boolean) : C8oNavOptions{
        this._animate = animate;
        return this
    }

    /*** ANIMATION***/

    /**
     * This function return the animation parameters :
     * 
     * @returns     The current animation parameters
     *  
     */
    public getAnimation():string{
        return this._animation
    }

    /**
     * This function set the animation parameters :
     * 
     * @param animation     What kind of animation should be used.
     *                      The property 'animation' understands the following values:
     *                      md-transition, ios-transition and wp-transition.
     * @returns             The instance of this Object
     *  
     */
    public setAnimation(animation: string) : C8oNavOptions{
        this._animation = animation;
        return this
    }

    /*** DIRECTION***/

    /**
     * This function return the direction parameters :
     * 
     * @returns     The current direction parameters
     *  
     */
    public getDirection():string{
        return this._direction
    }

    /**
     * This function set the direction parameters :
     * 
     * @param direction       The conceptual direction the user is navigating. For example, is the user navigating forward, or back?
     * @returns             The instance of this Object
     *  
     */
    public setDirection(direction: string) : C8oNavOptions{
        this._direction = direction;
        return this
    }

    /*** DURATION***/

    /**
     * This function return the duration parameters :
     * 
     * @returns     The current duration parameters
     *  
     */
    public getDuration():number{
        return this._duration
    }

    /**
     * This function set the direction parameters :
     * 
     * @param duration      The length in milliseconds the animation should take.
     * @returns             The instance of this Object
     *  
     */
    public setDuration(duration: number) : C8oNavOptions{
        this._duration = duration;
        return this
    }

    /*** EASING***/

    /**
     * This function return the easing parameters :
     * 
     * @returns     The current easing parameters
     *  
     */
    public getEasing():string{
        return this._easing
    }

    /**
     * This function set the easing parameters :
     * 
     * @param easing        The easing for the animation.
     * @returns             The instance of this Object
     *  
     */
    public setEasing(easing: string) : C8oNavOptions{
        this._easing = easing;
        return this
    }
}
/*
 * The conditionFunction will allow Convertigo to execute conditional function to access or not to a page
 * 
 */
export interface C8oConditionFunction {
    (data:any) : boolean;
}

/*
 * The C8oCallFunction interface will allow Convertigo to execute function before or after a Call
 * 
 */
export interface C8oCallFunction {
    ();
}

/*
 * The C8oLifeCycleFunction interface will allow Convertigo to execute function at each state of ionic lifecycle
 * With object such as C8oPage or C8o  
 * 
 */
export interface C8oLifeCycleFunction {
    (page:C8oPage, c8o : C8o);
}

/*
 * The C8oAction type interface will allow Convertigo to map Action
 * 
 */
export type C8oAction =
     "push"
    |"setRoot"
    | "root"
    | "toast";
