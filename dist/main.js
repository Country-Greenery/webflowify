/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/customer.js":
/*!*********************************!*\
  !*** ./src/modules/customer.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Customer": () => (/* binding */ Customer)
/* harmony export */ });
/* harmony import */ var _shopify_client_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shopify-client.js */ "./src/modules/shopify-client.js");
/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! js-cookie */ "./node_modules/js-cookie/dist/js.cookie.mjs");



const ShopifyClient = new _shopify_client_js__WEBPACK_IMPORTED_MODULE_0__["default"]()

const cookieName = 'cgShopAccessToken'

class Customer {

  constructor() {
    this.addEvents()
  }

  static get isLoggedIn() {
    return js_cookie__WEBPACK_IMPORTED_MODULE_1__["default"].get(cookieName) != null
  }

  static get accessToken() {
    return js_cookie__WEBPACK_IMPORTED_MODULE_1__["default"].get(cookieName)
  }

  addEvents() {
    const registerForm = document.querySelector('[data-node-type="commerce-customer-register-form"]')
    const loginForm = document.querySelector('[data-node-type="commerce-customer-login-form"]')

    if (registerForm != null) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const elements = e.target.elements
        this.#createCustomer(elements)
      })
    }

    if (loginForm != null) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const elements = e.target.elements
        this.#customerLogin(elements)
      })
    }
  }

  #customerLogin(elements) {
    const email = elements.email.value
    const password = elements.password.value
    const remember = elements.remember.checked

    const variables = {
      "input": {
        "email": email,
        "password": password
      }
    }

    ShopifyClient.query(`mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          field,
          message,
          code
        }
      }
    }`, variables)
    .then(data => {
      const customerAccessToken = data.data.customerAccessTokenCreate.customerAccessToken
      const expires = remember ? new Date(customerAccessToken.expiresAt) : false
      js_cookie__WEBPACK_IMPORTED_MODULE_1__["default"].set('cgShopAccessToken', customerAccessToken.accessToken, { expires: expires, path: '' })

      window.location.replace('/')
    })
  }

  #createCustomer(elements) {
    const firstName = elements.firstName.value
    const lastName = elements.lastName.value
    const email = elements.email.value
    const password = elements.password.value

    const variables = {
      "input": {
        "email": email,
        "firstName": firstName,
        "lastName": lastName,
        "password": password
      }
    }

    ShopifyClient.query(`mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          firstName
          lastName,
          email
        }
        customerUserErrors { field, message, code }
      }
    }`, variables)
    .then(data => {
      console.log(data.data.customerCreate)
    })
  }
}




/***/ }),

/***/ "./src/modules/product.js":
/*!********************************!*\
  !*** ./src/modules/product.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Product": () => (/* binding */ Product)
/* harmony export */ });
/* harmony import */ var _customer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./customer.js */ "./src/modules/customer.js");


class Product {

  constructor() {
    this.addEvents()
  }

  addEvents() {
    console.log('add events')
    const addToCartForm = document.querySelector('[data-node-type="commerce-add-to-cart-form"]')

    if (addToCartForm != null) {
      addToCartForm.addEventListener('submit', (e) => {
          e.preventDefault()
          const elements = e.target.elements
          this.#addProductToCart(elements)
      })
    }
  }

  #addProductToCart(elements) {
    const qty = elements['commerce-add-to-cart-quantity-input'].value
    const itemId = elements['item-id'].value

    console.log({
      qty: qty,
      itemId: itemId,
      customer: _customer_js__WEBPACK_IMPORTED_MODULE_0__.Customer.accessToken
    })
  }
}



/***/ }),

/***/ "./src/modules/shopify-client.js":
/*!***************************************!*\
  !*** ./src/modules/shopify-client.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Client {
  constructor() {
  }
  
  async query(query, variables = {}) {
    const response = await fetch(webflowify.SHOP_GQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': webflowify.STOREFRONT_ACCESS_TOKEN
      },
      body: JSON.stringify({
        query,
        variables
      })
    })
  
    return response.json()
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Client);

/***/ }),

