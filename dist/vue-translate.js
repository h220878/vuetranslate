/**
 * VueTranslate plugin v1.2.1
 *
 * Handle basic translations in VueJS
 *
 * This is a plugin to handle basic translations for a component in VueJS. * @author Javis Perez <javisperez@gmail.com>
 * https://github.com/javisperez/vuetranslate
 * Released under the MIT License.
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (factory());
}(this, (function () { 'use strict';

// We need a vue instance to handle reactivity
var vm = null;

// The plugin
var VueTranslate = {

    // Install the method
    install: function (Vue) {
        var _Vue$mixin;

        var version = Vue.version[0];

        if (!vm) {
            vm = new Vue({
                data: function () {
                    return {
                        current: '',
                        locales: {}
                    };
                },


                computed: {
                    // Current selected language
                    lang: function () {
                        return this.current;
                    },


                    // Current locale values
                    locale: function () {
                        if (!this.locales[this.current]) return null;

                        return this.locales[this.current];
                    }
                },

                methods: {
                    // Set a language as current
                    setLang: function (val) {
                        if (this.current !== val) {
                            if (this.current === '') {
                                this.$emit('language:init', val);
                            } else {
                                this.$emit('language:changed', val);
                            }
                        }

                        this.current = val;

                        this.$emit('language:modified', val);
                    },


                    // Set a locale tu use
                    setLocales: function (locales) {
                        if (!locales) return;

                        var newLocale = Object.create(this.locales);

                        for (var key in locales) {
                            if (!newLocale[key]) newLocale[key] = {};

                            Vue.util.extend(newLocale[key], locales[key]);
                        }

                        this.locales = Object.create(newLocale);

                        this.$emit('locales:loaded', locales);
                    },
                    text: function (t) {
                        if (!this.locale || !this.locale[t]) {
                            return t;
                        }

                        return this.locale[t];
                    },
                    nano: function (template, data) {
                        return template.replace(/\{([\w\.]*)\}/g, function (str, key) {
                            var keys = key.split("."),
                                v = data[keys.shift()];
                            for (var i = 0, l = keys.length; i < l; i++) {
                                v = v[keys[i]];
                            }return typeof v !== "undefined" && v !== null ? v : "";
                        });
                    }
                }
            });

            Vue.prototype.$translate = vm;
        }

        // Mixin to read locales and add the translation method and directive
        Vue.mixin((_Vue$mixin = {}, _Vue$mixin[version === '1' ? 'init' : 'beforeCreate'] = function () {
            this.$translate.setLocales(this.$options.locales);
        }, _Vue$mixin.methods = {
            // An alias for the .$translate.text method
            t: function (t, data) {
                return this.$translate.nano(this.$translate.text(t), data);
            }
        }, _Vue$mixin.directives = {
            translate: function (el) {
                if (!el.$translateKey) el.$translateKey = el.innerText;

                var text = this.$translate.text(el.$translateKey);

                el.innerText = text;
            }.bind(vm)
        }, _Vue$mixin));

        // Global method for loading locales
        Vue.locales = function (locales) {
            vm.$translate.setLocales(locales);
        };
    }
};

if (typeof exports === 'object') {
    module.exports = VueTranslate; // CommonJS
} else if (typeof define === 'function' && define.amd) {
    define([], function () {
        return VueTranslate;
    }); // AMD
} else if (window.Vue) {
    window.VueTranslate = VueTranslate; // Browser (not required options)
    Vue.use(VueTranslate);
}

})));
