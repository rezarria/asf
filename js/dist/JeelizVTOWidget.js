/**
 * Jeeliz Glasses VTO Widget - https://github.com/jeeliz/jeelizGlassesVTOWidget
 *
 * Copyright 2020 WebAR.rocks ( https://webar.rocks )
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";
var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.owns = function (ma, qa) {
  return Object.prototype.hasOwnProperty.call(ma, qa);
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.ISOLATE_POLYFILLS = !1;
$jscomp.defineProperty =
  $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties
    ? Object.defineProperty
    : function (ma, qa, Ba) {
        if (ma == Array.prototype || ma == Object.prototype) return ma;
        ma[qa] = Ba.value;
        return ma;
      };
$jscomp.getGlobal = function (ma) {
  ma = [
    "object" == typeof globalThis && globalThis,
    ma,
    "object" == typeof window && window,
    "object" == typeof self && self,
    "object" == typeof global && global,
  ];
  for (var qa = 0; qa < ma.length; ++qa) {
    var Ba = ma[qa];
    if (Ba && Ba.Math == Math) return Ba;
  }
  throw Error("Cannot find global object");
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.IS_SYMBOL_NATIVE =
  "function" === typeof Symbol && "symbol" === typeof Symbol("x");
$jscomp.TRUST_ES6_POLYFILLS =
  !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
$jscomp.polyfills = {};
$jscomp.propertyToPolyfillSymbol = {};
$jscomp.POLYFILL_PREFIX = "$jscp$";
var $jscomp$lookupPolyfilledValue = function (ma, qa) {
  var Ba = $jscomp.propertyToPolyfillSymbol[qa];
  if (null == Ba) return ma[qa];
  Ba = ma[Ba];
  return void 0 !== Ba ? Ba : ma[qa];
};
$jscomp.polyfill = function (ma, qa, Ba, Na) {
  qa &&
    ($jscomp.ISOLATE_POLYFILLS
      ? $jscomp.polyfillIsolated(ma, qa, Ba, Na)
      : $jscomp.polyfillUnisolated(ma, qa, Ba, Na));
};
$jscomp.polyfillUnisolated = function (ma, qa, Ba, Na) {
  Ba = $jscomp.global;
  ma = ma.split(".");
  for (Na = 0; Na < ma.length - 1; Na++) {
    var xa = ma[Na];
    if (!(xa in Ba)) return;
    Ba = Ba[xa];
  }
  ma = ma[ma.length - 1];
  Na = Ba[ma];
  qa = qa(Na);
  qa != Na &&
    null != qa &&
    $jscomp.defineProperty(Ba, ma, {
      configurable: !0,
      writable: !0,
      value: qa,
    });
};
$jscomp.polyfillIsolated = function (ma, qa, Ba, Na) {
  var xa = ma.split(".");
  ma = 1 === xa.length;
  Na = xa[0];
  Na = !ma && Na in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
  for (var wb = 0; wb < xa.length - 1; wb++) {
    var la = xa[wb];
    if (!(la in Na)) return;
    Na = Na[la];
  }
  xa = xa[xa.length - 1];
  Ba = $jscomp.IS_SYMBOL_NATIVE && "es6" === Ba ? Na[xa] : null;
  qa = qa(Ba);
  null != qa &&
    (ma
      ? $jscomp.defineProperty($jscomp.polyfills, xa, {
          configurable: !0,
          writable: !0,
          value: qa,
        })
      : qa !== Ba &&
        (($jscomp.propertyToPolyfillSymbol[xa] = $jscomp.IS_SYMBOL_NATIVE
          ? $jscomp.global.Symbol(xa)
          : $jscomp.POLYFILL_PREFIX + xa),
        (xa = $jscomp.propertyToPolyfillSymbol[xa]),
        $jscomp.defineProperty(Na, xa, {
          configurable: !0,
          writable: !0,
          value: qa,
        })));
};
$jscomp.assign =
  $jscomp.TRUST_ES6_POLYFILLS && "function" == typeof Object.assign
    ? Object.assign
    : function (ma, qa) {
        for (var Ba = 1; Ba < arguments.length; Ba++) {
          var Na = arguments[Ba];
          if (Na) for (var xa in Na) $jscomp.owns(Na, xa) && (ma[xa] = Na[xa]);
        }
        return ma;
      };
$jscomp.polyfill(
  "Object.assign",
  function (ma) {
    return ma || $jscomp.assign;
  },
  "es6",
  "es3"
);
$jscomp.arrayIteratorImpl = function (ma) {
  var qa = 0;
  return function () {
    return qa < ma.length ? { done: !1, value: ma[qa++] } : { done: !0 };
  };
};
$jscomp.arrayIterator = function (ma) {
  return { next: $jscomp.arrayIteratorImpl(ma) };
};
$jscomp.makeIterator = function (ma) {
  var qa =
    "undefined" != typeof Symbol && Symbol.iterator && ma[Symbol.iterator];
  return qa ? qa.call(ma) : $jscomp.arrayIterator(ma);
};
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.polyfill(
  "Promise",
  function (ma) {
    function qa() {
      this.batch_ = null;
    }
    function Ba(la) {
      return la instanceof xa
        ? la
        : new xa(function (Da, Oa) {
            Da(la);
          });
    }
    if (ma && !$jscomp.FORCE_POLYFILL_PROMISE) return ma;
    qa.prototype.asyncExecute = function (la) {
      if (null == this.batch_) {
        this.batch_ = [];
        var Da = this;
        this.asyncExecuteFunction(function () {
          Da.executeBatch_();
        });
      }
      this.batch_.push(la);
    };
    var Na = $jscomp.global.setTimeout;
    qa.prototype.asyncExecuteFunction = function (la) {
      Na(la, 0);
    };
    qa.prototype.executeBatch_ = function () {
      for (; this.batch_ && this.batch_.length; ) {
        var la = this.batch_;
        this.batch_ = [];
        for (var Da = 0; Da < la.length; ++Da) {
          var Oa = la[Da];
          la[Da] = null;
          try {
            Oa();
          } catch (Ya) {
            this.asyncThrow_(Ya);
          }
        }
      }
      this.batch_ = null;
    };
    qa.prototype.asyncThrow_ = function (la) {
      this.asyncExecuteFunction(function () {
        throw la;
      });
    };
    var xa = function (la) {
      this.state_ = 0;
      this.result_ = void 0;
      this.onSettledCallbacks_ = [];
      var Da = this.createResolveAndReject_();
      try {
        la(Da.resolve, Da.reject);
      } catch (Oa) {
        Da.reject(Oa);
      }
    };
    xa.prototype.createResolveAndReject_ = function () {
      function la(Ya) {
        return function (hb) {
          Oa || ((Oa = !0), Ya.call(Da, hb));
        };
      }
      var Da = this,
        Oa = !1;
      return { resolve: la(this.resolveTo_), reject: la(this.reject_) };
    };
    xa.prototype.resolveTo_ = function (la) {
      if (la === this)
        this.reject_(new TypeError("A Promise cannot resolve to itself"));
      else if (la instanceof xa) this.settleSameAsPromise_(la);
      else {
        a: switch (typeof la) {
          case "object":
            var Da = null != la;
            break a;
          case "function":
            Da = !0;
            break a;
          default:
            Da = !1;
        }
        Da ? this.resolveToNonPromiseObj_(la) : this.fulfill_(la);
      }
    };
    xa.prototype.resolveToNonPromiseObj_ = function (la) {
      var Da = void 0;
      try {
        Da = la.then;
      } catch (Oa) {
        this.reject_(Oa);
        return;
      }
      "function" == typeof Da
        ? this.settleSameAsThenable_(Da, la)
        : this.fulfill_(la);
    };
    xa.prototype.reject_ = function (la) {
      this.settle_(2, la);
    };
    xa.prototype.fulfill_ = function (la) {
      this.settle_(1, la);
    };
    xa.prototype.settle_ = function (la, Da) {
      if (0 != this.state_)
        throw Error(
          "Cannot settle(" +
            la +
            ", " +
            Da +
            "): Promise already settled in state" +
            this.state_
        );
      this.state_ = la;
      this.result_ = Da;
      this.executeOnSettledCallbacks_();
    };
    xa.prototype.executeOnSettledCallbacks_ = function () {
      if (null != this.onSettledCallbacks_) {
        for (var la = 0; la < this.onSettledCallbacks_.length; ++la)
          wb.asyncExecute(this.onSettledCallbacks_[la]);
        this.onSettledCallbacks_ = null;
      }
    };
    var wb = new qa();
    xa.prototype.settleSameAsPromise_ = function (la) {
      var Da = this.createResolveAndReject_();
      la.callWhenSettled_(Da.resolve, Da.reject);
    };
    xa.prototype.settleSameAsThenable_ = function (la, Da) {
      var Oa = this.createResolveAndReject_();
      try {
        la.call(Da, Oa.resolve, Oa.reject);
      } catch (Ya) {
        Oa.reject(Ya);
      }
    };
    xa.prototype.then = function (la, Da) {
      function Oa(mb, sb) {
        return "function" == typeof mb
          ? function (Rb) {
              try {
                Ya(mb(Rb));
              } catch (Eb) {
                hb(Eb);
              }
            }
          : sb;
      }
      var Ya,
        hb,
        Bb = new xa(function (mb, sb) {
          Ya = mb;
          hb = sb;
        });
      this.callWhenSettled_(Oa(la, Ya), Oa(Da, hb));
      return Bb;
    };
    xa.prototype.catch = function (la) {
      return this.then(void 0, la);
    };
    xa.prototype.callWhenSettled_ = function (la, Da) {
      function Oa() {
        switch (Ya.state_) {
          case 1:
            la(Ya.result_);
            break;
          case 2:
            Da(Ya.result_);
            break;
          default:
            throw Error("Unexpected state: " + Ya.state_);
        }
      }
      var Ya = this;
      null == this.onSettledCallbacks_
        ? wb.asyncExecute(Oa)
        : this.onSettledCallbacks_.push(Oa);
    };
    xa.resolve = Ba;
    xa.reject = function (la) {
      return new xa(function (Da, Oa) {
        Oa(la);
      });
    };
    xa.race = function (la) {
      return new xa(function (Da, Oa) {
        for (
          var Ya = $jscomp.makeIterator(la), hb = Ya.next();
          !hb.done;
          hb = Ya.next()
        )
          Ba(hb.value).callWhenSettled_(Da, Oa);
      });
    };
    xa.all = function (la) {
      var Da = $jscomp.makeIterator(la),
        Oa = Da.next();
      return Oa.done
        ? Ba([])
        : new xa(function (Ya, hb) {
            function Bb(Rb) {
              return function (Eb) {
                mb[Rb] = Eb;
                sb--;
                0 == sb && Ya(mb);
              };
            }
            var mb = [],
              sb = 0;
            do
              mb.push(void 0),
                sb++,
                Ba(Oa.value).callWhenSettled_(Bb(mb.length - 1), hb),
                (Oa = Da.next());
            while (!Oa.done);
          });
    };
    return xa;
  },
  "es6",
  "es3"
);
$jscomp.polyfill(
  "Math.log2",
  function (ma) {
    return ma
      ? ma
      : function (qa) {
          return Math.log(qa) / Math.LN2;
        };
  },
  "es6",
  "es3"
);
$jscomp.polyfill(
  "Promise.prototype.finally",
  function (ma) {
    return ma
      ? ma
      : function (qa) {
          return this.then(
            function (Ba) {
              return Promise.resolve(qa()).then(function () {
                return Ba;
              });
            },
            function (Ba) {
              return Promise.resolve(qa()).then(function () {
                throw Ba;
              });
            }
          );
        };
  },
  "es9",
  "es3"
);
$jscomp.polyfill(
  "Math.sign",
  function (ma) {
    return ma
      ? ma
      : function (qa) {
          qa = Number(qa);
          return 0 === qa || isNaN(qa) ? qa : 0 < qa ? 1 : -1;
        };
  },
  "es6",
  "es3"
);
var JeelizVTOWidget = (function () {
  function ma() {
    Sa.mode = jb.realtime;
    Sa.isRT = !0;
    ra.adjust = document.getElementById("JeelizVTOWidgetAdjust");
    if (ra.adjust) {
      ra.adjustNotice = document.getElementById("JeelizVTOWidgetAdjustNotice");
      ra.adjustExit = document.getElementById("JeelizVTOWidgetAdjustExit");
      ra.changeModelContainer = document.getElementById(
        "JeelizVTOWidgetChangeModelContainer"
      );
      ra.buttonResizeCanvas = document.getElementById("buttonResizeCanvas");
      var V = ra.adjust;
      V && V.addEventListener("click", mb, !1);
      (V = ra.adjustExit) && V.addEventListener("click", sb, !1);
      [ra.adjust, ra.changeModelContainer, ra.buttonResizeCanvas].forEach(Ba);
    }
    Fb.enabled && Ua.do_instantDetection(Fb.interval, Fb.callback);
    Sb && (Sb(!0), (Sb = null));
  }
  function qa() {
    var V = document.createElement("style");
    V.setAttribute("type", "text/css");
    V.innerHTML =
      "._jeelizVTOForceHide { display: none!important }._jeelizVTOForceShow { display: revert!important }";
    var ya = document.getElementsByTagName("head");
    1 <= ya.length ? ya[0].appendChild(V) : document.body.appendChild(V);
  }
  function Ba(V) {
    V &&
      (V.classList.remove("_jeelizVTOForceHide"),
      "none" === window.getComputedStyle(V).display &&
        V.classList.add("_jeelizVTOForceShow"));
  }
  function Na(V) {
    V &&
      (V.classList.add("_jeelizVTOForceHide"),
      V.classList.remove("_jeelizVTOForceShow"));
  }
  function xa(V, ya) {
    if (V) for (var Pa in ya) V.style[Pa] = ya[Pa];
  }
  function wb(V) {
    if (V) return V.clientWidth;
  }
  function la(V) {
    if (V) return V.clientHeight;
  }
  function Da(V) {
    return new Promise(function (ya, Pa) {
      var La = new XMLHttpRequest();
      La.open("GET", V, !0);
      La.onreadystatechange = function () {
        if (4 === La.readyState)
          if (200 === La.status || 0 === La.status)
            try {
              var ib = JSON.parse(La.responseText);
              ya(ib);
            } catch (Xa) {
              Pa("INVALID JSON");
            }
          else Pa("HTTP ERROR " + La.status);
      };
      La.send();
    });
  }
  function Oa(V) {
    Sa.isRT = !1;
    hb(V || "NO_ERROR_LABEL");
  }
  function Ya() {
    hb("INVALID_SKU");
  }
  function hb(V) {
    lc.error ? lc.error(V) : console.log("ERROR:", V);
  }
  function Bb() {
    mc = wb(ra.container);
    nc = la(ra.container);
    Yb = Math.round(1 * mc);
    Zb = Math.round(1 * nc);
    xa(ra.cv, { width: mc.toString() + "px", height: nc.toString() + "px" });
    ra.cv.width = Yb;
    ra.cv.height = Zb;
    Ua && (Sa.mode === jb.notLoaded ? Ua.set_size(Yb, Zb) : Ua.resize(Yb, Zb));
  }
  function mb() {
    [ra.adjust, ra.changeModelContainer, ra.buttonResizeCanvas].forEach(Na);
    Sa.mode = jb.adjust;
    [ra.adjustNotice, ra.adjustExit].forEach(Ba);
    ra.cv.style.cursor = "move";
    Ua.switch_modeInteractor("movePinch");
    $b("ADJUST_START");
  }
  function sb() {
    [ra.adjustNotice, ra.adjustExit].forEach(Na);
    [ra.adjust, ra.changeModelContainer, ra.buttonResizeCanvas].forEach(Ba);
    ra.cv.style.cursor = "auto";
    Sa.mode = Sa.realtime;
    Ua.switch_modeInteractor("idle");
    $b("ADJUST_END");
  }
  function Rb() {
    if (!ra.trackIframe) {
      var V = ac.appstaticURL + "jeewidget/";
      ra.trackIframe = document.createElement("iframe");
      ra.trackIframe.width = "10";
      ra.trackIframe.height = "10";
      ra.trackIframe.src = V + "trackIframe.html";
      xa(ra.trackIframe, {
        position: "absolute",
        zIndex: -1,
        bottom: "0px",
        right: "0px",
      });
      ra.container.appendChild(ra.trackIframe);
    }
  }
  function Eb(V, ya, Pa) {
    Ua.load_model(
      ya.mod + ".json",
      ya.mats,
      function () {
        Sa.mode = jb.realtime;
        Pa && Pa();
        pb.toggle_loading(!1);
        if (ra.trackIframe) {
          var La = location.href.split("?").shift().split("://").pop();
          La = La.split("/").shift();
          La = La.split("www.").pop();
          try {
            ra.trackIframe.contentWindow.postMessage(
              { action: "COUNTTRYONSESSION", domain: La, sku: V },
              "*"
            );
          } catch (ib) {}
        }
      },
      V
    );
  }
  function $b(V) {
    (V = vc[V]) && V();
  }
  var Ua = (function () {
    function V(a, c) {
      var e = new XMLHttpRequest();
      e.open("GET", a, !0);
      e.withCredentials = !1;
      e.onreadystatechange = function () {
        4 !== e.readyState ||
          (200 !== e.status && 0 !== e.status) ||
          c(e.responseText);
      };
      e.send();
    }
    function ya(a, c) {
      if (0 === c || "object" !== typeof a) return a;
      a = Object.assign({}, a);
      c = void 0 === c || -1 === c ? -1 : c - 1;
      for (var e in a) a[e] = ya(a[e], c);
      return a;
    }
    function Pa(a) {
      return 0.5 > a ? 4 * a * a * a : (a - 1) * (2 * a - 2) * (2 * a - 2) + 1;
    }
    function La(a) {
      switch (a) {
        case "relu":
          return "gl_FragColor=max(vec4(0.,0.,0.,0.),gl_FragColor);";
        case "elu":
          return "gl_FragColor=mix(exp(-abs(gl_FragColor))-vec4(1.,1.,1.,1.),gl_FragColor,step(0.,gl_FragColor));";
        case "elu01":
          return "gl_FragColor=mix(0.1*exp(-abs(gl_FragColor))-vec4(0.1,0.1,0.1,0.1),gl_FragColor,step(0.,gl_FragColor));";
        case "arctan":
          return "gl_FragColor=atan(3.14159265359*texture2D(u0,vUV))/3.14159265359;";
        case "copy":
          return "";
        default:
          return !1;
      }
    }
    function ib(a, c) {
      var e = c % 8;
      return (a[(c - e) / 8] >> (7 - e)) & 1;
    }
    function Xa(a, c, e) {
      var d = 1,
        k = 0;
      for (e = c + e - 1; e >= c; --e) (k += d * ib(a, e)), (d *= 2);
      return k;
    }
    function Ab(a) {
      a =
        "undefined" === typeof btoa
          ? Buffer.from(a.data, "base64").toString("latin1")
          : atob(a.data);
      for (var c = a.length, e = new Uint8Array(c), d = 0; d < c; ++d)
        e[d] = a.charCodeAt(d);
      return e;
    }
    function Ea(a) {
      var c = JSON.parse(a);
      a = c.nb;
      var e = c.n;
      c = Ab(c);
      for (var d = new Uint32Array(e), k = 0; k < e; ++k)
        d[k] = Xa(c, k * a, a);
      return d;
    }
    function Za(a) {
      var c = JSON.parse(a);
      a = c.ne;
      var e = c.nf,
        d = c.n;
      c = Ab(c);
      for (
        var k = new Float32Array(d),
          p = new Float32Array(e),
          x = a + e + 1,
          q = 0;
        q < d;
        ++q
      ) {
        var t = x * q,
          v = 0 === ib(c, t) ? 1 : -1,
          E = Xa(c, t + 1, a);
        t = t + 1 + a;
        for (var K = p.length, l = 0, w = t; w < t + K; ++w)
          (p[l] = ib(c, w)), ++l;
        for (K = t = 0; K < e; ++K) t += p[K] * Math.pow(2, -K - 1);
        k[q] =
          0 === t && 0 === E
            ? 0
            : v * (1 + t) * Math.pow(2, 1 + E - Math.pow(2, a - 1));
      }
      return k;
    }
    function qb(a) {
      var c = null,
        e = null,
        d = null,
        k = 0;
      this.m = function (p) {
        this.Fn(p.vd);
        d.Hk({ Pf: p.Pf, Mf: p.Mf });
      };
      this.Cl = function (p) {
        return c[p];
      };
      this.Fn = function (p) {
        var x = null;
        k = p.length;
        c = p.map(function (q, t) {
          q = Object.assign({}, q, {
            index: t,
            parent: this,
            Fd: x,
            im: t === k - 1,
          });
          return (x = 0 === t ? Kc.instance(q) : Lc.instance(q));
        });
        e = c[0];
        d = c[k - 1];
        c.forEach(function (q, t) {
          0 !== t && q.Um();
        });
      };
      this.Aa = function (p) {
        var x = p;
        c.forEach(function (q) {
          x = q.Aa(x, !1);
        });
        return x;
      };
      this.Bl = function () {
        return e.L();
      };
      this.Xe = function () {
        return d.Fl();
      };
      this.th = function () {
        return d.th();
      };
      this.v = function () {
        c &&
          (c.forEach(function (p) {
            p.v();
          }),
          (d = e = c = null),
          (k = 0));
      };
      "undefined" !== typeof a && this.m(a);
    }
    function nb(a, c) {
      a[c] = !0;
      a.setAttribute(c, "true");
    }
    function xb() {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }
    function bc() {
      var a = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
      return a && a.length && 2 < a.length
        ? [parseInt(a[1], 10), parseInt(a[2], 10), parseInt(a[3] || 0, 10)]
        : [0, 0, 0];
    }
    function Gb() {
      var a = navigator.userAgent.toLowerCase();
      return -1 !== a.indexOf("safari") && -1 === a.indexOf("chrome") ? !0 : !1;
    }
    function Hb(a) {
      if (!a) return a;
      var c = null;
      if (a.video) {
        var e = function (d) {
          return d && "object" === typeof d ? Object.assign({}, d) : d;
        };
        c = {};
        "undefined" !== typeof a.video.width && (c.width = e(a.video.width));
        "undefined" !== typeof a.video.height && (c.height = e(a.video.height));
        "undefined" !== typeof a.video.facingMode &&
          (c.facingMode = e(a.video.facingMode));
      }
      c = { audio: a.audio, video: c };
      "undefined" !== typeof a.deviceId && Ib(c, a.deviceId);
      return c;
    }
    function Ib(a, c) {
      c &&
        ((a.video = a.video || {}),
        (a.video.deviceId = { exact: c }),
        a.video.facingMode && delete a.video.facingMode);
    }
    function Tb(a) {
      var c = a.video.width;
      a.video.width = a.video.height;
      a.video.height = c;
      return a;
    }
    function cc(a) {
      function c(l) {
        return [
          480, 576, 640, 648, 720, 768, 800, 960, 1080, 1152, 1280, 1366, 1920,
        ].sort(function (w, r) {
          return Math.abs(w - l) - Math.abs(r - l);
        });
      }
      function e(l) {
        var w = Hb(a);
        l = l(w);
        k.push(l);
        d(l);
      }
      function d(l) {
        if (l.video && l.video.facingMode && l.video.facingMode.exact) {
          var w = l.video.facingMode.exact;
          l = Hb(l);
          delete l.video.facingMode.exact;
          l.video.facingMode.ideal = w;
          k.push(l);
        }
      }
      var k = [];
      if (!a || !a.video) return k;
      d(a);
      if (a.video.width && a.video.height) {
        if (a.video.width.ideal && a.video.height.ideal) {
          var p = c(a.video.width.ideal).slice(0, 3),
            x = c(a.video.height.ideal).slice(0, 3),
            q = {},
            t = 0;
          for (q.ib = void 0; t < p.length; q = { ib: q.ib }, ++t) {
            q.ib = p[t];
            var v = {},
              E = 0;
            for (v.hb = void 0; E < x.length; v = { hb: v.hb }, ++E)
              if (
                ((v.hb = x[E]),
                q.ib !== a.video.width.ideal || v.hb !== a.video.height.ideal)
              ) {
                var K = Math.max(q.ib, v.hb) / Math.min(q.ib, v.hb);
                K < 4 / 3 - 0.1 ||
                  K > 16 / 9 + 0.1 ||
                  e(
                    (function (l, w) {
                      return function (r) {
                        r.video.width.ideal = l.ib;
                        r.video.height.ideal = w.hb;
                        return r;
                      };
                    })(q, v)
                  );
              }
          }
        }
        e(function (l) {
          return Tb(l);
        });
      }
      a.video.width &&
        a.video.height &&
        (a.video.width.ideal &&
          a.video.height.ideal &&
          e(function (l) {
            delete l.video.width.ideal;
            delete l.video.height.ideal;
            return l;
          }),
        e(function (l) {
          delete l.video.width;
          delete l.video.height;
          return l;
        }));
      a.video.facingMode &&
        (e(function (l) {
          delete l.video.facingMode;
          return l;
        }),
        a.video.width &&
          a.video.height &&
          e(function (l) {
            Tb(l);
            delete l.video.facingMode;
            return l;
          }));
      k.push({ audio: a.audio, video: !0 });
      return k;
    }
    function dc(a) {
      try {
        var c = window.matchMedia("(orientation: portrait)").matches ? !0 : !1;
      } catch (d) {
        c = window.innerHeight > window.innerWidth;
      }
      if (c && a && a.video) {
        c = a.video.width;
        var e = a.video.height;
        c &&
          e &&
          c.ideal &&
          e.ideal &&
          c.ideal > e.ideal &&
          ((a.video.height = c), (a.video.width = e));
      }
    }
    function Jb(a) {
      a.volume = 0;
      nb(a, "muted");
      if (Gb()) {
        if (1 === a.volume) {
          var c = function () {
            a.volume = 0;
            window.removeEventListener("mousemove", c, !1);
            window.removeEventListener("touchstart", c, !1);
          };
          window.addEventListener("mousemove", c, !1);
          window.addEventListener("touchstart", c, !1);
        }
        setTimeout(function () {
          a.volume = 0;
          nb(a, "muted");
        }, 5);
      }
    }
    function ec(a) {
      var c = Fa.element,
        e = Fa.Vg;
      return null === c
        ? Promise.resolve()
        : new Promise(function (d, k) {
            if (c.srcObject && c.srcObject.getVideoTracks) {
              var p = c.srcObject.getVideoTracks();
              1 !== p.length
                ? k("INVALID_TRACKNUMBER")
                : ((p = p[0]), a ? Ub(c, d, k, e) : (p.stop(), d()));
            } else k("BAD_IMPLEMENTATION");
          });
    }
    function Kb(a, c, e, d) {
      function k(x) {
        p || ((p = !0), e(x));
      }
      var p = !1;
      navigator.mediaDevices
        .getUserMedia(d)
        .then(function (x) {
          function q() {
            setTimeout(function () {
              if (a.currentTime) {
                var v = a.videoWidth,
                  E = a.videoHeight;
                if (0 === v || 0 === E) k("VIDEO_NULLSIZE");
                else {
                  v && (a.style.width = v.toString() + "px");
                  E && (a.style.height = E.toString() + "px");
                  v = { Dk: null, gg: null, Fm: null };
                  try {
                    var K = x.getVideoTracks()[0];
                    K &&
                      ((v.Fm = K),
                      (v.Dk = K.getCapabilities()),
                      (v.gg = K.getSettings()));
                  } catch (l) {}
                  Gb() || xb()
                    ? a.parentNode && null !== a.parentNode
                      ? (p || c(a, x, v),
                        setTimeout(function () {
                          a.play();
                        }, 100))
                      : (document.body.appendChild(a),
                        Jb(a),
                        p || c(a, x, v),
                        setTimeout(function () {
                          a.style.transform = "scale(0.0001,0.0001)";
                          a.style.position = "fixed";
                          a.style.bottom = "0px";
                          a.style.right = "0px";
                          Jb(a);
                          setTimeout(function () {
                            a.play();
                          }, 100);
                        }, 80))
                    : p || c(a, x, v);
                }
              } else k("VIDEO_NOTSTARTED");
            }, 700);
          }
          function t() {
            a.removeEventListener("loadeddata", t, !1);
            var v = a.play();
            Jb(a);
            "undefined" === typeof v
              ? q()
              : v
                  .then(function () {
                    q();
                  })
                  .catch(function () {
                    k("VIDEO_PLAYPROMISEREJECTED");
                  });
          }
          "undefined" !== typeof a.srcObject
            ? (a.srcObject = x)
            : ((a.src = window.URL.createObjectURL(x)), (a.videoStream = x));
          Jb(a);
          a.addEventListener("loadeddata", t, !1);
        })
        .catch(function (x) {
          k(x);
        });
    }
    function Ub(a, c, e, d) {
      if (a)
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          if (d && d.video) {
            if (xb()) {
              var k = bc();
              0 !== k[0] && (12 > k[0] || (12 === k[0] && 2 > k[1])) && dc(d);
            }
            d.video.width &&
              d.video.width.ideal &&
              (a.style.width = d.video.width.ideal + "px");
            d.video.height &&
              d.video.height.ideal &&
              (a.style.height = d.video.height.ideal + "px");
          }
          nb(a, "autoplay");
          nb(a, "playsinline");
          d && d.audio ? (a.volume = 0) : nb(a, "muted");
          Kb(
            a,
            c,
            function () {
              function p(q) {
                if (0 === q.length) e("INVALID_FALLBACKCONSTRAINTS");
                else {
                  var t = q.shift();
                  Kb(
                    a,
                    c,
                    function () {
                      p(q);
                    },
                    t
                  );
                }
              }
              var x = cc(d);
              p(x);
            },
            d
          );
        } else e && e("MEDIASTREAMAPI_NOTFOUND");
      else e && e("VIDEO_NOTPROVIDED");
    }
    function fc(a) {
      navigator.mediaDevices && navigator.mediaDevices.enumerateDevices
        ? navigator.mediaDevices
            .enumerateDevices()
            .then(function (c) {
              (c = c.filter(function (e) {
                return (
                  e.kind &&
                  -1 !== e.kind.toLowerCase().indexOf("video") &&
                  e.label &&
                  e.deviceId
                );
              })) &&
              c.length &&
              0 < c.length
                ? a(c, !1)
                : a(!1, "NODEVICESFOUND");
            })
            .catch(function () {
              a(!1, "PROMISEREJECTED");
            })
        : a(!1, "NOTSUPPORTED");
    }
    function Mc() {
      function a() {
        var M = Vb.dd;
        Lb = M * I.width;
        Mb = M * I.height;
      }
      function c() {
        ++L;
        2 === L &&
          (t(),
          oa.Lh(),
          oa.ij(),
          oa.sn(),
          R.Nc.forEach(function (M) {
            M();
          }),
          R.Nc.splice(0),
          S.model && !R.isBusy && oa.gi(S.model));
      }
      function e() {
        tb.reset();
        ub.stop();
        p(0);
      }
      function d(M) {
        cb && (ua.fn(cb), cb.remove());
        ua.Oj(M);
        cb = M;
      }
      function k(M) {
        J = M;
        ub.update({ la: J });
      }
      function p(M) {
        Z = -1;
        Q
          ? (Z = ea)
          : ia.isEnabled
          ? (Z = ia.pi)
          : P
          ? (q(), (Z = A === T.X ? tb.U() : 1))
          : ((Z = I.Lc[0]), q());
        za.ma();
        for (var aa = 0; aa < Z; ++aa)
          ca.set("s55"),
            y.rd.S(),
            y.zb.g(0),
            g.raw.g(1),
            Y.l(!1, !1),
            y.rd.g(0),
            n.Aa(y.rd);
        Q
          ? (ha(), (Q = !1), b.flush(), ub.Uf(p))
          : (ua.animate(M),
            ia.isEnabled ||
              (P &&
                (tb.nj(),
                (aa = tb.uh(1)),
                (U = I.me[0] + aa * (I.me[0] - I.me[1])),
                I.Ub &&
                  A === T.X &&
                  ((u.jj = I.ei + (I.fi - I.ei) * aa),
                  (u.Od = I.di + (I.wm - I.di) * aa),
                  (u.Od = Math.min(u.Od, 0.5)))),
              (G = M),
              A !== T.Ca && ub.Uf(p)));
      }
      function x() {
        G = Date.now();
        P = !0;
      }
      function q() {
        var M = Fa.element.currentTime - Va;
        0 > M && (Va = Fa.element.currentTime);
        1e3 * M < I.so ||
          (Fa.ja.refresh(),
          (Va += M),
          ca.set("s53"),
          za.ma(),
          y.zb.S(),
          Fa.ja.g(0),
          Y.l(!1, !0),
          null !== y.Bb &&
            (ca.set("s54"), y.Kc.o(), y.zb.g(0), y.Bb.g(1), Y.l(!1, !1)));
      }
      function t() {
        y.zj = X.instance({
          isPot: !0,
          xm: !0,
          isFloat: !1,
          url: I.aa + I.xa + I.to,
        });
        var M = { isPot: !1, xm: !0, isFloat: !1, width: Lb, height: Mb };
        y.zb = X.instance(M);
        y.Kc = X.instance(M);
        f.kj.push(y.zb, y.Kc);
        y.rd = X.instance({ isPot: !0, isFloat: !1, width: n.Bl() });
        I.xd &&
          (sa = X.instance({
            isPot: !1,
            isFloat: !1,
            isLinear: !0,
            url: (I.Df || -1 !== I.Cf.indexOf("//") ? "" : I.aa + I.xa) + I.Cf,
          }));
      }
      function v() {
        function M() {
          return {
            width: 3,
            height: 1,
            isFloat: !0,
            isPot: !1,
            array: new Float32Array([0, 0.5, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
          };
        }
        var aa = {
          width: 3,
          height: 1,
          isFloat: !0,
          isPot: !1,
          array: new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
        };
        g.raw = X.instance(M());
        g.Ic = X.instance(M());
        g.zc = Nc.instance(M());
        g.Ke = X.instance(aa);
        aa = {
          width: 2,
          height: 1,
          isFloat: !0,
          isPot: !1,
          array: new Float32Array([0, 0, 0, 0, 0, 0, 0, 0]),
        };
        g.yg = X.instance(aa);
        g.$d = X.instance(aa);
        u.Dd = X.instance({
          width: 1,
          height: 1,
          isFloat: !0,
          isPot: !1,
          array: new Float32Array([0, 0, 0, 0]),
        });
      }
      function E(M) {
        ca.set("s61");
        g.yg.S();
        g.raw.g(1);
        g.$d.g(2);
        var aa = I.se[0] + tb.uh(0.5) * (I.se[1] - I.se[0]);
        ca.G("u58", aa);
        ca.G("u59", tb.vl() / Z);
        Y.l(!1, !1);
        ca.set("s62");
        g.$d.o();
        g.yg.g(0);
        Y.l(!1, !1);
        M.g(0);
        g.raw.o();
        b.viewport(0, 0, 1, 1);
        ca.set("s56");
        ca.eg("u43", wc.get());
        g.zc.g(1);
        Y.l(!1, !1);
        ca.set("s57");
        b.viewport(1, 0, 2, 1);
        Y.l(!1, !1);
        g.Ke.S();
        ca.set("s58");
        ca.M("u51", I.oe[0] * U, I.oe[1]);
        g.raw.g(0);
        g.zc.g(1);
        Y.l(!1, !1);
        ca.set("s59");
        g.zc.yn(1);
        g.Ke.g(0);
        g.$d.g(2);
        Y.l(!1, !1);
        ca.set("s60");
        g.zc.g(0);
        g.Ic.o();
        Y.l(!1, !1);
        G - u.bi > u.jj &&
          I.Ub &&
          A === T.X &&
          ((u.bi = G),
          u.Dd.S(),
          ca.set("s63"),
          M.g(0),
          Y.l(!1, !1),
          va.jb.wj(Fa.ja, u.Dd, u.Od));
      }
      function K() {
        var M = I.aa,
          aa = I.ge.split("://").shift();
        if ("http" === aa || "https" === aa) M = "";
        M += I.ge;
        "json" !== M.split(".").pop() && (M += I.neuralNetworkPath);
        V(M, function (ja) {
          ja = JSON.parse(ja);
          n = new qb({ vd: ja.layers, Pf: "gpuRawAvg", Mf: E });
          c();
        });
      }
      var l = [-1, -1],
        w = null,
        r = [0.5, 0, 0, 0.5],
        f = { eb: null, Qb: !1, Da: !1, kj: [] },
        h = [0, I.Ga[1], I.Ga[2]],
        J = I.la,
        B = null,
        n = null;
      a();
      var m = [0, 0, 0],
        F = 1,
        O = 0,
        y = { zb: null, Kc: null, rd: null, zj: null, Bb: null },
        g = { raw: null, Ic: null, zc: null, Ke: null, yg: null, $d: null },
        G = 0,
        u = {
          fb: null,
          Ab: null,
          If: null,
          bi: 0,
          jj: I.fi,
          Od: 0.1,
          Dd: null,
        },
        L = 0,
        H = !1,
        P = !0,
        U = 1,
        Z = -1,
        T = { Ca: -1, X: 0, Ia: 1, ec: 2, fc: 3 },
        A = T.X,
        N = null,
        z = T.X,
        C = !1,
        Q = !1,
        ea = 1,
        ha = !1,
        ia = { isEnabled: !1, Ie: null, Ya: null, pi: 0 },
        sa = null,
        Wa = -1,
        Ja = !1,
        na = !1,
        ka = !1,
        Ga = [0, 0, 0],
        W = 1,
        fa,
        ta,
        Ma,
        pa = { Ga: [0, 0, 0], vb: 1, Bc: 0, za: 0, ra: 0, oa: I.oa },
        kb = [0, 0, 0],
        Ha = { scale: 1, offsetX: 0, offsetY: 0 },
        Va = 0,
        oa = {
          Kh: function () {
            a();
            l[0] = 1;
            l[1] = Lb / Mb;
            wc.m({
              Cd: I.scanOverlapFactors,
              oi: I.scanNScaleLevels,
              wa: Lb,
              hf: Mb,
              Mi: I.scanScale0Factor,
              Sa: I.Sa,
              Ni: !0,
            });
            Wa =
              I.width > I.height
                ? [I.width / I.height, 1]
                : [1, I.height / I.width];
            f.Da = !0;
          },
          m: function () {
            ca.le([
              {
                id: "s53",
                name: "_",
                s: "attribute vec2 a0;uniform mat2 u38;varying vec2 vv0;void main(){gl_Position=vec4(a0,0.,1.),vv0=vec2(.5,.5)+u38*a0;}",
                H: ["a0"],
                O: [2],
                h: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
                i: ["u1", "u38"],
                precision: "lowp",
              },
              {
                id: "s55",
                name: "_",
                h: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
                s: "attribute vec2 a0;uniform sampler2D u39;uniform vec2 u40;uniform float u41;const vec2 g=vec2(.16,.5),h=vec2(.5,.5),i=vec2(.84,.5),p=vec2(.5,.5);varying vec2 vv0;void main(){vec4 a=texture2D(u39,g);vec2 k=a.gb,b=a.a*u40;vec4 c=texture2D(u39,h);float q=c.a,l=c.y;vec2 m=vec2(mix(1.,1./cos(l),u41),1.);b*=m;vec2 n=a0*.5;float d=texture2D(u39,i).r,e=cos(d),f=sin(d);vec2 o=mat2(e,f,-f,e)*n;vv0=k+o*b,gl_Position=vec4(a0,0.,1.);}",
                H: ["a0"],
                O: [2],
                i: ["u1", "u39", "u40", "u41"],
                precision: "lowp",
              },
              {
                id: "s56",
                name: "_",
                s: "attribute vec2 a0;void main(){gl_Position=vec4(a0,0.,1.);}",
                h: "uniform sampler2D u42,u39;uniform vec3 u43,u44;uniform float u45,u46;const vec4 e=vec4(.25,.25,.25,.25);const vec2 f=vec2(.16,.5);void main(){vec4 b=texture2D(u42,vec2(.625,.625)),c=texture2D(u42,vec2(.875,.625));float d=dot(b-c,e);bool g=d>u46;vec4 a=texture2D(u39,f);g?a.r=2.:a.r>u45?a.r=0.:a.r>1.9?a.r+=1.:0.;if(a.r<.9)a=vec4(1.,u43);else{float h=dot(e,texture2D(u42,vec2(.875,.875))),i=dot(e,texture2D(u42,vec2(.125,.625))),j=dot(e,texture2D(u42,vec2(.375,.625)));a.r*=step(1.9,a.r),a.gba+=vec3(h,i,j)*u44*a.a;}gl_FragColor=a;}",
                i: "u42 u39 u43 u45 u44 u46".split(" "),
              },
              {
                id: "s57",
                name: "_",
                h: "uniform sampler2D u42,u39;uniform vec3 u47,u48;uniform vec2 u49;const vec4 v=vec4(1.,1.,1.,1.),f=vec4(0.,0.,0.,0.),e=vec4(.25,.25,.25,.25);const vec2 g=vec2(.16,.5),h=vec2(.5,.5),i=vec2(.84,.5);varying vec2 vv0;void main(){float k=step(vv0.x,.5);vec4 l=texture2D(u39,g);if(l.r<1.9){gl_FragColor=f;return;}float m=dot(texture2D(u42,vec2(.125,.125)),e),a=smoothstep(u49.x,u49.y,m);vec4 n=texture2D(u39,h);float o=n.a;a=mix(a,o,.3);float p=dot(e,texture2D(u42,vec2(.125,.875))),q=dot(e,texture2D(u42,vec2(.375,.875))),r=dot(e,texture2D(u42,vec2(.625,.875)));vec3 s=vec3(p,q,r),b=u48+s*u47;float c=texture2D(u39,i).r,d=b.z*.07;c+=d,b.z-=d;vec4 t=vec4(b,a),u=vec4(c,0.,0.,0.);gl_FragColor=mix(u,t,k);}",
                i: ["u42", "u39", "u49", "u47", "u48"],
              },
              {
                id: "s58",
                name: "_",
                h: "uniform sampler2D u39,u50;uniform vec2 u51;uniform float u52,u53;const vec4 f=vec4(1.,1.,1.,1.),g=vec4(1.,0.,0.,0.),h=vec4(0.,0.,0.,1.);const vec2 i=vec2(.5,.5);varying vec2 vv0;void main(){vec4 c=texture2D(u39,vv0),d=texture2D(u50,vv0),j=texture2D(u39,i);float k=pow(j.a,u53),l=(1.-k)*(u51.y-u51.x)+u51.x,a=step(.33,vv0.x)*step(vv0.x,.67);vec4 m=mix(g,h,a),b=max(l*f,m);b*=mix(f,u52*vec4(1.,1.,1.,0.)+vec4(0.,0.,0.,1.),a);vec4 n=c-d;gl_FragColor=n*b;}",
                i: ["u39", "u50", "u51", "u52", "u53"],
                precision: "highp",
              },
              {
                id: "s59",
                name: "_",
                h: "uniform sampler2D u50,u55,u56;const vec4 i=vec4(1.,1.,1.,1.);const vec2 f=vec2(.25,.5),g=vec2(.75,.5);varying vec2 vv0;void main(){float c=step(.33,vv0.x)*step(vv0.x,.66),j=step(.66,vv0.x);vec4 d=texture2D(u50,vv0),h=texture2D(u55,vv0),a=d+h;float b=a.a;b*=texture2D(u56,f).a,b*=texture2D(u56,g).a,a.a=mix(a.a,b,c),gl_FragColor=a;}",
                i: ["u50", "u55", "u56"],
                precision: "highp",
              },
              {
                id: "s60",
                name: "_",
                h: "uniform sampler2D u39;uniform float u57;const vec4 g=vec4(1.,1.,1.,1.);const vec2 f=vec2(.5,.5);varying vec2 vv0;void main(){vec4 a=texture2D(u39,vv0);float b=step(vv0.x,.33),c=texture2D(u39,f).g;a.a+=b*a.a*u57*abs(sin(c)),gl_FragColor=a;}",
                i: ["u39", "u57"],
                precision: "highp",
              },
              {
                id: "s61",
                name: "_",
                h: "uniform sampler2D u39,u56,u42;uniform vec3 u47,u48;uniform float u58,u59;const vec4 e=vec4(.25,.25,.25,.25);const vec3 g=vec3(1.,1.,1.);const vec2 h=vec2(.5,.5);const vec3 i=vec3(1.,1.,.2);varying vec2 vv0;void main(){vec4 c=texture2D(u39,h);float d=step(vv0.x,.5),a=1.-d;vec4 j=texture2D(u56,vv0);float k=c.a;vec2 l=mix(vec2(.75,.75),vec2(0.,.75),a),m=mix(vec2(0.,.5),vec2(.25,.75),a),n=mix(vec2(.25,.5),vec2(.5,.75),a);float o=dot(e,texture2D(u42,l)),p=dot(e,texture2D(u42,m)),q=dot(e,texture2D(u42,n));vec3 r=mix(i,u47,a),b=r*vec3(o,p,q),s=c.rgb;b=mix(b,u48+b-s,a),b*=k/u59;vec4 t=mix(vec4(b,0.),j,vec4(u58*g,0.));gl_FragColor=t;}",
                i: "u39 u56 u42 u58 u59 u47 u48".split(" "),
                precision: "highp",
              },
              {
                id: "s62",
                name: "_",
                h: "uniform sampler2D u56;uniform vec2 u61,u62;const vec4 h=vec4(.25,.25,.25,.25);varying vec2 vv0;void main(){float a=step(.5,vv0.x),c=mix(u61.x,u62.x,a),d=mix(u61.y,u62.y,a);vec3 b=texture2D(u56,vv0).rgb;float f=length(b),g=1.-smoothstep(c,d,f);gl_FragColor=vec4(b,g);}",
                i: ["u56", "u61", "u62"],
                precision: "highp",
              },
              {
                id: "s63",
                name: "_",
                s: "attribute vec2 a0;void main(){gl_Position=vec4(a0,0.,1.);}",
                h: "uniform sampler2D u42;const vec4 g=vec4(1.,1.,1.,1.),h=vec4(0.,0.,0.,0.),e=vec4(.25,.25,.25,.25);const float f=3.1415;void main(){float a=dot(texture2D(u42,vec2(.25,.25)),e),b=dot(texture2D(u42,vec2(.5,.25)),e),c=f/2.*dot(texture2D(u42,vec2(.75,.25)),e),d=4.18*dot(texture2D(u42,vec2(0.,.25)),e);gl_FragColor=vec4(d,a,b,c);}",
                i: ["u42"],
              },
              {
                id: "s54",
                name: "_",
                h: "uniform sampler2D u1,u63;varying vec2 vv0;vec4 i(vec4 a,sampler2D g){mediump float b=a.b*63.;mediump vec2 c;c.y=floor(floor(b)/8.),c.x=floor(b)-c.y*8.;mediump vec2 d;d.y=floor(ceil(b)/8.),d.x=ceil(b)-d.y*8.;highp vec2 e;e.x=c.x*.125+9.765625e-4+.123047*a.r,e.y=c.y*.125+9.765625e-4+.123047*a.g;highp vec2 f;f.x=d.x*.125+9.765625e-4+.123047*a.r,f.y=d.y*.125+9.765625e-4+.123047*a.g;lowp vec4 j=texture2D(g,e),k=texture2D(g,f),l=mix(j,k,fract(b));return l;}void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=i(a,u63);}",
                i: ["u1", "u63"],
              },
            ]);
            v();
            K();
            ub.m({ Th: !1, la: J });
            tb.m({ Lf: 0, n: I.Lc[1] - I.Lc[0] + 1, ci: I.Lc[0] });
            R.set_videoRotation = function (M) {
              $a.rotate = M;
              R.ready &&
                (db.fg(Fa.element.videoWidth, Fa.element.videoHeight), db.mg());
            };
            R.set_viewRotation = function () {};
            R.set_LUT = function (M) {
              M
                ? X.instance({
                    url: M,
                    isFloat: !1,
                    isFlipY: !1,
                    P: function (aa) {
                      y.Bb = aa;
                      oa.Hc();
                    },
                  })
                : ((y.Bb = null), oa.Hc());
            };
            R.resize = function (M, aa) {
              function ja() {
                ub.stop();
                f.eb && (clearTimeout(f.eb), (f.eb = null));
                if (!f.Qb)
                  if (I.width === Ca && I.height === Qa) e();
                  else if (A !== T.X && A !== T.Ia) f.eb = setTimeout(ja, I.Ki);
                  else {
                    var eb = "undefined" === typeof rb ? !1 : rb.get_mode(),
                      ab = A;
                    A = T.Ca;
                    Q = f.Qb = !0;
                    ha = function () {
                      Q = !1;
                      f.Qb = !1;
                      x();
                      k(I.la);
                      B && clearTimeout(B);
                      B = !1;
                      A = ab;
                    };
                    I.width = Ca;
                    I.height = Qa;
                    oa.Kh();
                    oa.Lh();
                    f.kj.forEach(function (Ka) {
                      Ka.resize(Ca, Qa);
                    });
                    ba.resize(Lb, Mb);
                    oa.Hc();
                    db.fg(
                      Fa.element.videoWidth
                        ? Fa.element.videoWidth
                        : Fa.element.width,
                      Fa.element.videoHeight
                        ? Fa.element.videoHeight
                        : Fa.element.height
                    );
                    db.mg();
                    db.ij();
                    e();
                    A === T.Ia && ((A = T.X), R.switch_viewer3D(!0, !1));
                    eb && rb.switch_mode(eb);
                  }
              }
              if (R.ready) {
                f.eb && (clearTimeout(f.eb), (f.eb = null));
                ub.stop();
                var Ca = M * Vb.dd,
                  Qa = aa * Vb.dd;
                f.eb = setTimeout(ja, I.Ki);
              }
            };
          },
          v: function () {
            ub.v();
            return new Promise(function (M) {
              R.switch_sleep(!0, !0)
                .finally(function () {
                  n && n.v();
                  ba.v();
                  fb.v();
                  b && (b = null);
                  n = null;
                  I.Df = !1;
                  cb = null;
                  P = !0;
                  U = 1;
                  Z = -1;
                  A = T.X;
                  N = null;
                  z = T.X;
                  Object.assign(Fa, xc);
                  Object.assign(I, yc);
                  M();
                })
                .catch(function () {});
            });
          },
          Lh: function () {
            ca.j("s55", [
              { type: "1i", name: "u1", value: 0 },
              { type: "1i", name: "u39", value: 1 },
              { type: "2f", name: "u40", value: l },
              { type: "1f", name: "u41", value: I.Pk },
            ]);
            ca.j("s56", [
              { type: "1i", name: "u42", value: 0 },
              { type: "1i", name: "u39", value: 1 },
              { type: "1f", name: "u45", value: I.ao },
              { type: "1f", name: "u46", value: I.Qk },
              {
                type: "3f",
                name: "u44",
                value: [I.Sa[0] * l[0], I.Sa[1] * l[1], I.Sa[2]],
              },
            ]);
            ca.j("s57", [
              { type: "1i", name: "u42", value: 0 },
              { type: "1i", name: "u39", value: 1 },
              { type: "2f", name: "u49", value: I.Xm },
              { type: "3f", name: "u47", value: [-I.Ba[0], -I.Ba[1], I.Ba[2]] },
              { type: "3f", name: "u48", value: I.mj },
            ]);
            ca.j("s58", [
              { type: "1i", name: "u39", value: 0 },
              { type: "1i", name: "u50", value: 1 },
              { type: "2f", name: "u51", value: I.oe },
              { type: "1f", name: "u52", value: I.ln },
              { type: "1f", name: "u53", value: I.Wm },
            ]);
            ca.j("s59", [
              { type: "1i", name: "u50", value: 1 },
              { type: "1i", name: "u55", value: 0 },
              { type: "1i", name: "u56", value: 2 },
            ]);
            ca.j("s60", [
              { type: "1i", name: "u39", value: 0 },
              { type: "1f", name: "u57", value: I.on },
            ]);
            ca.j("s61", [
              { type: "1i", name: "u42", value: 0 },
              { type: "1i", name: "u39", value: 1 },
              { type: "1i", name: "u56", value: 2 },
              { type: "3f", name: "u47", value: [-I.Ba[0], -I.Ba[1], I.Ba[2]] },
              { type: "3f", name: "u48", value: I.mj },
            ]);
            ca.j("s62", [
              { type: "1i", name: "u56", value: 0 },
              { type: "2f", name: "u61", value: I.bo },
              { type: "2f", name: "u62", value: I.mn },
            ]);
            ca.j("s63", [{ type: "1i", name: "u42", value: 0 }]);
            ca.j("s54", [
              { type: "1i", name: "u1", value: 0 },
              { type: "1i", name: "u63", value: 1 },
            ]);
          },
          Hc: function () {
            ua.Ti(g.Ic, null === y.Bb ? y.zb : y.Kc, u.Dd, y.zj);
          },
          El: function () {
            return Ha;
          },
          Zi: function (M) {
            Ha = M;
          },
          Wd: function () {
            kb[0] = m[0] - Ha.offsetX;
            kb[1] = m[1] + Ha.offsetY;
            kb[2] = m[2];
            ua.vn(h, pa.Ga, kb);
          },
          Xd: function () {
            ua.wn(F * I.vb, pa.vb, Ha.scale);
          },
          uj: function () {
            ua.xn(O + pa.Bc);
          },
          io: function () {
            ua.tn(I.za + pa.za, I.ra + pa.ra);
          },
          ko: function () {
            ua.un((0 === pa.oa[0] && 0 === pa.oa[1] ? I : pa).oa);
          },
          Yd: function () {
            oa.Wd();
            oa.Xd();
            oa.uj();
            oa.io();
            oa.ko();
          },
          nn: function () {
            ub.stop();
            N && (clearInterval(N), (N = null));
            ia.isEnabled = !0;
            ia.pi = 0;
            Ja = ua.Dl();
            na = cb.Ah();
            ka = cb.yh();
            W = pa.vb;
            Ga = pa.Ga;
            fa = pa.oa;
            ta = pa.za;
            Ma = pa.ra;
            Q = !1;
            ua.Pd(!1);
          },
          kn: function (M) {
            function aa() {
              2 === ++ja &&
                ((ia.isEnabled = !1),
                (pa.vb = W),
                (pa.Ga = Ga),
                (pa.oa = fa),
                (pa.za = ta),
                (pa.ra = Ma),
                oa.Yd(),
                ua.ua(Ja),
                e(),
                M && M());
            }
            var ja = 0;
            A === T.ec ? (A = T.Ia) : A === T.fc && (A = T.X);
            ua.$a(A === T.X ? 0 : 1);
            cb.replace(na, aa);
            cb.$f(ka, aa);
            oa.Hc();
            ua.Pd(!0);
          },
          ij: function () {
            var M = Math.tan(Fa.Mb / 2);
            ua.Si({
              Re: I.Re / M,
              pn: M,
              Vm: Fa.Bi,
              Fa: I.Fa,
              Kf: I.Kf,
              Cj: l,
              Kj: I.wo,
              sc: I.sc,
              gf: I.gf,
              ef: I.ef,
              ff: I.ff,
              oa: I.oa,
              pe: I.pe,
              De: I.De,
              Tf: I.Tf,
              bc: I.bc,
              Rn: I.dj,
              Sn: I.ej,
              Nd: I.Nd,
              cc: I.cc,
              Wc: I.Wc,
              He: I.He,
              Ge: I.Ge,
              Fe: I.Fe,
              ue: I.ue,
              te: I.aa + I.xa + I.te,
              za: I.za,
              ra: I.ra,
              cf: I.cf,
              Dg: I.Dg,
              Cg: I.Cg,
              ce: I.ce,
              Co: I.Bo,
              be: Fa.be,
              xd: I.xd,
              zm: sa,
              wd: I.wd,
              yd: I.yd,
              Bf: I.Bf,
              ym: Wa,
              ng: I.ng,
            });
          },
          Ek: function () {
            var M = $a.fe,
              aa = $a.ee,
              ja = 1 / Math.tan(Fa.Mb / 2),
              Ca = fb.T() / fb.L();
            Fa.Bi = [
              ja,
              0,
              0,
              0,
              0,
              ja / Ca,
              0,
              0,
              0,
              0,
              -(aa + M) / (aa - M),
              -1,
              0,
              0,
              (-2 * M * aa) / (aa - M),
              0,
            ];
            Fa.be = 1 / Math.tan((I.zo * Math.PI) / 360) / ja;
          },
          fg: function (M, aa) {
            w = [0.5, 0.5];
            M = aa / M;
            aa = fb.T() / fb.L();
            90 === Math.abs($a.rotate) && (M = 1 / M);
            M > aa ? (w[1] *= aa / M) : (w[0] *= M / aa);
            r[0] = 0;
            r[1] = 0;
            r[2] = 0;
            r[3] = 0;
            switch ($a.rotate) {
              case 0:
                r[0] = w[0];
                r[3] = w[1];
                break;
              case 180:
                r[0] = -w[0];
                r[3] = -w[1];
                break;
              case 90:
                r[1] = w[0];
                r[2] = -w[1];
                break;
              case -90:
                (r[1] = -w[0]), (r[2] = w[1]);
            }
            Fa.Mb =
              2 *
              Math.atan(
                2 *
                  w[0] *
                  Math.tan(
                    ((1 < M ? $a.Ej : $a.FOVdesktop) * Math.PI) / 180 / 2
                  )
              );
            oa.Ek();
          },
          mg: function () {
            ca.j("s53", [
              { type: "1i", name: "u1", value: 0 },
              { type: "mat2", name: "u38", value: r },
            ]);
          },
          lf: function (M, aa) {
            f.Da || oa.Kh();
            oa.$l(M, aa);
            oa.m();
            if (!oa.Xl())
              return (
                R.lb && R.lb("GL_INCOMPATIBLE", "Cannot init JEELIZVTO"), !1
              );
            oa.Ih();
            return !0;
          },
          $l: function (M, aa) {
            R.Db = document.createElement("canvas");
            R.Cb = document.createElement("canvas");
            R.Cb.width = I.width;
            R.Cb.height = I.height;
            R.Lj = R.Cb.getContext("2d");
            R.replace_video = function (ja) {
              Fa.element = ja;
              Fa.tg.ha = Fa.element;
              return !0;
            };
            R.lc = R.Db.getContext("2d");
            R.capture_background = function (ja, Ca) {
              ja = "undefined" === typeof ja ? M : ja;
              Ca = "undefined" === typeof Ca ? aa : Ca;
              R.Db.width = ja;
              R.Db.height = Ca;
              var Qa = ja / Ca,
                eb = 0,
                ab = 0;
              if (M / aa > Qa) {
                var Ka = aa * Qa;
                Qa = aa;
                eb = Math.round((M - Ka) / 2);
              } else (Ka = M), (Qa = M / Qa), (ab = Math.round((aa - Qa) / 2));
              R.lc.save();
              R.lc.translate(ja, 0);
              R.lc.scale(-1, 1);
              R.lc.drawImage(Fa.element, eb, ab, Ka, Qa, 0, 0, ja, Ca);
              R.lc.restore();
              ja = document.createElement("canvas");
              ja.width = R.Db.width;
              ja.height = R.Db.height;
              ja.getContext("2d").drawImage(R.Db, 0, 0);
              return ja;
            };
          },
          Ih: function () {
            window.CanvasListeners &&
              (rb.init({ ta: fb.pb() }),
              (R.init_listeners = oa.Ih),
              (R.add_listener = rb.add_listener),
              (R.remove_listener = rb.remove_listener),
              (R.animate_swipe = rb.animate_swipe),
              (R.switch_modeInteractor = rb.switch_mode),
              (R.get_modeInteractor = rb.get_mode),
              rb
                .add_listener(
                  "move",
                  function (M, aa) {
                    A === T.X &&
                      (I.Am &&
                        ((Ha.offsetX -= aa[0] * I.ii),
                        (Ha.offsetX = Math.min(
                          Math.max(Ha.offsetX, -I.zd),
                          I.zd
                        ))),
                      (Ha.offsetY -= aa[1] * I.ii),
                      (Ha.offsetY = Math.min(
                        Math.max(Ha.offsetY, -I.zd),
                        I.zd
                      )),
                      oa.Wd());
                  },
                  !0
                )
                .add_listener(
                  "pinch",
                  function (M, aa) {
                    A === T.X &&
                      ((Ha.scale += aa * I.Bm),
                      (Ha.scale = Math.min(
                        Math.max(Ha.scale, I.ji[0]),
                        I.ji[1]
                      )),
                      oa.Xd());
                  },
                  !0
                ));
          },
          Xl: function () {
            return ba.m({
              sd: !1,
              Ck: !1,
              expand: !1,
              ta: fb.pb(),
              Ob: fb,
              onload: function () {
                u.Ab = Wb.instance({
                  Gb: I.aa + I.xa + bb.uo,
                  nc: I.aa + I.xa + bb.vo,
                  mc: bb.Aj,
                  oc: bb.Bj,
                });
                I.Ub
                  ? ((u.fb = Wb.instance({})), va.jb.ua(u.fb))
                  : (u.fb = u.Ab);
                ua.ua(u.fb);
                u.If = I.Ub ? Oc.instance({ vm: u.fb, tm: u.Ab }) : u.Ab;
                c();
              },
            });
          },
          sn: function () {
            R.load_model = function (M, aa, ja) {
              if (R.isBusy) return !1;
              R.isBusy = !0;
              if (S.model)
                R.set_model(
                  M,
                  function () {
                    R.set_materials(aa, function () {
                      R.isBusy = !1;
                      ja && ja();
                    });
                  },
                  function () {
                    R.isBusy = !1;
                  }
                );
              else {
                var Ca = I.aa + I.xa + I.Ff + "/",
                  Qa = aa.map(function (eb) {
                    return Ca + eb;
                  });
                S.model = {
                  url: I.aa + I.xa + I.Jf + "/" + M,
                  yc: Qa,
                  Fb: !1,
                  Eb: !1,
                };
                oa.gi(S.model, function () {
                  R.isBusy = !1;
                  ja && ja();
                });
              }
              return !0;
            };
            R.set_offset = function (M) {
              m = M;
              oa.Wd();
            };
            R.set_scale = function (M) {
              F = M;
              oa.Xd();
            };
            R.set_rx = function (M) {
              O = M;
              oa.uj();
            };
            R.switch_shadow = ua.lg;
            R.switch_bgBlur = ua.kg;
            R.set_zoom = ua.Zf;
            R.is_viewer3D = function () {
              return A === T.Ia;
            };
            R.switch_viewer3D = function (M, aa) {
              if (
                A === T.ec ||
                A === T.fc ||
                (A === T.X && !M) ||
                (A === T.Ia && M) ||
                Q
              )
                return !1;
              if (A === T.Ca)
                return z !== T.Ia || M
                  ? z === T.X && M
                    ? ((z = T.Ia), ua.ua(u.Ab), ua.$a(1), aa && aa(), !0)
                    : !1
                  : ((z = T.X), ua.ua(u.fb), ua.$a(0), aa && aa(), !0);
              var ja = 0,
                Ca = -1,
                Qa = 0;
              A === T.X
                ? ((A = T.ec), (Ca = I.Ao))
                : A === T.Ia && ((A = T.fc), (Ca = I.Do));
              var eb = Date.now();
              N = setInterval(function () {
                var ab = Date.now();
                ja += (ab - eb) / Ca;
                1 <= ja &&
                  ((ja = 1),
                  A === T.ec
                    ? ((A = T.Ia), ua.ua(u.Ab))
                    : ((A = T.X), ua.ua(u.fb)),
                  aa && aa(),
                  clearInterval(N),
                  (N = null));
                var Ka = A === T.fc || A === T.X ? 1 - I.yo(ja) : I.xo(ja);
                ua.$a(Ka);
                (A !== T.fc && A !== T.ec) ||
                  0 !== Qa++ % 2 ||
                  (ua.ua(u.If), u.If.Mn(Ka));
                eb = ab;
              }, 0.016);
              return !0;
            };
            R.capture_image = function (M, aa, ja, Ca) {
              ea = M;
              Q = !0;
              "undefined" === typeof isAllocate && (ja = !1);
              (Ca = "undefined" === typeof Ca ? !1 : Ca) && ua.Pd(!1);
              q();
              ha = function () {
                ua.Gi(0);
                b.flush();
                var Qa = fb.vh(ja);
                aa(Qa);
                Ca && ua.Pd(!0);
              };
            };
            R.capture_detection = function (M, aa) {
              ea = M;
              Q = !0;
              var ja = null === y.Bb ? y.zb : y.Kc;
              ha = function () {
                var Ca = zc.instance({
                  Ee: g.Ic.clone(),
                  mi: cb.Ah(),
                  li: cb.yh(),
                  background: ja.clone(),
                  Ya: va.jb.Ql().clone(),
                  Ef: Ha,
                });
                aa(Ca);
              };
            };
            R.process_offlineRendering = function (M, aa, ja, Ca, Qa) {
              function eb() {
                if (2 === ++ab) {
                  ia.Ya || (ia.Ya = Wb.instance({}));
                  M.xh() && (ia.Ya.Yi(M.xh()), ua.ua(ia.Ya));
                  ia.Ie.set();
                  e();
                  ia.Ie = !1;
                  oa.kn(
                    Ca
                      ? function () {
                          fb.pb().parentNode.removeChild(R.Cb);
                        }
                      : !1
                  );
                  var Ka = fb.vh(!1);
                  setTimeout(function () {
                    Qa(Ka);
                  }, 1);
                }
              }
              oa.nn();
              Ca &&
                (R.Lj.drawImage(fb.pb(), 0, 0),
                fb.pb().parentNode.insertBefore(R.Cb, fb.pb()),
                R.Cb.setAttribute("class", "jeefitMask"));
              ia.Ie = M;
              var ab = 0;
              R.set_model(aa, function () {
                eb();
                R.set_materials(ja, function () {
                  setTimeout(eb, 1);
                });
              });
            };
            R.serialize_detection = function (M) {
              return M.Cc();
            };
            R.unserialize_detection = function (M, aa, ja) {
              return zc.Jc(M, aa, ja);
            };
            R.do_instantDetection = function (M, aa) {
              Ac.m(g.Ic);
              Ac.start(M, aa);
            };
            R.relieve_DOM = function (M, aa) {
              if (f.Qb) return !1;
              k(aa || 160);
              P = !1;
              B && clearTimeout(B);
              B = setTimeout(function () {
                k(I.la);
                B = !1;
                x();
              }, M);
              return !0;
            };
            R.switch_slow = function (M, aa) {
              if (f.Qb) return !1;
              "undefined" === typeof aa && (aa = I.Rj);
              B && (k(I.la), x(), clearTimeout(B), (B = !1));
              M ? (P = !1) : x();
              k(M ? aa : I.la);
              return !0;
            };
            R.switch_deepSleep = function (M) {
              if (C === M) return !1;
              C = !1;
              R.switch_sleep(M);
              C = M;
              return !0;
            };
            R.switch_sleep = function (M, aa) {
              function ja() {
                R.isBusy = !1;
                M ? ((z = A), (A = T.Ca)) : ((A = z), e());
              }
              if (f.Qb || C || R.isBusy) return aa ? Promise.reject() : null;
              if ((M && A === T.Ca) || (!M && A !== T.Ca))
                return aa ? Promise.resolve(!1) : !1;
              N && (clearInterval(N), (N = null));
              A === T.fc
                ? ((A = T.X), ua.ua(u.fb), ua.$a(0))
                : A === T.ec && ((A = T.Ia), ua.ua(u.Ab), ua.$a(1));
              ub.stop();
              var Ca = null;
              R.isBusy = !0;
              aa ? (Ca = ec(!M).then(ja)) : ja();
              return aa ? Ca : !0;
            };
            R.set_modelStandalone = function (M, aa) {
              ua.Qd(!1);
              oc.instance({
                url: M.model,
                yc: M.materials,
                Fb: !1,
                Eb: !1,
                P: function (ja) {
                  pa.Ga = [0, 0, 0];
                  pa.vb = 1;
                  pa.Bc = 0;
                  pa.za = I.za;
                  pa.ra = I.ra;
                  pa.oa = I.oa;
                  R.ready && oa.Yd();
                  aa && aa();
                  d(ja);
                  oa.ig();
                  ua.Qd(!0);
                },
              });
            };
            R.start_rendering = oa.ig;
            R.update_material = function (M, aa) {
              cb && cb.lo(M, aa);
            };
            R.set_model = function (M, aa, ja) {
              cb &&
                cb.replace(
                  "http" === M.substring(0, 4).toLowerCase()
                    ? M
                    : I.aa + I.xa + I.Jf + "/" + M,
                  function () {
                    aa && aa(cb.Gk());
                  },
                  ja
                );
            };
            R.set_tweaker = function (M, aa) {
              function ja(Ca) {
                R.Jg(Ca);
                aa && aa();
              }
              "string" === typeof M
                ? V(I.aa + I.xa + I.co + "/" + M, ja)
                : ja(M);
            };
            R.Jg = function (M) {
              M &&
                (M.preOffset && (pa.Ga = M.preOffset),
                M.preScale && (pa.vb = M.preScale),
                M.rx && (pa.Bc = M.rx),
                M.beginBendZ && (pa.za = M.beginBendZ),
                M.bendStrength && (pa.ra = M.bendStrength),
                M.maskBranchStartEnd && (pa.oa = M.maskBranchStartEnd),
                R.ready && oa.Yd());
            };
            R.set_materials = function (M, aa) {
              if (cb) {
                var ja = I.aa + I.xa + I.Ff + "/";
                M = M.map(function (Ca) {
                  var Qa = Ca;
                  "string" === typeof Ca &&
                    ((Qa = ja + Ca), (Qa = Qa.replace(/([^:])\/\//, "$1/")));
                  return Qa;
                });
                cb.$f(M, aa);
              }
            };
          },
          ig: function () {
            H ||
              (oa.Hc(),
              I.Ub && (za.reset(), va.jb.vk(Fa.ja), va.jb.uk()),
              (R.ready = !0),
              (G = 0),
              e(),
              (L = 0),
              (H = !0),
              ba.xg(Vb.ml),
              oa.Yd(),
              ua.Xn(),
              R.Oc.forEach(function (M) {
                M();
              }),
              R.Oc.splice(0));
          },
          gi: function (M, aa) {
            M = oc.instance({
              P: function () {
                oa.ig();
                aa && aa();
              },
              url: M.url,
              yc: M.yc,
              Fb: M.Fb,
              Eb: M.Eb,
            });
            d(M);
          },
          $n: function () {
            if (I.Ub) {
              var M = Object.assign({}, bb, { Xb: I.aa + I.xa + bb.Xb });
              va.jb.ag(M);
            }
          },
        };
      return oa;
    }
    function Nb(a) {
      return 3 === arguments.length ? this.mb(arguments) : this.set(a);
    }
    function Bc(a, c) {
      c = Math.floor(c);
      a.r = ((c >> 16) & 255) / 255;
      a.Y = ((c >> 8) & 255) / 255;
      a.b = (c & 255) / 255;
    }
    function Pc(a, c) {
      function e(q) {
        void 0 !== q &&
          1 > parseFloat(q) &&
          console.warn(
            "JETHREE.Color: Alpha component of " + c + " will be ignored."
          );
      }
      var d;
      if ((d = /^((?:rgb|hsl)a?)\(\s*([^\)]*)\)/.exec(c))) {
        var k = d[2];
        switch (d[1]) {
          case "rgb":
          case "rgba":
            if (
              (d =
                /^(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec(
                  k
                ))
            ) {
              a.r = Math.min(255, parseInt(d[1], 10)) / 255;
              a.Y = Math.min(255, parseInt(d[2], 10)) / 255;
              a.b = Math.min(255, parseInt(d[3], 10)) / 255;
              e(d[5]);
              return;
            }
            if (
              (d =
                /^(\d+)%\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec(
                  k
                ))
            ) {
              a.r = Math.min(100, parseInt(d[1], 10)) / 100;
              a.Y = Math.min(100, parseInt(d[2], 10)) / 100;
              a.b = Math.min(100, parseInt(d[3], 10)) / 100;
              e(d[5]);
              return;
            }
            break;
          case "hsl":
          case "hsla":
            if (
              (d =
                /^([0-9]*\.?[0-9]+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec(
                  k
                ))
            ) {
              k = parseFloat(d[1]) / 360;
              var p = parseInt(d[2], 10) / 100,
                x = parseInt(d[3], 10) / 100;
              e(d[5]);
              a.rn(k, p, x);
              return;
            }
        }
      } else if ((d = /^#([A-Fa-f0-9]+)$/.exec(c))) {
        d = d[1];
        k = d.length;
        if (3 === k) {
          a.r = parseInt(d.charAt(0) + d.charAt(0), 16) / 255;
          a.Y = parseInt(d.charAt(1) + d.charAt(1), 16) / 255;
          a.b = parseInt(d.charAt(2) + d.charAt(2), 16) / 255;
          return;
        }
        if (6 === k) {
          a.r = parseInt(d.charAt(0) + d.charAt(1), 16) / 255;
          a.Y = parseInt(d.charAt(2) + d.charAt(3), 16) / 255;
          a.b = parseInt(d.charAt(4) + d.charAt(5), 16) / 255;
          return;
        }
      }
      c &&
        0 < c.length &&
        ((d = Qc[c]),
        void 0 !== d
          ? Bc(a, d)
          : console.warn("JETHREE.Color: Unknown color " + c));
    }
    function gc(a, c, e, d) {
      this.B = a || 0;
      this.C = c || 0;
      this.D = e || 0;
      this.N = void 0 !== d ? d : 1;
    }
    function Cc(a, c, e) {
      var d = c.B,
        k = c.C,
        p = c.D;
      c = c.N;
      var x = e.B,
        q = e.C,
        t = e.D;
      e = e.N;
      a.B = d * e + c * x + k * t - p * q;
      a.C = k * e + c * q + p * x - d * t;
      a.D = p * e + c * t + d * q - k * x;
      a.N = c * e - d * x - k * q - p * t;
      return a;
    }
    function Ob(a, c) {
      this.x = a || 0;
      this.y = c || 0;
    }
    function Ra(a, c, e) {
      this.x = a || 0;
      this.y = c || 0;
      this.z = e || 0;
    }
    function Dc(a, c) {
      var e = a.x,
        d = a.y,
        k = a.z;
      a.x = d * c.z - k * c.y;
      a.y = k * c.x - e * c.z;
      a.z = e * c.y - d * c.x;
    }
    function Pb(a, c, e, d) {
      this.B = a || 0;
      this.C = c || 0;
      this.D = e || 0;
      this.Ta = d || Pb.Dj;
    }
    function pc(a, c) {
      this.min = void 0 !== a ? a : new Ra(Infinity, Infinity, Infinity);
      this.max = void 0 !== c ? c : new Ra(-Infinity, -Infinity, -Infinity);
    }
    function hc(a) {
      return new Ra().Pc(a.min, a.max).Ea(0.5);
    }
    function Rc(a, c) {
      a.min.min(c);
      a.max.max(c);
    }
    function Qb() {
      this.elements = new Float32Array([
        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
      ]);
      0 < arguments.length &&
        console.error(
          "JETHREE.Matrix4: the constructor no longer reads arguments. use .set() instead."
        );
    }
    function Ec(a, c, e) {
      var d = c.elements,
        k = e.elements;
      e = a.elements;
      c = d[0];
      var p = d[4],
        x = d[8],
        q = d[12],
        t = d[1],
        v = d[5],
        E = d[9],
        K = d[13],
        l = d[2],
        w = d[6],
        r = d[10],
        f = d[14],
        h = d[3],
        J = d[7],
        B = d[11];
      d = d[15];
      var n = k[0],
        m = k[4],
        F = k[8],
        O = k[12],
        y = k[1],
        g = k[5],
        G = k[9],
        u = k[13],
        L = k[2],
        H = k[6],
        P = k[10],
        U = k[14],
        Z = k[3],
        T = k[7],
        A = k[11];
      k = k[15];
      e[0] = c * n + p * y + x * L + q * Z;
      e[4] = c * m + p * g + x * H + q * T;
      e[8] = c * F + p * G + x * P + q * A;
      e[12] = c * O + p * u + x * U + q * k;
      e[1] = t * n + v * y + E * L + K * Z;
      e[5] = t * m + v * g + E * H + K * T;
      e[9] = t * F + v * G + E * P + K * A;
      e[13] = t * O + v * u + E * U + K * k;
      e[2] = l * n + w * y + r * L + f * Z;
      e[6] = l * m + w * g + r * H + f * T;
      e[10] = l * F + w * G + r * P + f * A;
      e[14] = l * O + w * u + r * U + f * k;
      e[3] = h * n + J * y + B * L + d * Z;
      e[7] = h * m + J * g + B * H + d * T;
      e[11] = h * F + J * G + B * P + d * A;
      e[15] = h * O + J * u + B * U + d * k;
      return a;
    }
    function qc(a, c, e, d, k, p) {
      this.a = a;
      this.b = c;
      this.c = e;
      this.Pa = d instanceof Ra ? d : new Ra();
      this.ae = Array.isArray(d) ? d : [];
      this.color = k instanceof Nb ? k : new Nb();
      this.Ag = Array.isArray(k) ? k : [];
      this.Vb = void 0 !== p ? p : 0;
    }
    function Sc(a, c, e) {
      var d = new XMLHttpRequest();
      d.open("GET", a, !0);
      var k = (d.withCredentials = !1);
      d.onreadystatechange = function () {
        404 !== d.status || k || ((k = !0), e && e(404));
        if (4 === d.readyState && 200 === d.status) {
          var p = null;
          try {
            p = JSON.parse(d.responseText);
          } catch (x) {
            e && e(-1);
          }
          c && p && c(p);
        }
      };
      d.onerror = function () {
        e && e(0);
      };
      d.send();
    }
    function rc(a, c, e) {
      "object" === typeof a ? c(a) : Sc(a, c, e);
    }
    function Tc(a, c) {
      for (var e = new Ra(), d = new Ra(), k = 0, p = c.length; k < p; k++) {
        var x = c[k],
          q = a[x.a],
          t = a[x.b];
        e.cb(a[x.c], t);
        d.cb(q, t);
        Dc(e, d);
        0 !== e.uf() && (e.normalize(), x.Pa.J(e));
      }
    }
    function Uc(a, c) {
      for (var e = Array(a.length), d = 0, k = a.length; d < k; ++d)
        e[d] = new Ra();
      d = new Ra();
      k = new Ra();
      for (var p = 0, x = c.length; p < x; ++p) {
        var q = c[p],
          t = a[q.a],
          v = a[q.b];
        d.cb(a[q.c], v);
        k.cb(t, v);
        Dc(d, k);
        e[q.a].add(d);
        e[q.b].add(d);
        e[q.c].add(d);
      }
      d = 0;
      for (a = a.length; d < a; ++d) e[d].normalize();
      a = 0;
      for (d = c.length; a < d; ++a)
        (k = c[a]),
          (p = k.ae),
          3 === p.length
            ? (p[0].J(e[k.a]), p[1].J(e[k.b]), p[2].J(e[k.c]))
            : ((p[0] = e[k.a].clone()),
              (p[1] = e[k.b].clone()),
              (p[2] = e[k.c].clone()));
      return e;
    }
    function Vc(a, c, e, d) {
      function k(O) {
        m.J(c[O]);
        F.J(m);
        var y = q[O];
        B.J(y);
        B.sub(m.Ea(m.Yc(y))).normalize();
        var g = F.x,
          G = F.y,
          u = F.z,
          L = y.x,
          H = y.y;
        y = y.z;
        n.x = G * y - u * H;
        n.y = u * L - g * y;
        n.z = g * H - G * L;
        g = 0 > n.Yc(t[O]) ? -1 : 1;
        x[4 * O] = B.x;
        x[4 * O + 1] = B.y;
        x[4 * O + 2] = B.z;
        x[4 * O + 3] = g;
      }
      for (
        var p = a.length,
          x = new Float32Array(4 * p),
          q = Array(p),
          t = Array(p),
          v = 0;
        v < p;
        v++
      )
        (q[v] = new Ra()), (t[v] = new Ra());
      var E = new Ra(),
        K = new Ra(),
        l = new Ra(),
        w = new Ob(),
        r = new Ob(),
        f = new Ob(),
        h = new Ra(),
        J = new Ra();
      d.forEach(function (O) {
        var y = O.a,
          g = O.b;
        O = O.c;
        E.J(a[y]);
        K.J(a[g]);
        l.J(a[O]);
        w.J(e[y]);
        r.J(e[g]);
        f.J(e[O]);
        var G = K.x - E.x,
          u = l.x - E.x,
          L = K.y - E.y,
          H = l.y - E.y,
          P = K.z - E.z,
          U = l.z - E.z,
          Z = r.x - w.x,
          T = f.x - w.x,
          A = r.y - w.y,
          N = f.y - w.y,
          z = 1 / (Z * N - T * A);
        h.set((N * G - A * u) * z, (N * L - A * H) * z, (N * P - A * U) * z);
        J.set((Z * u - T * G) * z, (Z * H - T * L) * z, (Z * U - T * P) * z);
        q[y].add(h);
        q[g].add(h);
        q[O].add(h);
        t[y].add(J);
        t[g].add(J);
        t[O].add(J);
      });
      var B = new Ra(),
        n = new Ra(),
        m = new Ra(),
        F = new Ra();
      d.forEach(function (O) {
        k(O.a);
        k(O.b);
        k(O.c);
      });
      return x;
    }
    function Fc(a, c, e, d) {
      return Math.sqrt((a - e) * (a - e) + (c - d) * (c - d));
    }
    var S = {
        Zg: !0,
        ap: !1,
        bp: !1,
        Ok: !1,
        Yg: !1,
        $o: !1,
        Oa: !1,
        Ym: !1,
        sd: !1,
        Gp: !1,
        aa: "",
        Em: "",
        kk: 700,
        jk: 200,
        $g: !1,
        oo: !1,
        po: !1,
        no: !1,
        Sj: 3,
        Kb: !1,
        Kg: !0,
        Gb: "images/backgrounds/interior2.jpg",
        nc: "images/backgrounds/interior_light.jpg",
        mk: [256, 256, 512, 512],
        mc: 2.1,
        oc: 8,
        lk: [64, 128, 256, 256],
        cm: [60, 96, 160, 250],
        bm: [8, 12, 18, 40],
        Wb: 2.2,
        Ed: 1,
        we: 300,
        Og: 500,
        xe: 50,
        wk: 0,
        xk: 0,
        Ro: 45,
        To: 1,
        So: 1e3,
        Pg: 20,
        Eo: 10,
        Fo: 10,
        Go: 5,
        Sm: 0.1,
        vi: 20,
        yi: 100,
        zi: 100,
        Rm: -Math.PI / 3,
        Qm: Math.PI / 3,
        xi: 0,
        lj: 0,
        il: [40, 32, 16, 16],
        Qj: [0, 0.87, 0.92, 0.9],
        Nm: 2,
        Im: 100,
        ca: !1,
        Tj: 16,
        Uj: 0.4,
        Wj: [0.72, 0.73, 0.72, 0.74],
        fk: 1.2,
        ck: [0.5, 0.5, 0.5, 1],
        hk: 140,
        gk: 280,
        ik: 1.2,
        Xj: 20,
        Yj: 40,
        ek: [6, 9, 9, 12],
        bk: [0.03, 0.02, 0.02, 0.018],
        ak: [0.35, 0.35, 0.4, 0.5],
        Zj: [0.2, 0.2, 0.2, 0.2],
        Vj: [0.1, 0.15, 0.15, 0.15],
        dk: [200, 200, 150, 120],
        $j: [1, 2, 3, 5],
        Tn: 1.1,
        Zp: [0.25, 0.5, 1, 2],
        $p: 256,
        Yp: 256,
        Xp: 200,
        Un: [40, 80, 200, 500],
        Vn: [35, 45, 80, 120],
        Ik: !0,
        Jk: "CCW",
      },
      Gc = {},
      ca = (function () {
        function a(y, g, G) {
          g = y.createShader(g);
          y.shaderSource(g, G);
          y.compileShader(g);
          return y.getShaderParameter(g, y.COMPILE_STATUS) ? g : !1;
        }
        function c(y, g, G) {
          g = a(y, y.VERTEX_SHADER, g);
          G = a(y, y.FRAGMENT_SHADER, G);
          y === b && x.push(g, G);
          var u = y.createProgram();
          y.attachShader(u, g);
          y.attachShader(u, G);
          y.linkProgram(u);
          return u;
        }
        function e(y, g) {
          g.ba = g.ba ? !0 : !1;
          if (!g.ba) {
            void 0 === g.s &&
              (g.s =
                "precision lowp float;attribute vec2 a0;varying vec2 vv0;void main(){gl_Position=vec4(a0,0.,1.),vv0=a0*.5+vec2(.5,.5);}");
            void 0 === g.H && (g.H = ["a0"]);
            void 0 === g.O && (g.O = [2]);
            if (void 0 === g.precision || "highp" === g.precision)
              g.precision = K;
            g.id = v++;
            void 0 !== g.Oi &&
              (g.Oi.forEach(function (u, L) {
                g.h = g.h.replace(u, g.Ha[L]);
              }),
              g.Oi.splice(0));
            g.Bg = 0;
            g.O.forEach(function (u) {
              g.Bg += 4 * u;
            });
            g.pa = c(y, g.s, "precision " + g.precision + " float;\n" + g.h);
            g.A = {};
            g.i.forEach(function (u) {
              g.A[u] = y.getUniformLocation(g.pa, u);
            });
            g.attributes = {};
            g.ya = [];
            g.H.forEach(function (u) {
              var L = y.getAttribLocation(g.pa, u);
              g.attributes[u] = L;
              g.ya.push(L);
            });
            if (g.u) {
              y.useProgram(g.pa);
              t = g;
              q = g.id;
              for (var G in g.u) y.uniform1i(g.A[G], g.u[G]);
            }
            g.Da = !0;
          }
        }
        function d(y) {
          ob.bj(O);
          q !== y.id &&
            (O.I(),
            (q = y.id),
            (t = y),
            b.useProgram(y.pa),
            y.ya.forEach(function (g) {
              0 !== g && b.enableVertexAttribArray(g);
            }));
        }
        function k(y, g, G) {
          e(y, g, G);
          y.useProgram(g.pa);
          y.enableVertexAttribArray(0);
          q = -1;
          return (t = g);
        }
        function p() {
          return {
            h: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
            i: ["u1"],
            u: { u1: 0 },
          };
        }
        var x = [],
          q = -1,
          t = null,
          v = 0,
          E = !1,
          K = "highp",
          l = ["u1"],
          w = ["u0"],
          r = { u1: 0 },
          f = { u0: 0 },
          h = { u1: 0, u2: 1 },
          J = { u3: 0 },
          B = {
            s0: p(),
            s1: {
              h: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
              i: l,
              u: r,
              precision: "lowp",
            },
            s2: {
              h: "uniform sampler2D u1,u2;varying vec2 vv0;void main(){vec4 a=texture2D(u2,vv0),b=texture2D(u1,vv0);gl_FragColor=a*b;}",
              i: ["u1", "u2"],
              u: h,
            },
            s3: {
              h: "uniform sampler2D u1;uniform vec2 u4,u5;varying vec2 vv0;void main(){vec2 a=vv0*u4+u5;gl_FragColor=texture2D(u1,a);}",
              i: ["u1", "u4", "u5"],
              u: r,
              ba: !0,
            },
            s4: {
              h: "uniform sampler2D u1;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=a.r*f;}",
              i: l,
              u: r,
            },
            s5: {
              h: "uniform sampler2D u1,u2;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u2,vv0),b=texture2D(u1,vv0);gl_FragColor=a.a*b.r*f;}",
              i: ["u1", "u2"],
              u: h,
            },
            s6: {
              h: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vec2(1.-vv0.x,vv0.y));}",
              i: l,
              u: r,
            },
            s7: {
              h: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vec2(vv0.x,1.-vv0.y));}",
              i: l,
              u: r,
            },
            s8: {
              h: "uniform sampler2D u0;uniform float u4;varying vec2 vv0;void main(){vec4 a=texture2D(u0,vv0);gl_FragColor=a*u4;}",
              i: ["u0", "u4"],
              u: f,
            },
            s9: {
              h: "uniform sampler2D u0;uniform float u4;varying vec2 vv0;const vec4 f=vec4(.25,.25,.25,.25),g=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0);float b=dot(a*u4,f);gl_FragColor=b*g;}",
              i: ["u0", "u4"],
              u: f,
            },
            s10: {
              h: "uniform sampler2D u1;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.);void main(){float a=.25*dot(e,texture2D(u1,vv0));gl_FragColor=a*e;}",
              i: l,
              u: r,
            },
            s11: {
              h: "uniform sampler2D u1,u6;uniform float u7;const vec4 f=vec4(1.,1.,1.,1.);varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0),b=texture2D(u6,vv0);gl_FragColor=mix(b,a,u7*f);}",
              i: ["u1", "u6", "u7"],
              u: { u1: 0, u6: 1 },
            },
            s12: {
              h: "uniform sampler2D u1;uniform vec2 u8;varying vec2 vv0;void main(){gl_FragColor=.25*(texture2D(u1,vv0+u8)+texture2D(u1,vv0+u8*vec2(1.,-1.))+texture2D(u1,vv0+u8*vec2(-1.,-1.))+texture2D(u1,vv0+u8*vec2(-1.,1.)));}",
              i: ["u1", "u8"],
              u: r,
            },
            s13: {
              h: "uniform sampler2D u1;uniform vec4 u9;varying vec2 vv0;float g(float a,float b){a=floor(a)+.5;return floor(a/exp2(b));}float h(float a,float b){return floor(a*exp2(b)+.5);}float i(float a,float b){return mod(a,h(1.,b));}float e(float c,float a,float b){a=floor(a+.5),b=floor(b+.5);return i(g(c,a),b-a);}vec4 j(float a){if(a==0.)return vec4(0.,0.,0.,0.);float k=128.*step(a,0.);a=abs(a);float c=floor(log2(a)),l=c+127.,b=(a/exp2(c)-1.)*8388608.,d=l/2.,m=fract(d)*2.,n=floor(d),o=e(b,0.,8.),p=e(b,8.,16.),q=m*128.+e(b,16.,23.),r=k+n;return vec4(o,p,q,r)/255.;}void main(){float a=dot(texture2D(u1,vv0),u9);gl_FragColor=j(a);}",
              i: ["u1", "u9"],
              u: r,
            },
            s14: {
              h: "uniform sampler2D u0;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0),b=e/(e+exp(-a));gl_FragColor=b;}",
              i: w,
              u: f,
              ba: !0,
            },
            s15: {
              h: "uniform sampler2D u0;varying vec2 vv0;const vec4 f=vec4(0.,0.,0.,0.);void main(){vec4 a=texture2D(u0,vv0);gl_FragColor=max(f,a);}",
              i: w,
              u: f,
            },
            s16: {
              h: "uniform sampler2D u0;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0);gl_FragColor=mix(exp(-abs(a))-f,a,step(0.,a));}",
              i: w,
              u: f,
            },
            s17: {
              h: "uniform sampler2D u0;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0),b=exp(-abs(a))-f;gl_FragColor=mix(.1*b,a,step(0.,a));}",
              i: w,
              u: f,
            },
            s18: {
              h: "uniform sampler2D u0,u7,u10;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0),c=texture2D(u7,vv0),d=texture2D(u10,vv0),b=a/d;gl_FragColor=c*mix(exp(-abs(b))-f,b,step(0.,a));}",
              i: ["u0", "u7", "u10"],
              u: { u0: 0, u7: 1, u10: 2 },
              ba: !0,
            },
            s19: {
              h: "uniform sampler2D u0;const float e=3.141593;varying vec2 vv0;void main(){gl_FragColor=atan(e*texture2D(u0,vv0))/e;}",
              i: w,
              u: f,
            },
            s20: {
              h: "uniform sampler2D u0;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0),b=log(f+a);gl_FragColor=b;}",
              i: w,
              u: f,
              ba: !0,
            },
            s21: {
              h: "uniform sampler2D u0,u11;uniform float u12;const vec2 e=vec2(.5,.5);const float f=1e-5;const vec4 g=vec4(1.,1.,1.,1.),i=vec4(0.,0.,0.,0.);varying vec2 vv0;void main(){vec4 a=texture2D(u11,e);float b=u12*u12;vec4 c=max(b*a,f*g);gl_FragColor=texture2D(u0,vv0)/c;}",
              i: ["u0", "u11", "u12"],
              u: { u0: 0, u11: 1 },
              ba: !0,
            },
            s22: {
              h: "uniform sampler2D u1;uniform vec2 u13;varying vec2 vv0;void main(){float a=u13.x*u13.y;vec2 b=floor(vv0*a)/a,c=fract(vv0*a),d=floor(b*u13.y),f=floor(u13.x*fract(b*u13.y)),g=(f*u13.y+d)/a;gl_FragColor=texture2D(u1,g+c/a);}",
              i: ["u1", "u13"],
              u: r,
            },
            s23: {
              h: "uniform sampler2D u14,u15,u16;varying vec2 vv0;void main(){vec4 a=texture2D(u16,vv0);vec2 b=a.rg,c=a.ba;vec4 d=texture2D(u14,b),f=texture2D(u15,c);gl_FragColor=d*f;}",
              i: ["u14", "u15", "u16"],
              u: { u15: 0, u14: 1, u16: 2 },
              ba: !0,
            },
            s24: {
              h: "uniform float u17;uniform sampler2D u14,u15;varying vec2 vv0;void main(){vec2 a=fract(vv0*u17);vec4 b=texture2D(u14,vv0),c=texture2D(u15,a);gl_FragColor=b*c;}",
              i: ["u15", "u14", "u17"],
              u: { u15: 0, u14: 1 },
            },
            s25: {
              h: "uniform float u17;uniform sampler2D u14,u15,u18,u19,u20,u21;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.),g=vec4(1e-3,1e-3,1e-3,1e-3);void main(){vec2 h=vv0*u17,l=floor(h),c=h-l;vec4 m=texture2D(u14,vv0),d=texture2D(u15,c),a=texture2D(u21,vv0);a=a*255.;vec4 n=texture2D(u18,c),o=texture2D(u19,c),p=texture2D(u20,c),i=step(-g,-a),b=e-i,j=b*step(-e-g,-a);b*=e-j;vec4 k=b*step(-2.*e-g,-a);b*=e-k;vec4 q=b;d=i*d+j*n+k*o+q*p,gl_FragColor=m*d;}",
              i: "u14 u15 u17 u21 u18 u19 u20".split(" "),
              u: { u15: 0, u14: 1, u21: 3, u18: 4, u19: 5, u20: 6 },
              ba: !0,
            },
            s26: {
              h: "uniform sampler2D u14,u15,u22;uniform float u17,u23,u24,u25;varying vec2 vv0;const vec2 j=vec2(1.,1.);void main(){vec2 a=floor(u23*vv0),b=u23*vv0-a;float c=u17/u23;vec2 d=floor(b*c),f=b*c-d,g=(a+f)/u23;float k=u23*u25/u17;vec2 l=k*d,h=(l+f*u24)/u25,i=step(h,j);vec4 m=texture2D(u14,g),n=texture2D(u15,h),o=m*n*i.x*i.y,p=texture2D(u22,g);gl_FragColor=o*u24*u24+p;}",
              i: "u14 u15 u17 u23 u24 u25 u22".split(" "),
              u: { u15: 0, u14: 1, u22: 2 },
            },
            s27: {
              h: "uniform sampler2D u14,u15;varying vec2 vv0;void main(){vec4 a=texture2D(u14,vv0),b=texture2D(u15,vv0);gl_FragColor=a*b;}",
              i: ["u14", "u15"],
              u: { u15: 0, u14: 1 },
              ba: !0,
            },
            s28: {
              h: "uniform sampler2D u1,u22;uniform float u26;varying vec2 vv0;void main(){gl_FragColor=texture2D(u22,vv0)+u26*texture2D(u1,vv0);}",
              i: ["u1", "u22", "u26"],
              u: { u1: 0, u22: 1 },
            },
            s29: {
              h: "varying vec2 vv0;uniform sampler2D u1;const vec4 f=vec4(1.,1.,1.,1.),g=vec4(.299,.587,.114,0.);void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=dot(a,g)*f;}",
              i: l,
              u: r,
              precision: "lowp",
            },
            s30: {
              h: "varying vec2 vv0;uniform sampler2D u1;uniform float u27;const vec3 f=vec3(.299,.587,.114);void main(){vec3 a=texture2D(u1,vv0).rgb,b=texture2D(u1,vv0+vec2(0.,u27)).rgb,c=texture2D(u1,vv0+vec2(u27,u27)).rgb,d=texture2D(u1,vv0+vec2(u27,0.)).rgb;gl_FragColor=vec4(dot(a,f),dot(b,f),dot(c,f),dot(d,f));}",
              i: ["u1", "u27"],
              u: r,
              precision: "lowp",
            },
            s31: {
              h: "varying vec2 vv0;uniform sampler2D u1;uniform float u27;const vec3 f=vec3(.299,.587,.114);void main(){vec3 a=texture2D(u1,vv0).rgb,b=texture2D(u1,vv0+vec2(0.,u27)).rgb,c=texture2D(u1,vv0+vec2(u27,u27)).rgb,d=texture2D(u1,vv0+vec2(u27,0.)).rgb;gl_FragColor=vec4(a.r,b.g,c.b,dot(d,f));}",
              i: ["u1", "u27"],
              u: r,
              precision: "lowp",
            },
            s32: {
              h: "varying vec2 vv0;uniform sampler2D u1,u2;uniform float u28;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=vec4(0.);a-=texture2D(u1,vec2(vv0.x-u28,vv0.y-u28))*1.,a-=texture2D(u1,vec2(vv0.x-u28,vv0.y))*2.,a-=texture2D(u1,vec2(vv0.x-u28,vv0.y+u28))*1.,a+=texture2D(u1,vec2(vv0.x+u28,vv0.y-u28))*1.,a+=texture2D(u1,vec2(vv0.x+u28,vv0.y))*2.,a+=texture2D(u1,vec2(vv0.x+u28,vv0.y+u28))*1.;vec4 b=vec4(0.);b-=texture2D(u1,vec2(vv0.x-u28,vv0.y-u28))*1.,b-=texture2D(u1,vec2(vv0.x,vv0.y-u28))*2.,b-=texture2D(u1,vec2(vv0.x+u28,vv0.y-u28))*1.,b+=texture2D(u1,vec2(vv0.x-u28,vv0.y+u28))*1.,b+=texture2D(u1,vec2(vv0.x,vv0.y+u28))*2.,b+=texture2D(u1,vec2(vv0.x+u28,vv0.y+u28))*1.;vec3 c=sqrt(a.rgb*a.rgb+b.rgb*b.rgb);vec4 e=vec4(c,texture2D(u1,vv0).a),g=texture2D(u2,vv0);gl_FragColor=g.a*e.r*f;}",
              i: ["u1", "u2", "u28"],
              u: h,
              ba: !0,
            },
            s33: {
              h: "varying vec2 vv0;uniform sampler2D u1,u2;uniform float u28;const vec4 j=vec4(1.,1.,1.,1.);const vec2 k=vec2(1.,1.);void main(){float h=0.;vec2 l=k*u28,a,b;float c,d,i=0.;for(float e=-4.;e<=4.;e+=1.)for(float f=-4.;f<=4.;f+=1.)a=vec2(e,f),c=length(a)/2.,d=exp(-c*c),b=vv0+l*a,h+=d*texture2D(u1,b).r,i+=d;vec4 m=texture2D(u2,vv0);gl_FragColor=m.a*(texture2D(u1,b).r-h/i)*j;}",
              i: ["u1", "u2", "u28"],
              u: h,
              ba: !0,
            },
            s34: {
              h: "uniform sampler2D u3;uniform vec2 u8;varying vec2 vv0;vec4 e(vec4 a,vec4 b){vec4 c=step(a,b);return mix(a,b,c);}const vec2 g=vec2(.5,.5),h=vec2(1.,0.),i=vec2(0.,1.);void main(){vec2 a=vv0-u8*g;vec4 b=texture2D(u3,a),c=texture2D(u3,a+u8*h),d=texture2D(u3,a+u8*i),j=texture2D(u3,a+u8),k=e(b,c),l=e(d,j);gl_FragColor=e(k,l);}",
              i: ["u3", "u8"],
              u: J,
            },
            s35: {
              h: "uniform sampler2D u3;uniform vec2 u8;varying vec2 vv0;const vec2 k=vec2(1.,0.),l=vec2(0.,1.),m=vec2(2.,0.),n=vec2(0.,2.);vec4 e(vec4 a,vec4 b){vec4 c=step(a,b);return mix(a,b,c);}vec4 f(vec2 a){vec4 b=texture2D(u3,a),c=texture2D(u3,a+u8*k),d=texture2D(u3,a+u8*l),g=texture2D(u3,a+u8),h=e(b,c),i=e(d,g);return e(h,i);}void main(){vec2 a=vv0+u8*vec2(-.55,-1.05);vec4 b=f(a),c=f(a+u8*m),d=f(a+u8*2.),g=f(a+u8*n),h=e(b,c),i=e(d,g);gl_FragColor=e(h,i);}",
              i: ["u3", "u8"],
              u: J,
              ba: !0,
            },
            s36: {
              h: "uniform sampler2D u1;varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=a*a;}",
              i: ["u1"],
              u: r,
              precision: "lowp",
              ba: !0,
            },
            s37: {
              h: "uniform sampler2D u1;uniform vec2 u8;varying vec2 vv0;const float e=15444.;void main(){vec4 a=1001./e*texture2D(u1,vv0-3.*u8)+2002./e*texture2D(u1,vv0-2.*u8)+3003./e*texture2D(u1,vv0-u8)+3432./e*texture2D(u1,vv0)+3003./e*texture2D(u1,vv0+u8)+2002./e*texture2D(u1,vv0+2.*u8)+1001./e*texture2D(u1,vv0+3.*u8);gl_FragColor=a;}",
              i: ["u8", "u1"],
              u: r,
              precision: "lowp",
              ba: !0,
            },
            s38: {
              h: "uniform sampler2D u1,u11,u29;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);const float g=.1;void main(){vec4 a=texture2D(u11,vv0),b=texture2D(u29,vv0),c=texture2D(u1,vv0),d=max(f*g,b-a*a),h=sqrt(d);gl_FragColor=(c-a)/h;}",
              i: ["u1", "u11", "u29"],
              u: { u1: 0, u11: 1, u29: 2 },
              ba: !0,
            },
          },
          n = {
            s39: {
              h: "uniform float u17,u30;uniform sampler2D u14,u15,u22;varying vec2 vv0;const vec2 ZERO2=vec2(0.,0.),ONE2=vec2(1.,1.),HALF2=vec2(.5,.5),EPS2=vec2(1e-5,1e-5);void main(){vec4 sum=texture2D(u22,vv0);float toSparsity=1.1111;vec2 uvFrom,uvWeight,xyPatch=ZERO2,eps2=EPS2/u17,xyTo=floor(vv0*u17+eps2);float weightSize=toSparsity*u17;vec2 halfFromSparsity=ONE2*(toSparsity-1.)/2.;for(float patch_x=0.;patch_x<1.1111;patch_x+=1.){xyPatch.x=patch_x;for(float patch_y=0.;patch_y<1.1111;patch_y+=1.)xyPatch.y=patch_y,uvFrom=(xyTo+HALF2+u30*(xyPatch-halfFromSparsity))/u17,uvFrom+=step(uvFrom,-eps2),uvFrom-=step(ONE2-eps2,uvFrom),uvWeight=(xyTo*toSparsity+xyPatch+HALF2)/weightSize,sum+=texture2D(u14,uvWeight)*texture2D(u15,uvFrom);}gl_FragColor=sum,gl_FragColor*=2.2222;}",
              i: ["u17", "u14", "u15", "u22", "u30"],
              Ha: ["1.1111", "gl_FragColor\\*=2.2222;"],
            },
            s40: {
              h: "uniform float u17,u30,u25;uniform sampler2D u14,u15,u22;varying vec2 vv0;const vec2 ZERO2=vec2(0.,0.),ONE2=vec2(1.,1.),HALF2=vec2(.5,.5),EPS2=vec2(1e-4,1e-4);void main(){vec4 sum=texture2D(u22,vv0);float fromSparsity=1.1111,shrinkFactor=3.3333;vec2 uvFrom,uvWeight,xyFrom,xyPatchTo,xyPatch=ZERO2,xyShrink=ZERO2,eps2=EPS2/u25,xyTo=floor(vv0*u17+eps2);float weightSize=fromSparsity*u25;vec2 halfFromSparsity=ONE2*(fromSparsity-1.)/2.;float toSparsity=weightSize/u17;vec2 xyFrom0=xyTo*shrinkFactor;for(float patch_x=0.;patch_x<1.1111;patch_x+=1.){xyPatch.x=patch_x;for(float patch_y=0.;patch_y<1.1111;patch_y+=1.){xyPatch.y=patch_y;for(float shrink_x=0.;shrink_x<3.3333;shrink_x+=1.){xyShrink.x=shrink_x;for(float shrink_y=0.;shrink_y<3.3333;shrink_y+=1.)xyShrink.y=shrink_y,xyFrom=xyFrom0+xyShrink+shrinkFactor*u30*(xyPatch-halfFromSparsity),uvFrom=(xyFrom+HALF2)/u25,uvFrom+=step(uvFrom,-eps2),uvFrom-=step(ONE2-eps2,uvFrom),xyPatchTo=xyPatch*shrinkFactor+xyShrink,uvWeight=(xyTo*toSparsity+xyPatchTo+HALF2)/weightSize,sum+=texture2D(u14,uvWeight)*texture2D(u15,uvFrom);}}}gl_FragColor=sum,gl_FragColor*=2.2222;}",
              i: "u17 u25 u14 u15 u22 u30".split(" "),
              Ha: ["1.1111", "gl_FragColor\\*=2.2222;", "3.3333"],
            },
          },
          m = null,
          F = null,
          O = {
            Tb: function () {
              return E;
            },
            m: function () {
              if (!E) {
                m = ya(B, 2);
                F = ya(n, 2);
                K = "highp";
                for (var y in m) e(b, m[y], y);
                ca.set("s0");
                b.enableVertexAttribArray(0);
                E = !0;
              }
            },
            le: function (y) {
              y.forEach(function (g) {
                O.qa(g);
              });
            },
            qa: function (y) {
              m[y.id] = y;
              e(b, y, y.id);
            },
            Jh: function (y, g, G) {
              g || (g = y);
              m[g] = Object.create(F[y]);
              m[g].hm = !0;
              F[y].Ha &&
                F[y].Ha.forEach(function (u, L) {
                  m[g].h = m[g].h.replace(new RegExp(u, "g"), G[L]);
                });
              e(b, m[g], g);
            },
            set: function (y) {
              var g = m[y];
              g.ba && ((g.ba = !1), e(b, g, y));
              d(g);
            },
            wb: function (y) {
              return k(y, p(), "s41");
            },
            Jd: function (y) {
              return k(
                y,
                {
                  h: "void main(){gl_FragColor=vec4(.5,.5,.5,.5);}",
                  i: [],
                  precision: "highp",
                },
                "s42"
              );
            },
            ll: function (y) {
              return "undefined" === typeof m[y] ? !1 : m[y].Da;
            },
            I: function () {
              -1 !== q &&
                ((q = -1),
                t.ya.forEach(function (y) {
                  0 !== y && b.disableVertexAttribArray(y);
                }));
            },
            Ld: function () {
              var y = 0;
              t.ya.forEach(function (g, G) {
                G = t.O[G];
                b.vertexAttribPointer(g, G, b.FLOAT, !1, t.Bg, y);
                y += 4 * G;
              });
            },
            fp: function () {
              b.enableVertexAttribArray(0);
            },
            Fc: function () {
              O.$b(b);
            },
            $b: function (y) {
              y.vertexAttribPointer(t.ya[0], 2, y.FLOAT, !1, 8, 0);
            },
            Kd: function (y, g) {
              b.uniform1i(t.A[y], g);
            },
            G: function (y, g) {
              b.uniform1f(t.A[y], g);
            },
            M: function (y, g, G) {
              b.uniform2f(t.A[y], g, G);
            },
            cj: function (y, g) {
              b.uniform2fv(t.A[y], g);
            },
            eg: function (y, g) {
              b.uniform3fv(t.A[y], g);
            },
            dg: function (y, g, G, u) {
              b.uniform3f(t.A[y], g, G, u);
            },
            Wp: function (y, g, G, u, L) {
              b.uniform4f(t.A[y], g, G, u, L);
            },
            va: function (y, g) {
              b.uniform4fv(t.A[y], g);
            },
            On: function (y, g) {
              b.uniformMatrix2fv(t.A[y], !1, g);
            },
            Pn: function (y, g) {
              b.uniformMatrix3fv(t.A[y], !1, g);
            },
            Ec: function (y, g) {
              b.uniformMatrix4fv(t.A[y], !1, g);
            },
            j: function (y, g) {
              O.set(y);
              g.forEach(function (G) {
                switch (G.type) {
                  case "4f":
                    b.uniform4fv(t.A[G.name], G.value);
                    break;
                  case "3f":
                    b.uniform3fv(t.A[G.name], G.value);
                    break;
                  case "2f":
                    b.uniform2fv(t.A[G.name], G.value);
                    break;
                  case "1f":
                    b.uniform1f(t.A[G.name], G.value);
                    break;
                  case "1i":
                    b.uniform1i(t.A[G.name], G.value);
                    break;
                  case "mat2":
                    b.uniformMatrix2fv(t.A[G.name], !1, G.value);
                    break;
                  case "mat3":
                    b.uniformMatrix3fv(t.A[G.name], !1, G.value);
                    break;
                  case "mat4":
                    b.uniformMatrix4fv(t.A[G.name], !1, G.value);
                }
              });
            },
            qp: function () {
              return "lowp";
            },
            v: function () {
              b.disableVertexAttribArray(0);
              O.I();
              for (var y in m) {
                var g = m[y];
                g.Da && ((g.Da = !1), b.deleteProgram(g.pa));
                g.hm && delete m[y];
              }
              x.forEach(function (G) {
                b.deleteShader(G);
              });
              x.splice(0);
              v = 0;
              E = !1;
              t = null;
              q = -1;
            },
          };
        return O;
      })(),
      b = null,
      fb = (function () {
        function a(l) {
          console.log("ERROR in ContextFF: ", l);
          return !1;
        }
        function c(l) {
          function w() {
            yb.v();
            Aa.reset();
            f.getExtension("WEBGL_lose_context").loseContext();
          }
          if (
            navigator.userAgent &&
            -1 !== navigator.userAgent.indexOf("forceWebGL1")
          )
            return !1;
          var r = document.createElement("canvas");
          r.setAttribute("width", 5);
          r.setAttribute("height", 5);
          var f = null;
          try {
            f = r.getContext("webgl2", l);
          } catch (h) {
            return !1;
          }
          if (!f) return !1;
          e(f);
          Aa.ih(f);
          l = Aa.Je(f);
          if (!l.Va && !l.Wa) return w(), !1;
          l = yb.Qg(f, l);
          w();
          return l ? !0 : !1;
        }
        function e(l) {
          l.clearColor(0, 0, 0, 0);
          l.disable(l.DEPTH_TEST);
          l.disable(l.BLEND);
          l.disable(l.DITHER);
          l.disable(l.STENCIL_TEST);
          l.disable(l.CULL_FACE);
          l.GENERATE_MIPMAP_HINT && l.hint(l.GENERATE_MIPMAP_HINT, l.FASTEST);
          l.disable(l.SAMPLE_ALPHA_TO_COVERAGE);
          l.disable(l.SAMPLE_COVERAGE);
          l.depthFunc(l.LEQUAL);
          l.clearDepth(1);
        }
        var d = null,
          k = null,
          p = null,
          x = null,
          q = !0,
          t = null,
          v = null,
          E = [],
          K = {
            L: function () {
              return d.width;
            },
            T: function () {
              return d.height;
            },
            pb: function () {
              return d;
            },
            ol: function () {
              return b;
            },
            ia: function () {
              return q;
            },
            flush: function () {
              b.flush();
            },
            ul: function () {
              t || (t = new Uint8Array(d.width * d.height * 4));
              b.readPixels(0, 0, d.width, d.height, b.RGBA, b.UNSIGNED_BYTE, t);
              return t;
            },
            mp: function () {
              return d.toDataURL("image/jpeg");
            },
            np: function () {
              za.$();
              k ||
                ((k = document.createElement("canvas")),
                (p = k.getContext("2d")));
              k.width = d.width;
              k.height = d.height;
              for (
                var l = K.ul(),
                  w = p.createImageData(k.width, k.height),
                  r = k.width,
                  f = k.height,
                  h = w.data,
                  J = 0;
                J < f;
                ++J
              )
                for (var B = f - J - 1, n = 0; n < r; ++n) {
                  var m = 4 * (J * r + n),
                    F = 4 * (B * r + n);
                  h[m] = l[F];
                  h[m + 1] = l[F + 1];
                  h[m + 2] = l[F + 2];
                  h[m + 3] = l[F + 3];
                }
              p.putImageData(w, 0, 0);
              return k.toDataURL("image/png");
            },
            vh: function (l) {
              !k &&
                l &&
                ((k = document.createElement("canvas")),
                (p = k.getContext("2d")));
              var w = l ? k : document.createElement("canvas");
              w.width = d.width;
              w.height = d.height;
              (l ? p : w.getContext("2d")).drawImage(d, 0, 0);
              return w;
            },
            m: function (l) {
              l.Xg && !l.ta
                ? (d = document.getElementById(l.Xg))
                : l.ta && (d = l.ta);
              d || (d = document.createElement("canvas"));
              d.width = l && void 0 !== l.width ? l.width : 512;
              d.height = l && void 0 !== l.height ? l.height : 512;
              "undefined" === typeof l && (l = {});
              void 0 === l.premultipliedAlpha && (l.premultipliedAlpha = !1);
              void 0 === l.Qh && (l.Qh = !0);
              void 0 === l.antialias && (l.antialias = !1);
              if (b) q = b instanceof WebGL2RenderingContext;
              else {
                q = !0;
                var w = {
                  antialias: l.antialias,
                  alpha: !0,
                  preserveDrawingBuffer: !0,
                  premultipliedAlpha: l.premultipliedAlpha,
                  stencil: !1,
                  depth: l.Qh,
                };
                navigator &&
                  navigator.userAgent &&
                  -1 !== navigator.userAgent.indexOf("noAntialiasing") &&
                  (w.antialias = !1);
                var r = c(w);
                !r && w.antialias && ((w.antialias = !1), (r = c(w)));
                r && (b = d.getContext("webgl2", w));
                b
                  ? (q = !0)
                  : ((b = d.getContext("webgl", w)) ||
                      (b = d.getContext("experimental-webgl", w)),
                    (q = !1));
              }
              if (!b) return a("WebGL1 and 2 are not enabled");
              (x = b.getExtension("WEBGL_lose_context")) &&
                l.ti &&
                ((v = l.ti), d.addEventListener("webglcontextlost", v, !1));
              if (!Aa.m()) return a("Not enough GL capabilities");
              e(b);
              ca.m();
              Y.m();
              if (!yb.Qg(b, Aa.rl())) return a("Cannot filter float textures");
              E.forEach(function (f) {
                f(b);
              });
              E.splice(0);
              return !0;
            },
            Qo: function () {
              return new Promise(function (l) {
                b ? l(b) : E.push(l);
              });
            },
            v: function () {
              b && (Aa.v(), ca.v(), yb.v());
              x &&
                v &&
                (d.removeEventListener("webglcontextlost", v, !1),
                (x = v = null));
              b = t = p = k = d = null;
              E.splice(0);
            },
          };
        return K;
      })(),
      ob = (function () {
        function a() {
          null === c &&
            ("undefined" !== typeof ca
              ? (c = ca)
              : "undefined" !== typeof D && (c = D));
        }
        var c = null;
        a();
        return {
          reset: function () {
            c = null;
          },
          bj: function (e) {
            c !== e && (c && c.I(), (c = e));
          },
          Tb: function () {
            return c.Tb();
          },
          Fc: function () {
            return c.Fc();
          },
          $b: function (e) {
            return c.$b(e);
          },
          Ld: function () {
            return c.Ld();
          },
          I: function () {
            return c.I();
          },
          set: function (e) {
            return c.set(e);
          },
          wb: function (e) {
            a();
            return c.wb(e);
          },
          Jd: function (e) {
            a();
            return c.Jd(e);
          },
        };
      })(),
      X = (function () {
        function a(u) {
          b.bindTexture(b.TEXTURE_2D, u);
        }
        function c(u) {
          var L = new Uint16Array(u.length);
          u.forEach(function (H, P) {
            O[0] = H;
            var U = y[0];
            var Z = (U >> 16) & 32768;
            H = (U >> 12) & 2047;
            var T = (U >> 23) & 255;
            U =
              103 > T
                ? Z
                : 142 < T
                ? Z | 31744 | ((255 == T ? 0 : 1) && U & 8388607)
                : 113 > T
                ? ((H |= 2048), Z | ((H >> (114 - T)) + ((H >> (113 - T)) & 1)))
                : (Z | ((T - 112) << 10) | (H >> 1)) + (H & 1);
            L[P] = U;
          });
          return L;
        }
        function e() {
          if (null !== g.jf) return g.jf;
          var u = d(c([0.5, 0.5, 0.5, 0.5]));
          return null === u ? !0 : (g.jf = u);
        }
        function d(u) {
          if (!ob.Tb() || !w) return null;
          var L = null,
            H = Math.sqrt(u.length / 4);
          try {
            var P = b.getError();
            if ("FUCKING_BIG_ERROR" === P) return !1;
            L = G.instance({ isFloat: !1, R: !0, array: u, width: H });
            P = b.getError();
            if (P !== b.NO_ERROR) return !1;
          } catch (Z) {
            return !1;
          }
          za.$();
          b.viewport(0, 0, H, H);
          b.clearColor(0, 0, 0, 0);
          b.clear(b.COLOR_BUFFER_BIT);
          ob.set("s0");
          L.Hb(0);
          Y.l(!0, !0);
          u = 4 * H * H;
          P = new Uint8Array(u);
          b.readPixels(0, 0, H, H, b.RGBA, b.UNSIGNED_BYTE, P);
          H = !0;
          for (var U = 0; U < u; ++U) H = H && 3 > Math.abs(P[U] - 127);
          L.remove();
          za.ma();
          return H;
        }
        var k = 0,
          p = null,
          x = 0,
          q = null,
          t = null,
          v = null,
          E = null,
          K = null,
          l = null,
          w = !1,
          r = [],
          f = {
            isFloat: !1,
            isPot: !0,
            isLinear: !1,
            isMipmap: !1,
            isAnisotropicFiltering: !1,
            isMirrorX: !1,
            isMirrorY: !1,
            isSrgb: !1,
            isKeepArray: !1,
            isFlipY: null,
            width: 0,
            height: 0,
            url: null,
            array: null,
            data: null,
            ha: null,
            Ch: null,
            fm: !1,
            R: !1,
            P: null,
            F: 4,
            Gf: 0,
          },
          h = !1,
          J = null,
          B = null,
          n = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
          ],
          m = !1,
          F = !1,
          O = new Float32Array(1),
          y = new Int32Array(O.buffer),
          g = { jf: null, kf: null },
          G = {
            m: function () {
              w ||
                ((K = [b.RGBA, null, b.RGBA, b.RGBA]),
                (l = [b.RGBA, null, b.RGBA, b.RGBA]),
                (p = [
                  b.TEXTURE0,
                  b.TEXTURE1,
                  b.TEXTURE2,
                  b.TEXTURE3,
                  b.TEXTURE4,
                  b.TEXTURE5,
                  b.TEXTURE6,
                  b.TEXTURE7,
                ]),
                (m = "undefined" !== typeof ba),
                (F = "undefined" !== typeof Aa),
                (q = [-1, -1, -1, -1, -1, -1, -1, -1]),
                (E = [b.UNSIGNED_BYTE, b.FLOAT, b.FLOAT]),
                (w = !0));
            },
            Yl: function () {
              if (!t) {
                for (var u = new Float32Array(16384), L = 0; 16384 > L; ++L)
                  u[L] = 2 * Math.random() - 1;
                t = {
                  random: G.instance({
                    isFloat: !0,
                    isPot: !0,
                    array: u,
                    width: 64,
                  }),
                  pj: G.instance({
                    isFloat: !1,
                    isPot: !0,
                    width: 1,
                    array: new Uint8Array([0, 0, 0, 0]),
                  }),
                };
              }
              G.jo();
            },
            Bh: function () {
              return t.pj;
            },
            jo: function () {
              E[1] = Aa.Ve(b);
            },
            Jn: function () {
              l = K = [b.RGBA, b.RGBA, b.RGBA, b.RGBA];
            },
            Hi: function (u) {
              ca.set("s1");
              za.$();
              var L = u.L(),
                H = u.T();
              b.viewport(0, 0, L, H);
              u.g(0);
              Y.l(!1, !1);
            },
            Ip: function (u, L) {
              G.Hi(u);
              b.readPixels(0, 0, u.L(), u.T(), b.RGBA, b.UNSIGNED_BYTE, L);
            },
            Jp: function (u, L) {
              G.Hi(u);
              return Aa.Sf(0, 0, u.L(), u.T(), L);
            },
            ph: function (u, L, H, P, U, Z, T) {
              u.activeTexture(u.TEXTURE0);
              var A = u.createTexture();
              u.bindTexture(u.TEXTURE_2D, A);
              U = U instanceof Float32Array ? U : new Float32Array(U);
              u.texParameteri(u.TEXTURE_2D, u.TEXTURE_WRAP_S, u.CLAMP_TO_EDGE);
              u.texParameteri(u.TEXTURE_2D, u.TEXTURE_WRAP_T, u.CLAMP_TO_EDGE);
              u.texParameteri(u.TEXTURE_2D, u.TEXTURE_MAG_FILTER, u.NEAREST);
              u.texParameteri(u.TEXTURE_2D, u.TEXTURE_MIN_FILTER, u.NEAREST);
              u.pixelStorei(u.UNPACK_FLIP_Y_WEBGL, Z);
              u.texImage2D(
                u.TEXTURE_2D,
                0,
                u.RGBA,
                H,
                P,
                0,
                u.RGBA,
                u.FLOAT,
                U
              );
              u.bindTexture(u.TEXTURE_2D, null);
              u.pixelStorei(u.UNPACK_FLIP_Y_WEBGL, !1);
              T && (za.ma(), ca.wb(u));
              u.viewport(0, 0, H, P);
              u.framebufferTexture2D(
                u.FRAMEBUFFER,
                u.COLOR_ATTACHMENT0,
                u.TEXTURE_2D,
                L,
                0
              );
              u.bindTexture(u.TEXTURE_2D, A);
              T ? Y.l(!0, !0) : Y.Lb(u);
              u.deleteTexture(A);
              w && ((q[0] = -1), (v = null), (k = 0));
            },
            ke: function (u) {
              u !== k && (b.activeTexture(p[u]), (k = u));
            },
            instance: function (u) {
              function L() {
                na = void 0 !== A.ha.videoWidth ? A.ha.videoWidth : A.ha.width;
                ka =
                  void 0 !== A.ha.videoHeight ? A.ha.videoHeight : A.ha.height;
              }
              function H(da) {
                var wa = b.getError();
                if ("FUCKING_BIG_ERROR" === wa) return !1;
                b.texImage2D(b.TEXTURE_2D, 0, Ha, Va, oa, da);
                wa = b.getError();
                wa !== b.NO_ERROR &&
                  Va !== b.RGBA &&
                  ((Va = b.RGBA),
                  b.texImage2D(b.TEXTURE_2D, 0, Ha, Va, oa, da));
                return !0;
              }
              function P() {
                if (!W) {
                  a(sa);
                  M && b.pixelStorei(b.UNPACK_FLIP_Y_WEBGL, M);
                  A.isPot
                    ? (b.texParameteri(
                        b.TEXTURE_2D,
                        b.TEXTURE_WRAP_S,
                        A.isMirrorX ? b.MIRRORED_REPEAT : b.REPEAT
                      ),
                      b.texParameteri(
                        b.TEXTURE_2D,
                        b.TEXTURE_WRAP_T,
                        A.isMirrorY ? b.MIRRORED_REPEAT : b.REPEAT
                      ))
                    : (b.texParameteri(
                        b.TEXTURE_2D,
                        b.TEXTURE_WRAP_S,
                        b.CLAMP_TO_EDGE
                      ),
                      b.texParameteri(
                        b.TEXTURE_2D,
                        b.TEXTURE_WRAP_T,
                        b.CLAMP_TO_EDGE
                      ));
                  A.isAnisotropicFiltering &&
                    "undefined" !== typeof S &&
                    b.texParameterf(
                      b.TEXTURE_2D,
                      ba.wl().TEXTURE_MAX_ANISOTROPY_EXT,
                      S.Sj
                    );
                  b.texParameteri(
                    b.TEXTURE_2D,
                    b.TEXTURE_MAG_FILTER,
                    A.isLinear ? b.LINEAR : b.NEAREST
                  );
                  A.isLinear
                    ? b.texParameteri(
                        b.TEXTURE_2D,
                        b.TEXTURE_MIN_FILTER,
                        A.isMipmap && !ja ? b.NEAREST_MIPMAP_LINEAR : b.LINEAR
                      )
                    : b.texParameteri(
                        b.TEXTURE_2D,
                        b.TEXTURE_MIN_FILTER,
                        A.isMipmap && !ja ? b.NEAREST_MIPMAP_NEAREST : b.NEAREST
                      );
                  Va = K[A.F - 1];
                  Ha = l[A.F - 1];
                  oa = E[z];
                  if (Aa.ia()) {
                    var da = Aa.yl();
                    Va === b.RGBA && oa === b.FLOAT
                      ? A.isMipmap || A.isLinear
                        ? (Ha = yb.Al(b))
                        : Aa.da()
                        ? da && (Ha = da)
                        : (Ha = b.RGBA16F || b.RGBA)
                      : Va === b.RGB &&
                        oa === b.FLOAT &&
                        da &&
                        ((Ha = da), (Va = b.RGBA));
                  }
                  if (
                    (A.R && !A.isFloat) ||
                    (A.isFloat && A.isMipmap && yb.om())
                  )
                    (Ha = Aa.zl()), (oa = Aa.Ve(b));
                  A.Gf && (Qa = A.Gf);
                  A.isSrgb && 4 === A.F && (Va = ba.Pl());
                  if (A.ha) H(A.ha);
                  else if (A.url) H(Wa);
                  else if (Ja) {
                    da = Ja;
                    try {
                      "FUCKING_BIG_ERROR" !== b.getError() &&
                        (b.texImage2D(
                          b.TEXTURE_2D,
                          0,
                          Ha,
                          na,
                          ka,
                          0,
                          Va,
                          oa,
                          da
                        ),
                        b.getError() !== b.NO_ERROR &&
                          (b.texImage2D(
                            b.TEXTURE_2D,
                            0,
                            Ha,
                            na,
                            ka,
                            0,
                            Va,
                            oa,
                            null
                          ),
                          b.getError() !== b.NO_ERROR &&
                            b.texImage2D(
                              b.TEXTURE_2D,
                              0,
                              b.RGBA,
                              na,
                              ka,
                              0,
                              b.RGBA,
                              b.UNSIGNED_BYTE,
                              null
                            )));
                    } catch (fd) {
                      b.texImage2D(
                        b.TEXTURE_2D,
                        0,
                        Ha,
                        na,
                        ka,
                        0,
                        Va,
                        oa,
                        null
                      );
                    }
                    A.isKeepArray || (Ja = null);
                  } else
                    (da = b.getError()),
                      "FUCKING_BIG_ERROR" !== da &&
                        (b.texImage2D(
                          b.TEXTURE_2D,
                          0,
                          Ha,
                          na,
                          ka,
                          0,
                          Va,
                          oa,
                          null
                        ),
                        (da = b.getError()),
                        da !== b.NO_ERROR &&
                          ((Va = b.RGBA),
                          A.R &&
                            oa !== b.FLOAT &&
                            ((oa = b.FLOAT),
                            b.texImage2D(
                              b.TEXTURE_2D,
                              0,
                              Ha,
                              na,
                              ka,
                              0,
                              Va,
                              oa,
                              null
                            ))));
                  if (A.isMipmap)
                    if (!ja && Ka) Ka.gd(), (eb = !0);
                    else if (ja) {
                      da = Math.log2(Math.min(na, ka));
                      Ca = Array(1 + da);
                      Ca[0] = sa;
                      for (var wa = 1; wa <= da; ++wa) {
                        var gb = Math.pow(2, wa),
                          Ia = na / gb;
                        gb = ka / gb;
                        var Cb = b.createTexture();
                        a(Cb);
                        b.texParameteri(
                          b.TEXTURE_2D,
                          b.TEXTURE_MIN_FILTER,
                          b.NEAREST
                        );
                        b.texParameteri(
                          b.TEXTURE_2D,
                          b.TEXTURE_MAG_FILTER,
                          b.NEAREST
                        );
                        b.texImage2D(
                          b.TEXTURE_2D,
                          0,
                          Ha,
                          Ia,
                          gb,
                          0,
                          Va,
                          oa,
                          null
                        );
                        a(null);
                        Ca[wa] = Cb;
                      }
                      eb = !0;
                    }
                  a(null);
                  q[k] = -1;
                  M && b.pixelStorei(b.UNPACK_FLIP_Y_WEBGL, !1);
                  Ga = !0;
                  A.P && Ka && (A.P(Ka), (A.P = null));
                }
              }
              function U() {
                for (
                  var da = na * ka, wa = 2 * da, gb = 3 * da, Ia = 0;
                  Ia < da;
                  ++Ia
                )
                  (ta[0][Ia] = kb[Ia]),
                    (ta[1][Ia] = kb[Ia + da]),
                    (ta[2][Ia] = kb[Ia + wa]),
                    (ta[3][Ia] = kb[Ia + gb]);
              }
              function Z() {
                var da = na * ka * 4;
                Ma = [
                  new Uint8Array(da),
                  new Uint8Array(da),
                  new Uint8Array(da),
                  new Uint8Array(da),
                ];
                ta = [
                  new Float32Array(Ma[0].buffer),
                  new Float32Array(Ma[1].buffer),
                  new Float32Array(Ma[2].buffer),
                  new Float32Array(Ma[3].buffer),
                ];
                pa = new Uint8Array(4 * da);
                kb = new Float32Array(pa.buffer);
                fa = !0;
              }
              function T() {
                ab.ve = new Uint8Array(na * ka * 4);
                ab.qh = new Float32Array(ab.buffer);
                ab.Ma = !0;
              }
              var A = Object.assign({}, f, u),
                N = x++;
              null === A.isFlipY && (A.isFlipY = A.url || A.array ? !0 : !1);
              A.data &&
                ((A.array =
                  "string" === typeof A.data
                    ? Za(A.data)
                    : A.isFloat
                    ? new Float32Array(A.data)
                    : new Uint8Array(A.data)),
                (A.isFlipY = !1));
              var z = 0,
                C = A.ha ? !0 : !1,
                Q = null,
                ea = null,
                ha = !1,
                ia = null;
              A.R = A.R || A.isFloat;
              A.R && (z = 1);
              !A.fm && A.isFloat && F && !Aa.da() && (A.isFloat = !1);
              A.isFloat && (z = 2);
              A.isAnisotropicFiltering &&
                m &&
                !ba.nm() &&
                (A.isAnisotropicFiltering = !1);
              var sa = A.Ch || b.createTexture(),
                Wa = null,
                Ja = !1,
                na = 0,
                ka = 0,
                Ga = !1,
                W = !1,
                fa = !1,
                ta = null,
                Ma = null,
                pa = null,
                kb = null,
                Ha = null,
                Va = null,
                oa = null,
                M = A.isFlipY,
                aa = (u = A.R && A.isMipmap) && yb.zk(),
                ja = u && aa ? !0 : !1,
                Ca = null,
                Qa = -1,
                eb = !1,
                ab = { Ma: !1, ve: null, qh: null };
              A.width && ((na = A.width), (ka = A.height ? A.height : na));
              var Ka = {
                get: function () {
                  return sa;
                },
                L: function () {
                  return na;
                },
                T: function () {
                  return ka;
                },
                Rl: function () {
                  return A.url;
                },
                Yh: function () {
                  return A.isFloat;
                },
                Zh: function () {
                  return A.R;
                },
                Bp: function () {
                  return A.isLinear;
                },
                gd: function () {
                  b.generateMipmap(b.TEXTURE_2D);
                },
                sk: function (da, wa) {
                  ja
                    ? (da || (da = Ka.zh()), G.ke(wa), a(Ca[da]), (q[wa] = -1))
                    : Ka.g(wa);
                },
                zh: function () {
                  -1 === Qa && (Qa = Math.log(na) / Math.log(2));
                  return Qa;
                },
                nl: function (da) {
                  if (ja) {
                    da || (da = Ka.zh());
                    ca.set("s12");
                    G.ke(0);
                    for (var wa = na, gb = ka, Ia = 1; Ia <= da; ++Ia)
                      (wa /= 2),
                        (gb /= 2),
                        ca.M("u8", 0.25 / wa, 0.25 / gb),
                        b.viewport(0, 0, wa, gb),
                        a(Ca[Ia - 1]),
                        b.framebufferTexture2D(
                          za.ld(),
                          b.COLOR_ATTACHMENT0,
                          b.TEXTURE_2D,
                          Ca[Ia],
                          0
                        ),
                        Y.l(!1, 1 === Ia);
                    q[0] = -1;
                  } else Ka.gd();
                },
                Vp: function (da) {
                  (C = !(
                    Array.isArray(da) ||
                    da.constructor === Float32Array ||
                    da.constructor === Uint8Array
                  ))
                    ? ((Ja = null), (A.ha = da), L())
                    : (Ja = da);
                },
                g: function (da) {
                  if (!Ga) return !1;
                  G.ke(da);
                  if (q[da] === N) return !1;
                  a(sa);
                  q[da] = N;
                  return !0;
                },
                Hb: function (da) {
                  b.activeTexture(p[da]);
                  k = da;
                  a(sa);
                  q[da] = N;
                },
                o: function () {
                  v = Ka;
                  b.framebufferTexture2D(
                    za.ld(),
                    b.COLOR_ATTACHMENT0,
                    b.TEXTURE_2D,
                    sa,
                    0
                  );
                },
                S: function () {
                  v = Ka;
                  b.viewport(0, 0, na, ka);
                  b.framebufferTexture2D(
                    za.ld(),
                    b.COLOR_ATTACHMENT0,
                    b.TEXTURE_2D,
                    sa,
                    0
                  );
                },
                Vd: G.Vd,
                resize: function (da, wa) {
                  na = da;
                  ka = wa;
                  P();
                },
                clone: function (da) {
                  da = G.instance({
                    width: na,
                    height: ka,
                    R: A.R,
                    isFloat: A.isFloat,
                    isLinear: A.isLinear,
                    isMirrorY: A.isMirrorY,
                    isFlipY: da ? !M : M,
                    isPot: A.isPot,
                  });
                  ob.set("s0");
                  za.ma();
                  da.o();
                  b.viewport(0, 0, na, ka);
                  Ka.g(0);
                  Y.l(!0, !0);
                  return da;
                },
                Gc: function () {
                  b.viewport(0, 0, na, ka);
                },
                remove: function () {
                  b.deleteTexture(sa);
                  W = !0;
                  r.splice(r.indexOf(Ka), 1);
                  Ka = null;
                },
                refresh: function () {
                  Ka.Hb(0);
                  M && b.pixelStorei(b.UNPACK_FLIP_Y_WEBGL, !0);
                  C
                    ? b.texImage2D(b.TEXTURE_2D, 0, Ha, Va, oa, A.ha)
                    : b.texImage2D(b.TEXTURE_2D, 0, Ha, na, ka, 0, Va, oa, Ja);
                  M && b.pixelStorei(b.UNPACK_FLIP_Y_WEBGL, !1);
                },
                Fi: function () {
                  fa || Z();
                  b.readPixels(0, 0, na, 4 * ka, b.RGBA, b.UNSIGNED_BYTE, pa);
                  U();
                  return ta;
                },
                an: function () {
                  fa || Z();
                  return Aa.Sf(0, 0, na, 4 * ka, pa).then(function () {
                    U();
                    return ta;
                  });
                },
                cn: function () {
                  ab.Ma || T();
                  b.readPixels(0, 0, na, ka, b.RGBA, b.UNSIGNED_BYTE, ab.ve);
                  return ab.qh;
                },
                bn: function () {
                  ab.Ma || T();
                  return Aa.Sf(0, 0, na, ka, ab.ve);
                },
                eh: function (da) {
                  za.$();
                  ca.set("s13");
                  Ka.g(0);
                  if (da)
                    b.viewport(0, 0, na, ka),
                      ca.va("u9", 0.25, 0.25, 0.25, 0.25),
                      Y.l(!1, !0);
                  else
                    for (da = 0; 4 > da; ++da)
                      b.viewport(0, ka * da, na, ka),
                        ca.va("u9", n[da]),
                        Y.l(!1, 0 === da);
                },
                hq: function (da) {
                  var wa;
                  if ((wa = oa === E[0]))
                    null !== g.kf
                      ? (wa = g.kf)
                      : ((wa = d(new Uint8Array([127, 127, 127, 127]))),
                        (wa = null === wa ? !0 : (g.kf = wa))),
                      (wa = !wa);
                  a(sa);
                  M && b.pixelStorei(b.UNPACK_FLIP_Y_WEBGL, !0);
                  wa
                    ? (ha ||
                        ((Q = document.createElement("canvas")),
                        (Q.width = na),
                        (Q.height = ka),
                        (ea = Q.getContext("2d")),
                        (ia = ea.createImageData(na, ka)),
                        (ha = !0)),
                      ia.data.set(da),
                      ea.putImageData(ia, 0, 0),
                      b.texImage2D(b.TEXTURE_2D, 0, Ha, Va, oa, Q))
                    : b.texImage2D(b.TEXTURE_2D, 0, Ha, na, ka, 0, Va, oa, da);
                  q[k] = N;
                  M && b.pixelStorei(b.UNPACK_FLIP_Y_WEBGL, !1);
                },
                iq: function (da, wa) {
                  a(sa);
                  wa && b.pixelStorei(b.UNPACK_FLIP_Y_WEBGL, !0);
                  b.texImage2D(b.TEXTURE_2D, 0, Ha, Va, oa, da);
                  q[k] = N;
                  wa && b.pixelStorei(b.UNPACK_FLIP_Y_WEBGL, !1);
                },
                Cc: function (da, wa) {
                  var gb = na * ka,
                    Ia = 4 * gb;
                  da = A.R ? (da ? "RGBE" : "JSON") : "RGBA";
                  wa && (da = wa);
                  wa = Aa.ia() && !1;
                  var Cb = null;
                  switch (da) {
                    case "RGBE":
                      Cb = "s43";
                      break;
                    case "JSON":
                      Cb = wa ? "s0" : "s13";
                      break;
                    case "RGBA":
                    case "RGBAARRAY":
                      Cb = "s7";
                  }
                  fa ||
                    ("RGBA" === da || "RGBE" === da || "RGBAARRAY" === da
                      ? ((Ma = new Uint8Array(Ia)), (fa = !0))
                      : "JSON" !== da || wa || Z());
                  za.$();
                  ca.set(Cb);
                  Ka.g(0);
                  Ia = null;
                  if ("RGBA" === da || "RGBE" === da || "RGBAARRAY" === da) {
                    b.viewport(0, 0, na, ka);
                    Y.l(!0, !0);
                    b.readPixels(0, 0, na, ka, b.RGBA, b.UNSIGNED_BYTE, Ma);
                    if ("RGBAARRAY" === da) return { data: Ma };
                    h ||
                      ((J = document.createElement("canvas")),
                      (B = J.getContext("2d")),
                      (h = !0));
                    J.width = na;
                    J.height = ka;
                    gb = B.createImageData(na, ka);
                    gb.data.set(Ma);
                    B.putImageData(gb, 0, 0);
                    Ia = J.toDataURL("image/png");
                  } else if ("JSON" === da)
                    if (wa)
                      (Ia = new Float32Array(gb)),
                        b.viewport(0, 0, na, ka),
                        Y.l(!0, !0),
                        b.readPixels(0, 0, na, ka, b.RGBA, b.FLOAT, Ia);
                    else {
                      for (Ia = 0; 4 > Ia; ++Ia)
                        b.viewport(0, ka * Ia, na, ka),
                          ca.va("u9", n[Ia]),
                          Y.l(!Ia, !Ia);
                      Ka.Fi();
                      Ia = Array(gb);
                      for (wa = 0; wa < gb; ++wa)
                        (Ia[4 * wa] = ta[0][wa]),
                          (Ia[4 * wa + 1] = ta[1][wa]),
                          (Ia[4 * wa + 2] = ta[2][wa]),
                          (Ia[4 * wa + 3] = ta[3][wa]);
                    }
                  return {
                    format: da,
                    data: Ia,
                    width: na,
                    height: ka,
                    isMirrorY: A.isMirrorY,
                    isFlipY: "RGBA" === da ? A.isFlipY : !A.isFlipY,
                  };
                },
              };
              A.isMipmap && !ja && Ga && !eb && (Ka.gd(), (eb = !0));
              if (A.url)
                a(sa),
                  b.texImage2D(
                    b.TEXTURE_2D,
                    0,
                    b.RGBA,
                    1,
                    1,
                    0,
                    b.RGBA,
                    b.UNSIGNED_BYTE,
                    null
                  ),
                  (Wa = new Image()),
                  (Wa.Zo = "Anonymous"),
                  (Wa.crossOrigin = "Anonymous"),
                  (Wa.src = A.url),
                  (Wa.onload = function () {
                    na = Wa.width;
                    ka = Wa.height;
                    P();
                  });
              else if (A.ha) {
                var Hc = function () {
                  L();
                  na ? P() : setTimeout(Hc, 1);
                };
                Hc();
              } else
                A.array
                  ? (A.R && !A.isFloat
                      ? A.array instanceof Uint16Array
                        ? ((Ja = A.array), P())
                        : e()
                        ? ((Ja = c(A.array)), P())
                        : (P(), G.ph(b, sa, Ka.L(), Ka.T(), A.array, M, !0))
                      : ((Ja = A.isFloat
                          ? A.array instanceof Float32Array
                            ? A.array
                            : new Float32Array(A.array)
                          : A.array instanceof Uint8Array
                          ? A.array
                          : new Uint8Array(A.array)),
                        P()),
                    A.isKeepArray ||
                      (Ja && Ja !== A.array && (Ja = null), delete A.array))
                  : A.Ch
                  ? (Ga = !0)
                  : P();
              Ka.up = Ka.L;
              A.P && Ga && (A.P(Ka), (A.P = null));
              r.push(Ka);
              return Ka;
            },
            $: function (u) {
              u !== k && (b.activeTexture(p[u]), (k = u));
              q[u] = -1;
              a(null);
            },
            tk: function (u) {
              t.random.g(u);
            },
            Vd: function () {
              v = null;
              b.framebufferTexture2D(
                za.ld(),
                b.COLOR_ATTACHMENT0,
                b.TEXTURE_2D,
                null,
                0
              );
            },
            reset: function () {
              0 !== k && b.activeTexture(p[0]);
              for (var u = 0; u < p.length; ++u) q[u] = -1;
              k = -1;
            },
            Mp: function () {
              k = -1;
            },
            rj: function () {
              for (var u = 0; u < p.length; ++u) G.$(u);
            },
            K: function () {
              t && (t.random.remove(), t.pj.remove());
            },
            Jc: function (u, L) {
              if ("RGBA" === u.format || "RGBE" === u.format) {
                var H = new Image();
                H.src = u.data;
                H.onload = function () {
                  G.instance({
                    isMirrorY: u.isMirrorY,
                    isFlipY: u.isFlipY,
                    isFloat: !1,
                    ha: H,
                    P: function (P) {
                      if ("RGBA" === u.format) L(P);
                      else {
                        var U = u.width,
                          Z = u.height,
                          T = G.instance({
                            isMirrorY: u.isMirrorY,
                            isFloat: !0,
                            width: U,
                            height: Z,
                            isFlipY: u.isFlipY,
                          });
                        za.ma();
                        b.viewport(0, 0, U, Z);
                        ca.set("s44");
                        T.o();
                        P.g(0);
                        Y.l(!0, !0);
                        G.$(0);
                        L(T);
                        b.flush();
                        setTimeout(P.remove, 50);
                      }
                    },
                  });
                };
              } else
                "JSON" === u.format
                  ? L(
                      G.instance({
                        isFloat: !0,
                        isFlipY: u.isFlipY,
                        width: u.width,
                        height: u.height,
                        array: new Float32Array(u.data),
                      })
                    )
                  : L(!1);
            },
            Fk: c,
            v: function () {
              v && (za.ma(), G.Vd(), za.$());
              G.rj();
              r.slice(0).forEach(function (u) {
                u.remove();
              });
              r.splice(0);
              w = !1;
              x = 0;
              "undefined" !== typeof yb && yb.v();
              t = null;
            },
          };
        return G;
      })(),
      Nc = {
        instance: function (a) {
          var c = [X.instance(a), X.instance(a)],
            e = [c[1], c[0]],
            d = e,
            k = {
              yn: function (p) {
                d[1].o();
                d[0].g(p);
                k.fj();
              },
              Pp: function (p) {
                d[1].S();
                d[0].g(p);
                k.fj();
              },
              fj: function () {
                d = d === c ? e : c;
              },
              refresh: function () {
                d[0].refresh();
                d[1].refresh();
              },
              g: function (p) {
                d[0].g(p);
              },
              Oo: function (p) {
                d[1].g(p);
              },
              pp: function () {
                return d[0];
              },
              sp: function () {
                return d[1];
              },
              remove: function () {
                d[0].remove();
                d[1].remove();
                d = null;
              },
            };
          return k;
        },
      },
      Y = (function () {
        function a(t) {
          var v = { ga_: null, V: null };
          v.ga_ = t.createBuffer();
          t.bindBuffer(t.ARRAY_BUFFER, v.ga_);
          t.bufferData(
            t.ARRAY_BUFFER,
            new Float32Array([-1, -1, 3, -1, -1, 3]),
            t.STATIC_DRAW
          );
          v.V = t.createBuffer();
          t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, v.V);
          t.bufferData(
            t.ELEMENT_ARRAY_BUFFER,
            new Uint16Array([0, 1, 2]),
            t.STATIC_DRAW
          );
          return v;
        }
        var c = null,
          e = 0,
          d = !1,
          k = [],
          p = -2,
          x = -2,
          q = {
            reset: function () {
              x = p = -2;
            },
            m: function () {
              d || ((c = a(b)), q.qe(), (d = !0));
            },
            instance: function (t) {
              var v = e++,
                E = t.V ? t.V.length : 0,
                K = "undefined" === typeof t.mode ? b.STATIC_DRAW : t.mode,
                l = b.createBuffer();
              b.bindBuffer(b.ARRAY_BUFFER, l);
              b.bufferData(
                b.ARRAY_BUFFER,
                t.ga_ instanceof Float32Array ? t.ga_ : new Float32Array(t.ga_),
                K
              );
              p = v;
              var w = null,
                r = null,
                f = null;
              if (t.V) {
                w = b.createBuffer();
                b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, w);
                var h = null;
                65536 > t.V.length
                  ? ((h = Uint16Array), (r = b.UNSIGNED_SHORT), (f = 2))
                  : ((h = Uint32Array), (r = b.UNSIGNED_INT), (f = 4));
                h = t.V instanceof h ? t.V : new h(t.V);
                b.bufferData(b.ELEMENT_ARRAY_BUFFER, h, K);
                x = v;
              }
              var J = {
                pc: function (B) {
                  p !== v && (b.bindBuffer(b.ARRAY_BUFFER, l), (p = v));
                  B && ob.Ld();
                },
                qk: function () {
                  x !== v && (b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, w), (x = v));
                },
                bind: function (B) {
                  J.pc(B);
                  J.qk();
                },
                W: function () {
                  b.drawElements(b.TRIANGLES, E, r, 0);
                },
                Ka: function (B, n) {
                  b.drawElements(b.TRIANGLES, B, r, n * f);
                },
                remove: function () {
                  b.deleteBuffer(l);
                  t.V && b.deleteBuffer(w);
                  J = null;
                },
              };
              k.push(J);
              return J;
            },
            qe: function () {
              -1 !== p && (b.bindBuffer(b.ARRAY_BUFFER, c.ga_), (p = -1));
              -1 !== x && (b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, c.V), (x = -1));
            },
            l: function (t, v) {
              t && Y.qe();
              v && ob.Fc();
              b.drawElements(b.TRIANGLES, 3, b.UNSIGNED_SHORT, 0);
            },
            Lb: function (t) {
              t = t || b;
              var v = a(t);
              t.bindBuffer(t.ARRAY_BUFFER, v.ga_);
              t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, v.V);
              ob.$b(t);
              t.clear(t.COLOR_BUFFER_BIT);
              t.drawElements(t.TRIANGLES, 3, t.UNSIGNED_SHORT, 0);
              t.flush();
              t.bindBuffer(t.ARRAY_BUFFER, null);
              t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, null);
              t.deleteBuffer(v.ga_);
              t.deleteBuffer(v.V);
              q.reset();
              d && (q.qe(), ob.Fc());
            },
            K: function () {
              var t = b,
                v = c;
              t.deleteBuffer(v.ga_);
              t.deleteBuffer(v.V);
            },
            v: function () {
              q.K();
              k.forEach(function (t) {
                t.remove();
              });
              b.bindBuffer(b.ARRAY_BUFFER, null);
              b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, null);
              q.reset();
              d = !1;
              k.splice(0);
              e = 0;
            },
          };
        return q;
      })(),
      za = (function () {
        var a = null,
          c = null,
          e = null,
          d = !1,
          k = [],
          p = { na: -2, oh: 1 },
          x = {
            Tb: function () {
              return d;
            },
            m: function () {
              if (!d) {
                a = b.createFramebuffer();
                var q = Aa.ia();
                c =
                  q && b.DRAW_FRAMEBUFFER ? b.DRAW_FRAMEBUFFER : b.FRAMEBUFFER;
                e =
                  q && b.READ_FRAMEBUFFER ? b.READ_FRAMEBUFFER : b.FRAMEBUFFER;
                d = !0;
              }
            },
            xl: function () {
              return c;
            },
            wh: function () {
              return e;
            },
            ld: function () {
              return b.FRAMEBUFFER;
            },
            tp: function () {
              return p;
            },
            kp: function () {
              return a;
            },
            instance: function (q) {
              void 0 === q.tc && (q.tc = !1);
              var t = q.ja ? q.ja : null,
                v = q.width,
                E = void 0 !== q.height ? q.height : q.width,
                K = a,
                l = null,
                w = !1,
                r = !1,
                f = 0;
              t && ((v = v ? v : t.L()), (E = E ? E : t.T()));
              var h = {
                Pi: function () {
                  w || ((K = b.createFramebuffer()), (w = !0), (f = p.oh++));
                },
                Qc: function () {
                  h.Pi();
                  h.o();
                  l = b.createRenderbuffer();
                  b.bindRenderbuffer(b.RENDERBUFFER, l);
                  b.renderbufferStorage(
                    b.RENDERBUFFER,
                    b.DEPTH_COMPONENT16,
                    v,
                    E
                  );
                  b.framebufferRenderbuffer(
                    c,
                    b.DEPTH_ATTACHMENT,
                    b.RENDERBUFFER,
                    l
                  );
                  b.clearDepth(1);
                },
                bind: function (J, B) {
                  f !== p.na && (b.bindFramebuffer(c, K), (p.na = f));
                  t && t.o();
                  B && b.viewport(0, 0, v, E);
                  J && b.clear(b.COLOR_BUFFER_BIT | b.DEPTH_BUFFER_BIT);
                },
                Lg: function () {
                  f !== p.na && (b.bindFramebuffer(c, K), (p.na = f));
                },
                clear: function () {
                  b.clear(b.COLOR_BUFFER_BIT | b.DEPTH_BUFFER_BIT);
                },
                ze: function () {
                  b.clear(b.COLOR_BUFFER_BIT);
                },
                Sg: function () {
                  b.clear(b.DEPTH_BUFFER_BIT);
                },
                Gc: function () {
                  b.viewport(0, 0, v, E);
                },
                o: function () {
                  f !== p.na && (b.bindFramebuffer(c, K), (p.na = f));
                },
                rtt: function (J) {
                  t = J;
                  p.na !== f &&
                    (b.bindFramebuffer(b.FRAMEBUFFER, K), (p.na = f));
                  J.o();
                },
                $: function () {
                  b.bindFramebuffer(c, null);
                  p.na = -1;
                },
                resize: function (J, B) {
                  v = J;
                  E = B;
                  l &&
                    (b.bindRenderbuffer(b.RENDERBUFFER, l),
                    b.renderbufferStorage(
                      b.RENDERBUFFER,
                      b.DEPTH_COMPONENT16,
                      v,
                      E
                    ));
                },
                remove: function () {
                  K === a ||
                    r ||
                    (b.bindFramebuffer(c, K),
                    b.framebufferTexture2D(
                      c,
                      b.COLOR_ATTACHMENT0,
                      b.TEXTURE_2D,
                      null,
                      0
                    ),
                    l &&
                      b.framebufferRenderbuffer(
                        c,
                        b.DEPTH_ATTACHMENT,
                        b.RENDERBUFFER,
                        null
                      ),
                    b.bindFramebuffer(c, null),
                    b.deleteFramebuffer(K),
                    l && b.deleteRenderbuffer(l));
                  r = !0;
                },
              };
              q.tc && h.Qc();
              k.push(h);
              return h;
            },
            $: function () {
              b.bindFramebuffer(c, null);
              p.na = -1;
            },
            fq: function () {
              b.bindFramebuffer(c, null);
              b.clear(b.COLOR_BUFFER_BIT | b.DEPTH_BUFFER_BIT);
              b.viewport(0, 0, Aa.L(), Aa.T());
              p.na = -1;
            },
            reset: function () {
              p.na = -2;
            },
            ma: function () {
              0 !== p.na && (b.bindFramebuffer(c, a), (p.na = 0));
            },
            clear: function () {
              b.viewport(0, 0, Aa.L(), Aa.T());
              b.clear(b.COLOR_BUFFER_BIT);
            },
            v: function () {
              x.$();
              k.forEach(function (q) {
                q.remove();
              });
              null !== a && (b.deleteFramebuffer(a), (a = null));
              x.reset();
              d = !1;
              k.splice(0);
              p.oh = 1;
            },
          };
        return x;
      })(),
      Aa = (function () {
        function a() {
          d = "undefined" === typeof fb ? ba : fb;
          k = !0;
        }
        function c(f, h) {
          for (var J = 0; J < f.length; ++J) {
            var B = h.getExtension(f[J]);
            if (B) return B;
          }
          return null;
        }
        function e() {
          null !== l.Ud && (clearInterval(l.Ud), (l.Ud = null));
          l.uc = !1;
        }
        var d = null,
          k = !1,
          p = {
            Rh: !1,
            pg: null,
            qg: null,
            Vh: !1,
            lm: !1,
            rg: null,
            Wh: !1,
            sg: null,
            Sh: !1,
            Ae: null,
            dm: !1,
            Be: null,
            em: !1,
          },
          x = null,
          q = { Va: !0, Wa: !0, Qe: !0, Ei: !1 },
          t = null,
          v = !0,
          E = null,
          K = null,
          l = { uc: !1, Nb: null, pd: null, $e: -1, La: null, Ud: null },
          w = "undefined" === typeof window ? {} : window,
          r = {
            m: function () {
              if (k) return !0;
              r.reset();
              k || a();
              var f = b;
              if (!x.Rh) {
                x.pg = r.lh(f);
                w.GL_EXT_FLOAT = x.pg;
                x.Vh = x.pg ? !0 : !1;
                if (x.Vh || r.ia())
                  (x.qg = r.mh(f)),
                    (x.lm = x.qg ? !0 : !1),
                    (w.GL_EXT_FLOATLINEAR = x.qg);
                x.Rh = !0;
              }
              if (!x.Sh) {
                x.rg = r.cd(f);
                x.rg && ((x.Wh = !0), (w.GL_EXT_HALFFLOAT = x.rg));
                if (x.Wh || r.ia())
                  (x.sg = r.nh(f)), (w.GL_EXT_HALFFLOATLINEAR = x.sg);
                x.zp = x.sg ? !0 : !1;
                x.Sh = !0;
              }
              x.Ae = r.jh(f);
              x.dm = x.Ae ? !0 : !1;
              w.GL_EXT_COLORBUFFERFLOAT = x.Ae;
              x.Be = r.kh(f);
              x.em = x.Be ? !0 : !1;
              w.GL_EXT_COLORBUFFERHALFFLOAT = x.Be;
              za.m();
              X.m();
              if (!r.Sk()) return !1;
              Y.m();
              X.Yl();
              return !0;
            },
            reset: function () {
              x = Object.assign({}, p);
              t = Object.assign({}, q);
            },
            L: function () {
              k || a();
              return d.L();
            },
            T: function () {
              k || a();
              return d.T();
            },
            ia: function () {
              k || a();
              return d.ia();
            },
            ih: function (f) {
              r.jh(f);
              r.kh(f);
              r.lh(f);
              r.mh(f);
              r.cd(f);
              r.nh(f);
            },
            jh: c.bind(null, [
              "EXT_color_buffer_float",
              "WEBGL_color_buffer_float",
              "OES_color_buffer_float",
            ]),
            kh: c.bind(null, [
              "EXT_color_buffer_half_float",
              "WEBGL_color_buffer_half_float",
              "OES_color_buffer_half_float",
            ]),
            lh: c.bind(null, [
              "OES_texture_float",
              "MOZ_OES_texture_float",
              "WEBKIT_OES_texture_float",
            ]),
            mh: c.bind(null, [
              "OES_texture_float_linear",
              "MOZ_OES_texture_float_linear",
              "WEBKIT_OES_texture_float_linear",
            ]),
            cd: c.bind(null, [
              "OES_texture_half_float",
              "MOZ_OES_texture_half_float",
              "WEBKIT_OES_texture_half_float",
            ]),
            nh: c.bind(null, [
              "OES_texture_half_float_linear",
              "MOZ_OES_texture_half_float_linear",
              "WEBKIT_OES_texture_half_float_linear",
            ]),
            Ve: function (f) {
              var h = r.cd(f);
              return h && h.HALF_FLOAT_OES
                ? h.HALF_FLOAT_OES
                : f.HALF_FLOAT || f.FLOAT;
            },
            yl: function () {
              return K || b.RGBA32F || b.RGBA;
            },
            zl: function () {
              return E || b.RGBA16F || b.RGBA;
            },
            rl: function () {
              return t;
            },
            da: function () {
              return t.Va;
            },
            Uo: function () {
              return t.Wa;
            },
            yk: function () {
              return t.Qe;
            },
            Bk: function () {
              return t.Ei && v;
            },
            oj: function (f) {
              v = f;
              !f &&
                l.uc &&
                (b.deleteSync(l.pd), b.bindBuffer(l.La, null), (l.uc = !1));
            },
            Rd: function (f, h, J) {
              function B() {
                f.bindTexture(f.TEXTURE_2D, null);
                f.bindFramebuffer(n, null);
                f.deleteTexture(O);
                f.deleteFramebuffer(F);
              }
              var n = f.FRAMEBUFFER,
                m = f.NEAREST,
                F = f.createFramebuffer();
              f.bindFramebuffer(n, F);
              var O = f.createTexture();
              f.activeTexture(f.TEXTURE0);
              f.bindTexture(f.TEXTURE_2D, O);
              f.pixelStorei(f.UNPACK_FLIP_Y_WEBGL, !1);
              f.texParameteri(f.TEXTURE_2D, f.TEXTURE_WRAP_S, f.CLAMP_TO_EDGE);
              f.texParameteri(f.TEXTURE_2D, f.TEXTURE_WRAP_T, f.CLAMP_TO_EDGE);
              f.texParameteri(f.TEXTURE_2D, f.TEXTURE_MAG_FILTER, m);
              f.texParameteri(f.TEXTURE_2D, f.TEXTURE_MIN_FILTER, m);
              f.texImage2D(f.TEXTURE_2D, 0, h, 3, 3, 0, f.RGBA, J, null);
              f.framebufferTexture2D(
                f.FRAMEBUFFER,
                f.COLOR_ATTACHMENT0,
                f.TEXTURE_2D,
                O,
                0
              );
              if (
                f.checkFramebufferStatus(
                  f.READ_FRAMEBUFFER || f.FRAMEBUFFER
                ) !== f.FRAMEBUFFER_COMPLETE
              )
                return B(), !1;
              ob.Jd(f);
              f.clearColor(0, 0, 0, 0);
              f.viewport(0, 0, 3, 3);
              f.disable(f.DEPTH_TEST);
              f.clear(f.COLOR_BUFFER_BIT);
              Y.Lb(f);
              f.bindFramebuffer(n, null);
              ob.wb(f);
              f.activeTexture(f.TEXTURE0);
              f.bindTexture(f.TEXTURE_2D, O);
              Y.Lb(f);
              h = new Uint8Array(36);
              f.readPixels(0, 0, 3, 3, f.RGBA, f.UNSIGNED_BYTE, h);
              B();
              for (J = 0; 36 > J; ++J)
                if (3 !== J % 4 && 3 < Math.abs(h[J] - 127)) return !1;
              return !0;
            },
            Je: function (f) {
              var h = { Va: !1, Wa: !1 };
              f.disable(f.BLEND);
              f.clearColor(0, 0, 0, 0);
              f.clear(f.COLOR_BUFFER_BIT);
              f.RGBA32F &&
                r.Rd(f, f.RGBA32F, f.FLOAT) &&
                ((h.Va = !0), (K = f.RGBA32F));
              !h.Va && r.Rd(f, f.RGBA, f.FLOAT) && ((h.Va = !0), (K = f.RGBA));
              var J = r.Ve(f);
              E = null;
              f.RGBA16F &&
                r.Rd(f, f.RGBA16F, J) &&
                ((h.Wa = !0), (E = f.RGBA16F));
              !h.Wa && r.Rd(f, f.RGBA, J) && ((h.Wa = !0), (E = f.RGBA));
              return h;
            },
            Uk: function () {
              var f = za.instance({ width: 2 });
              f.Pi();
              var h = X.instance({ width: 2, isFloat: !0, F: 3 });
              f.o();
              h.o();
              b.flush();
              b.checkFramebufferStatus(za.wh()) !== b.FRAMEBUFFER_COMPLETE
                ? (X.Jn(), (t.Qe = !1))
                : (t.Qe = !0);
              f.remove();
              h.remove();
            },
            Vk: function () {
              var f = !1;
              r.ia() &&
                (f =
                  "PIXEL_PACK_BUFFER STREAM_READ SYNC_GPU_COMMANDS_COMPLETE WAIT_FAILED fenceSync deleteSync createBuffer"
                    .split(" ")
                    .every(function (h) {
                      return "undefined" !== typeof b[h];
                    }));
              t.Ei = f;
            },
            Sk: function () {
              var f = r.Je(b);
              Object.assign(t, f);
              if (!t.Va && !t.Wa) return !1;
              r.Uk();
              r.Vk();
              return !0;
            },
            Sf: function (f, h, J, B, n) {
              if (!r.Bk())
                return (
                  b.readPixels(f, h, J, B, b.RGBA, b.UNSIGNED_BYTE, n),
                  Promise.resolve(n)
                );
              null === l.Nb &&
                ((l.La = b.PIXEL_PACK_BUFFER),
                (l.Nb = b.createBuffer()),
                (l.$e = -1));
              b.bindBuffer(l.La, l.Nb);
              n.byteLength !== l.$e &&
                (b.bufferData(l.La, n.byteLength, b.STREAM_READ),
                (l.$e = n.byteLength));
              b.readPixels(f, h, J, B, b.RGBA, b.UNSIGNED_BYTE, 0);
              l.pd = b.fenceSync(b.SYNC_GPU_COMMANDS_COMPLETE, 0);
              b.flush();
              return new Promise(function (m, F) {
                function O() {
                  if (!l.uc) return e(), F(), !1;
                  switch (b.clientWaitSync(l.pd, 0, 0)) {
                    case b.TIMEOUT_EXPIRED:
                    case b.WAIT_FAILED:
                      return !1;
                    default:
                      return (
                        e(),
                        b.deleteSync(l.pd),
                        b.getBufferSubData(l.La, 0, n),
                        b.bindBuffer(l.La, null),
                        m(n),
                        !0
                      );
                  }
                }
                e();
                l.uc = !0;
                O() || (l.Ud = setInterval(O, 0));
              });
            },
            v: function () {
              e();
              X.v();
              za.v();
              Y.v();
              null !== l.Nb && (b.deleteBuffer(l.Nb), (l.Nb = null));
              ob.reset();
              k = !1;
            },
          };
        return r;
      })(),
      yb = (function () {
        function a(F, O, y, g) {
          h.texParameteri(
            h.TEXTURE_2D,
            h.TEXTURE_MIN_FILTER,
            g ? h.NEAREST_MIPMAP_NEAREST : h.LINEAR
          );
          var G = null;
          if (null !== y)
            try {
              G = h.getError();
              if ("FUCKING_BIG_ERROR" === G) return !1;
              h.texImage2D(h.TEXTURE_2D, 0, F, 4, 4, 0, h.RGBA, O, y);
              G = h.getError();
              if (G !== h.NO_ERROR) return !1;
            } catch (u) {
              return !1;
            }
          g && h.generateMipmap(h.TEXTURE_2D);
          h.clear(h.COLOR_BUFFER_BIT);
          Y.Lb(h);
          G = h.getError();
          if ("FUCKING_BIG_ERROR" === G) return !1;
          h.readPixels(0, 0, 2, 2, h.RGBA, h.UNSIGNED_BYTE, E);
          G = h.getError();
          G === h.INVALID_OPERATION &&
            "undefined" !== typeof h.PIXEL_PACK_BUFFER &&
            (h.bindBuffer(h.PIXEL_PACK_BUFFER, null),
            h.readPixels(0, 0, 2, 2, h.RGBA, h.UNSIGNED_BYTE, E),
            (G = h.getError()));
          if (G !== h.NO_ERROR) return !1;
          y = !0;
          for (g = 0; 16 > g; ++g) y = y && 4 > Math.abs(E[g] - 127);
          y && ((t.Ai = O), (t.Oh = F));
          return y;
        }
        function c(F, O) {
          return J.Va && a(F, h.FLOAT, new Float32Array(K), O)
            ? ((q = x.Ig), !0)
            : !1;
        }
        function e(F, O, y) {
          if (!J.Wa) return !1;
          var g = X.Fk(K),
            G = Aa.cd(h);
          if (
            (G && G.HALF_FLOAT_OES && a(F, G.HALF_FLOAT_OES, g, O)) ||
            (h.HALF_FLOAT && a(F, h.HALF_FLOAT, g, O))
          )
            return (q = x.kc), !0;
          g = new Float32Array(K);
          if (a(F, h.FLOAT, g, O)) return (q = x.kc), !0;
          h.bindTexture(h.TEXTURE_2D, y);
          h.texImage2D(
            h.TEXTURE_2D,
            0,
            h.RGBA,
            2,
            2,
            0,
            h.RGBA,
            h.UNSIGNED_BYTE,
            null
          );
          h.bindFramebuffer(t.Zc, m);
          X.ph(h, y, 2, 2, g, !1, !1);
          h.bindFramebuffer(t.Zc, null);
          h.bindTexture(h.TEXTURE_2D, y);
          return a(F, null, null, O) ? ((q = x.kc), !0) : !1;
        }
        function d(F, O, y) {
          v = !0;
          if (e(F, !0, y) || c(O, !0)) return !0;
          v = !1;
          return e(F, !1, y) || c(O, !1) ? !0 : !1;
        }
        function k(F) {
          if (q === x.I) {
            h = F || b;
            q = x.RGBA8;
            v = !0;
            Aa.ih(h);
            J || (J = Aa.Je(h));
            za.reset();
            m = h.createFramebuffer();
            t.Zc = h.DRAW_FRAMEBUFFER || h.FRAMEBUFFER;
            h.bindFramebuffer(t.Zc, null);
            h.clearColor(0, 0, 0, 0);
            h.viewport(0, 0, 2, 2);
            ca.I();
            B = ca.wb(h);
            F = h.createTexture();
            h.activeTexture(h.TEXTURE0);
            h.bindTexture(h.TEXTURE_2D, F);
            h.texParameteri(h.TEXTURE_2D, h.TEXTURE_WRAP_S, h.REPEAT);
            h.texParameteri(h.TEXTURE_2D, h.TEXTURE_WRAP_T, h.REPEAT);
            h.texParameteri(h.TEXTURE_2D, h.TEXTURE_MAG_FILTER, h.NEAREST);
            n = F;
            var O = (F = h.RGBA),
              y = h.RGBA16F,
              g = h.RGBA32F;
            g && (F = g);
            y && (O = y);
            if ((y || g) && d(O, F, n)) return p(), !0;
            F = O = h.RGBA;
            if (d(O, F, n)) return p(), !0;
            q = x.RGBA8;
            p();
            return !1;
          }
        }
        function p() {
          h.deleteProgram(B.pa);
          h.deleteTexture(n);
          n = B = null;
        }
        for (
          var x = { I: -1, Ig: 3, kc: 2, RGBA8: 0 },
            q = x.I,
            t = { Ai: null, Oh: null, Zc: null },
            v = !0,
            E = new Uint8Array(16),
            K = Array(64),
            l = 0;
          4 > l;
          ++l
        )
          for (var w = 0; 4 > w; ++w) {
            var r = 0 === (w + l) % 2 ? 1 : 0,
              f = 4 * l + w;
            K[4 * f] = r;
            K[4 * f + 1] = r;
            K[4 * f + 2] = r;
            K[4 * f + 3] = r;
          }
        var h = null,
          J = null,
          B = null,
          n = null,
          m = null;
        return {
          zk: function (F) {
            k(F);
            return v;
          },
          Qg: function (F, O) {
            q === x.I && (typeof ("undefined" !== O) && (J = O), k(F));
            return q !== x.RGBA8;
          },
          Ap: function (F) {
            k(F);
            return q === x.Ig;
          },
          om: function (F) {
            k(F);
            return q === x.kc;
          },
          op: function (F) {
            k(F);
            return t.Ai;
          },
          Al: function (F) {
            k(F);
            return t.Oh;
          },
          v: function () {
            h = null;
            v = !0;
            q = x.I;
            J = null;
          },
        };
      })(),
      Wc = {
        instance: function (a) {
          var c = X.instance(a.alpha),
            e = X.instance(a.beta);
          return {
            bl: function () {
              c.g(1);
              e.g(2);
            },
          };
        },
      },
      Kc = {
        instance: function (a) {
          var c = null,
            e = !1,
            d = !1,
            k = null,
            p = !1,
            x = !1,
            q = null,
            t = "undefined" === typeof a.preprocessing ? !1 : a.preprocessing,
            v =
              "undefined" === typeof a.preprocessingSize
                ? a.size
                : a.preprocessingSize;
          a.mask &&
            ((e = !0),
            I && void 0 !== I.aa && (a.mask = I.aa + a.mask),
            (c = X.instance({ isFloat: !1, url: a.mask })));
          var E = !1;
          a.customInputShader &&
            ((E = "s45"),
            ca.qa({
              name: "_",
              id: E,
              h: a.customInputShader,
              gq: ["uSource"],
              precision: "lowp",
            }),
            ca.j(E, [{ type: "1i", name: "_", value: 0 }]));
          switch (t) {
            case "sobel":
              q = "s32";
              p = !0;
              break;
            case "meanNormalization":
              q = "s33";
              p = !0;
              break;
            case "grayScale":
              q = "s29";
              p = !1;
              break;
            case "grayScaleTilt":
              q = "s30";
              x = !0;
              p = !1;
              break;
            case "rgbGrayTilt":
              q = "s31";
              x = !0;
              p = !1;
              break;
            case "copy":
              q = E ? E : "s0";
              break;
            case "inputLightRegulation":
              q = E ? E : "s29";
              k = Xc.instance({ Nh: v, ui: a.size, ni: a.nBlurPass, td: !1 });
              d = !0;
              break;
            case "inputMix0":
              q = "none";
              k = Yc.instance({
                wa: v,
                xj: a.varianceMin,
                Mg: a.blurKernelSizePx,
                td: !1,
              });
              d = !0;
              break;
            case "direct":
            case "none":
              q = "abort";
              break;
            default:
              q = "s4";
          }
          x && ca.j(q, [{ name: "u27", type: "1f", value: a.tilt }]);
          e && (q += "Mask");
          var K = X.instance({ isFloat: !1, isPot: !1, width: a.size }),
            l = {
              L: function () {
                return v;
              },
              We: function () {
                return l.L();
              },
              Fl: function () {
                return d ? k.Xe() : K;
              },
              Aa: function (w) {
                za.ma();
                "abort" !== q &&
                  ("none" !== q &&
                    (ca.set(q),
                    p && ca.G("u28", 1 / a.size),
                    K.S(),
                    e && c.g(1),
                    Y.l(!1, !1),
                    K.g(0),
                    (w = K)),
                  d && k.process(w));
              },
              v: function () {
                K.remove();
                e && c.remove();
              },
            };
          return l;
        },
      },
      Lc = {
        instance: function (a) {
          function c(H) {
            k.forEach(function (P, U) {
              p[U][0] = H[0][P];
              p[U][1] = H[1][P];
              p[U][2] = H[2][P];
              p[U][3] = H[3][P];
            });
            return p;
          }
          "undefined" === typeof a.normalize && (a.normalize = !1);
          var e = {
              input: null,
              Sc: null,
              mf: null,
              Qa: null,
              Bd: null,
              Nf: null,
              Of: null,
            },
            d = null,
            k = [],
            p = [],
            x = !1,
            q = null,
            t = !0,
            v = -1,
            E = a.isReorganize ? a.isReorganize : !1,
            K = a.kernelsCount ? !0 : !1,
            l = a.dynPelu ? Wc.instance(a.dynPelu) : !1,
            w = l ? !0 : !1,
            r = { isEnabled: !1 };
          a.im
            ? ((a.sparsity =
                "undefined" !== typeof a.sparsity ? a.sparsity : a.Fd.We()),
              (t = !1))
            : "full" === a.connectivityUp && (a.sparsity = a.Fd.We());
          var f = {
              elu: "s16",
              elu01: "s17",
              relu: "s15",
              arctan: "s19",
              sigmoid: "s14",
              copy: "s0",
              softplus: "s20",
              dynPelu: "s18",
            }[a.activation],
            h = a.sparsity * a.sparsity,
            J = !1,
            B = a.size,
            n = "";
          if (a.maxPooling) {
            switch (a.maxPooling.size) {
              case 2:
                n = "s34";
                break;
              case 4:
                n = "s35";
            }
            J = !0;
            B /= a.maxPooling.size;
            e.Nf = X.instance({ isFloat: !0, isPot: !1, width: B });
          }
          var m = void 0 !== a.Jm && a.Jm ? !0 : !1,
            F = null,
            O = null,
            y = null;
          if (m) {
            F = "s46" + a.index.toString();
            ca.Jh("s46", F, [((a.normalization.n - 1) / 2).toFixed(1)]);
            ca.j(F, [
              { type: "1i", name: "u1", value: 0 },
              { type: "2f", name: "u8", value: [1 / a.size, 1 / a.size] },
              { type: "1f", name: "u7", value: a.normalization.alpha },
              { type: "1f", name: "u10", value: a.normalization.beta },
              { type: "1f", name: "u31", value: a.normalization.k },
            ]);
            var g = { isFloat: !0, isPot: !0, width: a.size };
            O = X.instance(g);
            y = X.instance(g);
          }
          var G = -1,
            u = null;
          t && (e.Qa = X.instance({ isFloat: !0, isPot: !1, width: a.size }));
          e.Sc = X.instance(a.bias);
          var L = {
            L: function () {
              return a.size;
            },
            We: function () {
              return B;
            },
            th: function () {
              return a.classesCount;
            },
            rk: function (H) {
              d.g(H);
            },
            Um: function () {
              a.remap &&
                a.remap.isEnabled &&
                (r = {
                  isEnabled: !0,
                  Dm: X.instance({
                    isFloat: !1,
                    isFlipY: !1,
                    array: new Uint8Array(a.remap.maskTexture.data),
                    width: a.remap.maskTexture.width,
                    isPot: !1,
                  }),
                  vd: a.remap.layers.map(function (H) {
                    return a.parent.Cl(H);
                  }),
                  depth: a.remap.depth,
                });
            },
            Kn: function () {
              switch (a.connectivityUp) {
                case "direct":
                  u = Zc.instance(a.connectivity);
                  break;
                case "square":
                  u = $c.instance(a.connectivity);
                  break;
                case "squareFast":
                  u = ad.instance(a.connectivity, a.activation);
                  break;
                case "full":
                  u = bd.instance(a.connectivity);
                  break;
                case "conv":
                  (v = a.kernelsCount),
                    (u = cd.instance(a.connectivity)),
                    E &&
                      (e.Bd = X.instance({
                        width: B,
                        isFloat: !0,
                        isFlipY: !1,
                        isPot: !1,
                      }));
              }
              if (u.dc) {
                var H = a.size * a.sparsity;
                G = Math.log(H / a.size) / Math.log(2);
                e.input = X.instance({
                  isMipmap: !0,
                  isFloat: !0,
                  isPot: !0,
                  width: H,
                  Gf: G,
                });
                e.mf = X.instance({ isFloat: !0, isPot: !0, width: a.size });
              }
            },
            Aa: function (H, P) {
              d = H;
              u.dc
                ? (e.input.S(),
                  K && e.Sc.g(2),
                  u.Aa(r),
                  e.input.g(0),
                  e.input.nl(G),
                  e.mf.S(),
                  K ? ca.set("s0") : (ca.set("s28"), ca.G("u26", h), e.Sc.g(1)),
                  e.input.sk(G, 0),
                  Y.l(!1, !1),
                  ca.set(f),
                  m ? O.o() : e.Qa.o(),
                  e.mf.g(0),
                  w && l.bl(),
                  Y.l(!1, !1))
                : (e.Qa.S(), e.Sc.g(1), u.Aa());
              m &&
                (ca.set(F),
                y.o(),
                O.g(0),
                Y.l(!1, !1),
                ca.set("s47"),
                ca.G("u7", 1),
                e.Qa.o(),
                y.g(1),
                Y.l(!1, !1));
              if (t)
                return (
                  J
                    ? (e.Nf.S(),
                      e.Qa.g(0),
                      ca.set(n),
                      ca.M("u8", 1 / a.size, 1 / a.size),
                      Y.l(!1, !1),
                      (P = e.Nf))
                    : (P = e.Qa),
                  P.g(0),
                  E &&
                    (e.Bd.o(),
                    ca.set("s22"),
                    ca.M("u13", v, B / v),
                    Y.l(!1, !1),
                    (P = e.Bd),
                    e.Bd.g(0)),
                  P
                );
              var U = e.Qa;
              a.normalize &&
                (ca.set("gpuRawAvg" === x ? "s9" : "s8"),
                ca.G("u4", 1 / a.size),
                e.Of.S(),
                e.Qa.g(0),
                Y.l(!1, !1),
                (U = e.Of));
              H = null;
              switch (x) {
                case "cpuRGBA2Float":
                  U.eh(!1);
                  P ? (H = L.Zm(U).then(q)) : ((U = L.$m(U)), q(U));
                  break;
                case "cpuMeanFloat":
                  U.eh(!0);
                  P ? (H = U.bn().then(q)) : ((U = U.cn()), q(U));
                  break;
                case "gpuRawAvg":
                case "gpuRaw":
                  U.g(0);
                case "none":
                  null !== q && q(U);
              }
              P && null === H && (H = Promise.resolve());
              return H;
            },
            Hk: function (H) {
              H && ((x = H.Pf || "none"), (q = H.Mf || null));
              e.Qa = X.instance({
                isFloat: !0,
                isPot: !0,
                isMipmap: !1,
                width: a.size,
              });
              H =
                "undefined" !== typeof a.classesCount && a.classesCount
                  ? a.classesCount
                  : a.size * a.size;
              for (var P = 0, U = 0, Z = 0; P < H; ++P)
                k.push(U + (a.size - 1 - Z) * a.size),
                  p.push([-1, -1, -1, -1]),
                  ++U,
                  U === a.size && ((U = 0), ++Z);
              a.normalize &&
                (e.Of = X.instance({ isFloat: !0, isPot: !0, width: a.size }));
            },
            Zm: function (H) {
              return H.an().then(c);
            },
            $m: function (H) {
              H = H.Fi();
              c(H);
              return p;
            },
            v: function () {
              for (var H in e) {
                var P = e[H];
                P && P.remove();
              }
              u && (u.v(), (u = null));
            },
          };
          a.Fd && L.Kn(a.Fd);
          return L;
        },
      },
      Zc = {
        instance: function (a) {
          var c = X.instance(a.weights);
          return {
            dc: !0,
            kd: function () {
              return 1;
            },
            v: function () {
              c.remove();
            },
            Sl: function () {
              return c;
            },
            Aa: function () {
              ca.set("s27");
              c.g(1);
              Y.l(!1, !1);
            },
          };
        },
      },
      bd = {
        instance: function (a) {
          var c = a.fromLayerSize,
            e = X.instance(a.weights);
          return {
            dc: !0,
            kd: function () {
              return c;
            },
            v: function () {
              e.remove();
            },
            Aa: function (d) {
              if (d.isEnabled) {
                ca.set("s25");
                d.Dm.g(3);
                var k,
                  p = Math.min(d.vd.length, d.depth);
                for (k = 0; k < p; ++k) d.vd[k].rk(4 + k);
              } else ca.set("s24");
              ca.G("u17", a.toLayerSize);
              e.g(1);
              Y.l(!1, !1);
            },
          };
        },
      },
      $c = {
        instance: function (a) {
          for (
            var c = a.fromLayerSize,
              e = a.toLayerSize,
              d = a.toSparsity,
              k = d * e,
              p = k / c,
              x = c / e,
              q = 0,
              t = 0,
              v = 0,
              E = Array(d * e * d * e * 4),
              K = Array(d * e * d * e * 4),
              l = Array(c * c),
              w = 0;
            w < l.length;
            ++w
          )
            l[w] = 0;
          w = Math.floor(d / 2);
          for (var r = 0.5 / e, f = 0.5 / c, h = 0.5 / k, J = 0; J < e; ++J)
            for (var B = Math.round(J * x), n = 0; n < e; ++n) {
              var m = Math.round(n * x),
                F = J / e,
                O = n / e;
              F += r;
              O += r;
              for (var y = 0; y < d; ++y) {
                var g = B + y - w;
                0 > g && (g += c);
                g >= c && (g -= c);
                for (var G = 0; G < d; ++G) {
                  var u = q / k,
                    L = t / k,
                    H = m + G - w;
                  0 > H && (H += c);
                  H >= c && (H -= c);
                  var P = g / c,
                    U = H / c;
                  L = 1 - L - 1 / k;
                  P += f;
                  U += f;
                  u += h;
                  L += h;
                  var Z = J * d + y,
                    T = n * d + G;
                  T = e * d - T - 1;
                  Z = T * e * d + Z;
                  E[4 * Z] = u;
                  E[4 * Z + 1] = L;
                  E[4 * Z + 2] = P;
                  E[4 * Z + 3] = U;
                  U = l[H * c + g]++;
                  Z = U % p;
                  P = g * p + Z;
                  H = H * p + (U - Z) / p;
                  H = c * p - 1 - H;
                  H = H * c * p + P;
                  K[4 * H] = u;
                  K[4 * H + 1] = L;
                  K[4 * H + 2] = F;
                  K[4 * H + 3] = O;
                  ++q >= k && ((q = 0), ++t);
                  ++v;
                }
              }
            }
          l = null;
          var A = X.instance(a.weights);
          delete a.weights.data;
          var N = X.instance({
            width: k,
            isFloat: !0,
            array: new Float32Array(K),
            isPot: !0,
          });
          K = null;
          var z = X.instance({
            width: k,
            isFloat: !0,
            array: new Float32Array(E),
            isPot: !0,
          });
          E = null;
          return {
            dc: !0,
            kd: function () {
              return p;
            },
            v: function () {
              N.remove();
              z.remove();
              A.remove();
            },
            Aa: function () {
              ca.set("s23");
              A.g(1);
              z.g(2);
              Y.l(!1, !1);
            },
          };
        },
      },
      cd = {
        instance: function (a) {
          var c = a.kernelsCount,
            e = a.toSparsity,
            d = (e * a.toLayerSize) / a.fromLayerSize,
            k = X.instance(a.weights);
          return {
            dc: !0,
            kd: function () {
              return d;
            },
            wp: function () {
              return e;
            },
            Sl: function () {
              return k;
            },
            v: function () {
              k.remove();
            },
            Aa: function () {
              ca.set("s26");
              ca.G("u23", c);
              ca.G("u24", e);
              ca.G("u17", a.toLayerSize);
              ca.G("u25", a.fromLayerSize);
              k.g(1);
              Y.l(!1, !1);
            },
          };
        },
      },
      ad = {
        instance: function (a, c) {
          var e = a.fromLayerSize,
            d = a.toLayerSize,
            k = a.toSparsity,
            p = a.stride ? a.stride : 1,
            x = (k * d) / e,
            q = d < e,
            t = e / d,
            v = X.instance(a.weights),
            E =
              "s48" +
              [e.toString(), d.toString(), k.toString(), p.toString(), c].join(
                "_"
              );
          ca.ll(E) ||
            ((a = La(c)),
            (d = [
              { type: "1f", name: "u17", value: d },
              { type: "1f", name: "u30", value: p },
            ]),
            q && d.push({ type: "1f", name: "u25", value: e }),
            (e = [(q ? x : k).toFixed(1), a]),
            q && e.push(t.toFixed(1)),
            ca.Jh(q ? "s40" : "s39", E, e),
            ca.j(
              E,
              d.concat([
                { type: "1i", name: "u15", value: 0 },
                { type: "1i", name: "u22", value: 1 },
                { type: "1i", name: "u14", value: 3 },
              ])
            ));
          return {
            dc: !1,
            kd: function () {
              return x;
            },
            v: function () {
              v.remove();
            },
            Aa: function () {
              ca.set(E);
              v.g(3);
              Y.l(!1, !1);
            },
          };
        },
      },
      Xc = {
        instance: function (a) {
          var c = a.ni ? a.ni : 3,
            e = a.Nh ? a.Nh : 64,
            d = a.ui ? a.ui : 64,
            k = a.td ? !0 : !1;
          a = { isFloat: !1, width: e, isPot: !1, isFlipY: !1 };
          var p = X.instance(a),
            x = X.instance(a),
            q = X.instance(a),
            t = X.instance(a),
            v = X.instance({ isFloat: !0, width: d, isPot: !1, isFlipY: !1 }),
            E = 1 / e;
          return {
            process: function (K) {
              ca.set("s36");
              t.o();
              Y.l(k, !1);
              ca.set("s37");
              for (var l = 0; l < c; ++l)
                p.o(),
                  ca.M("u8", E, 0),
                  Y.l(k, !1),
                  q.o(),
                  t.g(0),
                  Y.l(k, !1),
                  x.o(),
                  p.g(0),
                  ca.M("u8", 0, E),
                  Y.l(k, !1),
                  t.o(),
                  q.g(0),
                  Y.l(k, !1),
                  l !== c - 1 && x.g(0);
              ca.set("s38");
              v.o();
              K.g(0);
              x.g(1);
              t.g(2);
              Y.l(k, !1);
              v.g(0);
            },
            Xe: function () {
              return v;
            },
          };
        },
      },
      Yc = {
        instance: function (a) {
          function c(v) {
            return X.instance({
              isFloat: v,
              width: e.wa,
              isPot: !1,
              isFlipY: !1,
            });
          }
          var e = Object.assign({ xj: 0.1, Mg: 9, wa: 128, td: !1 }, a),
            d = c(!1),
            k = [c(!1), c(!1), c(!1)],
            p = [c(!1), c(!1), c(!1)],
            x = c(!0),
            q = [d, p[0], p[1]];
          a =
            "uniform sampler2D u1;const float e=1.1111,g=2.2222;uniform vec2 u32;varying vec2 vv0;void main(){float b=0.,c=0.;for(float a=-e;a<=e;a+=1.){vec2 i=u32*a,j=vv0+i*g;float d=1.2*a/e,f=exp(-d*d);b+=f*texture2D(u1,j).r,c+=f;}b/=c,gl_FragColor=vec4(b,0.,0.,1.);}"
              .replace("1.1111", Math.round((e.Mg - 1) / 2).toFixed(2))
              .replace("2.2222", (1 / e.wa).toFixed(6));
          var t = { u1: 0 };
          ca.le([
            {
              id: "s50",
              name: "_",
              h: "uniform sampler2D u1;varying vec2 vv0;const vec3 f=vec3(.2126,.7152,.0722),g=vec3(1.,1.,1.);void main(){vec3 b=texture2D(u1,vv0).rgb;float a=dot(b,f);gl_FragColor=vec4(a,a,a,a);}",
              u: t,
              i: ["u1"],
              precision: "lowp",
            },
            {
              id: "s51",
              name: "_",
              h: a,
              u: t,
              i: ["u1", "u32"],
              precision: "lowp",
            },
            {
              id: "s52",
              name: "_",
              h: "uniform sampler2D u33,u34,u35,u36;const float f=1.1111;const vec3 g=vec3(1.,1.,1.);varying vec2 vv0;void main(){vec3 a=texture2D(u33,vv0).rgb;float c=texture2D(u34,vv0).r,d=texture2D(u35,vv0).r,h=texture2D(u36,vv0).r,i=a.r*a.r;vec3 b=vec3(c,d,h),j=max(g*f,abs(i-b*b)),k=sqrt(j);gl_FragColor=vec4(a.r,(a-b)/k);}".replace(
                "1.1111",
                e.xj.toFixed(4)
              ),
              u: { u33: 0, u34: 1, u35: 2, u36: 3 },
              i: ["u33", "u34", "u35", "u36"],
              precision: "highp",
            },
          ]);
          return {
            process: function () {
              ca.set("s50");
              d.S();
              Y.l(e.td, !1);
              ca.set("s51");
              for (var v = 0; 3 > v; ++v)
                ca.M("u32", 1, 0),
                  k[v].o(),
                  q[v].g(0),
                  Y.l(!1, !1),
                  ca.M("u32", 0, 1),
                  p[v].o(),
                  k[v].g(0),
                  Y.l(!1, !1);
              ca.set("s52");
              x.o();
              d.g(0);
              p[0].g(1);
              p[1].g(2);
              p[2].g(3);
              Y.l(!1, !1);
              x.g(0);
            },
            Xe: function () {
              return x;
            },
          };
        },
      },
      rb = (function () {
        function a(W) {
          switch (O) {
            case F.movePinch:
              var fa = -W.deltaY;
              0 === y && f("pinch", -1, 0.001 * fa, null);
          }
          W.deltaY;
          W.preventDefault();
        }
        function c(W) {
          if (-1 !== y)
            switch (O) {
              case F.swipe:
                if (1 !== y) break;
                t();
                E(W, G);
                var fa = G[0] - g[0];
                k(fa);
                W = fa / ((20 * B.offsetWidth) / 100);
                f("swipeMove", Math.min(Math.max(W, -1), 1), W, null);
                break;
              case F.movePinch:
                if (2 === y || 3 === y) {
                  E(W, G);
                  fa = G[0] - g[0];
                  var ta = G[1] - g[1];
                  2 === y
                    ? ((ha += Math.sqrt(fa * fa + ta * ta)),
                      10 > ha
                        ? ((g[0] = G[0]), (g[1] = G[1]))
                        : (Wa || ((Wa = !0), f("moveStart", null, null, null)),
                          (ia[0] = fa),
                          (ia[1] = ta),
                          (L[0] = fa - u[0]),
                          (L[1] = ta - u[1]),
                          f("move", ia, L, null),
                          (u[0] = ia[0]),
                          (u[1] = ia[1])))
                    : 3 === y &&
                      ((W = v(W) / sa), f("pinch", W, W - Ja, null), (Ja = W));
                }
            }
        }
        function e(W) {
          if (-1 !== y)
            switch (O) {
              case F.swipe:
                if (1 !== y) break;
                t();
                E(W, G);
                W = G[0] - g[0];
                var fa = 0 > W;
                (W = 20 < (100 * Math.abs(W)) / B.offsetWidth) && fa
                  ? f("swipeLeft", H, null, null)
                  : W && !fa && f("swipeRight", H, null, null);
                var ta = function () {
                  setTimeout(function () {
                    q();
                    y = 0;
                    f("swipeEnd", null, null, null);
                  }, 202);
                };
                W
                  ? ((W = function () {
                      var Ma = (fa ? -1 : 1) * B.width,
                        pa = ((fa ? 1 : -1) * Ma) / B.width;
                      H.style.transitionDuration = (400).toString() + "ms";
                      H.style.left = (A[0] + Ma).toString() + "px";
                      H.style.top = A[1].toString() + "px";
                      H.style.transform = "rotate( " + pa.toString() + "rad )";
                      ta();
                    }),
                    T ? W() : (N = W))
                  : ((H.style.transitionDuration = (200).toString() + "ms"),
                    (H.style.opacity = "0"),
                    (H.style.left = A[0].toString() + "px"),
                    (H.style.top = A[1].toString() + "px"),
                    (H.style.transform = ""),
                    ta());
                y = -1;
                break;
              case F.movePinch:
                if (2 === y || 3 === y)
                  y === y.move
                    ? f("moveEnd", null, null, null)
                    : 3 === y && f("pinchEnd", null, null, null),
                    (y = 0);
            }
        }
        function d(W) {
          W.preventDefault();
          if (-1 !== y)
            switch (O) {
              case F.swipe:
                if (0 !== y) break;
                t();
                y = 1;
                z = setTimeout(function () {
                  q();
                  z = null;
                  1 === y && ((y = 0), f("swipeEnd", null, null, null));
                }, 1e3);
                p();
                f("swipeStart", null, null, null);
                f("swipeGetCanvas", H, U, P);
                E(W, g);
                break;
              case F.movePinch:
                0 !== y
                  ? 2 !== y ||
                    Wa ||
                    (void 0 === W.changedTouches && void 0 === W.touches) ||
                    ((sa = v(W)),
                    20 < sa &&
                      ((y = 3), (Ja = 1), f("pinchStart", null, null, null)))
                  : 3 !== y &&
                    ((Wa = !1),
                    E(W, g),
                    (u[0] = 0),
                    (u[1] = 0),
                    (y = 2),
                    (ha = 0));
            }
        }
        function k(W) {
          var fa = 0 > W;
          H.style.left = A[0] + W + "px";
          H.style.transformOrigin = fa ? Q : C;
          H.style.transform =
            "rotate( " + (((fa ? 1 : -1) * W) / B.width).toString() + "rad )";
        }
        function p() {
          T = !1;
          var W = B.getBoundingClientRect();
          A[0] = W.left;
          A[1] = W.top;
          H.width = Math.round(B.width / 4);
          H.height = Math.round(B.height / 4);
          P.width = H.width;
          P.height = H.height;
          H.style.width = B.offsetWidth + "px";
          H.style.height = B.offsetHeight + "px";
          H.style.left = A[0] + "px";
          H.style.top = A[1] + "px";
          setTimeout(x, 0);
        }
        function x() {
          U.drawImage(B, 0, 0, H.width, H.height);
          Z.drawImage(H, 0, 0);
          T = !0;
          document.body.appendChild(H);
          N && (N(), (N = !1));
        }
        function q() {
          H.style.transitionDuration = "0ms";
          H.style.opacity = "1";
          H.style.transform = "";
          T && (document.body.removeChild(H), (T = !1));
        }
        function t() {
          z && (window.clearTimeout(z), (z = null));
        }
        function v(W) {
          K(W, na, 0);
          K(W, ka, 1);
          return Math.sqrt(na[0] * na[0] + ka[0] * ka[0]);
        }
        function E(W, fa) {
          void 0 !== W.changedTouches || void 0 !== W.touches
            ? K(W, fa, 0)
            : ((fa[0] = W.pageX), (fa[1] = W.pageY));
        }
        function K(W, fa, ta) {
          W.touches.length > ta
            ? ((fa[0] = W.touches[ta].pageX), (fa[1] = W.touches[ta].pageY))
            : ((fa[0] = W.changedTouches[ta].pageX),
              (fa[1] = W.changedTouches[ta].pageY));
        }
        function l() {
          m.forEach(function (W) {
            B.removeEventListener(W.type, W.ob, !1);
          });
          return m.splice(0, m.length);
        }
        function w(W) {
          W.forEach(function (fa) {
            r(fa.type, fa.ob);
          });
        }
        function r(W, fa) {
          B.removeEventListener(W, fa, !1);
          H.removeEventListener(W, fa, !1);
          B.addEventListener(W, fa, !1);
          H.addEventListener(W, fa, !1);
          0 ===
            m.filter(function (ta) {
              return ta.type === W && ta.ob === fa;
            }).length && m.push({ type: W, ob: fa });
        }
        function f(W, fa, ta, Ma) {
          n[W].forEach(function (pa) {
            pa.ob(fa, ta, Ma);
          });
        }
        function h(W) {
          return W[0] + "% " + (100 - W[1]).toString() + "%";
        }
        var J = !1,
          B = null,
          n = {
            swipeStart: [],
            swipeEnd: [],
            swipeLeft: [],
            swipeRight: [],
            swipeMove: [],
            swipeGetCanvas: [],
            pinch: [],
            pinchStart: [],
            pinchEnd: [],
            move: [],
            moveStart: [],
            moveEnd: [],
          },
          m = [],
          F = { idle: 0, swipe: 1, movePinch: 2 },
          O = F.idle,
          y = 0,
          g = [0, 0],
          G = [0, 0],
          u = [0, 0],
          L = [0, 0],
          H = document.createElement("canvas"),
          P = document.createElement("canvas"),
          U = H.getContext("2d"),
          Z = P.getContext("2d");
        H.style.position = "fixed";
        H.style.zIndex = "800";
        H.style.cursor = "move";
        H.style.pointerEvents = "none";
        H.className = "swipeImage";
        H.setAttribute("draggable", !1);
        var T = !1,
          A = [0, 0],
          N = null,
          z = null,
          C = h([50, 100]),
          Q = h([50, 0]),
          ea = null,
          ha = 0,
          ia = [0, 0],
          sa = 0,
          Wa = !1,
          Ja = 1,
          na = [0, 0],
          ka = [0, 0],
          Ga = {
            init: function (W) {
              if (J) Ga.switch_canvas(W.ta);
              else
                return (
                  (B = W.ta),
                  r("mousedown", d),
                  r("mouseup", e),
                  r("mouseout", e),
                  r("mousemove", c),
                  r("mousemove", c),
                  r("wheel", a),
                  r("touchstart", d),
                  r("touchend", e),
                  r("touchmove", c),
                  (J = !0),
                  Ga
                );
            },
            switch_canvas: function (W) {
              if (!J) Ga.init({ ta: W });
              else if (B !== W) {
                var fa = l();
                B = W;
                w(fa);
                for (var ta in n)
                  for (W = n[ta], fa = W.length - 1; 0 <= fa; --fa)
                    W[fa].en && W.splice(fa, 1);
              }
            },
            get_mode: function () {
              for (var W in F) if (F[W] === O) return W;
              return !1;
            },
            switch_mode: function (W) {
              J &&
                "undefined" !== typeof F[W] &&
                ((W = F[W]), O !== W && (t(), (O = W), (y = 0)));
            },
            add_listener: function (W, fa, ta) {
              n[W].push({ ob: fa, en: "undefined" === typeof ta ? !1 : ta });
              return Ga;
            },
            remove_listener: function (W) {
              n[W].splice(0, n[W].length);
              return Ga;
            },
            animate_swipe: function (W, fa) {
              ea && (clearInterval(ea), (ea = null));
              p();
              var ta = (B.width / (fa / 1e3)) * ("left" === W ? -1 : 1),
                Ma = 0,
                pa,
                kb = Date.now();
              ea = setInterval(function () {
                ea &&
                  ((pa = Date.now()),
                  (Ma += ((pa - kb) / 1e3) * ta),
                  k(Ma),
                  (kb = pa),
                  Math.abs(Ma) > 0.75 * B.width &&
                    ea &&
                    (clearInterval(ea), (ea = null), q()));
              }, 16);
            },
          };
        return Ga;
      })();
    window.CanvasListeners = rb;
    var tb = (function () {
        function a(w, r, f, h, J, B) {
          if (B === J.length) h();
          else {
            switch (J[B]) {
              case "D":
                w();
                break;
              case "S":
                r()
                  .then(function () {
                    l.nj();
                    a(w, r, f, h, J, ++B);
                  })
                  .catch(function (n) {
                    h();
                    throw n;
                  });
                return;
              case "R":
                f();
            }
            a(w, r, f, h, J, ++B);
          }
        }
        var c = {
            n: 5,
            Lf: 1,
            ci: 0,
            fd: [35, 49],
            bd: [2, 200],
            k: 0.7,
            ho: 200,
            Pm: 0.05,
          },
          e = -1,
          d = null,
          k = -1,
          p = -1,
          x = 0,
          q = -1,
          t = -1,
          v = 0,
          E = 0,
          K = c.bd[1],
          l = {
            U: function () {
              switch (e) {
                case -1:
                  return -1;
                case 0:
                  return t + d.ci;
                case 1:
                  return v;
              }
            },
            uh: function (w) {
              return Math.pow(
                Math.min(Math.max(q, 0), d.n - 1) / (d.n - 1),
                w || 1
              );
            },
            m: function (w) {
              d = Object.assign({}, c, w);
              q = t = d.Lf;
              e = 0;
              l.reset();
            },
            nj: function (w) {
              w = ("undefined" === typeof w ? Date.now() : w) || 0;
              var r = Math.min(Math.max(w - E, d.bd[0]), d.bd[1]);
              K = r;
              E = w;
              var f = -1 === k ? 0 : d.k;
              k = Math.min(Math.max(1e3 / r, 5), 120) * (1 - f) + k * f;
              w - p > d.ho &&
                5 < ++x &&
                ((r = d.k),
                (q =
                  q * (1 - r) +
                  (k < d.fd[0] ? t - 1 : k > d.fd[1] ? t + 1 : t) * r),
                Math.abs(q - t) > 1 - d.Pm &&
                  ((r = Math.min(Math.max(Math.round(q), 0), d.n - 1)),
                  r !== t && ((q = t = r), (k = (d.fd[1] - d.fd[0]) / 2))),
                (p = w));
            },
            Uf: function (w, r, f, h, J) {
              a(w, r, f, h, J, 0);
            },
            En: function (w) {
              v = w;
              e = 1;
            },
            fo: function () {
              e = 0;
              l.reset();
            },
            reset: function () {
              K = c.bd[1];
              p = k = -1;
              x = 0;
            },
            vl: function () {
              return K;
            },
          };
        return l;
      })(),
      wc = (function () {
        var a = {
            oi: 4,
            Cd: [1.5, 1.5, 2],
            Sa: [0.1, 0.1, 0.1],
            Mi: 1,
            wa: -1,
            hf: -1,
            Zn: 2,
            Mm: 1,
            Ni: !0,
            kl: 0.8,
          },
          c = null,
          e = [],
          d = 0,
          k = [0.5, 0.5, 1];
        return {
          m: function (p) {
            c = Object.assign({}, a, p);
            e.splice(0);
            p = c.Cd[0] * c.Sa[0];
            var x = c.Cd[1] * c.Sa[1],
              q = 1 / (1 + c.Cd[2] * c.Sa[2]),
              t = c.Mi * Math.min(c.wa, c.hf),
              v = t / c.wa;
            t /= c.hf;
            var E = 0.5 * c.kl;
            E *= E;
            for (var K = 0; K < c.oi; ++K) {
              var l = Math.pow(q, K),
                w = v * l,
                r = t * l;
              l = w * p;
              var f = r * x,
                h = w / 2;
              r /= 2;
              for (
                var J = 1 + (1 - h - h) / l, B = 1 + (1 - r - r) / f, n = 0;
                n < B;
                ++n
              )
                for (var m = r + n * f, F = m - 0.5, O = 0; O < J; ++O) {
                  var y = h + O * l,
                    g = y - 0.5;
                  g * g + F * F > E || e.push([y, m, w * c.Mm]);
                }
            }
            c.Ni &&
              e.sort(function (G, u) {
                var L = G[0] - 0.5;
                G = G[1] - 0.5;
                var H = u[0] - 0.5;
                u = u[1] - 0.5;
                return L * L + G * G - (H * H + u * u);
              });
          },
          get: function () {
            var p = e.length;
            if (0 === p) return k;
            d >= p && (d = 0);
            var x = e[Math.floor(d)];
            d = (d + 1 / c.Zn) % p;
            return x;
          },
        };
      })(),
      ub = (function () {
        function a() {
          e(f + w.Hf);
          h.port.postMessage("DONE");
        }
        function c() {
          var g = w.la;
          m.isEnabled && (g = Math.max(g, m.la));
          n.Rc =
            0 === g
              ? window.requestAnimationFrame(e)
              : window.requestAnimationFrame(d);
        }
        function e(g) {
          B.Rb &&
            null !== r &&
            ((g -= f),
            (g = Math.min(Math.max(g, w.hh[0]), w.hh[1])),
            (f += g),
            p(),
            m.isEnabled && m.Ma && B.Na && f - m.sf > w.Hg && (v(), (m.sf = f)),
            r(f));
        }
        function d(g) {
          B.Rb && (n.timeout = window.setTimeout(e.bind(null, g), w.la));
        }
        function k() {
          r = null;
          B.Rb = !1;
          p();
        }
        function p() {
          n.Rc && (window.cancelAnimationFrame(n.Rc), (n.Rc = null));
          n.timeout && (window.clearTimeout(n.timeout), (n.timeout = null));
        }
        function x(g) {
          g && !B.Na
            ? ((B.Na = !0),
              J && tb.fo(),
              h.port.postMessage("STOP"),
              Aa.oj(!0),
              c())
            : !g &&
              B.Na &&
              ((B.Na = !1),
              J && tb.En(1),
              Aa.oj(!1),
              h.port.postMessage("START"));
        }
        function q(g) {
          g.target.hidden ? O() : F();
        }
        function t(g, G, u) {
          G = g.createShader(G);
          g.shaderSource(G, u);
          g.compileShader(G);
          return G;
        }
        function v() {
          m.Ma = !1;
          var g = m.md,
            G = m.nd,
            u = m.od,
            L = m.La;
          g.uniform1f(m.Dh, Math.random());
          m.Sb ? G.beginQueryEXT(L, u) : g.beginQuery(L, u);
          g.drawElements(g.POINTS, 1, g.UNSIGNED_SHORT, 0);
          m.Sb ? G.endQueryEXT(L) : g.endQuery(L);
          g.flush();
          K()
            .then(function (H) {
              H = (w.Gj * w.Fg * 1e3) / H;
              m.Zd = (m.Zd + 1) % w.jc;
              m.tf[m.Zd] = H;
              if (++m.ai > w.jc) {
                m.ud.set(m.tf);
                m.ud.sort(function (U, Z) {
                  return U - Z;
                });
                H = m.ud[Math.floor(w.jc / 2)];
                m.ed = Math.max(m.ed, H);
                var P = 0;
                for (
                  P = 0;
                  P < m.ug &&
                  !(H > m.ed * (1 - (w.Gg[P] + w.Hj * (P >= m.Td ? 1 : -1))));
                  ++P
                )
                  P === m.ug - 1 && ++P;
                P !== m.Td &&
                  (console.log("THERMAL THROTTLING LEVEL = " + P.toString()),
                  (m.Td = P),
                  (m.la = 0 === P ? 0 : w.Fj[P - 1]),
                  w.Eg && w.Eg(P));
              }
              m.Ma = !0;
            })
            .catch(function () {
              m.Ma = !0;
            });
        }
        function E(g) {
          var G = m.md,
            u = m.nd,
            L = m.od;
          L = m.Sb
            ? u.jp(L, u.QUERY_RESULT_AVAILABLE_EXT)
            : G.getQueryParameter(L, G.QUERY_RESULT_AVAILABLE);
          G = G.getParameter(u.GPU_DISJOINT_EXT);
          L ? g(!G) : setTimeout(E.bind(null, g), 0.1);
        }
        function K() {
          return new Promise(function (g, G) {
            E(function (u) {
              if (u) {
                u = m.md;
                var L = m.nd,
                  H = m.od;
                u = m.Sb
                  ? L.getQueryObjectEXT(H, L.QUERY_RESULT_EXT)
                  : u.getQueryParameter(H, u.QUERY_RESULT);
                g(u);
              } else G();
            });
          });
        }
        var l = {
            Th: !0,
            hh: [1, 200],
            Hf: 20,
            la: 0,
            Ij: !1,
            Fg: 50,
            Gj: 240,
            Hg: 3e3,
            jc: 3,
            Gg: [0.2, 0.35, 0.5],
            Hj: 0.05,
            Fj: [8, 20, 40],
            Eg: null,
          },
          w = null,
          r = null,
          f = 0,
          h = null,
          J = !1,
          B = { Da: !1, Na: !0, rf: !1, qf: !1, pf: !1, Rb: !1 },
          n = { Rc: null, timeout: null },
          m = {
            isEnabled: !1,
            Ma: !1,
            md: null,
            nd: null,
            od: null,
            La: null,
            Dh: null,
            Sb: !0,
            Td: 0,
            ug: 0,
            la: 0,
            sf: 0,
            ai: 0,
            tf: null,
            ud: null,
            Zd: 0,
            ed: 0,
          },
          F = x.bind(null, !0),
          O = x.bind(null, !1),
          y = {
            m: function (g) {
              w = Object.assign(l, g);
              Object.assign(B, { Na: !0, Da: !0, Rb: !1 });
              if (w.Ij) {
                g = document.createElement("canvas");
                g.setAttribute("width", "1");
                g.setAttribute("height", "1");
                var G = { antialias: !1 };
                g = g.getContext("webgl2", G) || g.getContext("webgl", G);
                if (
                  (G =
                    g.getExtension("EXT_disjoint_timer_query") ||
                    g.getExtension("EXT_disjoint_timer_query_webgl2"))
                ) {
                  m.md = g;
                  m.nd = G;
                  m.isEnabled = !0;
                  m.Sb = G.beginQueryEXT ? !0 : !1;
                  var u = t(
                      g,
                      g.VERTEX_SHADER,
                      "attribute vec4 a0;void main(){gl_Position=a0;}"
                    ),
                    L = t(
                      g,
                      g.FRAGMENT_SHADER,
                      "precision lowp float;uniform float u37;void main(){vec4 a=u37*vec4(1.,2.,3.,4.);for(int b=0;b<666;b+=1)a=cos(a);gl_FragColor=a;}".replace(
                        "666",
                        w.Fg.toString()
                      )
                    ),
                    H = g.createProgram();
                  g.attachShader(H, u);
                  g.attachShader(H, L);
                  g.linkProgram(H);
                  u = g.getAttribLocation(H, "a0");
                  m.Dh = g.getUniformLocation(H, "u37");
                  g.useProgram(H);
                  g.enableVertexAttribArray(u);
                  H = g.createBuffer();
                  g.bindBuffer(g.ARRAY_BUFFER, H);
                  g.bufferData(
                    g.ARRAY_BUFFER,
                    new Float32Array([0.5, 0.5, 0, 1]),
                    g.STATIC_DRAW
                  );
                  g.vertexAttribPointer(u, 4, g.FLOAT, !1, 16, 0);
                  H = g.createBuffer();
                  g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, H);
                  g.bufferData(
                    g.ELEMENT_ARRAY_BUFFER,
                    new Uint16Array([0]),
                    g.STATIC_DRAW
                  );
                  g.disable(g.DEPTH_TEST);
                  g.disable(g.DITHER);
                  g.disable(g.STENCIL_TEST);
                  g.viewport(0, 0, 1, 1);
                  H = m.Sb ? G.createQueryEXT() : g.createQuery();
                  m.od = H;
                  m.La = G.TIME_ELAPSED_EXT || g.TIME_ELAPSED;
                  m.Td = 0;
                  m.ug = w.Gg.length;
                  m.la = 0;
                  m.sf = -w.Hg;
                  m.tf = new Float32Array(w.jc);
                  m.ud = new Float32Array(w.jc);
                  m.ed = 0;
                  m.Zd = 0;
                  m.ai = 0;
                  m.Ma = !0;
                }
              }
              if (w.Th) {
                g = !1;
                try {
                  if ("undefined" === typeof SharedWorker) {
                    var P = URL.createObjectURL(
                        new Blob(
                          [
                            "let handler = null;\n      self.addEventListener('message', function(e){\n        if (handler !== null){\n          clearTimeout(handler);\n          handler = null;\n        }\n        switch (e.data) {\n          case 'START':\n          case 'DONE':\n            handler = setTimeout(function(){\n              self.postMessage('TICK');\n            }, " +
                              w.Hf.toString() +
                              ");\n            break;\n          case 'STOP':\n            break;\n        };\n      }, false);",
                          ],
                          { type: "text/javascript" }
                        )
                      ),
                      U = new Worker(P);
                    U.addEventListener("message", a);
                    h = { Di: U, port: U };
                    B.rf = !0;
                  } else {
                    var Z = URL.createObjectURL(
                        new Blob(
                          [
                            "let handler = null;\n      onconnect = function(e) {\n        const port = e.ports[0];\n        port.addEventListener('message', function(e) {\n          \n          if (handler !== null){\n            clearTimeout(handler);\n            handler = null;\n          }\n          switch (e.data) {\n            case 'START':\n            case 'DONE':\n              handler = setTimeout(function(){\n                port.postMessage('TICK');\n              }, " +
                              w.Hf.toString() +
                              ");\n              break;\n            case 'STOP':\n              break;\n          };\n          \n        });\n        \n        port.start();\n      } // end onconnect()",
                          ],
                          { type: "text/javascript" }
                        )
                      ),
                      T = new SharedWorker(Z);
                    T.port.start();
                    T.port.addEventListener("message", a);
                    h = { Di: T, port: T.port };
                    B.qf = !0;
                  }
                  g = !0;
                } catch (A) {}
                g &&
                  ("onvisibilitychange" in document
                    ? document.addEventListener("visibilitychange", q)
                    : (window.addEventListener("blur", O),
                      window.addEventListener("focus", F)),
                  (B.pf = !0));
              }
              J = "undefined" !== typeof tb;
            },
            v: function () {
              k();
              B.pf &&
                ("onvisibilitychange" in document
                  ? document.removeEventListener("visibilitychange", q)
                  : (window.removeEventListener("blur", O),
                    window.removeEventListener("focus", F)),
                (B.pf = !1));
              B.qf
                ? (h.port.close(), (B.qf = !1))
                : B.rf && (h.Di.terminate(), (B.rf = !1));
              Object.assign(B, { Na: !0, Da: !1, Rb: !1 });
              r = null;
            },
            Ep: function () {
              return B.Na;
            },
            update: function (g) {
              Object.assign(w, g);
            },
            Uf: function (g) {
              B.Da || y.m({});
              p();
              B.Rb = !0;
              r = g;
              B.Na && c();
            },
            stop: k,
          };
        return y;
      })(),
      R = {
        VERSION: "3.2.1",
        Oc: [],
        Nc: [],
        ie: !1,
        he: !1,
        je: !1,
        ready: !1,
        isBusy: !1,
      },
      $a = {
        idealWidth: 800,
        idealHeight: 600,
        minWidth: 480,
        maxWidth: 1280,
        minHeight: 480,
        maxHeight: 1280,
        FOVdesktop: 60,
        rotate: 0,
        Ej: 23,
        fe: 10,
        ee: 8e3,
      },
      yc = {
        Jf: "models3D",
        Ff: "materials",
        co: "tweakers",
        neuralNetworkPath: "built/jeefitNNC.json",
        aa: "",
        xa: "",
        ge: "",
        la: 0,
        Rj: 20,
        width: 1024,
        height: 1024,
        Om: [2, 3.5],
        Ki: 300,
        Lc: [2, 6],
        scanOverlapFactors: [2, 2, 3],
        scanNScaleLevels: 2,
        scanScale0Factor: 0.7,
        Sa: [0.1, 0.1, 0.3],
        ao: 30,
        Qk: 1.92,
        Xm: [0.3, 0.7],
        Wm: 1,
        bo: [0.03, 0.08],
        mn: [0.01, 0.02],
        ng: [0, 0.6],
        Ba: [0.7, 1.13, 0.262],
        mj: [-0.1, 0, 0],
        Ga: [0, -62, 8],
        vb: 1.03,
        Fa: [0, -60, 0],
        Kf: 60,
        Pk: 0.3,
        Re: 73,
        oe: [0.02, 0.9],
        me: [4, 1],
        se: [0.5, 0.7],
        on: 0.25,
        ln: 1,
        so: 20,
        gp: !1,
        sc: 145,
        gf: -18,
        ef: 20,
        ff: 3,
        oa: [-110, 0],
        bc: 1,
        dj: 0.4,
        ej: 3,
        Nd: [0, 0, 0],
        cc: [1.1, 1],
        Wc: 0,
        He: 0.95,
        Ge: 90,
        Fe: 50,
        za: 30,
        ra: 0.05,
        cf: !0,
        xd: !0,
        Cf: "images/masks/target.jpg",
        Df: !1,
        wd: [1 / 255, 175 / 255, 236 / 255, 0],
        yd: -0.001,
        Bf: 3.14,
        ue: 0,
        te: "images/masks/burka.png",
        pe: Math.PI - Math.PI / 4,
        De: Math.PI / 4,
        Tf: [0.3, 0.2, 0.1],
        Ub: 1,
        fi: 700,
        ei: 90,
        wm: 0.2,
        di: 0.04,
        to: "images/backgrounds/viewer3D.png",
        Dg: [0, 0, 0],
        Cg: [0, 15, 60],
        ce: 0.3,
        Bo: 50,
        xo: Gc ? Pa : !1,
        yo: Gc ? Pa : !1,
        Ao: 1e3,
        Do: 1e3,
        zo: 40,
        wo: [0, 0, -400],
        ii: 0.1,
        Bm: 0.5,
        ji: [0.5, 1.5],
        zd: 30,
        Am: !0,
      },
      I = Object.assign({}, yc);
    S.model = !1;
    S.Wb = 1;
    S.Ed = 1;
    S.Zg = !0;
    S.$g = !0;
    S.Yg = !1;
    S.Oa = !0;
    var bb = {
      Wf: 3.5,
      Xb: "images/debug/picsou.png",
      Gd: 45,
      yf: 0.785,
      zf: 0.3925,
      Af: 5,
      wf: 2,
      xf: 0,
      vf: 0,
      uo: "images/backgrounds/bg1.jpg",
      vo: "images/backgrounds/bg1_light.jpg",
      Aj: 1,
      Bj: 2,
    };
    I.Ba = [0.7, 1.13, 0.262];
    I.ip = [4, 50];
    I.oa = [-110, 0];
    I.dj = 0.25;
    I.ej = 3;
    I.Nd = [0, -2, 20];
    I.cc = [0.95, 1];
    S.Wb = 2.1289;
    S.Ed = 1;
    bb.Wf = 2.5858;
    bb.yf = 0.4388;
    bb.zf = 0.118;
    bb.Xb = "images/debug/hdri2.png";
    bb.Gd = 180;
    bb.Vf = 0.8065;
    bb.Af = 5.3887;
    bb.wf = 0.5351;
    bb.xf = -0.3019;
    bb.vf = 0;
    bb.Aj = 3.5288;
    bb.Bj = 6.2168;
    I.Ba[0] *= 0.8;
    I.Ba[1] *= 0.7;
    var xc = {
        element: null,
        Vg: null,
        ja: null,
        tg: null,
        deviceId: -1,
        Mb: -1,
        Bi: null,
        be: -1,
      },
      Fa = Object.assign({}, xc),
      cb = null,
      Lb = -1,
      Mb = -1,
      Ic = I.Om,
      sc = window.devicePixelRatio ? window.devicePixelRatio : 1;
    var Vb = { ml: Math.max(Ic[0], sc) / sc, dd: Math.min(sc, Ic[1]) };
    var db = null;
    R.onLoad = function (a) {
      R.ready ? a() : R.Oc.push(a);
    };
    R.onHalfLoad = function (a) {
      R.load_model ? a() : R.Nc.push(a);
    };
    R.onWebcamAsk = function (a) {
      R.ie = a;
    };
    R.onContextLost = function (a) {
      R.he = a;
    };
    R.onWebcamGet = function (a) {
      R.je = a;
    };
    R.get_onHalfLoadCallstack = function () {
      return R.Nc;
    };
    R.set_size = function (a, c, e) {
      e = e ? Vb.dd : 1;
      I.width = a * e;
      I.height = c * e;
    };
    R.get_videoDevices = function (a) {
      fc(a);
    };
    R.set_videoDevice = function (a) {
      Fa.deviceId = a;
    };
    R.set_videoSizes = function (a, c, e, d, k, p) {
      $a.idealWidth = a;
      $a.idealHeight = c;
      $a.minWidth = e;
      $a.maxWidth = d;
      $a.minHeight = k;
      $a.maxHeight = p;
    };
    R.set_loading = function (a, c, e) {
      a && ((I.Df = !0), (I.Cf = a));
      "number" === typeof c && ((a = new Nb(c)), (I.wd = [a.r, a.Y, a.b, 0]));
      "number" === typeof e && (I.yd = e);
    };
    R.set_settings = function (a, c, e) {
      a && Object.assign(I, a);
      c && Object.assign($a, c);
      e && Object.assign(bb, e);
    };
    R.get_size = function () {
      return { width: I.width, height: I.height };
    };
    R.get_cv = function () {
      return fb.pb();
    };
    R.set_NNCPath = function (a) {
      I.ge = a;
    };
    R.set_materialsPath = function (a) {
      I.Ff = a;
    };
    R.set_modelsPath = function (a) {
      I.Jf = a;
    };
    R.destroy = function () {
      return db ? db.v() : Promise.resolve();
    };
    R.init = function (a, c, e, d) {
      db = Mc();
      R.lb = e
        ? function (k, p) {
            e(k, p);
            R.lb = !1;
          }
        : function () {};
      R.Jo = db;
      a && (I.aa = a);
      c && R.Oc.push(c);
      db.$n();
      if (
        !fb.m({
          Xg: "jeefitCanvas",
          ta: d,
          width: Lb,
          height: Mb,
          debug: !1,
          ti: function () {
            R.he && R.he();
          },
          premultipliedAlpha: !0,
        })
      )
        return R.lb && R.lb("GL_INCOMPATIBLE", "Cannot init Context"), !1;
      R.ie && R.ie();
      a = {
        width: { min: $a.minWidth, max: $a.maxWidth, ideal: $a.idealWidth },
        height: { min: $a.minHeight, max: $a.maxHeight, ideal: $a.idealHeight },
        facingMode: { ideal: "user" },
      };
      c = { video: a, audio: !1 };
      Fa.Vg = c;
      a && -1 !== Fa.deviceId && Ib(c, Fa.deviceId);
      Ub(
        navigator.mediaDevices && navigator.mediaDevices.getUserMedia
          ? document.createElement("video")
          : !1,
        function (k) {
          R.je && R.je(k);
          Fa.element = k;
          k = Fa.element.videoWidth;
          var p = Fa.element.videoHeight;
          Fa.tg = { ha: Fa.element, isPot: !1, isFloat: !1, isFlipY: !0 };
          Fa.ja = X.instance(Fa.tg);
          db.fg(k, p);
          db.lf(k, p) && db.mg();
        },
        function (k) {
          R.lb && R.lb("WEBCAM_UNAVAILABLE", k);
        },
        c
      );
      return !0;
    };
    window.JEELIZVTO = R;
    var Ac = (function () {
        function a() {
          za.$();
          b.viewport(0, 0, 1, 1);
          ca.set("s64");
          d.g(0);
          Y.l(!1);
          b.readPixels(0, 0, 1, 1, b.RGBA, b.UNSIGNED_BYTE, p);
          c(0 < p[0]);
        }
        var c = null,
          e = !1,
          d = null,
          k = !1,
          p = null,
          x = {
            m: function (q) {
              if (k) return !1;
              d = q;
              ca.le([
                {
                  id: "s64",
                  name: "_",
                  h: "uniform sampler2D u39;const vec2 e=vec2(.16,.5);void main(){vec4 a=texture2D(u39,e);float b=step(1.99,a.r);gl_FragColor=vec4(b,0.,0.,1.);}",
                  i: ["u39"],
                  precision: "lowp",
                },
              ]);
              ca.j("s64", [{ type: "1i", name: "u39", value: 0 }]);
              p = new Uint8Array(4);
              return (k = !0);
            },
            start: function (q, t) {
              x.stop();
              c = t;
              e = window.setInterval(a, q);
            },
            stop: function () {
              e && (window.clearInterval(a), (e = !1));
            },
          };
        return x;
      })(),
      ic = ic || {};
    Nb.prototype = {
      constructor: Nb,
      r: 1,
      Y: 1,
      b: 1,
      set: function (a) {
        a instanceof Nb
          ? this.J(a)
          : "number" === typeof a
          ? Bc(this, a)
          : "string" === typeof a && Pc(this, a);
        return this;
      },
      rn: (function () {
        function a(c, e, d) {
          0 > d && (d += 1);
          1 < d && --d;
          return d < 1 / 6
            ? c + 6 * (e - c) * d
            : 0.5 > d
            ? e
            : d < 2 / 3
            ? c + 6 * (e - c) * (2 / 3 - d)
            : c;
        }
        return function (c, e, d) {
          c = ic.Math.hp(c, 1);
          e = ic.Math.ye(e, 0, 1);
          d = ic.Math.ye(d, 0, 1);
          0 === e
            ? (this.r = this.Y = this.b = d)
            : ((e = 0.5 >= d ? d * (1 + e) : d + e - d * e),
              (d = 2 * d - e),
              (this.r = a(d, e, c + 1 / 3)),
              (this.Y = a(d, e, c)),
              (this.b = a(d, e, c - 1 / 3)));
          return this;
        };
      })(),
      clone: function () {
        return new this.constructor(this.r, this.Y, this.b);
      },
      J: function (a) {
        this.r = a.r;
        this.Y = a.Y;
        this.b = a.b;
        return this;
      },
      add: function (a) {
        this.r += a.r;
        this.Y += a.Y;
        this.b += a.b;
        return this;
      },
      multiply: function (a) {
        this.r *= a.r;
        this.Y *= a.Y;
        this.b *= a.b;
        return this;
      },
      Ea: function (a) {
        this.r *= a;
        this.Y *= a;
        this.b *= a;
        return this;
      },
      mb: function (a, c) {
        void 0 === c && (c = 0);
        this.r = a[c];
        this.Y = a[c + 1];
        this.b = a[c + 2];
        return this;
      },
    };
    var Qc = {};
    gc.prototype = {
      constructor: gc,
      get x() {
        return this.B;
      },
      set x(a) {
        this.B = a;
      },
      get y() {
        return this.C;
      },
      set y(a) {
        this.C = a;
      },
      get z() {
        return this.D;
      },
      set z(a) {
        this.D = a;
      },
      get w() {
        return this.N;
      },
      set w(a) {
        this.N = a;
      },
      set: function (a, c, e, d) {
        this.B = a;
        this.C = c;
        this.D = e;
        this.N = d;
        return this;
      },
      clone: function () {
        return new this.constructor(this.B, this.C, this.D, this.N);
      },
      J: function (a) {
        this.B = a.x;
        this.C = a.y;
        this.D = a.z;
        this.N = a.w;
        return this;
      },
      inverse: function () {
        this.B *= -1;
        this.C *= -1;
        this.D *= -1;
        this.normalize();
        return this;
      },
      Yc: function (a) {
        return this.B * a.B + this.C * a.C + this.D * a.D + this.N * a.N;
      },
      uf: function () {
        return (
          this.B * this.B + this.C * this.C + this.D * this.D + this.N * this.N
        );
      },
      length: function () {
        return Math.sqrt(
          this.B * this.B + this.C * this.C + this.D * this.D + this.N * this.N
        );
      },
      normalize: function () {
        var a = this.length();
        0 === a
          ? ((this.D = this.C = this.B = 0), (this.N = 1))
          : ((a = 1 / a),
            (this.B *= a),
            (this.C *= a),
            (this.D *= a),
            (this.N *= a));
        return this;
      },
      multiply: function (a, c) {
        return void 0 !== c
          ? (console.warn(
              "JETHREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead."
            ),
            Cc(this, a, c))
          : Cc(this, this, a);
      },
      mb: function (a, c) {
        void 0 === c && (c = 0);
        this.B = a[c];
        this.C = a[c + 1];
        this.D = a[c + 2];
        this.N = a[c + 3];
        return this;
      },
    };
    Ob.prototype = {
      constructor: Ob,
      get width() {
        return this.x;
      },
      set width(a) {
        this.x = a;
      },
      get height() {
        return this.y;
      },
      set height(a) {
        this.y = a;
      },
      set: function (a, c) {
        this.x = a;
        this.y = c;
        return this;
      },
      Qi: function (a) {
        this.x = a;
        return this;
      },
      Ri: function (a) {
        this.y = a;
        return this;
      },
      clone: function () {
        return new this.constructor(this.x, this.y);
      },
      J: function (a) {
        this.x = a.x;
        this.y = a.y;
        return this;
      },
      add: function (a, c) {
        if (void 0 !== c)
          return (
            console.warn(
              "JETHREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead."
            ),
            this.Pc(a, c)
          );
        this.x += a.x;
        this.y += a.y;
        return this;
      },
      Pc: function (a, c) {
        this.x = a.x + c.x;
        this.y = a.y + c.y;
        return this;
      },
      sub: function (a, c) {
        if (void 0 !== c)
          return (
            console.warn(
              "JETHREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."
            ),
            this.cb(a, c)
          );
        this.x -= a.x;
        this.y -= a.y;
        return this;
      },
      cb: function (a, c) {
        this.x = a.x - c.x;
        this.y = a.y - c.y;
        return this;
      },
      multiply: function (a) {
        this.x *= a.x;
        this.y *= a.y;
        return this;
      },
      Ea: function (a) {
        isFinite(a) ? ((this.x *= a), (this.y *= a)) : (this.y = this.x = 0);
        return this;
      },
      Le: function (a) {
        return this.Ea(1 / a);
      },
      min: function (a) {
        this.x = Math.min(this.x, a.x);
        this.y = Math.min(this.y, a.y);
        return this;
      },
      max: function (a) {
        this.x = Math.max(this.x, a.x);
        this.y = Math.max(this.y, a.y);
        return this;
      },
      ye: function (a, c) {
        this.x = Math.max(a.x, Math.min(c.x, this.x));
        this.y = Math.max(a.y, Math.min(c.y, this.y));
        return this;
      },
      floor: function () {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
      },
      ceil: function () {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
      },
      round: function () {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
      },
      Yc: function (a) {
        return this.x * a.x + this.y * a.y;
      },
      uf: function () {
        return this.x * this.x + this.y * this.y;
      },
      length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
      },
      normalize: function () {
        return this.Le(this.length());
      },
      mb: function (a, c) {
        void 0 === c && (c = 0);
        this.x = a[c];
        this.y = a[c + 1];
        return this;
      },
    };
    Ra.prototype = {
      constructor: Ra,
      set: function (a, c, e) {
        this.x = a;
        this.y = c;
        this.z = e;
        return this;
      },
      Qi: function (a) {
        this.x = a;
        return this;
      },
      Ri: function (a) {
        this.y = a;
        return this;
      },
      clone: function () {
        return new this.constructor(this.x, this.y, this.z);
      },
      J: function (a) {
        this.x = a.x;
        this.y = a.y;
        this.z = a.z;
        return this;
      },
      add: function (a, c) {
        if (void 0 !== c)
          return (
            console.warn(
              "JETHREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead."
            ),
            this.Pc(a, c)
          );
        this.x += a.x;
        this.y += a.y;
        this.z += a.z;
        return this;
      },
      Pc: function (a, c) {
        this.x = a.x + c.x;
        this.y = a.y + c.y;
        this.z = a.z + c.z;
        return this;
      },
      sub: function (a, c) {
        if (void 0 !== c)
          return (
            console.warn(
              "JETHREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."
            ),
            this.cb(a, c)
          );
        this.x -= a.x;
        this.y -= a.y;
        this.z -= a.z;
        return this;
      },
      cb: function (a, c) {
        this.x = a.x - c.x;
        this.y = a.y - c.y;
        this.z = a.z - c.z;
        return this;
      },
      multiply: function (a, c) {
        if (void 0 !== c)
          return (
            console.warn(
              "JETHREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead."
            ),
            (this.x = a.x * c.x),
            (this.y = a.y * c.y),
            (this.z = a.z * c.z),
            this
          );
        this.x *= a.x;
        this.y *= a.y;
        this.z *= a.z;
        return this;
      },
      Ea: function (a) {
        isFinite(a)
          ? ((this.x *= a), (this.y *= a), (this.z *= a))
          : (this.z = this.y = this.x = 0);
        return this;
      },
      Le: function (a) {
        return this.Ea(1 / a);
      },
      min: function (a) {
        this.x = Math.min(this.x, a.x);
        this.y = Math.min(this.y, a.y);
        this.z = Math.min(this.z, a.z);
        return this;
      },
      max: function (a) {
        this.x = Math.max(this.x, a.x);
        this.y = Math.max(this.y, a.y);
        this.z = Math.max(this.z, a.z);
        return this;
      },
      ye: function (a, c) {
        this.x = Math.max(a.x, Math.min(c.x, this.x));
        this.y = Math.max(a.y, Math.min(c.y, this.y));
        this.z = Math.max(a.z, Math.min(c.z, this.z));
        return this;
      },
      floor: function () {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
        return this;
      },
      ceil: function () {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        this.z = Math.ceil(this.z);
        return this;
      },
      round: function () {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
        return this;
      },
      Yc: function (a) {
        return this.x * a.x + this.y * a.y + this.z * a.z;
      },
      uf: function () {
        return this.x * this.x + this.y * this.y + this.z * this.z;
      },
      length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
      },
      normalize: function () {
        return this.Le(this.length());
      },
      mb: function (a, c) {
        void 0 === c && (c = 0);
        this.x = a[c];
        this.y = a[c + 1];
        this.z = a[c + 2];
        return this;
      },
    };
    Pb.Dj = "XYZ";
    Pb.prototype = {
      constructor: Pb,
      get x() {
        return this.B;
      },
      set x(a) {
        this.B = a;
      },
      get y() {
        return this.C;
      },
      set y(a) {
        this.C = a;
      },
      get z() {
        return this.D;
      },
      set z(a) {
        this.D = a;
      },
      get order() {
        return this.Ta;
      },
      set order(a) {
        this.Ta = a;
      },
      set: function (a, c, e, d) {
        this.B = a;
        this.C = c;
        this.D = e;
        this.Ta = d || this.Ta;
        return this;
      },
      clone: function () {
        return new this.constructor(this.B, this.C, this.D, this.Ta);
      },
      J: function (a) {
        this.B = a.B;
        this.C = a.C;
        this.D = a.D;
        this.Ta = a.Ta;
        return this;
      },
      mb: function (a) {
        this.B = a[0];
        this.C = a[1];
        this.D = a[2];
        void 0 !== a[3] && (this.Ta = a[3]);
        return this;
      },
    };
    pc.prototype = {
      constructor: pc,
      set: function (a, c) {
        this.min.J(a);
        this.max.J(c);
        return this;
      },
      clone: function () {
        return new this.constructor().J(this);
      },
      J: function (a) {
        this.min.J(a.min);
        this.max.J(a.max);
        return this;
      },
      empty: function () {
        return (
          this.max.x < this.min.x ||
          this.max.y < this.min.y ||
          this.max.z < this.min.z
        );
      },
      size: function (a) {
        return (a || new Ra()).cb(this.max, this.min);
      },
      getParameter: function (a, c) {
        return (c || new Ra()).set(
          (a.x - this.min.x) / (this.max.x - this.min.x),
          (a.y - this.min.y) / (this.max.y - this.min.y),
          (a.z - this.min.z) / (this.max.z - this.min.z)
        );
      },
      translate: function (a) {
        this.min.add(a);
        this.max.add(a);
        return this;
      },
    };
    Qb.prototype = {
      constructor: Qb,
      set: function (a, c, e, d, k, p, x, q, t, v, E, K, l, w, r, f) {
        var h = this.elements;
        h[0] = a;
        h[4] = c;
        h[8] = e;
        h[12] = d;
        h[1] = k;
        h[5] = p;
        h[9] = x;
        h[13] = q;
        h[2] = t;
        h[6] = v;
        h[10] = E;
        h[14] = K;
        h[3] = l;
        h[7] = w;
        h[11] = r;
        h[15] = f;
        return this;
      },
      clone: function () {
        return new Qb().mb(this.elements);
      },
      J: function (a) {
        this.elements.set(a.elements);
        return this;
      },
      multiply: function (a, c) {
        return void 0 !== c
          ? (console.warn(
              "JETHREE.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead."
            ),
            Ec(this, a, c))
          : Ec(this, this, a);
      },
      Ea: function (a) {
        var c = this.elements;
        c[0] *= a;
        c[4] *= a;
        c[8] *= a;
        c[12] *= a;
        c[1] *= a;
        c[5] *= a;
        c[9] *= a;
        c[13] *= a;
        c[2] *= a;
        c[6] *= a;
        c[10] *= a;
        c[14] *= a;
        c[3] *= a;
        c[7] *= a;
        c[11] *= a;
        c[15] *= a;
        return this;
      },
      setPosition: function (a) {
        var c = this.elements;
        c[12] = a.x;
        c[13] = a.y;
        c[14] = a.z;
        return this;
      },
      translate: function () {
        console.error("JETHREE.Matrix4: .translate() has been removed.");
      },
      scale: function (a) {
        var c = this.elements,
          e = a.x,
          d = a.y;
        a = a.z;
        c[0] *= e;
        c[4] *= d;
        c[8] *= a;
        c[1] *= e;
        c[5] *= d;
        c[9] *= a;
        c[2] *= e;
        c[6] *= d;
        c[10] *= a;
        c[3] *= e;
        c[7] *= d;
        c[11] *= a;
        return this;
      },
      mb: function (a) {
        this.elements.set(a);
        return this;
      },
    };
    qc.prototype = {
      constructor: qc,
      clone: function () {
        return new this.constructor().J(this);
      },
      J: function (a) {
        this.a = a.a;
        this.b = a.b;
        this.c = a.c;
        this.Pa.J(a.Pa);
        this.color.J(a.color);
        this.Vb = a.Vb;
        for (var c = 0, e = a.ae.length; c < e; c++)
          this.ae[c] = a.ae[c].clone();
        c = 0;
        for (e = a.Ag.length; c < e; c++) this.Ag[c] = a.Ag[c].clone();
        return this;
      },
    };
    var D = (function () {
        function a(n, m, F) {
          m = n.createShader(m);
          n.shaderSource(m, F);
          n.compileShader(m);
          return n.getShaderParameter(m, n.COMPILE_STATUS) ? m : !1;
        }
        function c(n, m) {
          ba.ia() && (m.h = m.h.replace(/gl_FragData\[([0-3])\]/g, "gbuf$1"));
          m.bf = a(n, n.VERTEX_SHADER, m.s, m.name + " VERTEX");
          m.af = a(n, n.FRAGMENT_SHADER, m.h, m.name + " FRAGMENT");
          var F = n.createProgram();
          n.attachShader(F, m.bf);
          n.attachShader(F, m.af);
          n.linkProgram(F);
          return F;
        }
        function e(n) {
          n.s = "#version 300 es\n" + n.s.replace(/varying/g, "out");
          n.h = "#version 300 es\n" + n.h.replace(/varying/g, "in");
          n.s = n.s.replace(/texture2D\(/g, "texture(");
          n.h = n.h.replace(/texture2D\(/g, "texture(");
          n.ea ||
            ((n.h = n.h.replace(
              /void main/g,
              "out vec4 FragColor;\nvoid main"
            )),
            (n.h = n.h.replace(/gl_FragColor/g, "FragColor")));
          var m = 0,
            F = [];
          n.s = n.s.replace(
            /attribute ([a-z]+[0-4]*) ([_a-zA-Z,0-9\s]+);/g,
            function (O, y, g) {
              var G = "";
              g.split(",").forEach(function (u) {
                u = u.trim();
                G += "layout(location = " + m + ") in " + y + " " + u + ";\n";
                F.push(u);
                ++m;
              });
              return G;
            }
          );
          n.Mj = F;
        }
        function d(n, m) {
          if (m.Mh) return !1;
          var F = ba.ia();
          S.yp || F || n.enableVertexAttribArray(0);
          void 0 === m.ea && (m.ea = !1);
          m.ea &&
            ((m.Se = B.pl()),
            (m.Mc = F ? 3 : 2),
            (m.Hp = F ? "none" : "highp"));
          m.id = J++;
          void 0 === m.Mc && (m.Mc = 2);
          void 0 === m.Se && (m.Se = "");
          void 0 === m.yj && (m.yj = "");
          void 0 === m.precision && (m.precision = "highp");
          "none" !== m.precision &&
            (m.h = "precision " + m.precision + " float;\n" + m.h);
          m.h = m.Se + m.h;
          void 0 === m.s &&
            (m.s =
              "precision lowp float;attribute vec2 a0;varying vec2 vv0;void main(){gl_Position=vec4(a0,0.,1.),vv0=a0*.5+vec2(.5,.5);}");
          m.s = m.yj + m.s;
          F && 3 <= m.Mc && e(m);
          m.Ha &&
            m.Ha.forEach(function (O) {
              m.s = m.s.replace(O.search, O.replace);
              m.h = m.h.replace(O.search, O.replace);
            });
          m.pa = c(n, m);
          m.A = {};
          m.i.forEach(function (O) {
            m.A[O] = n.getUniformLocation(m.pa, O);
          });
          m.attributes = {};
          m.ya = [];
          m.zg = 0;
          void 0 === m.H && (m.H = ["a0"]);
          void 0 === m.O && (m.O = [2]);
          m.H.forEach(function (O, y) {
            var g =
              F && 3 <= m.Mc ? m.Mj.indexOf(O) : n.getAttribLocation(m.pa, O);
            m.attributes[O] = g;
            m.ya.push(g);
            m.zg += 4 * m.O[y];
          });
          m.set = function () {
            f !== m.id &&
              (-1 !== f && h.I(),
              (f = m.id),
              (h = m),
              n.useProgram(m.pa),
              m.ya.forEach(function (O) {
                0 !== O && n.enableVertexAttribArray(O);
              }));
          };
          m.I = function () {
            f = -1;
            m.ya.forEach(function (O) {
              0 !== O && n.disableVertexAttribArray(O);
            });
          };
          m.Mh = !0;
        }
        function k(n, m) {
          d(n, m);
          m.set();
          f = -1;
          return m;
        }
        function p() {
          return {
            name: "_",
            h: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
            i: ["u1"],
            precision: "highp",
          };
        }
        function x() {
          B.j("s93", [{ type: "1i", name: "u1", value: 0 }]);
          B.j("s94", [{ type: "1i", name: "u143", value: 0 }]);
          B.j("s95", [{ type: "1i", name: "u65", value: 0 }]);
        }
        function q() {
          var n = "u39 u133 u134 u135 u136 u40 u69".split(" ").concat(l, w);
          r.s96 = {
            name: "_",
            h: "varying vec3 vv0;varying float vv1;void main(){gl_FragColor=vec4(vv0,vv1);}",
            s: "attribute vec3 a0;uniform sampler2D u39;uniform vec3 u133;uniform vec2 u40,u141;uniform float u134,u139,u140,u135,u136,u142;varying vec3 vv0;varying float vv1;const vec2 e=vec2(1.,1.);const vec3 o=vec3(1.,1.,1.);const vec2 D=vec2(-1.,1.),p=vec2(.16,.5),q=vec2(.5,.5),r=vec2(.84,.5);uniform mat4 u67;uniform vec3 u69,u73,u74,u75;uniform float u68,u76,u77,u70,u71,u72,u78;mat3 s(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u39,p);vec2 f=u76*e;vec3 c=u76*o;vec2 t=mix(d.a*u40,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u39,q).rgb+vec3(u70,0.,0.),u73,c);float u=mix(texture2D(u39,r).r,0.,u76);a.z+=u;mat3 v=s(a);vec3 w=mix(u133,u74,c);float x=mix(u134,u77,u76);vec3 b=mix(u69,u75,c);b.x+=u68*sin(a.y);float h=cos(a.z),i=sin(a.z);mat2 y=mat2(h,i,-i,h);b.xy=y*b.xy;float z=mix(u72,1.,u76);vec2 j=u71/t;vec3 k=a0;float A=max(0.,-a0.z-u135)*u136;k.x+=A*sign(a0.x)*(1.-u76);vec3 l=v*(k+w)*x+b;vec2 B=j*z;vec3 C=vec3(g*B,-j)+l*vec3(1.,-1.,-1.);gl_Position=u67*(vec4(u78*e,e)*vec4(C,1.)),vv0=l,vv1=smoothstep(u139,u140,a0.z);}",
            i: ["u139", "u140"].concat(n),
            H: ["a0"],
            precision: "highp",
          };
          r.s97 = {
            name: "_",
            h: "uniform sampler2D u1;uniform vec3 u137;uniform float u64;varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0);vec3 b=mix(u137,a.rgb,a.a);vec4 c=vec4(mix(a.rgb*u137,b,u64),a.a);gl_FragColor=c;}",
            s: "attribute vec3 a0;attribute vec2 a1;uniform sampler2D u39;uniform vec3 u133;uniform vec2 u40,u141;uniform float u134,u135,u136,u142;varying vec2 vv0;const vec2 e=vec2(1.,1.);const vec3 m=vec3(1.,1.,1.);const vec2 C=vec2(-1.,1.),n=vec2(.16,.5),o=vec2(.5,.5),p=vec2(.84,.5);uniform mat4 u67;uniform vec3 u69,u73,u74,u75;uniform float u68,u76,u77,u70,u71,u72,u78;mat3 q(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u39,n);vec2 f=u76*e;vec3 c=u76*m;vec2 r=mix(d.a*u40,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u39,o).rgb+vec3(u70,0.,0.),u73,c);float s=mix(texture2D(u39,p).r,0.,u76);a.z+=s;mat3 t=q(a);vec3 u=mix(u133,u74,c);float v=mix(u134,u77,u76);vec3 b=mix(u69,u75,c);b.x+=u68*sin(a.y);float h=cos(a.z),i=sin(a.z);mat2 w=mat2(h,i,-i,h);b.xy=w*b.xy;float x=mix(u72,1.,u76);vec2 j=u71/r;vec3 k=a0;float y=max(0.,-a0.z-u135)*u136;k.x+=y*sign(a0.x)*(1.-u76);vec3 z=t*(k+u)*v+b;vec2 A=j*x;vec3 B=vec3(g*A,-j)+z*vec3(1.,-1.,-1.);gl_Position=u67*(vec4(u78*e,e)*vec4(B,1.)),vv0=a1;}",
            i: ["u137"].concat(E, n),
            H: ["a0", "a1"],
            O: [3, 2],
            precision: "lowp",
          };
          r.s98 = {
            name: "_",
            h: "uniform vec3 u137;void main(){gl_FragColor=vec4(u137,0.);}",
            s: "attribute vec3 a0;uniform sampler2D u39;uniform vec3 u133;uniform vec2 u40,u141;uniform float u134,u135,u136,u142;const vec2 e=vec2(1.,1.);const vec3 l=vec3(1.,1.,1.);const vec2 B=vec2(-1.,1.),m=vec2(.16,.5),n=vec2(.5,.5),o=vec2(.84,.5);uniform mat4 u67;uniform vec3 u69,u73,u74,u75;uniform float u68,u76,u77,u70,u71,u72,u78;mat3 p(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u39,m);vec2 f=u76*e;vec3 c=u76*l;vec2 q=mix(d.a*u40,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u39,n).rgb+vec3(u70,0.,0.),u73,c);float r=mix(texture2D(u39,o).r,0.,u76);a.z+=r;mat3 s=p(a);vec3 t=mix(u133,u74,c);float u=mix(u134,u77,u76);vec3 b=mix(u69,u75,c);b.x+=u68*sin(a.y);float h=cos(a.z),i=sin(a.z);mat2 v=mat2(h,i,-i,h);b.xy=v*b.xy;float w=mix(u72,1.,u76);vec2 j=u71/q;vec3 k=a0;float x=max(0.,-a0.z-u135)*u136;k.x+=x*sign(a0.x)*(1.-u76);vec3 y=s*(k+t)*u+b;vec2 z=j*w;vec3 A=vec3(g*z,-j)+y*vec3(1.,-1.,-1.);gl_Position=u67*(vec4(u78*e,e)*vec4(A,1.));}",
            i: ["u137"].concat(n),
            O: [3],
            precision: "lowp",
          };
          r.s99 = {
            name: "_",
            h: "uniform vec4 u7;varying vec3 vv0;varying float vv1;void main(){float a=u7.x+u7.y*smoothstep(-u7.w,-u7.z,vv1);gl_FragColor=vec4(normalize(vv0),a);}",
            s: "attribute vec3 a0,a2;uniform sampler2D u39;uniform vec3 u133;uniform vec2 u40,u141;uniform float u134,u135,u136,u142;varying vec3 vv0;varying float vv1;const vec2 e=vec2(1.,1.);const vec3 o=vec3(1.,1.,1.);const vec2 D=vec2(-1.,1.),p=vec2(.16,.5),q=vec2(.5,.5),r=vec2(.84,.5);uniform mat4 u67;uniform vec3 u69,u73,u74,u75;uniform float u68,u76,u77,u70,u71,u72,u78;mat3 s(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u39,p);vec2 f=u76*e;vec3 c=u76*o;vec2 t=mix(d.a*u40,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u39,q).rgb+vec3(u70,0.,0.),u73,c);float u=mix(texture2D(u39,r).r,0.,u76);a.z+=u;mat3 h=s(a);vec3 v=mix(u133,u74,c);float w=mix(u134,u77,u76);vec3 b=mix(u69,u75,c);b.x+=u68*sin(a.y);float i=cos(a.z),j=sin(a.z);mat2 x=mat2(i,j,-j,i);b.xy=x*b.xy;float y=mix(u72,1.,u76);vec2 k=u71/t;vec3 l=a0;float z=max(0.,-a0.z-u135)*u136;l.x+=z*sign(a0.x)*(1.-u76);vec3 A=h*(l+v)*w+b;vec2 B=k*y;vec3 C=vec3(g*B,-k)+A*vec3(1.,-1.,-1.);gl_Position=u67*(vec4(u78*e,e)*vec4(C,1.)),vv0=h*a2*vec3(1.,-1.,-1.),vv1=a0.y;}",
            i: ["u7", "u69"].concat(n),
            H: ["a0", "a2"],
            precision: "highp",
          };
          r.s100 = {
            name: "_",
            h: "uniform sampler2D u143;uniform vec4 u7;varying vec4 vv0;varying vec3 vv1;varying vec2 vv2;varying float vv3;const vec3 i=vec3(1.,1.,1.);void main(){vec3 j=vec3(0.,0.,-1.),c=normalize(vv1),b=texture2D(u143,vv2).xyz;b=normalize(b*255./127.-1.007874*i);vec3 d=vv0.xyz,k=cross(c,d)*vv0.w;mat3 l=mat3(d,k,c);vec3 a=l*b;a=dot(a,j)>0.?vv1:a;float m=u7.x+u7.y*smoothstep(-u7.w,-u7.z,vv3);gl_FragColor=vec4(a,m);}",
            s: "attribute vec4 a3;attribute vec3 a0,a2;attribute vec2 a1;uniform sampler2D u39;uniform vec3 u133;uniform vec2 u40,u141;uniform float u134,u135,u136,u142;varying vec4 vv0;varying vec3 vv1;varying vec2 vv2;varying float vv3;const vec2 e=vec2(1.,1.);const vec3 q=vec3(1.,1.,1.);const vec2 F=vec2(-1.,1.),r=vec2(.16,.5),s=vec2(.5,.5),t=vec2(.84,.5);uniform mat4 u67;uniform vec3 u69,u73,u74,u75;uniform float u68,u76,u77,u70,u71,u72,u78;mat3 u(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u39,r);vec2 f=u76*e;vec3 c=u76*q;vec2 v=mix(d.a*u40,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u39,s).rgb+vec3(u70,0.,0.),u73,c);float w=mix(texture2D(u39,t).r,0.,u76);a.z+=w;mat3 h=u(a);vec3 x=mix(u133,u74,c);float y=mix(u134,u77,u76);vec3 b=mix(u69,u75,c);b.x+=u68*sin(a.y);float i=cos(a.z),j=sin(a.z);mat2 z=mat2(i,j,-j,i);b.xy=z*b.xy;float A=mix(u72,1.,u76);vec2 k=u71/v;vec3 l=a0;float B=max(0.,-a0.z-u135)*u136;l.x+=B*sign(a0.x)*(1.-u76);vec3 C=h*(l+x)*y+b;vec2 D=k*A;vec3 E=vec3(g*D,-k)+C*vec3(1.,-1.,-1.);gl_Position=u67*(vec4(u78*e,e)*vec4(E,1.)),vv1=h*a2*vec3(1.,-1.,-1.),vv0=a3,vv2=a1,vv3=a0.y;}",
            i: ["u7", "u69", "u143"].concat(n),
            H: ["a3", "a0", "a2", "a1"],
            O: [4, 3, 3, 2],
            precision: "highp",
          };
          r.s101 = {
            name: "_",
            h: "uniform vec4 u102;uniform float u138;void main(){float b=u138;vec4 a=u102;float c=floor(15.99*b),d=floor(15.99*a.b);a.b=(c+16.*d)/255.,gl_FragColor=a;}",
            s: "attribute vec3 a0;uniform sampler2D u39;uniform vec3 u133;uniform vec2 u40,u141;uniform float u134,u135,u136,u142;const vec2 e=vec2(1.,1.);const vec3 l=vec3(1.,1.,1.);const vec2 B=vec2(-1.,1.),m=vec2(.16,.5),n=vec2(.5,.5),o=vec2(.84,.5);uniform mat4 u67;uniform vec3 u69,u73,u74,u75;uniform float u68,u76,u77,u70,u71,u72,u78;mat3 p(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u39,m);vec2 f=u76*e;vec3 c=u76*l;vec2 q=mix(d.a*u40,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u39,n).rgb+vec3(u70,0.,0.),u73,c);float r=mix(texture2D(u39,o).r,0.,u76);a.z+=r;mat3 s=p(a);vec3 t=mix(u133,u74,c);float u=mix(u134,u77,u76);vec3 b=mix(u69,u75,c);b.x+=u68*sin(a.y);float h=cos(a.z),i=sin(a.z);mat2 v=mat2(h,i,-i,h);b.xy=v*b.xy;float w=mix(u72,1.,u76);vec2 j=u71/q;vec3 k=a0;float x=max(0.,-a0.z-u135)*u136;k.x+=x*sign(a0.x)*(1.-u76);vec3 y=s*(k+t)*u+b;vec2 z=j*w;vec3 A=vec3(g*z,-j)+y*vec3(1.,-1.,-1.);gl_Position=u67*(vec4(u78*e,e)*vec4(A,1.));}",
            i: ["u102", "u138"].concat(n),
            precision: "lowp",
          };
          r.s102 = {
            name: "_",
            h: "uniform sampler2D u65;uniform vec4 u102,u66;uniform float u138;varying vec2 vv0;vec2 i(float d,float e){float f=floor(d*255.+.01),a=pow(2.,e),g=256./a,b=f/a,c=floor(b),h=(b-c)*a;return vec2(c/(g-1.),h/(a-1.));}void main(){float c=u138;vec4 a=u102,d=texture2D(u65,vv0);vec2 b=i(d.b,4.);float f=1.-b.x,g=b.y;b=i(d.a,1.);float h=b.x,e=b.y;vec4 k=vec4(d.rg,g,h);float l=f;a=mix(a,k,u66*e),c=mix(c,l,u66.b*e);float m=floor(15.99*c),n=floor(15.99*a.b);a.b=(m+16.*n)/255.,gl_FragColor=a;}",
            s: "attribute vec3 a0;attribute vec2 a1;uniform sampler2D u39;uniform vec3 u133;uniform vec2 u40,u141;uniform float u134,u135,u136,u142;varying vec2 vv0;const vec2 e=vec2(1.,1.);const vec3 m=vec3(1.,1.,1.);const vec2 C=vec2(-1.,1.),n=vec2(.16,.5),o=vec2(.5,.5),p=vec2(.84,.5);uniform mat4 u67;uniform vec3 u69,u73,u74,u75;uniform float u68,u76,u77,u70,u71,u72,u78;mat3 q(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u39,n);vec2 f=u76*e;vec3 c=u76*m;vec2 r=mix(d.a*u40,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u39,o).rgb+vec3(u70,0.,0.),u73,c);float s=mix(texture2D(u39,p).r,0.,u76);a.z+=s;mat3 t=q(a);vec3 u=mix(u133,u74,c);float v=mix(u134,u77,u76);vec3 b=mix(u69,u75,c);b.x+=u68*sin(a.y);float h=cos(a.z),i=sin(a.z);mat2 w=mat2(h,i,-i,h);b.xy=w*b.xy;float x=mix(u72,1.,u76);vec2 j=u71/r;vec3 k=a0;float y=max(0.,-a0.z-u135)*u136;k.x+=y*sign(a0.x)*(1.-u76);vec3 z=t*(k+u)*v+b;vec2 A=j*x;vec3 B=vec3(g*A,-j)+z*vec3(1.,-1.,-1.);gl_Position=u67*(vec4(u78*e,e)*vec4(B,1.)),vv0=a1;}",
            i: ["u102", "u138"].concat(K, n),
            H: ["a0", "a1"],
            O: [3, 2],
            precision: "lowp",
          };
          n = ["u126", "u114", "u127"];
          r.s103 = {
            name: "_",
            h: "varying vec3 vv0;varying float vv1;void main(){gl_FragColor=vec4(vv0,vv1);}",
            s: "attribute vec3 a0;uniform mat4 u126,u114,u127;varying vec3 vv0;varying float vv1;void main(){vec4 a=u127*vec4(a0,1.);gl_Position=u126*u114*a,vv0=a.xyz,vv1=1.;}",
            i: n,
            precision: "highp",
          };
          r.s104 = {
            name: "_",
            h: "varying vec3 vv0;void main(){gl_FragColor=vec4(normalize(vv0),1.);}",
            s: "attribute vec3 a0,a2;uniform mat4 u126,u114,u127;varying vec3 vv0;varying float vv1;void main(){vec4 a=u127*vec4(a2,0.);gl_Position=u126*u114*u127*vec4(a0,1.),vv0=a.xyz,vv1=a0.y;}",
            i: n,
            H: ["a0", "a2"],
            precision: "highp",
          };
          r.s94 = {
            name: "_",
            h: "uniform sampler2D u143;uniform vec3 u144;varying vec4 vv0;varying vec3 vv1,vv2;varying vec2 vv3;const vec3 i=vec3(1.,1.,1.);void main(){vec3 j=normalize(vv1+u144),c=normalize(vv2),b=texture2D(u143,vv3).xyz;b=normalize(b*255./127.-1.007874*i);vec3 d=vv0.xyz,k=cross(c,d)*vv0.w;mat3 l=mat3(d,k,c);vec3 a=l*b;a=dot(a,j)>0.?vv2:a,gl_FragColor=vec4(a,1.);}",
            s: "attribute vec4 a3;attribute vec3 a0,a2;attribute vec2 a1;uniform mat4 u126,u114,u127;varying vec4 vv0;varying vec3 vv1,vv2;varying vec2 vv3;void main(){vec4 b=u127*vec4(a2,0.),a=u127*vec4(a0,1.);gl_Position=u126*u114*a,vv0=a3,vv2=b.xyz,vv3=a1,vv1=a.xyz;}",
            i: ["u143", "u144"].concat(n),
            H: ["a0", "a2", "a1", "a3"],
            precision: "highp",
          };
          r.s93 = {
            name: "_",
            h: "uniform sampler2D u1;uniform vec3 u137;uniform float u64;varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0);vec3 b=mix(u137,a.rgb,a.a);vec4 c=vec4(mix(a.rgb*u137,b,u64),a.a);gl_FragColor=c;}",
            s: "attribute vec3 a0;attribute vec2 a1;uniform mat4 u126,u114,u127;varying vec2 vv0;const vec4 f=vec4(0.,0.,5e-4,0.);void main(){gl_Position=u126*u114*u127*vec4(a0,1.)+f,vv0=a1;}",
            i: ["u137"].concat(E, n),
            H: ["a0", "a1"],
            Ha: [{ search: "0.0005", replace: Aa.da() ? "0.0005" : "0.0" }],
            precision: "lowp",
          };
          r.s105 = {
            name: "_",
            h: "uniform vec4 u102;uniform float u138;void main(){float b=u138;vec4 a=u102;float c=floor(15.99*b),d=floor(15.99*a.b);a.b=(c+16.*d)/255.,gl_FragColor=a;}",
            s: "attribute vec3 a0;uniform mat4 u126,u114,u127;void main(){gl_Position=u126*u114*u127*vec4(a0,1.);}",
            i: ["u102"].concat(n),
            precision: "highp",
          };
          r.s95 = {
            name: "_",
            h: "uniform sampler2D u65;uniform vec4 u102,u66;uniform float u138;varying vec2 vv0;vec2 i(float d,float e){float f=floor(d*255.+.01),a=pow(2.,e),g=256./a,b=f/a,c=floor(b),h=(b-c)*a;return vec2(c/(g-1.),h/(a-1.));}void main(){float c=u138;vec4 a=u102,d=texture2D(u65,vv0);vec2 b=i(d.b,4.);float f=1.-b.x,g=b.y;b=i(d.a,1.);float h=b.x,e=b.y;vec4 k=vec4(d.rg,g,h);float l=f;a=mix(a,k,u66*e),c=mix(c,l,u66.b*e);float m=floor(15.99*c),n=floor(15.99*a.b);a.b=(m+16.*n)/255.,gl_FragColor=a;}",
            s: "attribute vec3 a0;attribute vec2 a1;uniform mat4 u126,u114,u127;varying vec2 vv0;void main(){gl_Position=u126*u114*u127*vec4(a0,1.),vv0=a1;}",
            i: ["u102"].concat(K, n),
            H: ["a0", "a1"],
            O: [3, 2],
            precision: "highp",
          };
        }
        function t() {
          for (var n in r) d(b, r[n]);
        }
        var v = !1,
          E = ["u1", "u64"],
          K = ["u65", "u66"],
          l = "u67 u68 u69 u70 u71 u72".split(" "),
          w = "u73 u74 u75 u76 u77 u78".split(" "),
          r = {},
          f = -1,
          h = null,
          J = 0,
          B = {
            pl: function () {
              return ba.ia()
                ? "precision highp float;\n            layout(location = 0) out vec4 gbuf0;\n            layout(location = 1) out vec4 gbuf1;\n            layout(location = 2) out vec4 gbuf2;\n            layout(location = 3) out vec4 gbuf3;\n"
                : "#extension GL_EXT_draw_buffers : require\n";
            },
            qa: function (n, m) {
              r[n] = m;
              v && d(b, r[n]);
            },
            Lp: function (n, m) {
              r[n] = m;
              m.Mh = !1;
              d(b, r[n]);
            },
            Tb: function () {
              return v;
            },
            m: function () {
              r.s0 = p();
              r.s1 = {
                name: "_",
                h: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
                i: ["u1"],
                precision: "lowp",
              };
              r.s65 = {
                name: "_",
                h: "uniform sampler2D u1,u6;uniform float u7;varying vec2 vv0;const vec3 f=vec3(1.,1.,1.);void main(){gl_FragColor=vec4(mix(texture2D(u6,vv0).rgb,texture2D(u1,vv0).rgb,u7*f),1.);}",
                i: ["u1", "u6", "u7"],
                precision: "highp",
              };
              r.s66 = {
                name: "_",
                h: "uniform sampler2D u1,u6;uniform float u7;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){gl_FragColor=mix(texture2D(u6,vv0),texture2D(u1,vv0),u7*f);}",
                i: ["u1", "u6", "u7"],
                precision: "highp",
              };
              r.s12 = {
                name: "_",
                h: "uniform sampler2D u1,u79;uniform vec2 u80;uniform float u81,u82;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 b=texture2D(u79,vv0*u80),c=texture2D(u1,vv0*u80);float a=smoothstep(u81,0.,vv0.y);a+=smoothstep(1.-u81,1.,vv0.y),gl_FragColor=pow(mix(c,b,a*f),u82*f);}",
                i: ["u1", "u80", "u79", "u81", "u82"],
              };
              r.s67 = {
                name: "_",
                h: "uniform sampler2D u1,u79;uniform vec2 u80;uniform float u81,u82;varying vec2 vv0;const vec3 h=vec3(1.,1.,1.);vec4 i(vec3 d){vec3 b=d/65536.,a=clamp(ceil(log2(b)),-128.,127.);float c=max(max(a.r,a.g),a.b),f=exp2(c);vec3 g=clamp(b/f,0.,1.);return vec4(g,(c+128.)/256.);}void main(){vec2 a=vv0*u80;float c=floor(a.x),d=mod(c,2.);a.x=mod(a.x,1.),a.x=mix(a.x,1.-a.x,d);vec3 f=texture2D(u79,a).rgb,g=texture2D(u1,a).rgb;float b=smoothstep(u81,0.,vv0.y);b+=smoothstep(1.-u81,1.,vv0.y);vec3 j=mix(g,f,b*h);vec4 k=i(pow(j,u82*h));gl_FragColor=k;}",
                i: ["u1", "u80", "u79", "u81", "u82"],
                precision: "highp",
              };
              r.s68 = {
                name: "_",
                h: "uniform sampler2D u1;varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0);if(a.a<.5)discard;gl_FragColor=a;}",
                i: ["u1"],
                precision: "lowp",
              };
              r.s69 = {
                name: "_",
                h: "uniform sampler2D u1,u83;uniform vec2 u8;varying vec2 vv0;const vec2 f=vec2(-.9,.4),g=vec2(.4,.9),h=vec2(-.4,-.9),i=vec2(.9,-.4);void main(){vec2 a=vv0;vec3 b=texture2D(u1,a).rgb+texture2D(u1,a+u8*f).rgb+texture2D(u1,a+u8*g).rgb+texture2D(u1,a+u8*h).rgb+texture2D(u1,a+u8*i).rgb;gl_FragColor=vec4(b/5.,1.);}",
                i: ["u1", "u8"],
                precision: "lowp",
              };
              r.s70 = {
                name: "_",
                h: "uniform sampler2D u1,u83,u39;uniform vec2 u8,u84;varying vec2 vv0;const vec3 k=vec3(1.,1.,1.);const vec2 f=vec2(-.9,.4),g=vec2(.4,.9),h=vec2(-.4,-.9),i=vec2(.9,-.4);void main(){vec2 a=vv0;vec3 b=texture2D(u1,a).rgb+texture2D(u1,a+u8*f).rgb+texture2D(u1,a+u8*g).rgb+texture2D(u1,a+u8*h).rgb+texture2D(u1,a+u8*i).rgb;float c=texture2D(u39,vec2(.5,.5)).a,d=u84.x+pow(c,2.)*(u84.y-u84.x);vec3 j=mix(b/5.,texture2D(u83,a).rgb,d);gl_FragColor=vec4(j,1.);}",
                i: ["u1", "u83", "u8", "u39", "u84"],
                precision: "lowp",
              };
              r.s71 = {
                name: "_",
                h: "uniform sampler2D u1;uniform vec2 u8;varying vec2 vv0;const vec3 f=vec3(.299,.587,.114);const float m=.007813,n=.125,h=8.;void main(){vec2 x=vv0;vec3 o=texture2D(u1,vv0+vec2(-1.,-1.)*u8).xyz,p=texture2D(u1,vv0+vec2(1.,-1.)*u8).xyz,q=texture2D(u1,vv0+vec2(-1.,1.)*u8).xyz,r=texture2D(u1,vv0+vec2(1.,1.)*u8).xyz,s=texture2D(u1,vv0).xyz;float b=dot(o,f),c=dot(p,f),e=dot(q,f),g=dot(r,f),i=dot(s,f),t=min(i,min(min(b,c),min(e,g))),u=max(i,max(max(b,c),max(e,g)));vec2 a;a.x=-(b+c-(e+g)),a.y=b+e-(c+g);float v=max((b+c+e+g)*(.25*n),m),w=1./(min(abs(a.x),abs(a.y))+v);a=min(vec2(h,h),max(vec2(-h,-h),a*w))*u8;vec3 j=.5*(texture2D(u1,vv0+a*-.166667).rgb+texture2D(u1,vv0+a*.166667).rgb),k=j*.5+.25*(texture2D(u1,vv0+a*-.5).rgb+texture2D(u1,vv0+a*.5).rgb);float l=dot(k,f);gl_FragColor=l<t||l>u?vec4(j,1.):vec4(k,1.);}",
                i: ["u1", "u8"],
                precision: "lowp",
              };
              r.s43 = {
                name: "_",
                h: "uniform sampler2D u1;varying vec2 vv0;const vec3 f=vec3(0.,0.,0.);vec4 g(vec3 d){vec3 b=d/65536.,a=clamp(ceil(log2(b)),-128.,127.);float c=max(max(a.r,a.g),a.b),h=exp2(c);vec3 i=clamp(b/h,0.,1.);return vec4(i,(c+128.)/256.);}void main(){vec3 a=texture2D(u1,vv0).rgb;gl_FragColor=g(max(a,f));}",
                i: ["u1"],
                precision: "highp",
              };
              r.s72 = {
                name: "_",
                h: "uniform sampler2D u85,u86;uniform float u87,u88;varying vec2 vv0;void main(){vec3 a=texture2D(u86,vv0).rgb,b=texture2D(u85,vv0).rgb;gl_FragColor=vec4(b*u88+u87*a,1.);}",
                i: ["u85", "u86", "u87", "u88"],
                precision: "highp",
              };
              r.s73 = {
                name: "_",
                h: "uniform sampler2D u89,u90;uniform float u82;varying vec2 vv0;const int j=8888;const float e=3.141592;const vec2 k=vec2(0.,0.);const vec3 n=vec3(1.,1.,1.),o=vec3(0.,0.,0.);void main(){float p=e*(vv0.x*2.-1.),q=e/2.*(vv0.y*2.-1.),b,c,r,l,m;vec4 d;vec3 f=o;vec2 g=k,a=k;for(int h=0;h<j;h+=1)a.x=float(h),a.y=floor(a.x/64.),d=texture2D(u90,a/64.),b=e*d.r,c=2.*asin(sqrt(.25+d.g*.25)),l=p+c*cos(b),m=q+c*sin(b),g.x=.5+.5*l/e,g.y=.5+m/e,f+=pow(texture2D(u89,g).rgb,u82*n);f/=float(j),gl_FragColor=vec4(f,1.);}",
                i: ["u89", "u90", "u82"],
                precision: "lowp",
                Ha: [{ search: "8888", replace: S.cm[ba.U()] }],
              };
              r.s74 = {
                name: "_",
                h: "uniform sampler2D u1;uniform vec2 u8;varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0);float b=.031496*texture2D(u1,vv0-3.*u8).a+.110236*texture2D(u1,vv0-2.*u8).a+.220472*texture2D(u1,vv0-u8).a+.275591*a.a+.220472*texture2D(u1,vv0+u8).a+.110236*texture2D(u1,vv0+2.*u8).a+.031496*texture2D(u1,vv0+3.*u8).a;gl_FragColor=vec4(a.rgb,4.*b);}",
                i: ["u1", "u8"],
                precision: "lowp",
              };
              r.s75 = {
                name: "_",
                h: "uniform sampler2D u1;varying vec2 vv0;const vec3 f=vec3(1.,1.,1.);void main(){vec4 a=texture2D(u1,vv0);float b=.3*pow(a.a,2.);gl_FragColor=vec4(a.rgb+b*f,1.);}",
                i: ["u1"],
                precision: "lowp",
              };
              r.s76 = {
                name: "_",
                h: "uniform sampler2D u1;uniform vec2 u8;varying vec2 vv0;void main(){vec4 a=.031496*texture2D(u1,vv0-3.*u8)+.110236*texture2D(u1,vv0-2.*u8)+.220472*texture2D(u1,vv0-u8)+.275591*texture2D(u1,vv0)+.220472*texture2D(u1,vv0+u8)+.110236*texture2D(u1,vv0+2.*u8)+.031496*texture2D(u1,vv0+3.*u8);gl_FragColor=a;}",
                i: ["u1", "u8"],
                precision: "lowp",
              };
              r.s77 = {
                name: "_",
                h: "uniform sampler2D u1;uniform vec2 u8;varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0-3.*u8)+texture2D(u1,vv0-2.*u8)+texture2D(u1,vv0-u8)+texture2D(u1,vv0)+texture2D(u1,vv0+u8)+texture2D(u1,vv0+2.*u8)+texture2D(u1,vv0+3.*u8);gl_FragColor=a/7.;}",
                i: ["u1", "u8"],
                precision: "lowp",
              };
              r.s78 = {
                name: "_",
                h: "uniform sampler2D u1;varying vec2 vv0;const vec4 g=vec4(0.,0.,0.,0.);const float e=256.;void main(){vec4 b=g;float c=0.;vec2 d;for(float a=0.;a<e;a+=1.)d=vec2((a+.5)/e,vv0.y),b+=texture2D(u1,d),c+=1.;gl_FragColor=b/c;}",
                i: ["u1"],
                precision: "highp",
              };
              r.s79 = {
                name: "_",
                h: "uniform sampler2D u1,u79;varying vec2 vv0;const vec4 h=vec4(1.,1.,1.,1.);const float f=0.,g=.3;void main(){vec4 b=texture2D(u79,vv0),c=texture2D(u1,vv0);float a=smoothstep(g,f,vv0.y);a+=smoothstep(1.-g,1.-f,vv0.y),gl_FragColor=mix(c,b,a*h);}",
                i: ["u1", "u79"],
                precision: "highp",
              };
              r.s80 = {
                name: "_",
                h: "uniform sampler2D u1,u79;varying vec2 vv0;const vec3 h=vec3(1.,1.,1.);const float f=0.,g=.3;vec4 i(vec3 d){vec3 b=d/65536.,a=clamp(ceil(log2(b)),-128.,127.);float c=max(max(a.r,a.g),a.b),j=exp2(c);vec3 k=clamp(b/j,0.,1.);return vec4(k,(c+128.)/256.);}void main(){vec3 b=texture2D(u79,vv0).rgb,c=texture2D(u1,vv0).rgb;float a=smoothstep(g,f,vv0.y);a+=smoothstep(1.-g,1.-f,vv0.y),gl_FragColor=i(mix(c,b,a*h));}",
                i: ["u1", "u79"],
                precision: "highp",
              };
              r.s81 = {
                name: "_",
                h: "uniform sampler2D u1,u91,u2,u92;uniform vec4 u93;uniform vec2 u94;uniform float u95,u96,u97,u98;varying vec2 vv0;const vec2 g=vec2(1.,1.),h=vec2(.5,.5);const float e=3.141592;void main(){vec4 d=texture2D(u1,vv0),i=texture2D(u91,vec2(1.-vv0.x,vv0.y));float j=step(texture2D(u92,vec2(.25,.5)).r,1.);vec2 a=vv0*2.-g;float k=texture2D(u2,a*u94*.5+h).r,l=atan(a.x,a.y),m=-(mod(u95,2.*e)-e),b=mod(l-m+e,2.*e)-e,n=smoothstep(0.,u96,b),c=.5+u98*(.5-n);c*=(sign(b)+1.)/2.;vec4 o=i+c*u93*k;gl_FragColor=mix(d,o,j*u97);}",
                i: "u1 u2 u92 u91 u93 u95 u96 u97 u94 u98".split(" "),
                precision: "lowp",
              };
              var n =
                "u99 u100 u101 u102 u89 u103 u22 u104 u91 u105 u106 u107 u108 u109 u8".split(
                  " "
                );
              S.ca &&
                (r.s82 = {
                  name: "_",
                  h: "uniform sampler2D u99,u100,u101,u102,u89,u103,u110,u91;uniform vec3 u104,u107;uniform vec2 u8;uniform float u22,u111,u106,u108,u105;varying vec2 vv0;const float j=3.141592;const vec3 u=vec3(0.,0.,0.),v=vec3(.299,.587,.114);const float w=2.;vec3 l(vec4 a){float b=a.a*256.-128.;vec3 c=a.rgb;return exp2(b)*c*65536.;}vec2 x(vec3 a){float b=atan(a.x,a.z),c=acos(-a.y);return vec2(.5-.5*b/j,1.-c/j);}vec2 y(vec3 a,float b){vec2 d=vec2(1.,.5)/pow(2.,b),f=vec2(0.,1.-pow(.5,b));float g=atan(a.x,a.z),h=acos(-a.y),c=.5+.5*g/j,i=h/j,k=pow(2.,b)/u105;c=(1.-k)*c;return f+vec2(c,i)*d;}void main(){vec4 c=texture2D(u99,vv0);vec3 k=texture2D(u91,vec2(1.-vv0.x,vv0.y)).rgb;if(c.a<.01){gl_FragColor=vec4(k,0.);return;}float z=c.a;vec3 A=c.rgb,B=A+u104;vec4 b=texture2D(u102,vv0),m=texture2D(u100,vv0);vec3 d=m.rgb;float f=m.a;vec4 n=texture2D(u101,vv0);vec3 C=n.rgb;float o=b.r,D=b.g,p=floor(b.b*255.),g=floor(p/16.),E=(p-16.*g)/16.;g/=16.;float F=b.a;f=1.-(1.-f)*(1.-n.a);vec2 G=x(-d);vec3 q=(1.-F)*l(texture2D(u103,G)),r=normalize(B),h=u,s=reflect(-r,d);vec2 H=y(s,floor(D*u22));float I=acos(-s.z),J=smoothstep(u106-u108,u106+u108,I);h=mix(l(texture2D(u89,H)),u107,J);float a=o+(E-o)*pow(1.-dot(d,-r),g*16.);a=clamp(a,0.,1.);float t=1.-u111*texture2D(u110,vv0).r;h*=pow(t,2.),q*=t;vec3 i=C*mix(q,h,a),M=mix(k,i,z*(f*(1.-a)+a));float K=dot(i,v),L=max(0.,(K-1.)/(w-1.));gl_FragColor=vec4(i,L);}",
                  i: n.concat(["u110", "u111"]),
                  precision: "highp",
                });
              r.s83 = {
                name: "_",
                h: "uniform sampler2D u99,u100,u101,u102,u89,u103,u91;uniform vec3 u104,u107;uniform vec2 u8;uniform float u22,u106,u108,u109,u112,u113,u105;varying vec2 vv0;const float g=3.141592;const vec3 D=vec3(0.,0.,0.),m=vec3(1.,1.,1.),E=vec3(.299,.587,.114);const float F=2.;vec3 p(vec4 a){float b=a.a*256.-128.;vec3 c=a.rgb;return exp2(b)*c*65536.;}vec2 G(vec3 a){float b=atan(a.x,-a.z),c=acos(-a.y);return vec2(.5-.5*b/g,1.-c/g);}vec2 H(vec3 a,float d){float b=pow(2.,d);vec2 f=vec2(1.,.5)/b,h=vec2(0.,1.-1./b);float i=atan(a.x,a.z),j=acos(-a.y),c=.5+.5*i/g,k=j/g,l=.5*b/u105;c=(1.-l)*c;return h+vec2(c,k)*f;}float n(vec3 a,vec3 b){return abs(acos(dot(a,b)));}float o(vec2 a){float b=texture2D(u99,a).a;return step(.01,b);}void main(){vec4 h=texture2D(u99,vv0),i=texture2D(u91,vec2(1.-vv0.x,vv0.y));if(h.a<.01){gl_FragColor=vec4(i.rgb,0.);return;}float q=h.a;vec3 I=h.rgb,J=I+u104;vec4 c=texture2D(u102,vv0),r=texture2D(u100,vv0);vec3 a=r.rgb;float j=r.a;vec4 k=texture2D(u101,vv0);vec3 d=k.rgb;if(q>1.){gl_FragColor=vec4(mix(i.rgb,d,k.a),1.);return;}d=pow(d,u112*m);float s=c.r,K=c.g,L=c.a,t=floor(c.b*255.),l=floor(t/16.),M=(t-16.*l)/16.;l/=16.,j=1.-(1.-j)*(1.-k.a);vec2 u=vv0+vec2(-1.,0.)*u8,v=vv0+vec2(1.,0.)*u8,w=vv0+vec2(0.,1.)*u8,x=vv0+vec2(0.,-1.)*u8;vec3 N=texture2D(u100,u).rgb,O=texture2D(u100,v).rgb,P=texture2D(u100,w).rgb,Q=texture2D(u100,x).rgb;float R=n(a,N)*o(u),S=n(a,O)*o(v),T=n(a,P)*o(w),U=n(a,Q)*o(x),V=2.*max(max(R,S),max(T,U)),W=1.2*clamp(V/g,0.,1.),X=max(K,W);vec2 Y=G(a);vec3 Z=p(texture2D(u103,Y)),_=(1.-L)*Z,y=normalize(J),z=D,A=reflect(-y,a);float aa=floor(X*u22);vec2 ba=H(A,aa);float ca=acos(-A.z),da=smoothstep(u106-u108,u106+u108,ca);vec3 ea=p(texture2D(u89,ba));z=mix(ea,u107,da*u109);float b=s+(M-s)*pow(1.+dot(a,y),l*15.);b=clamp(b,0.,1.);vec3 fa=d*mix(_,z,b);float B=q*(j*(1.-b)+b);vec3 f=mix(i.rgb,pow(fa,m/u112),B);float C=dot(f,E),ga_=max(0.,(C-1.)/(F-1.));f=mix(C*m,f,mix(1.,u113,B)*m),gl_FragColor=vec4(f,ga_);}",
                i: n.concat(["u112", "u113"]),
                precision: "highp",
              };
              S.ca &&
                ((r.s84 = {
                  name: "_",
                  h: "uniform sampler2D u99,u100;uniform mat4 u114;uniform vec2 u115,u8,u116;uniform float u117,u118,u119,u120,u121,u122,u123,u124,u111;varying vec2 vv0;const float PI=3.141593,HALFPI=1.570796,N=8888.8;void main(){vec2 uvt=vv0+u116;vec4 pos=texture2D(u99,uvt);if(pos.a<.01){gl_FragColor=vec4(0.,0.,0.,1.);return;}vec3 co0=pos.rgb;float c=cos(u117),s=sin(u117);vec3 no0=texture2D(u100,uvt).rgb;float zv=(u114*vec4(co0,1.)).z;vec3 co;vec2 scale=u115/abs(zv),uv,duv=u8*vec2(c,s)*scale;vec3 dp,dpn;float dzMax=0.,angleMin=0.,angle;for(float i=0.;i<N;i+=1.)uv=uvt+i*duv,co=texture2D(u99,uv).rgb,dp=co-co0,dpn=normalize(dp),angle=atan(dot(no0,dpn),length(cross(no0,dpn))),angle*=1.-smoothstep(u123,u124,length(dp)),angleMin=max(angleMin,angle),dzMax=max(dzMax,sin(angle)*length(dp));float angleMinInv=0.;for(float i=0.;i<N;i+=1.)uv=uvt-i*duv,co=texture2D(u99,uv).rgb,dp=co-co0,dpn=normalize(dp),angle=atan(dot(no0,dpn),length(cross(no0,dpn))),angle*=1.-smoothstep(u123,u124,length(dp)),dzMax=max(dzMax,sin(angle)*length(dp)),angleMinInv=max(angleMinInv,angle);duv=u8*vec2(s,c)*scale;float angleMin2=0.;for(float i=0.;i<N;i+=1.)uv=uvt+i*duv,co=texture2D(u99,uv).rgb,dp=co-co0,dpn=normalize(dp),angle=atan(dot(no0,dpn),length(cross(no0,dpn))),angle*=1.-smoothstep(u123,u124,length(dp)),dzMax=max(dzMax,sin(angle)*length(dp)),angleMin2=max(angleMin2,angle);float angleMin2Inv=0.;for(float i=0.;i<N;i+=1.)uv=uvt-i*duv,co=texture2D(u99,uv).rgb,dp=co-co0,dpn=normalize(dp),angle=atan(dot(no0,dpn),length(cross(no0,dpn))),angle*=1.-smoothstep(u123,u124,length(dp)),dzMax=max(dzMax,sin(angle)*length(dp)),angleMin2Inv=max(angleMin2Inv,angle);float omegaMin=PI/4.*(angleMin+angleMinInv)*(angleMin2+angleMin2Inv),dzFactor=clamp(dzMax/u120,u121,1.),ao=dzFactor*clamp(u119*omegaMin*u122,0.,u111);gl_FragColor=vec4(ao,ao,ao,u118);}",
                  i: "u99 u100 u119 u118 u117 u8 u125 u120 u121 u122 u123 u124 u114 u115 u111".split(
                    " "
                  ),
                  Ha: [{ search: "8888.8", replace: S.ek[ba.U()].toFixed(1) }],
                  precision: "lowp",
                }),
                (r.s85 = {
                  name: "_",
                  h: "uniform sampler2D u1;uniform vec2 u8;varying vec2 vv0;const vec2 f=vec2(-.9,.4),g=vec2(.4,.9),h=vec2(-.4,-.9),i=vec2(.9,-.4),j=vec2(-1.9,.9),k=vec2(.9,1.9),l=vec2(-.9,-1.9),m=vec2(1.9,-.9);void main(){vec2 a=vv0;vec4 b=texture2D(u1,a)+texture2D(u1,a+u8*f)+texture2D(u1,a+u8*g)+texture2D(u1,a+u8*h)+texture2D(u1,a+u8*i);b+=texture2D(u1,a+u8*j)+texture2D(u1,a+u8*k)+texture2D(u1,a+u8*l)+texture2D(u1,a+u8*m),gl_FragColor=b/9.;}",
                  i: ["u1", "u8"],
                  precision: "lowp",
                }));
              r.s86 = {
                name: "_",
                h: "varying vec3 vv0;void main(){gl_FragColor=vec4(vv0,1.);}",
                s: "attribute vec3 a0;uniform mat4 u126,u114,u127;varying vec3 vv0;void main(){vec4 a=u126*u114*u127*vec4(a0,1.);gl_Position=a,vv0=a.xyz/a.w;}",
                i: ["u126", "u114", "u127"],
                precision: "lowp",
              };
              r.s87 = {
                name: "_",
                h: "uniform sampler2D u128,u103,u90;uniform mat4 u126,u129;uniform vec2 u130;uniform float u131;varying vec2 vv0;const float n=8888.8,o=9999.9,p=25.,v=50.,w=1.2,e=3.141592;const vec4 x=vec4(0.,0.,0.,0.),A=vec4(1.,1.,1.,1.);const vec2 f=vec2(.5,.5);vec2 y(vec3 a){float b=atan(a.x,a.z),c=acos(a.y);return vec2(.5-.5*b/e,1.-c/e);}void main(){float d,a,q;vec2 z=vec2(vv0.x,1.-vv0.y),b;vec3 r=vec3(u130*(z-f),0.),B=vec3(u129*vec4(r,1.)),g,s;vec4 t=x,h,c,u;vec3 i;int j;for(float k=0.;k<n;k+=1.){b.x=k,b.y=floor(b.x/64.),c=texture2D(u90,b/64.),d=e*c.r,a=2.*asin(sqrt(.25+c.g*.25)),g=vec3(cos(d)*sin(a),sin(d)*sin(a),-cos(a)),q=p+(.5+.5*c.b)*(v-p),j=0;for(float l=0.;l<=o;l+=1.){u=vec4(r+g*q*pow(l/o,w),1.),h=u126*u,i=h.xyz/h.w;if(texture2D(u128,f+f*i.xy).z<i.z){j=1;break;}}if(j==1)continue;s=vec3(u129*vec4(g,0.)),t+=texture2D(u103,y(s));}gl_FragColor=vec4(u131*t.rgb/n,1.);}",
                i: "u128 u103 u90 u126 u129 u130 u131".split(" "),
                Ha: [
                  { search: "8888.8", replace: S.Un[ba.U()].toFixed(1) },
                  { search: "9999.9", replace: S.Vn[ba.U()].toFixed(1) },
                ],
                precision: "lowp",
              };
              r.s88 = {
                name: "_",
                h: "uniform sampler2D u1;uniform vec2 u8;varying vec2 vv0;void main(){vec4 a=.285714*texture2D(u1,vv0-u8)+.428571*texture2D(u1,vv0)+.285714*texture2D(u1,vv0+u8);gl_FragColor=a;}",
                i: ["u1", "u8"],
                precision: "lowp",
              };
              r.s89 = {
                name: "_",
                h: "uniform sampler2D u1,u132;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
                s: "attribute vec3 a0;attribute vec2 a1;uniform mat4 u126,u114;varying vec2 vv0;void main(){vec4 a=u126*u114*vec4(a0,1.);gl_Position=a,vv0=a1;}",
                i: ["u126", "u114", "u1"],
                H: ["a0", "a1"],
                precision: "lowp",
              };
              if (ba.Z()) {
                n =
                  "u39 u133 u134 u135 u136 u40 u102 u137 u138 u7 u139 u140 u69"
                    .split(" ")
                    .concat(l, w);
                ba.Xh() ||
                  (r.s90 = {
                    name: "_",
                    s: "attribute vec2 a0;void main(){gl_Position=vec4(a0,0.,1.);}",
                    h: "void main(){gl_FragData[0]=vec4(0.,0.,0.,0.),gl_FragData[1]=vec4(0.,0.,0.,0.),gl_FragData[2]=vec4(0.,0.,0.,0.),gl_FragData[3]=vec4(0.,0.,0.,0.);}",
                    i: [],
                    precision: "lowp",
                    ea: !0,
                  });
                r.s91 = {
                  name: "_",
                  s: "attribute vec2 a0;void main(){gl_Position=vec4(a0,0.,1.);}",
                  h: "uniform vec4 color;void main(){gl_FragData[0]=color,gl_FragData[1]=color,gl_FragData[2]=color,gl_FragData[3]=color;}",
                  i: ["color"],
                  ea: !0,
                };
                r.s92NNGLcolor = {
                  name: "_",
                  h: "uniform vec4 u102,u7;uniform vec3 u137;uniform float u138;varying vec3 vv0,vv1;varying float vv2,vv3;void main(){float b=u7.x+u7.y*smoothstep(-u7.w,-u7.z,vv3),c=u138;vec4 a=u102;float d=floor(15.99*c),i=floor(15.99*a.b);a.b=(d+16.*i)/255.,gl_FragData[0]=vec4(vv0,vv2),gl_FragData[1]=vec4(normalize(vv1),b),gl_FragData[2]=vec4(u137,0.),gl_FragData[3]=a;}",
                  s: "attribute vec3 a0,a2;uniform sampler2D u39;uniform vec3 u133;uniform vec2 u40,u141;uniform float u134,u139,u140,u135,u136,u142;varying vec3 vv0,vv1;varying float vv2,vv3;const vec2 e=vec2(1.,1.);const vec3 r=vec3(1.,1.,1.);const vec2 F=vec2(-1.,1.),s=vec2(.16,.5),t=vec2(.5,.5),u=vec2(.84,.5);uniform mat4 u67;uniform vec3 u69,u73,u74,u75;uniform float u68,u76,u77,u70,u71,u72,u78;mat3 v(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u39,s);vec2 f=u76*e;vec3 c=u76*r;vec2 w=mix(d.a*u40,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u39,t).rgb+vec3(u70,0.,0.),u73,c);float x=mix(texture2D(u39,u).r,0.,u76);a.z+=x;mat3 h=v(a);vec3 y=mix(u133,u74,c);float z=mix(u134,u77,u76);vec3 b=mix(u69,u75,c);b.x+=u68*sin(a.y);float i=cos(a.z),j=sin(a.z);mat2 A=mat2(i,j,-j,i);b.xy=A*b.xy;float B=mix(u72,1.,u76);vec2 k=u71/w;vec3 l=a0;float C=max(0.,-a0.z-u135)*u136;l.x+=C*sign(a0.x)*(1.-u76);vec3 m=h*(l+y)*z+b;vec2 D=k*B;vec3 E=vec3(g*D,-k)+m*vec3(1.,-1.,-1.);gl_Position=u67*(vec4(u78*e,e)*vec4(E,1.)),vv1=h*a2*vec3(1.,-1.,-1.),vv2=smoothstep(u139,u140,a0.z),vv0=m,vv3=a0.y;}",
                  i: n,
                  H: ["a0", "a2"],
                  O: [3, 3],
                  ea: !0,
                };
                r.s92NNGLtexture = {
                  name: "_",
                  h: "uniform sampler2D u1;uniform vec4 u102,u7;uniform vec3 u137;uniform float u138,u64;varying vec3 vv0,vv1;varying vec2 vv2;varying float vv3,vv4;void main(){float c=u7.x+u7.y*smoothstep(-u7.w,-u7.z,vv4),d=u138;vec4 b=u102;float j=floor(15.99*d),k=floor(15.99*b.b);b.b=(j+16.*k)/255.;vec4 a=texture2D(u1,vv2);vec3 l=mix(u137,a.rgb,a.a);vec4 m=vec4(mix(a.rgb*u137,l,u64),a.a);gl_FragData[0]=vec4(vv0,vv3),gl_FragData[1]=vec4(normalize(vv1),c),gl_FragData[2]=m,gl_FragData[3]=b;}",
                  s: "attribute vec3 a0,a2;attribute vec2 a1;uniform sampler2D u39;uniform vec3 u133;uniform vec2 u40,u141;uniform float u134,u139,u140,u135,u136,u142;varying vec3 vv0,vv1;varying vec2 vv2;varying float vv3,vv4;const vec2 e=vec2(1.,1.);const vec3 s=vec3(1.,1.,1.);const vec2 G=vec2(-1.,1.),t=vec2(.16,.5),u=vec2(.5,.5),v=vec2(.84,.5);uniform mat4 u67;uniform vec3 u69,u73,u74,u75;uniform float u68,u76,u77,u70,u71,u72,u78;mat3 w(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u39,t);vec2 f=u76*e;vec3 c=u76*s;vec2 x=mix(d.a*u40,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u39,u).rgb+vec3(u70,0.,0.),u73,c);float y=mix(texture2D(u39,v).r,0.,u76);a.z+=y;mat3 h=w(a);vec3 z=mix(u133,u74,c);float A=mix(u134,u77,u76);vec3 b=mix(u69,u75,c);b.x+=u68*sin(a.y);float i=cos(a.z),j=sin(a.z);mat2 B=mat2(i,j,-j,i);b.xy=B*b.xy;float C=mix(u72,1.,u76);vec2 k=u71/x;vec3 l=a0;float D=max(0.,-a0.z-u135)*u136;l.x+=D*sign(a0.x)*(1.-u76);vec3 m=h*(l+z)*A+b;vec2 E=k*C;vec3 F=vec3(g*E,-k)+m*vec3(1.,-1.,-1.);gl_Position=u67*(vec4(u78*e,e)*vec4(F,1.)),vv1=h*a2*vec3(1.,-1.,-1.),vv3=smoothstep(u139,u140,a0.z),vv2=a1,vv0=m,vv4=a0.y;}",
                  i: n.concat(E),
                  H: ["a0", "a2", "a1"],
                  O: [3, 3, 2],
                  ea: !0,
                };
                r.s92NNGLtextureNormalMap = {
                  name: "_",
                  h: "uniform vec4 u102,u7;uniform vec3 u137;uniform sampler2D u1,u143;uniform float u138,u64;varying vec4 vv0;varying vec3 vv1,vv2;varying vec2 vv3;varying float vv4,vv5;const vec3 l=vec3(1.,1.,1.);void main(){float m=u7.x+u7.y*smoothstep(-u7.w,-u7.z,vv5);vec3 v=vec3(0.,0.,-1.),d=normalize(vv2),b=texture2D(u143,vv3).xyz;b=normalize(b*255./127.-1.007874*l);vec3 g=vv0.xyz,n=cross(d,g)*vv0.w;mat3 o=mat3(g,n,d);vec3 p=o*b;float q=u138;vec4 c=u102;float r=floor(15.99*q),s=floor(15.99*c.b);c.b=(r+16.*s)/255.;vec4 a=texture2D(u1,vv3);vec3 t=mix(u137,a.rgb,a.a);vec4 u=vec4(mix(a.rgb*u137,t,u64),a.a);gl_FragData[0]=vec4(vv1,vv4),gl_FragData[1]=vec4(p,m),gl_FragData[2]=u,gl_FragData[3]=c;}",
                  s: "attribute vec4 a3;attribute vec3 a0,a2;attribute vec2 a1;uniform sampler2D u39;uniform vec3 u133;uniform vec2 u40,u141;uniform float u134,u139,u140,u135,u136,u142;varying vec4 vv0;varying vec3 vv1,vv2;varying vec2 vv3;varying float vv4,vv5;const vec2 e=vec2(1.,1.);const vec3 t=vec3(1.,1.,1.);const vec2 H=vec2(-1.,1.),u=vec2(.16,.5),v=vec2(.5,.5),w=vec2(.84,.5);uniform mat4 u67;uniform vec3 u69,u73,u74,u75;uniform float u68,u76,u77,u70,u71,u72,u78;mat3 x(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u39,u);vec2 f=u76*e;vec3 c=u76*t;vec2 y=mix(d.a*u40,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u39,v).rgb+vec3(u70,0.,0.),u73,c);float z=mix(texture2D(u39,w).r,0.,u76);a.z+=z;mat3 h=x(a);vec3 A=mix(u133,u74,c);float B=mix(u134,u77,u76);vec3 b=mix(u69,u75,c);b.x+=u68*sin(a.y);float i=cos(a.z),j=sin(a.z);mat2 C=mat2(i,j,-j,i);b.xy=C*b.xy;float D=mix(u72,1.,u76);vec2 k=u71/y;vec3 l=a0;float E=max(0.,-a0.z-u135)*u136;l.x+=E*sign(a0.x)*(1.-u76);vec3 m=h*(l+A)*B+b;vec2 F=k*D;vec3 G=vec3(g*F,-k)+m*vec3(1.,-1.,-1.);gl_Position=u67*(vec4(u78*e,e)*vec4(G,1.)),vv2=h*a2*vec3(1.,-1.,-1.),vv0=a3,vv4=smoothstep(u139,u140,a0.z),vv3=a1,vv1=m,vv5=a0.y;}",
                  i: n.concat(E, ["u143"]),
                  H: ["a3", "a0", "a2", "a1"],
                  O: [4, 3, 3, 2],
                  ea: !0,
                };
                r.s92NNGLtextureParamsMap = {
                  name: "_",
                  h: "uniform sampler2D u1,u65;uniform vec4 u102,u7,u66;uniform vec3 u137;uniform float u138,u64;varying vec3 vv0,vv1;varying vec2 vv2;varying float vv3,vv4;vec2 j(float d,float e){float f=floor(d*255.+.01),a=pow(2.,e),g=256./a,b=f/a,c=floor(b),h=(b-c)*a;return vec2(c/(g-1.),h/(a-1.));}void main(){float g=u7.x+u7.y*smoothstep(-u7.w,-u7.z,vv4),d=u138;vec4 a=u102,e=texture2D(u65,vv2);vec2 b=j(e.b,4.);float h=1.-b.x,o=b.y;b=j(e.a,1.);float p=b.x,f=b.y;vec4 q=vec4(e.rg,o,p);float r=h;a=mix(a,q,u66*f),d=mix(d,r,u66.b*f);float s=floor(15.99*d),t=floor(15.99*a.b);a.b=(s+16.*t)/255.;vec4 c=texture2D(u1,vv2);vec3 u=mix(u137,c.rgb,c.a);vec4 v=vec4(mix(c.rgb*u137,u,u64),c.a);gl_FragData[0]=vec4(vv0,vv3),gl_FragData[1]=vec4(normalize(vv1),g),gl_FragData[2]=v,gl_FragData[3]=a;}",
                  s: "attribute vec3 a0,a2;attribute vec2 a1;uniform sampler2D u39;uniform vec3 u133;uniform vec2 u40,u141;uniform float u134,u139,u140,u135,u136,u142;varying vec3 vv0,vv1;varying vec2 vv2;varying float vv3,vv4;const vec2 e=vec2(1.,1.);const vec3 s=vec3(1.,1.,1.);const vec2 G=vec2(-1.,1.),t=vec2(.16,.5),u=vec2(.5,.5),v=vec2(.84,.5);uniform mat4 u67;uniform vec3 u69,u73,u74,u75;uniform float u68,u76,u77,u70,u71,u72,u78;mat3 w(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u39,t);vec2 f=u76*e;vec3 c=u76*s;vec2 x=mix(d.a*u40,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u39,u).rgb+vec3(u70,0.,0.),u73,c);float y=mix(texture2D(u39,v).r,0.,u76);a.z+=y;mat3 h=w(a);vec3 z=mix(u133,u74,c);float A=mix(u134,u77,u76);vec3 b=mix(u69,u75,c);b.x+=u68*sin(a.y);float i=cos(a.z),j=sin(a.z);mat2 B=mat2(i,j,-j,i);b.xy=B*b.xy;float C=mix(u72,1.,u76);vec2 k=u71/x;vec3 l=a0;float D=max(0.,-a0.z-u135)*u136;l.x+=D*sign(a0.x)*(1.-u76);vec3 m=h*(l+z)*A+b;vec2 E=k*C;vec3 F=vec3(g*E,-k)+m*vec3(1.,-1.,-1.);gl_Position=u67*(vec4(u78*e,e)*vec4(F,1.)),vv1=h*a2*vec3(1.,-1.,-1.),vv3=smoothstep(u139,u140,a0.z),vv2=a1,vv0=m,vv4=a0.y;}",
                  i: n.concat(E, K),
                  H: ["a0", "a2", "a1"],
                  O: [3, 3, 2],
                  ea: !0,
                };
                r.s92NNGLtextureNormalParamsMap = {
                  name: "_",
                  h: "uniform sampler2D u1,u143,u65;uniform vec4 u102,u7,u66;uniform vec3 u137;uniform float u138,u64;varying vec4 vv0;varying vec3 vv1,vv2;varying vec2 vv3;varying float vv4,vv5;const vec3 q=vec3(1.,1.,1.);vec2 k(float d,float e){float f=floor(d*255.+.01),a=pow(2.,e),g=256./a,b=f/a,c=floor(b),h=(b-c)*a;return vec2(c/(g-1.),h/(a-1.));}void main(){float r=u7.x+u7.y*smoothstep(-u7.w,-u7.z,vv5);vec3 E=vec3(0.,0.,-1.),g=normalize(vv2),d=texture2D(u143,vv3).xyz;d=normalize(d*255./127.-1.007874*q);vec3 h=vv0.xyz,s=cross(g,h)*vv0.w;mat3 t=mat3(h,s,g);vec3 u=t*d;float e=u138;vec4 a=u102,f=texture2D(u65,vv3);vec2 b=k(f.b,4.);float v=1.-b.x,w=b.y;b=k(f.a,1.);float x=b.x,l=b.y;vec4 y=vec4(f.rg,w,x);float z=v;a=mix(a,y,u66*l),e=mix(e,z,u66.b*l);float A=floor(15.99*e),B=floor(15.99*a.b);a.b=(A+16.*B)/255.;vec4 c=texture2D(u1,vv3);vec3 C=mix(u137,c.rgb,c.a);vec4 D=vec4(mix(c.rgb*u137,C,u64),c.a);gl_FragData[0]=vec4(vv1,vv4),gl_FragData[1]=vec4(u,r),gl_FragData[2]=D,gl_FragData[3]=a;}",
                  s: "attribute vec4 a3;attribute vec3 a0,a2;attribute vec2 a1;uniform sampler2D u39;uniform vec3 u133;uniform vec2 u40,u141;uniform float u134,u139,u140,u135,u136,u142;varying vec4 vv0;varying vec3 vv1,vv2;varying vec2 vv3;varying float vv4,vv5;const vec2 e=vec2(1.,1.);const vec3 t=vec3(1.,1.,1.);const vec2 H=vec2(-1.,1.),u=vec2(.16,.5),v=vec2(.5,.5),w=vec2(.84,.5);uniform mat4 u67;uniform vec3 u69,u73,u74,u75;uniform float u68,u76,u77,u70,u71,u72,u78;mat3 x(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u39,u);vec2 f=u76*e;vec3 c=u76*t;vec2 y=mix(d.a*u40,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u39,v).rgb+vec3(u70,0.,0.),u73,c);float z=mix(texture2D(u39,w).r,0.,u76);a.z+=z;mat3 h=x(a);vec3 A=mix(u133,u74,c);float B=mix(u134,u77,u76);vec3 b=mix(u69,u75,c);b.x+=u68*sin(a.y);float i=cos(a.z),j=sin(a.z);mat2 C=mat2(i,j,-j,i);b.xy=C*b.xy;float D=mix(u72,1.,u76);vec2 k=u71/y;vec3 l=a0;float E=max(0.,-a0.z-u135)*u136;l.x+=E*sign(a0.x)*(1.-u76);vec3 m=h*(l+A)*B+b;vec2 F=k*D;vec3 G=vec3(g*F,-k)+m*vec3(1.,-1.,-1.);gl_Position=u67*(vec4(u78*e,e)*vec4(G,1.)),vv2=h*a2*vec3(1.,-1.,-1.),vv0=a3,vv4=smoothstep(u139,u140,a0.z),vv3=a1,vv1=m,vv5=a0.y;}",
                  i: n.concat(E, ["u143"], K),
                  H: ["a3", "a0", "a2", "a1"],
                  O: [4, 3, 3, 2],
                  ea: !0,
                };
                n = "u126 u114 u127 u102 u137 u138 u7".split(" ");
                r.s92color = {
                  name: "_",
                  h: "uniform vec4 u102,u7;uniform vec3 u137;uniform float u138;varying vec3 vv0,vv1;varying float vv2,vv3;void main(){float b=u7.x+u7.y*smoothstep(-u7.w,-u7.z,vv3),c=u138;vec4 a=u102;float d=floor(15.99*c),i=floor(15.99*a.b);a.b=(d+16.*i)/255.,gl_FragData[0]=vec4(vv0,vv2),gl_FragData[1]=vec4(normalize(vv1),b),gl_FragData[2]=vec4(u137,0.),gl_FragData[3]=a;}",
                  s: "attribute vec3 a0,a2;uniform mat4 u126,u114,u127;varying vec3 vv0,vv1;varying float vv2,vv3;void main(){vec4 a=u127*vec4(a0,1.),b=u127*vec4(a2,0.);gl_Position=u126*u114*a,vv0=a.xyz,vv1=b.xyz,vv2=1.,vv3=a0.y;}",
                  i: n,
                  H: ["a0", "a2"],
                  ea: !0,
                };
                r.s92 = {
                  name: "_",
                  h: "uniform sampler2D u1;uniform vec4 u102,u7;uniform vec3 u137;uniform float u138,u64;varying vec3 vv0,vv1;varying vec2 vv2;varying float vv3,vv4;void main(){float c=u7.x+u7.y*smoothstep(-u7.w,-u7.z,vv4),d=u138;vec4 b=u102;float j=floor(15.99*d),k=floor(15.99*b.b);b.b=(j+16.*k)/255.;vec4 a=texture2D(u1,vv2);vec3 l=mix(u137,a.rgb,a.a);vec4 m=vec4(mix(a.rgb*u137,l,u64),a.a);gl_FragData[0]=vec4(vv0,vv3),gl_FragData[1]=vec4(normalize(vv1),c),gl_FragData[2]=m,gl_FragData[3]=b;}",
                  s: "attribute vec3 a0,a2;attribute vec2 a1;uniform mat4 u126,u114,u127;varying vec3 vv0,vv1;varying vec2 vv2;varying float vv3,vv4;void main(){vec4 a=u127*vec4(a0,1.),b=u127*vec4(a2,0.);gl_Position=u126*u114*a,vv2=a1,vv0=a.xyz,vv1=b.xyz,vv3=1.,vv4=a0.y;}",
                  i: n.concat(E),
                  H: ["a0", "a2", "a1"],
                  ea: !0,
                };
                var m = ["u143", "u144"];
                r.s92NormalMap = {
                  name: "_",
                  h: "uniform sampler2D u1,u143;uniform vec4 u102,u7;uniform vec3 u144,u137;uniform float u138,u64;varying vec4 vv0;varying vec3 vv1,vv2;varying vec2 vv3;varying float vv4,vv5;const vec3 l=vec3(1.,1.,1.);void main(){float m=u7.x+u7.y*smoothstep(-u7.w,-u7.z,vv5);vec3 v=vec3(0.,0.,-1.),d=normalize(vv2),b=texture2D(u143,vv3).xyz;b=normalize(b*255./127.-1.007874*l);vec3 g=vv0.xyz,n=cross(d,g)*vv0.w;mat3 o=mat3(g,n,d);vec3 p=o*b;float q=u138;vec4 c=u102;float r=floor(15.99*q),s=floor(15.99*c.b);c.b=(r+16.*s)/255.;vec4 a=texture2D(u1,vv3);vec3 t=mix(u137,a.rgb,a.a);vec4 u=vec4(mix(a.rgb*u137,t,u64),a.a);gl_FragData[0]=vec4(vv1,vv4),gl_FragData[1]=vec4(p,m),gl_FragData[2]=u,gl_FragData[3]=c;}",
                  s: "attribute vec4 a3;attribute vec3 a0,a2;attribute vec2 a1;uniform mat4 u126,u114,u127;varying vec4 vv0;varying vec3 vv1,vv2;varying vec2 vv3;varying float vv4,vv5;void main(){vec4 a=u127*vec4(a0,1.),b=u127*vec4(a2,0.);gl_Position=u126*u114*a,vv0=a3,vv3=a1,vv1=a.xyz,vv2=b.xyz,vv4=1.,vv5=a0.y;}",
                  i: n.concat(E, m),
                  H: ["a0", "a2", "a1", "a3"],
                  ea: !0,
                };
                r.s92ParamsMap = {
                  name: "_",
                  h: "uniform sampler2D u1,u65;uniform vec4 u102,u7,u66;uniform vec3 u137;uniform float u138,u64;varying vec3 vv0,vv1;varying vec2 vv2;varying float vv3,vv4;vec2 j(float d,float e){float f=floor(d*255.+.01),a=pow(2.,e),g=256./a,b=f/a,c=floor(b),h=(b-c)*a;return vec2(c/(g-1.),h/(a-1.));}void main(){float g=u7.x+u7.y*smoothstep(-u7.w,-u7.z,vv4),d=u138;vec4 a=u102,e=texture2D(u65,vv2);vec2 b=j(e.b,4.);float h=1.-b.x,o=b.y;b=j(e.a,1.);float p=b.x,f=b.y;vec4 q=vec4(e.rg,o,p);float r=h;a=mix(a,q,u66*f),d=mix(d,r,u66.b*f);float s=floor(15.99*d),t=floor(15.99*a.b);a.b=(s+16.*t)/255.;vec4 c=texture2D(u1,vv2);vec3 u=mix(u137,c.rgb,c.a);vec4 v=vec4(mix(c.rgb*u137,u,u64),c.a);gl_FragData[0]=vec4(vv0,vv3),gl_FragData[1]=vec4(normalize(vv1),g),gl_FragData[2]=v,gl_FragData[3]=a;}",
                  s: "attribute vec3 a0,a2;attribute vec2 a1;uniform mat4 u126,u114,u127;varying vec3 vv0,vv1;varying vec2 vv2;varying float vv3,vv4;void main(){vec4 a=u127*vec4(a0,1.),b=u127*vec4(a2,0.);gl_Position=u126*u114*a,vv2=a1,vv0=a.xyz,vv1=b.xyz,vv3=1.,vv4=a0.y;}",
                  i: n.concat(E, K),
                  H: ["a0", "a2", "a1"],
                  ea: !0,
                };
                r.s92NormalParamsMap = {
                  name: "_",
                  h: "uniform sampler2D u1,u143,u65;uniform vec4 u102,u7,u66;uniform vec3 u144,u137;uniform float u138,u64;varying vec4 vv0;varying vec3 vv1,vv2;varying vec2 vv3;varying float vv4,vv5;const vec3 q=vec3(1.,1.,1.);vec2 k(float d,float e){float f=floor(d*255.+.01),a=pow(2.,e),g=256./a,b=f/a,c=floor(b),h=(b-c)*a;return vec2(c/(g-1.),h/(a-1.));}void main(){float r=u7.x+u7.y*smoothstep(-u7.w,-u7.z,vv5);vec3 E=vec3(0.,0.,-1.),g=normalize(vv2),d=texture2D(u143,vv3).xyz;d=normalize(d*255./127.-1.007874*q);vec3 h=vv0.xyz,s=cross(g,h)*vv0.w;mat3 t=mat3(h,s,g);vec3 u=t*d;float e=u138;vec4 a=u102,f=texture2D(u65,vv3);vec2 b=k(f.b,4.);float v=1.-b.x,w=b.y;b=k(f.a,1.);float x=b.x,l=b.y;vec4 y=vec4(f.rg,w,x);float z=v;a=mix(a,y,u66*l),e=mix(e,z,u66.b*l);float A=floor(15.99*e),B=floor(15.99*a.b);a.b=(A+16.*B)/255.;vec4 c=texture2D(u1,vv3);vec3 C=mix(u137,c.rgb,c.a);vec4 D=vec4(mix(c.rgb*u137,C,u64),c.a);gl_FragData[0]=vec4(vv1,vv4),gl_FragData[1]=vec4(u,r),gl_FragData[2]=D,gl_FragData[3]=a;}",
                  s: "attribute vec4 a3;attribute vec3 a0,a2;attribute vec2 a1;uniform mat4 u126,u114,u127;varying vec4 vv0;varying vec3 vv1,vv2;varying vec2 vv3;varying float vv4,vv5;void main(){vec4 a=u127*vec4(a0,1.),b=u127*vec4(a2,0.);gl_Position=u126*u114*a,vv0=a3,vv3=a1,vv1=a.xyz,vv2=b.xyz,vv4=1.,vv5=a0.y;}",
                  i: n.concat(E, m, K),
                  H: ["a0", "a2", "a1", "a3"],
                  ea: !0,
                };
              } else q();
              t();
              n = [{ type: "1i", name: "u1", value: 0 }];
              B.j("s0", n);
              B.j("s1", n);
              B.j("s65", [{ type: "1i", name: "u6", value: 1 }].concat(n));
              B.j("s66", [{ type: "1i", name: "u6", value: 1 }].concat(n));
              B.j("s12", [{ type: "1i", name: "u79", value: 1 }].concat(n));
              B.j("s67", [{ type: "1i", name: "u79", value: 1 }].concat(n));
              B.j("s68", n);
              B.j("s69", n);
              B.j(
                "s70",
                [
                  { type: "1i", name: "u83", value: 1 },
                  { type: "1i", name: "u39", value: 2 },
                ].concat(n)
              );
              B.j("s71", n);
              B.j("s43", n);
              B.j("s72", [
                { type: "1i", name: "u85", value: 0 },
                { type: "1i", name: "u86", value: 1 },
              ]);
              B.j("s73", [
                { type: "1i", name: "u89", value: 0 },
                { type: "1i", name: "u90", value: 1 },
              ]);
              B.j("s74", n);
              B.j("s75", n);
              B.j("s76", n);
              B.j("s77", n);
              B.j("s78", n);
              B.j("s79", [{ type: "1i", name: "u79", value: 1 }].concat(n));
              B.j("s80", [{ type: "1i", name: "u79", value: 1 }].concat(n));
              S.ca &&
                (B.j("s84", [
                  { type: "1i", name: "u99", value: 0 },
                  { type: "1i", name: "u100", value: 1 },
                  { type: "1f", name: "u120", value: S.Tj },
                  { type: "1f", name: "u121", value: S.Uj },
                  { type: "1f", name: "u122", value: S.fk },
                  { type: "1f", name: "u123", value: S.Xj },
                  { type: "1f", name: "u124", value: S.Yj },
                  { type: "1f", name: "u119", value: 1 },
                  { type: "1f", name: "u111", value: 1 },
                ]),
                B.j("s85", n));
              m = [
                { type: "1i", name: "u99", value: 0 },
                { type: "1i", name: "u100", value: 1 },
                { type: "1i", name: "u101", value: 2 },
                { type: "1i", name: "u89", value: 3 },
                { type: "1i", name: "u103", value: 4 },
                { type: "1i", name: "u102", value: 6 },
                { type: "1i", name: "u91", value: 7 },
                { type: "1f", name: "u109", value: 0 },
                { type: "1f", name: "u106", value: 0 },
                { type: "1f", name: "u108", value: 0 },
              ];
              S.ca &&
                B.j(
                  "s82",
                  m.concat([
                    { type: "1f", name: "u111", value: S.Wj[ba.U()] },
                    { type: "1i", name: "u110", value: 5 },
                  ])
                );
              B.j(
                "s83",
                m.concat([
                  { type: "1f", name: "u112", value: S.Wb },
                  { type: "1f", name: "u113", value: S.Ed },
                ])
              );
              B.j("s87", [
                { type: "1i", name: "u128", value: 0 },
                { type: "1i", name: "u103", value: 1 },
                { type: "1i", name: "u90", value: 2 },
                { type: "1f", name: "u131", value: S.Tn },
              ]);
              B.j("s88", n);
              B.j("s89", n);
              B.j(
                "s81",
                [
                  { type: "1i", name: "u2", value: 1 },
                  { type: "1i", name: "u92", value: 2 },
                  { type: "1i", name: "u91", value: 3 },
                  { type: "1f", name: "u97", value: 1 },
                  { type: "2f", name: "u94", value: [0, 0] },
                ].concat(n)
              );
              ba.Z()
                ? (B.j("s92", n),
                  B.j(
                    "s92NormalMap",
                    [{ type: "1i", name: "u143", value: 1 }].concat(n)
                  ),
                  B.j(
                    "s92ParamsMap",
                    [{ type: "1i", name: "u65", value: 1 }].concat(n)
                  ),
                  B.j(
                    "s92NormalParamsMap",
                    [
                      { type: "1i", name: "u143", value: 1 },
                      { type: "1i", name: "u65", value: 2 },
                    ].concat(n)
                  ))
                : x();
              v = !0;
            },
            In: function () {
              q();
              t();
              x();
            },
            jd: function () {
              return h.id;
            },
            Ye: function () {
              return l;
            },
            Ze: function () {
              return w;
            },
            set: function (n) {
              ob.bj(B);
              r[n].set();
            },
            wb: function (n) {
              return k(n, p());
            },
            Jd: function (n) {
              return k(n, {
                name: "_",
                h: "void main(){gl_FragColor=vec4(.5,.5,.5,.5);}",
                i: [],
                precision: "highp",
              });
            },
            Ln: function (n) {
              return k(n, {
                name: "_",
                h: "const vec4 d=vec4(.5,.5,.5,.5);void main(){gl_FragData[0]=d,gl_FragData[1]=d,gl_FragData[2]=d,gl_FragData[3]=d;}",
                i: [],
                precision: "highp",
                ea: !0,
              });
            },
            I: function () {
              -1 !== f && h.I();
            },
            Ld: function () {
              var n = 0;
              h.ya.forEach(function (m, F) {
                F = h.O[F];
                b.vertexAttribPointer(m, F, b.FLOAT, !1, h.zg, n);
                n += 4 * F;
              });
            },
            Fc: function () {
              B.$b(b);
            },
            $b: function (n) {
              n.vertexAttribPointer(h.ya[0], 2, n.FLOAT, !1, 8, 0);
            },
            Qp: function () {
              b.vertexAttribPointer(h.attributes.a0, 3, b.FLOAT, !1, 12, 0);
            },
            Ra: function () {
              b.vertexAttribPointer(h.attributes.a0, 3, b.FLOAT, !1, 32, 0);
            },
            Za: function () {
              b.vertexAttribPointer(h.attributes.a0, 3, b.FLOAT, !1, 24, 0);
            },
            Vi: function () {
              b.vertexAttribPointer(h.attributes.a2, 3, b.FLOAT, !1, 32, 12);
            },
            Wi: function () {
              b.vertexAttribPointer(h.attributes.a2, 3, b.FLOAT, !1, 24, 12);
            },
            Dc: function () {
              b.vertexAttribPointer(h.attributes.a1, 2, b.FLOAT, !1, 32, 24);
            },
            Rp: function () {
              b.vertexAttribPointer(h.attributes.a0, 3, b.FLOAT, !1, 20, 0);
              b.vertexAttribPointer(h.attributes.a1, 2, b.FLOAT, !1, 20, 12);
            },
            zn: function () {
              b.vertexAttribPointer(h.attributes.a0, 3, b.FLOAT, !1, 32, 0);
              b.vertexAttribPointer(h.attributes.a2, 3, b.FLOAT, !1, 32, 12);
              b.vertexAttribPointer(h.attributes.a1, 2, b.FLOAT, !1, 32, 24);
            },
            An: function () {
              b.vertexAttribPointer(h.attributes.a0, 3, b.FLOAT, !1, 32, 0);
              b.vertexAttribPointer(h.attributes.a2, 3, b.FLOAT, !1, 32, 12);
            },
            Bn: function () {
              b.vertexAttribPointer(h.attributes.a0, 3, b.FLOAT, !1, 24, 0);
              b.vertexAttribPointer(h.attributes.a2, 3, b.FLOAT, !1, 24, 12);
            },
            Hd: function () {
              b.vertexAttribPointer(h.attributes.a3, 4, b.FLOAT, !1, 16, 0);
            },
            Kd: function (n, m) {
              b.uniform1i(h.A[n], m);
            },
            G: function (n, m) {
              b.uniform1f(h.A[n], m);
            },
            M: function (n, m, F) {
              b.uniform2f(h.A[n], m, F);
            },
            cj: function (n, m) {
              b.uniform2fv(h.A[n], m);
            },
            dg: function (n, m, F, O) {
              b.uniform3f(h.A[n], m, F, O);
            },
            eg: function (n, m) {
              b.uniform3fv(h.A[n], m);
            },
            va: function (n, m) {
              b.uniform4fv(h.A[n], m);
            },
            On: function (n, m) {
              b.uniformMatrix2fv(h.A[n], !1, m);
            },
            Pn: function (n, m) {
              b.uniformMatrix3fv(h.A[n], !1, m);
            },
            Ec: function (n, m) {
              b.uniformMatrix4fv(h.A[n], !1, m);
            },
            j: function (n, m) {
              B.set(n);
              m.forEach(function (F) {
                switch (F.type) {
                  case "4f":
                    b.uniform4fv(h.A[F.name], F.value);
                    break;
                  case "3f":
                    b.uniform3fv(h.A[F.name], F.value);
                    break;
                  case "2f":
                    b.uniform2fv(h.A[F.name], F.value);
                    break;
                  case "1f":
                    b.uniform1f(h.A[F.name], F.value);
                    break;
                  case "1i":
                    b.uniform1i(h.A[F.name], F.value);
                    break;
                  case "mat2":
                    b.uniformMatrix2fv(h.A[F.name], !1, F.value);
                    break;
                  case "mat4":
                    b.uniformMatrix4fv(h.A[F.name], !1, F.value);
                }
              });
            },
            K: function () {
              for (var n in r) {
                var m = r[n];
                b.detachShader(m.pa, m.bf);
                b.detachShader(m.pa, m.af);
                b.deleteShader(m.bf);
                b.deleteShader(m.af);
                b.deleteProgram(m.pa);
              }
            },
            v: function () {
              b.disableVertexAttribArray(0);
              B.I();
              B.K();
              J = 0;
              v = !1;
              h = null;
              f = -1;
            },
          };
        return B;
      })(),
      Ta = (function () {
        var a = {},
          c = [],
          e = !1,
          d = 0,
          k = 0,
          p = -1,
          x = -1,
          q = -1,
          t = 1,
          v = null,
          E = !1,
          K = null,
          l = !1,
          w = !1,
          r = !1,
          f = !1,
          h = !1,
          J = !1,
          B = !1,
          n = null,
          m = null,
          F = -1,
          O = -1,
          y = null,
          g = -1,
          G,
          u = null,
          L = null,
          H = null,
          P = null,
          U = null,
          Z = null,
          T = null,
          A = [
            { type: "1f", name: "u76", value: 0 },
            { type: "1f", name: "u139", value: 0 },
            { type: "1f", name: "u140", value: 0 },
            { type: "1f", name: "u71", value: 1 },
            { type: "1f", name: "u68", value: 0 },
            { type: "1f", name: "u78", value: 1 },
          ],
          N = {
            m: function (z, C) {
              a.gg = z;
              ba.wg();
              tc.Pe();
              Db.Pe(z.ce);
              p = z.Re;
              x = z.Co;
              q = z.Kf;
              t = z.be;
              var Q = [
                { type: "1f", name: "u71", value: p },
                { type: "1f", name: "u68", value: q },
                { type: "1f", name: "u72", value: z.pn },
                { type: "mat4", name: "u67", value: z.Vm },
                { type: "2f", name: "u40", value: z.Cj },
              ];
              z.vg = Q;
              var ea = [
                { type: "3f", name: "u73", value: [0, 0, 0] },
                { type: "3f", name: "u74", value: z.Dg },
                { type: "3f", name: "u75", value: z.Cg },
                { type: "1f", name: "u76", value: 0 },
                { type: "1f", name: "u77", value: z.ce },
                { type: "1f", name: "u78", value: 1 },
              ];
              z.sj = ea;
              N.Zl(z, C);
              e || void 0 !== z.Fa || (z.Fa = [0, 0, 120]);
              B = J = I.cf;
              if (!e && J) {
                C = 1 * ba.rb();
                var ha = 1 * ba.qb(),
                  ia = { isLinear: !0, isPot: !1, width: C, height: ha };
                n = X.instance(ia);
                m = X.instance(ia);
                F = 1 / C;
                O = 1 / ha;
              }
              Q = [
                { type: "1i", name: "u39", value: 1 },
                { type: "3f", name: "u69", value: z.Fa },
                { type: "1f", name: "u135", value: z.za },
                { type: "1f", name: "u136", value: z.ra },
              ].concat(Q, ea);
              v = z.oa;
              ea = [
                { type: "1f", name: "u139", value: v[0] },
                { type: "1f", name: "u140", value: v[1] },
              ];
              ba.Z()
                ? ((C = [{ type: "1i", name: "u1", value: 0 }]),
                  (ha = [{ type: "1i", name: "u143", value: 2 }]),
                  D.j("s92NNGLcolor", Q.concat(ea)),
                  D.j("s92NNGLtexture", [].concat(C, Q, ea)),
                  D.j("s92NNGLtextureNormalMap", [].concat(C, ha, Q, ea)),
                  D.j(
                    "s92NNGLtextureParamsMap",
                    [{ type: "1i", name: "u65", value: 2 }].concat(C, Q, ea)
                  ),
                  D.j(
                    "s92NNGLtextureNormalParamsMap",
                    [{ type: "1i", name: "u65", value: 3 }].concat(C, ha, Q, ea)
                  ))
                : (D.j("s96", Q.concat(ea)),
                  D.j("s97", [{ type: "1i", name: "u1", value: 0 }].concat(Q)),
                  D.j("s98", Q),
                  D.j("s99", Q),
                  D.j(
                    "s100",
                    Q.concat([{ type: "1i", name: "u143", value: 0 }])
                  ),
                  D.j("s101", Q),
                  D.j(
                    "s102",
                    Q.concat([{ type: "1i", name: "u65", value: 0 }])
                  ));
              D.j("s70", [{ type: "2f", name: "u84", value: z.ng }]);
              D.j(S.ca ? "s82" : "s83", [
                { type: "1f", name: "u106", value: z.pe },
                { type: "3f", name: "u107", value: z.Tf },
                { type: "1f", name: "u108", value: z.De },
                { type: "1f", name: "u109", value: 1 },
                { type: "3f", name: "u104", value: z.Kj },
              ]);
              if ((G = z.xd))
                (y = z.zm),
                  (g = z.yd),
                  D.j("s81", [
                    { type: "4f", name: "u93", value: z.wd },
                    { type: "1f", name: "u96", value: z.Bf },
                    { type: "2f", name: "u94", value: z.ym },
                    { type: "1f", name: "u98", value: Math.sign(g) },
                  ]);
              c.forEach(function (sa) {
                sa.Si(z);
              });
              e = !0;
            },
            Yb: function (z) {
              w && va.ka.Yb(z);
              r && va.sa.Yb(z);
            },
            Zl: function (z, C) {
              void 0 !== va.ka &&
                z.bc &&
                ba.Z() &&
                (va.ka.m(z),
                (l = !0),
                C.push(function (Q) {
                  va.ka.Yb(Q);
                  w = !0;
                }));
              void 0 !== va.sa &&
                z.Wc &&
                (va.sa.m(z),
                C.push(function (Q) {
                  va.sa.Yb(Q);
                  r = !0;
                }));
              void 0 !== va.ic && z.ue && (va.ic.m(z), (h = f = !0));
              void 0 !== va.kb &&
                (va.kb.m(z),
                (K = va.kb.am({
                  width: z.sc,
                  height: 2 * z.sc,
                  depth: 1.5 * z.sc,
                  jl: -z.gf,
                  Ua: z.ef,
                  Kk: z.ff,
                })),
                (E = !0));
            },
            Nn: function (z, C, Q, ea) {
              z &&
                ((T = z),
                l && va.ka.Zb(z),
                r && va.sa.Zb(z),
                f && va.ic.Zb(z),
                c.forEach(function (ha) {
                  ha.Zb(z);
                }));
              Q && (P = Q);
              ea && (U = ea);
            },
            xb: function (z) {
              ba.Z()
                ? (D.j("s92NNGLcolor", z),
                  D.j("s92NNGLtexture", z),
                  D.j("s92NNGLtextureNormalMap", z),
                  D.j("s92NNGLtextureParamsMap", z),
                  D.j("s92NNGLtextureNormalParamsMap", z))
                : (D.j("s96", z),
                  D.j("s97", z),
                  D.j("s98", z),
                  D.j("s99", z),
                  D.j("s100", z),
                  D.j("s101", z),
                  D.j("s102", z));
            },
            ab: function (z, C, Q) {
              var ea = [z[0] + C[0], z[1] + C[1], z[2] + C[2]];
              ea = [ea[0] + Q[0], ea[1] + Q[1], ea[2] + Q[2]];
              a.Ga = ea;
              a.Gm = C;
              a.qo = Q;
              N.xb([{ type: "3f", name: "u133", value: ea }]);
              ba.Z() && (l && va.ka.ab(z, C, Q), r && va.sa.ab(ea));
              E && va.kb.ab(z);
            },
            bb: function (z, C, Q) {
              var ea = z * C * Q;
              a.Hm = C;
              a.ro = Q;
              a.Tl = z;
              N.xb([{ type: "1f", name: "u134", value: ea }]);
              ba.Z() && (l && va.ka.bb(z * C, Q), r && va.sa.bb(ea));
              E && va.kb.bb(z);
            },
            Li: function () {
              N.ab(a.Ga, a.Gm, a.qo);
              N.bb(a.Tl, a.Hm, a.ro);
              N.$i(a.Bc);
              N.m(a.gg);
              N.Xi(a.nk, a.ra);
            },
            $i: function (z) {
              a.Bc = z;
              N.xb([{ type: "1f", name: "u70", value: z }]);
              ba.Z() && (l && va.ka.bg(z), r && va.sa.bg(z));
            },
            Xi: function (z, C) {
              a.nk = z;
              a.ra = C;
              N.xb([
                { type: "1f", name: "u135", value: z },
                { type: "1f", name: "u136", value: C },
              ]);
            },
            Gn: function (z) {
              v = z;
              0 === d &&
                N.xb([
                  { type: "1f", name: "u139", value: v[0] },
                  { type: "1f", name: "u140", value: v[1] },
                ]);
            },
            $a: function (z) {
              function C() {
                E && va.kb.toggle(!1);
                G && D.j("s81", [{ type: "1f", name: "u97", value: 0 }]);
              }
              0 >= z
                ? ((k = 0),
                  0 !== d &&
                    ((d = 0),
                    Db.jn(),
                    E && va.kb.toggle(!0),
                    G && D.j("s81", [{ type: "1f", name: "u97", value: 1 }])))
                : 1 <= z
                ? ((k = 1), 1 !== d && ((d = 1), Db.hj(!0)), C())
                : ((k = z), 2 !== d && (Db.hj(!1), (d = 2), C()));
              D.j("s83", [{ type: "1f", name: "u109", value: 1 - z }]);
              A[0].value = k;
              A[1].value = v[0] * (1 - z) + -300 * z;
              A[2].value = v[1] * (1 - z) + -300 * z;
              A[3].value = p * (1 - z) + z * x;
              A[4].value = q * (1 - z);
              A[5].value = 1 - z + z * t;
              w && va.ka.cg(k, A);
              r && va.sa.cg(k, A);
              N.xb(A);
            },
            fl: function (z) {
              T.g(1);
              z.forEach(function (C) {
                C.$k();
              });
              E && K.W();
            },
            rm: function () {
              return 1 === d;
            },
            re: function (z) {
              T.Hb(z);
            },
            Pj: function (z) {
              c.push(z);
            },
            lg: function (z) {
              w = z && l;
            },
            kg: function (z) {
              h = z && f;
            },
            Zf: function (z) {
              r && ba.Z() && va.sa.Qn(z);
            },
            yb: function (z) {
              ba.Z() && (l && va.ka.yb(z), r && va.sa.yb(z));
            },
            cl: function (z, C) {
              if (!B) return !1;
              n.S();
              z.g(0);
              D.set("s74");
              D.M("u8", 0, O);
              Y.l(!1, !1);
              m.o();
              n.g(0);
              D.M("u8", F, 0);
              Y.l(!1, !1);
              D.set("s75");
              C.S();
              m.g(0);
              Y.l(!1, !1);
              return !0;
            },
            gj: function (z) {
              B = z && J;
            },
            resize: function (z, C, Q) {
              J &&
                ((z *= Q),
                (C *= Q),
                n.resize(z, C),
                m.resize(z, C),
                (F = 1 / z),
                (O = 1 / C));
            },
            Xf: function (z, C) {
              var Q = z.L(),
                ea = z.T(),
                ha = { width: Q, height: ea, isPot: !1 };
              l && (H && H.remove(), (H = X.instance(ha)));
              u = za.instance({ width: Q, height: ea });
              f || r
                ? (va.ic.Yf(Q, ea), L && L.remove(), (L = X.instance(ha)))
                : (L = z);
              l && va.ka.Yf(Q, ea);
              C && (Z && Z.remove(), (Z = X.instance(ha)));
            },
            Yk: function (z) {
              var C = null;
              switch (d) {
                case 0:
                  C = z;
                  break;
                case 2:
                  u.bind(!1, !0);
                  Z.o();
                  D.set("s65");
                  D.G("u7", k);
                  z.g(1);
                  U.g(0);
                  Y.l(!0, !0);
                  C = Z;
                  break;
                case 1:
                  C = U;
              }
              if (!w || 1 === d || !ba.Z()) return C;
              C.Hb(0);
              h && va.ic.W(C, L);
              u.bind(!1, !h);
              r && (h ? C.g(0) : (L.o(), D.set("s1"), Y.l(!0, !0)), va.sa.W());
              L.g(0);
              P.Hb(2);
              va.ka.W();
              H.o();
              D.set("s1");
              h || r ? L.g(0) : C.g(0);
              Y.l(!0, !S.ca);
              va.ka.add();
              return H;
            },
            dl: function (z, C) {
              if (!G) return !1;
              D.set("s81");
              D.G("u95", z * g);
              y.g(1);
              Ta.re(2);
              L ? L.g(3) : C.g(3);
              return !0;
            },
            v: function () {
              e = !1;
              k = d = 0;
              q = x = p = -1;
              t = 1;
              v = null;
              E = !1;
              K = null;
              h = f = r = w = l = !1;
              va.ka.v();
              va.jb.v();
            },
          };
        return N;
      })(),
      ua = (function () {
        function a() {
          q.forEach(function (C) {
            C.gl(P);
          });
        }
        function c() {
          q.forEach(function (C) {
            C.$c(P);
          });
        }
        function e() {
          q.forEach(function (C) {
            C.el(P);
          });
        }
        function d() {
          q.forEach(function (C) {
            C.ad(P);
          });
        }
        function k() {
          P
            ? Ta.fl(q)
            : q.forEach(function (C) {
                C.al();
              });
        }
        function p() {
          u && clearTimeout(u);
          u = setTimeout(function () {
            u = F = !1;
          }, 16);
        }
        function x(C) {
          C();
        }
        var q = [],
          t = [],
          v = { fa: !1, position: !1, tb: !1 },
          E = [],
          K = [],
          l = null,
          w = 0,
          r = null,
          f = null,
          h = null,
          J = null,
          B = !1,
          n = !1,
          m = !1,
          F = !1,
          O = !1,
          y = !1,
          g = null,
          G = null,
          u = null,
          L = null,
          H = !1,
          P = !1,
          U = !1,
          Z = !1,
          T = !1,
          A = !1,
          N = !1,
          z = {
            m: function () {
              b.enable(b.DEPTH_TEST);
              b.depthFunc(b.LEQUAL);
              b.clearDepth(1);
              S.Ik
                ? (b.enable(b.CULL_FACE),
                  b.frontFace("CCW" === S.Jk ? b.CCW : b.CW),
                  b.cullFace(b.BACK))
                : b.disable(b.CULL_FACE);
              z.Wg();
              var C = {
                isPot: !1,
                isLinear: !1,
                width: ba.rb(),
                height: ba.qb(),
                F: 4,
                isFloat: !1,
              };
              r = X.instance(C);
              C = Object.assign({}, C, {
                isLinear: !0,
                width: ba.L(),
                height: ba.T(),
              });
              f = X.instance(C);
              h = X.instance(C);
              S.Oa &&
                ((C = Object.assign({}, C, { isLinear: !1 })),
                (J = X.instance(C)));
              y = Aa.da();
              S.Oa ||
                (l = Wb.instance({ Gb: S.Gb, nc: S.nc, oc: S.oc, mc: S.mc }));
              B = !0;
            },
            Wg: function () {
              ba.Z()
                ? (v = jc.instance({}))
                : ((v.fa = zb.instance({
                    ac: S.Oa ? !1 : "s93",
                    isFloat: !1,
                    Pb: !0,
                    clearColor: [0, 0, 0, 0],
                    F: 4,
                  })),
                  (v.position = zb.instance({
                    ac: S.Oa ? !1 : "s103",
                    isFloat: !0,
                    Pb: !0,
                    clearColor: [0, 0, 0, 0],
                    F: 4,
                  })),
                  (v.tb = zb.instance({
                    ac: !1,
                    isFloat: !0,
                    Pb: !0,
                    clearColor: [0, 0, 0, 0],
                    F: 4,
                  })),
                  (v.xc = zb.instance({
                    ac: !1,
                    isFloat: !1,
                    Pb: !0,
                    clearColor: [0, 0, 0, 0],
                    F: 4,
                  })));
            },
            Dl: function () {
              return l;
            },
            ua: function (C) {
              l = C;
            },
            eq: function () {},
            yb: function (C) {
              Ta.yb(C);
            },
            Si: function (C) {
              Ta.m(C, E);
              ba.Z() || (v.fa.aj(!1), v.position.aj("s96"));
              P = Z = !0;
            },
            Np: function () {
              Ta.Li();
            },
            Ko: function (C) {
              Ta.Pj(C);
            },
            vn: function (C, Q, ea) {
              Ta.ab(C, Q, ea);
            },
            wn: function (C, Q, ea) {
              Ta.bb(C, Q, ea);
            },
            tn: function (C, Q) {
              Ta.Xi(C, Q);
            },
            un: function (C) {
              Ta.Gn(C);
            },
            xn: function (C) {
              Ta.$i(C);
            },
            $a: function (C) {
              Ta.$a(C);
            },
            Ti: function (C, Q, ea, ha) {
              Ta.Nn(C, Q, ea, ha);
              Q && z.Xf(Q, ha ? !0 : !1);
              U = !0;
            },
            lg: function (C) {
              Ta.lg(C);
            },
            Zf: function (C) {
              Ta.Zf(C);
            },
            kg: function (C) {
              Ta.kg(C);
            },
            gj: function (C) {
              Ta.gj(C);
            },
            Lo: function (C) {
              H &&
                ((T = !0),
                (A = X.instance({ width: L.L(), height: L.T(), isPot: !1 })),
                (N = C));
            },
            Xf: function (C, Q) {
              L =
                "string" === typeof C ? X.instance({ url: C, isFloat: !1 }) : C;
              P && Ta.Xf(L, Q);
              H = !0;
            },
            Oj: function (C) {
              q.push(C);
              0 !== E.length &&
                (E.forEach(function (Q) {
                  Q(C);
                }),
                E.splice(0, E.length));
            },
            fn: function (C) {
              C = q.indexOf(C);
              -1 !== C && q.splice(C, 1);
            },
            Mo: function (C) {
              t.push(C);
            },
            Kp: function (C) {
              C = t.indexOf(C);
              -1 !== C && t.splice(C, 1);
            },
            Qd: function (C) {
              P && (n = C);
            },
            animate: function (C) {
              !S.Oa || (P && U)
                ? n &&
                  (F || (w > S.Im && O)
                    ? (g && clearTimeout(g),
                      ++w,
                      window.cancelAnimationFrame(z.animate),
                      (g = setTimeout(function () {
                        window.requestAnimationFrame(z.animate);
                      }, 16)))
                    : (z.Gi(C),
                      ++w,
                      P || (n && window.requestAnimationFrame(z.animate))))
                : setTimeout(z.animate, 100);
            },
            Po: function (C) {
              K.push(C);
            },
            Gi: function (C) {
              if ((!S.Oa || (P && U)) && B) {
                K.forEach(x);
                if (ba.Z()) {
                  if (!v.set() && !ba.ia()) {
                    ba.eo();
                    z.Wg();
                    zb.Qc();
                    D.In();
                    S.Oa && Ta.Li();
                    b.flush();
                    window.requestAnimationFrame(z.animate);
                    return;
                  }
                  P || oc.hn();
                  k();
                  v.I();
                  y && b.depthMask(!1);
                } else
                  P && Ta.re(1),
                    v.fa.set(!0, !0, !0),
                    c(),
                    v.fa.I(),
                    y && b.depthMask(!1),
                    v.xc.set(!1, !y, !1),
                    e(),
                    v.xc.I(),
                    v.position.set(!0, !y, !1),
                    lb.W(),
                    a(),
                    v.position.I(),
                    v.tb.set(!1, !y, !1),
                    d(),
                    v.tb.I();
                b.disable(b.DEPTH_TEST);
                y || b.depthMask(!1);
                S.ca && vb.W();
                var Q = z.rh();
                null !== Q &&
                  (Q.g(7),
                  D.set(S.ca ? "s82" : "s83"),
                  D.M("u8", 1 / ba.rb(), 1 / ba.qb()),
                  zb.pk(),
                  r.S(),
                  S.Ym
                    ? (b.enable(b.BLEND),
                      b.clearColor(0, 0, 0, 0),
                      b.clear(b.COLOR_BUFFER_BIT),
                      b.blendFunc(b.ONE, b.ONE_MINUS_SRC_ALPHA))
                    : b.disable(b.BLEND),
                  P || lb.Oe(),
                  v.position.g(0),
                  v.tb.g(1),
                  v.fa.g(2),
                  l.Tc(3),
                  v.xc.g(6),
                  l.Uc(4),
                  l.ah(),
                  S.ca && vb.g(5),
                  Y.l(!0, !0),
                  za.ma(),
                  Ta.cl(r, f) || (D.set("s1"), f.S(), r.g(0), Y.l(!1, !1)),
                  D.set("s71"),
                  h.S(),
                  f.g(0),
                  Y.l(!1, !1),
                  f.o(),
                  h.g(0),
                  Z && P
                    ? (D.set("s70"),
                      J.g(1),
                      Ta.re(2),
                      Y.l(!1, !1),
                      D.set("s1"),
                      J.S(),
                      f.g(0),
                      Y.l(!1, !1))
                    : (D.set("s69"), Y.l(!1, !1), f.g(0)),
                  za.$(),
                  b.viewport(0, 0, ba.L(), ba.T()),
                  (P && Ta.dl(C, Q)) || D.set("s1"),
                  Y.l(!1, !1),
                  b.enable(b.DEPTH_TEST),
                  b.depthMask(!0),
                  b.flush());
              }
            },
            rh: function () {
              if (!H) return X.Bh();
              if (!P) return L;
              if (T && !Ta.rm()) {
                D.set(N);
                za.ma();
                A.Gc();
                A.o();
                L.g(0);
                var C = A;
                Y.l(!0, !0);
              } else C = L;
              return Ta.Yk(C);
            },
            Xn: function () {
              S.Ok ||
                n ||
                ((n = !0),
                z.animate(Date.now()),
                m || kc.Yn(),
                m || Db.hc(!1),
                G && clearTimeout(G),
                S.ca && vb.Id(),
                (G = setTimeout(z.Ca, S.kk)),
                m || ba.Wl(),
                (m = !0));
            },
            bq: function () {
              n && ((O = n = !1), cancelAnimationFrame(z.animate));
            },
            Ca: function () {
              O ||
                !m ||
                F ||
                S.Zg ||
                ((O = F = !0),
                G && clearTimeout(G),
                u && clearTimeout(u),
                lb.Ue().Ii(),
                (G = setTimeout(function () {
                  ba.xg(S.Nm);
                  S.ca && vb.tj();
                  w = 0;
                  p();
                }, 24)));
            },
            wake: function () {
              O &&
                m &&
                !F &&
                ((F = !0),
                (O = !1),
                (w = 0),
                lb.Ue().Ii(),
                G && clearTimeout(G),
                u && clearTimeout(u),
                (G = setTimeout(function () {
                  ba.xg(1);
                  S.ca && vb.Id();
                  p();
                }, 16)));
            },
            xp: function () {},
            cp: function () {},
            Pd: function (C) {
              Z = C;
            },
            jq: function () {
              D.j("s83", [
                { type: "1f", name: "u112", value: S.Wb },
                { type: "1f", name: "u113", value: S.Ed },
              ]);
            },
            resize: function (C, Q, ea) {
              r.resize(C * ea, Q * ea);
              f.resize(C, Q);
              h.resize(C, Q);
              S.Oa && J.resize(C, Q);
              Ta.resize(C, Q, ea);
              C = [{ type: "2f", name: "u8", value: [1 / C, 1 / Q] }];
              D.j("s71", C);
              D.j("s69", C);
            },
            K: function () {
              g && clearTimeout(g);
              G && clearTimeout(G);
              u && clearTimeout(u);
              q.concat(t).forEach(function (C) {
                C.K();
              });
              q.splice(0, q.length);
              t.splice(0, t.length);
              v.fa.remove();
              v.tb.remove();
              v.xc.remove();
              v.position.remove();
              r.remove();
              f.remove();
              h.remove();
              J && J.remove();
              F = !0;
            },
            v: function () {
              z.K();
              y = O = F = m = n = P = U = F = !1;
            },
          };
        return z;
      })(),
      va = {},
      ba = (function () {
        function a() {
          zb.resize(e * t, d * t);
          r.Z() && jc.resize(e * t, d * t);
          ua.resize(e, d, t);
          S.ca && vb.resize(e * t, d * t, t);
          r.wg();
        }
        var c = null,
          e = 0,
          d = 0,
          k = -1,
          p = !1,
          x = {
            Sd: !1,
            og: !1,
            qj: !1,
            hg: !1,
            drawBuffers: !1,
            km: !1,
            Uh: !1,
            mm: !1,
            vc: !1,
            Xa: !1,
          },
          q = Object.assign({}, x),
          t = 1,
          v = !1,
          E = !1,
          K = !1,
          l = !1,
          w = !1,
          r = {
            m: function (f) {
              void 0 !== f.onload && f.onload && (E = f.onload);
              void 0 === f.expand && (f.expand = !1);
              void 0 === f.sd && (f.sd = !1);
              void 0 === f.ta && (f.ta = !1);
              void 0 === f.Ob && (f.Ob = !1);
              void 0 === f.alpha && (f.alpha = !1);
              void 0 === f.preserveDrawingBuffer &&
                (f.preserveDrawingBuffer = !1);
              f.sd && (p = !0);
              c = f.ta ? f.ta : document.getElementById(f.Ck);
              f.expand && r.expand();
              try {
                window.Ho = f.Ob
                  ? f.Ob.ol()
                  : c.getContext("webgl", {
                      antialias: !1,
                      alpha: f.alpha,
                      depth: !0,
                      premultipliedAlpha: !1,
                      stencil: !1,
                      preserveDrawingBuffer: f.preserveDrawingBuffer,
                    });
                l = f.Ob ? f.Ob.ia() : !1;
                K = !l;
                8 > b.getParameter(b.MAX_TEXTURE_IMAGE_UNITS) &&
                  r.Xc("too few texture image units");
                if (!Aa.m()) return r.Xc("invalid config");
                S.no &&
                  ((q.og = b.getExtension("EXT_texture_filter_anisotropic")),
                  q.og && (q.Uh = !0));
                S.oo &&
                  ((q.Sd = b.getExtension("WEBGL_compressed_texture_s3tc")),
                  q.Sd &&
                    void 0 !== q.Sd.COMPRESSED_RGBA_S3TC_DXT5_EXT &&
                    q.Sd.COMPRESSED_RGBA_S3TC_DXT5_EXT &&
                    (q.km = !0));
                K &&
                  ((q.qj =
                    b.getExtension("OES_element_index_uint") ||
                    b.getExtension("MOZ_OES_element_index_uint") ||
                    b.getExtension("WEBKIT_OES_element_index_uint")),
                  q.qj && (q.mm = !0));
                !l &&
                  S.po &&
                  ((q.hg = b.getExtension("EXT_sRGB")), q.hg && (q.vc = !0));
                K
                  ? ((q.drawBuffers = b.getExtension("WEBGL_draw_buffers")),
                    q.drawBuffers && !S.Yg && (q.Xa = !0))
                  : (q.Xa = 4 <= b.getParameter(b.MAX_DRAW_BUFFERS));
                if (q.Xa) {
                  var h = r.Rk();
                  q.Xa = q.Xa && h;
                }
              } catch (J) {
                return r.Xc(J);
              }
              if (null === b || !b) return r.Xc("NO_GL");
              f.expand && window.addEventListener("resize", r.expand, !1);
              c.addEventListener(
                "contextmenu",
                function (J) {
                  J.preventDefault();
                  return !1;
                },
                !1
              );
              e = c.width;
              d = c.height;
              r.lf();
              return !0;
            },
            lf: function () {
              k = p ? 3 : 2;
              Aa.da() || (k = Math.min(k, 1));
              Aa.yk() || (k = Math.min(k, 0));
              tc.m();
              zb.m();
              for (var f in va) va[f].Ac();
              D.m();
              lb.m();
              Db.m();
              ua.m();
              kc.m();
              S.ca && vb.m();
              "undefined" !== typeof FPSCounter && FPSCounter.m();
              r.wg();
              r.Tk();
              v = !0;
              E && E();
              return !0;
            },
            Tk: function () {
              if (q.Xa) {
                var f = jc.instance({ width: 256, height: 1 });
                f.bind();
                b.viewport(0, 0, 256, 1);
                D.set("s91");
                D.va("color", [1, 0, 0, 1]);
                Y.l(!0, !0);
                b.clearColor(0, 0, 0, 0);
                b.clear(b.COLOR_BUFFER_BIT || b.DEPTH_BUFFER_BIT);
                za.$();
                D.set("s1");
                f.tb.g(0);
                Y.l(!1, !1);
                f = new Uint8Array(1024);
                b.readPixels(0, 0, 256, 1, b.RGBA, b.UNSIGNED_BYTE, f);
                w = 1 >= f[1020];
              }
            },
            Rk: function () {
              var f = jc.instance({ width: 1, height: 1 });
              if (!f.set()) return f.remove(), !1;
              D.Ln(b);
              Y.Lb(b);
              b.bindFramebuffer(b.FRAMEBUFFER, null);
              D.wb(b);
              f.fa.Hb(0);
              Y.Lb(b);
              var h = new Uint8Array(4);
              b.readPixels(0, 0, 1, 1, b.RGBA, b.UNSIGNED_BYTE, h);
              f.remove();
              return 3 < Math.abs(h[0] - 127) ? !1 : !0;
            },
            ia: function () {
              return l;
            },
            L: function () {
              return e;
            },
            T: function () {
              return d;
            },
            rb: function () {
              return t * r.L();
            },
            qb: function () {
              return t * r.T();
            },
            ql: function () {
              return e / d;
            },
            U: function () {
              return k;
            },
            pm: function () {
              return 3 === k;
            },
            Xh: function () {
              return w;
            },
            Z: function () {
              return q.Xa;
            },
            eo: function () {
              q.Xa = !1;
            },
            Cp: function () {
              return !1;
            },
            Ak: function () {
              return 0 < r.U();
            },
            Vo: function () {
              return r.Z() && 0 < r.U();
            },
            Te: function (f) {
              var h = b,
                J = "";
              l || ((h = q.drawBuffers), (J = "_WEBGL"));
              return [
                h["COLOR_ATTACHMENT0" + J],
                h["COLOR_ATTACHMENT1" + J],
                h["COLOR_ATTACHMENT2" + J],
                h["COLOR_ATTACHMENT3" + J],
              ].splice(0, f);
            },
            hd: function (f) {
              return r.Te(4)[f];
            },
            Pl: function () {
              return l
                ? b.SRGB
                  ? b.SRGB
                  : b.RGBA
                : q.vc
                ? q.hg.SRGB_ALPHA_EXT
                : b.RGBA;
            },
            nm: function () {
              return q.Uh;
            },
            wl: function () {
              return q.og;
            },
            Cm: function (f) {
              r.ia()
                ? b.drawBuffers(r.Te(f))
                : q.drawBuffers.drawBuffersWEBGL(r.Te(f));
            },
            expand: function () {
              ua.wake();
              r.resize(window.innerWidth, window.innerHeight);
              ua.Ca();
            },
            resize: function (f, h) {
              !c ||
                (f === e && h === d) ||
                ((e = f),
                (d = h),
                (c.width = e),
                (c.height = d),
                v && (lb.resize(), a()));
            },
            wg: function () {
              var f = [
                { type: "2f", name: "u8", value: [1 / ba.rb(), 1 / ba.qb()] },
              ];
              D.j("s71", f);
              D.j("s69", f);
            },
            xg: function (f) {
              t = f;
              a();
            },
            Ja: function (f, h) {
              c.addEventListener(f, h, !1);
            },
            Xc: function () {
              k = -1;
              return !1;
            },
            Rg: function () {
              return 0 <= k;
            },
            Fp: function () {},
            Op: function () {},
            aq: function () {
              var f = document.getElementById("loading");
              f && (f.style.display = "block");
            },
            Wl: function () {
              var f = document.getElementById("loading");
              f && (f.style.display = "none");
            },
            K: function () {
              r.Rg() &&
                (X.rj(),
                ua.K(),
                Y.K(),
                zb.K(),
                S.ca && vb.K(),
                Wb.K(),
                kc.K(),
                D.K(),
                X.K(),
                b.flush(),
                (b = null));
            },
            v: function () {
              ua.v();
              Ta.v();
              D.v();
              Object.assign(q, x);
              v = !1;
            },
          };
        return r;
      })(),
      lb = (function () {
        var a = !1,
          c = !1,
          e = [];
        return {
          m: function () {},
          instance: function (d) {
            void 0 === d.Ji && (d.Ji = !0);
            void 0 === d.fe && (d.fe = 0.1);
            void 0 === d.ee && (d.ee = 100);
            void 0 === d.direction && (d.direction = [0, 0, -1]);
            void 0 === d.Mb && (d.Mb = 45);
            var k = new Qb(),
              p = new Ra(50, -50, -400),
              x = null;
            k.setPosition(p);
            var q = new Int8Array(20),
              t = new Int8Array(20),
              v = 0,
              E = 0,
              K = 0,
              l = 0,
              w = {
                W: function () {
                  t[D.jd()] || (D.Ec("u114", k.elements), (t[D.jd()] = 1));
                  q[D.jd()] || (D.Ec("u126", x), (q[D.jd()] = 1));
                },
                Ne: function () {
                  E || (D.Ec("u114", k.elements), (E = 1));
                  v || (D.M("u115", x[0], x[5]), (v = 1));
                },
                Oe: function () {
                  K || (D.dg("u104", p.x, p.y, p.z), (K = 1));
                },
                Jb: function () {
                  l || (D.dg("u144", p.x, p.y, p.z), (l = 1));
                },
                Tg: function () {
                  var r = d.fe,
                    f = d.ee,
                    h = Math.tan((0.5 * d.Mb * Math.PI) / 180);
                  x = [
                    0.5 / h,
                    0,
                    0,
                    0,
                    0,
                    (0.5 * ba.ql()) / h,
                    0,
                    0,
                    0,
                    0,
                    -(f + r) / (f - r),
                    -1,
                    0,
                    0,
                    (-2 * f * r) / (f - r),
                    0,
                  ];
                  for (r = 0; 20 > r; ++r) q[r] = 0;
                  v = 0;
                },
                Hn: function (r, f) {
                  p.Qi(f[0]).Ri(f[1]).z = f[2];
                  k.elements.set(r);
                  for (r = 0; 20 > r; ++r) t[r] = 0;
                  l = K = E = 0;
                },
                Ii: function () {
                  for (var r = (l = K = 0); 20 > r; ++r) t[r] = 0;
                },
              };
            w.Tg();
            a = w;
            c = !0;
            d.Ji && e.push(w);
            return w;
          },
          W: function () {
            c && a.W();
          },
          Ne: function () {
            c && a.Ne();
          },
          Oe: function () {
            c && a.Oe();
          },
          Jb: function () {
            c && a.Jb();
          },
          resize: function () {
            e.forEach(function (d) {
              d.Tg();
            });
          },
          Ue: function () {
            return a;
          },
        };
      })(),
      zb = (function () {
        var a = [],
          c = null;
        return {
          m: function () {
            c = za.instance({ width: ba.rb(), height: ba.qb(), tc: !ba.Z() });
          },
          instance: function (e) {
            void 0 === e.width && (e.width = ba.rb());
            void 0 === e.height && (e.height = ba.qb());
            void 0 === e.isFloat && (e.isFloat = !1);
            void 0 === e.Pb && (e.Pb = !1);
            void 0 === e.clearColor && (e.clearColor = [0, 0, 0, 0]);
            void 0 === e.F && (e.F = 4);
            var d = X.instance({
                isFloat: e.isFloat && Aa.da(),
                R: e.isFloat,
                width: e.width,
                height: e.height,
                isPot: !1,
                isLinear: !1,
                F: e.F,
              }),
              k = void 0 !== e.ac && e.ac ? !0 : !1,
              p = e.ac,
              x = {
                set: function (q, t, v) {
                  v && c.bind(!1, v);
                  d.o();
                  q &&
                    (b.clearColor(
                      e.clearColor[0],
                      e.clearColor[1],
                      e.clearColor[2],
                      e.clearColor[3]
                    ),
                    c.ze());
                  t && c.Sg();
                  k && D.set(p);
                },
                aj: function (q) {
                  k = (p = q) ? !0 : !1;
                },
                I: function () {
                  d.Vd();
                },
                g: function (q) {
                  d.g(q);
                },
                resize: function (q, t) {
                  d.resize(q, t);
                },
                debug: function () {
                  d.debug();
                },
                remove: function () {
                  d.remove();
                },
              };
            e.Pb && a.push(x);
            return x;
          },
          resize: function (e, d) {
            c.resize(e, d);
            a.forEach(function (k) {
              k.resize(e, d);
            });
          },
          pk: function () {
            c.Lg();
          },
          Qc: function () {
            c.Qc();
          },
          Gc: function () {
            c.Gc();
          },
          Yo: function () {
            c.Sg();
          },
          Xo: function () {
            c.ze();
          },
          Wo: function () {
            c.clear();
          },
          K: function () {
            c.remove();
          },
        };
      })(),
      jc = (function () {
        var a = [];
        return {
          instance: function (c) {
            void 0 === c.width && (c.width = ba.rb());
            void 0 === c.height && (c.height = ba.qb());
            var e = b.createFramebuffer(),
              d = c.width,
              k = c.height,
              p = !0;
            c = {
              isFloat: Aa.da(),
              R: !0,
              width: d,
              height: k,
              isPot: !1,
              isLinear: !1,
              F: 4,
            };
            var x = X.instance(c),
              q = X.instance(c),
              t = X.instance(c),
              v = X.instance(c),
              E = za.xl(),
              K = za.wh();
            b.bindFramebuffer(E, e);
            var l = b.createRenderbuffer();
            b.bindRenderbuffer(b.RENDERBUFFER, l);
            b.renderbufferStorage(b.RENDERBUFFER, b.DEPTH_COMPONENT16, d, k);
            b.framebufferRenderbuffer(E, b.DEPTH_ATTACHMENT, b.RENDERBUFFER, l);
            b.clearDepth(1);
            b.framebufferTexture2D(E, ba.hd(0), b.TEXTURE_2D, x.get(), 0);
            b.framebufferTexture2D(E, ba.hd(1), b.TEXTURE_2D, q.get(), 0);
            b.framebufferTexture2D(E, ba.hd(2), b.TEXTURE_2D, v.get(), 0);
            b.framebufferTexture2D(E, ba.hd(3), b.TEXTURE_2D, t.get(), 0);
            ba.Cm(4);
            b.bindFramebuffer(E, null);
            za.reset();
            var w = {
              position: x,
              tb: q,
              xc: t,
              fa: v,
              bind: function () {
                b.bindFramebuffer(E, e);
                za.reset();
              },
              set: function () {
                b.checkFramebufferStatus(K);
                b.bindFramebuffer(E, e);
                za.reset();
                if (p) {
                  if (b.checkFramebufferStatus(K) !== b.FRAMEBUFFER_COMPLETE)
                    return !1;
                  p = !1;
                }
                b.viewport(0, 0, d, k);
                b.clearColor(0, 0, 0, 0);
                D.Tb() && !ba.Xh() && (D.set("s90"), Y.l(!1, !1));
                b.clear(b.COLOR_BUFFER_BIT | b.DEPTH_BUFFER_BIT);
                return !0;
              },
              I: function () {},
              resize: function (r, f) {
                d = r;
                k = f;
                x.resize(r, f);
                q.resize(r, f);
                v.resize(r, f);
                t.resize(r, f);
                b.bindRenderbuffer(b.RENDERBUFFER, l);
                b.renderbufferStorage(
                  b.RENDERBUFFER,
                  b.DEPTH_COMPONENT16,
                  d,
                  k
                );
                b.bindRenderbuffer(b.RENDERBUFFER, null);
              },
              remove: function () {
                x.remove();
                q.remove();
                v.remove();
                t.remove();
                b.deleteRenderbuffer(l);
                b.deleteFramebuffer(e);
                var r = a.indexOf(w);
                -1 !== r && a.splice(r, 1);
              },
            };
            a.push(w);
            return w;
          },
          resize: function (c, e) {
            a.forEach(function (d) {
              d.resize(c, e);
            });
          },
        };
      })(),
      Wb = (function () {
        var a = [],
          c = S.Kg;
        return {
          instance: function (e) {
            function d() {
              t
                ? k()
                : ((h = dd.instance({ ja: K, jm: c })),
                  (q = S.lk[ba.U()]),
                  (l = X.instance({
                    isFloat: Aa.da(),
                    R: !0,
                    isPot: !0,
                    isLinear: !1,
                    sb: !0,
                    width: q,
                    height: q / 2,
                    F: 3,
                  })),
                  (w = X.instance({
                    isFloat: Aa.da(),
                    R: !0,
                    isPot: !0,
                    isLinear: !1,
                    sb: !0,
                    width: q,
                    height: q / 2,
                    F: 3,
                  })),
                  (r = X.instance({
                    isFloat: Aa.da(),
                    R: !0,
                    isPot: !0,
                    width: 1,
                    height: q / 2,
                    F: 3,
                  })),
                  (f = X.instance({
                    isFloat: Aa.da() && !c,
                    R: !c,
                    isPot: !1,
                    isLinear: !0,
                    sb: !0,
                    isMipmap: !1,
                    width: q,
                    height: q / 2,
                    F: c ? 4 : 3,
                  })),
                  (t = !0),
                  k(),
                  B.forEach(function (n) {
                    n();
                  }),
                  B.splice(0, B.length));
            }
            function k() {
              if (t) {
                za.ma();
                h.dn();
                l.S();
                D.set("s73");
                K.g(0);
                D.G("u82", S.Wb);
                X.tk(1);
                Y.l(!0, !0);
                for (var n = S.bm[ba.U()], m = 0; m < n; ++m)
                  w.o(),
                    D.set("s76"),
                    D.M("u8", 1 / q, 0),
                    l.g(0),
                    Y.l(!1, !1),
                    l.o(),
                    D.M("u8", 0, 2 / q),
                    w.g(0),
                    Y.l(!1, !1);
                r.S();
                D.set("s78");
                l.g(0);
                Y.l(!1, !1);
                D.set(c ? "s80" : "s79");
                f.S();
                l.g(0);
                r.g(1);
                Y.l(!1, !1);
                X.$(0);
                X.$(1);
              }
            }
            var p = Object.assign({ Gb: null, nc: null, mc: 0, oc: 0 }, e),
              x = 0,
              q = 0,
              t = !1,
              v = null,
              E = null,
              K = null,
              l = null,
              w = null,
              r = null,
              f = null,
              h = null,
              J = 0,
              B = [];
            e = {
              m: function () {
                function n() {
                  2 === ++m &&
                    ((K = X.instance({
                      isFloat: Aa.da(),
                      R: !0,
                      isPot: !1,
                      isMipmap: !1,
                      isLinear: !1,
                      sb: !0,
                      width: x,
                      height: x / 2,
                      F: 3,
                    })),
                    za.ma(),
                    K.S(),
                    D.set("s72"),
                    D.G("u87", p.oc),
                    D.G("u88", p.mc),
                    v.g(0),
                    E.g(1),
                    Y.l(!0, !0),
                    d());
                }
                var m = 0;
                x = S.mk[ba.U()];
                J = Math.log2(x) - 1;
                p.Gb &&
                  ((v = X.instance({
                    isPot: !1,
                    url: p.Gb,
                    P: n,
                    F: 3,
                    isFlipY: !1,
                  })),
                  (E = X.instance({
                    isPot: !1,
                    url: p.nc,
                    P: n,
                    F: 3,
                    isFlipY: !1,
                  })));
              },
              Yi: function (n) {
                K = n;
                d();
              },
              Tc: function (n) {
                t && (h.g(n), D.G("u105", h.L()));
              },
              Uc: function (n) {
                t && f.g(n);
              },
              ah: function () {
                D.G("u22", J);
              },
              sh: function () {
                return J;
              },
              L: function () {
                return x;
              },
              Ib: function (n) {
                t ? n() : B.push(n);
              },
              K: function () {
                v && v.remove();
                E && E.remove();
                l.remove();
                r.remove();
                w.remove();
                h.remove();
                f.remove();
                K.remove();
              },
            };
            a.push(e);
            e.m();
            return e;
          },
          K: function () {
            a.forEach(function (e) {
              e.K();
            });
          },
        };
      })(),
      Oc = {
        instance: function (a) {
          var c = a.vm,
            e = a.tm,
            d = 0,
            k = c.L();
          a = S.Kg;
          var p = X.instance({
              isFloat: Aa.da() && !a,
              R: !a,
              isLinear: !0,
              isMipmap: !1,
              isPot: !1,
              width: k,
              F: a ? 4 : 3,
              isFlipY: !1,
            }),
            x = X.instance({
              isFloat: Aa.da() && !a,
              R: !a,
              isPot: !1,
              isLinear: !0,
              sb: !0,
              isMipmap: !1,
              width: k,
              height: k / 2,
              F: a ? 4 : 3,
            }),
            q = za.instance({ width: k, height: k }),
            t = a ? "s66" : "s65";
          return {
            Mn: function (v) {
              d = v;
              D.set(t);
              b.viewport(0, 0, k, k);
              q.o();
              p.o();
              D.G("u7", d);
              c.Tc(1);
              e.Tc(0);
              Y.l(!0, !0);
              b.viewport(0, 0, k, k / 2);
              x.o();
              c.Uc(1);
              e.Uc(0);
              Y.l(!1, !1);
              b.flush();
            },
            Tc: function (v) {
              p.g(v);
            },
            Uc: function (v) {
              x.g(v);
            },
            ah: function () {
              D.G("u22", c.sh() * (1 - d) + e.sh() * d);
            },
          };
        },
      },
      Db = (function () {
        function a(L) {
          var H = (F - S.xe) / (S.Og - S.xe);
          H = 1 - Math.pow(1 - H, S.Fo);
          F += L * (1 + H * S.Go);
          F = Math.min(Math.max(F, S.xe), S.Og);
          u.hc();
        }
        function c(L) {
          -1 !== q &&
            ((J = h = 0),
            x(),
            a((S.Eo * L.deltaY) / window.innerHeight),
            L.preventDefault());
        }
        function e() {
          n += h;
          m += J;
          m = Math.min(Math.max(m, S.Rm), S.Qm);
          u.hc();
        }
        function d(L) {
          if (0 === q || -1 === q) return !1;
          var H = void 0 !== L.touches && L.touches.length;
          L.preventDefault();
          if (2 === q) {
            var P = Fc(
              L.touches[0].pageX,
              L.touches[0].pageY,
              L.touches[1].pageX,
              L.touches[1].pageY
            );
            a(-(r - P) * S.Sm);
            r = P;
          } else
            (P = H ? L.touches[0].clientX : L.clientX),
              (L = H ? L.touches[0].clientY : L.clientY),
              (h = (2 * (P - l) * Math.PI) / ba.L()),
              (J = (2 * (L - w) * Math.PI) / ba.T()),
              4 === q
                ? ((G[0] += h * S.vi),
                  (G[1] -= J * S.vi),
                  (G[0] = Math.min(Math.max(G[0], -S.yi), S.yi)),
                  (G[1] = Math.min(Math.max(G[1], -S.zi), S.zi)),
                  u.hc())
                : e(),
              (l = P),
              (w = L);
        }
        function k() {
          0 !== q &&
            -1 !== q &&
            ((0 === h && 0 === J) || 1 !== q || !y
              ? ua.Ca()
              : (x(), (f = Date.now()), (O = setInterval(u.sm, B))),
            (q = 0));
        }
        function p(L) {
          if (2 !== q && -1 !== q) {
            J = h = 0;
            x();
            ua.wake();
            var H = void 0 !== L.changedTouches && L.touches.length;
            L.preventDefault();
            H && 2 === L.touches.length
              ? ((q = 2),
                (r = Fc(
                  L.touches[0].pageX,
                  L.touches[0].pageY,
                  L.touches[1].pageX,
                  L.touches[1].pageY
                )))
              : ((q = H || 2 !== L.button ? 1 : 4),
                (l = H ? L.touches[0].clientX : L.clientX),
                (w = H ? L.touches[0].clientY : L.clientY));
            return !1;
          }
        }
        function x() {
          O && (clearInterval(O), (O = !1));
        }
        var q = 0,
          t = !1,
          v = !1,
          E = !1,
          K = 1,
          l = 0,
          w = 0,
          r = 0,
          f = 0,
          h = 0,
          J = 0,
          B = 16,
          n = S.lj,
          m = S.xi,
          F = S.we,
          O = !1,
          y = 0,
          g = new Float32Array([0, 0, 0, 0, 0]),
          G = [S.wk, S.xk],
          u = {
            m: function () {
              y = S.Qj[ba.U()];
              B = S.il[ba.U()];
              ba.Ja("mousedown", p);
              ba.Ja("mouseup", k);
              ba.Ja("mouseout", k);
              ba.Ja("mousemove", d);
              ba.Ja("mousemove", d);
              ba.Ja("wheel", c);
              ba.Ja("touchstart", p);
              ba.Ja("touchend", k);
              ba.Ja("touchmove", d);
            },
            hc: function (L) {
              t
                ? ((v[0] = -m),
                  (v[1] = n),
                  (E[1].value = (K / S.we) * F),
                  Ta.xb(E))
                : ((g[0] = n),
                  (g[1] = m),
                  (g[2] = F),
                  (g[3] = G[0]),
                  (g[4] = G[1]),
                  kc.qn(g, L));
            },
            sm: function () {
              if ((1e-4 > h && 1e-4 > J) || -1 === q)
                x(), (J = h = 0), 0 === q && ua.Ca();
              var L = Date.now(),
                H = L - f;
              f = L;
              L = Math.pow(y, H / B);
              h *= L;
              J *= L;
              e();
            },
            Pe: function (L) {
              t ||
                ((t = !0),
                (q = -1),
                (v = [0, 0, 0]),
                (E = [
                  { name: "u73", type: "3f", value: v },
                  { name: "u77", type: "1f", value: 1 },
                ]),
                (K = L));
            },
            hj: function (L) {
              -1 === q && L && (q = 0);
              L || (q = -1);
            },
            jn: function () {
              J = h = 0;
              n = S.lj;
              m = S.xi;
              F = S.we;
              u.hc();
            },
            Tp: function (L) {
              F = L;
            },
            Up: function (L) {
              G[0] = L[0];
              G[1] = L[1];
              S.Pg = L[2];
            },
            Sp: function (L, H) {
              n = L;
              m = H;
            },
          };
        return u;
      })(),
      oc = (function () {
        var a = {
          s92: !1,
          s92color: !1,
          s92NormalMap: !1,
          s92ParamsMap: !1,
          s92NormalParamsMap: !1,
        };
        return {
          instance: function (c) {
            function e(N) {
              if (A) {
                N.tweaker &&
                  window.JEELIZVTO &&
                  "undefined" !== typeof R &&
                  R.Jg(N.tweaker);
                g.splice(0, g.length);
                g.push({ n: 0, offset: 0 });
                F.min.set(Infinity, Infinity, Infinity);
                F.max.set(-Infinity, -Infinity, -Infinity);
                var z = N.uvs;
                z &&
                  (z = z.filter(function (fa) {
                    return fa;
                  }));
                Z = z && 0 < z.length && 0 < z[0].length ? !0 : !1;
                "undefined" !== typeof Ea &&
                  "string" === typeof N.faces &&
                  (N.faces = Ea(N.faces));
                "undefined" !== typeof Za &&
                  ("string" === typeof N.vertices &&
                    (N.vertices = Za(N.vertices)),
                  z &&
                    z.length &&
                    z.forEach(function (fa, ta) {
                      "string" === typeof fa && (z[ta] = Za(fa));
                    }));
                var C = N.metadata.faces,
                  Q = 1 + (Z ? 1 : 0);
                C = (N.faces.length - C) / (N.metadata.faces * Q);
                (6 !== C && 8 !== C) || Z || (++Q, (C /= 2));
                if (4 === C) {
                  C = 6 * Q + 2;
                  for (
                    var ea = 4 * Q + 1,
                      ha = Array(N.metadata.faces * C),
                      ia = 0;
                    ia < N.metadata.faces;
                    ++ia
                  )
                    for (var sa = 0; sa < Q; ++sa)
                      (ha[ia * C + 4 * sa] = N.faces[ia * ea + 5 * sa]),
                        (ha[ia * C + 4 * sa + 1] =
                          N.faces[ia * ea + 5 * sa + 1]),
                        (ha[ia * C + 4 * sa + 2] =
                          N.faces[ia * ea + 5 * sa + 2]),
                        0 === sa && (ha[ia * C + 3] = N.faces[ia * ea + 4]),
                        (ha[ia * C + 4 * sa + 3 * Q + 1] =
                          N.faces[ia * ea + 5 * sa]),
                        (ha[ia * C + 4 * sa + 3 * Q + 2] =
                          N.faces[ia * ea + 5 * sa + 2]),
                        (ha[ia * C + 4 * sa + 3 * Q + 3] =
                          N.faces[ia * ea + 5 * sa + 3]),
                        0 === sa &&
                          (ha[ia * C + 3 * Q + 4] = N.faces[ia * ea + 4]);
                  N.faces = ha;
                  N.metadata.faces *= 2;
                }
                l = Array(N.metadata.vertices);
                for (C = 0; C < N.metadata.vertices; ++C)
                  (l[C] = new Ra(
                    N.vertices[3 * C],
                    N.vertices[3 * C + 1],
                    N.vertices[3 * C + 2]
                  )),
                    Rc(F, l[C]);
                w = Array(N.metadata.faces);
                Q = 3 * Q + 1;
                for (C = 0; C < N.metadata.faces; ++C)
                  (w[C] = new qc(
                    N.faces[Q * C],
                    N.faces[Q * C + 1],
                    N.faces[Q * C + 2]
                  )),
                    (w[C].Vb = N.faces[Q * C + 3]);
                u = 3 < l.length;
                A && (A.visible = u);
                Tc(l, w);
                r = Uc(l, w);
                if (Z) {
                  Q = Array(l.length);
                  C = ["a", "b", "c"];
                  for (ea = 0; ea < N.metadata.faces; ++ea)
                    for (ha = 0; 3 > ha; ++ha)
                      if (
                        ((ia = N.faces[7 * ea + ha]),
                        (sa = N.faces[7 * ea + 1 + ha + 3]),
                        "undefined" === typeof Q[ia])
                      )
                        Q[ia] = [[ia, sa]];
                      else if (Q[ia][0][1] !== sa) {
                        for (var Wa = -1, Ja = 1; Ja < Q[ia].length; ++Ja)
                          if (Q[ia][Ja][1] === sa) {
                            Wa = Q[ia][Ja][0];
                            break;
                          }
                        Ja = -1;
                        -1 === Wa
                          ? ((Ja = l.length),
                            l.push(l[ia].clone()),
                            r.push(r[ia].clone()),
                            Q[ia].push([Ja, sa]),
                            (Q[Ja] = [[Ja, sa]]))
                          : (Ja = Wa);
                        N.faces[7 * ea + ha] = Ja;
                        w[ea][C[ha]] = Ja;
                      }
                  f = Array(l.length);
                  for (N = 0; N < l.length; ++N)
                    (C = "undefined" === typeof Q[N] ? N : Q[N][0][1]),
                      (f[N] = new Ob(z[0][2 * C], z[0][2 * C + 1]));
                }
                var na = hc(F);
                c.Eb &&
                  (l.forEach(function (fa) {
                    fa.x -= na.x;
                    fa.z -= na.z;
                    fa.y -= F.min.y;
                  }),
                  (F.min.x -= na.x),
                  (F.max.x -= na.x),
                  (F.min.z -= na.z),
                  (F.max.z -= na.z),
                  (F.max.y -= F.min.y),
                  (F.min.y = 0));
                if (c.Fb) {
                  var ka =
                    S.jk /
                    Math.max(
                      F.max.x - F.min.x,
                      F.max.y - F.min.y,
                      F.max.z - F.min.z
                    );
                  l.forEach(function (fa) {
                    fa.Ea(ka);
                  });
                  F.min.Ea(ka);
                  F.max.Ea(ka);
                }
                N = Z ? 8 : 6;
                Q = new Float32Array(l.length * N);
                for (C = 0; C < l.length; ++C)
                  (Q[N * C] = l[C].x),
                    (Q[N * C + 1] = l[C].y),
                    (Q[N * C + 2] = l[C].z),
                    (Q[N * C + 3] = r[C].x),
                    (Q[N * C + 4] = r[C].y),
                    (Q[N * C + 5] = r[C].z),
                    Z && ((Q[N * C + 6] = f[C].x), (Q[N * C + 7] = f[C].y));
                w.sort(function (fa, ta) {
                  return fa.Vb - ta.Vb;
                });
                var Ga = new (65536 > 3 * w.length ? Uint16Array : Uint32Array)(
                    3 * w.length
                  ),
                  W = 0;
                w.forEach(function (fa, ta) {
                  fa.Vb === W
                    ? (g[W].n += 3)
                    : (g.push({ n: 3, offset: 3 * ta }), ++W);
                  Ga[3 * ta] = fa.a;
                  Ga[3 * ta + 1] = fa.b;
                  Ga[3 * ta + 2] = fa.c;
                });
                h && h.remove();
                h = Y.instance({ ga_: Q, V: Ga });
                n = B = !1;
                U && A.Ug();
                L = !0;
                A.Me();
                c.P && (c.P(A), (c.P = null));
              }
            }
            function d(N) {
              h.Ka(N.n, N.offset);
            }
            function k(N, z) {
              P[z] &&
                (D.set(P[z].Kl()),
                h.bind(!1),
                Z ? (D.Ra(), D.Vi()) : (D.Za(), D.Wi()),
                P[z].wc() && (D.Dc(), B.pc(!1), D.Hd(), lb.Jb()),
                P[z].Wk(),
                P[z].ad(),
                h.Ka(N.n, N.offset));
            }
            function p(N, z) {
              P[z] &&
                (D.set(P[z].Ll()),
                h.bind(!1),
                Z ? (D.Ra(), D.Vi()) : (D.Za(), D.Wi()),
                P[z].wc() && (D.Dc(), B.pc(!1), D.Hd(), lb.Jb()),
                A.rc(),
                P[z].ad(),
                h.Ka(N.n, N.offset));
            }
            function x(N, z) {
              T && P[z] && (P[z].Xk(), h.Ka(N.n, N.offset));
            }
            function q(N, z) {
              T && P[z] && (P[z].Zk(Z), h.Ka(N.n, N.offset));
            }
            function t(N, z) {
              P[z] && (D.set(P[z].Gl()), P[z].gh(), h.Ka(N.n, N.offset));
            }
            function v(N, z) {
              P[z] &&
                (D.set(P[z].Hl()), A.rc(), P[z].gh(), h.Ka(N.n, N.offset));
            }
            function E(N, z) {
              P[z] &&
                (D.set(P[z].Il()),
                P[z].wc() && (B.pc(!1), D.Hd(), lb.Jb()),
                h.bind(!1),
                P[z].dh(Z),
                h.Ka(N.n, N.offset));
            }
            function K(N, z) {
              if (P[z]) {
                var C = P[z].Jl();
                D.set(C);
                P[z].wc() && (B.pc(!1), D.Hd(), lb.Jb(), h.bind(!1));
                a[C] || (A.rc(), h.bind(!1), (a[C] = !0));
                P[z].dh(Z);
                h.Ka(N.n, N.offset);
              }
            }
            if (!ba.Rg()) return !1;
            void 0 === c.Eb && (c.Eb = !1);
            void 0 === c.Fb && (c.Fb = !1);
            void 0 === c.Ng && (c.Ng = !1);
            var l = null,
              w = null,
              r = null,
              f = null,
              h = null,
              J = null,
              B = null,
              n = !1,
              m = new Qb(),
              F = new pc(),
              O = [],
              y = null,
              g = [{ n: 0, offset: 0 }],
              G = [],
              u = !1,
              L = !1,
              H = [],
              P = [],
              U = !1,
              Z = !1,
              T = !1,
              A = {
                visible: u,
                Gk: function () {
                  return g.length;
                },
                Ug: function () {
                  !n &&
                    Z &&
                    ((w = w.filter(function (N) {
                      return null !== N;
                    })),
                    (J = Vc(l, r, f, w)),
                    (B = Y.instance({ ga_: J, V: !1 })),
                    (f = r = w = l = J = null),
                    (n = !0));
                },
                rc: function () {
                  lb.W();
                  A.fh();
                },
                fh: function () {
                  D.Ec("u127", m.elements);
                },
                ep: function () {
                  u && (A.fh(), h.bind(!1), Z ? D.Ra() : D.Za(), h.W());
                },
                gl: function (N) {
                  u && (N || A.rc(), h.bind(!1), Z ? D.Ra() : D.Za(), h.W());
                },
                hl: function () {
                  u && (h.bind(!1), Z ? D.Ra() : D.Za(), g.forEach(x));
                },
                bh: function () {
                  u && (h.bind(!1), Z ? D.Ra() : D.Za(), G.forEach(d));
                },
                el: function (N) {
                  T &&
                    u &&
                    (h.bind(!1),
                    Z ? D.Ra() : D.Za(),
                    N ? g.forEach(t) : g.forEach(v));
                },
                $c: function (N) {
                  u &&
                    (N || A.rc(),
                    h.bind(!1),
                    N || (D.Ra(), D.Dc()),
                    T && g.forEach(q));
                },
                ad: function (N) {
                  T && u && (N ? g.forEach(k) : g.forEach(p));
                },
                al: function () {
                  T && u && g.forEach(K);
                },
                $k: function () {
                  T && u && g.forEach(E);
                },
                Ah: function () {
                  return y;
                },
                yh: function () {
                  return H;
                },
                lo: function (N, z) {
                  P[N].update(z);
                  A.vj();
                },
                $f: function (N, z) {
                  function C(ha, ia) {
                    ha &&
                      ((ha.P = function () {
                        A &&
                          ++ea === Q &&
                          ((T = !0),
                          U && A.Ib(A.Ug, 5),
                          A.Me(),
                          z &&
                            A.Ib(function () {
                              z(A);
                            }, 10));
                      }),
                      (ha = tc.instance(ha)),
                      P[ia] && P[ia].K(),
                      (P[ia] = ha),
                      (U = U || ha.wc()));
                  }
                  H = N;
                  T = !1;
                  var Q = N.length,
                    ea = 0;
                  P = Array(Q);
                  U = !1;
                  N.forEach(function (ha, ia) {
                    "string" === typeof ha
                      ? rc(
                          -1 === ha.indexOf(".json") ? ha + ".json" : ha,
                          function (sa) {
                            sa.name = ha;
                            C(sa, ia, ha);
                          }
                        )
                      : C(ha, ia, !1);
                  });
                  A.Ib(function () {
                    A.vj();
                    ua.yb(A);
                    ua.Qd(!0);
                  }, 4);
                },
                vj: function () {
                  G.splice(0, G.length);
                  g.forEach(function (N, z) {
                    P[z] && P[z].qm() && G.push(N);
                  });
                },
                Ib: function (N, z) {
                  L && T ? N(A) : O.push({ ob: N, order: z ? z : 0 });
                },
                Me: function () {
                  L &&
                    T &&
                    (O.sort(function (N, z) {
                      return 0 > N.order - z.order ? 1 : -1;
                    }),
                    O.forEach(function (N) {
                      N.ob(A);
                    }),
                    O.splice(0, O.length));
                },
                remove: function () {
                  A.K();
                  A = null;
                },
                K: function () {
                  u = L = !1;
                  h && h.remove();
                  P.forEach(function (N) {
                    N.K();
                  });
                  n && B.remove();
                },
                Nl: function () {
                  return F.size().x;
                },
                Ol: function () {
                  return F.size().y;
                },
                vp: function () {
                  return F.size().z;
                },
                sl: function () {
                  return hc(F).x;
                },
                tl: function () {
                  return hc(F).y;
                },
                lp: function () {
                  return hc(F).z;
                },
                rp: function () {
                  return F.min.y;
                },
                replace: function (N, z, C) {
                  if (N === y) return z && A && (A.Me(), z(A)), !1;
                  y = N;
                  ua.Qd(!1);
                  rc(
                    N,
                    function (Q) {
                      e(Q);
                      z && z(A);
                    },
                    C
                  );
                  return !0;
                },
              };
            c.yc && A.$f(c.yc, c.Ng);
            y = c.url;
            rc(c.url, e);
            return A;
          },
          hn: function () {
            a.s92 = !1;
            a.s92color = !1;
            a.s92NormalMap = !1;
            a.s92ParamsMap = !1;
            a.s92NormalParamsMap = !1;
          },
        };
      })(),
      kc = (function () {
        var a = null,
          c = !1,
          e = !1,
          d = null,
          k = new Float32Array(16),
          p = new Float32Array(3),
          x = { data: 0 },
          q = {
            m: function () {
              a = S.Kb
                ? new Worker("js/worker.php")
                : {
                    postMessage: function (t) {
                      x.data = t;
                      uc.Lm(x);
                    },
                    terminate: function () {},
                  };
              a.onmessage = function (t) {
                switch (t.data[0]) {
                  case 3:
                    for (var v = 0; 16 > v; ++v) k[v] = t.data[v + 1];
                    for (v = 0; 3 > v; ++v) p[v] = t.data[v + 17];
                    lb.Ue().Hn(k, p);
                    break;
                  case 6:
                    q.Cn(), (c = !0), Db.hc(!1), S.ca && (vb.enable(), vb.Id());
                }
              };
              d = new Float32Array(6);
              d[0] = 2;
              S.Kb || uc.Dn(a);
            },
            Yn: function () {
              S.$g || (e = !0);
            },
            cq: function () {
              e = !1;
            },
            qn: function (t, v) {
              if (v || (c && e))
                (d[1] = t[0]),
                  (d[2] = t[1]),
                  (d[3] = t[2]),
                  (d[4] = t[3]),
                  (d[5] = t[4]),
                  a.postMessage(d);
            },
            Cn: function () {
              a.postMessage([5, S.Pg]);
            },
            K: function () {
              S.Kb && a.terminate();
            },
          };
        return q;
      })(),
      uc = (function () {
        var a = 0,
          c = 0,
          e = 0,
          d = [0, 0],
          k = new Qb(),
          p = new gc(),
          x = new gc(),
          q = new Ra(),
          t = new Ra(),
          v = new Pb(),
          E = 0,
          K = new Float32Array(20);
        K[0] = 3;
        var l = !1,
          w = { data: !1 },
          r = {
            m: function () {
              "undefined" === typeof S && (self.Io = { Kb: !0 });
              S.Kb && r.Qf([6]);
            },
            Lm: function (f) {
              switch (f.data[0]) {
                case 2:
                  r.ag(f.data);
                  break;
                case 5:
                  E = f.data[1];
              }
            },
            Qf: function (f) {
              S.Kb ? postMessage(f) : ((w.data = f), l.onmessage(w));
            },
            ag: function (f) {
              a = f[1];
              c = f[2];
              e = f[3];
              d[0] = f[4];
              d[1] = f[5];
              q.set(d[0], d[1], -e);
              v.set(c, a, 0, "XYZ");
              if (!1 === v instanceof Pb)
                throw Error(
                  "JETHREE.Quaternion: .setFromEuler() now expects a Euler rotation rather than a Vector3 and order."
                );
              f = Math.cos(v.B / 2);
              var h = Math.cos(v.C / 2),
                J = Math.cos(v.D / 2),
                B = Math.sin(v.B / 2),
                n = Math.sin(v.C / 2),
                m = Math.sin(v.D / 2),
                F = v.order;
              "XYZ" === F
                ? ((p.B = B * h * J + f * n * m),
                  (p.C = f * n * J - B * h * m),
                  (p.D = f * h * m + B * n * J),
                  (p.N = f * h * J - B * n * m))
                : "YXZ" === F
                ? ((p.B = B * h * J + f * n * m),
                  (p.C = f * n * J - B * h * m),
                  (p.D = f * h * m - B * n * J),
                  (p.N = f * h * J + B * n * m))
                : "ZXY" === F
                ? ((p.B = B * h * J - f * n * m),
                  (p.C = f * n * J + B * h * m),
                  (p.D = f * h * m + B * n * J),
                  (p.N = f * h * J - B * n * m))
                : "ZYX" === F
                ? ((p.B = B * h * J - f * n * m),
                  (p.C = f * n * J + B * h * m),
                  (p.D = f * h * m - B * n * J),
                  (p.N = f * h * J + B * n * m))
                : "YZX" === F
                ? ((p.B = B * h * J + f * n * m),
                  (p.C = f * n * J + B * h * m),
                  (p.D = f * h * m - B * n * J),
                  (p.N = f * h * J - B * n * m))
                : "XZY" === F &&
                  ((p.B = B * h * J - f * n * m),
                  (p.C = f * n * J - B * h * m),
                  (p.D = f * h * m + B * n * J),
                  (p.N = f * h * J + B * n * m));
              q.y -= E;
              f = k.elements;
              m = p.x;
              var O = p.y,
                y = p.z;
              B = p.w;
              var g = m + m,
                G = O + O;
              n = y + y;
              h = m * g;
              J = m * G;
              m *= n;
              F = O * G;
              O *= n;
              y *= n;
              g *= B;
              G *= B;
              B *= n;
              f[0] = 1 - (F + y);
              f[4] = J - B;
              f[8] = m + G;
              f[1] = J + B;
              f[5] = 1 - (h + y);
              f[9] = O - g;
              f[2] = m - G;
              f[6] = O + g;
              f[10] = 1 - (h + F);
              f[3] = 0;
              f[7] = 0;
              f[11] = 0;
              f[12] = 0;
              f[13] = 0;
              f[14] = 0;
              f[15] = 1;
              k.setPosition(q);
              x.J(p).inverse();
              f = t.J(q);
              O = f.x;
              g = f.y;
              y = f.z;
              h = x.x;
              J = x.y;
              B = x.z;
              n = x.w;
              m = n * O + J * y - B * g;
              F = n * g + B * O - h * y;
              G = n * y + h * g - J * O;
              O = -h * O - J * g - B * y;
              f.x = m * n + O * -h + F * -B - G * -J;
              f.y = F * n + O * -J + G * -h - m * -B;
              f.z = G * n + O * -B + m * -J - F * -h;
              for (f = 1; 17 > f; ++f) K[f] = k.elements[f - 1];
              K[17] = t.x;
              K[18] = t.y;
              K[19] = t.z;
              r.Qf(K);
            },
            Dn: function (f) {
              l = f;
              r.Qf([6]);
            },
          };
        return r;
      })();
    uc.m();
    var tc = (function () {
        function a(x) {
          var q = x.split(":").shift();
          return "data" === q || "blob" === q
            ? x
            : ("undefined" !== typeof I && I.aa ? I : S).aa + S.Em + x;
        }
        function c(x, q) {
          return Math.min(q + x + q * x, 1);
        }
        var e = !1,
          d = null,
          k = 1,
          p = {
            diffuseTexture: null,
            normalTexture: null,
            paramsTexture: null,
            colorTextureUsage: 0,
            metalness: 0.5,
            roughness: 0.5,
            fresnelMin: 0,
            fresnelMax: 1,
            fresnelPow: 5,
            alpha: 1,
            diffuseColor: [255, 255, 255],
            paramsMapMask: [0, 0, 0, 0],
            P: null,
          };
        return {
          m: function () {
            d = X.instance({
              width: 1,
              height: 1,
              isMipmap: !1,
              F: 4,
              array: new Uint8Array([255, 255, 255, 255]),
              vc: !1,
            });
          },
          Pe: function () {
            e = !0;
            k = 2;
          },
          instance: function (x) {
            function q(u) {
              function L() {
                ++P === H && u && u();
              }
              var H = 1,
                P = 0;
              (v = w.normalTexture && ba.Ak() ? !0 : !1) &&
                !h.Pa &&
                (++H,
                (h.Pa = X.instance({
                  url: a(w.normalTexture),
                  isLinear: !0,
                  isMipmap: !0,
                  Ph: ba.pm(),
                  isPot: !0,
                  F: 3,
                  P: L,
                })));
              (E = w.diffuseTexture && "" !== w.diffuseTexture ? !0 : !1) &&
              !h.fa
                ? (++H,
                  (h.fa = X.instance({
                    url: a(w.diffuseTexture),
                    isMipmap: !0,
                    isLinear: !0,
                    isPot: !0,
                    Ph: !0,
                    vc: !1,
                    sb: !1,
                    gm: !1,
                    F: 4,
                    P: L,
                  })),
                  (f = "s97"))
                : h.fa || ((f = "s98"), (h.fa = d));
              r = [
                w.diffuseColor[0] / 255,
                w.diffuseColor[1] / 255,
                w.diffuseColor[2] / 255,
              ];
              (J = w.paramsTexture ? !0 : !1) &&
                !h.ub &&
                (w.paramsTexture === w.diffuseTexture
                  ? (h.ub = h.fa)
                  : (++H,
                    (h.ub = X.instance({
                      url: a(w.paramsTexture),
                      isMipmap: !0,
                      isLinear: !0,
                      isPot: !0,
                      Ph: !0,
                      vc: !1,
                      sb: !1,
                      gm: !1,
                      F: 4,
                      P: L,
                    }))));
              L();
            }
            function t(u) {
              "number" === typeof w.alpha
                ? ((K[0] = w.alpha), (K[1] = 0), (K[2] = 0), (K[3] = 0))
                : ((K[0] = w.alpha[0]),
                  (K[1] = w.alpha[1] - w.alpha[0]),
                  (K[2] = w.alpha[2]),
                  (K[3] = w.alpha[3]));
              var L = 1 <= w.fresnelPow ? w.fresnelMin : w.fresnelMax;
              l[0] = c(K[0], L);
              l[1] = c(K[1], L);
              l[2] = K[2];
              l[3] = K[3];
              B = {
                wi: w.fresnelMax,
                hi: [w.fresnelMin, w.roughness, w.fresnelPow / 15, w.metalness],
                ki: w.paramsMapMask,
              };
              u = w.P ? w.P.bind(null, u) : null;
              q(u);
              v || J || E
                ? v || J
                  ? v && !J
                    ? ((n = "s92NormalMap"), (m = "s92NNGLtextureNormalMap"))
                    : !v && J
                    ? ((n = "s92ParamsMap"), (m = "s92NNGLtextureParamsMap"))
                    : ((n = "s92NormalParamsMap"),
                      (m = "s92NNGLtextureNormalParamsMap"))
                  : ((n = "s92"), (m = "s92NNGLtexture"))
                : ((n = "s92color"), (m = "s92NNGLcolor"));
              F = v ? "s100" : "s99";
              O = v ? "s94" : "s104";
              y = J ? "s102" : "s101";
              g = J ? "s95" : "s105";
            }
            var v,
              E,
              K = [1, 0, 0, 0],
              l = [0, 0, 0, 0],
              w = Object.assign({}, p, x),
              r = null,
              f = null,
              h = { fa: null, Pa: null, ub: null },
              J = (v = E = !1),
              B = null,
              n = null,
              m = null,
              F = null,
              O = null,
              y = null,
              g = null,
              G = {
                update: function (u) {
                  Object.assign(w, u);
                  t();
                },
                wc: function () {
                  return v;
                },
                qm: function () {
                  return 0.99 > K[0];
                },
                Ll: function () {
                  return O;
                },
                Kl: function () {
                  return F;
                },
                Hl: function () {
                  return g;
                },
                Gl: function () {
                  return y;
                },
                Jl: function () {
                  return n;
                },
                Il: function () {
                  return m;
                },
                ad: function () {
                  v && h.Pa.g(0);
                },
                Zk: function (u) {
                  e && D.set(f);
                  u ? D.Ra() : D.Za();
                  E && D.Dc();
                  G.$c();
                },
                $c: function () {
                  E && (D.G("u64", w.colorTextureUsage), h.fa.g(0));
                  D.eg("u137", r);
                },
                gh: function () {
                  J && (h.ub.g(0), D.va("u66", B.ki), D.Dc());
                  D.va("u102", B.hi);
                  D.G("u138", B.wi);
                },
                dh: function (u) {
                  J && !v
                    ? h.ub.g(k)
                    : v && (E || d.g(0), h.Pa.g(k), J && h.ub.g(k + 1));
                  J && D.va("u66", B.ki);
                  E || v ? D.zn() : u ? D.An() : D.Bn();
                  G.$c();
                  D.va("u7", K);
                  D.va("u102", B.hi);
                  D.G("u138", B.wi);
                },
                Wk: function () {
                  D.va("u7", K);
                },
                Xk: function () {
                  D.va("u7", l);
                },
                K: function () {
                  E && h.fa.remove();
                  v && h.Pa.remove();
                  J && w.paramsTexture !== w.diffuseTexture && h.ub.remove();
                },
              };
            t(G);
            return G;
          },
        };
      })(),
      vb = (function () {
        var a = 0,
          c = 0,
          e = 0,
          d = 0,
          k = 0,
          p = 0,
          x = S.hk,
          q = S.gk,
          t = S.ik,
          v = 0,
          E = 0,
          K = null,
          l = null,
          w = 0,
          r = 0,
          f = 0,
          h = 0,
          J = 0,
          B = null,
          n = 0,
          m = 0,
          F = 0,
          O = Date.now(),
          y = null,
          g = !1,
          G = !1,
          u = !1,
          L = 1,
          H = !1,
          P = {
            m: function () {
              a = S.ck[ba.U()];
              c = S.bk[ba.U()];
              e = S.ak[ba.U()];
              m = S.dk[ba.U()];
              d = S.Vj[ba.U()];
              k = S.Zj[ba.U()];
              f = S.$j[ba.U()];
              h = ba.L();
              J = ba.T();
              v = Math.round(h * a);
              E = Math.round(J * a);
              l = za.instance({ width: v, height: E, tc: !1 });
              K = X.instance({ width: v, height: E, isPot: !1, isLinear: !0 });
              B = X.instance({
                width: v,
                height: E,
                isPot: !1,
                isLinear: !0,
                F: 1,
              });
              g = !0;
            },
            resize: function (U, Z, T) {
              L = T;
              h = U;
              J = Z;
              v = Math.round(U * a);
              E = Math.round(Z * a);
              l.resize(v, E);
              G = !0;
            },
            W: function () {
              var U = Math.exp(-(Date.now() - O) / m);
              n = u ? F + (1 - U) * (1 - F) : F * U;
              w = c + n * (e - c);
              r = d + (1 - n) * (1 - d);
              p = k + (1 - n) * (1 - k);
              X.$(5);
              if (G && g)
                X.$(6),
                  B.resize(v, E),
                  D.set("s0"),
                  D.Kd("u1", 6),
                  l.bind(!1, !0),
                  B.o(),
                  l.ze(),
                  K.g(6),
                  Y.l(!0, !0),
                  K.resize(v, E),
                  K.o(),
                  B.g(6),
                  Y.l(!1, !1),
                  D.Kd("u1", 0),
                  (G = !1);
              else {
                b.enable(b.BLEND);
                b.blendFunc(b.CONSTANT_ALPHA, b.ONE_MINUS_SRC_ALPHA);
                U = w / f;
                b.blendColor(U, U, U, U);
                b.colorMask(!0, !1, !1, !0);
                D.set("s84");
                lb.Ne();
                D.G("u118", w);
                m && (D.G("u119", r), D.G("u111", p));
                var Z = L * (x + Math.pow(Math.random(), t) * (q - x));
                D.M("u8", Z / h, Z / J);
                l.Lg();
                l.Gc();
                K.o();
                Z = 2 * Math.PI * Math.random();
                for (var T = !0, A = 0; A < f; ++A)
                  1 === A && (b.blendFunc(b.SRC_ALPHA, b.ONE), D.G("u118", U)),
                    D.G("u117", Z + (A / f) * (Math.PI / 2)),
                    D.M(
                      "u116",
                      (Math.random() - 0.5) / h,
                      (Math.random() - 0.5) / J
                    ),
                    Y.l(T, T),
                    (T = !1);
                b.disable(b.BLEND);
                D.set("s85");
                D.M("u8", 1 / v, 1 / E);
                B.o();
                K.g(7);
                Y.l(!1, !1);
                b.colorMask(!0, !0, !0, !0);
              }
            },
            g: function (U) {
              B.g(U);
            },
            enable: function () {
              H = !0;
            },
            Tm: function () {
              if (u || !H) return !1;
              y && clearTimeout(y);
              P.Id();
              y = setTimeout(P.tj, 400);
            },
            Id: function () {
              y && (clearTimeout(y), (y = !1));
              !u &&
                H &&
                (window.Jj.disable(), (u = !0), (O = Date.now()), (F = n));
            },
            tj: function () {
              u &&
                H &&
                (y && (clearTimeout(y), (y = null)),
                window.Jj.enable(),
                (u = !1),
                (O = Date.now()),
                (F = n));
            },
            K: function () {
              K.remove();
              B.remove();
              l.remove();
            },
          };
        P.Tm();
        return P;
      })(),
      dd = {
        instance: function (a) {
          var c = a.ja.L(),
            e = a.jm ? !0 : !1,
            d = e ? "s67" : "s12",
            k = X.instance({
              isFloat: a.ja.Yh() && Aa.da() && !e,
              R: a.ja.Zh() && !e,
              isLinear: !0,
              isMipmap: !1,
              isPot: !1,
              width: c,
              height: c,
              F: e ? 4 : 3,
            }),
            p = X.instance({
              isFloat: a.ja.Yh() && Aa.da(),
              R: a.ja.Zh(),
              isPot: !0,
              width: 1,
              height: c / 2,
              F: 3,
            });
          p.o();
          D.set("s78");
          a.ja.g(0);
          Y.l(!0, !0);
          var x = Math.round(Math.log(c) / Math.log(2));
          k.dn = function () {
            k.o();
            D.set(d);
            D.G("u82", S.Wb);
            a.ja.g(0);
            p.g(1);
            for (var q = 0, t = 0; t <= x; ++t) {
              var v = Math.pow(2, x - t),
                E = v / 2;
              b.viewport(0, q, c, E);
              D.M("u80", c / v, 1);
              D.G("u81", Math.min(6 / E, 0.6));
              q += v / 2;
              Y.l(0 === t, 0 === t);
            }
          };
          k.gn = k.remove;
          k.remove = function () {
            k.gn();
            p.remove();
          };
          return k;
        },
      };
    va.jb = (function () {
      var a = {
          Gd: 45,
          Vf: 1,
          Xb: "../../images/debug/picsou.png",
          Wf: 0.8,
          yf: 3.14 / 6,
          zf: 0.314,
          Af: 4,
          wf: 0.5,
          xf: -0.25,
          um: 1,
          wa: 256,
          vf: 0.15,
        },
        c = null,
        e = null,
        d = null,
        k = !1,
        p = !1,
        x = -1,
        q = null,
        t = null,
        v = null,
        E = Math.PI / 180,
        K = {
          m: function (l) {
            x = l.width;
            l = {
              isFloat: Aa.da(),
              R: !0,
              isPot: !1,
              isMipmap: !1,
              isLinear: !1,
              sb: !0,
              width: x,
              height: x / 2,
              F: 3,
            };
            c = X.instance(l);
            e = X.instance(l);
            D.j("s106", [{ type: "1i", name: "u145", value: 0 }]);
            D.j("s107", [{ type: "1i", name: "u150", value: 0 }]);
            K.mo();
          },
          mo: function () {
            D.j("s107", [
              { type: "1f", name: "u151", value: a.yf },
              { type: "1f", name: "u152", value: a.zf },
              { type: "1f", name: "u153", value: a.Af },
              { type: "1f", name: "u154", value: a.wf },
              { type: "1f", name: "u155", value: a.xf },
            ]);
          },
          Dp: function () {
            return p;
          },
          ua: function (l) {
            q = l;
          },
          Ac: function () {
            t =
              "uniform sampler2D u145;uniform vec2 u146,u147,u4;uniform int u148;uniform float u149,u131;varying vec2 vv0;const float h=3.141593;const vec2 i=vec2(.5,.5);const float e=1.2;const vec3 g=vec3(1.,1.,1.);void main(){vec2 c=vec2(vv0.x*2.,-vv0.y+.5)*h,a=i+u4*(c-u146)/u147;float b=1.;if(u148==0){if(a.x<0.||a.x>1.||a.y<0.||a.y>1.)discard;}else b*=smoothstep(-e,0.,a.x),b*=1.-smoothstep(1.,1.+e,a.x),b*=smoothstep(-e,0.,a.y),b*=1.-smoothstep(1.,1.+e,a.y);vec3 d=mix(u149*g,texture2D(u145,a).rgb*u131,b*g);gl_FragColor=vec4(d,1.);}";
            v =
              "uniform sampler2D u150;uniform float u151,u152,u153,u154,u155;varying vec2 vv0;const float f=3.141593;const vec2 o=vec2(.5,.5);const vec3 h=vec3(1.,1.,1.);void main(){float i=(vv0.x*2.-1.)*f,c=(-vv0.y+.5)*f;vec4 a=texture2D(u150,vec2(.5,.5));float d=a.r,j=u153*a.g,k=u154*(a.b+u155),b=a.a,g=asin(cos(b)*cos(d)),l=atan(cos(b)*sin(d),-sin(b)),m=acos(sin(c)*sin(g)+cos(c)*cos(g)*cos(i-l)),n=1.-smoothstep(u151-u152,u151+u152,m);gl_FragColor=vec4(h*(max(k,0.)+max(j,0.)*n),1.);}";
            D.qa("s106", {
              name: "_",
              h: t,
              i: "u145 u146 u148 u147 u149 u131 u4".split(" "),
              precision: "highp",
            });
            D.qa("s107", {
              name: "_",
              h: v,
              i: "u150 u151 u152 u153 u154 u155".split(" "),
              precision: "highp",
            });
          },
          jg: function (l, w, r, f, h, J, B, n) {
            D.M("u146", w, r);
            D.Kd("u148", f ? 1 : 0);
            D.M("u147", h, h / J);
            D.cj("u4", n);
            B && l.g(0);
            Y.l(!1, !1);
          },
          Nj: function (l) {
            b.viewport(0, 0, a.wa, a.wa / 2);
            D.set("s107");
            l.g(0);
            Y.l(!1, !1);
          },
          Ql: function () {
            return c;
          },
          vk: function (l) {
            K.m({ width: a.wa });
            K.wj(l, !1, 1);
            p = !0;
          },
          uk: function () {
            (k && d.Rl() === a.Xb) ||
              ((k = !1),
              (d = X.instance({
                url: a.Xb,
                isFloat: !1,
                P: function () {
                  k = !0;
                },
              })));
          },
          ag: function (l) {
            Object.assign(a, l);
          },
          wj: function (l, w, r) {
            var f = a.wa;
            za.ma();
            e.S();
            D.set("s0");
            c.g(0);
            Y.l(!0, !0);
            X.$(0);
            c.o();
            D.set("s106");
            D.G("u149", a.vf);
            D.G("u131", a.um);
            K.jg(l, Math.PI, 0, !0, 90 * E, l.L() / l.T(), !0, [1, 1]);
            k &&
              (D.G("u131", a.Wf),
              b.viewport(0, 0, f / 2, f / 2),
              K.jg(d, 0, 0, !1, 2 * a.Gd * E, 2 * a.Vf, !0, [1, 1]),
              b.viewport(f / 2, 0, f / 2, f / 2),
              K.jg(d, 2 * Math.PI, 0, !1, 2 * a.Gd * E, 2 * a.Vf, !1, [1, 1]));
            b.enable(b.BLEND);
            b.blendFunc(b.ONE, b.ONE);
            w && K.Nj(w);
            D.set("s0");
            b.blendColor(0, 0, 0, 1 - r);
            b.blendFunc(b.CONSTANT_ALPHA, b.ONE_MINUS_CONSTANT_ALPHA);
            e.g(0);
            Y.l(!1, !1);
            b.disable(b.BLEND);
            q.Yi(c);
          },
          v: function () {
            d = e = c = null;
            p = k = !1;
            x = -1;
            q = null;
          },
        };
      return K;
    })();
    va.kb = (function () {
      var a = !1,
        c = !0,
        e = !1,
        d = !1,
        k = {
          Ac: function () {
            ba.Z() &&
              (D.qa("s108", {
                name: "_",
                s: "attribute vec3 a0;uniform sampler2D u39;uniform vec2 u40;uniform vec3 u133;const float l=1.,m=0.,n=0.,E=1.;const vec2 e=vec2(1.,1.);const vec3 o=vec3(1.,1.,1.);const vec2 F=vec2(-1.,1.),p=vec2(.16,.5),q=vec2(.5,.5),r=vec2(.84,.5);uniform mat4 u67;uniform vec3 u69,u73,u74,u75;uniform float u68,u76,u77,u70,u71,u72,u78;mat3 s(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u39,p);vec2 f=u76*e;vec3 c=u76*o;vec2 t=mix(d.a*u40,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u39,q).rgb+vec3(u70,0.,0.),u73,c);float u=mix(texture2D(u39,r).r,0.,u76);a.z+=u;mat3 v=s(a);vec3 w=mix(u133,u74,c);float x=mix(l,u77,u76);vec3 b=mix(u69,u75,c);b.x+=u68*sin(a.y);float h=cos(a.z),i=sin(a.z);mat2 y=mat2(h,i,-i,h);b.xy=y*b.xy;float z=mix(u72,1.,u76);vec2 j=u71/t;vec3 k=a0;float A=max(0.,-a0.z-m)*n;k.x+=A*sign(a0.x)*(1.-u76);vec3 B=v*(k+w)*x+b;vec2 C=j*z;vec3 D=vec3(g*C,-j)+B*vec3(1.,-1.,-1.);gl_Position=u67*(vec4(u78*e,e)*vec4(D,1.));}",
                h: "void main(){gl_FragData[0]=vec4(0.,0.,0.,0.),gl_FragData[1]=vec4(0.,0.,1.,1.),gl_FragData[2]=vec4(1.,0.,0.,0.),gl_FragData[3]=vec4(0.,.5,1.,0.);}",
                i: ["u39", "u40", "u69", "u133"].concat(D.Ye(), D.Ze()),
                H: ["a0"],
                O: [3],
                ea: !0,
              }),
              (a = !0));
          },
          m: function (p) {
            a &&
              D.j(
                "s108",
                [
                  { type: "1i", name: "u39", value: 1 },
                  { type: "3f", name: "u69", value: p.Fa },
                  { type: "1f", name: "u70", value: 0 },
                  { type: "1f", name: "u78", value: 1 },
                ].concat(p.vg)
              );
          },
          bb: function (p) {
            d = p;
            e && k.Hh();
          },
          ab: function (p) {
            e = p;
            d && k.Hh();
          },
          Hh: function () {
            ba.Z() &&
              (D.j("s108", [
                {
                  type: "3f",
                  name: "u133",
                  value: [e[0] * d, e[1] * d, e[2] * d],
                },
              ]),
              D.I());
          },
          am: function (p) {
            for (
              var x = p.width / 2,
                q = p.height / 2,
                t = p.depth,
                v = p.jl,
                E = p.height / 4,
                K = p.Kk,
                l = 2 * K + 4,
                w = [],
                r = [],
                f = -x + p.Ua,
                h = -v - p.Ua,
                J = x - p.Ua,
                B = -v - p.Ua,
                n = 0;
              n < l;
              ++n
            ) {
              var m = 0,
                F = 0;
              0 === n
                ? ((m = -x), (F = -v - t))
                : 1 <= n && n <= 1 + K
                ? ((F = (((n - 1) / K) * Math.PI) / 2),
                  (m = f - Math.cos(F) * p.Ua),
                  (F = h + Math.sin(F) * p.Ua))
                : n >= 2 + K && n <= 2 + 2 * K
                ? ((F = (((n - 2 - K) / K) * Math.PI) / 2),
                  (m = J + Math.sin(F) * p.Ua),
                  (F = B + Math.cos(F) * p.Ua))
                : n === l - 1 && ((m = x), (F = -v - t));
              w.push(m, q + E, F, m, -q + E, F);
              0 !== n &&
                r.push(
                  2 * n,
                  2 * n - 2,
                  2 * n - 1,
                  2 * n,
                  2 * n - 1,
                  2 * n + 1
                );
            }
            return k.instance({ ga_: w, V: r });
          },
          toggle: function (p) {
            c = p;
          },
          instance: function (p) {
            var x = Y.instance({ ga_: p.ga_, V: p.V });
            return {
              W: function () {
                a && c && (D.set("s108"), x.bind(!0), x.W());
              },
            };
          },
        };
      return k;
    })();
    va.ka = (function () {
      var a = {
        df: -87,
        Vl: [85, 95],
        Gh: [90, 90],
        Fh: [85, 70],
        Vc: 24,
        Lk: 12,
        Mk: 2,
        Rf: [-80, 10],
        Eh: [40, 140],
        qd: [1, 8],
        Ul: 80,
        si: [-120, -10],
        Km: 2,
        Md: [0, -15],
        de: 1024,
        gb: 256,
        Ad: 4,
        Wn: [6, 30],
        ri: 1.2,
      };
      a.Ci = a.Rf;
      var c = !1,
        e = !1,
        d = !1,
        k = null,
        p = null,
        x = null,
        q = null,
        t = null,
        v = null,
        E = !1,
        K = !1,
        l = null,
        w = null,
        r = null,
        f = null,
        h = 0.5,
        J = [{ type: "1f", name: "u157", value: 1 }],
        B = null,
        n = null,
        m = null,
        F = null,
        O = null,
        y = {
          Ml: function () {
            return {
              name: "_",
              s: "attribute vec3 a0,a2;attribute vec2 a1;varying vec2 vv0;varying float vv1;uniform sampler2D u39;uniform vec2 u40;uniform float u134;uniform vec3 u133;const float o=0.,p=0.;const vec2 e=vec2(1.,1.);const vec3 q=vec3(1.,1.,1.);const vec2 G=vec2(-1.,1.),r=vec2(.16,.5),s=vec2(.5,.5),t=vec2(.84,.5);uniform mat4 u67;uniform vec3 u69,u73,u74,u75;uniform float u68,u76,u77,u70,u71,u72,u78;mat3 u(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u39,r);vec2 f=u76*e;vec3 c=u76*q;vec2 v=mix(d.a*u40,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u39,s).rgb+vec3(u70,0.,0.),u73,c);float w=mix(texture2D(u39,t).r,0.,u76);a.z+=w;mat3 h=u(a);vec3 x=mix(u133,u74,c);float y=mix(u134,u77,u76);vec3 b=mix(u69,u75,c);b.x+=u68*sin(a.y);float i=cos(a.z),j=sin(a.z);mat2 z=mat2(i,j,-j,i);b.xy=z*b.xy;float A=mix(u72,1.,u76);vec2 k=u71/v;vec3 l=a0;float B=max(0.,-a0.z-o)*p;l.x+=B*sign(a0.x)*(1.-u76);vec3 C=h*(l+x)*y+b;vec2 D=k*A;vec3 E=vec3(g*D,-k)+C*vec3(1.,-1.,-1.);gl_Position=u67*(vec4(u78*e,e)*vec4(E,1.)),vv0=a1,gl_Position*=vec4(-1.,1.,1.,1.);vec3 F=h*a2;vv1=-F.z;}",
              h: "uniform sampler2D u164,u150;uniform vec2 u80,u165;uniform float u166,u157;varying vec2 vv0;varying float vv1;void main(){vec2 b=u165*u166+u80*vv0;vec4 a=u157*texture2D(u164,b);a.r*=step(0.,vv0.y),gl_FragColor=vec4(0.,0.,0.,a.r*vv1);}",
              i: "u39 u164 u150 u40 u69 u166 u165 u134 u133 u80 u157"
                .split(" ")
                .concat(D.Ye())
                .concat(D.Ze()),
              H: ["a0", "a2", "a1"],
              O: [3, 3, 2],
              precision: "lowp",
            };
          },
          Ac: function () {
            D.qa("s109", {
              name: "_",
              s: "attribute vec3 a0;uniform vec3 u133;uniform vec2 u158,u159;uniform float u134,u160,u161,u162;varying float vv0,vv1;void main(){vec3 a=(a0+u133)*u134;float b=atan(a.x,a.z-u160),d=2.*(a.y-u161)/(u162-u161)-1.;vv0=a0.y;float g=1.-u158.x*u158.x/(u158.y*u158.y),c=u158.x/sqrt(1.-g*pow(cos(b),2.));vec3 h=vec3(c*sin(b),a.y,c*cos(b)+u160);vv1=smoothstep(u159.x,u159.y,length(h-a)),gl_Position=vec4(b,d,0.,1.);}",
              h: "uniform float u163;uniform vec4 u7;varying float vv0,vv1;void main(){float a=u7.x+u7.y*smoothstep(-u7.w,-u7.z,vv0),b=min(a,1.)*u163;gl_FragColor=vec4(b,vv1,1.,1.);}",
              i: "u134 u133 u158 u159 u160 u161 u162 u7 u163".split(" "),
              H: ["a0"],
              O: [3],
              precision: "highp",
            });
            D.qa("s110", y.Ml());
            D.qa("s111", {
              name: "_",
              h: "uniform sampler2D u1;uniform vec2 u8;varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0),b=texture2D(u1,vv0-3.*u8),c=texture2D(u1,vv0-2.*u8),d=texture2D(u1,vv0-u8),f=texture2D(u1,vv0+u8),g=texture2D(u1,vv0+2.*u8),h=texture2D(u1,vv0+3.*u8);float j=.031496*b.r+.110236*c.r+.220472*d.r+.275591*a.r+.220472*f.r+.110236*g.r+.031496*h.r;vec2 i=b.gb*b.b+c.gb*c.b+d.gb*d.b+a.gb*a.b+f.gb*f.b+g.gb*g.b+h.gb*h.b;i/=b.b+c.b+d.b+a.b+f.b+g.b+h.b,gl_FragColor=vec4(mix(j,a.r,1.-i.x),i,1);}",
              i: ["u1", "u8"],
              precision: "lowp",
            });
            c = !0;
          },
          m: function (g) {
            if (c) {
              if (void 0 === g.bc || !g.bc) return !1;
              if (e) y.Ui(g);
              else {
                q = X.instance({
                  isFloat: !1,
                  isPot: !1,
                  isMipmap: !1,
                  isLinear: !0,
                  width: a.de,
                  height: a.de / 4,
                  F: 4,
                });
                var G = a.gb / 4,
                  u = {
                    isFloat: !1,
                    isPot: !1,
                    isMipmap: !1,
                    isLinear: !1,
                    width: a.gb,
                    height: G,
                    F: 4,
                  };
                x = X.instance(u);
                v = X.instance(u);
                t = X.instance({
                  isFloat: !1,
                  isPot: !1,
                  isMipmap: !1,
                  isLinear: !0,
                  width: a.gb,
                  height: G * a.Ad,
                  F: 4,
                });
                G = 0.5 - 0.5 / g.cc[1];
                u = 0.5 + 0.5 / g.cc[1];
                for (
                  var L = a.Lk + 1,
                    H = [],
                    P = [],
                    U = new Float32Array(16 * a.Vc),
                    Z = new Uint16Array(6 * (a.Vc - 1)),
                    T = 0,
                    A = 0,
                    N = 0,
                    z = 0;
                  z < a.Vc;
                  ++z
                ) {
                  var C = (2 * z) / (a.Vc - 1) - 1;
                  C = Math.sign(C) * Math.pow(Math.abs(C), a.Mk);
                  C = (Math.PI * (C + 1)) / 2 - Math.PI / 2;
                  var Q = Math.sin(C),
                    ea = Math.cos(C),
                    ha = Math.sin(C * a.ri),
                    ia = Math.cos(C * a.ri),
                    sa = C / (Math.PI * g.cc[0]) + 0.5,
                    Wa = a.Fh[0] * Q,
                    Ja = a.Ci[0],
                    na = a.Fh[1] * ea + a.df,
                    ka = sa,
                    Ga = G,
                    W = a.Gh[0] * Q,
                    fa = a.Ci[1],
                    ta = a.Gh[1] * ea + a.df,
                    Ma = u,
                    pa = 16 * z;
                  U[pa] = W;
                  U[pa + 1] = fa;
                  U[pa + 2] = ta;
                  U[pa + 3] = ha;
                  U[pa + 4] = 0;
                  U[pa + 5] = ia;
                  U[pa + 6] = sa;
                  U[pa + 7] = Ma;
                  U[pa + 8] = Wa;
                  U[pa + 9] = Ja;
                  U[pa + 10] = na;
                  U[pa + 11] = ha;
                  U[pa + 12] = 0;
                  U[pa + 13] = ia;
                  U[pa + 14] = ka;
                  U[pa + 15] = Ga;
                  0 !== z &&
                    ((ka = 2 * z),
                    (Ga = 6 * (z - 1)),
                    (Z[Ga] = ka),
                    (Z[Ga + 1] = ka - 1),
                    (Z[Ga + 2] = ka - 2),
                    (Z[Ga + 3] = ka),
                    (Z[Ga + 4] = ka + 1),
                    (Z[Ga + 5] = ka - 1));
                  Ga = Math.pow(
                    0.5 *
                      (1 +
                        Math.cos(
                          Math.min(
                            Math.max((Math.PI / a.Eh[0]) * Wa, -Math.PI),
                            Math.PI
                          )
                        )),
                    a.Km
                  );
                  Ja -= a.Ul * Ga;
                  ka = a.Eh[1] * Ga;
                  Wa -= Q * a.qd[0];
                  na -= ea * a.qd[1];
                  W -= Q * a.qd[0];
                  ta -= ea * a.qd[1];
                  Q = 0.001 > Ga ? 2 : L;
                  for (ea = 0; ea < Q; ++ea)
                    (Ga = ea / (Q - 1)),
                      (sa = Ja * (1 - Ga) + fa * Ga),
                      (Ma = a.si[0]),
                      (Ma = Math.min(
                        Math.max((sa - Ma) / (a.si[1] - Ma), 0),
                        1
                      )),
                      (Ma = Ma * Ma * (3 - 2 * Ma)),
                      H.push(
                        Wa * (1 - Ga) + W * Ga,
                        sa,
                        (na +
                          ka * Math.exp(400 * -Math.abs(C) * Math.pow(Ga, 4))) *
                          (1 - Ma) +
                          ta * Ma,
                        ha,
                        0,
                        ia,
                        0,
                        0
                      );
                  C = 0 === z ? 0 : 2 < Q && 2 < A ? Q - 1 : 1;
                  for (ha = 1; ha <= C; ++ha)
                    (ia = Q > A ? Q - 2 : 0),
                      P.push(
                        T + ha + ia,
                        T + ha - 1,
                        N + ha - 1,
                        N + ha - 1,
                        N + ha + (Q < A ? A - 2 : 0),
                        T + ha + ia
                      );
                  A = Q;
                  N = T;
                  T += Q;
                }
                F = Y.instance({
                  ga_: new Float32Array(H),
                  V: new Uint16Array(P),
                });
                O = Y.instance({ ga_: U, V: Z });
                y.Ui(g);
                D.j("s111", [{ type: "1i", name: "u1", value: 0 }]);
                e = !0;
              }
            }
          },
          Ui: function (g) {
            h = g.Rn;
            f = g.Nd;
            B = [
              { type: "1i", name: "u39", value: 1 },
              { type: "1i", name: "u164", value: 0 },
              { type: "1i", name: "u150", value: 2 },
              {
                type: "3f",
                name: "u69",
                value: [g.Fa[0], g.Fa[1] - a.Md[0], g.Fa[2] + a.Md[1]],
              },
              { type: "1f", name: "u166", value: g.Sn },
              { type: "2f", name: "u80", value: [1, 1 / a.Ad] },
              { type: "2f", name: "u165", value: [0, 1 / a.Ad] },
              { type: "1f", name: "u157", value: 1 },
            ].concat(g.vg, g.sj);
            D.j("s110", B);
          },
          Zb: function (g) {
            k = g;
          },
          Yb: function (g) {
            n = g;
            n.Ib(y.qc);
          },
          $h: function () {
            return d && null !== n && null !== m;
          },
          qc: function () {
            if (!(d || (K && E)) || null === n || null === m) return !1;
            b.viewport(0, 0, a.de, a.de / 4);
            za.ma();
            q.o();
            b.clearColor(0, 0, 0, 0);
            b.clear(b.COLOR_BUFFER_BIT);
            D.j("s109", [
              { type: "1f", name: "u160", value: a.df },
              { type: "1f", name: "u161", value: a.Rf[0] },
              { type: "1f", name: "u162", value: a.Rf[1] },
              {
                type: "3f",
                name: "u133",
                value: [l[0] + w[0], l[1] + w[1], l[2] + w[2]],
              },
              { type: "1f", name: "u163", value: h },
              { type: "2f", name: "u158", value: a.Vl },
              { type: "2f", name: "u159", value: a.Wn },
            ]);
            n.hl();
            D.set("s1");
            var g = a.gb / 4;
            b.viewport(0, 0, a.gb, g);
            x.o();
            q.g(0);
            q.gd();
            Y.l(!0, !0);
            for (var G = 0; G < a.Ad; ++G)
              D.set("s111"),
                0 !== G && b.viewport(0, 0, a.gb, g),
                v.o(),
                x.g(0),
                D.M("u8", 1 / a.gb, 0),
                Y.l(!1, !1),
                x.o(),
                v.g(0),
                D.M("u8", 0, 1 / g),
                Y.l(!1, !1),
                a.Nk && b.colorMask(0 === G, 1 === G, 2 === G, !0),
                D.set("s1"),
                t.o(),
                x.g(0),
                b.viewport(0, G * g, a.gb, g),
                Y.l(!1, !1),
                a.Nk && b.colorMask(!0, !0, !0, !0);
            return (d = !0);
          },
          W: function () {
            y.$h() &&
              (m.bind(!1, !1),
              p.o(),
              b.clearColor(0, 0, 0, 0),
              b.enable(b.DEPTH_TEST),
              b.depthMask(!0),
              b.clear(b.COLOR_BUFFER_BIT | b.DEPTH_BUFFER_BIT),
              D.set("s110"),
              k.g(1),
              t.g(0),
              F.bind(!0),
              F.W(),
              O.bind(!0),
              O.W(),
              b.disable(b.DEPTH_TEST),
              b.depthMask(!1));
          },
          add: function () {
            y.$h() &&
              (b.enable(b.BLEND),
              b.blendFunc(b.ONE, b.ONE_MINUS_SRC_ALPHA),
              p.g(0),
              Y.l(!1, !1),
              b.disable(b.BLEND));
          },
          Yf: function (g, G) {
            m = za.instance({ width: g, height: G, tc: !0 });
            p = X.instance({ width: g, height: G, isFloat: !1, isPot: !1 });
            y.qc();
          },
          ab: function (g, G, u) {
            g || ((g = l), (G = w), (u = r));
            D.j("s110", [
              {
                type: "3f",
                name: "u133",
                value: [
                  u[0] + f[0],
                  u[1] + f[1] - a.Md[0],
                  u[2] + f[2] + a.Md[1],
                ],
              },
            ]);
            l = g;
            w = G;
            r = u;
            K = !0;
            !d && E && y.qc();
            D.I();
          },
          bb: function (g, G) {
            D.j("s109", [{ type: "1f", name: "u134", value: g }]);
            D.j("s110", [{ type: "1f", name: "u134", value: G }]);
            E = !0;
            !d && K && y.qc();
            D.I();
          },
          bg: function (g) {
            D.j("s110", [{ type: "1f", name: "u70", value: g }]);
            D.I();
          },
          yb: function (g) {
            g && (n = g);
            y.qc();
          },
          cg: function (g, G) {
            J[0].value = 1 - g;
            D.j("s110", J);
            D.j("s110", G);
          },
          K: function () {},
          v: function () {
            d = e = c = !1;
            v = t = q = x = p = k = null;
          },
        };
      return y;
    })();
    va.sa = (function () {
      var a = !1,
        c = null,
        e = 0,
        d = 0,
        k = 0,
        p = [{ type: "1f", name: "u157", value: 1 }],
        x = null,
        q = null,
        t = null,
        v = {
          Ac: function () {
            D.qa("s112", {
              name: "_",
              s: "attribute vec3 a0;uniform vec2 u167,u168;varying vec2 vv0;void main(){vec2 a=2.*(a0.xy-u168)/u167;gl_Position=vec4(a,0.,1.),vv0=a0.xy;}",
              h: "uniform vec2 u169;uniform float u170,u171,u172;varying vec2 vv0;void main(){vec2 b=vec2(sign(vv0.x)*.5*u170,u171),a=vv0-b,c=u172*a,d=(c-a)*u169;gl_FragColor=vec4(d,0.,1.);}",
              i: "u167 u168 u170 u171 u172 u169".split(" "),
              H: ["a0"],
              O: [3],
              precision: "highp",
            });
            D.qa("s113", {
              name: "_",
              s: "attribute vec3 a0;varying vec2 vv0,vv1;uniform sampler2D u39;uniform vec3 u133;uniform vec2 u40,u167,u168;uniform float u134;const float n=0.,o=0.;const vec2 e=vec2(1.,1.);const vec3 p=vec3(1.,1.,1.);const vec2 F=vec2(-1.,1.),q=vec2(.16,.5),r=vec2(.5,.5),s=vec2(.84,.5);uniform mat4 u67;uniform vec3 u69,u73,u74,u75;uniform float u68,u76,u77,u70,u71,u72,u78;mat3 t(vec3 c){vec3 b=cos(c),a=sin(c);return mat3(b.y*b.z,b.y*a.z,a.y,-a.x*a.y*b.z+b.x*a.z,-a.x*a.y*a.z-b.x*b.z,a.x*b.y,b.x*a.y*b.z+a.x*a.z,b.x*a.y*a.z-a.x*b.z,-b.x*b.y);}void main(){vec4 d=texture2D(u39,q);vec2 f=u76*e;vec3 c=u76*p;vec2 u=mix(d.a*u40,e,f),g=(2.*d.gb-e)*(1.-f);g.x*=-1.;vec3 a=mix(texture2D(u39,r).rgb+vec3(u70,0.,0.),u73,c);float v=mix(texture2D(u39,s).r,0.,u76);a.z+=v;mat3 w=t(a);vec3 x=mix(u133,u74,c);float y=mix(u134,u77,u76);vec3 b=mix(u69,u75,c);b.x+=u68*sin(a.y);float h=cos(a.z),i=sin(a.z);mat2 z=mat2(h,i,-i,h);b.xy=z*b.xy;float A=mix(u72,1.,u76);vec2 j=u71/u;vec3 k=a0;float B=max(0.,-a0.z-n)*o;k.x+=B*sign(a0.x)*(1.-u76);vec3 C=w*(k+x)*y+b;vec2 D=j*A;vec3 E=vec3(g*D,-j)+C*vec3(1.,-1.,-1.);gl_Position=u67*(vec4(u78*e,e)*vec4(E,1.)),gl_Position*=vec4(-1.,1.,1.,1.),vv0=vec2(.5,.5)+(a0.xy-u168)/u167,vv1=vec2(.5,.5)+.5*gl_Position.xy/gl_Position.w;}",
              h: "uniform sampler2D u173,u174;uniform float u157;varying vec2 vv0,vv1;void main(){vec2 a=u157*texture2D(u173,vv0).rg;gl_FragColor=texture2D(u174,a+vv1);}",
              i: "u157 u39 u173 u174 u167 u168 u40 u69 u134 u133"
                .split(" ")
                .concat(D.Ye(), D.Ze()),
              H: ["a0"],
              O: [3],
              precision: "lowp",
            });
            a = !0;
          },
          m: function (E) {
            if (a) {
              if (void 0 === E.bc || !E.Wc) return !1;
              q = X.instance({
                isFloat: !0,
                isPot: !1,
                isMipmap: !1,
                isLinear: !1,
                width: 256,
                height: 128,
                F: 4,
              });
              t = za.instance({ width: 256, height: 128 });
              D.j(
                "s113",
                [
                  { type: "1i", name: "u39", value: 1 },
                  { type: "1i", name: "u173", value: 2 },
                  { type: "1i", name: "u174", value: 0 },
                  { type: "3f", name: "u69", value: E.Fa },
                  { type: "1f", name: "u157", value: 1 },
                ].concat(E.sj, E.vg)
              );
              d = E.Ge;
              k = E.Fe;
              e = E.He;
            }
          },
          Zb: function (E) {
            c = E;
          },
          Yb: function (E) {
            x = E;
            x.Ib(v.Ce);
          },
          Ce: function () {
            b.viewport(0, 0, 256, 128);
            t.o();
            q.o();
            var E = x.Nl(),
              K = x.Ol(),
              l = [
                { type: "2f", name: "u167", value: [E, K] },
                { type: "2f", name: "u168", value: [x.sl(), x.tl()] },
              ];
            D.j(
              "s112",
              l.concat([
                { type: "1f", name: "u170", value: d },
                { type: "1f", name: "u171", value: k },
                { type: "1f", name: "u172", value: e },
                { type: "2f", name: "u169", value: [1 / E, -1 / K] },
              ])
            );
            x.bh();
            D.j("s113", l);
          },
          W: function () {
            D.set("s113");
            c.g(1);
            q.g(2);
            x.bh();
          },
          ab: function (E) {
            D.j("s113", [{ type: "3f", name: "u133", value: E }]);
            D.I();
          },
          bb: function (E) {
            D.j("s113", [{ type: "1f", name: "u134", value: E }]);
            D.I();
          },
          bg: function (E) {
            D.j("s113", [{ type: "1f", name: "u70", value: E }]);
            D.I();
          },
          Qn: function (E) {
            e = E;
            v.Ce();
            D.I();
            ua.animate(Date.now());
          },
          yb: function (E) {
            E && (x = E);
            v.Ce();
          },
          cg: function (E, K) {
            p.u157 = 1 - E;
            D.j("s113", p);
            D.j("s113", K);
          },
          K: function () {},
        };
      return v;
    })();
    va.ic = (function () {
      var a = [0, -0.5],
        c = !1,
        e = !1,
        d = null,
        k = null,
        p = null,
        x = null,
        q = null,
        t = -1,
        v = -1;
      return {
        Ac: function () {
          D.qa("s114", {
            name: "_",
            s: "attribute vec2 a0;uniform sampler2D u39;uniform vec2 u40,u5;uniform float u4;varying vec2 vv0;const vec2 f=vec2(1.,1.);void main(){vec4 a=texture2D(u39,vec2(.25,.5));vec2 b=a.a*u40,c=2.*a.gb-f,d=u5+a0*u4;gl_Position=vec4(c+b*d,0.,1.),vv0=vec2(.5,.5)+.5*a0;}",
            h: "uniform sampler2D u175;varying vec2 vv0;void main(){gl_FragColor=texture2D(u175,vv0);}",
            i: ["u39", "u175", "u40", "u5", "u4"],
            precision: "lowp",
          });
          D.qa("s115", {
            name: "_",
            h: "uniform sampler2D u2,u176,u177;varying vec2 vv0;const vec3 f=vec3(1.,1.,1.);void main(){float a=texture2D(u2,vv0).r;vec3 b=texture2D(u177,vv0).rgb,c=texture2D(u176,vv0).rgb;gl_FragColor=vec4(mix(b,c,a*f),1.);}",
            i: ["u2", "u177", "u176"],
            precision: "lowp",
          });
          c = !0;
        },
        m: function (E) {
          c &&
            ((q = X.instance({
              isFloat: !1,
              isPot: !0,
              url: E.te,
              P: function () {
                e = !0;
              },
            })),
            D.j("s114", [
              { type: "1i", name: "u39", value: 1 },
              { type: "1i", name: "u175", value: 0 },
              { type: "2f", name: "u40", value: E.Cj },
              { type: "2f", name: "u5", value: a },
              { type: "1f", name: "u4", value: 3.8 },
            ]),
            D.j("s115", [
              { type: "1i", name: "u176", value: 0 },
              { type: "1i", name: "u2", value: 1 },
              { type: "1i", name: "u177", value: 2 },
            ]));
        },
        Zb: function (E) {
          k = E;
        },
        Yf: function (E, K) {
          var l = {
            isFloat: !1,
            isPot: !1,
            isMipmap: !1,
            isLinear: !1,
            width: E,
            height: K,
            F: 4,
          };
          t = 2 / E;
          v = 2 / K;
          p = X.instance(l);
          x = X.instance(l);
          d = za.instance({ width: E, height: K });
        },
        W: function (E, K) {
          if (e) {
            d.bind(!1, !0);
            D.set("s77");
            for (var l = 0; 2 > l; ++l) {
              D.M("u8", t, 0);
              p.o();
              0 !== l && x.g(0);
              var w = 0 === l && !S.ca;
              Y.l(w, w);
              D.M("u8", 0, v);
              x.o();
              p.g(0);
              Y.l(!1, !1);
            }
            D.set("s114");
            k.g(1);
            q.g(0);
            p.o();
            b.clearColor(1, 0, 0, 1);
            b.clear(b.COLOR_BUFFER_BIT);
            Y.l(!1, !1);
            D.set("s115");
            K.o();
            x.g(0);
            p.g(1);
            E.g(2);
            Y.l(!1, !1);
          }
        },
        K: function () {},
      };
    })();
    var zc = (function () {
      var a = {
        instance: function (c) {
          var e = c.mi,
            d = c.li,
            k = c.Ee,
            p = c.background ? c.background : X.Bh(),
            x = c.Ya,
            q = { scale: 1, offsetX: 0, offsetY: 0 },
            t = null;
          c.Ef && ((q.scale = c.Ef.scale), (q.offsetY = c.Ef.offsetY));
          return {
            xh: function () {
              return x;
            },
            rh: function () {
              return p;
            },
            set: function () {
              t = db.El();
              db.Zi(q);
              db.Wd();
              db.Xd();
              ua.Ti(k, p, !1, !1);
            },
            I: function () {
              db.Zi(t);
            },
            Cc: function () {
              return {
                modelURL: e,
                materialsURLs: d,
                background: p.Cc(!1),
                Ee: k.Cc(!1),
                Ya: x.Cc(!0),
              };
            },
            No: function (v) {
              p.g(v);
            },
          };
        },
        Jc: function (c, e, d) {
          function k() {
            if (3 === ++t && e) {
              var v = a.instance({
                mi: c.modelURL,
                li: c.materialsURLs,
                background: p,
                Ee: x,
                Ya: q,
              });
              e(v);
            }
          }
          var p = null,
            x = null,
            q = null,
            t = 0;
          X.Jc(c.background, function (v) {
            !v && d ? d() : ((p = v), k());
          });
          X.Jc(c.dataState, function (v) {
            !v && d ? d() : ((x = v), k());
          });
          X.Jc(c.light, function (v) {
            !v && d ? d() : ((q = v), k());
          });
        },
      };
      return a;
    })();
    return Ua || window.JEELIZVTO;
  })();
  (function (V, ya) {
    "function" === typeof define && define.amd
      ? define(ya)
      : "object" === typeof exports
      ? (module.exports = ya())
      : (V.ResizeSensor = ya());
  })("undefined" !== typeof window ? window : this, function () {
    function V(La, ib) {
      var Xa = Object.prototype.toString.call(La),
        Ab = 0,
        Ea = La.length;
      if (
        "[object Array]" === Xa ||
        "[object NodeList]" === Xa ||
        "[object HTMLCollection]" === Xa ||
        "[object Object]" === Xa ||
        ("undefined" !== typeof jQuery && La instanceof jQuery) ||
        ("undefined" !== typeof Elements && La instanceof Elements)
      )
        for (; Ab < Ea; Ab++) ib(La[Ab]);
      else ib(La);
    }
    if ("undefined" === typeof window) return null;
    var ya =
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function (La) {
          return window.setTimeout(La, 20);
        },
      Pa = function (La, ib) {
        function Xa() {
          var Ea = [];
          this.add = function (nb) {
            Ea.push(nb);
          };
          var Za, qb;
          this.call = function () {
            Za = 0;
            for (qb = Ea.length; Za < qb; Za++) Ea[Za].call();
          };
          this.remove = function (nb) {
            var xb = [];
            Za = 0;
            for (qb = Ea.length; Za < qb; Za++)
              Ea[Za] !== nb && xb.push(Ea[Za]);
            Ea = xb;
          };
          this.length = function () {
            return Ea.length;
          };
        }
        function Ab(Ea, Za) {
          if (Ea)
            if (Ea.resizedAttached) Ea.resizedAttached.add(Za);
            else {
              Ea.resizedAttached = new Xa();
              Ea.resizedAttached.add(Za);
              Ea.resizeSensor = document.createElement("div");
              Ea.resizeSensor.className = "resize-sensor";
              Ea.resizeSensor.style.cssText =
                "position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;";
              Ea.resizeSensor.innerHTML =
                '<div class="resize-sensor-expand" style="position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;"><div style="position: absolute; left: 0; top: 0; transition: 0s;"></div></div><div class="resize-sensor-shrink" style="position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;"><div style="position: absolute; left: 0; top: 0; transition: 0s; width: 200%; height: 200%"></div></div>';
              Ea.appendChild(Ea.resizeSensor);
              Ea.resizeSensor.offsetParent !== Ea &&
                (Ea.style.position = "relative");
              var qb = Ea.resizeSensor.childNodes[0],
                nb = qb.childNodes[0],
                xb = Ea.resizeSensor.childNodes[1],
                bc,
                Gb,
                Hb,
                Ib,
                Tb = Ea.offsetWidth,
                cc = Ea.offsetHeight,
                dc = function () {
                  nb.style.width = "100000px";
                  nb.style.height = "100000px";
                  qb.scrollLeft = 1e5;
                  qb.scrollTop = 1e5;
                  xb.scrollLeft = 1e5;
                  xb.scrollTop = 1e5;
                };
              dc();
              var Jb = function () {
                Gb = 0;
                bc &&
                  ((Tb = Hb),
                  (cc = Ib),
                  Ea.resizedAttached && Ea.resizedAttached.call());
              };
              Za = function () {
                Hb = Ea.offsetWidth;
                Ib = Ea.offsetHeight;
                (bc = Hb != Tb || Ib != cc) && !Gb && (Gb = ya(Jb));
                dc();
              };
              var ec = function (Kb, Ub, fc) {
                Kb.attachEvent
                  ? Kb.attachEvent("on" + Ub, fc)
                  : Kb.addEventListener(Ub, fc);
              };
              ec(qb, "scroll", Za);
              ec(xb, "scroll", Za);
            }
        }
        V(La, function (Ea) {
          Ab(Ea, ib);
        });
        this.detach = function (Ea) {
          Pa.detach(La, Ea);
        };
      };
    Pa.detach = function (La, ib) {
      V(La, function (Xa) {
        if (Xa) {
          if (
            Xa.resizedAttached &&
            "function" == typeof ib &&
            (Xa.resizedAttached.remove(ib), Xa.resizedAttached.length())
          )
            return;
          Xa.resizeSensor &&
            (Xa.contains(Xa.resizeSensor) && Xa.removeChild(Xa.resizeSensor),
            delete Xa.resizeSensor,
            delete Xa.resizedAttached);
        }
      });
    };
    return Pa;
  });
  var ac = {
      glassesDBURL: "https://glassesdbcached.jeeliz.com/sku/",
      appstaticURL: "https://appstatic.jeeliz.com/",
    },
    jb = { notLoaded: -1, init: 0, realtime: 2, loadingModel: 3, paused: 4 },
    Sa = { isRT: !0, sku: void 0, mode: jb.notLoaded },
    mc = -1,
    nc = -1,
    Yb = -1,
    Zb = -1,
    Jc = {
      cv: null,
      container: null,
      adjust: null,
      adjustNotice: null,
      adjustExit: null,
      loading: null,
      trackIframe: null,
    },
    ra = Object.assign({}, Jc),
    ed = {
      ADJUST_START: null,
      ADJUST_END: null,
      LOADING_START: null,
      LOADING_END: null,
    },
    vc = null,
    Fb = { enabled: !1, callback: null, interval: 1e3 },
    lc = { error: !1 },
    Xb = null,
    Sb = null,
    pb = {
      start: function (V) {
        console.log("INFO in JeelizVTOWidget.js: start()");
        if (Sa.mode !== jb.notLoaded) pb.resume();
        else {
          qa();
          if (V.settings) for (var ya in V.settings) ac[ya] = V.settings[ya];
          V.NNCPath && Ua.set_NNCPath(V.NNCPath);
          V.faceDetectionCallback &&
            ((Fb.enabled = !0),
            (Fb.callback = V.faceDetectionCallback),
            (Fb.interval =
              "undefined" === typeof V.faceDetectionInterval
                ? 1e3
                : V.faceDetectionInterval));
          vc = Object.assign({}, ed, V.callbacks || {});
          ra.container =
            V.placeHolder || document.getElementById("JeelizVTOWidget");
          if (!ra.container)
            throw Error(
              "Cannot find a <div> element with id=JeelizVTOWidget to append the VTO widget."
            );
          ra.cv = V.canvas || document.getElementById("JeelizVTOWidgetCanvas");
          ra.cv ||
            ((ra.cv = document.createElement("canvas")),
            ra.container.appendChild(ra.cv));
          ra.loading = document.getElementById("JeelizVTOWidgetLoading");
          V.onError && (lc.error = V.onError);
          Rb();
          if (!wb(ra.container)) return hb("PLACEHOLDER_NULL_WIDTH"), !1;
          if (!la(ra.container)) return hb("PLACEHOLDER_NULL_HEIGHT"), !1;
          Bb();
          new ResizeSensor(ra.container, function (Pa) {
            Bb();
          });
          (V.searchImageMask ||
            V.searchImageColor ||
            V.searchImageRotationSpeed) &&
            Ua.set_loading(
              V.searchImageMask,
              V.searchImageColor,
              V.searchImageRotationSpeed
            );
          V.callbackReady && (Sb = V.callbackReady);
          Sa.mode = jb.init;
          ya =
            "undefined" === typeof V.assetsPath
              ? ac.appstaticURL + "jeefit/"
              : V.assetsPath;
          "undefined" !== typeof V.catalog && (Xb = V.catalog);
          if (V.onWebcamGet) Ua.onWebcamGet(V.onWebcamGet);
          Ua.init(ya, ma, Oa, ra.cv);
          Ua.onHalfLoad(pb.load.bind(pb, V.sku ? V.sku : null));
          return !0;
        }
      },
      destroy: function () {
        return Ua.destroy().then(function () {
          Sa.mode = jb.notLoaded;
          Sa.sku = void 0;
          Sb = Xb = null;
          Object.assign(ra, Jc);
        });
      },
      pause: function (V) {
        if (!Sa.isRT) return Promise.reject();
        Sa.mode = jb.paused;
        var ya = Ua.switch_sleep(!0, V);
        return V ? ya : Promise.resolve(ya);
      },
      resume: function (V) {
        if (!Sa.isRT) return Promise.reject();
        Sa.mode = jb.realtime;
        var ya = Ua.switch_sleep(!1, V);
        return V ? ya : Promise.resolve(ya);
      },
      set_videoRotation: function (V) {
        Sa.isRT && Ua.set_videoRotation(V);
      },
      set_videoSizes: function (V, ya, Pa, La, ib, Xa) {
        Sa.isRT && Ua.set_videoSizes(V, ya, Pa, La, ib, Xa);
      },
      resize: function () {
        Bb();
      },
      set_scale: function (V) {
        Ua.set_scale(V);
      },
      capture_image: function (V, ya, Pa) {
        Ua && Ua.ready ? Ua.capture_image(V, ya, Pa, !1) : ya(!1);
      },
      toggle_loading: function (V) {
        V
          ? (Ba(ra.loading), $b("LOADING_START"))
          : (Na(ra.loading), $b("LOADING_END"));
      },
      load_modelStandalone: function (V, ya) {
        if (!Sa.isRT)
          throw Error("Loading standalone models is only available in RT mode");
        Sa.mode === jb.paused && pb.resume();
        Sa.mode = jb.loadingModel;
        var Pa = "undef";
        "string" === typeof V
          ? ((Pa = V),
            Da(V)
              .then(function (La) {
                Ua.set_modelStandalone(La, ya, Pa);
              })
              .catch(Ya))
          : ((Pa = "RANDOM_SKU_" + Date.now().toString()),
            Ua.set_modelStandalone(V, ya, Pa));
        Sa.sku = Pa;
      },
      load: function (V, ya) {
        pb.toggle_loading(!0);
        Sa.isRT && pb.load_RT(V, ya);
      },
      load_RT: function (V, ya) {
        V === Sa.sku
          ? pb.toggle_loading(!1)
          : ((Sa.sku = V),
            (Sa.mode = jb.loadingModel),
            Sa.mode === jb.paused && pb.resume(),
            V
              ? Xb && Xb[V]
                ? Eb(V, Xb[V], ya)
                : Da(ac.glassesDBURL + V)
                    .then(function (Pa) {
                      if (Pa.error) return Ya();
                      Eb(V, Pa.intrinsic, ya);
                    })
                    .catch(Ya)
              : ((Sa.mode = jb.realtime),
                pb.toggle_loading(!1),
                Ua.start_rendering(),
                ya && ya()));
      },
      enter_adjustMode: mb,
      exit_adjustMode: sb,
    };
  return pb;
})();
window.JEELIZVTO = JEELIZVTO;
window.JEELIZVTOWIDGET = {
  VERSION: "2.1.1",
  start: JeelizVTOWidget.start,
  pause: JeelizVTOWidget.pause,
  resume: JeelizVTOWidget.resume,
  load: JeelizVTOWidget.load,
  load_modelStandalone: JeelizVTOWidget.load_modelStandalone,
  capture_image: JeelizVTOWidget.capture_image,
  set_videoRotation: JeelizVTOWidget.set_videoRotation,
  resize: JeelizVTOWidget.resize,
  set_scale: JeelizVTOWidget.set_scale,
  set_videoSizes: JeelizVTOWidget.set_videoSizes,
  destroy: JeelizVTOWidget.destroy,
  enter_adjustMode: JeelizVTOWidget.enter_adjustMode,
  exit_adjustMode: JeelizVTOWidget.exit_adjustMode,
};
