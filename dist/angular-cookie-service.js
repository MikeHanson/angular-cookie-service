// Due credit ivpusic to https://github.com/ivpusic/angular-cookie
// We originally used his cookie service in our project but found
// it difficult to test against so created this alternative
// which is more easily mocked for testing purposes

var lnCookie = angular.module('lnCookie', []);

lnCookie.factory('lnCookieService', [
    '$document',
    function($document){
        'use strict';
        var doc = $document[0];
        var deletedIndicator = '__deleted__';

        function tryDeserializeCookie(value){

            var result = value;
            try{
                result = JSON.parse(value);
            }
            catch (e){
            }

            return result;
        }

        function parseCookieValue(cookieString, name){
            var cookies = cookieString.split(';');
            var result = undefined;
            for (var i = 0; i < cookies.length; i++){
                var cookie = cookies[i];
                var elements = cookie.split('=');
                var cookieName = elements[0].trim();
                if (cookieName === name){
                    var cookieValue = decodeURIComponent(elements[1]).trim();
                    if (cookieValue){
                        result = tryDeserializeCookie(cookieValue);
                        break;
                    }
                }
            }

            return result;
        }

        function getExpirationDate(options){
            var expirationDate = options.expires;

            if (typeof options.expires === 'number'){
                var expiresIn = options.expires;
                expirationDate = new Date();

                if (expiresIn === -1){
                    expirationDate = new Date('Thu, 01 Jan 1970 00:00:00 GMT');
                }
                else if (options.expirationUnit !== undefined){
                    if (options.expirationUnit === 'hours'){
                        expirationDate.setHours(expirationDate.getHours() + expiresIn);
                    }
                    else if (options.expirationUnit === 'minutes'){
                        expirationDate.setMinutes(expirationDate.getMinutes() + expiresIn);
                    }
                    else if (options.expirationUnit === 'seconds'){
                        expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn);
                    }
                    else{
                        expirationDate.setDate(expirationDate.getDate() + expiresIn);
                    }
                }
                else{
                    expirationDate.setDate(expirationDate.getDate() + expiresIn);
                }
            }
            return '; expires=' + expirationDate.toUTCString();
        }

        function buildOptions(options){
            if (!options){
                return '';
            }

            var result = '';

            if (options.expires){
                result += getExpirationDate(options);
            }

            if (options.path){
                result += '; path=' + options.path;
            }

            if (options.domain){
                result += '; domain=' + options.domain;
            }

            if (options.maxAge){
                result += '; max-age=' + options.maxAge;
            }

            if (options.secure){
                result += '; secure';
            }

            return result;
        }

        function buildCookie(key, value, options){
            var actualValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
            return [encodeURIComponent(key), '=', encodeURIComponent(actualValue), buildOptions(options)].join('');
        }

        return {
            set: function(name, value, options){
                if (!value){
                    this.remove(name);
                    return;
                }

                var cookie = buildCookie(name, value, options);
                this.$setCookie(cookie);
            },
            get: function(name){
                var cookieString = doc.cookie;
                if (!cookieString){
                    return undefined;
                }

                return parseCookieValue(cookieString, name);
            },
            remove: function(name){
                doc.cookie = name + '=' + deletedIndicator + '; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            },
            exists: function(name){
                var cookieValue = this.get(name);
                return cookieValue !== undefined && cookieValue !== null && cookieValue != '' && cookieValue != deletedIndicator;
            },
            $setCookie: function(cookeString){
                // ugly I know but only way I could think of to support testing options
                // were evaluated correctly
                doc.cookie = cookeString;
            }
        };
    }
]);