/***/ "./node_modules/js-cookie/dist/js.cookie.mjs":
/*!***************************************************!*\
  !*** ./node_modules/js-cookie/dist/js.cookie.mjs ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*! js-cookie v3.0.1 | MIT */
/* eslint-disable no-var */
function assign (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      target[key] = source[key];
    }
  }
  return target
}
/* eslint-enable no-var */

/* eslint-disable no-var */
var defaultConverter = {
  read: function (value) {
    if (value[0] === '"') {
      value = value.slice(1, -1);
    }
    return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
  },
  write: function (value) {
    return encodeURIComponent(value).replace(
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
      decodeURIComponent
    )
  }
};
/* eslint-enable no-var */

/* eslint-disable no-var */

function init (converter, defaultAttributes) {
  function set (key, value, attributes) {
    if (typeof document === 'undefined') {
      return
    }

    attributes = assign({}, defaultAttributes, attributes);

    if (typeof attributes.expires === 'number') {
      attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
    }
    if (attributes.expires) {
      attributes.expires = attributes.expires.toUTCString();
    }

    key = encodeURIComponent(key)
      .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape);

    var stringifiedAttributes = '';
    for (var attributeName in attributes) {
      if (!attributes[attributeName]) {
        continue
      }

      stringifiedAttributes += '; ' + attributeName;

      if (attributes[attributeName] === true) {
        continue
      }

      // Considers RFC 6265 section 5.2:
      // ...
      // 3.  If the remaining unparsed-attributes contains a %x3B (";")
      //     character:
      // Consume the characters of the unparsed-attributes up to,
      // not including, the first %x3B (";") character.
      // ...
      stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
    }

    return (document.cookie =
      key + '=' + converter.write(value, key) + stringifiedAttributes)
  }

  function get (key) {
    if (typeof document === 'undefined' || (arguments.length && !key)) {
      return
    }

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all.
    var cookies = document.cookie ? document.cookie.split('; ') : [];
    var jar = {};
    for (var i = 0; i < cookies.length; i++) {
      var parts = cookies[i].split('=');
      var value = parts.slice(1).join('=');

      try {
        var foundKey = decodeURIComponent(parts[0]);
        jar[foundKey] = converter.read(value, foundKey);

        if (key === foundKey) {
          break
        }
      } catch (e) {}
    }

    return key ? jar[key] : jar
  }

  return Object.create(
    {
      set: set,
      get: get,
      remove: function (key, attributes) {
        set(
          key,
          '',
          assign({}, attributes, {
            expires: -1
          })
        );
      },
      withAttributes: function (attributes) {
        return init(this.converter, assign({}, this.attributes, attributes))
      },
      withConverter: function (converter) {
        return init(assign({}, this.converter, converter), this.attributes)
      }
    },
    {
      attributes: { value: Object.freeze(defaultAttributes) },
      converter: { value: Object.freeze(converter) }
    }
  )
}

var api = init(defaultConverter, { path: '/' });
/* eslint-enable no-var */

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (api);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_customer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/customer.js */ "./src/modules/customer.js");
/* harmony import */ var _modules_product_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/product.js */ "./src/modules/product.js");
// import { Cart } from './modules/cart.js'



