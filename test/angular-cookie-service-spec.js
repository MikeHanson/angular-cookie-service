describe("angular cookie service", function(){

    var injector, doc, service;
    var cookieName = 'name', cookieValue = 'value', cookieObjectName = 'cookieObject';
    var simpleCookie = cookieName + '=' + cookieValue;
    var cookieObjectValue = { field1: 'value', field2: true, field3: 1 };
    var cookieObjectString = JSON.stringify(cookieObjectValue);

    beforeEach(module("lnCookie"));

    beforeEach(function(){
        inject(function($injector, $document){
            injector = $injector;
            doc = $document[0];
            service = injector.get('lnCookieService');
            spyOn(service, '$setCookie').and.callThrough();
        });
    });

    beforeEach(function(){
    var cookies = doc.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
    	var cookie = cookies[i];
    	var eqPos = cookie.indexOf("=");
    	var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    	doc.cookie = name + "=__deleted__;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    });

    it('Should support retrieving a cookie', function(){
        expect(service.get).toBeDefined();
        expect(typeof service.get).toBe('function');
    });

    it('Should retrieve a cookie that exists', function(){
        doc.cookie = simpleCookie;
        var cookie = service.get(cookieName);
        expect(cookie).toBeDefined();
        expect(cookie).toBe(cookieValue);
    });

    it('Should return undefined if cookie does not exist on get', function(){
        var cookie = service.get(cookieName);
        expect(cookie).toBeUndefined();
    });

    it('Should not return a cookie that has been removed on get', function()
    {
        doc.cookie = simpleCookie;
        var cookie = service.get(cookieName);
        expect(cookie).toBeDefined();
        service.remove(cookieName);
        cookie = service.get(cookieName);
        expect(cookie).toBeUndefined();                
    });

    it('Should deserialize value when it is an object', function(){
        service.set(cookieObjectName, cookieObjectValue);
        var cookie = service.get(cookieObjectName);
        expect(typeof cookie).toBe('object');
    });
    
    it('Should serialize value when it is an object', function(){
        service.set(cookieObjectName, cookieObjectValue);
        var cookie = doc.cookie;
        var encodesString = encodeURIComponent(cookieObjectString);
        expect(cookie.indexOf(encodesString)).not.toBe(-1);
    });

    it('Should support checking the existence of a key', function(){
        expect(service.exists).toBeDefined();
        expect(typeof service.exists).toBe('function');
    });

    it('Should return true for exists when a cookie with key exists', function(){
        doc.cookie = simpleCookie;
        var exists = service.exists(cookieName);
        expect(exists).toBeTruthy();
    });

    it('Should return false for exists when a cookie with key does not exist', function(){
        var exists = service.exists(cookieName);
        expect(exists).toBeFalsy();
    });

    it('Should support removing a cookie', function(){
        expect(service.remove).toBeDefined();
        expect(typeof service.remove).toBe('function');
    });

    it('Should remove existing cookie', function(){
        doc.cookie = simpleCookie;
        expect(service.exists(cookieName)).toBeTruthy();
        service.remove(cookieName);
        expect(service.exists(cookieName)).toBeFalsy();
    });

    it('Should support setting a cookie', function(){
        expect(service.set).toBeDefined();
        expect(typeof service.set).toBe('function');
    });

    it('Should remove cookie if set called with only a key', function(){
        doc.cookie = simpleCookie;
        var cookie = service.get(cookieName);
        expect(cookie).toBeDefined();
        service.set(cookieName);
        cookie = service.get(cookieName);
        expect(cookie).toBeUndefined();
    });

    it('Should add a cookie when key and value provided', function(){
        expect(service.get(cookieName)).toBeUndefined();
        service.set(cookieName, cookieValue);
        expect(doc.cookie).toBeDefined();
        expect(doc.cookie.indexOf(simpleCookie)).not.toBe(-1);
    });

    it('Should support setting expiration date', function(){
        var date = new Date();
        var options = {expires: date}
        var expected = simpleCookie + '; expires=' + date.toUTCString();
        service.set(cookieName, cookieValue, options);
        expect(service.$setCookie).toHaveBeenCalledWith(expected);
    });

    it('Should not set expiration if not specified on options', function(){
        var options = {}
        service.set(cookieName, cookieValue, options);
        var args = service.$setCookie.calls.argsFor(0)[0];
        expect(args.indexOf('expires')).toBe(-1);
    });

    it('Should support setting expiration implictly in days', function(){
        var date = new Date();
        date.setDate(date.getDate() + 1);
        var options = {expires: 1}
        var expected = simpleCookie + '; expires=' + date.toUTCString();
        service.set(cookieName, cookieValue, options);
        expect(service.$setCookie).toHaveBeenCalledWith(expected);
    });

    it('Should support effective deletion of cookie by setting expiration to -1', function(){
        var options = {expires: -1}
        var expected = simpleCookie + '; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        service.set(cookieName, cookieValue, options);
        expect(service.$setCookie).toHaveBeenCalledWith(expected);
    });


    it('Should support setting expiration explicitly in days', function(){
        var date = new Date();
        date.setDate(date.getDate() + 1);
        var options = {expires: 1, expirationUnit: 'days'}
        var expected = simpleCookie + '; expires=' + date.toUTCString();
        service.set(cookieName, cookieValue, options);
        expect(service.$setCookie).toHaveBeenCalledWith(expected);
    });

    it('Should support setting expiration in hours', function(){
        var date = new Date();
        date.setHours(date.getHours() + 1);
        var options = {expires: 1, expirationUnit: 'hours'}
        var expected = simpleCookie + '; expires=' + date.toUTCString();
        service.set(cookieName, cookieValue, options);
        expect(service.$setCookie).toHaveBeenCalledWith(expected);
    });

    it('Should support setting expiration in minutes', function(){
        var date = new Date();
        date.setMinutes(date.getMinutes() + 1);
        var options = {expires: 1, expirationUnit: 'minutes'}
        var expected = simpleCookie + '; expires=' + date.toUTCString();
        service.set(cookieName, cookieValue, options);
        expect(service.$setCookie).toHaveBeenCalledWith(expected);
    });

    it('Should support setting expiration in seconds', function(){
        var date = new Date();
        date.setSeconds(date.getSeconds() + 1);
        var options = {expires: 1, expirationUnit: 'seconds'}
        var expected = simpleCookie + '; expires=' + date.toUTCString();
        service.set(cookieName, cookieValue, options);
        expect(service.$setCookie).toHaveBeenCalledWith(expected);
    });

    it('Should support setting path', function()
    {
        var options = {path: '/SomePath'}
        var expected = simpleCookie + '; path=/SomePath';
        service.set(cookieName, cookieValue, options);
        expect(service.$setCookie).toHaveBeenCalledWith(expected);                 
    });

    it('Should not set path if not specified on options', function(){
        var options = {}
        service.set(cookieName, cookieValue, options);
        var args = service.$setCookie.calls.argsFor(0)[0];
        expect(args.indexOf('path')).toBe(-1);
    });

    it('Should support setting domain', function()
    {
        var options = {domain: 'somedomain.com'}
        var expected = simpleCookie + '; domain=somedomain.com';
        service.set(cookieName, cookieValue, options);
        expect(service.$setCookie).toHaveBeenCalledWith(expected);                 
    });

    it('Should not set domain if not specified on options', function(){
        var options = {}
        service.set(cookieName, cookieValue, options);
        var args = service.$setCookie.calls.argsFor(0)[0];
        expect(args.indexOf('domain')).toBe(-1);
    });

    it('Should support setting max age', function()
    {
        var options = {maxAge: 500}
        var expected = simpleCookie + '; max-age=500';
        service.set(cookieName, cookieValue, options);
        expect(service.$setCookie).toHaveBeenCalledWith(expected);                 
    });

    it('Should not set max age if not specified on options', function(){
        var options = {}
        service.set(cookieName, cookieValue, options);
        var args = service.$setCookie.calls.argsFor(0)[0];
        expect(args.indexOf('max-age')).toBe(-1);
    });

    it('Should support setting secure flag', function()
    {
        var options = {secure: true}
        var expected = simpleCookie + '; secure';
        service.set(cookieName, cookieValue, options);
        expect(service.$setCookie).toHaveBeenCalledWith(expected);                 
    });

    it('Should not set secure flag if not specified on options', function(){
        var options = {}
        service.set(cookieName, cookieValue, options);
        var args = service.$setCookie.calls.argsFor(0)[0];
        expect(args.indexOf('secure')).toBe(-1);
    });

    it('Should not set secure flag if explicitly set to false on options', function(){
        var options = {secure: false}
        service.set(cookieName, cookieValue, options);
        var args = service.$setCookie.calls.argsFor(0)[0];
        expect(args.indexOf('secure')).toBe(-1);
    });

    it('Should support setting all options at same time using expiration unit', function(){
        var date = new Date();
        var options = { expires: 5, 
            expirationUnit: 'minutes', 
            path: '/SomePath', 
            domain: 'somedomain.com', 
            maxAge: 500, 
            secure: true };
        date.setMinutes(date.getMinutes() + 5);
        var expected = simpleCookie + '; expires=' + date.toUTCString() + '; path=/SomePath; domain=somedomain.com; max-age=500; secure' ;
        service.set(cookieName, cookieValue, options);
        expect(service.$setCookie).toHaveBeenCalledWith(expected);   
    });

    it('Should support setting all options at same time using expiration date', function(){
        var date = new Date();
        var options = { expires: date, 
            expirationUnit: 'minutes', 
            path: '/SomePath', 
            domain: 'somedomain.com', 
            maxAge: 500, 
            secure: true };
        var expected = simpleCookie + '; expires=' + date.toUTCString() + '; path=/SomePath; domain=somedomain.com; max-age=500; secure' ;
        service.set(cookieName, cookieValue, options);
        expect(service.$setCookie).toHaveBeenCalledWith(expected);   
    });
});