// const ShopCart = new Cart()
const ShopCustomer = new _modules_customer_js__WEBPACK_IMPORTED_MODULE_0__.Customer()
const ShopProduct = new _modules_product_js__WEBPACK_IMPORTED_MODULE_1__.Product()
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7O0FDTkEsWUFBWSxPQUFPO0FBQzZCO0FBQ0Y7O0FBRTlDO0FBQ0EseUJBQXlCLDBEQUFRO0FBQ2pDLHdCQUF3Qix3REFBTyxFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGNvdW50cnktZ3JlZW5lcnkvd2ViZmxvd2lmeS8uL3NyYy9tb2R1bGVzL2N1c3RvbWVyLmpzIiwid2VicGFjazovL0Bjb3VudHJ5LWdyZWVuZXJ5L3dlYmZsb3dpZnkvLi9zcmMvbW9kdWxlcy9wcm9kdWN0LmpzIiwid2VicGFjazovL0Bjb3VudHJ5LWdyZWVuZXJ5L3dlYmZsb3dpZnkvLi9zcmMvbW9kdWxlcy9zaG9waWZ5LWNsaWVudC5qcyIsIndlYnBhY2s6Ly9AY291bnRyeS1ncmVlbmVyeS93ZWJmbG93aWZ5Ly4vbm9kZV9tb2R1bGVzL2pzLWNvb2tpZS9kaXN0L2pzLmNvb2tpZS5tanMiLCJ3ZWJwYWNrOi8vQGNvdW50cnktZ3JlZW5lcnkvd2ViZmxvd2lmeS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9AY291bnRyeS1ncmVlbmVyeS93ZWJmbG93aWZ5L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9AY291bnRyeS1ncmVlbmVyeS93ZWJmbG93aWZ5L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vQGNvdW50cnktZ3JlZW5lcnkvd2ViZmxvd2lmeS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0Bjb3VudHJ5LWdyZWVuZXJ5L3dlYmZsb3dpZnkvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENsaWVudCBmcm9tICcuL3Nob3BpZnktY2xpZW50LmpzJ1xuaW1wb3J0IENvb2tpZXMgZnJvbSAnanMtY29va2llJ1xuXG5jb25zdCBTaG9waWZ5Q2xpZW50ID0gbmV3IENsaWVudCgpXG5cbmNvbnN0IGNvb2tpZU5hbWUgPSAnY2dTaG9wQWNjZXNzVG9rZW4nXG5cbmNsYXNzIEN1c3RvbWVyIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmFkZEV2ZW50cygpXG4gIH1cblxuICBzdGF0aWMgZ2V0IGlzTG9nZ2VkSW4oKSB7XG4gICAgcmV0dXJuIENvb2tpZXMuZ2V0KGNvb2tpZU5hbWUpICE9IG51bGxcbiAgfVxuXG4gIHN0YXRpYyBnZXQgYWNjZXNzVG9rZW4oKSB7XG4gICAgcmV0dXJuIENvb2tpZXMuZ2V0KGNvb2tpZU5hbWUpXG4gIH1cblxuICBhZGRFdmVudHMoKSB7XG4gICAgY29uc3QgcmVnaXN0ZXJGb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtbm9kZS10eXBlPVwiY29tbWVyY2UtY3VzdG9tZXItcmVnaXN0ZXItZm9ybVwiXScpXG4gICAgY29uc3QgbG9naW5Gb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtbm9kZS10eXBlPVwiY29tbWVyY2UtY3VzdG9tZXItbG9naW4tZm9ybVwiXScpXG5cbiAgICBpZiAocmVnaXN0ZXJGb3JtICE9IG51bGwpIHtcbiAgICAgIHJlZ2lzdGVyRm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgY29uc3QgZWxlbWVudHMgPSBlLnRhcmdldC5lbGVtZW50c1xuICAgICAgICB0aGlzLiNjcmVhdGVDdXN0b21lcihlbGVtZW50cylcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKGxvZ2luRm9ybSAhPSBudWxsKSB7XG4gICAgICBsb2dpbkZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGNvbnN0IGVsZW1lbnRzID0gZS50YXJnZXQuZWxlbWVudHNcbiAgICAgICAgdGhpcy4jY3VzdG9tZXJMb2dpbihlbGVtZW50cylcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgI2N1c3RvbWVyTG9naW4oZWxlbWVudHMpIHtcbiAgICBjb25zdCBlbWFpbCA9IGVsZW1lbnRzLmVtYWlsLnZhbHVlXG4gICAgY29uc3QgcGFzc3dvcmQgPSBlbGVtZW50cy5wYXNzd29yZC52YWx1ZVxuICAgIGNvbnN0IHJlbWVtYmVyID0gZWxlbWVudHMucmVtZW1iZXIuY2hlY2tlZFxuXG4gICAgY29uc3QgdmFyaWFibGVzID0ge1xuICAgICAgXCJpbnB1dFwiOiB7XG4gICAgICAgIFwiZW1haWxcIjogZW1haWwsXG4gICAgICAgIFwicGFzc3dvcmRcIjogcGFzc3dvcmRcbiAgICAgIH1cbiAgICB9XG5cbiAgICBTaG9waWZ5Q2xpZW50LnF1ZXJ5KGBtdXRhdGlvbiBjdXN0b21lckFjY2Vzc1Rva2VuQ3JlYXRlKCRpbnB1dDogQ3VzdG9tZXJBY2Nlc3NUb2tlbkNyZWF0ZUlucHV0ISkge1xuICAgICAgY3VzdG9tZXJBY2Nlc3NUb2tlbkNyZWF0ZShpbnB1dDogJGlucHV0KSB7XG4gICAgICAgIGN1c3RvbWVyQWNjZXNzVG9rZW4ge1xuICAgICAgICAgIGFjY2Vzc1Rva2VuXG4gICAgICAgICAgZXhwaXJlc0F0XG4gICAgICAgIH1cbiAgICAgICAgY3VzdG9tZXJVc2VyRXJyb3JzIHtcbiAgICAgICAgICBmaWVsZCxcbiAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgIGNvZGVcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1gLCB2YXJpYWJsZXMpXG4gICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICBjb25zdCBjdXN0b21lckFjY2Vzc1Rva2VuID0gZGF0YS5kYXRhLmN1c3RvbWVyQWNjZXNzVG9rZW5DcmVhdGUuY3VzdG9tZXJBY2Nlc3NUb2tlblxuICAgICAgY29uc3QgZXhwaXJlcyA9IHJlbWVtYmVyID8gbmV3IERhdGUoY3VzdG9tZXJBY2Nlc3NUb2tlbi5leHBpcmVzQXQpIDogZmFsc2VcbiAgICAgIENvb2tpZXMuc2V0KCdjZ1Nob3BBY2Nlc3NUb2tlbicsIGN1c3RvbWVyQWNjZXNzVG9rZW4uYWNjZXNzVG9rZW4sIHsgZXhwaXJlczogZXhwaXJlcywgcGF0aDogJycgfSlcblxuICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoJy8nKVxuICAgIH0pXG4gIH1cblxuICAjY3JlYXRlQ3VzdG9tZXIoZWxlbWVudHMpIHtcbiAgICBjb25zdCBmaXJzdE5hbWUgPSBlbGVtZW50cy5maXJzdE5hbWUudmFsdWVcbiAgICBjb25zdCBsYXN0TmFtZSA9IGVsZW1lbnRzLmxhc3ROYW1lLnZhbHVlXG4gICAgY29uc3QgZW1haWwgPSBlbGVtZW50cy5lbWFpbC52YWx1ZVxuICAgIGNvbnN0IHBhc3N3b3JkID0gZWxlbWVudHMucGFzc3dvcmQudmFsdWVcblxuICAgIGNvbnN0IHZhcmlhYmxlcyA9IHtcbiAgICAgIFwiaW5wdXRcIjoge1xuICAgICAgICBcImVtYWlsXCI6IGVtYWlsLFxuICAgICAgICBcImZpcnN0TmFtZVwiOiBmaXJzdE5hbWUsXG4gICAgICAgIFwibGFzdE5hbWVcIjogbGFzdE5hbWUsXG4gICAgICAgIFwicGFzc3dvcmRcIjogcGFzc3dvcmRcbiAgICAgIH1cbiAgICB9XG5cbiAgICBTaG9waWZ5Q2xpZW50LnF1ZXJ5KGBtdXRhdGlvbiBjdXN0b21lckNyZWF0ZSgkaW5wdXQ6IEN1c3RvbWVyQ3JlYXRlSW5wdXQhKSB7XG4gICAgICBjdXN0b21lckNyZWF0ZShpbnB1dDogJGlucHV0KSB7XG4gICAgICAgIGN1c3RvbWVyIHtcbiAgICAgICAgICBmaXJzdE5hbWVcbiAgICAgICAgICBsYXN0TmFtZSxcbiAgICAgICAgICBlbWFpbFxuICAgICAgICB9XG4gICAgICAgIGN1c3RvbWVyVXNlckVycm9ycyB7IGZpZWxkLCBtZXNzYWdlLCBjb2RlIH1cbiAgICAgIH1cbiAgICB9YCwgdmFyaWFibGVzKVxuICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgY29uc29sZS5sb2coZGF0YS5kYXRhLmN1c3RvbWVyQ3JlYXRlKVxuICAgIH0pXG4gIH1cbn1cblxuZXhwb3J0IHsgQ3VzdG9tZXIgfVxuIiwiaW1wb3J0IHsgQ3VzdG9tZXIgfSBmcm9tICcuL2N1c3RvbWVyLmpzJ1xuXG5jbGFzcyBQcm9kdWN0IHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmFkZEV2ZW50cygpXG4gIH1cblxuICBhZGRFdmVudHMoKSB7XG4gICAgY29uc29sZS5sb2coJ2FkZCBldmVudHMnKVxuICAgIGNvbnN0IGFkZFRvQ2FydEZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1ub2RlLXR5cGU9XCJjb21tZXJjZS1hZGQtdG8tY2FydC1mb3JtXCJdJylcblxuICAgIGlmIChhZGRUb0NhcnRGb3JtICE9IG51bGwpIHtcbiAgICAgIGFkZFRvQ2FydEZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGUpID0+IHtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICBjb25zdCBlbGVtZW50cyA9IGUudGFyZ2V0LmVsZW1lbnRzXG4gICAgICAgICAgdGhpcy4jYWRkUHJvZHVjdFRvQ2FydChlbGVtZW50cylcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgI2FkZFByb2R1Y3RUb0NhcnQoZWxlbWVudHMpIHtcbiAgICBjb25zdCBxdHkgPSBlbGVtZW50c1snY29tbWVyY2UtYWRkLXRvLWNhcnQtcXVhbnRpdHktaW5wdXQnXS52YWx1ZVxuICAgIGNvbnN0IGl0ZW1JZCA9IGVsZW1lbnRzWydpdGVtLWlkJ10udmFsdWVcblxuICAgIGNvbnNvbGUubG9nKHtcbiAgICAgIHF0eTogcXR5LFxuICAgICAgaXRlbUlkOiBpdGVtSWQsXG4gICAgICBjdXN0b21lcjogQ3VzdG9tZXIuYWNjZXNzVG9rZW5cbiAgICB9KVxuICB9XG59XG5cbmV4cG9ydCB7IFByb2R1Y3QgfSIsImNsYXNzIENsaWVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICB9XG4gIFxuICBhc3luYyBxdWVyeShxdWVyeSwgdmFyaWFibGVzID0ge30pIHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHdlYmZsb3dpZnkuU0hPUF9HUUxfVVJMLCB7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgJ1gtU2hvcGlmeS1TdG9yZWZyb250LUFjY2Vzcy1Ub2tlbic6IHdlYmZsb3dpZnkuU1RPUkVGUk9OVF9BQ0NFU1NfVE9LRU5cbiAgICAgIH0sXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIHF1ZXJ5LFxuICAgICAgICB2YXJpYWJsZXNcbiAgICAgIH0pXG4gICAgfSlcbiAgXG4gICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENsaWVudCIsIi8qISBqcy1jb29raWUgdjMuMC4xIHwgTUlUICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby12YXIgKi9cbmZ1bmN0aW9uIGFzc2lnbiAodGFyZ2V0KSB7XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGFyZ2V0XG59XG4vKiBlc2xpbnQtZW5hYmxlIG5vLXZhciAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby12YXIgKi9cbnZhciBkZWZhdWx0Q29udmVydGVyID0ge1xuICByZWFkOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAodmFsdWVbMF0gPT09ICdcIicpIHtcbiAgICAgIHZhbHVlID0gdmFsdWUuc2xpY2UoMSwgLTEpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvKCVbXFxkQS1GXXsyfSkrL2dpLCBkZWNvZGVVUklDb21wb25lbnQpXG4gIH0sXG4gIHdyaXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKS5yZXBsYWNlKFxuICAgICAgLyUoMlszNDZCRl18M1tBQy1GXXw0MHw1W0JERV18NjB8N1tCQ0RdKS9nLFxuICAgICAgZGVjb2RlVVJJQ29tcG9uZW50XG4gICAgKVxuICB9XG59O1xuLyogZXNsaW50LWVuYWJsZSBuby12YXIgKi9cblxuLyogZXNsaW50LWRpc2FibGUgbm8tdmFyICovXG5cbmZ1bmN0aW9uIGluaXQgKGNvbnZlcnRlciwgZGVmYXVsdEF0dHJpYnV0ZXMpIHtcbiAgZnVuY3Rpb24gc2V0IChrZXksIHZhbHVlLCBhdHRyaWJ1dGVzKSB7XG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGF0dHJpYnV0ZXMgPSBhc3NpZ24oe30sIGRlZmF1bHRBdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzKTtcblxuICAgIGlmICh0eXBlb2YgYXR0cmlidXRlcy5leHBpcmVzID09PSAnbnVtYmVyJykge1xuICAgICAgYXR0cmlidXRlcy5leHBpcmVzID0gbmV3IERhdGUoRGF0ZS5ub3coKSArIGF0dHJpYnV0ZXMuZXhwaXJlcyAqIDg2NGU1KTtcbiAgICB9XG4gICAgaWYgKGF0dHJpYnV0ZXMuZXhwaXJlcykge1xuICAgICAgYXR0cmlidXRlcy5leHBpcmVzID0gYXR0cmlidXRlcy5leHBpcmVzLnRvVVRDU3RyaW5nKCk7XG4gICAgfVxuXG4gICAga2V5ID0gZW5jb2RlVVJJQ29tcG9uZW50KGtleSlcbiAgICAgIC5yZXBsYWNlKC8lKDJbMzQ2Ql18NUV8NjB8N0MpL2csIGRlY29kZVVSSUNvbXBvbmVudClcbiAgICAgIC5yZXBsYWNlKC9bKCldL2csIGVzY2FwZSk7XG5cbiAgICB2YXIgc3RyaW5naWZpZWRBdHRyaWJ1dGVzID0gJyc7XG4gICAgZm9yICh2YXIgYXR0cmlidXRlTmFtZSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICBpZiAoIWF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0pIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgc3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc7ICcgKyBhdHRyaWJ1dGVOYW1lO1xuXG4gICAgICBpZiAoYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSA9PT0gdHJ1ZSkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyBDb25zaWRlcnMgUkZDIDYyNjUgc2VjdGlvbiA1LjI6XG4gICAgICAvLyAuLi5cbiAgICAgIC8vIDMuICBJZiB0aGUgcmVtYWluaW5nIHVucGFyc2VkLWF0dHJpYnV0ZXMgY29udGFpbnMgYSAleDNCIChcIjtcIilcbiAgICAgIC8vICAgICBjaGFyYWN0ZXI6XG4gICAgICAvLyBDb25zdW1lIHRoZSBjaGFyYWN0ZXJzIG9mIHRoZSB1bnBhcnNlZC1hdHRyaWJ1dGVzIHVwIHRvLFxuICAgICAgLy8gbm90IGluY2x1ZGluZywgdGhlIGZpcnN0ICV4M0IgKFwiO1wiKSBjaGFyYWN0ZXIuXG4gICAgICAvLyAuLi5cbiAgICAgIHN0cmluZ2lmaWVkQXR0cmlidXRlcyArPSAnPScgKyBhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdLnNwbGl0KCc7JylbMF07XG4gICAgfVxuXG4gICAgcmV0dXJuIChkb2N1bWVudC5jb29raWUgPVxuICAgICAga2V5ICsgJz0nICsgY29udmVydGVyLndyaXRlKHZhbHVlLCBrZXkpICsgc3RyaW5naWZpZWRBdHRyaWJ1dGVzKVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0IChrZXkpIHtcbiAgICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJyB8fCAoYXJndW1lbnRzLmxlbmd0aCAmJiAha2V5KSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gVG8gcHJldmVudCB0aGUgZm9yIGxvb3AgaW4gdGhlIGZpcnN0IHBsYWNlIGFzc2lnbiBhbiBlbXB0eSBhcnJheVxuICAgIC8vIGluIGNhc2UgdGhlcmUgYXJlIG5vIGNvb2tpZXMgYXQgYWxsLlxuICAgIHZhciBjb29raWVzID0gZG9jdW1lbnQuY29va2llID8gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7ICcpIDogW107XG4gICAgdmFyIGphciA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29va2llcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHBhcnRzID0gY29va2llc1tpXS5zcGxpdCgnPScpO1xuICAgICAgdmFyIHZhbHVlID0gcGFydHMuc2xpY2UoMSkuam9pbignPScpO1xuXG4gICAgICB0cnkge1xuICAgICAgICB2YXIgZm91bmRLZXkgPSBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMF0pO1xuICAgICAgICBqYXJbZm91bmRLZXldID0gY29udmVydGVyLnJlYWQodmFsdWUsIGZvdW5kS2V5KTtcblxuICAgICAgICBpZiAoa2V5ID09PSBmb3VuZEtleSkge1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgfVxuXG4gICAgcmV0dXJuIGtleSA/IGphcltrZXldIDogamFyXG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmNyZWF0ZShcbiAgICB7XG4gICAgICBzZXQ6IHNldCxcbiAgICAgIGdldDogZ2V0LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiAoa2V5LCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIHNldChcbiAgICAgICAgICBrZXksXG4gICAgICAgICAgJycsXG4gICAgICAgICAgYXNzaWduKHt9LCBhdHRyaWJ1dGVzLCB7XG4gICAgICAgICAgICBleHBpcmVzOiAtMVxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9LFxuICAgICAgd2l0aEF0dHJpYnV0ZXM6IGZ1bmN0aW9uIChhdHRyaWJ1dGVzKSB7XG4gICAgICAgIHJldHVybiBpbml0KHRoaXMuY29udmVydGVyLCBhc3NpZ24oe30sIHRoaXMuYXR0cmlidXRlcywgYXR0cmlidXRlcykpXG4gICAgICB9LFxuICAgICAgd2l0aENvbnZlcnRlcjogZnVuY3Rpb24gKGNvbnZlcnRlcikge1xuICAgICAgICByZXR1cm4gaW5pdChhc3NpZ24oe30sIHRoaXMuY29udmVydGVyLCBjb252ZXJ0ZXIpLCB0aGlzLmF0dHJpYnV0ZXMpXG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBhdHRyaWJ1dGVzOiB7IHZhbHVlOiBPYmplY3QuZnJlZXplKGRlZmF1bHRBdHRyaWJ1dGVzKSB9LFxuICAgICAgY29udmVydGVyOiB7IHZhbHVlOiBPYmplY3QuZnJlZXplKGNvbnZlcnRlcikgfVxuICAgIH1cbiAgKVxufVxuXG52YXIgYXBpID0gaW5pdChkZWZhdWx0Q29udmVydGVyLCB7IHBhdGg6ICcvJyB9KTtcbi8qIGVzbGludC1lbmFibGUgbm8tdmFyICovXG5cbmV4cG9ydCBkZWZhdWx0IGFwaTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gaW1wb3J0IHsgQ2FydCB9IGZyb20gJy4vbW9kdWxlcy9jYXJ0LmpzJ1xuaW1wb3J0IHsgQ3VzdG9tZXIgfSBmcm9tICcuL21vZHVsZXMvY3VzdG9tZXIuanMnXG5pbXBvcnQgeyBQcm9kdWN0IH0gZnJvbSAnLi9tb2R1bGVzL3Byb2R1Y3QuanMnXG5cbi8vIGNvbnN0IFNob3BDYXJ0ID0gbmV3IENhcnQoKVxuY29uc3QgU2hvcEN1c3RvbWVyID0gbmV3IEN1c3RvbWVyKClcbmNvbnN0IFNob3BQcm9kdWN0ID0gbmV3IFByb2R1Y3QoKSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==